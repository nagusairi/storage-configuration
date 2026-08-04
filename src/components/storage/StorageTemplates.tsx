import { useState } from 'react';
import { 
  Plus, Save, Eye, Trash2, Copy, Clock, CheckCircle2, 
  AlertTriangle, Settings, Code2, Target, Box, Layers,
  ChevronDown, ChevronRight, GripVertical, Info, Zap,
  MapPin, FileText, GitBranch, Play, X, Edit2, ChevronUp
} from 'lucide-react';
import { StyledSelect, MenuItem } from '../ui/StyledSelect';
import { StyledTextField } from '../ui/StyledTextField';

interface StorageTemplate {
  id: string;
  name: string;
  code: string;
  warehouseType: string;
  description: string;
  reusable: boolean;
  version: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  totalBins: number;
}

interface HierarchyLevel {
  id: string;
  type: 'warehouse' | 'zone' | 'aisle' | 'rack' | 'shelf' | 'bin' | 'custom';
  label: string;
  icon: string;
  color: string;
  order: number;
}

export function StorageTemplates() {
  const [templates, setTemplates] = useState<StorageTemplate[]>([
    {
      id: '1',
      name: 'Medium Picking Rack Template',
      code: 'TPL-PICK-MED',
      warehouseType: 'medium',
      description: 'Template for medium picking racks',
      reusable: true,
      version: 'v2',
      status: 'active',
      createdAt: '2024-01-15',
      totalBins: 960
    },
    {
      id: '2',
      name: 'Cold Storage Template',
      code: 'TPL-COLD-STD',
      warehouseType: 'cold',
      description: 'Standard cold storage configuration',
      reusable: true,
      version: 'v1',
      status: 'active',
      createdAt: '2024-01-10',
      totalBins: 480
    },
    {
      id: '3',
      name: 'Hazard Zone Template',
      code: 'TPL-HAZ-001',
      warehouseType: 'hazard',
      description: 'Specialized hazardous material storage',
      reusable: false,
      version: 'v1',
      status: 'draft',
      createdAt: '2024-01-20',
      totalBins: 240
    }
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StorageTemplate | null>(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showEditLevelModal, setShowEditLevelModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<HierarchyLevel | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Hierarchy levels state
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    { id: '1', type: 'zone', label: 'Zone', icon: 'box', color: 'blue', order: 1 },
    { id: '2', type: 'aisle', label: 'Aisle', icon: 'layers', color: 'purple', order: 2 },
    { id: '3', type: 'rack', label: 'Rack', icon: 'target', color: 'green', order: 3 },
    { id: '4', type: 'shelf', label: 'Shelf', icon: 'layers', color: 'orange', order: 4 },
    { id: '5', type: 'bin', label: 'Bin', icon: 'box', color: 'indigo', order: 5 }
  ]);

  // New level form state
  const [newLevel, setNewLevel] = useState({
    type: 'custom' as HierarchyLevel['type'],
    label: '',
    icon: 'box',
    color: 'blue'
  });

  // Builder state
  const [templateName, setTemplateName] = useState('');
  const [templateCode, setTemplateCode] = useState('');
  const [warehouseType, setWarehouseType] = useState('medium');
  const [description, setDescription] = useState('');
  const [reusable, setReusable] = useState(true);

  const [aislesPerZone, setAislesPerZone] = useState(4);
  const [racksPerAisle, setRacksPerAisle] = useState(8);
  const [shelvesPerRack, setShelvesPerRack] = useState(5);
  const [binsPerShelf, setBinsPerShelf] = useState(6);

  const [maxWeight, setMaxWeight] = useState('100');
  const [maxVolume, setMaxVolume] = useState('1.5');
  const [maxHeight, setMaxHeight] = useState('1.2');
  const [tempRange, setTempRange] = useState('2-8');
  
  const [hazardAllowed, setHazardAllowed] = useState(false);
  const [fragileAllowed, setFragileAllowed] = useState(false);
  const [autoReassignment, setAutoReassignment] = useState(true);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    structure: true,
    capacity: true,
    zones: false,
    codeBuilder: false,
    preview: true
  });

  const totalBins = aislesPerZone * racksPerAisle * shelvesPerRack * binsPerShelf;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Add new hierarchy level
  const handleAddLevel = () => {
    if (!newLevel.label) {
      alert('Please enter a level name');
      return;
    }

    const newHierarchyLevel: HierarchyLevel = {
      id: Date.now().toString(),
      type: newLevel.type,
      label: newLevel.label,
      icon: newLevel.icon,
      color: newLevel.color,
      order: hierarchyLevels.length + 1
    };

    setHierarchyLevels([...hierarchyLevels, newHierarchyLevel]);
    setShowAddLevelModal(false);
    
    // Reset form
    setNewLevel({
      type: 'custom',
      label: '',
      icon: 'box',
      color: 'blue'
    });
  };

  // Remove hierarchy level
  const handleRemoveLevel = (levelId: string) => {
    setHierarchyLevels(hierarchyLevels.filter(level => level.id !== levelId));
  };

  // Move level up/down
  const moveLevelUp = (index: number) => {
    if (index === 0) return;
    const newLevels = [...hierarchyLevels];
    [newLevels[index], newLevels[index - 1]] = [newLevels[index - 1], newLevels[index]];
    // Update order
    newLevels.forEach((level, idx) => {
      level.order = idx + 1;
    });
    setHierarchyLevels(newLevels);
  };

  const moveLevelDown = (index: number) => {
    if (index === hierarchyLevels.length - 1) return;
    const newLevels = [...hierarchyLevels];
    [newLevels[index], newLevels[index + 1]] = [newLevels[index + 1], newLevels[index]];
    // Update order
    newLevels.forEach((level, idx) => {
      level.order = idx + 1;
    });
    setHierarchyLevels(newLevels);
  };

  // Edit hierarchy level
  const handleEditLevel = (level: HierarchyLevel) => {
    setEditingLevel(level);
    setNewLevel({
      type: level.type,
      label: level.label,
      icon: level.icon,
      color: level.color
    });
    setShowEditLevelModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingLevel || !newLevel.label) {
      alert('Please enter a level name');
      return;
    }

    setHierarchyLevels(hierarchyLevels.map(level => 
      level.id === editingLevel.id 
        ? { ...level, type: newLevel.type, label: newLevel.label, icon: newLevel.icon, color: newLevel.color }
        : level
    ));
    
    setShowEditLevelModal(false);
    setEditingLevel(null);
    
    // Reset form
    setNewLevel({
      type: 'custom',
      label: '',
      icon: 'box',
      color: 'blue'
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newLevels = [...hierarchyLevels];
    const draggedItem = newLevels[draggedIndex];
    newLevels.splice(draggedIndex, 1);
    newLevels.splice(index, 0, draggedItem);
    
    // Update order
    newLevels.forEach((level, idx) => {
      level.order = idx + 1;
    });
    
    setHierarchyLevels(newLevels);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Get icon component based on icon string
  const getIconComponent = (iconName: string, className: string) => {
    switch (iconName) {
      case 'box':
        return <Box className={className} />;
      case 'layers':
        return <Layers className={className} />;
      case 'target':
        return <Target className={className} />;
      default:
        return <Box className={className} />;
    }
  };

  // Get color class based on color string
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      indigo: 'text-indigo-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      pink: 'text-pink-600'
    };
    return colorMap[color] || 'text-blue-600';
  };

  const zones = [
    { id: 'bulk', name: 'Bulk Storage', utilization: 78, capacity: '10,000 m³' },
    { id: 'picking', name: 'Picking Zone', utilization: 92, capacity: '5,000 m³' },
    { id: 'cold', name: 'Cold Storage', utilization: 65, capacity: '3,000 m³' },
    { id: 'hazard', name: 'Hazard Zone', utilization: 45, capacity: '2,000 m³' },
    { id: 'quarantine', name: 'Quarantine', utilization: 30, capacity: '1,000 m³' },
    { id: 'receiving', name: 'Receiving', utilization: 85, capacity: '4,000 m³' },
    { id: 'dispatch', name: 'Dispatch', utilization: 88, capacity: '4,500 m³' }
  ];

  const previewLocations = [
    { code: 'HYD1-ZP-A01-R01-S01-B01', zone: 'Picking', capacity: '100kg', status: 'available' },
    { code: 'HYD1-ZP-A01-R01-S01-B02', zone: 'Picking', capacity: '100kg', status: 'available' },
    { code: 'HYD1-ZP-A01-R01-S01-B03', zone: 'Picking', capacity: '100kg', status: 'reserved' },
    { code: 'HYD1-ZP-A01-R01-S01-B04', zone: 'Picking', capacity: '100kg', status: 'blocked' },
    { code: 'HYD1-ZP-A01-R01-S01-B05', zone: 'Picking', capacity: '100kg', status: 'damaged' }
  ];

  if (showBuilder) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Builder Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-base font-medium text-gray-900">Create Storage Template</h2>
            <p className="text-xs text-gray-500 mt-1">Define a reusable storage structure blueprint</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBuilder(false)}
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              style={{ height: '33px' }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              style={{ height: '33px' }}
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            <button
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
              style={{ height: '33px' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Template</span>
            </button>
          </div>
        </div>

        {/* Three Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL - Configuration (30%) */}
          <div className="w-[30%] border-r border-gray-200 overflow-y-auto p-6 space-y-4">
            {/* Section 1: Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Basic Information</span>
                </div>
                {expandedSections.basic ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.basic && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Template Name <span className="text-red-500">*</span></label>
                    <StyledTextField
                      type="text"
                      placeholder="e.g., Medium Picking Rack"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Template Code <span className="text-red-500">*</span></label>
                    <StyledTextField
                      type="text"
                      placeholder="e.g., TPL-PICK-MED"
                      value={templateCode}
                      onChange={(e) => setTemplateCode(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Warehouse Type <span className="text-red-500">*</span></label>
                    <StyledSelect
                      value={warehouseType}
                      onChange={(e) => setWarehouseType(e.target.value)}
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="small" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Small Warehouse</MenuItem>
                      <MenuItem value="medium" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Medium Warehouse</MenuItem>
                      <MenuItem value="high-density" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>High Density Warehouse</MenuItem>
                      <MenuItem value="cold" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cold Storage</MenuItem>
                      <MenuItem value="hazard" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hazard Storage</MenuItem>
                    </StyledSelect>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Template for medium picking racks..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Reusable Template</span>
                    <input
                      type="checkbox"
                      checked={reusable}
                      onChange={(e) => setReusable(e.target.checked)}
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Storage Structure */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('structure')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Storage Structure</span>
                </div>
                {expandedSections.structure ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.structure && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Aisles per Zone</label>
                    <StyledTextField
                      type="number"
                      value={aislesPerZone}
                      onChange={(e) => setAislesPerZone(parseInt(e.target.value) || 0)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Racks per Aisle</label>
                    <StyledTextField
                      type="number"
                      value={racksPerAisle}
                      onChange={(e) => setRacksPerAisle(parseInt(e.target.value) || 0)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Shelves per Rack</label>
                    <StyledTextField
                      type="number"
                      value={shelvesPerRack}
                      onChange={(e) => setShelvesPerRack(parseInt(e.target.value) || 0)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Bins per Shelf</label>
                    <StyledTextField
                      type="number"
                      value={binsPerShelf}
                      onChange={(e) => setBinsPerShelf(parseInt(e.target.value) || 0)}
                      className="w-full no-spinner"
                    />
                  </div>

                  {/* Total Bins */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-900">Total Bins Generated</span>
                      <span className="text-2xl font-semibold text-purple-900">{totalBins.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Capacity Rules */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('capacity')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Capacity Rules</span>
                </div>
                {expandedSections.capacity ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.capacity && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Weight per Bin (kg)</label>
                    <StyledTextField
                      type="number"
                      placeholder="100"
                      value={maxWeight}
                      onChange={(e) => setMaxWeight(e.target.value)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Volume per Shelf (m³)</label>
                    <StyledTextField
                      type="number"
                      placeholder="1.5"
                      value={maxVolume}
                      onChange={(e) => setMaxVolume(e.target.value)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Pallet Height (m)</label>
                    <StyledTextField
                      type="number"
                      placeholder="1.2"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(e.target.value)}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Temperature Range (°C)</label>
                    <StyledTextField
                      type="text"
                      placeholder="2-8"
                      value={tempRange}
                      onChange={(e) => setTempRange(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Hazard Allowed</span>
                      <input
                        type="checkbox"
                        checked={hazardAllowed}
                        onChange={(e) => setHazardAllowed(e.target.checked)}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Fragile Items Allowed</span>
                      <input
                        type="checkbox"
                        checked={fragileAllowed}
                        onChange={(e) => setFragileAllowed(e.target.checked)}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Auto Reassignment</span>
                      <input
                        type="checkbox"
                        checked={autoReassignment}
                        onChange={(e) => setAutoReassignment(e.target.checked)}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Zone Mapping */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('zones')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Applicable Zones</span>
                </div>
                {expandedSections.zones ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.zones && (
                <div className="px-4 pb-4 space-y-2">
                  {zones.map((zone) => (
                    <div key={zone.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Utilization</span>
                            <span>{zone.utilization}%</span>
                          </div>
                          <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`absolute top-0 left-0 h-full transition-all ${
                                zone.utilization >= 80 ? 'bg-red-500' :
                                zone.utilization >= 50 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${zone.utilization}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {zone.capacity}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER PANEL - Structure Builder (35%) */}
          <div className="w-[35%] border-r border-gray-200 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Visual Hierarchy</h3>
                <button
                  onClick={() => setShowAddLevelModal(true)}
                  className="px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                  Add Level
                </button>
              </div>

              {/* Hierarchy Tree Visualization - Dynamic */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-2">
                  {hierarchyLevels.map((level, index) => (
                    <div
                      key={level.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 ${draggedIndex === index ? 'opacity-50' : ''}`}
                      style={{ marginLeft: `${index * 16}px` }}
                    >
                      <div className="flex items-center gap-2 flex-1 p-2 bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow">
                        <GripVertical className="w-3 h-3 text-gray-400 cursor-move" />
                        {getIconComponent(level.icon, `w-3 h-3 ${getColorClass(level.color)}`)}
                        <span className="text-xs font-medium text-gray-900 flex-1">{level.label}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveLevelUp(index)}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ChevronUp className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => moveLevelDown(index)}
                            disabled={index === hierarchyLevels.length - 1}
                            className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ChevronDown className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditLevel(level)}
                            className="p-0.5 hover:bg-blue-100 rounded"
                            title="Edit level"
                          >
                            <Edit2 className="w-3 h-3 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleRemoveLevel(level.id)}
                            className="p-0.5 hover:bg-red-100 rounded"
                            title="Remove level"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {hierarchyLevels.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-xs text-gray-500">No hierarchy levels defined</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add Level" to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Level Modal */}
              {showAddLevelModal && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
                    onClick={() => setShowAddLevelModal(false)}
                  />
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[450px]">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Add Hierarchy Level</h3>
                        <p className="text-xs text-gray-500 mt-1">Define a new level in the storage hierarchy</p>
                      </div>
                      <button
                        onClick={() => setShowAddLevelModal(false)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Level Type</label>
                        <StyledSelect
                          value={newLevel.type}
                          onChange={(e) => setNewLevel({ ...newLevel, type: e.target.value as HierarchyLevel['type'] })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="custom" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Custom Level</MenuItem>
                          <MenuItem value="zone" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone</MenuItem>
                          <MenuItem value="aisle" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Aisle</MenuItem>
                          <MenuItem value="rack" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Rack</MenuItem>
                          <MenuItem value="shelf" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Shelf</MenuItem>
                          <MenuItem value="bin" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bin</MenuItem>
                        </StyledSelect>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Level Name <span className="text-red-500">*</span></label>
                        <StyledTextField
                          type="text"
                          placeholder="e.g., Row, Section, Compartment"
                          value={newLevel.label}
                          onChange={(e) => setNewLevel({ ...newLevel, label: e.target.value })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Icon</label>
                        <StyledSelect
                          value={newLevel.icon}
                          onChange={(e) => setNewLevel({ ...newLevel, icon: e.target.value })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="box" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Box</MenuItem>
                          <MenuItem value="layers" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Layers</MenuItem>
                          <MenuItem value="target" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Target</MenuItem>
                        </StyledSelect>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Color</label>
                        <StyledSelect
                          value={newLevel.color}
                          onChange={(e) => setNewLevel({ ...newLevel, color: e.target.value })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="blue" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-600" />
                              <span>Blue</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="purple" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-600" />
                              <span>Purple</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="green" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-600" />
                              <span>Green</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="orange" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-orange-600" />
                              <span>Orange</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="indigo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-600" />
                              <span>Indigo</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="red" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-600" />
                              <span>Red</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="yellow" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-600" />
                              <span>Yellow</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="pink" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-pink-600" />
                              <span>Pink</span>
                            </div>
                          </MenuItem>
                        </StyledSelect>
                      </div>

                      {/* Preview */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Preview:</span>
                          {getIconComponent(newLevel.icon, `w-4 h-4 ${getColorClass(newLevel.color)}`)}
                          <span className="text-sm font-medium text-gray-900">
                            {newLevel.label || 'Level Name'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
                      <button
                        onClick={() => setShowAddLevelModal(false)}
                        className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        style={{ height: '33px' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddLevel}
                        className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                        style={{ height: '33px' }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Level</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Edit Level Modal */}
              {showEditLevelModal && editingLevel && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
                    onClick={() => {
                      setShowEditLevelModal(false);
                      setEditingLevel(null);
                    }}
                  />
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[450px]">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Edit Hierarchy Level</h3>
                        <p className="text-xs text-gray-500 mt-1">Update the storage hierarchy level</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowEditLevelModal(false);
                          setEditingLevel(null);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Level Type</label>
                        <StyledSelect
                          value={newLevel.type}
                          onChange={(e) => setNewLevel({ ...newLevel, type: e.target.value as HierarchyLevel['type'] })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="custom" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Custom Level</MenuItem>
                          <MenuItem value="zone" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone</MenuItem>
                          <MenuItem value="aisle" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Aisle</MenuItem>
                          <MenuItem value="rack" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Rack</MenuItem>
                          <MenuItem value="shelf" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Shelf</MenuItem>
                          <MenuItem value="bin" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bin</MenuItem>
                        </StyledSelect>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Level Name <span className="text-red-500">*</span></label>
                        <StyledTextField
                          type="text"
                          placeholder="e.g., Row, Section, Compartment"
                          value={newLevel.label}
                          onChange={(e) => setNewLevel({ ...newLevel, label: e.target.value })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Icon</label>
                        <StyledSelect
                          value={newLevel.icon}
                          onChange={(e) => setNewLevel({ ...newLevel, icon: e.target.value })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="box" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Box</MenuItem>
                          <MenuItem value="layers" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Layers</MenuItem>
                          <MenuItem value="target" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Target</MenuItem>
                        </StyledSelect>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Color</label>
                        <StyledSelect
                          value={newLevel.color}
                          onChange={(e) => setNewLevel({ ...newLevel, color: e.target.value })}
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          <MenuItem value="blue" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-600" />
                              <span>Blue</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="purple" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-600" />
                              <span>Purple</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="green" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-600" />
                              <span>Green</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="orange" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-orange-600" />
                              <span>Orange</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="indigo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-600" />
                              <span>Indigo</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="red" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-600" />
                              <span>Red</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="yellow" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-600" />
                              <span>Yellow</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="pink" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-pink-600" />
                              <span>Pink</span>
                            </div>
                          </MenuItem>
                        </StyledSelect>
                      </div>

                      {/* Preview */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Preview:</span>
                          {getIconComponent(newLevel.icon, `w-4 h-4 ${getColorClass(newLevel.color)}`)}
                          <span className="text-sm font-medium text-gray-900">
                            {newLevel.label || 'Level Name'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
                      <button
                        onClick={() => {
                          setShowEditLevelModal(false);
                          setEditingLevel(null);
                        }}
                        className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        style={{ height: '33px' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                        style={{ height: '33px' }}
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Location Code Builder */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Location Code Pattern</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {/* Draggable segments */}
                  <div className="space-y-2">
                    {['Warehouse', 'Zone', 'Aisle', 'Rack', 'Shelf', 'Bin'].map((segment) => (
                      <div
                        key={segment}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-3 h-3 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                        />
                        <span className="flex-1 text-sm text-gray-700">{segment}</span>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">Separator</label>
                    <StyledSelect
                      defaultValue="-"
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="-" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hyphen (-)</MenuItem>
                      <MenuItem value="/" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Slash (/)</MenuItem>
                      <MenuItem value="." style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Dot (.)</MenuItem>
                    </StyledSelect>
                  </div>

                  {/* Code Preview */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Code Preview</span>
                    </div>
                    <code className="text-sm font-mono text-blue-900">HYD1-ZP-A01-R01-S01-B01</code>
                  </div>
                </div>
              </div>

              {/* Bulk Generation */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Bulk Generation</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">Total Locations</span>
                      <span className="font-semibold text-gray-900">{totalBins.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">Estimated time: ~3 seconds</div>
                  </div>
                  <button
                    className="w-full px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                    style={{ height: '33px' }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Generate Locations</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Preview (35%) */}
          <div className="w-[35%] overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
              {/* Generated Locations Preview */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Generated Locations</h3>
                  <p className="text-xs text-gray-500 mt-1">Preview of auto-generated codes</p>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs font-medium text-gray-500">Code</th>
                          <th className="text-left py-2 text-xs font-medium text-gray-500">Zone</th>
                          <th className="text-left py-2 text-xs font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewLocations.map((location, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-2">
                              <code className="text-xs font-mono text-gray-900">{location.code}</code>
                            </td>
                            <td className="py-2 text-xs text-gray-700">{location.zone}</td>
                            <td className="py-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${
                                  location.status === 'available'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : location.status === 'reserved'
                                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                    : location.status === 'blocked'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-gray-900 text-white border border-gray-900'
                                }`}
                              >
                                {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Warehouse Map Preview */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Warehouse Map</h3>
                  <p className="text-xs text-gray-500 mt-1">Visual zone status</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Array.from({ length: 16 }).map((_, idx) => {
                      const status = ['available', 'partial', 'full', 'blocked', 'damaged'][Math.floor(Math.random() * 5)];
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded border-2 ${
                            status === 'available' ? 'bg-green-100 border-green-300' :
                            status === 'partial' ? 'bg-yellow-100 border-yellow-300' :
                            status === 'full' ? 'bg-red-100 border-red-300' :
                            status === 'blocked' ? 'bg-gray-200 border-gray-400' :
                            'bg-gray-900 border-gray-900'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-100 border-2 border-green-300 rounded" />
                      <span className="text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-100 border-2 border-yellow-300 rounded" />
                      <span className="text-gray-700">Partially Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-100 border-2 border-red-300 rounded" />
                      <span className="text-gray-700">Full</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-200 border-2 border-gray-400 rounded" />
                      <span className="text-gray-700">Blocked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-900 border-2 border-gray-900 rounded" />
                      <span className="text-gray-700">Damaged</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version Control */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-900">Version Control</h3>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { version: 'v3', status: 'draft', date: '2024-01-25' },
                    { version: 'v2', status: 'active', date: '2024-01-20' },
                    { version: 'v1', status: 'archived', date: '2024-01-15' }
                  ].map((v) => (
                    <div key={v.version} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{v.version}</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            v.status === 'active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : v.status === 'draft'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{v.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Templates List View
  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-medium text-gray-900">Storage Templates</h2>
          <p className="text-xs text-gray-500 mt-1">Reusable storage structure blueprints</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
          style={{ height: '33px' }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h3>
                <code className="text-xs font-mono text-gray-600">{template.code}</code>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  template.status === 'active'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : template.status === 'draft'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-3">{template.description}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{template.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">{template.totalBins.toLocaleString()} bins</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button className="flex-1 px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Eye className="w-3 h-3" />
                View
              </button>
              <button className="flex-1 px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Copy className="w-3 h-3" />
                Duplicate
              </button>
              <button className="px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}