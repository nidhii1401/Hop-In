

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middleware/authMiddleware.js'; // Import middleware

// Routes
import authRoutes from './routes/auth.js';
import hostelRoutes from './routes/hostels.js';
import roomRoutes from './routes/rooms.js';
import ownerRoutes from './routes/owner.js';
import hostellerRoutes from './routes/hosteller.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',  // Your local frontend
  // Add your production frontend URL here later
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Crucial for the Refresh Token cookie
}));

app.use(express.json());
app.use(cookieParser()); // Required for reading Refresh Token

// --- ROUTES ---

// 1. Auth (Public)
app.use('/api/auth', authRoutes);

// 2. Health Check (Public - Moved up so it's never blocked)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HopInn API is running' });
});

// 3. Hostels & Rooms (Mixed Public/Private)
// We do NOT add verifyToken here because users need to SEE hostels without logging in.
// You should add verifyToken inside hostelRoutes.js for specific 'create/edit' endpoints.
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);

// 4. Owner & Hosteller (Strictly Private)
// We add verifyToken here because these entire sections require login.
app.use('/api/owner', verifyToken, ownerRoutes);
app.use('/api/hosteller', verifyToken, hostellerRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
