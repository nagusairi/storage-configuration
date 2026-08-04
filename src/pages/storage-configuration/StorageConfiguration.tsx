import { StorageHierarchyOverview } from '../../components/storage/StorageHierarchyOverview';
import { CodeRuleEngine } from '../../components/storage/CodeRuleEngine';
import { StorageTemplates } from '../../components/storage/StorageTemplates';
import { ZonesTab } from '../../components/storage/ZonesTab';
import { useState } from 'react';
import { Plus, Search, Filter, Grid3x3, List, Table, LayoutGrid, Ban, MapPin } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';
import { SearchableWarehouseSelect } from '../../components/ui/SearchableWarehouseSelect';
import { StyledSelect, MenuItem } from '../../components/ui/StyledSelect';
import { mockStorageHierarchyByWarehouse, mockWarehouses } from '../../data/mockStorageData';
import { ViewMode } from '../../types/ViewMode';

export default function StorageConfiguration() {
  const { sidebarExpanded } = useSidebar();
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [activeTab, setActiveTab] = useState('storage-hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const [showFilters, setShowFilters] = useState(false);

  // Get current warehouse data (null when "all" is selected)
  const currentWarehouseData = selectedWarehouse !== 'all' ? mockStorageHierarchyByWarehouse[selectedWarehouse] : null;

  // Get all warehouses data for Storage Hierarchy when "all" is selected
  const allWarehousesData = Object.values(mockStorageHierarchyByWarehouse);

  // Calculate aggregate metrics for all warehouses
  const aggregateMetrics = {
    totalWarehouses: allWarehousesData.length,
    totalCapacity: allWarehousesData.reduce((sum, wh) => sum + wh.capacity.total, 0),
    occupiedCapacity: allWarehousesData.reduce((sum, wh) => sum + wh.capacity.occupied, 0),
    avgZoneUtilization: Math.round(
      allWarehousesData.reduce((sum, wh) => sum + (wh.attributes?.zoneUtilization || 78), 0) / allWarehousesData.length
    ),
    capacityUnit: allWarehousesData[0]?.capacity.unit || 'bins'
  };

  // Handle warehouse change - reset search and filters
  const handleWarehouseChange = (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);
    setSearchTerm('');
    setShowFilters(false);
  };

  const breadcrumbs = ['Dashboard', 'Storage Configuration'];

  // Breadcrumb Actions - Add Warehouse button
  const breadcrumbActions = (
    <button
      className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
      style={{ height: '33px' }}
      onClick={() => console.log('Add Warehouse')}
    >
      <Plus className="w-4 h-4" />
      <span>Add Warehouse</span>
    </button>
  );

  const tabs = [
    { id: 'storage-hierarchy', label: 'Storage Hierarchy' },
    { id: 'zones', label: 'Zones' },
    { id: 'templates', label: 'Storage Templates' },
    { id: 'code-rules', label: 'Code & Rule Engine' },
    { id: 'activities', label: 'Activities' }
  ];

  const viewModes = [
    { id: 'hierarchy' as ViewMode, icon: Grid3x3, label: 'Hierarchy' },
    { id: 'cards' as ViewMode, icon: LayoutGrid, label: 'Cards' },
    { id: 'table' as ViewMode, icon: Table, label: 'Table' },
    { id: 'list' as ViewMode, icon: List, label: 'List' }
  ];

  return (
    <ModulePageTemplate
      breadcrumbs={breadcrumbs}
      breadcrumbActions={breadcrumbActions}
      disableTemplatePadding={true}
    >
      <div className="flex flex-col h-full bg-[#f7f8f9] p-3">
        {/* Warehouse Selector and Info */}
        <div className="px-6 py-4 bg-white rounded-t-lg">
          <div className="flex gap-6">
            {/* Left Column - Warehouse Dropdown (30%) */}
            <div style={{ width: '30%' }}>
              <label className="block text-sm text-gray-700 mb-2">Warehouse</label>
              <SearchableWarehouseSelect
                warehouses={mockWarehouses}
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                includeAllOption={true}
              />
            </div>

            {/* Right Column - Warehouse Info (70%) */}
            {currentWarehouseData && (
              <div style={{ width: '70%' }}>
                <div className="flex items-start gap-4 pt-7">
                  {/* Location */}
                  <div style={{ flex: '1.5' }}>
                    <p className="text-xs text-blue-600 mb-0.5">Location</p>
                    <p className="text-sm text-blue-900">{currentWarehouseData.attributes?.location}</p>
                  </div>
                  
                  {/* Total Capacity */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Total Capacity</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {currentWarehouseData.capacity.occupied.toLocaleString()} / {currentWarehouseData.capacity.total.toLocaleString()} {currentWarehouseData.capacity.unit}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-orange-500 transition-all"
                            style={{ width: `${Math.round((currentWarehouseData.capacity.occupied / currentWarehouseData.capacity.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {Math.round((currentWarehouseData.capacity.occupied / currentWarehouseData.capacity.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Available Capacity */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Available Capacity</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {(currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied).toLocaleString()} {currentWarehouseData.capacity.unit}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-green-500 transition-all"
                            style={{ width: `${Math.round(((currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied) / currentWarehouseData.capacity.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {Math.round(((currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied) / currentWarehouseData.capacity.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Zone Utilization % */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Zone Utilization %</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {currentWarehouseData.attributes?.zoneUtilization || '78'}% Avg
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                            style={{ width: `${currentWarehouseData.attributes?.zoneUtilization || 78}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {currentWarehouseData.attributes?.zoneUtilization || '78'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Warehouses Metrics (shown when selectedWarehouse === 'all') */}
            {selectedWarehouse === 'all' && (
              <div style={{ width: '70%' }}>
                <div className="flex items-start gap-4 pt-7">
                  {/* Total Warehouses */}
                  <div style={{ flex: '1.5' }}>
                    <p className="text-xs text-blue-600 mb-0.5">Total Warehouses</p>
                    <p className="text-sm text-blue-900">{aggregateMetrics.totalWarehouses}</p>
                  </div>
                  
                  {/* Total Capacity */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Total Capacity</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {aggregateMetrics.occupiedCapacity.toLocaleString()} / {aggregateMetrics.totalCapacity.toLocaleString()} {aggregateMetrics.capacityUnit}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-orange-500 transition-all"
                            style={{ width: `${Math.round((aggregateMetrics.occupiedCapacity / aggregateMetrics.totalCapacity) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {Math.round((aggregateMetrics.occupiedCapacity / aggregateMetrics.totalCapacity) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Available Capacity */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Available Capacity</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {(aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity).toLocaleString()} {aggregateMetrics.capacityUnit}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-green-500 transition-all"
                            style={{ width: `${Math.round(((aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity) / aggregateMetrics.totalCapacity) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {Math.round(((aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity) / aggregateMetrics.totalCapacity) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Zone Utilization % */}
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-0.5">Zone Utilization %</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-blue-900">
                        {aggregateMetrics.avgZoneUtilization}% Avg
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-sm overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                            style={{ width: `${aggregateMetrics.avgZoneUtilization}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {aggregateMetrics.avgZoneUtilization}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div 
          className="flex gap-0 relative bg-white px-6" 
          style={{ borderBottom: '1px solid #d1def0' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center px-[12px] py-[8px] relative rounded-tl-[5px] rounded-tr-[5px] transition-colors
                ${activeTab === tab.id 
                  ? 'bg-white mb-[-1px] pb-[9px] z-10' 
                  : ''
                }
              `}
              style={activeTab === tab.id ? { background: 'white' } : undefined}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(9, 30, 66, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = '';
                }
              }}
            >
              {activeTab === tab.id && (
                <div 
                  aria-hidden="true" 
                  className="absolute border-[#d1def0] border-[1px_1px_0px] border-solid inset-0 pointer-events-none rounded-tl-[5px] rounded-tr-[5px]" 
                />
              )}
              <span 
                className={`
                  text-[12px] text-[#172b4d] text-nowrap whitespace-pre
                  ${activeTab === tab.id 
                    ? "font-['Poppins:Medium',sans-serif]" 
                    : "font-['Poppins:Regular',sans-serif]"
                  }
                `}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden rounded-b-lg">
          {activeTab === 'storage-hierarchy' && (
            <div className="h-full flex flex-col bg-white rounded-b-lg">
              {/* Search and Filters Bar */}
              <div className="px-6 pt-4 space-y-4">
                {/* Search and View Mode */}
                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search warehouses, zones, or entities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                      style={{ height: '33px' }}
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

                  {/* View Mode Buttons */}
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

                {/* Filters Panel (Collapsible) */}
                {showFilters && (
                  <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1.5">Type</label>
                      <StyledSelect
                        defaultValue=""
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Types</MenuItem>
                        <MenuItem value="warehouse" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Warehouse</MenuItem>
                        <MenuItem value="zone" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone</MenuItem>
                        <MenuItem value="aisle" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Aisle</MenuItem>
                        <MenuItem value="rack" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Rack</MenuItem>
                        <MenuItem value="shelf" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Shelf</MenuItem>
                        <MenuItem value="bin" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bin</MenuItem>
                      </StyledSelect>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1.5">Status</label>
                      <StyledSelect
                        defaultValue=""
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Status</MenuItem>
                        <MenuItem value="active" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Active</MenuItem>
                        <MenuItem value="inactive" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Inactive</MenuItem>
                        <MenuItem value="maintenance" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Maintenance</MenuItem>
                      </StyledSelect>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1.5">Occupancy</label>
                      <StyledSelect
                        defaultValue=""
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Levels</MenuItem>
                        <MenuItem value="low" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Low (&lt; 50%)</MenuItem>
                        <MenuItem value="medium" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Medium (50-79%)</MenuItem>
                        <MenuItem value="high" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>High (80%+)</MenuItem>
                      </StyledSelect>
                    </div>
                  </div>
                )}
              </div>

              {/* Storage Hierarchy Content */}
              <div className="flex-1 overflow-hidden p-6">
                {viewMode === 'hierarchy' ? (
                  selectedWarehouse === 'all' ? (
                    <StorageHierarchyOverview 
                      data={allWarehousesData} 
                      searchTerm={searchTerm}
                    />
                  ) : currentWarehouseData ? (
                    <StorageHierarchyOverview 
                      data={[currentWarehouseData]} 
                      searchTerm={searchTerm}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Ban className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm text-gray-900 mb-2">No Storage Configuration</h3>
                        <p className="text-xs text-gray-500 mb-4">
                          This warehouse doesn't have a storage hierarchy configured yet.
                        </p>
                        <button
                          className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] mx-auto"
                          style={{ height: '33px' }}
                          onClick={() => console.log('Configure storage')}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Configure Storage</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        {viewMode === 'cards' && <LayoutGrid className="w-8 h-8 text-gray-400" />}
                        {viewMode === 'table' && <Table className="w-8 h-8 text-gray-400" />}
                        {viewMode === 'list' && <List className="w-8 h-8 text-gray-400" />}
                      </div>
                      <h3 className="text-sm text-gray-900 mb-2 capitalize">{viewMode} View</h3>
                      <p className="text-xs text-gray-500">
                        This view is coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code & Rule Engine Tab */}
          {activeTab === 'code-rules' && (
            <div className="h-full flex flex-col bg-white rounded-b-lg">
              <CodeRuleEngine />
            </div>
          )}

          {/* Storage Templates Tab */}
          {activeTab === 'templates' && (
            <div className="h-full flex flex-col bg-white rounded-b-lg">
              <StorageTemplates />
            </div>
          )}

          {/* Zones Tab */}
          {activeTab === 'zones' && (
            <div className="h-full flex flex-col bg-white rounded-b-lg">
              <ZonesTab selectedWarehouse={selectedWarehouse} />
            </div>
          )}

          {/* Other Tabs (Placeholder) */}
          {activeTab !== 'storage-hierarchy' && activeTab !== 'code-rules' && activeTab !== 'templates' && activeTab !== 'zones' && (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Grid3x3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm text-gray-900 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-gray-500">
                  This section is coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModulePageTemplate>
  );
}