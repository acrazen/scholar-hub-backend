// src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { APIError } from '../types';

// Generic validation middleware for Zod schemas
export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body); // Validate request body
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errorDetails = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        message: 'Validation failed',
        details: errorDetails,
        statusCode: 400,
      } as APIError);
    }
    // Fallback for unexpected errors
    return res.status(500).json({
      message: 'Internal server error during validation.',
      statusCode: 500,
    } as APIError);
  }
};