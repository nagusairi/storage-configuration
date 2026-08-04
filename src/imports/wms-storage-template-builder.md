
# Pixel-Perfect Figma Make Prompt
## Storage Template (Blueprint) Builder – Warehouse Management (flowOne WMS)

Design a **modern, production-ready UX interface** for creating and managing **Storage Templates (Blueprints)** in a Warehouse Management System.

A Storage Template defines the **reusable physical storage structure** of a warehouse (zones, aisles, racks, shelves, bins) and allows the system to **automatically generate thousands of storage locations**.

The UI must support **enterprise-scale warehouses with thousands of bins** but remain **simple enough for SME operators**.

Use **Auto Layout**, reusable components, and responsive behavior.

---

# Design System

Brand: **SVALGO**

Typography  
Font: **Poppins**

Heading Large — 20px SemiBold  
Section Title — 16px Medium  
Body — 14px Regular  
Label — 12px Medium  

Spacing  
8px grid system

Card radius  
12px

Input radius  
8px

---

# Color Tokens

## Primary
- #1F6FEB
- #123E7C
- #DCEBFF

## Secondary
- #6B4EFF
- #E6E0FF

## Neutral
- #111827
- #374151
- #6B7280
- #E5E7EB
- #F3F4F6

## Status
- Success #16A34A
- Warning #F59E0B
- Danger #DC2626
- Info #0EA5E9

---

# Screen Context

Warehouse Setup → Storage Templates → Create Template

The template will later be **applied to zones to generate storage locations automatically**.

---

# Main Layout

Three-panel intelligent builder layout:

Left Panel – Template configuration  
Center – Structure builder  
Right – Preview & simulation

---

# Section 1 – Template Basic Information

Fields

Template Name  
Template Code  
Warehouse Type

Dropdown options

- Small Warehouse
- Medium Warehouse
- High Density Warehouse
- Cold Storage
- Hazard Storage

Description field example

Template for medium picking racks.

Toggle
Reusable Template

---

# Section 2 – Storage Structure Builder

Hierarchy levels

Zone  
Aisle  
Rack  
Shelf  
Bin  

Configuration fields

Aisles per Zone  
Racks per Aisle  
Shelves per Rack  
Bins per Shelf  

Example

Aisles: 4  
Racks: 8  
Shelves: 5  
Bins: 6  

System auto-calculation

Total Bins Generated: **960**

---

# Visual Hierarchy Builder

Example tree

Zone
 └ Aisle A01
      └ Rack R01
           └ Shelf S01
                └ Bin B01

Users can add, remove, reorder levels.

---

# Section 3 – Capacity Rules

Fields

Max Weight per Bin  
Max Volume per Shelf  
Max Pallet Height  
Temperature Range  

Example values

Weight: 100kg  
Volume: 1.5m³  
Height: 1.2m  
Temperature: 2–8°C  

Toggles

Hazard Allowed  
Fragile Items Allowed  
Auto Reassignment

---

# Section 4 – Zone Mapping

Applicable Zones

- Bulk Storage
- Picking Zone
- Cold Storage
- Hazard Zone
- Quarantine
- Receiving
- Dispatch

Zone cards show utilization and capacity.

---

# Section 5 – Location Code Builder

Drag-and-drop code segments

Warehouse – Zone – Aisle – Rack – Shelf – Bin

Example pattern

[Warehouse]-[Zone]-[Aisle]-[Rack]-[Shelf]-[Bin]

Formatting options

Separator: -, /, .

Number padding

Aisle digits: 2  
Rack digits: 2  
Shelf digits: 2  
Bin digits: 2

---

# Code Preview

Example generated codes

HYD1-ZP-A01-R01-S01-B01  
HYD1-ZP-A01-R01-S01-B02  
HYD1-ZP-A01-R01-S01-B03

---

# Section 6 – Storage Rule Engine

Rule structure

IF  
Item Category = Frozen Food  
AND Temperature ≤ 8°C

THEN  
Assign Zone → Cold Storage  
Strategy → FEFO

Rule conditions

Item Category  
Weight  
Volume  
Temperature Requirement  
Hazard Class  
Expiry Days  

Rule actions

Assign Zone  
Assign Strategy

Strategies

Closest Available Bin  
FIFO  
FEFO  
Fixed Bin  
Random Storage

---

# Section 7 – Rule Simulation

Input fields

Item Name  
Item Category  
Weight  
Temperature  
Hazard Class  

Example

Item: Frozen Chicken  
Category: Food  
Weight: 10kg  
Temperature: 2°C  

Simulation result

Assigned Zone: Cold Storage  
Assigned Bin: HYD1-ZC-A02-R03-S02-B05  
Strategy: FEFO

---

# Section 8 – Generated Storage Preview

Table columns

Location Code  
Zone  
Capacity  
Status

Example

HYD1-ZP-A01-R01-S01-B01  
HYD1-ZP-A01-R01-S01-B02  
HYD1-ZP-A01-R01-S01-B03

Status

Available  
Reserved  
Blocked  
Damaged

---

# Section 9 – Warehouse Map Preview

Zones displayed visually.

Legend

Green = Available  
Yellow = Partially Occupied  
Red = Full  
Gray = Blocked  
Black = Damaged

---

# Section 10 – Conflict Detection

Example

Rule Conflict Detected

Item Category: Chemical

Matches

Rule 1 → Hazard Zone  
Rule 3 → Bulk Zone

Suggested fix

Increase priority of Hazard rule.

---

# Section 11 – Version Control

Versions

v1 Draft  
v2 Active  
v3 Archived

Actions

Publish Template  
Save Draft  
Rollback Version

---

# Section 12 – Bulk Generation

Generate Storage Locations

Example result

Total Locations: 960  
Estimated generation time: 3 seconds

---

# Microinteractions

Drag rule reorder animation  
Instant bin count updates  
Hover tooltips  
Simulation loading animation

---

# Responsive Behavior

Desktop – three panel layout  
Tablet – two panel layout  
Mobile – accordion sections

---

# Mock Data

Warehouses

HYD1  
MUM1  
DEL1  

Zones

ZP Picking  
ZB Bulk  
ZC Cold  
ZH Hazard

Example location

HYD1-ZP-A02-R03-S02-B05

---

# AI Instruction for Figma Make

Use AI reasoning to

- generate realistic warehouse structures
- auto calculate bin counts
- populate preview tables
- simulate rule conflicts
- generate interaction states

Design should resemble **modern enterprise SaaS interfaces like Stripe or Linear**.
