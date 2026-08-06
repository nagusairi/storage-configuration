import React from 'react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, Layers, GitBranch, MapPin,
  Package, Globe, ArrowRight, ExternalLink, Activity, FileText, Check, ChevronRight, Download
} from 'lucide-react';
import type { WarehouseConfig } from './types';

interface OverviewTabProps {
  config: WarehouseConfig;
  onSetupClick: () => void;
  onNavigateTab?: (tabId: string) => void;
  onOpenZoneManager?: () => void;
}

export function OverviewTab({ config, onSetupClick, onNavigateTab, onOpenZoneManager }: OverviewTabProps) {
  const { zones, activeHierarchyModel, kpis, configStatus, warehouseName } = config;

  const currentVersion = "v2.4";
  const previousVersion = "v2.3";
  const hasDraft = configStatus === 'draft';

  return (
    <div className="p-6 space-y-6 bg-[#f7f8f9] min-h-full">
      {/* ── Responsive 2-Column Dashboard Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT COLUMN (~70% / 8 cols) ──────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Configuration Summary Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#172B4D]">{warehouseName}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                    configStatus === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {configStatus}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded">
                    {currentVersion}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Operational warehouse blueprint & configuration health dashboard
                </p>
              </div>

              {/* Quick Action Lightweight Links */}
              <div className="flex items-center gap-3 text-xs font-semibold text-[#5C1F3D]">
                <button
                  onClick={onSetupClick}
                  className="hover:underline flex items-center gap-1 text-[#5C1F3D]"
                >
                  <span>Edit Configuration</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                {onOpenZoneManager && (
                  <button
                    onClick={onOpenZoneManager}
                    className="hover:underline flex items-center gap-1 text-[#5C1F3D]"
                  >
                    <span>Zone Manager</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab?.('activity')}
                  className="hover:underline flex items-center gap-1 text-gray-600 hover:text-[#5C1F3D]"
                >
                  <span>View History</span>
                </button>
              </div>
            </div>

            {/* Core Blueprint Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Active Model</span>
                <span className="font-bold text-[#172B4D] truncate block">{kpis.activeHierarchyName}</span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {activeHierarchyModel?.levels.length ?? 6} Levels Configured
                </span>
              </div>
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Operational Zones</span>
                <span className="font-bold text-[#172B4D] block">{zones.length} Zones</span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {zones.filter(z => z.hierarchyMode === 'custom').length} Custom Overrides
                </span>
              </div>
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Current Version</span>
                <span className="font-bold text-[#172B4D] block">{currentVersion} (Live)</span>
                <span className="text-[10px] text-gray-500 font-medium">Prev: {previousVersion}</span>
              </div>
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Last Published</span>
                <span className="font-bold text-[#172B4D] block">{kpis.lastPublished}</span>
                <span className="text-[10px] text-green-700 font-medium">Verified Live</span>
              </div>
            </div>
          </div>

          {/* 2. Zone Overview (Primary Operational Section) */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">Configured Operational Zones ({zones.length})</h3>
                <p className="text-xs text-gray-500">Operational structure and hierarchy assignments per zone</p>
              </div>
              <button
                onClick={() => onNavigateTab?.('zone-layouts')}
                className="text-xs font-semibold text-[#5C1F3D] hover:underline flex items-center gap-1"
              >
                <span>View All Zone Layouts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {zones.length === 0 ? (
              <div className="p-8 bg-[#f7f8f9] border border-dashed border-gray-300 rounded-xl text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">No zones configured for this warehouse</p>
                <button
                  onClick={onSetupClick}
                  className="mt-2 text-xs font-bold text-[#5C1F3D] hover:underline"
                >
                  Start Zone Configuration →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {zones.map(zone => {
                  const isCustom = zone.hierarchyMode === 'custom';
                  const activeModel = isCustom ? zone.customHierarchyModel : config.activeHierarchyModel;
                  const totalLocations = zone.generation.levels.reduce((acc, l) => acc * (l.count || 1), 1);

                  return (
                    <div
                      key={zone.id}
                      onClick={() => onNavigateTab?.('zone-layouts')}
                      className="bg-white border border-gray-200 hover:border-[#5C1F3D] rounded-lg p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded-[3px]">
                            {zone.code}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[#172B4D] group-hover:text-[#5C1F3D] transition-colors">
                              {zone.name}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-medium block">
                              Label: <strong>{zone.businessName || zone.name.replace(/^Zone — /, '')}</strong>
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                          zone.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {zone.status}
                        </span>
                      </div>

                      <div className="bg-[#f7f8f9] border border-gray-100 rounded-md p-2 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hierarchy Source:</span>
                          <span className={`font-semibold ${isCustom ? 'text-amber-800' : 'text-green-800'}`}>
                            {isCustom ? 'Custom Override' : 'Inherited (Warehouse)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Model:</span>
                          <span className="font-bold text-[#172B4D] truncate ml-1">
                            {activeModel?.name ?? 'Standard 6-Level'} ({activeModel?.levels.length ?? 6} Levels)
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-200/60">
                          <span className="text-gray-500">Locations:</span>
                          <span className="font-mono font-bold text-[#5C1F3D]">
                            {totalLocations > 1 ? `${totalLocations.toLocaleString()} locations` : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Recent Configuration Activity */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5C1F3D]" />
                <span>Recent Configuration Activity</span>
              </h3>
              <button
                onClick={() => onNavigateTab?.('activity')}
                className="text-xs font-semibold text-gray-500 hover:text-[#5C1F3D] hover:underline"
              >
                View Full Audit Log
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {[
                { icon: Globe, label: 'Configuration Published (v2.4)', detail: 'All zone hierarchy models validated & live', time: '2 days ago', color: 'text-green-700 bg-green-50' },
                { icon: GitBranch, label: 'Hierarchy Model Updated', detail: 'Standard 6-Level set as active master blueprint', time: '5 days ago', color: 'text-blue-700 bg-blue-50' },
                { icon: MapPin, label: 'Zone C — Cold Chain Storage Added', detail: 'Custom hierarchy override applied', time: '1 week ago', color: 'text-purple-700 bg-purple-50' },
                { icon: Package, label: 'Storage Locations Generated', detail: '14,400 location barcodes created', time: '2 weeks ago', color: 'text-indigo-700 bg-indigo-50' },
              ].map((act, idx) => (
                <div key={idx} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${act.color}`}>
                    <act.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172B4D]">{act.label}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (~30% / 4 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* 1. Configuration Health */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Configuration Health</span>
              </h3>
              <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                HEALTHY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-green-50/60 border border-green-200/80 rounded-md p-2 text-green-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>Published State</span>
                </span>
                <span className="font-bold text-[11px]">Live</span>
              </div>
              <div className="flex items-center justify-between bg-green-50/60 border border-green-200/80 rounded-md p-2 text-green-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>Validation Passed</span>
                </span>
                <span className="font-bold text-[11px]">0 Errors</span>
              </div>
              <div className="flex items-center justify-between bg-green-50/60 border border-green-200/80 rounded-md p-2 text-green-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>No Draft Exists</span>
                </span>
                <span className="font-bold text-[11px]">Up-to-date</span>
              </div>
              <div className="flex items-center justify-between bg-green-50/60 border border-green-200/80 rounded-md p-2 text-green-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>No Model Conflicts</span>
                </span>
                <span className="font-bold text-[11px]">Clean</span>
              </div>
            </div>
          </div>

          {/* 2. Validation Summary */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">Validation Summary</h3>
              <button
                onClick={() => onNavigateTab?.('validation')}
                className="text-[11px] font-semibold text-[#5C1F3D] hover:underline"
              >
                Go to Validation Tab →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                <span className="text-[10px] text-green-700 font-semibold block uppercase">Errors</span>
                <span className="text-base font-bold text-green-800">0</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                <span className="text-[10px] text-blue-700 font-semibold block uppercase">Warnings</span>
                <span className="text-base font-bold text-blue-800">0</span>
              </div>
            </div>
          </div>

          {/* 3. Draft Status Card */}
          {hasDraft && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Draft Available</span>
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  In Progress
                </span>
              </div>
              <div className="text-xs text-amber-900 space-y-1">
                <p><strong>Last Modified:</strong> Aug 5, 2026 at 4:12 PM</p>
                <p><strong>Modified By:</strong> Alex Morgan (WMS Admin)</p>
              </div>
              <button
                onClick={onSetupClick}
                className="w-full h-8 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded transition-colors"
              >
                Resume Draft Setup
              </button>
            </div>
          )}

          {/* 4. Version Information */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">Version Information</h3>
              <button
                onClick={() => onNavigateTab?.('activity')}
                className="text-[11px] font-semibold text-gray-500 hover:text-[#5C1F3D] hover:underline"
              >
                View History
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Current Live Version:</span>
                <span className="font-bold text-[#172B4D] font-mono">v2.4 (Active)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Previous Version:</span>
                <span className="font-semibold text-gray-600 font-mono">v2.3</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Last Published Date:</span>
                <span className="font-semibold text-gray-800">{kpis.lastPublished}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
