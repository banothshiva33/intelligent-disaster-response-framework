import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  MONGODB_URI: process.env.MONGODB_URI ?? '',

  JWT_SECRET: process.env.JWT_SECRET ?? 'raava-dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',

  UPLOAD_DIR: process.env.UPLOAD_DIR ?? 'uploads',

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ?? '',

  AI_SERVICE_URL: process.env.AI_SERVICE_URL ?? 'http://localhost:8001',

  BOOTSTRAP_SECRET: process.env.BOOTSTRAP_SECRET ?? ''
};