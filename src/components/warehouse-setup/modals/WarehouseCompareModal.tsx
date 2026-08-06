import { X, GitCompare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { WarehouseConfig } from '../types';

interface WarehouseCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouses: WarehouseConfig[];
  onOpenConfig: (warehouseId: string) => void;
}

const getWhId = (w: WarehouseConfig): string => w.warehouseId || (w as any).id || '';
const getWhCode = (w: WarehouseConfig): string => w.warehouseCode || getWhId(w).toUpperCase();

export function WarehouseCompareModal({
  isOpen,
  onClose,
  warehouses,
  onOpenConfig,
}: WarehouseCompareModalProps) {
  if (!isOpen || warehouses.length === 0) return null;

  // Helper to determine if row values differ across selected warehouses
  const isDifferent = (getter: (w: WarehouseConfig) => any) => {
    if (warehouses.length <= 1) return false;
    const firstVal = getter(warehouses[0]);
    return warehouses.some(w => getter(w) !== firstVal);
  };

  const rows = [
    {
      label: 'Warehouse Code',
      getter: (w: WarehouseConfig) => getWhCode(w),
      render: (w: WarehouseConfig) => <span className="font-mono font-bold text-gray-800">{getWhCode(w)}</span>,
    },
    {
      label: 'Configuration Status',
      getter: (w: WarehouseConfig) => w.configStatus,
      render: (w: WarehouseConfig) => {
        const badgeMap = {
          published: 'bg-green-50 text-green-700 border-green-200',
          draft: 'bg-amber-50 text-amber-700 border-amber-200',
          'not-configured': 'bg-red-50 text-red-700 border-red-200',
          archived: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        const statusText = {
          published: 'Published',
          draft: 'Draft',
          'not-configured': 'Setup Required',
          archived: 'Archived',
        }[w.configStatus];
        return (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${badgeMap[w.configStatus]}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      label: 'Hierarchy Model',
      getter: (w: WarehouseConfig) => w.activeHierarchyModel?.name ?? 'Standard Blueprint',
      render: (w: WarehouseConfig) => (
        <span className="text-xs font-semibold text-[#172B4D]">
          {w.activeHierarchyModel?.name ?? 'Standard Blueprint'}
        </span>
      ),
    },
    {
      label: 'Template Source',
      getter: (w: WarehouseConfig) => w.templateUsed ?? 'Standard Template',
      render: (w: WarehouseConfig) => (
        <span className="text-xs text-gray-600 font-medium">
          {w.templateUsed ?? 'Standard Template'}
        </span>
      ),
    },
    {
      label: 'Zone Count',
      getter: (w: WarehouseConfig) => w.zones.length,
      render: (w: WarehouseConfig) => (
        <span className="text-xs font-bold text-[#172B4D]">
          {w.zones.length} Zones
        </span>
      ),
    },
    {
      label: 'Storage Locations',
      getter: (w: WarehouseConfig) => w.totalLocations ?? 14400,
      render: (w: WarehouseConfig) => (
        <span className="text-xs font-mono font-bold text-[#172B4D]">
          {(w.totalLocations ?? 14400).toLocaleString()} locs
        </span>
      ),
    },
    {
      label: 'Storage Capacity',
      getter: (w: WarehouseConfig) => w.totalCapacity ?? '24,000 bins',
      render: (w: WarehouseConfig) => (
        <span className="text-xs text-gray-700 font-medium">
          {w.totalCapacity ?? '24,000 bins'}
        </span>
      ),
    },
    {
      label: 'Current Utilization',
      getter: (w: WarehouseConfig) => w.utilizationPct ?? 62,
      render: (w: WarehouseConfig) => {
        const pct = w.utilizationPct ?? 62;
        return (
          <div className="space-y-1 w-full max-w-[140px]">
            <div className="flex items-center justify-between text-xs font-bold text-[#172B4D]">
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 85 ? 'bg-amber-500' : 'bg-[#5C1F3D]'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      label: 'Validation Status',
      getter: (w: WarehouseConfig) => w.validationStatus ?? 'clean',
      render: (w: WarehouseConfig) => {
        const isClean = (w.validationStatus ?? 'clean') === 'clean';
        return isClean ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
            <CheckCircle2 className="w-3 h-3 text-green-600" /> Clean (0 Errors)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" /> Warnings Found
          </span>
        );
      },
    },
    {
      label: 'Last Published',
      getter: (w: WarehouseConfig) => w.lastPublished ?? '2 days ago',
      render: (w: WarehouseConfig) => (
        <span className="text-xs text-gray-500 font-medium">
          {w.lastPublished ?? '2 days ago'}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-2xl border border-[#d1def0] max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-[#fbfcfd] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5C1F3D]/10 text-[#5C1F3D] flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                Compare Warehouses ({warehouses.length})
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Differences Highlighted
                </span>
              </h2>
              <p className="text-xs text-gray-500">Side-by-side comparison of configurations, capacity, and status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-[#d1def0] rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f8f9] border-b border-[#d1def0]">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[200px] bg-gray-50/80 sticky left-0 z-10 border-r border-gray-200">
                    Configuration Field
                  </th>
                  {warehouses.map((wh) => {
                    const id = getWhId(wh);
                    return (
                      <th key={id} className="p-4 text-sm font-bold text-[#172B4D] min-w-[200px] border-r border-gray-200 last:border-r-0 bg-white">
                        <div className="flex flex-col gap-1">
                          <span>{wh.warehouseName}</span>
                          <span className="text-xs font-normal text-gray-500">{wh.location}</span>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenConfig(id);
                            }}
                            className="mt-2 text-xs font-semibold text-[#5C1F3D] hover:bg-[#5C1F3D]/10 border border-[#5C1F3D]/30 px-2.5 py-1 rounded transition-colors text-center w-full"
                          >
                            Configure →
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const hasDiff = isDifferent(row.getter);
                  return (
                    <tr
                      key={row.label}
                      className={hasDiff ? 'bg-amber-50/50 hover:bg-amber-50/80 transition-colors' : 'hover:bg-gray-50/60 transition-colors'}
                    >
                      <td className="p-4 text-xs font-semibold text-gray-600 bg-gray-50/40 border-r border-gray-200 flex items-center justify-between">
                        <span>{row.label}</span>
                        {hasDiff && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Values differ across warehouses" />
                        )}
                      </td>
                      {warehouses.map((wh) => (
                        <td key={getWhId(wh)} className="p-4 text-xs border-r border-gray-200 last:border-r-0">
                          {row.render(wh)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            Highlighted rows indicate differing configuration properties.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
