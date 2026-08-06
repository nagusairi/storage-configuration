import { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Layers,
  Copy,
  Trash2,
  Edit3,
  Box,
  Maximize2,
  Sparkles,
  Calculator,
  Grid,
  CheckCircle2,
  Package,
  Wrench,
  Zap,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { WizardState, ZoneConfig, HierarchyModel, HierarchyLevel } from '../types';

interface StorageNode {
  id: string;
  name: string;
  code: string;
  levelDepth: number; // 0 = Zone (Level 1), 1 = Level 2 (e.g. Aisle), 2 = Level 3 (e.g. Rack), etc.
  businessLabel?: string; // For Level 1
  children?: StorageNode[];
  dimensions?: { width: number; depth: number; height: number; unit: string };
  capacity?: number;
  weightLimit?: number;
  barcodePattern?: string;
}

interface StorageLayoutBuilderStepProps {
  state: WizardState;
  onChange: (s: WizardState) => void;
}

export function StorageLayoutBuilderStep({ state, onChange }: StorageLayoutBuilderStepProps) {
  const activeZone = state.zones[0] ?? {
    id: 'zone-a',
    name: 'Zone A — General Storage',
    code: 'ZA',
    status: 'active' as const,
    hierarchyMode: 'default' as const,
    pickingStrategy: 'FIFO' as const,
    generation: { levels: [] }
  };

  const activeModel: HierarchyModel =
    activeZone.hierarchyMode === 'custom' && activeZone.customHierarchyModel
      ? activeZone.customHierarchyModel
      : state.hierarchyModel;

  const modelLevels = activeModel.levels;

  // ── Initial Mock Tree Generator ───────────────────────────────────────────
  const initialTree: StorageNode = useMemo(() => {
    return {
      id: activeZone.id,
      name: activeZone.name,
      code: activeZone.code,
      levelDepth: 0,
      businessLabel: 'General Storage',
      children: [
        {
          id: `${activeZone.id}-aisle-a`,
          name: 'Aisle A',
          code: 'A1',
          levelDepth: 1,
          children: [
            {
              id: `${activeZone.id}-rack-a1`,
              name: 'Rack A1',
              code: 'R1',
              levelDepth: 2,
              capacity: 250,
              dimensions: { width: 3, depth: 1.5, height: 4, unit: 'm' },
              children: [
                {
                  id: `${activeZone.id}-shelf-s1`,
                  name: 'Shelf S1',
                  code: 'S1',
                  levelDepth: 3,
                  capacity: 50,
                  children: [
                    { id: `${activeZone.id}-bin-b1`, name: 'Bin B01', code: 'B01', levelDepth: 4, capacity: 10 },
                    { id: `${activeZone.id}-bin-b2`, name: 'Bin B02', code: 'B02', levelDepth: 4, capacity: 10 }
                  ]
                },
                {
                  id: `${activeZone.id}-shelf-s2`,
                  name: 'Shelf S2',
                  code: 'S2',
                  levelDepth: 3,
                  capacity: 50,
                  children: [
                    { id: `${activeZone.id}-bin-b3`, name: 'Bin B03', code: 'B03', levelDepth: 4, capacity: 10 }
                  ]
                }
              ]
            },
            {
              id: `${activeZone.id}-rack-a2`,
              name: 'Rack A2',
              code: 'R2',
              levelDepth: 2,
              capacity: 250,
              children: []
            }
          ]
        },
        {
          id: `${activeZone.id}-aisle-b`,
          name: 'Aisle B',
          code: 'A2',
          levelDepth: 1,
          children: []
        }
      ]
    };
  }, [activeZone]);

  const [treeData, setTreeData] = useState<StorageNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialTree.id);
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([initialTree.id, `${activeZone.id}-aisle-a`]);
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Generation Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkPrefix, setBulkPrefix] = useState<string>('');

  // ── Find Selected Node ───────────────────────────────────────────────────
  const findNode = (node: StorageNode, id: string): StorageNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = useMemo(() => findNode(treeData, selectedNodeId) ?? treeData, [treeData, selectedNodeId]);

  const isLevel1 = selectedNode.levelDepth === 0;
  const currentLevelMeta: HierarchyLevel | undefined = modelLevels[selectedNode.levelDepth];
  const childLevelMeta: HierarchyLevel | undefined = modelLevels[selectedNode.levelDepth + 1];

  // ── Counts By Level ───────────────────────────────────────────────────────
  const countsByLevel = useMemo(() => {
    const counts: Record<string, number> = {};
    const traverse = (node: StorageNode) => {
      const levelName = modelLevels[node.levelDepth]?.pluralName ?? `Level ${node.levelDepth}`;
      counts[levelName] = (counts[levelName] ?? 0) + 1;
      node.children?.forEach(traverse);
    };
    traverse(treeData);
    return counts;
  }, [treeData, modelLevels]);

  const totalBinsCount = useMemo(() => {
    let leaves = 0;
    const countLeaves = (node: StorageNode) => {
      if (!node.children || node.children.length === 0) {
        leaves += 1;
      } else {
        node.children.forEach(countLeaves);
      }
    };
    countLeaves(treeData);
    return leaves;
  }, [treeData]);

  // ── Tree Mutators ─────────────────────────────────────────────────────────
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleAddIndividualChild = () => {
    if (!childLevelMeta) return;
    const nextChildIndex = (selectedNode.children?.length ?? 0) + 1;
    const newChild: StorageNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: `${childLevelMeta.name} ${childLevelMeta.codePrefix}${nextChildIndex}`,
      code: `${childLevelMeta.codePrefix}${nextChildIndex}`,
      levelDepth: selectedNode.levelDepth + 1,
      children: []
    };

    const updateRecursive = (curr: StorageNode): StorageNode => {
      if (curr.id === selectedNode.id) {
        return { ...curr, children: [...(curr.children ?? []), newChild] };
      }
      return { ...curr, children: curr.children?.map(updateRecursive) };
    };

    setTreeData(updateRecursive(treeData));
    if (!expandedNodeIds.includes(selectedNode.id)) {
      setExpandedNodeIds(prev => [...prev, selectedNode.id]);
    }
  };

  const handleBulkGenerateChildren = (count: number, prefixOverride?: string) => {
    if (!childLevelMeta || count <= 0) return;
    const prefix = prefixOverride || childLevelMeta.codePrefix || 'N';
    const startIdx = (selectedNode.children?.length ?? 0) + 1;
    const newChildren: StorageNode[] = Array.from({ length: count }, (_, idx) => {
      const num = startIdx + idx;
      return {
        id: `node-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        name: `${childLevelMeta.name} ${prefix}${num < 10 ? '0' + num : num}`,
        code: `${prefix}${num < 10 ? '0' + num : num}`,
        levelDepth: selectedNode.levelDepth + 1,
        children: []
      };
    });

    const updateRecursive = (curr: StorageNode): StorageNode => {
      if (curr.id === selectedNode.id) {
        return { ...curr, children: [...(curr.children ?? []), ...newChildren] };
      }
      return { ...curr, children: curr.children?.map(updateRecursive) };
    };

    setTreeData(updateRecursive(treeData));
    if (!expandedNodeIds.includes(selectedNode.id)) {
      setExpandedNodeIds(prev => [...prev, selectedNode.id]);
    }
    setShowGenerateModal(false);
  };

  const handleDeleteNode = (idToDelete: string) => {
    if (idToDelete === treeData.id) return;
    const deleteRecursive = (curr: StorageNode): StorageNode => {
      return {
        ...curr,
        children: curr.children?.filter(c => c.id !== idToDelete).map(deleteRecursive)
      };
    };

    setTreeData(deleteRecursive(treeData));
    if (selectedNodeId === idToDelete) {
      setSelectedNodeId(treeData.id);
    }
  };

  const handleUpdateNode = (updatedNode: Partial<StorageNode>) => {
    const updateRecursive = (curr: StorageNode): StorageNode => {
      if (curr.id === selectedNode.id) {
        return { ...curr, ...updatedNode };
      }
      return { ...curr, children: curr.children?.map(updateRecursive) };
    };
    setTreeData(updateRecursive(treeData));
  };

  // Reorder Child Node (Up or Down)
  const handleReorderChild = (childId: string, direction: 'up' | 'down') => {
    const updateRecursive = (curr: StorageNode): StorageNode => {
      if (!curr.children) return curr;
      const idx = curr.children.findIndex(c => c.id === childId);
      if (idx === -1) {
        return { ...curr, children: curr.children.map(updateRecursive) };
      }
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= curr.children.length) return curr;

      const newChildren = [...curr.children];
      const [moved] = newChildren.splice(idx, 1);
      newChildren.splice(targetIdx, 0, moved);
      return { ...curr, children: newChildren };
    };
    setTreeData(updateRecursive(treeData));
  };

  // ── Render Tree Node Recursively ──────────────────────────────────────────
  const renderTreeNode = (node: StorageNode) => {
    const isExpanded = expandedNodeIds.includes(node.id);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = !!node.children && node.children.length > 0;
    const levelMeta = modelLevels[node.levelDepth];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSelf = node.name.toLowerCase().includes(q) || node.code.toLowerCase().includes(q);
      const matchesChild = (n: StorageNode): boolean =>
        n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q) || (n.children?.some(matchesChild) ?? false);
      if (!matchesSelf && !matchesChild(node)) return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedNodeId(node.id)}
          style={{ paddingLeft: `${node.levelDepth * 16 + 8}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs transition-colors group ${
            isSelected
              ? 'bg-[#5C1F3D] text-white font-semibold shadow-2xs'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={e => toggleExpand(node.id, e)}
                className={`p-0.5 rounded hover:bg-black/10 transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 flex-shrink-0" />
            )}

            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded flex-shrink-0 ${
              isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {levelMeta?.codePrefix || `L${node.levelDepth + 1}`}
            </span>

            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1">
            {node.children && node.children.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {node.children.length}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* ── Live Summary Banner ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#d1def0] rounded-xl px-5 py-3 shadow-xs flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5C1F3D]/10 text-[#5C1F3D] flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#172B4D]">Live Storage Structure Summary</h4>
            <p className="text-[11px] text-gray-500">Real-time aggregate hierarchy counts for {activeZone.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {modelLevels.map((lvl, idx) => {
            const count = countsByLevel[lvl.pluralName] ?? countsByLevel[lvl.name] ?? (idx === 0 ? 1 : 0);
            return (
              <div key={lvl.id} className="bg-[#f7f8f9] border border-gray-200 px-3 py-1 rounded-lg flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{lvl.pluralName}:</span>
                <span className="text-xs font-bold font-mono text-[#172B4D]">{count.toLocaleString()}</span>
              </div>
            );
          })}
          <div className="bg-[#5C1F3D] text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Total Storage Units:</span>
            <span className="text-xs font-bold font-mono text-white">{totalBinsCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── 3-Panel Storage Layout Builder Workspace ───────────────────────── */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3">
        {/* ── LEFT PANEL: Storage Structure Navigator ─────────────────────── */}
        <div className="col-span-3 bg-white border border-[#d1def0] rounded-xl shadow-xs flex flex-col min-h-0">
          <div className="p-3 border-b border-gray-200 bg-[#fbfcfd] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#172B4D]">
              <Layers className="w-4 h-4 text-[#5C1F3D]" /> Storage Navigator
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Tree View</span>
          </div>

          <div className="p-2 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C1F3D]"
              />
            </div>
          </div>

          <div className="p-2 overflow-y-auto flex-1 space-y-0.5">
            {renderTreeNode(treeData)}
          </div>
        </div>

        {/* ── CENTER PANEL: Storage Layout Builder Canvas ──────────────────── */}
        <div className="col-span-6 bg-white border border-[#d1def0] rounded-xl shadow-xs flex flex-col min-h-0">
          <div className="p-3.5 border-b border-gray-200 bg-[#fbfcfd] flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172B4D]">{selectedNode.name}</span>
                <span className="text-[10px] font-mono bg-[#5C1F3D] text-white px-2 py-0.5 rounded font-bold">
                  {selectedNode.code}
                </span>
                <span className="text-xs text-gray-400">
                  ({currentLevelMeta?.name ?? 'Node'})
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {childLevelMeta ? `Contains ${selectedNode.children?.length ?? 0} ${childLevelMeta.pluralName}` : 'Leaf Node (No Child Levels)'}
              </p>
            </div>

            {childLevelMeta && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBulkPrefix(childLevelMeta.codePrefix);
                    setShowGenerateModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate Multiple
                </button>
                <button
                  onClick={handleAddIndividualChild}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add {childLevelMeta.name}
                </button>
              </div>
            )}
          </div>

          <div className="p-4 overflow-y-auto flex-1 bg-[#fcfdfe]">
            {!childLevelMeta ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                <h4 className="text-sm font-bold text-[#172B4D]">Leaf Storage Location</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  This level ({currentLevelMeta?.name}) represents the bottom endpoint of the active storage hierarchy.
                </p>
              </div>
            ) : !selectedNode.children || selectedNode.children.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                <Box className="w-10 h-10 text-gray-300 mb-2" />
                <h4 className="text-xs font-bold text-[#172B4D]">No {childLevelMeta.pluralName} Created Yet</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1 mb-4">
                  Add individual {childLevelMeta.name} elements or bulk-generate multiple storage units under {selectedNode.name}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBulkPrefix(childLevelMeta.codePrefix);
                      setShowGenerateModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate Multiple {childLevelMeta.pluralName}
                  </button>
                  <button
                    onClick={handleAddIndividualChild}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    + Add Single {childLevelMeta.name}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {selectedNode.children.map((child, idx) => {
                  const childSubCount = child.children?.length ?? 0;
                  const grandChildMeta = modelLevels[child.levelDepth + 1];

                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedNodeId(child.id)}
                      className="bg-white border border-[#d1def0] rounded-xl p-3.5 shadow-2xs hover:border-[#5C1F3D] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-[#5C1F3D] text-white px-2 py-0.5 rounded">
                              {child.code}
                            </span>
                            <span className="text-xs font-bold text-[#172B4D] truncate">{child.name}</span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={idx === 0}
                              onClick={e => {
                                e.stopPropagation();
                                handleReorderChild(child.id, 'up');
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === selectedNode.children!.length - 1}
                              onClick={e => {
                                e.stopPropagation();
                                handleReorderChild(child.id, 'down');
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteNode(child.id);
                              }}
                              className="p-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded"
                              title={`Delete ${child.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Level Type:</span>
                            <span className="font-semibold text-gray-700">{childLevelMeta.name}</span>
                          </div>
                          {grandChildMeta && (
                            <div className="flex justify-between">
                              <span>Child {grandChildMeta.pluralName}:</span>
                              <span className="font-mono font-bold text-[#172B4D]">{childSubCount}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#5C1F3D]">
                        <span>Inspect & Build →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Properties Inspector (Level 1 vs Level 2+) ────────── */}
        <div className="col-span-3 bg-white border border-[#d1def0] rounded-xl shadow-xs flex flex-col min-h-0">
          <div className="p-3.5 border-b border-gray-200 bg-[#fbfcfd] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#172B4D]">
              <Wrench className="w-4 h-4 text-[#5C1F3D]" /> Properties Inspector
            </div>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
              Level {selectedNode.levelDepth + 1}: {currentLevelMeta?.name ?? 'Node'}
            </span>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            {/* LEVEL 1 SPECIALIZED NAMING CONTROL */}
            {isLevel1 ? (
              <div className="bg-[#f7f8f9] border border-gray-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#172B4D]">Level 1 Hierarchy Naming</span>
                  <span className="text-[10px] text-gray-400">Fixed Prefix</span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 font-semibold mb-1">
                    Hierarchy Level Prefix (Read-Only)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentLevelMeta?.name ?? 'Zone'}
                    className="w-full text-xs p-2 border border-gray-200 bg-gray-100 rounded-lg font-mono font-bold text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Business Label
                  </label>
                  <input
                    type="text"
                    value={selectedNode.businessLabel ?? 'General Storage'}
                    onChange={e => {
                      const newLabel = e.target.value;
                      const levelName = currentLevelMeta?.name ?? 'Zone';
                      handleUpdateNode({
                        businessLabel: newLabel,
                        name: `${levelName} – ${newLabel}`
                      });
                    }}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5C1F3D] font-bold text-[#172B4D]"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Live Preview:</span>
                  <span className="font-mono font-bold text-[#172B4D]">
                    {currentLevelMeta?.name ?? 'Zone'} – {selectedNode.businessLabel ?? 'General Storage'}
                  </span>
                </div>
              </div>
            ) : (
              /* LEVEL 2+ INSTANCE NAMING CONTROL */
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Instance Name</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={e => handleUpdateNode({ name: e.target.value })}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5C1F3D] font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Node Code</label>
              <input
                type="text"
                value={selectedNode.code}
                onChange={e => handleUpdateNode({ code: e.target.value.toUpperCase() })}
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5C1F3D] font-mono font-bold"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Hierarchy Level:</span>
                <span className="font-bold text-[#172B4D]">{currentLevelMeta?.name ?? 'Zone'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Child Level Type:</span>
                <span className="font-semibold text-purple-800">{childLevelMeta?.name ?? 'None (Leaf)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Direct Children:</span>
                <span className="font-mono font-bold">{selectedNode.children?.length ?? 0}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Storage Capacity (Units)</label>
              <input
                type="number"
                value={selectedNode.capacity ?? ''}
                placeholder="e.g. 250"
                onChange={e => handleUpdateNode({ capacity: parseInt(e.target.value) || undefined })}
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5C1F3D]"
              />
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2">
              {childLevelMeta && (
                <button
                  onClick={() => {
                    setBulkPrefix(childLevelMeta.codePrefix);
                    setShowGenerateModal(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Bulk Generate {childLevelMeta.pluralName}
                </button>
              )}

              {!isLevel1 && (
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="w-full px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected Instance
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bulk Node Generation Modal ─────────────────────────────────────── */}
      {showGenerateModal && childLevelMeta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#d1def0] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5C1F3D]" />
                <h3 className="text-base font-bold text-[#172B4D]">
                  Generate Multiple {childLevelMeta.pluralName}
                </h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Bulk-create child {childLevelMeta.name} elements directly under <strong>{selectedNode.name}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Number of {childLevelMeta.pluralName} to Generate
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={bulkCount}
                  onChange={e => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#5C1F3D]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Code Prefix</label>
                <input
                  type="text"
                  value={bulkPrefix}
                  onChange={e => setBulkPrefix(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#5C1F3D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleBulkGenerateChildren(bulkCount, bulkPrefix)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#5C1F3D] hover:bg-[#4a1831] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate {bulkCount} {childLevelMeta.pluralName}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
