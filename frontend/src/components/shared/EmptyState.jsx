export function EmptyState({ title, description }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
        O
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{description}</p>
    </div>
  );
}
