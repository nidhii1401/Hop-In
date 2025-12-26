import express from "express";
import {
  getAllHostels,
  getHostelById,
  getHostelResidents,
  getMyStay,
} from "../controller/hostellerController.js";
import { verifyToken, verifyOwner } from "../middleware/authMiddleware.js"; // Import Auth Middleware

const router = express.Router();

// --- PUBLIC ROUTES (Safe for everyone) ---
router.get("/getAllHostels", getAllHostels); 
router.get("/getHostelbyId/:id", getHostelById); 
router.get("/mystay",getMyStay ); 

// --- PROTECTED ROUTES (Requires Login) ---
// Only a logged-in user (or specifically the owner) should see residents
router.get(
  "/getHostelResidents/:hostelId", 
  verifyToken, 
  getHostelResidents
);

export default router;
