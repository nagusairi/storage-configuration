// Mock data types for inventory items
export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  price: number;
  unit: string;
  warehouse: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Mock data types for bundles
export interface Bundle {
  id: number;
  bundleCode: string;
  name: string;
  items: number;
  totalValue: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

// Mock data types for stock movements
export interface StockMovement {
  id: number;
  date: string;
  type: 'Transfer' | 'Adjustment' | 'Receipt' | 'Issue';
  item: string;
  quantity: number;
  from?: string;
  to?: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

// Empty arrays - ready for future implementation
export const mockInventoryItems: InventoryItem[] = [];
export const mockBundles: Bundle[] = [];
export const mockStockMovements: StockMovement[] = [];
