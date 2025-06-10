// src/middleware/authorization.ts

import { Request, Response, NextFunction } from 'express';
import { UserRole, APIError } from '../types';

/**
 * Middleware to authorize requests based on user roles.
 * @param allowedRoles - An array of roles that are permitted to access the route.
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'User role not found.', statusCode: 401 } as APIError);
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: `Forbidden: Insufficient permissions. Role '${userRole}' not allowed.`, statusCode: 403 } as APIError);
    }

    next();
  };
}