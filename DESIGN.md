---
name: DeveleERP Design System
description: Clean, high-trust, structured, and localized ERP styling
colors:
  primary: "#1f9c88"
  primary-hover: "#177d6d"
  neutral-bg: "#f4f6f7"
  neutral-card: "#ffffff"
  foreground: "#1c212c"
  border: "#e2e8f0"
typography:
  display:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: DeveleERP

## 1. Overview

**Creative North Star: "The Emerald Ledger"**

DeveleERP's design system represents a clean, high-trust, structured, and highly localized interface. It is optimized for data-dense business operations in Tanzania, prioritizing clean typography, structured layouts, and bilingual (English/Swahili) balance. The visual density is highly information-focused, rejecting unnecessary decoration to maintain a fast, distraction-free work canvas.

### Key Characteristics:
- **Refined and Restrained**: Lean borders, minimal drop shadows, flat layouts.
- **Bilingual Visual Weight**: Spacing and headers designed to balance English and Swahili terms seamlessly.
- **The Emerald Anchor**: Focused usage of the primary brand green (`#1f9c88`) on actions and primary indicators.

## 2. Colors

The color palette anchors on an professional, organic brand green, using clean off-whites and dark slates to build a structured, high-contrast digital workspace.

### Primary
- **Emerald Green** (`#1f9c88`): The main identity color of the system. Used for success states, active selections, primary submit actions, and critical navigation highlights.
- **Dark Emerald** (`#177d6d`): Used for primary hover states.

### Neutral
- **Slate Ink** (`#1c212c`): The main body text color, providing high-contrast readability against light backgrounds.
- **Light Ash Background** (`#f4f6f7`): The default page background canvas, soft on the eyes for extended work periods.
- **Card White** (`#ffffff`): The surface color for dashboard elements, forms, and data tables.
- **Soft Border** (`#e2e8f0`): The boundary color for separating headers, data cells, and sections.

### Named Rules
**The Emerald Constraint Rule.** The brand color (`#1f9c88`) must not cover more than 10% of any screen surface. It is reserved for primary actions, badges, and focus items to direct attention.

## 3. Typography

**Display Font:** Outfit (fallback: ui-sans-serif, system-ui, sans-serif)
**Body Font:** Outfit (fallback: ui-sans-serif, system-ui, sans-serif)

### Character
Modern, clean sans-serif typography featuring circular curves and high readability, matching data-dense financial applications.

### Hierarchy
- **Display** (Bold (700), clamp(2.25rem, 5vw, 3.5rem), 1.1): Used for large page titles and hero metrics.
- **Headline** (Semibold (600), 1.5rem, 1.25): Used for main page headers and dialog titles.
- **Title** (Semibold (600), 1.125rem, 1.3): Used for table group headings and section titles.
- **Body** (Regular (400), 0.875rem, 1.5): Used for standard dashboard values, descriptions, and input text. Max line length: 70ch.
- **Label** (Medium (500), 0.75rem, normal): Used for secondary helper labels, table headers, and form cues.

## 4. Elevation

The system is flat by default, relying on thin slate borders and light background differences instead of heavy drop shadows. 

### Named Rules
**The Flat-By-Default Rule.** Elements do not float. Shadows are only used under active dropdown lists, open modals, or subtle hover responses. 

## 5. Components

### Buttons
- **Shape:** Medium rounding (12px)
- **Primary:** Background color `#1f9c88`, text color `#ffffff`, internal padding `8px 16px`.
- **Hover / Focus:** Transition to `#177d6d` on hover; clean focus ring matching the primary color on keyboard navigation.

### Cards / Containers
- **Corner Style:** Large rounding (16px).
- **Background:** Solid Card White (`#ffffff`).
- **Shadow Strategy:** Low shadow, outline of soft border (`#e2e8f0`).
- **Internal Padding:** `16px` padding on small widgets; `24px` on main layout sheets.

### Inputs / Fields
- **Style:** Outline stroke (`#e2e8f0`), background `#ffffff`, radius `12px`.
- **Focus:** Highlight with a solid 2px outline of `#1f9c88`.

### Navigation
- **Sidebar**: Neutral background with light slate highlights. Active links are emphasized with a solid background and white text.

## 6. Do's and Don'ts

### Do:
- **Do** use a flat border outline (`#e2e8f0`) to structure tables and grids.
- **Do** apply equal Swahili and English translation strings to every card header, button text, and list cell.
- **Do** use 12px (`rounded-md`) for buttons and form fields, and 16px (`rounded-lg`) for cards.

### Don't:
- **Don't** use border-left/right larger than 1px as a colored accent stripe.
- **Don't** use over-rounded card borders (exceeding 16px).
- **Don't** use saturated beige/cream backgrounds.
- **Don't** add new top-level items to the sidebar (all sub-functions must be embedded inside page components).
