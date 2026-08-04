import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  description?: string;
  completed: boolean;
  active: boolean;
  disabled: boolean;
}

interface HorizontalStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  progressPercentage?: number;
}

export function HorizontalStepper({ steps, currentStep, onStepClick, progressPercentage }: HorizontalStepperProps) {
  return (
    <div className="bg-white">
      {/* Progress bar - only show if progressPercentage is provided */}
      {progressPercentage !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Form Progress</span>
            <span className="text-xs text-[#5C1F3D]">{progressPercentage}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5C1F3D] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative">
                {/* Step Label with optional checkmark */}
                <button
                  onClick={() => !step.disabled && onStepClick(step.id)}
                  disabled={step.disabled}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    step.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {/* Checkmark for completed steps */}
                  {step.completed && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                  
                  {/* Step Label */}
                  <p className={`text-xs ${
                    step.completed 
                      ? 'text-green-600'
                      : step.active 
                      ? 'text-[#5C1F3D]' 
                      : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </button>

                {/* Active step underline */}
                {step.active && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#5C1F3D]" />
                )}
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div className="flex-1 h-px bg-gray-300 mx-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}