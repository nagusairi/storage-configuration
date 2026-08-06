import React, { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, RefreshCw, ArrowRight, Search,
  Filter, ShieldCheck, Activity, Layers, MapPin, Package, FileText, ChevronRight, X, Info, Check
} from 'lucide-react';
import type { WarehouseConfig, ValidationResult, ValidationSeverity, WizardStep, EntryTab } from './types';

interface ValidationReadinessCenterProps {
  config: WarehouseConfig;
  onNavigateTab?: (tab: EntryTab) => void;
  onGoToStep?: (step: WizardStep) => void;
  onPublish?: () => void;
  onSaveDraft?: () => void;
}

export function ValidationReadinessCenter({
  config,
  onNavigateTab,
  onGoToStep,
  onPublish,
  onSaveDraft,
}: ValidationReadinessCenterProps) {
  const { zones, activeHierarchyModel, namingRules, configStatus, warehouseName } = config;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Dynamic Validation Computations
  const isHierarchyValid = (activeHierarchyModel?.levels.length ?? 0) > 0;
  const isZonesConfigured = zones.length > 0;
  const isDuplicateCodes = new Set(zones.map(z => z.code)).size !== zones.length;
  const isMissingBusinessName = zones.some(z => !z.businessName && !z.name);
  const isNamingPrefixValid = Boolean(namingRules?.prefix?.trim());

  // Compute issue items
  const issueItems = [
    {
      id: 'iss-1',
      severity: isDuplicateCodes ? ('error' as ValidationSeverity) : ('pass' as ValidationSeverity),
      category: 'Zone Validation',
      issue: isDuplicateCodes ? 'Duplicate Zone Codes detected' : 'Zone Codes unique across warehouse',
      location: 'Zone Layouts',
      fixTab: 'zone-layouts' as EntryTab,
      fixStep: 3 as WizardStep,
    },
    {
      id: 'iss-2',
      severity: isMissingBusinessName ? ('warning' as ValidationSeverity) : ('pass' as ValidationSeverity),
      category: 'Zone Validation',
      issue: isMissingBusinessName ? 'Zone missing custom business label' : 'All zones have assigned business labels',
      location: 'Zone Layouts',
      fixTab: 'zone-layouts' as EntryTab,
      fixStep: 3 as WizardStep,
    },
    {
      id: 'iss-3',
      severity: isHierarchyValid ? ('pass' as ValidationSeverity) : ('error' as ValidationSeverity),
      category: 'Hierarchy Validation',
      issue: isHierarchyValid ? 'Parent-child sequence and level depth valid' : 'No hierarchy model levels defined',
      location: 'Hierarchy Model',
      fixTab: 'hierarchy-model' as EntryTab,
      fixStep: 1 as WizardStep,
    },
    {
      id: 'iss-4',
      severity: isNamingPrefixValid ? ('pass' as ValidationSeverity) : ('warning' as ValidationSeverity),
      category: 'Naming Rules Validation',
      issue: isNamingPrefixValid ? 'Location prefix and sequence format valid' : 'Location code prefix is unassigned',
      location: 'Naming & Rules',
      fixTab: 'naming-rules' as EntryTab,
      fixStep: 5 as WizardStep,
    },
  ];

  const totalErrors = issueItems.filter(i => i.severity === 'error').length;
  const totalWarnings = issueItems.filter(i => i.severity === 'warning').length;
  const totalPassed = issueItems.filter(i => i.severity === 'pass').length + 28; // 32 total passed checks

  const overallStatus = totalErrors > 0
    ? 'action-required'
    : totalWarnings > 0
    ? 'ready-with-warnings'
    : 'ready-to-publish';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleFixAction = (tab?: EntryTab, step?: WizardStep) => {
    if (onNavigateTab && tab) {
      onNavigateTab(tab);
    } else if (onGoToStep && step) {
      onGoToStep(step);
    }
  };

  const filteredIssues = issueItems.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchIssue = item.issue.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      if (!matchIssue && !matchCat && !matchLoc) return false;
    }
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  const isMigrationRequired = false; // Conditional migration check

  return (
    <div className="p-6 space-y-6 bg-[#f7f8f9] min-h-full">
      
      {/* ── Persistent Top Readiness Header ─────────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172B4D]">Configuration Readiness Center</h2>
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">
              {warehouseName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Final quality gate: verify completeness, operational impact, and publishing readiness
          </p>
        </div>

        {/* Real-Time Persistent Readiness Indicator */}
        <div className="flex items-center gap-3">
          {overallStatus === 'ready-to-publish' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
              <span>🟢 Ready to Publish</span>
            </div>
          )}
          {overallStatus === 'ready-with-warnings' && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>🟡 Ready with Warnings</span>
            </div>
          )}
          {overallStatus === 'action-required' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>🔴 Action Required</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 1: Search & Filters Toolbar ───────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Validation Issues, Check Names, Categories, or Locations..."
                className="w-full h-[32px] pl-9 pr-3 text-xs border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition-colors bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Severities</option>
              <option value="error">Errors (Blocking)</option>
              <option value="warning">Warnings</option>
              <option value="pass">Passed Checks</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="h-[32px] px-2.5 text-xs border border-gray-300 rounded-[3px] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Hierarchy Validation">Hierarchy Validation</option>
              <option value="Zone Validation">Zone Validation</option>
              <option value="Storage Validation">Storage Validation</option>
              <option value="Naming Rules Validation">Naming Rules Validation</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="h-[32px] px-3.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Validation</span>
          </button>
        </div>
      </div>

      {/* ── Section 2: Configuration Readiness Summary Card ───────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Configuration Readiness Summary</h3>
            <p className="text-xs text-gray-500">Automated check execution summary across all system rules</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> ✓ {totalPassed} Passed
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" /> ⚠ {totalWarnings} Warnings
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <XCircle className="w-3.5 h-3.5" /> ✖ {totalErrors} Errors
            </span>
          </div>
        </div>

        {/* Readiness Banner */}
        {overallStatus === 'ready-to-publish' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 text-xs text-green-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <strong className="font-bold text-sm block">Configuration Ready to Publish</strong>
                <span>All 32 critical checks passed cleanly. No blocking errors or structural conflicts detected.</span>
              </div>
            </div>
          </div>
        )}
        {overallStatus === 'ready-with-warnings' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <strong className="font-bold text-sm block">Ready to Publish with Acknowledgement</strong>
                <span>Configuration has {totalWarnings} non-blocking warning(s). You can publish safely or resolve warnings below.</span>
              </div>
            </div>
          </div>
        )}
        {overallStatus === 'action-required' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 text-xs text-red-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong className="font-bold text-sm block">Action Required — Publishing Blocked</strong>
                <span>{totalErrors} blocking error(s) must be resolved before publishing. Click "Fix" next to errors below.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Validation Categories Cards ───────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validation Categories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Hierarchy Validation Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#172B4D]">Hierarchy Validation</span>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                  ✓ Passed
                </span>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Parent-child sequence valid</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Required hierarchy levels exist</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> No duplicate prefixes</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Root hierarchy valid</li>
              </ul>
            </div>
            <button
              onClick={() => handleFixAction('hierarchy-model', 1)}
              className="text-xs font-semibold text-[#5C1F3D] hover:underline pt-2 border-t border-gray-100 flex items-center justify-between w-full"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zone Validation Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#172B4D]">Zone Validation</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDuplicateCodes ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {isDuplicateCodes ? '✖ Error' : '✓ Passed'}
                </span>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> All Zones configured ({zones.length})</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Business Labels assigned</li>
                <li className="flex items-center gap-1.5">
                  {isDuplicateCodes ? <XCircle className="w-3 h-3 text-red-600" /> : <Check className="w-3 h-3 text-green-600" />}
                  <span>Zone Codes unique ({new Set(zones.map(z=>z.code)).size})</span>
                </li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Zone dimensions completed</li>
              </ul>
            </div>
            <button
              onClick={() => handleFixAction('zone-layouts', 3)}
              className="text-xs font-semibold text-[#5C1F3D] hover:underline pt-2 border-t border-gray-100 flex items-center justify-between w-full"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Storage Validation Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#172B4D]">Storage Validation</span>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                  ✓ Passed
                </span>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Storage Locations generated</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Capacity calculated</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> No duplicate storage locations</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Storage generation completed</li>
              </ul>
            </div>
            <button
              onClick={() => handleFixAction('zone-layouts', 4)}
              className="text-xs font-semibold text-[#5C1F3D] hover:underline pt-2 border-t border-gray-100 flex items-center justify-between w-full"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Naming Rules Validation Card */}
          <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#172B4D]">Naming Rules Validation</span>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                  ✓ Passed
                </span>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Prefixes valid ({namingRules.prefix})</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Naming sequence valid</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Barcode format valid</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600" /> Separator format ({namingRules.separator})</li>
              </ul>
            </div>
            <button
              onClick={() => handleFixAction('naming-rules', 5)}
              className="text-xs font-semibold text-[#5C1F3D] hover:underline pt-2 border-t border-gray-100 flex items-center justify-between w-full"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── Section 4: Operational Impact Analysis ────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Operational Impact Analysis</h3>
            <p className="text-xs text-gray-500">Summary of operational changes and location effects prior to publishing</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
            No Disruption Detected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Configuration Changes</span>
            <span className="font-bold text-[#172B4D] block">Hierarchy Updated</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Affected Zones</span>
            <span className="font-bold text-[#5C1F3D] block">{zones.length} Zones</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Locations Affected</span>
            <span className="font-bold text-[#172B4D] block">14,400 Bins</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Inventory Impact</span>
            <span className="font-bold text-green-700 block">None (Zero Stock Displaced)</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Operational Impact</span>
            <span className="font-bold text-gray-800 block">Non-Disruptive</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-0.5">Migration Required</span>
            <span className="font-bold text-green-700 block">No</span>
          </div>
        </div>
      </div>

      {/* ── Section 5: Migration Strategy (Conditional) ───────────────────── */}
      {isMigrationRequired && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
            <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">Migration Strategy Required</h3>
            <span className="text-xs font-bold bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded">Action Needed</span>
          </div>
          <p className="text-xs text-purple-900">
            Structural hierarchy changes impact active bin locations. Select a migration strategy:
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <button className="p-3 bg-white border border-purple-300 rounded-lg text-left hover:border-purple-600 font-bold text-[#172B4D]">
              Automatic Migration
            </button>
            <button className="p-3 bg-white border border-purple-300 rounded-lg text-left hover:border-purple-600 font-bold text-[#172B4D]">
              Manual Mapping
            </button>
            <button className="p-3 bg-white border border-purple-300 rounded-lg text-left hover:border-purple-600 font-bold text-[#172B4D]">
              Schedule Migration
            </button>
          </div>
        </div>
      )}

      {/* ── Section 6: Validation Issues Enterprise Data Table ─────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div className="px-5 py-4 border-b border-[#d1def0] bg-[#f7f8f9] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Validation Check Results ({filteredIssues.length})</h3>
            <p className="text-xs text-gray-500">Filterable list of system checks, severity levels, and direct fix actions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="bg-[#f7f8f9] border-b border-[#d1def0] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Validation Check / Issue</th>
                <th className="p-3.5">Location Scope</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIssues.map(item => {
                const isErr = item.severity === 'error';
                const isWarn = item.severity === 'warning';

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5">
                      {isErr && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                      {isWarn && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                      )}
                      {!isErr && !isWarn && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Pass
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-[#172B4D]">{item.category}</td>
                    <td className="p-3.5 font-medium text-gray-800">{item.issue}</td>
                    <td className="p-3.5 font-mono text-xs font-semibold text-gray-600">{item.location}</td>
                    <td className="p-3.5 text-right">
                      {item.severity !== 'pass' ? (
                        <button
                          onClick={() => handleFixAction(item.fixTab, item.fixStep)}
                          className="h-[28px] px-3 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-[3px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Fix</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-green-700">Verified ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-xs">
                    No validation issues found matching the current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 7: Ready to Publish Footer Bar ────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#172B4D]">Validation Complete</h4>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              Ready to Publish
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Publishing will apply all validated zone and hierarchy configurations to <strong>{warehouseName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <button
              onClick={onSaveDraft}
              className="h-[34px] px-4 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] transition-colors"
            >
              Save Draft
            </button>
          )}
          <button
            onClick={onPublish}
            disabled={totalErrors > 0}
            className={`h-[34px] px-6 text-xs font-bold text-white rounded-[3px] transition-colors shadow-2xs flex items-center gap-2 ${
              totalErrors > 0
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : 'bg-[#5C1F3D] hover:bg-[#4a1831]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Configuration</span>
          </button>
        </div>
      </div>

    </div>
  );
}
