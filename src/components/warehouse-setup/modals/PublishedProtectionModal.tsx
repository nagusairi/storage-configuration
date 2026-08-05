import { AlertTriangle, Copy, FileEdit, X } from 'lucide-react';

interface PublishedProtectionModalProps {
  isOpen: boolean;
  modelName: string;
  hasExistingDraft?: boolean;
  onCreateDraft: () => void;
  onContinueDraft?: () => void;
  onCancel: () => void;
}

export function PublishedProtectionModal({
  isOpen,
  modelName,
  hasExistingDraft = false,
  onCreateDraft,
  onContinueDraft,
  onCancel,
}: PublishedProtectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d1def0] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#172B4D]">
                This Hierarchy Model is currently Published and in use
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{modelName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            Directly modifying a published hierarchy model can affect active warehouse storage calculations and location codes.
            Choose how you would like to make modifications:
          </p>

          <div className="flex flex-col gap-2.5">
            {/* Create Draft Version (Recommended) */}
            <button
              onClick={onCreateDraft}
              className="group text-left p-4 rounded-xl border-2 border-[#5C1F3D] bg-[#f9f4f7] hover:bg-[#f4ebf0] transition-all flex items-start gap-3 relative"
            >
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5C1F3D] text-white">
                Recommended
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5C1F3D] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#5C1F3D]">Create Draft Version</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Clone this model into a safe draft workspace. Your live published hierarchy will remain untouched until you publish.
                </p>
              </div>
            </button>

            {/* Continue Existing Draft */}
            {hasExistingDraft && onContinueDraft && (
              <button
                onClick={onContinueDraft}
                className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-[#5C1F3D] hover:bg-gray-50 transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#172B4D]">Continue Editing Existing Draft</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Open your previously saved draft version of this hierarchy model.
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3.5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
