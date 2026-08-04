# 🎯 COPY-PASTE PROMPT: Add Advanced Filters to FullFunctionalTable

**Use this prompt tonight to implement the filtering feature**

---

## 📋 THE PROMPT

Copy and paste this entire prompt to the AI assistant:

```
I need to add comprehensive advanced filtering functionality to the FullFunctionalTable component following the complete implementation guide at `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md`.

## CONTEXT
- I have a comprehensive implementation guide with all code ready
- The guide addresses 26 critical missing elements from the audit
- I need to follow the 4-phase approach exactly as documented

## TASK
Implement advanced filtering for FullFunctionalTable by following ALL sections in the implementation guide:

### Phase 1: Foundation (Sections 1-5)
1. Update `/components/ui/FullFunctionalTable.types.ts`:
   - Add `DataGridFilter` interface
   - Add `DateRangeValue` interface
   - Add `FilterPreset` interface
   - Update `FullFunctionalTableProps` with filter-related props

2. Update `/components/ui/FullFunctionalTable.tsx`:
   - Add filter state management (Section 2)
   - Add filter change handlers (Section 3)
   - Add URL persistence logic (Section 4)
   - Update data filtering pipeline (Section 5)

### Phase 2: UI Components (Sections 6-7, 9)
3. Add FilterToggleButton integration (Section 6):
   - ⚠️ CRITICAL: Use correct props (`isActive`, `onClick`, `activeCount`)
   - Add filter toggle + search bar layout

4. Add collapsible filter section (Section 7):
   - Filter grid with responsive layout
   - Select filters, date range button, custom filters
   - Loading states, tooltips, help text
   - Results summary and clear button

5. Add filter summary banner (Section 9):
   - Active filter badges with truncation
   - Individual badge removal
   - Results count display

### Phase 3: Advanced Features (Sections 8, 10-11)
6. Add date range picker modal (Section 8):
   - Complete modal with backdrop
   - Date inputs, quick select buttons
   - Preview and apply functionality

7. Add empty states (Section 10):
   - "No results match filters" state
   - "No data available" state
   - Clear filters / Add item actions

8. Add keyboard shortcuts (Section 11):
   - Ctrl+K / Cmd+K to toggle filters
   - Escape to close

### Phase 4: Testing
9. Ensure all functionality works:
   - Filter toggle shows/hides section
   - Active count updates correctly
   - Filters apply correctly to data
   - Pagination resets on filter change
   - Selection clears on filter change
   - Date range picker works
   - Empty states show correctly
   - Keyboard shortcuts work
   - 33px height maintained on all inputs

## REQUIREMENTS
- Follow the implementation guide EXACTLY - all code is production-ready
- Pay special attention to Section 6 (FilterToggleButton props fix)
- Maintain 33px height standard for all form inputs
- Use existing components (StyledSelect, CloseButton, Calendar icon)
- Add proper TypeScript types for all new code
- Include all error handling (try/catch blocks)
- Add all accessibility attributes (aria-label, role, etc.)
- Ensure responsive design (grid collapses on mobile)

## FILES TO MODIFY
- `/components/ui/FullFunctionalTable.types.ts` (add interfaces)
- `/components/ui/FullFunctionalTable.tsx` (main implementation)

## IMPORTS NEEDED
Add these imports to FullFunctionalTable.tsx:
```typescript
import { FilterToggleButton } from './FilterToggleButton';
import { StyledSelect, MenuItem } from './StyledSelect';
import { CloseButton } from './CloseButton';
import { Calendar, Info, X, Search, Plus, Package } from 'lucide-react';
```

## SUCCESS CRITERIA
✅ No TypeScript errors
✅ All filter types work (select, dateRange, custom)
✅ FilterToggleButton uses correct props
✅ Date range picker modal functions correctly
✅ Filter summary banner shows active filters
✅ Empty states display properly
✅ Keyboard shortcuts work
✅ Component is backward compatible (works without filters prop)
✅ 33px height maintained throughout

## DELIVERABLES
After implementation, I should be able to use the component like this:

```tsx
<FullFunctionalTable
  data={stockData}
  columns={columns}
  rowKey="id"
  
  // NEW: Filter configuration
  filters={[
    {
      id: 'status',
      label: 'Stock Status',
      type: 'select',
      placeholder: 'All Statuses',
      options: [
        { value: 'healthy', label: 'Healthy Stock' },
        { value: 'low', label: 'Low Stock' },
        { value: 'out', label: 'Out of Stock' }
      ],
      tooltip: 'Filter items by stock availability'
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      placeholder: 'All Warehouses',
      options: warehouseOptions
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'dateRange',
      placeholder: 'Select date range'
    }
  ]}
  
  // NEW: Custom filter logic
  onFilter={(filters, data) => {
    let result = [...data];
    
    if (filters.status) {
      result = result.filter(row => {
        const isLow = row.available < row.reorderLevel;
        const isOut = row.available === 0;
        
        if (filters.status === 'low') return isLow && !isOut;
        if (filters.status === 'out') return isOut;
        if (filters.status === 'healthy') return !isLow && !isOut;
        return true;
      });
    }
    
    if (filters.warehouse) {
      result = result.filter(row => row.warehouse === filters.warehouse);
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter(row => {
        const rowDate = new Date(row.date);
        return rowDate >= new Date(start) && rowDate <= new Date(end);
      });
    }
    
    return result;
  }}
  
  // Existing props
  enableSearch
  searchPlaceholder="Search warehouses..."
  searchFields={['warehouse', 'zone']}
  rowActions={rowActions}
  pageSize={25}
/>
```

## REFERENCE DOCUMENT
Full implementation details: `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md`

Please implement this following the guide exactly. Start with Phase 1 (types and state), then Phase 2 (UI), then Phase 3 (advanced features). Test after each phase.
```

---

## 📝 HOW TO USE THIS PROMPT

### **Step 1: Copy the entire prompt above**
- Select from "I need to add comprehensive..." to "...Test after each phase."
- Copy to clipboard

### **Step 2: Paste to AI Assistant**
- Start a new conversation (or continue this one)
- Paste the prompt
- Press Enter

### **Step 3: Let the AI implement**
- The AI will follow the guide in `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md`
- It will implement all 4 phases
- It will show you the code changes

### **Step 4: Review and test**
- Check the TypeScript errors are gone
- Test the filter functionality
- Run through the testing checklist

---

## 🎯 ALTERNATIVE: Phase-by-Phase Prompts

If you prefer to implement one phase at a time, use these smaller prompts:

### **PHASE 1 ONLY:**
```
Implement Phase 1 (Foundation) of the advanced filters feature for FullFunctionalTable:

1. Read `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md` sections 1-5
2. Update `/components/ui/FullFunctionalTable.types.ts` with all filter interfaces
3. Add filter state management to `/components/ui/FullFunctionalTable.tsx`
4. Add filter change handlers
5. Update data filtering pipeline

Follow the guide exactly. When done, I'll test and then we'll do Phase 2.
```

### **PHASE 2 ONLY:**
```
Implement Phase 2 (UI Components) of the advanced filters feature for FullFunctionalTable:

1. Read `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md` sections 6-7, 9
2. Add FilterToggleButton integration (⚠️ use correct props: isActive, onClick, activeCount)
3. Add collapsible filter section with grid layout
4. Add filter summary banner with badges

Follow the guide exactly. Test the UI after implementation.
```

### **PHASE 3 ONLY:**
```
Implement Phase 3 (Advanced Features) of the advanced filters feature for FullFunctionalTable:

1. Read `/docs/FullFunctionalTable-Advanced-Filters-Implementation.md` sections 8, 10-11
2. Add date range picker modal with quick selects
3. Add empty states (no results vs no data)
4. Add keyboard shortcuts (Ctrl+K, Escape)

Follow the guide exactly. Test all features after implementation.
```

---

## 🚨 CRITICAL REMINDERS FOR THE AI

When you paste the prompt, the AI should:

1. ✅ Read the implementation guide first
2. ✅ Use exact code from the guide (it's production-ready)
3. ✅ Fix FilterToggleButton props (isActive, onClick, activeCount)
4. ✅ Import CloseButton (don't recreate it)
5. ✅ Maintain 33px height for all inputs
6. ✅ Add error handling (try/catch)
7. ✅ Make it backward compatible (works without filters prop)
8. ✅ Test after each phase

---

## 📊 EXPECTED OUTCOME

After running this prompt, you should have:

### **New Interfaces Added:**
- `DataGridFilter`
- `DateRangeValue`
- `FilterPreset`

### **New Props on FullFunctionalTable:**
- `filters?: DataGridFilter[]`
- `defaultFilters?: Record<string, any>`
- `onFilter?: (filters, data) => T[]`
- `filterLogic?: 'AND' | 'OR'`
- `persistFiltersInURL?: boolean`
- `onFilterChange?: (filters) => void`

### **New UI Components:**
- FilterToggleButton integration
- Collapsible filter section
- Date range picker modal
- Filter summary banner
- Empty states

### **New Features:**
- Multi-filter support
- Date range selection
- URL persistence
- Keyboard shortcuts
- Loading states
- Tooltips
- Badge truncation

---

## 🧪 TESTING AFTER IMPLEMENTATION

Run through this quick test:

```tsx
// Test 1: Component still works without filters
<FullFunctionalTable data={data} columns={columns} rowKey="id" />

// Test 2: Component works with filters
<FullFunctionalTable
  data={data}
  columns={columns}
  rowKey="id"
  filters={[
    { id: 'status', label: 'Status', type: 'select', options: [...] }
  ]}
/>

// Test 3: Filter toggle appears
// Click it - filter section should show/hide

// Test 4: Select a filter value
// Banner should show active filter badge

// Test 5: Click badge X
// Filter should clear

// Test 6: Click "Clear all filters"
// Everything resets
```

---

## 💡 PRO TIP

**For fastest implementation**, use the full prompt and let the AI implement all phases at once. The code is production-ready in the guide, so the AI can implement it quickly and correctly.

**For learning/understanding**, use the phase-by-phase prompts and test after each phase.

---

## 📞 IF SOMETHING GOES WRONG

If the AI makes a mistake or you get errors:

1. **Show the error and ask for fix:**
   ```
   I'm getting this TypeScript error: [paste error]
   
   Fix it according to the implementation guide section [X].
   ```

2. **Reset and try again:**
   ```
   Reset the changes to FullFunctionalTable.tsx and FullFunctionalTable.types.ts.
   
   Let's start over with Phase 1 only, following the guide more carefully.
   ```

3. **Ask for specific section:**
   ```
   Show me just the FilterToggleButton integration code from Section 6
   of the implementation guide.
   ```

---

**COPY THE PROMPT ABOVE AND YOU'RE READY TO GO! 🚀**
