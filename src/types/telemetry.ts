export type StationId = 'maitri' | 'bharati';

export type SystemStatus = 'optimal' | 'warning' | 'critical' | 'offline';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type ActiveTab = 'twin' | 'energy' | 'logistics' | 'ai' | 'controls';

export interface StationMetadata {
  id: StationId;
  name: string;
  hindiName: string;
  location: string;
  region: string;
  coordinates: {
    lat: string;
    lng: string;
    altitude: string;
  };
  commissioned: number;
  winterCrew: number;
  summerCrew: number;
  currentCrew: number;
  primaryMission: string;
  climateZone: string;
}

export interface ModuleHotspot {
  id: string;
  name: string;
  category: 'power' | 'hvac' | 'logistics' | 'weather' | 'science' | 'satellite';
  status: SystemStatus;
  position: [number, number, number]; // 3D coordinates in scene
  description: string;
  temperature: number;
  powerDrawKw: number;
  efficiencyPct: number;
  lastInspection: string;
  metrics: {
    label: string;
    value: string | number;
    unit?: string;
    status: SystemStatus;
  }[];
  controls: {
    id: string;
    label: string;
    type: 'toggle' | 'slider' | 'button';
    currentValue: boolean | number;
    description: string;
  }[];
}

export interface LiveTelemetry {
  timestamp: string;
  externalTemp: number; // e.g. -34.8 °C
  windChill: number; // e.g. -48.2 °C
  windSpeedKnots: number; // e.g. 42 kts
  indoorTemp: number; // e.g. 21.4 °C
  powerConsumptionKw: number; // e.g. 184 kW
  solarGenKw: number; // e.g. 35 kW
  windGenKw: number; // e.g. 78 kW
  dieselGenKw: number; // e.g. 80 kW
  fuelReservePct: number; // e.g. 74.2%
  batteryPct: number; // e.g. 91%
  waterReserveLiters: number; // e.g. 18,400 L
  atmosphericPressureHpa: number; // e.g. 984 hPa
  satelliteLatencyMs: number; // e.g. 580 ms
  satelliteDownlinkKbps: number; // e.g. 256 kbps in sat mode, 4096 kbps in normal
  satelliteSignalPct: number; // e.g. 88%
  solarRadiationWm2: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'fuel' | 'food' | 'medical' | 'spares' | 'oxygen';
  currentStock: number;
  maxStock: number;
  unit: string;
  dailyConsumption: number;
  daysRemaining: number;
  minimumThresholdPct: number;
  status: 'adequate' | 'warning' | 'critical';
  storageLocation: string;
  resupplyPriority: 'high' | 'medium' | 'low';
}

export interface StationAlert {
  id: string;
  stationId: StationId;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  sourceModule: string;
  aiRecommendation?: string;
  actionRequired?: string;
  resolved: boolean;
  acknowledged: boolean;
}

export interface SensorDataPoint {
  time: string;
  externalTemp: number;
  indoorTemp: number;
  windSpeed: number;
  powerTotal: number;
  powerGreen: number;
  fuelRate: number;
}
