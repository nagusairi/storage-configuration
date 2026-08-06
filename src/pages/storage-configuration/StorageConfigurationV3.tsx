import { useState } from 'react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';
import type { WizardState, SetupMethod, EntryTab, WarehouseConfig, WizardStep } from '../../components/warehouse-setup/types';
import { MOCK_WAREHOUSE_CONFIGS, STANDARD_6_LEVEL } from '../../components/warehouse-setup/mockData';
import { EntryScreen } from '../../components/warehouse-setup/EntryScreen';
import { SetupWizard } from '../../components/warehouse-setup/SetupWizard';
import { WarehouseSetupScreen } from '../../components/warehouse-setup/WarehouseSetupScreen';
import { OverviewTab } from '../../components/warehouse-setup/OverviewTab';
import { PublishedProtectionModal } from '../../components/warehouse-setup/modals/PublishedProtectionModal';

// ─── Wizard initial state factory ───────────────────────────────────────────
function makeInitialWizardState(
  config: WarehouseConfig,
  initialMethod?: SetupMethod,
  startStep?: WizardStep,
  returnToStep?: WizardStep
): WizardState {
  return {
    currentStep: startStep ?? 1,
    returnToStep,
    selectedMethod: initialMethod,
    hierarchyModel: config.activeHierarchyModel ?? { ...STANDARD_6_LEVEL, id: `hm-new-${Date.now()}`, name: 'New Hierarchy' },
    zones: [...(config.zones ?? [])],
    namingRules: { ...config.namingRules },
    validationResults: [],
    isDirty: false,
  };
}

// ─── Placeholder tab panels ──────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#f4f0f2] flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h4 className="text-sm font-semibold text-[#172B4D] mb-1">{label}</h4>
      <p className="text-xs text-gray-500">This section is coming soon.</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function StorageConfigurationV3() {
  const { sidebarExpanded } = useSidebar();

  // Active warehouse — default to first published one for demo
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-1');

  // Active entry tab (only relevant when published)
  const [activeTab, setActiveTab] = useState<EntryTab>('overview');

  // Dedicated Warehouse Setup screen state
  const [showWarehouseSetup, setShowWarehouseSetup] = useState(false);

  // Wizard state
  const [wizardState, setWizardState] = useState<WizardState | null>(null);

  // Protection modal state
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [pendingOriginStep, setPendingOriginStep] = useState<WizardStep | undefined>(undefined);

  // ── Derived ──────────────────────────────────────────────────────────────
  const config: WarehouseConfig = MOCK_WAREHOUSE_CONFIGS[selectedWarehouseId] ?? Object.values(MOCK_WAREHOUSE_CONFIGS)[0];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleWarehouseChange = (id: string) => {
    setSelectedWarehouseId(id);
    setActiveTab('overview');
    setWizardState(null);
    setShowWarehouseSetup(false);
  };

  /**
   * Opens the Setup Wizard / Hierarchy Designer directly.
   * Checks published protection first if editing a published hierarchy model.
   * Bypasses the Warehouse Setup page completely.
   */
  const handleEditHierarchyClick = (originStep?: WizardStep) => {
    setShowWarehouseSetup(false);
    if (config.configStatus === 'published') {
      setPendingOriginStep(originStep);
      setShowProtectionModal(true);
    } else {
      openWizard(undefined, 1, originStep);
    }
  };

  const openWizard = (method?: SetupMethod, step?: WizardStep, returnToStep?: WizardStep) => {
    setWizardState(makeInitialWizardState(config, method, step ?? 1, returnToStep));
  };

  const handleCreateDraft = () => {
    setShowProtectionModal(false);
    openWizard('scratch', 1, pendingOriginStep);
  };

  const handleContinueDraft = () => {
    setShowProtectionModal(false);
    openWizard('draft-template', 1, pendingOriginStep);
  };

  const closeWizard = () => {
    setWizardState(null);
  };

  const handleStartSetupWorkflow = (method: SetupMethod, templateId?: string) => {
    setShowWarehouseSetup(false);
    openWizard(method, 1);
  };

  // ── Tab Content Renderer (only called for published warehouses) ───────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab config={config} onSetupClick={() => openWizard(undefined, 1)} />;

      case 'hierarchy-model': {
        const inheritedZones = config.zones.filter(z => z.hierarchyMode !== 'custom');
        const customZones = config.zones.filter(z => z.hierarchyMode === 'custom');

        return (
          <div className="p-6 space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Hierarchy Model</h3>
                <p className="text-sm text-gray-500">
                  Active master hierarchy blueprint for <span className="font-medium text-[#172B4D]">{config.warehouseName}</span>
                </p>
              </div>
              <button
                onClick={() => handleEditHierarchyClick()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
              >
                Edit Hierarchy Model
              </button>
            </div>

            {config.activeHierarchyModel ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Active Hierarchy Blueprint Card (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#d1def0] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Title & Metadata Badges */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="text-base font-bold text-[#172B4D]">{config.activeHierarchyModel.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100">
                          Source: flowOne Template
                        </span>
                        <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                          Version: v1.2 (Active)
                        </span>
                        <span className="text-[11px] font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Published
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-6">{config.activeHierarchyModel.description}</p>

                    {/* Level Visual Tree */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Level Hierarchy Sequence ({config.activeHierarchyModel.levels.length} Levels):
                      </p>
                      {config.activeHierarchyModel.levels.map((lvl, idx) => (
                        <div key={lvl.id} className="flex items-center gap-3" style={{ paddingLeft: `${idx * 20}px` }}>
                          {idx > 0 && <div className="w-4 h-4 border-l-2 border-b-2 border-gray-200 rounded-bl flex-shrink-0" />}
                          <div className="flex-1 flex items-center justify-between bg-[#f7f8f9] border border-[#d1def0] rounded-xl px-4 py-2.5 hover:border-[#5C1F3D]/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded">
                                L{idx + 1}
                              </span>
                              <span className="text-sm font-semibold text-[#172B4D]">{lvl.name}</span>
                              <span className="text-xs font-mono bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-medium">
                                Prefix: {lvl.codePrefix}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {lvl.supportsCapacity && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Capacity</span>}
                              {lvl.supportsDimensions && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Dimensions</span>}
                              {lvl.supportsBarcode && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Barcode</span>}
                              {lvl.supportsSerial && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Serial</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Hierarchy Usage Summary */}
                <div className="bg-white rounded-xl border border-[#d1def0] p-6 shadow-sm flex flex-col gap-5">
                  <div>
                    <h4 className="text-sm font-bold text-[#172B4D] mb-1">Hierarchy Usage Summary</h4>
                    <p className="text-xs text-gray-500">
                      Shows which zones inherit the master blueprint versus zones with custom overrides.
                    </p>
                  </div>

                  {/* Section 1: Used By (Inherited) */}
                  <div className="bg-green-50/50 border border-green-200/60 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-green-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Used By (Inherited)
                      </span>
                      <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {inheritedZones.length} Zone{inheritedZones.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {inheritedZones.map(z => (
                        <div key={z.id} className="flex items-center justify-between text-xs bg-white border border-green-100 rounded-lg px-3 py-1.5">
                          <span className="font-semibold text-[#172B4D]">{z.name}</span>
                          <span className="font-mono text-gray-400 text-[10px]">{z.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Overridden By (Custom) */}
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        Overridden By (Custom)
                      </span>
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {customZones.length} Zone{customZones.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {customZones.map(z => (
                        <div key={z.id} className="flex items-center justify-between text-xs bg-white border border-amber-100 rounded-lg px-3 py-1.5">
                          <div>
                            <span className="font-semibold text-[#172B4D] block">{z.name}</span>
                            <span className="text-[10px] text-amber-700 font-medium">
                              Model: {z.customHierarchyModel?.name ?? 'Custom'}
                            </span>
                          </div>
                          <span className="font-mono text-gray-400 text-[10px]">{z.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : <ComingSoon label="Hierarchy Model" />}
          </div>
        );
      }

      case 'zone-layouts':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Zone Layouts</h3>
                <p className="text-sm text-gray-500">{config.zones.length} zones configured with metadata-driven hierarchies</p>
              </div>
              <button onClick={() => openWizard(undefined, 3)} className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm">
                Manage Zones
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {config.zones.map(zone => {
                const isCustom = zone.hierarchyMode === 'custom';
                const activeModel = isCustom ? zone.customHierarchyModel : config.activeHierarchyModel;
                const levelsList = activeModel?.levels ?? [];

                return (
                  <div key={zone.id} className="bg-white border border-[#d1def0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2.5 py-1 rounded-lg">
                          {zone.code}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#172B4D]">{zone.name}</h4>
                            {isCustom ? (
                              <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Custom Hierarchy Override
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Inherited from Warehouse Hierarchy
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Picking Strategy: <span className="font-semibold text-gray-700">{zone.pickingStrategy}</span>
                            {zone.dimensions && ` · Dimensions: ${zone.dimensions.width}m × ${zone.dimensions.depth}m`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditHierarchyClick(3)}
                          className="px-3.5 py-1.5 text-xs font-medium text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f9f4f7] transition-colors"
                        >
                          Edit Hierarchy
                        </button>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${zone.status === 'active' ? 'bg-green-50 text-green-700' : zone.status === 'maintenance' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {zone.status}
                        </span>
                      </div>
                    </div>

                    {/* Compact Hierarchy Flow Preview */}
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Zone Storage Hierarchy Chain:
                      </p>
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {!isCustom && (
                          <>
                            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md">
                              Warehouse
                            </span>
                            <span className="text-gray-400 font-bold text-xs">→</span>
                          </>
                        )}
                        {levelsList.map((lvl, idx) => {
                          const isLast = idx === levelsList.length - 1;
                          return (
                            <div key={lvl.id} className="flex items-center gap-1.5 flex-shrink-0">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                isCustom ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-white text-[#172B4D] border border-[#d1def0]'
                              }`}>
                                {lvl.name}
                              </span>
                              {!isLast && <span className="text-gray-400 font-bold text-xs">→</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'naming-rules':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Naming & Rules</h3>
                <p className="text-sm text-gray-500">Location code format and barcode settings</p>
              </div>
              <button onClick={() => openWizard(undefined, 5)} className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors">
                Edit Rules
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#d1def0] divide-y divide-[#f0f4f8]">
              {[
                { label: 'Code Prefix',             value: config.namingRules.prefix },
                { label: 'Separator',               value: config.namingRules.separator },
                { label: 'Padding',                 value: `${config.namingRules.padding} digits` },
                { label: 'Sequence',                value: config.namingRules.sequence },
                { label: 'Barcode Format',          value: config.namingRules.barcodeFormat },
                { label: 'Auto-generate Barcode',   value: config.namingRules.autoGenerateBarcode ? 'Yes' : 'No' },
                { label: 'Auto-generate QR',        value: config.namingRules.autoGenerateQR ? 'Yes' : 'No' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-[#172B4D] font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'validation':
        return <ComingSoon label="Validation" />;

      case 'activity':
        return <ComingSoon label="Activity" />;

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ModulePageTemplate
      title="Storage Configuration"
      subtitle="Warehouse setup and configuration"
      breadcrumbs={['Dashboard', 'Storage Configuration']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding
    >
      <div className="p-6 h-full flex flex-col">
        {/* Full-page views: Setup Screen -> Wizard -> EntryScreen */}
        {showWarehouseSetup ? (
          <WarehouseSetupScreen
            onCancel={() => setShowWarehouseSetup(false)}
            onContinue={handleStartSetupWorkflow}
            warehouseName={config.warehouseName}
          />
        ) : wizardState ? (
          <SetupWizard
            state={wizardState}
            onChange={setWizardState}
            onClose={closeWizard}
            warehouseName={config.warehouseName}
          />
        ) : (
          <EntryScreen
            config={config}
            selectedWarehouse={selectedWarehouseId}
            onWarehouseChange={handleWarehouseChange}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as EntryTab)}
            onSetupClick={openWizard}
            onNewWarehouseClick={() => setShowWarehouseSetup(true)}
            onTabContent={renderTabContent}
          />
        )}

        {/* Protection modal for published models */}
        <PublishedProtectionModal
          isOpen={showProtectionModal}
          modelName={config.activeHierarchyModel?.name ?? 'Published Hierarchy'}
          hasExistingDraft={true}
          onCreateDraft={handleCreateDraft}
          onContinueDraft={handleContinueDraft}
          onCancel={() => setShowProtectionModal(false)}
        />
      </div>
    </ModulePageTemplate>
  );
}
