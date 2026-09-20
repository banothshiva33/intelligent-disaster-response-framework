import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(120),

  email: z.string().email(),

  password: z.string().min(8).max(128),

  phone: z.string().min(7).max(20).optional().or(z.literal(''))
});

export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8)
});

export const profileSchema = z.object({
  name: z.string().min(2).max(120).optional(),

  phone: z.string().min(7).max(20).optional().or(z.literal(''))
});