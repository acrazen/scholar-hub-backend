// src/routes/platformRoutes.ts

import { Router } from 'express';
import { PlatformController } from '../controllers/platformController';
import { authenticateToken } from '../middleware/authentication';
import { authorizeRoles } from '../middleware/authorization';
import { UserRole } from '../types';

const router = Router();

// Middleware for all platform routes to ensure SuperAdmin or AppManager access
router.use(authenticateToken); // Authenticate all requests first

// Schools Management (Platform-level)
router.post(
  '/schools',
  authorizeRoles('SuperAdmin', 'AppManager_Management'), // Only these roles can create schools
  PlatformController.createSchool
);

router.get(
  '/schools',
  authorizeRoles('SuperAdmin', 'AppManager_Management', 'AppManager_Sales', 'AppManager_Finance', 'AppManager_Support'),
  PlatformController.getAllSchools
);

router.get(
  '/schools/:schoolId',
  authorizeRoles('SuperAdmin', 'AppManager_Management', 'AppManager_Sales', 'AppManager_Finance', 'AppManager_Support'),
  PlatformController.getSchoolById
);

router.put(
  '/schools/:schoolId',
  authorizeRoles('SuperAdmin', 'AppManager_Management'),
  PlatformController.updateSchool
);

router.delete(
  '/schools/:schoolId',
  authorizeRoles('SuperAdmin'), // Only SuperAdmin can delete schools
  PlatformController.deleteSchool
);

// Example for listing all users (only SuperAdmin)
router.get(
  '/users',
  authorizeRoles('SuperAdmin'),
  async (req, res, next) => {
    try {
      // In a real scenario, this would call a UserService.getAllUsers()
      // For now, just a placeholder. You'd implement this in userService.ts and userController.ts
      res.status(200).json({ message: "List all platform users (SuperAdmin only) - TO BE IMPLEMENTED" });
    } catch (error) {
      next(error);
    }
  }
);


export default router;