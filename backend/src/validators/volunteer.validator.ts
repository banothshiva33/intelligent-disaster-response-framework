import { z } from 'zod';

export const volunteerProfileSchema = z.object({
  skills: z.array(z.string().min(1)).optional(),

  availability: z.enum(['AVAILABLE', 'BUSY', 'OFFLINE']).optional(),

  experience: z.number().min(0).optional(),

  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }).optional()
});

export const volunteerLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const volunteerAvailabilitySchema = z.object({
  availability: z.enum(['AVAILABLE', 'BUSY', 'OFFLINE'])
});
export const volunteerVerificationSchema = z.object({
  verificationStatus: z.enum(['VERIFIED', 'REJECTED'])
});