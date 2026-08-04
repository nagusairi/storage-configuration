import { useState } from 'react';
import { ChevronRight, ChevronDown, Warehouse, MapPin, Grid3x3, Package as PackageIcon, Layers, Archive } from 'lucide-react';
import { StorageNode } from '../../data/mockStorageData';
import { getColorDisplay } from '../../utils/zoneColors';

interface HierarchyTreeProps {
  data: StorageNode[];
  selectedNodeId: string | null;
  onNodeSelect: (node: StorageNode) => void;
  searchTerm?: string;
}

interface TreeNodeProps {
  node: StorageNode;
  depth: number;
  selectedNodeId: string | null;
  onNodeSelect: (node: StorageNode) => void;
  searchTerm?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'warehouse':
      return <Warehouse className="w-4 h-4 text-purple-600" />;
    case 'zone':
      return <MapPin className="w-4 h-4 text-blue-600" />;
    case 'aisle':
      return <Grid3x3 className="w-4 h-4 text-green-600" />;
    case 'rack':
      return <PackageIcon className="w-4 h-4 text-orange-600" />;
    case 'shelf':
      return <Layers className="w-4 h-4 text-indigo-600" />;
    case 'bin':
      return <Archive className="w-4 h-4 text-gray-600" />;
    default:
      return <PackageIcon className="w-4 h-4 text-gray-600" />;
  }
};

const getOccupancyBadge = (node: StorageNode) => {
  // Check if capacity exists and has required properties
  if (!node.capacity || typeof node.capacity.occupied === 'undefined' || typeof node.capacity.total === 'undefined') {
    return null;
  }
  
  const percentage = (node.capacity.occupied / node.capacity.total) * 100;
  
  let colorClass = '';
  if (percentage < 50) {
    colorClass = 'bg-green-50 text-green-700 border-green-200';
  } else if (percentage < 80) {
    colorClass = 'bg-orange-50 text-orange-700 border-orange-200';
  } else {
    colorClass = 'bg-red-50 text-red-700 border-red-200';
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${colorClass}`}>
      {Math.round(percentage)}%
    </span>
  );
};

const TreeNode = ({ node, depth, selectedNodeId, onNodeSelect, searchTerm }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(depth < 2); // Auto-expand first 2 levels
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedNodeId;
  const indentPadding = depth * 16;

  // Search filtering
  const matchesSearch = !searchTerm || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase());

  if (!matchesSearch) return null;

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors rounded
          ${isSelected 
            ? 'bg-blue-50 border-l-2 border-[#5C1F3D]' 
            : 'hover:bg-gray-50'
          }
        `}
        style={{ paddingLeft: `${indentPadding + 12}px` }}
        onClick={() => onNodeSelect(node)}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNodeSelect(node);
          }
          if (e.key === 'ArrowRight' && hasChildren && !expanded) {
            e.preventDefault();
            setExpanded(true);
          }
          if (e.key === 'ArrowLeft' && hasChildren && expanded) {
            e.preventDefault();
            setExpanded(false);
          }
        }}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 flex-shrink-0">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="hover:bg-gray-200 rounded transition-colors p-0.5"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Type Icon */}
        <div className="flex-shrink-0">
          {getTypeIcon(node.type)}
        </div>

        {/* Zone Color Badge (only for zones) */}
        {node.type === 'zone' && node.colorTag && (() => {
          const colorDisplay = getColorDisplay(node.colorTag);
          const isCustom = node.colorTag.startsWith('#');
          
          return (
            <div 
              className={`w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm ${!isCustom ? colorDisplay.bg : ''}`}
              style={isCustom ? { backgroundColor: node.colorTag } : undefined}
              title={`Zone Color: ${colorDisplay.label}`}
            />
          );
        })()}

        {/* Node Name */}
        <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">
          {node.name}
        </span>

        {/* Occupancy Badge */}
        <div className="flex-shrink-0">
          {getOccupancyBadge(node)}
        </div>
      </div>

      {/* Render Children */}
      {hasChildren && expanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function HierarchyTree({ data, selectedNodeId, onNodeSelect, searchTerm }: HierarchyTreeProps) {
  return (
    <div className="space-y-1" role="tree">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedNodeId={selectedNodeId}
          onNodeSelect={onNodeSelect}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}