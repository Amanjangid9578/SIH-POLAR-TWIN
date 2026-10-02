import React from 'react';

interface GaugeWidgetProps {
  title: string;
  subtitle?: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  thresholds?: {
    warning: number;
    critical: number;
  };
  colorScheme?: 'cyan' | 'green' | 'amber' | 'blue' | 'crimson';
  footerText?: string;
  secondaryValue?: string;
  secondaryLabel?: string;
  icon?: React.ReactNode;
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  title,
  subtitle,
  value,
  unit,
  min,
  max,
  colorScheme = 'cyan',
  footerText,
  secondaryValue,
  secondaryLabel,
  icon,
}) => {
  // Normalize percentage for arc gauge
  const clampedVal = Math.max(min, Math.min(max, value));
  const percentage = ((clampedVal - min) / (max - min)) * 100;

  // Arc calculation (240 degree gauge)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (percentage * 0.66)) / 100;

  const colorGradients = {
    cyan: {
      from: '#00F2FE',
      to: '#4FACFE',
      glow: 'shadow-glow-cyan',
      text: 'text-polar-cyan',
      stroke: 'url(#gradient-cyan)',
    },
    green: {
      from: '#10B981',
      to: '#34D399',
      glow: 'shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]',
      text: 'text-polar-success',
      stroke: 'url(#gradient-green)',
    },
    amber: {
      from: '#FFB800',
      to: '#F59E0B',
      glow: 'shadow-glow-warning',
      text: 'text-polar-warning',
      stroke: 'url(#gradient-amber)',
    },
    blue: {
      from: '#4FACFE',
      to: '#00F2FE',
      glow: 'shadow-glow-blue',
      text: 'text-polar-blue',
      stroke: 'url(#gradient-blue)',
    },
    crimson: {
      from: '#FF4B4B',
      to: '#DC2626',
      glow: 'shadow-glow-alert',
      text: 'text-polar-alert',
      stroke: 'url(#gradient-crimson)',
    },
  };

  const scheme = colorGradients[colorScheme];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-polar-card border border-polar-border hover:border-polar-cyan/30 transition-all flex flex-col justify-between shadow-glass relative overflow-hidden group">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-polar-textMuted flex items-center gap-1.5 font-semibold">
            {icon}
            {title}
          </span>
          {subtitle && (
            <p className="text-[10px] text-polar-textMuted mt-0.5 font-mono">{subtitle}</p>
          )}
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-polar-dark/80 border border-polar-border ${scheme.text} font-bold`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="100%" stopColor="#4FACFE" />
            </linearGradient>
            <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gradient-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4B4B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4FACFE" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.34}
            strokeLinecap="round"
          />

          {/* Dynamic Active Progress Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={scheme.stroke}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numerical Value HUD */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {value > 0 && unit.includes('°C') ? `+${value}` : value}
          </span>
          <span className="text-[11px] font-mono text-polar-textMuted uppercase font-semibold">
            {unit}
          </span>
        </div>
      </div>

      {/* Secondary Metric & Footer Description */}
      <div className="pt-2 border-t border-polar-border/60 flex items-center justify-between text-xs font-mono">
        {secondaryLabel ? (
          <div>
            <span className="text-[10px] text-polar-textMuted">{secondaryLabel}:</span>{' '}
            <strong className="text-white font-semibold">{secondaryValue}</strong>
          </div>
        ) : (
          <span className="text-[10px] text-polar-textMuted">Range: {min} – {max} {unit}</span>
        )}

        {footerText && (
          <span className={`text-[10px] font-medium ${scheme.text}`}>{footerText}</span>
        )}
      </div>
    </div>
  );
};
