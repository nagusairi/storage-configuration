# FullFunctionalTable Component - Complete Usage Guide

> **Enterprise-grade, production-ready data table component with advanced filtering, sorting, pagination, and export capabilities.**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Props Reference](#props-reference)
6. [Column Configuration](#column-configuration)
7. [Filter Configuration](#filter-configuration)
8. [Row Actions](#row-actions)
9. [Bulk Actions](#bulk-actions)
10. [Controlled State](#controlled-state)
11. [Callbacks](#callbacks)
12. [Styling & Customization](#styling--customization)
13. [Best Practices](#best-practices)
14. [Examples](#examples)

---

## Overview

The **FullFunctionalTable** component provides:

### Core Features
- ✅ Multi-row selection with checkboxes
- ✅ Column sorting (ascending/descending/none)
- ✅ Sticky columns (checkbox + first data column)
- ✅ Row-level actions via dropdown menu
- ✅ Bulk actions for selected rows
- ✅ Pagination with configurable page sizes

### Advanced Features
- ✅ Collapsible filter section with multiple filter types
- ✅ Full-text search across specified fields
- ✅ Date range picker with quick presets
- ✅ Filter summary banner
- ✅ Column visibility toggle
- ✅ Table density control (compact/standard/comfortable)
- ✅ CSV export of filtered data
- ✅ Keyboard shortcuts
- ✅ Empty/loading/error states
- ✅ Portal-rendered menus (no overflow issues)

---

## Quick Start

### 1. Import the Component

```tsx
import { FullFunctionalTable } from '../../components/ui/FullFunctionalTable';
import type { 
  FullFunctionalTableProps, 
  ColumnConfig, 
  RowAction, 
  BulkAction 
} from '../../components/ui/FullFunctionalTable.types';
```

### 2. Define Your Data Type

```tsx
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}
```

### 3. Create Column Configuration

```tsx
const columns: ColumnConfig<Product>[] = [
  {
    id: 'name',
    field: 'name',
    label: 'Product Name',
    sortable: true,
    minWidth: '200px',
    render: (row) => (
      <div>
        <div className="text-sm text-gray-900">{row.name}</div>
        <div className="text-xs text-gray-500">{row.sku}</div>
      </div>
    ),
  },
  {
    id: 'category',
    field: 'category',
    label: 'Category',
    sortable: true,
    width: '150px',
  },
  {
    id: 'price',
    field: 'price',
    label: 'Price',
    sortable: true,
    align: 'right',
    width: '120px',
    render: (row) => (
      <span className="text-sm">₹{row.price.toLocaleString('en-IN')}</span>
    ),
  },
  {
    id: 'stock',
    field: 'stock',
    label: 'Stock',
    sortable: true,
    align: 'center',
    width: '100px',
    render: (row) => (
      <span className={`px-2 py-1 text-xs rounded ${
        row.stock > 50 ? 'bg-green-50 text-green-700' : 
        row.stock > 10 ? 'bg-yellow-50 text-yellow-700' : 
        'bg-red-50 text-red-700'
      }`}>
        {row.stock}
      </span>
    ),
  },
];
```

### 4. Use the Component

```tsx
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <FullFunctionalTable
      data={products}
      columns={columns}
      rowKey="id"
      selectable
      enableSearch
      searchPlaceholder="Search products..."
      searchFields={['name', 'sku', 'category']}
      pageSize={25}
    />
  );
}
```

---

## Basic Usage

### Minimal Example

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
/>
```

### With Selection

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  selectable
  onSelectionChange={(selectedIds) => {
    console.log('Selected:', selectedIds);
  }}
/>
```

### With Search

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  enableSearch
  searchPlaceholder="Search products by name, SKU, or category..."
  searchFields={['name', 'sku', 'category']}
/>
```

### With Sorting

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  sortable
  defaultSort={{ field: 'name', direction: 'asc' }}
  onSort={(field, direction) => {
    console.log('Sort changed:', field, direction);
  }}
/>
```

---

## Advanced Features

### 1. Filters

#### Select Filters

```tsx
import type { DataGridFilter } from '../../components/ui/FullFunctionalTable.types';

const filters: DataGridFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'All Categories',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'clothing', label: 'Clothing' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All Statuses',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  filters={filters}
  defaultFilters={{ status: 'active' }}
  onFilterChange={(filters) => {
    console.log('Filters changed:', filters);
  }}
/>
```

#### Date Range Filter

```tsx
const filters: DataGridFilter[] = [
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'dateRange',
  },
];

<FullFunctionalTable
  data={orders}
  columns={columns}
  rowKey="id"
  filters={filters}
  onFilter={(activeFilters, data) => {
    // Custom filter logic
    return data.filter(order => {
      // Apply filters...
      return true;
    });
  }}
/>
```

#### Custom Filter

```tsx
const filters: DataGridFilter[] = [
  {
    id: 'priceRange',
    label: 'Price Range',
    type: 'custom',
    customRender: ({ value, onChange, activeFilters }) => (
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={value?.min || ''}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          className="w-full px-3 py-2 border rounded-[3px]"
          style={{ height: '33px' }}
        />
        <input
          type="number"
          placeholder="Max"
          value={value?.max || ''}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          className="w-full px-3 py-2 border rounded-[3px]"
          style={{ height: '33px' }}
        />
      </div>
    ),
  },
];
```

#### Conditional Filter Visibility

```tsx
const filters: DataGridFilter[] = [
  {
    id: 'warehouse',
    label: 'Warehouse',
    type: 'select',
    options: warehouseOptions,
    // Only show if item type is 'goods'
    visible: (activeFilters) => activeFilters.itemType === 'goods',
  },
  {
    id: 'binLocation',
    label: 'Bin Location',
    type: 'select',
    options: binLocationOptions,
    // Disable if no warehouse selected
    disabled: (activeFilters) => !activeFilters.warehouse,
  },
];
```

### 2. Row Actions

```tsx
import { Eye, Edit, Trash2, Copy } from 'lucide-react';

const rowActions: RowAction<Product>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => {
      navigate(`/products/${row.id}`);
    },
  },
  {
    id: 'edit',
    label: 'Edit product',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => {
      setEditingProduct(row);
    },
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy className="w-4 h-4 text-gray-500" />,
    onClick: (row) => {
      handleDuplicate(row);
    },
    // Only show for active products
    visible: (row) => row.status === 'active',
  },
  {
    id: 'delete',
    label: 'Delete product',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => {
      if (confirm('Are you sure you want to delete this product?')) {
        handleDelete(row.id);
      }
    },
    // Disable if product has active orders
    disabled: (row) => row.hasActiveOrders,
  },
];

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  rowActions={rowActions}
/>
```

### 3. Bulk Actions

```tsx
import { Trash2, Archive, Download } from 'lucide-react';

const bulkActions: BulkAction<Product>[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: <Download className="w-4 h-4" />,
    onClick: (selectedRows) => {
      // Export logic
      console.log('Exporting:', selectedRows);
    },
  },
  {
    id: 'archive',
    label: 'Archive Selected',
    icon: <Archive className="w-4 h-4" />,
    onClick: (selectedRows) => {
      handleBulkArchive(selectedRows);
    },
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick: (selectedRows) => {
      if (confirm(`Delete ${selectedRows.length} products?`)) {
        handleBulkDelete(selectedRows.map(r => r.id));
      }
    },
  },
];

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  selectable
  bulkActions={bulkActions}
/>
```

### 4. Column Visibility

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  defaultVisibleColumns={['name', 'category', 'price', 'stock']}
  onColumnVisibilityChange={(visibleColumns) => {
    // Save to localStorage or user preferences
    localStorage.setItem('product-columns', JSON.stringify(visibleColumns));
  }}
/>
```

### 5. Table Density

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  density="compact" // 'compact' | 'standard' | 'comfortable'
  onDensityChange={(density) => {
    localStorage.setItem('table-density', density);
  }}
/>
```

### 6. Pagination

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  pageSize={25}
  pageSizeOptions={[10, 25, 50, 100]}
  currentPage={1}
  onPageChange={(page) => {
    console.log('Page changed:', page);
  }}
  onPageSizeChange={(size) => {
    console.log('Page size changed:', size);
  }}
/>
```

### 7. Loading & Error States

```tsx
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  isLoading={isLoading}
  error={error}
  loadingMessage="Loading products..."
  emptyMessage="No products found"
  noResultsMessage="No products match your search"
  onRetry={() => {
    setError(null);
    fetchProducts();
  }}
  onAddNew={() => {
    navigate('/products/new');
  }}
/>
```

---

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data objects to display |
| `columns` | `ColumnConfig<T>[]` | Column configuration array |
| `rowKey` | `keyof T` | Unique identifier field for rows |

### Selection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enable row selection checkboxes |
| `selectedRows` | `any[]` | - | Controlled selected row IDs |
| `onSelectionChange` | `(ids: any[]) => void` | - | Callback when selection changes |

### Sorting Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortable` | `boolean` | `true` | Enable column sorting |
| `defaultSort` | `{ field: keyof T, direction: 'asc' \| 'desc' }` | - | Default sort configuration |
| `onSort` | `(field: keyof T, direction: SortDirection) => void` | - | Callback when sort changes |

### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageSize` | `number` | `25` | Number of rows per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Available page size options |
| `currentPage` | `number` | `1` | Current page number (controlled) |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `onPageSizeChange` | `(size: number) => void` | - | Callback when page size changes |

### Filter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `DataGridFilter[]` | - | Filter configuration array |
| `defaultFilters` | `Record<string, any>` | `{}` | Default active filters |
| `onFilter` | `(filters: Record<string, any>, data: T[]) => T[]` | - | Custom filter function |
| `onFilterChange` | `(filters: Record<string, any>) => void` | - | Callback when filters change |
| `filterLogic` | `'AND' \| 'OR'` | `'AND'` | How multiple filters combine |

### Search Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableSearch` | `boolean` | `false` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `searchFields` | `(keyof T)[]` | `[]` | Fields to search (empty = all string fields) |

### Action Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowActions` | `RowAction<T>[]` | `[]` | Row-level actions |
| `bulkActions` | `BulkAction<T>[]` | `[]` | Bulk actions for selected rows |
| `onRowClick` | `(row: T) => void` | - | Callback when row is clicked |

### Column Visibility Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultVisibleColumns` | `string[]` | All columns | Initially visible columns |
| `onColumnVisibilityChange` | `(columns: string[]) => void` | - | Callback when visibility changes |

### Density Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `density` | `'compact' \| 'standard' \| 'comfortable'` | `'standard'` | Table row density |
| `onDensityChange` | `(density: DensityType) => void` | - | Callback when density changes |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | `boolean` | `false` | Show loading state |
| `error` | `string \| null` | `null` | Error message to display |

### Message Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emptyMessage` | `string` | `'No items found'` | Message when data is empty |
| `noResultsMessage` | `string` | `'No results found'` | Message when filters return nothing |
| `loadingMessage` | `string` | `'Loading items...'` | Loading state message |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onRetry` | `() => void` | Callback for retry button in error state |
| `onAddNew` | `() => void` | Callback for add new button in empty state |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |

---

## Column Configuration

### Basic Column

```tsx
{
  id: 'name',            // Unique identifier
  field: 'name',         // Data field to display
  label: 'Product Name', // Column header label
}
```

### Column with Sorting

```tsx
{
  id: 'price',
  field: 'price',
  label: 'Price',
  sortable: true, // Enable sorting for this column
}
```

### Column with Custom Render

```tsx
{
  id: 'status',
  field: 'status',
  label: 'Status',
  render: (row) => (
    <span className={`px-2 py-1 text-xs rounded ${
      row.status === 'active' 
        ? 'bg-green-50 text-green-700' 
        : 'bg-gray-50 text-gray-700'
    }`}>
      {row.status.toUpperCase()}
    </span>
  ),
}
```

### Column with Alignment

```tsx
{
  id: 'price',
  field: 'price',
  label: 'Price',
  align: 'right', // 'left' | 'center' | 'right'
  render: (row) => `₹${row.price.toLocaleString('en-IN')}`,
}
```

### Column with Width

```tsx
{
  id: 'sku',
  field: 'sku',
  label: 'SKU',
  width: '120px',      // Fixed width
  minWidth: '100px',   // Minimum width
  maxWidth: '200px',   // Maximum width
}
```

### Column with Custom Header

```tsx
{
  id: 'price',
  field: 'price',
  label: 'Price',
  headerRender: () => (
    <div className="flex items-center gap-2">
      <DollarSign className="w-4 h-4" />
      <span>Price</span>
    </div>
  ),
}
```

### Column with Custom Class

```tsx
{
  id: 'name',
  field: 'name',
  label: 'Name',
  className: 'font-medium text-gray-900',
}
```

---

## Filter Configuration

### Select Filter

```tsx
{
  id: 'category',
  label: 'Category',
  type: 'select',
  placeholder: 'All Categories',
  options: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
  ],
}
```

### Select Filter with Tooltip

```tsx
{
  id: 'warehouse',
  label: 'Warehouse',
  type: 'select',
  placeholder: 'Select Warehouse',
  options: warehouseOptions,
  tooltip: 'Filter items by warehouse location',
  helpText: 'Only items in stock will appear',
}
```

### Date Range Filter

```tsx
{
  id: 'dateRange',
  label: 'Date Range',
  type: 'dateRange',
}
```

### Custom Filter

```tsx
{
  id: 'priceRange',
  label: 'Price Range',
  type: 'custom',
  customRender: ({ value, onChange, activeFilters }) => (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Min"
        value={value?.min || ''}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
        className="w-20 px-2 py-1 border rounded"
      />
      <span>-</span>
      <input
        type="number"
        placeholder="Max"
        value={value?.max || ''}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
        className="w-20 px-2 py-1 border rounded"
      />
    </div>
  ),
}
```

### Conditional Visibility

```tsx
{
  id: 'binLocation',
  label: 'Bin Location',
  type: 'select',
  options: binOptions,
  // Only show if warehouse is selected
  visible: (activeFilters) => !!activeFilters.warehouse,
}
```

### Conditional Disabled

```tsx
{
  id: 'subCategory',
  label: 'Sub-Category',
  type: 'select',
  options: subCategoryOptions,
  // Disable if no category selected
  disabled: (activeFilters) => !activeFilters.category,
}
```

---

## Row Actions

### Basic Actions

```tsx
const rowActions: RowAction<Product>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => navigate(`/products/${row.id}`),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => setEditingProduct(row),
  },
];
```

### Danger Action

```tsx
{
  id: 'delete',
  label: 'Delete',
  icon: <Trash2 className="w-4 h-4 text-red-500" />,
  variant: 'danger', // Red styling
  onClick: (row) => {
    if (confirm('Delete this product?')) {
      handleDelete(row.id);
    }
  },
}
```

### Conditional Visibility

```tsx
{
  id: 'activate',
  label: 'Activate',
  icon: <Check className="w-4 h-4 text-gray-500" />,
  onClick: (row) => handleActivate(row.id),
  // Only show for inactive products
  visible: (row) => row.status === 'inactive',
}
```

### Conditional Disabled

```tsx
{
  id: 'delete',
  label: 'Delete',
  icon: <Trash2 className="w-4 h-4 text-red-500" />,
  variant: 'danger',
  onClick: (row) => handleDelete(row.id),
  // Disable if product has active orders
  disabled: (row) => row.hasActiveOrders,
}
```

---

## Bulk Actions

### Standard Bulk Actions

```tsx
const bulkActions: BulkAction<Product>[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: <Download className="w-4 h-4" />,
    onClick: (selectedRows) => {
      exportToCSV(selectedRows);
    },
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    onClick: (selectedRows) => {
      handleBulkArchive(selectedRows.map(r => r.id));
    },
  },
];
```

### Danger Bulk Action

```tsx
{
  id: 'delete',
  label: 'Delete Selected',
  icon: <Trash2 className="w-4 h-4" />,
  variant: 'danger',
  onClick: (selectedRows) => {
    const count = selectedRows.length;
    if (confirm(`Delete ${count} product${count > 1 ? 's' : ''}?`)) {
      handleBulkDelete(selectedRows.map(r => r.id));
    }
  },
}
```

---

## Controlled State

### Controlled Selection

```tsx
function ProductList() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <FullFunctionalTable
      data={products}
      columns={columns}
      rowKey="id"
      selectable
      selectedRows={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### Controlled Pagination

```tsx
function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  return (
    <FullFunctionalTable
      data={products}
      columns={columns}
      rowKey="id"
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page
      }}
    />
  );
}
```

### Controlled Density

```tsx
function ProductList() {
  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');

  return (
    <FullFunctionalTable
      data={products}
      columns={columns}
      rowKey="id"
      density={density}
      onDensityChange={setDensity}
    />
  );
}
```

---

## Callbacks

### Filtering

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  filters={filters}
  onFilterChange={(activeFilters) => {
    // Save to URL params or localStorage
    const params = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    navigate(`?${params.toString()}`, { replace: true });
  }}
  onFilter={(activeFilters, data) => {
    // Custom filter logic
    let filtered = data;
    
    if (activeFilters.category) {
      filtered = filtered.filter(p => p.category === activeFilters.category);
    }
    
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      filtered = filtered.filter(p => {
        if (min && p.price < Number(min)) return false;
        if (max && p.price > Number(max)) return false;
        return true;
      });
    }
    
    return filtered;
  }}
/>
```

### Column Visibility

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  onColumnVisibilityChange={(visibleColumns) => {
    // Save to user preferences
    saveUserPreference('product-columns', visibleColumns);
  }}
/>
```

### Sorting

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  onSort={(field, direction) => {
    // Update URL or analytics
    console.log(`Sorted by ${String(field)} ${direction}`);
  }}
/>
```

---

## Styling & Customization

### Custom Class Name

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  className="my-custom-table"
/>
```

### Custom Column Styling

```tsx
{
  id: 'name',
  field: 'name',
  label: 'Name',
  className: 'font-bold text-gray-900',
  render: (row) => (
    <div className="flex items-center gap-2">
      <img src={row.image} className="w-8 h-8 rounded" />
      <span>{row.name}</span>
    </div>
  ),
}
```

---

## Best Practices

### 1. Performance Optimization

```tsx
// Memoize columns and actions to prevent re-renders
const columns = useMemo<ColumnConfig<Product>[]>(() => [
  {
    id: 'name',
    field: 'name',
    label: 'Product Name',
    // ...
  },
], []);

const rowActions = useMemo<RowAction<Product>[]>(() => [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="w-4 h-4" />,
    onClick: handleEdit,
  },
], [handleEdit]);
```

### 2. Filter Persistence

```tsx
// Save filters to URL params
const [searchParams] = useSearchParams();
const defaultFilters = useMemo(() => ({
  category: searchParams.get('category') || '',
  status: searchParams.get('status') || '',
}), [searchParams]);

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  filters={filters}
  defaultFilters={defaultFilters}
  onFilterChange={(filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    navigate(`?${params.toString()}`, { replace: true });
  }}
/>
```

### 3. User Preferences

```tsx
// Load user preferences from localStorage
const [density, setDensity] = useState<DensityType>(() => {
  const saved = localStorage.getItem('table-density');
  return (saved as DensityType) || 'standard';
});

const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
  const saved = localStorage.getItem('product-columns');
  return saved ? JSON.parse(saved) : columns.map(c => c.id);
});

// Save preferences
useEffect(() => {
  localStorage.setItem('table-density', density);
}, [density]);

useEffect(() => {
  localStorage.setItem('product-columns', JSON.stringify(visibleColumns));
}, [visibleColumns]);
```

### 4. Error Handling

```tsx
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchData();
}, []);

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  isLoading={isLoading}
  error={error}
  onRetry={() => {
    setError(null);
    fetchProducts();
  }}
/>
```

---

## Examples

### Complete Product Management Example

```tsx
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { FullFunctionalTable } from '../../components/ui/FullFunctionalTable';
import type { ColumnConfig, DataGridFilter, RowAction, BulkAction } from '../../components/ui/FullFunctionalTable.types';
import { Eye, Edit, Trash2, Download, Archive } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Column configuration
  const columns = useMemo<ColumnConfig<Product>[]>(() => [
    {
      id: 'name',
      field: 'name',
      label: 'Product Name',
      sortable: true,
      minWidth: '200px',
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900 font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.sku}</div>
        </div>
      ),
    },
    {
      id: 'category',
      field: 'category',
      label: 'Category',
      sortable: true,
      width: '150px',
    },
    {
      id: 'price',
      field: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',
      width: '120px',
      render: (row) => (
        <span className="text-sm">₹{row.price.toLocaleString('en-IN')}</span>
      ),
    },
    {
      id: 'stock',
      field: 'stock',
      label: 'Stock',
      sortable: true,
      align: 'center',
      width: '100px',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded ${
          row.stock > 50 ? 'bg-green-50 text-green-700 border border-green-200' : 
          row.stock > 10 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {row.stock}
        </span>
      ),
    },
    {
      id: 'status',
      field: 'status',
      label: 'Status',
      sortable: true,
      width: '100px',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded ${
          row.status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      id: 'lastUpdated',
      field: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.lastUpdated).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ], []);

  // Filters
  const filters = useMemo<DataGridFilter[]>(() => [
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'All Categories',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'All Statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Last Updated',
      type: 'dateRange',
    },
  ], []);

  // Row actions
  const rowActions = useMemo<RowAction<Product>[]>(() => [
    {
      id: 'view',
      label: 'View details',
      icon: <Eye className="w-4 h-4 text-gray-500" />,
      onClick: (row) => navigate(`/products/${row.id}`),
    },
    {
      id: 'edit',
      label: 'Edit product',
      icon: <Edit className="w-4 h-4 text-gray-500" />,
      onClick: (row) => navigate(`/products/${row.id}/edit`),
    },
    {
      id: 'delete',
      label: 'Delete product',
      icon: <Trash2 className="w-4 h-4 text-red-500" />,
      variant: 'danger',
      onClick: (row) => {
        if (confirm(`Delete ${row.name}?`)) {
          handleDelete(row.id);
        }
      },
    },
  ], [navigate]);

  // Bulk actions
  const bulkActions = useMemo<BulkAction<Product>[]>(() => [
    {
      id: 'export',
      label: 'Export Selected',
      icon: <Download className="w-4 h-4" />,
      onClick: (selectedRows) => {
        console.log('Exporting:', selectedRows);
      },
    },
    {
      id: 'archive',
      label: 'Archive Selected',
      icon: <Archive className="w-4 h-4" />,
      onClick: (selectedRows) => {
        console.log('Archiving:', selectedRows);
      },
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger',
      onClick: (selectedRows) => {
        if (confirm(`Delete ${selectedRows.length} products?`)) {
          handleBulkDelete(selectedRows.map(r => r.id));
        }
      },
    },
  ], []);

  // Handlers
  const handleDelete = useCallback(async (id: number) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  }, []);

  const handleBulkDelete = useCallback(async (ids: number[]) => {
    try {
      await api.bulkDeleteProducts(ids);
      setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    } catch (err) {
      alert('Failed to delete products');
    }
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your product catalog</p>
      </div>

      <FullFunctionalTable
        data={products}
        columns={columns}
        rowKey="id"
        
        // Selection
        selectable
        
        // Search
        enableSearch
        searchPlaceholder="Search by product name, SKU, or category..."
        searchFields={['name', 'sku', 'category']}
        
        // Filters
        filters={filters}
        defaultFilters={{ status: 'active' }}
        
        // Sorting
        sortable
        defaultSort={{ field: 'name', direction: 'asc' }}
        
        // Actions
        rowActions={rowActions}
        bulkActions={bulkActions}
        
        // Pagination
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        
        // States
        isLoading={isLoading}
        error={error}
        
        // Callbacks
        onRetry={() => fetchProducts()}
        onAddNew={() => navigate('/products/new')}
        
        // Messages
        emptyMessage="No products found"
        noResultsMessage="No products match your search criteria"
      />
    </div>
  );
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Toggle filter section |
| `Ctrl/Cmd + Shift + C` | Clear all filters |
| `Escape` | Close modals/menus or clear filters |

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## TypeScript Support

The component is fully typed with TypeScript. All props, callbacks, and data structures have complete type definitions.

```tsx
import type {
  FullFunctionalTableProps,
  ColumnConfig,
  DataGridFilter,
  RowAction,
  BulkAction,
  DensityType,
  SortDirection,
} from '../../components/ui/FullFunctionalTable.types';
```

---

## Troubleshooting

### Filters not working

Ensure you're providing either `onFilter` callback or the filters match your data structure:

```tsx
// Custom filter logic
onFilter={(activeFilters, data) => {
  return data.filter(item => {
    // Your filter logic
    return true;
  });
}}
```

### Column visibility not persisting

Save visible columns to localStorage or user preferences:

```tsx
onColumnVisibilityChange={(columns) => {
  localStorage.setItem('visible-columns', JSON.stringify(columns));
}}
```

### Pagination resetting unexpectedly

When filters change, the table automatically resets to page 1. This is expected behavior.

---

## Support

For issues or questions, please refer to the component source code at `/components/ui/FullFunctionalTable.tsx` or contact the development team.

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Author:** ERP Development Team
