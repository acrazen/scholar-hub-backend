// src/models/user.ts

import { BaseEntity, UserRole } from '../types';

// This interfaces with `public.user_profiles` table
export interface UserProfile extends BaseEntity {
  user_id: string; // Corresponds to auth.users.id
  school_id: string | null; // Null for platform-level roles
  role: UserRole;
  full_name?: string;
  phone_number?: string;
  address?: string;
  profile_photo_url?: string;
}

// For updating a user's profile
export type UpdateUserProfilePayload = Partial<Omit<UserProfile, 'user_id' | 'created_at' | 'updated_at' | 'school_id' | 'role'>>;