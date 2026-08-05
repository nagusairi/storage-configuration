import { useState } from 'react';
import type { WizardState, HierarchyLevel } from '../types';

interface Props { state: WizardState; onChange: (s: WizardState) => void; }

const TOGGLES: { key: keyof HierarchyLevel; label: string }[] = [
  { key: 'supportsCapacity', label: 'Capacity' },
  { key: 'supportsDimensions', label: 'Dimensions' },
  { key: 'supportsWeight', label: 'Weight' },
  { key: 'supportsBarcode', label: 'Barcode' },
  { key: 'supportsTemperature', label: 'Temperature' },
  { key: 'supportsSerial', label: 'Serial' },
  { key: 'supportsBatch', label: 'Batch' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[#5C1F3D]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function Step3LevelProperties({ state, onChange }: Props) {
  const levels = state.hierarchyModel.levels;
  const [selectedId, setSelectedId] = useState(levels[0]?.id ?? '');
  const selected = levels.find(l => l.id === selectedId);

  const updateLevel = (patch: Partial<HierarchyLevel>) => {
    onChange({
      ...state,
      hierarchyModel: {
        ...state.hierarchyModel,
        levels: levels.map(l => l.id === selectedId ? { ...l, ...patch } : l)
      }
    });
  };

  return (
    <div className="p-6 flex gap-6 h-full">
      {/* Left: Level List */}
      <div className="w-52 flex-shrink-0">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Hierarchy Levels</h4>
        <div className="flex flex-col gap-1">
          {levels.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedId(lvl.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedId === lvl.id ? 'bg-[#5C1F3D] text-white' : 'text-[#172B4D] hover:bg-[#f4f0f2]'}`}
            >
              <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${selectedId === lvl.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                L{idx + 1}
              </span>
              <span className="truncate font-medium">{lvl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Properties Panel */}
      {selected ? (
        <div className="flex-1 min-w-0">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-[#172B4D] mb-1">Level Properties — {selected.name}</h3>
            <p className="text-sm text-gray-500">Configure metadata and capabilities for this hierarchy level.</p>
          </div>

          <div className="bg-white rounded-xl border border-[#d1def0] divide-y divide-[#f0f4f8]">
            {/* Identity */}
            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Level Name</label>
                <input
                  type="text"
                  value={selected.name}
                  onChange={e => updateLevel({ name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Plural Name</label>
                <input
                  type="text"
                  value={selected.pluralName}
                  onChange={e => updateLevel({ pluralName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Code Prefix</label>
                <input
                  type="text"
                  value={selected.codePrefix}
                  onChange={e => updateLevel({ codePrefix: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition font-mono"
                  placeholder="e.g. A-, R-, BIN"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Depth (auto)</label>
                <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-400">
                  Level {selected.depth + 1}
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="p-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Capabilities</h4>
              <div className="grid grid-cols-2 gap-3">
                {TOGGLES.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-[#172B4D]">Supports {label}</span>
                    <Toggle
                      enabled={selected[key] as boolean}
                      onChange={v => updateLevel({ [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">No levels defined. Go back to Step 2 to add levels.</p>
        </div>
      )}
    </div>
  );
}
