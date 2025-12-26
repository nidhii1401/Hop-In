import express from 'express';
import { 
  getRoomsByHostel, 
  getRoomById, 
  updateRoom, 
  deleteRoom, 
  toggleRoomStatus,
  addRoom
} from '../controller/roomsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All room routes require authentication
router.use(verifyToken);

// Get all rooms for a specific hostel
router.get('/hostel/:hostelId', getRoomsByHostel);

// Get a specific room by ID
router.get('/:roomId', getRoomById);

// Update a room
router.put('/update/:roomId', updateRoom);

// Toggle room status
router.patch('/:roomId/toggle-status', toggleRoomStatus);


//add route
router.post('/add/:hostelId', addRoom);


// Delete a room
router.delete('/delete/:roomId', deleteRoom);

export default router;