import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import type { WizardState, SetupMethod, EntryTab, WarehouseConfig, WizardStep, ZoneConfig } from '../../components/warehouse-setup/types';
import { MOCK_WAREHOUSE_CONFIGS, STANDARD_6_LEVEL } from '../../components/warehouse-setup/mockData';
import { EntryScreen } from '../../components/warehouse-setup/EntryScreen';
import { SetupWizard } from '../../components/warehouse-setup/SetupWizard';
import { WarehouseSetupScreen } from '../../components/warehouse-setup/WarehouseSetupScreen';
import { OverviewTab } from '../../components/warehouse-setup/OverviewTab';
import { PublishedProtectionModal } from '../../components/warehouse-setup/modals/PublishedProtectionModal';
import { WarehouseHubScreen } from '../../components/warehouse-setup/WarehouseHubScreen';
import { WarehouseCompareModal } from '../../components/warehouse-setup/modals/WarehouseCompareModal';

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

const DEPENDENT_ZONE_IDS = ['zone-a', 'zone-b', 'zone-c'];
const ALL_WAREHOUSE_CONFIGS = Object.values(MOCK_WAREHOUSE_CONFIGS);

export default function StorageConfigurationV5() {
  const [workspaceMode, setWorkspaceMode] = useState<'hub' | 'detail'>('hub');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('wh-1');
  const [activeTab, setActiveTab] = useState<EntryTab>('overview');
  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [showWarehouseSetup, setShowWarehouseSetup] = useState(false);

  // Compare Modal state
  const [compareWarehouses, setCompareWarehouses] = useState<WarehouseConfig[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Published protection modal state
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [pendingOriginStep, setPendingOriginStep] = useState<WizardStep | undefined>(undefined);

  // Local zone state overrides
  const [localZones, setLocalZones] = useState<ZoneConfig[] | null>(null);

  // Zone deletion modals
  const [showBlockedDeleteModal, setShowBlockedDeleteModal] = useState(false);
  const [showStandardDeleteModal, setShowStandardDeleteModal] = useState(false);
  const [targetZoneForDelete, setTargetZoneForDelete] = useState<ZoneConfig | null>(null);

  // Add Zone modal state
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');
  const [newZoneStrategy, setNewZoneStrategy] = useState<'FIFO' | 'FEFO' | 'LIFO'>('FEFO');

  // Edit Published Zone modal state
  const [showEditPublishedZoneModal, setShowEditPublishedZoneModal] = useState(false);
  const [targetZoneForEdit, setTargetZoneForEdit] = useState<ZoneConfig | null>(null);

  // Active warehouse configuration data
  const rawConfig = MOCK_WAREHOUSE_CONFIGS[selectedWarehouseId] ?? MOCK_WAREHOUSE_CONFIGS['wh-1'];
  const currentZones = localZones ?? rawConfig.zones ?? [];
  const config: WarehouseConfig = { ...rawConfig, zones: currentZones };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleWarehouseChange = (id: string) => {
    setSelectedWarehouseId(id);
    setActiveTab('overview');
    setWizardState(null);
    setShowWarehouseSetup(false);
    setLocalZones(null);
  };

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
      setTargetZoneForEdit(zone);
      setShowEditPublishedZoneModal(true);
    } else {
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
    openWizard(undefined, 1, pendingOriginStep);
  };

  const handleContinueDraft = () => {
    setShowProtectionModal(false);
    openWizard(undefined, pendingOriginStep ?? 1, pendingOriginStep);
  };

  const handleInitiateDeleteZone = (zone: ZoneConfig) => {
    setTargetZoneForDelete(zone);
    if (config.configStatus === 'published') {
      const hasDependencies = DEPENDENT_ZONE_IDS.includes(zone.id);
      if (hasDependencies) {
        setShowBlockedDeleteModal(true);
      } else {
        setShowStandardDeleteModal(true);
      }
    } else {
      performDeleteZone(zone.id);
    }
  };

  const performDeleteZone = (zoneId: string) => {
    const updated = currentZones.filter(z => z.id !== zoneId);
    setLocalZones(updated);
    setShowBlockedDeleteModal(false);
    setShowStandardDeleteModal(false);
    setTargetZoneForDelete(null);
  };

  const toggleZoneStatus = (zoneId: string) => {
    const updated = currentZones.map(z => {
      if (z.id === zoneId) {
        return { ...z, status: z.status === 'active' ? ('inactive' as const) : ('active' as const) };
      }
      return z;
    });
    setLocalZones(updated);
  };

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZoneCode) return;
    const newZone: ZoneConfig = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      code: newZoneCode.toUpperCase(),
      status: 'active',
      hierarchyMode: 'default',
      pickingStrategy: newZoneStrategy,
      generation: {
        levels: [
          { levelId: 'lvl-aisle', levelName: 'Aisle', count: 4 },
          { levelId: 'lvl-rack', levelName: 'Rack', count: 10 },
          { levelId: 'lvl-shelf', levelName: 'Shelf', count: 5 },
          { levelId: 'lvl-bin', levelName: 'Bin', count: 2 },
        ]
      }
    };
    setLocalZones([...currentZones, newZone]);
    setNewZoneName('');
    setNewZoneCode('');
    setShowAddZoneModal(false);
  };

  // ── Tab Content Renderer ──────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab config={config} onSetupClick={() => openWizard(undefined, 1)} />;

      case 'hierarchy-model': {
        const inheritedZones = config.zones.filter(z => z.hierarchyMode !== 'custom');
        const customZones = config.zones.filter(z => z.hierarchyMode === 'custom');

        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#172B4D] mb-1">Hierarchy Model</h3>
                <p className="text-sm text-gray-500">
                  Active master hierarchy blueprint for <span className="font-medium text-[#172B4D]">{config.warehouseName}</span>
                </p>
              </div>
              <button
                onClick={() => handleEditHierarchyClick(1)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-sm"
              >
                Edit Hierarchy Model
              </button>
            </div>

            {config.activeHierarchyModel ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#d1def0] p-6 shadow-sm flex flex-col justify-between">
                  <div>
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

                <div className="bg-white rounded-xl border border-[#d1def0] p-6 shadow-sm flex flex-col gap-5">
                  <div>
                    <h4 className="text-sm font-bold text-[#172B4D] mb-1">Hierarchy Usage Summary</h4>
                    <p className="text-xs text-gray-500">
                      Shows which zones inherit the master blueprint versus zones with custom overrides.
                    </p>
                  </div>

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
            ) : null}
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

                        <button
                          onClick={() => handleInitiateDeleteZone(zone)}
                          title="Delete Zone"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
                      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Active Chain Structure ({levelsList.length} Levels)
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-[#172B4D] bg-white border border-gray-200 px-2.5 py-1 rounded">
                          Warehouse ({config.warehouseName})
                        </span>
                        {levelsList.map(lvl => (
                          <span key={lvl.id} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <span className="text-gray-300">→</span>
                            <span className="bg-white border border-gray-200 px-2 py-1 rounded">
                              {lvl.name} <span className="font-mono text-[10px] text-gray-400">({lvl.codePrefix})</span>
                            </span>
                          </span>
                        ))}
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
          <div className="p-6 max-w-2xl">
            <h3 className="text-base font-semibold text-[#172B4D] mb-1">Naming & Rules</h3>
            <p className="text-sm text-gray-500 mb-5">Configuration parameters for location code generation</p>
            <div className="bg-white border border-[#d1def0] rounded-xl overflow-hidden divide-y divide-gray-100">
              {[
                { label: 'Location Prefix',          value: config.namingRules.prefix },
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

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ModulePageTemplate
      title={workspaceMode === 'hub' ? "Warehouse Configuration Hub" : "Storage Configuration v5"}
      subtitle={workspaceMode === 'hub' ? "Manage and monitor all warehouse configurations" : "Warehouse setup and configuration (v5)"}
      breadcrumbs={workspaceMode === 'hub' ? ['Dashboard', 'Warehouse Configuration Hub'] : ['Dashboard', 'Warehouse Configuration Hub', config.warehouseName]}
      onBreadcrumbClick={(index) => {
        if (index === 1) {
          setWorkspaceMode('hub');
          setWizardState(null);
          setShowWarehouseSetup(false);
        }
      }}
      breadcrumbActions={
        <button
          onClick={() => setShowWarehouseSetup(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          + New Warehouse
        </button>
      }
      disableTemplatePadding
    >
      <div className={`h-full flex flex-col ${wizardState || showWarehouseSetup ? 'p-0' : 'p-4 sm:p-5'}`}>
        {wizardState ? (
          <SetupWizard
            state={wizardState}
            onChange={setWizardState}
            onClose={() => setWizardState(null)}
            warehouseName={config.warehouseName}
          />
        ) : showWarehouseSetup ? (
          <WarehouseSetupScreen
            onCancel={() => setShowWarehouseSetup(false)}
            onContinue={(method, templateId) => {
              setShowWarehouseSetup(false);
              openWizard(method, 1);
            }}
            warehouseName={config.warehouseName}
          />
        ) : workspaceMode === 'hub' ? (
          <WarehouseHubScreen
            warehouses={ALL_WAREHOUSE_CONFIGS}
            onSelectWarehouse={(id) => {
              setSelectedWarehouseId(id);
              setWorkspaceMode('detail');
            }}
            onNewWarehouse={() => setShowWarehouseSetup(true)}
            onCompare={(selected) => {
              setCompareWarehouses(selected);
              setShowCompareModal(true);
            }}
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
            onViewAllWarehouses={() => setWorkspaceMode('hub')}
          />
        )}

        {/* Side-by-Side Comparison Modal */}
        <WarehouseCompareModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          warehouses={compareWarehouses}
          onOpenConfig={(id) => {
            setSelectedWarehouseId(id);
            setWorkspaceMode('detail');
          }}
        />

        {/* Protection Modal for Published Models */}
        <PublishedProtectionModal
          isOpen={showProtectionModal}
          modelName={config.activeHierarchyModel?.name ?? 'Published Hierarchy'}
          hasExistingDraft={true}
          onCreateDraft={handleCreateDraft}
          onContinueDraft={handleContinueDraft}
          onCancel={() => setShowProtectionModal(false)}
        />

        {/* Edit Published Zone Modal */}
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

        {/* Add Zone Modal */}
        {showAddZoneModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#172B4D]">Add New Zone</h3>
                <button onClick={() => setShowAddZoneModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddZoneSubmit} className="space-y-4 text-xs">
                <div className="bg-green-50/70 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-900">
                  <span className="font-semibold">✓ Zone automatically inherits active Warehouse Hierarchy</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hierarchy Level (Fixed)</label>
                  <input
                    type="text"
                    readOnly
                    value="Zone"
                    className="w-full p-2.5 border border-gray-200 bg-gray-100 rounded-lg font-mono font-bold text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Business Label <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inbound, Cold Storage, Overflow"
                    value={newZoneName}
                    onChange={e => setNewZoneName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] font-bold text-[#172B4D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Zone Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZG"
                    value={newZoneCode}
                    onChange={e => setNewZoneCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Picking Strategy</label>
                  <select
                    value={newZoneStrategy}
                    onChange={e => setNewZoneStrategy(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1F3D]"
                  >
                    <option value="FEFO">FEFO (Expiry First)</option>
                    <option value="FIFO">FIFO (First In First Out)</option>
                    <option value="LIFO">LIFO (Last In First Out)</option>
                  </select>
                </div>

                {/* Displayed Name Preview */}
                <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Displayed Name Preview:</span>
                  <span className="font-bold text-[#172B4D] font-mono">
                    Zone – {newZoneName || 'Label'}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddZoneModal(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-xs"
                  >
                    Create Zone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blocked Delete Modal */}
        {showBlockedDeleteModal && targetZoneForDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-red-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Cannot Delete Zone</h3>
                  <p className="text-xs text-red-700 font-semibold mt-0.5">
                    {targetZoneForDelete.name} ({targetZoneForDelete.code}) contains active dependencies.
                  </p>
                </div>
              </div>
              <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-4 text-xs text-red-900 space-y-2">
                <p className="font-semibold text-red-950">This Zone cannot be deleted because it contains:</p>
                <ul className="space-y-1 font-mono text-[11px] text-red-900 pl-2">
                  <li>• 1,248 Storage Locations</li>
                  <li>• 312 Active Inventory Items</li>
                  <li>• 2 Putaway Rules</li>
                  <li>• 1 Picking Strategy</li>
                </ul>
                <p className="text-[11px] text-red-800/90 pt-1 italic">
                  Before deleting this Zone, remove or reassign all dependent data.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    toggleZoneStatus(targetZoneForDelete.id);
                    setShowBlockedDeleteModal(false);
                    setTargetZoneForDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Deactivate Zone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockedDeleteModal(false);
                    setTargetZoneForDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Delete Confirmation Modal */}
        {showStandardDeleteModal && targetZoneForDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">Delete Zone?</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    <strong>{targetZoneForDelete.name}</strong> contains no storage locations or inventory. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowStandardDeleteModal(false);
                    setTargetZoneForDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => performDeleteZone(targetZoneForDelete.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
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
