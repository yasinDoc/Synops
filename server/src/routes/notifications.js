import { Router } from 'express';

const notifications = [
  {
    id: 1,
    userId: 1,
    message: 'Proposal approved',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

const router = Router();

router.get('/:userId', (req, res) => {
  const userId = Number(req.params.userId);

  res.json({
    items: notifications.filter((notification) => notification.userId === userId)
  });
});

router.post('/', (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'userId and message are required' });
  }

  const notification = {
    id: notifications.length + 1,
    userId: Number(userId),
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);

  return res.status(201).json({ message: 'Notification saved', notification });
});

export default router;