import { useState } from 'react';
import { Sparkles, BookOpen, FileEdit, Wrench, Upload, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SetupMethod } from './types';

interface WarehouseSetupScreenProps {
  warehouseName: string;
  onContinue: (method: SetupMethod) => void;
  onBack: () => void;
}

interface SetupOption {
  method: SetupMethod;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  badgeType?: 'recommended' | 'popular';
}

const SETUP_OPTIONS: SetupOption[] = [
  {
    method: 'flowone-template',
    icon: Sparkles,
    title: 'Use flowOne Templates',
    subtitle: 'Industry-Standard Blueprints',
    description: 'Start with pre-configured, best-practice warehouse templates designed for modern logistics, retail, and manufacturing operations.',
    badge: 'Recommended',
    badgeType: 'recommended',
  },
  {
    method: 'published-template',
    icon: BookOpen,
    title: 'Use My Published Templates',
    subtitle: 'Internal Configuration Library',
    description: 'Reuse an approved, published warehouse hierarchy template from your organization’s template catalog.',
  },
  {
    method: 'draft-template',
    icon: FileEdit,
    title: 'Continue Draft Template',
    subtitle: 'Resume In-Progress Setup',
    description: 'Pick up where you left off from a previously saved draft configuration or un-published setup version.',
  },
  {
    method: 'import',
    icon: Upload,
    title: 'Import Existing Configuration',
    subtitle: 'Excel / JSON File Upload',
    description: 'Import an existing warehouse structure, bin mappings, and zone definitions from an external file schema.',
  },
  {
    method: 'scratch',
    icon: Wrench,
    title: 'Build From Scratch',
    subtitle: 'Custom Hierarchy & Rules',
    description: 'Create a completely custom warehouse hierarchy, define custom levels, and set up your own naming rules step by step.',
  },
];

export function WarehouseSetupScreen({ warehouseName, onContinue, onBack }: WarehouseSetupScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<SetupMethod>('flowone-template');

  return (
    <div className="flex flex-col h-full bg-[#f7f8f9] rounded-xl border border-[#d1def0] overflow-hidden shadow-sm">

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-500 hover:text-[#172B4D] hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-lg font-bold text-[#172B4D] tracking-tight">Warehouse Setup</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Initializing setup for <span className="font-semibold text-[#172B4D]">{warehouseName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onContinue(selectedMethod)}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Body: Dedicated Screen ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">

        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#172B4D] tracking-tight">Choose a Setup Method</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Select how you would like to initialize this warehouse configuration. You can change rules and hierarchy details during the setup process.
          </p>
        </div>

        {/* Options Grid (Large Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SETUP_OPTIONS.map((opt) => {
            const isSelected = selectedMethod === opt.method;
            const Icon = opt.icon;

            return (
              <div
                key={opt.method}
                onClick={() => setSelectedMethod(opt.method)}
                className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#5C1F3D] bg-white ring-2 ring-[#5C1F3D]/20 shadow-md transform -translate-y-0.5'
                    : 'border-[#d1def0] bg-white hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {/* Top Badge & Radio */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#5C1F3D] text-white shadow-sm'
                        : 'bg-[#f4f0f2] text-[#5C1F3D] group-hover:bg-[#e8dee3]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      {opt.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#5C1F3D] text-white shadow-xs">
                          {opt.badge}
                        </span>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#5C1F3D] bg-[#5C1F3D]' : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold text-[#172B4D] group-hover:text-[#5C1F3D] transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
                    {opt.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Footer Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-xs font-semibold transition-colors ${
                    isSelected ? 'text-[#5C1F3D]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {isSelected ? 'Selected' : 'Click to select'}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${
                    isSelected ? 'text-[#5C1F3D] translate-x-1' : 'text-gray-300 group-hover:translate-x-1 group-hover:text-gray-400'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Footer Bar ────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-[#d1def0] px-8 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storage Configuration
        </button>

        <button
          onClick={() => onContinue(selectedMethod)}
          className="flex items-center gap-2 px-7 py-2.5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
        >
          Continue to Configuration
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
