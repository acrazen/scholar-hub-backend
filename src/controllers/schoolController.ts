// src/controllers/schoolController.ts

import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService';
import { AppError } from '../middleware/errorHandler';
import { CreateStudentPayload, UpdateStudentPayload } from '../models';
import { ZodError, z } from 'zod';

// Zod schema for creating a student
const createStudentSchema = z.object({
  first_name: z.string().min(1, 'First name is required.'),
  last_name: z.string().min(1, 'Last name is required.'),
  date_of_birth: z.string().datetime({ message: "Invalid date format for date of birth" }).optional(),
  class_name: z.string().optional(),
  profile_photo_url: z.string().url('Invalid URL format for profile photo.').optional(),
  allergies: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Zod schema for updating a student
const updateStudentSchema = createStudentSchema.partial();

export class SchoolController {

  // STUDENT MANAGEMENT
  /**
   * POST /api/v1/schools/:schoolId/students
   * Add a new student to a specific school.
   */
  static async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id; // Get school_id from authenticated user
      if (!schoolId) {
        throw new AppError('User not associated with a school.', 403, 'TENANT_MISMATCH');
      }

      // Validate request body
      const validatedData: CreateStudentPayload = createStudentSchema.parse(req.body);

      const newStudent = await StudentService.createStudent(schoolId, validatedData);
      res.status(201).json(newStudent);
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/v1/schools/:schoolId/students
   * List students for the current school.
   */
  static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id; // Get school_id from authenticated user
      if (!schoolId) {
        throw new AppError('User not associated with a school.', 403, 'TENANT_MISMATCH');
      }

      const students = await StudentService.getStudentsBySchoolId(schoolId);
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/schools/:schoolId/students/:studentId
   * Get a specific student by ID for the current school.
   */
  static async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id;
      const { studentId } = req.params;

      if (!schoolId) {
        throw new AppError('User not associated with a school.', 403, 'TENANT_MISMATCH');
      }

      const student = await StudentService.getStudentByIdAndSchoolId(studentId, schoolId);
      if (!student) {
        throw new AppError('Student not found or not associated with this school.', 404, 'STUDENT_NOT_FOUND');
      }

      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/schools/:schoolId/students/:studentId
   * Update an existing student for the current school.
   */
  static async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id;
      const { studentId } = req.params;

      if (!schoolId) {
        throw new AppError('User not associated with a school.', 403, 'TENANT_MISMATCH');
      }

      // Validate request body
      const validatedData: UpdateStudentPayload = updateStudentSchema.parse(req.body);

      const updatedStudent = await StudentService.updateStudent(studentId, schoolId, validatedData);
      res.status(200).json(updatedStudent);
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * DELETE /api/v1/schools/:schoolId/students/:studentId
   * Delete a student for the current school.
   */
  static async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.school_id;
      const { studentId } = req.params;

      if (!schoolId) {
        throw new AppError('User not associated with a school.', 403, 'TENANT_MISMATCH');
      }

      await StudentService.deleteStudent(studentId, schoolId);
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  }
}