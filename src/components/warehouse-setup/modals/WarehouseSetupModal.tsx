import { useState } from 'react';
import { Sparkles, BookOpen, FileEdit, Wrench, Upload, X, ArrowRight } from 'lucide-react';
import type { SetupMethod } from '../types';

interface WarehouseSetupModalProps {
  isOpen: boolean;
  warehouseName: string;
  onContinue: (method: SetupMethod) => void;
  onCancel: () => void;
}

const SETUP_OPTIONS: { method: SetupMethod; icon: typeof Sparkles; label: string; description: string; badge?: string }[] = [
  { method: 'flowone-template',   icon: Sparkles,  label: 'Use flowOne Template',           description: 'Industry-standard hierarchy blueprint ready for instant setup', badge: 'Recommended' },
  { method: 'published-template', icon: BookOpen,  label: 'Use My Published Template',       description: 'Reuse a configuration blueprint you\'ve already published' },
  { method: 'draft-template',     icon: FileEdit,  label: 'Continue Draft Template',         description: 'Pick up from a previously saved draft template' },
  { method: 'scratch',            icon: Wrench,    label: 'Build From Scratch',              description: 'Full control — define every level, rule, and zone yourself' },
  { method: 'import',             icon: Upload,    label: 'Import Existing Configuration',   description: 'Upload a JSON or Excel schema file from an external system' },
];

export function WarehouseSetupModal({
  isOpen,
  warehouseName,
  onContinue,
  onCancel,
}: WarehouseSetupModalProps) {
  const [selected, setSelected] = useState<SetupMethod>('flowone-template');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d1def0] max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#f7f8f9]">
          <div>
            <h2 className="text-base font-bold text-[#172B4D]">Warehouse Setup</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose a Setup Method for <span className="font-semibold text-[#172B4D]">{warehouseName}</span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setup Method Options */}
        <div className="p-5 flex flex-col gap-2.5 max-h-[65vh] overflow-y-auto">
          {SETUP_OPTIONS.map(({ method, icon: Icon, label, description, badge }) => {
            const isSelected = selected === method;
            return (
              <button
                key={method}
                onClick={() => setSelected(method)}
                className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-[#5C1F3D] bg-[#f9f4f7] ring-1 ring-[#5C1F3D]/20 shadow-sm'
                    : 'border-[#d1def0] bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                {/* Radio Circle */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'border-[#5C1F3D]' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#5C1F3D]" />}
                </div>

                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-[#5C1F3D] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pr-16">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${isSelected ? 'text-[#5C1F3D]' : 'text-[#172B4D]'}`}>
                      {label}
                    </h3>
                    {badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#5C1F3D] text-white">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onContinue(selected)}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
          >
            Continue
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
