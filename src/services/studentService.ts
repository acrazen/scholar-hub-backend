// src/services/studentService.ts

import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { Student, CreateStudentPayload, UpdateStudentPayload } from '../models';

export class StudentService {

  /**
   * Creates a new student for a specific school.
   * @param schoolId - The ID of the school.
   * @param data - The student data.
   * @returns The created student.
   */
  static async createStudent(schoolId: string, data: CreateStudentPayload): Promise<Student> {
    // Ensure the school_id in payload matches the context school_id
    const studentData = { ...data, school_id: schoolId };

    const { data: student, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      throw new AppError('Failed to create student.', 500, 'STUDENT_CREATION_ERROR', error.message);
    }
    return student as Student;
  }

  /**
   * Retrieves all students for a specific school.
   * @param schoolId - The ID of the school.
   * @returns An array of students.
   */
  static async getStudentsBySchoolId(schoolId: string): Promise<Student[]> {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId);

    if (error) {
      console.error('Error fetching students by school ID:', error);
      throw new AppError('Failed to retrieve students for this school.', 500, 'STUDENT_FETCH_ERROR', error.message);
    }
    return students as Student[];
  }

  /**
   * Retrieves a student by their ID within a specific school.
   * @param studentId - The ID of the student.
   * @param schoolId - The ID of the school.
   * @returns The student object or null if not found.
   */
  static async getStudentByIdAndSchoolId(studentId: string, schoolId: string): Promise<Student | null> {
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .eq('school_id', schoolId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching student by ID and school ID:', error);
      throw new AppError('Failed to retrieve student.', 500, 'STUDENT_FETCH_ERROR', error.message);
    }
    return student as Student | null;
  }

  /**
   * Updates an existing student for a specific school.
   * @param studentId - The ID of the student.
   * @param schoolId - The ID of the school.
   * @param data - The data to update.
   * @returns The updated student.
   */
  static async updateStudent(studentId: string, schoolId: string, data: UpdateStudentPayload): Promise<Student> {
    // Ensure school_id is not updated and the student belongs to the correct school
    const { data: student, error } = await supabase
      .from('students')
      .update(data)
      .eq('id', studentId)
      .eq('school_id', schoolId)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      throw new AppError('Failed to update student.', 500, 'STUDENT_UPDATE_ERROR', error.message);
    }
    if (!student) {
        throw new AppError('Student not found or not part of this school for update.', 404, 'STUDENT_NOT_FOUND');
    }
    return student as Student;
  }

  /**
   * Deletes a student for a specific school.
   * @param studentId - The ID of the student.
   * @param schoolId - The ID of the school.
   */
  static async deleteStudent(studentId: string, schoolId: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)
      .eq('school_id', schoolId);

    if (error) {
      console.error('Error deleting student:', error);
      throw new AppError('Failed to delete student.', 500, 'STUDENT_DELETION_ERROR', error.message);
    }
  }
}