# Data Agent Implementation Guide

This guide explains how to implement the AI Data Agent functionality in your ERP pages using the ModulePageTemplate component and the new Data Agent components.

## Overview

The Data Agent system provides AI-powered insights and suggestions for your data. It consists of:

1. **DataAgentButton** - A gradient button to activate the Data Agent
2. **DataAgentPanel** - A sidebar panel showing AI insights
3. **DataAgentBanner** - An active state banner displayed in the content area
4. **ModulePageTemplate** - Updated with Data Agent integration support

## Quick Start

### 1. Basic Implementation

```tsx
import { useState } from 'react';
import { ModulePageTemplate } from '../components/layouts/ModulePageTemplate';
import { DataAgentButton } from '../components/DataAgentButton';
import { DataAgentPanel } from '../components/DataAgentPanel';
import { DataAgentBanner } from '../components/DataAgentBanner';
import { useSidebar } from '../contexts/SidebarContext';

export default function MyPage() {
  const { sidebarExpanded } = useSidebar();
  
  // Data Agent states
  const [showDataAgent, setShowDataAgent] = useState(false);
  const [dataAgentAnalyzing, setDataAgentAnalyzing] = useState(false);
  const [dataAgentActive, setDataAgentActive] = useState(false);

  const handleDataAgentActivate = () => {
    setDataAgentAnalyzing(true);
    setShowDataAgent(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setDataAgentAnalyzing(false);
      setDataAgentActive(true);
    }, 1500);
  };

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Module', 'Page']}
      sidebarExpanded={sidebarExpanded}
      breadcrumbActions={
        <DataAgentButton
          onClick={handleDataAgentActivate}
          analyzing={dataAgentAnalyzing}
          active={dataAgentActive}
          variant="gradient"
          size="small"
        />
      }
    >
      {/* Main content */}
      <div className="flex gap-4">
        {/* Left column - Main content */}
        <div className="flex-1">
          {/* Data Agent Banner */}
          <DataAgentBanner 
            isActive={dataAgentActive}
            message="Smart suggestions enabled. Click on purple sparkle icons for AI summary."
          />
          
          {/* Your page content here */}
          <div className="bg-white p-6 rounded-lg">
            <h2>Your Content</h2>
          </div>
        </div>

        {/* Right column - Data Agent Panel */}
        <DataAgentPanel
          isOpen={showDataAgent}
          onClose={() => setShowDataAgent(false)}
          analyzing={dataAgentAnalyzing}
        />
      </div>
    </ModulePageTemplate>
  );
}
```

### 2. Advanced Implementation with Custom Content

```tsx
import { useState } from 'react';
import { ModulePageTemplate } from '../components/layouts/ModulePageTemplate';
import { DataAgentButton } from '../components/DataAgentButton';
import { DataAgentPanel } from '../components/DataAgentPanel';
import { DataAgentBanner } from '../components/DataAgentBanner';
import { Sparkles, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdvancedPage() {
  const [showDataAgent, setShowDataAgent] = useState(false);
  const [dataAgentAnalyzing, setDataAgentAnalyzing] = useState(false);
  const [dataAgentActive, setDataAgentActive] = useState(false);

  const handleDataAgentActivate = () => {
    setDataAgentAnalyzing(true);
    setShowDataAgent(true);
    
    setTimeout(() => {
      setDataAgentAnalyzing(false);
      setDataAgentActive(true);
    }, 2000);
  };

  // Custom Data Agent content
  const customDataAgentContent = (
    <div className="space-y-4">
      {/* Custom Insight */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Transaction Analysis</h4>
        <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-900">Healthy</span>
            <span className="text-lg text-green-900">92/100</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <div className="mt-2 space-y-1 text-xs text-green-700">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>No anomalies detected</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Pattern recognition active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Prediction */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">AI Predictions</h4>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-900">Expected Growth</div>
                <div className="text-blue-700 mt-0.5">Revenue projected to increase by 12% next quarter</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded text-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-purple-900">Cash Flow Forecast</div>
                <div className="text-purple-700 mt-0.5">Month-end balance: ₹925,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Attention Required</h4>
        <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-amber-900">Pending Approvals</div>
              <div className="text-amber-700 mt-0.5">3 transactions waiting for your approval</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Quick Statistics</h4>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Transactions:</span>
              <span className="text-gray-900">1,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processed This Week:</span>
              <span className="text-gray-900">342</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="text-gray-900">99.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Processing Time:</span>
              <span className="text-gray-900">1.8s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Finance', 'Transactions']}
      breadcrumbActions={
        <DataAgentButton
          onClick={handleDataAgentActivate}
          analyzing={dataAgentAnalyzing}
          active={dataAgentActive}
        />
      }
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <DataAgentBanner 
            isActive={dataAgentActive}
            message="Transaction analyzed. Review AI insights in the panel."
          />
          
          {/* Your content */}
          <div className="bg-white p-6 rounded-lg">
            <h2>Transaction List</h2>
            {/* Table or content here */}
          </div>
        </div>

        <DataAgentPanel
          isOpen={showDataAgent}
          onClose={() => setShowDataAgent(false)}
          analyzing={dataAgentAnalyzing}
        >
          {customDataAgentContent}
        </DataAgentPanel>
      </div>
    </ModulePageTemplate>
  );
}
```

## Component API Reference

### DataAgentButton

A gradient or outline button to activate the Data Agent.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | required | Click handler |
| `analyzing` | `boolean` | `false` | Show analyzing/loading state |
| `active` | `boolean` | `false` | Show active state (darker gradient) |
| `variant` | `'gradient' \| 'outline'` | `'gradient'` | Button style variant |
| `size` | `'default' \| 'small'` | `'default'` | Button size |

**Usage:**
```tsx
<DataAgentButton
  onClick={handleActivate}
  analyzing={isAnalyzing}
  active={isActive}
  variant="gradient"
  size="small"
/>
```

### DataAgentPanel

A sidebar panel displaying AI insights and suggestions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Control panel visibility |
| `onClose` | `() => void` | required | Close handler |
| `analyzing` | `boolean` | `false` | Show analyzing spinner |
| `children` | `ReactNode` | `undefined` | Custom content (falls back to default) |

**Usage:**
```tsx
<DataAgentPanel
  isOpen={showPanel}
  onClose={() => setShowPanel(false)}
  analyzing={isAnalyzing}
>
  {customContent}
</DataAgentPanel>
```

### DataAgentBanner

An active state banner displayed in the content area.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | required | Show/hide banner |
| `message` | `string` | Default message | Custom banner message |

**Usage:**
```tsx
<DataAgentBanner 
  isActive={dataAgentActive}
  message="Smart suggestions enabled."
/>
```

## Layout Pattern

The recommended layout pattern for Data Agent integration:

```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Module']}
  breadcrumbActions={<DataAgentButton ... />}
>
  <div className="flex gap-4">
    {/* Left Column - Main Content (flex-1) */}
    <div className="flex-1">
      <DataAgentBanner isActive={active} />
      {/* Your main content */}
    </div>
    
    {/* Right Column - Data Agent Panel (w-80, sticky) */}
    <DataAgentPanel isOpen={show} onClose={...} />
  </div>
</ModulePageTemplate>
```

**Why this layout?**
- Main content takes up available space (`flex-1`)
- Data Agent panel has fixed width (`w-80` = 320px)
- Panel is sticky and scrolls independently
- Clean separation of concerns

## State Management Pattern

```tsx
// Required state variables
const [showDataAgent, setShowDataAgent] = useState(false);
const [dataAgentAnalyzing, setDataAgentAnalyzing] = useState(false);
const [dataAgentActive, setDataAgentActive] = useState(false);

// Activation handler with simulated delay
const handleDataAgentActivate = () => {
  setDataAgentAnalyzing(true);
  setShowDataAgent(true);
  
  // Simulate AI analysis (replace with actual API call)
  setTimeout(() => {
    setDataAgentAnalyzing(false);
    setDataAgentActive(true);
  }, 1500);
};
```

## Best Practices

1. **Always show the banner when Data Agent is active**
   ```tsx
   <DataAgentBanner isActive={dataAgentActive} />
   ```

2. **Use the gradient button variant for primary actions**
   ```tsx
   <DataAgentButton variant="gradient" />
   ```

3. **Provide context-specific messages**
   ```tsx
   <DataAgentBanner 
     isActive={active}
     message="Account analyzed. Review AI insights below."
   />
   ```

4. **Handle the panel state independently**
   - Opening the panel doesn't automatically activate the agent
   - Activating the agent should open the panel and show the banner

5. **Use custom content for domain-specific insights**
   ```tsx
   <DataAgentPanel>
     {myCustomFinanceInsights}
   </DataAgentPanel>
   ```

## Integration with Existing Pages

To add Data Agent to an existing page:

1. Import the components
2. Add three state variables
3. Add the button to `breadcrumbActions`
4. Wrap content in a flex container
5. Add the banner and panel

**Before:**
```tsx
<ModulePageTemplate breadcrumbs={[...]}>
  <div>Your content</div>
</ModulePageTemplate>
```

**After:**
```tsx
<ModulePageTemplate 
  breadcrumbs={[...]}
  breadcrumbActions={<DataAgentButton ... />}
>
  <div className="flex gap-4">
    <div className="flex-1">
      <DataAgentBanner isActive={active} />
      <div>Your content</div>
    </div>
    <DataAgentPanel ... />
  </div>
</ModulePageTemplate>
```

## Examples by Use Case

### Finance/Banking Pages
- Show cash flow predictions
- Highlight transaction anomalies
- Display account health scores
- Suggest reconciliation actions

### Inventory Pages
- Stock level predictions
- Slow-moving item alerts
- Reorder point suggestions
- Demand forecasting

### Sales/Orders Pages
- Revenue forecasts
- Customer behavior insights
- Deal pipeline health
- Conversion rate trends

### Procurement Pages
- Vendor performance scores
- Price trend analysis
- Lead time predictions
- Budget utilization insights

## Troubleshooting

**Panel doesn't appear:**
- Check `isOpen` state
- Verify `flex gap-4` container is present
- Ensure no CSS conflicts

**Button stays in analyzing state:**
- Check setTimeout logic
- Verify state updates in handler
- Check for console errors

**Banner doesn't show:**
- Verify `isActive` prop is true
- Check component is rendered before main content
- Look for CSS display issues

## Future Enhancements

Potential additions to the Data Agent system:
- Real-time AI streaming responses
- Voice commands integration
- Contextual help based on user actions
- Multi-language support
- Customizable insight templates
- Export insights to PDF/Excel
- Integration with external AI services
