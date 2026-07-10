import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-12345';

// POST /api/auth/register
router.post('/register', async (req, res): Promise<any> => {
  try {
    const { name, email, password, phone, country, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Password validation
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      email,
      phone: phone || '',
      country: country || 'United States',
      currency: currency || '$',
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      budgetLimit: 2000,
      settings: {
        darkMode: true,
        currency: currency || '$',
        language: 'English',
        notificationsEnabled: true
      },
      // Save hashed password by storing it on user in data store (we can cast or append properties, but let's extend the object)
      ...{ password: hashedPassword }
    };

    // Save user
    db.createUser(newUser as any);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email) as any;
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, (req: AuthRequest, res): any => {
  const user = db.getUserById(req.userId!) as any;
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.json(userWithoutPassword);
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const { name, phone, country, currency, profileImage, budgetLimit, settings } = req.body;
    const user = db.getUserById(req.userId!) as any;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = db.updateUser(req.userId!, {
      name: name || user.name,
      phone: phone !== undefined ? phone : user.phone,
      country: country || user.country,
      currency: currency || user.currency,
      profileImage: profileImage || user.profileImage,
      budgetLimit: budgetLimit !== undefined ? Number(budgetLimit) : user.budgetLimit,
      settings: settings !== undefined ? { ...user.settings, ...settings } : user.settings
    });

    const { password: _, ...userWithoutPassword } = updatedUser as any;
    return res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = db.getUserById(req.userId!) as any;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Password validation
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    if (newPassword.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.updateUser(req.userId!, { password: hashedNewPassword } as any);

    return res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

export default router;
