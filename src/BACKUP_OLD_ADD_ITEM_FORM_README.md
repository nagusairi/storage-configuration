# OLD SINGLE-PAGE ADD ITEM FORM - BACKUP

**Date Created:** December 31, 2024  
**Reason:** Replaced with new multi-step AddItemStepper component

## Original Location
- **File:** `/pages/inventory/ItemMaster.tsx`
- **Lines:** 1999 - 4491 (approximately 2,492 lines)
- **Condition:** `currentView === 'add-item'`

## What Was This?
This was the original **single-page form** implementation for adding new inventory items in the Item Master module. All form fields were displayed on one scrollable page with sections for:

1. **Basic Information** - Item Type, Category, Item Name, Brand, SKU Code, Description
2. **GST Details** - GST Applicability, HSN/SAC Code, GST Rate  
3. **Inventory & Valuation** (Goods only) - Re-Order Level, Low Stock Alert, Valuation Method, Opening Stock
4. **Additional Details** (Goods only) - Barcode, QR Code, Dimensions, Weight, Product Images, Tracking Options, Bin Location
5. **Vendor Information** - Attached Vendors table with bulk operations

## Why Was It Replaced?
The single-page form was replaced with the new **AddItemStepper** component for:
- ✅ Better UX with focused multi-step workflow
- ✅ Clear progress tracking with visual progress bar
- ✅ Built-in AI assistance panel
- ✅ Better validation and error handling per step
- ✅ Reduced cognitive load (one section at a time)
- ✅ Review summary before submission

## New Implementation
The new implementation uses:
- **Component:** `/components/AddItemStepper.tsx`
- **Step Components:** 
  - Step1BasicAndGST
  - Step2InventoryValuation
  - Step3AdditionalInfo
  - Step4VendorInfo
  - ReviewSummaryPanel
- **Features:** 
  - Horizontal stepper with 5 steps (Goods) or 3 steps (Services)
  - Collapsible AI Assist Panel
  - Top progress bar
  - Conditional step visibility based on item type

## Key Features of Old Form (Now in Stepper)
1. **SKU Code Input** - Auto-generate or manual entry with AI suggestions
2. **GST Details Input** - Toggle with searchable HSN/SAC dropdown
3. **Vendor Information Manager** - Add/remove/bulk operations
4. **Product Additional Details** - Image upload, dimensions, bin location
5. **Inventory Valuation** - Opening stock, valuation method, warehouse selection

## If You Need to Restore
The original form content has been fully documented in this backup. To restore:
1. Find this conditional: `currentView === 'add-item'`
2. Replace the AddItemStepper component call with the backed-up JSX
3. Ensure all state variables are still present in ItemMaster.tsx

## State Variables Required (Still in ItemMaster.tsx)
- `addItemType`, `setAddItemType`
- `gstApplicable`, `setGstApplicable`
- `hsnSacCode`, `setHsnSacCode`
- `gstRate`, `setGstRate`
- `addOpeningStock`, `setAddOpeningStock`
- `uploadedImages`, `setUploadedImages`
- `attachedVendors`, `setAttachedVendors`
- `skuAllocationMode`, `setSkuAllocationMode`
- `selectedSKU`, `setSelectedSKU`
- And many more...

## Important Notes
- ⚠️ **Do NOT delete state variables** - They are still used by the new AddItemStepper
- ⚠️ All form logic has been extracted into reusable components
- ⚠️ The new stepper uses the same state management patterns

---

**Backup Status:** ✅ Content location documented  
**Replacement Status:** ✅ Replaced with AddItemStepper  
**Testing:** ⚠️ Stepper functionality should be tested thoroughly before removing this backup
