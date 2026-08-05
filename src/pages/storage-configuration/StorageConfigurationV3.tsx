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

      case 'hierarchy-model':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Hierarchy Model</h3>
                <p className="text-sm text-gray-500">Active hierarchy for {config.warehouseName}</p>
              </div>
              <button
                onClick={() => handleEditHierarchyClick()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
              >
                Edit Hierarchy Model
              </button>
            </div>
            {config.activeHierarchyModel ? (
              <div className="bg-white rounded-xl border border-[#d1def0] p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-[#172B4D] mb-1">{config.activeHierarchyModel.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{config.activeHierarchyModel.description}</p>
                <div className="flex flex-col gap-2">
                  {config.activeHierarchyModel.levels.map((lvl, idx) => (
                    <div key={lvl.id} className="flex items-center gap-2" style={{ paddingLeft: `${idx * 20}px` }}>
                      {idx > 0 && <div className="w-4 h-4 border-l-2 border-b-2 border-gray-200 rounded-bl flex-shrink-0" />}
                      <div className="flex items-center gap-2 bg-[#f7f8f9] border border-[#d1def0] rounded-lg px-3 py-2">
                        <span className="text-[10px] font-mono text-gray-400">L{idx + 1}</span>
                        <span className="text-sm font-medium text-[#172B4D]">{lvl.name}</span>
                        <span className="text-[10px] font-mono bg-white text-gray-500 border border-gray-200 px-1.5 rounded">{lvl.codePrefix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <ComingSoon label="Hierarchy Model" />}
          </div>
        );

      case 'zone-layouts':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Zone Layouts</h3>
                <p className="text-sm text-gray-500">{config.zones.length} zones configured</p>
              </div>
              <button onClick={() => openWizard(undefined, 3)} className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors">
                Manage Zones
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {config.zones.map(zone => (
                <div key={zone.id} className="bg-white border border-[#d1def0] rounded-xl px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{zone.code}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#172B4D]">{zone.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {zone.hierarchyMode === 'custom' ? (zone.customHierarchyModel?.name ?? 'Custom') : 'Default hierarchy'}
                        {' · '}{zone.pickingStrategy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditHierarchyClick(3)}
                      className="px-3 py-1.5 text-xs font-medium text-[#5C1F3D] border border-[#5C1F3D] rounded hover:bg-[#f9f4f7] transition-colors"
                    >
                      Edit Hierarchy
                    </button>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${zone.status === 'active' ? 'bg-green-50 text-green-700' : zone.status === 'maintenance' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {zone.status}
                    </span>
                  </div>
                </div>
              ))}
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
