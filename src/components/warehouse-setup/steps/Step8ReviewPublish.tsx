import { CheckCircle2, GitBranch, MapPin, Package, FileText, Globe, Save, Copy } from 'lucide-react';
import type { WizardState } from '../types';

interface Props { state: WizardState; onChange: (s: WizardState) => void; onClose: () => void; warehouseName: string; }

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#f0f4f8] last:border-b-0">
      <span className="text-sm text-gray-500 flex-shrink-0 w-40">{label}</span>
      <span className="text-sm font-medium text-[#172B4D] text-right">{value}</span>
    </div>
  );
}

export function Step8ReviewPublish({ state, onChange, onClose, warehouseName }: Props) {
  const levels = state.hierarchyModel.levels;
  const zones = state.zones;
  const errors = state.validationResults.filter(r => r.severity === 'error').length;
  const warnings = state.validationResults.filter(r => r.severity === 'warning').length;

  const totalLocations = zones.reduce((acc, zone) => {
    const gl = zone.generation.levels.length > 0 ? zone.generation.levels : [];
    return acc + gl.reduce((a, l) => a * (l.count || 1), 1);
  }, 0);

  const canPublish = errors === 0;

  const handlePublish = () => {
    onChange({ ...state, isDirty: false });
    onClose();
    // In production: trigger API call and show success toast
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#172B4D] mb-1">Review & Publish</h3>
        <p className="text-sm text-gray-500">Review the configuration for <strong>{warehouseName}</strong> before going live.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-[#d1def0] mb-5 overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#d1def0] bg-[#f7f8f9]">
          <div className="w-9 h-9 rounded-lg bg-[#5C1F3D] flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#172B4D]">{warehouseName}</h4>
            <p className="text-xs text-gray-500 mt-0.5">Configuration Summary</p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${canPublish ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {canPublish ? 'Ready to Publish' : 'Has Errors'}
          </span>
        </div>

        {/* Summary Rows */}
        <div className="px-5">
          <SummaryRow label="Hierarchy Model" value={
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-teal-500" />
              {state.hierarchyModel.name} ({levels.length} levels)
            </div>
          } />
          <SummaryRow label="Levels" value={levels.map(l => l.name).join(' → ')} />
          <SummaryRow label="Zones" value={
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              {zones.length} zone{zones.length !== 1 ? 's' : ''} configured
            </div>
          } />
          <SummaryRow label="Total Storage Locations" value={
            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-500" />
              {totalLocations > 0 ? totalLocations.toLocaleString() : '—'}
            </div>
          } />
          <SummaryRow label="Location Code Format" value={
            <span className="font-mono text-[#172B4D]">
              {state.namingRules.prefix}{state.namingRules.separator}ZA{state.namingRules.separator}{'1'.padStart(state.namingRules.padding, '0')}
            </span>
          } />
          <SummaryRow label="Barcode Format" value={state.namingRules.barcodeFormat} />
          <SummaryRow label="Validation" value={
            <div className="flex items-center gap-2">
              {errors === 0 && warnings === 0 ? (
                <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> All checks passed</span>
              ) : (
                <span className="text-amber-600">{errors} error(s), {warnings} warning(s)</span>
              )}
            </div>
          } />
        </div>
      </div>

      {/* Hierarchy Tree Preview */}
      <div className="bg-white rounded-xl border border-[#d1def0] p-5 mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" /> Hierarchy Structure
        </h4>
        <div className="flex flex-col gap-1.5">
          {levels.map((lvl, idx) => (
            <div key={lvl.id} className="flex items-center gap-2" style={{ paddingLeft: `${idx * 20}px` }}>
              {idx > 0 && <div className="w-4 h-4 border-l-2 border-b-2 border-gray-200 rounded-bl flex-shrink-0" />}
              <div className="flex items-center gap-2 bg-[#f7f8f9] border border-[#d1def0] rounded-lg px-3 py-1.5">
                <span className="text-[10px] font-mono text-gray-400">L{idx + 1}</span>
                <span className="text-sm font-medium text-[#172B4D]">{lvl.name}</span>
                <span className="text-[10px] font-mono bg-white text-gray-500 border border-gray-200 px-1.5 rounded">{lvl.codePrefix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Errors Banner */}
      {!canPublish && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Cannot publish:</strong> {errors} validation error(s) must be resolved first. Go back to Step 7 to fix them.
        </div>
      )}

      {/* Change Summary & Migration Step (for Operational Zones) */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 mb-5 space-y-4">
        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-700" /> Operational Change Summary & Migration Strategy
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-lg border border-amber-200/80">
          <div>
            <span className="font-bold text-amber-900 block mb-1">Hierarchy Changes</span>
            <p className="text-gray-600">• L3 Rack level modified</p>
            <p className="text-gray-600">• Depth configuration updated</p>
          </div>
          <div>
            <span className="font-bold text-amber-900 block mb-1">Storage Impact</span>
            <p className="text-gray-600">• 1,248 Storage Locations</p>
            <p className="text-gray-600">• 30 Bin sequences updated</p>
          </div>
          <div>
            <span className="font-bold text-amber-900 block mb-1">Operational Impact</span>
            <p className="text-gray-600">• 352 Active SKU Items</p>
            <p className="text-amber-800 font-semibold">• Inventory Migration Required</p>
          </div>
        </div>

        {/* Migration Strategy Selection */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-amber-950">Select Data Migration Strategy:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              { id: 'automatic', title: 'Automatic Migration', desc: 'Auto-remap SKUs to updated bin IDs' },
              { id: 'manual', title: 'Manual Mapping', desc: 'Export & manually align coordinates' },
              { id: 'scheduled', title: 'Schedule Migration', desc: 'Defer to maintenance window' },
            ].map((strategy) => {
              const selected = (state.migrationStrategy ?? 'automatic') === strategy.id;
              return (
                <button
                  key={strategy.id}
                  type="button"
                  onClick={() => onChange({ ...state, migrationStrategy: strategy.id as any })}
                  className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                    selected ? 'border-[#5C1F3D] bg-white ring-2 ring-[#5C1F3D]/20 shadow-xs' : 'border-amber-200 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${selected ? 'text-[#5C1F3D]' : 'text-gray-800'}`}>{strategy.title}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#5C1F3D]' : 'border-gray-300'}`}>
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-[#5C1F3D]" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">{strategy.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
