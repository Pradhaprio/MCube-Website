import { useToast } from '../../context/ToastContext';

export function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[70] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm shadow-lift ${
            toast.tone === 'success'
              ? 'bg-emerald-600 text-white'
              : toast.tone === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-white'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
