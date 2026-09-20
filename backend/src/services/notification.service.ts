import { Notification } from '../models/Notification';

export const sendNotification = async ({
  userId,
  title,
  message,
  type = 'SYSTEM',
  metadata = {},
  channel = 'MOCK_FCM'
}: {
  userId: string;
  title: string;
  message: string;
  type?: 'ASSIGNMENT' | 'VERIFICATION' | 'SYSTEM' | 'ALERT';
  metadata?: Record<string, unknown>;
  channel?: 'MOCK_FCM' | 'SYSTEM';
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    metadata,
    channel
  });

  return {
    id: notification._id,
    userId: notification.userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    channel: notification.channel,
    metadata: notification.metadata,
    createdAt: notification.createdAt
  };
};
