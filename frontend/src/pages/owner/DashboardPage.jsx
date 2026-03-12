import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { NotificationPanel } from '../../components/dashboard/NotificationPanel';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/analytics/summary', token).then(setSummary);
    api.get('/notifications', token).then((data) => setNotifications(data.notifications));
  }, [token]);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`, {}, token);
    setNotifications((current) => current.map((entry) => (entry.id === id ? { ...entry, isRead: true } : entry)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">Owner dashboard</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Anonymous interest and identified leads are kept separate for clarity and privacy.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Views" value={summary?.totals.views || 0} />
        <StatsCard label="Leads" value={summary?.totals.leads || 0} tone="brand" />
        <StatsCard label="Callbacks" value={summary?.totals.callbacks || 0} />
        <StatsCard label="WhatsApp intents" value={summary?.totals.whatsappIntents || 0} />
        <StatsCard label="Call intents" value={summary?.totals.callIntents || 0} tone="accent" />
      </div>
      <NotificationPanel notifications={notifications} onRead={markRead} />
    </div>
  );
}
