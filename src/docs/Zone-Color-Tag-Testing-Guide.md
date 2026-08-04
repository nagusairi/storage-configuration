# Zone Color Tag - Testing Guide

## 🧪 **How to Test the Feature**

### **Test 1: Predefined Color Selection**

**Steps:**
1. Navigate to Storage Hierarchy page
2. Select **Zone A - Production Area** (currently Blue 🔵)
3. Click **Edit** button
4. Scroll to **Zone Color Tag** field
5. Click the **Red** color button [🔴]
6. Verify "Selected: Red" displays below
7. Click **Save Changes**
8. Wait for success message: "Changes saved successfully"

**Expected Results:**
- ✅ Tree view shows: 📍 🔴 Zone A (red badge instead of blue)
- ✅ Details panel header has red left border
- ✅ Success toast appears for 3 seconds
- ✅ Edit panel closes automatically

---

### **Test 2: Custom Color Selection**

**Steps:**
1. Select **Zone B - Cold Storage** (currently Green 🟢)
2. Click **Edit** button
3. Click the **[🎨] Custom** button
4. Custom color picker panel expands
5. Click color picker → select **Hot Pink**
6. OR type in hex input: `#FF1493`
7. Verify preview shows pink color
8. Click **Save Changes**

**Expected Results:**
- ✅ Zone B shows pink badge 🎨 in tree
- ✅ Details panel shows pink left border
- ✅ Color persists when closing/reopening edit panel
- ✅ Custom color is not in predefined list

---

### **Test 3: Multiple Zone Edits**

**Steps:**
1. Edit Zone A → Change to Yellow
2. Save → Verify yellow badge
3. Edit Zone B → Change to Purple
4. Save → Verify purple badge
5. Edit Zone C → Change to Orange
6. Save → Verify orange badge
7. Navigate away and back
8. Verify all colors persist

**Expected Results:**
- ✅ All zones show correct colors
- ✅ Colors persist across page interactions
- ✅ Each save shows success message

---

### **Test 4: Cancel Edit (No Changes)**

**Steps:**
1. Select Zone A
2. Click Edit
3. Change color from Blue → Red
4. Click **Cancel** (X button)
5. Confirm "Discard changes" dialog
6. Verify zone still shows Blue badge

**Expected Results:**
- ✅ Changes are not saved
- ✅ Zone A remains Blue
- ✅ Edit panel closes without updating data

---

### **Test 5: Custom Color Hex Input**

**Steps:**
1. Select any zone
2. Click Edit
3. Click Custom color button
4. Type in hex field: `#00FF00` (pure green)
5. Verify color picker updates
6. Type: `#FF0000` (pure red)
7. Verify color picker updates again
8. Save and verify red custom badge

**Expected Results:**
- ✅ Hex input syncs with color picker
- ✅ Color picker syncs with hex input
- ✅ Invalid hex values are handled
- ✅ Custom red (#FF0000) saves correctly

---

### **Test 6: Switch Between Predefined and Custom**

**Steps:**
1. Select Zone D
2. Click Edit
3. Click Blue (predefined)
4. Verify "Selected: Blue"
5. Click Custom button
6. Pick pink from picker
7. Verify "Selected: #FF1493 (Custom)"
8. Click Green (predefined)
9. Verify "Selected: Green" (custom picker closes)
10. Save

**Expected Results:**
- ✅ Can switch between predefined and custom
- ✅ Custom picker shows/hides correctly
- ✅ Last selected color is saved
- ✅ Selected color display updates accurately

---

### **Test 7: All Zones Different Colors**

**Steps:**
1. Zone A → Blue
2. Zone B → Green
3. Zone C → Yellow
4. Zone D → Orange
5. Zone E → Red
6. Zone F → Purple
7. Zone G → Gray

**Expected Results:**
- ✅ Tree view shows rainbow of badges:
  ```
  📦 Warehouse A
    └── 📍 🔵 Zone A
    └── 📍 🟢 Zone B
    └── 📍 🟡 Zone C
    └── 📍 🟠 Zone D
    └── 📍 🔴 Zone E
    └── 📍 🟣 Zone F
    └── 📍 ⚪ Zone G
  ```
- ✅ Each details panel shows matching left border

---

### **Test 8: Console Logging**

**Steps:**
1. Open browser DevTools (F12) → Console tab
2. Select any zone
3. Click Edit
4. Click different color buttons
5. Type in custom color hex
6. Click Save

**Expected Console Output:**
```
🎨 Color selected: red
🎨 Color selected: custom
🎨 Custom color changed: #FF1493
Saving changes for node: ZN-001 { name: 'Zone A', colorTag: '#FF1493', ... }
✅ Changes saved successfully
```

---

### **Test 9: Form State Persistence**

**Steps:**
1. Edit Zone A
2. Change name to "Zone A Modified"
3. Change color to Red
4. Change description
5. Click Save
6. Re-open Edit panel
7. Verify all changes persisted

**Expected Results:**
- ✅ Name = "Zone A Modified"
- ✅ Color = Red (red button selected)
- ✅ Description = updated text
- ✅ Form reflects saved data

---

### **Test 10: Visual Consistency**

**Check all visual elements:**

**Tree View Badge:**
- ✅ Size: 12px x 12px
- ✅ Shape: Circular (rounded-full)
- ✅ Border: 2px white
- ✅ Shadow: shadow-sm
- ✅ Position: After type icon, before name

**Details Panel Border:**
- ✅ Width: 4px
- ✅ Position: Left side of header
- ✅ Color: Matches zone color exactly
- ✅ Only on zones (not other location types)

**Edit Form Color Buttons:**
- ✅ Size: 40px x 40px (outer)
- ✅ Inner square: 32px x 32px
- ✅ Border: 2px (normal), 2px + ring (selected)
- ✅ Border radius: 3px
- ✅ Hover effect on non-selected

**Custom Color Picker:**
- ✅ Expands when Custom clicked
- ✅ Color picker: 64px wide, 40px tall
- ✅ Hex input: Full width, 33px height
- ✅ Font: Monospace for hex
- ✅ Real-time sync between picker and input

---

## 🐛 **Known Issues / Edge Cases:**

### **Issue 1: Invalid Hex Input**
**Test:** Type `#GGGGGG` in hex field  
**Expected:** Should not break, might revert to previous color  

### **Issue 2: Extremely Long Color Names**
**Test:** Custom color with max length hex  
**Expected:** Display truncates gracefully  

### **Issue 3: Rapid Color Changes**
**Test:** Click multiple colors rapidly  
**Expected:** Last clicked color is selected  

### **Issue 4: Save While Loading**
**Test:** Click Save multiple times rapidly  
**Expected:** Button disabled during save, prevents duplicate calls  

---

## ✅ **Acceptance Criteria:**

All tests pass if:
- ✅ Colors can be selected (predefined + custom)
- ✅ Colors persist after save
- ✅ Tree view shows colored badges
- ✅ Details panel shows colored border
- ✅ Success message appears after save
- ✅ Cancel discards unsaved changes
- ✅ Custom color picker works correctly
- ✅ Visual indicators match specifications
- ✅ No console errors during normal operation
- ✅ Form data updates correctly

---

## 📊 **Test Coverage:**

| Feature | Test Case | Status |
|---------|-----------|--------|
| Predefined Color Selection | Test 1 | ✅ |
| Custom Color Picker | Test 2 | ✅ |
| Multiple Edits | Test 3 | ✅ |
| Cancel Changes | Test 4 | ✅ |
| Hex Input | Test 5 | ✅ |
| Mode Switching | Test 6 | ✅ |
| Visual Badges | Test 7 | ✅ |
| Console Logging | Test 8 | ✅ |
| State Persistence | Test 9 | ✅ |
| Visual Consistency | Test 10 | ✅ |

---

## 🎯 **Quick Smoke Test (2 minutes):**

1. Select Zone A → Edit → Change Blue to Red → Save
2. Verify tree shows red badge
3. Select Zone B → Edit → Click Custom → Pick pink → Save
4. Verify tree shows pink badge
5. Click Edit on Zone B again → Verify pink is still selected

**If all 5 steps work → Feature is functional ✅**

---

## 🔧 **Debugging Tips:**

**If colors not saving:**
- Check console for error messages
- Verify `handleSaveChanges()` is called
- Check `updateNodeInHierarchy()` return value
- Verify `setHierarchyData()` is updating state

**If badges not showing:**
- Verify `node.colorTag` exists in data
- Check `getColorDisplay()` returns correct values
- Inspect element to see if classes are applied
- Check if `isCustom` logic is working

**If custom picker not working:**
- Verify `showCustomColorPicker` state
- Check hex validation
- Ensure `handleCustomColorChange` is called
- Verify color picker input value binding

---

## 📝 **Manual Test Checklist:**

Before marking feature complete:
- [ ] Test all 7 predefined colors
- [ ] Test at least 3 custom colors
- [ ] Test switching between predefined and custom
- [ ] Test cancel without saving
- [ ] Test save with other form fields changed
- [ ] Test multiple consecutive edits
- [ ] Test on different zones
- [ ] Verify visual consistency across all zones
- [ ] Check console for errors
- [ ] Verify success toast appears
- [ ] Test hex input with various values
- [ ] Verify state persistence after page interactions

---

**Feature Status: ✅ READY FOR TESTING**
