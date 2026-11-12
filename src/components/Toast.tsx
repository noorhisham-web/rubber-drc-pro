import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-70 flex flex-col gap-2 max-w-sm w-full print:hidden">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-5 transition-all ${
            t.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : t.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-teal-400" />}
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-[13px]">{t.title}</div>
            <div className="text-slate-200 mt-0.5 leading-snug">{t.message}</div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
