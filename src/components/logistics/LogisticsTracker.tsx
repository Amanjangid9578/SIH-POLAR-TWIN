import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ACTIVE_RESUPPLY_VESSEL } from '../../data/inventoryData';
import type { InventoryItem } from '../../types/telemetry';
import {
  Ship,
  Package,
  AlertTriangle,
  Clock,
  Send,
  Search,
  RotateCw,
  PlusCircle,
  Droplet,
  HeartPulse,
  Wrench,
  Utensils,
} from 'lucide-react';

export const LogisticsTracker: React.FC = () => {
  const { inventory, reorderInventoryItem, activeStation } = useTelemetry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reorderingItemId, setReorderingItemId] = useState<string | null>(null);

  const vessel = ACTIVE_RESUPPLY_VESSEL;

  // Filter items
  const filteredItems = inventory.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const criticalItems = inventory.filter((i) => i.status === 'critical');

  // Days remaining until resupply vessel arrival (Target ETA: 2026-12-28)
  const targetDate = new Date(vessel.etaArrival).getTime();
  const now = new Date().getTime();
  const diffMs = Math.max(0, targetDate - now);
  const daysUntilResupply = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursUntilResupply = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

  const getCategoryIcon = (cat: InventoryItem['category']) => {
    switch (cat) {
      case 'fuel':
        return <Droplet className="w-4 h-4 text-polar-cyan" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-polar-warning" />;
      case 'medical':
        return <HeartPulse className="w-4 h-4 text-polar-alert" />;
      case 'spares':
        return <Wrench className="w-4 h-4 text-polar-blue" />;
      default:
        return <Package className="w-4 h-4 text-polar-textMuted" />;
    }
  };

  const handleQuickReorder = (item: InventoryItem) => {
    setReorderingItemId(item.id);
    setTimeout(() => {
      const orderAmount = Math.round(item.maxStock * 0.4);
      reorderInventoryItem(item.id, orderAmount);
      setReorderingItemId(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Polar Resupply Vessel Countdown Hero Widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-polar-card via-polar-surface to-polar-card border border-polar-border shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-polar-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Vessel Identification */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-polar-blue/20 text-polar-blue border border-polar-blue/40">
                POLAR RESUPPLY CONVOY
              </span>
              <span className="text-xs font-mono text-polar-textMuted">
                Callsign: {vessel.callSign}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-polar-cyan/15 text-polar-cyan border border-polar-cyan/30 shadow-glow-cyan">
                <Ship className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {vessel.vesselName}
                </h3>
                <p className="text-xs text-polar-cyan font-mono">{vessel.flag}</p>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-polar-textMuted space-y-1">
              <div>Class: <strong className="text-white">{vessel.iceClass}</strong></div>
              <div>Coordinates: <strong className="text-white">{vessel.currentCoordinates}</strong></div>
              <div>Ice-Breaking: <strong className="text-polar-textLight">{vessel.iceBreakingCapability}</strong></div>
            </div>
          </div>

          {/* Center: Countdown Display Widget */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-polar-dark/70 border border-polar-border">
            <div className="text-[11px] font-mono text-polar-textMuted uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-polar-cyan animate-pulse" />
              Days Remaining Until Resupply Vessel Arrival
            </div>

            <div className="flex items-baseline gap-3 my-1">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-polar-cyan to-polar-blue">
                  {daysUntilResupply}
                </span>
                <span className="block text-[10px] uppercase font-mono text-polar-textMuted">Days</span>
              </div>
              <span className="text-3xl font-mono text-polar-cyan/60 font-light">:</span>
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-white">
                  {hoursUntilResupply}
                </span>
                <span className="block text-[10px] uppercase font-mono text-polar-textMuted">Hours</span>
              </div>
            </div>

            <div className="w-full mt-3">
              <div className="flex justify-between text-[11px] font-mono text-polar-textMuted mb-1">
                <span>Voyage Route: Cape Town → Antarctica</span>
                <span className="text-polar-cyan font-bold">78% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-polar-dark overflow-hidden p-0.5 border border-polar-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-polar-blue to-polar-cyan transition-all duration-500"
                  style={{ width: '78%' }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-polar-textMuted mt-1">
                <span>Dep: {vessel.etdDeparture}</span>
                <span>ETA: {vessel.etaArrival}</span>
              </div>
            </div>
          </div>

          {/* Right: Resupply Status & Cargo Manifest */}
          <div className="p-4 rounded-xl bg-polar-dark/50 border border-polar-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-polar-textMuted">Voyage Status:</span>
              <span className="text-polar-success font-semibold">{vessel.voyageStatus}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-polar-textMuted">Distance to Ice Edge:</span>
              <span className="text-white font-bold">{vessel.distanceRemainingNm} NM</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-polar-textMuted">Cargo Manifest:</span>
              <span className="text-white font-bold">{vessel.cargoLoadedTons} / {vessel.cargoCapacityTons} Tons</span>
            </div>

            <div className="pt-2 border-t border-polar-border flex items-center justify-between text-[11px]">
              <span className="text-polar-warning font-semibold">
                {criticalItems.length} Low Stock Trigger Alerts
              </span>
              <span className="text-polar-cyan">Expedition 46</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Automated Re-Order Recommendation Alert Cards */}
      {criticalItems.length > 0 && (
        <div className="p-4 rounded-xl bg-polar-alert/15 border border-polar-alert/40 shadow-glow-alert space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-polar-alert animate-bounce" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Automated Re-Order Recommendation Trigger Active
              </h3>
            </div>
            <span className="text-xs font-mono text-polar-alert font-bold uppercase">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-polar-card/90 border border-polar-alert/30 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-polar-textMuted font-mono mt-0.5">
                    Current: <strong className="text-polar-alert">{item.currentStock} {item.unit}</strong> •{' '}
                    Estimated Runout: <strong className="text-polar-alert">{item.daysRemaining} days</strong>
                  </div>
                  <div className="text-[10px] text-polar-cyan font-mono mt-0.5">
                    Stored at: {item.storageLocation}
                  </div>
                </div>

                <button
                  disabled={reorderingItemId === item.id}
                  onClick={() => handleQuickReorder(item)}
                  className="px-3.5 py-2 rounded-lg bg-polar-alert hover:bg-polar-alert/90 text-white font-bold font-mono text-[11px] shadow-glow-alert transition-all flex items-center gap-1.5 shrink-0"
                >
                  {reorderingItemId === item.id ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Order Replenish</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Itemized Inventory List Table & Search */}
      <div className="p-5 rounded-2xl bg-polar-card border border-polar-border shadow-glass">
        {/* Table Controls: Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-polar-border">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Itemized Station Inventory & Consumables
            </h3>
            <p className="text-xs text-polar-textMuted mt-0.5">
              Live stock levels at {activeStation === 'maitri' ? 'Maitri' : 'Bharati'} Station storage facilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-polar-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..."
                className="pl-9 pr-3 py-1.5 rounded-lg bg-polar-dark border border-polar-border text-xs text-white placeholder-polar-textMuted focus:outline-none focus:border-polar-cyan font-mono w-44 sm:w-56"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center p-1 rounded-lg bg-polar-dark border border-polar-border text-xs font-mono">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-polar-cyan text-polar-dark font-bold'
                    : 'text-polar-textMuted hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('fuel')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCategory === 'fuel'
                    ? 'bg-polar-cyan text-polar-dark font-bold'
                    : 'text-polar-textMuted hover:text-white'
                }`}
              >
                Fuel
              </button>
              <button
                onClick={() => setSelectedCategory('food')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCategory === 'food'
                    ? 'bg-polar-cyan text-polar-dark font-bold'
                    : 'text-polar-textMuted hover:text-white'
                }`}
              >
                Food
              </button>
              <button
                onClick={() => setSelectedCategory('medical')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCategory === 'medical'
                    ? 'bg-polar-cyan text-polar-dark font-bold'
                    : 'text-polar-textMuted hover:text-white'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setSelectedCategory('spares')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCategory === 'spares'
                    ? 'bg-polar-cyan text-polar-dark font-bold'
                    : 'text-polar-textMuted hover:text-white'
                }`}
              >
                Spares
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Items Grid */}
        <div className="divide-y divide-polar-border/60">
          {filteredItems.map((item) => {
            const stockPct = Math.round((item.currentStock / item.maxStock) * 100);

            const statusBadge =
              item.status === 'adequate'
                ? 'bg-polar-success/15 text-polar-success border-polar-success/30'
                : item.status === 'warning'
                ? 'bg-polar-warning/15 text-polar-warning border-polar-warning/30'
                : 'bg-polar-alert/15 text-polar-alert border-polar-alert/30 animate-pulse';

            return (
              <div
                key={item.id}
                className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-polar-surface/50 px-2 rounded-lg transition-colors"
              >
                {/* Item Details */}
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="p-2 rounded-lg bg-polar-dark border border-polar-border">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono uppercase font-semibold border ${statusBadge}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-polar-textMuted font-mono mt-0.5">
                      {item.storageLocation} • Burn: {item.dailyConsumption} {item.unit}/day
                    </div>
                  </div>
                </div>

                {/* Stock Level Progress */}
                <div className="flex-1 min-w-[180px] max-w-xs">
                  <div className="flex justify-between text-[11px] font-mono text-polar-textMuted mb-1">
                    <span>
                      {item.currentStock.toLocaleString()} / {item.maxStock.toLocaleString()} {item.unit}
                    </span>
                    <span className="font-bold text-white">{stockPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-polar-dark overflow-hidden p-0.5 border border-polar-border">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stockPct > 35
                          ? 'bg-polar-success'
                          : stockPct > 20
                          ? 'bg-polar-warning'
                          : 'bg-polar-alert'
                      }`}
                      style={{ width: `${Math.min(100, stockPct)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Days Remaining & Reorder Trigger */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-polar-textMuted text-[10px] uppercase">Buffer Days</div>
                    <div
                      className={`font-bold ${
                        item.daysRemaining > 60
                          ? 'text-white'
                          : item.daysRemaining > 20
                          ? 'text-polar-warning'
                          : 'text-polar-alert font-extrabold'
                      }`}
                    >
                      {item.daysRemaining} Days
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickReorder(item)}
                    className="p-1.5 rounded-lg bg-polar-dark hover:bg-polar-cyan/20 border border-polar-border hover:border-polar-cyan/40 text-polar-textMuted hover:text-polar-cyan transition-colors"
                    title="Manual Reorder Requisition"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
