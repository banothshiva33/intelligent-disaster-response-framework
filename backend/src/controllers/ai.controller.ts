import type { Request, Response } from 'express';
import { predictIncidentSeverity } from '../services/ai.service';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const predictSeverity = async (req: Request, res: Response) => {
  try {
    const { title, description, incidentType, evidenceCount } = req.body;

    if (!title || !description) {
      return sendError(res, 422, 'Prediction input is incomplete.', [{ field: 'title', message: 'Title and description are required.' }]);
    }

    const prediction = await predictIncidentSeverity({
      title,
      description,
      incidentType,
      evidenceCount: Number(evidenceCount ?? 1)
    });

    return sendSuccess(res, 200, 'Severity prediction generated.', {
      prediction
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to predict severity.', [(error as Error).message]);
  }
};
