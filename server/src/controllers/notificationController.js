import {
  getNotificationsByUserId,
  createNotification,
  markAsRead
} from '../models/notificationModel.js';

export function listUserNotifications(req, res) {
  const userId = Number(req.params.userId);
  const items = getNotificationsByUserId(userId);
  return res.json({ items });
}

export function sendNotification(req, res) {
  const { userId, message, type } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'userId and message are required' });
  }

  const notification = createNotification({
    userId,
    message,
    type
  });

  return res.status(201).json({
    message: 'Notification saved',
    notification
  });
}

export function readNotification(req, res) {
  const { id } = req.params;
  const notification = markAsRead(id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.json({
    message: 'Notification marked as read',
    notification
  });
}
