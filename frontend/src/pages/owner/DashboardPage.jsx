import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/owner/products" className="glass-card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Catalog</p>
          <p className="mt-2 font-display text-2xl font-semibold">Manage products</p>
          <p className="mt-2 text-sm text-brand-700">View, edit, and remove items</p>
        </Link>
        <Link to="/owner/products/new" className="glass-card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Quick action</p>
          <p className="mt-2 font-display text-2xl font-semibold">Add product</p>
          <p className="mt-2 text-sm text-brand-700">Create a new mobile, accessory, or service</p>
        </Link>
        <Link to="/owner/leads" className="glass-card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Leads</p>
          <p className="mt-2 font-display text-2xl font-semibold">Open lead inbox</p>
          <p className="mt-2 text-sm text-brand-700">Call back interested visitors</p>
        </Link>
        <Link to="/owner/settings" className="glass-card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Store profile</p>
          <p className="mt-2 font-display text-2xl font-semibold">Update details</p>
          <p className="mt-2 text-sm text-brand-700">Phone, address, and timings</p>
        </Link>
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
