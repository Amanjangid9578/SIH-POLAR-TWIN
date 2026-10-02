import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { AI_PREDICTIVE_MODELS } from '../../data/aiInsightsData';
import {
  BrainCircuit,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AnomalyAlertCenter: React.FC = () => {
  const {
    activeStation,
    alerts,
    resolveAlert,
    executeAiAction,
  } = useTelemetry();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [executingId, setExecutingId] = useState<string | null>(null);

  const aiModels = AI_PREDICTIVE_MODELS[activeStation];

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter === 'all') return true;
    return alert.severity === severityFilter;
  });

  const handleExecuteAiFix = (actionId: string, alertId?: string) => {
    setExecutingId(actionId);
    setTimeout(() => {
      executeAiAction(actionId);
      if (alertId) resolveAlert(alertId);
      setExecutingId(null);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-polar-card via-polar-surface to-polar-card border border-polar-border shadow-glass flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-polar-cyan animate-pulse" />
            <span className="text-xs font-mono font-bold text-polar-cyan uppercase tracking-wider">
              NCPOR POLAR AI DIGITAL SURROGATE CORE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Predictive AI Anomaly Detection & Alert Center
          </h2>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Physics-informed neural networks forecasting cryospheric risk, turbine vibration, and fuel viscosity 48 hours in advance.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border">
            <span className="text-polar-textMuted">Inference Engine:</span>{' '}
            <strong className="text-polar-cyan">PyTorch Polar-GRU v3</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border">
            <span className="text-polar-textMuted">Surrogate Accuracy:</span>{' '}
            <strong className="text-polar-success">98.4%</strong>
          </div>
        </div>
      </div>

      {/* 1. AI Predictive Analysis Cards (Hero AI Section) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-polar-cyan font-bold flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" /> AI Predictive Risk Models
          </h3>
          <span className="text-[10px] text-polar-textMuted font-mono">
            Continuous Bayesian Uncertainty Estimation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiModels.map((model) => {
            const isAnomaly = model.anomalyDetected;
            const borderGlow =
              model.severity === 'critical' && isAnomaly
                ? 'border-polar-alert/50 shadow-glow-alert'
                : model.severity === 'warning' && isAnomaly
                ? 'border-polar-warning/50 shadow-glow-warning'
                : 'border-polar-border hover:border-polar-cyan/30';

            return (
              <div
                key={model.id}
                className={`p-5 rounded-2xl bg-polar-card/90 backdrop-blur-md border ${borderGlow} flex flex-col justify-between transition-all`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                            model.severity === 'critical'
                              ? 'bg-polar-alert/20 text-polar-alert border-polar-alert/40'
                              : model.severity === 'warning'
                              ? 'bg-polar-warning/20 text-polar-warning border-polar-warning/40'
                              : 'bg-polar-cyan/20 text-polar-cyan border-polar-cyan/40'
                          }`}
                        >
                          {model.severity}
                        </span>
                        <span className="text-[11px] font-mono text-polar-textMuted">
                          Window: {model.timeWindow}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {model.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-polar-textMuted font-mono uppercase">
                        Confidence
                      </div>
                      <div className="text-sm font-bold font-mono text-polar-cyan">
                        {model.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction & Physics Context */}
                  <div className="my-3 p-3 rounded-lg bg-polar-dark/70 border border-polar-border text-xs space-y-1.5">
                    <p className="text-white font-medium leading-relaxed">
                      {model.prediction}
                    </p>
                    <p className="text-[11px] text-polar-textMuted leading-relaxed font-mono">
                      Physics Context: {model.physicsContext}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-2.5 rounded-lg bg-polar-blue/10 border border-polar-blue/20 flex items-start gap-2 text-xs">
                    <Zap className="w-4 h-4 text-polar-cyan shrink-0 mt-0.5" />
                    <div>
                      <span className="text-polar-cyan font-mono font-semibold uppercase text-[10px]">
                        AI Recommended Action:
                      </span>
                      <p className="text-polar-textLight text-xs mt-0.5">
                        {model.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Trigger Button */}
                <div className="mt-4 pt-3 border-t border-polar-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-polar-textMuted">
                    Target: {model.sourceModule}
                  </span>

                  {isAnomaly && (
                    <button
                      disabled={executingId === model.actionId}
                      onClick={() => handleExecuteAiFix(model.actionId)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-polar-cyan to-polar-blue text-polar-dark font-bold font-mono text-xs shadow-glow-cyan hover:opacity-95 transition-all flex items-center gap-1.5"
                    >
                      {executingId === model.actionId ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing via Link...</span>
                        </>
                      ) : (
                        <>
                          <span>{model.actionButtonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Live Station Event Log Stream with Severity Badges */}
      <div className="p-5 rounded-2xl bg-polar-card border border-polar-border shadow-glass">
        {/* Stream Filter & Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-polar-border">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-polar-warning" />
              Live Station Event Stream & Audit Trail
            </h3>
            <p className="text-xs text-polar-textMuted mt-0.5">
              Chronological log of system anomalies, environmental alarms, and closed-loop interventions.
            </p>
          </div>

          {/* Severity Badges Filter */}
          <div className="flex items-center p-1 rounded-lg bg-polar-dark border border-polar-border text-xs font-mono">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                severityFilter === 'all'
                  ? 'bg-polar-cyan text-polar-dark font-bold'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              All Events ({alerts.length})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                severityFilter === 'critical'
                  ? 'bg-polar-alert text-white font-bold'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Critical ({alerts.filter((a) => a.severity === 'critical').length})
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                severityFilter === 'warning'
                  ? 'bg-polar-warning text-polar-dark font-bold'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Warning ({alerts.filter((a) => a.severity === 'warning').length})
            </button>
            <button
              onClick={() => setSeverityFilter('info')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                severityFilter === 'info'
                  ? 'bg-polar-blue text-polar-dark font-bold'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Info ({alerts.filter((a) => a.severity === 'info').length})
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="divide-y divide-polar-border/60">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-polar-textMuted">
              No events found for severity filter: {severityFilter.toUpperCase()}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const severityBadge = {
                critical: 'bg-polar-alert/20 text-polar-alert border-polar-alert/40',
                warning: 'bg-polar-warning/20 text-polar-warning border-polar-warning/40',
                info: 'bg-polar-cyan/20 text-polar-cyan border-polar-cyan/40',
              };

              const severityIcon = {
                critical: <AlertCircle className="w-4 h-4 text-polar-alert shrink-0" />,
                warning: <AlertTriangle className="w-4 h-4 text-polar-warning shrink-0" />,
                info: <Info className="w-4 h-4 text-polar-cyan shrink-0" />,
              };

              return (
                <div
                  key={alert.id}
                  className={`py-4 px-2 rounded-lg flex flex-wrap items-start justify-between gap-4 transition-colors ${
                    alert.resolved ? 'opacity-60 bg-polar-dark/30' : 'hover:bg-polar-surface/50'
                  }`}
                >
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="mt-0.5">{severityIcon[alert.severity]}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${
                            severityBadge[alert.severity]
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                        <span className="text-[10px] font-mono text-polar-textMuted">
                          • {alert.sourceModule}
                        </span>
                      </div>

                      <p className="text-xs text-polar-textMuted mt-1 leading-relaxed">
                        {alert.message}
                      </p>

                      {alert.aiRecommendation && (
                        <div className="mt-1.5 text-[11px] text-polar-cyan font-mono flex items-center gap-1.5">
                          <Zap className="w-3 h-3" />
                          <span>AI: {alert.aiRecommendation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-3 font-mono text-xs self-center">
                    <span className="text-[11px] text-polar-textMuted">{alert.timestamp}</span>

                    {alert.resolved ? (
                      <span className="flex items-center gap-1 text-[11px] text-polar-success font-semibold px-2 py-1 rounded bg-polar-success/15 border border-polar-success/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {alert.actionRequired && (
                          <button
                            onClick={() =>
                              handleExecuteAiFix(
                                alert.id === 'alt-001' ? 'heat-line-b' : 'load-balance',
                                alert.id
                              )
                            }
                            className="px-2.5 py-1 rounded bg-polar-cyan hover:bg-polar-cyan/90 text-polar-dark font-bold text-[11px] transition-all"
                          >
                            Execute Fix
                          </button>
                        )}
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-polar-card hover:bg-polar-cardHover border border-polar-border text-white text-[11px] transition-all"
                        >
                          Acknowledge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
