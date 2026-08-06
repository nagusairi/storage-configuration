import type { WizardState, WizardStep, WarehouseConfig } from '../types';
import { ValidationReadinessCenter } from '../ValidationReadinessCenter';

interface Props {
  state: WizardState;
  onChange: (s: WizardState) => void;
  onGoToStep: (step: WizardStep) => void;
}

export function Step7Validation({ state, onChange, onGoToStep }: Props) {
  const mockConfig: WarehouseConfig = {
    warehouseId: 'wh-1',
    warehouseName: state.zones[0]?.name ? `${state.zones[0].name.split(' ')[0]} Warehouse` : 'Active Warehouse',
    location: 'Central Storage',
    configStatus: state.isDirty ? 'draft' : 'published',
    publishStatus: state.isDirty ? 'changes-pending' : 'up-to-date',
    activeHierarchyModel: state.hierarchyModel,
    zones: state.zones,
    namingRules: state.namingRules,
    kpis: {
      zoneCount: state.zones.length,
      storageLocations: 14400,
      capacity: 24000,
      capacityUnit: 'bins',
      utilization: 62,
      activeHierarchyName: state.hierarchyModel.name,
      lastPublished: 'Just now',
    }
  };

  return (
    <ValidationReadinessCenter
      config={mockConfig}
      onGoToStep={onGoToStep}
      onSaveDraft={() => onChange({ ...state, isDirty: false })}
      onPublish={() => {
        onChange({ ...state, isDirty: false });
        if (state.currentStep < 7) onGoToStep(8);
      }}
    />
  );
}
