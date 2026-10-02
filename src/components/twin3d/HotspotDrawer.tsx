import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  X,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Thermometer,
  Shield,
  Gauge,
  Power,
  RotateCw,
} from 'lucide-react';

export const HotspotDrawer: React.FC = () => {
  const {
    selectedHotspot,
    setSelectedHotspot,
    triggerControlAction,
    activeStation,
  } = useTelemetry();

  if (!selectedHotspot) return null;

  const statusColors = {
    optimal: 'text-polar-success bg-polar-success/15 border-polar-success/30',
    warning: 'text-polar-warning bg-polar-warning/15 border-polar-warning/30',
    critical: 'text-polar-alert bg-polar-alert/15 border-polar-alert/30',
    offline: 'text-polar-textMuted bg-polar-card border-polar-border',
  };

  const statusIcons = {
    optimal: <CheckCircle2 className="w-4 h-4 text-polar-success" />,
    warning: <AlertTriangle className="w-4 h-4 text-polar-warning" />,
    critical: <AlertTriangle className="w-4 h-4 text-polar-alert animate-bounce" />,
    offline: <Power className="w-4 h-4 text-polar-textMuted" />,
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-polar-card/95 backdrop-blur-2xl border-l border-polar-border shadow-2xl flex flex-col text-polar-textLight animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-polar-border flex items-start justify-between bg-polar-surface/80">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border flex items-center gap-1 ${
                statusColors[selectedHotspot.status]
              }`}
            >
              {statusIcons[selectedHotspot.status]}
              {selectedHotspot.status}
            </span>
            <span className="text-xs font-mono text-polar-cyan uppercase">
              ID: {selectedHotspot.id} • {activeStation.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1.5 leading-snug">
            {selectedHotspot.name}
          </h2>
          <p className="text-xs text-polar-textMuted mt-1 leading-relaxed">
            {selectedHotspot.description}
          </p>
        </div>

        <button
          onClick={() => setSelectedHotspot(null)}
          className="p-1.5 rounded-lg text-polar-textMuted hover:text-white hover:bg-polar-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Core Live Module Indicators */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-polar-dark/60 border border-polar-border">
            <div className="text-[10px] text-polar-textMuted uppercase font-mono flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-polar-cyan" /> Core Temp
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {selectedHotspot.temperature > 0 ? `+${selectedHotspot.temperature}` : selectedHotspot.temperature}°C
            </div>
          </div>

          <div className="p-3 rounded-lg bg-polar-dark/60 border border-polar-border">
            <div className="text-[10px] text-polar-textMuted uppercase font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-polar-warning" /> Power Load
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {selectedHotspot.powerDrawKw} kW
            </div>
          </div>

          <div className="p-3 rounded-lg bg-polar-dark/60 border border-polar-border">
            <div className="text-[10px] text-polar-textMuted uppercase font-mono flex items-center gap-1">
              <Gauge className="w-3 h-3 text-polar-success" /> Efficiency
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {selectedHotspot.efficiencyPct}%
            </div>
          </div>
        </div>

        {/* Telemetry Sensor Sub-metrics */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-polar-cyan font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Sensor Diagnostic Stream
            </h3>
            <span className="text-[10px] text-polar-textMuted font-mono">
              Inspected: {selectedHotspot.lastInspection}
            </span>
          </div>

          <div className="space-y-2">
            {selectedHotspot.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-polar-dark/40 border border-polar-border hover:border-polar-cyan/30 transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      metric.status === 'optimal'
                        ? 'bg-polar-success'
                        : metric.status === 'warning'
                        ? 'bg-polar-warning animate-pulse'
                        : 'bg-polar-alert animate-ping'
                    }`}
                  ></span>
                  <span className="text-polar-textLight">{metric.label}</span>
                </div>
                <div className="font-mono font-bold text-white">
                  {metric.value} {metric.unit || ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Closed-Loop Tele-Controls */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-polar-cyan font-semibold flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5" /> Remote Subsystem Controls
          </h3>

          <div className="space-y-3">
            {selectedHotspot.controls.map((ctrl) => (
              <div
                key={ctrl.id}
                className="p-3.5 rounded-lg bg-polar-dark/60 border border-polar-border hover:border-polar-cyan/40 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{ctrl.label}</h4>
                    <p className="text-[11px] text-polar-textMuted mt-0.5 leading-snug">
                      {ctrl.description}
                    </p>
                  </div>

                  {ctrl.type === 'toggle' && (
                    <button
                      onClick={() =>
                        triggerControlAction(selectedHotspot.id, ctrl.id, !ctrl.currentValue)
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        ctrl.currentValue ? 'bg-polar-cyan' : 'bg-polar-card'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-polar-dark shadow ring-0 transition duration-200 ease-in-out ${
                          ctrl.currentValue ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}

                  {ctrl.type === 'button' && (
                    <button
                      onClick={() =>
                        triggerControlAction(selectedHotspot.id, ctrl.id, Number(ctrl.currentValue) + 1)
                      }
                      className="px-3 py-1.5 rounded bg-polar-cyan/20 hover:bg-polar-cyan/30 text-polar-cyan border border-polar-cyan/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Execute</span>
                    </button>
                  )}
                </div>

                {ctrl.type === 'slider' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono text-polar-textMuted mb-1">
                      <span>Adjustment</span>
                      <span className="text-polar-cyan font-bold">{ctrl.currentValue}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Number(ctrl.currentValue)}
                      onChange={(e) =>
                        triggerControlAction(selectedHotspot.id, ctrl.id, Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-polar-card rounded-lg appearance-none cursor-pointer accent-polar-cyan"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Diagnostics Recommendation Box */}
        <div className="p-3.5 rounded-lg bg-polar-blue/10 border border-polar-blue/30 text-xs">
          <div className="flex items-center gap-2 text-polar-cyan font-mono font-semibold uppercase text-[11px]">
            <Shield className="w-3.5 h-3.5" /> Digital Twin AI Health Analysis
          </div>
          <p className="mt-1.5 text-polar-textLight text-[11px] leading-relaxed">
            Physics-informed neural surrogate model simulates zero thermal degradation for next 72 hours under current load balance.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-polar-border bg-polar-surface/90 flex items-center justify-between text-xs font-mono">
        <span className="text-polar-textMuted">Encrypted Telecommand: AES-256</span>
        <button
          onClick={() => setSelectedHotspot(null)}
          className="px-4 py-1.5 rounded-lg bg-polar-card hover:bg-polar-cardHover border border-polar-border text-white transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
