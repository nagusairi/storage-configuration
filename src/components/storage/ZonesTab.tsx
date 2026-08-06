import { useState, useMemo } from 'react';
import { 
  Plus, Upload, Download, Search, Filter, Eye, Edit, 
  Power, Trash2, MapPin, Package, Thermometer, AlertTriangle,
  CheckCircle2, XCircle, Box, Layers, TrendingUp, BarChart3,
  Settings, Zap, FileText, Target, ChevronRight, Save, X,
  Grid3x3, LayoutGrid, Table, List
} from 'lucide-react';
import { StyledSelect, MenuItem } from '../ui/StyledSelect';
import { StyledTextField } from '../ui/StyledTextField';
import { ColorPicker } from '../ui/ColorPicker';

type ViewMode = 'hierarchy' | 'cards' | 'table' | 'list';

interface Zone {
  id: string;
  name: string;
  code: string;
  type: string;
  warehouse: string;
  utilization: number;
  temperature: string;
  status: 'active' | 'restricted' | 'blocked';
  maxLocations: number;
  usedLocations: number;
  maxWeight: string;
  maxVolume: string;
  templateId: string | null;
  templateName: string | null;
  colorTag?: string; // Can be predefined ID (e.g., 'blue') or custom hex (e.g., '#FF5733')
}

interface StorageTemplate {
  id: string;
  name: string;
  code: string;
  structure: {
    aisles: number;
    racksPerAisle: number;
    shelvesPerRack: number;
    binsPerShelf: number;
  };
  totalBins: number;
}

interface ZonesTabProps {
  selectedWarehouse: string;
}

export function ZonesTab({ selectedWarehouse }: ZonesTabProps) {
  // All zones across all warehouses
  const [allZones] = useState<Zone[]>([
    {
      id: '1',
      name: 'Picking Zone',
      code: 'ZP',
      type: 'picking',
      warehouse: 'WH-001',
      utilization: 65,
      temperature: '--',
      status: 'active',
      maxLocations: 500,
      usedLocations: 325,
      maxWeight: '15000kg',
      maxVolume: '120m³',
      templateId: '1',
      templateName: 'Medium Picking Rack Template'
    },
    {
      id: '2',
      name: 'Bulk Storage',
      code: 'ZB',
      type: 'bulk',
      warehouse: 'WH-001',
      utilization: 40,
      temperature: '--',
      status: 'active',
      maxLocations: 800,
      usedLocations: 320,
      maxWeight: '50000kg',
      maxVolume: '500m³',
      templateId: '2',
      templateName: 'Bulk Pallet Template'
    },
    {
      id: '3',
      name: 'Cold Storage',
      code: 'ZC',
      type: 'cold',
      warehouse: 'WH-001',
      utilization: 50,
      temperature: '2-8°C',
      status: 'active',
      maxLocations: 300,
      usedLocations: 150,
      maxWeight: '10000kg',
      maxVolume: '80m³',
      templateId: '3',
      templateName: 'Cold Storage Template'
    },
    {
      id: '4',
      name: 'Hazard Zone',
      code: 'ZH',
      type: 'hazard',
      warehouse: 'WH-001',
      utilization: 10,
      temperature: '--',
      status: 'restricted',
      maxLocations: 200,
      usedLocations: 20,
      maxWeight: '5000kg',
      maxVolume: '40m³',
      templateId: '4',
      templateName: 'Hazard Rack Template'
    },
    // WH-002 zones
    {
      id: '5',
      name: 'Picking Zone A',
      code: 'ZP-A',
      type: 'picking',
      warehouse: 'WH-002',
      utilization: 75,
      temperature: '--',
      status: 'active',
      maxLocations: 600,
      usedLocations: 450,
      maxWeight: '20000kg',
      maxVolume: '150m³',
      templateId: '1',
      templateName: 'Medium Picking Rack Template'
    },
    {
      id: '6',
      name: 'Cold Storage A',
      code: 'ZC-A',
      type: 'cold',
      warehouse: 'WH-002',
      utilization: 60,
      temperature: '2-8°C',
      status: 'active',
      maxLocations: 400,
      usedLocations: 240,
      maxWeight: '12000kg',
      maxVolume: '100m³',
      templateId: '3',
      templateName: 'Cold Storage Template'
    }
  ]);

  const [templates] = useState<StorageTemplate[]>([
    {
      id: '1',
      name: 'Medium Picking Rack Template',
      code: 'TPL-PICK-MED',
      structure: {
        aisles: 4,
        racksPerAisle: 8,
        shelvesPerRack: 5,
        binsPerShelf: 6
      },
      totalBins: 960
    },
    {
      id: '2',
      name: 'Bulk Pallet Template',
      code: 'TPL-BULK-STD',
      structure: {
        aisles: 6,
        racksPerAisle: 10,
        shelvesPerRack: 4,
        binsPerShelf: 5
      },
      totalBins: 1200
    },
    {
      id: '3',
      name: 'Cold Storage Template',
      code: 'TPL-COLD-STD',
      structure: {
        aisles: 3,
        racksPerAisle: 6,
        shelvesPerRack: 4,
        binsPerShelf: 5
      },
      totalBins: 360
    },
    {
      id: '4',
      name: 'Hazard Rack Template',
      code: 'TPL-HAZ-001',
      structure: {
        aisles: 2,
        racksPerAisle: 5,
        shelvesPerRack: 4,
        binsPerShelf: 4
      },
      totalBins: 160
    }
  ]);

  // Local state for when top warehouse is "ALL"
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // New zone form state
  const [newZone, setNewZone] = useState({
    name: '',
    code: '',
    warehouse: 'WH-001',
    type: 'picking',
    colorTag: 'blue',
    maxLocations: '500',
    maxWeight: '15000',
    maxVolume: '120',
    temperatureControlled: false,
    tempMin: '',
    tempMax: '',
    hazardAllowed: false,
    fragileAllowed: false,
    templateId: '',
    storageStrategy: 'closest',
    autoSlotting: true,
    autoReassignment: true
  });

  // ISSUE #1 FIX: Filter zones based on selected warehouse
  const filteredZones = useMemo(() => {
    let result = allZones;

    // If top warehouse is specific, filter by that warehouse
    if (selectedWarehouse !== 'all') {
      result = result.filter(z => z.warehouse === selectedWarehouse);
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(z => 
        z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType) {
      result = result.filter(z => z.type === filterType);
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter(z => z.status === filterStatus);
    }

    return result;
  }, [allZones, selectedWarehouse, searchTerm, filterType, filterStatus]);

  // Update selected zone when filters change
  useMemo(() => {
    if (selectedZone && !filteredZones.find(z => z.id === selectedZone.id)) {
      setSelectedZone(filteredZones[0] || null);
    } else if (!selectedZone && filteredZones.length > 0) {
      setSelectedZone(filteredZones[0]);
    }
  }, [filteredZones]);

  const getSelectedTemplate = () => {
    if (!selectedZone?.templateId) return null;
    return templates.find(t => t.id === selectedZone.templateId) || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'restricted':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'blocked':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-red-500';
    if (utilization >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'picking':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bulk':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cold':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'hazard':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalZones = filteredZones.length;
  const activeZones = filteredZones.filter(z => z.status === 'active').length;
  const blockedZones = filteredZones.filter(z => z.status === 'blocked').length;
  const coldZones = filteredZones.filter(z => z.type === 'cold').length;

  // View mode options
  const viewModes = [
    { id: 'hierarchy' as ViewMode, icon: Grid3x3, label: 'Hierarchy' },
    { id: 'cards' as ViewMode, icon: LayoutGrid, label: 'Cards' },
    { id: 'table' as ViewMode, icon: Table, label: 'Table' },
    { id: 'list' as ViewMode, icon: List, label: 'List' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search, Filter & View Modes */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <StyledTextField
                type="text"
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent border border-gray-300 text-gray-700 hover:bg-gray-50
                ${showFilters ? 'bg-gray-100' : 'bg-white'}
              `}
              style={{ height: '33px' }}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* View Modes */}
            <div className="flex items-center gap-1 border border-gray-300 rounded-[3px] bg-white p-1">
              {viewModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`
                      p-1.5 rounded transition-colors
                      ${viewMode === mode.id 
                        ? 'bg-[#5C1F3D] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                    title={mode.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              style={{ height: '33px' }}
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              style={{ height: '33px' }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
              style={{ height: '33px' }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Zone</span>
            </button>
          </div>
        </div>

          {/* Filters Panel (Collapsible) */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs text-gray-700 mb-1.5">Zone Type</label>
                <StyledSelect
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Types</MenuItem>
                  <MenuItem value="bulk" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bulk Storage</MenuItem>
                  <MenuItem value="cold" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cold Storage</MenuItem>
                  <MenuItem value="hazard" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hazard</MenuItem>
                </StyledSelect>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1.5">Status</label>
                <StyledSelect
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Status</MenuItem>
                  <MenuItem value="active" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Active</MenuItem>
                  <MenuItem value="restricted" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Restricted</MenuItem>
                  <MenuItem value="blocked" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Blocked</MenuItem>
                </StyledSelect>
              </div>
            </div>
          )}
        </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Zone List (30%) */}
        <div className="w-[30%] border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredZones.length === 0 ? (
              <div className="text-center py-8">
                <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No zones found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedZone?.id === zone.id
                      ? 'border-[#5C1F3D] bg-purple-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">{zone.name}</h3>
                        <span className="text-xs font-mono text-gray-500">({zone.code})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded border ${getZoneTypeColor(zone.type)}`}>
                          {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded border ${getStatusColor(zone.status)}`}>
                          {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Utilization</span>
                      <span className="font-medium">{zone.utilization}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all ${getUtilizationColor(zone.utilization)}`}
                        style={{ width: `${zone.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{zone.warehouse}</span>
                    </div>
                    {zone.temperature !== '--' && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Thermometer className="w-3 h-3" />
                        <span>{zone.temperature}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER PANEL - Zone Configuration (45%) - ISSUE #2 FIX: Only shows configuration, NO creation form */}
        <div className="w-[45%] border-r border-gray-200 overflow-y-auto p-6">
          {selectedZone ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Zone Name</label>
                    <StyledTextField
                      type="text"
                      value={selectedZone.name}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Zone Code</label>
                      <StyledTextField
                        type="text"
                        value={selectedZone.code}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Warehouse</label>
                      <StyledSelect
                        value={selectedZone.warehouse}
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        <MenuItem value="WH-001" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-001</MenuItem>
                        <MenuItem value="WH-002" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-002</MenuItem>
                        <MenuItem value="WH-003" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-003</MenuItem>
                      </StyledSelect>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Zone Type</label>
                    <StyledSelect
                      value={selectedZone.type}
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="bulk" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bulk Storage</MenuItem>
                      <MenuItem value="cold" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cold Storage</MenuItem>
                      <MenuItem value="hazard" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hazard Storage</MenuItem>
                      <MenuItem value="quarantine" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Quarantine</MenuItem>
                      <MenuItem value="receiving" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Receiving</MenuItem>
                      <MenuItem value="dispatch" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Dispatch</MenuItem>
                    </StyledSelect>
                  </div>
                  
                  {/* Color Tag Picker */}
                  <ColorPicker
                    value={selectedZone.colorTag || 'blue'}
                    onChange={(color) => {
                      // Update selected zone with new color
                      setSelectedZone(prev => prev ? { ...prev, colorTag: color } : null);
                    }}
                    label="Color Tag"
                    required={false}
                  />
                </div>
              </div>

              {/* Storage Template Assignment */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-medium text-gray-900">Storage Template</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Select Template</label>
                    <StyledSelect
                      value={selectedZone.templateId || ''}
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>No Template</MenuItem>
                      {templates.map(template => (
                        <MenuItem key={template.id} value={template.id} style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                          {template.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </div>

                  {getSelectedTemplate() && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-purple-900">
                          {getSelectedTemplate()!.name}
                        </h4>
                        <button className="text-xs text-purple-700 hover:text-purple-900 font-medium">
                          View Details
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-gray-600">Aisles</span>
                            <span className="font-medium text-gray-900">{getSelectedTemplate()!.structure.aisles}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-gray-600">Racks/Aisle</span>
                            <span className="font-medium text-gray-900">{getSelectedTemplate()!.structure.racksPerAisle}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-gray-600">Shelves/Rack</span>
                            <span className="font-medium text-gray-900">{getSelectedTemplate()!.structure.shelvesPerRack}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-gray-600">Bins/Shelf</span>
                            <span className="font-medium text-gray-900">{getSelectedTemplate()!.structure.binsPerShelf}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-purple-100 border border-purple-300 rounded text-center">
                          <span className="text-purple-900 font-medium">
                            Auto-generated: {getSelectedTemplate()!.totalBins.toLocaleString()} bins
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity Configuration */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-medium text-gray-900">Capacity Configuration</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Storage Locations</label>
                    <StyledTextField
                      type="number"
                      value={selectedZone.maxLocations}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Max Weight</label>
                      <StyledTextField
                        type="text"
                        value={selectedZone.maxWeight}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Max Volume</label>
                      <StyledTextField
                        type="text"
                        value={selectedZone.maxVolume}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                      <span>Used Locations</span>
                      <span className="font-medium">{selectedZone.usedLocations} / {selectedZone.maxLocations}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all ${getUtilizationColor(selectedZone.utilization)}`}
                        style={{ width: `${selectedZone.utilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="w-4 h-4 text-cyan-600" />
                  <h3 className="text-sm font-medium text-gray-900">Environmental Settings</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Temperature Controlled</span>
                    <input
                      type="checkbox"
                      checked={selectedZone.temperature !== '--'}
                      onChange={() => {}}
                      readOnly
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  </div>
                  {selectedZone.temperature !== '--' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Temperature Range</label>
                      <StyledTextField
                        type="text"
                        value={selectedZone.temperature}
                        className="w-full"
                        placeholder="e.g., 2-8°C"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Hazard Storage Allowed</span>
                    <input
                      type="checkbox"
                      checked={selectedZone.type === 'hazard'}
                      onChange={() => {}}
                      readOnly
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Fragile Storage Allowed</span>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  </div>
                </div>
              </div>

              {/* Storage Strategy */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-medium text-gray-900">Storage Strategy</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Default Strategy</label>
                    <StyledSelect
                      defaultValue="closest"
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="closest" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Closest Available Bin</MenuItem>
                      <MenuItem value="fifo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>FIFO</MenuItem>
                      <MenuItem value="fefo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>FEFO</MenuItem>
                      <MenuItem value="fixed" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Fixed Bin</MenuItem>
                      <MenuItem value="random" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Random Storage</MenuItem>
                    </StyledSelect>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Enable Auto Slotting</span>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Enable Overflow Zone</span>
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Enable Auto Reassignment</span>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                  style={{ height: '33px' }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a zone to view configuration</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Map & Analytics (25%) */}
        <div className="w-[25%] bg-white overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Zone Analytics */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Zone Analytics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Box className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-700">Total Zones</span>
                  </div>
                  <p className="text-2xl font-semibold text-blue-900">{totalZones}</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Active</span>
                  </div>
                  <p className="text-2xl font-semibold text-green-900">{activeZones}</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700">Blocked</span>
                  </div>
                  <p className="text-2xl font-semibold text-red-900">{blockedZones}</p>
                </div>
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs text-cyan-700">Cold Zones</span>
                  </div>
                  <p className="text-2xl font-semibold text-cyan-900">{coldZones}</p>
                </div>
              </div>
            </div>

            {/* Warehouse Map */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Warehouse Map</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {filteredZones.map((zone, idx) => {
                    let bgColor = 'bg-green-100 border-green-300';
                    if (zone.utilization >= 80) bgColor = 'bg-red-100 border-red-300';
                    else if (zone.utilization >= 50) bgColor = 'bg-yellow-100 border-yellow-300';
                    if (zone.type === 'cold') bgColor = 'bg-cyan-100 border-cyan-300';
                    if (zone.type === 'hazard') bgColor = 'bg-orange-100 border-orange-300';
                    if (zone.status === 'blocked') bgColor = 'bg-gray-200 border-gray-400';

                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`aspect-square rounded border-2 cursor-pointer hover:shadow-md transition-all ${bgColor} ${
                          selectedZone?.id === zone.id ? 'ring-2 ring-[#5C1F3D]' : ''
                        }`}
                        title={`${zone.name} (${zone.utilization}%)`}
                      />
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border-2 border-green-300 rounded" />
                    <span className="text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-100 border-2 border-yellow-300 rounded" />
                    <span className="text-gray-700">Medium Utilization</span>
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
                    <div className="w-3 h-3 bg-cyan-100 border-2 border-cyan-300 rounded" />
                    <span className="text-gray-700">Cold Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-100 border-2 border-orange-300 rounded" />
                    <span className="text-gray-700">Hazard Zone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Utilization Chart */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Zone Utilization</h3>
              <div className="space-y-2">
                {filteredZones.map((zone) => (
                  <div key={zone.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
                      <span className="font-medium">{zone.code}</span>
                      <span>{zone.utilization}%</span>
                    </div>
                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all ${getUtilizationColor(zone.utilization)}`}
                        style={{ width: `${zone.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Zone Modal */}
      {showCreateModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-base font-medium text-gray-900">Create New Zone</h3>
                <p className="text-xs text-gray-500 mt-1">Define a new storage zone in the warehouse</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Zone Name <span className="text-red-500">*</span></label>
                <StyledTextField
                  type="text"
                  placeholder="e.g., Picking Zone"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Zone Code <span className="text-red-500">*</span></label>
                  <StyledTextField
                    type="text"
                    placeholder="e.g., ZP"
                    value={newZone.code}
                    onChange={(e) => setNewZone({ ...newZone, code: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Warehouse <span className="text-red-500">*</span></label>
                  <StyledSelect
                    value={newZone.warehouse}
                    onChange={(e) => setNewZone({ ...newZone, warehouse: e.target.value })}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="WH-001" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-001</MenuItem>
                    <MenuItem value="WH-002" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-002</MenuItem>
                    <MenuItem value="WH-003" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>WH-003</MenuItem>
                  </StyledSelect>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Zone Type <span className="text-red-500">*</span></label>
                <StyledSelect
                  value={newZone.type}
                  onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  <MenuItem value="bulk" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bulk Storage</MenuItem>
                  <MenuItem value="cold" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cold Storage</MenuItem>
                  <MenuItem value="hazard" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hazard Storage</MenuItem>
                  <MenuItem value="quarantine" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Quarantine</MenuItem>
                  <MenuItem value="receiving" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Receiving</MenuItem>
                  <MenuItem value="dispatch" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Dispatch</MenuItem>
                </StyledSelect>
              </div>

              {/* Color Tag Picker */}
              <ColorPicker
                value={newZone.colorTag}
                onChange={(color) => setNewZone({ ...newZone, colorTag: color })}
                label="Color Tag"
                required={false}
              />

              <div>
                <label className="block text-sm text-gray-700 mb-2">Storage Template</label>
                <StyledSelect
                  value={newZone.templateId}
                  onChange={(e) => setNewZone({ ...newZone, templateId: e.target.value })}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>No Template</MenuItem>
                  {templates.map(template => (
                    <MenuItem key={template.id} value={template.id} style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                      {template.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Locations</label>
                  <StyledTextField
                    type="number"
                    placeholder="500"
                    value={newZone.maxLocations}
                    onChange={(e) => setNewZone({ ...newZone, maxLocations: e.target.value })}
                    className="w-full no-spinner"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Weight (kg)</label>
                  <StyledTextField
                    type="number"
                    placeholder="15000"
                    value={newZone.maxWeight}
                    onChange={(e) => setNewZone({ ...newZone, maxWeight: e.target.value })}
                    className="w-full no-spinner"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Volume (m³)</label>
                  <StyledTextField
                    type="number"
                    placeholder="120"
                    value={newZone.maxVolume}
                    onChange={(e) => setNewZone({ ...newZone, maxVolume: e.target.value })}
                    className="w-full no-spinner"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Temperature Controlled</span>
                  <input
                    type="checkbox"
                    checked={newZone.temperatureControlled}
                    onChange={(e) => setNewZone({ ...newZone, temperatureControlled: e.target.checked })}
                    className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Hazard Storage Allowed</span>
                  <input
                    type="checkbox"
                    checked={newZone.hazardAllowed}
                    onChange={(e) => setNewZone({ ...newZone, hazardAllowed: e.target.checked })}
                    className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Fragile Storage Allowed</span>
                  <input
                    type="checkbox"
                    checked={newZone.fragileAllowed}
                    onChange={(e) => setNewZone({ ...newZone, fragileAllowed: e.target.checked })}
                    className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl sticky bottom-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                style={{ height: '33px' }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                style={{ height: '33px' }}
              >
                <Plus className="w-4 h-4" />
                <span>Create Zone</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}