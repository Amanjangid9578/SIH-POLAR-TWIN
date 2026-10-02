# NCPOR PolarOps: Digital Twin Platform for Remote Management of Indian Antarctic Stations (Maitri & Bharati)

**Smart India Hackathon (SIH) 2026**  
**Problem Statement ID:** 26060  
**Organization:** Ministry of Earth Sciences (MoES) / National Centre for Polar and Ocean Research (NCPOR)  
**Theme:** Space Technology / Disaster Management / Renewable Energy / Digital Twin  

---

## 🧊 Overview
**NCPOR PolarOps** is an award-winning, production-grade Digital Twin web platform engineered for real-time remote monitoring, microgrid energy management, logistics tracking, and predictive AI anomaly mitigation for India's two operational scientific bases in Antarctica:
- **Maitri Station** (Queen Maud Land, Schirmacher Oasis: 70° 45′ 57″ S, 11° 44′ 09″ E)
- **Bharati Station** (Larsemann Hills, Prydz Bay: 69° 24′ 28″ S, 76° 11′ 14″ E)

---

## 🚀 Key Features

### 1. 3D Digital Twin & Spatial Map (Hero Canvas)
- **Interactive Three.js WebGL Canvas**:
  - Procedural cryosphere terrain (undulating snow dunes, rocky nunataks, and Lake Priyadarshini ice sheet).
  - Station 3D architectural representations:
    - *Bharati Station*: Aerodynamic pod raised on hydraulic stilts (pylons), panoramic glass observation bay, roof-mounted solar PV arrays, and twin spinning wind turbines.
    - *Maitri Station*: Modular orange/blue steel habitat containers, Kirloskar generator house, exhaust stack, insulated fuel pipeline conduit, meteorological lattice tower, and satellite dish.
  - **Dynamic Weather Blizzard**: Procedural particle simulation responding to real-time wind speed.
  - **3D Hotspots**: Clickable floating markers with pulse rings corresponding to:
    - *Generator & Power Room*
    - *Living Modules & HVAC Heating*
    - *Fuel Depot (Cryogenic Logistics)*
    - *Meteorological & Atmospheric Tower*
    - *Satellite Ku-Band Radome*
  - **Camera Controls & Presets**: Orbit, pan, zoom, plus 1-click presets (*Overview, Power Grid, Habitat Pod, Fuel Farm, Weather Mast*).
  - **FLIR Thermal Heatmap & Aurora Night Modes**: Switch between realistic Antarctic daylight, FLIR thermal imaging, and Aurora Australis night modes.
  - **Slide-Over Telemetry Drawer**: Live diagnostics, sensor meters, and remote SCADA control actuators (e.g. *Trigger Auxiliary DG-03*, *Pre-heat Fuel Line B*).

### 2. Low-Bandwidth Mode (Satellite Link Simulation)
- Simulates real-world polar satellite constraints (GSAT-7 Ku-band link at high latency).
- Toggling **Low-Bandwidth Mode** compresses high-frequency 3D rasterization by **94%**, switching the canvas to a lightweight **2D Tactical Vector Schematic** and a live **Raw ASCII/JSON Packet Telemetry Stream**.

### 3. Infrastructure & Hybrid Energy Command Center
- **Interactive SVG Arc Gauges**:
  - Total Power Demand (kW) vs. Green Solar/Wind Output
  - Indoor Ambient Temp (+21.6°C) vs External Sub-Zero Temp (-36.4°C) with \(\Delta T\)
  - Main Arctic Diesel Reserve Level (%)
  - Lithium-Titanate BESS Microgrid State-of-Charge (%)
- **24-Hour Streaming Sensor Charts (Recharts)**:
  - Total Power vs Renewable Generation
  - Thermal Profile (Indoor vs Outdoor vs Wind Chill)
  - Katabatic Wind Velocity (Knots)
  - Diesel Fuel Burn Rate (L/hr)

### 4. Logistics & Resupply Tracker
- **Resupply Convoy Tracker**: Live countdown to the arrival of ice-class vessel `MV Vasiliy Golovnin` (MoES/NCPOR Expedition 46 charter), voyage progress bar, distance remaining (NM), and ice-breaking status.
- **Itemized Consumables Inventory**:
  - Arctic Grade Polar Diesel (D-80) & Jet A-1 Fuel
  - Freeze-Dried Rations & Hydroponic Greenhouse Produce
  - Medical Emergency Antibiotics & Surgical Oxygen Cylinders
  - Critical Generator & Wind Turbine Spares
- **Automated Re-Order Recommendation Trigger**: Instant 1-click replenishment dispatch with encrypted transmission to the NCPOR Logistics Cell, Goa.

### 5. Predictive AI & Anomaly Alert Center
- **Physics-Informed Neural Surrogate Models**:
  - *Cryo-Viscosity Predictor*: Detects wax precipitation risk on Fuel Line B before sub-zero freezing occurs.
  - *Aeroelastic Resonance Forecaster*: Predicts wind turbine blade vibration and suggests pitch angle dampening.
  - *Microgrid Load Forecaster*: Predicts solar drop during storms and shifts load to auxiliary gensets.
- **One-Click Closed-Loop AI Execution**: Immediate telecommand execution that dispatches PLC relays, updates live digital twin states, and resolves active alarms.
- **Live Event Audit Stream**: Filterable by *Critical, Warning, and Info* severity badges.

### 6. Station Subsystem Override Matrix
- Armed safety interlock switch.
- Direct SCADA toggle relays and sliders for auxiliary generators, emergency HVAC heat boost, radome surface heating, and anemometer ultrasonic de-icing.

---

## 🛠️ Technical Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **3D Graphics & Shaders**: Three.js (WebGL, OrbitControls, procedural geometry, particle systems)
- **Styling & Design System**: Tailwind CSS with custom sci-fi glassmorphism utilities (`#0B101D` polar dark, `#00F2FE` cyan, `#4FACFE` ice blue, `#FF4B4B` crimson)
- **Charts & Telemetry**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS custom keyframes

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open your browser at `http://localhost:5173/`.
