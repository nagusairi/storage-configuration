# Migration Guide: Replace Existing Tables with FullFunctionalTable

## Quick Command for AI Assistant

**Use this prompt to migrate any existing table:**

```
Replace the existing table in [FILE_PATH] with the FullFunctionalTable component. 

Requirements:
1. Import FullFunctionalTable from '@/components/ui/FullFunctionalTable'
2. Convert existing columns to ColumnConfig format
3. Migrate row actions to RowAction format
4. Preserve all existing functionality (sorting, selection, pagination)
5. Keep current styling and behavior
6. Add row actions dropdown if not present
7. Enable search if beneficial for this data
8. Ensure 33px height consistency for all form elements

Current table location: [FILE_PATH]
```

---

## Step-by-Step Migration Process

### Step 1: Identify Tables to Replace

**Find all existing tables in your project:**

```bash
# Search for table elements
grep -r "<table" components/ --include="*.tsx"

# Search for existing DataGrid usage
grep -r "DataGrid" components/ --include="*.tsx"

# Search for custom table components
grep -r "Table" components/ --include="*.tsx"
```

**Common tables to replace:**
- Item Master table (`/components/ProductDetailsTabContent_StockTab.tsx`)
- Order tables (`/components/OrdersCommitmentsTabContent.tsx`)
- Invoice tables
- Customer/Vendor tables
- Transaction tables

---

### Step 2: Migration Template

**Before (Existing Custom Table):**
```tsx
// Old implementation
<div className="overflow-x-auto border border-gray-300 rounded-lg">
  <table className="w-full">
    <thead>
      <tr>
        <th>Item Name</th>
        <th>SKU</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
        <tr key={item.id}>
          <td>{item.itemName}</td>
          <td>{item.sku}</td>
          <td>{item.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**After (FullFunctionalTable):**
```tsx
import { FullFunctionalTable } from '@/components/ui/FullFunctionalTable';
import type { ColumnConfig, RowAction } from '@/components/ui/FullFunctionalTable.types';
import { Eye, Edit, Trash2 } from 'lucide-react';

// Column configuration
const columns: ColumnConfig<ItemType>[] = [
  {
    id: 'itemName',
    label: 'Item Name',
    field: 'itemName',
    sortable: true,
  },
  {
    id: 'sku',
    label: 'SKU',
    field: 'sku',
    sortable: true,
    render: (row) => (
      <div className="font-mono text-sm text-gray-600">{row.sku}</div>
    ),
  },
  {
    id: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    sortable: true,
    align: 'right',
  },
];

// Row actions
const rowActions: RowAction<ItemType>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => handleView(row.id),
  },
  {
    id: 'edit',
    label: 'Edit item',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => handleEdit(row.id),
  },
  {
    id: 'delete',
    label: 'Delete item',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => handleDelete(row.id),
  },
];

// Usage
<FullFunctionalTable
  data={items}
  columns={columns}
  rowKey="id"
  selectable
  enableSearch
  searchPlaceholder="Search items..."
  searchFields={['itemName', 'sku']}
  rowActions={rowActions}
  pageSize={25}
/>
```

---

### Step 3: Migration Checklist

Use this checklist for each table migration:

#### ✅ Pre-Migration
- [ ] Identify the file containing the table
- [ ] Document existing features (sorting, filtering, pagination, selection)
- [ ] Note custom styling or behaviors
- [ ] List all row actions (view, edit, delete, etc.)
- [ ] Identify data type/interface

#### ✅ During Migration
- [ ] Import FullFunctionalTable component
- [ ] Import type definitions (ColumnConfig, RowAction, BulkAction)
- [ ] Import required icons from lucide-react
- [ ] Create column configuration array
- [ ] Convert custom cell renderers to render functions
- [ ] Create row actions array
- [ ] Create bulk actions array (if needed)
- [ ] Configure pagination settings
- [ ] Set up search functionality
- [ ] Migrate selection logic
- [ ] Migrate sorting logic

#### ✅ Post-Migration
- [ ] Test all sorting functionality
- [ ] Test row selection (individual and select all)
- [ ] Test pagination controls
- [ ] Test search functionality
- [ ] Test row actions (view, edit, delete)
- [ ] Test bulk actions
- [ ] Verify responsive behavior
- [ ] Check accessibility (keyboard navigation, ARIA)
- [ ] Verify visual consistency (colors, spacing, borders)
- [ ] Remove old table code

---

## Common Migration Scenarios

### Scenario 1: Migrate Item Master Table

**File:** `/components/ProductDetailsTabContent_StockTab.tsx` (or similar)

**AI Prompt:**
```
Replace the existing Item Master inventory table in /components/ProductDetailsTabContent_StockTab.tsx with the FullFunctionalTable component.

Requirements:
- Preserve all existing columns (Item Name, Category, SKU, HSN Code, GST Rate, UOM, Available Qty, Reserved Qty, Incoming Qty, Open POs, Open SOs)
- Keep sticky first column behavior
- Maintain existing sort functionality
- Add row actions dropdown with View, Edit, Delete
- Enable search across itemName, sku, and category fields
- Keep checkbox selection with bulk delete
- Preserve conditional styling (red for out of stock, orange for low stock)
- Maintain 33px height standard for all controls
```

### Scenario 2: Migrate Purchase Orders Table

**File:** `/components/OrdersCommitmentsTabContent.tsx`

**AI Prompt:**
```
Replace the Purchase Orders table in /components/OrdersCommitmentsTabContent.tsx with FullFunctionalTable.

Requirements:
- Columns: PO Number, Vendor, Date, Status, Amount, Items Count
- Row actions: View PO, Edit PO, Cancel PO (danger variant)
- Enable search by PO number and vendor name
- Add status badge rendering (Pending: orange, Completed: green, Cancelled: red)
- Enable bulk export for selected POs
- Set default sort by date (descending)
- Page size: 25 items
```

### Scenario 3: Migrate Sales Orders Table

**File:** `/components/OrdersCommitmentsTabContent.tsx`

**AI Prompt:**
```
Replace the Sales Orders table in /components/OrdersCommitmentsTabContent.tsx with FullFunctionalTable.

Requirements:
- Columns: SO Number, Customer, Date, Status, Amount, Items Count
- Row actions: View SO, Edit SO, Mark as Shipped, Cancel SO
- Conditional row action: "Mark as Shipped" only visible for "Pending" status
- Enable search by SO number and customer name
- Add status badge rendering with appropriate colors
- Enable bulk operations: Export, Mark as Processed
- Set default sort by date (descending)
- Page size: 25 items
```

### Scenario 4: Migrate Invoice Table

**AI Prompt:**
```
Replace the invoice table in [FILE_PATH] with FullFunctionalTable.

Requirements:
- Columns: Invoice Number, Customer, Date, Due Date, Amount, Status, Payment Status
- Row actions: View Invoice, Download PDF, Send Email, Mark as Paid
- Conditional actions: "Mark as Paid" only for unpaid invoices
- Enable search by invoice number, customer name
- Add amount rendering with currency symbol (₹)
- Add overdue highlighting (red text for overdue unpaid invoices)
- Enable bulk download for selected invoices
- Set default sort by date (descending)
- Page size: 50 items
```

### Scenario 5: Migrate Customer/Vendor Master Table

**AI Prompt:**
```
Replace the customer/vendor master table in [FILE_PATH] with FullFunctionalTable.

Requirements:
- Columns: Name, Contact Person, Email, Phone, GST Number, City, Status
- Row actions: View Details, Edit, Activate/Deactivate, Delete
- Conditional actions: "Activate" for inactive, "Deactivate" for active
- Enable search by name, email, phone, GST number
- Add status badge (Active: green, Inactive: gray)
- Add email/phone rendering with icons
- Enable bulk export and bulk deactivate
- Set default sort by name (ascending)
- Page size: 25 items
```

---

## Detailed Migration Examples

### Example 1: Complete Item Master Table Migration

**Original Code (Before):**
```tsx
// Old custom table implementation
const [sortField, setSortField] = useState<string | null>(null);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
const [selectedRows, setSelectedRows] = useState<number[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(25);

return (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr>
          <th onClick={() => handleSort('itemName')}>Item Name</th>
          <th onClick={() => handleSort('sku')}>SKU</th>
          {/* More headers... */}
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(item => (
          <tr key={item.id}>
            <td>{item.itemName}</td>
            <td>{item.sku}</td>
            {/* More cells... */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

**Migrated Code (After):**
```tsx
import { FullFunctionalTable } from '@/components/ui/FullFunctionalTable';
import type { ColumnConfig, RowAction, BulkAction } from '@/components/ui/FullFunctionalTable.types';
import { Eye, Edit, Trash2, Download } from 'lucide-react';

// Define column configuration
const columns: ColumnConfig<InventoryItem>[] = [
  {
    id: 'itemName',
    label: 'Item Name',
    field: 'itemName',
    sortable: true,
  },
  {
    id: 'category',
    label: 'Category',
    field: 'category',
    sortable: true,
  },
  {
    id: 'sku',
    label: 'SKU Code',
    field: 'sku',
    sortable: true,
    render: (row) => (
      <div className="font-mono text-sm text-gray-600">
        {row.sku}
      </div>
    ),
  },
  {
    id: 'hsnCode',
    label: 'HSN Code',
    field: 'hsnCode',
    sortable: true,
    render: (row) => (
      <div className="font-mono text-sm text-gray-600">
        {row.hsnCode || '-'}
      </div>
    ),
  },
  {
    id: 'gstRate',
    label: 'GST Rate',
    field: 'gstRate',
    sortable: true,
    align: 'right',
    render: (row) => `${row.gstRate ?? 0}%`,
  },
  {
    id: 'uom',
    label: 'UOM',
    field: 'uom',
    sortable: true,
  },
  {
    id: 'availableQty',
    label: 'Available Quantity',
    field: 'availableQty',
    sortable: true,
    align: 'right',
    render: (row) => {
      const color = 
        row.availableQty === 0 ? 'text-red-600' :
        row.availableQty < row.reorderLevel ? 'text-orange-600' :
        'text-gray-900';
      return <span className={`text-sm ${color}`}>{row.availableQty}</span>;
    },
  },
  {
    id: 'reservedQty',
    label: 'Reserved Quantity',
    field: 'reservedQty',
    sortable: true,
    align: 'right',
  },
  {
    id: 'incomingQty',
    label: 'Incoming Quantity',
    field: 'incomingQty',
    sortable: true,
    align: 'right',
  },
  {
    id: 'openPOs',
    label: 'Open POs',
    field: 'openPOs',
    sortable: true,
    align: 'center',
    render: (row) => (
      <span className={`text-sm ${row.openPOs > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
        {row.openPOs}
      </span>
    ),
  },
  {
    id: 'openSOs',
    label: 'Open SOs',
    field: 'openSOs',
    sortable: true,
    align: 'center',
    render: (row) => (
      <span className={`text-sm ${row.openSOs > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
        {row.openSOs}
      </span>
    ),
  },
];

// Define row actions
const rowActions: RowAction<InventoryItem>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => {
      setSelectedItem(row);
      setCurrentView('details');
    },
  },
  {
    id: 'edit',
    label: 'Edit item',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => {
      navigate(`/inventory/items/${row.id}/edit`);
    },
  },
  {
    id: 'delete',
    label: 'Delete item',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => {
      if (confirm(`Are you sure you want to delete "${row.itemName}"?`)) {
        handleDeleteItem(row.id);
      }
    },
  },
];

// Define bulk actions
const bulkActions: BulkAction<InventoryItem>[] = [
  {
    id: 'export',
    label: 'Export',
    icon: <Download className="w-4 h-4" />,
    onClick: (rows) => {
      handleBulkExport(rows);
    },
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick: (rows) => {
      if (confirm(`Delete ${rows.length} item(s)?`)) {
        handleBulkDelete(rows.map(r => r.id));
      }
    },
  },
];

// State management
const [selectedRows, setSelectedRows] = useState<number[]>([]);

// Render
return (
  <FullFunctionalTable
    data={inventoryItems}
    columns={columns}
    rowKey="id"
    
    // Selection
    selectable
    selectedRows={selectedRows}
    onSelectionChange={setSelectedRows}
    
    // Sorting
    sortable
    defaultSort={{ field: 'itemName', direction: 'asc' }}
    
    // Pagination
    pageSize={25}
    pageSizeOptions={[10, 25, 50, 100]}
    
    // Density
    density="standard"
    
    // Actions
    rowActions={rowActions}
    bulkActions={bulkActions}
    
    // Search
    enableSearch
    searchPlaceholder="Search items by name, SKU, or category..."
    searchFields={['itemName', 'sku', 'category']}
    
    // Styling
    className="mt-4"
  />
);
```

---

## Migration Benefits

After migrating to FullFunctionalTable, you'll get:

✅ **Consistency** - All tables across the app have the same look and behavior  
✅ **Less Code** - Reduce ~500+ lines of boilerplate to ~100 lines of config  
✅ **Accessibility** - Built-in ARIA support and keyboard navigation  
✅ **Performance** - Optimized rendering with memoization  
✅ **Features** - Get search, advanced sorting, bulk actions for free  
✅ **Maintainability** - Single source of truth for table logic  
✅ **Portal Dropdowns** - No more overflow clipping issues  
✅ **Sticky Columns** - Professional UX out of the box  

---

## Troubleshooting Common Migration Issues

### Issue 1: Custom Cell Styling Not Applying

**Problem:**
```tsx
// Old code had custom classes
<td className="font-bold text-blue-600">{value}</td>
```

**Solution:**
```tsx
// Use render function
{
  id: 'fieldName',
  label: 'Field Name',
  field: 'fieldName',
  render: (row) => (
    <span className="font-bold text-blue-600">{row.fieldName}</span>
  ),
}
```

### Issue 2: Complex Row Click Behavior

**Problem:**
```tsx
// Old code had row onClick
<tr onClick={() => handleRowClick(item)}>
```

**Solution:**
```tsx
// Use onRowClick prop
<FullFunctionalTable
  data={items}
  columns={columns}
  rowKey="id"
  onRowClick={(row) => handleRowClick(row)}
/>
```

### Issue 3: Preserving Custom Filters

**Problem:** Old table had custom filter dropdowns above the table

**Solution:**
```tsx
// Keep filters outside the table
<div className="mb-4 flex gap-4">
  <StyledSelect value={categoryFilter} onChange={handleCategoryFilter}>
    {/* Filter options */}
  </StyledSelect>
  <StyledSelect value={statusFilter} onChange={handleStatusFilter}>
    {/* Filter options */}
  </StyledSelect>
</div>

<FullFunctionalTable
  data={filteredData} // Pass filtered data
  columns={columns}
  rowKey="id"
/>
```

### Issue 4: Maintaining State Across Navigation

**Problem:** Need to preserve selection when navigating away and back

**Solution:**
```tsx
// Use persistent state (localStorage, context, or state management)
const [selectedRows, setSelectedRows] = useLocalStorage('table-selection', []);

<FullFunctionalTable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  // ...
/>
```

---

## Testing Your Migration

After migration, test these scenarios:

### Functional Testing
- [ ] Sort each column (asc/desc/none cycle)
- [ ] Select individual rows
- [ ] Select all rows
- [ ] Clear selection
- [ ] Search with various terms
- [ ] Change page size
- [ ] Navigate between pages
- [ ] Click each row action
- [ ] Perform bulk actions
- [ ] Test empty state
- [ ] Test loading state
- [ ] Test error state

### Visual Testing
- [ ] All columns aligned correctly
- [ ] Row hover states work
- [ ] Sticky column has shadow on scroll
- [ ] Dropdown menu appears in correct position
- [ ] Selection checkboxes aligned
- [ ] Pagination controls centered
- [ ] Search bar matches design
- [ ] Buttons have consistent 33px height

### Accessibility Testing
- [ ] Tab through all interactive elements
- [ ] Press Enter/Space on buttons
- [ ] Press Escape to close dropdown
- [ ] Screen reader announces row count
- [ ] ARIA labels present on controls
- [ ] Focus visible on all elements

---

## Rollback Plan

If you need to rollback:

1. **Git Revert:**
```bash
git checkout [commit-hash] -- [file-path]
```

2. **Keep Backup:**
```bash
# Before migration, create backup
cp components/MyTable.tsx components/MyTable.backup.tsx
```

3. **Gradual Migration:**
- Migrate one table at a time
- Test thoroughly before moving to next table
- Keep old component files until all migrations complete

---

## Support

If you encounter issues during migration:

1. Check the [Usage Guide](/docs/FullFunctionalTable-Usage-Guide.md)
2. Review the [Type Definitions](/components/ui/FullFunctionalTable.types.ts)
3. Examine the [Component Source](/components/ui/FullFunctionalTable.tsx)
4. Use the AI prompt templates above for guidance

---

## Summary

**Quick Migration Command:**
```
Replace the [TABLE_NAME] table in [FILE_PATH] with FullFunctionalTable component, preserving all existing functionality and adding row actions dropdown with View/Edit/Delete options.
```

**Most Common Migration:**
```
Migrate the Item Master inventory table to use FullFunctionalTable with sticky columns, search, sorting, selection, bulk delete, and row actions (View/Edit/Delete).
```
