import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SettingsPage({ profile, setProfile }) {
  const { token, logout } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState(() => ({
    shopName: profile?.shopName || '',
    logoUrl: profile?.logoUrl || '',
    bannerUrl: profile?.bannerUrl || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    whatsappNumber: profile?.whatsappNumber || '',
    addressLine1: profile?.addressLine1 || '',
    addressLine2: profile?.addressLine2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    postalCode: profile?.postalCode || '',
    announcementText: profile?.announcementText || '',
    openingHoursJson: JSON.stringify(profile?.openingHours || {}, null, 2)
  }));

  useEffect(() => {
    setForm({
      shopName: profile?.shopName || '',
      logoUrl: profile?.logoUrl || '',
      bannerUrl: profile?.bannerUrl || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      whatsappNumber: profile?.whatsappNumber || '',
      addressLine1: profile?.addressLine1 || '',
      addressLine2: profile?.addressLine2 || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postalCode: profile?.postalCode || '',
      announcementText: profile?.announcementText || '',
      openingHoursJson: JSON.stringify(profile?.openingHours || {}, null, 2)
    });
  }, [profile]);

  const save = async () => {
    try {
      const payload = {
        ...form,
        openingHours: JSON.parse(form.openingHoursJson || '{}')
      };
      const data = await api.put('/store/profile', payload, token);
      setProfile(data.profile);
      pushToast({ message: 'Store profile updated.', tone: 'success' });
    } catch (error) {
      pushToast({ message: error.message || 'Invalid settings payload.', tone: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">Settings and profile</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Update your visible store details and contact channels.</p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary w-full sm:w-auto">Logout</button>
      </div>
      <div className="glass-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(form)
            .filter(([key]) => key !== 'openingHoursJson')
            .map(([key, value]) => (
            <input
              key={key}
              value={value}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              className="field"
              placeholder={key}
            />
            ))}
        </div>
        <textarea
          value={form.openingHoursJson}
          onChange={(event) => setForm((current) => ({ ...current, openingHoursJson: event.target.value }))}
          className="textarea mt-4"
          placeholder='{"monday":"09:30 - 21:00"}'
        />
        <button type="button" onClick={save} className="btn-primary mt-6">
          Save settings
        </button>
      </div>
    </div>
  );
}
