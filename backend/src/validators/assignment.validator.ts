import { z } from 'zod';

export const createAssignmentSchema = z.object({
  incidentId: z.string().min(1),
  volunteerId: z.string().min(1),
  message: z.string().min(1).max(500).optional()
});

export const assignmentResponseSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
  message: z.string().min(1).max(500).optional()
});