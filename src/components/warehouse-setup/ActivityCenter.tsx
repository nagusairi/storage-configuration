import React, { useState } from 'react';
import {
  Activity, Search, Filter, RefreshCw, Download, GitBranch, Globe, MapPin, Package,
  FileText, Clock, User, CheckCircle2, ChevronRight, X, RotateCcw, ArrowLeftRight, ArrowRight,
  Layers, AlertCircle, Info, Calendar, Copy
} from 'lucide-react';
import type { WarehouseConfig, EntryTab } from './types';

interface ActivityItem {
  id: string;
  type: string;
  version: string;
  prevVersion?: string;
  user: string;
  timestamp: string;
  timeGroup: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last Month' | 'Earlier';
  changeCount: number;
  summary: string;
  status: 'published' | 'draft' | 'archived';
  category: 'Configuration Published' | 'Draft Updated' | 'Hierarchy Updated' | 'Zone Modified' | 'Storage Generated' | 'Validation Executed';
  hierarchyChanges?: { from: string; to: string };
  zoneChanges?: string[];
  storageChanges?: string[];
  impact: {
    affectedZones: number;
    affectedLocations: number;
    inventoryImpact: string;
    migrationRequired: boolean;
    validationStatus: string;
  };
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'Configuration Published',
    category: 'Configuration Published',
    version: 'v3.2',
    prevVersion: 'v3.1',
    user: 'John Smith (Lead Admin)',
    timestamp: 'Today at 4:15 PM',
    timeGroup: 'Today',
    changeCount: 5,
    summary: 'Published Zone C Cold Storage overrides and generated 1,248 bin locations',
    status: 'published',
    hierarchyChanges: { from: 'Standard 6-Level', to: 'Standard 6-Level + Custom Cold Chain Override' },
    zoneChanges: ['Zone C — Cold Storage assigned Custom Cold Chain model', 'Zone Code ZC verified'],
    storageChanges: ['1,248 Cold Storage bins generated', 'Prefix CS- applied'],
    impact: {
      affectedZones: 2,
      affectedLocations: 1248,
      inventoryImpact: 'None (Zero active stock displaced)',
      migrationRequired: false,
      validationStatus: 'Passed (0 Errors, 0 Warnings)'
    }
  },
  {
    id: 'act-2',
    type: 'Draft Updated',
    category: 'Draft Updated',
    version: 'v3.2-draft',
    user: 'Sarah Jenkins (WMS Specialist)',
    timestamp: 'Today at 11:30 AM',
    timeGroup: 'Today',
    changeCount: 2,
    summary: 'Updated Business Name for Zone B to High-Value Storage',
    status: 'draft',
    zoneChanges: ['Zone B business label updated from "Zone B" to "High-Value Storage"'],
    storageChanges: ['Naming rule preview refreshed'],
    impact: {
      affectedZones: 1,
      affectedLocations: 450,
      inventoryImpact: 'None',
      migrationRequired: false,
      validationStatus: 'Passed'
    }
  },
  {
    id: 'act-3',
    type: 'Hierarchy Model Updated',
    category: 'Hierarchy Updated',
    version: 'v3.1',
    prevVersion: 'v3.0',
    user: 'Alex Morgan (Systems Architect)',
    timestamp: 'Yesterday at 3:45 PM',
    timeGroup: 'Yesterday',
    changeCount: 3,
    summary: 'Modified level properties: Rack -> Cabinet depth for Zone D',
    status: 'published',
    hierarchyChanges: { from: 'Compact 3-Level', to: 'Standard 6-Level' },
    zoneChanges: ['Zone D hierarchy source set to Inherited'],
    storageChanges: ['Regenerated location codes for 28,800 bins'],
    impact: {
      affectedZones: 2,
      affectedLocations: 28800,
      inventoryImpact: 'None',
      migrationRequired: false,
      validationStatus: 'Passed'
    }
  },
  {
    id: 'act-4',
    type: 'Storage Locations Generated',
    category: 'Storage Generated',
    version: 'v3.0',
    prevVersion: 'v2.4',
    user: 'John Smith (Lead Admin)',
    timestamp: '3 days ago',
    timeGroup: 'Last 7 Days',
    changeCount: 4,
    summary: 'Batch location generation for Zone A and Zone F completed',
    status: 'published',
    storageChanges: ['28,800 bins generated for Zone A', '28,800 bins generated for Zone F'],
    impact: {
      affectedZones: 2,
      affectedLocations: 57600,
      inventoryImpact: 'None',
      migrationRequired: false,
      validationStatus: 'Passed'
    }
  },
  {
    id: 'act-5',
    type: 'Validation Executed',
    category: 'Validation Executed',
    version: 'v2.4',
    user: 'System Automated Guard',
    timestamp: '2 weeks ago',
    timeGroup: 'Last Month',
    changeCount: 1,
    summary: 'Automated readiness check passed across 32 compliance rules',
    status: 'published',
    impact: {
      affectedZones: 5,
      affectedLocations: 14400,
      inventoryImpact: 'None',
      migrationRequired: false,
      validationStatus: 'Passed (0 Errors)'
    }
  }
];

interface ActivityCenterProps {
  config: WarehouseConfig;
  onNavigateTab?: (tab: EntryTab) => void;
}

export function ActivityCenter({ config, onNavigateTab }: ActivityCenterProps) {
  const { warehouseName } = config;
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem>(MOCK_ACTIVITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [versionFilter, setVersionFilter] = useState('all');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Filters logic
  const filteredActivities = MOCK_ACTIVITIES.filter(act => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchType = act.type.toLowerCase().includes(q);
      const matchUser = act.user.toLowerCase().includes(q);
      const matchVer = act.version.toLowerCase().includes(q);
      const matchSum = act.summary.toLowerCase().includes(q);
      if (!matchType && !matchUser && !matchVer && !matchSum) return false;
    }
    if (dateFilter !== 'all' && act.timeGroup !== dateFilter) return false;
    if (userFilter !== 'all' && !act.user.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (typeFilter !== 'all' && act.category !== typeFilter) return false;
    if (versionFilter !== 'all' && act.version !== versionFilter) return false;
    return true;
  });

  const activeFilterCount = (dateFilter !== 'all' ? 1 : 0) + (userFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0) + (versionFilter !== 'all' ? 1 : 0);

  const timeGroups: ('Today' | 'Yesterday' | 'Last 7 Days' | 'Last Month' | 'Earlier')[] = ['Today', 'Yesterday', 'Last 7 Days', 'Last Month', 'Earlier'];

  const handleExport = (format: 'csv' | 'excel') => {
    alert(`Exporting configuration activity log as ${format.toUpperCase()} file...`);
  };

  const handleConfirmRestoreDraft = () => {
    setShowRestorePrompt(false);
    alert(`Restored ${selectedActivity.version} as a new Draft! You can now review and publish changes in the workspace.`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f7f8f9] min-h-full">

      {/* ── Persistent Header with Version Selector & Quick Actions ────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172B4D]">Configuration Activity & History Center</h2>
            <span className="text-xs font-mono bg-[#5C1F3D]/10 text-[#5C1F3D] px-2 py-0.5 rounded border border-[#5C1F3D]/20 font-bold">
              {warehouseName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete configuration audit log, change awareness, version comparison, and safe restoration
          </p>
        </div>

        {/* Persistent Version Selector & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
            <span className="text-gray-500 font-medium">Current Version:</span>
            <span className="font-mono font-bold text-[#172B4D]">v3.2 (Live)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 font-medium">Previous:</span>
            <span className="font-mono font-semibold text-gray-700">v3.1</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="h-[32px] px-3 text-xs font-medium text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare Versions</span>
            </button>
            <button
              onClick={() => setShowRestorePrompt(true)}
              className="h-[32px] px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore as Draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Top Toolbar (Search, Enterprise Filters & Export) ───────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-1 max-w-4xl flex-wrap sm:flex-nowrap">
            {/* Global Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Zone, Hierarchy, User, Version, or Activity..."
                className="w-full h-[32px] pl-9 pr-3 text-xs border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition-colors bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Range Filter */}
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Dates</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last Month">Last Month</option>
            </select>

            {/* User Filter */}
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Users</option>
              <option value="John Smith">John Smith</option>
              <option value="Sarah">Sarah Jenkins</option>
              <option value="Alex Morgan">Alex Morgan</option>
            </select>

            {/* Activity Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Activity Types</option>
              <option value="Configuration Published">Configuration Published</option>
              <option value="Draft Updated">Draft Updated</option>
              <option value="Hierarchy Updated">Hierarchy Updated</option>
              <option value="Storage Generated">Storage Generated</option>
            </select>

            {/* Version Filter */}
            <select
              value={versionFilter}
              onChange={e => setVersionFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium font-mono"
            >
              <option value="all">All Versions</option>
              <option value="v3.2">v3.2</option>
              <option value="v3.1">v3.1</option>
              <option value="v3.0">v3.0</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleExport('csv')}
              className="h-[32px] px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Removable Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100 text-xs">
            <span className="text-[11px] text-gray-500 font-medium">Active Filters:</span>
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[11px]">
                Date: {dateFilter}
                <button onClick={() => setDateFilter('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {userFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[11px]">
                User: {userFilter}
                <button onClick={() => setUserFilter('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[11px]">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {versionFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[11px]">
                Version: {versionFilter}
                <button onClick={() => setVersionFilter('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            <button
              onClick={() => { setDateFilter('all'); setUserFilter('all'); setTypeFilter('all'); setVersionFilter('all'); setSearchQuery(''); }}
              className="text-[11px] text-[#5C1F3D] font-medium hover:underline ml-1"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* ── Two-Panel Layout (Left Timeline + Right Details) ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT PANEL (~40% / 5 cols): Rich Activity Timeline Cards ─────── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Activity History ({filteredActivities.length})
            </h3>
            <span className="text-[11px] text-gray-400">Click card for details</span>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {timeGroups.map(group => {
              const groupActivities = filteredActivities.filter(a => a.timeGroup === group);
              if (groupActivities.length === 0) return null;

              return (
                <div key={group} className="space-y-2">
                  <div className="sticky top-0 bg-[#f7f8f9] z-10 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span>{group}</span>
                    <div className="flex-1 h-[1px] bg-gray-200" />
                  </div>

                  <div className="space-y-2.5">
                    {groupActivities.map(act => {
                      const isSelected = selectedActivity.id === act.id;

                      return (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivity(act)}
                          className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-2.5 ${
                            isSelected ? 'border-[#5C1F3D] ring-1 ring-[#5C1F3D]/20 bg-purple-50/10' : 'border-[#d1def0] hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                act.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                <Globe className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[#172B4D]">{act.type}</h4>
                                <span className="text-[10px] text-gray-400 font-medium">{act.timestamp}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 border px-1.5 py-0.5 rounded">
                              {act.version}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">{act.summary}</p>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                            <span className="text-gray-500 font-medium">By <strong>{act.user.split(' ')[0]}</strong></span>
                            <span className="text-[#5C1F3D] font-semibold flex items-center gap-0.5">
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filteredActivities.length === 0 && (
              <div className="p-8 bg-white border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-500">
                No activity history found matching current filters.
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL (~60% / 7 cols): Detailed Activity & Version Workspace ── */}
        <div className="lg:col-span-7 space-y-5 sticky top-6">
          <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-5">
            
            {/* Selected Activity Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#172B4D]">{selectedActivity.type}</h3>
                  <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 border px-2 py-0.5 rounded">
                    {selectedActivity.version}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recorded on <strong>{selectedActivity.timestamp}</strong> by <strong>{selectedActivity.user}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="h-[30px] px-3 text-xs font-medium text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors shadow-2xs flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setShowRestorePrompt(true)}
                  className="h-[30px] px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors shadow-2xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore</span>
                </button>
              </div>
            </div>

            {/* Summary Banner */}
            <div className="bg-purple-50/40 border border-purple-200/70 rounded-lg p-3 text-xs text-purple-900">
              <strong className="font-bold block mb-0.5">Activity Executive Summary:</strong>
              <span>{selectedActivity.summary}</span>
            </div>

            {/* Configuration Changes Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">Detailed Configuration Changes</h4>

              {selectedActivity.hierarchyChanges && (
                <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                  <span className="font-bold text-gray-500 uppercase text-[10px] block">Hierarchy Model Change</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-[#172B4D]">
                    <span className="text-gray-500">{selectedActivity.hierarchyChanges.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5C1F3D]" />
                    <span className="text-[#5C1F3D]">{selectedActivity.hierarchyChanges.to}</span>
                  </div>
                </div>
              )}

              {selectedActivity.zoneChanges && selectedActivity.zoneChanges.length > 0 && (
                <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
                  <span className="font-bold text-gray-500 uppercase text-[10px] block">Zone Layout Modifications</span>
                  <ul className="space-y-1 text-gray-700">
                    {selectedActivity.zoneChanges.map((z, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5C1F3D]" />
                        <span>{z}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedActivity.storageChanges && selectedActivity.storageChanges.length > 0 && (
                <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
                  <span className="font-bold text-gray-500 uppercase text-[10px] block">Storage Generation & Naming Rules</span>
                  <ul className="space-y-1 text-gray-700">
                    {selectedActivity.storageChanges.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Smart Operational Impact Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Operational Impact Summary</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#f7f8f9] p-2.5 rounded border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase font-medium block">Affected Zones</span>
                  <span className="font-bold text-[#172B4D]">{selectedActivity.impact.affectedZones} Zones</span>
                </div>
                <div className="bg-[#f7f8f9] p-2.5 rounded border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase font-medium block">Storage Locations</span>
                  <span className="font-bold text-[#5C1F3D]">{selectedActivity.impact.affectedLocations.toLocaleString()} Bins</span>
                </div>
                <div className="bg-[#f7f8f9] p-2.5 rounded border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase font-medium block">Inventory Impact</span>
                  <span className="font-bold text-green-700">{selectedActivity.impact.inventoryImpact}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Version Comparison Side-by-Side Modal ───────────────────────────── */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Side-by-Side Version Comparison</h3>
                <p className="text-xs text-gray-500">
                  Comparing <strong>{selectedActivity.prevVersion ?? 'v3.1'}</strong> vs <strong>{selectedActivity.version}</strong>
                </p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <h4 className="font-bold text-gray-700 text-xs border-b border-gray-200 pb-1">
                  Previous Version ({selectedActivity.prevVersion ?? 'v3.1'})
                </h4>
                <p className="text-gray-600">Model: Standard 6-Level</p>
                <p className="text-gray-600">Zones: 5 Zones Configured</p>
                <p className="text-gray-600">Cold Storage: Inherited Model</p>
              </div>

              <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-3 space-y-2">
                <h4 className="font-bold text-[#5C1F3D] text-xs border-b border-purple-200 pb-1">
                  Target Version ({selectedActivity.version})
                </h4>
                <p className="text-green-800 font-bold">✓ Model: Standard 6-Level + Custom Override</p>
                <p className="text-green-800 font-bold">✓ Zones: 5 Zones (Zone C Modified)</p>
                <p className="text-[#5C1F3D] font-bold">+ Cold Storage: Custom Cold Chain Model</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowCompareModal(false)}
                className="h-[32px] px-4 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px]"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Restore as Draft Safe Confirmation Prompt Modal ───────────────── */}
      {showRestorePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-[#5C1F3D] flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Restore {selectedActivity.version} as Draft?</h4>
                <p className="text-xs text-gray-500">Safe restoration workflow protects live published configurations.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
              Restoring will load all configuration parameters from version <strong>{selectedActivity.version}</strong> into a new <strong>Draft</strong>. The live published configuration will remain unchanged until you review and explicitly publish.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowRestorePrompt(false)}
                className="h-[32px] px-4 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestoreDraft}
                className="h-[32px] px-4 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] shadow-2xs"
              >
                Create Draft & Restore
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
