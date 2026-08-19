import { Router } from 'express';
import {
  listUserNotifications,
  sendNotification,
  readNotification
} from '../controllers/notificationController.js';

const router = Router();

// Get notifications for a user
router.get('/:userId', listUserNotifications);

// Create / trigger notification
router.post('/', sendNotification);

// Mark notification as read
router.patch('/:id/read', readNotification);

export default router;