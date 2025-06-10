// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { APIError } from '../types';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred.';
  const details = err.details || null;
  const code = err.code || 'SERVER_ERROR';

  const errorResponse: APIError = {
    message,
    statusCode,
    code,
    details,
  };

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    errorResponse.message = 'An internal server error occurred.'; // Hide detailed errors in production
    errorResponse.details = undefined;
  }

  res.status(statusCode).json(errorResponse);
};

// Custom error class for API-specific errors
export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype); // Maintain proper prototype chain
  }
}