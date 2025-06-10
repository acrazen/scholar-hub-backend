// src/types/express.d.ts
// This file augments the Express Request object to include our custom user property.

import { AuthenticatedUser } from './index';

// Declare the 'express' module to augment its types
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser; // Add the 'user' property to the Request object
    }
  }
}