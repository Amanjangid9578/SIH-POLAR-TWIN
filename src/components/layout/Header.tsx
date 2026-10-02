import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { STATIONS_METADATA } from '../../data/stationsData';
import {
  Wifi,
  WifiOff,
  Clock,
  Compass,
  Satellite,
  Zap,
  ThermometerSnowflake,
  Wind,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeStation,
    setActiveStation,
    lowBandwidthMode,
    setLowBandwidthMode,
    telemetry,
  } = useTelemetry();

  const [utcTime, setUtcTime] = useState<string>('');
  const [stationLocalTime, setStationLocalTime] = useState<string>('');

  const metadata = STATIONS_METADATA[activeStation];

  // Real-time UTC and Antarctic Station Clock (both Maitri and Bharati observe UTC+5)
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      // UTC time
      setUtcTime(
        now.toUTCString().replace('GMT', 'UTC')
      );

      // Station local time (UTC+5)
      const stationOffsetMs = 5 * 3600 * 1000;
      const stationDate = new Date(now.getTime() + stationOffsetMs);
      const timeStr = stationDate.toISOString().substring(11, 19);
      setStationLocalTime(`${timeStr} (UTC+5)`);
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-polar-border bg-polar-bg/90 backdrop-blur-xl">
      {/* Top micro-ribbon: Government / Ministry Credentials & Satellite Signal */}
      <div className="px-4 py-1 border-b border-polar-border/50 bg-polar-dark/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-polar-textMuted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-polar-cyan font-semibold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-polar-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-polar-cyan"></span>
            </span>
            MoES • NCPOR POLAR-OPS
          </span>
          <span className="hidden sm:inline text-polar-border">|</span>
          <span className="hidden sm:inline">SIH-2026 Problem ID: 26060</span>
          <span className="hidden md:inline text-polar-border">|</span>
          <span className="hidden md:inline text-polar-blue">
            46th Indian Scientific Expedition to Antarctica (ISEA)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-polar-cyan" />
            <span className="hidden sm:inline">Ku-Band GSAT-7:</span>
            <span className="text-white font-medium">{telemetry.satelliteDownlinkKbps} kbps</span>
            <span className="text-[10px] text-polar-textMuted">({telemetry.satelliteLatencyMs}ms)</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-polar-textMuted">Signal:</span>
            <span className="text-polar-success font-semibold">{telemetry.satelliteSignalPct}%</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Station Coordinates */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-polar-cyan/20 to-polar-blue/30 border border-polar-cyan/40 flex items-center justify-center shadow-glow-cyan">
            <Compass className="w-6 h-6 text-polar-cyan animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                NCPOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-polar-cyan to-polar-blue">POLAR-TWIN</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-polar-cyan/15 text-polar-cyan border border-polar-cyan/30 font-mono font-medium uppercase">
                Digital Twin v2.4
              </span>
            </div>
            <p className="text-xs text-polar-textMuted flex items-center gap-2">
              <span>{metadata.location}</span>
              <span className="text-polar-cyan font-mono text-[11px]">{metadata.coordinates.lat}, {metadata.coordinates.lng}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Station & UTC Clock Displays */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 rounded-lg bg-polar-card/60 border border-polar-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-polar-cyan" />
            <div>
              <div className="text-[10px] text-polar-textMuted uppercase tracking-wider font-mono">
                Station Local (UTC+5)
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {stationLocalTime || '--:--:--'}
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-polar-border"></div>
          <div>
            <div className="text-[10px] text-polar-textMuted uppercase tracking-wider font-mono">
              Universal UTC
            </div>
            <div className="text-xs font-mono text-polar-blue font-semibold">
              {utcTime ? utcTime.split(' ').slice(4, 5)[0] + ' UTC' : '--:--:--'}
            </div>
          </div>
        </div>

        {/* Quick Weather / Telemetry Ticker */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-polar-card border border-polar-border">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-polar-cyan" />
            <span className="text-white font-bold">{telemetry.externalTemp}°C</span>
            <span className="text-[10px] text-polar-textMuted">(Chill {telemetry.windChill}°C)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-polar-card border border-polar-border">
            <Wind className="w-3.5 h-3.5 text-polar-blue" />
            <span className="text-white font-bold">{telemetry.windSpeedKnots} kts</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-polar-card border border-polar-border">
            <Zap className="w-3.5 h-3.5 text-polar-warning" />
            <span className="text-white font-bold">{telemetry.powerConsumptionKw} kW</span>
          </div>
        </div>

        {/* Right: Station Switcher & Low-Bandwidth Toggle */}
        <div className="flex items-center gap-3">
          {/* Active Station Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-polar-card border border-polar-border">
            <button
              onClick={() => setActiveStation('maitri')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeStation === 'maitri'
                  ? 'bg-gradient-to-r from-polar-cyan to-polar-blue text-polar-dark font-semibold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeStation === 'maitri' ? 'bg-polar-dark' : 'bg-polar-cyan'}`}></span>
              Maitri Station
            </button>
            <button
              onClick={() => setActiveStation('bharati')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeStation === 'bharati'
                  ? 'bg-gradient-to-r from-polar-cyan to-polar-blue text-polar-dark font-semibold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeStation === 'bharati' ? 'bg-polar-dark' : 'bg-polar-cyan'}`}></span>
              Bharati Station
            </button>
          </div>

          {/* Low Bandwidth Mode Toggle */}
          <button
            onClick={() => setLowBandwidthMode((prev) => !prev)}
            title={
              lowBandwidthMode
                ? 'Low-Bandwidth Mode Active (Simulating high-latency polar satellite link, lightweight JSON payloads)'
                : 'Click to enable Low-Bandwidth Mode (Optimized for restricted polar satellite uplink)'
            }
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all duration-200 ${
              lowBandwidthMode
                ? 'bg-polar-warning/20 border-polar-warning text-polar-warning shadow-glow-warning'
                : 'bg-polar-card border-polar-border text-polar-textMuted hover:text-white hover:border-polar-cyan/40'
            }`}
          >
            {lowBandwidthMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-polar-warning animate-pulse" />
                <span className="font-semibold">SAT-BAND (LOW)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-polar-cyan" />
                <span className="hidden sm:inline">SAT-BAND (HI)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
