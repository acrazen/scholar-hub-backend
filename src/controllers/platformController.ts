// src/controllers/platformController.ts

import { Request, Response, NextFunction } from 'express';
import { SchoolService } from '../services/schoolService';
import { AppError } from '../middleware/errorHandler';
import { CreateSchoolPayload, UpdateSchoolPayload } from '../models';
import { ZodError, z } from 'zod';

// Zod schema for creating a school
const createSchoolSchema = z.object({
  name: z.string().min(3, 'School name is required and must be at least 3 characters.'),
  subdomain: z.string().min(3, 'Subdomain is required.').regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens.'),
  admin_email: z.string().email('Invalid admin email format.'),
  package: z.string().optional().default('Basic'),
  status: z.string().optional().default('Active'),
  student_limit: z.number().int().min(0).optional().default(0),
  teacher_limit: z.number().int().min(0).optional().default(0),
  admin_limit: z.number().int().min(0).optional().default(0),
  branding_settings: z.record(z.any()).optional().default({}), // JSONB
  module_settings: z.record(z.any()).optional().default({}),   // JSONB
  timezone: z.string().optional().default('UTC'),
  currency_code: z.string().length(3).optional().default('USD'),
  academic_year_start: z.string().datetime({ message: "Invalid date format for academic_year_start" }).optional(),
  academic_year_end: z.string().datetime({ message: "Invalid date format for academic_year_end" }).optional(),
});

// Zod schema for updating a school (all fields optional)
const updateSchoolSchema = createSchoolSchema.partial();

export class PlatformController {

  /**
   * POST /api/v1/platform/schools
   * Create a new school tenant (SuperAdmin/AppManager_Management only).
   */
  static async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData: CreateSchoolPayload = createSchoolSchema.parse(req.body);

      const newSchool = await SchoolService.createSchool(validatedData);
      res.status(201).json(newSchool);
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/v1/platform/schools
   * List all schools (SuperAdmin/AppManager roles).
   */
  static async getAllSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const schools = await SchoolService.getAllSchools();
      res.status(200).json(schools);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/platform/schools/:schoolId
   * Get specific school details (SuperAdmin/AppManager roles).
   */
  static async getSchoolById(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.params;
      const school = await SchoolService.getSchoolById(schoolId);

      if (!school) {
        throw new AppError('School not found.', 404, 'SCHOOL_NOT_FOUND');
      }

      res.status(200).json(school);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/platform/schools/:schoolId
   * Update school details (SuperAdmin/AppManager_Management only).
   */
  static async updateSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.params;
      const validatedData: UpdateSchoolPayload = updateSchoolSchema.parse(req.body);

      const updatedSchool = await SchoolService.updateSchool(schoolId, validatedData);
      res.status(200).json(updatedSchool);
    } catch (error: any) {
      if (error instanceof ZodError) {
        next(new AppError('Validation Error', 400, 'VALIDATION_FAILED', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * DELETE /api/v1/platform/schools/:schoolId
   * Delete a school (SuperAdmin only - use with extreme caution!).
   */
  static async deleteSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.params;
      await SchoolService.deleteSchool(schoolId);
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  }
}