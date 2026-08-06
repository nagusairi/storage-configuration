import React, { useState, useMemo } from 'react';
import {
  Globe, GitBranch, MapPin, Package, FileEdit, Clock, Calendar, Search, Filter, X,
  ChevronRight, RefreshCw, Download, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  RotateCcw, Eye, Layers, User, Check, Copy, Sliders, ArrowUpRight
} from 'lucide-react';
import type { WarehouseConfig, ZoneConfig } from './types';

interface ActivityItem {
  id: string;
  type:
    | 'Configuration Published'
    | 'Draft Created'
    | 'Draft Updated'
    | 'Hierarchy Model Updated'
    | 'Hierarchy Model Assigned'
    | 'Zone Added'
    | 'Zone Modified'
    | 'Zone Removed'
    | 'Storage Generated'
    | 'Storage Expanded'
    | 'Naming Rules Updated'
    | 'Validation Executed'
    | 'Configuration Restored'
    | 'Configuration Exported';
  version: string;
  previousVersion?: string;
  user: string;
  timestamp: string;
  dateGroup: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last Month' | 'Earlier';
  changeCount: number;
  summary: string;
  details: {
    hierarchyChange?: { before: string; after: string };
    zoneChanges?: Array<{ action: 'added' | 'modified' | 'deleted'; zoneCode: string; zoneName: string; detail: string }>;
    storageChanges?: { locationsBefore: number; locationsAfter: number; format: string };
    namingRulesChange?: string;
    impactSummary: {
      affectedZonesCount: number;
      affectedLocationsCount: number;
      inventoryImpact: string;
      validationStatus: string;
    };
  };
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'Configuration Published',
    version: 'v2.4',
    previousVersion: 'v2.3',
    user: 'John Smith (WMS Admin)',
    timestamp: 'Today at 2:15 PM',
    dateGroup: 'Today',
    changeCount: 5,
    summary: 'Published operational zone & hierarchy updates to live warehouse blueprint.',
    details: {
      hierarchyChange: { before: 'Compact 3-Level', after: 'Standard 6-Level' },
      zoneChanges: [
        { action: 'added', zoneCode: 'ZF', zoneName: 'Zone F — Fast-Pick Forward', detail: 'Added with inherited warehouse hierarchy' },
        { action: 'modified', zoneCode: 'ZC', zoneName: 'Zone C — Cold Chain Storage', detail: 'Assigned Custom Cold Chain hierarchy override' },
      ],
      storageChanges: { locationsBefore: 12000, locationsAfter: 14400, format: 'LOC-{ZONE}-{AISLE}-{RACK}-{SHELF}-{BIN}' },
      impactSummary: {
        affectedZonesCount: 2,
        affectedLocationsCount: 2400,
        inventoryImpact: 'No Migration Required - Layout structure fully backward compatible',
        validationStatus: 'PASS - 0 Errors, 0 Warnings',
      },
    },
  },
  {
    id: 'act-2',
    type: 'Draft Updated',
    version: 'v2.4-draft',
    previousVersion: 'v2.3',
    user: 'Sarah Jenkins (Ops Manager)',
    timestamp: 'Today at 10:45 AM',
    dateGroup: 'Today',
    changeCount: 2,
    summary: 'Updated Business Labels and location capacity rules for Zone A & Zone B.',
    details: {
      zoneChanges: [
        { action: 'modified', zoneCode: 'ZA', zoneName: 'Zone A — General Storage', detail: 'Updated Business Label to General Storage' },
        { action: 'modified', zoneCode: 'ZB', zoneName: 'Zone B — High-Value Storage', detail: 'Adjusted bin capacity from 2 to 4' },
      ],
      impactSummary: {
        affectedZonesCount: 2,
        affectedLocationsCount: 4800,
        inventoryImpact: 'Draft State - Not yet live',
        validationStatus: 'PASS - Validation verified',
      },
    },
  },
  {
    id: 'act-3',
    type: 'Hierarchy Model Updated',
    version: 'v2.3',
    previousVersion: 'v2.2',
    user: 'Alex Morgan (Solution Architect)',
    timestamp: 'Yesterday at 4:30 PM',
    dateGroup: 'Yesterday',
    changeCount: 3,
    summary: 'Updated active master hierarchy model to Standard 6-Level.',
    details: {
      hierarchyChange: { before: 'Legacy 4-Level', after: 'Standard 6-Level' },
      storageChanges: { locationsBefore: 9600, locationsAfter: 12000, format: 'LOC-{ZONE}-{AISLE}-{RACK}-{SHELF}-{BIN}' },
      impactSummary: {
        affectedZonesCount: 4,
        affectedLocationsCount: 2400,
        inventoryImpact: 'Re-indexing complete',
        validationStatus: 'PASS - 0 Errors',
      },
    },
  },
  {
    id: 'act-4',
    type: 'Zone Added',
    version: 'v2.2',
    previousVersion: 'v2.1',
    user: 'John Smith (WMS Admin)',
    timestamp: '3 days ago',
    dateGroup: 'Last 7 Days',
    changeCount: 1,
    summary: 'Added Zone C — Cold Chain Storage under custom hierarchy model.',
    details: {
      zoneChanges: [
        { action: 'added', zoneCode: 'ZC', zoneName: 'Zone C — Cold Chain Storage', detail: 'Created cold storage operational zone' },
      ],
      storageChanges: { locationsBefore: 9216, locationsAfter: 9600, format: 'LOC-ZC-{AISLE}-{RACK}-{SHELF}-{BIN}' },
      impactSummary: {
        affectedZonesCount: 1,
        affectedLocationsCount: 384,
        inventoryImpact: 'New Zone - Zero inventory impact',
        validationStatus: 'PASS - 0 Errors',
      },
    },
  },
  {
    id: 'act-5',
    type: 'Storage Generated',
    version: 'v2.1',
    previousVersion: 'v2.0',
    user: 'Alex Morgan (Solution Architect)',
    timestamp: '2 weeks ago',
    dateGroup: 'Last Month',
    changeCount: 4,
    summary: 'Generated storage location codes and barcodes for Zone A, B & D.',
    details: {
      storageChanges: { locationsBefore: 0, locationsAfter: 9216, format: 'LOC-{ZONE}-{AISLE}-{RACK}-{SHELF}-{BIN}' },
      impactSummary: {
        affectedZonesCount: 3,
        affectedLocationsCount: 9216,
        inventoryImpact: 'Initial Location Barcode Generation',
        validationStatus: 'PASS - 0 Errors',
      },
    },
  },
];

interface ActivityTabProps {
  config: WarehouseConfig;
  onRestoreDraft?: (version: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export function ActivityTab({ config, onRestoreDraft, onNavigateTab }: ActivityTabProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(MOCK_ACTIVITIES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDateGroup, setFilterDateGroup] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVersion, setFilterVersion] = useState<string>('all');

  const [showCompareMode, setShowCompareMode] = useState<boolean>(false);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Selected Activity
  const selectedActivity = useMemo(() => {
    return MOCK_ACTIVITIES.find(a => a.id === selectedActivityId) ?? MOCK_ACTIVITIES[0];
  }, [selectedActivityId]);

  // Unique dropdown values
  const usersList = Array.from(new Set(MOCK_ACTIVITIES.map(a => a.user)));
  const typesList = Array.from(new Set(MOCK_ACTIVITIES.map(a => a.type)));
  const versionsList = Array.from(new Set(MOCK_ACTIVITIES.map(a => a.version)));

  // Filtering
  const filteredActivities = useMemo(() => {
    return MOCK_ACTIVITIES.filter(act => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textToSearch = `${act.type} ${act.version} ${act.user} ${act.summary} ${config.warehouseName}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      if (filterDateGroup !== 'all' && act.dateGroup !== filterDateGroup) return false;
      if (filterUser !== 'all' && act.user !== filterUser) return false;
      if (filterType !== 'all' && act.type !== filterType) return false;
      if (filterVersion !== 'all' && act.version !== filterVersion) return false;

      return true;
    });
  }, [searchQuery, filterDateGroup, filterUser, filterType, filterVersion, config.warehouseName]);

  const activeFilterCount =
    (filterDateGroup !== 'all' ? 1 : 0) +
    (filterUser !== 'all' ? 1 : 0) +
    (filterType !== 'all' ? 1 : 0) +
    (filterVersion !== 'all' ? 1 : 0);

  // Group activities by dateGroup
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    filteredActivities.forEach(act => {
      if (!groups[act.dateGroup]) groups[act.dateGroup] = [];
      groups[act.dateGroup].push(act);
    });
    return groups;
  }, [filteredActivities]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'Configuration Published': return { icon: Globe, color: 'text-green-700 bg-green-50 border-green-200' };
      case 'Draft Created':
      case 'Draft Updated': return { icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'Hierarchy Model Updated':
      case 'Hierarchy Model Assigned': return { icon: GitBranch, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'Zone Added':
      case 'Zone Modified':
      case 'Zone Removed': return { icon: MapPin, color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'Storage Generated':
      case 'Storage Expanded': return { icon: Package, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'Configuration Restored': return { icon: RotateCcw, color: 'text-rose-700 bg-rose-50 border-rose-200' };
      default: return { icon: FileEdit, color: 'text-gray-700 bg-gray-50 border-gray-200' };
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    setShowExportMenu(false);
    alert(`Exporting Activity History as ${format.toUpperCase()} for ${config.warehouseName}...`);
  };

  const handleConfirmRestore = () => {
    setShowRestoreModal(false);
    if (onRestoreDraft) {
      onRestoreDraft(selectedActivity.version);
    } else {
      alert(`Created a new Draft restored from version ${selectedActivity.version}. You can now review, validate, and publish through the workflow.`);
    }
  };

  return (
    <div className="p-6 space-y-5 bg-[#f7f8f9] min-h-full">
      
      {/* ── Persistent Version Header & Quick Action Bar ───────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5C1F3D]/10 border border-[#5C1F3D]/20 flex items-center justify-center text-[#5C1F3D]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">Configuration Activity & History Center</h2>
              <span className="text-[10px] font-mono font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                Live: v2.4
              </span>
              <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                Prev: v2.3
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Audit log, change tracking, version history, impact analysis & governed draft restoration
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCompareMode(!showCompareMode)}
            className={`h-[32px] px-3.5 text-xs font-semibold rounded-[3px] border transition-colors flex items-center gap-1.5 shadow-2xs ${
              showCompareMode
                ? 'bg-[#5C1F3D] text-white border-[#5C1F3D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showCompareMode ? 'Exit Version Diff' : 'Compare Versions'}</span>
          </button>

          <button
            onClick={() => setShowRestoreModal(true)}
            className="h-[32px] px-3.5 text-xs font-semibold text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore as Draft</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="h-[32px] px-3.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-30 py-1 text-xs">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-[#172B4D]"
                >
                  Export as CSV (.csv)
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-[#172B4D]"
                >
                  Export as Excel (.xlsx)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Enterprise Toolbar & Search Filters ────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Global Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Zone, Business Label, Model, User, Version (e.g. v2.4), or Keyword..."
              className="w-full h-[32px] pl-9 pr-8 text-xs border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 bg-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Multi-Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterDateGroup}
              onChange={e => setFilterDateGroup(e.target.value)}
              className="h-[32px] text-xs border border-gray-300 rounded-[3px] px-2 bg-white font-medium text-gray-700 focus:outline-none"
            >
              <option value="all">Date: All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last Month">Last Month</option>
            </select>

            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="h-[32px] text-xs border border-gray-300 rounded-[3px] px-2 bg-white font-medium text-gray-700 focus:outline-none"
            >
              <option value="all">User: All Users</option>
              {usersList.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="h-[32px] text-xs border border-gray-300 rounded-[3px] px-2 bg-white font-medium text-gray-700 focus:outline-none"
            >
              <option value="all">Activity: All Types</option>
              {typesList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={filterVersion}
              onChange={e => setFilterVersion(e.target.value)}
              className="h-[32px] text-xs border border-gray-300 rounded-[3px] px-2 bg-white font-medium text-gray-700 focus:outline-none font-mono"
            >
              <option value="all">Version: All Versions</option>
              {versionsList.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilterDateGroup('all');
                  setFilterUser('all');
                  setFilterType('all');
                  setFilterVersion('all');
                  setSearchQuery('');
                }}
                className="h-[32px] px-2.5 text-xs text-[#5C1F3D] hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Removable Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100 text-xs">
            <span className="text-[11px] text-gray-500 font-semibold">Active Filters:</span>
            {filterDateGroup !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                Date: {filterDateGroup}
                <button onClick={() => setFilterDateGroup('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterUser !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                User: {filterUser}
                <button onClick={() => setFilterUser('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterType !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                Type: {filterType}
                <button onClick={() => setFilterType('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterVersion !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-[11px] font-semibold font-mono">
                Version: {filterVersion}
                <button onClick={() => setFilterVersion('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Two-Panel Workspace Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── LEFT PANEL (~40% / 5 cols): Activity Timeline Cards ──────────── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
              Activity History ({filteredActivities.length} Events)
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">Select an item to inspect</span>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-500">
              No configuration activity matches your search or filters.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedActivities).map(([dateGroup, items]) => (
                <div key={dateGroup} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{dateGroup}</span>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    {items.map(act => {
                      const isSelected = act.id === selectedActivityId;
                      const { icon: Icon, color } = getActivityIcon(act.type);

                      return (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivityId(act.id)}
                          className={`bg-white border rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-[#5C1F3D] ring-1 ring-[#5C1F3D]/30 bg-purple-50/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[#172B4D]">{act.type}</h4>
                                <span className="text-[10px] text-gray-500 font-medium">{act.timestamp}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                              {act.version}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">{act.summary}</p>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                            <span className="text-gray-500 font-medium flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-[140px]">{act.user.split(' ')[0]}</span>
                            </span>
                            <span className="font-bold text-[#5C1F3D] bg-[#5C1F3D]/5 border border-[#5C1F3D]/20 px-2 py-0.5 rounded-full">
                              {act.changeCount} change{act.changeCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL (~60% / 7 cols): Activity Inspector & Diff Canvas ── */}
        <div className="lg:col-span-7 space-y-5 sticky top-4">
          
          {/* Activity Information Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#172B4D]">{selectedActivity.type}</h3>
                  <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2.5 py-0.5 rounded-[3px]">
                    {selectedActivity.version}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>User: <strong>{selectedActivity.user}</strong></span>
                  <span>•</span>
                  <span>Time: <strong>{selectedActivity.timestamp}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShowCompareMode(!showCompareMode)}
                  className="h-[30px] px-3 font-semibold text-[#5C1F3D] bg-[#5C1F3D]/5 border border-[#5C1F3D]/30 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors"
                >
                  {showCompareMode ? 'Hide Diff' : 'Compare Diff'}
                </button>
                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="h-[30px] px-3 font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors"
                >
                  Restore Version
                </button>
              </div>
            </div>

            {/* Smart Operational Impact Summary Card */}
            <div className="bg-[#f7f8f9] border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Smart Operational Impact Summary</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase">Affected Zones</span>
                  <span className="font-bold text-[#172B4D]">{selectedActivity.details.impactSummary.affectedZonesCount} Zones</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase">Locations Impacted</span>
                  <span className="font-bold text-[#5C1F3D]">{selectedActivity.details.impactSummary.affectedLocationsCount.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 col-span-2">
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase">Inventory Migration</span>
                  <span className="font-bold text-green-700 truncate block">
                    {selectedActivity.details.impactSummary.inventoryImpact}
                  </span>
                </div>
              </div>
            </div>

            {/* Configuration Changes Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                Configuration Changes Breakdown ({selectedActivity.changeCount} Changes)
              </h4>

              {/* Hierarchy Model Change */}
              {selectedActivity.details.hierarchyChange && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
                  <span className="font-bold text-gray-700 block">Hierarchy Model Change</span>
                  <div className="flex items-center gap-2 bg-[#f7f8f9] p-2 rounded border border-gray-100">
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                      {selectedActivity.details.hierarchyChange.before}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">
                      {selectedActivity.details.hierarchyChange.after}
                    </span>
                  </div>
                </div>
              )}

              {/* Zone Changes */}
              {selectedActivity.details.zoneChanges && selectedActivity.details.zoneChanges.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-2">
                  <span className="font-bold text-gray-700 block">Zone-Level Modifications</span>
                  <div className="space-y-1.5">
                    {selectedActivity.details.zoneChanges.map((zc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded text-[10px]">
                            {zc.zoneCode}
                          </span>
                          <span className="font-bold text-[#172B4D]">{zc.zoneName}</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full capitalize">
                          {zc.action}: {zc.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Changes */}
              {selectedActivity.details.storageChanges && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                  <span className="font-bold text-gray-700 block">Storage Location Generation</span>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Location Format Pattern:</span>
                    <span className="font-mono font-bold text-[#172B4D]">{selectedActivity.details.storageChanges.format}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Locations Generated:</span>
                    <span className="font-mono font-bold text-green-700">
                      +{selectedActivity.details.storageChanges.locationsAfter - selectedActivity.details.storageChanges.locationsBefore} Locations
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Side-by-Side Version Comparison Matrix */}
          {showCompareMode && (
            <div className="bg-white border border-[#5C1F3D] rounded-xl p-5 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#5C1F3D]" />
                    <span>Version Comparison Matrix</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Comparing <strong>{selectedActivity.previousVersion ?? 'v2.3'}</strong> (Before) vs <strong>{selectedActivity.version}</strong> (After)
                  </p>
                </div>
                <button
                  onClick={() => setShowCompareMode(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f7f8f9] border-b border-gray-200 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Before ({selectedActivity.previousVersion ?? 'v2.3'})</th>
                      <th className="p-2.5">After ({selectedActivity.version})</th>
                      <th className="p-2.5">Diff Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2.5 font-bold text-gray-700">Hierarchy Model</td>
                      <td className="p-2.5 font-mono text-gray-600">Compact 3-Level</td>
                      <td className="p-2.5 font-mono font-bold text-[#172B4D]">Standard 6-Level</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          ~ Modified
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-gray-700">Configured Zones</td>
                      <td className="p-2.5 font-mono text-gray-600">4 Zones (ZA, ZB, ZC, ZD)</td>
                      <td className="p-2.5 font-mono font-bold text-[#172B4D]">5 Zones (+ ZF Fast-Pick)</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded">
                          + Added
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-gray-700">Storage Locations</td>
                      <td className="p-2.5 font-mono text-gray-600">12,000 Locations</td>
                      <td className="p-2.5 font-mono font-bold text-[#172B4D]">14,400 Locations</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded">
                          + 2,400 Added
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-gray-700">Validation Status</td>
                      <td className="p-2.5 text-green-700 font-medium">0 Errors</td>
                      <td className="p-2.5 text-green-700 font-bold">0 Errors (PASS)</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Unchanged
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Restore as Draft Governance Modal ───────────────────────────── */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Restore Version as Draft?</h4>
                <p className="text-xs text-gray-500">Governed restoration workflow for version {selectedActivity.version}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-2">
              <p className="font-semibold">⚠️ Live Published Protection Policy:</p>
              <p>
                Restoring will create a <strong>new Draft</strong> containing the settings from version <strong>{selectedActivity.version}</strong>.
              </p>
              <p className="text-amber-800">
                Your live published warehouse blueprint will <strong>not</strong> be modified until you explicitly review, validate, and publish the restored draft.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="h-[32px] px-4 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="h-[32px] px-5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded shadow-2xs"
              >
                Create Restored Draft
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
