export function NotificationPanel({ notifications = [], onRead }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Owner notifications</h3>
      </div>
      <div className="mt-5 space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-2xl border p-4 ${notification.isRead ? 'border-slate-200 dark:border-slate-800' : 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30'}`}
          >
            <p className="font-semibold">{notification.title}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{notification.message}</p>
            {!notification.isRead && (
              <button type="button" onClick={() => onRead(notification.id)} className="mt-3 text-sm font-semibold text-brand-700">
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
