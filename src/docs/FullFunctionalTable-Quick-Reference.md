# FullFunctionalTable - Quick Reference Card

> **Quick reference for the most common use cases**

---

## 🚀 Minimal Setup

```tsx
import { FullFunctionalTable } from '../../components/ui/FullFunctionalTable';

<FullFunctionalTable
  data={items}
  columns={columns}
  rowKey="id"
/>
```

---

## 📊 Common Configurations

### Standard Data Table

```tsx
<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  selectable
  enableSearch
  searchPlaceholder="Search products..."
  searchFields={['name', 'sku']}
  pageSize={25}
/>
```

### With Filters

```tsx
const filters = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
    ],
  },
];

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  filters={filters}
  defaultFilters={{ category: 'electronics' }}
/>
```

### With Row Actions

```tsx
import { Eye, Edit, Trash2 } from 'lucide-react';

const rowActions = [
  {
    id: 'view',
    label: 'View',
    icon: <Eye className="w-4 h-4" />,
    onClick: (row) => navigate(`/items/${row.id}`),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="w-4 h-4" />,
    onClick: (row) => setEditing(row),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => handleDelete(row.id),
  },
];

<FullFunctionalTable
  data={products}
  columns={columns}
  rowKey="id"
  rowActions={rowActions}
/>
```

---

## 🔧 Column Configuration

### Basic Column

```tsx
{
  id: 'name',
  field: 'name',
  label: 'Product Name',
  sortable: true,
}
```

### Custom Render

```tsx
{
  id: 'price',
  field: 'price',
  label: 'Price',
  align: 'right',
  render: (row) => `₹${row.price.toLocaleString('en-IN')}`,
}
```

### With Badge

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

---

## 🎛️ Filter Types

### Select Filter

```tsx
{
  id: 'category',
  label: 'Category',
  type: 'select',
  placeholder: 'All Categories',
  options: [
    { value: 'electronics', label: 'Electronics' },
  ],
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
  customRender: ({ value, onChange }) => (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-[3px]"
    />
  ),
}
```

---

## 🎯 Actions

### Row Actions

```tsx
const rowActions = [
  {
    id: 'view',
    label: 'View',
    icon: <Eye className="w-4 h-4" />,
    onClick: (row) => console.log(row),
  },
];
```

### Bulk Actions

```tsx
const bulkActions = [
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick: (rows) => console.log(rows),
  },
];
```

---

## ⚡ Features Cheatsheet

| Feature | Prop | Example |
|---------|------|---------|
| **Selection** | `selectable` | `selectable` |
| **Search** | `enableSearch` | `enableSearch searchFields={['name']}` |
| **Filters** | `filters` | `filters={filterConfig}` |
| **Sorting** | `sortable` | `sortable defaultSort={{ field: 'name', direction: 'asc' }}` |
| **Pagination** | `pageSize` | `pageSize={25}` |
| **Row Actions** | `rowActions` | `rowActions={actions}` |
| **Bulk Actions** | `bulkActions` | `bulkActions={bulkActions}` |
| **Loading** | `isLoading` | `isLoading={true}` |
| **Error** | `error` | `error="Failed to load"` |
| **Density** | `density` | `density="compact"` |

---

## 🎨 Styling

### Column Width

```tsx
{
  id: 'sku',
  field: 'sku',
  label: 'SKU',
  width: '120px',
  minWidth: '100px',
  maxWidth: '200px',
}
```

### Column Alignment

```tsx
{
  id: 'price',
  field: 'price',
  label: 'Price',
  align: 'right', // 'left' | 'center' | 'right'
}
```

### Custom Class

```tsx
{
  id: 'name',
  field: 'name',
  label: 'Name',
  className: 'font-bold text-gray-900',
}
```

---

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Toggle filters |
| `Ctrl/Cmd + Shift + C` | Clear all filters |
| `Escape` | Close modals/menus |

---

## 💾 State Management

### Controlled Selection

```tsx
const [selected, setSelected] = useState([]);

<FullFunctionalTable
  selectedRows={selected}
  onSelectionChange={setSelected}
/>
```

### Save to LocalStorage

```tsx
onColumnVisibilityChange={(cols) => {
  localStorage.setItem('columns', JSON.stringify(cols));
}}

onDensityChange={(density) => {
  localStorage.setItem('density', density);
}}
```

---

## 📦 Props Quick List

### Required
- `data` - Array of items
- `columns` - Column configuration
- `rowKey` - Unique ID field

### Optional (Most Used)
- `selectable` - Enable checkboxes
- `enableSearch` - Enable search
- `searchFields` - Fields to search
- `filters` - Filter configuration
- `rowActions` - Row action buttons
- `bulkActions` - Bulk action buttons
- `pageSize` - Items per page
- `isLoading` - Loading state
- `error` - Error message

---

## 🔍 Type Imports

```tsx
import type {
  FullFunctionalTableProps,
  ColumnConfig,
  DataGridFilter,
  RowAction,
  BulkAction,
} from '../../components/ui/FullFunctionalTable.types';
```

---

## 📝 Complete Example

```tsx
import { useState, useMemo } from 'react';
import { FullFunctionalTable } from '../../components/ui/FullFunctionalTable';
import type { ColumnConfig, DataGridFilter, RowAction } from '../../components/ui/FullFunctionalTable.types';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  const columns = useMemo<ColumnConfig<Product>[]>(() => [
    {
      id: 'name',
      field: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      id: 'price',
      field: 'price',
      label: 'Price',
      align: 'right',
      render: (row) => `₹${row.price.toLocaleString()}`,
    },
  ], []);

  const filters = useMemo<DataGridFilter[]>(() => [
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
      ],
    },
  ], []);

  const rowActions = useMemo<RowAction<Product>[]>(() => [
    {
      id: 'view',
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => console.log(row),
    },
  ], []);

  return (
    <FullFunctionalTable
      data={products}
      columns={columns}
      rowKey="id"
      selectable
      enableSearch
      searchFields={['name']}
      filters={filters}
      rowActions={rowActions}
      pageSize={25}
    />
  );
}
```

---

**For full documentation, see:** `/docs/FullFunctionalTable-Usage-Guide.md`
