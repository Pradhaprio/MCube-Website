import { mutateStore, readStore } from '../services/dataStore.js';

export async function listNotifications(req, res) {
  const data = await readStore();
  return res.json({ notifications: data.notifications.slice(0, 20) });
}

export async function markNotificationRead(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    const notification = data.notifications.find((entry) => entry.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return data;
  });
  const notification = next.notifications.find((entry) => entry.id === id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found.' });
  }
  return res.json({ notification });
}
