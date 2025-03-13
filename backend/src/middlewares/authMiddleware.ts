//backend/src/middlewares/authMiddleware.ts
import admin from '../config/firebase';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extend the Request type to include 'user'
export interface AuthenticatedRequest<
  P = {}, // Params
  ResBody = {}, // Response Body
  ReqBody = {}, // Request Body
  ReqQuery = {} // Query Parameters
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

// Middleware to verify Firebase Token
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if the user exists in MongoDB
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Attach user details to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error });
  }
};

// Middleware to check admin role
export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only' });
    return;
  }
  next();
};