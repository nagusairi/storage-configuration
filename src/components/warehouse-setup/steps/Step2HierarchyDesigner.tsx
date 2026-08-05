import { useState, useEffect } from 'react';
import {
  Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Info,
  Copy, MoreVertical, ArrowDown, CheckCircle2, AlertTriangle,
  XCircle, Globe, Save, Sparkles, Layers, Sliders, ChevronRight
} from 'lucide-react';
import type { WizardState, HierarchyLevel } from '../types';
import { ReviewChangesModal } from '../modals/ReviewChangesModal';

interface Step2HierarchyDesignerProps {
  state: WizardState;
  onChange: (s: WizardState) => void;
  onFinishEdit?: () => void;
}

const DEPTH_COLORS = [
  'bg-purple-500 text-purple-600 border-purple-200 bg-purple-50',
  'bg-blue-500 text-blue-600 border-blue-200 bg-blue-50',
  'bg-teal-500 text-teal-600 border-teal-200 bg-teal-50',
  'bg-green-500 text-green-600 border-green-200 bg-green-50',
  'bg-amber-500 text-amber-600 border-amber-200 bg-amber-50',
  'bg-orange-500 text-orange-600 border-orange-200 bg-orange-50',
  'bg-rose-500 text-rose-600 border-rose-200 bg-rose-50',
];

const CAPABILITY_TOGGLES: { key: keyof HierarchyLevel; label: string }[] = [
  { key: 'supportsCapacity',   label: 'Capacity' },
  { key: 'supportsDimensions', label: 'Dimensions' },
  { key: 'supportsWeight',     label: 'Weight' },
  { key: 'supportsBarcode',    label: 'Barcode' },
  { key: 'supportsTemperature',label: 'Temperature' },
  { key: 'supportsSerial',     label: 'Serial' },
  { key: 'supportsBatch',      label: 'Batch' },
];

function generateId() { return `lvl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function buildDefaultLevel(depth: number, name?: string, prefix?: string): HierarchyLevel {
  const levelNum = depth + 1;
  const lName = name || `Level ${levelNum}`;
  return {
    id: generateId(),
    name: lName,
    pluralName: `${lName}s`,
    codePrefix: prefix || `L${levelNum}`,
    depth,
    supportsCapacity: true,
    supportsDimensions: true,
    supportsWeight: false,
    supportsBarcode: true,
    supportsTemperature: false,
    supportsSerial: false,
    supportsBatch: false,
    allowedChildLevelIds: [],
  };
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      type="button"
      className={`relative w-8 h-4.5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[#5C1F3D]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function DropIndicatorLine({ label }: { label: string }) {
  return (
    <div className="w-full my-1.5 flex items-center justify-center gap-2 animate-pulse pointer-events-none">
      <div className="flex-1 h-0.5 bg-[#5C1F3D] rounded-full shadow-[0_0_8px_rgba(92,31,61,0.6)]" />
      <span className="text-[10px] font-bold text-[#5C1F3D] bg-[#f9f4f7] border border-[#5C1F3D]/40 px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-0.5 bg-[#5C1F3D] rounded-full shadow-[0_0_8px_rgba(92,31,61,0.6)]" />
    </div>
  );
}

export function Step2HierarchyDesigner({ state, onChange, onFinishEdit }: Step2HierarchyDesignerProps) {
  const levels = state.hierarchyModel.levels;

  // Selected level for Properties Inspector
  const [selectedId, setSelectedId] = useState<string>(levels[0]?.id ?? '');
  const selectedLevel = levels.find(l => l.id === selectedId) || levels[0];

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Store initial levels for review changes diff
  const [initialLevels] = useState<HierarchyLevel[]>([...levels]);

  // Context menu popover state for node cards
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Review changes modal state
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Auto-save feedback state
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('Draft Saved • Just now');

  // Select initial if selection lost
  useEffect(() => {
    if (!selectedLevel && levels.length > 0) {
      setSelectedId(levels[0].id);
    }
  }, [levels, selectedLevel]);

  // Update levels helper with auto-save timestamp trigger
  const updateLevels = (newLevels: HierarchyLevel[]) => {
    const recalculated = newLevels.map((l, idx) => ({ ...l, depth: idx }));
    onChange({
      ...state,
      isDirty: true,
      hierarchyModel: { ...state.hierarchyModel, levels: recalculated }
    });
    setAutoSaveStatus('Draft Saved • Just now');
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const dtSource = e.dataTransfer.getData('text/plain');
    const sourceIndex = draggedIndex !== null ? draggedIndex : parseInt(dtSource, 10);

    if (!isNaN(sourceIndex) && sourceIndex >= 0 && sourceIndex < levels.length && sourceIndex !== targetIndex) {
      const updated = [...levels];
      const [movedItem] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      updateLevels(updated);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Level operations
  const addLevel = () => {
    const newLvl = buildDefaultLevel(levels.length);
    updateLevels([...levels, newLvl]);
    setSelectedId(newLvl.id);
  };

  const insertAbove = (idx: number) => {
    const newLvl = buildDefaultLevel(idx, `Level ${idx + 1}`, `L${idx + 1}`);
    const updated = [...levels];
    updated.splice(idx, 0, newLvl);
    updateLevels(updated);
    setSelectedId(newLvl.id);
    setActiveMenuId(null);
  };

  const insertBelow = (idx: number) => {
    const newLvl = buildDefaultLevel(idx + 1, `Level ${idx + 2}`, `L${idx + 2}`);
    const updated = [...levels];
    updated.splice(idx + 1, 0, newLvl);
    updateLevels(updated);
    setSelectedId(newLvl.id);
    setActiveMenuId(null);
  };

  const duplicateLevel = (idx: number) => {
    const src = levels[idx];
    const dup: HierarchyLevel = {
      ...src,
      id: generateId(),
      name: `${src.name} (Copy)`,
      pluralName: `${src.pluralName} (Copy)`,
      codePrefix: `${src.codePrefix}_C`,
    };
    const updated = [...levels];
    updated.splice(idx + 1, 0, dup);
    updateLevels(updated);
    setSelectedId(dup.id);
    setActiveMenuId(null);
  };

  const deleteLevel = (id: string) => {
    if (levels.length <= 1) return;
    const updated = levels.filter(l => l.id !== id);
    updateLevels(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id ?? '');
    }
    setActiveMenuId(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...levels];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    updateLevels(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === levels.length - 1) return;
    const updated = [...levels];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    updateLevels(updated);
  };

  const updateSelected = (patch: Partial<HierarchyLevel>) => {
    if (!selectedLevel) return;
    updateLevels(levels.map(l => l.id === selectedLevel.id ? { ...l, ...patch } : l));
  };

  // Live real-time validation checks
  const prefixes = levels.map(l => l.codePrefix.trim().toUpperCase());
  const hasDuplicatePrefix = new Set(prefixes).size !== prefixes.length;
  const hasEmptyName = levels.some(l => !l.name.trim());
  const hasValidSequence = levels.length > 0 && !hasEmptyName && !hasDuplicatePrefix;

  return (
    <div className="flex flex-col h-full bg-[#f7f8f9]">

      {/* ── Sub-header: Live Validation + Auto-Save Status ──────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#172B4D]">Blueprint Designer</span>
          <span className="text-gray-300">|</span>
          <span className="text-[11px] text-[#36B37E] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {autoSaveStatus}
          </span>
        </div>

        {/* Live Validation Bar */}
        <div className="flex items-center gap-2">
          {hasValidSequence && !hasDuplicatePrefix && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <CheckCircle2 className="w-3 h-3" /> Parent-child sequence valid
            </span>
          )}
          {hasDuplicatePrefix && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3" /> Duplicate code prefix detected
            </span>
          )}
          {hasEmptyName && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              <XCircle className="w-3 h-3" /> Missing level name
            </span>
          )}

          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded transition-colors ml-2"
          >
            Review & Publish
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 3-Column Designer Workspace ──────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* ── Column 1: Hierarchy Structure (Editable List) ──────────────── */}
        <div className="w-72 border-r border-[#d1def0] bg-white p-4 flex flex-col min-h-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 1. Hierarchy Structure
            </h4>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {levels.length} Levels
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {levels.map((lvl, idx) => {
              const isSelected = lvl.id === selectedId;
              const isDragging = draggedIndex === idx;
              const isDragOver = dragOverIndex === idx && draggedIndex !== idx;
              const theme = DEPTH_COLORS[idx % DEPTH_COLORS.length];
              const colorDot = theme.split(' ')[0];

              return (
                <div
                  key={lvl.id}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, idx)}
                  className="flex flex-col"
                >
                  {/* Blinking Drop Indicator Line above hovered item */}
                  {isDragOver && (
                    <DropIndicatorLine label={`Drop here → Position L${idx + 1}`} />
                  )}

                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedId(lvl.id)}
                    className={`group relative flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isDragging
                        ? 'opacity-30 border-dashed border-[#5C1F3D] bg-gray-50'
                        : isDragOver
                        ? 'border-2 border-[#5C1F3D] bg-purple-50/50 shadow-md ring-2 ring-[#5C1F3D]/20'
                        : isSelected
                        ? 'border-[#5C1F3D] bg-[#f9f4f7] shadow-sm ring-1 ring-[#5C1F3D]/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-gray-400 cursor-grab flex-shrink-0 hover:text-[#5C1F3D]" />
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorDot}`} />
                    <span className="text-[10px] font-bold text-gray-400 w-4 flex-shrink-0">L{idx + 1}</span>

                    <input
                      type="text"
                      value={lvl.name}
                      onChange={e => {
                        const updated = levels.map(l => l.id === lvl.id ? { ...l, name: e.target.value, pluralName: `${e.target.value}s` } : l);
                        updateLevels(updated);
                      }}
                      className="flex-1 min-w-0 font-medium text-[#172B4D] bg-transparent border-none outline-none focus:bg-white focus:px-1 rounded"
                      placeholder="Level Name"
                    />

                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1 py-0.5 rounded">
                      {lvl.codePrefix}
                    </span>

                    {/* Reorder Buttons */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveUp(idx); }}
                        disabled={idx === 0}
                        className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-20"
                      >
                        <ChevronUp className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveDown(idx); }}
                        disabled={idx === levels.length - 1}
                        className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-20"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addLevel}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#5C1F3D] border border-dashed border-[#5C1F3D]/40 rounded-lg hover:bg-[#f9f4f7] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Level
          </button>
        </div>

        {/* ── Column 2: Visual Hierarchy Builder (Connected Node Canvas) ────── */}
        <div
          onDragOver={(e) => e.preventDefault()}
          className="flex-1 bg-[#f0f4f8] p-6 overflow-y-auto min-h-0 flex flex-col items-center"
        >
          <div className="w-full max-w-md">
            <div className="mb-4 text-center">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                2. Visual Hierarchy Flow
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Drag nodes to reorder or click for properties & contextual actions
              </p>
            </div>

            {/* Root Warehouse Node */}
            <div className="bg-gradient-to-r from-[#5C1F3D] to-[#4a1831] text-white rounded-xl p-3.5 shadow-md text-center border border-white/20 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-pink-200">Root Entity</span>
              <h3 className="text-sm font-bold text-white">Warehouse</h3>
            </div>

            <div className="flex justify-center mb-3">
              <ArrowDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Level Nodes Flow */}
            <div className="flex flex-col gap-3">
              {levels.map((lvl, idx) => {
                const isSelected = lvl.id === selectedId;
                const isDragging = draggedIndex === idx;
                const isDragOver = dragOverIndex === idx && draggedIndex !== idx;
                const theme = DEPTH_COLORS[idx % DEPTH_COLORS.length];

                return (
                  <div
                    key={lvl.id}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Blinking Drop Indicator Line above hovered node card */}
                    {isDragOver && (
                      <DropIndicatorLine label={`✦ Place at Depth ${idx + 1}`} />
                    )}

                    {/* Node Card */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedId(lvl.id)}
                      className={`w-full bg-white rounded-xl border p-4 shadow-sm relative transition-all cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? 'opacity-30 border-dashed border-[#5C1F3D]'
                          : isDragOver
                          ? 'border-2 border-[#5C1F3D] ring-4 ring-[#5C1F3D]/20 scale-[1.02]'
                          : isSelected
                          ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-md'
                          : 'border-[#d1def0] hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-gray-400 hover:text-[#5C1F3D]" />
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme}`}>
                            Depth {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-[#172B4D]">{lvl.name || 'Unnamed Level'}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Prefix: {lvl.codePrefix}
                          </span>

                          {/* Context Menu Button */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === lvl.id ? null : lvl.id);
                              }}
                              className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === lvl.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-7 z-30 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 text-xs text-[#172B4D]"
                              >
                                <button
                                  onClick={() => insertAbove(idx)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Plus className="w-3.5 h-3.5 text-blue-500" /> Insert Above
                                </button>
                                <button
                                  onClick={() => insertBelow(idx)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Plus className="w-3.5 h-3.5 text-green-500" /> Insert Below
                                </button>
                                <button
                                  onClick={() => duplicateLevel(idx)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5 text-purple-500" /> Duplicate
                                </button>
                                <div className="h-[1px] bg-gray-100 my-1" />
                                <button
                                  onClick={() => deleteLevel(lvl.id)}
                                  disabled={levels.length <= 1}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 disabled:opacity-40"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Level
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Level Badges */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {lvl.supportsCapacity && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Capacity</span>}
                        {lvl.supportsDimensions && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Dimensions</span>}
                        {lvl.supportsBarcode && <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">Barcode</span>}
                        {lvl.supportsTemperature && <span className="text-[10px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded">Temperature</span>}
                        {lvl.supportsBatch && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Batch</span>}
                        {lvl.supportsSerial && <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">Serial</span>}
                      </div>
                    </div>

                    {/* Connector Arrow */}
                    {idx < levels.length - 1 && (
                      <div className="py-2">
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Column 3: Properties Inspector ──────────────────────────────── */}
        <div className="w-80 border-l border-[#d1def0] bg-white p-4 flex flex-col min-h-0 flex-shrink-0 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> 3. Properties Inspector
          </h4>

          {selectedLevel ? (
            <div className="flex flex-col gap-4">
              {/* Active Selection Banner */}
              <div className="p-3 bg-[#f9f4f7] border border-[#5C1F3D]/20 rounded-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F3D]">Selected Level</span>
                <h3 className="text-sm font-bold text-[#172B4D]">{selectedLevel.name}</h3>
                <p className="text-[11px] text-gray-500">Depth Index: {selectedLevel.depth + 1}</p>
              </div>

              {/* Text Fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={selectedLevel.name}
                    onChange={e => updateSelected({ name: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Plural Name</label>
                  <input
                    type="text"
                    value={selectedLevel.pluralName}
                    onChange={e => updateSelected({ pluralName: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Code Prefix</label>
                  <input
                    type="text"
                    value={selectedLevel.codePrefix}
                    onChange={e => updateSelected({ codePrefix: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D]"
                  />
                </div>
              </div>

              {/* Capabilities Toggles */}
              <div className="pt-3 border-t border-gray-100">
                <h5 className="text-xs font-semibold text-[#172B4D] mb-2.5">Level Capabilities</h5>
                <div className="flex flex-col gap-2">
                  {CAPABILITY_TOGGLES.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-gray-700">Supports {label}</span>
                      <Toggle
                        enabled={selectedLevel[key] as boolean}
                        onChange={v => updateSelected({ [key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Select a level to inspect its metadata properties.
            </div>
          )}
        </div>
      </div>

      {/* ── Review Changes Modal ─────────────────────────────────────────── */}
      <ReviewChangesModal
        isOpen={showReviewModal}
        modelName={state.hierarchyModel.name}
        initialLevels={initialLevels}
        currentLevels={levels}
        onPublish={() => {
          setShowReviewModal(false);
          if (onFinishEdit) onFinishEdit();
        }}
        onSaveDraft={() => {
          setShowReviewModal(false);
          setAutoSaveStatus('Draft Saved • Just now');
        }}
        onCancel={() => setShowReviewModal(false)}
      />
    </div>
  );
}
