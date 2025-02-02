// backend/src/routes/authRoutes.ts

import express from 'express';
import admin from '../config/firebase';
import User from '../models/User';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { uid, email, role } = req.body;

  try {
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ uid, email, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login (Verify Firebase Token)
router.post('/login', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'Login successful', user: req.user });
});

// Admin Only Route
router.get('/admin', authenticateUser, authorizeAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

export default router;
