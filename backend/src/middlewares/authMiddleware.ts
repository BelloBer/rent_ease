// backend/src/middlewares/authMiddleware.ts

import admin from '../config/firebase';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Middleware to verify Firebase Token
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach Firebase user data to request

    // Check if the user exists in MongoDB
    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user.role = user.role; // Attach role
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error });
  }
};

// Middleware to check admin role
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only' });
  }
  next();
};
