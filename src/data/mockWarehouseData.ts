// Mock data types for warehouse information
export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  status: 'Active' | 'Inactive';
  gstin?: string;
  manager?: string;
}

// Mock data types for warehouse zones
export interface WarehouseZone {
  id: number;
  warehouseId: number;
  zoneName: string;
  aisles: number;
  bins: number;
  capacity: number;
  utilization: number;
}

// Mock data types for bin locations
export interface BinLocation {
  id: number;
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
  capacity: number;
  occupied: number;
  status: 'Available' | 'Full' | 'Reserved';
}

// Empty arrays - ready for future implementation
export const mockWarehouses: Warehouse[] = [];
export const mockWarehouseZones: WarehouseZone[] = [];
export const mockBinLocations: BinLocation[] = [];
