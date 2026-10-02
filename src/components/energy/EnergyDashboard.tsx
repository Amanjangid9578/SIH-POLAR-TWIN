import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { GaugeWidget } from './GaugeWidget';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Zap,
  Thermometer,
  Fuel,
  BatteryCharging,
  Sun,
  Wind,
  Cpu,
  Activity,
} from 'lucide-react';

type ChartMetric = 'power' | 'temperature' | 'wind' | 'fuel';

export const EnergyDashboard: React.FC = () => {
  const { telemetry, historicalData, activeStation } = useTelemetry();
  const [activeChartMetric, setActiveChartMetric] = useState<ChartMetric>('power');

  const greenPowerTotal = +(telemetry.solarGenKw + telemetry.windGenKw).toFixed(1);
  const greenPercentage = Math.round((greenPowerTotal / (telemetry.powerConsumptionKw || 1)) * 100);
  const tempDelta = +(telemetry.indoorTemp - telemetry.externalTemp).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Telemetry Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-polar-card border border-polar-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-polar-cyan uppercase tracking-wider">
              {activeStation.toUpperCase()} BASELOAD TELEMETRY
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-polar-success/20 text-polar-success font-semibold border border-polar-success/40">
              MICROGRID SYNCHRONIZED
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Infrastructure & Hybrid Energy Command Center
          </h2>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Real-time balance of Tier-4 Arctic diesel generation, ruggedized wind turbines, and bifacial solar arrays.
          </p>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border">
            <span className="text-polar-textMuted">Renewable Penetration:</span>{' '}
            <strong className="text-polar-success font-bold">{greenPercentage}%</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border">
            <span className="text-polar-textMuted">Thermal Delta (ΔT):</span>{' '}
            <strong className="text-polar-cyan font-bold">+{tempDelta}°C</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border">
            <span className="text-polar-textMuted">BESS Battery:</span>{' '}
            <strong className="text-polar-blue font-bold">{telemetry.batteryPct}%</strong>
          </div>
        </div>
      </div>

      {/* Primary Gauge Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Power Consumption vs Green Output */}
        <GaugeWidget
          title="Total Power Demand"
          subtitle="Microgrid Load vs Green Yield"
          value={telemetry.powerConsumptionKw}
          unit="kW"
          min={50}
          max={350}
          colorScheme="cyan"
          icon={<Zap className="w-4 h-4 text-polar-cyan" />}
          secondaryLabel="Green Mix"
          secondaryValue={`${greenPowerTotal} kW (${greenPercentage}%)`}
          footerText={`DG: ${telemetry.dieselGenKw} kW`}
        />

        {/* 2. Indoor vs External Cryosphere Temp */}
        <GaugeWidget
          title="Indoor Ambient Temp"
          subtitle={`External Air: ${telemetry.externalTemp}°C`}
          value={telemetry.indoorTemp}
          unit="°C"
          min={10}
          max={30}
          colorScheme="amber"
          icon={<Thermometer className="w-4 h-4 text-polar-warning" />}
          secondaryLabel="Sub-Zero Delta"
          secondaryValue={`Δ ${tempDelta}°C`}
          footerText={`Wind Chill: ${telemetry.windChill}°C`}
        />

        {/* 3. Fuel Reserve Level */}
        <GaugeWidget
          title="Main Fuel Reserves"
          subtitle="Arctic Polar Diesel (D-80)"
          value={+telemetry.fuelReservePct.toFixed(1)}
          unit="%"
          min={0}
          max={100}
          colorScheme="green"
          icon={<Fuel className="w-4 h-4 text-polar-success" />}
          secondaryLabel="Days of Fuel"
          secondaryValue="~280 Days"
          footerText="Leak Trace Clear"
        />

        {/* 4. Battery Energy Storage System (BESS) */}
        <GaugeWidget
          title="BESS Microgrid Storage"
          subtitle="Lithium-Titanate Cryo Cells"
          value={telemetry.batteryPct}
          unit="%"
          min={0}
          max={100}
          colorScheme="blue"
          icon={<BatteryCharging className="w-4 h-4 text-polar-blue" />}
          secondaryLabel="Bus Voltage"
          secondaryValue="415 V (50 Hz)"
          footerText="Health: 99.4%"
        />
      </div>

      {/* Energy Generation Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wind Generation Card */}
        <div className="p-4 rounded-xl bg-polar-card border border-polar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-polar-blue/15 text-polar-blue">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-polar-textMuted uppercase">
                Wind Turbines Output
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {telemetry.windGenKw} kW
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono">
            <span className="text-polar-success font-semibold">Active</span>
            <div className="text-polar-textMuted">{telemetry.windSpeedKnots} kts gust</div>
          </div>
        </div>

        {/* Solar Generation Card */}
        <div className="p-4 rounded-xl bg-polar-card border border-polar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-polar-warning/15 text-polar-warning">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-polar-textMuted uppercase">
                Bifacial Solar PV
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {telemetry.solarGenKw} kW
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono">
            <span className="text-polar-cyan font-semibold">{telemetry.solarRadiationWm2} W/m²</span>
            <div className="text-polar-textMuted">Albedo boost</div>
          </div>
        </div>

        {/* Diesel Generator Card */}
        <div className="p-4 rounded-xl bg-polar-card border border-polar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-polar-cyan/15 text-polar-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-polar-textMuted uppercase">
                Base Diesel Gensets
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {telemetry.dieselGenKw} kW
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono">
            <span className="text-polar-textMuted">Burn Rate</span>
            <div className="text-white font-bold">18.4 L/hr</div>
          </div>
        </div>
      </div>

      {/* Historical 24-Hour Telemetry Streaming Chart (Recharts) */}
      <div className="p-5 rounded-2xl bg-polar-card border border-polar-border shadow-glass">
        {/* Chart Header & Metric Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-polar-border">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-polar-cyan animate-pulse" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                24-Hour Telemetry Sensor Stream
              </h3>
            </div>
            <p className="text-xs text-polar-textMuted mt-0.5">
              High-resolution time-series sensor telemetry downlinked via GSAT satellite link.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-lg bg-polar-dark border border-polar-border text-xs font-mono">
            <button
              onClick={() => setActiveChartMetric('power')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeChartMetric === 'power'
                  ? 'bg-polar-cyan text-polar-dark font-bold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Power Demand (kW)
            </button>
            <button
              onClick={() => setActiveChartMetric('temperature')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeChartMetric === 'temperature'
                  ? 'bg-polar-cyan text-polar-dark font-bold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Thermal Profile (°C)
            </button>
            <button
              onClick={() => setActiveChartMetric('wind')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeChartMetric === 'wind'
                  ? 'bg-polar-cyan text-polar-dark font-bold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Wind Speed (Knots)
            </button>
            <button
              onClick={() => setActiveChartMetric('fuel')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeChartMetric === 'fuel'
                  ? 'bg-polar-cyan text-polar-dark font-bold shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white'
              }`}
            >
              Fuel Burn (L/hr)
            </button>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartMetric === 'power' ? (
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#8B949E" fontSize={11} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={11} tickLine={false} unit=" kW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161F33',
                    border: '1px solid rgba(0,242,254,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="powerTotal"
                  name="Total Grid Demand (kW)"
                  stroke="#00F2FE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="powerGreen"
                  name="Renewable Solar+Wind (kW)"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGreen)"
                />
              </AreaChart>
            ) : activeChartMetric === 'temperature' ? (
              <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#8B949E" fontSize={11} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={11} tickLine={false} unit="°C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161F33',
                    border: '1px solid rgba(0,242,254,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="externalTemp"
                  name="External Polar Temp (°C)"
                  stroke="#4FACFE"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="indoorTemp"
                  name="Indoor Habitat Temp (°C)"
                  stroke="#FFB800"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : activeChartMetric === 'wind' ? (
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FACFE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4FACFE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#8B949E" fontSize={11} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={11} tickLine={false} unit=" kts" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161F33',
                    border: '1px solid rgba(0,242,254,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="windSpeed"
                  name="Katabatic Wind Velocity (Knots)"
                  stroke="#4FACFE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWind)"
                />
              </AreaChart>
            ) : (
              <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#8B949E" fontSize={11} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={11} tickLine={false} unit=" L/h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161F33',
                    border: '1px solid rgba(0,242,254,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="fuelRate"
                  name="Fuel Burn Rate (Liters/hour)"
                  stroke="#FF4B4B"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
