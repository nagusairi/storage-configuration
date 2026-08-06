import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Layers, Upload, BookOpen, Search,
  ArrowRight, Check, ChevronDown, X,
  Warehouse, Snowflake, Factory, Store, ShieldCheck, Building2
} from 'lucide-react';
import type { SetupMethod } from './types';
import { MOCK_TEMPLATES } from './mockData';

interface WarehouseSetupScreenProps {
  onCancel: () => void;
  onContinue: (method: SetupMethod, templateId?: string) => void;
  warehouseName?: string;
}

const FLOWONE_TEMPLATES = [
  {
    id: 'flowone-dc',
    name: 'Distribution Center',
    icon: Warehouse,
    description: 'High-volume DC layout with Pallet Racks & Bulk storage',
    badge: 'Recommended',
  },
  {
    id: 'flowone-cold',
    name: 'Cold Storage',
    icon: Snowflake,
    description: 'Temperature-controlled multi-zone layout & freezer staging',
    badge: null,
  },
  {
    id: 'flowone-mfg',
    name: 'Manufacturing',
    icon: Factory,
    description: 'WIP buffer zones & production line feed storage',
    badge: null,
  },
  {
    id: 'flowone-retail',
    name: 'Retail',
    icon: Store,
    description: 'Fast-pick forward locations & backroom high-density shelving',
    badge: null,
  },
  {
    id: 'flowone-pharma',
    name: 'Pharma',
    icon: ShieldCheck,
    description: 'Secure vault storage, quarantine & lot-tracked bin hierarchy',
    badge: null,
  },
  {
    id: 'flowone-3pl',
    name: '3PL',
    icon: Building2,
    description: 'Multi-tenant client partitions with dynamic location allocation',
    badge: null,
  },
];

export function WarehouseSetupScreen({
  onCancel,
  onContinue,
  warehouseName = 'New Warehouse',
}: WarehouseSetupScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<SetupMethod>('flowone-template');
  const [selectedFlowOneSubId, setSelectedFlowOneSubId] = useState<string>('flowone-dc');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectPrimary = (method: SetupMethod) => {
    setSelectedMethod(method);
    setSelectedTemplateId(undefined);
    if (method !== 'flowone-template') setIsDropdownOpen(false);
  };

  const selectTemplate = (method: 'published-template' | 'draft-template', templateId: string) => {
    setSelectedMethod(method);
    setSelectedTemplateId(templateId);
    setIsDropdownOpen(false);
  };

  const filteredTemplates = MOCK_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const publishedTemplates = filteredTemplates.filter(t => t.status === 'published');
  const draftTemplates = filteredTemplates.filter(t => t.status === 'draft');

  const isFlowOneSelected = selectedMethod === 'flowone-template' && !selectedTemplateId;
  const isScratchSelected = selectedMethod === 'scratch' && !selectedTemplateId;
  const isImportSelected = selectedMethod === 'import' && !selectedTemplateId;

  const currentFlowOneTpl = FLOWONE_TEMPLATES.find(t => t.id === selectedFlowOneSubId) ?? FLOWONE_TEMPLATES[0];
  const CurrentIcon = currentFlowOneTpl.icon;

  return (
    <div className="flex flex-col h-full bg-[#f7f8f9] rounded-lg border border-[#d1def0] overflow-hidden">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d1def0] px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-[#172B4D]">Warehouse Setup</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{warehouseName}</p>
        </div>

        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-[#172B4D] hover:text-black font-semibold flex items-center justify-center shadow-2xs"
          title="Close setup"
        >
          <X className="w-4 h-4 text-[#172B4D]" />
        </button>
      </div>

      {/* ── Main Scrollable Body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-6 max-w-5xl mx-auto w-full">
        {/* Section Heading & Subtitle */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#172B4D] mb-1">Choose a Setup Method</h2>
          <p className="text-sm text-gray-500">
            Select how you want to configure this warehouse's storage hierarchy.
          </p>
        </div>

        {/* Primary Setup Options (3 Cards Grid - Uniform Height) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1: flowOne Templates with Stylish Custom Dropdown */}
          <div
            className={`group text-left rounded-xl border-2 p-5 transition-all flex flex-col justify-between relative bg-white min-h-[190px] ${
              isFlowOneSelected
                ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-md'
                : 'border-[#d1def0] hover:border-[#5C1F3D]/60 hover:shadow-sm'
            }`}
            onClick={() => {
              if (!isFlowOneSelected) selectPrimary('flowone-template');
            }}
          >
            {/* Top Row: Icon + Checkmark/Badge */}
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#5C1F3D] shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {isFlowOneSelected ? (
                <div className="w-5 h-5 rounded-full bg-[#5C1F3D] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5C1F3D] text-white">
                  Recommended
                </span>
              )}
            </div>

            {/* Title & Category Description */}
            <div>
              <h3 className="text-sm font-bold text-[#172B4D] mb-0.5 group-hover:text-[#5C1F3D] transition-colors">
                flowOne Templates
              </h3>
              <p className="text-xs text-gray-500 leading-tight mb-3">
                Industry-standard warehouse blueprints.
              </p>
            </div>

            {/* Custom Dropdown Trigger */}
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectPrimary('flowone-template');
                  setIsDropdownOpen(prev => !prev);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                  isDropdownOpen
                    ? 'border-[#5C1F3D] bg-white ring-2 ring-[#5C1F3D]/10'
                    : 'border-gray-200 bg-gray-50/70 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CurrentIcon className="w-4 h-4 text-[#5C1F3D] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#172B4D] truncate">
                    {currentFlowOneTpl.name}
                  </span>
                  {currentFlowOneTpl.badge && (
                    <span className="text-[9px] font-bold bg-[#5C1F3D] text-white px-1.5 py-0.2 rounded-full flex-shrink-0">
                      {currentFlowOneTpl.badge}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180 text-[#5C1F3D]' : ''}`} />
              </button>

              {/* Custom Floating Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-[#d1def0] shadow-xl z-30 py-1 max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {FLOWONE_TEMPLATES.map(tpl => {
                    const ItemIcon = tpl.icon;
                    const isSelected = selectedFlowOneSubId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFlowOneSubId(tpl.id);
                          selectPrimary('flowone-template');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors ${
                          isSelected ? 'bg-[#fdfafb]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <ItemIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#5C1F3D]' : 'text-gray-400'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#5C1F3D]' : 'text-[#172B4D]'}`}>
                              {tpl.name}
                            </span>
                            {tpl.badge && (
                              <span className="text-[9px] font-bold bg-[#5C1F3D] text-white px-1.5 py-0.2 rounded-full ml-1">
                                {tpl.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">
                            {tpl.description}
                          </p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5C1F3D] mt-0.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Build From Scratch */}
          <button
            onClick={() => selectPrimary('scratch')}
            className={`group text-left rounded-xl border-2 p-5 transition-all flex flex-col justify-between relative bg-white min-h-[190px] ${
              isScratchSelected
                ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-md'
                : 'border-[#d1def0] hover:border-[#5C1F3D]/60 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600 shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              {isScratchSelected && (
                <div className="w-5 h-5 rounded-full bg-[#5C1F3D] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#172B4D] mb-1 group-hover:text-[#5C1F3D] transition-colors">
                Build From Scratch
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create a completely custom warehouse hierarchy.
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-[#5C1F3D] mt-4 pt-2 border-t border-gray-100">
              {isScratchSelected ? 'Selected' : 'Select option'}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Card 3: Import Existing Configuration */}
          <button
            onClick={() => selectPrimary('import')}
            className={`group text-left rounded-xl border-2 p-5 transition-all flex flex-col justify-between relative bg-white min-h-[190px] ${
              isImportSelected
                ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-md'
                : 'border-[#d1def0] hover:border-[#5C1F3D]/60 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-700 shadow-sm">
                <Upload className="w-5 h-5 text-white" />
              </div>
              {isImportSelected && (
                <div className="w-5 h-5 rounded-full bg-[#5C1F3D] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#172B4D] mb-1 group-hover:text-[#5C1F3D] transition-colors">
                Import Existing Configuration
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Import an Excel or JSON warehouse configuration.
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-[#5C1F3D] mt-4 pt-2 border-t border-gray-100">
              {isImportSelected ? 'Selected' : 'Select option'}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Search & Filter Header for Templates */}
        <div className="flex items-center justify-between gap-4 mb-4 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Saved & Custom Templates</h3>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-[#d1def0] rounded-lg focus:outline-none focus:border-[#5C1F3D] bg-white"
            />
          </div>
        </div>

        {/* My Published Templates Section */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            My Published Templates ({publishedTemplates.length})
          </h4>
          {publishedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {publishedTemplates.map(tpl => {
                const isSelected = selectedMethod === 'published-template' && selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => selectTemplate('published-template', tpl.id)}
                    className={`text-left rounded-xl border p-4 transition-all bg-white flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 shadow-sm'
                        : 'border-[#d1def0] hover:border-[#5C1F3D]/60 hover:shadow-xs'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#172B4D] truncate">{tpl.name}</p>
                        {isSelected && (
                          <span className="text-[10px] font-semibold bg-[#5C1F3D] text-white px-1.5 py-0.5 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-2">{tpl.description}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tpl.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap flex-shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                      {tpl.warehouseCount} warehouses
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-2">No published templates found matching your search.</p>
          )}
        </div>

        {/* My Draft Templates Section */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            My Draft Templates ({draftTemplates.length})
          </h4>
          {draftTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draftTemplates.map(tpl => {
                const isSelected = selectedMethod === 'draft-template' && selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => selectTemplate('draft-template', tpl.id)}
                    className={`text-left rounded-xl border border-dashed p-4 transition-all bg-white flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 bg-amber-50/20'
                        : 'border-[#d1def0] hover:border-[#5C1F3D]/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#172B4D] truncate">{tpl.name}</p>
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          Draft
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{tpl.description}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      Updated {tpl.updatedAt}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-2">No draft templates found matching your search.</p>
          )}
        </div>
      </div>

      {/* ── Bottom Sticky Action Footer ────────────────────────────────────── */}
      <div className="bg-white border-t border-[#d1def0] px-8 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={() => onContinue(selectedMethod, selectedTemplateId)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
