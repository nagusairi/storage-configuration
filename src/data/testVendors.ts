// Mock vendor data types
export interface Vendor {
  id: number;
  vendorName: string;
  vendorCode: string;
  email: string;
  phone: string;
  gstin?: string;
  address?: string;
  status: 'Active' | 'Inactive';
  paymentTerms?: string;
  creditLimit?: number;
}

// Empty array - ready for future implementation
export const testVendors: Vendor[] = [];
