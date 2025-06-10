// src/types/index.ts

import { User } from '@supabase/supabase-js';

// Define all possible user roles
export type UserRole =
  | 'SuperAdmin'
  | 'AppManager_Management'
  | 'AppManager_Sales'
  | 'AppManager_Finance'
  | 'AppManager_Support'
  | 'SchoolAdmin'
  | 'SchoolDataEditor'
  | 'SchoolFinanceManager'
  | 'ClassTeacher'
  | 'Teacher'
  | 'Parent'
  | 'Subscriber'
  | 'Student_User';

// Extend Supabase User type with our custom profile data
export interface AuthenticatedUser extends User {
  role: UserRole;
  school_id: string | null; // Null for SuperAdmins/AppManagers
}

// Custom error structure for API responses
export interface APIError {
  message: string;
  code?: string;
  details?: any;
  statusCode: number;
}

// Zod schemas for validation will live near controllers or in a separate `schemas` folder.
// For now, let's keep them in validation.ts or directly in controllers for examples.

// Basic interface for common table fields
export interface BaseEntity {
  id: string; // UUID
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}