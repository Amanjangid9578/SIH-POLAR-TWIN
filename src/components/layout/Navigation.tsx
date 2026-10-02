import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import type { ActiveTab } from '../../types/telemetry';
import {
  Boxes,
  Zap,
  PackageCheck,
  BrainCircuit,
  SlidersHorizontal,
} from 'lucide-react';

interface TabItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: number;
  badgeVariant?: 'alert' | 'warning' | 'info';
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, alerts, inventory } = useTelemetry();

  const criticalAlerts = alerts.filter((a) => !a.resolved && a.severity === 'critical').length;
  const lowStockCount = inventory.filter((i) => i.status === 'critical' || i.status === 'warning').length;

  const tabs: TabItem[] = [
    {
      id: 'twin',
      label: '3D Digital Twin & Spatial Map',
      shortLabel: '3D Twin',
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      id: 'energy',
      label: 'Energy & Infrastructure Telemetry',
      shortLabel: 'Energy & Grid',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'logistics',
      label: 'Logistics & Resupply Tracker',
      shortLabel: 'Logistics',
      icon: <PackageCheck className="w-4 h-4" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeVariant: 'warning',
    },
    {
      id: 'ai',
      label: 'Predictive AI & Anomaly Center',
      shortLabel: 'AI Anomalies',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: criticalAlerts > 0 ? criticalAlerts : undefined,
      badgeVariant: 'alert',
    },
    {
      id: 'controls',
      label: 'Station Override & Command Center',
      shortLabel: 'Controls',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="w-full border-b border-polar-border bg-polar-dark/80 backdrop-blur-md px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-polar-card text-white border border-polar-cyan/50 shadow-glow-cyan'
                  : 'text-polar-textMuted hover:text-white hover:bg-polar-card/40 border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-polar-cyan' : 'text-polar-textMuted'}>
                {tab.icon}
              </span>
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.shortLabel}</span>

              {tab.badge !== undefined && (
                <span
                  className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    tab.badgeVariant === 'alert'
                      ? 'bg-polar-alert text-white animate-pulse'
                      : 'bg-polar-warning/20 text-polar-warning border border-polar-warning/40'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-polar-cyan to-polar-blue rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
