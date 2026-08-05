import React from 'react';
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
  { id: 3, label: 'Zone Layouts', short: 'Zones' },
  { id: 4, label: 'Generate Layout', short: 'Generate' },
  { id: 5, label: 'Naming & Rules', short: 'Rules' },
  { id: 6, label: 'Validation', short: 'Validate' },
  { id: 7, label: 'Review & Publish', short: 'Publish' },
];

export function SetupWizard({ state, onChange, onClose, warehouseName }: SetupWizardProps) {
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
      case 1: return (
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
    <div className="flex flex-col h-full bg-[#f7f8f9]">
      {/* Wizard Header */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-[#172B4D]">Warehouse Configuration</h2>
          <p className="text-xs text-gray-500 mt-0.5">{warehouseName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
          title="Exit wizard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-0 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = step.id < state.currentStep;
            const isCurrent = step.id === state.currentStep;
            const isLast = idx === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex items-center gap-2 flex-shrink-0 group"
                >
                  {/* Circle */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all
                    ${isCompleted ? 'bg-[#36B37E] text-white' : isCurrent ? 'bg-[#5C1F3D] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}
                  `}>
                    {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  {/* Label */}
                  <span className={`text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-[#5C1F3D]' : isCompleted ? 'text-[#36B37E]' : 'text-gray-400'}`}>
                    {step.short}
                  </span>
                </button>
                {!isLast && (
                  <div className={`w-8 h-[1px] mx-1 flex-shrink-0 ${isCompleted ? 'bg-[#36B37E]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Wizard Footer */}
      <div className="bg-white border-t border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0">
        {state.currentStep > 1 ? (
          <button
            onClick={goPrev}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {/* Save Draft */}
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Save Draft
          </button>

          {state.currentStep < 7 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
