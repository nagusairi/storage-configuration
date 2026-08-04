# 🚀 GSTDetailsInput - Quick Reference

## Component Name
**`GSTDetailsInput`**

## Location
`/components/ui/GSTDetailsInput.tsx`

---

## ⚡ Quick Start

```tsx
import { GSTDetailsInput } from '../../components/ui/GSTDetailsInput';

function MyForm() {
  const [gstApplicable, setGstApplicable] = useState(false);
  const [hsnSacCode, setHsnSacCode] = useState('');
  const [gstRate, setGstRate] = useState('');

  return (
    <GSTDetailsInput
      gstApplicable={gstApplicable}
      hsnSacCode={hsnSacCode}
      gstRate={gstRate}
      onGstApplicableChange={setGstApplicable}
      onHsnSacCodeChange={setHsnSacCode}
      onGstRateChange={setGstRate}
      sacCodesDatabase={[
        { code: '998314', description: 'Software dev', gstRate: '18' }
      ]}
    />
  );
}
```

---

## 📋 Required Props

| Prop | Type | Description |
|------|------|-------------|
| `gstApplicable` | `boolean` | Whether GST is applicable |
| `hsnSacCode` | `string` | Selected HSN/SAC code |
| `gstRate` | `string` | Selected GST rate |
| `onGstApplicableChange` | `(value: boolean) => void` | Toggle change handler |
| `onHsnSacCodeChange` | `(code: string) => void` | Code change handler |
| `onGstRateChange` | `(rate: string) => void` | Rate change handler |
| `sacCodesDatabase` | `SACCode[]` | Array of SAC codes |

---

## 🎯 Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `required` | `boolean` | `true` | Show asterisk & validate |
| `disabled` | `boolean` | `false` | Disable component |
| `showSectionHeader` | `boolean` | `true` | Show "GST Details" header |
| `className` | `string` | `''` | Additional CSS classes |
| `validationError` | `string` | `undefined` | External validation error |
| `onValidationChange` | `(hasError: boolean) => void` | `undefined` | Validation callback |

---

## 🔧 SACCode Interface

```typescript
interface SACCode {
  code: string;        // "998314"
  description: string; // "Software development services"
  gstRate: string;     // "18"
}
```

---

## ✨ Key Features

✅ Toggle switch for GST applicability  
✅ Smart search across code & description  
✅ Auto-populate GST rate when code selected  
✅ Built-in validation  
✅ Success/error messages  
✅ Accessibility support  
✅ Responsive design  

---

## 🎨 Visual States

**Toggle ON:**
- Shows HSN/SAC Code field
- Shows GST Rate dropdown
- Help text: "GST will be applied..."

**Toggle OFF:**
- Hides GST fields
- Help text: "GST will not be applied..."

**Dropdown Open:**
- Shows all codes initially
- Filters as you type
- Result counter at top

**Code Selected:**
- Green confirmation text
- GST rate auto-filled
- Dropdown closes

**Validation Error:**
- Red border on input
- Error message below field

---

## 📝 Common Patterns

### Pattern 1: Basic Form

```tsx
<form onSubmit={handleSubmit}>
  <GSTDetailsInput {...gstProps} />
  <button type="submit">Save</button>
</form>
```

### Pattern 2: Without Header

```tsx
<div>
  <h2>My Custom Header</h2>
  <GSTDetailsInput 
    {...gstProps}
    showSectionHeader={false}
  />
</div>
```

### Pattern 3: With External Validation

```tsx
<GSTDetailsInput
  {...gstProps}
  validationError={errors.gst}
  onValidationChange={setHasGstError}
/>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Dropdown won't open | Check `gstApplicable` is `true` |
| GST rate not auto-filling | Verify `sacCodesDatabase` has `gstRate` |
| Search not working | Ensure codes have `code` & `description` |
| Validation not working | Set `required={true}` (default) |

---

## 📖 Full Documentation

See: `/docs/GSTDetailsInput-Component-Documentation.md`

---

## ✅ Integration Status

- [x] Component created
- [x] Used in test-stepper
- [x] Documentation complete
- [x] Production ready

---

**Last Updated:** December 31, 2024
