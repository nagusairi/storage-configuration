import { StorageHierarchyOverview } from '../../components/storage/StorageHierarchyOverview';
import { CodeRuleEngine } from '../../components/storage/CodeRuleEngine';
import { StorageTemplates } from '../../components/storage/StorageTemplates';
import { ZonesTab } from '../../components/storage/ZonesTab';
import { useState } from 'react';
import { Plus, Search, Filter, Grid3x3, List, Table, LayoutGrid, Ban, MapPin, ChevronDown } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';
import { SearchableWarehouseSelect } from '../../components/ui/SearchableWarehouseSelect';
import { StyledSelect, MenuItem } from '../../components/ui/StyledSelect';
import { mockStorageHierarchyByWarehouse, mockWarehouses } from '../../data/mockStorageData';
import { ViewMode } from '../../types/ViewMode';

export default function StorageConfigurationV2() {
  const { sidebarExpanded } = useSidebar();
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [activeTab, setActiveTab] = useState('storage-hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 10);
  };

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

  const breadcrumbs = ['Dashboard', 'Storage Configuration v2'];

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
      disableTemplatePadding={true}
    >
      <div 
        onScroll={handleScroll}
        className="storage-config-page-wrapper flex flex-col h-full bg-[#f7f8f9] p-3 overflow-y-auto"
      >
        {/* Option 3: Collapsible Summary Card */}
        <div className="warehouse-selector-card-wrapper px-4 py-2.5 bg-white rounded-lg mb-3 shadow-sm">
          {/* Header Row (Always Visible) */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Warehouse Select */}
            <div className="warehouse-select-col flex items-center gap-2 flex-shrink-0">
              <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Warehouse:</label>
              <div className="w-[200px]">
                <SearchableWarehouseSelect
                  warehouses={mockWarehouses}
                  value={selectedWarehouse}
                  onChange={handleWarehouseChange}
                  includeAllOption={true}
                />
              </div>
            </div>

            {/* Right: Quick Stats & Toggle Button */}
            <div className="flex items-center gap-3 text-xs">
              <div className="hidden sm:flex items-center gap-3 text-gray-600">
                <span>Occupied: <strong className="text-[#FF5630] font-semibold">{selectedWarehouse === 'all' ? `${Math.round((aggregateMetrics.occupiedCapacity / aggregateMetrics.totalCapacity) * 100)}%` : currentWarehouseData ? `${Math.round((currentWarehouseData.capacity.occupied / currentWarehouseData.capacity.total) * 100)}%` : '0%'}</strong></span>
                <span>Available: <strong className="text-[#36B37E] font-semibold">{selectedWarehouse === 'all' ? `${Math.round(((aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity) / aggregateMetrics.totalCapacity) * 100)}%` : currentWarehouseData ? `${Math.round(((currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied) / currentWarehouseData.capacity.total) * 100)}%` : '0%'}</strong></span>
              </div>

              <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />

              <button
                onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
                className="flex items-center gap-1.5 text-xs text-[#0052CC] font-medium px-2.5 py-1 rounded bg-[#F4F5F7] hover:bg-[#EBECF0] transition-colors"
              >
                <span>{isMetricsExpanded ? 'Hide Details' : 'Show Details'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMetricsExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Collapsible Expanded Detailed Progress Bars */}
          {isMetricsExpanded && (
            <div className="pt-3 mt-2.5 border-t border-gray-100 flex items-center justify-between gap-4 text-xs overflow-x-auto animate-in slide-in-from-top-1">
              {selectedWarehouse === 'all' ? (
                <>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-[#0052CC]">Total Warehouses:</span>
                    <span className="font-semibold text-[#172B4D]">{aggregateMetrics.totalWarehouses}</span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Total Capacity:</span>
                    <span className="font-semibold text-[#172B4D]">
                      {aggregateMetrics.occupiedCapacity.toLocaleString()} / {aggregateMetrics.totalCapacity.toLocaleString()} {aggregateMetrics.capacityUnit}
                    </span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF5630] rounded-full transition-all"
                        style={{ width: `${Math.round((aggregateMetrics.occupiedCapacity / aggregateMetrics.totalCapacity) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-[#5E6C84]">
                      {Math.round((aggregateMetrics.occupiedCapacity / aggregateMetrics.totalCapacity) * 100)}%
                    </span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Available:</span>
                    <span className="font-semibold text-[#172B4D]">
                      {(aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity).toLocaleString()} {aggregateMetrics.capacityUnit}
                    </span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#36B37E] rounded-full transition-all"
                        style={{ width: `${Math.round(((aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity) / aggregateMetrics.totalCapacity) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-[#5E6C84]">
                      {Math.round(((aggregateMetrics.totalCapacity - aggregateMetrics.occupiedCapacity) / aggregateMetrics.totalCapacity) * 100)}%
                    </span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Utilization:</span>
                    <span className="font-semibold text-[#172B4D]">{aggregateMetrics.avgZoneUtilization}% Avg</span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0065FF] rounded-full transition-all"
                        style={{ width: `${aggregateMetrics.avgZoneUtilization}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : currentWarehouseData ? (
                <>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-[#0052CC]">Location:</span>
                    <span className="font-semibold text-[#172B4D]">{currentWarehouseData.attributes?.location}</span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Total Capacity:</span>
                    <span className="font-semibold text-[#172B4D]">
                      {currentWarehouseData.capacity.occupied.toLocaleString()} / {currentWarehouseData.capacity.total.toLocaleString()} {currentWarehouseData.capacity.unit}
                    </span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF5630] rounded-full transition-all"
                        style={{ width: `${Math.round((currentWarehouseData.capacity.occupied / currentWarehouseData.capacity.total) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-[#5E6C84]">
                      {Math.round((currentWarehouseData.capacity.occupied / currentWarehouseData.capacity.total) * 100)}%
                    </span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Available:</span>
                    <span className="font-semibold text-[#172B4D]">
                      {(currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied).toLocaleString()} {currentWarehouseData.capacity.unit}
                    </span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#36B37E] rounded-full transition-all"
                        style={{ width: `${Math.round(((currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied) / currentWarehouseData.capacity.total) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-[#5E6C84]">
                      {Math.round(((currentWarehouseData.capacity.total - currentWarehouseData.capacity.occupied) / currentWarehouseData.capacity.total) * 100)}%
                    </span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-gray-200" />

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[#0052CC]">Utilization:</span>
                    <span className="font-semibold text-[#172B4D]">{currentWarehouseData.attributes?.zoneUtilization || 78}% Avg</span>
                    <div className="w-16 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0065FF] rounded-full transition-all"
                        style={{ width: `${currentWarehouseData.attributes?.zoneUtilization || 78}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div 
          className="storage-tab-nav-wrapper sticky -top-4 z-20 flex gap-0 bg-white px-6 pt-3 rounded-t-lg transition-all duration-200" 
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
        <div className="storage-tab-content-wrapper flex-1 min-h-[650px] overflow-hidden rounded-b-lg">
          {activeTab === 'storage-hierarchy' && (
            <div className="storage-hierarchy-tab-container h-full min-h-[650px] flex flex-col bg-white rounded-b-lg pb-[20px]">
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
