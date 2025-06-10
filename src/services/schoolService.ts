// src/services/schoolService.ts

import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { School, CreateSchoolPayload, UpdateSchoolPayload } from '../models';

export class SchoolService {

  /**
   * Creates a new school (tenant).
   * @param data - The school data.
   * @returns The created school.
   */
  static async createSchool(data: CreateSchoolPayload): Promise<School> {
    const { data: school, error } = await supabase
      .from('schools')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating school:', error);
      throw new AppError('Failed to create school.', 500, 'SCHOOL_CREATION_ERROR', error.message);
    }
    return school as School;
  }

  /**
   * Retrieves all schools.
   * @returns An array of schools.
   */
  static async getAllSchools(): Promise<School[]> {
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*'); // Select all fields

    if (error) {
      console.error('Error fetching schools:', error);
      throw new AppError('Failed to retrieve schools.', 500, 'SCHOOL_FETCH_ERROR', error.message);
    }
    return schools as School[];
  }

  /**
   * Retrieves a school by its ID.
   * @param id - The school ID.
   * @returns The school object or null if not found.
   */
  static async getSchoolById(id: string): Promise<School | null> {
    const { data: school, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching school by ID:', error);
      throw new AppError('Failed to retrieve school.', 500, 'SCHOOL_FETCH_ERROR', error.message);
    }
    return school as School | null;
  }

  /**
   * Updates an existing school.
   * @param id - The school ID.
   * @param data - The data to update.
   * @returns The updated school.
   */
  static async updateSchool(id: string, data: UpdateSchoolPayload): Promise<School> {
    const { data: school, error } = await supabase
      .from('schools')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating school:', error);
      throw new AppError('Failed to update school.', 500, 'SCHOOL_UPDATE_ERROR', error.message);
    }
    if (!school) {
        throw new AppError('School not found for update.', 404, 'SCHOOL_NOT_FOUND');
    }
    return school as School;
  }

  /**
   * Deletes a school by its ID.
   * @param id - The school ID.
   */
  static async deleteSchool(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting school:', error);
      throw new AppError('Failed to delete school.', 500, 'SCHOOL_DELETION_ERROR', error.message);
    }
  }
}