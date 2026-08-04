# 📝 MANUAL INTEGRATION - Step by Step

## ⚠️ IMPORTANT: The automated edit is too large. Please do this manually.

Follow these steps **EXACTLY**:

---

## Step 1: Open the File

Open `/pages/inventory/ItemMaster.tsx` in your code editor

---

## Step 2: Find the Old Code

Press `Ctrl+G` (or `Cmd+G` on Mac) to "Go to Line"

Type: **1999**

You should see:
```tsx
      ) : currentView === 'add-item' ? (
        /* Add Item View */
```

---

## Step 3: Select the Old Code

**Starting at line 1999**, select from:
```tsx
      ) : currentView === 'add-item' ? (
```

**Down to line 4889** (ending with):
```tsx
          </div>
```

**DO NOT select line 4890** which is:
```tsx
      ) : (
```

---

## Step 4: Visual Guide for Selection

```tsx
1998:         </>
1999:       ) : currentView === 'add-item' ? (    ← START selecting HERE
2000:         /* Add Item View */
2001:         <div className="p-6 pb-[49px]">
...
... (2,890 lines of old form code)
...
4887:               </form>
4888:             </div>
4889:           </div>                             ← END selecting HERE
4890:       ) : (                                  ← DO NOT include this line
4891:         /* Item Details View with Contextual Pane */
```

---

## Step 5: Delete the Selected Code

Press **Delete** or **Backspace**

After deletion, you should see:
```tsx
1998:         </>
1999:       ) : (
2000:         /* Item Details View with Contextual Pane */
```

---

## Step 6: Position Your Cursor

Click at the **END of line 1998**, right after `</>`

Press **Enter** to create a new line

Your cursor should be on the new empty line 1999

---

## Step 7: Paste the New Code

Copy this ENTIRE block and paste:

```tsx
      ) : currentView === 'add-item' ? (
        /* Add Item View - NEW STEPPER IMPLEMENTATION */
        <div className="h-full flex flex-col">
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
        </div>
```

---

## Step 8: Verify the Result

After pasting, your code should look like:

```tsx
1998:         </>
1999:       ) : currentView === 'add-item' ? (
2000:         /* Add Item View - NEW STEPPER IMPLEMENTATION */
2001:         <div className="h-full flex flex-col">
2002:           <AddItemStepper
...
2062:           />
2063:         </div>
2064:       ) : (
2065:         /* Item Details View with Contextual Pane */
```

---

## Step 9: Save the File

Press `Ctrl+S` (or `Cmd+S` on Mac)

---

## Step 10: Check for Errors

Look at the bottom of your editor - there should be **NO red squiggly lines** or TypeScript errors.

If you see errors, check:
1. ✓ All parentheses and brackets match
2. ✓ No duplicate `) : (` lines
3. ✓ The indentation looks correct

---

## Step 11: Test It!

1. Refresh your browser
2. Navigate to Item Master page
3. Click **"Add Item"** button
4. You should see the **Horizontal Stepper**! 🎉

---

## ✅ Success Checklist

You'll know it worked when you see:

- [ ] Horizontal stepper bar at top with 5 steps
- [ ] "Basic & GST" is Step 1
- [ ] Progress bar under the steps
- [ ] Form fields for Item Type, Brand, Category, etc.
- [ ] AI Assist panel on the right
- [ ] Bottom action bar with "Cancel", "Save Draft", "Next" buttons

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'AddItemStepper'"
**Fix:** Make sure line 56 has:
```tsx
import { AddItemStepper } from '../../components/AddItemStepper';
```

### Error: "Property 'selectedVendorRows' does not exist"
**Fix:** Make sure line ~181 has:
```tsx
const [selectedVendorRows, setSelectedVendorRows] = useState<number[]>([]);
```

### Still seeing old form
**Fix:** 
1. Check you deleted the OLD code (lines 1999-4889)
2. Check you pasted the NEW code
3. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R`)

---

## 📊 File Size Comparison

**Before:** ~6,200 lines  
**After:** ~3,400 lines  
**Saved:** ~2,800 lines! ✨

---

**Need help? Check the browser console (F12) for error messages.**
