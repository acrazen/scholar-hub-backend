// src/utils/fileUpload.ts

import { supabase } from '../config/supabase';
import { generateUUID, slugify } from './helpers';
import { AppError } from '../middleware/errorHandler';

const SCHOOL_ASSETS_BUCKET = 'school-assets'; // Ensure this bucket exists in Supabase Storage

/**
 * Generates a signed upload URL for a file in Supabase Storage.
 * @param schoolId The ID of the school (tenant).
 * @param userId The ID of the user uploading.
 * @param fileType The category of the file (e.g., 'profile_photos', 'student_documents', 'feed_media').
 * @param originalFileName The original name of the file (for extension).
 * @returns An object containing the signed URL and the full storage path.
 */
export const generateSignedUploadUrl = async (
  schoolId: string,
  userId: string, // Not directly used in path for simplicity, but good for logs/audits
  fileType: 'profile_photos' | 'student_documents' | 'feed_media' | 'reports' | 'certificates' | 'other_uploads',
  originalFileName: string
) => {
  const fileExtension = originalFileName.split('.').pop();
  if (!fileExtension) {
    throw new AppError('Invalid file name: Missing extension.', 400);
  }

  // Create a unique path for the file within the school's directory
  // Format: school_uploads/<school_id>/<file_type>/<uuid>.<extension>
  const uniqueFileName = `${generateUUID()}.${fileExtension}`;
  const filePath = `school_uploads/${schoolId}/${fileType}/${uniqueFileName}`;

  // Generate a signed URL for uploading
  const { data, error } = await supabase.storage
    .from(SCHOOL_ASSETS_BUCKET)
    .createSignedUploadUrl(filePath);

  if (error) {
    console.error('Error generating signed upload URL:', error);
    throw new AppError('Failed to generate signed upload URL.', 500, 'STORAGE_UPLOAD_ERROR', error.message);
  }

  return { signedUrl: data.signedUrl, fullPath: filePath };
};

/**
 * Generates the public URL for a file in Supabase Storage after it's uploaded.
 * @param filePath The full path of the file in the bucket (e.g., 'school_uploads/uuid/profile_photos/xyz.jpg').
 * @returns The public URL of the file.
 */
export const getPublicFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(SCHOOL_ASSETS_BUCKET)
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    console.warn(`Could not get public URL for path: ${filePath}`);
    return ''; // Or throw an error if public URL is always expected
  }
  return data.publicUrl;
};