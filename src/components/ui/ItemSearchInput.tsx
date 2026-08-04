import React, { useState, useRef, useEffect } from 'react';
import { Search, Package, Sparkles, ChevronDown, X, AlertCircle } from 'lucide-react';

/**
 * ItemSearchInput Component
 * 
 * A comprehensive item search and selection component with intelligent autocomplete:
 * - Smart search across item name, SKU, barcode, category
 * - Dual display mode: Show item name or SKU in input
 * - Rich suggestions with item details (SKU, price, stock, category)
 * - Keyboard navigation support (Arrow keys, Enter, Escape)
 * - AI-powered suggestions based on context
 * - Visual stock level indicators
 * - Grouped suggestions (Recent, AI-suggested, All Items)
 * - Clear/reset functionality
 * - Accessibility support with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <ItemSearchInput
 *   value={selectedItem}
 *   onChange={(item) => setSelectedItem(item)}
 *   items={inventoryItems}
 *   displayMode="name"
 *   placeholder="Search by item name, SKU, or category"
 *   showStockLevel
 *   aiSuggestions={[
 *     { itemId: 1, reason: 'Frequently purchased together' }
 *   ]}
 *   required
 * />
 * ```
 */

export interface InventoryItem {
  id: number | string;
  itemName: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  imageUrl?: string;
  unit?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface ItemSuggestion {
  itemId: number | string;
  reason: string;
  confidence?: number;
}

export interface ItemSearchInputProps {
  // Core Value
  value: InventoryItem | null;
  onChange: (item: InventoryItem | null) => void;
  
  // Data Source
  items: InventoryItem[];
  
  // Display Configuration
  displayMode?: 'name' | 'sku'; // What to show in the input field
  placeholder?: string;
  
  // AI Features
  aiSuggestions?: ItemSuggestion[];
  recentItems?: (number | string)[]; // Recent item IDs
  
  // Visual Options
  showStockLevel?: boolean;
  showPrice?: boolean;
  showCategory?: boolean;
  showImage?: boolean;
  
  // Validation
  required?: boolean;
  disabled?: boolean;
  error?: string;
  
  // Filtering
  filterOutOfStock?: boolean;
  categoryFilter?: string;
  
  // Labels
  label?: string;
  noResultsText?: string;
  
  // Styling
  className?: string;
  
  // Callbacks
  onSearchChange?: (searchTerm: string) => void;
  onClear?: () => void;
}

export function ItemSearchInput({
  value,
  onChange,
  items,
  displayMode = 'name',
  placeholder = 'Search by item name, SKU, or category...',
  aiSuggestions = [],
  recentItems = [],
  showStockLevel = true,
  showPrice = true,
  showCategory = true,
  showImage = false,
  required = false,
  disabled = false,
  error,
  filterOutOfStock = false,
  categoryFilter,
  label = 'Select Item',
  noResultsText = 'No items found',
  className = '',
  onSearchChange,
  onClear
}: ItemSearchInputProps) {
  // Internal state
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    } else {
      setDropdownPosition(null);
    }
  }, [showDropdown]);

  // Filter items based on search term and filters
  const filteredItems = React.useMemo(() => {
    let filtered = items;

    // Apply out of stock filter
    if (filterOutOfStock) {
      filtered = filtered.filter(item => item.status !== 'Out of Stock' && item.stock > 0);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(lowerSearch) ||
        item.sku.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch) ||
        (item.barcode && item.barcode.toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  }, [items, searchTerm, filterOutOfStock, categoryFilter]);

  // Group filtered items
  const groupedItems = React.useMemo(() => {
    const aiItemIds = aiSuggestions.map(s => s.itemId);
    const recentItemIds = recentItems;

    const aiItems = filteredItems.filter(item => aiItemIds.includes(item.id));
    const recent = filteredItems.filter(item => 
      recentItemIds.includes(item.id) && !aiItemIds.includes(item.id)
    );
    const other = filteredItems.filter(item => 
      !aiItemIds.includes(item.id) && !recentItemIds.includes(item.id)
    );

    return { aiItems, recent, other };
  }, [filteredItems, aiSuggestions, recentItems]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle item selection
  const handleSelectItem = (item: InventoryItem) => {
    onChange(item);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setInputFocused(false);
  };

  // Handle clear
  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    if (onClear) {
      onClear();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);
    
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allItems = [
      ...groupedItems.aiItems,
      ...groupedItems.recent,
      ...groupedItems.other
    ];

    if (allItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setShowDropdown(true);
        setHighlightedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const selectedItem = allItems[highlightedIndex];
        handleSelectItem(selectedItem);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }
  };

  // Get stock level color
  const getStockLevelColor = (status?: string, stock?: number) => {
    if (status === 'Out of Stock' || stock === 0) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    if (status === 'Low Stock' || (stock && stock < 10)) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // Render text with highlighted match
  const renderHighlightedText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);

    if (matchIndex >= 0) {
      return (
        <>
          {text.substring(0, matchIndex)}
          <span className="font-semibold bg-yellow-100">
            {text.substring(matchIndex, matchIndex + searchTerm.length)}
          </span>
          {text.substring(matchIndex + searchTerm.length)}
        </>
      );
    }
    return text;
  };

  // Get AI suggestion reason
  const getAiReason = (itemId: number | string) => {
    const suggestion = aiSuggestions.find(s => s.itemId === itemId);
    return suggestion?.reason || '';
  };

  // Display value in input
  const displayValue = value 
    ? (displayMode === 'name' ? value.itemName : value.sku)
    : searchTerm;

  // Flatten all items for rendering
  const allFilteredItems = [
    ...groupedItems.aiItems,
    ...groupedItems.recent,
    ...groupedItems.other
  ];

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative" ref={inputRef}>
        {/* Selected Item Display */}
        {value && !inputFocused ? (
          <div 
            className="w-full px-3 py-1 border border-gray-300 rounded-[3px] text-sm bg-white flex items-center justify-between group cursor-pointer hover:border-[#5C1F3D] transition-colors"
            style={{ height: '28px' }}
            onClick={() => {
              if (!disabled) {
                setInputFocused(true);
                setShowDropdown(true);
              }
            }}
            title="Click to change item"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {showImage && value.imageUrl && (
                <img 
                  src={value.imageUrl} 
                  alt={value.itemName}
                  className="w-5 h-5 rounded object-cover flex-shrink-0"
                />
              )}
              <Package className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 truncate text-xs">
                {displayMode === 'name' ? value.itemName : value.sku}
              </span>
              {showCategory && (
                <span className="text-xs text-gray-500 flex-shrink-0">
                  • {value.category}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
                handleClear();
              }}
              disabled={disabled}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setInputFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => {
                // Delay to allow clicking on dropdown items
                setTimeout(() => setInputFocused(false), 200);
              }}
              disabled={disabled}
              placeholder={placeholder}
              className={`w-full pl-8 pr-8 py-1 border rounded-[3px] text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent bg-white ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5C1F3D]'
              } ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
              style={{ height: '28px' }}
            />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* Dropdown with Suggestions */}
        {showDropdown && !value && dropdownPosition && (
          <div 
            ref={dropdownRef}
            className="fixed bg-white border border-gray-300 rounded-[3px] shadow-lg z-[9999] max-h-96 overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {allFilteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{noResultsText}</p>
              </div>
            ) : (
              <>
                {/* AI Suggestions */}
                {groupedItems.aiItems.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border-b border-purple-100 flex items-center gap-1.5 sticky top-0 z-10">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Recommendations
                    </div>
                    {groupedItems.aiItems.map((item, idx) => {
                      const isHighlighted = highlightedIndex === idx;
                      const aiReason = getAiReason(item.id);
                      
                      return (
                        <div
                          key={`ai-${item.id}`}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSelectItem(item);
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 ${
                            isHighlighted ? 'bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {showImage && item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.itemName}
                                className="w-8 h-8 rounded object-cover flex-shrink-0 mt-0.5"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(item.itemName, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(item.sku, searchTerm)}
                                    </span>
                                    {showCategory && (
                                      <span className="text-xs text-gray-500">
                                        • {item.category}
                                      </span>
                                    )}
                                  </div>
                                  {(showPrice || showStockLevel) && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {showPrice && (
                                        <span className="text-xs text-gray-500">
                                          ₹{item.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      {showPrice && showStockLevel && (
                                        <span className="text-xs text-gray-500">•</span>
                                      )}
                                      {showStockLevel && (
                                        <span className="text-xs text-gray-500">
                                          {item.stock}pcs
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {aiReason && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Sparkles className="w-3 h-3 text-purple-600" />
                                      <span className="text-xs text-purple-600">{aiReason}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  {showStockLevel && (
                                    <span className={`px-2 py-0.5 text-xs rounded border ${getStockLevelColor(item.status, item.stock)}`}>
                                      {item.stock} {item.unit || 'units'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Recent Items */}
                {groupedItems.recent.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border-b border-blue-100 flex items-center gap-1.5 sticky top-0 z-10">
                      Recently Used
                    </div>
                    {groupedItems.recent.map((item, idx) => {
                      const adjustedIdx = idx + groupedItems.aiItems.length;
                      const isHighlighted = highlightedIndex === adjustedIdx;
                      
                      return (
                        <div
                          key={`recent-${item.id}`}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSelectItem(item);
                          }}
                          onMouseEnter={() => setHighlightedIndex(adjustedIdx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 ${
                            isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {showImage && item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.itemName}
                                className="w-8 h-8 rounded object-cover flex-shrink-0 mt-0.5"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(item.itemName, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(item.sku, searchTerm)}
                                    </span>
                                    {showCategory && (
                                      <span className="text-xs text-gray-500">
                                        • {item.category}
                                      </span>
                                    )}
                                  </div>
                                  {(showPrice || showStockLevel) && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {showPrice && (
                                        <span className="text-xs text-gray-500">
                                          ₹{item.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      {showPrice && showStockLevel && (
                                        <span className="text-xs text-gray-500">•</span>
                                      )}
                                      {showStockLevel && (
                                        <span className="text-xs text-gray-500">
                                          {item.stock}pcs
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  {showStockLevel && (
                                    <span className={`px-2 py-0.5 text-xs rounded border ${getStockLevelColor(item.status, item.stock)}`}>
                                      {item.stock} {item.unit || 'units'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* All Other Items */}
                {groupedItems.other.length > 0 && (
                  <>
                    {(groupedItems.aiItems.length > 0 || groupedItems.recent.length > 0) && (
                      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        All Items
                      </div>
                    )}
                    {groupedItems.other.map((item, idx) => {
                      const adjustedIdx = idx + groupedItems.aiItems.length + groupedItems.recent.length;
                      const isHighlighted = highlightedIndex === adjustedIdx;
                      
                      return (
                        <div
                          key={`other-${item.id}`}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSelectItem(item);
                          }}
                          onMouseEnter={() => setHighlightedIndex(adjustedIdx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                            isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {showImage && item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.itemName}
                                className="w-8 h-8 rounded object-cover flex-shrink-0 mt-0.5"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(item.itemName, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(item.sku, searchTerm)}
                                    </span>
                                    {showCategory && (
                                      <span className="text-xs text-gray-500">
                                        • {item.category}
                                      </span>
                                    )}
                                  </div>
                                  {(showPrice || showStockLevel) && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {showPrice && (
                                        <span className="text-xs text-gray-500">
                                          ₹{item.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      {showPrice && showStockLevel && (
                                        <span className="text-xs text-gray-500">•</span>
                                      )}
                                      {showStockLevel && (
                                        <span className="text-xs text-gray-500">
                                          {item.stock}pcs
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  {showStockLevel && (
                                    <span className={`px-2 py-0.5 text-xs rounded border ${getStockLevelColor(item.status, item.stock)}`}>
                                      {item.stock} {item.unit || 'units'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}