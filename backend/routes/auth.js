import express from 'express';
import { 
  Login, 
  SignUp, 
  Logout, 
  updateProfile, 
  verifyOtp,
  checkAuth
} from '../controller/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js'; // Import this

const router = express.Router();

// 1. Signup (Sends OTP)
router.post('/signup', SignUp);

// 2. Verify OTP (Completes Registration)
router.post('/verify-otp', verifyOtp);

// 3. Login
router.post('/login', Login);

// 4. Check Auth (Requires Token verification!)
// ✅ Added verifyToken middleware
// ✅ Changed to GET (optional but recommended)
router.get('/check-auth', verifyToken, checkAuth);

// 5. Logout
router.post('/logout', Logout);

// 6. Update Profile (Protected)
// In routes/auth.js

// Update the route:
router.put('/profile', verifyToken, uploadAvatar, updateProfile);

export default router;
