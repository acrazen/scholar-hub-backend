// src/server.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import rootRouter from './routes'; // Import the consolidated routes

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Root route for API status check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'School Management Backend API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// All API routes go through the rootRouter
app.use(rootRouter);

// Global error handling middleware (must be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, cleanup, or exit
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, cleanup, or exit
  process.exit(1);
}); 