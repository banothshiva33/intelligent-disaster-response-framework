import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AppJwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}

export const signToken = (user: { _id?: unknown; id?: string; email: string; role: string; name: string }) => {
  const userId = typeof user._id === 'string'
    ? user._id
    : user._id && typeof (user._id as { toString?: () => string }).toString === 'function'
      ? (user._id as { toString: () => string }).toString()
      : user.id ?? '';

  const payload = {
    sub: userId,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as AppJwtPayload & { iat?: number; exp?: number };
};
