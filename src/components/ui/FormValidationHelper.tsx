import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface FormValidationHelperProps {
  currentStep: number;
  addItemType: string;
  gstApplicable: boolean;
  hsnSacCode: string;
  gstRate: string;
  itemName?: string;
  category?: string;
  measuringUnit?: string;
}

export function FormValidationHelper({
  currentStep,
  addItemType,
  gstApplicable,
  hsnSacCode,
  gstRate,
  itemName = '',
  category = '',
  measuringUnit = ''
}: FormValidationHelperProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState<string[]>([]);

  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, addItemType, gstApplicable, hsnSacCode, gstRate, itemName, category, measuringUnit]);

  const validateCurrentStep = () => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const success: string[] = [];

    if (currentStep === 1) {
      // Required field validation
      if (!addItemType) {
        errors.push('Item Type is required');
      } else {
        success.push('Item Type selected');
      }

      if (!itemName) {
        errors.push('Item Name is required');
      } else if (itemName.length < 3) {
        warnings.push('Item Name should be at least 3 characters');
      } else {
        success.push('Item Name provided');
      }

      if (!category) {
        errors.push('Category is required');
      } else {
        success.push('Category selected');
      }

      if (!measuringUnit) {
        errors.push('Measuring Unit is required');
      } else {
        success.push('Measuring Unit selected');
      }

      // GST validation
      if (gstApplicable) {
        if (!hsnSacCode) {
          errors.push('HSN/SAC Code is required when GST is applicable');
        } else {
          success.push('HSN/SAC Code provided');
        }

        if (!gstRate) {
          errors.push('GST Rate is required when GST is applicable');
        } else {
          success.push('GST Rate selected');
        }
      } else {
        warnings.push('GST is not applicable - ensure this is correct for your business');
      }
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setValidationSuccess(success);
  };

  if (validationErrors.length === 0 && validationWarnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm text-red-900 mb-2">Required Fields Missing</h4>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-xs text-red-700 flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {validationWarnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm text-yellow-900 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index} className="text-xs text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {validationSuccess.length > 0 && validationErrors.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm text-green-900 mb-1">All required fields completed!</h4>
              <p className="text-xs text-green-700">You can proceed to the next step.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
