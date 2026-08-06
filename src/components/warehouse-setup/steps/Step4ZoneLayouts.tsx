import { useState, useEffect } from 'react';
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
  X,
  Lightbulb,
  ArrowRight,
  Save,
  Check,
  ShieldAlert,
  AlertTriangle,
  AlertCircle
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

const DEPENDENT_ZONE_IDS = ['zone-a', 'zone-b', 'zone-c'];

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
  const [showAdvancedHierarchy, setShowAdvancedHierarchy] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'flowone' | 'organization' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewHierarchyModal, setShowViewHierarchyModal] = useState(false);
  const [showFullCatalogModal, setShowFullCatalogModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Auto-dismissing toast for Outcome 1 (Compatible)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Outcome 2 (Review Required - Impact Assessment) Modal State
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [pendingModelToApply, setPendingModelToApply] = useState<HierarchyModelCatalogEntry | null>(null);

  // Outcome 3 (Conflict Detected) Modal State
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<string[]>([]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const rawName = zone.name || 'Zone A';
  const nameParts = rawName.split(' — ');
  const levelPrefix = defaultHierarchyModel.levels[0]?.name ?? 'Zone';
  const businessLabel = nameParts[1] ?? nameParts[0].replace(/^Zone\s+[A-[#]*/i, '') ?? 'General Storage';

  const isInherited = (zone.hierarchySource ?? (zone.hierarchyMode === 'custom' ? 'model' : 'warehouse')) === 'warehouse';

  const activeModel = isInherited
    ? defaultHierarchyModel
    : (zone.customHierarchyModel ?? defaultHierarchyModel);

  const getSourceBadge = () => {
    if (isInherited) return 'Inherited from Warehouse';
    if (zone.hierarchyModelSourceName) {
      return `${zone.hierarchyModelSourceName} (${zone.hierarchyModelSourceCategory ?? 'Hierarchy Model'})`;
    }
    return `${activeModel.name} (Custom Model)`;
  };

  const smartRecommendation = HIERARCHY_MODELS_CATALOG.find(entry => {
    const q = businessLabel.toLowerCase();
    if (q.includes('cold') || q.includes('freezer') || q.includes('frozen')) {
      return entry.id === 'hm-flowone-cold-storage';
    }
    if (q.includes('vault') || q.includes('high') || q.includes('val')) {
      return entry.id === 'hm-org-high-value';
    }
    if (q.includes('retail') || q.includes('fast')) {
      return entry.id === 'hm-flowone-retail';
    }
    if (q.includes('bulk') || q.includes('floor')) {
      return entry.id === 'hm-org-bulk-pallet';
    }
    return false;
  });

  const filteredCatalog = HIERARCHY_MODELS_CATALOG.filter(entry => {
    if (activeCategoryFilter !== 'all' && entry.category !== activeCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return entry.name.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q);
    }
    return true;
  });

  // ── HIERARCHY COMPATIBILITY VALIDATION ENGINE ─────────────────────────────
  const initiateApplyModel = (entry: HierarchyModelCatalogEntry) => {
    const hasOperationalData = DEPENDENT_ZONE_IDS.includes(zone.id);
    const hasConflict = entry.id === 'hm-[#conflict-test]'; // Synthetic conflict trigger test if needed

    if (hasConflict) {
      // OUTCOME 3: CONFLICT DETECTED
      setConflictDetails([
        'Active warehouse putaway rule "PR-102" references missing hierarchy level "Shelf".',
        'Invalid storage location mappings detected for 142 bins.',
        'Barcode pattern conflict: Entry barcode format does not match zone prefix rules.',
      ]);
      setShowConflictModal(true);
      return;
    }

    if (hasOperationalData) {
      // OUTCOME 2: REVIEW REQUIRED (IMPACT ASSESSMENT)
      setPendingModelToApply(entry);
      setShowImpactModal(true);
      return;
    }

    // OUTCOME 1: COMPATIBLE (SKIP IMPACT ASSESSMENT FOR NEW ZONES)
    applyModelDirectly(entry);
  };

  const applyModelDirectly = (entry: HierarchyModelCatalogEntry) => {
    onUpdate({
      ...zone,
      hierarchyMode: 'custom',
      hierarchySource: 'model',
      hierarchyModelSourceName: entry.name,
      hierarchyModelSourceCategory: entry.sourceBadge,
      customHierarchyModel: entry.model,
    });
    setShowAdvancedHierarchy(false);
    setShowImpactModal(false);
    setPendingModelToApply(null);
    setToastMessage(`✓ Hierarchy Applied Successfully: "${entry.name}" has been applied to ${zone.name}. No operational data was affected.`);
  };

  const handleBusinessLabelChange = (newLabel: string) => {
    const combinedName = `${levelPrefix} — ${newLabel}`;
    onUpdate({ ...zone, name: combinedName });
  };

  return (
    <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden shadow-xs hover:border-[#5C1F3D]/40 transition-colors relative">
      {/* ── AUTO-DISMISSING TOAST FOR OUTCOME 1 (COMPATIBLE) ─────────────── */}
      {toastMessage && (
        <div className="bg-[#172B4D] text-white px-4 py-2.5 shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white text-xs font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

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
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                isInherited
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}>
                {isInherited && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                {getSourceBadge()}
              </span>
              <span className="text-gray-300">·</span>
              <span>Picking: <strong className="text-gray-700">{zone.pickingStrategy}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
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
        <div className="border-t border-[#d1def0] px-5 py-5 bg-[#f7f8f9] space-y-4">
          {/* ── LEVEL 1 HIERARCHY NAMING CONTROL ───────────────────────────── */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                Hierarchy Naming (Level 1)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Level Prefix is Fixed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Hierarchy Level (Fixed)
                </label>
                <input
                  type="text"
                  readOnly
                  value={levelPrefix}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 font-mono font-bold text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Business Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inbound, Cold Storage, Fast-Pick"
                  value={businessLabel}
                  onChange={e => handleBusinessLabelChange(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] font-bold text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Zone Code
                </label>
                <input
                  type="text"
                  value={zone.code}
                  onChange={e => onUpdate({ ...zone, code: e.target.value.toUpperCase() })}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] font-mono font-bold text-[#172B4D]"
                />
              </div>
            </div>

            <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Displayed Instance Name:</span>
              <span className="font-bold text-[#172B4D] font-mono bg-white border border-gray-200 px-2 py-0.5 rounded">
                {levelPrefix} – {businessLabel}
              </span>
            </div>
          </div>

          {/* ── HIERARCHY SOURCE SUMMARY & PROGRESSIVE DISCLOSURE ───────────── */}
          <div className="bg-white p-4 rounded-xl border border-[#d1def0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider block">
                  Hierarchy Source
                </span>
                <span className="text-[11px] text-gray-500">
                  Current Source: <strong>{getSourceBadge()}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedHierarchy(!showAdvancedHierarchy)}
                className="px-3 py-1.5 text-xs font-bold text-[#5C1F3D] hover:bg-purple-50 border border-[#5C1F3D]/30 rounded-lg transition-colors"
              >
                {showAdvancedHierarchy ? 'Hide Options' : '[Change Source]'}
              </button>
            </div>

            {isInherited && !showAdvancedHierarchy && (
              <div className="bg-green-50/60 border border-green-200/70 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-green-900 block">Inherited from Warehouse Hierarchy</span>
                    <span className="text-green-700 text-[11px]">
                      Active Blueprint: {defaultHierarchyModel.name} ({defaultHierarchyModel.levels.length} Levels)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowViewHierarchyModal(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-green-800 bg-white border border-green-300 rounded hover:bg-green-100"
                >
                  View Blueprint →
                </button>
              </div>
            )}

            {/* ── PROGRESSIVELY REVEALED ADVANCED SELECTOR ───────────────────── */}
            {showAdvancedHierarchy && (
              <div className="bg-[#fcfdfe] border border-[#d1def0] rounded-xl p-4 space-y-4 pt-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
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
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isInherited ? 'border-[#5C1F3D] bg-purple-50/20 font-bold' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isInherited ? 'border-[#5C1F3D] bg-[#5C1F3D]' : 'border-gray-400'
                    }`}>
                      {isInherited && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs text-[#172B4D]">Inherit Warehouse Hierarchy (Recommended)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      initiateApplyModel(HIERARCHY_MODELS_CATALOG[1])
                    }
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      !isInherited ? 'border-[#5C1F3D] bg-purple-50/20 font-bold' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      !isInherited ? 'border-[#5C1F3D] bg-[#5C1F3D]' : 'border-gray-400'
                    }`}>
                      {!isInherited && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs text-[#172B4D]">Use Different Hierarchy Model</span>
                  </button>
                </div>

                {!isInherited && (
                  <div className="space-y-3 pt-2">
                    {smartRecommendation && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-amber-950">Suggested Model for "{businessLabel}":</span>
                            <span className="text-amber-800 text-[11px] block">{smartRecommendation.name} ({smartRecommendation.description})</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => initiateApplyModel(smartRecommendation)}
                          className="px-3 py-1 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-2xs"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#172B4D]">Select Hierarchy Model</span>
                      <button
                        type="button"
                        onClick={() => setShowFullCatalogModal(true)}
                        className="text-xs font-bold text-[#5C1F3D] hover:underline flex items-center gap-1"
                      >
                        Browse All Models <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 overflow-x-auto">
                      {[
                        { id: 'all', label: 'All Models' },
                        { id: 'flowone', label: 'flowOne Models' },
                        { id: 'organization', label: 'Organization Models' },
                        { id: 'draft', label: 'Draft Models' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveCategoryFilter(tab.id as any)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap ${
                            activeCategoryFilter === tab.id
                              ? 'bg-white text-[#5C1F3D] shadow-2xs font-bold'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredCatalog.slice(0, 4).map(entry => {
                        const isSelectedModel = activeModel.name === entry.name;
                        return (
                          <div
                            key={entry.id}
                            className={`bg-white border rounded-xl p-3 transition-all flex flex-col justify-between ${
                              isSelectedModel
                                ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h6 className="text-xs font-bold text-[#172B4D]">{entry.name}</h6>
                                <span className="text-[9px] font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-100">
                                  {entry.sourceBadge}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{entry.description}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => initiateApplyModel(entry)}
                              className={`mt-2 w-full py-1 text-[11px] font-bold rounded-lg transition-colors ${
                                isSelectedModel
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-[#5C1F3D] text-white hover:bg-[#4a1831]'
                              }`}
                            >
                              {isSelectedModel ? 'Selected Model' : 'Apply Model'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newModelName = `${businessLabel || 'Custom'} Special Hierarchy`;
                            const newEntry: HierarchyModelCatalogEntry = {
                              id: `hm-new-${Date.now()}`,
                              name: newModelName,
                              category: 'organization',
                              categoryLabel: 'Organization Hierarchy Models',
                              description: `Custom model created for ${zone.name}`,
                              sourceBadge: 'Organization Model',
                              updatedAt: 'Created just now',
                              levelCount: 4,
                              tags: ['Custom'],
                              model: HIERARCHY_MODELS_CATALOG[0].model,
                            };
                            initiateApplyModel(newEntry);
                          }}
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
                      <button
                        type="button"
                        onClick={() => setShowFullCatalogModal(true)}
                        className="text-xs font-bold text-[#5C1F3D] hover:underline"
                      >
                        Browse All Models →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── OUTCOME 2: REVIEW REQUIRED (IMPACT ASSESSMENT MODAL) ─────────── */}
      {showImpactModal && pendingModelToApply && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-amber-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Impact Assessment — Review Required</h3>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  Applying "{pendingModelToApply.name}" will affect this Published Zone ({zone.name}).
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
              <p className="font-semibold text-amber-950">Detected Operational Impact:</p>
              <ul className="space-y-1 font-mono text-[11px] text-amber-900 pl-2">
                <li>• 1,248 Active Storage Locations</li>
                <li>• 352 Inventory SKU Records</li>
                <li>• 3 Putaway Rules & 2 Picking Strategies</li>
                <li>• 1 Replenishment Rule</li>
              </ul>
              <p className="text-[11px] text-amber-800 pt-1 italic">
                A Draft Version is required before applying this hierarchy to preserve operational integrity.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowImpactModal(false);
                  setPendingModelToApply(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => applyModelDirectly(pendingModelToApply)}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
              >
                Create Draft & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── OUTCOME 3: CONFLICT DETECTED (HIERARCHY VALIDATION FAILED MODAL) ── */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-red-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Hierarchy Validation Failed</h3>
                <p className="text-xs text-red-700 font-semibold mt-0.5">
                  The selected Hierarchy Model cannot be applied because operational conflicts were detected.
                </p>
              </div>
            </div>

            <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 text-xs text-red-900 space-y-2">
              <p className="font-semibold text-red-950">Detected Validation Conflicts:</p>
              <ul className="space-y-1 font-mono text-[11px] text-red-900 pl-2">
                {conflictDetails.map((c, idx) => (
                  <li key={idx}>• {c}</li>
                ))}
              </ul>
              <p className="text-[11px] text-red-800 pt-1 italic">
                Resolve these structural conflicts before applying the hierarchy model.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Opening detailed Conflict Inspector...');
                  setShowConflictModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                View Conflicts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Blueprint Modal ─────────────────────────────────────────── */}
      {showViewHierarchyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5C1F3D]" />
                <h3 className="text-base font-bold text-[#172B4D]">{defaultHierarchyModel.name}</h3>
              </div>
              <button onClick={() => setShowViewHierarchyModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 bg-[#f7f8f9] p-4 rounded-xl border border-gray-200">
              {defaultHierarchyModel.levels.map((lvl, idx) => (
                <div key={lvl.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2.5 text-xs">
                  <span className="font-bold text-[#172B4D]">L{idx + 1}: {lvl.name} ({lvl.codePrefix})</span>
                  <span className="text-[10px] text-gray-400">Inherited</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowViewHierarchyModal(false)} className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Browse All Hierarchy Models Full Catalog Modal ───────────────── */}
      {showFullCatalogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#fbfcfd] flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Hierarchy Models Catalog</h3>
                <p className="text-xs text-gray-500">Browse all available flowOne, Organization, and Draft models</p>
              </div>
              <button onClick={() => setShowFullCatalogModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-4">
              {HIERARCHY_MODELS_CATALOG.map(entry => (
                <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:border-[#5C1F3D] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[#172B4D]">{entry.name}</h4>
                      <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{entry.sourceBadge}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{entry.description}</p>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600 flex-wrap">
                      {entry.model.levels.map(l => (
                        <span key={l.id} className="bg-gray-100 px-1.5 py-0.5 rounded">{l.name}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      initiateApplyModel(entry);
                      setShowFullCatalogModal(false);
                    }}
                    className="mt-4 w-full py-2 text-xs font-bold text-white bg-[#5C1F3D] rounded-lg hover:bg-[#4a1831]"
                  >
                    Select Model
                  </button>
                </div>
              ))}
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
                  const importedEntry: HierarchyModelCatalogEntry = {
                    id: `hm-imported-${Date.now()}`,
                    name: `Imported Model ${Date.now().toString().slice(-4)}`,
                    category: 'organization',
                    categoryLabel: 'Organization Hierarchy Models',
                    description: 'Imported from JSON schema',
                    sourceBadge: 'Organization Model',
                    updatedAt: 'Imported just now',
                    levelCount: 4,
                    tags: ['Imported'],
                    model: HIERARCHY_MODELS_CATALOG[0].model,
                  };
                  setShowImportModal(false);
                  initiateApplyModel(importedEntry);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-xs"
              >
                Import & Apply to Zone
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

  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newBusinessLabel, setNewBusinessLabel] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');

  const updateZone = (updated: ZoneConfig) => {
    onChange({ ...state, zones: state.zones.map(z => z.id === updated.id ? updated : z) });
  };

  const deleteZone = (zoneId: string) => {
    onChange({ ...state, zones: state.zones.filter(z => z.id !== zoneId) });
  };

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessLabel.trim()) return;

    const char = String.fromCharCode(65 + zones.length);
    const code = newZoneCode.trim().toUpperCase() || `Z${char}`;
    const levelPrefix = defaultHierarchyModel.levels[0]?.name ?? 'Zone';

    const newZone: ZoneConfig = {
      id: generateId(),
      name: `${levelPrefix} — ${newBusinessLabel.trim()}`,
      code,
      status: 'active',
      hierarchyMode: 'default',
      hierarchySource: 'warehouse',
      pickingStrategy: 'FIFO',
      generation: { levels: [] },
    };

    onChange({ ...state, zones: [...zones, newZone] });
    setNewBusinessLabel('');
    setNewZoneCode('');
    setShowAddZoneModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Zone Configuration</h3>
          <p className="text-sm text-gray-500">
            Configure storage zones. New zones automatically inherit the active Warehouse Hierarchy.
          </p>
        </div>
        <button
          onClick={() => setShowAddZoneModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          + Add Zone
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
            onOpenHierarchyDesigner={() => {}}
          />
        ))}
      </div>

      {showAddZoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5C1F3D]" />
                <h3 className="text-base font-bold text-[#172B4D]">Add New Zone</h3>
              </div>
              <button onClick={() => setShowAddZoneModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZoneSubmit} className="space-y-4 text-xs">
              <div className="bg-green-50/70 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-900">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Zone will automatically inherit the active <strong>Warehouse Hierarchy</strong>.</span>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Hierarchy Level (Fixed)
                </label>
                <input
                  type="text"
                  readOnly
                  value={defaultHierarchyModel.levels[0]?.name ?? 'Zone'}
                  className="w-full p-2.5 border border-gray-200 bg-gray-100 rounded-lg font-mono font-bold text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Business Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inbound, Cold Storage, Fast-Pick"
                  value={newBusinessLabel}
                  onChange={e => setNewBusinessLabel(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] font-bold text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Zone Code <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Z${String.fromCharCode(65 + zones.length)}`}
                  value={newZoneCode}
                  onChange={e => setNewZoneCode(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] font-mono uppercase"
                />
              </div>

              <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Displayed Name Preview:</span>
                <span className="font-bold text-[#172B4D] font-mono">
                  {defaultHierarchyModel.levels[0]?.name ?? 'Zone'} – {newBusinessLabel || 'Label'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-xs"
                >
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
