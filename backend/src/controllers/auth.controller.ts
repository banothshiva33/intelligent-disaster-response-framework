import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuditRecord } from '../models/AuditRecord';
import { sendSuccess, sendError, ApiError } from '../utils/apiResponse';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone} = req.body;

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered.', [{ field: 'email', message: 'An account with this email already exists.' }]);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      phone: phone || undefined,
      passwordHash,
      role: 'CITIZEN'
    });

    await AuditRecord.create({
      actorId: user._id,
      actorRole: user.role,
      action: 'registration',
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email }
    });

    const token = signToken(user);

    return sendSuccess(res, 201, 'User registered successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        trustScore: user.trustScore,
        isFlagged: user.isFlagged,
        isActive: user.isActive
      },
      token
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to register user.', [(error as Error).message]);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return sendError(res, 401, 'Invalid credentials.', [{ field: 'email', message: 'User not found.' }]);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid credentials.', [{ field: 'password', message: 'Password is incorrect.' }]);
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account is inactive.', ['This account is disabled.']);
    }

    const token = signToken(user);

    await AuditRecord.create({
      actorId: user._id,
      actorRole: user.role,
      action: 'login',
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email }
    });

    return sendSuccess(res, 200, 'Login successful.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
        isFlagged: user.isFlagged,
        isActive: user.isActive
      },
      token
    });
  } catch (error) {
    return sendError(res, 500, 'Unable to log in.', [(error as Error).message]);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    return sendSuccess(res, 200, 'Current user loaded.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isFlagged: user.isFlagged,
        trustScore: user.trustScore,
        location: user.location
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to fetch current user.', [(error as Error).message]);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const updatedFields: Record<string, unknown> = {};

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
      updatedFields.name = user.name;
    }

    if (typeof phone === 'string') {
      user.phone = phone.trim() || undefined;
      updatedFields.phone = user.phone;
    }

    await user.save();

    await AuditRecord.create({
      actorId: user._id,
      actorRole: user.role,
      action: 'profile_update',
      entityType: 'User',
      entityId: user._id,
      metadata: {
        updatedFields
      }
    });

    return sendSuccess(res, 200, 'Profile updated successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(
        res,
        error.statusCode,
        error.message,
        error.details ?? []
      );
    }

    return sendError(
      res,
      500,
      'Unable to update profile.',
      [(error as Error).message]
    );
  }
};