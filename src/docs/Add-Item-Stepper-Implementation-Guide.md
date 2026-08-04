# Add Item Stepper Implementation Guide

## Overview
This document outlines the complete implementation of the revamped Add Item Form with a horizontal stepper, AI assistance, and structured multi-step workflow.

## Architecture

### 5-Step Structure

**Step 1: Basic & GST Details**
- Basic Information (Item Type, Brand, Category, Name, Measuring Unit, Description)
- GST Details (GST Applicability, HSN/SAC Code, GST Rate)
- **AI Features:**
  - Auto-fetch GSTIN details on code entry
  - Inline callout: "GST details auto-filled from GSTN. Please review before continuing."
  - Real-time mismatch warning if state doesn't match GST state

**Step 2: Inventory & Valuation**
- Re-Order Level
- Low Stock Alert Level
- Valuation Method
- Opening Stock (Yes/No with conditional Warehouse + Stock Count fields)
- **AI Features:**
  - AI-suggested valuation method (e.g., "AI recommends FIFO based on your business type")
  - Predictive opening stock values
  - Visual alerts for abnormal cost variance

**Step 3: Additional Information**
- Barcode
- QR Code
- Dimensions (Length, Width, Height, Unit)
- Weight (Value, Unit)
- Product Image Upload (drag-and-drop, gallery, primary selection)
- Tracking Options (Batch Tracking, Serial Number Tracking, Expiry Date Tracking)
- Default Bin Location (Warehouse, Zone, Aisle, Rack, Bin)
- **AI Features:**
  - "Recommended Fields" informational banner
  - Automatic classification of uploaded documents
  - Soft, non-blocking AI prompts for optional data

**Step 4: Vendor Information**
- Vendor Table (existing functionality)
- Add Vendor Modal (existing)
- Bulk Add Vendors (existing)
- Bulk Remove Selected (existing)
- **AI Features:**
  - AI-assisted vendor categorization
  - Risk tagging for vendors
  - Vendor recommendation based on category

**Step 5: Review & Submit**
- AI-Powered Review Summary Panel
  - Documentation Completeness % (with progress bar)
  - Compliance Speed (Low/Medium/High)
  - Risk Flags (count)
  - Predictive Confidence % (with progress bar)
- Editable Section Cards
  - Basic & GST Details
  - Inventory & Valuation
  - Additional Information
  - Vendor Information
- Each section has "Edit" button to jump back to that step

## Components Created

### 1. HorizontalStepper.tsx ✅ CREATED
```tsx
interface Step {
  id: number;
  label: string;
  description?: string;
  completed: boolean;
  active: boolean;
  disabled: boolean;
}
```

**Features:**
- ✓ icon for completed steps
- Progress underline for current step
- Disabled styling for upcoming steps
- Overall progress percentage bar (0-100%)
- Sticky positioning (remains visible on scroll)
- Clickable completed/current steps for navigation

### 2. AICallout.tsx ✅ CREATED
```tsx
interface AICalloutProps {
  type: 'info' | 'success' | 'warning' | 'suggestion';
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  confidence?: number;
}
```

**Features:**
- Inline contextual AI messages
- Type-based styling (purple/green/yellow)
- Optional confidence score with progress bar
- Dismissible with X button
- Optional action button

### 3. AIAssistPanel.tsx ✅ CREATED
```tsx
interface AITip {
  id: string;
  type: 'tip' | 'warning' | 'help';
  title: string;
  description: string;
}
```

**Features:**
- Collapsible right-side panel
- Step-specific AI tips
- Icon-based tip types (Lightbulb, AlertTriangle, HelpCircle)
- "AI assistance active" status indicator
- Gradient purple-pink background

### 4. StepActionBar.tsx ✅ CREATED
```tsx
interface StepActionBarProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  // ... more props
}
```

**Features:**
- Fixed bottom position (adjusts with sidebar)
- Left actions: Cancel, Save Draft
- Right actions: Step indicator, Previous, Next/Submit
- Conditional visibility (Previous hidden on step 1)
- Loading state for Submit button
- Disabled state when !canProceed

### 5. ReviewSummaryPanel.tsx ✅ CREATED
```tsx
interface ReviewMetrics {
  documentationCompleteness: number;
  complianceSpeed: 'Low' | 'Medium' | 'High';
  riskFlags: number;
  predictiveConfidence: number;
}
```

**Features:**
- AI metrics cards (4-grid layout)
- Progress bars for percentages
- Color-coded compliance speed
- Editable section cards
- "Edit" buttons to jump to specific steps

### 6. Step Components (To Be Created)

**Step1BasicAndGST.tsx** ✅ PARTIALLY CREATED
- Combines Basic Information + GST Details
- GSTIN auto-fill logic
- HSN/SAC searchable dropdown
- Auto-populate GST rate

**Step2InventoryValuation.tsx** (TO BE CREATED)
- Re-order level, Low stock alert
- Valuation method dropdown
- Opening stock conditional fields
- AI suggestion for valuation method

**Step3AdditionalInfo.tsx** (TO BE CREATED)
- Barcode, QR Code
- Dimensions, Weight
- Image upload with gallery
- Tracking options checkboxes
- Bin location fields
- AI recommended fields banner

**Step4VendorInfo.tsx** (TO BE CREATED)
- Reuse existing vendor table
- Reuse Add Vendor modal
- Reuse Bulk Add modal
- Reuse bulk actions
- Add AI vendor categorization

## State Management

### New State Variables (Added to ItemMaster.tsx)
```tsx
const [currentStep, setCurrentStep] = useState(1);
const [completedSteps, setCompletedSteps] = useState<number[]>([]);
const [showAIPanel, setShowAIPanel] = useState(true);
const [gstinAutoFilled, setGstinAutoFilled] = useState(false);
const [showGstinCallout, setShowGstinCallout] = useState(false);
```

### Step Navigation Logic
```tsx
const handleNextStep = () => {
  if (currentStep < 5) {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(currentStep + 1);
  }
};

const handlePreviousStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

const handleStepClick = (stepId: number) => {
  // Allow clicking on completed steps or current step
  if (completedSteps.includes(stepId) || stepId === currentStep || stepId === currentStep + 1) {
    setCurrentStep(stepId);
  }
};
```

### Progress Calculation
```tsx
const calculateProgress = () => {
  // Step 1: 20%
  // Step 2: 40%
  // Step 3: 60%
  // Step 4: 80%
  // Step 5: 100%
  return (completedSteps.length / 5) * 100;
};
```

## Integration Steps

### 1. Replace Add-Item View in ItemMaster.tsx

**Current Structure (Lines 1995-4873):**
```tsx
) : currentView === 'add-item' ? (
  <div className="p-6 pb-[49px]">
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <form className="space-y-6">
        {/* ALL FORM FIELDS */}
      </form>
    </div>
  </div>
)
```

**New Structure:**
```tsx
) : currentView === 'add-item' ? (
  <div className="flex flex-col h-full">
    {/* Horizontal Stepper */}
    <HorizontalStepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={handleStepClick}
      progressPercentage={calculateProgress()}
    />

    {/* Step Content Area */}
    <div className="flex-1 overflow-y-auto pb-16">
      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            {currentStep === 1 && <Step1BasicAndGST {...step1Props} />}
            {currentStep === 2 && <Step2InventoryValuation {...step2Props} />}
            {currentStep === 3 && <Step3AdditionalInfo {...step3Props} />}
            {currentStep === 4 && <Step4VendorInfo {...step4Props} />}
            {currentStep === 5 && (
              <ReviewSummaryPanel
                metrics={reviewMetrics}
                sections={reviewSections}
              />
            )}
          </div>
        </div>

        {/* AI Assist Panel */}
        {showAIPanel && (
          <AIAssistPanel
            stepTitle={getStepTitle(currentStep)}
            tips={getStepTips(currentStep)}
            isExpanded={showAIPanel}
            onToggle={() => setShowAIPanel(!showAIPanel)}
          />
        )}
      </div>
    </div>

    {/* Bottom Action Bar */}
    <StepActionBar
      currentStep={currentStep}
      totalSteps={5}
      onPrevious={handlePreviousStep}
      onNext={handleNextStep}
      onCancel={() => {
        setCurrentView('list');
        setCurrentStep(1);
        setCompletedSteps([]);
      }}
      onSaveDraft={handleSaveDraft}
      onSubmit={handleSubmit}
      isFirstStep={currentStep === 1}
      isLastStep={currentStep === 5}
      isSaving={isSaving}
      canProceed={canProceedToNextStep()}
      sidebarExpanded={sidebarExpanded}
    />
  </div>
)
```

### 2. Define Step Configuration
```tsx
const steps = [
  {
    id: 1,
    label: 'Basic & GST',
    description: 'Item details',
    completed: completedSteps.includes(1),
    active: currentStep === 1,
    disabled: false
  },
  {
    id: 2,
    label: 'Inventory',
    description: 'Stock & valuation',
    completed: completedSteps.includes(2),
    active: currentStep === 2,
    disabled: !completedSteps.includes(1) && currentStep !== 2
  },
  {
    id: 3,
    label: 'Additional Info',
    description: 'Details & tracking',
    completed: completedSteps.includes(3),
    active: currentStep === 3,
    disabled: !completedSteps.includes(2) && currentStep !== 3
  },
  {
    id: 4,
    label: 'Vendors',
    description: 'Supplier info',
    completed: completedSteps.includes(4),
    active: currentStep === 4,
    disabled: !completedSteps.includes(3) && currentStep !== 4
  },
  {
    id: 5,
    label: 'Review',
    description: 'Finalize & submit',
    completed: completedSteps.includes(5),
    active: currentStep === 5,
    disabled: !completedSteps.includes(4) && currentStep !== 5
  }
];
```

### 3. AI Tips per Step
```tsx
const getStepTips = (step: number) => {
  const tipsByStep = {
    1: [
      {
        id: 'gstin-tip',
        type: 'tip',
        title: 'GSTIN Auto-fill',
        description: 'Enter your GSTIN code to automatically populate business name and state from GSTN database.'
      },
      {
        id: 'hsn-tip',
        type: 'help',
        title: 'HSN/SAC Code',
        description: 'Start typing to search by code or description. GST rate will be auto-populated based on your selection.'
      }
    ],
    2: [
      {
        id: 'valuation-tip',
        type: 'suggestion',
        title: 'AI Recommends FIFO',
        description: 'Based on your business type (Electronics), FIFO valuation method is recommended for better inventory management.'
      },
      {
        id: 'reorder-tip',
        type: 'tip',
        title: 'Optimal Re-order Level',
        description: 'Set re-order level at 20% of average monthly consumption for optimal stock management.'
      }
    ],
    3: [
      {
        id: 'optional-fields',
        type: 'info',
        title: 'Recommended Fields',
        description: 'While optional, filling dimensions and weight improves shipping calculations and warehouse management.'
      }
    ],
    4: [
      {
        id: 'vendor-risk',
        type: 'warning',
        title: 'Vendor Risk Assessment',
        description: 'AI automatically assesses vendor reliability based on lead time, pricing, and order history.'
      }
    ],
    5: [
      {
        id: 'review-tip',
        type: 'tip',
        title: 'Final Review',
        description: 'Review all sections carefully. You can edit any section by clicking the Edit button.'
      }
    ]
  };

  return tipsByStep[step] || [];
};
```

### 4. Review Sections Data
```tsx
const reviewSections = [
  {
    title: 'Basic & GST Details',
    fields: [
      { label: 'Item Type', value: addItemType },
      { label: 'Item Name', value: 'Laptop Computer' },
      { label: 'Category', value: 'Electronics' },
      { label: 'GST Applicable', value: gstApplicable },
      { label: 'HSN/SAC Code', value: hsnSacCode },
      { label: 'GST Rate', value: `${gstRate}%` }
    ],
    onEdit: () => setCurrentStep(1)
  },
  {
    title: 'Inventory & Valuation',
    fields: [
      { label: 'Re-order Level', value: 100 },
      { label: 'Low Stock Alert', value: 50 },
      { label: 'Valuation Method', value: 'FIFO' },
      { label: 'Opening Stock', value: addOpeningStock === 'yes' }
    ],
    onEdit: () => setCurrentStep(2)
  },
  // ... more sections
];
```

### 5. Validation per Step
```tsx
const canProceedToNextStep = () => {
  switch (currentStep) {
    case 1:
      // Basic & GST validation
      return addItemType !== '' && gstApplicable ? (hsnSacCode !== '' && gstRate !== '') : true;
    case 2:
      // Inventory validation
      return true; // All fields optional
    case 3:
      // Additional info validation
      return true; // All fields optional
    case 4:
      // Vendor validation
      return true; // Optional, but at least one vendor recommended
    case 5:
      // Review - always can proceed
      return true;
    default:
      return false;
  }
};
```

## AI Features Implementation

### Step 1: GSTIN Auto-fill
```tsx
const handleGstinEntry = async (gstin: string) => {
  if (gstin.length === 15) {
    try {
      // Mock API call (replace with real GSTN API)
      const response = await fetch(`/api/gstn/validate/${gstin}`);
      const data = await response.json();
      
      if (data.valid) {
        // Auto-fill fields
        setBusinessName(data.businessName);
        setBusinessState(data.state);
        setGstinAutoFilled(true);
        setShowGstinCallout(true);
        
        // Auto-dismiss callout after 5 seconds
        setTimeout(() => setShowGstinCallout(false), 5000);
      }
    } catch (error) {
      console.error('GSTIN validation failed:', error);
    }
  }
};
```

### Step 2: AI Valuation Suggestion
```tsx
<AICallout
  type="suggestion"
  message="AI recommends FIFO based on your business type (Electronics). This method provides better inventory cost accuracy for fast-moving products."
  actionLabel="Apply FIFO"
  onAction={() => setValuationMethod('fifo')}
  confidence={92}
/>
```

### Step 4: Vendor Risk Tagging
```tsx
const calculateVendorRisk = (vendor: AttachedVendor) => {
  let riskScore = 0;
  
  // High lead time = higher risk
  if (vendor.leadTime > 14) riskScore += 30;
  
  // High MOQ = higher risk
  if (vendor.minimumOrderQuantity > 100) riskScore += 20;
  
  // Price variance check
  const avgPrice = attachedVendors.reduce((sum, v) => sum + v.purchasePrice, 0) / attachedVendors.length;
  const variance = Math.abs(vendor.purchasePrice - avgPrice) / avgPrice;
  if (variance > 0.2) riskScore += 25;
  
  return riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';
};
```

### Step 5: AI Metrics Calculation
```tsx
const reviewMetrics = {
  documentationCompleteness: calculateCompleteness(),
  complianceSpeed: 'High' as const,
  riskFlags: 0,
  predictiveConfidence: 94
};

const calculateCompleteness = () => {
  let totalFields = 0;
  let filledFields = 0;
  
  // Basic fields (required)
  totalFields += 5;
  filledFields += [addItemType, itemName, category, measuringUnit].filter(Boolean).length;
  
  // GST fields (conditional required)
  if (gstApplicable) {
    totalFields += 2;
    filledFields += [hsnSacCode, gstRate].filter(Boolean).length;
  }
  
  // Optional fields (weighted lower)
  totalFields += 10;
  filledFields += [barcode, qrCode, dimensions, weight, uploadedImages.length > 0].filter(Boolean).length;
  
  return Math.round((filledFields / totalFields) * 100);
};
```

## Auto-save Implementation
```tsx
const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

const handleFieldBlur = (fieldName: string, value: any) => {
  // Clear existing timer
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
  
  // Set new timer for auto-save (2 seconds after blur)
  const timer = setTimeout(() => {
    // Save to localStorage or backend
    const draftData = {
      currentStep,
      completedSteps,
      formData: {
        addItemType,
        itemName,
        // ... all form fields
      },
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('item-draft', JSON.stringify(draftData));
    console.log('Draft auto-saved');
  }, 2000);
  
  setAutoSaveTimer(timer);
};

// Load draft on mount
useEffect(() => {
  if (currentView === 'add-item') {
    const draft = localStorage.getItem('item-draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      // Show modal: "Resume from draft?"
      // If yes, restore state
    }
  }
}, [currentView]);
```

## Breadcrumb Updates
```tsx
const breadcrumbs = currentView === 'add-item'
  ? ['Dashboard', 'Inventory', 'All Items', `Add New Inventory Item - Step ${currentStep} of 5`]
  : currentView === 'details' && selectedItem
  ? ['Dashboard', 'Inventory', 'All Items', selectedItem.itemName]
  : ['Dashboard', 'Inventory', 'All Items'];
```

## Implementation Checklist

### Phase 1: Core Components ✅
- [x] HorizontalStepper.tsx
- [x] AICallout.tsx
- [x] AIAssistPanel.tsx
- [x] StepActionBar.tsx
- [x] ReviewSummaryPanel.tsx
- [x] Step1BasicAndGST.tsx (partial)

### Phase 2: Step Components ⏳
- [ ] Complete Step1BasicAndGST.tsx
- [ ] Create Step2InventoryValuation.tsx
- [ ] Create Step3AdditionalInfo.tsx
- [ ] Create Step4VendorInfo.tsx

### Phase 3: Integration ⏳
- [ ] Add stepper state to ItemMaster.tsx
- [ ] Replace add-item view with stepper layout
- [ ] Implement step navigation logic
- [ ] Add validation per step
- [ ] Implement auto-save functionality

### Phase 4: AI Features ⏳
- [ ] GSTIN auto-fill logic
- [ ] AI valuation suggestions
- [ ] Vendor risk assessment
- [ ] Review metrics calculation
- [ ] AI tips per step

### Phase 5: Testing & Polish ⏳
- [ ] Test step navigation
- [ ] Test form validation
- [ ] Test auto-save/draft restore
- [ ] Test AI callouts/panel
- [ ] Test review summary
- [ ] Test submit flow
- [ ] Mobile responsiveness
- [ ] Accessibility review

## Next Steps

To complete this implementation, you need to:

1. **Create remaining step components** (Step2, Step3, Step4)
2. **Extract existing form fields** from current add-item view into respective step components
3. **Update ItemMaster.tsx** to use the new stepper layout
4. **Implement validation logic** for each step
5. **Add AI integration points** (GSTIN API, valuation logic, vendor assessment)
6. **Test the complete flow** from step 1 to submission

## Key Design Principles

✅ **Progressive Disclosure** - Show only relevant fields per step
✅ **Non-blocking AI** - AI assists but doesn't force actions
✅ **Contextual Guidance** - Help appears when needed
✅ **Clear Progress** - Visual feedback on completion status
✅ **Flexible Navigation** - Jump to completed steps anytime
✅ **Auto-save** - No data loss from accidental navigation
✅ **Responsive** - Works on desktop and tablets
✅ **Accessible** - Keyboard navigation and screen reader support

---

**Status:** Core components created, integration pending
**Estimated Remaining Work:** 8-12 hours
**Priority:** High - Modern UX improvement for critical data entry flow
