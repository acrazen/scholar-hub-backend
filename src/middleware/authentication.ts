// src/middleware/authentication.ts

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedUser, UserRole, APIError } from '../types';

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.', statusCode: 401 } as APIError);
  }

  // Verify the token with Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error('Supabase auth.getUser error:', error?.message || 'User not found');
    return res.status(403).json({ message: 'Invalid or expired token.', statusCode: 403 } as APIError);
  }

  // Fetch user profile with role and school_id from our public.user_profiles table
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, school_id')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('User profile not found or error:', profileError?.message || 'Profile data missing.');
    return res.status(403).json({ message: 'User profile not found or unauthorized.', statusCode: 403 } as APIError);
  }

  // Attach the extended user object to the request for downstream middleware/controllers
  req.user = {
    ...user,
    role: profile.role as UserRole, // Cast to UserRole enum
    school_id: profile.school_id,
  } as AuthenticatedUser;

  next();
}