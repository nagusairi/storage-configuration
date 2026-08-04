# ProductAdditionalDetailsInput - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```tsx
import { ProductAdditionalDetailsInput } from '../../components/ui/ProductAdditionalDetailsInput';

const warehouses = [
  { id: 1, warehouseName: 'Main Warehouse', warehouseCode: 'WH-001' },
  { id: 2, warehouseName: 'Secondary', warehouseCode: 'WH-002' }
];

function MyForm() {
  return (
    <ProductAdditionalDetailsInput
      availableWarehouses={warehouses}
    />
  );
}
```

---

## 📋 Must-Have Props

| Prop | Type | What It Does |
|------|------|--------------|
| `availableWarehouses` | `Warehouse[]` | List of warehouses for bin locations (can be empty array) |

---

## 🎯 Common Use Cases

### 1. Basic Standalone
```tsx
<ProductAdditionalDetailsInput
  availableWarehouses={warehouses}
/>
```

### 2. With Change Handler
```tsx
<ProductAdditionalDetailsInput
  availableWarehouses={warehouses}
  onChange={(data) => {
    console.log('Data:', data);
    saveToServer(data);
  }}
/>
```

### 3. With Validation
```tsx
<ProductAdditionalDetailsInput
  availableWarehouses={warehouses}
  required
  showValidation={submitting}
  onValidationChange={(isValid, errors) => {
    setCanSubmit(isValid);
  }}
/>
```

### 4. Custom Image Size Limit
```tsx
<ProductAdditionalDetailsInput
  availableWarehouses={warehouses}
  maxImageSizeMB={5}  // 5MB instead of default 10MB
/>
```

### 5. With Initial Data
```tsx
<ProductAdditionalDetailsInput
  availableWarehouses={warehouses}
  initialData={{
    barcode: 'BAR123',
    qrCode: 'QR456',
    dimensions: { length: 10, width: 5, height: 3, unit: 'cm' },
    weight: { value: 2.5, unit: 'kg' },
    images: [],
    tracking: { batch: true, serial: false, expiry: true },
    hasBinLocation: true,
    binLocations: [
      {
        id: 1,
        warehouse: 'Main Warehouse',
        warehouseCode: 'WH-001',
        zone: 'Zone A',
        aisle: 'A1',
        rack: 'R1',
        shelf: 'S1',
        bin: 'BIN-001'
      }
    ]
  }}
/>
```

---

## 📦 Data Structure

### Warehouse Object
```tsx
{
  id: 1,                              // number or string
  warehouseName: 'Main Warehouse',    // Display name
  warehouseCode: 'WH-001'             // Short code
}
```

### Output Data Format
```tsx
{
  barcode: 'BAR123',                  // string
  qrCode: 'QR456',                    // string
  dimensions: {                       // Dimensions object
    length: 10,
    width: 5,
    height: 3,
    unit: 'cm'                        // 'cm' | 'm' | 'in' | 'ft'
  },
  weight: {                           // Weight object
    value: 2.5,
    unit: 'kg'                        // 'kg' | 'g' | 'lbs' | 'oz'
  },
  images: [                           // UploadedImage[]
    {
      file: File,
      preview: 'blob:...',
      id: 123456
    }
  ],
  tracking: {                         // TrackingOptions object
    batch: true,
    serial: false,
    expiry: true
  },
  hasBinLocation: true,               // boolean
  binLocations: [                     // BinLocation[]
    {
      id: 1,
      warehouse: 'Main Warehouse',
      warehouseCode: 'WH-001',
      zone: 'Zone A',
      aisle: 'A1',
      rack: 'R1',
      shelf: 'S1',
      bin: 'BIN-001'
    }
  ]
}
```

---

## ⚡ Pro Tips

### Tip 1: Image Upload Validation
```tsx
// Component automatically validates:
// - File type (PNG, JPG, GIF only)
// - File size (default 10MB, configurable)
// - Shows user-friendly error messages
```

### Tip 2: Listen to All Changes
```tsx
<ProductAdditionalDetailsInput
  onChange={(data) => {
    // Fires on ANY field change
    // Includes: barcode, dimensions, images, bin locations, etc.
    localStorage.setItem('productDetails', JSON.stringify(data));
  }}
/>
```

### Tip 3: Image Cleanup
```tsx
// Component automatically cleans up image URLs on unmount
// No memory leaks!
```

### Tip 4: Bin Location Breadcrumb Preview
```tsx
// When adding bin location, user sees:
// "Main Warehouse > Zone A > A1 > R1 > S1 > BIN-001"
// Automatically formatted!
```

### Tip 5: Primary Image
```tsx
// First uploaded image is automatically marked as "Primary"
// Shows badge in thumbnail and lightbox
```

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Barcode/QR** | Simple text inputs |
| **Dimensions** | Length, width, height with unit selector |
| **Weight** | Value with unit selector |
| **Image Upload** | Drag-drop, multiple, 10MB validation, lightbox |
| **Tracking** | 3 checkboxes for batch/serial/expiry |
| **Bin Location** | Complete warehouse location management |
| **Searchable Warehouse** | Type to filter warehouses |
| **Bulk Operations** | Select and remove multiple locations |
| **Lightbox Viewer** | Full-screen image viewer with navigation |
| **Validation** | Built-in validation with callbacks |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Images not uploading | Check file type (PNG/JPG/GIF) and size (10MB) |
| Warehouse dropdown empty | Provide `availableWarehouses` prop |
| Can't add bin location | Select a warehouse first (required field) |
| Images look blurry | Images are display-only, original files preserved |
| Validation not showing | Set `showValidation={true}` |

---

## 📦 Full Props Cheat Sheet

```tsx
<ProductAdditionalDetailsInput
  // Required (can be empty array)
  availableWarehouses={warehouses}     // Warehouse[]
  
  // Optional Data
  initialData={{                       // Partial<ProductAdditionalDetailsData>
    barcode: '',
    qrCode: '',
    dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
    weight: { value: 0, unit: 'kg' },
    images: [],
    tracking: { batch: false, serial: false, expiry: false },
    hasBinLocation: false,
    binLocations: []
  }}
  
  // Callbacks
  onChange={(data) => {}}              // (data: ProductAdditionalDetailsData) => void
  onValidationChange={(isValid, errors) => {}}  // (boolean, ValidationErrors) => void
  
  // Validation
  required={false}                     // boolean
  showValidation={false}               // boolean
  maxImageSizeMB={10}                  // number (MB)
  
  // Customization
  sectionTitle="Additional Details"    // string
  className="my-class"                 // string
  disabled={false}                     // boolean
/>
```

---

## 📖 Image Upload Rules

1. **Accepted Formats:** PNG, JPG, JPEG, GIF
2. **Max File Size:** 10MB (configurable via `maxImageSizeMB`)
3. **Multiple Upload:** No limit on number of images
4. **Drag & Drop:** Fully supported
5. **Primary Image:** First upload is automatically primary
6. **Delete:** Click X button on hover
7. **View:** Click thumbnail to open lightbox

---

## 🎯 Bin Location Workflow

1. Select "Yes" for Default Bin Location
2. Click "Add Warehouse Location"
3. Search and select warehouse (required)
4. Fill in Zone, Aisle, Rack, Shelf, Bin (optional)
5. Preview shows breadcrumb path
6. Click "Add Location"
7. Location appears in table
8. Can select multiple and bulk remove

---

## 📚 Type Imports

```tsx
import {
  ProductAdditionalDetailsInput,
  Warehouse,
  UploadedImage,
  Dimensions,
  Weight,
  TrackingOptions,
  BinLocation,
  ProductAdditionalDetailsData
} from '../../components/ui/ProductAdditionalDetailsInput';
```

---

## 🔗 Quick Links

- **Full Documentation:** `/docs/ProductAdditionalDetailsInput-Component-Documentation.md`
- **Component File:** `/components/ui/ProductAdditionalDetailsInput.tsx`
- **Design Specs:** `/docs/ProductAdditionalDetailsInput-Design-Specifications.md`

---

**Component:** `ProductAdditionalDetailsInput`  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
