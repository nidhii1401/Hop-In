import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../db.js"; 
import { sendMail } from "../utils/Brevoemail.js"; 

// --- HELPER FUNCTIONS ---

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendTokenResponse = (user, statusCode, res) => {
  // Create ONE token valid for 24 hours
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const options = {
    httpOnly: true, // Prevents XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };

  res.cookie("token", token, options);

  res.status(statusCode).json({
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatarUrl,
    },
    // We send the token here too, just in case you want to use localStorage as backup
    token: token 
  });
};

// --- CONTROLLERS ---

// 1. SIGNUP
export const SignUp = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, avatarUrl } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  // Prevent Admin signup via API
  if (!["HOSTELLER", "OWNER","ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, phone ? { phone } : null].filter(Boolean) },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  
  // Default Avatar Logic
  const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName.replace(/\s+/g, '')}`;

  await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash: hashedPassword,
      role,
      avatarUrl: finalAvatar,
      isVerified: false,
      otp: otpHash,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    },
  });

  // Send OTP
  try {
    await sendMail(email, "Verify Account", `<p>Your code is: <b>${otp}</b></p>`);
  } catch (error) {
    console.error("Email failed", error);
    // Proceed anyway, user can resend later
  }

  res.status(201).json({
    success: true,
    message: "Signup successful. Verify your email.",
    email,
  });
});

// 2. VERIFY OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) {
    return res.status(200).json({ success: true, message: "Already verified" });
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: null, otpExpiry: null },
  });

  sendTokenResponse(user, 200, res);
});

// 3. LOGIN
export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Fill all fields" });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    const otp = generateOTP();
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: await bcrypt.hash(otp, 10), otpExpiry: new Date(Date.now() + 10 * 60 * 1000) },
    });
    
    try {
        await sendMail(email, "Verify Account", `<p>Your code is: <b>${otp}</b></p>`);
    } catch(e) { console.log(e) }

    return res.status(403).json({
      success: false,
      message: "Not verified. New OTP sent.",
      requiresVerification: true,
      email: user.email,
    });
  }

  sendTokenResponse(user, 200, res);
});

// 4. CHECK AUTH (For App Reload)
export const checkAuth = asyncHandler(async (req, res) => {
    // If the middleware 'verifyToken' passed, req.user is already set!
    // We just need to fetch the latest user details.
    
    // Note: You must protect this route with 'verifyToken' middleware in routes
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
        success: true,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatarUrl,
        }
    });
});

// 5. LOGOUT
export const Logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

// 6. UPDATE PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
  const { 
    fullName, 
    email, 
    phone, 
    currentPassword, 
    newPassword, 
    avatarUrl,
    // Hosteller Specific Fields
    collegeName, 
    course, 
    branch, 
    yearOfStudy, 
    bio 
  } = req.body;
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    include: {
      hostellerProfile: true
    }
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  // 1. Prepare Base Update Data
  const updateData = {
    fullName: fullName || user.fullName,
    email: email || user.email,
    phone: phone || user.phone,
  };

  // 2. Handle Avatar Update
  // Case A: User uploaded a file (via Cloudinary middleware)
  if (req.file) {
    updateData.avatarUrl = req.file.path;
  } 
  // Case B: User sent a new Dicebear URL string
  else if (avatarUrl) {
    updateData.avatarUrl = avatarUrl;
  }

  // 3. Handle Password Change
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  // 4. Handle Hosteller Profile Update (if user is HOSTELLER)
  let hostellerProfileUpdate = {};
  if (user.role === 'HOSTELLER') {
    if (collegeName !== undefined) hostellerProfileUpdate.collegeName = collegeName;
    if (course !== undefined) hostellerProfileUpdate.course = course;
    if (branch !== undefined) hostellerProfileUpdate.branch = branch;
    if (yearOfStudy !== undefined) hostellerProfileUpdate.yearOfStudy = yearOfStudy;
    if (bio !== undefined) hostellerProfileUpdate.bio = bio;
  }

  // 5. Update Database (Transaction for atomic updates)
  const result = await prisma.$transaction(async (tx) => {
    // Update main user data
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Update hosteller profile if applicable
    let updatedHostellerProfile = null;
    if (Object.keys(hostellerProfileUpdate).length > 0) {
      if (user.hostellerProfile) {
        // Update existing profile
        updatedHostellerProfile = await tx.hostellerProfile.update({
          where: { userId: userId },
          data: hostellerProfileUpdate,
        });
      } else {
        // Create new profile
        updatedHostellerProfile = await tx.hostellerProfile.create({
          data: {
            userId: userId,
            ...hostellerProfileUpdate
          }
        });
      }
    }

    return { updatedUser, updatedHostellerProfile };
  });

  // 6. Prepare response data
  const responseUser = {
    id: result.updatedUser.id,
    fullName: result.updatedUser.fullName,
    email: result.updatedUser.email,
    phone: result.updatedUser.phone,
    role: result.updatedUser.role,
    avatar: result.updatedUser.avatarUrl,
    // Include hosteller profile data if user is hosteller
    ...(user.role === 'HOSTELLER' && result.updatedHostellerProfile && {
      hostellerProfile: {
        collegeName: result.updatedHostellerProfile.collegeName,
        course: result.updatedHostellerProfile.course,
        branch: result.updatedHostellerProfile.branch,
        yearOfStudy: result.updatedHostellerProfile.yearOfStudy,
        bio: result.updatedHostellerProfile.bio,
      }
    })
  };

  res.status(200).json({
    success: true,
    message: "Profile updated",
    user: responseUser,
  });
});
