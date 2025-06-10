// src/middleware/multiTenancy.ts

import { Request, Response, NextFunction } from 'express';
import { APIError } from '../types';

/**
 * Middleware to enforce multi-tenancy by checking the school_id.
 * Assumes school_id is available on req.user and either in req.params or req.body.
 * @param paramNameForSchoolId - The name of the URL parameter containing the school_id (e.g., 'schoolId' for /schools/:schoolId).
 * @param allowSuperAdminBypass - Whether SuperAdmins and AppManagers can bypass the tenant check.
 */
export function checkTenantAccess(paramNameForSchoolId: string = 'schoolId', allowSuperAdminBypass: boolean = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userSchoolId = req.user?.school_id;
    const userRole = req.user?.role;

    // Extract school_id from request parameters or body (priority: params, then body)
    const requestedSchoolId = req.params[paramNameForSchoolId] || req.body[paramNameForSchoolId];

    // For SuperAdmins/AppManagers, allow bypass if configured
    if (allowSuperAdminBypass && (userRole === 'SuperAdmin' || userRole?.startsWith('AppManager_'))) {
      return next();
    }

    // Ensure the user has a school_id if they are not a SuperAdmin/AppManager
    if (!userSchoolId) {
      return res.status(403).json({ message: 'Forbidden: User is not associated with a school.', statusCode: 403 } as APIError);
    }

    // If a specific school ID is requested in the URL/body, ensure it matches the user's school_id
    if (requestedSchoolId && userSchoolId !== requestedSchoolId) {
      return res.status(403).json({ message: "Forbidden: Access to this school's data is not allowed.", statusCode: 403 } as APIError);
    }

    // If no specific school ID is requested in the path, but the user has a school_id,
    // this means the request is for the user's own school context (e.g., GET /schools/my/students).
    // In such cases, we implicitly trust that `req.user.school_id` is the context.
    next();
  };
}