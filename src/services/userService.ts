// src/services/userService.ts

import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { UserProfile, UpdateUserProfilePayload } from '../models';

export class UserService {

  /**
   * Retrieves a user profile by user_id.
   * @param userId - The Supabase auth.users ID.
   * @returns The user profile or null if not found.
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching user profile:', error);
      throw new AppError('Failed to retrieve user profile.', 500, 'PROFILE_FETCH_ERROR', error.message);
    }
    return profile as UserProfile | null;
  }

  /**
   * Updates a user profile.
   * @param userId - The Supabase auth.users ID.
   * @param data - The data to update.
   * @returns The updated user profile.
   */
  static async updateUserProfile(userId: string, data: UpdateUserProfilePayload): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw new AppError('Failed to update user profile.', 500, 'PROFILE_UPDATE_ERROR', error.message);
    }
    if (!profile) {
        throw new AppError('User profile not found for update.', 404, 'PROFILE_NOT_FOUND');
    }
    return profile as UserProfile;
  }

  /**
   * Get all user profiles (SuperAdmin access).
   * @returns An array of user profiles.
   */
  static async getAllUserProfiles(): Promise<UserProfile[]> {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*');

    if (error) {
      console.error('Error fetching all user profiles:', error);
      throw new AppError('Failed to retrieve all user profiles.', 500, 'PROFILES_FETCH_ERROR', error.message);
    }
    return profiles as UserProfile[];
  }
}