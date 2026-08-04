# 🎯 Visual Integration Guide - Copy & Paste Ready

## 📍 Step 1: Locate the Add-Item Section

In `/pages/inventory/ItemMaster.tsx`, find **line 1996**:

```tsx
      ) : currentView === 'add-item' ? (
        /* Add Item View */
        <div className="p-6 pb-[49px]">
          {/* OLD FORM STARTS HERE - DELETE FROM THIS LINE... */}
```

Scroll down to **line 4886**:

```tsx
          </div>  {/* OLD FORM ENDS HERE - ...TO THIS LINE */}
      ) : (
        /* Item Details View */
```

---

## 📍 Step 2: Delete the Old Form

**SELECT and DELETE lines 1996-4886** (2,890 lines total)

---

## 📍 Step 3: Paste the New Stepper

Copy this EXACT code and paste where you deleted:

```tsx
      ) : currentView === 'add-item' ? (
        /* Add Item View - NEW STEPPER IMPLEMENTATION */
        <AddItemStepper
          sidebarExpanded={sidebarExpanded}
          onCancel={() => {
            setCurrentView('list');
            setCurrentStep(1);
            setCompletedSteps([]);
          }}
          onSubmit={() => {
            alert('Item submitted successfully!');
            setCurrentView('list');
            setCurrentStep(1);
            setCompletedSteps([]);
          }}
          addItemType={addItemType}
          setAddItemType={setAddItemType}
          gstApplicable={gstApplicable}
          setGstApplicable={setGstApplicable}
          hsnSacCode={hsnSacCode}
          setHsnSacCode={setHsnSacCode}
          gstRate={gstRate}
          setGstRate={setGstRate}
          sacSearchTerm={sacSearchTerm}
          setSacSearchTerm={setSacSearchTerm}
          showSacDropdown={showSacDropdown}
          setShowSacDropdown={setShowSacDropdown}
          sacCodeError={sacCodeError}
          setSacCodeError={setSacCodeError}
          allHsnSacCodes={sacCodesDatabase.map(sac => ({
            code: sac.code,
            description: sac.description,
            gstRate: parseInt(sac.gstRate)
          }))}
          addOpeningStock={addOpeningStock}
          setAddOpeningStock={setAddOpeningStock}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          defaultBinLocation={defaultBinLocation}
          setDefaultBinLocation={setDefaultBinLocation}
          binLocationWarehouseSearch={binLocationWarehouseSearch}
          setBinLocationWarehouseSearch={setBinLocationWarehouseSearch}
          showBinLocationWarehouseDropdown={showBinLocationWarehouseDropdown}
          setShowBinLocationWarehouseDropdown={setShowBinLocationWarehouseDropdown}
          attachedVendors={attachedVendors}
          setAttachedVendors={setAttachedVendors}
          selectedVendorRows={selectedVendorRows}
          setSelectedVendorRows={setSelectedVendorRows}
        />
      ) : (
```

---

## ✅ Step 4: Save & Test!

Save the file and test by:
1. Go to Item Master page
2. Click "Add Item" button
3. See the new 5-step stepper!

---

## 🎁 BONUS: Add Test Vendors

Want to see vendors in Step 4? Add this to ItemMaster.tsx:

**Find line 455** (where attachedVendors is defined):
```tsx
const [attachedVendors, setAttachedVendors] = useState<AttachedVendor[]>([
  // OLD TEST DATA HERE
]);
```

**Replace with:**
```tsx
import { testVendors } from '../data/testVendors';

const [attachedVendors, setAttachedVendors] = useState<AttachedVendor[]>(testVendors);
```

Now you'll have **10 sample vendors** pre-loaded with AI risk scores!

---

## 🚀 DONE!

**That's it! Your modern Add Item stepper is now live.**

**Test it:**
- ✅ Fill Step 1 → Click Next
- ✅ Fill Step 2 → Click Next  
- ✅ Upload images in Step 3 → Click Next
- ✅ See vendors in Step 4 → Click Next
- ✅ Review everything in Step 5 → Submit!

**Enjoy your new enterprise-grade form experience! 🎉**
