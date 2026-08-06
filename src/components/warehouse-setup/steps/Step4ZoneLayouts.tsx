import { useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Search,
  BookOpen,
  Eye,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  Building2,
  X
} from 'lucide-react';
import type { WizardState, ZoneConfig, HierarchyModel } from '../types';
import { HIERARCHY_MODELS_CATALOG, type HierarchyModelCatalogEntry } from '../hierarchyModelsData';

interface Props {
  state: WizardState;
  onChange: (s: WizardState) => void;
}

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  maintenance: 'bg-amber-100 text-amber-700',
};

function generateId() {
  return `zone-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function ZoneCard({
  zone,
  defaultHierarchyModel,
  onUpdate,
  onDelete,
  onOpenHierarchyDesigner,
}: {
  zone: ZoneConfig;
  defaultHierarchyModel: HierarchyModel;
  onUpdate: (z: ZoneConfig) => void;
  onDelete: () => void;
  onOpenHierarchyDesigner: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'flowone' | 'organization' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewHierarchyModal, setShowViewHierarchyModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Source selection: 'warehouse' (Inherit) vs 'model' (Use Hierarchy Model)
  const isInherited = (zone.hierarchySource ?? (zone.hierarchyMode === 'custom' ? 'model' : 'warehouse')) === 'warehouse';

  const activeModel = isInherited
    ? defaultHierarchyModel
    : (zone.customHierarchyModel ?? defaultHierarchyModel);

  // Derived badge label
  const getSourceBadge = () => {
    if (isInherited) return 'Warehouse Hierarchy';
    if (zone.hierarchyModelSourceName) {
      return `${zone.hierarchyModelSourceName} (${zone.hierarchyModelSourceCategory ?? 'Hierarchy Model'})`;
    }
    return `${activeModel.name} (Custom Model)`;
  };

  // Filtered models catalog
  const filteredCatalog = HIERARCHY_MODELS_CATALOG.filter(entry => {
    if (activeCategoryFilter !== 'all' && entry.category !== activeCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = entry.name.toLowerCase().includes(q);
      const descMatch = entry.description.toLowerCase().includes(q);
      const tagMatch = entry.tags.some(t => t.toLowerCase().includes(q));
      return nameMatch || descMatch || tagMatch;
    }
    return true;
  });

  const handleApplyModel = (entry: HierarchyModelCatalogEntry) => {
    onUpdate({
      ...zone,
      hierarchyMode: 'custom',
      hierarchySource: 'model',
      hierarchyModelSourceName: entry.name,
      hierarchyModelSourceCategory: entry.sourceBadge,
      customHierarchyModel: entry.model,
    });
  };

  return (
    <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden shadow-xs hover:border-[#5C1F3D]/40 transition-colors">
      {/* ── Zone Header Bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-[#172B4D] truncate">{zone.name}</h4>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[zone.status]}`}>
                {zone.status}
              </span>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                {zone.code}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-gray-700">Hierarchy Source:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                isInherited
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}>
                {getSourceBadge()}
              </span>
              <span className="text-gray-300">·</span>
              <span>Picking: <strong className="text-gray-700">{zone.pickingStrategy}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Delete Button */}
          <button
            onClick={onDelete}
            title="Delete Zone"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Expanded Content Canvas ────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-[#d1def0] px-5 py-5 bg-[#f7f8f9] space-y-5">
          {/* Basic Edits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Zone Name</label>
              <input
                type="text"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] font-medium text-[#172B4D]"
                value={zone.name}
                onChange={e => onUpdate({ ...zone, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Zone Code</label>
              <input
                type="text"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] font-mono font-bold text-[#172B4D]"
                value={zone.code}
                onChange={e => onUpdate({ ...zone, code: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {/* ── HIERARCHY SOURCE SELECTION CONTROL ───────────────────────────── */}
          <div className="bg-white p-5 rounded-xl border border-[#d1def0] shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                Hierarchy Source Selection
              </label>
              <p className="text-xs text-gray-500">
                Choose where this Zone derives its physical storage hierarchy model.
              </p>
            </div>

            {/* Radio Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    ...zone,
                    hierarchyMode: 'default',
                    hierarchySource: 'warehouse',
                    hierarchyModelSourceName: undefined,
                    hierarchyModelSourceCategory: undefined,
                    customHierarchyModel: undefined,
                  })
                }
                className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                  isInherited
                    ? 'border-[#5C1F3D] bg-purple-50/20 ring-2 ring-[#5C1F3D]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                  isInherited ? 'border-[#5C1F3D] bg-[#5C1F3D]' : 'border-gray-400 bg-white'
                }`}>
                  {isInherited && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172B4D] block">Inherit Warehouse Hierarchy</span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    Uses active Warehouse Master Hierarchy ({defaultHierarchyModel.name}).
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    ...zone,
                    hierarchyMode: 'custom',
                    hierarchySource: 'model',
                    hierarchyModelSourceName: zone.hierarchyModelSourceName ?? 'Cold Storage',
                    hierarchyModelSourceCategory: zone.hierarchyModelSourceCategory ?? 'flowOne Model',
                    customHierarchyModel: zone.customHierarchyModel ?? HIERARCHY_MODELS_CATALOG[1].model,
                  })
                }
                className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                  !isInherited
                    ? 'border-[#5C1F3D] bg-purple-50/20 ring-2 ring-[#5C1F3D]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                  !isInherited ? 'border-[#5C1F3D] bg-[#5C1F3D]' : 'border-gray-400 bg-white'
                }`}>
                  {!isInherited && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172B4D] block">Use Hierarchy Model</span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    Select or create a specialized hierarchy model for this Zone.
                  </span>
                </div>
              </button>
            </div>

            {/* ── CASE 1: INHERIT WAREHOUSE HIERARCHY SUMMARY ───────────────── */}
            {isInherited ? (
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#5C1F3D]" />
                    <span className="text-xs font-bold text-[#172B4D]">Inherited Warehouse Hierarchy Summary</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5 pl-6">
                    <p>Hierarchy Source: <strong>Warehouse Hierarchy</strong></p>
                    <p>Active Model: <strong>{defaultHierarchyModel.name}</strong> ({defaultHierarchyModel.levels.length} Levels)</p>
                    <p>Origin: <strong>Warehouse Configuration</strong></p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowViewHierarchyModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#5C1F3D] bg-white border border-[#5C1F3D]/30 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" /> View Hierarchy
                </button>
              </div>
            ) : (
              /* ── CASE 2: USE HIERARCHY MODEL INLINE SELECTOR ───────────── */
              <div className="bg-[#fcfdfe] border border-[#d1def0] rounded-xl p-4 space-y-4 mt-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                  <div>
                    <h5 className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#5C1F3D]" /> Select Hierarchy Model
                    </h5>
                    <p className="text-[11px] text-gray-500">
                      Choose from reusable flowOne, Organization, or Draft hierarchy models.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search hierarchy models..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5C1F3D]"
                    />
                  </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 overflow-x-auto">
                  {[
                    { id: 'all', label: 'All Hierarchy Models' },
                    { id: 'flowone', label: 'flowOne Hierarchy Models' },
                    { id: 'organization', label: 'Organization Hierarchy Models' },
                    { id: 'draft', label: 'Draft Hierarchy Models' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategoryFilter(tab.id as any)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                        activeCategoryFilter === tab.id
                          ? 'bg-white text-[#5C1F3D] shadow-2xs font-bold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Grid of Catalog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {filteredCatalog.map(entry => {
                    const isSelectedModel = activeModel.name === entry.name;

                    return (
                      <div
                        key={entry.id}
                        className={`bg-white border rounded-xl p-4 transition-all flex flex-col justify-between ${
                          isSelectedModel
                            ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h6 className="text-xs font-bold text-[#172B4D]">{entry.name}</h6>
                                <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                                  {entry.sourceBadge}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">{entry.description}</p>
                            </div>
                            {isSelectedModel && (
                              <CheckCircle2 className="w-4 h-4 text-[#5C1F3D] flex-shrink-0" />
                            )}
                          </div>

                          {/* Level Sequence Preview */}
                          <div className="bg-[#f7f8f9] border border-gray-100 rounded-lg p-2 my-2.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              Levels ({entry.model.levels.length}):
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-gray-700 flex-wrap">
                              {entry.model.levels.map((lvl, idx) => (
                                <span key={lvl.id} className="flex items-center gap-1">
                                  <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold">
                                    {lvl.name} ({lvl.codePrefix})
                                  </span>
                                  {idx < entry.model.levels.length - 1 && <span className="text-gray-300">→</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                          <span className="text-gray-400">{entry.updatedAt}</span>
                          <button
                            type="button"
                            onClick={() => handleApplyModel(entry)}
                            className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                              isSelectedModel
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-[#5C1F3D] text-white hover:bg-[#4a1831] shadow-2xs'
                            }`}
                          >
                            {isSelectedModel ? 'Selected Model' : 'Apply Model to Zone'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar: Create New & Import */}
                <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenHierarchyDesigner}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Create New Hierarchy Model
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImportModal(true)}
                      className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-gray-500" /> Import Hierarchy Model
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 italic">
                    Newly created or imported models will be saved to your Organization Hierarchy Models.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── View Hierarchy Read-Only Modal ───────────────────────────────── */}
      {showViewHierarchyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5C1F3D]" />
                <h3 className="text-base font-bold text-[#172B4D]">
                  {defaultHierarchyModel.name} (Read-Only)
                </h3>
              </div>
              <button onClick={() => setShowViewHierarchyModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Active master hierarchy blueprint inherited directly from Warehouse Configuration.
            </p>

            <div className="space-y-2 bg-[#f7f8f9] p-4 rounded-xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Level Sequence ({defaultHierarchyModel.levels.length} Levels):
              </p>
              {defaultHierarchyModel.levels.map((lvl, idx) => (
                <div key={lvl.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded">
                      L{idx + 1}
                    </span>
                    <span className="font-bold text-[#172B4D]">{lvl.name}</span>
                    <span className="text-gray-400 font-mono">({lvl.codePrefix})</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">Inherited</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowViewHierarchyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Hierarchy Schema Modal ─────────────────────────────────── */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#5C1F3D]" />
                <h3 className="text-base font-bold text-[#172B4D]">Import Hierarchy Model</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Upload a valid hierarchy JSON definition schema (.json) to import into Organization Hierarchy Models.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-xs font-bold text-[#5C1F3D] block">Click to select file</span>
              <span className="text-[11px] text-gray-400">Supports JSON schema format</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Hierarchy Model JSON imported successfully into Organization Hierarchy Models!');
                  setShowImportModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-xs"
              >
                Import & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Step4ZoneLayouts({ state, onChange }: Props) {
  const zones = state.zones;
  const defaultHierarchyModel = state.hierarchyModel;

  const updateZone = (updated: ZoneConfig) => {
    onChange({ ...state, zones: state.zones.map(z => z.id === updated.id ? updated : z) });
  };

  const deleteZone = (zoneId: string) => {
    onChange({ ...state, zones: state.zones.filter(z => z.id !== zoneId) });
  };

  const addZone = () => {
    const newZone: ZoneConfig = {
      id: generateId(),
      name: `Zone ${String.fromCharCode(65 + zones.length)}`,
      code: `Z${String.fromCharCode(65 + zones.length)}`,
      status: 'active',
      hierarchyMode: 'default',
      hierarchySource: 'warehouse',
      pickingStrategy: 'FIFO',
      generation: { levels: [] },
    };
    onChange({ ...state, zones: [...zones, newZone] });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Zone Layouts & Hierarchy Sources</h3>
          <p className="text-sm text-gray-500">
            Define storage zones and select whether each zone inherits the Warehouse Hierarchy or uses a specialized Hierarchy Model.
          </p>
        </div>
        <button
          onClick={addZone}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      <div className="space-y-4">
        {zones.map(zone => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            defaultHierarchyModel={defaultHierarchyModel}
            onUpdate={updateZone}
            onDelete={() => deleteZone(zone.id)}
            onOpenHierarchyDesigner={() => {
              // Trigger inline designer launch
            }}
          />
        ))}
      </div>
    </div>
  );
}
