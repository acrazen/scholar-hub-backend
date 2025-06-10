// src/services/fileService.ts

import { generateSignedUploadUrl, getPublicFileUrl } from '../utils/fileUpload';
import { AppError } from '../middleware/errorHandler';

export class FileService {

  /**
   * Generates a signed upload URL for a file.
   * @param schoolId - The ID of the school.
   * @param userId - The ID of the user performing the upload.
   * @param fileType - The type/category of the file (e.g., 'profile_photos').
   * @param originalFileName - The original file name.
   * @returns An object with the signed URL and the full path.
   */
  static async getSignedUploadUrl(
    schoolId: string,
    userId: string,
    fileType: 'profile_photos' | 'student_documents' | 'feed_media' | 'reports' | 'certificates' | 'other_uploads',
    originalFileName: string
  ): Promise<{ signedUrl: string; fullPath: string }> {
    try {
      const { signedUrl, fullPath } = await generateSignedUploadUrl(
        schoolId,
        userId,
        fileType,
        originalFileName
      );
      return { signedUrl, fullPath };
    } catch (error: any) {
      throw new AppError(
        error.message || 'Failed to generate signed upload URL.',
        error.statusCode || 500,
        error.code || 'SIGNED_URL_ERROR',
        error.details
      );
    }
  }

  /**
   * Retrieves the public URL for a given file path in storage.
   * @param filePath - The full path of the file in the Supabase bucket.
   * @returns The public URL.
   */
  static getPublicUrl(filePath: string): string {
    return getPublicFileUrl(filePath);
  }
}