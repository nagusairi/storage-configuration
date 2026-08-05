import { Plus, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { WizardState, ZoneConfig, PickingStrategy } from '../types';
import { COMPACT_3_LEVEL, STANDARD_6_LEVEL } from '../mockData';

interface Props { state: WizardState; onChange: (s: WizardState) => void; }

const PICKING_OPTIONS: PickingStrategy[] = ['FIFO', 'FEFO', 'LIFO'];
const STATUS_COLORS = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', maintenance: 'bg-amber-100 text-amber-700' };

function generateId() { return `zone-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`; }

function ZoneCard({ zone, defaultHierarchy, onUpdate }: { zone: ZoneConfig; defaultHierarchy: string; onUpdate: (z: ZoneConfig) => void }) {
  const [expanded, setExpanded] = useState(false);
  const isCustom = zone.hierarchyMode === 'custom';

  return (
    <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#172B4D]">{zone.name}</h4>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[zone.status]}`}>{zone.status}</span>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{zone.code}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Hierarchy: <span className="font-medium text-[#172B4D]">{isCustom ? (zone.customHierarchyModel?.name ?? 'Custom') : `Default (${defaultHierarchy})`}</span>
              {' · '}Picking: <span className="font-medium text-[#172B4D]">{zone.pickingStrategy}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Hierarchy Mode:</span>
          <div className="flex rounded-lg overflow-hidden border border-[#d1def0]">
            {(['default', 'custom'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onUpdate({ ...zone, hierarchyMode: mode })}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${zone.hierarchyMode === mode ? 'bg-[#5C1F3D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[#d1def0] px-5 py-4 bg-[#f7f8f9] grid grid-cols-2 gap-4">
          {/* Picking Strategy */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Picking Strategy</label>
            <div className="flex gap-2">
              {PICKING_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => onUpdate({ ...zone, pickingStrategy: p })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${zone.pickingStrategy === p ? 'border-[#5C1F3D] bg-[#5C1F3D] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#5C1F3D]'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hierarchy Override */}
          {isCustom && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Custom Hierarchy Model</label>
              <select
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] bg-white"
                value={zone.customHierarchyModel?.id ?? ''}
                onChange={e => {
                  const model = [STANDARD_6_LEVEL, COMPACT_3_LEVEL].find(m => m.id === e.target.value);
                  onUpdate({ ...zone, customHierarchyModel: model });
                }}
              >
                <option value="">Select a model...</option>
                <option value={STANDARD_6_LEVEL.id}>{STANDARD_6_LEVEL.name}</option>
                <option value={COMPACT_3_LEVEL.id}>{COMPACT_3_LEVEL.name}</option>
              </select>
            </div>
          )}

          {/* Dimensions */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Dimensions (optional)</label>
            <div className="flex gap-2">
              {(['width', 'depth', 'height'] as const).map(dim => (
                <div key={dim} className="flex-1">
                  <label className="block text-[10px] text-gray-400 mb-1 capitalize">{dim}</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#5C1F3D] bg-white"
                    value={zone.dimensions?.[dim] ?? ''}
                    onChange={e => onUpdate({ ...zone, dimensions: { ...zone.dimensions, [dim]: Number(e.target.value), unit: zone.dimensions?.unit ?? 'meters' } })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Step4ZoneLayouts({ state, onChange }: Props) {
  const zones = state.zones;
  const defaultHierarchy = state.hierarchyModel.name;

  const addZone = () => {
    const newZone: ZoneConfig = {
      id: generateId(),
      name: `Zone ${String.fromCharCode(65 + zones.length)}`,
      code: `Z${String.fromCharCode(65 + zones.length)}`,
      status: 'active',
      hierarchyMode: 'default',
      pickingStrategy: 'FIFO',
      generation: { levels: [] }
    };
    onChange({ ...state, zones: [...zones, newZone] });
  };

  const updateZone = (updated: ZoneConfig) => {
    onChange({ ...state, zones: zones.map(z => z.id === updated.id ? updated : z) });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Zone Layouts</h3>
          <p className="text-sm text-gray-500">Each zone can use the default hierarchy or override with a completely different structure.</p>
        </div>
        <button
          onClick={addZone}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {zones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layers className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500 mb-4">No zones configured yet.</p>
          <button onClick={addZone} className="text-sm font-medium text-[#5C1F3D] hover:underline">Add your first zone</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {zones.map(zone => (
            <ZoneCard key={zone.id} zone={zone} defaultHierarchy={defaultHierarchy} onUpdate={updateZone} />
          ))}
        </div>
      )}
    </div>
  );
}
