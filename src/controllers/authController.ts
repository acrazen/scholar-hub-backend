// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';
import { UpdateUserProfilePayload } from '../models';
import { ZodError, z } from 'zod'; // Import Zod and ZodError

// Zod schema for updating user profile
const updateUserProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name cannot be empty').optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  profile_photo_url: z.string().url('Invalid URL format for profile photo.').optional(),
});

export class AuthController {
  /**
   * GET /api/v1/users/me
   * Get the profile of the currently authenticated user.
   */
  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated.', 401, 'AUTH_ERROR');
      }

      const profile = await UserService.getUserProfile(userId);
      if (!profile) {
        throw new AppError('User profile not found.', 404, 'PROFILE_NOT_FOUND');
      }

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/me
   * Update the profile of the currently authenticated user.
   */
  static async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated.', 401, 'AUTH_ERROR');
      }

      // Validate request body
      const validatedData: UpdateUserProfilePayload = updateUserProfileSchema.parse(req.body);

      const updatedProfile = await UserService.updateUserProfile(userId, validatedData);

      res.status(200).json(updatedProfile);
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }
}