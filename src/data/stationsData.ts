import type { StationMetadata, ModuleHotspot, LiveTelemetry, SensorDataPoint } from '../types/telemetry';

export const STATIONS_METADATA: Record<'maitri' | 'bharati', StationMetadata> = {
  maitri: {
    id: 'maitri',
    name: 'Maitri Station',
    hindiName: 'मैत्री अनुसंधान केंद्र',
    location: 'Schirmacher Oasis, Queen Maud Land',
    region: 'East Antarctica',
    coordinates: {
      lat: '70° 45′ 57″ S',
      lng: '11° 44′ 09″ E',
      altitude: '117 m ASL',
    },
    commissioned: 1989,
    winterCrew: 25,
    summerCrew: 45,
    currentCrew: 23,
    primaryMission: 'Geomagnetism, Meteorology, Glaciology & Lake Priyadarshini Limnology',
    climateZone: 'Polar Oasis (Cold Desert)',
  },
  bharati: {
    id: 'bharati',
    name: 'Bharati Station',
    hindiName: 'भारती अनुसंधान केंद्र',
    location: 'Larsemann Hills, Prydz Bay',
    region: 'East Antarctica',
    coordinates: {
      lat: '69° 24′ 28″ S',
      lng: '76° 11′ 14″ E',
      altitude: '35 m ASL',
    },
    commissioned: 2012,
    winterCrew: 23,
    summerCrew: 47,
    currentCrew: 28,
    primaryMission: 'Oceanographic studies, Continental break-up geological dating, Atmospheric physics',
    climateZone: 'Coastal Antarctic Cryosphere (Aerodynamic Stilt Architecture)',
  },
};

export const INITIAL_HOTSPOTS: Record<'maitri' | 'bharati', ModuleHotspot[]> = {
  maitri: [
    {
      id: 'gen-power',
      name: 'Main Generator & Power Grid',
      category: 'power',
      status: 'warning',
      position: [-4.0, 2.4, -0.5],
      description: 'Houses 3x 125 kVA Kirloskar Arctic-Grade Diesel Generators with waste heat recovery system for domestic heating loop.',
      temperature: 68.4,
      powerDrawKw: 142.5,
      efficiencyPct: 88.2,
      lastInspection: '4 hrs ago',
      metrics: [
        { label: 'Active Gen Unit', value: 'DG-02 (Lead)', status: 'optimal' },
        { label: 'Auxiliary Standby', value: 'DG-01 (Warm Idle)', status: 'optimal' },
        { label: 'Exhaust Heat Recovery', value: '84.6', unit: '%', status: 'optimal' },
        { label: 'Fuel Feed Pressure', value: '3.8', unit: 'Bar', status: 'warning' },
      ],
      controls: [
        { id: 'aux-gen', label: 'Trigger Auxiliary Generator (DG-03)', type: 'toggle', currentValue: false, description: 'Engage tertiary backup generator in cold standby' },
        { id: 'load-balance', label: 'Automated Load Shifting', type: 'toggle', currentValue: true, description: 'Dynamically cut non-critical scientific loads if primary output dips' },
      ],
    },
    {
      id: 'hvac-living',
      name: 'Living Habitat & Glass Lounge',
      category: 'hvac',
      status: 'optimal',
      position: [-6.5, 2.6, 3.0],
      description: 'Main interconnected Z-shaped living habitat complex and iconic corner panoramic greenhouse observation lounge.',
      temperature: 21.6,
      powerDrawKw: 38.2,
      efficiencyPct: 96.5,
      lastInspection: '1 hr ago',
      metrics: [
        { label: 'Ambient Indoor Temp', value: '21.6', unit: '°C', status: 'optimal' },
        { label: 'Glycol Loop Return', value: '62.0', unit: '°C', status: 'optimal' },
        { label: 'Relative Humidity', value: '36', unit: '%', status: 'optimal' },
        { label: 'CO2 Air Quality', value: '540', unit: 'ppm', status: 'optimal' },
      ],
      controls: [
        { id: 'hvac-boost', label: 'Emergency Habitat Heat Boost', type: 'toggle', currentValue: false, description: 'Max out glycol secondary heat exchanger' },
        { id: 'air-recirc', label: 'Fresh Air Intake Mix', type: 'slider', currentValue: 45, description: 'Percent ratio of fresh cryogenic Antarctic air mixed with filtered air' },
      ],
    },
    {
      id: 'fuel-depot',
      name: 'Fuel Depot & Priyadarshini Line',
      category: 'logistics',
      status: 'warning',
      position: [-6.0, 2.2, -6.5],
      description: 'Arctic Grade Polar Diesel (D-80) bulk container farm and barrel depot with heated insulated trace piping connecting to power plant.',
      temperature: -8.5,
      powerDrawKw: 14.8,
      efficiencyPct: 91.0,
      lastInspection: '2 hrs ago',
      metrics: [
        { label: 'Total Diesel Reserve', value: '74.2', unit: '%', status: 'optimal' },
        { label: 'Line Trace Heating', value: 'Line B Pre-heat Alert', status: 'warning' },
        { label: 'Fuel Viscosity', value: 'Normal (Anti-gel active)', status: 'optimal' },
        { label: 'Leak Detection Sensors', value: 'All 16 Clear', status: 'optimal' },
      ],
      controls: [
        { id: 'heat-line-b', label: 'Pre-Heat Fuel Line B (Recommended)', type: 'toggle', currentValue: false, description: 'Activate high-voltage heat tracing along tank manifold' },
        { id: 'fuel-transfer', label: 'Emergency Valve Lockout', type: 'toggle', currentValue: false, description: 'Isolate tanks in case of pressure anomaly' },
      ],
    },
    {
      id: 'met-station',
      name: 'Meteorological & Atmospheric Tower',
      category: 'weather',
      status: 'optimal',
      position: [3.0, 3.8, 6.0],
      description: 'Continuous surface ozone, UV, solar radiation, automatic weather station (AWS), and upper atmospheric soundings.',
      temperature: -34.8,
      powerDrawKw: 6.2,
      efficiencyPct: 99.1,
      lastInspection: '30 mins ago',
      metrics: [
        { label: 'Wind Velocity', value: '44', unit: 'Knots', status: 'warning' },
        { label: 'Atmospheric Pressure', value: '984.2', unit: 'hPa', status: 'optimal' },
        { label: 'Wind Chill Factor', value: '-48.5', unit: '°C', status: 'warning' },
        { label: 'Visibility', value: '1.8', unit: 'km (Drifting Snow)', status: 'warning' },
      ],
      controls: [
        { id: 'deice-anemometer', label: 'Anemometer Ultrasonic De-Icing', type: 'toggle', currentValue: true, description: 'Heated ultrasonic sensors to prevent riming ice accumulation' },
      ],
    },
    {
      id: 'sat-radome',
      name: 'ISRO Ku-Band Satellite Radome',
      category: 'satellite',
      status: 'optimal',
      position: [7.0, 3.2, -1.0],
      description: 'Primary telemetry uplink dish linking to NCPOR HQ Goa and ISRO Shadnagar ground stations via GSAT constellation.',
      temperature: -14.2,
      powerDrawKw: 11.4,
      efficiencyPct: 97.4,
      lastInspection: '12 mins ago',
      metrics: [
        { label: 'Carrier C/N Ratio', value: '14.8', unit: 'dB', status: 'optimal' },
        { label: 'Uplink Power', value: '42.5', unit: 'W', status: 'optimal' },
        { label: 'Radome Internal Temp', value: '8.4', unit: '°C', status: 'optimal' },
        { label: 'Azimuth Tracking', value: 'Aligned (GSAT-7)', status: 'optimal' },
      ],
      controls: [
        { id: 'radome-heat', label: 'Radome Surface Heating', type: 'toggle', currentValue: true, description: 'Prevent heavy snow pack forming on outer skin' },
      ],
    },
  ],
  bharati: [
    {
      id: 'gen-power',
      name: 'Cogeneration Microgrid Plant',
      category: 'power',
      status: 'optimal',
      position: [0, 2.2, -3.0],
      description: 'State-of-the-art combined heat and power (CHP) unit integrating 3x Volvo Penta Tier-4 Arctic engines with synchronized busbar.',
      temperature: 72.1,
      powerDrawKw: 198.4,
      efficiencyPct: 94.6,
      lastInspection: '3 hrs ago',
      metrics: [
        { label: 'Active Engine', value: 'CHP-A (Synchronized)', status: 'optimal' },
        { label: 'Renewable Hybrid Mix', value: '46.2', unit: '%', status: 'optimal' },
        { label: 'Grid Frequency', value: '50.02', unit: 'Hz', status: 'optimal' },
        { label: 'Thermal Recovery', value: '185', unit: 'kW-thermal', status: 'optimal' },
      ],
      controls: [
        { id: 'aux-gen', label: 'Trigger Auxiliary CHP-B', type: 'toggle', currentValue: false, description: 'Parallel startup of secondary engine' },
        { id: 'grid-islanding', label: 'Green Energy Islanding Mode', type: 'toggle', currentValue: true, description: 'Prioritize wind turbine kinetic storage' },
      ],
    },
    {
      id: 'hvac-living',
      name: 'Panoramic Observation & Living Deck',
      category: 'hvac',
      status: 'optimal',
      position: [-1.5, 4.2, 5.5],
      description: 'Aerodynamic steel hull on stilts featuring the cantilevered panoramic glass observation lounge and climate-controlled living quarters.',
      temperature: 22.4,
      powerDrawKw: 42.0,
      efficiencyPct: 98.2,
      lastInspection: '1 hr ago',
      metrics: [
        { label: 'Core Temp', value: '22.4', unit: '°C', status: 'optimal' },
        { label: 'Structural Tilt Sensor', value: '0.04', unit: 'deg', status: 'optimal' },
        { label: 'Snowdrift Venturi Effect', value: '100% Free Under Stilt Deck', status: 'optimal' },
        { label: 'Greywater Reclamation', value: '92', unit: '%', status: 'optimal' },
      ],
      controls: [
        { id: 'hvac-boost', label: 'HVAC Polar Storm Mode', type: 'toggle', currentValue: false, description: 'Seal external dampers and recirculate conditioned air' },
      ],
    },
    {
      id: 'wind-farm',
      name: 'Arctic Ruggedized Wind Turbines',
      category: 'power',
      status: 'optimal',
      position: [-10.0, 4.5, -6.0],
      description: 'Specially engineered low-temperature horizontal-axis wind turbines supplying clean kinetic energy during high katabatic winds.',
      temperature: -31.2,
      powerDrawKw: -92.5,
      efficiencyPct: 92.8,
      lastInspection: '5 hrs ago',
      metrics: [
        { label: 'Active Clean Generation', value: '92.5', unit: 'kW', status: 'optimal' },
        { label: 'Blade Rotor RPM', value: '186', unit: 'RPM', status: 'optimal' },
        { label: 'Turbine Brake Status', value: 'Disengaged', status: 'optimal' },
        { label: 'Pitch Control Angle', value: '14.2', unit: '°', status: 'optimal' },
      ],
      controls: [
        { id: 'feather-blades', label: 'Feather Turbine Blades (Storm Lock)', type: 'toggle', currentValue: false, description: 'Lock rotor to avoid damage during winds > 90 knots' },
      ],
    },
    {
      id: 'fuel-depot',
      name: 'Cryogenic Fuel Containers & Staging',
      category: 'logistics',
      status: 'optimal',
      position: [8.5, 1.8, 3.5],
      description: 'Standardized ISO Arctic containers and vacuum-insulated fuel tanks storing Jet A-1 kerosene and arctic diesel.',
      temperature: -4.2,
      powerDrawKw: 12.0,
      efficiencyPct: 96.0,
      lastInspection: '6 hrs ago',
      metrics: [
        { label: 'Bulk Storage Capacity', value: '81.4', unit: '%', status: 'optimal' },
        { label: 'Fuel Temperature', value: '-2.1', unit: '°C', status: 'optimal' },
        { label: 'Pumping Rate', value: '45', unit: 'L/min', status: 'optimal' },
        { label: 'Vapor Pressure', value: 'Nominal', status: 'optimal' },
      ],
      controls: [
        { id: 'bunker-heat', label: 'Bunker Thermal Insulation Blanket', type: 'toggle', currentValue: true, description: 'Continuous thermal maintainer' },
      ],
    },
    {
      id: 'sat-radome',
      name: 'Rooftop Observation Terrace & Antennas',
      category: 'satellite',
      status: 'optimal',
      position: [0, 5.5, 0],
      description: 'Upper observation terrace with safety railings, high-bandwidth satellite uplink radome, and meteorological sensors.',
      temperature: -18.0,
      powerDrawKw: 16.5,
      efficiencyPct: 98.8,
      lastInspection: '45 mins ago',
      metrics: [
        { label: 'Bandwidth Downlink', value: '10.2', unit: 'Mbps', status: 'optimal' },
        { label: 'ISRO Pass Schedule', value: 'RISAT-2B in 22 min', status: 'optimal' },
        { label: 'Servo Motor Temp', value: '28.4', unit: '°C', status: 'optimal' },
        { label: 'Signal Quality', value: '98', unit: '%', status: 'optimal' },
      ],
      controls: [
        { id: 'switch-polar-orbit', label: 'Track Polar Orbiting Satellite', type: 'button', currentValue: 0, description: 'Recalibrate tracking servos for upcoming satellite pass' },
      ],
    },
  ],
};

export const INITIAL_TELEMETRY: Record<'maitri' | 'bharati', LiveTelemetry> = {
  maitri: {
    timestamp: new Date().toISOString(),
    externalTemp: -36.4,
    windChill: -49.8,
    windSpeedKnots: 46.2,
    indoorTemp: 21.6,
    powerConsumptionKw: 188.4,
    solarGenKw: 18.2,
    windGenKw: 62.4,
    dieselGenKw: 107.8,
    fuelReservePct: 74.2,
    batteryPct: 88,
    waterReserveLiters: 16400,
    atmosphericPressureHpa: 982.5,
    satelliteLatencyMs: 620,
    satelliteDownlinkKbps: 2048,
    satelliteSignalPct: 86,
    solarRadiationWm2: 142,
  },
  bharati: {
    timestamp: new Date().toISOString(),
    externalTemp: -32.8,
    windChill: -44.2,
    windSpeedKnots: 38.5,
    indoorTemp: 22.4,
    powerConsumptionKw: 212.0,
    solarGenKw: 28.5,
    windGenKw: 92.5,
    dieselGenKw: 91.0,
    fuelReservePct: 81.4,
    batteryPct: 94,
    waterReserveLiters: 24800,
    atmosphericPressureHpa: 989.1,
    satelliteLatencyMs: 480,
    satelliteDownlinkKbps: 4096,
    satelliteSignalPct: 94,
    solarRadiationWm2: 195,
  },
};

// Generate realistic 24-hr historical telemetry curve for charts
export function generateHistoricalData(stationId: 'maitri' | 'bharati'): SensorDataPoint[] {
  const points: SensorDataPoint[] = [];
  const baseTemp = stationId === 'maitri' ? -35 : -31;
  const basePower = stationId === 'maitri' ? 180 : 205;

  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600 * 1000);
    const hourStr = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // diurnal variation in Antarctica
    const sineFactor = Math.sin((i / 24) * Math.PI * 2);
    const extTemp = +(baseTemp + sineFactor * 4 + (Math.random() * 2 - 1)).toFixed(1);
    const inTemp = +(21.5 + (Math.random() * 0.8 - 0.4)).toFixed(1);
    const wind = +(35 + Math.cos(i / 4) * 12 + Math.random() * 6).toFixed(1);
    const powerTotal = +(basePower + Math.sin(i / 3) * 20 + Math.random() * 8).toFixed(1);
    const greenRatio = 0.42 + Math.sin(i / 5) * 0.15;
    const powerGreen = +(powerTotal * greenRatio).toFixed(1);
    const fuelRate = +(18.5 + (powerTotal - powerGreen) * 0.08).toFixed(2);

    points.push({
      time: hourStr,
      externalTemp: extTemp,
      indoorTemp: inTemp,
      windSpeed: wind,
      powerTotal,
      powerGreen,
      fuelRate,
    });
  }
  return points;
}
