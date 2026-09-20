import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication required.', ['Missing or invalid bearer token.']);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user) {
      return sendError(res, 401, 'User not found.', ['The authenticated user no longer exists.']);
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account is inactive.', ['This account has been disabled.']);
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    };

    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired authentication token.', [(error as Error).message]);
  }
};
