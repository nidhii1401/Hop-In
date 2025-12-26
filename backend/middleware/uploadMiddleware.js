import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Engine for HOSTELS
const hostelStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Hop-In/hostels', // ✅ Matches your folder structure
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, crop: "limit" }], // Resize large images
  },
});

// 3. Storage Engine for AVATARS (Optional - for future use)
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Hop-In/avatars', // ✅ Matches your folder structure
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: "fill" }], // Square crop for profiles
  },
});

// 4. Create Multer Instances
const hostelUpload = multer({ storage: hostelStorage });
const avatarUpload = multer({ storage: avatarStorage });

// --- EXPORTS ---

// Use this in routes/owner.js for Hostel creation (Max 6 images)
export const uploadHostelImages = hostelUpload.array('hostelImages', 6);

// Use this in routes/auth.js if you ever add "Upload Profile Picture" (Single image)
export const uploadAvatar = avatarUpload.single('avatar');
