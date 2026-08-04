import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface StepActionBarProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  isFirstStep?: boolean;
  isLastStep: boolean;
  isSaving?: boolean;
  canProceed?: boolean;
  sidebarExpanded?: boolean;
}

export function StepActionBar({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onPrevious,
  onCancel,
  onSaveDraft,
  onSubmit,
  isFirstStep,
  isLastStep,
  isSaving = false,
  canProceed = true,
  sidebarExpanded = false
}: StepActionBarProps) {
  // Use onBack if provided, otherwise use onPrevious
  const handlePrevious = onBack || onPrevious;
  // Use onNext if provided
  const handleNext = onNext;
  // Determine if it's first step
  const isFirst = isFirstStep !== undefined ? isFirstStep : currentStep === 1;

  return (
    <div 
      className="fixed bottom-0 right-0 h-12 bg-white border-t border-gray-200 px-6 flex items-center justify-between transition-all duration-300 z-[100]"
      style={{ 
        left: sidebarExpanded ? '240px' : '54px',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
      }}
    >
      {/* Left Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        {onSaveDraft && (
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Step indicator */}
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>

        {/* Previous Button */}
        {!isFirst && (
          <button
            onClick={handlePrevious}
            className="px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        )}

        {/* Next/Submit Button */}
        {!isLastStep ? (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canProceed || isSaving}
            className="px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit Item</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}