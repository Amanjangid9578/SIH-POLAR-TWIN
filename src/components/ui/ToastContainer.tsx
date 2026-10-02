import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useTelemetry();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          alert: <AlertCircle className="w-5 h-5 text-polar-alert shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-polar-warning shrink-0" />,
          success: <CheckCircle2 className="w-5 h-5 text-polar-success shrink-0" />,
          info: <Info className="w-5 h-5 text-polar-cyan shrink-0" />,
        };

        const borderColors = {
          alert: 'border-polar-alert/50 shadow-glow-alert',
          warning: 'border-polar-warning/50 shadow-glow-warning',
          success: 'border-polar-success/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
          info: 'border-polar-cyan/50 shadow-glow-cyan',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg bg-polar-card/95 backdrop-blur-md border ${borderColors[toast.type]} text-xs text-polar-textLight transition-all transform animate-in slide-in-from-right duration-300`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white tracking-wide uppercase font-mono text-[11px]">
                  {toast.title}
                </span>
                <span className="text-[10px] text-polar-textMuted font-mono">{toast.timestamp}</span>
              </div>
              <p className="mt-1 text-polar-textMuted leading-relaxed line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-polar-textMuted hover:text-white transition-colors p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
