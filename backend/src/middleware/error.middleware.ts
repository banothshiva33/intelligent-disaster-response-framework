import type { NextFunction, Request, Response } from 'express';
import { ApiError, sendError } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response) => {
  sendError(res, 404, `Route not found: ${req.originalUrl}`, [
    { path: req.originalUrl, message: 'The requested resource does not exist.' }
  ]);
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.details ?? []);
  }

  if ((err as any).name === 'ValidationError') {
    return sendError(res, 400, 'Validation failed.', [(err as any).message]);
  }

  if ((err as any).code === 11000) {
    return sendError(res, 409, 'Duplicate value detected.', [
      { field: Object.keys((err as any).keyPattern ?? {})[0], message: 'This value already exists.' }
    ]);
  }

  if ((err as any).name === 'CastError') {
    return sendError(res, 400, 'Invalid resource identifier.', [(err as any).message]);
  }

  if ((err as any).name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token.', [(err as any).message]);
  }

  if ((err as any).name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired.', [(err as any).message]);
  }

  return sendError(res, 500, 'Internal server error.', [
    { message: envSafeMessage(err) }
  ]);
};

const envSafeMessage = (err: Error) => {
  const message = err.message ?? 'Unexpected error';
  return process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : message;
};
