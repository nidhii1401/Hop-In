import express from 'express';
import { verifyOwner } from '../middleware/authMiddleware.js';
import { uploadHostelImages } from '../middleware/uploadMiddleware.js'; // <-- NEW IMPORT

import { 
  createHostel, 
  getOwnerHostels, 
  getHostelById, 
  updateHostel, 
  deleteHostel, 
  ownerDashboard,
  getHostelRooms,
  getRoomDetails,
  searchHostellers,
  allocateRoom,
  deallocateRoom,
  deleteHostelMedia,
  updateHostelMedia,
  uploadHostelMedia
} from '../controller/ownerController.js';

const router = express.Router();

// All owner routes require authentication
router.use(verifyOwner);

// Dashboard route
router.get('/dashboard', ownerDashboard);

// --- Hostel CRUD Routes ---

// 🆕 ADDED: uploadHostelImages middleware
// This will process files BEFORE your controller runs
router.post('/hostels', uploadHostelImages, createHostel);

router.get('/hostels', getOwnerHostels);
router.get('/hostels/:id', getHostelById);

// 🆕 ADDED: uploadHostelImages for updates too
router.put('/hostels/:id', uploadHostelImages, updateHostel);

router.delete('/hostels/:id', deleteHostel);

// --- Hostel Media Management Routes ---
router.post('/hostels/:hostelId/media', uploadHostelImages, uploadHostelMedia);
router.delete('/hostels/:hostelId/media/:mediaId', deleteHostelMedia);
router.put('/hostels/:hostelId/media/:mediaId', updateHostelMedia);

// --- Room Management Routes ---
router.get('/hostels/:hostelId/rooms', getHostelRooms);
router.get('/hostels/:hostelId/rooms/:roomId', getRoomDetails);
router.get('/search-hostellers', searchHostellers);
router.post('/hostels/:hostelId/rooms/:roomId/allocate', allocateRoom);
router.delete('/hostels/:hostelId/rooms/:roomId/stays/:stayId', deallocateRoom);

export default router;
