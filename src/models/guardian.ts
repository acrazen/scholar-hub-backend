// src/models/guardian.ts

import { BaseEntity } from '../types';

export interface Guardian extends BaseEntity {
  student_id: string;
  name: string;
  relation?: string;
  phone_number?: string;
  email?: string;
  profile_photo_url?: string;
}

export type CreateGuardianPayload = Omit<Guardian, 'id' | 'created_at' | 'updated_at'>;
export type UpdateGuardianPayload = Partial<Omit<Guardian, 'id' | 'created_at' | 'updated_at'>>;