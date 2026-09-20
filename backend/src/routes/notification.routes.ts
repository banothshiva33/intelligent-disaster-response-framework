import { Router } from 'express';
import { listMyNotifications, markNotificationRead } from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', protect, listMyNotifications);
router.patch('/:notificationId/read', protect, markNotificationRead);

export default router;
