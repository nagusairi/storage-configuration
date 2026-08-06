import React, { useState } from 'react';
import {
  GitBranch, X, Check, Save, ShieldCheck, AlertTriangle, ArrowRight,
  Sliders, Layers, RefreshCw, CheckCircle2
} from 'lucide-react';
import type { WarehouseConfig, WizardState, HierarchyModel, HierarchyLevel } from './types';
import { Step2HierarchyDesigner } from './steps/Step2HierarchyDesigner';
import { STANDARD_6_LEVEL } from './mockData';

interface HierarchyModelEditorProps {
  config: WarehouseConfig;
  onSaveDraft: (updatedModel: HierarchyModel) => void;
  onReviewImpact?: () => void;
  onClose: () => void;
}

export function HierarchyModelEditor({ config, onSaveDraft, onReviewImpact, onClose }: HierarchyModelEditorProps) {
  const currentModel = config.activeHierarchyModel ?? STANDARD_6_LEVEL;

  // Internal wizard state mock for Step2HierarchyDesigner
  const [designerState, setDesignerState] = useState<WizardState>({
    currentStep: 1,
    wizardMode: 'warehouse',
    selectedMethod: 'scratch',
    hierarchyModel: JSON.parse(JSON.stringify(currentModel)),
    zones: config.zones,
    namingRules: config.namingRules,
    validationResults: [],
    isDirty: false,
  });

  const [showImpactModal, setShowImpactModal] = useState<boolean>(false);
  const [validationBadge, setValidationBadge] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const assignedZones = config.zones.filter(z => z.hierarchyMode !== 'custom' || !z.customHierarchyModel);
  const hasAssignedZones = assignedZones.length > 0;

  const handleValidateModel = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationBadge('✓ Model Validated (0 Errors)');
      setTimeout(() => setValidationBadge(null), 3500);
    }, 700);
  };

  const handleSaveDraftClick = () => {
    const updatedModel = designerState.hierarchyModel;
    onSaveDraft(updatedModel);

    if (hasAssignedZones) {
      setShowImpactModal(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f8f9] flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* ── Editor Header Bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5C1F3D] text-white flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B4D]">Hierarchy Model Editor</h2>
              <span className="text-[10px] font-bold bg-[#5C1F3D]/10 text-[#5C1F3D] border border-[#5C1F3D]/20 px-2 py-0.5 rounded-full">
                Dedicated Editor Mode
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                Draft
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span>Warehouse: <strong>{config.warehouseName}</strong></span>
              <span>•</span>
              <span>Editing Model: <strong>{designerState.hierarchyModel.name}</strong></span>
              <span>•</span>
              <span className="text-gray-400">Auto Saved Just Now</span>
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {validationBadge && (
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full animate-in fade-in">
              {validationBadge}
            </span>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Center Content Area: Reused 3-Panel Hierarchy Designer ───────── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Step2HierarchyDesigner
          state={designerState}
          onChange={setDesignerState}
        />
      </div>

      {/* ── Bottom Action Bar (No Previous / Next / Publish) ───────────────── */}
      <div className="bg-white border-t border-[#d1def0] px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={onClose}
          className="h-[32px] px-4 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleValidateModel}
            disabled={isValidating}
            className="h-[32px] px-4 text-xs font-semibold text-[#5C1F3D] bg-white border border-[#5C1F3D]/40 hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            <span>Validate Model</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="h-[32px] px-5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* ── Impact Detection Review Modal ─────────────────────────────────── */}
      {showImpactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Hierarchy Model Updated</h4>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  Assigned to {assignedZones.length} Zone{assignedZones.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-2">
              <p className="font-semibold">Operational Impact Detected:</p>
              <p>
                This Hierarchy Model is currently assigned to <strong>{assignedZones.length} Zone{assignedZones.length > 1 ? 's' : ''}</strong> ({assignedZones.map(z => z.name).join(', ')}).
              </p>
              <p className="text-amber-800">
                Your changes may affect existing Zone configurations. Review the impact before publishing.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowImpactModal(false);
                  onClose();
                }}
                className="h-[32px] px-4 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Close & Keep Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowImpactModal(false);
                  onClose();
                  if (onReviewImpact) onReviewImpact();
                }}
                className="h-[32px] px-4 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded shadow-2xs flex items-center gap-1"
              >
                <span>Review Impact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
