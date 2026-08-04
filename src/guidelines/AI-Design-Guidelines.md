# 📌 AI DESIGN GUIDELINES – GLOBAL RULES (flowOne)

**Use these rules for EVERY screen. Do NOT override unless explicitly instructed.**

All generated screens must follow these UX, UI, accessibility, layout, and design-system principles.

---

## 1. Core UX Philosophy (Required)

- Prioritize clarity, simplicity, predictability, and intuitive navigation.
- Follow Nielsen's 10 Heuristics, Fitts' Law, Hick's Law, and Gestalt grouping.
- Reduce cognitive load using progressive disclosure, grouping, segmentation, and clear hierarchy.
- Every action or component must have a clear purpose and feedback.

---

## 2. Layout, Spacing & Structure Standards

- Use Auto Layout everywhere. No manual spacing unless required.
- **Strict 8-point spacing system (8/16/24/32 px).**
- **Global margins = 24px.**
- **Component padding = 16px.**
- Grid alignment must remain consistent across all screens.
- Maintain clear hierarchy:
  - H1 → H2 → Subtitle → Body → Caption.

---

## 3. Branding Guidelines (flowOne)

- **Font:** Poppins (all weights available).
- **Corner Radius:**
  - 8–12px for components
  - 12–16px for containers
- **Color Tokens:**
  - **Primary (flowOne Blues):** For CTAs, primary interactions.
  - **Secondary (Purples):** For highlights and AI features.
  - **Neutral Grays:** For backgrounds, borders, text hierarchy.
- **No gradients unless explicitly requested.**
- **Icons must follow a consistent line style, 20–24px.**

---

## 4. Component & Interaction Rules

### Buttons
- Required states: default, hover, pressed, disabled.
- Primary button always uses flowOne primary blue.
- Secondary button uses outlined or neutral variants.

### Tables
Must include:
- Sorting arrows
- Hover states
- Optional filtering
- Zebra rows if heavy data
- Fixed header for long tables

### Cards
- Use shadow at 4–8dp.
- Include title → insight → action hierarchy.

### Forms
- Label, input, helper text, error state mandatory.
- Error text in red with clear messaging.

---

## 5. Accessibility Standards

- **Minimum text size:**
  - Body: 14px
  - Table text: 16px
- **Minimum contrast ratio: 4.5:1.**
- **Touch targets must be 44px or larger.**
- **Clear focus states for all interactive elements.**

---

## 6. Common Screen Structure Framework

All screens must follow this baseline structure unless otherwise instructed:

1. **Header / Top Navigation**
2. **Left Navigation Panel**
   - Dynamic module switching
   - Replace menu items based on module selection
3. **Main Content Area**
4. **Optional Right Context Panel** (details, insights, related items)
5. **AI Insights Panel** (if the module uses AI)
6. **Footer** (optional)

---

## 7. AI Interaction Rules

- Always show actionable AI insights such as:
  - Recommendations
  - Predictions
  - Alerts
  - Risk indicators
- Place AI insights in a visually distinct card using secondary (purple) tokens.
- AI content must always be:
  - Short
  - Actionable
  - High-value

---

## 8. Usability Standards

- Show KPIs above the fold on dashboards.
- Avoid clutter — use whitespace effectively.
- Group related elements visually.
- Use consistent iconography and terminology.
- Provide tooltips for icons, unclear actions, or abbreviations.

---

## 9. Persistence Rule for Figma Make

**These guidelines must be applied to every generated frame, layout, component, or screen unless the prompt explicitly overrides a rule.**

---

## 10. Modern Interaction Design Patterns (2025 SaaS Standards)

Use these patterns wherever appropriate:

- Command palette (quick actions)
- AI insight panel
- Multi-panel layouts
- Progressive disclosure
- Sticky headers
- Inline editing
- Bulk action toolbars
- Smart empty states
- Right-side contextual drawer
- Floating filter bar
- Segmented controls
- Accordions for long forms
- Global search pattern

---

## 11. Information Architecture Standards

All screens must follow consistent IA principles:

- Top-level modules remain constant
- Navigation adapts per module
- Group content using visual hierarchy
- **Overview pages:** KPIs → charts → tables
- **Detail pages:** summary → stats → details → activity → related
- Forms must group fields logically
- Tables follow consistent column hierarchy
- Contextual data should live in the right panel
- Primary tasks always above the fold

---

## 12. Named Design Patterns Library

### 12.1 Dual-Entity Tab Interface Pattern (DETIP)

**Pattern Name:** Dual-Entity Tab Interface Pattern (DETIP)

**Use Case:** Pages that manage two closely related entities where users need to switch contexts frequently (e.g., Accounts & Transactions, Orders & Line Items, Projects & Tasks).

**Implemented In:** `/pages/finance-core/bank-cash-management/AccountsTransactions.tsx`

#### Core Structure

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb Navigation + Page Header + Primary Actions   │
├─────────────────────────────────────────────────────────┤
│ Tab-Specific KPI Cards (5 cards, context-aware)        │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────────┐                              │
│ │ Tab 1   │ Tab 2       │                              │
│ └─────────┴─────────────┴──────────────────────────────┤
│ │ Filters Bar + Search + Tab-Specific Actions          │
│ ├──────────────────────────────────────────────────────┤
│ │ Collapsible Filter Panel (optional)                  │
│ ├──────────────────────────────────────────────────────┤
│ │ Data Table (sortable, selectable, paginated)         │
│ │ • Row hover states                                   │
│ │ • Inline actions dropdown                            │
│ │ • Bulk selection checkboxes                          │
│ │ • Row click → Detail view                            │
│ ├──────────────────────────────────────────────────────┤
│ │ Pagination Controls                                  │
│ └──────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
```

#### Key Components

**1. Tab-Specific KPI Cards**
- 5 horizontally aligned cards (responsive grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`)
- Each card shows:
  - Icon with colored background
  - Label (12px gray text)
  - Primary value (large, bold)
  - Trend indicator with percentage (colored)
- Cards are **clickable** and act as filters
- Visual feedback: border color change + shadow on hover
- **KPI values dynamically change** based on active tab
- Triangle accent graphic in bottom-left corner of each card

**2. Tab Navigation**
- Custom tab design (not native tabs)
- Active tab styling:
  - White background
  - Bottom border that connects to content panel
  - Medium font weight
  - Raised z-index
- Inactive tab styling:
  - Transparent background
  - Regular font weight
  - Hover state: subtle gray background
- Icon + label in each tab
- Smooth transitions between tabs

**3. Filters Bar**
- Left side: Filter button with badge showing active filter count
- Filter button changes to `secondary` variant when filters are active
- Right side: Tab-specific action buttons
  - Example: "Import CSV" only shows on Transactions tab
  - "Add Account" vs "Add Transaction" changes based on tab

**4. Collapsible Filter Panel**
- Slides in/out with animation
- Contains multiple filter types:
  - Date range picker (with presets: Today, Yesterday, Last 7 days, Last 30 days, Custom)
  - Status dropdown
  - Account selector
  - Transaction type selector
- "Apply Filters" and "Clear All" buttons at bottom
- Shows active filter count

**5. Data Table**
- Full-width responsive table
- Sticky header row
- Features:
  - **Sortable columns** - Click column headers to sort (asc/desc/none)
  - **Bulk selection** - Select all checkbox in header
  - **Individual row selection** - Checkbox per row
  - **Row hover states** - Entire row highlights on hover
  - **Inline actions menu** - More options dropdown (3-dot icon) on row hover
  - **Row click navigation** - Click row to open detail view
  - **Status badges** - Colored pills for status (Completed, Pending, Failed)
  - **Type indicators** - Icons for Credit (↗) / Debit (↙)
- Zebra striping (optional)
- Minimum column widths to prevent text wrapping

**6. Pagination**
- Bottom of table
- Shows: "Previous | Page X of Y | Next"
- Jump to first/last page icons
- Rows per page selector (10, 25, 50, 100)
- Disabled state for boundary pages

**7. Detail View Navigation**
- Breadcrumb click returns to list view
- Previous/Next arrows in header to navigate between records
- Disabled state when at first/last record
- Maintains filter context when navigating

**8. Slide-Over Panels**
- Right-side panels that overlay the main content
- Backdrop blur effect
- Close on backdrop click or X button
- Common panel types:
  - **Transaction History** - Shows related transactions for an entity
  - **CSV Import Wizard** - Multi-step import process
  - **AI Agent Panel** - Contextual AI assistance

#### CSV Import Pattern (Sub-Pattern)

**Pattern Name:** Account-Prerequisite Import Wizard

**Structure:** 3-step wizard with account selection upfront

```
Step 1: Upload File
├─ Required: Select Account dropdown (with "Add New" link)
├─ File upload area (drag & drop)
├─ Format requirements box
└─ Download template link

Step 2: Preview Data
├─ Shows first 10 rows
├─ Data validation summary
└─ Continue to mapping button

Step 3: Map Fields
├─ Dropdown selectors for each field mapping
├─ AI suggestion box (auto-mapping hint)
└─ Import button (shows count)
```

**Key Features:**
- Account selection is **required before file selection**
- "Select File" button disabled until both account AND file are chosen
- Progress indicator shows current step with checkmarks for completed steps
- Each step has Cancel/Back and primary action button
- Green checkmarks show completed steps
- State resets on cancel or successful import

**Visual Hierarchy:**
- Progress steps: colored circles (purple for current, green for completed, gray for pending)
- Connecting lines between steps
- Clear visual separation between steps

#### Tab-Specific Behavior Rules

**State Management:**
- Active tab state persists during session
- Each tab maintains separate:
  - KPI values
  - Filter states
  - Pagination state
  - Selected rows
  - Sort configuration

**Dynamic Content:**
- Page title changes based on active tab
- Primary action button label changes ("Add Account" vs "Add Transaction")
- KPI cards show different metrics per tab
- Action buttons appear/disappear based on tab context
- Table columns adapt to entity type

**Navigation Behavior:**
- Detail view breadcrumb shows current entity type
- Back navigation returns to correct tab
- URL state (optional) - can persist active tab in route params

#### Interaction Patterns

**1. KPI Card Click → Filter Application**
- Click KPI card
- Table filters to show only relevant records
- Visual indicator on selected KPI card
- Click again to clear filter

**2. Row Click → Detail View**
- Click anywhere on row (except action buttons)
- Transitions to detail view
- Shows full entity information
- Previous/Next navigation enabled

**3. Bulk Actions**
- Select multiple rows via checkboxes
- Bulk action toolbar appears above table
- Shows selected count
- Actions: Delete, Export, Update Status, etc.

**4. Inline Quick Actions**
- Hover over row
- More options icon (⋮) appears on right
- Dropdown menu with actions: View, Edit, Delete, etc.
- Actions specific to entity and row state

#### Responsive Behavior

**Desktop (>1024px):**
- All 5 KPI cards in single row
- Full table columns visible
- Side panels use 640px max width

**Tablet (768px - 1024px):**
- KPI cards: 3 columns
- Table may hide less important columns
- Horizontal scroll for table if needed

**Mobile (<768px):**
- KPI cards: 2 columns
- Table converts to card list view
- Filters in full-screen modal
- Tabs remain horizontal (may scroll)

#### Accessibility Requirements

- **Keyboard navigation:** Tab through all interactive elements
- **Screen reader:** Proper ARIA labels for tabs, tables, filters
- **Focus indicators:** Visible focus rings on all interactive elements
- **Color contrast:** All text meets WCAG AA standards
- **Touch targets:** Minimum 44px for mobile interactions
- **Alt text:** Icons paired with labels or aria-labels

#### When to Use This Pattern

✅ **Use DETIP when:**
- Managing two closely related entities (parent-child or peer relationship)
- Users frequently switch between entity types
- Each entity type needs different KPIs
- Actions are entity-specific
- Both entities share similar table structure

❌ **Don't use DETIP when:**
- Entities are unrelated (use separate pages)
- Only one entity type needs detailed management
- Tabs would create confusion about context
- Page already has multiple levels of navigation

#### Implementation Checklist

- [ ] Tab navigation with visual active state
- [ ] Tab-specific KPI cards (minimum 3, maximum 6)
- [ ] KPI cards are clickable and act as filters
- [ ] Dynamic primary action button label
- [ ] Filter panel with multiple filter types
- [ ] Filter count badge on filter button
- [ ] Sortable table columns
- [ ] Row selection (individual + bulk)
- [ ] Row hover states
- [ ] Inline actions dropdown
- [ ] Pagination controls
- [ ] Detail view with breadcrumb navigation
- [ ] Previous/Next record navigation
- [ ] Tab-specific contextual actions
- [ ] Slide-over panels for secondary actions
- [ ] Responsive design for all breakpoints
- [ ] Proper ARIA labels and keyboard navigation

#### Code Example Structure

```tsx
const [activeTab, setActiveTab] = useState('entity1');

// Tab-specific KPI values
const kpiValues = activeTab === 'entity1' ? {
  metric1: value1,
  metric2: value2,
  // ...
} : {
  metric1: differentValue1,
  metric2: differentValue2,
  // ...
};

return (
  <ModulePageTemplate
    title={activeTab === 'entity1' ? 'Entity 1' : 'Entity 2'}
    // ...
  >
    {/* Tab-Specific KPI Cards */}
    <KPICardGrid kpiValues={kpiValues} />
    
    {/* Tab Navigation */}
    <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    
    {/* Filters + Actions */}
    <FilterBar>
      <FilterButton />
      {activeTab === 'entity2' && <SpecificAction />}
    </FilterBar>
    
    {/* Data Table */}
    <DataTable
      data={activeTab === 'entity1' ? entity1Data : entity2Data}
      columns={activeTab === 'entity1' ? entity1Columns : entity2Columns}
    />
  </ModulePageTemplate>
);
```

---

## Application Priority

These AI Design Guidelines are **global persistent rules** that apply to all future designs and implementations unless explicitly overridden by:
- Specific project requirements in `/guidelines/Guidelines.md`
- Direct user instructions
- Module-specific design patterns

When conflicts arise between these guidelines and project-specific guidelines, prioritize:
1. **Explicit user instructions** (highest priority)
2. **Project-specific guidelines** (e.g., ERP Guidelines.md for color scheme, form elements)
3. **AI Design Guidelines** (this document - for structure, UX patterns, IA)