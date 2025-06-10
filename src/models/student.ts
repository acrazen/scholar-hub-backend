// src/models/student.ts

import { BaseEntity } from '../types';

export interface Student extends BaseEntity {
  school_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string; // ISO date string
  class_name?: string;
  profile_photo_url?: string;
  allergies?: string[]; // Assuming text array for simplicity, or JSONB if complex
  notes?: string;
}

export type CreateStudentPayload = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
export type UpdateStudentPayload = Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>;