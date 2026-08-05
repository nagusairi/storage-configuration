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

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => {}} // Clone template logic
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Save as New Template
        </button>
        <button
          onClick={() => onChange({ ...state, isDirty: true })} // Save draft logic
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f4f0f2] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save as Draft Template
        </button>
        <button
          disabled={!canPublish}
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#5C1F3D] rounded-lg hover:bg-[#4a1831] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Globe className="w-4 h-4" />
          Publish Configuration
        </button>
      </div>
    </div>
  );
}
