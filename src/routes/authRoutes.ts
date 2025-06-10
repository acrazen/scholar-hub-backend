// src/routes/authRoutes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authentication';
import { authorizeRoles } from '../middleware/authorization';
import { UserRole } from '../types';

const router = Router();

// Get current user's profile
router.get('/me', authenticateToken, AuthController.getMyProfile);

// Update current user's profile (allow all authenticated roles to update their own profile)
router.put('/me', authenticateToken, AuthController.updateMyProfile);


export default router;