// Mock data types for UOM transformations
export interface UOMTransformation {
  id: number;
  itemId: number;
  itemName: string;
  baseUnit: string;
  processingType: 'Processing' | 'Assembly' | 'Disassembly';
  outputItems: OutputItem[];
  status: 'Active' | 'Inactive';
  yieldType: 'Standard' | 'Variable';
}

export interface OutputItem {
  id: number;
  itemName: string;
  sku: string;
  baseUnit: string;
  quantity: number;
  yieldPercentage?: number;
}

// Mock data types for processing batches
export interface ProcessingBatch {
  id: number;
  batchNumber: string;
  transformationId: number;
  inputQuantity: number;
  outputQuantity: number;
  startDate: string;
  endDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  warehouse: string;
}

// Empty arrays - ready for future implementation
export const mockUOMTransformations: UOMTransformation[] = [];
export const mockProcessingBatches: ProcessingBatch[] = [];
