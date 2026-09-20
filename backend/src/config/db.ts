import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    console.warn('MONGODB_URI is not configured. Database connection skipped.');
    return;
  }

  try {
    // Use public DNS servers because the default Windows DNS
    // resolver is refusing Node.js SRV queries for MongoDB Atlas.
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const getDatabaseStatus = (): 'connected' | 'disconnected' | 'not-configured' => {
  if (!env.MONGODB_URI) {
    return 'not-configured';
  }

  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};