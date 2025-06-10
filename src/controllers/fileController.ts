// src/controllers/fileController.ts

import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/fileService';
import { AppError } from '../middleware/errorHandler';
import { z, ZodError } from 'zod';

// Zod schema for requesting a signed upload URL
const getSignedUploadUrlSchema = z.object({
  fileType: z.enum(['profile_photos', 'student_documents', 'feed_media', 'reports', 'certificates', 'other_uploads']),
  originalFileName: z.string().min(1, 'Original file name is required.'),
});

export class FileController {
  /**
   * POST /api/v1/files/upload-url
   * Generates a signed URL for a file upload to Supabase Storage.
   * Frontend will then use this URL to upload directly to Supabase.
   */
  static async generateUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id;
      const userId = req.user?.id;

      if (!schoolId) {
        throw new AppError('User not associated with a school. Cannot generate school-specific upload URL.', 403, 'TENANT_MISMATCH');
      }
      if (!userId) {
        throw new AppError('User not authenticated.', 401, 'AUTH_ERROR');
      }

      // Validate request body
      const validatedData = getSignedUploadUrlSchema.parse(req.body);
      const { fileType, originalFileName } = validatedData;

      const { signedUrl, fullPath } = await FileService.getSignedUploadUrl(
        schoolId,
        userId,
        fileType,
        originalFileName
      );

      res.status(200).json({ signedUrl, fullPath });
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/v1/files/public-url
   * Retrieves the public URL for a given file path in Supabase Storage.
   * This might be used if the frontend stores only the path and needs the full URL.
   */
  static async getPublicUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filePath } = req.query; // Expect file path as query parameter

      if (typeof filePath !== 'string' || !filePath) {
        throw new AppError('File path is required as a query parameter.', 400, 'INVALID_INPUT');
      }

      const publicUrl = FileService.getPublicUrl(filePath);

      if (!publicUrl) {
          throw new AppError('Could not retrieve public URL for the given path. Ensure file exists and is public.', 404, 'FILE_NOT_FOUND');
      }

      res.status(200).json({ publicUrl });
    } catch (error) {
      next(error);
    }
  }
}