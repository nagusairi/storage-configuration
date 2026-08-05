import { CheckCircle2, Globe, Plus, ArrowRight, Trash2, Edit3, Move, Save, X } from 'lucide-react';
import type { HierarchyLevel } from '../types';

export interface DiffSummary {
  added: string[];
  removed: string[];
  renamed: { from: string; to: string }[];
  reordered: boolean;
}

interface ReviewChangesModalProps {
  isOpen: boolean;
  modelName: string;
  initialLevels: HierarchyLevel[];
  currentLevels: HierarchyLevel[];
  onPublish: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
}

export function computeHierarchyDiff(initial: HierarchyLevel[], current: HierarchyLevel[]): DiffSummary {
  const initialMap = new Map(initial.map(l => [l.id, l]));
  const currentMap = new Map(current.map(l => [l.id, l]));

  const added: string[] = [];
  const removed: string[] = [];
  const renamed: { from: string; to: string }[] = [];

  // Check added & renamed
  for (const lvl of current) {
    if (!initialMap.has(lvl.id)) {
      added.push(lvl.name);
    } else {
      const orig = initialMap.get(lvl.id)!;
      if (orig.name !== lvl.name) {
        renamed.push({ from: orig.name, to: lvl.name });
      }
    }
  }

  // Check removed
  for (const lvl of initial) {
    if (!currentMap.has(lvl.id)) {
      removed.push(lvl.name);
    }
  }

  // Check reordered
  const commonInitial = initial.filter(l => currentMap.has(l.id)).map(l => l.id);
  const commonCurrent = current.filter(l => initialMap.has(l.id)).map(l => l.id);
  const reordered = JSON.stringify(commonInitial) !== JSON.stringify(commonCurrent);

  return { added, removed, renamed, reordered };
}

export function ReviewChangesModal({
  isOpen,
  modelName,
  initialLevels,
  currentLevels,
  onPublish,
  onSaveDraft,
  onCancel,
}: ReviewChangesModalProps) {
  if (!isOpen) return null;

  const diff = computeHierarchyDiff(initialLevels, currentLevels);
  const hasChanges = diff.added.length > 0 || diff.removed.length > 0 || diff.renamed.length > 0 || diff.reordered;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d1def0] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#f7f8f9]">
          <div>
            <h3 className="text-sm font-semibold text-[#172B4D]">Review Hierarchy Changes</h3>
            <p className="text-xs text-gray-500 mt-0.5">{modelName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {!hasChanges ? (
            <div className="py-8 text-center text-gray-500">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#172B4D]">No structural modifications detected.</p>
              <p className="text-xs text-gray-400 mt-1">The hierarchy matches the starting blueprint.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Modifications Summary</p>

              {/* Added */}
              {diff.added.map((name, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50/70 border border-green-200/60 text-xs text-green-800">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="font-semibold">Added Level:</span> {name}
                </div>
              ))}

              {/* Removed */}
              {diff.removed.map((name, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50/70 border border-red-200/60 text-xs text-red-800">
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </div>
                  <span className="font-semibold">Removed Level:</span> {name}
                </div>
              ))}

              {/* Renamed */}
              {diff.renamed.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-800">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <Edit3 className="w-3 h-3" />
                  </div>
                  <span className="font-semibold">Renamed Level:</span> {item.from} <ArrowRight className="w-3 h-3 inline mx-1" /> {item.to}
                </div>
              ))}

              {/* Reordered */}
              {diff.reordered && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-purple-50/70 border border-purple-200/60 text-xs text-purple-800">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                    <Move className="w-3 h-3" />
                  </div>
                  <span className="font-semibold">Reordered:</span> Level depth sequence updated
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveDraft}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f9f4f7] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button
              onClick={onPublish}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
