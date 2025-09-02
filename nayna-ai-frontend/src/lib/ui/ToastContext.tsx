import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Toast = { id: number; title?: string; message: string; variant?: 'success' | 'error' | 'info' };

type ToastContextValue = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts, showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-md px-4 py-3 shadow text-sm bg-white border ${t.variant === 'success' ? 'border-green-300' : t.variant === 'error' ? 'border-red-300' : 'border-gray-200'}`}>
            {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
            <div className="text-gray-700">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

