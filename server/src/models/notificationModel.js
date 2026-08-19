let notifications = [
  {
    id: 1,
    userId: 1,
    message: 'Proposal approved',
    type: 'proposal_approved',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export function getNotificationsByUserId(userId) {
  return notifications.filter((n) => n.userId === Number(userId));
}

export function createNotification({ userId, message, type = 'general' }) {
  const notification = {
    id: notifications.length + 1,
    userId: Number(userId),
    message: String(message).trim(),
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);
  return notification;
}

export function markAsRead(id) {
  const notification = notifications.find((n) => n.id === Number(id));
  if (notification) {
    notification.isRead = true;
  }
  return notification;
}

export function triggerNotification({ userId, message, type }) {
  return createNotification({ userId, message, type });
}

export function resetNotifications() {
  notifications = [
    {
      id: 1,
      userId: 1,
      message: 'Proposal approved',
      type: 'proposal_approved',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];
}
