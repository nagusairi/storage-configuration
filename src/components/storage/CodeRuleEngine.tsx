import { useState } from 'react';
import { 
  Plus, GripVertical, Trash2, Copy, Settings, Play, 
  AlertTriangle, ChevronRight, ChevronDown, CheckCircle2,
  Info, Beaker, Code2, Zap, Target
} from 'lucide-react';
import { StyledSelect, MenuItem } from '../ui/StyledSelect';
import { StyledTextField } from '../ui/StyledTextField';

interface CodeSegment {
  id: string;
  type: 'warehouse' | 'zone' | 'aisle' | 'rack' | 'shelf' | 'bin';
  label: string;
  enabled: boolean;
  padding?: number;
}

interface Rule {
  id: string;
  enabled: boolean;
  priority: number;
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  actions: {
    type: string;
    value: string;
  }[];
}

export function CodeRuleEngine() {
  const [separator, setSeparator] = useState('-');
  const [includeZoneCode, setIncludeZoneCode] = useState(true);
  const [codeSegments, setCodeSegments] = useState<CodeSegment[]>([
    { id: '1', type: 'warehouse', label: 'Warehouse', enabled: true },
    { id: '2', type: 'zone', label: 'Zone', enabled: true },
    { id: '3', type: 'aisle', label: 'Aisle', enabled: true, padding: 2 },
    { id: '4', type: 'rack', label: 'Rack', enabled: true, padding: 2 },
    { id: '5', type: 'shelf', label: 'Shelf', enabled: true, padding: 2 },
    { id: '6', type: 'bin', label: 'Bin', enabled: true, padding: 2 }
  ]);

  const [aislesPerZone, setAislesPerZone] = useState(4);
  const [racksPerAisle, setRacksPerAisle] = useState(8);
  const [shelvesPerRack, setShelvesPerRack] = useState(5);
  const [binsPerShelf, setBinsPerShelf] = useState(6);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      enabled: true,
      priority: 1,
      conditions: [
        { field: 'Category', operator: 'equals', value: 'Frozen Food' },
        { field: 'Temperature', operator: 'less_than', value: '8' }
      ],
      actions: [
        { type: 'zone', value: 'Cold Storage' },
        { type: 'strategy', value: 'FEFO' }
      ]
    }
  ]);

  const [defaultStrategy, setDefaultStrategy] = useState('closest');
  const [allowBinSharing, setAllowBinSharing] = useState(false);
  const [enableOverflow, setEnableOverflow] = useState(true);
  const [autoReassignment, setAutoReassignment] = useState(true);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    codeBuilder: true,
    generation: true,
    rules: true,
    strategy: true,
    simulation: false,
    preview: true
  });

  const [simulationItem, setSimulationItem] = useState({
    name: '',
    category: '',
    weight: '',
    temperature: ''
  });

  const [simulationResult, setSimulationResult] = useState<any>(null);

  const totalBins = aislesPerZone * racksPerAisle * shelvesPerRack * binsPerShelf;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generatePreviewCode = () => {
    const segments: string[] = [];
    
    codeSegments.forEach(segment => {
      if (segment.enabled) {
        switch (segment.type) {
          case 'warehouse':
            segments.push('HYD1');
            break;
          case 'zone':
            if (includeZoneCode) segments.push('ZP');
            break;
          case 'aisle':
            segments.push('A' + '01'.padStart(segment.padding || 2, '0'));
            break;
          case 'rack':
            segments.push('R' + '01'.padStart(segment.padding || 2, '0'));
            break;
          case 'shelf':
            segments.push('S' + '01'.padStart(segment.padding || 2, '0'));
            break;
          case 'bin':
            segments.push('B' + '01'.padStart(segment.padding || 2, '0'));
            break;
        }
      }
    });

    return segments.join(separator);
  };

  const runSimulation = () => {
    // Simple simulation logic
    setSimulationResult({
      assignedZone: 'Cold Storage',
      assignedBin: 'HYD1-ZC-A02-R03-S02-B05',
      strategy: 'FEFO',
      matchedRule: 'Rule 1: Frozen Food → Cold Storage'
    });
  };

  const previewLocations = [
    { code: 'HYD1-ZP-A01-R01-S01-B01', zone: 'Picking', capacity: '100kg', status: 'available' },
    { code: 'HYD1-ZP-A01-R01-S01-B02', zone: 'Picking', capacity: '100kg', status: 'available' },
    { code: 'HYD1-ZP-A01-R01-S01-B03', zone: 'Picking', capacity: '100kg', status: 'reserved' },
    { code: 'HYD1-ZC-A02-R01-S01-B01', zone: 'Cold Storage', capacity: '80kg', status: 'available' },
    { code: 'HYD1-ZH-A03-R01-S01-B01', zone: 'Hazard', capacity: '120kg', status: 'blocked' }
  ];

  return (
    <div className="flex gap-6 h-full">
      {/* LEFT PANEL - Configuration (65%) */}
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="space-y-6">
          {/* Section 1: Location Code Builder */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('codeBuilder')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-medium text-gray-900">Location Code Builder</h3>
              </div>
              {expandedSections.codeBuilder ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.codeBuilder && (
              <div className="px-6 pb-6 space-y-4">
                {/* Code Segments */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-700 mb-2">Code Structure</label>
                  <div className="space-y-2">
                    {codeSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <input
                          type="checkbox"
                          checked={segment.enabled}
                          onChange={(e) => {
                            setCodeSegments(prev =>
                              prev.map(s => s.id === segment.id ? { ...s, enabled: e.target.checked } : s)
                            );
                          }}
                          className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                        />
                        <span className="flex-1 text-sm text-gray-700">{segment.label}</span>
                        {segment.padding !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Digits:</span>
                            <input
                              type="number"
                              min="1"
                              max="4"
                              value={segment.padding}
                              onChange={(e) => {
                                setCodeSegments(prev =>
                                  prev.map(s => s.id === segment.id ? { ...s, padding: parseInt(e.target.value) } : s)
                                );
                              }}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Separator</label>
                    <StyledSelect
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="-" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Hyphen (-)</MenuItem>
                      <MenuItem value="/" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Slash (/)</MenuItem>
                      <MenuItem value="." style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Dot (.)</MenuItem>
                      <MenuItem value="_" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Underscore (_)</MenuItem>
                    </StyledSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Zone Code</label>
                    <div className="flex items-center h-[33px] px-3 bg-gray-50 rounded-[3px] border border-gray-300">
                      <input
                        type="checkbox"
                        checked={includeZoneCode}
                        onChange={(e) => setIncludeZoneCode(e.target.checked)}
                        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include Zone Code</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-900">Code Preview</span>
                  </div>
                  <code className="text-sm font-mono text-blue-900">{generatePreviewCode()}</code>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Location Generation Rules */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('generation')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-medium text-gray-900">Location Generation Rules</h3>
              </div>
              {expandedSections.generation ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.generation && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                {/* Total Output */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-900">Total Generated Locations</span>
                    <span className="text-2xl font-semibold text-purple-900">{totalBins.toLocaleString()} bins</span>
                  </div>
                </div>

                {/* Capacity Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Weight per Bin</label>
                    <StyledTextField
                      type="number"
                      placeholder="100"
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Volume per Shelf</label>
                    <StyledTextField
                      type="number"
                      placeholder="500"
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Temperature Range</label>
                    <StyledTextField
                      type="text"
                      placeholder="e.g., -20°C to 5°C"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Hazard Allowed</label>
                    <StyledSelect
                      defaultValue="no"
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="no" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>No</MenuItem>
                      <MenuItem value="yes" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Yes</MenuItem>
                    </StyledSelect>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Storage Assignment Rule Engine */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('rules')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-medium text-gray-900">Storage Assignment Rules</h3>
              </div>
              {expandedSections.rules ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.rules && (
              <div className="px-6 pb-6 space-y-4">
                {/* Rules List */}
                {rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-gray-500">PRIORITY {rule.priority}</span>
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={(e) => {
                                setRules(prev =>
                                  prev.map(r => r.id === rule.id ? { ...r, enabled: e.target.checked } : r)
                                );
                              }}
                              className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                            />
                            <span className="text-sm text-gray-700">Rule {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-100 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* Conditions */}
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 mb-2 block">IF</span>
                          <div className="space-y-2">
                            {rule.conditions.map((condition, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                {idx > 0 && <span className="text-xs text-gray-500">AND</span>}
                                <span className="text-gray-700">{condition.field}</span>
                                <span className="text-gray-500">{condition.operator === 'equals' ? '=' : '≤'}</span>
                                <span className="font-medium text-gray-900">{condition.value}{condition.field === 'Temperature' ? '°C' : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 mb-2 block">THEN</span>
                          <div className="space-y-2">
                            {rule.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-gray-700 capitalize">{action.type}</span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="font-medium text-blue-900">{action.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Rule Button */}
                <button
                  className="w-full px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Rule</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Storage Strategy Settings */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('strategy')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-medium text-gray-900">Storage Strategy Settings</h3>
              </div>
              {expandedSections.strategy ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.strategy && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Default Strategy</label>
                  <StyledSelect
                    value={defaultStrategy}
                    onChange={(e) => setDefaultStrategy(e.target.value)}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="closest" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Closest Available Bin</MenuItem>
                    <MenuItem value="fifo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>FIFO (First In First Out)</MenuItem>
                    <MenuItem value="fefo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>FEFO (First Expiry First Out)</MenuItem>
                    <MenuItem value="fixed" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Fixed Bin</MenuItem>
                    <MenuItem value="random" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Random Storage</MenuItem>
                  </StyledSelect>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Allow Bin Sharing</span>
                    <input
                      type="checkbox"
                      checked={allowBinSharing}
                      onChange={(e) => setAllowBinSharing(e.target.checked)}
                      className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Enable Overflow Zone</span>
                    <input
                      type="checkbox"
                      checked={enableOverflow}
                      onChange={(e) => setEnableOverflow(e.target.checked)}
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

          {/* Section 5: Rule Simulation */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('simulation')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-medium text-gray-900">Rule Simulation</h3>
              </div>
              {expandedSections.simulation ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.simulation && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Item Name</label>
                    <StyledTextField
                      type="text"
                      placeholder="e.g., Frozen Chicken"
                      value={simulationItem.name}
                      onChange={(e) => setSimulationItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Category</label>
                    <StyledTextField
                      type="text"
                      placeholder="e.g., Food"
                      value={simulationItem.category}
                      onChange={(e) => setSimulationItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Weight (kg)</label>
                    <StyledTextField
                      type="number"
                      placeholder="10"
                      value={simulationItem.weight}
                      onChange={(e) => setSimulationItem(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Temperature (°C)</label>
                    <StyledTextField
                      type="number"
                      placeholder="2"
                      value={simulationItem.temperature}
                      onChange={(e) => setSimulationItem(prev => ({ ...prev, temperature: e.target.value }))}
                      className="w-full no-spinner"
                    />
                  </div>
                </div>

                <button
                  onClick={runSimulation}
                  className="w-full px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                  style={{ height: '33px' }}
                >
                  <Play className="w-4 h-4" />
                  <span>Run Simulation</span>
                </button>

                {/* Simulation Result */}
                {simulationResult && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Simulation Result</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700">Assigned Zone:</span>
                        <span className="font-medium text-green-900">{simulationResult.assignedZone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700">Assigned Bin:</span>
                        <code className="font-mono text-green-900">{simulationResult.assignedBin}</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700">Strategy Used:</span>
                        <span className="font-medium text-green-900">{simulationResult.strategy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700">Matched Rule:</span>
                        <span className="font-medium text-green-900">{simulationResult.matchedRule}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Preview (35%) */}
      <div className="w-[35%] flex-shrink-0 space-y-6">
        {/* Generated Code Preview */}
        <div className="bg-white border border-gray-200 rounded-lg sticky top-0">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">Generated Locations</h3>
            <p className="text-xs text-gray-500 mt-1">Preview of auto-generated location codes</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Location Code</th>
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
                              : 'bg-red-50 text-red-700 border border-red-200'
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

        {/* Rule Conflict Detection */}
        <div className="bg-white border border-orange-200 rounded-lg">
          <div className="px-6 py-4 bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-medium text-orange-900">Rule Conflict Detected</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-900">Item Category:</span>
              <span className="text-sm text-gray-700 ml-2">Chemical</span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500 block">MATCHES</span>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Rule 1</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-900">Hazard Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Rule 3</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-900">Bulk Zone</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Suggested Fix</span>
              </div>
              <p className="text-xs text-blue-700">Increase priority of Hazard rule to ensure safety compliance.</p>
            </div>
            <button
              className="w-full px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
              style={{ height: '33px' }}
            >
              <span>Resolve Conflict</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
