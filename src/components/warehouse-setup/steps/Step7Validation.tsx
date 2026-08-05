import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import type { WizardState, ValidationResult, ValidationSeverity, WizardStep } from '../types';

interface Props { state: WizardState; onChange: (s: WizardState) => void; onGoToStep: (step: WizardStep) => void; }

function runValidation(state: WizardState): ValidationResult[] {
  const results: ValidationResult[] = [];
  const levels = state.hierarchyModel.levels;

  results.push({ id: 'v1', check: 'Hierarchy Defined', severity: levels.length > 0 ? 'pass' : 'error', message: levels.length > 0 ? `${levels.length} levels defined` : 'No hierarchy levels defined.', fixStep: 2 });
  results.push({ id: 'v2', check: 'All Levels Named', severity: levels.every(l => l.name.trim().length > 0) ? 'pass' : 'error', message: levels.every(l => l.name.trim().length > 0) ? 'All levels have names' : 'Some levels are missing names.', fixStep: 3 });
  results.push({ id: 'v3', check: 'Zones Configured', severity: state.zones.length > 0 ? 'pass' : 'warning', message: state.zones.length > 0 ? `${state.zones.length} zone(s) configured` : 'No zones have been added. Locations cannot be generated.', fixStep: 4 });
  results.push({ id: 'v4', check: 'Code Prefix Conflicts', severity: levels.length > 1 && new Set(levels.map(l => l.codePrefix)).size !== levels.length ? 'error' : 'pass', message: levels.length > 1 && new Set(levels.map(l => l.codePrefix)).size !== levels.length ? 'Duplicate code prefixes detected.' : 'No duplicate code prefixes.', fixStep: 3 });
  results.push({ id: 'v5', check: 'Generation Counts', severity: state.zones.some(z => z.generation.levels.length === 0) ? 'warning' : 'pass', message: state.zones.some(z => z.generation.levels.length === 0) ? 'Some zones have no generation counts set. Defaults will be used.' : 'All zones have generation counts.', fixStep: 5 });
  results.push({ id: 'v6', check: 'Naming Rules', severity: state.namingRules.prefix.trim().length > 0 ? 'pass' : 'warning', message: state.namingRules.prefix.trim().length > 0 ? 'Naming rules configured' : 'Location code prefix is empty.', fixStep: 6 });

  return results;
}

const SEV_CONFIG: Record<ValidationSeverity, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  pass: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Pass' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Warning' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Error' },
};

export function Step7Validation({ state, onChange, onGoToStep }: Props) {
  const results = runValidation(state);
  const errors = results.filter(r => r.severity === 'error').length;
  const warnings = results.filter(r => r.severity === 'warning').length;
  const passes = results.filter(r => r.severity === 'pass').length;

  // Persist validation results
  if (JSON.stringify(state.validationResults) !== JSON.stringify(results)) {
    onChange({ ...state, validationResults: results });
  }

  return (
    <div className="p-6">
      {/* Summary Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D] mb-1">Validation Summary</h3>
          <p className="text-sm text-gray-500">Review all configuration checks before publishing.</p>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> {passes} Passed
          </span>
          {warnings > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> {warnings} Warning{warnings !== 1 ? 's' : ''}
            </span>
          )}
          {errors > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
              <XCircle className="w-3.5 h-3.5" /> {errors} Error{errors !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => onChange({ ...state, validationResults: runValidation(state) })}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-run
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-xl border border-[#d1def0] divide-y divide-[#f0f4f8]">
        {results.map(result => {
          const { icon: Icon, color, bg, label } = SEV_CONFIG[result.severity];
          return (
            <div key={result.id} className="flex items-center gap-4 px-5 py-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-medium text-[#172B4D]">{result.check}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${bg} ${color}`}>{label}</span>
                </div>
                <p className="text-xs text-gray-500">{result.message}</p>
              </div>
              {result.fixStep && result.severity !== 'pass' && (
                <button
                  onClick={() => onGoToStep(result.fixStep!)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#0052CC] hover:underline flex-shrink-0"
                >
                  Fix <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {errors === 0 && (
        <div className="mt-5 p-4 bg-green-50 border border-green-100 rounded-lg text-xs text-green-700">
          <strong>All critical checks passed.</strong> You can proceed to Review & Publish.
          {warnings > 0 && ` Note: ${warnings} warning(s) exist but won't block publishing.`}
        </div>
      )}
      {errors > 0 && (
        <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
          <strong>{errors} critical error(s) must be resolved</strong> before you can publish this configuration.
        </div>
      )}
    </div>
  );
}
