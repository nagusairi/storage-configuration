# DataAgent Component Guidelines

## Overview

The `DataAgent` component is a **combined, reusable AI assistant component** that includes both:
1. **Floating Action Button (FAB)** - Purple gradient circular button with notification badge
2. **Side Panel** - Expandable drawer with chat interface, quick actions, and smart suggestions

This component provides a consistent AI assistant experience across all ERP modules.

## Component Location

**File:** `/components/ui/DataAgent.tsx`

## When to Use

- **Module dashboards** requiring AI-powered insights (Warehouse, Inventory, Finance, Procurement)
- **Complex data analysis pages** where users need contextual help
- **Any page** that would benefit from an intelligent assistant for data queries and recommendations

## Quick Start Example

```tsx
import { DataAgent } from '../../components/ui/DataAgent';
import { RefreshCw, Target, BarChart3 } from 'lucide-react';

function InventoryDashboard() {
  return (
    <ModulePageTemplate>
      {/* Your page content */}
      
      <DataAgent
        panelTitle="Inventory AI Assistant"
        context="inventory"
        quickActions={[
          { label: 'Low Stock Items', query: 'Show me low stock items' },
          { label: 'Reorder Suggestions', query: 'Generate reorder recommendations' }
        ]}
        smartSuggestions={[
          {
            icon: RefreshCw,
            title: 'Auto-Reorder',
            subtitle: '15 items need restocking',
            color: 'purple' as const
          }
        ]}
        onQueryResponse={async (query) => {
          const response = await fetchAIResponse(query);
          return response.message;
        }}
      />
    </ModulePageTemplate>
  );
}
```

## Props Interface

### FAB Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fabPosition` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of FAB button |
| `fabBadgeCount` | `number` | `undefined` | Optional count to display in badge (e.g., 5 new insights) |
| `fabShowBadge` | `boolean` | `true` | Show/hide notification badge |
| `fabTitle` | `string` | `'Open Data Agent'` | Tooltip text for FAB |
| `fabZIndex` | `number` | `50` | Z-index value for FAB and panel |

### Panel Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `panelTitle` | `string` | `'Data Agent'` | Panel header title |
| `panelSubtitle` | `string` | `'AI-Powered Analytics & Insights'` | Panel header subtitle |
| `context` | `string` | `'general'` | Context identifier (warehouse, inventory, finance, etc.) |
| `defaultExpanded` | `boolean` | `false` | Default panel width (expanded: 720px, collapsed: 480px) |

### Content Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMessage` | `string` | Default welcome message | First message from the agent |
| `quickActions` | `QuickAction[]` | `[]` | Quick action buttons in header |
| `smartSuggestions` | `SmartSuggestion[]` | `[]` | Smart action suggestions shown after responses |
| `inputPlaceholder` | `string` | `'Ask a question...'` | Placeholder text for input field |

### Controlled Mode (Optional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `undefined` | Control panel visibility externally |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when panel opens/closes |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onQuery` | `(query: string) => void` | Called when user submits a query (optional) |
| `onQueryResponse` | `(query: string) => Promise<string> \| string` | **Required** - Returns AI response for query |

### Tool Buttons

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showTools` | `boolean` | `true` | Show/hide tool buttons in footer |
| `onFilterClick` | `() => void` | `undefined` | Filter button click handler |
| `onSaveClick` | `() => void` | `undefined` | Save button click handler |
| `onShareClick` | `() => void` | `undefined` | Share button click handler |
| `onExportClick` | `() => void` | `undefined` | Export button click handler |

### Custom Content Slots

| Prop | Type | Description |
|------|------|-------------|
| `renderHeader` | `() => ReactNode` | Custom header render function |
| `renderFooter` | `() => ReactNode` | Custom footer render function |

## Interfaces

### QuickAction

```tsx
interface QuickAction {
  label: string;      // Button label (e.g., "Critical Warehouses")
  query: string;      // Query text to send (e.g., "Show me critical warehouses")
}
```

### SmartSuggestion

```tsx
interface SmartSuggestion {
  icon: LucideIcon;                           // Icon component from lucide-react
  title: string;                              // Main title (e.g., "Redistribute Stock")
  subtitle: string;                           // Subtitle (e.g., "Auto-move 2,400 units")
  color: 'purple' | 'blue' | 'green' | 'orange';  // Color scheme
  onClick?: () => void;                       // Optional click handler
}
```

### DataAgentMessage

```tsx
interface DataAgentMessage {
  role: 'user' | 'agent';
  message: string;
}
```

## Usage Modes

### Mode 1: Self-Contained (Recommended)

The component manages its own state internally. No state management needed in parent.

```tsx
<DataAgent
  panelTitle="Warehouse AI"
  context="warehouse"
  onQueryResponse={async (query) => {
    return await fetchResponse(query);
  }}
/>
```

### Mode 2: Controlled

Parent component controls panel visibility.

```tsx
function MyPage() {
  const [agentOpen, setAgentOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setAgentOpen(true)}>
        Ask AI
      </button>
      
      <DataAgent
        isOpen={agentOpen}
        onOpenChange={setAgentOpen}
        onQueryResponse={async (query) => {
          return await fetchResponse(query);
        }}
      />
    </>
  );
}
```

## Complete Example: Warehouse Overview

```tsx
import { DataAgent } from '../../components/ui/DataAgent';
import { RefreshCw, Target, BarChart3 } from 'lucide-react';

export function WarehouseOverview() {
  return (
    <ModulePageTemplate>
      {/* Page content */}
      
      <DataAgent
        fabPosition="bottom-right"
        fabShowBadge={true}
        fabTitle="Open Warehouse Data Agent"
        
        panelTitle="Warehouse Data Agent"
        panelSubtitle="AI-Powered Analytics & Insights"
        context="warehouse"
        
        initialMessage="Hello! I'm your Warehouse Data Agent. I can help you analyze warehouse performance, optimize capacity, and provide predictive insights. What would you like to know?"
        inputPlaceholder="Ask about warehouses, capacity, or inventory..."
        
        quickActions={[
          { label: 'Critical Warehouses', query: 'Show me critical warehouses' },
          { label: 'Optimize Capacity', query: 'Optimize capacity utilization' },
          { label: 'Stock Forecast', query: 'Predict stock levels' },
          { label: 'Redistribution', query: 'Show redistribution plan' }
        ]}
        
        smartSuggestions={[
          {
            icon: RefreshCw,
            title: 'Redistribute Stock',
            subtitle: 'Auto-move 2,400 units to Pune',
            color: 'purple' as const
          },
          {
            icon: Target,
            title: 'Optimize Layouts',
            subtitle: 'Save ₹4.2L/month',
            color: 'blue' as const
          },
          {
            icon: BarChart3,
            title: 'Generate Report',
            subtitle: 'Download capacity analysis',
            color: 'green' as const
          }
        ]}
        
        onQueryResponse={async (query: string) => {
          // Call your backend API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return `Based on your query "${query}", here are some insights:\n\n- **Warehouse Utilization**: 85%\n- **Capacity**: 15,000 sqft\n- **Inventory Value**: ₹12.4 Cr\n- **Pending Shipments**: 28\n\nWould you like more details?`;
        }}
        
        showTools={true}
        onFilterClick={() => console.log('Filter clicked')}
        onSaveClick={() => console.log('Save clicked')}
        onShareClick={() => console.log('Share clicked')}
        onExportClick={() => console.log('Export clicked')}
      />
    </ModulePageTemplate>
  );
}
```

## Visual Specifications

### FAB Button

- **Size**: 56x56px (`w-14 h-14`)
- **Background**: Purple-pink gradient (`from-purple-600 to-pink-600`)
- **Icon**: Magic wand (Wand2) - 24x24px (`w-6 h-6`)
- **Badge**: Red circle (`bg-red-500`) with pulse animation
- **Hover**: Scales to 110%, icon rotates 12°

### Side Panel

- **Width (Normal)**: 480px
- **Width (Expanded)**: 720px
- **Z-Index**: 50 (default)
- **Shadow**: `shadow-2xl`
- **Transition**: 300ms all properties

### Header

- **Background**: Purple-pink gradient (`from-purple-600 to-pink-600`)
- **Padding**: 20px (`p-5`)
- **Title**: Large white text
- **Subtitle**: Small white/80% opacity text
- **Quick Actions**: White/20% background pills with hover effect

### Messages Area

- **Background**: `bg-gray-50`
- **User Messages**: Blue background, right-aligned
- **Agent Messages**: White background with border, left-aligned
- **Avatar Icons**: 32x32px circles with role-specific colors

### Input Area

- **Input Field**: Full-width with purple focus ring
- **Send Button**: Purple-pink gradient, disabled when empty
- **Tool Buttons**: Gray text with gray-100 hover background

## Smart Suggestion Colors

| Color | Background Gradient | Border | Icon Color | Use Case |
|-------|-------------------|--------|-----------|----------|
| **Purple** | `from-purple-50 to-pink-50` | `border-purple-200` | `text-purple-600` | AI/automation actions |
| **Blue** | `from-blue-50 to-indigo-50` | `border-blue-200` | `text-blue-600` | Optimization/analysis |
| **Green** | `from-green-50 to-emerald-50` | `border-green-200` | `text-green-600` | Reports/exports |
| **Orange** | `from-orange-50 to-amber-50` | `border-orange-200` | `text-orange-600` | Warnings/alerts |

## Best Practices

### Content

✅ **Do:**
- Provide clear, contextual initial messages
- Use concise quick action labels (2-3 words)
- Group related quick actions together
- Show 3-5 smart suggestions maximum
- Format agent responses with markdown (bold, lists)

❌ **Don't:**
- Overwhelm with too many quick actions (max 6)
- Use generic messages - tailor to module context
- Show empty smart suggestions section
- Return unformatted text responses

### Query Responses

✅ **Do:**
- Use async/await for API calls
- Show structured data with markdown
- Include actionable insights
- Handle errors gracefully
- Provide follow-up suggestions

❌ **Don't:**
- Return synchronous responses (blocks UI)
- Send plain text walls
- Ignore error handling
- Duplicate information from quick actions

### Integration

✅ **Do:**
- Place at end of ModulePageTemplate children
- Use context-specific titles and messages
- Configure all tool buttons or hide them
- Provide meaningful smart suggestions
- Test with controlled mode if needed

❌ **Don't:**
- Place FAB outside ModulePageTemplate
- Reuse exact same config across modules
- Show tool buttons without handlers
- Hardcode module names in shared configs

## Customization Examples

### Finance Module

```tsx
<DataAgent
  panelTitle="Finance AI Assistant"
  context="finance"
  quickActions={[
    { label: 'Cash Flow Analysis', query: 'Analyze cash flow trends' },
    { label: 'AP Aging', query: 'Show accounts payable aging' },
    { label: 'Reconciliation', query: 'Unreconciled transactions' }
  ]}
  smartSuggestions={[
    {
      icon: CreditCard,
      title: 'Pay Vendors',
      subtitle: '5 invoices due today',
      color: 'orange' as const
    }
  ]}
/>
```

### Procurement Module

```tsx
<DataAgent
  panelTitle="Procurement AI"
  context="procurement"
  quickActions={[
    { label: 'Pending POs', query: 'Show pending purchase orders' },
    { label: 'Supplier Performance', query: 'Analyze supplier metrics' },
    { label: 'Cost Savings', query: 'Identify cost reduction opportunities' }
  ]}
  smartSuggestions={[
    {
      icon: TrendingDown,
      title: 'Negotiate Prices',
      subtitle: 'Save ₹2.1L with 3 suppliers',
      color: 'green' as const
    }
  ]}
/>
```

## Accessibility

- **Keyboard Navigation**: Tab to FAB, Enter/Space to open
- **Screen Reader**: Proper ARIA labels on buttons
- **Focus Management**: Focus trap when panel is open
- **ESC Key**: Closes panel (built-in)

## Performance Considerations

- **Lazy Rendering**: Panel content only renders when open
- **Debounced Input**: Consider debouncing query submission if needed
- **Memoization**: Smart suggestions should be memoized if expensive
- **API Calls**: Always use async for query responses

## Migration from Old Pattern

### Before (Separate FAB + Panel):

```tsx
const [showAgent, setShowAgent] = useState(false);
const [messages, setMessages] = useState([...]);
const [query, setQuery] = useState('');

<DataAgentFAB onClick={() => setShowAgent(true)} />
{showAgent && <DataAgentPanel ... />}
```

### After (Combined Component):

```tsx
<DataAgent
  onQueryResponse={async (query) => {
    return await getResponse(query);
  }}
/>
```

**Benefits:**
- 70% less code in parent component
- No manual state management
- Consistent behavior across modules
- Built-in loading states

## Troubleshooting

### Issue: FAB doesn't appear

**Solution:** Ensure component is placed inside ModulePageTemplate and FAB position doesn't conflict with other fixed elements.

### Issue: Panel doesn't respond to queries

**Solution:** Check that `onQueryResponse` is provided and returns a string or Promise<string>.

### Issue: Smart suggestions don't show

**Solution:** Verify `smartSuggestions` array is not empty and `loading` state is false.

### Issue: Quick actions don't work

**Solution:** Ensure `quickActions` have both `label` and `query` properties defined.

## Related Components

- **ModulePageTemplate** - Parent container for pages
- **StyledButton** - Button component (not used directly, but similar styling)
- **lucide-react Icons** - Icon library for suggestions

## Support

For questions or feature requests related to the DataAgent component, refer to:
- ERP Application Design Guidelines (`/Guidelines.md`)
- Component source code (`/components/ui/DataAgent.tsx`)
- Example usage in Warehouse Overview (`/pages/warehouse/WarehouseOverview.tsx`)
