import React from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { PolarStation3D } from './components/twin3d/PolarStation3D';
import { EnergyDashboard } from './components/energy/EnergyDashboard';
import { LogisticsTracker } from './components/logistics/LogisticsTracker';
import { AnomalyAlertCenter } from './components/ai/AnomalyAlertCenter';
import { StationControls } from './components/controls/StationControls';

const DashboardContent: React.FC = () => {
  const { activeTab, setSelectedHotspot, hotspots } = useTelemetry();

  return (
    <div className="min-h-screen flex flex-col bg-polar-bg text-polar-textLight bg-polar-grid relative">
      {/* Background Aurora Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-polar-cyan/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-20 right-1/4 w-1/3 h-80 bg-polar-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header & Nav */}
      <Header />
      <EmergencyBanner />
      <Navigation />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 z-10">
        {activeTab === 'twin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 3D Digital Twin Hero Canvas */}
            <PolarStation3D />

            {/* Quick-Access Node Ribbons under 3D Canvas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {hotspots.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedHotspot(node)}
                  className="p-3 rounded-xl bg-polar-card/80 backdrop-blur-md border border-polar-border hover:border-polar-cyan/50 hover:shadow-glow-cyan text-left transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-polar-cyan uppercase font-bold truncate">
                      {node.category}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'optimal'
                          ? 'bg-polar-success'
                          : node.status === 'warning'
                          ? 'bg-polar-warning animate-pulse'
                          : 'bg-polar-alert animate-ping'
                      }`}
                    ></span>
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-polar-cyan transition-colors line-clamp-1">
                    {node.name}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-polar-textMuted flex items-center justify-between">
                    <span>{node.temperature > 0 ? `+${node.temperature}` : node.temperature}°C</span>
                    <span>{node.powerDrawKw} kW</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="animate-in fade-in duration-300">
            <EnergyDashboard />
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="animate-in fade-in duration-300">
            <LogisticsTracker />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="animate-in fade-in duration-300">
            <AnomalyAlertCenter />
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="animate-in fade-in duration-300">
            <StationControls />
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <TelemetryProvider>
      <DashboardContent />
    </TelemetryProvider>
  );
}

export default App;
