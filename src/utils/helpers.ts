// src/utils/helpers.ts

import { v4 as uuidv4 } from 'uuid'; // You'll need to install 'uuid' if not already: npm install uuid @types/uuid

/**
 * Generates a UUID.
 * @returns A new UUID string.
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Formats a given string into a URL-friendly slug.
 * @param text The input text.
 * @returns A URL-friendly slug.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
};

/**
 * Ensures a path has a leading slash.
 * @param path The input path.
 * @returns Path with a leading slash.
 */
export const ensureLeadingSlash = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`;
};