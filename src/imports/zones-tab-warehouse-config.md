# Pixel‑Perfect Figma Make Prompt

## Zones Tab -- Warehouse Configuration (flowOne WMS)

Design a **production‑ready enterprise SaaS UX interface** for the
**Zones Tab** inside the Warehouse Configuration module of a Warehouse
Management System.

Navigation context:

Storage Hierarchy \| Zones \| Storage Templates \| Code & Rule Engine \|
Activities

The Zones tab allows warehouse administrators to:

-   Create and manage storage zones
-   Assign **Storage Templates (Blueprints)** to zones
-   Configure zone capacity and environmental rules
-   Set storage strategies
-   Define zone restrictions
-   Preview zones visually on a warehouse map
-   Monitor utilization and analytics

The UI must support **large warehouses with thousands of storage bins**
while remaining easy to use for SME operators.

Use **Auto Layout**, reusable components, and responsive design.

------------------------------------------------------------------------

# Design System

Brand: **SVALGO**

Typography\
Font: **Poppins**

Heading Large --- 20px SemiBold\
Section Title --- 16px Medium\
Body --- 14px Regular\
Label --- 12px Medium

Spacing system: **8px grid**

Card radius: **12px**\
Input radius: **8px**

------------------------------------------------------------------------

# Color Tokens

## Primary

-   #1F6FEB
-   #123E7C
-   #DCEBFF

## Secondary

-   #6B4EFF
-   #E6E0FF

## Neutral

-   #111827
-   #374151
-   #6B7280
-   #E5E7EB
-   #F3F4F6

## Status

-   Success #16A34A
-   Warning #F59E0B
-   Danger #DC2626
-   Info #0EA5E9

------------------------------------------------------------------------

# Main Layout

Use a **three‑panel responsive layout**.

Left Panel (Zone List) -- 30%\
Center Panel (Zone Configuration) -- 45%\
Right Panel (Map & Analytics) -- 25%

------------------------------------------------------------------------

# Section 1 -- Header Controls

Title:

Zones

Subtitle:

Manage functional storage zones in the warehouse.

Buttons:

-   Create Zone\
    Import Zones\
    Export Zones

Filters:

Warehouse\
Zone Type\
Temperature Range\
Status\
Search Zone

------------------------------------------------------------------------

# Section 2 -- Zone List Panel

Display zones as **cards or table rows**.

Columns:

Zone Name\
Zone Code\
Type\
Utilization %\
Temperature\
Status

Example mock data:

ZP \| Picking \| 65% \| -- \| Active\
ZB \| Bulk Storage \| 40% \| -- \| Active\
ZC \| Cold Storage \| 50% \| 2‑8°C \| Active\
ZH \| Hazard \| 10% \| -- \| Restricted

Row actions:

Edit\
View Map\
Disable\
Delete

------------------------------------------------------------------------

# Section 3 -- Zone Configuration Panel

When a zone is selected, show editable fields.

Basic Information:

Zone Name\
Zone Code\
Warehouse

Zone Type dropdown:

-   Picking
-   Bulk Storage
-   Cold Storage
-   Hazard Storage
-   Quarantine
-   Receiving
-   Dispatch

Example:

Zone Name: Picking Zone\
Zone Code: ZP\
Warehouse: HYD1

------------------------------------------------------------------------

# Section 4 -- Storage Template Assignment

Each zone must allow **selecting a Storage Template**.

Dropdown:

Select Storage Template

Available Templates:

-   Medium Picking Rack Template
-   Bulk Pallet Template
-   Cold Storage Template
-   Hazard Rack Template

Display template summary card after selection.

Template Summary Example:

Template Name: Medium Picking Rack\
Structure:

Aisles: 4\
Racks per Aisle: 8\
Shelves per Rack: 5\
Bins per Shelf: 6

Auto‑generated locations: **960 bins**

Include button:

View Template Details

------------------------------------------------------------------------

# Section 5 -- Capacity Configuration

Fields:

Max Storage Locations\
Max Weight per Zone\
Max Volume\
Max Pallets

Example values:

Max Locations: 500\
Max Weight: 15000kg\
Max Volume: 120m³

Display utilization bar:

Used: 325 / 500

------------------------------------------------------------------------

# Section 6 -- Environmental Settings

Fields:

Temperature Range\
Humidity Range\
Ventilation Required

Example:

Temperature: 2‑8°C\
Humidity: 40‑60%

Toggles:

Temperature Controlled\
Hazard Storage Allowed\
Fragile Storage Allowed

------------------------------------------------------------------------

# Section 7 -- Storage Strategy

Dropdown:

Closest Available Bin\
FIFO\
FEFO\
Fixed Bin\
Random Storage

Example:

Default Strategy: Closest Available Bin

Toggles:

Enable Auto Slotting\
Enable Overflow Zone\
Enable Auto Reassignment

------------------------------------------------------------------------

# Section 8 -- Item Restrictions

Allowed Item Categories:

Electronics\
Food\
Chemicals\
Pharmaceuticals\
General Merchandise

Limits:

Max Item Weight\
Max Item Volume\
Max Hazard Class

------------------------------------------------------------------------

# Section 9 -- Zone Rule Mapping

Display rules connected to the **Code & Rule Engine**.

Rule example:

IF Item Category = Frozen Food\
THEN Assign Zone = Cold Storage

Table columns:

Rule Name\
Condition\
Action\
Priority\
Status

Actions:

Edit Rule\
View Rule\
Disable Rule

------------------------------------------------------------------------

# Section 10 -- Warehouse Zone Map (Right Panel)

Display simplified warehouse layout with zones.

Color legend:

Green = Available\
Yellow = Medium Utilization\
Red = Full\
Gray = Blocked\
Blue = Cold Zone\
Orange = Hazard Zone

Clicking a zone on the map opens its configuration.

------------------------------------------------------------------------

# Section 11 -- Zone Analytics

Metrics panel:

Total Zones\
Active Zones\
Blocked Zones\
Cold Zones

Charts:

Zone Utilization\
Zone Capacity Distribution

------------------------------------------------------------------------

# Section 12 -- Bulk Zone Operations

Actions menu:

Activate Zones\
Deactivate Zones\
Recalculate Capacity\
Export Zone Layout

------------------------------------------------------------------------

# Section 13 -- Empty State

If no zones exist:

No Zones Created

Zones divide the warehouse into functional storage areas.

Button:

Create First Zone

------------------------------------------------------------------------

# Section 14 -- Components

Create reusable components:

Zone Card\
Zone Table\
Template Selector\
Capacity Progress Bar\
Zone Map Widget\
Rule Table\
Filter Bar

All components must support **Auto Layout and variants**.

------------------------------------------------------------------------

# Section 15 -- Responsive Behavior

Desktop -- Three panel layout\
Tablet -- Two panel layout\
Mobile -- Accordion sections

------------------------------------------------------------------------

# Mock Data

Warehouses:

HYD1\
MUM1\
DEL1

Zones:

ZP -- Picking\
ZB -- Bulk\
ZC -- Cold Storage\
ZH -- Hazard

Example generated bin:

HYD1‑ZP‑A02‑R03‑S02‑B05

------------------------------------------------------------------------

# AI Instruction for Figma Make

Use AI reasoning to:

-   generate realistic zone data
-   calculate utilization automatically
-   display template structure previews
-   simulate zone capacity changes
-   populate warehouse maps
-   add interactive states and micro‑animations

Design style should resemble **modern enterprise SaaS interfaces like
Stripe or Linear**.
