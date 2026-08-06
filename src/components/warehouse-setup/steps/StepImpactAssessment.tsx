import { AlertTriangle, Layers, Package, ShieldAlert, Sliders } from 'lucide-react';
import type { WizardState } from '../types';

interface Props {
  state: WizardState;
  onChange: (s: WizardState) => void;
}

export function StepImpactAssessment({ state }: Props) {
  const zone = state.zones[0];
  const zoneName = zone ? `${zone.name} (${zone.code})` : 'Target Zone';

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-[#172B4D]">Operational Impact Assessment</h3>
        </div>
        <p className="text-sm text-gray-500">
          Review detected operational dependencies for <strong>{zoneName}</strong> before proceeding.
        </p>
      </div>

      {/* Primary Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold text-amber-950">Structural changes detected on an active operational zone.</p>
          <p className="mt-1">
            Modifying hierarchy levels, depth, or naming patterns will require coordinate re-mapping. Review affected inventory and rule dependencies below.
          </p>
        </div>
      </div>

      {/* Impact Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Storage Locations */}
        <div className="bg-white rounded-xl border border-[#d1def0] p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B4D]">Storage Locations</h4>
              <p className="text-[11px] text-gray-500">Configured bin coordinates</p>
            </div>
          </div>
          <p className="text-lg font-bold text-[#172B4D] font-mono">1,248 <span className="text-xs font-normal text-gray-500">Locations</span></p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">• L3 Rack level modified & depth updated</p>
        </div>

        {/* Card 2: Inventory Records */}
        <div className="bg-white rounded-xl border border-[#d1def0] p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B4D]">Active Inventory</h4>
              <p className="text-[11px] text-gray-500">Mapped SKU stock items</p>
            </div>
          </div>
          <p className="text-lg font-bold text-[#172B4D] font-mono">352 <span className="text-xs font-normal text-gray-500">SKUs</span></p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">• Requires location coordinate re-mapping</p>
        </div>

        {/* Card 3: Warehouse Rules */}
        <div className="bg-white rounded-xl border border-[#d1def0] p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B4D]">Putaway Rules</h4>
              <p className="text-[11px] text-gray-500">Zone allocation logic</p>
            </div>
          </div>
          <p className="text-lg font-bold text-[#172B4D] font-mono">3 <span className="text-xs font-normal text-gray-500">Active Rules</span></p>
          <p className="text-[11px] text-gray-500 mt-1">• Rules will automatically adjust to new hierarchy</p>
        </div>

        {/* Card 4: Picking Strategies */}
        <div className="bg-white rounded-xl border border-[#d1def0] p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              FEFO
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B4D]">Picking Strategy</h4>
              <p className="text-[11px] text-gray-500">Current routing strategy</p>
            </div>
          </div>
          <p className="text-sm font-bold text-[#172B4D]">{zone?.pickingStrategy ?? 'FEFO (Expiry First)'}</p>
          <p className="text-[11px] text-green-700 mt-1 font-medium">• Strategy parameters preserved</p>
        </div>
      </div>
    </div>
  );
}
