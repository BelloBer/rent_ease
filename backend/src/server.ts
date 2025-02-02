// backend/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import admin from './config/firebase';
import authRoutes from './routes/authRoutes';


// Initialize Environment Variables
dotenv.config();

// Connect Database
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware for Dev
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode: Logging enabled');
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// add routes
app.use('/api/auth', authRoutes);

// Test Firebase Authentication
app.post('/verifyToken', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token', error });
  }
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export App (useful for testing)
export default app;


