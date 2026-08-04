# 🚀 PROMPT: Complete Phase 2 Filter Implementation in FullFunctionalTable

**Copy this entire prompt and paste to your AI assistant:**

---

I need you to complete Phase 2 of the advanced filter implementation in `/components/ui/FullFunctionalTable.tsx`. Phase 1 (types, state, and basic UI foundation) is already complete.

## 📋 CONTEXT

The FullFunctionalTable component already has:
- ✅ All filter type definitions in `FullFunctionalTable.types.ts`
- ✅ All filter state variables initialized
- ✅ FilterToggleButton component imported and rendered
- ✅ Search functionality working

## 🎯 WHAT YOU NEED TO IMPLEMENT

Follow this exact order for best results:

---

### STEP 1: Add Computed Values (After state, before render)

Add these two computed values right after the `visibleColumnConfigs` useMemo:

```typescript
// Calculate active filter count
const activeFilterCount = useMemo(() => {
  let count = 0;
  Object.values(activeFilters).forEach(value => {
    if (value) count++;
  });
  if (appliedDateRange) count++;
  return count;
}, [activeFilters, appliedDateRange]);

// Get visible filters based on visibility conditions
const visibleFilters = useMemo(() => {
  if (!filters) return [];
  return filters.filter(filter => {
    if (typeof filter.visible === 'function') {
      return filter.visible(activeFilters);
    }
    return filter.visible !== false;
  });
}, [filters, activeFilters]);
```

---

### STEP 2: Add Filter Handlers (After existing handlers like handleSort)

Add these handler functions:

```typescript
/**
 * Handle individual filter change
 */
const handleFilterChange = useCallback((filterId: string, value: any) => {
  setActiveFilters(prev => {
    const newFilters = {
      ...prev,
      [filterId]: value || undefined
    };
    
    // Remove undefined keys
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] === undefined || newFilters[key] === '') {
        delete newFilters[key];
      }
    });
    
    // Call onChange callback
    onFilterChange?.(newFilters);
    
    return newFilters;
  });
  
  // Reset to page 1 when filters change
  setCurrentPage(1);
  
  // Clear selection when filters change
  if (selectable && selectedRows.length > 0) {
    setSelectedRows([]);
  }
}, [onFilterChange, selectable, selectedRows.length, setCurrentPage, setSelectedRows]);

/**
 * Clear all filters
 */
const handleClearAllFilters = useCallback(() => {
  setActiveFilters({});
  setAppliedDateRange(null);
  setTempDateRange({ start: '', end: '' });
  setSelectedDateRange('');
  setSearchTerm('');
  setCurrentPage(1);
  setSelectedRows([]);
  
  onFilterChange?.({});
}, [onFilterChange, setCurrentPage, setSelectedRows]);

/**
 * Clear individual filter
 */
const handleClearFilter = useCallback((filterId: string) => {
  handleFilterChange(filterId, '');
}, [handleFilterChange]);

/**
 * Apply date range filter
 */
const handleApplyDateRange = useCallback(() => {
  if (tempDateRange.start && tempDateRange.end) {
    setAppliedDateRange({ ...tempDateRange });
    setShowDateRangePicker(false);
    setCurrentPage(1);
    
    // Clear selection
    if (selectable && selectedRows.length > 0) {
      setSelectedRows([]);
    }
  }
}, [tempDateRange, selectable, selectedRows.length, setCurrentPage, setSelectedRows]);

/**
 * Clear date range filter
 */
const handleClearDateRange = useCallback(() => {
  setAppliedDateRange(null);
  setTempDateRange({ start: '', end: '' });
  setSelectedDateRange('');
  setCurrentPage(1);
}, [setCurrentPage]);
```

---

### STEP 3: Update Data Filtering Pipeline

**IMPORTANT:** Update the existing data processing flow. Currently it goes:
`data → searchedData → sortedData → paginatedData`

Change it to:
`data → searchedData → filteredData → sortedData → paginatedData`

Add this NEW useMemo RIGHT AFTER the existing `searchedData` useMemo:

```typescript
// Apply filters
const filteredData = useMemo(() => {
  // If custom filter function provided, use it
  if (onFilter && (Object.keys(activeFilters).length > 0 || appliedDateRange)) {
    return onFilter(activeFilters, searchedData);
  }
  
  // Default filter logic
  let result = [...searchedData];
  
  // Apply each active filter
  if (filters) {
    filters.forEach(filter => {
      const filterValue = activeFilters[filter.id];
      if (!filterValue) return;
      
      if (filter.type === 'select') {
        result = result.filter(row => {
          const rowValue = String(row[filter.id as keyof T] || '');
          return rowValue === filterValue;
        });
      }
    });
  }
  
  // Apply date range filter if present
  if (appliedDateRange) {
    result = result.filter(row => {
      // Assumes row has a 'date' field - customize as needed
      const rowDate = row.date ? new Date(row.date) : null;
      if (!rowDate) return false;
      
      const startDate = new Date(appliedDateRange.start);
      const endDate = new Date(appliedDateRange.end);
      
      return rowDate >= startDate && rowDate <= endDate;
    });
  }
  
  return result;
}, [searchedData, activeFilters, appliedDateRange, filters, onFilter]);
```

**Then UPDATE the existing `sortedData` useMemo to use `filteredData` instead of `searchedData`:**

```typescript
// Sort data
const sortedData = useMemo(() => {
  if (!sortField || !sortDirection) return filteredData; // CHANGED from searchedData
  
  return [...filteredData].sort((a, b) => { // CHANGED from searchedData
    // ... rest of existing sort logic stays the same
  });
}, [filteredData, sortField, sortDirection]); // CHANGED dependency from searchedData
```

**Also UPDATE the `totalPages` calculation to use `filteredData`:**

```typescript
const totalPages = Math.ceil(filteredData.length / pageSize); // CHANGED from sortedData.length
```

---

### STEP 4: Update FilterToggleButton activeCount

Find the existing FilterToggleButton and update its `activeCount` prop:

```typescript
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={activeFilterCount} // CHANGED from 0
/>
```

---

### STEP 5: Add Collapsible Filter Section UI

Add this IMMEDIATELY AFTER the FilterToggleButton section (before Selection banner):

```typescript
{/* Collapsible Filter Section */}
{showFilters && filters && filters.length > 0 && (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
    {/* Filter grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleFilters.map(filter => {
        const isDisabled = typeof filter.disabled === 'function' 
          ? filter.disabled(activeFilters) 
          : filter.disabled || false;
        
        // Select filter
        if (filter.type === 'select') {
          return (
            <div key={filter.id}>
              <label className="block text-sm text-gray-700 mb-2">
                {filter.label}
                {filter.tooltip && (
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    title={filter.tooltip}
                  >
                    <Info className="w-3.5 h-3.5 inline" />
                  </button>
                )}
              </label>
              <StyledSelect
                value={activeFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                disabled={isDisabled}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                  {filter.placeholder || `All ${filter.label}`}
                </MenuItem>
                {filter.options?.map(option => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                    style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </StyledSelect>
              {filter.helpText && (
                <p className="text-xs text-gray-500 mt-1">{filter.helpText}</p>
              )}
            </div>
          );
        }
        
        // Date range filter
        if (filter.type === 'dateRange') {
          return (
            <div key={filter.id}>
              <label className="block text-sm text-gray-700 mb-2">
                {filter.label}
              </label>
              <button
                onClick={() => setShowDateRangePicker(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                style={{ height: '33px' }}
              >
                <span className={appliedDateRange ? 'text-gray-900' : 'text-gray-400'}>
                  {appliedDateRange 
                    ? `${new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : 'Select date range'
                  }
                </span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>
              {appliedDateRange && (
                <button
                  onClick={handleClearDateRange}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Clear date range
                </button>
              )}
            </div>
          );
        }
        
        // Custom filter
        if (filter.type === 'custom' && filter.customRender) {
          return (
            <div key={filter.id}>
              <label className="block text-sm text-gray-700 mb-2">
                {filter.label}
              </label>
              {filter.customRender({
                value: activeFilters[filter.id],
                onChange: (value) => handleFilterChange(filter.id, value),
                activeFilters
              })}
            </div>
          );
        }
        
        return null;
      })}
    </div>
    
    {/* Results summary and clear all */}
    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
      <span className="text-sm text-gray-600">
        Showing {filteredData.length} of {data.length} items
      </span>
      {activeFilterCount > 0 && (
        <button
          onClick={handleClearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  </div>
)}
```

---

### STEP 6: Add Filter Summary Banner

Add this AFTER the collapsible filter section, BEFORE the selection banner:

```typescript
{/* Filter Summary Banner */}
{activeFilterCount > 0 && !showFilters && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-blue-900 font-medium">Active filters:</span>
        
        {/* Search term badge */}
        {searchTerm && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200">
            <Search className="w-3 h-3" />
            {searchTerm}
            <button
              onClick={() => setSearchTerm('')}
              className="hover:bg-blue-200 rounded p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        
        {/* Regular filter badges */}
        {Object.entries(activeFilters).map(([filterId, value]) => {
          const filter = filters?.find(f => f.id === filterId);
          if (!filter || !value) return null;
          
          const displayValue = filter.type === 'select'
            ? filter.options?.find(opt => opt.value === value)?.label || value
            : value;
          
          return (
            <span 
              key={filterId}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200"
            >
              {filter.label}: {displayValue}
              <button
                onClick={() => handleClearFilter(filterId)}
                className="hover:bg-blue-200 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        
        {/* Date range badge */}
        {appliedDateRange && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200">
            <Calendar className="w-3 h-3" />
            {new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            <button
              onClick={handleClearDateRange}
              className="hover:bg-blue-200 rounded p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-blue-700">
          {filteredData.length} results
        </span>
        <button
          onClick={handleClearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear all
        </button>
      </div>
    </div>
  </div>
)}
```

---

### STEP 7: Add Date Range Picker Modal

Add this at the VERY END of the return statement, AFTER the pagination section:

```typescript
{/* Date Range Picker Modal */}
{showDateRangePicker && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
      onClick={() => {
        setShowDateRangePicker(false);
      }}
    />
    
    {/* Modal */}
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[400px] max-h-[90vh] overflow-auto">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base">Select Date Range</h3>
          <p className="text-xs text-gray-500 mt-1">Choose start and end dates for your filter</p>
        </div>
        <CloseButton
          onClick={() => setShowDateRangePicker(false)}
          size="medium"
        />
      </div>

      {/* Modal Content */}
      <div className="px-6 py-4">
        {/* Date Input Fields */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Date Range</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">From</label>
              <input
                type="date"
                value={tempDateRange.start}
                onChange={(e) => setTempDateRange({ ...tempDateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">To</label>
              <input
                type="date"
                value={tempDateRange.end}
                onChange={(e) => setTempDateRange({ ...tempDateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
              />
            </div>
          </div>
        </div>

        {/* Quick Select Options */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Quick Select</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Today', days: 0 },
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'This Month', days: 'month' },
              { label: 'Last Month', days: 'last-month' },
              { label: 'This Year', days: 'year' }
            ].map((option) => {
              const today = new Date().toISOString().split('T')[0];
              let expectedStart = today;
              let expectedEnd = today;
              
              if (typeof option.days === 'number') {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - option.days);
                expectedStart = startDate.toISOString().split('T')[0];
              } else if (option.days === 'month') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
              } else if (option.days === 'last-month') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                expectedEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
              } else if (option.days === 'year') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
              }
              
              const isSelected = tempDateRange.start === expectedStart && tempDateRange.end === expectedEnd;
              
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    const end = new Date().toISOString().split('T')[0];
                    let start = end;
                    
                    if (typeof option.days === 'number') {
                      const startDate = new Date();
                      startDate.setDate(startDate.getDate() - option.days);
                      start = startDate.toISOString().split('T')[0];
                    } else if (option.days === 'month') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    } else if (option.days === 'last-month') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                      setTempDateRange({ start, end: lastDay });
                      return;
                    } else if (option.days === 'year') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    }
                    
                    setTempDateRange({ start, end });
                  }}
                  className={`px-3 py-1.5 text-xs border rounded-[3px] transition-colors ${
                    isSelected 
                      ? 'bg-purple-50 border-[#5C1F3D] text-[#5C1F3D]' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-[#5C1F3D]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {tempDateRange.start && tempDateRange.end && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[3px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">
                {new Date(tempDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(tempDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl">
        <button
          onClick={() => {
            setTempDateRange({ start: '', end: '' });
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Selection
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowDateRangePicker(false);
            }}
            className="px-4 py-2 text-sm rounded-[3px] border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ height: '33px' }}
          >
            Cancel
          </button>
          <button
            disabled={!tempDateRange.start || !tempDateRange.end}
            onClick={handleApplyDateRange}
            className="px-4 py-2 text-sm rounded-[3px] bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ height: '33px' }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  </>
)}
```

---

### STEP 8: Add Keyboard Shortcuts

Add this useEffect AFTER the existing useEffect hooks:

```typescript
// Keyboard shortcuts for filters
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+K or Cmd+K to toggle filters
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (filters && filters.length > 0) {
        setShowFilters(prev => !prev);
      }
    }
    
    // Escape to close filter section
    if (e.key === 'Escape' && showFilters) {
      setShowFilters(false);
    }
    
    // Escape to close date picker
    if (e.key === 'Escape' && showDateRangePicker) {
      setShowDateRangePicker(false);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [filters, showFilters, showDateRangePicker]);
```

---

## ✅ VERIFICATION CHECKLIST

After implementation, verify:

1. **Filter Toggle Works**
   - [ ] FilterToggleButton shows active count badge
   - [ ] Clicking button shows/hides filter section
   - [ ] Ctrl+K / Cmd+K keyboard shortcut works

2. **Filter Section UI**
   - [ ] All filters render correctly
   - [ ] Select filters show dropdown options
   - [ ] Date range button opens modal
   - [ ] Results summary shows correct count
   - [ ] "Clear all filters" button works

3. **Data Filtering**
   - [ ] Selecting filter value updates table data
   - [ ] Multiple filters work together (AND logic)
   - [ ] Date range filtering works
   - [ ] Pagination resets to page 1 on filter change
   - [ ] Selection clears on filter change

4. **Filter Summary Banner**
   - [ ] Shows when filters active and section collapsed
   - [ ] Individual badges display correctly
   - [ ] Badge removal (X button) works
   - [ ] "Clear all" button works
   - [ ] Results count displays

5. **Date Range Picker**
   - [ ] Modal opens and closes correctly
   - [ ] Date inputs work
   - [ ] Quick select buttons work
   - [ ] Preview shows selected range
   - [ ] Apply button applies filter
   - [ ] Cancel button closes without applying
   - [ ] Clear button resets selection

6. **Keyboard Shortcuts**
   - [ ] Ctrl+K / Cmd+K toggles filter section
   - [ ] Escape closes filter section
   - [ ] Escape closes date range modal

---

## 🚨 IMPORTANT NOTES

1. **Use `filteredData` in sortedData**: Make sure sortedData uses filteredData, not searchedData
2. **Update totalPages**: Should use `filteredData.length`, not `sortedData.length`
3. **Keep existing code**: Don't remove any existing functionality
4. **Follow ERP guidelines**: All form elements must be 33px height
5. **No validation flags**: Don't add any form validation (ENABLE_VALIDATIONS is false)

---

## 📝 FILES TO MODIFY

- `/components/ui/FullFunctionalTable.tsx` - Add all Phase 2 code

---

That's it! Once you complete these steps, the FullFunctionalTable will have full advanced filtering functionality ready to use in the Stock Tab and any other table in the ERP application.
