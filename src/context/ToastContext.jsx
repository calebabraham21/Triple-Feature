import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((opts) => {
    const id = ++idRef.current;
    const toast = {
      id,
      title: opts?.title || '',
      message: opts?.message || '',
      type: opts?.type || 'success', // success | error | warning | info
      duration: typeof opts?.duration === 'number' ? opts.duration : 3000,
    };
    setToasts((prev) => [...prev, toast]);
    if (toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration);
    }
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 w-[calc(100vw-2rem)] max-w-sm">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-lg border border-cinema-light/30 bg-cinema-dark/90 backdrop-blur-sm shadow-xl"
            >
              <div className="p-3 pr-8 flex items-start gap-2">
                <div className="pt-0.5">
                  {t.type === 'success' && <CheckCircle size={18} className="text-green-400" />}
                  {t.type === 'error' && <XCircle size={18} className="text-accent-red" />}
                  {t.type === 'warning' && <AlertTriangle size={18} className="text-accent-yellow" />}
                  {t.type === 'info' && <CheckCircle size={18} className="text-accent-blue" />}
                </div>
                <div className="flex-1 min-w-0">
                  {t.title ? <div className="text-white font-semibold text-sm leading-tight">{t.title}</div> : null}
                  {t.message ? <div className="text-white/80 text-xs leading-snug mt-0.5">{t.message}</div> : null}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="absolute top-2.5 right-2.5 text-white/60 hover:text-white"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};


