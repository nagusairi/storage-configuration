import React from 'react';
import { Sparkles, ChevronRight, ChevronLeft, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface AITip {
  id: string;
  type: 'tip' | 'warning' | 'help';
  title: string;
  description: string;
}

interface AIAssistPanelProps {
  stepTitle: string;
  tips: AITip[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AIAssistPanel({ stepTitle, tips, isCollapsed = false, onToggleCollapse }: AIAssistPanelProps) {
  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg transition-all duration-300 sticky top-6 self-start ${
        isCollapsed ? 'w-12' : 'w-56'
      }`}
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      {/* Header */}
      <div className="p-3 border-b border-purple-200 flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-900">AI Assist</span>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-purple-100 rounded transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand AI panel' : 'Collapse AI panel'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-purple-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-purple-600" />
          )}
        </button>
      </div>

      {/* Content - Scrollable */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          {/* Step Context */}
          <div className="pb-3 border-b border-purple-200">
            <h4 className="text-sm text-purple-900 mb-1">{stepTitle}</h4>
            <p className="text-xs text-purple-700">AI-powered guidance for this step</p>
          </div>

          {/* Tips */}
          <div className="space-y-3">
            {tips.map((tip) => {
              const Icon = tip.type === 'tip' ? Lightbulb : tip.type === 'warning' ? AlertTriangle : HelpCircle;
              const iconColor = tip.type === 'tip' ? 'text-purple-600' : tip.type === 'warning' ? 'text-yellow-600' : 'text-blue-600';
              const bgColor = tip.type === 'tip' ? 'bg-purple-100' : tip.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100';

              return (
                <div key={tip.id} className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 ${bgColor} rounded flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 mb-1">{tip.title}</p>
                      <p className="text-xs text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Status */}
          <div className="pt-3 border-t border-purple-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-purple-700">AI assistance active</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed State Icon */}
      {isCollapsed && (
        <div className="p-3 flex flex-col items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      )}
    </div>
  );
}