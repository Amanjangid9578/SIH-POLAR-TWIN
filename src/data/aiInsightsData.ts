import type { StationAlert } from '../types/telemetry';

export interface AiPredictiveModel {
  id: string;
  name: string;
  confidenceScore: number;
  anomalyDetected: boolean;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  prediction: string;
  physicsContext: string;
  recommendedAction: string;
  actionId: string;
  actionButtonText: string;
  timeWindow: string;
  sourceModule: string;
}

export const INITIAL_ALERTS: Record<'maitri' | 'bharati', StationAlert[]> = {
  maitri: [
    {
      id: 'alt-001',
      stationId: 'maitri',
      timestamp: 'Just now',
      severity: 'critical',
      title: 'Cryogenic Fuel Line Viscosity Alert',
      message: 'Sub-zero thermal drop along Line B manifold indicates potential wax precipitation risk at -36.4°C.',
      sourceModule: 'Fuel Depot & Priyadarshini Line',
      aiRecommendation: 'Activate high-voltage heat tracing along tank manifold Line B immediately.',
      actionRequired: 'Pre-heat Fuel Line B',
      resolved: false,
      acknowledged: false,
    },
    {
      id: 'alt-002',
      stationId: 'maitri',
      timestamp: '14 min ago',
      severity: 'warning',
      title: 'Katabatic Blizzard Acceleration (> 45 kts)',
      message: 'Schirmacher Oasis micro-barometer dropped 6.2 hPa over 2 hours. Gale force wind gusts approaching 55 kts.',
      sourceModule: 'Meteorological Tower',
      aiRecommendation: 'Lock external hatches, enable ultrasonic anemometer de-icing and prep DG-02 reserve boost.',
      actionRequired: 'Initiate Blizzard Protocol Bravo',
      resolved: false,
      acknowledged: true,
    },
    {
      id: 'alt-003',
      stationId: 'maitri',
      timestamp: '42 min ago',
      severity: 'info',
      title: 'Lake Priyadarshini Limnological Probe Sync',
      message: 'Telemetry packet received from water sensor at 4.2m under ice cap. Water temperature stable at +2.1°C.',
      sourceModule: 'Scientific Laboratories',
      aiRecommendation: 'Nominal baseline recorded. No operational intervention required.',
      resolved: true,
      acknowledged: true,
    },
    {
      id: 'alt-004',
      stationId: 'maitri',
      timestamp: '1 hr ago',
      severity: 'warning',
      title: 'DG Fuel Injector Spares Below Safety Buffer',
      message: 'Only 3 spare fuel injector sets remaining in inventory (Threshold: 5 sets). Next vessel arrives in 86 days.',
      sourceModule: 'Logistics Depot',
      aiRecommendation: 'Transmit expedited air-drop manifest request to NCPOR Operations HQ.',
      actionRequired: 'Queue Expedition Reorder',
      resolved: false,
      acknowledged: false,
    },
  ],
  bharati: [
    {
      id: 'alt-101',
      stationId: 'bharati',
      timestamp: '2 min ago',
      severity: 'warning',
      title: 'Wind Turbine WT-02 Harmonic Vibration',
      message: 'Fast Fourier Transform (FFT) vibration sensor on nacelle bearing detected 4.2 mm/s harmonic anomaly under 40 knot gusts.',
      sourceModule: 'Wind Turbines',
      aiRecommendation: 'Pitch rotor blades by +3.5° to damp aerodynamic resonance.',
      actionRequired: 'Auto-Damp Rotor Pitch',
      resolved: false,
      acknowledged: false,
    },
    {
      id: 'alt-102',
      stationId: 'bharati',
      timestamp: '18 min ago',
      severity: 'critical',
      title: 'Hydroponic Nutrient Chamber Level Critical',
      message: 'Fresh greens reservoir has 8 days of operational buffer remaining. Seedling germination cycle delayed by 48 hrs.',
      sourceModule: 'Living Habitat & Galley',
      aiRecommendation: 'Rebalance pH to 6.2 and activate LED vegetative photon spectrum to accelerate harvest cycle.',
      actionRequired: 'Boost Hydroponic Lighting',
      resolved: false,
      acknowledged: true,
    },
    {
      id: 'alt-103',
      stationId: 'bharati',
      timestamp: '1 hr ago',
      severity: 'info',
      title: 'ISRO RISAT-2B Telemetry Ground Pass Success',
      message: '4.8 GB of synthetic aperture radar (SAR) cryosphere imagery downlinked to Goa station at 10.2 Mbps.',
      sourceModule: 'Ku/X-Band Radome',
      aiRecommendation: 'Downlink complete with 0 packet loss.',
      resolved: true,
      acknowledged: true,
    },
  ],
};

export const AI_PREDICTIVE_MODELS: Record<'maitri' | 'bharati', AiPredictiveModel[]> = {
  maitri: [
    {
      id: 'ai-01',
      name: 'Neural Cryo-Viscosity Predictor (PyTorch GRU)',
      confidenceScore: 94.6,
      anomalyDetected: true,
      severity: 'critical',
      title: 'Wind Chill Drop to -48°C: Fuel Line Gel Risk',
      prediction: 'Without intervention, Diesel Fuel Line B manifold temperature will breach freezing crystallization point (-12°C) in 38 minutes.',
      physicsContext: 'Ambient temperature -36.4°C + 46.2 knot wind creates convective heat transfer loss of 480 W/m² along unshielded flange.',
      recommendedAction: 'Pre-heat Fuel Line B and ramp trace heating to 100% capacity.',
      actionId: 'heat-line-b',
      actionButtonText: 'Execute: Pre-Heat Fuel Line B',
      timeWindow: 'Next 35 minutes',
      sourceModule: 'Fuel Depot & Priyadarshini Line',
    },
    {
      id: 'ai-02',
      name: 'Microgrid Energy Forecaster (LSTM)',
      confidenceScore: 91.2,
      anomalyDetected: true,
      severity: 'warning',
      title: 'Katabatic Wind Surge vs Solar Drop',
      prediction: 'Incoming storm cloud layer will reduce solar panel output to 0 kW by 16:00 UTC. Wind turbine generation will increase to 95 kW.',
      physicsContext: 'Net power balance requires DG-01 to remain in hot standby mode to absorb transient frequency dips.',
      recommendedAction: 'Engage Automated Load Shifting protocol and keep DG-01 warmed.',
      actionId: 'load-balance',
      actionButtonText: 'Arm Automated Load Shifting',
      timeWindow: 'Next 2 hours',
      sourceModule: 'Main Generator & Power Grid',
    },
    {
      id: 'ai-03',
      name: 'Structural Thermal Envelope Digital Twin',
      confidenceScore: 98.0,
      anomalyDetected: false,
      severity: 'info',
      title: 'Habitat Thermal Insulation Efficiency 96.5%',
      prediction: 'Living modules retaining optimal heat retention with 0.8°C thermal loss per hour under gale conditions.',
      physicsContext: 'Triple-layer polyurethane sandwich panels functioning well within MoES Antarctic structural standards.',
      recommendedAction: 'Maintain current 21.6°C indoor setpoint.',
      actionId: 'hvac-boost',
      actionButtonText: 'Status Optimal (No Action)',
      timeWindow: 'Next 24 hours',
      sourceModule: 'Living Habitat & HVAC Heating',
    },
  ],
  bharati: [
    {
      id: 'ai-11',
      name: 'Aerodynamic Stilt & Wind Resonance AI',
      confidenceScore: 92.4,
      anomalyDetected: true,
      severity: 'warning',
      title: 'Wind Turbine Harmonic Damping Recommendation',
      prediction: 'Blade pitch resonance at 186 RPM threatens bearing fatigue if wind exceeds 45 knots over 30 consecutive minutes.',
      physicsContext: 'Aeroelastic flutter risk index 0.68. Dynamic pitch correction can suppress resonant eddy frequencies.',
      recommendedAction: 'Apply dynamic pitch feathering (+3.5°) to suppress resonance.',
      actionId: 'feather-blades',
      actionButtonText: 'Apply Dynamic Blade Pitch',
      timeWindow: 'Next 45 minutes',
      sourceModule: 'Wind Turbines',
    },
    {
      id: 'ai-12',
      name: 'Cryogenic Vacuum Storage Analyzer',
      confidenceScore: 97.8,
      anomalyDetected: false,
      severity: 'info',
      title: 'Double-Skin Bunker Vacuum Insulation Nominal',
      prediction: 'Vacuum jacket pressure stable at 10⁻⁴ Torr. Zero boil-off or thermal bridge detected.',
      physicsContext: 'Thermal siphon system efficiently recirculating waste heat from CHP exhaust.',
      recommendedAction: 'Continue standard 6-hour logging cycle.',
      actionId: 'bunker-heat',
      actionButtonText: 'Bunker Insulated',
      timeWindow: 'Next 72 hours',
      sourceModule: 'Fuel Depot Bunker',
    },
  ],
};
