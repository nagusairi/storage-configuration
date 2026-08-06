// ============================================================
// Warehouse Setup — TypeScript Types
// ============================================================

export type ConfigStatus = 'not-configured' | 'draft' | 'published';
export type PublishStatus = 'up-to-date' | 'changes-pending';
export type PickingStrategy = 'FIFO' | 'FEFO' | 'LIFO';
export type TemplateStatus = 'published' | 'draft';
export type SetupMethod = 'flowone-template' | 'published-template' | 'draft-template' | 'scratch' | 'import';
export type ValidationSeverity = 'pass' | 'warning' | 'error';
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type EntryTab = 'overview' | 'hierarchy-model' | 'zone-layouts' | 'templates' | 'naming-rules' | 'validation' | 'activity';

// ---- Hierarchy ----

export interface HierarchyLevel {
  id: string;
  name: string;
  pluralName: string;
  codePrefix: string;
  depth: number;
  supportsCapacity: boolean;
  supportsDimensions: boolean;
  supportsWeight: boolean;
  supportsBarcode: boolean;
  supportsTemperature: boolean;
  supportsSerial: boolean;
  supportsBatch: boolean;
  allowedChildLevelIds: string[];
}

export interface HierarchyModel {
  id: string;
  name: string;
  description: string;
  levels: HierarchyLevel[];
  isDefault?: boolean;
}

// ---- Zones ----

export interface ZoneConfig {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive' | 'maintenance';
  hierarchyMode: 'default' | 'custom';
  customHierarchyModel?: HierarchyModel;
  generation: GenerationConfig;
  pickingStrategy: PickingStrategy;
  dimensions?: ZoneDimensions;
}

export interface ZoneDimensions {
  width: number;
  depth: number;
  height: number;
  unit: 'meters' | 'feet';
}

// ---- Generation ----

export interface GenerationConfig {
  levels: GenerationLevel[];
}

export interface GenerationLevel {
  levelId: string;
  levelName: string;
  count: number;
}

// ---- Naming Rules ----

export interface NamingRules {
  prefix: string;
  separator: string;
  padding: number;
  sequence: 'numeric' | 'alpha' | 'alphanumeric';
  barcodeFormat: string;
  autoGenerateBarcode: boolean;
  autoGenerateQR: boolean;
}

// ---- Validation ----

export interface ValidationResult {
  id: string;
  check: string;
  severity: ValidationSeverity;
  message: string;
  fixStep?: WizardStep;
}

// ---- Templates ----

export interface WarehouseTemplate {
  id: string;
  name: string;
  description: string;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
  warehouseCount: number;
  hierarchyModel: HierarchyModel;
  namingRules: NamingRules;
  tags: string[];
}

// ---- Warehouse Config (full) ----

export interface WarehouseConfig {
  warehouseId: string;
  warehouseName: string;
  location: string;
  configStatus: ConfigStatus;
  publishStatus: PublishStatus;
  lastPublishedAt?: string;
  activeHierarchyModel?: HierarchyModel;
  zones: ZoneConfig[];
  namingRules: NamingRules;
  kpis: WarehouseKPIs;
}

export interface WarehouseKPIs {
  zoneCount: number;
  storageLocations: number;
  capacity: number;
  capacityUnit: string;
  utilization: number;
  activeHierarchyName: string;
  lastPublished: string;
}

export type MigrationStrategy = 'automatic' | 'manual' | 'scheduled';
export type WizardMode = 'warehouse' | 'zone';

// ---- Wizard State ----

export interface WizardState {
  currentStep: WizardStep;
  returnToStep?: WizardStep;
  wizardMode?: WizardMode;
  targetZoneId?: string;
  migrationStrategy?: MigrationStrategy;
  selectedMethod?: SetupMethod;
  selectedTemplateId?: string;
  hierarchyModel: HierarchyModel;
  zones: ZoneConfig[];
  namingRules: NamingRules;
  validationResults: ValidationResult[];
  isDirty: boolean;
}
