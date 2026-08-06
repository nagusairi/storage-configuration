import React from 'react';
import { Check, ChevronLeft, ChevronRight, X, Globe, Save, Copy } from 'lucide-react';
import type { WizardStep, WizardState } from './types';
import { Step2HierarchyDesigner } from './steps/Step2HierarchyDesigner';
import { Step3LevelProperties } from './steps/Step3LevelProperties';
import { Step4ZoneLayouts } from './steps/Step4ZoneLayouts';
import { Step5GenerateLayout } from './steps/Step5GenerateLayout';
import { Step6NamingRules } from './steps/Step6NamingRules';
import { Step7Validation } from './steps/Step7Validation';
import { Step8ReviewPublish } from './steps/Step8ReviewPublish';
import { StepImpactAssessment } from './steps/StepImpactAssessment';
import { StepMigrationStrategy } from './steps/StepMigrationStrategy';

interface SetupWizardProps {
  state: WizardState;
  onChange: (state: WizardState) => void;
  onClose: () => void;
  warehouseName: string;
}

const DEPENDENT_ZONE_IDS = ['zone-a', 'zone-b', 'zone-c'];

const WAREHOUSE_STEPS: { id: WizardStep; label: string; short: string }[] = [
  { id: 1, label: 'Hierarchy Model', short: 'Hierarchy' },
  { id: 2, label: 'Level Properties', short: 'Properties' },
  { id: 3, label: 'Zone Layouts', short: 'Zones' },
  { id: 4, label: 'Generate Layout', short: 'Generate' },
  { id: 5, label: 'Naming & Rules', short: 'Rules' },
  { id: 6, label: 'Validation', short: 'Validate' },
  { id: 7, label: 'Review & Publish', short: 'Publish' },
];

const STANDARD_ZONE_STEPS: { id: WizardStep; label: string; short: string }[] = [
  { id: 1, label: 'Hierarchy Model', short: 'Hierarchy' },
  { id: 2, label: 'Level Properties', short: 'Properties' },
  { id: 3, label: 'Generate Layout', short: 'Generate' },
  { id: 4, label: 'Naming & Rules', short: 'Rules' },
  { id: 5, label: 'Validation', short: 'Validate' },
  { id: 6, label: 'Review & Publish', short: 'Publish' },
];

const OPERATIONAL_IMPACT_ZONE_STEPS: { id: WizardStep; label: string; short: string }[] = [
  { id: 1, label: 'Hierarchy Model', short: 'Hierarchy' },
  { id: 2, label: 'Level Properties', short: 'Properties' },
  { id: 3, label: 'Generate Layout', short: 'Generate' },
  { id: 4, label: 'Naming & Rules', short: 'Rules' },
  { id: 5, label: 'Validation', short: 'Validate' },
  { id: 6, label: 'Impact Assessment', short: 'Impact' },
  { id: 7, label: 'Migration Strategy', short: 'Migration' },
  { id: 8, label: 'Review & Publish', short: 'Publish' },
];

export function SetupWizard({ state, onChange, onClose, warehouseName }: SetupWizardProps) {
  const isZoneMode = state.wizardMode === 'zone';
  const targetZone = state.zones[0];
  const hasOperationalImpact = isZoneMode && targetZone && DEPENDENT_ZONE_IDS.includes(targetZone.id);

  const stepsList = !isZoneMode
    ? WAREHOUSE_STEPS
    : hasOperationalImpact
    ? OPERATIONAL_IMPACT_ZONE_STEPS
    : STANDARD_ZONE_STEPS;

  const maxSteps = stepsList.length;
  const isFinalStep = state.currentStep === maxSteps;
  const hasErrors = state.validationResults.some(r => r.severity === 'error');

  const zoneName = targetZone ? `${targetZone.name} (${targetZone.code})` : 'All Zones';
  const hierarchyMode = targetZone?.hierarchyMode === 'custom' ? 'Custom' : 'Inherited';

  const goToStep = (step: WizardStep) => {
    onChange({ ...state, currentStep: step });
  };

  const goNext = () => {
    if (state.currentStep < maxSteps) goToStep((state.currentStep + 1) as WizardStep);
  };

  const goPrev = () => {
    if (state.currentStep === 1 && state.returnToStep) {
      goToStep(state.returnToStep);
      return;
    }
    if (state.currentStep > 1) goToStep((state.currentStep - 1) as WizardStep);
  };

  const handlePublish = () => {
    onChange({ ...state, isDirty: false });
    onClose();
  };

  const renderStep = () => {
    if (isZoneMode) {
      if (hasOperationalImpact) {
        switch (state.currentStep) {
          case 1: return <Step2HierarchyDesigner state={state} onChange={onChange} onFinishEdit={() => goNext()} />;
          case 2: return <Step3LevelProperties state={state} onChange={onChange} />;
          case 3: return <Step5GenerateLayout state={state} onChange={onChange} />;
          case 4: return <Step6NamingRules state={state} onChange={onChange} />;
          case 5: return <Step7Validation state={state} onChange={onChange} onGoToStep={goToStep} />;
          case 6: return <StepImpactAssessment state={state} onChange={onChange} />;
          case 7: return <StepMigrationStrategy state={state} onChange={onChange} />;
          case 8: return <Step8ReviewPublish state={state} onChange={onChange} onClose={onClose} warehouseName={warehouseName} />;
          default: return null;
        }
      }

      switch (state.currentStep) {
        case 1: return <Step2HierarchyDesigner state={state} onChange={onChange} onFinishEdit={() => goNext()} />;
        case 2: return <Step3LevelProperties state={state} onChange={onChange} />;
        case 3: return <Step5GenerateLayout state={state} onChange={onChange} />;
        case 4: return <Step6NamingRules state={state} onChange={onChange} />;
        case 5: return <Step7Validation state={state} onChange={onChange} onGoToStep={goToStep} />;
        case 6: return <Step8ReviewPublish state={state} onChange={onChange} onClose={onClose} warehouseName={warehouseName} />;
        default: return null;
      }
    }

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
      {/* Sticky Compact Header & Stepper Area */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#d1def0] shadow-2xs flex-shrink-0">
        {/* Compact Single-Row Header */}
        <div className="px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-[#172B4D] hover:text-black font-semibold flex items-center justify-center shadow-2xs"
              title="Close wizard"
            >
              <X className="w-4 h-4 text-[#172B4D]" />
            </button>
            <h2 className="text-sm font-bold text-[#172B4D]">
              {isZoneMode ? 'Configure Zone' : 'Configure Warehouse'}
            </h2>
          </div>

          {/* Compact Metadata Row (Inline) */}
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-[#f7f8f9] border border-gray-200 px-3 py-1 rounded-lg font-medium">
            <span><strong className="text-gray-500 font-semibold">Warehouse:</strong> {warehouseName}</span>
            <span className="text-gray-300">|</span>
            <span><strong className="text-gray-500 font-semibold">Zone:</strong> {zoneName}</span>
            <span className="text-gray-300">|</span>
            <span><strong className="text-gray-500 font-semibold">Hierarchy:</strong> {hierarchyMode}</span>
            <span className="text-gray-300">|</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Draft
            </span>
          </div>
        </div>

        {/* Stepper Bar */}
        <div className="px-6 py-2">
          <div className="flex items-center gap-0 overflow-x-auto">
            {stepsList.map((step, idx) => {
              const isCompleted = step.id < state.currentStep;
              const isCurrent = step.id === state.currentStep;
              const isLast = idx === stepsList.length - 1;

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
      </div>

      {/* Step Content Workspace (Scrollable Canvas) */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Wizard Footer - Unified Single Bottom Action Bar */}
      <div className="bg-white border-t border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-xs">
        {state.currentStep > 1 ? (
          <button
            onClick={goPrev}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2.5">
          {isFinalStep ? (
            <>
              <button
                type="button"
                onClick={() => {}}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Save as New Template
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...state, isDirty: true })}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f4f0f2] transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>

              <button
                type="button"
                disabled={hasErrors}
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Globe className="w-4 h-4" />
                {isZoneMode ? 'Publish Zone Configuration' : 'Publish Configuration'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onChange({ ...state, isDirty: true })}
                className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
