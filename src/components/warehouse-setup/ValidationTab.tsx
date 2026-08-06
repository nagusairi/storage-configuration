import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  ChevronDown, ChevronUp, ArrowRight, ExternalLink, GitBranch,
  MapPin, Package, FileText, Check, AlertCircle
} from 'lucide-react';
import type { WarehouseConfig } from './types';

interface ValidationTabProps {
  config: WarehouseConfig;
  onNavigateTab?: (tabId: string) => void;
}

interface ValidationIssue {
  id: string;
  severity: 'warning' | 'error';
  category: 'Hierarchy' | 'Zone' | 'Storage' | 'Naming';
  issue: string;
  location: string;
  targetTab: string;
  actionLabel: string;
}

interface ValidationCategoryItem {
  id: string;
  name: string;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  items: Array<{
    id: string;
    rule: string;
    status: 'passed' | 'warning' | 'error';
    detail?: string;
  }>;
}

const MOCK_CATEGORIES: ValidationCategoryItem[] = [
  {
    id: 'cat-hierarchy',
    name: 'Hierarchy Validation',
    passedCount: 5,
    warningCount: 0,
    errorCount: 0,
    items: [
      { id: 'h1', rule: 'Parent-child hierarchy model structure valid', status: 'passed' },
      { id: 'h2', rule: 'Required hierarchy levels defined & non-empty', status: 'passed' },
      { id: 'h3', rule: 'Prefix uniqueness across levels verified', status: 'passed' },
      { id: 'h4', rule: 'No circular level references detected', status: 'passed' },
      { id: 'h5', rule: 'Level depth limit within operational bounds (6 levels max)', status: 'passed' },
    ],
  },
  {
    id: 'cat-zone',
    name: 'Zone Validation',
    passedCount: 4,
    warningCount: 1,
    errorCount: 0,
    items: [
      { id: 'z1', rule: 'All zone codes unique across warehouse', status: 'passed' },
      { id: 'z2', rule: 'Zone business names properly configured', status: 'passed' },
      { id: 'z3', rule: 'Custom hierarchy overrides assigned valid models', status: 'passed' },
      { id: 'z4', rule: 'Operational capacity bounds verified', status: 'passed' },
      { id: 'z5', rule: 'Zone D — Bulk Pallet Storage uses default hierarchy (Verify custom model assignment)', status: 'warning', detail: 'Zone D has large capacity; verify if compact hierarchy override is recommended.' },
    ],
  },
  {
    id: 'cat-storage',
    name: 'Storage Validation',
    passedCount: 5,
    warningCount: 0,
    errorCount: 0,
    items: [
      { id: 's1', rule: 'Storage location codes generated cleanly', status: 'passed' },
      { id: 's2', rule: 'Barcode format rules valid & parseable', status: 'passed' },
      { id: 's3', rule: 'Location capacity bounds within range (14,400 locations)', status: 'passed' },
      { id: 's4', rule: 'No orphan or unassigned storage locations', status: 'passed' },
      { id: 's5', rule: 'Sequence pattern uniqueness verified', status: 'passed' },
    ],
  },
  {
    id: 'cat-naming',
    name: 'Naming Rules Validation',
    passedCount: 4,
    warningCount: 1,
    errorCount: 0,
    items: [
      { id: 'n1', rule: 'Location prefix syntax valid (LOC)', status: 'passed' },
      { id: 'n2', rule: 'Level separator syntax valid (-)', status: 'passed' },
      { id: 'n3', rule: 'Numeric sequence pattern configured', status: 'passed' },
      { id: 'n4', rule: 'Auto-generate barcode & QR formats active', status: 'passed' },
      { id: 'n5', rule: 'Code padding set to 2 digits (e.g. 01 vs 1)', status: 'warning', detail: 'Padding is set to 2 digits. Consider 3 digits for warehouses with >99 racks per zone.' },
    ],
  },
];

const MOCK_ISSUES: ValidationIssue[] = [
  {
    id: 'iss-1',
    severity: 'warning',
    category: 'Zone',
    issue: 'Zone D — Bulk Pallet Storage uses default hierarchy. Verify if high-density model is recommended.',
    location: 'Zone D (Bulk Pallet)',
    targetTab: 'zone-layouts',
    actionLabel: 'Open Zone Layouts',
  },
  {
    id: 'iss-2',
    severity: 'warning',
    category: 'Naming',
    issue: 'Code padding configured for 2 digits. 3-digit padding recommended for >99 racks per zone.',
    location: 'Warehouse Naming Rules',
    targetTab: 'naming-rules',
    actionLabel: 'Open Naming & Rules',
  },
];

export function ValidationTab({ config, onNavigateTab }: ValidationTabProps) {
  const [lastValidated, setLastValidated] = useState<string>('2 minutes ago');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshNotification, setRefreshNotification] = useState<string>('');
  
  // Expand/collapse category state (auto-expand categories with warnings/errors)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-zone': true,
    'cat-naming': true,
  });

  const totalPassed = MOCK_CATEGORIES.reduce((acc, c) => acc + c.passedCount, 0);
  const totalWarnings = MOCK_CATEGORIES.reduce((acc, c) => acc + c.warningCount, 0);
  const totalErrors = MOCK_CATEGORIES.reduce((acc, c) => acc + c.errorCount, 0);

  const isHealthy = totalErrors === 0 && totalWarnings === 0;
  const isAttentionRequired = totalErrors > 0;
  const hasWarningsOnly = totalErrors === 0 && totalWarnings > 0;

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefreshValidation = () => {
    setIsRefreshing(true);
    setRefreshNotification('Refreshing validation...');

    setTimeout(() => {
      setIsRefreshing(false);
      setLastValidated('Just now');
      setRefreshNotification('Validation updated just now.');
      setTimeout(() => setRefreshNotification(''), 3000);
    }, 900);
  };

  return (
    <div className="p-6 space-y-5 bg-[#f7f8f9] min-h-full">
      
      {/* ── Page Header & Health Status Bar ───────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172B4D]">Validation</h2>
            {/* Live Health Status Indicator */}
            {isHealthy ? (
              <span className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🟢 Healthy – All validations passed
              </span>
            ) : hasWarningsOnly ? (
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🟡 Warnings Exist – Non-blocking
              </span>
            ) : (
              <span className="text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🔴 Attention Required – Blocking errors
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Review the health & operational compliance of the active warehouse configuration
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-gray-400 block text-[10px] font-semibold uppercase tracking-wider">Last Validated</span>
            <span className="font-bold text-[#172B4D]">{lastValidated}</span>
          </div>

          <button
            onClick={handleRefreshValidation}
            disabled={isRefreshing}
            className="h-[32px] px-3.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5C1F3D]' : 'text-gray-500'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Validation'}</span>
          </button>
        </div>
      </div>

      {/* Refresh Feedback Notification */}
      {refreshNotification && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-2.5 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150">
          <span>{refreshNotification}</span>
          <span className="text-[10px] font-mono text-blue-700">Timestamp: {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* ── Compact Validation Summary Card ───────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-green-50/70 border border-green-200/80 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Passed Rules</span>
              <span className="text-base font-bold text-green-800">✓ {totalPassed}</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Warnings</span>
              <span className="text-base font-bold text-amber-900">⚠ {totalWarnings}</span>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          </div>

          <div className="bg-red-50/70 border border-red-200/80 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Errors</span>
              <span className="text-base font-bold text-red-800">✖ {totalErrors}</span>
            </div>
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          </div>

          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Overall Health</span>
              <span className={`text-xs font-bold ${
                isHealthy ? 'text-green-700' : hasWarningsOnly ? 'text-amber-800' : 'text-red-700'
              }`}>
                {isHealthy ? 'Healthy' : hasWarningsOnly ? 'Non-Blocking Warnings' : 'Attention Required'}
              </span>
            </div>
            <ShieldCheck className={`w-5 h-5 ${isHealthy ? 'text-green-600' : 'text-amber-600'}`} />
          </div>
        </div>
      </div>

      {/* ── Validation Issues Enterprise Table (only if warnings/errors exist) ─ */}
      {MOCK_ISSUES.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-2xs space-y-0">
          <div className="bg-amber-50/60 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Actionable Validation Issues ({MOCK_ISSUES.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Click "Fix" to navigate directly to configuration</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="bg-[#f7f8f9] border-b border-gray-200 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Severity</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Issue Description</th>
                  <th className="p-3">Location Context</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ISSUES.map(iss => (
                  <tr key={iss.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full capitalize">
                        {iss.severity}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#172B4D]">{iss.category}</td>
                    <td className="p-3 text-gray-800 font-medium">{iss.issue}</td>
                    <td className="p-3 font-mono text-gray-600 text-[11px]">{iss.location}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigateTab?.(iss.targetTab)}
                        className="h-[28px] px-3 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>{iss.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Categorized Expandable Validation Cards ────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Validation Categories ({MOCK_CATEGORIES.length})
        </h3>

        <div className="space-y-3">
          {MOCK_CATEGORIES.map(cat => {
            const isExpanded = !!expandedCategories[cat.id];
            const hasCategoryWarnings = cat.warningCount > 0;
            const hasCategoryErrors = cat.errorCount > 0;

            return (
              <div
                key={cat.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition-all ${
                  hasCategoryErrors
                    ? 'border-red-200'
                    : hasCategoryWarnings
                    ? 'border-amber-200'
                    : 'border-[#d1def0]'
                }`}
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    {hasCategoryErrors ? (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    ) : hasCategoryWarnings ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-[#172B4D]">{cat.name}</h4>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {cat.passedCount} Passed
                        {cat.warningCount > 0 && ` • ${cat.warningCount} Warning`}
                        {cat.errorCount > 0 && ` • ${cat.errorCount} Error`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      hasCategoryErrors
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : hasCategoryWarnings
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {hasCategoryErrors ? 'Errors Found' : hasCategoryWarnings ? 'Warnings Found' : '✓ All Passed'}
                    </span>

                    <button type="button" className="text-gray-400 hover:text-gray-600 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details List */}
                {isExpanded && (
                  <div className="px-4 py-3 bg-[#f7f8f9] border-t border-gray-200/60 space-y-2 text-xs">
                    {cat.items.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 ${
                          item.status === 'error'
                            ? 'bg-red-50/70 border-red-200 text-red-900'
                            : item.status === 'warning'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {item.status === 'error' ? (
                            <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                          ) : item.status === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                          )}

                          <div>
                            <span className="font-semibold block">{item.rule}</span>
                            {item.detail && (
                              <p className="text-[11px] text-gray-500 mt-0.5">{item.detail}</p>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize flex-shrink-0 ${
                          item.status === 'error'
                            ? 'bg-red-200 text-red-900'
                            : item.status === 'warning'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
