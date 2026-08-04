# 🚀 VendorInformationManager - Quick Reference

## Component Name
**`VendorInformationManager`**

## Location
`/components/ui/VendorInformationManager.tsx`

---

## ⚡ Quick Start

```tsx
import { VendorInformationManager } from '../../components/ui/VendorInformationManager';

function ItemForm() {
  const [vendors, setVendors] = useState([]);
  const allVendors = [/* vendor master data */];

  return (
    <VendorInformationManager
      vendors={vendors}
      onVendorsChange={setVendors}
      availableVendors={allVendors}
    />
  );
}
```

---

## 📋 Required Props

| Prop | Type | Description |
|------|------|-------------|
| `vendors` | `Vendor[]` | Currently attached vendors |
| `onVendorsChange` | `(vendors: Vendor[]) => void` | Callback when vendors change |
| `availableVendors` | `Vendor[]` | All vendors from vendor master |

---

## 🎯 Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSectionHeader` | `boolean` | `true` | Show "Vendor Information" header |
| `sectionTitle` | `string` | `'Vendor Information'` | Custom section title |
| `className` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable all interactions |

---

## 🔧 Vendor Interface

```typescript
interface Vendor {
  id: number;
  vendorName: string;
  vendorCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  purchasePrice: number;
  currency: string;
  leadTime: number;
  leadTimeUnit: 'days' | 'weeks';
  minimumOrderQuantity: number;
  preferredVendor: boolean;
  notes: string;
}
```

---

## ✨ Key Features

✅ **Vendor Table** - Sortable table with row selection  
✅ **Bulk Actions** - Select all, remove multiple  
✅ **Add Modal** - Search and multi-select vendors  
✅ **Details Pane** - View/Edit vendor details  
✅ **Confirmation Dialogs** - Single/Bulk removal  
✅ **Empty States** - Helpful messages  
✅ **Search** - Filter vendors in Add modal  
✅ **State Management** - Fully self-contained  

---

## 📝 Common Patterns

### Pattern 1: Basic Form

```tsx
<form onSubmit={handleSubmit}>
  <VendorInformationManager
    vendors={vendors}
    onVendorsChange={setVendors}
    availableVendors={allVendors}
  />
  <button type="submit">Save Item</button>
</form>
```

### Pattern 2: Without Header

```tsx
<div>
  <h2>My Custom Header</h2>
  <VendorInformationManager 
    vendors={vendors}
    onVendorsChange={setVendors}
    availableVendors={allVendors}
    showSectionHeader={false}
  />
</div>
```

### Pattern 3: Custom Title

```tsx
<VendorInformationManager
  vendors={vendors}
  onVendorsChange={setVendors}
  availableVendors={allVendors}
  sectionTitle="Preferred Suppliers"
/>
```

### Pattern 4: Read-Only

```tsx
<VendorInformationManager
  vendors={vendors}
  onVendorsChange={setVendors}
  availableVendors={allVendors}
  disabled={isViewMode}
/>
```

---

## 🎬 User Interactions

### Add Vendor
1. Click "Add Vendor" button
2. Search for vendors (optional)
3. Select vendors via checkboxes
4. Click "Add X Vendors"

### View Vendor
1. Click on any vendor row
2. Side pane opens with details

### Edit Vendor
1. Open vendor details pane
2. Click "Edit" button
3. Modify fields
4. Click "Save Changes"

### Remove Single Vendor
1. Click trash icon in row, OR
2. Click "Remove" in details pane

### Remove Multiple Vendors
1. Select vendors via checkboxes
2. Click "Remove Selected"
3. Confirm removal

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal won't open | Check `disabled={false}` |
| No vendors in Add modal | Verify `availableVendors` data |
| Added vendors don't show | Check `onVendorsChange` callback |
| Side pane doesn't open | Verify vendor object structure |
| Search doesn't work | Ensure vendors have all required fields |

---

## 📖 Full Documentation

See: `/docs/VendorInformationManager-Component-Documentation.md`

---

## ✅ Features Summary

| Feature | Status |
|---------|--------|
| Table with selection | ✅ |
| Bulk actions | ✅ |
| Add modal with search | ✅ |
| Details pane (view/edit) | ✅ |
| Remove confirmation | ✅ |
| Empty states | ✅ |
| Disabled state | ✅ |
| Custom styling | ✅ |

---

## 📊 At a Glance

- **Props**: 7 (3 required, 4 optional)
- **Lines of Code**: ~1,100
- **Modals**: 3 (Add, Remove, Details)
- **Dependencies**: 6
- **Bundle Size**: ~35 KB

---

**Last Updated:** December 31, 2024
