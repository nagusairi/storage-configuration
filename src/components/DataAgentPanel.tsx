import { ReactNode } from 'react';
import { Sparkles, XCircle, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface DataAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  analyzing?: boolean;
  children?: ReactNode;
}

export function DataAgentPanel({ 
  isOpen, 
  onClose, 
  analyzing = false,
  children
}: DataAgentPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border border-gray-300 rounded-lg p-4 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded">
            <Sparkles className="w-4 h-4 text-[#5C1F3D]" />
          </div>
          <h3 className="text-sm text-gray-900">AI Data Agent</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <XCircle className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {analyzing ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C1F3D] mb-3"></div>
          <p className="text-xs text-gray-500">Analyzing data...</p>
        </div>
      ) : children ? (
        children
      ) : (
        // Default Data Agent Content
        <div className="space-y-4">
          {/* Data Health Score */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 uppercase">Data Health</h4>
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-900">Excellent</span>
                <span className="text-lg text-green-900">95/100</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="mt-2 space-y-1 text-xs text-green-700">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>All records validated</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>No duplicates found</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Data integrity maintained</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 uppercase">Smart Insights</h4>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-blue-900">Positive Trend</div>
                    <div className="text-blue-700 mt-0.5">Activity increased by 15% this quarter</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded text-xs">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-purple-900">AI Prediction</div>
                    <div className="text-purple-700 mt-0.5">Expected completion: 3-5 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 uppercase">Recommendations</h4>
            <div className="space-y-2">
              <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded hover:shadow-sm transition-all text-left text-xs">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-900">Optimize workflow</div>
                    <div className="text-gray-500 mt-0.5">AI suggests 3 improvements</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded hover:shadow-sm transition-all text-left text-xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-900">Review items</div>
                    <div className="text-gray-500 mt-0.5">2 items need attention</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 uppercase">Statistics</h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processed Today:</span>
                  <span className="text-gray-900">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="text-gray-900">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Processing Time:</span>
                  <span className="text-gray-900">2.3s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
