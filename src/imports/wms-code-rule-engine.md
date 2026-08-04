# Pixel-Perfect Figma Make Prompt

## Code & Rule Engine Tab -- Warehouse Storage Blueprint (flowOne WMS)

Design a **production-ready enterprise SaaS tab interface** for the
**Code & Rule Engine** inside a Warehouse Storage Blueprint
configuration screen.

The tab controls: - Storage location code generation - Auto-bin
generation logic - Putaway rule engine - Storage strategy settings -
Rule simulation - Conflict detection

The design must support **large warehouse structures with thousands of
bins** and follow modern enterprise SaaS UX patterns.

------------------------------------------------------------------------

# Design System

## Brand

SVALGO

## Typography

Font: **Poppins**

Heading Large --- 20px SemiBold\
Section Title --- 16px Medium\
Body --- 14px Regular\
Label --- 12px Medium

------------------------------------------------------------------------

# Color Tokens

## Primary

-   Primary/500 #1F6FEB
-   Primary/700 #123E7C
-   Primary/100 #DCEBFF

## Secondary

-   Purple/600 #6B4EFF
-   Purple/200 #E6E0FF

## Neutral

-   Gray/900 #111827
-   Gray/700 #374151
-   Gray/500 #6B7280
-   Gray/200 #E5E7EB
-   Gray/100 #F3F4F6

## Status

-   Success #16A34A
-   Warning #F59E0B
-   Danger #DC2626
-   Info #0EA5E9

------------------------------------------------------------------------

# Layout Grid

Desktop width: 1440px\
12-column grid\
8px spacing system

Card radius: 12px\
Input radius: 8px

------------------------------------------------------------------------

# Tab Layout

This is **tab content inside a blueprint workflow**.

Structure → Capacity → **Code & Rule Engine** → Preview Locations →
Publish

Main layout:

LEFT PANEL (Configuration -- 65%) RIGHT PANEL (Preview -- 35%)

------------------------------------------------------------------------

# Section 1 -- Location Code Builder

Users define the structure of storage location codes.

Drag‑and‑drop segments:

\[Warehouse\] -- \[Zone\] -- \[Aisle\] -- \[Rack\] -- \[Shelf\] --
\[Bin\]

Options: - reorder segments - remove segment - add segment

Formatting:

  Se   parator:
  ---- ----------
  \-   /
  \-   .

Number Padding: - Aisle digits - Rack digits - Shelf digits - Bin digits

Toggle: Include Zone Code

------------------------------------------------------------------------

# Section 2 -- Location Generation Rules

Fields: - Aisles per Zone - Racks per Aisle - Shelves per Rack - Bins
per Shelf

Example: Aisles: 4\
Racks: 8\
Shelves: 5\
Bins: 6

System Output: Total Generated Locations: **960 bins**

Capacity fields: - Max Weight per Bin - Max Volume per Shelf -
Temperature Range - Hazard Allowed

------------------------------------------------------------------------

# Section 3 -- Storage Assignment Rule Engine

Visual rule cards.

Rule Structure:

IF\
Item Category = Frozen Food\
AND Temperature ≤ 8°C

THEN\
Zone → Cold Storage\
Strategy → FEFO

Rule attributes available: - Item Category - Weight - Volume -
Temperature Requirement - Hazard Class - Expiry Days

Actions: - Assign Zone - Assign Strategy

Controls: - enable toggle - drag to reorder priority - duplicate -
delete

Add Rule button.

------------------------------------------------------------------------

# Section 4 -- Storage Strategy Settings

Default Strategy dropdown:

-   Closest Available Bin
-   FIFO
-   FEFO
-   Fixed Bin
-   Random Storage

Toggles: - Allow Bin Sharing - Enable Overflow Zone - Auto Reassignment

------------------------------------------------------------------------

# Section 5 -- Rule Simulation

User enters test item.

Example:

Item: Frozen Chicken\
Category: Food\
Weight: 10kg\
Temperature: 2°C

Run Simulation.

Output:

Assigned Zone: Cold Storage\
Assigned Bin: HYD1-ZC-A02-R03-S02-B05\
Strategy Used: FEFO

------------------------------------------------------------------------

# Section 6 -- Generated Code Preview

Table columns: - Location Code - Zone - Capacity - Status

Example rows:

HYD1-ZP-A01-R01-S01-B01\
HYD1-ZP-A01-R01-S01-B02\
HYD1-ZP-A01-R01-S01-B03

Status chips: Available / Reserved / Blocked

------------------------------------------------------------------------

# Section 7 -- Rule Conflict Detection

Example warning:

Rule Conflict Detected

Item Category: Chemical

Matches: Rule 1 → Hazard Zone\
Rule 3 → Bulk Zone

Suggested Fix: Increase priority of Hazard rule.

Resolve Conflict button.

------------------------------------------------------------------------

# Microinteractions

-   Drag rule reorder animation
-   Instant code preview updates
-   Simulation loading animation
-   Hover highlight for rules

------------------------------------------------------------------------

# Empty State

No rules configured.

Create rules to automatically assign storage bins.

------------------------------------------------------------------------

# Error State

Invalid code format -- Bin segment missing.

Inline validation for fields.

------------------------------------------------------------------------

# Component Library

Create reusable components: - Rule Card - Condition Builder - Code
Segment Chip - Preview Table - Simulation Result Card - Alert Banner -
Strategy Selector

All components must use **Auto Layout** and support variants.

------------------------------------------------------------------------

# Responsive Behavior

Desktop: two‑column layout\
Tablet: stacked sections\
Mobile: accordion sections

------------------------------------------------------------------------

# Mock Data

Warehouse: HYD1

Zones: - ZP Picking - ZC Cold Storage - ZH Hazard

Example code: HYD1-ZP-A01-R02-S03-B04

------------------------------------------------------------------------

# AI Instruction for Figma Make

Use AI reasoning to: - auto‑generate realistic bin codes - calculate bin
counts - populate preview tables - simulate rule conflicts - generate
interaction states

The UI should resemble **modern enterprise SaaS tools like Stripe or
Linear**.