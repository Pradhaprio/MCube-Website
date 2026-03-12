import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = (toast) => {
    const entry = { id: crypto.randomUUID(), tone: 'default', ...toast };
    setToasts((current) => [...current, entry]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== entry.id));
    }, 3200);
  };

  const value = useMemo(() => ({ toasts, pushToast }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
