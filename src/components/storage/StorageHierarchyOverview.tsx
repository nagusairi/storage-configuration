import { useState, useEffect } from 'react';
import { Edit, Plus, Ban, Info, ChevronRight } from 'lucide-react';
import { StorageNode } from '../../data/mockStorageData';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { HierarchyTree } from './HierarchyTree';
import { EditLocationPanel } from './edit-forms/EditLocationPanel';
import { EditWarehouseForm } from './edit-forms/EditWarehouseForm';
import { EditZoneForm } from './edit-forms/EditZoneForm';
import { EditAisleForm } from './edit-forms/EditAisleForm';
import { EditRackForm } from './edit-forms/EditRackForm';
import { EditShelfForm } from './edit-forms/EditShelfForm';
import { EditBinForm } from './edit-forms/EditBinForm';
import { AddZoneForm } from './add-forms/AddZoneForm';
import { AddAisleForm } from './add-forms/AddAisleForm';
import { AddRackForm } from './add-forms/AddRackForm';
import { AddShelfForm } from './add-forms/AddShelfForm';
import { AddBinForm } from './add-forms/AddBinForm';
import { getColorDisplay } from '../../utils/zoneColors';

interface StorageHierarchyOverviewProps {
  data: StorageNode[];
  searchTerm?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
          Active
        </span>
      );
    case 'inactive':
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-gray-50 text-gray-700 border border-gray-200">
          Inactive
        </span>
      );
    case 'maintenance':
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-orange-50 text-orange-700 border border-orange-200">
          Maintenance
        </span>
      );
    default:
      return null;
  }
};

const formatCapacity = (capacity?: { total: number; occupied: number; unit: string }) => {
  if (!capacity) return null;
  return {
    total: `${capacity.total.toLocaleString()} ${capacity.unit}`,
    occupied: `${capacity.occupied.toLocaleString()} ${capacity.unit}`,
    percentage: Math.round((capacity.occupied / capacity.total) * 100)
  };
};

const getUtilizationColor = (percentage: number) => {
  if (percentage < 50) return 'bg-green-600';
  if (percentage < 80) return 'bg-orange-500';
  return 'bg-red-600';
};

export function StorageHierarchyOverview({ data, searchTerm }: StorageHierarchyOverviewProps) {
  const [hierarchyData, setHierarchyData] = useState<StorageNode[]>(data);
  const [selectedNode, setSelectedNode] = useState<StorageNode | null>(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);

  // Sync with external data changes
  useEffect(() => {
    setHierarchyData(data);
  }, [data]);

  const handleNodeSelect = (node: StorageNode) => {
    setSelectedNode(node);
  };

  // Recursively update a node in the hierarchy
  const updateNodeInHierarchy = (nodes: StorageNode[], nodeId: string, updatedData: Partial<StorageNode>): StorageNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        // Found the node to update
        return { ...node, ...updatedData };
      }
      if (node.children && node.children.length > 0) {
        // Recursively search in children
        return {
          ...node,
          children: updateNodeInHierarchy(node.children, nodeId, updatedData)
        };
      }
      return node;
    });
  };

  // Find a node by ID in the hierarchy
  const findNodeById = (nodes: StorageNode[], nodeId: string): StorageNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  // Build parent chain from root to selected node
  const buildParentChain = (targetNode: StorageNode, nodes: StorageNode[], chain: StorageNode[] = []): StorageNode[] | null => {
    for (const node of nodes) {
      const currentChain = [...chain, node];
      
      // Found the target node
      if (node.id === targetNode.id) {
        return currentChain;
      }
      
      // Search in children
      if (node.children && node.children.length > 0) {
        const foundChain = buildParentChain(targetNode, node.children, currentChain);
        if (foundChain) return foundChain;
      }
    }
    
    return null;
  };

  const handleEditLocation = () => {
    if (!selectedNode) return;
    
    // Prepare form data based on location type
    const formData = prepareFormData(selectedNode);
    setEditFormData(formData);
    setIsEditingLocation(true);
  };

  const handleAddChild = () => {
    if (!selectedNode) return;
    
    // Open add child panel
    setIsAddingChild(true);
  };

  const handleSaveNewChild = (childData: Partial<StorageNode>) => {
    // Generate new ID
    const newId = Date.now();
    const newNode: StorageNode = {
      ...childData,
      id: newId,
      children: [],
    } as StorageNode;

    // Add to hierarchy
    const updateNodeChildren = (nodes: StorageNode[]): StorageNode[] => {
      return nodes.map(node => {
        if (node.id === selectedNode!.id) {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: updateNodeChildren(node.children)
          };
        }
        return node;
      });
    };

    setHierarchyData(updateNodeChildren(hierarchyData));
    setIsAddingChild(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Select the new node
    setSelectedNode(newNode);
  };

  const handleCancelAddChild = () => {
    setIsAddingChild(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedNode) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving changes for node:', selectedNode.id, editFormData);
      
      // Prepare updated node data based on location type
      const updatedNodeData: Partial<StorageNode> = {
        name: editFormData.name,
        status: editFormData.status
      };

      // Type-specific updates
      switch (selectedNode.type) {
        case 'warehouse':
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            address: editFormData.address,
            gstin: editFormData.gstin,
            contactPerson: editFormData.contactPerson,
            contactPhone: editFormData.contactPhone,
            operatingHours: `${editFormData.operatingHoursFrom} - ${editFormData.operatingHoursTo}`,
            warehouseType: editFormData.warehouseType
          };
          break;
        
        case 'zone':
          updatedNodeData.colorTag = editFormData.colorTag; // Update color tag
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            description: editFormData.description,
            temperatureControlled: editFormData.temperatureControlled,
            temperatureRange: editFormData.temperatureRange
          };
          updatedNodeData.capacity = {
            total: parseInt(editFormData.totalCapacity) || selectedNode.capacity?.total || 1000,
            occupied: selectedNode.capacity?.occupied || 0,
            unit: editFormData.capacityUnit || selectedNode.capacity?.unit || 'units'
          };
          break;
        
        case 'aisle':
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            width: editFormData.width,
            length: editFormData.length,
            floorType: editFormData.floorType
          };
          break;
        
        case 'rack':
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            height: editFormData.height,
            levels: parseInt(editFormData.levels) || selectedNode.attributes?.levels,
            maxWeightPerLevel: editFormData.maxWeightPerLevel,
            rackType: editFormData.rackType
          };
          break;
        
        case 'shelf':
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            level: editFormData.level,
            position: editFormData.position,
            width: editFormData.width,
            depth: editFormData.depth,
            maxWeight: editFormData.maxWeight
          };
          break;
        
        case 'bin':
          updatedNodeData.attributes = {
            ...selectedNode.attributes,
            binType: editFormData.binType,
            dimensions: editFormData.dimensions,
            barcode: editFormData.barcode
          };
          updatedNodeData.capacity = {
            total: parseInt(editFormData.capacity) || selectedNode.capacity?.total || 50,
            occupied: selectedNode.capacity?.occupied || 0,
            unit: selectedNode.capacity?.unit || 'units'
          };
          break;
      }
      
      // Update the node in the hierarchy
      const updatedHierarchy = updateNodeInHierarchy(hierarchyData, selectedNode.id, updatedNodeData);
      setHierarchyData(updatedHierarchy);
      
      // Update selected node to reflect changes
      const updatedNode = findNodeById(updatedHierarchy, selectedNode.id);
      if (updatedNode) {
        setSelectedNode(updatedNode);
      }
      
      console.log('✅ Changes saved successfully');
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Close edit panel
      setIsEditingLocation(false);
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(editFormData) !== JSON.stringify(prepareFormData(selectedNode!));
    
    if (hasChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmed) return;
    }
    
    setIsEditingLocation(false);
  };

  const prepareFormData = (node: StorageNode) => {
    const baseData = {
      name: node.name,
      code: node.code,
      status: node.status
    };

    switch (node.type) {
      case 'warehouse':
        return {
          ...baseData,
          address: node.attributes?.address || '',
          gstin: node.attributes?.gstin || '',
          contactPerson: node.attributes?.contactPerson || '',
          contactPhone: node.attributes?.contactPhone || '',
          operatingHoursFrom: '09:00',
          operatingHoursTo: '18:00',
          warehouseType: 'own'
        };
      
      case 'zone':
        return {
          ...baseData,
          parentWarehouse: 'Warehouse A',
          description: '',
          totalCapacity: node.capacity?.total?.toString() || '1000',
          capacityUnit: node.capacity?.unit || 'units',
          temperatureControlled: false,
          temperatureRange: '',
          colorTag: node.colorTag || 'blue', // Default to blue if not set
        };
      
      case 'aisle':
        return {
          ...baseData,
          parentZone: 'Zone A',
          length: '',
          lengthUnit: 'meters',
          width: '',
          widthUnit: 'meters',
          height: '',
          heightUnit: 'meters',
          capacity: node.capacity?.total?.toString() || '500',
          capacityUnit: node.capacity?.unit || 'units',
          accessType: 'double-sided'
        };
      
      case 'rack':
        return {
          ...baseData,
          parentAisle: 'Aisle A1',
          numberOfShelves: '5',
          rackHeight: '',
          rackWidth: '',
          rackDepth: '',
          dimensionUnit: 'meters',
          weightCapacityPerShelf: '100',
          weightUnit: 'kg',
          rackType: 'pallet'
        };
      
      case 'shelf':
        return {
          ...baseData,
          parentRack: 'Rack R1',
          position: '3',
          shelfWidth: '',
          shelfDepth: '',
          dimensionUnit: 'meters',
          capacity: node.capacity?.total?.toString() || '100',
          capacityUnit: node.capacity?.unit || 'units',
          weightLimit: '100',
          weightUnit: 'kg',
          numberOfBins: '10'
        };
      
      case 'bin':
        return {
          ...baseData,
          parentShelf: 'Shelf S1',
          binPosition: '5',
          binWidth: '',
          binDepth: '',
          binHeight: '',
          dimensionUnit: 'meters',
          capacity: node.capacity?.total?.toString() || '50',
          capacityUnit: node.capacity?.unit || 'units',
          binType: 'standard',
          barcode: node.code + '-QR'
        };
      
      default:
        return baseData;
    }
  };

  const renderEditForm = () => {
    if (!selectedNode || !editFormData) return null;

    switch (selectedNode.type) {
      case 'warehouse':
        return <EditWarehouseForm initialData={editFormData} onChange={setEditFormData} />;
      case 'zone':
        return <EditZoneForm initialData={editFormData} onChange={setEditFormData} />;
      case 'aisle':
        return <EditAisleForm initialData={editFormData} onChange={setEditFormData} />;
      case 'rack':
        return <EditRackForm initialData={editFormData} onChange={setEditFormData} />;
      case 'shelf':
        return <EditShelfForm initialData={editFormData} onChange={setEditFormData} />;
      case 'bin':
        return <EditBinForm initialData={editFormData} onChange={setEditFormData} />;
      default:
        return null;
    }
  };

  const capacityInfo = selectedNode ? formatCapacity(selectedNode.capacity) : null;

  // Helper function to get parent zone color for any node in hierarchy
  const getParentZoneColor = (node: StorageNode | null): string | null => {
    if (!node) return null;
    
    // If this is a zone, use its own color
    if (node.type === 'zone' && node.colorTag) {
      return getColorDisplay(node.colorTag).hex;
    }
    
    // For child nodes, find parent zone by traversing breadcrumbs
    const findZoneInHierarchy = (nodes: StorageNode[], targetNodeId: string, breadcrumb: StorageNode[] = []): StorageNode[] | null => {
      for (const n of nodes) {
        if (n.id === targetNodeId) {
          return breadcrumb;
        }
        if (n.children && n.children.length > 0) {
          const result = findZoneInHierarchy(n.children, targetNodeId, [...breadcrumb, n]);
          if (result) return result;
        }
      }
      return null;
    };
    
    const breadcrumbs = findZoneInHierarchy(hierarchyData, node.id);
    if (breadcrumbs) {
      // Find the zone in breadcrumbs (first occurrence from root)
      const zone = breadcrumbs.find(n => n.type === 'zone' && n.colorTag);
      if (zone && zone.colorTag) {
        return getColorDisplay(zone.colorTag).hex;
      }
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-5 gap-4 h-full relative">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-green-900 font-medium">Changes saved successfully</p>
            <p className="text-xs text-green-700 mt-0.5">Location updated with new information</p>
          </div>
        </div>
      )}
      {/* Left Panel - Tree View (40%) */}
      <div className="col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <HierarchyTree
            data={hierarchyData}
            selectedNodeId={selectedNode?.id || null}
            onNodeSelect={handleNodeSelect}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Right Panel - Details View (60%) */}
      <div className="col-span-3 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {selectedNode ? (
          <div className="flex-1 overflow-y-auto">
            {/* Header - Sticky */}
            <div 
              className={`sticky top-0 z-20 px-4 py-3 border-b border-gray-200 bg-white ${
                getParentZoneColor(selectedNode) ? 'border-l-4' : ''
              }`}
              style={
                getParentZoneColor(selectedNode)
                  ? { borderLeftColor: getParentZoneColor(selectedNode)! }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                {/* Left: Title + Color Badge (for zones) + Status Badge */}
                <div className="flex items-center gap-2">
                  {selectedNode.type === 'zone' && selectedNode.colorTag && (() => {
                    const colorDisplay = getColorDisplay(selectedNode.colorTag);
                    const isCustom = selectedNode.colorTag.startsWith('#');
                    
                    return (
                      <div 
                        className={`w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm ${!isCustom ? colorDisplay.bg : ''}`}
                        style={isCustom ? { backgroundColor: selectedNode.colorTag } : undefined}
                        title={`Zone Color: ${colorDisplay.label}`}
                      />
                    );
                  })()}
                  <h3 className="text-base text-gray-900">{selectedNode.name}</h3>
                  {getStatusBadge(selectedNode.status)}
                </div>
                
                {/* Right: Action Buttons - Icon Only with Tooltips */}
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={handleEditLocation}
                        className="w-8 h-8 rounded-[3px] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Edit location</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Hide Plus button for bins (leaf nodes) */}
                  {selectedNode.type !== 'bin' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={handleAddChild}
                          className="w-8 h-8 rounded-[3px] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p>Add child location</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="w-8 h-8 rounded-[3px] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-red-600 hover:bg-red-50"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Disable location</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Location Hierarchy Breadcrumb */}
            {(() => {
              // Don't show breadcrumb for warehouse (root level)
              if (selectedNode.type === 'warehouse') return null;
              
              const parentChain = buildParentChain(selectedNode, hierarchyData);
              if (!parentChain || parentChain.length === 0) return null;
              
              return (
                <div className="sticky top-[48px] z-10 px-6 pt-4 pb-3 border-b border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center flex-wrap gap-1">
                    {parentChain.map((node, index) => {
                      const isLast = index === parentChain.length - 1;
                      const isZone = node.type === 'zone';
                      const colorDisplay = isZone && node.colorTag ? getColorDisplay(node.colorTag) : null;
                      const isCustomColor = isZone && node.colorTag?.startsWith('#');
                      
                      return (
                        <div key={node.id} className="flex items-center gap-1">
                          {index > 0 && (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                          
                          {isLast ? (
                            // Current location (non-clickable, bold)
                            <div className="flex items-center gap-1.5">
                              {isZone && colorDisplay && (
                                <div 
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${!isCustomColor ? colorDisplay.bg : ''}`}
                                  style={isCustomColor ? { backgroundColor: node.colorTag } : undefined}
                                />
                              )}
                              <span className="text-xs text-gray-900 font-medium">
                                {node.name}
                              </span>
                            </div>
                          ) : (
                            // Ancestor (clickable)
                            <button
                              onClick={() => handleNodeSelect(node)}
                              className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#5C1F3D] transition-colors"
                              title={`Go to ${node.name}`}
                            >
                              {isZone && colorDisplay && (
                                <div 
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${!isCustomColor ? colorDisplay.bg : ''}`}
                                  style={isCustomColor ? { backgroundColor: node.colorTag } : undefined}
                                />
                              )}
                              <span>{node.name}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-200">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">{selectedNode.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Code</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedNode.code}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedNode.type}</p>
                  </div>
                </div>
              </div>

              {/* Capacity Information */}
              {/* Capacity Information - Only show if capacity data exists */}
              {capacityInfo && (
                <div>
                  <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-200">
                    Capacity Information
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Total Capacity</label>
                        <p className="text-sm text-gray-900">{capacityInfo.total}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Occupied Space</label>
                        <p className="text-sm text-gray-900">{capacityInfo.occupied}</p>
                      </div>
                    </div>
                    
                    {/* Utilization Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-gray-500">Utilization</label>
                        <span className="text-xs text-gray-700 font-medium">{capacityInfo.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getUtilizationColor(capacityInfo.percentage)} transition-all duration-500`}
                          style={{ width: `${capacityInfo.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Attributes */}
              {selectedNode.attributes && Object.keys(selectedNode.attributes).length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-200">
                    Additional Attributes
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedNode.attributes).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <p className="text-sm text-gray-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm text-gray-900 mb-2">No Location Selected</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Select a storage location from the tree on the left to view its details and manage configuration
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Location Panel */}
      <EditLocationPanel
        isOpen={isEditingLocation}
        onClose={() => setIsEditingLocation(false)}
        title={`Edit ${selectedNode?.type ? selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1) : ''}`}
        subtitle={selectedNode?.name}
        breadcrumbs={selectedNode ? buildParentChain(selectedNode, hierarchyData) || [] : []}
        onSave={handleSaveChanges}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
      >
        {renderEditForm()}
      </EditLocationPanel>

      {/* Add Child Location Panel */}
      {isAddingChild && selectedNode && (() => {
        const parentChain = buildParentChain(selectedNode, hierarchyData) || [];
        return (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-end">
            <div className="w-[500px] h-full bg-white shadow-2xl">
              {selectedNode.type === 'warehouse' && (
                <AddZoneForm
                  parentWarehouse={selectedNode}
                  parentChain={parentChain}
                  onSave={handleSaveNewChild}
                  onCancel={handleCancelAddChild}
                />
              )}
              {selectedNode.type === 'zone' && (
                <AddAisleForm
                  parentZone={selectedNode}
                  parentChain={parentChain}
                  onSave={handleSaveNewChild}
                  onCancel={handleCancelAddChild}
                />
              )}
              {selectedNode.type === 'aisle' && (
                <AddRackForm
                  parentAisle={selectedNode}
                  parentChain={parentChain}
                  onSave={handleSaveNewChild}
                  onCancel={handleCancelAddChild}
                />
              )}
              {selectedNode.type === 'rack' && (
                <AddShelfForm
                  parentRack={selectedNode}
                  parentChain={parentChain}
                  onSave={handleSaveNewChild}
                  onCancel={handleCancelAddChild}
                />
              )}
              {selectedNode.type === 'shelf' && (
                <AddBinForm
                  parentShelf={selectedNode}
                  parentChain={parentChain}
                  onSave={handleSaveNewChild}
                  onCancel={handleCancelAddChild}
                />
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}