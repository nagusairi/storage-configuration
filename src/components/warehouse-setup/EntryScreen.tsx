import React, { useState } from 'react';
import type { WarehouseConfig, SetupMethod, WizardStep } from './types';
import { SearchableWarehouseSelect } from '../ui/SearchableWarehouseSelect';
import { MOCK_WAREHOUSE_CONFIGS } from './mockData';
import {
  Plus, CheckCircle2, Clock, AlertCircle, ChevronRight,
  Layers, MapPin, Package, TrendingUp, GitBranch, Calendar,
  Sparkles, BookOpen, FileEdit, Upload, Wrench,
  PlayCircle, Copy, Globe, Trash2,
} from 'lucide-react';

// ─── Warehouse list built from mock configs ──────────────────────────────────
const WAREHOUSE_LIST = Object.values(MOCK_WAREHOUSE_CONFIGS).map(c => ({
  id: c.warehouseId,
  name: c.warehouseName,
  location: c.location,
}));

const STATUS_BY_ID = Object.fromEntries(
  Object.values(MOCK_WAREHOUSE_CONFIGS).map(c => [c.warehouseId, c.configStatus])
) as Record<string, WarehouseConfig['configStatus']>;

// ─── Props ───────────────────────────────────────────────────────────────────
interface EntryScreenProps {
  config: WarehouseConfig;
  selectedWarehouse: string;
  onWarehouseChange: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSetupClick: (method?: SetupMethod, step?: WizardStep) => void;
  onNewWarehouseClick: () => void;
  onTabContent: () => React.ReactNode;
  onViewAllWarehouses?: () => void;
}

// ─── Tabs (only shown for Published warehouses) ───────────────────────────────
const TABS = [
  { id: 'overview',        label: 'Overview' },
  { id: 'hierarchy-model', label: 'Hierarchy Model' },
  { id: 'zone-layouts',    label: 'Zone Layouts' },
  { id: 'naming-rules',    label: 'Naming & Rules' },
  { id: 'validation',      label: 'Validation' },
  { id: 'activity',        label: 'Activity' },
];

// ─── Status badges (top header) ───────────────────────────────────────────────
function ConfigStatusBadge({ status }: { status: WarehouseConfig['configStatus'] }) {
  const cfg = {
    'not-configured': { label: 'Setup Required', bg: 'bg-red-50',    text: 'text-red-700',    icon: AlertCircle },
    'draft':          { label: 'Draft',          bg: 'bg-amber-50',  text: 'text-amber-700',  icon: Clock       },
    'published':      { label: 'Published',      bg: 'bg-green-50',  text: 'text-green-700',  icon: CheckCircle2},
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function PublishStatusBadge({ status }: { status: WarehouseConfig['publishStatus'] }) {
  const cfg = {
    'up-to-date':      { label: 'Up to date',      bg: 'bg-blue-50',   text: 'text-blue-700'   },
    'changes-pending': { label: 'Changes pending',  bg: 'bg-orange-50', text: 'text-orange-700' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-lg border border-[#d1def0] px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm font-semibold text-[#172B4D] truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Setup Required Panel (replaces tabs for not-configured warehouses) ───────
function SetupRequiredPanel({ warehouseName, onStartSetup }: { warehouseName: string; onStartSetup: () => void }) {
  return (
    <div className="flex items-start justify-center py-10 px-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Warehouse Setup Required</h3>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#172B4D]">{warehouseName}</span> has not been configured yet.
            Choose how you would like to begin.
          </p>
        </div>

        {/* Primary Action */}
        <button
          onClick={onStartSetup}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
        >
          <PlayCircle className="w-4 h-4" />
          Choose Setup Method & Configure
        </button>
      </div>
    </div>
  );
}

// ─── Draft Resume Panel (replaces tabs for draft warehouses) ──────────────────
function DraftResumePanel({
  warehouseName,
  lastModified,
  progress,
  onResume,
  onDuplicate,
  onPublish,
  onDiscard,
}: {
  warehouseName: string;
  lastModified: string;
  progress: number;
  onResume: () => void;
  onDuplicate: () => void;
  onPublish: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="flex items-start justify-center py-10 px-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 mb-3">
            <Clock className="w-3 h-3" />
            Draft
          </div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Warehouse Configuration is in Draft</h3>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#172B4D]">{warehouseName}</span> has an incomplete configuration saved.
            Resume where you left off.
          </p>
        </div>

        {/* Meta Card */}
        <div className="bg-white border border-[#d1def0] rounded-lg px-5 py-4 mb-5 divide-y divide-[#f0f4f8]">
          {/* Last Modified */}
          <div className="flex items-center justify-between py-2.5 first:pt-0">
            <span className="text-xs text-gray-500">Last Modified</span>
            <span className="text-xs font-medium text-[#172B4D]">{lastModified}</span>
          </div>
          {/* Progress */}
          <div className="py-2.5 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Configuration Progress</span>
              <span className="text-xs font-semibold text-[#5C1F3D]">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5C1F3D] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Primary */}
          <button
            onClick={onResume}
            className="h-[40px] px-4 text-[14px] font-medium leading-none text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 flex-shrink-0" />
            <span>Resume Draft</span>
          </button>
          {/* Secondary actions */}
          <button
            onClick={onPublish}
            className="h-[40px] px-4 text-[14px] font-medium leading-none text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f9f4f7] transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span>Publish</span>
          </button>
          <button
            onClick={onDuplicate}
            className="h-[40px] px-4 text-[14px] font-medium leading-none text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4 flex-shrink-0" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={onDiscard}
            className="h-[40px] px-4 text-[14px] font-medium leading-none text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4 flex-shrink-0" />
            <span>Discard Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main EntryScreen ─────────────────────────────────────────────────────────
export function EntryScreen({
  config, selectedWarehouse, onWarehouseChange,
  activeTab, onTabChange, onSetupClick, onNewWarehouseClick, onTabContent, onViewAllWarehouses,
}: EntryScreenProps) {
  const { kpis, configStatus, publishStatus, warehouseName } = config;
  const isDash = configStatus === 'not-configured';

  return (
    <div className="flex flex-col h-full">

      {/* ── Top Control Bar (always visible) ─────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d1def0] px-5 py-3 mb-3 flex items-center justify-between gap-4 flex-shrink-0">
        {/* Left: Warehouse Selector + New Warehouse + Hub Link */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {onViewAllWarehouses && (
            <button
              type="button"
              onClick={onViewAllWarehouses}
              className="h-[33px] px-3 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-[3px] transition-colors flex items-center gap-1.5"
              title="Return to Warehouse Configuration Hub"
            >
              ← Warehouse Hub
            </button>
          )}
          <div className="w-[260px]">
            <SearchableWarehouseSelect
              warehouses={WAREHOUSE_LIST}
              value={selectedWarehouse}
              onChange={onWarehouseChange}
              includeAllOption={false}
              statusByWarehouseId={STATUS_BY_ID}
              onViewAllWarehouses={onViewAllWarehouses}
            />
          </div>
        </div>

        {/* Right: Status Badges + Configure */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConfigStatusBadge status={configStatus} />
          <PublishStatusBadge status={publishStatus} />
          {configStatus === 'published' && (
            <button
              onClick={() => onSetupClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0052CC] border border-[#0052CC] rounded hover:bg-blue-50 transition-colors"
            >
              Configure
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Cards (always visible) ────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <KPICard icon={<MapPin    className="w-4 h-4 text-purple-600" />} color="bg-purple-50" label="Zones"              value={isDash ? '—' : kpis.zoneCount} />
        <KPICard icon={<Package   className="w-4 h-4 text-blue-600"   />} color="bg-blue-50"   label="Storage Locations" value={isDash ? '—' : kpis.storageLocations.toLocaleString()} />
        <KPICard icon={<Layers    className="w-4 h-4 text-indigo-600" />} color="bg-indigo-50" label="Capacity"          value={isDash ? '—' : `${kpis.capacity.toLocaleString()} ${kpis.capacityUnit}`} />
        <KPICard icon={<TrendingUp className="w-4 h-4 text-orange-600"/>} color="bg-orange-50" label="Utilization"       value={isDash ? '—' : `${kpis.utilization}%`} />
        <KPICard icon={<GitBranch className="w-4 h-4 text-teal-600"  />} color="bg-teal-50"   label="Active Hierarchy"  value={isDash ? '—' : kpis.activeHierarchyName} />
        <KPICard icon={<Calendar  className="w-4 h-4 text-rose-600"  />} color="bg-rose-50"   label="Last Published"    value={isDash ? '—' : kpis.lastPublished} />
      </div>

      {/* ── Content Area: 3-way router ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* STATE: Setup Required — no tabs, show setup panel */}
        {configStatus === 'not-configured' && (
          <div className="flex-1 bg-white rounded-lg border border-[#d1def0] overflow-y-auto">
            <SetupRequiredPanel
              warehouseName={warehouseName}
              onStartSetup={onNewWarehouseClick}
            />
          </div>
        )}

        {/* STATE: Draft — no tabs, show resume panel */}
        {configStatus === 'draft' && (
          <div className="flex-1 bg-white rounded-lg border border-[#d1def0] overflow-y-auto">
            <DraftResumePanel
              warehouseName={warehouseName}
              lastModified="Aug 1, 2026 at 3:42 PM"
              progress={65}
              onResume={() => onSetupClick('scratch', 1)}
              onDuplicate={() => onNewWarehouseClick()}
              onPublish={() => onSetupClick('scratch', 7)}
              onDiscard={() => {/* mock: no-op */}}
            />
          </div>
        )}

        {/* STATE: Published — full tab navigation */}
        {configStatus === 'published' && (
          <>
            {/* Tab bar */}
            <div
              className="flex gap-0 bg-white px-6 pt-3 rounded-t-lg flex-shrink-0"
              style={{ borderBottom: '1px solid #d1def0' }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 relative rounded-tl-[5px] rounded-tr-[5px] transition-colors ${activeTab === tab.id ? 'bg-white mb-[-1px] pb-[9px] z-10' : ''}`}
                  style={activeTab === tab.id ? { background: 'white' } : undefined}
                  onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(9,30,66,0.06)'; }}
                  onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = ''; }}
                >
                  {activeTab === tab.id && (
                    <div
                      aria-hidden="true"
                      className="absolute border-[#d1def0] border-[1px_1px_0px] border-solid inset-0 pointer-events-none rounded-tl-[5px] rounded-tr-[5px]"
                    />
                  )}
                  <span className={`text-[12px] text-[#172b4d] whitespace-nowrap ${activeTab === tab.id ? 'font-semibold' : 'font-normal'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 bg-white rounded-b-lg overflow-y-auto">
              {onTabContent()}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
