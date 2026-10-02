import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { STATIONS_METADATA } from '../../data/stationsData';
import { Lock, Unlock } from 'lucide-react';

export const StationControls: React.FC = () => {
  const {
    activeStation,
    hotspots,
    triggerControlAction,
    telemetry,
  } = useTelemetry();

  const metadata = STATIONS_METADATA[activeStation];
  const [overrideSafetyLock, setOverrideSafetyLock] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-polar-card border border-polar-border shadow-glass flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-polar-cyan uppercase tracking-wider">
              {metadata.name.toUpperCase()} SCADA TELECOMMAND MATRIX
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-polar-blue/20 text-polar-blue font-semibold border border-polar-blue/40">
              UPLINK: GSAT-7 ENCRYPTED
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Station Subsystems Tele-Control & Manual Overrides
          </h2>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Direct PLC actuator dispatch for diesel generators, HVAC heat exchangers, radome de-icing, and microgrid busbars.
          </p>
        </div>

        {/* Safety Lock Override Toggle */}
        <button
          onClick={() => setOverrideSafetyLock((prev) => !prev)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
            overrideSafetyLock
              ? 'bg-polar-alert/20 border-polar-alert text-polar-alert shadow-glow-alert'
              : 'bg-polar-dark border-polar-border text-polar-textMuted hover:text-white'
          }`}
        >
          {overrideSafetyLock ? (
            <>
              <Unlock className="w-4 h-4 text-polar-alert" />
              <span>SAFETY INTERLOCK ARMED (COMMANDS UNLOCKED)</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-polar-textMuted" />
              <span>DISARM SAFETY INTERLOCK TO COMMAND</span>
            </>
          )}
        </button>
      </div>

      {/* Control Matrices by Subsystem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hotspots.map((module) => (
          <div
            key={module.id}
            className="p-5 rounded-2xl bg-polar-card border border-polar-border shadow-glass flex flex-col justify-between"
          >
            <div>
              {/* Module Header */}
              <div className="flex items-start justify-between pb-3 border-b border-polar-border">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-polar-cyan">
                    {module.category} MODULE
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{module.name}</h3>
                  <p className="text-xs text-polar-textMuted mt-0.5">{module.description}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                    module.status === 'optimal'
                      ? 'bg-polar-success/20 text-polar-success'
                      : module.status === 'warning'
                      ? 'bg-polar-warning/20 text-polar-warning'
                      : 'bg-polar-alert/20 text-polar-alert'
                  }`}
                >
                  {module.status}
                </span>
              </div>

              {/* Module Telemetry Summary */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
                <div className="p-2 rounded bg-polar-dark/60 border border-polar-border/60">
                  <span className="text-polar-textMuted text-[10px]">Operating Temp</span>
                  <div className="font-bold text-white mt-0.5">
                    {module.temperature > 0 ? `+${module.temperature}` : module.temperature}°C
                  </div>
                </div>
                <div className="p-2 rounded bg-polar-dark/60 border border-polar-border/60">
                  <span className="text-polar-textMuted text-[10px]">Power Draw</span>
                  <div className="font-bold text-polar-cyan mt-0.5">{module.powerDrawKw} kW</div>
                </div>
              </div>

              {/* Subsystem Actuators / Switches */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-polar-textMuted uppercase tracking-wider block">
                  Actuator Relay Bank
                </span>

                {module.controls.map((ctrl) => (
                  <div
                    key={ctrl.id}
                    className="p-3 rounded-lg bg-polar-dark/70 border border-polar-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{ctrl.label}</div>
                      <div className="text-[11px] text-polar-textMuted mt-0.5">
                        {ctrl.description}
                      </div>
                    </div>

                    {ctrl.type === 'toggle' && (
                      <button
                        disabled={!overrideSafetyLock}
                        onClick={() =>
                          triggerControlAction(module.id, ctrl.id, !ctrl.currentValue)
                        }
                        title={!overrideSafetyLock ? 'Disarm safety interlock first' : undefined}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          !overrideSafetyLock ? 'opacity-40 cursor-not-allowed' : ''
                        } ${ctrl.currentValue ? 'bg-polar-cyan' : 'bg-polar-card'}`}
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
                        disabled={!overrideSafetyLock}
                        onClick={() =>
                          triggerControlAction(module.id, ctrl.id, Number(ctrl.currentValue) + 1)
                        }
                        className={`px-3 py-1.5 rounded bg-polar-cyan/20 border border-polar-cyan/40 text-polar-cyan font-mono text-xs font-bold transition-all ${
                          !overrideSafetyLock
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-polar-cyan/30'
                        }`}
                      >
                        Trigger
                      </button>
                    )}

                    {ctrl.type === 'slider' && (
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-mono text-polar-textMuted mb-0.5">
                          <span>Mix Ratio</span>
                          <span className="text-polar-cyan font-bold">{ctrl.currentValue}%</span>
                        </div>
                        <input
                          disabled={!overrideSafetyLock}
                          type="range"
                          min={0}
                          max={100}
                          value={Number(ctrl.currentValue)}
                          onChange={(e) =>
                            triggerControlAction(module.id, ctrl.id, Number(e.target.value))
                          }
                          className={`w-full h-1.5 bg-polar-card rounded-lg appearance-none cursor-pointer accent-polar-cyan ${
                            !overrideSafetyLock ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-polar-border text-[10px] font-mono text-polar-textMuted flex items-center justify-between">
              <span>PLC Node: MODBUS-RTU / RS-485</span>
              <span>Latency: {telemetry.satelliteLatencyMs}ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
