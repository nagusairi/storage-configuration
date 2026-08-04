# DataGrid Component - Comprehensive Documentation

## Overview

The **DataGrid** component is a powerful, reusable data table component that consolidates search, filtering, sorting, pagination, row selection, column visibility, and density controls into a single, consistent interface. It provides a complete solution for displaying and managing tabular data across all ERP modules.

**Component Location:** `/components/ui/DataGrid.tsx`

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [API Reference](#api-reference)
4. [Usage Examples](#usage-examples)
5. [Styling and Theming](#styling-and-theming)
6. [Best Practices](#best-practices)
7. [Migration Guide](#migration-guide)

---

## Quick Start

### Basic Example

```tsx
import { DataGrid, DataGridColumn } from '../../components/ui/DataGrid';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const columns: DataGridColumn<Product>[] = [
  {
    id: 'name',
    label: 'Product Name',
    sortable: true,
    render: (row) => <span>{row.name}</span>
  },
  {
    id: 'price',
    label: 'Price',
    sortable: true,
    render: (row) => <span>₹{row.price}</span>
  },
  {
    id: 'stock',
    label: 'Stock',
    sortable: true,
    render: (row) => <span>{row.stock}</span>
  }
];

function MyComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      searchEnabled
      searchFields={['name']}
      selectable
    />
  );
}
```

---

## Core Concepts

### 1. **Column Definitions**

Columns define how data is displayed and what operations are available.

```tsx
interface DataGridColumn<T> {
  id: string;                    // Unique column identifier
  label: string;                 // Display label in header
  sortable?: boolean;            // Enable sorting on this column
  width?: string;                // CSS width value (e.g., '200px', '20%')
  minWidth?: string;             // CSS min-width value
  render: (row: T, hoveredRow: number | null) => ReactNode;  // Cell renderer
  className?: string;            // Additional CSS classes for cells
}
```

**Key Points:**
- The `render` function receives the row data and `hoveredRow` state
- Use `hoveredRow` to show/hide row-level actions
- `sortable: true` adds click-to-sort functionality to the header

### 2. **Filter Definitions**

Filters allow users to narrow down data based on criteria.

```tsx
interface DataGridFilter {
  id: string;                    // Unique filter identifier
  label: string;                 // Display label
  type: 'select' | 'text' | 'date' | 'custom';
  placeholder?: string;          // Placeholder text
  options?: { value: string; label: string }[];  // For select type
  minWidth?: number;             // Minimum width in pixels
  renderCustom?: (value: any, onChange: (value: any) => void) => ReactNode;
}
```

**Filter Types:**
- **select**: Dropdown with predefined options
- **text**: Text input (future enhancement)
- **date**: Date picker (future enhancement)
- **custom**: Fully custom filter UI via `renderCustom`

### 3. **Row Actions**

Define actions that appear on row hover (View, Edit, Delete, etc.).

```tsx
interface DataGridRowAction<T> {
  id: string;                    // Unique action identifier
  label: string;                 // Accessibility label
  icon: ReactNode;               // Icon component (e.g., <Eye />)
  variant?: 'default' | 'danger';  // Visual variant
  onClick: (row: T) => void;     // Click handler
  show?: (row: T) => boolean;    // Conditional visibility
}
```

**Example:**
```tsx
const rowActions: DataGridRowAction<Product>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => navigate(`/products/${row.id}`)
  },
  {
    id: 'delete',
    label: 'Delete product',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => handleDelete(row.id),
    show: (row) => row.canDelete  // Only show if allowed
  }
];
```

### 4. **Bulk Actions**

Actions that operate on multiple selected rows.

```tsx
interface DataGridBulkAction<T> {
  id: string;
  label: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: (selectedRows: T[]) => void;
}
```

**Example:**
```tsx
const bulkActions: DataGridBulkAction<Product>[] = [
  {
    id: 'export',
    label: 'Export',
    icon: <Download className="w-4 h-4" />,
    variant: 'secondary',
    onClick: (rows) => exportProducts(rows)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick: (rows) => bulkDelete(rows.map(r => r.id))
  }
];
```

---

## API Reference

### Props

#### Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **Required** | Array of data objects to display |
| `columns` | `DataGridColumn<T>[]` | **Required** | Column definitions |
| `rowKey` | `string \| ((row: T) => string \| number)` | **Required** | Unique key for each row |

#### Search Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchEnabled` | `boolean` | `true` | Enable/disable search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `searchFields` | `string[]` | `[]` | Fields to search (if using default search) |
| `onSearch` | `(term: string, data: T[]) => T[]` | - | Custom search function |

#### Filter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `DataGridFilter[]` | `[]` | Filter definitions |
| `defaultFilters` | `Record<string, any>` | `{}` | Initial filter values |
| `onFilter` | `(filters: Record<string, any>, data: T[]) => T[]` | - | Custom filter function |
| `showAdvancedFilters` | `boolean` | `false` | Show "Advanced filters" link |
| `onAdvancedFiltersClick` | `() => void` | - | Advanced filters click handler |

#### Sorting Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultSortField` | `string` | - | Initial sort column |
| `defaultSortDirection` | `'asc' \| 'desc' \| null` | `null` | Initial sort direction |
| `onSort` | `(field: string, direction: SortDirection, data: T[]) => T[]` | - | Custom sort function |

#### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageSize` | `number` | `10` | Rows per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Page size dropdown options |

#### Selection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enable row selection checkboxes |
| `selectedRows` | `(string \| number)[]` | - | Controlled selected rows (optional) |
| `onSelectionChange` | `(selectedRows: (string \| number)[]) => void` | - | Selection change callback |

#### Action Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowActions` | `DataGridRowAction<T>[]` | `[]` | Row-level actions (hover menu) |
| `bulkActions` | `DataGridBulkAction<T>[]` | `[]` | Bulk actions (when rows selected) |

#### Column & Density Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultVisibleColumns` | `string[]` | All columns | Initially visible columns |
| `onColumnVisibilityChange` | `(visibleColumns: string[]) => void` | - | Column visibility change callback |
| `defaultDensity` | `'compact' \| 'standard' \| 'comfortable'` | `'standard'` | Initial table density |
| `densityEnabled` | `boolean` | `true` | Enable density selector |

#### More Options Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `exportEnabled` | `boolean` | `false` | Show "Export" in more options menu |
| `onExport` | `() => void` | - | Export click handler |
| `customMoreOptions` | `{ id: string; label: string; icon: ReactNode; onClick: () => void }[]` | `[]` | Additional menu options |

#### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `emptyMessage` | `string` | `'No data available'` | Message when data is empty |

#### Callback Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRowClick` | `(row: T) => void` | - | Row click handler (makes rows clickable) |

---

## Usage Examples

### Example 1: Basic Product List

```tsx
import { DataGrid, DataGridColumn } from '../../components/ui/DataGrid';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

const columns: DataGridColumn<Product>[] = [
  {
    id: 'name',
    label: 'Product Name',
    sortable: true,
    render: (row) => <span className="text-gray-900">{row.name}</span>
  },
  {
    id: 'sku',
    label: 'SKU',
    sortable: true,
    render: (row) => <span className="font-mono text-sm text-gray-600">{row.sku}</span>
  },
  {
    id: 'price',
    label: 'Price',
    sortable: true,
    render: (row) => <span>₹{row.price.toLocaleString('en-IN')}</span>
  },
  {
    id: 'stock',
    label: 'Stock',
    sortable: true,
    render: (row) => (
      <span className={row.stock < 10 ? 'text-red-600' : 'text-gray-900'}>
        {row.stock}
      </span>
    )
  }
];

function ProductList() {
  const [products] = useState<Product[]>([/* ... */]);
  
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      searchEnabled
      searchPlaceholder="Search products..."
      searchFields={['name', 'sku']}
      selectable
      pageSize={25}
    />
  );
}
```

### Example 2: With Filters and Row Actions

```tsx
import { DataGrid, DataGridColumn, DataGridFilter, DataGridRowAction } from '../../components/ui/DataGrid';

const filters: DataGridFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'All Categories',
    minWidth: 180,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'supplies', label: 'Supplies' }
    ]
  },
  {
    id: 'stockStatus',
    label: 'Stock Status',
    type: 'select',
    placeholder: 'All Status',
    minWidth: 160,
    options: [
      { value: 'in-stock', label: 'In Stock' },
      { value: 'low-stock', label: 'Low Stock' },
      { value: 'out-of-stock', label: 'Out of Stock' }
    ]
  }
];

const rowActions: DataGridRowAction<Product>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => navigate(`/products/${row.id}`)
  },
  {
    id: 'edit',
    label: 'Edit product',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => setEditingProduct(row)
  },
  {
    id: 'delete',
    label: 'Delete product',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => handleDelete(row.id)
  }
];

function ProductListWithFilters() {
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      filters={filters}
      rowActions={rowActions}
      searchEnabled
      searchFields={['name', 'sku']}
      onFilter={(filters, data) => {
        let result = data;
        if (filters.category) {
          result = result.filter(p => p.category === filters.category);
        }
        if (filters.stockStatus) {
          result = result.filter(p => p.stockStatus === filters.stockStatus);
        }
        return result;
      }}
    />
  );
}
```

### Example 3: With Bulk Actions and Custom Column Rendering

```tsx
const columns: DataGridColumn<Product>[] = [
  {
    id: 'name',
    label: 'Product Name',
    sortable: true,
    render: (row, hoveredRow) => (
      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={() => navigate(`/products/${row.id}`)}
          className="text-gray-900 hover:text-[#5C1F3D] hover:underline"
        >
          {row.name}
        </button>
        {/* Row actions menu appears here automatically */}
      </div>
    )
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => (
      <span className={`px-2 py-1 text-xs rounded border ${
        row.status === 'active' 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-gray-50 text-gray-700 border-gray-200'
      }`}>
        {row.status}
      </span>
    )
  }
];

const bulkActions: DataGridBulkAction<Product>[] = [
  {
    id: 'export',
    label: 'Export',
    icon: <Download className="w-4 h-4" />,
    variant: 'secondary',
    onClick: (rows) => exportToCSV(rows)
  },
  {
    id: 'activate',
    label: 'Activate',
    icon: <CheckCircle className="w-4 h-4" />,
    variant: 'primary',
    onClick: (rows) => bulkActivate(rows.map(r => r.id))
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick: (rows) => bulkDelete(rows.map(r => r.id))
  }
];

function ProductListWithBulk() {
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      selectable
      bulkActions={bulkActions}
      rowActions={rowActions}
    />
  );
}
```

### Example 4: Custom Search and Sort Functions

```tsx
function ProductListCustom() {
  const customSearch = (term: string, data: Product[]) => {
    const lowerTerm = term.toLowerCase();
    return data.filter(product => 
      product.name.toLowerCase().includes(lowerTerm) ||
      product.sku.toLowerCase().includes(lowerTerm) ||
      product.category.toLowerCase().includes(lowerTerm)
    );
  };
  
  const customSort = (field: string, direction: SortDirection, data: Product[]) => {
    if (!direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[field as keyof Product];
      const bValue = b[field as keyof Product];
      
      // Custom sorting logic for specific fields
      if (field === 'price') {
        return direction === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      
      // Default string comparison
      const comparison = String(aValue).localeCompare(String(bValue));
      return direction === 'asc' ? comparison : -comparison;
    });
  };
  
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      onSearch={customSearch}
      onSort={customSort}
      defaultSortField="name"
      defaultSortDirection="asc"
    />
  );
}
```

### Example 5: Controlled Selection

```tsx
function ProductListControlled() {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  
  useEffect(() => {
    // Do something when selection changes
    console.log('Selected products:', selectedProductIds);
  }, [selectedProductIds]);
  
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      selectable
      selectedRows={selectedProductIds}
      onSelectionChange={(ids) => setSelectedProductIds(ids as number[])}
    />
  );
}
```

### Example 6: With Export and Custom More Options

```tsx
function ProductListWithExport() {
  const handleExport = () => {
    // Export current filtered/sorted data
    const csv = convertToCSV(filteredProducts);
    downloadFile(csv, 'products.csv');
  };
  
  const customOptions = [
    {
      id: 'import',
      label: 'Import',
      icon: <Upload className="w-4 h-4 text-gray-500" />,
      onClick: () => setShowImportModal(true)
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 text-gray-500" />,
      onClick: () => setShowSettingsModal(true)
    }
  ];
  
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      exportEnabled
      onExport={handleExport}
      customMoreOptions={customOptions}
    />
  );
}
```

---

## Styling and Theming

### Table Density

The DataGrid supports three density levels:

| Density | Padding | Use Case |
|---------|---------|----------|
| **Compact** | `px-4 py-2` | Maximum rows visible, minimal space |
| **Standard** (default) | `px-6 py-3` | Balanced spacing for most use cases |
| **Comfortable** | `px-6 py-4` | Extra padding for readability |

Users can change density via the More Options menu > Density.

### Custom Column Styling

Apply custom classes to columns:

```tsx
{
  id: 'price',
  label: 'Price',
  className: 'text-right font-mono',
  render: (row) => <span>₹{row.price}</span>
}
```

### Custom Row Rendering

Use the `render` function to fully customize cell content:

```tsx
{
  id: 'status',
  label: 'Status',
  render: (row) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        row.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
      }`} />
      <span className="capitalize">{row.status}</span>
    </div>
  )
}
```

### Hover-Dependent Rendering

Access `hoveredRow` in the render function:

```tsx
{
  id: 'name',
  label: 'Product Name',
  render: (row, hoveredRow) => (
    <div className="flex items-center justify-between">
      <span>{row.name}</span>
      {hoveredRow === row.id && (
        <span className="text-xs text-gray-500">Click to view</span>
      )}
    </div>
  )
}
```

---

## Best Practices

### 1. **Column Definitions**
- ✅ Always define a `rowKey` prop for stable row identity
- ✅ Use `sortable: true` for columns with comparable data
- ✅ Keep column labels concise and descriptive
- ✅ Use `minWidth` to prevent column squishing on small screens
- ❌ Avoid complex logic in `render` functions (extract to components)

### 2. **Performance**
- ✅ Use `useMemo` for expensive data transformations
- ✅ Implement custom `onSearch`, `onFilter`, and `onSort` for large datasets
- ✅ Consider server-side pagination for 1000+ rows
- ❌ Avoid re-creating column/filter arrays on every render

### 3. **User Experience**
- ✅ Provide meaningful `searchPlaceholder` text
- ✅ Group related filters together
- ✅ Show bulk actions only when rows are selected
- ✅ Use conditional `show` in row actions for context-specific actions
- ❌ Don't overwhelm users with too many filters (use "Advanced filters")

### 4. **Accessibility**
- ✅ Provide descriptive `label` for all actions
- ✅ Use semantic HTML in custom renderers
- ✅ Ensure keyboard navigation works (Tab, Enter, Space)
- ✅ Test with screen readers

### 5. **State Management**
- ✅ Use controlled `selectedRows` when selection affects other UI
- ✅ Persist filter/sort state in URL query params for shareable views
- ✅ Reset to page 1 when filters change (handled automatically)
- ❌ Don't store entire row objects in state (use IDs)

---

## Migration Guide

### From Custom Table to DataGrid

**Before (Custom Implementation):**
```tsx
// Lots of state management
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({});
const [sortField, setSortField] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
// ... 200+ lines of table code
```

**After (DataGrid):**
```tsx
<DataGrid
  data={products}
  columns={columns}
  rowKey="id"
  filters={filterDefinitions}
  searchEnabled
  searchFields={['name', 'sku']}
  selectable
  rowActions={actions}
/>
```

### Step-by-Step Migration

1. **Define Columns**
   ```tsx
   const columns: DataGridColumn<YourType>[] = [
     // Map your existing table columns
   ];
   ```

2. **Define Filters** (if applicable)
   ```tsx
   const filters: DataGridFilter[] = [
     // Map your existing filter dropdowns
   ];
   ```

3. **Define Actions**
   ```tsx
   const rowActions: DataGridRowAction<YourType>[] = [
     // Map your existing row actions (View, Edit, Delete)
   ];
   ```

4. **Replace Table Component**
   ```tsx
   <DataGrid
     data={yourData}
     columns={columns}
     rowKey="id"  // or custom function
     filters={filters}
     rowActions={rowActions}
     searchEnabled
     selectable={hasSelection}
   />
   ```

5. **Remove Old State** (DataGrid manages it internally)
   - Remove filter state variables
   - Remove sort state variables
   - Remove pagination state variables
   - Keep only business logic state

---

## Common Patterns

### Pattern 1: Master-Detail View

```tsx
function ProductMasterDetail() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  return (
    <>
      <DataGrid
        data={products}
        columns={columns}
        rowKey="id"
        onRowClick={(row) => setSelectedProduct(row)}
        rowActions={[
          {
            id: 'view',
            label: 'View details',
            icon: <Eye className="w-4 h-4" />,
            onClick: (row) => setSelectedProduct(row)
          }
        ]}
      />
      
      {selectedProduct && (
        <ProductDetailsPanel 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
```

### Pattern 2: Inline Editing

```tsx
const columns: DataGridColumn<Product>[] = [
  {
    id: 'price',
    label: 'Price',
    render: (row, hoveredRow) => {
      const [editing, setEditing] = useState(false);
      const [value, setValue] = useState(row.price);
      
      if (editing) {
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onBlur={() => {
              updatePrice(row.id, value);
              setEditing(false);
            }}
            autoFocus
          />
        );
      }
      
      return (
        <div onClick={() => setEditing(true)}>
          ₹{row.price}
          {hoveredRow === row.id && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
        </div>
      );
    }
  }
];
```

### Pattern 3: Conditional Row Styling

```tsx
const columns: DataGridColumn<Product>[] = [
  {
    id: 'name',
    label: 'Product Name',
    render: (row) => (
      <div className={row.isDiscontinued ? 'text-gray-400 line-through' : 'text-gray-900'}>
        {row.name}
        {row.isNew && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">NEW</span>}
      </div>
    )
  }
];
```

---

## Troubleshooting

### Issue: Filters not working
**Solution:** Ensure you provide either `onFilter` callback or use the default filter logic with matching field names.

### Issue: Sorting breaks with custom data types
**Solution:** Implement `onSort` callback with custom comparison logic.

### Issue: Row actions not appearing
**Solution:** Ensure `hoveredRow` is being passed to the column `render` function and used correctly.

### Issue: Pagination showing wrong total
**Solution:** Verify that filtering is applied before sorting and pagination (handled automatically).

### Issue: Performance issues with large datasets
**Solution:** Implement server-side pagination, filtering, and sorting via custom callbacks.

---

## Future Enhancements

- ✅ **Completed:** Search, filters, sorting, pagination, row selection
- 🔄 **In Progress:** Text and date filter types
- 📋 **Planned:**
  - Column resizing
  - Column reordering (drag-and-drop)
  - Grouped rows (expandable sections)
  - Frozen columns
  - Virtual scrolling for 10k+ rows
  - Keyboard shortcuts (Ctrl+A, Delete, etc.)
  - Save/load user preferences (column order, visibility, density)
  - Advanced filters modal

---

## Support

For questions, issues, or feature requests:
- Review this documentation
- Check the `Guidelines.md` file for design system compliance
- Refer to existing implementations in Item Master module
- Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** December 29, 2024  
**Component:** `/components/ui/DataGrid.tsx`
