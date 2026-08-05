import type {
  HierarchyModel, HierarchyLevel, WarehouseConfig, WarehouseTemplate,
  ZoneConfig, NamingRules, GenerationConfig
} from './types';

// ============================================================
// Hierarchy Models
// ============================================================

export const STANDARD_6_LEVEL: HierarchyModel = {
  id: 'hm-standard-6',
  name: 'Standard 6-Level',
  description: 'Classic warehouse hierarchy: Zone → Aisle → Rack → Shelf → Bin',
  levels: [
    { id: 'l1', name: 'Zone', pluralName: 'Zones', codePrefix: 'Z', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['l2'] },
    { id: 'l2', name: 'Aisle', pluralName: 'Aisles', codePrefix: 'A', depth: 1, supportsCapacity: false, supportsDimensions: true, supportsWeight: false, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['l3'] },
    { id: 'l3', name: 'Rack', pluralName: 'Racks', codePrefix: 'R', depth: 2, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['l4'] },
    { id: 'l4', name: 'Shelf', pluralName: 'Shelves', codePrefix: 'S', depth: 3, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['l5'] },
    { id: 'l5', name: 'Bin', pluralName: 'Bins', codePrefix: 'B', depth: 4, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: true, allowedChildLevelIds: [] },
  ],
  isDefault: true
};

export const COMPACT_3_LEVEL: HierarchyModel = {
  id: 'hm-compact-3',
  name: 'Compact 3-Level',
  description: 'Simplified hierarchy: Zone → Rack → Bin',
  levels: [
    { id: 'c1', name: 'Zone', pluralName: 'Zones', codePrefix: 'Z', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['c2'] },
    { id: 'c2', name: 'Rack', pluralName: 'Racks', codePrefix: 'R', depth: 1, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['c3'] },
    { id: 'c3', name: 'Bin', pluralName: 'Bins', codePrefix: 'B', depth: 2, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: true, allowedChildLevelIds: [] },
  ]
};

export const COLD_CHAIN: HierarchyModel = {
  id: 'hm-cold-chain',
  name: 'Cold Chain',
  description: 'Temperature-controlled: Cold Room → Freezer → Tray → Bin',
  levels: [
    { id: 'cc1', name: 'Cold Room', pluralName: 'Cold Rooms', codePrefix: 'CR', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: false, supportsBarcode: true, supportsTemperature: true, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['cc2'] },
    { id: 'cc2', name: 'Freezer', pluralName: 'Freezers', codePrefix: 'FZ', depth: 1, supportsCapacity: true, supportsDimensions: true, supportsWeight: false, supportsBarcode: true, supportsTemperature: true, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['cc3'] },
    { id: 'cc3', name: 'Tray', pluralName: 'Trays', codePrefix: 'T', depth: 2, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: true, supportsSerial: false, supportsBatch: true, allowedChildLevelIds: ['cc4'] },
    { id: 'cc4', name: 'Bin', pluralName: 'Bins', codePrefix: 'B', depth: 3, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: true, supportsSerial: true, supportsBatch: true, allowedChildLevelIds: [] },
  ]
};

// ============================================================
// Default Naming Rules
// ============================================================

export const DEFAULT_NAMING_RULES: NamingRules = {
  prefix: 'WH',
  separator: '-',
  padding: 3,
  sequence: 'numeric',
  barcodeFormat: 'CODE128',
  autoGenerateBarcode: true,
  autoGenerateQR: false
};

// ============================================================
// Default Generation Config
// ============================================================

const DEFAULT_GENERATION: GenerationConfig = {
  levels: [
    { levelId: 'l2', levelName: 'Aisles', count: 10 },
    { levelId: 'l3', levelName: 'Racks', count: 20 },
    { levelId: 'l4', levelName: 'Shelves', count: 6 },
    { levelId: 'l5', levelName: 'Bins', count: 24 },
  ]
};

// ============================================================
// Mock Warehouse Configs
// ============================================================

export const MOCK_WAREHOUSE_CONFIGS: Record<string, WarehouseConfig> = {
  'wh-1': {
    warehouseId: 'wh-1',
    warehouseName: 'Mumbai Central Warehouse',
    location: 'Mumbai, MH',
    configStatus: 'published',
    publishStatus: 'up-to-date',
    lastPublishedAt: '2026-08-03T10:00:00Z',
    activeHierarchyModel: STANDARD_6_LEVEL,
    namingRules: DEFAULT_NAMING_RULES,
    zones: [
      {
        id: 'zone-a', name: 'Zone A — General Storage', code: 'ZA', status: 'active',
        hierarchyMode: 'default', pickingStrategy: 'FIFO',
        generation: DEFAULT_GENERATION,
        dimensions: { width: 50, depth: 80, height: 12, unit: 'meters' }
      },
      {
        id: 'zone-b', name: 'Zone B — High-Value', code: 'ZB', status: 'active',
        hierarchyMode: 'custom',
        customHierarchyModel: COMPACT_3_LEVEL,
        pickingStrategy: 'FEFO',
        generation: { levels: [{ levelId: 'c2', levelName: 'Racks', count: 15 }, { levelId: 'c3', levelName: 'Bins', count: 30 }] },
        dimensions: { width: 20, depth: 30, height: 10, unit: 'meters' }
      },
      {
        id: 'zone-c', name: 'Zone C — Cold Chain', code: 'ZC', status: 'active',
        hierarchyMode: 'custom',
        customHierarchyModel: COLD_CHAIN,
        pickingStrategy: 'FEFO',
        generation: { levels: [{ levelId: 'cc2', levelName: 'Freezers', count: 4 }, { levelId: 'cc3', levelName: 'Trays', count: 8 }, { levelId: 'cc4', levelName: 'Bins', count: 12 }] },
        dimensions: { width: 15, depth: 20, height: 6, unit: 'meters' }
      },
    ],
    kpis: {
      zoneCount: 3,
      storageLocations: 14400,
      capacity: 24000,
      capacityUnit: 'bins',
      utilization: 62,
      activeHierarchyName: 'Standard 6-Level',
      lastPublished: '2 days ago'
    }
  },
  'wh-2': {
    warehouseId: 'wh-2',
    warehouseName: 'Delhi Distribution Hub',
    location: 'Delhi, DL',
    configStatus: 'draft',
    publishStatus: 'changes-pending',
    namingRules: DEFAULT_NAMING_RULES,
    zones: [
      {
        id: 'zone-d1', name: 'Zone 1 — Inbound', code: 'IB', status: 'active',
        hierarchyMode: 'default', pickingStrategy: 'FIFO',
        generation: { levels: [{ levelId: 'l2', levelName: 'Aisles', count: 5 }, { levelId: 'l3', levelName: 'Racks', count: 10 }, { levelId: 'l5', levelName: 'Bins', count: 20 }] },
      }
    ],
    kpis: {
      zoneCount: 1,
      storageLocations: 1000,
      capacity: 2000,
      capacityUnit: 'bins',
      utilization: 34,
      activeHierarchyName: 'Standard 6-Level',
      lastPublished: 'Never'
    }
  },
  'wh-3': {
    warehouseId: 'wh-3',
    warehouseName: 'Bangalore Tech Parts Store',
    location: 'Bangalore, KA',
    configStatus: 'not-configured',
    publishStatus: 'changes-pending',
    namingRules: DEFAULT_NAMING_RULES,
    zones: [],
    kpis: {
      zoneCount: 0,
      storageLocations: 0,
      capacity: 0,
      capacityUnit: 'bins',
      utilization: 0,
      activeHierarchyName: '—',
      lastPublished: 'Never'
    }
  }
};

// ============================================================
// Mock Templates
// ============================================================

export const MOCK_TEMPLATES: WarehouseTemplate[] = [
  {
    id: 'tpl-1',
    name: 'flowOne Standard',
    description: 'Recommended for general merchandise warehouses. Includes 6-level hierarchy, FIFO picking, and auto-barcode generation.',
    status: 'published',
    createdAt: '2026-01-15',
    updatedAt: '2026-07-01',
    warehouseCount: 12,
    hierarchyModel: STANDARD_6_LEVEL,
    namingRules: DEFAULT_NAMING_RULES,
    tags: ['recommended', 'general', '6-level']
  },
  {
    id: 'tpl-2',
    name: 'flowOne Cold Chain',
    description: 'Designed for temperature-controlled storage. Supports FEFO picking and temperature tracking at each level.',
    status: 'published',
    createdAt: '2026-02-20',
    updatedAt: '2026-06-15',
    warehouseCount: 4,
    hierarchyModel: COLD_CHAIN,
    namingRules: { ...DEFAULT_NAMING_RULES, prefix: 'CC', autoGenerateBarcode: true, autoGenerateQR: true },
    tags: ['cold-chain', 'temperature', 'FEFO']
  },
  {
    id: 'tpl-3',
    name: 'My Compact Setup',
    description: 'Internal 3-level setup saved from Bangalore pilot warehouse.',
    status: 'draft',
    createdAt: '2026-07-20',
    updatedAt: '2026-08-01',
    warehouseCount: 0,
    hierarchyModel: COMPACT_3_LEVEL,
    namingRules: DEFAULT_NAMING_RULES,
    tags: ['compact', 'pilot', 'draft']
  }
];
