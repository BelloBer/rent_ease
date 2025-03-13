//backend/src/routes/authRoutes.ts
import express, { Response } from 'express';
import User from '../models/User';
import { authenticateUser, authorizeAdmin, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = express.Router();

// Define a type for Register Request Body
interface RegisterRequestBody {
  uid: string;
  email: string;
  role: string;
}

// Register User
router.post('/register', async (req: AuthenticatedRequest<{}, {}, RegisterRequestBody>, res: Response) => {
  const { uid, email, role } = req.body;

  try {
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({ uid, email, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login Route
router.post('/login', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.status(200).json({ message: 'Login successful', user: req.user });
});

// Admin Route
router.get('/admin', authenticateUser, authorizeAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

export default router;