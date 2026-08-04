# FilterToggleButton - Quick Reference Card

> **Component Location:** `/components/ui/FilterToggleButton.tsx`  
> **Documentation:** `/docs/FilterToggleButton-Component-Guidelines.md`  
> **Examples:** `/components/ui/__examples__/FilterToggleButton.examples.tsx`

---

## 🚀 Quick Start

```tsx
import { FilterToggleButton } from '../../components/ui/FilterToggleButton';

<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={filterCount}
/>
```

---

## 📋 Common Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `false` | Filter panel is shown |
| `onClick` | `() => void` | - | Toggle handler |
| `activeCount` | `number` | `0` | Filter count (shows badge) |
| `label` | `string` | `"Filters"` | Button label |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |

---

## 🎨 Size Variants

```tsx
<FilterToggleButton size="small" {...props} />   // Compact
<FilterToggleButton size="medium" {...props} />  // Default
<FilterToggleButton size="large" {...props} />   // Prominent
```

---

## 🏷️ Badge Variants

```tsx
<FilterToggleButton badgeVariant="primary" activeCount={3} />   // #5C1F3D
<FilterToggleButton badgeVariant="secondary" activeCount={3} />  // Gray
<FilterToggleButton badgeVariant="success" activeCount={3} />    // Green
<FilterToggleButton badgeVariant="warning" activeCount={10} />   // Yellow
<FilterToggleButton badgeVariant="danger" activeCount={1} />     // Red
```

---

## 🎯 Common Use Cases

### Standard Table Toolbar

```tsx
<div className="flex items-center justify-between">
  <div>{/* Search */}</div>
  <FilterToggleButton
    isActive={showFilters}
    onClick={() => setShowFilters(!showFilters)}
    activeCount={activeFilterCount}
  />
</div>
```

### With Custom Label

```tsx
<FilterToggleButton
  isActive={filtersVisible}
  onClick={handleToggle}
  activeCount={5}
  label="Advanced Filters"
/>
```

### Disabled State

```tsx
<FilterToggleButton
  isActive={false}
  onClick={handleToggle}
  disabled={true}
  tooltip="Filters unavailable"
/>
```

### Custom Icon

```tsx
import { Sliders } from 'lucide-react';

<FilterToggleButton
  isActive={showAdvanced}
  onClick={toggleAdvanced}
  icon={<Sliders className="w-4 h-4" />}
  label="Advanced"
  activeCount={7}
/>
```

---

## ✅ Do's

✅ Update `activeCount` when filters change  
✅ Use consistent labels across the app  
✅ Place in top-right of toolbar  
✅ Show badge only for filter counts  
✅ Provide tooltips for custom use cases

---

## ❌ Don'ts

❌ Don't use for non-filter actions  
❌ Don't show badge for unrelated counts  
❌ Don't override critical styles  
❌ Don't manually hide/show badge  
❌ Don't use for primary CTAs

---

## ♿ Accessibility

- **Keyboard:** Tab, Enter, Space
- **ARIA:** Auto-generated labels
- **Focus:** Purple ring (2px)
- **Tooltips:** Auto or custom

---

## 🔄 Backward Compatibility

**Old Props (Deprecated):**
```tsx
<FilterToggleButton
  showFilters={isVisible}      // Use isActive
  onToggle={handleToggle}      // Use onClick
  activeFilterCount={count}    // Use activeCount
/>
```

**New Props (Recommended):**
```tsx
<FilterToggleButton
  isActive={isVisible}
  onClick={handleToggle}
  activeCount={count}
/>
```

---

## 📖 Full Documentation

- **Complete Guide:** `/docs/FilterToggleButton-Component-Guidelines.md`
- **Visual Examples:** `/components/ui/__examples__/FilterToggleButton.examples.tsx`
- **Summary:** `/docs/FilterToggleButton-Summary.md`

---

**Version:** 2.0 | **Status:** ✅ Production Ready
