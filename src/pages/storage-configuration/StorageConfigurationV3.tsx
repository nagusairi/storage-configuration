import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Info, Check, X, ShieldAlert } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';
import type { WizardState, SetupMethod, EntryTab, WarehouseConfig, WizardStep, ZoneConfig, PickingStrategy } from '../../components/warehouse-setup/types';
import { MOCK_WAREHOUSE_CONFIGS, STANDARD_6_LEVEL, COMPACT_3_LEVEL } from '../../components/warehouse-setup/mockData';
import { EntryScreen } from '../../components/warehouse-setup/EntryScreen';
import { SetupWizard } from '../../components/warehouse-setup/SetupWizard';
import { WarehouseSetupScreen } from '../../components/warehouse-setup/WarehouseSetupScreen';
import { OverviewTab } from '../../components/warehouse-setup/OverviewTab';
import { PublishedProtectionModal } from '../../components/warehouse-setup/modals/PublishedProtectionModal';

// Mock list of zones with active dependencies (locations/inventory)
const DEPENDENT_ZONE_IDS = ['zone-a', 'zone-b', 'zone-c'];

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

  // ── Local Zones State for Published Mode ──────────────────────────────────
  const [localZones, setLocalZones] = useState<ZoneConfig[] | null>(null);

  // Modals state for Zone Management
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');
  const [newZoneMode, setNewZoneMode] = useState<'default' | 'custom'>('default');
  const [newZoneStrategy, setNewZoneStrategy] = useState<PickingStrategy>('FIFO');

  // Delete modal state
  const [zoneToDelete, setZoneToDelete] = useState<ZoneConfig | null>(null);
  const [showBlockedDeleteModal, setShowBlockedDeleteModal] = useState(false);
  const [showStandardDeleteModal, setShowStandardDeleteModal] = useState(false);
  const [dependencyInfoMsg, setDependencyInfoMsg] = useState<string | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const rawConfig: WarehouseConfig = MOCK_WAREHOUSE_CONFIGS[selectedWarehouseId] ?? Object.values(MOCK_WAREHOUSE_CONFIGS)[0];
  const currentZones = localZones ?? rawConfig.zones ?? [];
  const config: WarehouseConfig = { ...rawConfig, zones: currentZones };

  // Edit Published Zone modal state
  const [showEditPublishedZoneModal, setShowEditPublishedZoneModal] = useState(false);
  const [targetZoneForEdit, setTargetZoneForEdit] = useState<ZoneConfig | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleWarehouseChange = (id: string) => {
    setSelectedWarehouseId(id);
    setActiveTab('overview');
    setWizardState(null);
    setShowWarehouseSetup(false);
    setLocalZones(null);
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

  const handleConfigureZoneClick = (zone: ZoneConfig) => {
    setShowWarehouseSetup(false);
    const hasDependencies = DEPENDENT_ZONE_IDS.includes(zone.id);

    if (config.configStatus === 'published' && hasDependencies) {
      // Direct editing blocked -> Display Edit Published Zone modal
      setTargetZoneForEdit(zone);
      setShowEditPublishedZoneModal(true);
    } else {
      // Direct Zone Wizard launch for unused zones
      openZoneWizard(zone);
    }
  };

  const openZoneWizard = (zone: ZoneConfig) => {
    setShowEditPublishedZoneModal(false);
    setWizardState({
      currentStep: 1,
      wizardMode: 'zone',
      targetZoneId: zone.id,
      selectedMethod: 'scratch',
      hierarchyModel: zone.customHierarchyModel ?? config.activeHierarchyModel ?? STANDARD_6_LEVEL,
      zones: [zone],
      namingRules: { ...config.namingRules },
      validationResults: [],
      isDirty: false,
    });
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

  // ── Zone Management Actions ──────────────────────────────────────────────
  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim() || !newZoneCode.trim()) return;

    const created: ZoneConfig = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      code: newZoneCode.trim().toUpperCase(),
      status: 'active',
      hierarchyMode: newZoneMode,
      customHierarchyModel: newZoneMode === 'custom' ? COMPACT_3_LEVEL : undefined,
      pickingStrategy: newZoneStrategy,
      generation: { levels: [] }
    };

    setLocalZones([...currentZones, created]);
    setShowAddZoneModal(false);
    setNewZoneName('');
    setNewZoneCode('');
  };

  const toggleZoneStatus = (zoneId: string) => {
    setLocalZones(currentZones.map(z => {
      if (z.id === zoneId) {
        const nextStatus = z.status === 'active' ? 'inactive' : 'active';
        return { ...z, status: nextStatus as any };
      }
      return z;
    }));
  };

  const handleInitiateDeleteZone = (zone: ZoneConfig) => {
    setZoneToDelete(zone);
    const hasDependencies = DEPENDENT_ZONE_IDS.includes(zone.id);

    if (hasDependencies) {
      // State 3: Blocked deletion with itemized dependencies
      setShowBlockedDeleteModal(true);
    } else {
      // State 2: Standard confirmation dialog
      setShowStandardDeleteModal(true);
    }
  };

  const confirmDeleteZone = () => {
    if (zoneToDelete) {
      setLocalZones(currentZones.filter(z => z.id !== zoneToDelete.id));
    }
    setShowStandardDeleteModal(false);
    setZoneToDelete(null);
  };

  const handleDeactivateFromBlockedModal = () => {
    if (zoneToDelete) {
      toggleZoneStatus(zoneToDelete.id);
    }
    setShowBlockedDeleteModal(false);
    setZoneToDelete(null);
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddZoneModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </button>
                <button onClick={() => openWizard(undefined, 3)} className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                  Manage Zones
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {config.zones.map(zone => {
                const isCustom = zone.hierarchyMode === 'custom';
                const activeModel = isCustom ? zone.customHierarchyModel : config.activeHierarchyModel;
                const levelsList = activeModel?.levels ?? [];
                const isActive = zone.status === 'active';

                return (
                  <div key={zone.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                    isActive ? 'border-[#d1def0]' : 'border-gray-200 bg-gray-50/50 opacity-80'
                  }`}>
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
                        {/* Status Toggle / Deactivate Button */}
                        <button
                          onClick={() => toggleZoneStatus(zone.id)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize transition-colors flex items-center gap-1 ${
                            isActive
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-amber-50 hover:text-amber-700'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-700'
                          }`}
                          title={isActive ? 'Click to deactivate zone' : 'Click to activate zone'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {zone.status}
                        </button>

                        <button
                          onClick={() => handleConfigureZoneClick(zone)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-2xs"
                        >
                          Configure Zone
                        </button>

                        {/* Delete Action Button */}
                        <button
                          onClick={() => handleInitiateDeleteZone(zone)}
                          title="Delete Zone"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

        {/* ── Protection Modal for Published Models ─────────────────────────── */}
        <PublishedProtectionModal
          isOpen={showProtectionModal}
          modelName={config.activeHierarchyModel?.name ?? 'Published Hierarchy'}
          hasExistingDraft={true}
          onCreateDraft={handleCreateDraft}
          onContinueDraft={handleContinueDraft}
          onCancel={() => setShowProtectionModal(false)}
        />

        {/* ── Edit Published Zone Modal (Dependency Analysis) ───────────────── */}
        {showEditPublishedZoneModal && targetZoneForEdit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-amber-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Edit Published Zone</h3>
                  <p className="text-xs text-amber-700 font-semibold mt-0.5">
                    {targetZoneForEdit.name} ({targetZoneForEdit.code}) is currently Published and actively used.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <p className="font-semibold text-amber-950">The following operational dependencies were found:</p>
                <ul className="space-y-1 font-mono text-[11px] text-amber-900 pl-2">
                  <li>• 1,248 Configured Storage Locations</li>
                  <li>• 352 Active Inventory Items</li>
                  <li>• 3 Active Putaway Rules</li>
                  <li>• 2 Picking Strategies</li>
                </ul>
                <p className="text-[11px] text-amber-800/90 pt-1 italic">
                  Changes to the hierarchy or storage structure may impact existing warehouse operations. Direct editing is not permitted. Choose how you would like to continue:
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => openZoneWizard(targetZoneForEdit)}
                  className="w-full text-left p-3.5 rounded-xl border-2 border-[#5C1F3D] bg-white ring-2 ring-[#5C1F3D]/20 shadow-xs hover:bg-[#fdfafb] transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-[#5C1F3D] block">Create Draft Version (Recommended)</span>
                    <span className="text-[11px] text-gray-500">Safely edit hierarchy & rules in a draft environment. Live operations remain uninterrupted.</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Recommended</span>
                </button>

                <button
                  onClick={() => openZoneWizard(targetZoneForEdit)}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#172B4D] block">Continue Existing Draft</span>
                    <span className="text-[11px] text-gray-500">Resume pending draft updates for this zone.</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPublishedZoneModal(false);
                    setTargetZoneForEdit(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Zone Modal ────────────────────────────────────────────────── */}
        {showAddZoneModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#172B4D]">Add New Zone</h3>
                <button onClick={() => setShowAddZoneModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddZoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zone Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zone E — Dynamic Bulk"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zone Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZE"
                    value={newZoneCode}
                    onChange={(e) => setNewZoneCode(e.target.value)}
                    className="w-full text-sm font-mono uppercase border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hierarchy Mode</label>
                  <select
                    value={newZoneMode}
                    onChange={(e) => setNewZoneMode(e.target.value as 'default' | 'custom')}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] bg-white"
                  >
                    <option value="default">Inherit Warehouse Hierarchy</option>
                    <option value="custom">Custom Hierarchy Override</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Picking Strategy</label>
                  <select
                    value={newZoneStrategy}
                    onChange={(e) => setNewZoneStrategy(e.target.value as PickingStrategy)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#5C1F3D] bg-white"
                  >
                    <option value="FIFO">FIFO (First In, First Out)</option>
                    <option value="FEFO">FEFO (First Expired, First Out)</option>
                    <option value="LIFO">LIFO (Last In, First Out)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddZoneModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-sm"
                  >
                    Create Zone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── State 3: Cannot Delete Zone (Blocked Deletion Modal) ─────────── */}
        {showBlockedDeleteModal && zoneToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-red-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Cannot Delete Zone</h3>
                  <p className="text-xs text-red-600 font-semibold mt-0.5">
                    {zoneToDelete.name} ({zoneToDelete.code}) is currently in operational use.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <p className="font-semibold text-amber-950">
                  {zoneToDelete.name} cannot be deleted because it contains:
                </p>
                <ul className="space-y-1 font-mono text-[11px] text-amber-900 pl-2">
                  <li>• 1,248 Configured Storage Locations</li>
                  <li>• 312 Active Inventory Items</li>
                  <li>• 2 Active Putaway Rules</li>
                  <li>• 1 Picking Strategy ({zoneToDelete.pickingStrategy})</li>
                </ul>
                <p className="text-[11px] text-amber-800/90 pt-1 italic">
                  Before deleting this Zone, remove or reassign all dependent storage locations and operational data.
                </p>
              </div>

              {dependencyInfoMsg && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{dependencyInfoMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockedDeleteModal(false);
                    setZoneToDelete(null);
                    setDependencyInfoMsg(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setDependencyInfoMsg(`Opening dependency inspector for ${zoneToDelete.name}... (Locations: 1,248, SKUs: 312)`)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C1F3D] border border-[#5C1F3D] rounded-lg hover:bg-[#f9f4f7]"
                >
                  View Dependencies
                </button>

                <button
                  type="button"
                  onClick={handleDeactivateFromBlockedModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-sm"
                >
                  Deactivate Zone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── State 2: Standard Delete Zone Confirmation Modal ──────────────── */}
        {showStandardDeleteModal && zoneToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Delete Zone?</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{zoneToDelete.name}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-semibold text-[#172B4D]">{zoneToDelete.name}</span> contains no storage locations or active inventory. This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowStandardDeleteModal(false);
                    setZoneToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteZone}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Delete Zone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModulePageTemplate>
  );
}
