import type { HierarchyModel } from './types';
import { STANDARD_6_LEVEL, COMPACT_3_LEVEL, COLD_CHAIN } from './mockData';

export interface HierarchyModelCatalogEntry {
  id: string;
  name: string;
  category: 'flowone' | 'organization' | 'draft';
  categoryLabel: string;
  description: string;
  sourceBadge: string;
  updatedAt: string;
  levelCount: number;
  tags: string[];
  model: HierarchyModel;
}

export const HIERARCHY_MODELS_CATALOG: HierarchyModelCatalogEntry[] = [
  // ── flowOne Hierarchy Models ──────────────────────────────────────────────
  {
    id: 'hm-flowone-standard',
    name: 'Standard Distribution Center',
    category: 'flowone',
    categoryLabel: 'flowOne Hierarchy Models',
    description: 'Classic 6-level warehouse structure: Zone → Aisle → Rack → Shelf → Bin.',
    sourceBadge: 'flowOne Model',
    updatedAt: 'Updated 2 days ago',
    levelCount: 5,
    tags: ['Standard', 'High-Density', 'Pallet & Bin'],
    model: STANDARD_6_LEVEL,
  },
  {
    id: 'hm-flowone-cold-storage',
    name: 'Cold Storage & Frozen',
    category: 'flowone',
    categoryLabel: 'flowOne Hierarchy Models',
    description: 'Temperature-controlled hierarchy: Cold Room → Freezer → Tray → Position.',
    sourceBadge: 'flowOne Model',
    updatedAt: 'Updated 1 week ago',
    levelCount: 4,
    tags: ['Cold Chain', 'Pharma', 'Perishables'],
    model: COLD_CHAIN,
  },
  {
    id: 'hm-flowone-compact',
    name: 'Compact 3-Level Store',
    category: 'flowone',
    categoryLabel: 'flowOne Hierarchy Models',
    description: 'Streamlined hierarchy: Zone → Rack → Bin for small fulfillment centers.',
    sourceBadge: 'flowOne Model',
    updatedAt: 'Updated 3 weeks ago',
    levelCount: 3,
    tags: ['Compact', 'Retail', 'Micro-Fulfillment'],
    model: COMPACT_3_LEVEL,
  },
  {
    id: 'hm-flowone-retail',
    name: 'Retail Backroom Storage',
    category: 'flowone',
    categoryLabel: 'flowOne Hierarchy Models',
    description: 'Fast-pick retail storage model: Section → Fixture → Shelf → Bin.',
    sourceBadge: 'flowOne Model',
    updatedAt: 'Updated 1 month ago',
    levelCount: 4,
    tags: ['Retail', 'Fast-Pick'],
    model: {
      id: 'hm-retail-4',
      name: 'Retail Backroom Storage',
      description: 'Section → Fixture → Shelf → Bin',
      levels: [
        { id: 'r1', name: 'Section', pluralName: 'Sections', codePrefix: 'SEC', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: false, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['r2'] },
        { id: 'r2', name: 'Fixture', pluralName: 'Fixtures', codePrefix: 'FIX', depth: 1, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['r3'] },
        { id: 'r3', name: 'Shelf', pluralName: 'Shelves', codePrefix: 'SH', depth: 2, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: false, allowedChildLevelIds: ['r4'] },
        { id: 'r4', name: 'Bin', pluralName: 'Bins', codePrefix: 'B', depth: 3, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: true, allowedChildLevelIds: [] },
      ]
    }
  },

  // ── Organization Hierarchy Models ─────────────────────────────────────────
  {
    id: 'hm-org-high-value',
    name: 'High Value Vault Storage',
    category: 'organization',
    categoryLabel: 'Organization Hierarchy Models',
    description: 'Secure, serial-tracked vault structure: Vault → Safe → Locker → Slot.',
    sourceBadge: 'Organization Model',
    updatedAt: 'Updated 5 days ago',
    levelCount: 4,
    tags: ['Secured', 'High Value', 'Serial Tracked'],
    model: {
      id: 'hm-high-value',
      name: 'High Value Vault Storage',
      description: 'Vault → Safe → Locker → Slot',
      levels: [
        { id: 'hv1', name: 'Vault', pluralName: 'Vaults', codePrefix: 'VTL', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: false, allowedChildLevelIds: ['hv2'] },
        { id: 'hv2', name: 'Safe', pluralName: 'Safes', codePrefix: 'SAF', depth: 1, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: false, allowedChildLevelIds: ['hv3'] },
        { id: 'hv3', name: 'Locker', pluralName: 'Lockers', codePrefix: 'LCK', depth: 2, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: false, allowedChildLevelIds: ['hv4'] },
        { id: 'hv4', name: 'Slot', pluralName: 'Slots', codePrefix: 'SLT', depth: 3, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: true, supportsBatch: true, allowedChildLevelIds: [] },
      ]
    }
  },
  {
    id: 'hm-org-bulk-pallet',
    name: 'Bulk Pallet Floor Storage',
    category: 'organization',
    categoryLabel: 'Organization Hierarchy Models',
    description: 'Floor-standing heavy storage: Bay → Pallet Position.',
    sourceBadge: 'Organization Model',
    updatedAt: 'Updated 2 weeks ago',
    levelCount: 2,
    tags: ['Bulk', 'Pallet', 'Heavy Duty'],
    model: {
      id: 'hm-bulk-pallet',
      name: 'Bulk Pallet Floor Storage',
      description: 'Bay → Pallet Position',
      levels: [
        { id: 'bp1', name: 'Bay', pluralName: 'Bays', codePrefix: 'BAY', depth: 0, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: true, allowedChildLevelIds: ['bp2'] },
        { id: 'bp2', name: 'Pallet Position', pluralName: 'Pallet Positions', codePrefix: 'POS', depth: 1, supportsCapacity: true, supportsDimensions: true, supportsWeight: true, supportsBarcode: true, supportsTemperature: false, supportsSerial: false, supportsBatch: true, allowedChildLevelIds: [] },
      ]
    }
  },

  // ── Draft Hierarchy Models ────────────────────────────────────────────────
  {
    id: 'hm-draft-pilot',
    name: 'Warehouse Pilot Layout',
    category: 'draft',
    categoryLabel: 'Draft Hierarchy Models',
    description: 'Experimental 5-level pilot model currently under review.',
    sourceBadge: 'Draft Model',
    updatedAt: 'Saved 1 hour ago',
    levelCount: 5,
    tags: ['Draft', 'Under Review'],
    model: STANDARD_6_LEVEL,
  }
];
