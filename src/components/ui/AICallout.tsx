import React from 'react';
import { Sparkles, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface AICalloutProps {
  type?: 'info' | 'success' | 'warning' | 'suggestion';
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  confidence?: number;
}

export function AICallout({ 
  type = 'info', 
  message, 
  onDismiss, 
  actionLabel,
  onAction,
  confidence 
}: AICalloutProps) {
  const styles = {
    info: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      icon: Info,
      iconColor: 'text-purple-600'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    suggestion: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      icon: Sparkles,
      iconColor: 'text-purple-600'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4 relative`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${style.text}`}>{message}</p>
          
          {/* Confidence Score */}
          {confidence !== undefined && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Confidence:</span>
                <div className="flex-1 max-w-[120px] h-1.5 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-xs text-gray-900">{confidence}%</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-3 px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
