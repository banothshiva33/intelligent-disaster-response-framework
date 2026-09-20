import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(10).max(2000),
  incidentType: z.string().min(2).max(60),
  severity: z.enum(['Low', 'Medium', 'High']).optional(),
  requiredSkills: z.array(z.string().min(1)).optional().default([]),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().min(3).max(200)
  }),
  evidence: z.array(z.object({
    fileName: z.string().min(1),
    filePath: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().min(1)
  })).min(1)
});

export const incidentIdParamSchema = z.object({
  incidentId: z.string().min(1)
});
