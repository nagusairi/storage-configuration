import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileCheck, 
  Edit, 
  Package, 
  FileText, 
  DollarSign, 
  Warehouse, 
  Image as ImageIcon, 
  Users,
  Tag,
  BarChart3,
  MapPin
} from 'lucide-react';

interface ReviewMetrics {
  documentationCompleteness: number;
  complianceSpeed: 'Low' | 'Medium' | 'High';
  riskFlags: number;
  predictiveConfidence: number;
}

interface ReviewSectionData {
  title: string;
  fields: { label: string; value: string | number | boolean }[];
  onEdit: () => void;
}

interface ReviewSummaryPanelProps {
  // Legacy props support (for existing implementations)
  metrics?: ReviewMetrics;
  sections?: ReviewSectionData[];
  
  // New props support (for AddItemStepper)
  itemType?: string;
  itemName?: string;
  brandName?: string;
  categoryName?: string;
  measuringUnit?: string;
  description?: string;
  skuCode?: string;
  gstType?: string;
  hsnSacCode?: string;
  gstRate?: string;
  reorderLevel?: number | null;
  lowStockAlertLevel?: number | null;
  valuationMethod?: 'fifo' | 'weighted-average';
  hasOpeningStock?: boolean;
  warehouseStocks?: Array<{
    id: number | string;
    warehouseName: string;
    warehouseCode: string;
    openingStock: number;
  }>;
  barcodes?: string[];
  qrCodes?: string[];
  defaultBinLocation?: string;
  images?: Array<{ file: File; preview: string }>;
  vendors?: Array<{
    id: number;
    vendorName: string;
    vendorCode: string;
    contactPerson: string;
    email: string;
    phone: string;
    purchasePrice: number;
    currency: string;
    leadTime: number;
    leadTimeUnit: 'days' | 'weeks';
    minimumOrderQuantity: number;
    preferredVendor: boolean;
    notes: string;
  }>;
}

export function ReviewSummaryPanel({ 
  metrics, 
  sections,
  itemType,
  itemName,
  brandName,
  categoryName,
  measuringUnit,
  description,
  skuCode,
  gstType,
  hsnSacCode,
  gstRate,
  reorderLevel,
  lowStockAlertLevel,
  valuationMethod,
  hasOpeningStock,
  warehouseStocks,
  barcodes = [],
  qrCodes = [],
  defaultBinLocation,
  images,
  vendors
}: ReviewSummaryPanelProps) {
  // If legacy props are provided, use them
  if (metrics && sections) {
    return (
      <div className="space-y-6">
        {/* AI-Powered Review Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base text-purple-900">AI-Powered Review Summary</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Documentation Completeness */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Documentation Completeness</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-gray-900">{metrics.documentationCompleteness}%</span>
                <span className="text-xs text-green-600">Complete</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${metrics.documentationCompleteness}%` }}
                />
              </div>
            </div>

            {/* Compliance Speed */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Compliance Speed</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl ${
                  metrics.complianceSpeed === 'High' ? 'text-green-600' :
                  metrics.complianceSpeed === 'Medium' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {metrics.complianceSpeed}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Processing efficiency</p>
            </div>

            {/* Risk Flags */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">Risk Flags</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl ${
                  metrics.riskFlags === 0 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {metrics.riskFlags}
                </span>
                <span className="text-xs text-gray-500">
                  {metrics.riskFlags === 0 ? 'None detected' : 'Flagged'}
                </span>
              </div>
            </div>

            {/* Predictive Confidence */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Predictive Confidence</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-purple-600">{metrics.predictiveConfidence}%</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${metrics.predictiveConfidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Reviews */}
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm text-gray-900">{section.title}</h3>
              <button
                onClick={section.onEdit}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#5C1F3D] hover:bg-purple-50 rounded transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Section Fields */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <dt className="text-xs text-gray-500 mb-1">{field.label}</dt>
                    <dd className="text-sm text-gray-900">
                      {typeof field.value === 'boolean' 
                        ? (field.value ? 'Yes' : 'No')
                        : field.value || '—'}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // New implementation for AddItemStepper - Modern Review Layout
  const safeVendors = vendors || [];
  const safeImages = images || [];
  const safeWarehouseStocks = warehouseStocks || [];
  
  // Calculate total opening stock
  const totalOpeningStock = safeWarehouseStocks.reduce((sum, wh) => sum + wh.openingStock, 0);
  
  return (
    <div className="flex gap-6 h-full">
      {/* Main Content (70%) */}
      <div className="flex-1 space-y-4">
        {/* Header Card - Item Overview */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package className="w-6 h-6 text-[#5C1F3D]" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900">{itemName || 'Untitled Item'}</h2>
                  <p className="text-sm text-gray-600">{skuCode || 'No SKU'}</p>
                </div>
              </div>
              {description && (
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">{description}</p>
              )}
            </div>
            <span className={`px-3 py-1.5 text-xs rounded-lg border ${
              itemType === 'goods' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {itemType === 'goods' ? 'Goods' : 'Service'}
            </span>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm text-gray-900">Basic Information</h3>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">Item Name</dt>
                <dd className="text-sm text-gray-900">{itemName || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">Brand Name</dt>
                <dd className="text-sm text-gray-900">{brandName || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">Category</dt>
                <dd className="text-sm text-gray-900">{categoryName || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">Measuring Unit</dt>
                <dd className="text-sm text-gray-900">{measuringUnit || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">SKU Code</dt>
                <dd className="text-sm text-gray-900 font-mono">{skuCode || '—'}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* GST Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm text-gray-900">GST Details</h3>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <dt className="text-xs text-gray-500 mb-1.5">GST Applicability</dt>
                <dd className="text-sm">
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                    gstType === 'yes' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                    {gstType === 'yes' ? 'Applicable' : 'Not Applicable'}
                  </span>
                </dd>
              </div>
              {gstType === 'yes' && (
                <>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1.5">HSN/SAC Code</dt>
                    <dd className="text-sm text-gray-900 font-mono">{hsnSacCode || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1.5">GST Rate</dt>
                    <dd className="text-sm">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {gstRate ? `${gstRate}%` : '—'}
                      </span>
                    </dd>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Inventory & Valuation Card (Goods only) */}
        {itemType === 'goods' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-900">Inventory & Valuation</h3>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-6 mb-5">
                <div>
                  <dt className="text-xs text-gray-500 mb-1.5">Re-order Level</dt>
                  <dd className="text-sm text-gray-900">{reorderLevel !== null && reorderLevel !== undefined ? reorderLevel : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 mb-1.5">Low Stock Alert Level</dt>
                  <dd className="text-sm text-gray-900">{lowStockAlertLevel !== null && lowStockAlertLevel !== undefined ? lowStockAlertLevel : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 mb-1.5">Valuation Method</dt>
                  <dd className="text-sm">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {valuationMethod === 'fifo' ? 'FIFO' : 'Weighted Average'}
                    </span>
                  </dd>
                </div>
              </div>

              {/* Opening Stock Section */}
              {hasOpeningStock && safeWarehouseStocks.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm text-gray-700">Opening Stock</h4>
                    <span className="text-sm text-gray-900">
                      Total: <span className="font-medium">{totalOpeningStock} units</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    {safeWarehouseStocks.map((wh) => (
                      <div key={wh.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Warehouse className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-900">{wh.warehouseName}</p>
                            <p className="text-xs text-gray-500">{wh.warehouseCode}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{wh.openingStock} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Details Card (Goods only) */}
        {itemType === 'goods' && (barcodes.length > 0 || qrCodes.length > 0 || defaultBinLocation) && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-900">Additional Details</h3>
            </div>
            <div className="px-6 py-5 space-y-6">
              {/* Barcodes */}
              {barcodes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm text-gray-700">Barcodes</h4>
                    <span className="ml-auto px-2 py-0.5 text-xs rounded bg-gray-50 text-gray-700 border border-gray-200">
                      {barcodes.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {barcodes.map((barcode, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-900 font-mono">{barcode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Codes */}
              {qrCodes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm text-gray-700">QR Codes</h4>
                    <span className="ml-auto px-2 py-0.5 text-xs rounded bg-gray-50 text-gray-700 border border-gray-200">
                      {qrCodes.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {qrCodes.map((qrCode, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-900 font-mono">{qrCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Bin Location */}
              {defaultBinLocation && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm text-gray-700">Default Bin Location</h4>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">{defaultBinLocation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Images Card (Goods only) */}
        {itemType === 'goods' && safeImages.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-900">Product Images</h3>
              <span className="ml-auto text-xs text-gray-500">{safeImages.length} {safeImages.length === 1 ? 'image' : 'images'}</span>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-4 gap-3">
                {safeImages.map((img, index) => (
                  <div key={index} className="aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vendor Information Card */}
        {safeVendors.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-900">Vendor Information</h3>
              <span className="ml-auto text-xs text-gray-500">{safeVendors.length} {safeVendors.length === 1 ? 'vendor' : 'vendors'}</span>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-3">
                {safeVendors.map((vendor) => (
                  <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-gray-900">{vendor.vendorName}</h4>
                          {vendor.preferredVendor && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
                              Preferred
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{vendor.vendorCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 font-medium">{vendor.currency} {vendor.purchasePrice.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">Purchase Price</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-100">
                      <div>
                        <dt className="text-xs text-gray-500 mb-1">Contact Person</dt>
                        <dd className="text-sm text-gray-900">{vendor.contactPerson || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 mb-1">Email</dt>
                        <dd className="text-sm text-gray-900 truncate">{vendor.email || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 mb-1">Lead Time</dt>
                        <dd className="text-sm text-gray-900">{vendor.leadTime} {vendor.leadTimeUnit}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 mb-1">Min Order Qty</dt>
                        <dd className="text-sm text-gray-900">{vendor.minimumOrderQuantity}</dd>
                      </div>
                    </div>
                    {vendor.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <dt className="text-xs text-gray-500 mb-1">Notes</dt>
                        <dd className="text-sm text-gray-700">{vendor.notes}</dd>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Summary Stats (30%) */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Completion Status Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm text-gray-900 mb-4">Completion Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Basic Info</span>
              </div>
              <span className="text-xs text-green-600">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">GST Details</span>
              </div>
              <span className="text-xs text-green-600">Complete</span>
            </div>
            {itemType === 'goods' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">Inventory</span>
                  </div>
                  <span className="text-xs text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${safeImages.length > 0 ? 'text-green-600' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-600">Product Images</span>
                  </div>
                  <span className={`text-xs ${safeImages.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {safeImages.length > 0 ? 'Complete' : 'Optional'}
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${safeVendors.length > 0 ? 'text-green-600' : 'text-gray-300'}`} />
                <span className="text-xs text-gray-600">Vendors</span>
              </div>
              <span className={`text-xs ${safeVendors.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {safeVendors.length > 0 ? 'Complete' : 'Optional'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5">
          <h3 className="text-sm text-gray-900 mb-4">Quick Summary</h3>
          <div className="space-y-4">
            <div>
              <dt className="text-xs text-gray-600 mb-1">Item Type</dt>
              <dd className="text-sm text-gray-900">{itemType === 'goods' ? 'Goods (Physical Product)' : 'Service'}</dd>
            </div>
            {itemType === 'goods' && hasOpeningStock && (
              <div>
                <dt className="text-xs text-gray-600 mb-1">Total Opening Stock</dt>
                <dd className="text-sm text-gray-900 font-medium">{totalOpeningStock} units</dd>
              </div>
            )}
            {safeVendors.length > 0 && (
              <div>
                <dt className="text-xs text-gray-600 mb-1">Vendors Attached</dt>
                <dd className="text-sm text-gray-900 font-medium">{safeVendors.length}</dd>
              </div>
            )}
            {gstType === 'yes' && (
              <div>
                <dt className="text-xs text-gray-600 mb-1">GST Rate</dt>
                <dd className="text-sm text-gray-900 font-medium">{gstRate}%</dd>
              </div>
            )}
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Review Carefully</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Please review all information before submitting. You can edit the item details later if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
