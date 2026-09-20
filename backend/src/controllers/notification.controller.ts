import type { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { ApiError, sendError, sendSuccess } from '../utils/apiResponse';

export const listMyNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(25).lean();

    return sendSuccess(res, 200, 'Notifications loaded.', {
      notifications: notifications.map((notification) => ({
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        channel: notification.channel,
        metadata: notification.metadata ?? {},
        readAt: notification.readAt,
        createdAt: notification.createdAt
      }))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to load notifications.', [(error as Error).message]);
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { notificationId } = req.params;
    const notification = await Notification.findOne({ _id: notificationId, userId: req.user.id });

    if (!notification) {
      return sendError(res, 404, 'Notification not found.', [{ field: 'notificationId', message: 'No notification exists for this user.' }]);
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await notification.save();
    }

    return sendSuccess(res, 200, 'Notification marked as read.', {
      notification: {
        id: notification._id,
        readAt: notification.readAt
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message, error.details ?? []);
    }

    return sendError(res, 500, 'Unable to update notification.', [(error as Error).message]);
  }
};
