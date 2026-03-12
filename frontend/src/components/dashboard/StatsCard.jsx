export function StatsCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-white dark:bg-slate-900',
    brand: 'bg-brand-700 text-white',
    accent: 'bg-accent-500 text-white'
  };

  return (
    <div className={`glass-card p-5 ${tones[tone] || tones.default}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}
