/**
 * ItemSearchInput - Usage Examples
 * 
 * This file demonstrates various ways to use the ItemSearchInput component
 * in different ERP scenarios.
 */

import React, { useState } from 'react';
import { ItemSearchInput, InventoryItem, ItemSuggestion } from '../components/ui/ItemSearchInput';

// Mock inventory data
const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    itemName: 'Wireless Mouse Logitech M185',
    sku: 'MOUSE-WL-001',
    category: 'Electronics',
    price: 599,
    stock: 45,
    barcode: '8901234567890',
    unit: 'pcs',
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    itemName: 'USB Cable Type-C 2m',
    sku: 'CABLE-USBC-002',
    category: 'Accessories',
    price: 149,
    stock: 5,
    barcode: '8901234567891',
    unit: 'pcs',
    status: 'Low Stock'
  },
  {
    id: 3,
    itemName: 'HP LaserJet Pro M404dn Printer',
    sku: 'PRINT-HP-003',
    category: 'Electronics',
    price: 18500,
    stock: 0,
    barcode: '8901234567892',
    unit: 'pcs',
    status: 'Out of Stock'
  },
  {
    id: 4,
    itemName: 'Office Chair Ergonomic',
    sku: 'CHAIR-ERG-004',
    category: 'Furniture',
    price: 8999,
    stock: 12,
    unit: 'pcs',
    status: 'In Stock'
  },
  {
    id: 5,
    itemName: 'A4 Paper Ream 500 Sheets',
    sku: 'PAPER-A4-005',
    category: 'Stationery',
    price: 250,
    stock: 120,
    unit: 'reams',
    status: 'In Stock'
  }
];

// Example 1: Basic Usage
export function BasicExample() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 1: Basic Item Selection</h2>
      
      <ItemSearchInput
        value={selectedItem}
        onChange={setSelectedItem}
        items={mockInventoryItems}
        label="Select Item"
        placeholder="Search by item name, SKU, or category..."
        required
      />

      {selectedItem && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            Selected: <strong>{selectedItem.itemName}</strong> (SKU: {selectedItem.sku})
          </p>
        </div>
      )}
    </div>
  );
}

// Example 2: With AI Suggestions
export function AIExample() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const aiSuggestions: ItemSuggestion[] = [
    {
      itemId: 2,
      reason: 'Frequently purchased together with your previous selection',
      confidence: 95
    },
    {
      itemId: 5,
      reason: 'Low stock alert - consider restocking',
      confidence: 88
    }
  ];

  const recentItemIds = [1, 4, 5];

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 2: With AI Suggestions & Recent Items</h2>
      
      <ItemSearchInput
        value={selectedItem}
        onChange={setSelectedItem}
        items={mockInventoryItems}
        aiSuggestions={aiSuggestions}
        recentItems={recentItemIds}
        label="Select Item for Transfer"
        placeholder="AI will suggest relevant items..."
        showStockLevel
        showPrice
        showCategory
        required
      />
    </div>
  );
}

// Example 3: Purchase Order Form
export function PurchaseOrderExample() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) {
      setError('Please select an item');
      return;
    }
    
    console.log('Submitting order:', {
      item: selectedItem,
      quantity,
      totalPrice: selectedItem.price * quantity
    });
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 3: Purchase Order Line Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <ItemSearchInput
          value={selectedItem}
          onChange={(item) => {
            setSelectedItem(item);
            setError('');
          }}
          items={mockInventoryItems}
          error={error}
          filterOutOfStock
          displayMode="name"
          showStockLevel
          showPrice
          label="Item to Purchase"
          placeholder="Search items to order..."
          required
        />

        {selectedItem && (
          <>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={selectedItem.stock}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-[3px] text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Unit Price:</span>
                <span className="text-gray-900">₹{selectedItem.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-700">Quantity:</span>
                <span className="text-gray-900">{quantity}</span>
              </div>
              <div className="flex items-center justify-between font-medium mt-2 pt-2 border-t border-blue-300">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">₹{(selectedItem.price * quantity).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-[#5C1F3D] text-white rounded-[3px] hover:bg-[#4a1831] transition-colors"
          style={{ height: '33px' }}
        >
          Add to Order
        </button>
      </form>
    </div>
  );
}

// Example 4: With Category Filter
export function CategoryFilterExample() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 4: With Category Filter</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedItem(null); // Reset item when category changes
            }}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-[3px] text-sm bg-white"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <ItemSearchInput
          value={selectedItem}
          onChange={setSelectedItem}
          items={mockInventoryItems}
          categoryFilter={selectedCategory}
          label="Select Item"
          placeholder={
            selectedCategory 
              ? `Search ${selectedCategory} items...` 
              : 'Select a category first...'
          }
          showStockLevel
          showPrice
        />
      </div>
    </div>
  );
}

// Example 5: Display SKU Mode
export function SKUDisplayExample() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 5: Display SKU Instead of Name</h2>
      
      <ItemSearchInput
        value={selectedItem}
        onChange={setSelectedItem}
        items={mockInventoryItems}
        displayMode="sku" // Show SKU in input after selection
        label="Item (by SKU)"
        placeholder="Search and select by SKU..."
        showStockLevel
        showPrice
      />

      <p className="mt-2 text-xs text-gray-500">
        This mode is useful for warehouse operations where SKU is the primary identifier.
      </p>
    </div>
  );
}

// Example 6: With Images
export function WithImagesExample() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 6: With Product Images</h2>
      
      <ItemSearchInput
        value={selectedItem}
        onChange={setSelectedItem}
        items={mockInventoryItems}
        showImage // Enable product image thumbnails
        showStockLevel
        showPrice
        showCategory
        label="Select Product"
        placeholder="Search products..."
      />

      <p className="mt-2 text-xs text-gray-500">
        Product images help users visually identify items faster.
      </p>
    </div>
  );
}

// Example 7: Multi-Item Selection (Bundle Creation)
export function MultiSelectExample() {
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [currentSelection, setCurrentSelection] = useState<InventoryItem | null>(null);

  const handleAddItem = (item: InventoryItem | null) => {
    if (item && !selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      setCurrentSelection(null); // Reset for next selection
    }
  };

  const handleRemoveItem = (itemId: number | string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId));
  };

  const totalValue = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Example 7: Multi-Item Selection (Bundle)</h2>
      
      <ItemSearchInput
        value={currentSelection}
        onChange={handleAddItem}
        items={mockInventoryItems.filter(item => 
          !selectedItems.find(s => s.id === item.id) // Exclude already selected
        )}
        label="Add Items to Bundle"
        placeholder="Search and add items..."
        showStockLevel
        showPrice
      />

      {selectedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Items ({selectedItems.length})</h3>
          
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{item.itemName}</p>
                <p className="text-xs text-gray-500">{item.sku} • ₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Bundle Value:</span>
              <span className="text-sm font-medium text-gray-900">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 8: All Examples Combined
export default function ItemSearchInputExamples() {
  const [activeExample, setActiveExample] = useState<string>('basic');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">ItemSearchInput Component Examples</h1>
        <p className="text-sm text-gray-600 mb-6">
          Comprehensive examples showing different use cases and configurations
        </p>

        {/* Example Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'basic', label: 'Basic' },
            { id: 'ai', label: 'AI Suggestions' },
            { id: 'purchase', label: 'Purchase Order' },
            { id: 'category', label: 'Category Filter' },
            { id: 'sku', label: 'SKU Display' },
            { id: 'images', label: 'With Images' },
            { id: 'multi', label: 'Multi-Select' }
          ].map(example => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                activeExample === example.id
                  ? 'bg-[#5C1F3D] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>

        {/* Example Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {activeExample === 'basic' && <BasicExample />}
          {activeExample === 'ai' && <AIExample />}
          {activeExample === 'purchase' && <PurchaseOrderExample />}
          {activeExample === 'category' && <CategoryFilterExample />}
          {activeExample === 'sku' && <SKUDisplayExample />}
          {activeExample === 'images' && <WithImagesExample />}
          {activeExample === 'multi' && <MultiSelectExample />}
        </div>
      </div>
    </div>
  );
}
