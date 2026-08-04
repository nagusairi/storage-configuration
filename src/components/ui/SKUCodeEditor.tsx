import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Edit, X, Sparkles, Check, Trash2 } from 'lucide-react';

interface SKUCodeEditorProps {
  value: string;
  vendorInfo: {
    vendorName: string;
    vendorCode: string;
    id: number;
  };
  onChange: (newSKU: string) => void;
  placeholder?: string;
  autoGenerateSuggestions?: boolean;
  className?: string;
}

/**
 * SKUCodeEditor - Reusable inline SKU code editor with AI suggestions
 * 
 * Features:
 * - Click to edit inline
 * - AI-powered SKU suggestions in a portal dropdown (overlaps table)
 * - Purple gradient header with sparkle icon
 * - Auto-save on suggestion selection
 * - Position-aware dropdown (uses React Portal to escape table clipping)
 * 
 * Usage:
 * ```tsx
 * <SKUCodeEditor
 *   value={vendor.skuCode}
 *   vendorInfo={{ vendorName: vendor.vendorName, vendorCode: vendor.vendorCode, id: vendor.id }}
 *   onChange={(newSKU) => handleSKUChange(vendor.id, newSKU)}
 * />
 * ```
 */
export function SKUCodeEditor({
  value,
  vendorInfo,
  onChange,
  placeholder = 'Enter SKU code...',
  autoGenerateSuggestions = true,
  className = ''
}: SKUCodeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSKU, setTempSKU] = useState(value);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number | null>(null);
  const [inputPosition, setInputPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate AI-powered SKU suggestions based on vendor context
  const generateAISuggestions = () => {
    const suggestions = [
      `${vendorInfo.vendorCode}-PROD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      `SKU-${vendorInfo.vendorName.substring(0, 4).toUpperCase()}-${new Date().getFullYear()}`,
      `VNDR-${vendorInfo.id}-ITEM-${Math.floor(Math.random() * 9000) + 1000}`,
      `${vendorInfo.vendorCode}-${Math.floor(Math.random() * 90000) + 10000}`
    ];
    
    setAiSuggestions(suggestions);
  };

  // Update input position when editing starts
  useEffect(() => {
    if (inputRef.current && isEditing) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isEditing]);

  // Handle start editing
  const handleStartEdit = () => {
    setIsEditing(true);
    setTempSKU(value);
    
    // Generate AI suggestions if SKU is empty and auto-generation is enabled
    if (autoGenerateSuggestions && (!value || value.trim() === '')) {
      generateAISuggestions();
    } else {
      setAiSuggestions([]);
    }
  };

  // Handle save SKU
  const handleSave = () => {
    onChange(tempSKU);
    handleCancel();
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setTempSKU(value);
    setAiSuggestions([]);
    setSelectedSuggestionIndex(null);
    setInputPosition(null);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string, index: number) => {
    setTempSKU(suggestion);
    setSelectedSuggestionIndex(index);
    // Auto-save when selecting a suggestion
    setTimeout(() => {
      onChange(suggestion);
      handleCancel();
    }, 100);
  };

  // Handle click outside to save
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't close if clicking on the input or dropdown
      if (
        inputRef.current?.contains(target) ||
        target.closest('.sku-suggestions-dropdown')
      ) {
        return;
      }
      
      // Save on click outside
      handleSave();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, tempSKU]);

  if (isEditing) {
    return (
      <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
        {/* Input Field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={tempSKU}
            onChange={(e) => setTempSKU(e.target.value)}
            className="w-full pl-3 pr-16 py-1.5 text-sm font-mono border border-[#5C1F3D] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] bg-white"
            style={{ minWidth: '200px', height: '32px' }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          {/* Action Icons - Tick (Save) and X (Cancel) */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-0.5 hover:bg-green-100 rounded transition-colors"
              title="Save SKU code"
            >
              <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="p-0.5 hover:bg-red-100 rounded transition-colors"
              title="Cancel editing"
            >
              <X className="w-4 h-4 text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
        
        {/* AI Suggestions Dropdown Panel - Rendered via Portal to escape table clipping */}
        {aiSuggestions.length > 0 && inputPosition && createPortal(
          <div 
            className="sku-suggestions-dropdown fixed bg-white border border-purple-200 rounded-lg shadow-2xl z-[9999] w-[280px]"
            style={{ 
              top: `${inputPosition.top + 4}px`,
              left: `${inputPosition.left}px`,
              maxHeight: '300px', 
              overflowY: 'auto' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">AI Smart Suggestions</span>
              </div>
              <p className="text-xs text-purple-700 mt-0.5">
                Select a code below or type your own
              </p>
            </div>
            
            {/* Suggestions List */}
            <div className="p-2 space-y-1">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSuggestion(suggestion, index);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm font-mono rounded-[3px] transition-colors hover:bg-purple-50 ${
                    selectedSuggestionIndex === index
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'text-gray-700 border border-transparent'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-center">
              <span className="text-xs text-gray-500">Click to select or press Enter to save</span>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // Default view - empty or existing SKU
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="cursor-pointer group flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit();
        }}
      >
        {value ? (
          <span className="text-sm text-gray-900 font-mono whitespace-nowrap">{value}</span>
        ) : (
          <span className="text-sm text-purple-600 italic flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Add SKU Code
          </span>
        )}
        <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Delete/Clear button - only show if SKU exists */}
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(''); // Clear the SKU
          }}
          className="p-0.5 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="Remove SKU code"
        >
          <Trash2 className="w-3 h-3 text-red-500 hover:text-red-600" />
        </button>
      )}
    </div>
  );
}