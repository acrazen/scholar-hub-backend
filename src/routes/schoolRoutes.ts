// src/routes/schoolRoutes.ts

import { Router } from 'express';
import { SchoolController } from '../controllers/schoolController';
import { authenticateToken } from '../middleware/authentication';
import { authorizeRoles } from '../middleware/authorization';
import { checkTenantAccess } from '../middleware/multiTenancy';
import { UserRole } from '../types';

const router = Router();

// Middleware applied to all school-specific routes:
// 1. Authenticate user
// 2. Authorize roles (SchoolAdmin and below for most operations, SuperAdmin/AppManager bypasses tenant check)
// 3. Ensure the user's school_id matches the requested school_id (multi-tenancy)
router.use(authenticateToken); // All routes require authentication

// Student Management within a school
// Note: We use ':schoolId' in the path, but the actual schoolId for operations
// will come from req.user.school_id, enforced by checkTenantAccess.
// The ':schoolId' param is mainly for URL structure and is checked against the user's school_id.

// GET /api/v1/schools/my/students - List students for the current user's school
router.get(
  '/my/students',
  authorizeRoles('SchoolAdmin', 'SchoolDataEditor', 'ClassTeacher', 'Teacher', 'Parent'),
  checkTenantAccess('schoolId', false), // No schoolId param here, but the middleware ensures user is linked to a school
  SchoolController.getStudents
);

// POST /api/v1/schools/my/students - Add a new student to the current user's school
router.post(
  '/my/students',
  authorizeRoles('SchoolAdmin', 'SchoolDataEditor'),
  checkTenantAccess('schoolId', false),
  SchoolController.createStudent
);

// GET /api/v1/schools/my/students/:studentId - Get specific student from current user's school
router.get(
  '/my/students/:studentId',
  authorizeRoles('SchoolAdmin', 'SchoolDataEditor', 'ClassTeacher', 'Teacher', 'Parent'),
  checkTenantAccess('schoolId', false),
  SchoolController.getStudentById
);

// PUT /api/v1/schools/my/students/:studentId - Update student in current user's school
router.put(
  '/my/students/:studentId',
  authorizeRoles('SchoolAdmin', 'SchoolDataEditor'),
  checkTenantAccess('schoolId', false),
  SchoolController.updateStudent
);

// DELETE /api/v1/schools/my/students/:studentId - Delete student from current user's school
router.delete(
  '/my/students/:studentId',
  authorizeRoles('SchoolAdmin'), // Only SchoolAdmin can delete students
  checkTenantAccess('schoolId', false),
  SchoolController.deleteStudent
);

// Important: When you use '/my/students' in the route, the `schoolId` for filtering
// data always comes from `req.user.school_id`. The `checkTenantAccess` middleware
// with `paramNameForSchoolId` set to `false` (or simply not present) ensures that
// the user *must* have a `school_id` and that the request is implicitly about their school.

// If you have routes where a `schoolId` *is* passed in the URL (e.g., /schools/:schoolId/some-data)
// for cases where SuperAdmins might explicitly access a specific school, you would use:
// router.get('/:schoolId/some-data', authorizeRoles('SuperAdmin'), checkTenantAccess('schoolId', true), ...)
// But for school-level users accessing their own school's data, '/my/' pattern is safer.

export default router;