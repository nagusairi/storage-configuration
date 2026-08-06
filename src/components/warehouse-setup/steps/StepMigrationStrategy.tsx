import { GitBranch } from 'lucide-react';
import type { MigrationStrategy, WizardState } from '../types';

interface Props {
  state: WizardState;
  onChange: (s: WizardState) => void;
}

export function StepMigrationStrategy({ state, onChange }: Props) {
  const currentStrategy: MigrationStrategy = state.migrationStrategy ?? 'automatic';

  const strategies = [
    {
      id: 'automatic',
      title: 'Automatic Migration (Recommended)',
      desc: 'System automatically re-maps active SKU inventory to updated location coordinate IDs upon publish.',
      tag: 'Recommended',
    },
    {
      id: 'manual',
      title: 'Manual Mapping',
      desc: 'Export current locations and SKU mapping spreadsheet to align coordinates manually prior to publishing.',
      tag: 'Advanced',
    },
    {
      id: 'scheduled',
      title: 'Schedule Migration',
      desc: 'Defer data migration and coordinate update to a scheduled warehouse maintenance window.',
      tag: 'Maintenance Window',
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-5 h-5 text-[#5C1F3D]" />
          <h3 className="text-base font-bold text-[#172B4D]">Data Migration Strategy</h3>
        </div>
        <p className="text-sm text-gray-500">
          Choose how existing inventory records and storage locations should be migrated.
        </p>
      </div>

      <div className="space-y-3">
        {strategies.map((strat) => {
          const selected = currentStrategy === strat.id;
          return (
            <button
              key={strat.id}
              type="button"
              onClick={() => onChange({ ...state, migrationStrategy: strat.id as MigrationStrategy })}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                selected
                  ? 'border-[#5C1F3D] bg-white ring-2 ring-[#5C1F3D]/20 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${selected ? 'text-[#5C1F3D]' : 'text-[#172B4D]'}`}>
                    {strat.title}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selected ? 'bg-[#5C1F3D] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {strat.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{strat.desc}</p>
              </div>

              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selected ? 'border-[#5C1F3D]' : 'border-gray-300'
              }`}>
                {selected && <div className="w-2 h-2 rounded-full bg-[#5C1F3D]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
