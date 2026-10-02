import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  StationId,
  ActiveTab,
  LiveTelemetry,
  ModuleHotspot,
  InventoryItem,
  StationAlert,
  SensorDataPoint,
} from '../types/telemetry';
import {
  INITIAL_HOTSPOTS,
  INITIAL_TELEMETRY,
  generateHistoricalData,
} from '../data/stationsData';
import { INITIAL_INVENTORY } from '../data/inventoryData';
import { INITIAL_ALERTS } from '../data/aiInsightsData';

interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
}

interface TelemetryContextType {
  activeStation: StationId;
  setActiveStation: (station: StationId) => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (mode: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedHotspot: ModuleHotspot | null;
  setSelectedHotspot: (hotspot: ModuleHotspot | null) => void;
  
  telemetry: LiveTelemetry;
  allTelemetry: Record<StationId, LiveTelemetry>;
  historicalData: SensorDataPoint[];
  hotspots: ModuleHotspot[];
  alerts: StationAlert[];
  inventory: InventoryItem[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;

  // Actions
  triggerControlAction: (moduleId: string, controlId: string, value: boolean | number) => void;
  resolveAlert: (alertId: string) => void;
  executeAiAction: (actionId: string, customMessage?: string) => void;
  reorderInventoryItem: (itemId: string, requestedAmount?: number) => void;
  
  // Real-time metrics
  lastPacketTimestamp: Date;
  packetCount: number;
  dataTransferRateKbps: number;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStation, setActiveStationState] = useState<StationId>('maitri');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('twin');
  const [selectedHotspot, setSelectedHotspot] = useState<ModuleHotspot | null>(null);

  const [allTelemetry, setAllTelemetry] = useState<Record<StationId, LiveTelemetry>>(INITIAL_TELEMETRY);
  const [hotspotsData, setHotspotsData] = useState<Record<StationId, ModuleHotspot[]>>(INITIAL_HOTSPOTS);
  const [alertsData, setAlertsData] = useState<Record<StationId, StationAlert[]>>(INITIAL_ALERTS);
  const [inventoryData, setInventoryData] = useState<Record<StationId, InventoryItem[]>>(INITIAL_INVENTORY);
  const [historyData, setHistoryData] = useState<Record<StationId, SensorDataPoint[]>>({
    maitri: generateHistoricalData('maitri'),
    bharati: generateHistoricalData('bharati'),
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [lastPacketTimestamp, setLastPacketTimestamp] = useState<Date>(new Date());
  const [packetCount, setPacketCount] = useState<number>(1420);

  const addToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const newToast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setActiveStation = useCallback((station: StationId) => {
    setActiveStationState(station);
    setSelectedHotspot(null);
    addToast('info', 'Station Shift Acknowledged', `Telemetry feed switched to ${station === 'maitri' ? 'Maitri' : 'Bharati'} Station.`);
  }, [addToast]);

  // Real-time sensor simulation loop (updates every 2.5s, or 6s in low-bandwidth mode)
  useEffect(() => {
    const updateInterval = lowBandwidthMode ? 6000 : 2400;

    const intervalId = setInterval(() => {
      setLastPacketTimestamp(new Date());
      setPacketCount((p) => p + 1);

      setAllTelemetry((prev) => {
        const currentMaitri = prev.maitri;
        const currentBharati = prev.bharati;

        // Realistic subtle fluctuation with physical bounds
        const dTempM = (Math.random() * 0.4 - 0.2);
        const dWindM = (Math.random() * 2.0 - 1.0);
        const dPowerM = (Math.random() * 3.0 - 1.5);
        const dSolarM = Math.max(0, Math.min(35, currentMaitri.solarGenKw + (Math.random() * 1.0 - 0.5)));
        const dWindGenM = Math.max(15, Math.min(90, currentMaitri.windGenKw + (Math.random() * 2.0 - 1.0)));

        const nextMaitri: LiveTelemetry = {
          ...currentMaitri,
          timestamp: new Date().toISOString(),
          externalTemp: +(currentMaitri.externalTemp + dTempM).toFixed(1),
          windChill: +(currentMaitri.externalTemp + dTempM - 13.5 - Math.random() * 0.5).toFixed(1),
          windSpeedKnots: Math.max(10, Math.min(85, +(currentMaitri.windSpeedKnots + dWindM).toFixed(1))),
          indoorTemp: +(21.5 + (Math.random() * 0.2 - 0.1)).toFixed(1),
          powerConsumptionKw: +(currentMaitri.powerConsumptionKw + dPowerM).toFixed(1),
          solarGenKw: +dSolarM.toFixed(1),
          windGenKw: +dWindGenM.toFixed(1),
          dieselGenKw: Math.max(40, +(currentMaitri.powerConsumptionKw - dSolarM - dWindGenM).toFixed(1)),
          fuelReservePct: Math.max(20, +(currentMaitri.fuelReservePct - 0.001).toFixed(3)),
          satelliteLatencyMs: lowBandwidthMode ? 950 + Math.floor(Math.random() * 80) : 560 + Math.floor(Math.random() * 40),
          satelliteDownlinkKbps: lowBandwidthMode ? 256 : 3840 + Math.floor(Math.random() * 256),
        };

        const dTempB = (Math.random() * 0.3 - 0.15);
        const dWindB = (Math.random() * 1.8 - 0.9);
        const dPowerB = (Math.random() * 3.5 - 1.7);
        const dWindGenB = Math.max(40, Math.min(120, currentBharati.windGenKw + (Math.random() * 2.5 - 1.2)));
        const dSolarB = Math.max(0, Math.min(45, currentBharati.solarGenKw + (Math.random() * 1.2 - 0.6)));

        const nextBharati: LiveTelemetry = {
          ...currentBharati,
          timestamp: new Date().toISOString(),
          externalTemp: +(currentBharati.externalTemp + dTempB).toFixed(1),
          windChill: +(currentBharati.externalTemp + dTempB - 12.0 - Math.random() * 0.5).toFixed(1),
          windSpeedKnots: Math.max(10, Math.min(80, +(currentBharati.windSpeedKnots + dWindB).toFixed(1))),
          indoorTemp: +(22.4 + (Math.random() * 0.2 - 0.1)).toFixed(1),
          powerConsumptionKw: +(currentBharati.powerConsumptionKw + dPowerB).toFixed(1),
          solarGenKw: +dSolarB.toFixed(1),
          windGenKw: +dWindGenB.toFixed(1),
          dieselGenKw: Math.max(30, +(currentBharati.powerConsumptionKw - dSolarB - dWindGenB).toFixed(1)),
          fuelReservePct: Math.max(20, +(currentBharati.fuelReservePct - 0.001).toFixed(3)),
          satelliteLatencyMs: lowBandwidthMode ? 820 + Math.floor(Math.random() * 60) : 440 + Math.floor(Math.random() * 30),
          satelliteDownlinkKbps: lowBandwidthMode ? 384 : 5120 + Math.floor(Math.random() * 300),
        };

        return {
          maitri: nextMaitri,
          bharati: nextBharati,
        };
      });

      // Update real-time chart array
      setHistoryData((prev) => {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        
        return {
          maitri: [
            ...prev.maitri.slice(1),
            {
              time: timeNow,
              externalTemp: allTelemetry.maitri.externalTemp,
              indoorTemp: allTelemetry.maitri.indoorTemp,
              windSpeed: allTelemetry.maitri.windSpeedKnots,
              powerTotal: allTelemetry.maitri.powerConsumptionKw,
              powerGreen: +(allTelemetry.maitri.solarGenKw + allTelemetry.maitri.windGenKw).toFixed(1),
              fuelRate: +(18.2 + Math.random() * 0.5).toFixed(2),
            },
          ],
          bharati: [
            ...prev.bharati.slice(1),
            {
              time: timeNow,
              externalTemp: allTelemetry.bharati.externalTemp,
              indoorTemp: allTelemetry.bharati.indoorTemp,
              windSpeed: allTelemetry.bharati.windSpeedKnots,
              powerTotal: allTelemetry.bharati.powerConsumptionKw,
              powerGreen: +(allTelemetry.bharati.solarGenKw + allTelemetry.bharati.windGenKw).toFixed(1),
              fuelRate: +(15.8 + Math.random() * 0.4).toFixed(2),
            },
          ],
        };
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [lowBandwidthMode, allTelemetry.maitri, allTelemetry.bharati]);

  // Keep selectedHotspot reference up-to-date with any control state changes
  useEffect(() => {
    if (selectedHotspot) {
      const currentList = hotspotsData[activeStation];
      const updated = currentList.find((h) => h.id === selectedHotspot.id);
      if (updated) setSelectedHotspot(updated);
    }
  }, [hotspotsData, activeStation]);

  const triggerControlAction = useCallback((moduleId: string, controlId: string, value: boolean | number) => {
    setHotspotsData((prev) => {
      const stationList = prev[activeStation];
      const nextList = stationList.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          controls: mod.controls.map((ctrl) => {
            if (ctrl.id !== controlId) return ctrl;
            return { ...ctrl, currentValue: value };
          }),
        };
      });
      return { ...prev, [activeStation]: nextList };
    });

    const valStr = typeof value === 'boolean' ? (value ? 'ENGAGED' : 'DISENGAGED') : `${value}`;
    addToast('success', 'Control Command Dispatched', `Command [${controlId} -> ${valStr}] transmitted via Ku-band link to ${activeStation.toUpperCase()}.`);
  }, [activeStation, addToast]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlertsData((prev) => {
      const list = prev[activeStation];
      const nextList = list.map((a) => (a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a));
      return { ...prev, [activeStation]: nextList };
    });
    addToast('info', 'Alert Resolved', `Alert [${alertId}] marked as resolved by operator.`);
  }, [activeStation, addToast]);

  const executeAiAction = useCallback((actionId: string, customMessage?: string) => {
    // 1. If action is heat-line-b
    if (actionId === 'heat-line-b') {
      triggerControlAction('fuel-depot', 'heat-line-b', true);
      // mark critical fuel alert resolved
      setAlertsData((prev) => {
        const list = prev[activeStation];
        const nextList = list.map((a) => (a.id === 'alt-001' ? { ...a, resolved: true, acknowledged: true } : a));
        return { ...prev, [activeStation]: nextList };
      });
      // improve hotspot status
      setHotspotsData((prev) => {
        const list = prev[activeStation].map((m) => {
          if (m.id === 'fuel-depot') {
            return {
              ...m,
              status: 'optimal' as const,
              metrics: m.metrics.map((met) => met.label.includes('Line Trace') ? { ...met, value: 'Line B Pre-Heat ACTIVE (18°C)', status: 'optimal' as const } : met),
            };
          }
          return m;
        });
        return { ...prev, [activeStation]: list };
      });
    } else if (actionId === 'aux-gen') {
      triggerControlAction('gen-power', 'aux-gen', true);
    } else if (actionId === 'feather-blades') {
      triggerControlAction('wind-farm', 'feather-blades', true);
    } else if (actionId === 'load-balance') {
      triggerControlAction('gen-power', 'load-balance', true);
    }

    addToast(
      'success',
      'AI Recommendation Executed',
      customMessage || `Automated digital twin closed-loop action [${actionId}] successfully synchronized with station PLCs.`
    );
  }, [activeStation, triggerControlAction, addToast]);

  const reorderInventoryItem = useCallback((itemId: string, requestedAmount = 100) => {
    setInventoryData((prev) => {
      const list = prev[activeStation];
      const nextList = list.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          currentStock: Math.min(item.maxStock, item.currentStock + requestedAmount),
          status: 'adequate' as const,
          daysRemaining: Math.round(item.daysRemaining + requestedAmount / (item.dailyConsumption || 1)),
        };
      });
      return { ...prev, [activeStation]: nextList };
    });

    addToast('success', 'Resupply Order Queued', `Priority expedition requisition for item [${itemId}] transmitted to NCPOR Logistics Cell, Goa.`);
  }, [activeStation, addToast]);

  const value = useMemo(() => ({
    activeStation,
    setActiveStation,
    lowBandwidthMode,
    setLowBandwidthMode,
    activeTab,
    setActiveTab,
    selectedHotspot,
    setSelectedHotspot,
    telemetry: allTelemetry[activeStation],
    allTelemetry,
    historicalData: historyData[activeStation],
    hotspots: hotspotsData[activeStation],
    alerts: alertsData[activeStation],
    inventory: inventoryData[activeStation],
    toasts,
    dismissToast,
    triggerControlAction,
    resolveAlert,
    executeAiAction,
    reorderInventoryItem,
    lastPacketTimestamp,
    packetCount,
    dataTransferRateKbps: lowBandwidthMode ? 128 : 2840,
  }), [
    activeStation,
    setActiveStation,
    lowBandwidthMode,
    setLowBandwidthMode,
    activeTab,
    setActiveTab,
    selectedHotspot,
    setSelectedHotspot,
    allTelemetry,
    historyData,
    hotspotsData,
    alertsData,
    inventoryData,
    toasts,
    dismissToast,
    triggerControlAction,
    resolveAlert,
    executeAiAction,
    reorderInventoryItem,
    lastPacketTimestamp,
    packetCount,
  ]);

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetry = (): TelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
