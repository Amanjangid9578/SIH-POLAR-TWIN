import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ArrowRight, Zap } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { alerts, executeAiAction, activeStation, setActiveTab } = useTelemetry();

  const criticalAlert = alerts.find((a) => !a.resolved && a.severity === 'critical');

  if (!criticalAlert) return null;

  return (
    <div className="w-full bg-gradient-to-r from-polar-alert/25 via-polar-alert/15 to-polar-dark border-b border-polar-alert/40 px-4 py-2 text-xs transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-polar-alert opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-polar-alert"></span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold uppercase tracking-wider text-polar-alert">
              [CRITICAL TELEMETRY ALERT]
            </span>
            <span className="text-white font-semibold">{criticalAlert.title}:</span>
            <span className="text-polar-textLight hidden sm:inline">{criticalAlert.message}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {criticalAlert.aiRecommendation && (
            <div className="hidden lg:flex items-center gap-1.5 text-polar-cyan font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>AI Fix: {criticalAlert.actionRequired || 'Optimize System'}</span>
            </div>
          )}

          {activeStation === 'maitri' && criticalAlert.id === 'alt-001' ? (
            <button
              onClick={() => executeAiAction('heat-line-b', 'AI Protocol engaged: High-voltage trace heating activated on Fuel Line B manifold.')}
              className="px-3 py-1 rounded bg-polar-alert hover:bg-polar-alert/90 text-white font-semibold font-mono text-[11px] shadow-glow-alert transition-all flex items-center gap-1.5"
            >
              <span>Auto-Execute AI Fix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('ai')}
              className="px-3 py-1 rounded bg-polar-alert/80 hover:bg-polar-alert text-white font-semibold font-mono text-[11px] shadow-glow-alert transition-all flex items-center gap-1.5"
            >
              <span>Review in AI Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
