import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  GitCompare,
  MoreVertical,
  MapPin,
  Download,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { WarehouseConfig } from './types';

interface WarehouseHubScreenProps {
  warehouses: WarehouseConfig[];
  onSelectWarehouse: (warehouseId: string) => void;
  onNewWarehouse: () => void;
  onCompare: (selectedWarehouses: WarehouseConfig[]) => void;
}

// Safe ID & Code Accessors
const getWhId = (w: WarehouseConfig): string => w.warehouseId || (w as any).id || '';
const getWhCode = (w: WarehouseConfig): string => w.warehouseCode || getWhId(w).toUpperCase();

export function WarehouseHubScreen({
  warehouses,
  onSelectWarehouse,
  onNewWarehouse,
  onCompare,
}: WarehouseHubScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── Metric Aggregates ──────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = warehouses.length;
    const published = warehouses.filter(w => w.configStatus === 'published').length;
    const draft = warehouses.filter(w => w.configStatus === 'draft').length;
    const setupRequired = warehouses.filter(w => w.configStatus === 'not-configured').length;
    const totalLocations = warehouses.reduce((acc, w) => acc + (w.totalLocations ?? 14400), 0);
    const avgUtilization = Math.round(
      warehouses.reduce((acc, w) => acc + (w.utilizationPct ?? 62), 0) / (total || 1)
    );
    return { total, published, draft, setupRequired, totalLocations, avgUtilization };
  }, [warehouses]);

  // ── Filtering Logic ────────────────────────────────────────────────────────
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(w => {
      // Status filter
      if (statusFilter !== 'all' && w.configStatus !== statusFilter) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = w.warehouseName.toLowerCase().includes(query);
        const codeMatch = getWhCode(w).toLowerCase().includes(query);
        const locMatch = w.location.toLowerCase().includes(query);
        const modelMatch = (w.activeHierarchyModel?.name || '').toLowerCase().includes(query);
        const templateMatch = (w.templateUsed || '').toLowerCase().includes(query);
        const zoneMatch = w.zones.some(z => z.name.toLowerCase().includes(query) || z.code.toLowerCase().includes(query));
        return nameMatch || codeMatch || locMatch || modelMatch || templateMatch || zoneMatch;
      }
      return true;
    });
  }, [warehouses, statusFilter, searchTerm]);

  // Paginated list
  const paginatedWarehouses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWarehouses.slice(start, start + itemsPerPage);
  }, [filteredWarehouses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage) || 1;

  // ── Multi-select Handlers ──────────────────────────────────────────────────
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredWarehouses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWarehouses.map(getWhId));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const selectedWarehouseObjects = useMemo(() => {
    return warehouses.filter(w => selectedIds.includes(getWhId(w)));
  }, [warehouses, selectedIds]);

  // ── Render Card Action Button ──────────────────────────────────────────────
  const renderCardAction = (w: WarehouseConfig) => {
    const id = getWhId(w);
    switch (w.configStatus) {
      case 'not-configured':
        return (
          <button
            onClick={() => onSelectWarehouse(id)}
            className="w-full px-3 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Start Setup
          </button>
        );
      case 'draft':
        return (
          <button
            onClick={() => onSelectWarehouse(id)}
            className="w-full px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Continue Draft
          </button>
        );
      case 'archived':
        return (
          <button
            onClick={() => onSelectWarehouse(id)}
            className="w-full px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            View Only
          </button>
        );
      case 'published':
      default:
        return (
          <button
            onClick={() => onSelectWarehouse(id)}
            className="w-full px-3 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            Open Configuration <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        );
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* ── Top Header Banner & Stats ────────────────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded tracking-wide uppercase">
                Enterprise Workspace
              </span>
              <span className="text-xs font-medium text-gray-400">v4.0</span>
            </div>
            <h1 className="text-xl font-bold text-[#172B4D] mt-1">Warehouse Configuration Hub</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View, monitor and govern warehouse configurations across your entire organization.
            </p>
          </div>
        </div>

        {/* Aggregate KPI Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-100">
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Warehouses</span>
            <span className="text-lg font-bold text-[#172B4D]">{metrics.total}</span>
          </div>
          <div className="bg-green-50/60 border border-green-200/70 rounded-lg p-3">
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Published</span>
            <span className="text-lg font-bold text-green-800">{metrics.published}</span>
          </div>
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-lg p-3">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Draft In Progress</span>
            <span className="text-lg font-bold text-amber-800">{metrics.draft}</span>
          </div>
          <div className="bg-red-50/60 border border-red-200/70 rounded-lg p-3">
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Setup Required</span>
            <span className="text-lg font-bold text-red-800">{metrics.setupRequired}</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Storage Locations</span>
            <span className="text-lg font-bold text-[#172B4D] font-mono">{metrics.totalLocations.toLocaleString()}</span>
          </div>
          <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Avg Utilization</span>
            <span className="text-lg font-bold text-[#172B4D]">{metrics.avgUtilization}%</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search, Filters & View Toggle ───────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search & Quick Status Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, location, model, zone..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D]"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            {[
              { id: 'all', label: 'All' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Draft' },
              { id: 'not-configured', label: 'Setup Required' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  setStatusFilter(f.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === f.id
                    ? 'bg-white text-[#5C1F3D] shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'card' ? 'bg-white text-[#5C1F3D] shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'table' ? 'bg-white text-[#5C1F3D] shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" /> Table View
            </button>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar (Sticky Floating inside Content Area with 20px bottom gap) ── */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-[20px] z-40 bg-[#5C1F3D] text-white border border-[#4a1831] rounded-2xl px-5 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 my-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/30">
              {selectedIds.length} Warehouse{selectedIds.length !== 1 ? 's' : ''} Selected
            </span>
            <span className="text-xs text-white/80 hidden sm:inline">Select multi-warehouse bulk operation:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={selectedIds.length < 2}
              onClick={() => onCompare(selectedWarehouseObjects)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedIds.length >= 2
                  ? 'bg-white text-[#5C1F3D] hover:bg-gray-100 shadow-sm'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
              }`}
              title={selectedIds.length < 2 ? 'Select at least 2 warehouses to compare' : 'Compare selected warehouses'}
            >
              <GitCompare className="w-3.5 h-3.5" /> Compare Warehouses ({selectedIds.length})
            </button>

            <button
              onClick={() => alert(`Running validation check across ${selectedIds.length} warehouses...`)}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Validate
            </button>

            <button
              onClick={() => alert(`Exporting configuration bundle for ${selectedIds.length} warehouses...`)}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* ── CARD VIEW ────────────────────────────────────────────────────────── */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedWarehouses.map(w => {
            const id = getWhId(w);
            const code = getWhCode(w);
            const isSelected = selectedIds.includes(id);
            const statusBadgeMap = {
              published: 'bg-green-50 text-green-700 border-green-200',
              draft: 'bg-amber-50 text-amber-700 border-amber-200',
              'not-configured': 'bg-red-50 text-red-700 border-red-200',
              archived: 'bg-gray-100 text-gray-600 border-gray-200',
            };
            const statusLabel = {
              published: 'Published',
              draft: 'Draft',
              'not-configured': 'Setup Required',
              archived: 'Archived',
            }[w.configStatus];

            return (
              <div
                key={id}
                className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group ${
                  isSelected ? 'border-[#5C1F3D] ring-2 ring-[#5C1F3D]/20 bg-purple-50/20' : 'border-[#d1def0]'
                }`}
              >
                <div>
                  {/* Top Bar: Checkbox, Name, Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(id)}
                        className="mt-1 rounded text-[#5C1F3D] focus:ring-[#5C1F3D] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#172B4D] truncate">{w.warehouseName}</h3>
                          <span className="text-[10px] font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded flex-shrink-0">
                            {code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{w.location}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${statusBadgeMap[w.configStatus]}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Config Metadata Grid */}
                  <div className="bg-[#f7f8f9] border border-gray-200 rounded-lg p-3 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Hierarchy Model:</span>
                      <span className="font-bold text-[#172B4D] truncate ml-2">
                        {w.activeHierarchyModel?.name ?? 'Standard Blueprint'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Zones Configured:</span>
                      <span className="font-bold text-[#172B4D]">{w.zones.length} Zones</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Storage Locations:</span>
                      <span className="font-mono font-bold text-[#172B4D]">
                        {(w.totalLocations ?? 14400).toLocaleString()}
                      </span>
                    </div>

                    {/* Utilization Bar */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-1">
                        <span>Utilization</span>
                        <span>{w.utilizationPct ?? 62}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#5C1F3D] h-full rounded-full"
                          style={{ width: `${w.utilizationPct ?? 62}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex-1">{renderCardAction(w)}</div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === id ? null : id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === id && (
                      <div className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onSelectWarehouse(id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            alert(`Cloning configuration from ${w.warehouseName}...`);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                        >
                          Clone Configuration
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            alert(`Exporting JSON schema for ${w.warehouseName}...`);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                        >
                          Export Schema
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── TABLE VIEW ──────────────────────────────────────────────────────── */
        <div className="bg-white border border-[#d1def0] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f7f8f9] border-b border-[#d1def0] text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredWarehouses.length && filteredWarehouses.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-[#5C1F3D] focus:ring-[#5C1F3D] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5">Warehouse Name</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Hierarchy Model</th>
                  <th className="p-3.5">Zones</th>
                  <th className="p-3.5">Locations</th>
                  <th className="p-3.5">Utilization</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {paginatedWarehouses.map(w => {
                  const id = getWhId(w);
                  const code = getWhCode(w);
                  const isSelected = selectedIds.includes(id);
                  const statusBadgeMap = {
                    published: 'bg-green-50 text-green-700 border-green-200',
                    draft: 'bg-amber-50 text-amber-700 border-amber-200',
                    'not-configured': 'bg-red-50 text-red-700 border-red-200',
                    archived: 'bg-gray-100 text-gray-600 border-gray-200',
                  };
                  const statusLabel = {
                    published: 'Published',
                    draft: 'Draft',
                    'not-configured': 'Setup Required',
                    archived: 'Archived',
                  }[w.configStatus];

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-purple-50/30 transition-colors ${isSelected ? 'bg-purple-50/50' : ''}`}
                    >
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(id)}
                          className="rounded text-[#5C1F3D] focus:ring-[#5C1F3D] cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-bold text-[#172B4D]">{w.warehouseName}</td>
                      <td className="p-3.5 font-mono font-bold text-gray-700">{code}</td>
                      <td className="p-3.5 text-gray-500">{w.location}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusBadgeMap[w.configStatus]}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-700">{w.activeHierarchyModel?.name ?? 'Standard Blueprint'}</td>
                      <td className="p-3.5 font-bold">{w.zones.length}</td>
                      <td className="p-3.5 font-mono">{(w.totalLocations ?? 14400).toLocaleString()}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#5C1F3D] h-full rounded-full" style={{ width: `${w.utilizationPct ?? 62}%` }} />
                          </div>
                          <span className="text-[11px] font-bold">{w.utilizationPct ?? 62}%</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onSelectWarehouse(id)}
                          className="px-3 py-1 text-xs font-semibold text-[#5C1F3D] hover:bg-[#5C1F3D]/10 border border-[#5C1F3D]/30 rounded transition-colors"
                        >
                          Configure →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Enterprise Pagination Footer ────────────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl px-5 py-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>Showing {filteredWarehouses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredWarehouses.length)} of {filteredWarehouses.length} warehouses</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#5C1F3D]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
