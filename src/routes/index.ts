// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './authRoutes';
import platformRoutes from './platformRoutes';
import schoolRoutes from './schoolRoutes';
import fileRoutes from './fileRoutes';

const router = Router();

// Define API version prefix
const API_PREFIX = '/api/v1';

// Public/Auth routes (handled by Supabase, but our profile routes)
router.use(`${API_PREFIX}/auth`, authRoutes); // AuthController has /users/me

// Platform-level routes (mainly for SuperAdmin/AppManagers)
router.use(`${API_PREFIX}/platform`, platformRoutes);

// School-specific routes (will enforce multi-tenancy based on user's school_id)
router.use(`${API_PREFIX}/schools`, schoolRoutes); // e.g., /schools/my/students

// File related routes
router.use(`${API_PREFIX}/files`, fileRoutes);

// Add more route modules here as you build out features
// router.use(`${API_PREFIX}/feed`, feedRoutes);
// router.use(`${API_PREFIX}/events`, eventRoutes);
// router.use(`${API_PREFIX}/messaging`, messageRoutes);

export default router;