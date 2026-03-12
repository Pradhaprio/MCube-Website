import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AnalyticsBars } from '../../components/dashboard/AnalyticsBars';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { useAuth } from '../../context/AuthContext';

export function AnalyticsPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/analytics/summary', token).then(setSummary);
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Analytics dashboard</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Anonymous activity is reported separately from identified lead submissions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Views" value={summary?.totals.views || 0} />
        <StatsCard label="Leads" value={summary?.totals.leads || 0} tone="brand" />
        <StatsCard label="Callbacks" value={summary?.totals.callbacks || 0} />
        <StatsCard label="WhatsApp" value={summary?.totals.whatsappIntents || 0} />
        <StatsCard label="Calls" value={summary?.totals.callIntents || 0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsBars title="Most viewed items" items={summary?.mostViewed || []} />
        <AnalyticsBars title="Most enquired items" items={summary?.mostEnquired || []} />
      </div>
      <div className="glass-card p-5">
        <h2 className="font-display text-xl font-semibold">Lead type breakdown</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {Object.entries(summary?.itemTypeBreakdown || {}).map(([type, count]) => (
            <div key={type} className="rounded-2xl bg-slate-100 p-5 text-center dark:bg-slate-900">
              <p className="text-sm capitalize text-slate-500 dark:text-slate-300">{type}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
