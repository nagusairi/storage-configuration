import { Sparkles, Layers, Upload, BookOpen, FileEdit, ArrowRight, Check } from 'lucide-react';
import type { WizardState, SetupMethod } from '../types';
import { MOCK_TEMPLATES } from '../mockData';

interface Props { state: WizardState; onChange: (s: WizardState) => void; onNext: () => void; }

const PRIMARY_METHODS = [
  { method: 'flowone-template' as SetupMethod, icon: Sparkles, iconBg: 'bg-[#5C1F3D]', title: 'flowOne Template', description: 'Industry-proven setup. Recommended for most warehouses.', tag: 'Recommended' },
  { method: 'scratch' as SetupMethod, icon: Layers, iconBg: 'bg-blue-600', title: 'Build From Scratch', description: 'Full control. Define every hierarchy level yourself.', tag: null },
  { method: 'import' as SetupMethod, icon: Upload, iconBg: 'bg-gray-700', title: 'Import', description: 'Upload JSON / Excel layout from an existing system.', tag: null },
];

export function Step1SetupMethod({ state, onChange, onNext }: Props) {
  const select = (method: SetupMethod, templateId?: string) => {
    onChange({ ...state, selectedMethod: method, selectedTemplateId: templateId });
  };
  const publishedTemplates = MOCK_TEMPLATES.filter(t => t.status === 'published');
  const draftTemplates = MOCK_TEMPLATES.filter(t => t.status === 'draft');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#172B4D] mb-1">Choose a setup method</h3>
        <p className="text-sm text-gray-500">Select how you want to configure this warehouse's storage hierarchy.</p>
      </div>

      {/* Primary Methods */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {PRIMARY_METHODS.map(({ method, icon: Icon, iconBg, title, description, tag }) => {
          const isSelected = state.selectedMethod === method;
          return (
            <button
              key={method}
              onClick={() => { select(method); onNext(); }}
              className={`group text-left rounded-xl border-2 p-5 transition-all hover:shadow-md flex flex-col gap-3 relative ${isSelected ? 'border-[#5C1F3D] shadow-md' : 'border-[#d1def0] hover:border-[#5C1F3D]'}`}
            >
              {tag && <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5C1F3D] text-white">{tag}</span>}
              {isSelected && <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#5C1F3D] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#172B4D] mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-[#5C1F3D] mt-auto">
                Select <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Published Templates */}
      {publishedTemplates.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Published Templates</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {publishedTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => { select('published-template', tpl.id); onNext(); }}
                className="text-left rounded-lg border border-[#d1def0] hover:border-[#5C1F3D] px-4 py-3 transition-all hover:shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#172B4D]">{tpl.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {tpl.tags.map(tag => <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{tpl.warehouseCount} warehouses</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Draft Templates */}
      {draftTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileEdit className="w-4 h-4 text-gray-400" />
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Draft Templates</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {draftTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => { select('draft-template', tpl.id); onNext(); }}
                className="text-left rounded-lg border border-dashed border-[#d1def0] hover:border-[#5C1F3D] px-4 py-3 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[#172B4D]">{tpl.name}</p>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Draft</span>
                  </div>
                  <p className="text-xs text-gray-500">{tpl.description}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">Updated {tpl.updatedAt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
