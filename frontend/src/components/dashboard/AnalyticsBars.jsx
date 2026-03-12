export function AnalyticsBars({ title, items = [] }) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="glass-card p-5">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.itemId || item.title}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-1">{item.title}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-brand-600" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
