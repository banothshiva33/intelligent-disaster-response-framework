import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.', ['User context is missing.']);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden.', [`Required role: ${allowedRoles.join(' or ')}`]);
    }

    return next();
  };
};
