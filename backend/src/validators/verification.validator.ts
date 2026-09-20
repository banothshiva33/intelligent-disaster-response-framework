import { z } from 'zod';

export const confirmationSchema = z.object({
  incidentId: z.string().min(1),
  sourceType: z.enum(['PLATFORM_USER', 'NEARBY_LOCAL_USER', 'NEARBY_VOLUNTEER']),
  response: z.enum(['CONFIRMED', 'DENIED', 'UNABLE_TO_CONFIRM']),
  comment: z.string().max(500).optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }).optional()
});

export const coordinatorDecisionSchema = z.object({
  decision: z.enum(['VERIFIED', 'FALSE_REPORT']),
  notes: z.string().min(3).max(1000).optional(),
  verificationCallRequested: z.boolean().optional(),
  callStatus: z.enum(['REQUESTED', 'COMPLETED', 'FAILED', 'MANUAL']).optional()
});

export const reviewRequestSchema = z.object({
  notes: z.string().min(3).max(1000).optional(),
  verificationCallRequested: z.boolean().optional(),
  callStatus: z.enum(['REQUESTED', 'COMPLETED', 'FAILED', 'MANUAL']).optional()
});
