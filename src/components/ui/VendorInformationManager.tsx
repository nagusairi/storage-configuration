import React, { useState } from 'react';
import { Plus, Trash2, Search, AlertTriangle, Edit, Save, X, Check, Sparkles } from 'lucide-react';
import { StyledTextField } from './StyledTextField';
import { StyledSelect, MenuItem } from './StyledSelect';
import { CloseButton } from './CloseButton';

/**
 * VendorInformationManager Component
 * 
 * A complete, self-contained component for managing vendor associations with items.
 * 
 * Features:
 * - Vendor table with row selection
 * - Bulk actions (select all, remove selected)
 * - Add vendor modal with search and multi-select
 * - Vendor details side pane (view/edit modes)
 * - Remove confirmation dialog (single/bulk)
 * - Click-to-view vendor details
 * - Empty states and helpful messaging
 * 
 * @example
 * ```tsx
 * <VendorInformationManager
 *   vendors={attachedVendors}
 *   onVendorsChange={setAttachedVendors}
 *   availableVendors={allVendors}
 * />
 * ```
 */

export interface Vendor {
  id: number;
  vendorName: string;
  vendorCode: string;
  sku: string; // SKU code for the item from this vendor
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
}

export interface VendorInformationManagerProps {
  // Current attached vendors
  vendors: Vendor[];
  
  // Callback when vendors change
  onVendorsChange: (vendors: Vendor[]) => void;
  
  // Available vendors to choose from (vendor master)
  availableVendors: Vendor[];
  
  // Optional configuration
  showSectionHeader?: boolean;
  sectionTitle?: string;
  className?: string;
  disabled?: boolean;
}

export function VendorInformationManager({
  vendors,
  onVendorsChange,
  availableVendors,
  showSectionHeader = true,
  sectionTitle = 'Vendor Information',
  className = '',
  disabled = false
}: VendorInformationManagerProps) {
  // Modal/Pane visibility states
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showVendorPane, setShowVendorPane] = useState(false);
  
  // Vendor selection states
  const [selectedVendorIds, setSelectedVendorIds] = useState<number[]>([]); // For add modal
  const [selectedVendorRowIds, setSelectedVendorRowIds] = useState<number[]>([]); // For table rows
  
  // Vendor management states
  const [vendorToRemove, setVendorToRemove] = useState<Vendor | null>(null);
  const [vendorsToRemove, setVendorsToRemove] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editedVendor, setEditedVendor] = useState<Vendor | null>(null);
  const [vendorPaneMode, setVendorPaneMode] = useState<'view' | 'edit'>('view');
  
  // Search state
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');

  // SKU inline editing states
  const [editingSKU, setEditingSKU] = useState<number | null>(null);
  const [tempSKU, setTempSKU] = useState<string>('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestedSKUs, setAiSuggestedSKUs] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number | null>(null);

  // Ensure vendors and availableVendors are always arrays
  const safeVendors = vendors || [];
  const safeAvailableVendors = availableVendors || [];

  // Filter available vendors (exclude already attached)
  const filteredAvailableVendors = safeAvailableVendors
    .filter(v => v && !safeVendors.some(av => av && av.id === v.id))
    .filter(vendor => {
      if (!vendorSearchTerm || !vendor) return true;
      const searchLower = vendorSearchTerm.toLowerCase();
      return (
        (vendor.vendorName && vendor.vendorName.toLowerCase().includes(searchLower)) ||
        (vendor.vendorCode && vendor.vendorCode.toLowerCase().includes(searchLower)) ||
        (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchLower)) ||
        (vendor.email && vendor.email.toLowerCase().includes(searchLower))
      );
    });

  // Handle add vendors
  const handleAddVendors = () => {
    if (selectedVendorIds.length > 0) {
      const vendorsToAdd = safeAvailableVendors
        .filter(v => selectedVendorIds.includes(v.id))
        .map(v => ({ ...v, preferredVendor: false, sku: '' })); // Set SKU to empty string
      onVendorsChange([...safeVendors, ...vendorsToAdd]);
      setShowAddVendorModal(false);
      setVendorSearchTerm('');
      setSelectedVendorIds([]);
    }
  };

  // Handle remove vendor(s)
  const handleRemoveVendors = () => {
    if (vendorToRemove) {
      // Single vendor removal
      onVendorsChange(safeVendors.filter(v => v.id !== vendorToRemove.id));
    } else {
      // Bulk vendor removal
      const safeVendorsToRemove = vendorsToRemove || [];
      const idsToRemove = safeVendorsToRemove.map(v => v.id);
      onVendorsChange(safeVendors.filter(v => !idsToRemove.includes(v.id)));
      setSelectedVendorRowIds([]);
    }
    setShowRemoveConfirmation(false);
    setVendorToRemove(null);
    setVendorsToRemove([]);
  };

  // Handle save edited vendor
  const handleSaveVendor = () => {
    if (editedVendor) {
      onVendorsChange(safeVendors.map(v => 
        v.id === editedVendor.id ? editedVendor : v
      ));
      setSelectedVendor(editedVendor);
      setVendorPaneMode('view');
    }
  };

  // Handle remove from pane
  const handleRemoveFromPane = () => {
    if (selectedVendor && confirm('Are you sure you want to remove this vendor from this item?')) {
      onVendorsChange(safeVendors.filter(v => v.id !== selectedVendor.id));
      setShowVendorPane(false);
      setSelectedVendor(null);
      setEditedVendor(null);
    }
  };

  // Close vendor pane
  const closeVendorPane = () => {
    setShowVendorPane(false);
    setSelectedVendor(null);
    setEditedVendor(null);
    setVendorPaneMode('view');
  };

  // Open vendor details
  const openVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditedVendor({ ...vendor });
    setVendorPaneMode('view');
    setShowVendorPane(true);
  };

  // SKU Inline Editing Handlers
  const handleStartSKUEdit = (vendor: Vendor) => {
    if (disabled) return;
    setEditingSKU(vendor.id);
    setTempSKU(vendor.sku || '');
    setShowAISuggestions(false);
    setSelectedSuggestionIndex(null);
  };

  const handleSaveSKU = (vendorId: number) => {
    onVendorsChange(
      safeVendors.map(v =>
        v.id === vendorId ? { ...v, sku: tempSKU } : v
      )
    );
    setEditingSKU(null);
    setTempSKU('');
    setShowAISuggestions(false);
    setSelectedSuggestionIndex(null);
  };

  const handleCancelSKUEdit = () => {
    setEditingSKU(null);
    setTempSKU('');
    setShowAISuggestions(false);
    setSelectedSuggestionIndex(null);
  };

  const handleAcceptAISuggestion = (suggestion: string, index: number) => {
    setTempSKU(suggestion);
    setSelectedSuggestionIndex(index);
    setShowAISuggestions(false);
  };

  const generateAISKUSuggestions = (vendor: Vendor) => {
    const suggestions = [
      `${vendor.vendorCode}-ITEM-001`,
      `SKU-${vendor.vendorCode}-${Date.now().toString().slice(-4)}`,
      `${vendor.vendorName.substring(0, 3).toUpperCase()}-${vendor.vendorCode}`,
      `VEND-${vendor.id}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    ];
    setAiSuggestedSKUs(suggestions);
  };

  return (
    <div className={className}>
      {/* Section Header */}
      {showSectionHeader && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <h2 className="font-medium" style={{ fontSize: '15px' }}>{sectionTitle}</h2>
          <button
            type="button"
            onClick={() => setShowAddVendorModal(true)}
            disabled={disabled}
            className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Bulk Actions Toolbar */}
        {selectedVendorRowIds.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-purple-900 font-medium">
                {selectedVendorRowIds.length} vendor{selectedVendorRowIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedVendorRowIds([])}
                className="text-sm text-purple-700 hover:text-purple-900 underline"
              >
                Clear selection
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const vendorsToDelete = safeVendors.filter(v => selectedVendorRowIds.includes(v.id));
                setVendorsToRemove(vendorsToDelete);
                setVendorToRemove(null);
                setShowRemoveConfirmation(true);
              }}
              disabled={disabled}
              className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Selected</span>
            </button>
          </div>
        )}

        {/* Vendor Table */}
        <div className="border border-gray-200 rounded-lg overflow-visible">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  {safeVendors.length > 0 && (
                    <input
                      type="checkbox"
                      checked={safeVendors.length > 0 && selectedVendorRowIds.length === safeVendors.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVendorRowIds(safeVendors.map(v => v.id));
                        } else {
                          setSelectedVendorRowIds([]);
                        }
                      }}
                      disabled={disabled}
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Vendor Name</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ width: '280px' }}>Vendor SKU Code</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Contact Person</th>
                <th className="px-4 py-3 text-center text-xs text-gray-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeVendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No vendors attached to this item yet. Click "Add Vendor" to get started.
                  </td>
                </tr>
              ) : (
                safeVendors.map((vendor) => {
                  if (!vendor) return null; // Skip undefined/null vendors
                  const isSelected = selectedVendorRowIds.includes(vendor.id);
                  return (
                    <tr
                      key={vendor.id}
                      className={`border-b border-gray-100 transition-colors ${
                        isSelected ? 'bg-purple-50' : 'hover:bg-purple-50'
                      }`}
                    >
                      <td 
                        className="px-4 py-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVendorRowIds([...selectedVendorRowIds, vendor.id]);
                            } else {
                              setSelectedVendorRowIds(selectedVendorRowIds.filter(id => id !== vendor.id));
                            }
                          }}
                          disabled={disabled}
                          className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                        />
                      </td>
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => !disabled && openVendorDetails(vendor)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{vendor.vendorName}</span>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{vendor.vendorCode}</span>
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '280px' }}
                      >
                        {editingSKU === vendor.id ? (
                          <div className="flex items-center gap-2 relative">
                            <input
                              type="text"
                              value={tempSKU}
                              onChange={(e) => setTempSKU(e.target.value)}
                              onFocus={() => {
                                if (!tempSKU || tempSKU.trim() === '') {
                                  generateAISKUSuggestions(vendor);
                                  setShowAISuggestions(true);
                                }
                              }}
                              placeholder="Enter SKU code..."
                              className="flex-1 px-2 py-1 text-sm font-mono border border-[#5C1F3D] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] bg-white"
                              style={{ height: '28px' }}
                              autoFocus
                              disabled={disabled}
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveSKU(vendor.id);
                                }}
                                disabled={disabled}
                                className="p-1 rounded hover:bg-green-50 transition-colors disabled:opacity-40"
                                title="Save SKU"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelSKUEdit();
                                }}
                                disabled={disabled}
                                className="p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-40"
                                title="Cancel"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>

                            {/* AI Suggestions Panel */}
                            {showAISuggestions && aiSuggestedSKUs.length > 0 && (
                              <div 
                                className="absolute left-0 top-full mt-1 bg-white border border-purple-200 rounded-lg shadow-xl z-[300] w-[320px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-2 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs text-purple-900 font-medium">AI Smart Suggestions</span>
                                  </div>
                                  <p className="text-xs text-purple-700 mt-0.5">Select a suggested SKU code or type your own</p>
                                </div>
                                <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                                  {aiSuggestedSKUs.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAcceptAISuggestion(suggestion, index);
                                      }}
                                      className={`w-full px-3 py-2 text-left text-sm font-mono rounded-[3px] transition-colors ${
                                        selectedSuggestionIndex === index
                                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                          : 'hover:bg-purple-50 text-gray-700 border border-transparent'
                                      }`}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                                <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                  <span className="text-xs text-gray-500">Click to select</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartSKUEdit(vendor);
                            }}
                          >
                            {vendor.sku ? (
                              <span className="text-sm text-gray-900 font-mono">{vendor.sku}</span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Click to add SKU...</span>
                            )}
                            <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {vendor.contactPerson}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVendorToRemove(vendor);
                            setVendorsToRemove([]);
                            setShowRemoveConfirmation(true);
                          }}
                          disabled={disabled}
                          className="p-1.5 rounded hover:bg-red-50 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Remove vendor"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          {selectedVendorRowIds.length > 0 
            ? `Select vendors using checkboxes and click "Remove Selected" to delete multiple vendors at once.`
            : `Click on vendor name to view details. Click on SKU code to edit inline. Use checkboxes for bulk removal.`
          }
        </p>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={() => {
              setShowAddVendorModal(false);
              setVendorSearchTerm('');
              setSelectedVendorIds([]);
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl flex-shrink-0">
              <div>
                <h3 className="text-base font-medium">Add Vendor to Item</h3>
                <p className="text-xs text-gray-500 mt-1">Select vendors from your vendor master to attach to this item</p>
              </div>
              <CloseButton
                onClick={() => {
                  setShowAddVendorModal(false);
                  setVendorSearchTerm('');
                  setSelectedVendorIds([]);
                }}
              />
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={vendorSearchTerm}
                  onChange={(e) => setVendorSearchTerm(e.target.value)}
                  placeholder="Search vendors by name, code, contact person, or email..."
                  className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {filteredAvailableVendors.length > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filteredAvailableVendors.length > 0 && filteredAvailableVendors.every(v => selectedVendorIds.includes(v.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVendorIds(filteredAvailableVendors.map(v => v.id));
                          } else {
                            setSelectedVendorIds([]);
                          }
                        }}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                      <span className="text-sm text-gray-700">Select all</span>
                    </label>
                  )}
                  {selectedVendorIds.length > 0 && (
                    <span className="text-xs text-[#5C1F3D] font-medium">
                      ({selectedVendorIds.length} selected)
                    </span>
                  )}
                </div>
                {filteredAvailableVendors.length > 0 && vendorSearchTerm && (
                  <p className="text-xs text-gray-500">
                    Found {filteredAvailableVendors.length} vendor{filteredAvailableVendors.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Vendor List */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                {filteredAvailableVendors.length === 0 && vendorSearchTerm ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No vendors found matching "{vendorSearchTerm}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : filteredAvailableVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">All available vendors have been attached to this item.</p>
                  </div>
                ) : (
                  filteredAvailableVendors.map((vendor) => {
                    const isSelected = selectedVendorIds.includes(vendor.id);
                    
                    return (
                      <div
                        key={vendor.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedVendorIds(selectedVendorIds.filter(id => id !== vendor.id));
                          } else {
                            setSelectedVendorIds([...selectedVendorIds, vendor.id]);
                          }
                        }}
                        className={`w-full p-4 border rounded-lg transition-colors text-left cursor-pointer ${
                          isSelected 
                            ? 'border-[#5C1F3D] bg-purple-50' 
                            : 'border-gray-200 hover:border-[#5C1F3D] hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-900">{vendor.vendorName}</h4>
                              <span className="text-xs text-gray-500 font-mono">{vendor.vendorCode}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {vendor.contactPerson} • {vendor.email}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">
                                Price: <span className="text-gray-900 font-medium">{vendor.currency} {vendor.purchasePrice.toLocaleString()}</span>
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                Lead Time: <span className="text-gray-900 font-medium">{vendor.leadTime} {vendor.leadTimeUnit}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowAddVendorModal(false);
                  setVendorSearchTerm('');
                  setSelectedVendorIds([]);
                }}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVendors}
                disabled={selectedVendorIds.length === 0}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedVendorIds.length > 0 ? `${selectedVendorIds.length} ` : ''}Vendor{selectedVendorIds.length !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirmation && (vendorToRemove || (vendorsToRemove && vendorsToRemove.length > 0)) && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={() => {
              setShowRemoveConfirmation(false);
              setVendorToRemove(null);
              setVendorsToRemove([]);
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base font-medium">
                Remove {(vendorsToRemove && vendorsToRemove.length > 0) ? `${vendorsToRemove.length} Vendors` : 'Vendor'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {(vendorsToRemove && vendorsToRemove.length > 0) 
                  ? `Are you sure you want to remove ${vendorsToRemove.length} vendors from this item?`
                  : 'Are you sure you want to remove this vendor from the item?'
                }
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {vendorToRemove ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{vendorToRemove.vendorName}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{vendorToRemove.vendorCode}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        This will remove the vendor association from this item. The vendor will remain in your vendor master.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <p className="text-xs text-red-800">
                        These vendors will be removed from this item but will remain in your vendor master.
                      </p>
                    </div>
                  </div>
                  {(vendorsToRemove || []).map((vendor) => (
                    <div key={vendor.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900">{vendor.vendorName}</h4>
                            <span className="text-xs text-gray-500 font-mono">{vendor.vendorCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowRemoveConfirmation(false);
                  setVendorToRemove(null);
                  setVendorsToRemove([]);
                }}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveVendors}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove {(vendorsToRemove && vendorsToRemove.length > 0) ? `${vendorsToRemove.length} Vendors` : 'Vendor'}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Vendor Details Side Pane */}
      {showVendorPane && selectedVendor && editedVendor && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-[2px] z-[110] transition-opacity"
            onClick={closeVendorPane}
          />
          
          {/* Right Slide-over Pane */}
          <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl z-[120] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-base font-medium">
                  {vendorPaneMode === 'view' ? 'Vendor Details' : 'Edit Vendor'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {vendorPaneMode === 'view' 
                    ? 'View vendor information for this item' 
                    : 'Update vendor details and pricing'}
                </p>
              </div>
              <CloseButton
                onClick={closeVendorPane}
                variant="dark"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {vendorPaneMode === 'view' ? (
                /* View Mode */
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Vendor Name</label>
                        <p className="text-sm text-gray-900">{selectedVendor.vendorName}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Vendor Code</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedVendor.vendorCode}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">SKU Code</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedVendor.sku}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Contact Person</label>
                        <p className="text-sm text-gray-900">{selectedVendor.contactPerson}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                        <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Phone</label>
                        <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Terms */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Pricing & Terms</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Purchase Price</label>
                        <p className="text-sm text-gray-900">{selectedVendor.currency} {selectedVendor.purchasePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Lead Time</label>
                        <p className="text-sm text-gray-900">{selectedVendor.leadTime} {selectedVendor.leadTimeUnit}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Minimum Order Quantity</label>
                        <p className="text-sm text-gray-900">{selectedVendor.minimumOrderQuantity} units</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Preferred Vendor</label>
                        {selectedVendor.preferredVendor ? (
                          <span className="px-2 py-0.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded bg-gray-50 text-gray-700 border border-gray-200">
                            No
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Notes</h4>
                    <p className="text-sm text-gray-700">{selectedVendor.notes || 'No notes available'}</p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Basic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Vendor Name <span className="text-red-500">*</span></label>
                        <StyledTextField 
                          value={editedVendor.vendorName}
                          onChange={(e) => setEditedVendor({ ...editedVendor, vendorName: e.target.value })}
                          placeholder="Enter vendor name"
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Vendor Code <span className="text-red-500">*</span></label>
                        <StyledTextField 
                          value={editedVendor.vendorCode}
                          onChange={(e) => setEditedVendor({ ...editedVendor, vendorCode: e.target.value })}
                          placeholder="Enter vendor code"
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Contact Person</label>
                        <StyledTextField 
                          value={editedVendor.contactPerson}
                          onChange={(e) => setEditedVendor({ ...editedVendor, contactPerson: e.target.value })}
                          placeholder="Enter contact person name"
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Email</label>
                        <StyledTextField 
                          type="email"
                          value={editedVendor.email}
                          onChange={(e) => setEditedVendor({ ...editedVendor, email: e.target.value })}
                          placeholder="Enter email address"
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Phone</label>
                        <StyledTextField 
                          type="tel"
                          value={editedVendor.phone}
                          onChange={(e) => setEditedVendor({ ...editedVendor, phone: e.target.value })}
                          placeholder="Enter phone number"
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Terms */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Pricing & Terms</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Purchase Price <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <StyledSelect 
                              value={editedVendor.currency}
                              onChange={(e) => setEditedVendor({ ...editedVendor, currency: e.target.value })}
                              style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                            >
                              <MenuItem value="INR" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>INR</MenuItem>
                              <MenuItem value="USD" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>USD</MenuItem>
                              <MenuItem value="EUR" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>EUR</MenuItem>
                              <MenuItem value="GBP" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>GBP</MenuItem>
                            </StyledSelect>
                          </div>
                          <div className="col-span-2">
                            <StyledTextField 
                              type="number"
                              value={editedVendor.purchasePrice}
                              onChange={(e) => setEditedVendor({ ...editedVendor, purchasePrice: parseFloat(e.target.value) || 0 })}
                              placeholder="0.00"
                              inputProps={{ min: 0, step: 0.01 }}
                              style={{ minHeight: '1.4375em' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Lead Time <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                          <StyledTextField 
                            type="number"
                            value={editedVendor.leadTime}
                            onChange={(e) => setEditedVendor({ ...editedVendor, leadTime: parseInt(e.target.value) || 0 })}
                            placeholder="Enter lead time"
                            inputProps={{ min: 0 }}
                            style={{ minHeight: '1.4375em' }}
                          />
                          <StyledSelect 
                            value={editedVendor.leadTimeUnit}
                            onChange={(e) => setEditedVendor({ ...editedVendor, leadTimeUnit: e.target.value as 'days' | 'weeks' })}
                            style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                          >
                            <MenuItem value="days" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Days</MenuItem>
                            <MenuItem value="weeks" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Weeks</MenuItem>
                          </StyledSelect>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Minimum Order Quantity</label>
                        <StyledTextField 
                          type="number"
                          value={editedVendor.minimumOrderQuantity}
                          onChange={(e) => setEditedVendor({ ...editedVendor, minimumOrderQuantity: parseInt(e.target.value) || 0 })}
                          placeholder="Enter MOQ"
                          inputProps={{ min: 0 }}
                          style={{ minHeight: '1.4375em' }}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editedVendor.preferredVendor}
                            onChange={(e) => setEditedVendor({ ...editedVendor, preferredVendor: e.target.checked })}
                            className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
                          />
                          <span className="text-sm text-gray-700">Mark as Preferred Vendor</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 pb-2 border-b border-gray-200">Notes</h4>
                    <textarea
                      value={editedVendor.notes}
                      onChange={(e) => setEditedVendor({ ...editedVendor, notes: e.target.value })}
                      placeholder="Add notes about this vendor..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              {vendorPaneMode === 'view' ? (
                <>
                  <button
                    onClick={handleRemoveFromPane}
                    disabled={disabled}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Vendor</span>
                  </button>
                  <button
                    onClick={() => setVendorPaneMode('edit')}
                    disabled={disabled}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Vendor</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditedVendor({ ...selectedVendor });
                      setVendorPaneMode('view');
                    }}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveVendor}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}