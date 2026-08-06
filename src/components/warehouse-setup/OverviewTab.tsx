import { Layers, GitBranch, MapPin, Package, TrendingUp, Globe, Clock, Calendar } from 'lucide-react';
import type { WarehouseConfig } from './types';

interface OverviewTabProps {
  config: WarehouseConfig;
  onSetupClick: () => void;
}

export function OverviewTab({ config, onSetupClick }: OverviewTabProps) {
  const { zones, activeHierarchyModel, kpis, configStatus } = config;

  return (
    <div className="p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#f7f8f9] rounded-lg p-2.5 px-3 border border-[#d1def0]">
          <div className="flex items-center gap-1.5 mb-1">
            <GitBranch className="w-3.5 h-3.5 text-teal-600" />
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Hierarchy</h4>
          </div>
          <p className="text-xs font-bold text-[#172B4D] truncate">{kpis.activeHierarchyName}</p>
          {activeHierarchyModel && (
            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{activeHierarchyModel.levels.length} levels · {activeHierarchyModel.levels.map(l => l.name).join(' → ')}</p>
          )}
        </div>
        <div className="bg-[#f7f8f9] rounded-lg p-2.5 px-3 border border-[#d1def0]">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Utilization</h4>
          </div>
          <p className="text-sm font-bold text-[#172B4D]">{configStatus === 'not-configured' ? '—' : `${kpis.utilization}%`}</p>
          {configStatus !== 'not-configured' && (
            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{ width: `${kpis.utilization}%` }} />
            </div>
          )}
        </div>
        <div className="bg-[#f7f8f9] rounded-lg p-2.5 px-3 border border-[#d1def0]">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Last Published</h4>
          </div>
          <p className="text-xs font-bold text-[#172B4D]">{kpis.lastPublished}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
            {configStatus === 'published' ? 'Configuration is live' : configStatus === 'draft' ? 'Changes not yet published' : 'Not configured'}
          </p>
        </div>
      </div>

      {/* Zones */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#172B4D]">Zones ({zones.length})</h3>
          <button onClick={onSetupClick} className="text-xs font-medium text-[#0052CC] hover:underline">Manage Zones →</button>
        </div>
        {zones.length === 0 ? (
          <div className="flex items-center justify-center py-10 bg-[#f7f8f9] rounded-xl border border-dashed border-[#d1def0]">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No zones configured</p>
              <button onClick={onSetupClick} className="mt-2 text-xs font-medium text-[#5C1F3D] hover:underline">Set up warehouse →</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {zones.map(zone => {
              const totalGen = zone.generation.levels.reduce((a, l) => a * (l.count || 1), 1);
              return (
                <div key={zone.id} className="bg-white rounded-lg border border-[#d1def0] px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{zone.code}</span>
                      <h4 className="text-sm font-medium text-[#172B4D]">{zone.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      {zone.hierarchyMode === 'custom' ? (zone.customHierarchyModel?.name ?? 'Custom') : 'Default hierarchy'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#172B4D]">{totalGen > 1 ? totalGen.toLocaleString() : '—'}</p>
                    <p className="text-[10px] text-gray-400">locations</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity placeholder */}
      <div>
        <h3 className="text-sm font-semibold text-[#172B4D] mb-3">Recent Activity</h3>
        <div className="flex flex-col gap-2">
          {[
            { icon: Globe, text: 'Configuration published', time: '2 days ago', color: 'text-green-600 bg-green-50' },
            { icon: GitBranch, text: 'Hierarchy model updated to Standard 6-Level', time: '5 days ago', color: 'text-blue-600 bg-blue-50' },
            { icon: MapPin, text: 'Zone C — Cold Chain added', time: '1 week ago', color: 'text-purple-600 bg-purple-50' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-[#f0f4f8] last:border-b-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm text-[#172B4D] flex-1">{item.text}</p>
              <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
