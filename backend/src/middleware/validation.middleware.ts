import type { NextFunction, Request, Response } from 'express';
import { z, type ZodSchema } from 'zod';
import { sendError } from '../utils/apiResponse';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message
    }));

    return sendError(res, 422, 'Validation failed.', errors);
  }

  req.body = result.data;
  return next();
};

export const validateParams = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    return sendError(
      res,
      422,
      'Invalid route parameters.',
      result.error.issues.map((issue) => ({ field: issue.path.join('.') || 'params', message: issue.message }))
    );
  }

  req.params = result.data;
  return next();
};

export const zod = z;
