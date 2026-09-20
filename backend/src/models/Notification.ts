import mongoose, { Schema, type Document } from 'mongoose';

export type NotificationType = 'ASSIGNMENT' | 'VERIFICATION' | 'SYSTEM' | 'ALERT';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  readAt?: Date;
  metadata?: Record<string, unknown>;
  channel: 'MOCK_FCM' | 'SYSTEM';
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['ASSIGNMENT', 'VERIFICATION', 'SYSTEM', 'ALERT'],
      default: 'SYSTEM'
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    readAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
    channel: {
      type: String,
      enum: ['MOCK_FCM', 'SYSTEM'],
      default: 'MOCK_FCM'
    }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
