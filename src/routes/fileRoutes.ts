// src/routes/fileRoutes.ts

import { Router } from 'express';
import { FileController } from '../controllers/fileController';
import { authenticateToken } from '../middleware/authentication';
import { authorizeRoles } from '../middleware/authorization';
import { checkTenantAccess } from '../middleware/multiTenancy';
import { UserRole } from '../types';

const router = Router();

// All file routes will require authentication
router.use(authenticateToken);

// Route to generate a signed URL for file uploads
router.post(
  '/upload-url',
  // Allow most roles to upload files relevant to their school
  authorizeRoles(
    'SuperAdmin', 'AppManager_Management', 'AppManager_Sales', 'AppManager_Finance', 'AppManager_Support',
    'SchoolAdmin', 'SchoolDataEditor', 'ClassTeacher', 'Teacher', 'Parent'
  ),
  // For file uploads, ensure the user belongs to a school if they are a school-level user.
  // SuperAdmins/AppManagers might bypass the school_id requirement if they upload global assets.
  // Here, we assume most uploads are school-specific.
  checkTenantAccess('schoolId', true), // Let AppManagers and SuperAdmins bypass tenant check (if they upload for ANY school)
  FileController.generateUploadUrl
);

// Route to get a public URL for a file (useful if the frontend only stores the path)
router.get(
  '/public-url',
  authenticateToken, // Even for public URLs, require authentication to prevent enumeration/abuse
  // Decide which roles can retrieve public URLs. For profile photos, maybe anyone.
  // For sensitive documents, more restricted. Start broad and narrow down.
  authorizeRoles(
    'SuperAdmin', 'AppManager_Management', 'AppManager_Sales', 'AppManager_Finance', 'AppManager_Support',
    'SchoolAdmin', 'SchoolDataEditor', 'SchoolFinanceManager', 'ClassTeacher', 'Teacher', 'Parent', 'Subscriber', 'Student_User'
  ),
  FileController.getPublicUrl
);

export default router;