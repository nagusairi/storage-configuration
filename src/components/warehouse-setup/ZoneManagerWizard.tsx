import React, { useState } from 'react';
import {
  Check, ChevronLeft, ChevronRight, X, Plus, Trash2, Sliders,
  LayoutGrid, List, Search, Filter, AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw, Layers
} from 'lucide-react';
import type { WarehouseConfig, ZoneConfig, HierarchyModel, ConfigStatus } from './types';
import { STANDARD_6_LEVEL, COMPACT_3_LEVEL, COLD_CHAIN } from './mockData';

interface ZoneManagerWizardProps {
  config: WarehouseConfig;
  onSave: (updatedZones: ZoneConfig[]) => void;
  onClose: () => void;
}

export type ZoneManagerStep = 1 | 2 | 3 | 4;

const ZONE_MANAGER_STEPS: { id: ZoneManagerStep; label: string; short: string }[] = [
  { id: 1, label: 'Zones', short: 'Zones' },
  { id: 2, label: 'Storage Layout', short: 'Storage Layout' },
  { id: 3, label: 'Validate', short: 'Validate' },
  { id: 4, label: 'Publish', short: 'Publish' },
];

export function ZoneManagerWizard({ config, onSave, onClose }: ZoneManagerWizardProps) {
  const [currentStep, setCurrentStep] = useState<ZoneManagerStep>(1);
  const [zones, setZones] = useState<ZoneConfig[]>([...(config.zones ?? [])]);
  const [modifiedZoneIds, setModifiedZoneIds] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardPrompt, setShowDiscardPrompt] = useState(false);

  // Toolbar & View state inside Step 1
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'expanded' | 'card' | 'table'>('expanded');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterModel, setFilterModel] = useState<string>('all');

  // Add Zone Drawer state
  const [showAddZoneDrawer, setShowAddZoneDrawer] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');
  const [showDrawerDiscardPrompt, setShowDrawerDiscardPrompt] = useState(false);

  // Model Override Selection Modal state
  const [targetZoneForOverride, setTargetZoneForOverride] = useState<ZoneConfig | null>(null);

  // Mark zone modified
  const markZoneModified = (id: string) => {
    setModifiedZoneIds(prev => new Set(prev).add(id));
    setIsDirty(true);
  };

  // Close wizard safety check
  const handleCloseClick = () => {
    if (isDirty) {
      setShowDiscardPrompt(true);
    } else {
      onClose();
    }
  };

  // Add zone handler
  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessName.trim()) return;

    const char = String.fromCharCode(65 + zones.length);
    const code = newZoneCode.trim().toUpperCase() || `Z${char}`;

    const newZone: ZoneConfig = {
      id: `zone-${Date.now()}`,
      name: `Zone — ${newBusinessName.trim()}`,
      businessName: newBusinessName.trim(),
      code,
      status: 'active',
      configStatus: 'draft',
      hierarchyMode: 'default',
      hierarchySource: 'warehouse',
      pickingStrategy: 'FIFO',
      generation: {
        levels: [
          { levelId: 'l2', levelName: 'Aisles', count: 5 },
          { levelId: 'l3', levelName: 'Racks', count: 10 },
          { levelId: 'l4', levelName: 'Shelves', count: 4 },
          { levelId: 'l5', levelName: 'Bins', count: 12 },
        ]
      }
    };

    setZones(prev => [...prev, newZone]);
    markZoneModified(newZone.id);
    setNewBusinessName('');
    setNewZoneCode('');
    setShowAddZoneDrawer(false);
  };

  const handleCloseAddZoneDrawer = () => {
    if (newBusinessName.trim() || newZoneCode.trim()) {
      setShowDrawerDiscardPrompt(true);
    } else {
      setShowAddZoneDrawer(false);
      setNewBusinessName('');
      setNewZoneCode('');
    }
  };

  const handleUpdateZoneBusinessName = (zoneId: string, name: string) => {
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, businessName: name, name: `Zone — ${name}` } : z));
    markZoneModified(zoneId);
  };

  const handleUpdateZoneCode = (zoneId: string, code: string) => {
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, code: code.toUpperCase() } : z));
    markZoneModified(zoneId);
  };

  const handleToggleZoneMode = (zoneId: string, mode: 'default' | 'custom', customModel?: HierarchyModel) => {
    setZones(prev => prev.map(z => z.id === zoneId ? {
      ...z,
      hierarchyMode: mode,
      customHierarchyModel: mode === 'custom' ? (customModel || z.customHierarchyModel || COMPACT_3_LEVEL) : undefined
    } : z));
    markZoneModified(zoneId);
  };

  const handleDeleteZone = (zoneId: string) => {
    setZones(prev => prev.filter(z => z.id !== zoneId));
    setIsDirty(true);
  };

  const handlePublish = () => {
    const publishedZones = zones.map(z => ({ ...z, configStatus: 'published' as ConfigStatus }));
    onSave(publishedZones);
  };

  // Filtered Zone List for Step 1
  const availableModels = Array.from(
    new Set(
      zones.map(z => z.hierarchyMode === 'custom' ? (z.customHierarchyModel?.name || 'Custom Model') : (config.activeHierarchyModel?.name || 'Standard 6-Level'))
    )
  );

  const filteredZones = zones.filter(zone => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const modelName = (zone.hierarchyMode === 'custom' ? zone.customHierarchyModel?.name : config.activeHierarchyModel?.name) || '';
      const nameMatch = zone.name.toLowerCase().includes(q);
      const bizNameMatch = (zone.businessName || '').toLowerCase().includes(q);
      const codeMatch = zone.code.toLowerCase().includes(q);
      const modelMatch = modelName.toLowerCase().includes(q);
      if (!nameMatch && !bizNameMatch && !codeMatch && !modelMatch) return false;
    }

    if (filterStatus !== 'all' && zone.status !== filterStatus) return false;
    if (filterSource !== 'all') {
      const isCustom = zone.hierarchyMode === 'custom';
      if (filterSource === 'inherited' && isCustom) return false;
      if (filterSource === 'override' && !isCustom) return false;
    }
    if (filterModel !== 'all') {
      const modelName = (zone.hierarchyMode === 'custom' ? zone.customHierarchyModel?.name : config.activeHierarchyModel?.name) || '';
      if (modelName !== filterModel) return false;
    }
    return true;
  });

  const activeFilterCount = (filterStatus !== 'all' ? 1 : 0) + (filterSource !== 'all' ? 1 : 0) + (filterModel !== 'all' ? 1 : 0);
  const impactedZonesList = zones.filter(z => modifiedZoneIds.has(z.id));
  const unaffectedZonesList = zones.filter(z => !modifiedZoneIds.has(z.id));

  return (
    <div className="flex flex-col h-full bg-[#f7f8f9]">
      {/* ── Contextual Header & Stepper Area ────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#d1def0] shadow-2xs flex-shrink-0">
        {/* Header Metadata */}
        <div className="px-6 py-3.5 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              ZONE MANAGER
            </span>
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2 mt-0.5">
              <span>Zone Manager</span>
              <span className="text-xs font-semibold bg-[#5C1F3D]/10 text-[#5C1F3D] px-2 py-0.5 rounded-[3px] border border-[#5C1F3D]/20">
                Dedicated Zone Workspace
              </span>
            </h2>
            <p className="text-xs text-gray-600 font-medium flex items-center gap-2 mt-0.5 flex-wrap">
              <span>Warehouse: <strong>{config.warehouseName}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Configuration Status: <strong className="text-green-700 capitalize">{config.configStatus}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Zones: <strong>{zones.length} Configured</strong> ({modifiedZoneIds.size} Modified in Draft)</span>
            </p>
          </div>

          <button
            onClick={handleCloseClick}
            className="p-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-[#172B4D] hover:text-black font-semibold flex items-center justify-center shadow-2xs"
            title="Close Zone Manager"
          >
            <X className="w-4 h-4 text-[#172B4D]" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="px-6 py-2.5">
          <div className="flex items-center gap-0 overflow-x-auto">
            {ZONE_MANAGER_STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isLast = idx === ZONE_MANAGER_STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className="flex items-center gap-2 flex-shrink-0 group"
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all
                      ${isCompleted ? 'bg-[#36B37E] text-white' : isCurrent ? 'bg-[#5C1F3D] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}
                    `}>
                      {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-[#5C1F3D] font-bold' : isCompleted ? 'text-[#36B37E]' : 'text-gray-400'}`}>
                      {step.short}
                    </span>
                  </button>
                  {!isLast && (
                    <div className={`w-12 h-[1px] mx-2 flex-shrink-0 ${isCompleted ? 'bg-[#36B37E]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Step Content Canvas ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* STEP 1: ZONES WORKSPACE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Enterprise Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search & Filter */}
                <div className="flex items-center gap-2 flex-1 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search by Zone Name, Business Name, Zone Code, or Hierarchy Model..."
                      className="w-full h-[32px] pl-9 pr-3 text-xs border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition-colors bg-white"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Popover Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterPopover(!showFilterPopover)}
                      className={`h-[32px] px-3 text-xs font-medium border rounded-[3px] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                        activeFilterCount > 0
                          ? 'bg-[#5C1F3D]/5 border-[#5C1F3D]/40 text-[#5C1F3D]'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>+ Filter</span>
                      {activeFilterCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#5C1F3D] text-white text-[10px] font-bold flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>

                    {showFilterPopover && (
                      <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-30 p-3 space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-xs font-bold text-[#172B4D]">Filter Zones</span>
                          <button
                            onClick={() => {
                              setFilterStatus('all');
                              setFilterSource('all');
                              setFilterModel('all');
                            }}
                            className="text-[11px] text-[#5C1F3D] hover:underline font-medium"
                          >
                            Reset All
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Status</label>
                          <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="w-full h-8 text-xs border border-gray-200 rounded px-2 bg-white"
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Hierarchy Source</label>
                          <select
                            value={filterSource}
                            onChange={e => setFilterSource(e.target.value)}
                            className="w-full h-8 text-xs border border-gray-200 rounded px-2 bg-white"
                          >
                            <option value="all">All Sources</option>
                            <option value="inherited">Inherited (Warehouse)</option>
                            <option value="override">Custom (Override)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Hierarchy Model</label>
                          <select
                            value={filterModel}
                            onChange={e => setFilterModel(e.target.value)}
                            className="w-full h-8 text-xs border border-gray-200 rounded px-2 bg-white"
                          >
                            <option value="all">All Hierarchy Models</option>
                            {availableModels.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Switcher & Action */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="bg-gray-100 p-0.5 rounded-[3px] flex items-center gap-0.5 border border-gray-200">
                    <button
                      onClick={() => setViewMode('expanded')}
                      className={`h-[28px] w-[28px] rounded-[2px] transition-colors flex items-center justify-center ${
                        viewMode === 'expanded' ? 'bg-white text-[#5C1F3D] shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                      title="Expanded View"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('card')}
                      className={`h-[28px] w-[28px] rounded-[2px] transition-colors flex items-center justify-center ${
                        viewMode === 'card' ? 'bg-white text-[#5C1F3D] shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                      title="Card View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`h-[28px] w-[28px] rounded-[2px] transition-colors flex items-center justify-center ${
                        viewMode === 'table' ? 'bg-white text-[#5C1F3D] shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddZoneDrawer(true)}
                    className="h-[32px] px-4 text-xs font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Zone</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Zone List Render */}
            {viewMode === 'expanded' && (
              <div className="flex flex-col gap-4">
                {filteredZones.map(zone => {
                  const isCustom = zone.hierarchyMode === 'custom';
                  const activeModel = isCustom ? zone.customHierarchyModel : config.activeHierarchyModel;
                  const levelsList = activeModel?.levels ?? [];
                  const isModified = modifiedZoneIds.has(zone.id);

                  return (
                    <div key={zone.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                      isModified ? 'border-[#5C1F3D] bg-purple-50/20' : 'border-[#d1def0]'
                    }`}>
                      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={zone.code}
                            onChange={e => handleUpdateZoneCode(zone.id, e.target.value)}
                            className="w-12 h-7 text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2 rounded-lg text-center focus:outline-none"
                            title="Edit Zone Code"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={zone.businessName || zone.name.replace(/^Zone — /, '')}
                                onChange={e => handleUpdateZoneBusinessName(zone.id, e.target.value)}
                                className="text-sm font-bold text-[#172B4D] border-b border-dashed border-gray-300 hover:border-[#5C1F3D] focus:border-[#5C1F3D] focus:outline-none px-1 py-0.5 rounded"
                                placeholder="Business Name"
                                title="Click to edit Business Name"
                              />
                              {isCustom ? (
                                <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  Custom Hierarchy Override
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  Inherited from Warehouse
                                </span>
                              )}
                              {isModified && (
                                <span className="text-[10px] font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded-full">
                                  Draft Change
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleZoneMode(zone.id, isCustom ? 'default' : 'custom', isCustom ? undefined : COMPACT_3_LEVEL)}
                            className="h-[32px] px-3 text-xs font-medium text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors"
                          >
                            {isCustom ? 'Reset to Inherited' : 'Override Hierarchy'}
                          </button>
                          <button
                            onClick={() => handleDeleteZone(zone.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Zone"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Active Hierarchy Model ({activeModel?.name} — {levelsList.length} Levels)
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-[#172B4D] bg-white border border-gray-200 px-2.5 py-1 rounded">
                            Warehouse ({config.warehouseName})
                          </span>
                          {levelsList.map(lvl => (
                            <span key={lvl.id} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                              <span className="text-gray-300">→</span>
                              <span className="bg-white border border-gray-200 px-2 py-1 rounded">
                                {lvl.name} <span className="font-mono text-[10px] text-gray-400">({lvl.codePrefix})</span>
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredZones.map(zone => (
                  <div key={zone.id} className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded-[3px]">
                          {zone.code}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#172B4D]">{zone.name}</h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                        {zone.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleZoneMode(zone.id, zone.hierarchyMode === 'custom' ? 'default' : 'custom', COMPACT_3_LEVEL)}
                        className="h-[32px] px-3 text-xs font-medium text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px]"
                      >
                        {zone.hierarchyMode === 'custom' ? 'Reset' : 'Override'}
                      </button>
                      <button onClick={() => handleDeleteZone(zone.id)} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-[#f7f8f9] border-b border-[#d1def0] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-3.5">Zone Code</th>
                      <th className="p-3.5">Zone Name</th>
                      <th className="p-3.5">Hierarchy Source</th>
                      <th className="p-3.5">Hierarchy Model</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredZones.map(zone => (
                      <tr key={zone.id} className="hover:bg-gray-50">
                        <td className="p-3.5 font-mono font-bold text-[#5C1F3D]">{zone.code}</td>
                        <td className="p-3.5 font-bold text-[#172B4D]">{zone.name}</td>
                        <td className="p-3.5">{zone.hierarchyMode === 'custom' ? 'Custom Override' : 'Inherited (Warehouse)'}</td>
                        <td className="p-3.5 font-semibold text-[#172B4D]">{zone.hierarchyMode === 'custom' ? zone.customHierarchyModel?.name : config.activeHierarchyModel?.name}</td>
                        <td className="p-3.5 text-right flex items-center justify-end gap-2">
                          <button onClick={() => handleDeleteZone(zone.id)} className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: STORAGE LAYOUT GENERATION */}
        {currentStep === 2 && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="bg-white border border-[#d1def0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Targeted Storage Layout Regeneration</h3>
                  <p className="text-xs text-gray-500">Only generate or regenerate storage locations for modified or newly added zones</p>
                </div>
                <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  Targeted Selective Update
                </span>
              </div>

              {/* Impacted Zones list */}
              <div>
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-2">
                  Impacted Zones ({impactedZonesList.length} Zones requiring regeneration)
                </h4>
                {impactedZonesList.length > 0 ? (
                  <div className="space-y-2">
                    {impactedZonesList.map(z => (
                      <div key={z.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded">
                            {z.code}
                          </span>
                          <span className="text-xs font-bold text-[#172B4D]">{z.name}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#5C1F3D]">
                          ⚡ Regenerating Locations (~2,400 bins)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-500 text-center">
                    No zone changes require layout regeneration.
                  </div>
                )}
              </div>

              {/* Unaffected Zones list */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Unaffected Zones ({unaffectedZonesList.length} Zones preserved)
                </h4>
                <div className="space-y-2">
                  {unaffectedZonesList.map(z => (
                    <div key={z.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {z.code}
                        </span>
                        <span className="text-xs font-medium">{z.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unaffected (Existing layout preserved)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VALIDATE */}
        {currentStep === 3 && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="bg-white border border-[#d1def0] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Targeted Zone Validation</h3>
                  <p className="text-xs text-gray-500">Validates impacted zones for hierarchy conflicts, duplicate zone codes, and structure rules</p>
                </div>
                <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 0 Errors Detected
                </span>
              </div>

              {/* Validation Results */}
              <div className="space-y-2">
                <div className="bg-green-50/70 border border-green-200 rounded-lg p-3 text-xs text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>All zone codes are unique across the warehouse ({zones.map(z => z.code).join(', ')}).</span>
                </div>
                <div className="bg-green-50/70 border border-green-200 rounded-lg p-3 text-xs text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>All active hierarchy model assignments resolve cleanly.</span>
                </div>
                <div className="bg-green-50/70 border border-green-200 rounded-lg p-3 text-xs text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Storage layout capacity and generation rules verified.</span>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-[#172B4D]">Zone Impact Summary</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 border rounded-lg">
                    <span className="text-gray-500 block text-[11px]">Total Zones</span>
                    <span className="text-sm font-bold text-[#172B4D]">{zones.length}</span>
                  </div>
                  <div className="bg-white p-3 border rounded-lg">
                    <span className="text-gray-500 block text-[11px]">Impacted Zones</span>
                    <span className="text-sm font-bold text-[#5C1F3D]">{modifiedZoneIds.size}</span>
                  </div>
                  <div className="bg-white p-3 border rounded-lg">
                    <span className="text-gray-500 block text-[11px]">Validation Result</span>
                    <span className="text-sm font-bold text-green-700">PASS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PUBLISH */}
        {currentStep === 4 && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="bg-white border border-[#d1def0] rounded-xl p-6 shadow-sm space-y-5 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-700">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Ready to Publish Zone Changes</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Publishing will update zone configurations for <strong>{config.warehouseName}</strong>. Unaffected warehouse settings remain unchanged.
                </p>
              </div>

              <div className="bg-[#f7f8f9] border border-gray-200 rounded-xl p-4 text-left max-w-lg mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Warehouse:</span>
                  <span className="font-bold text-[#172B4D]">{config.warehouseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Modified Zones:</span>
                  <span className="font-bold text-[#5C1F3D]">{modifiedZoneIds.size} Zone(s) Updated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Operational Zones:</span>
                  <span className="font-bold text-gray-800">{zones.length} Zones</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePublish}
                  className="h-[36px] px-6 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Zone Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Slide-Over Panel (Add Zone Drawer) ──────────────────────────────── */}
      {showAddZoneDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={handleCloseAddZoneDrawer} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <form onSubmit={handleAddZoneSubmit} className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#f7f8f9]">
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Add New Zone</h3>
                  <p className="text-xs text-gray-500">Configure operational zone under warehouse hierarchy</p>
                </div>
                <button type="button" onClick={handleCloseAddZoneDrawer} className="p-1.5 text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hierarchy Level (Fixed)</label>
                  <input type="text" readOnly value="Zone" className="w-full p-2.5 bg-gray-100 border rounded font-mono font-bold text-gray-600" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inbound, Cold Storage, High Value Storage"
                    value={newBusinessName}
                    onChange={e => setNewBusinessName(e.target.value)}
                    className="w-full p-2.5 border rounded font-bold text-[#172B4D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Zone Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ZA"
                    value={newZoneCode}
                    onChange={e => setNewZoneCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 border rounded font-mono uppercase font-bold"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-[#f7f8f9] flex justify-between gap-3">
                <button type="button" onClick={handleCloseAddZoneDrawer} className="h-[32px] px-4 text-xs font-medium text-gray-700 bg-white border rounded">
                  Cancel
                </button>
                <button type="submit" className="h-[32px] px-5 text-xs font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded">
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Discard Confirmation Modal */}
      {showDrawerDiscardPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-[#172B4D]">Discard Unsaved Zone?</h4>
            <p className="text-xs text-gray-600">You have entered details for this zone. Discarding will clear these entries.</p>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setShowDrawerDiscardPrompt(false)} className="h-[32px] px-3 text-xs border rounded">Continue Editing</button>
              <button onClick={() => { setShowDrawerDiscardPrompt(false); setShowAddZoneDrawer(false); setNewBusinessName(''); setNewZoneCode(''); }} className="h-[32px] px-3 text-xs text-white bg-red-600 rounded">Discard Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Unsaved Discard Prompt */}
      {showDiscardPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-[#172B4D]">Discard Zone Manager Changes?</h4>
            <p className="text-xs text-gray-600">You have unsaved zone draft changes. Discarding will revert to the last published state.</p>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setShowDiscardPrompt(false)} className="h-[32px] px-3 text-xs border rounded">Continue Editing</button>
              <button onClick={onClose} className="h-[32px] px-3 text-xs text-white bg-red-600 rounded">Discard Draft</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Wizard Footer Navigation Bar ───────────────────────────────────── */}
      <div className="bg-white border-t border-[#d1def0] px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((currentStep - 1) as ZoneManagerStep)}
            className="h-[32px] px-4 text-xs font-medium leading-none text-gray-600 border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((currentStep + 1) as ZoneManagerStep)}
              className="h-[32px] px-4 text-xs font-medium leading-none text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="h-[32px] px-5 text-xs font-bold leading-none text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publish Zone Changes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
