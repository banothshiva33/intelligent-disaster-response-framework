import type { Request, Response } from 'express';

import { env } from '../config/env';
import { seedDemoData } from '../data/seed';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const seedDemo = async (req: Request, res: Response) => {
  try {
    if (env.NODE_ENV === 'production') {
      return sendError(
        res,
        403,
        'Demo seeding is disabled in production.',
        ['This endpoint is available only in development environments.']
      );
    }

    if (!env.BOOTSTRAP_SECRET) {
      return sendError(
        res,
        500,
        'Bootstrap secret is not configured.',
        ['Set BOOTSTRAP_SECRET in the backend environment.']
      );
    }

    const providedSecret = req.header('x-bootstrap-secret');

    if (!providedSecret || providedSecret !== env.BOOTSTRAP_SECRET) {
      return sendError(
        res,
        401,
        'Invalid bootstrap credentials.',
        ['A valid bootstrap secret is required.']
      );
    }

    const outcome = await seedDemoData();

    return sendSuccess(res, 200, 'Demo data initialized.', {
      outcome
    });
  } catch (error) {
    return sendError(
      res,
      500,
      'Unable to seed demo data.',
      [(error as Error).message]
    );
  }
};