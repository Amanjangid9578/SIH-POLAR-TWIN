import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { STATIONS_METADATA } from '../../data/stationsData';
import {
  Terminal,
  WifiOff,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Radio,
} from 'lucide-react';

export const LowBandwidthView: React.FC = () => {
  const {
    activeStation,
    telemetry,
    hotspots,
    setSelectedHotspot,
    setLowBandwidthMode,
    packetCount,
  } = useTelemetry();

  const metadata = STATIONS_METADATA[activeStation];
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  // Generate simulated low-bandwidth raw telemetry packet log
  useEffect(() => {
    const packet = `[${new Date().toISOString()}] SAT-PKT#${packetCount}: STN=${activeStation.toUpperCase()} EXT_T=${telemetry.externalTemp}C IND_T=${telemetry.indoorTemp}C WND=${telemetry.windSpeedKnots}KT PWR=${telemetry.powerConsumptionKw}KW FUEL=${telemetry.fuelReservePct}% LAT=${telemetry.satelliteLatencyMs}ms CRC=0x${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase()}`;
    
    setRawLogs((prev) => [packet, ...prev.slice(0, 15)]);
  }, [telemetry, packetCount, activeStation]);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 bg-polar-dark text-polar-textLight font-mono">
      {/* Low-Bandwidth Mode Banner */}
      <div className="p-4 rounded-xl bg-polar-warning/10 border border-polar-warning/30 flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-polar-warning/20 text-polar-warning">
            <WifiOff className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-polar-warning">
                LOW-BANDWIDTH SATELLITE MODE ENGAGED
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-polar-warning/20 text-polar-warning font-semibold">
                94% DATA SAVED
              </span>
            </div>
            <p className="text-xs text-polar-textMuted mt-0.5">
              WebGL 3D rasterization paused. Compressing high-frequency telemetry into lightweight 384-byte JSON/ASCII payloads via Ku-Band channel.
            </p>
          </div>
        </div>

        <button
          onClick={() => setLowBandwidthMode(false)}
          className="px-4 py-2 rounded-lg bg-polar-cyan hover:bg-polar-cyan/90 text-polar-dark font-bold text-xs transition-all shadow-glow-cyan flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Resume Full 3D Digital Twin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Left: 2D Tactical Vector Schematic Map */}
        <div className="p-4 rounded-xl bg-polar-card border border-polar-border flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-polar-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-polar-cyan">
              <Layers className="w-4 h-4" />
              <span>TACTICAL SCHEMATIC: {metadata.name.toUpperCase()}</span>
            </div>
            <span className="text-[10px] text-polar-textMuted">Vector Resolution 1:250</span>
          </div>

          <div className="flex-1 min-h-[300px] flex flex-col justify-center items-center py-6">
            <div className="relative w-full max-w-md aspect-square rounded-2xl border-2 border-dashed border-polar-cyan/30 p-6 flex flex-col justify-between bg-polar-dark/60 bg-polar-grid">
              {/* Compass Header in Tactical Map */}
              <div className="flex justify-between items-center text-[10px] text-polar-textMuted font-mono">
                <span>GRID: {metadata.coordinates.lat}</span>
                <span className="text-polar-cyan font-bold">N ↑ POLAR GRID</span>
                <span>{metadata.coordinates.lng}</span>
              </div>

              {/* Schematic Station Modules Nodes */}
              <div className="grid grid-cols-2 gap-4 my-auto">
                {hotspots.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedHotspot(mod)}
                    className="p-3 rounded-lg border text-left transition-all hover:scale-[1.02] flex flex-col justify-between group bg-polar-card/80 border-polar-border hover:border-polar-cyan hover:shadow-glow-cyan"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-polar-cyan uppercase truncate">
                        {mod.category}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          mod.status === 'optimal'
                            ? 'bg-polar-success'
                            : mod.status === 'warning'
                            ? 'bg-polar-warning animate-pulse'
                            : 'bg-polar-alert animate-ping'
                        }`}
                      ></span>
                    </div>

                    <div className="text-xs font-bold text-white group-hover:text-polar-cyan transition-colors">
                      {mod.name}
                    </div>

                    <div className="mt-2 text-[10px] text-polar-textMuted flex items-center justify-between">
                      <span>{mod.powerDrawKw} kW</span>
                      <ArrowUpRight className="w-3 h-3 text-polar-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Schematic Footer */}
              <div className="text-[10px] text-center text-polar-textMuted">
                Click any module node above to inspect telemetry & command triggers
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Satellite Telemetry Raw Packet Console */}
        <div className="p-4 rounded-xl bg-polar-card border border-polar-border flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-polar-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-polar-cyan">
              <Terminal className="w-4 h-4" />
              <span>RAW SATELLITE PACKET TELEMETRY STREAM</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-polar-textMuted">
              <Radio className="w-3 h-3 text-polar-success animate-pulse" />
              <span>GSAT-7 Ku LINK ACTIVE</span>
            </div>
          </div>

          <div className="flex-1 mt-3 p-3 rounded-lg bg-polar-dark/90 border border-polar-border/60 overflow-y-auto font-mono text-[11px] space-y-1.5 max-h-[380px]">
            {rawLogs.map((log, index) => (
              <div
                key={index}
                className={`leading-relaxed transition-opacity ${
                  index === 0 ? 'text-polar-cyan font-bold' : 'text-polar-textMuted'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded bg-polar-dark/50 border border-polar-border">
              <div className="text-polar-textMuted">Downlink Buffer</div>
              <div className="font-bold text-white mt-0.5">384 Bytes/pkt</div>
            </div>
            <div className="p-2 rounded bg-polar-dark/50 border border-polar-border">
              <div className="text-polar-textMuted">Compression</div>
              <div className="font-bold text-polar-success mt-0.5">Brotli 94.2%</div>
            </div>
            <div className="p-2 rounded bg-polar-dark/50 border border-polar-border">
              <div className="text-polar-textMuted">Packet Loss</div>
              <div className="font-bold text-polar-cyan mt-0.5">0.00%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
