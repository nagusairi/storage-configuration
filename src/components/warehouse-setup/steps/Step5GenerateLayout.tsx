import { useState } from 'react';
import { Calculator, Layers } from 'lucide-react';
import type { WizardState, ZoneConfig, GenerationLevel } from '../types';

interface Props { state: WizardState; onChange: (s: WizardState) => void; }

function ZoneGenerator({ zone, levels, onUpdate }: { zone: ZoneConfig; levels: { id: string; name: string }[]; onUpdate: (z: ZoneConfig) => void }) {
  const genLevels = zone.generation.levels.length > 0
    ? zone.generation.levels
    : levels.slice(1).map(l => ({ levelId: l.id, levelName: l.name, count: 1 }));

  const total = genLevels.reduce((acc, l) => acc * (l.count || 1), 1);

  const updateCount = (levelId: string, count: number) => {
    const updated = genLevels.map(l => l.levelId === levelId ? { ...l, count } : l);
    onUpdate({ ...zone, generation: { levels: updated } });
  };

  return (
    <div className="bg-white rounded-xl border border-[#d1def0] overflow-hidden">
      {/* Zone Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#d1def0]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{zone.code}</span>
          <h4 className="text-sm font-semibold text-[#172B4D]">{zone.name}</h4>
        </div>
        <div className="flex items-center gap-1.5 bg-[#f4f0f2] rounded-lg px-3 py-1.5">
          <Calculator className="w-3.5 h-3.5 text-[#5C1F3D]" />
          <span className="text-xs font-semibold text-[#5C1F3D]">{total.toLocaleString()} total locations</span>
        </div>
      </div>

      {/* Generation Fields */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-4 gap-4">
          {genLevels.map((gl, idx) => (
            <div key={gl.levelId}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {gl.levelName}{idx > 0 ? ` per ${genLevels[idx - 1]?.levelName ?? 'parent'}` : ''}
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={gl.count}
                onChange={e => updateCount(gl.levelId, Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 font-medium text-[#172B4D]"
              />
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {genLevels.map((gl, idx) => {
            const subtotal = genLevels.slice(0, idx + 1).reduce((acc, l) => acc * l.count, 1);
            return (
              <span key={gl.levelId} className="flex items-center gap-1">
                <span className="font-medium text-[#172B4D]">{subtotal.toLocaleString()}</span> {gl.levelName}
                {idx < genLevels.length - 1 && <span className="text-gray-300 ml-1">→</span>}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Step5GenerateLayout({ state, onChange }: Props) {
  const zones = state.zones;
  const levels = state.hierarchyModel.levels;

  if (zones.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <Layers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No zones defined. Go back to Step 4 to add zones first.</p>
        </div>
      </div>
    );
  }

  const updateZone = (updated: ZoneConfig) => {
    onChange({ ...state, zones: state.zones.map(z => z.id === updated.id ? updated : z) });
  };

  const grandTotal = zones.reduce((acc, zone) => {
    const gl = zone.generation.levels.length > 0
      ? zone.generation.levels
      : levels.slice(1).map(l => ({ levelId: l.id, levelName: l.name, count: 1 }));
    return acc + gl.reduce((a, l) => a * (l.count || 1), 1);
  }, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Generate Storage Layout</h3>
          <p className="text-sm text-gray-500">Configure how many storage locations to generate per zone. Totals are calculated automatically.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#d1def0] rounded-lg px-4 py-2.5 shadow-sm">
          <Calculator className="w-4 h-4 text-[#0052CC]" />
          <div>
            <p className="text-[10px] text-gray-500 leading-none">Total across all zones</p>
            <p className="text-base font-bold text-[#172B4D] leading-tight">{grandTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {zones.map(zone => (
          <ZoneGenerator
            key={zone.id}
            zone={zone}
            levels={levels}
            onUpdate={updateZone}
          />
        ))}
      </div>

      {/* Info */}
      <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 leading-relaxed">
        <strong>Note:</strong> This configures how many locations will be generated when you publish. You can adjust these numbers before publishing without affecting the hierarchy model.
      </div>
    </div>
  );
}
