import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { WizardStep, WizardState } from './types';
import { Step2HierarchyDesigner } from './steps/Step2HierarchyDesigner';
import { Step3LevelProperties } from './steps/Step3LevelProperties';
import { Step4ZoneLayouts } from './steps/Step4ZoneLayouts';
import { Step5GenerateLayout } from './steps/Step5GenerateLayout';
import { Step6NamingRules } from './steps/Step6NamingRules';
import { Step7Validation } from './steps/Step7Validation';
import { Step8ReviewPublish } from './steps/Step8ReviewPublish';

interface SetupWizardProps {
  state: WizardState;
  onChange: (state: WizardState) => void;
  onClose: () => void;
  warehouseName: string;
}

const STEPS: { id: WizardStep; label: string; short: string }[] = [
  { id: 1, label: 'Hierarchy Model', short: 'Hierarchy' },
  { id: 2, label: 'Level Properties', short: 'Properties' },
  { id: 3, label: 'Zone Layouts',    short: 'Zones' },
  { id: 4, label: 'Generate Layout',  short: 'Generate' },
  { id: 5, label: 'Naming & Rules',   short: 'Rules' },
  { id: 6, label: 'Validation',       short: 'Validate' },
  { id: 7, label: 'Review & Publish', short: 'Publish' },
];

export function SetupWizard({ state, onChange, onClose, warehouseName }: SetupWizardProps) {
  const currentStepIndex = STEPS.findIndex(s => s.id === state.currentStep);

  const goToStep = (step: WizardStep) => {
    onChange({ ...state, currentStep: step });
  };

  const goNext = () => {
    if (state.currentStep < 7) goToStep((state.currentStep + 1) as WizardStep);
  };

  const goPrev = () => {
    if (state.currentStep === 1 && state.returnToStep) {
      goToStep(state.returnToStep);
      return;
    }
    if (state.currentStep > 1) goToStep((state.currentStep - 1) as WizardStep);
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step2HierarchyDesigner
            state={state}
            onChange={onChange}
            onFinishEdit={() => {
              if (state.returnToStep) {
                goToStep(state.returnToStep);
              } else {
                goNext();
              }
            }}
          />
        );
      case 2: return <Step3LevelProperties state={state} onChange={onChange} />;
      case 3: return <Step4ZoneLayouts state={state} onChange={onChange} />;
      case 4: return <Step5GenerateLayout state={state} onChange={onChange} />;
      case 5: return <Step6NamingRules state={state} onChange={onChange} />;
      case 6: return <Step7Validation state={state} onChange={onChange} onGoToStep={goToStep} />;
      case 7: return <Step8ReviewPublish state={state} onChange={onChange} onClose={onClose} warehouseName={warehouseName} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f7f8f9] rounded-lg border border-[#d1def0] overflow-hidden shadow-sm">

      {/* ── Wizard Top Header ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-[#172B4D]">Warehouse Setup</h2>
          <p className="text-xs text-gray-500">{warehouseName}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Stepper Bar (7 steps) ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      idx <= currentStepIndex ? 'bg-[#5C1F3D]' : 'bg-gray-200'
                    }`}
                  />
                )}
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex items-center gap-2 group outline-none"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-[#5C1F3D] text-white ring-4 ring-[#5C1F3D]/20'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap hidden sm:inline transition-colors ${
                      isCurrent
                        ? 'font-semibold text-[#5C1F3D]'
                        : isCompleted
                        ? 'font-medium text-[#172B4D]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.short}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Step Body ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {renderStep()}
      </div>

      {/* ── Wizard Footer Bar ────────────────────────────────────────────── */}
      <div className="bg-white border-t border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={goPrev}
          disabled={state.currentStep === 1 && !state.returnToStep}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 hover:text-[#172B4D] border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Save Draft
          </button>
          {state.currentStep < 7 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
            >
              Finish & Publish
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
