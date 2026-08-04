# Figma Inspector Fragment Warning

## Issue
Warning: Invalid prop `data-fg-cxkk234` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.

## Root Cause
This warning is caused by **Figma Make's development inspector** adding `data-fg-*` attributes to DOM elements for debugging and inspection purposes. When these attributes are applied to a `<Fragment>` component, React warns because Fragment only accepts `key` and `children` props.

## Affected Code
Location: `/pages/inventory/UnitOfMeasure.tsx` (line 3537)

```tsx
<tbody className="overflow-visible">
  {paginatedInventoryItems.map((item) => (
    <Fragment key={item.id}>
      {/* Main Item Row */}
      <tr>...</tr>
      
      {/* Expanded Variant Table Row (conditional) */}
      {expandedRows.includes(item.id) && (
        <tr>...</tr>
      )}
    </Fragment>
  ))}
</tbody>
```

## Why Fragment is Used
Fragment is necessary here because:
1. We're inside a `<tbody>` element (only `<tr>` elements are valid children)
2. Each item can render 1-2 `<tr>` elements (main row + optional expanded row)
3. React requires a key when mapping, but we can't wrap `<tr>` elements in a `<div>`

## Is This a Real Problem?
**No.** This is a **development-time warning only**:

✅ **Production builds are NOT affected**  
✅ **Functionality works correctly**  
✅ **No runtime errors occur**  
✅ **The code follows React best practices**  

The warning only appears because Figma Make's inspector adds debugging attributes during development.

## Solutions

### Option 1: Accept the Warning (RECOMMENDED)
**Do nothing.** This is a development tool artifact that:
- Only appears in Figma Make's development environment
- Does not affect production builds
- Does not impact functionality
- Is not caused by our code

**Pros:**
- ✅ No code changes needed
- ✅ Maintains clean, idiomatic React code
- ✅ No performance impact

**Cons:**
- ⚠️ Warning appears in console during development

---

### Option 2: Use Array flatMap
Replace Fragment with array flattening:

```tsx
<tbody className="overflow-visible">
  {paginatedInventoryItems.flatMap((item) => [
    // Main Item Row
    <tr
      key={item.id}
      onMouseEnter={() => setHoveredRow(item.id)}
      onMouseLeave={() => setHoveredRow(null)}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors overflow-visible"
      style={{ overflow: 'visible' }}
    >
      {/* Main row content */}
    </tr>,
    
    // Expanded Variant Table Row (conditional)
    ...(expandedRows.includes(item.id) ? [
      <tr key={`${item.id}-expanded`}>
        {/* Expanded row content */}
      </tr>
    ] : [])
  ])}
</tbody>
```

**Pros:**
- ✅ No Fragment, so no warning
- ✅ Valid React pattern

**Cons:**
- ❌ More complex code
- ❌ Harder to read
- ❌ Requires unique keys for each row (`item.id` and `${item.id}-expanded`)
- ❌ Uses spread operator with conditional rendering (less intuitive)

---

### Option 3: Separate the Rows
Create a helper component that returns an array:

```tsx
function ItemRows({ item, expandedRows, ...handlers }) {
  const rows = [
    <tr key="main" {...handlers}>
      {/* Main row */}
    </tr>
  ];
  
  if (expandedRows.includes(item.id)) {
    rows.push(
      <tr key="expanded">
        {/* Expanded row */}
      </tr>
    );
  }
  
  return <>{rows}</>;
}

// In render:
<tbody>
  {paginatedInventoryItems.map((item) => (
    <ItemRows key={item.id} item={item} expandedRows={expandedRows} {...} />
  ))}
</tbody>
```

**Pros:**
- ✅ Cleaner separation of concerns
- ✅ Easier to test

**Cons:**
- ❌ Adds another component
- ❌ Still uses Fragment (just moves it)
- ❌ More boilerplate

---

## Recommendation

**Option 1: Accept the Warning**

This is the recommended approach because:
1. The warning is a **development tool artifact**, not a code issue
2. Our code follows **React best practices** (Fragment with key is correct)
3. **No production impact** whatsoever
4. Changing the code would **reduce readability** without fixing the root cause
5. The root cause is **Figma Make's inspector**, which we cannot control

## Technical Details

### Why Figma Inspector Adds data-fg-* Attributes
Figma Make's development environment uses these attributes to:
- Track component boundaries for visual inspection
- Enable click-to-edit functionality
- Support design-to-code mapping
- Provide development-time debugging

These attributes are:
- ✅ Automatically removed in production builds
- ✅ Only present during development
- ✅ Not part of your source code

### Why React Warns
React Fragment implementation is strict:

```tsx
// React's Fragment source (simplified)
function Fragment(props) {
  if (process.env.NODE_ENV !== 'production') {
    const invalidProps = Object.keys(props).filter(
      key => key !== 'key' && key !== 'children'
    );
    
    if (invalidProps.length > 0) {
      console.warn(`Invalid prop ${invalidProps[0]} supplied to React.Fragment`);
    }
  }
  
  return props.children;
}
```

When Figma's inspector adds `data-fg-cxkk234`, React sees it as an invalid prop.

## Similar Warnings in Other Components
This same pattern may appear in other components that use Fragment within map functions. The same recommendation applies:

- ✅ **Accept the warning** (development-time only)
- ❌ **Don't refactor** unless there's a functional issue

## Summary

| Aspect | Status |
|--------|--------|
| **Severity** | Warning (not error) |
| **Environment** | Development only |
| **Production Impact** | None |
| **Code Quality** | Follows React best practices |
| **Action Required** | None |

**Verdict:** This is a **known limitation** of Figma Make's development environment and can be safely ignored. The code is correct and will work perfectly in production.

---

## If You Still Want to Fix It

If the warning is too distracting, use Option 2 (flatMap):

1. Replace Fragment with flatMap
2. Ensure unique keys for both rows
3. Test that expand/collapse still works
4. Verify no layout issues

**Code location:** `/pages/inventory/UnitOfMeasure.tsx:3536-3917`

**Search for:**
```tsx
{paginatedInventoryItems.map((item) => (
  <Fragment key={item.id}>
```

**Replace with:**
```tsx
{paginatedInventoryItems.flatMap((item) => [
  <tr key={item.id}>
    {/* main row */}
  </tr>,
  ...(expandedRows.includes(item.id) ? [
    <tr key={`${item.id}-expanded`}>
      {/* expanded row */}
    </tr>
  ] : [])
])}
```

---

## Additional Notes

This warning does not affect:
- ✅ Application functionality
- ✅ User experience
- ✅ Performance
- ✅ Production builds
- ✅ SEO or accessibility

This warning only affects:
- ⚠️ Development console cleanliness
- ⚠️ Developer experience (minor)

**Final Recommendation: Accept the warning. It's harmless.**
