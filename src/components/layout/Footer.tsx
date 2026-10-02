import React from 'react';
import { ShieldCheck, Compass, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-polar-border bg-polar-dark/90 py-6 px-4 text-xs font-mono text-polar-textMuted">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Organization & Protocol */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-polar-textLight font-semibold">
            <Compass className="w-4 h-4 text-polar-cyan" />
            <span>National Centre for Polar and Ocean Research (NCPOR)</span>
          </div>
          <p className="text-[11px] text-polar-textMuted">
            Ministry of Earth Sciences (MoES), Government of India • Head Office: Vasco da Gama, Goa
          </p>
          <div className="flex items-center gap-2 text-[10px] text-polar-cyan pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Madrid Protocol Compliant • Antarctic Treaty System (ATS) Regulated Environment</span>
          </div>
        </div>

        {/* Right: Technical Link Telemetry */}
        <div className="text-right space-y-1 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 justify-end text-polar-success">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry Uplink: GSAT-7 (Rukmini) Transponder 04</span>
          </div>
          <div>RF Carrier Frequency: 14.250 GHz (Ku-Band Tx) / 12.500 GHz (Rx)</div>
          <div className="text-[10px] text-polar-textMuted">
            Smart India Hackathon (SIH) 2026 • Problem Statement ID: 26060
          </div>
        </div>
      </div>
    </footer>
  );
};
