---
name: DonorLink Design System
colors:
  surface: '#fff8f7'
  surface-dim: '#f1d3d0'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e6'
  surface-container-high: '#ffe2de'
  surface-container-highest: '#f9dcd8'
  on-surface: '#271816'
  on-surface-variant: '#5b403d'
  inverse-surface: '#3e2c2a'
  inverse-on-surface: '#ffedea'
  outline: '#8f6f6c'
  outline-variant: '#e4beb9'
  surface-tint: '#b91c1c'
  primary: '#93000b'
  on-primary: '#ffffff'
  primary-container: '#b91c1c'
  on-primary-container: '#ffcdc7'
  inverse-primary: '#ffb4ab'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#5a00c5'
  on-tertiary: '#ffffff'
  tertiary-container: '#732ee4'
  on-tertiary-container: '#e2d1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#fff8f7'
  on-background: '#271816'
  surface-variant: '#f9dcd8'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-main:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  body-compact:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  grid_columns: '12'
  gutter: 16px
  sidebar_width: 260px
---

## Brand & Style

This design system is engineered for mission-critical reliability and operational clarity. It serves a dual purpose: providing high-level situational awareness for national administrators while facilitating rapid-fire data entry and logistics management for local blood bank operators.

The visual style is **Corporate Modern with a "Control Tower" focus**. It prioritizes precision over decoration, utilizing a structured, high-density interface that mimics aviation and logistics dashboards. The aesthetic evokes the authority of the WHO and the urgency of the Red Cross, ensuring users feel the weight of the data they are managing. Every pixel serves an operational purpose, emphasizing "at-a-glance" comprehension of blood supply levels, expiration risks, and transport logistics across Ethiopia's regions.

## Colors

The palette is built on a foundation of **Medical White** and **Deep Navy**, creating a high-contrast environment that minimizes eye fatigue during long shifts. 

- **Primary (Deep Blood Red):** Reserved strictly for critical branding and high-importance actions.
- **Functional Accents:** Used to categorize urgency. **Emergency Crimson** signifies immediate action (e.g., severe shortages), **Alert Amber** indicates monitoring (e.g., low stock), and **Critical Purple** is used for rare blood types or specialized AI-driven insights.
- **Hospital Slate & Neutrals:** Used for the structural framework and background layers to ensure the operational data remains the focal point.

## Typography

This design system utilizes a multi-font strategy to differentiate between narrative content and technical data.

- **IBM Plex Sans (Headlines):** Chosen for its corporate, systematic feel. Large, bold headers provide immediate context for regional dashboard views.
- **Inter (Body/UI):** The workhorse font for the interface, providing maximum legibility for form fields, labels, and descriptions.
- **JetBrains Mono (Technical Data):** Employed for blood bag IDs, stock quantities, and timestamps. The monospaced nature ensures that columns of numbers align perfectly, aiding in rapid inventory auditing.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. Global navigation and fast-action sidebars remain fixed to facilitate muscle memory, while the central data canvas scales to accommodate complex visualizations and Ethiopia map overlays.

- **Dashboard Layout:** A 12-column grid with a narrow 16px gutter to maximize data density.
- **Modular Cards:** Elements should snap to 4px increments. Spacing is tight but intentional, using "Safe Zones" around critical CTAs to prevent misclicks.
- **Breakpoints:** 
  - *Desktop (1440px+):* Full multi-panel view with persistent AI Recommendation sidebar.
  - *Tablet (768px-1024px):* Collapsed sidebar, focus on inventory lists.
  - *Mobile (Under 768px):* Single column stack, prioritized for rapid blood check-in/out.

## Elevation & Depth

To maintain the "Operational Control Tower" feel, the system avoids heavy drop shadows, opting instead for **Tonal Layering and Low-Contrast Outlines**.

- **Level 0 (Canvas):** Off-White (#F8FAFC). The base background.
- **Level 1 (Cards/Containers):** Pure White (#FFFFFF) with a 1px solid border (#E2E8F0).
- **Level 2 (Active/Hover):** Substantial 1px border in Primary Red or Hospital Slate, with a very subtle, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Level 3 (Overlays/Modals):** High-contrast dark headers (#0F172A) to draw immediate attention to the task.

Depth is used to signify interactive hierarchy rather than physical realism.

## Shapes

The shape language is **Soft and Precise**. A 4px base radius (`roundedness: 1`) is applied to cards, input fields, and standard buttons to convey a modern, professional feel without appearing overly "consumer-friendly" or soft.

- **Standard Elements:** 4px (Soft) for a technical appearance.
- **Urgency Elements:** Status badges and urgency chips utilize a 2px radius or sharp corners to differentiate from standard UI, signifying "Hard Data."
- **Inventory Bars:** Rectilinear with no rounding to maximize the visual accuracy of volume measurements.

## Components

### Buttons & Interaction
- **Primary Action:** Solid Deep Blood Red with white text. High contrast for critical path completion.
- **Secondary Action:** Ghost style with Hospital Slate borders.
- **Emergency Action:** Pulsing Crimson background with high-visibility icon.

### Operational Indicators
- **Urgency Chips:** Compact, high-contrast badges (e.g., "CRITICAL" in white on #991B1B).
- **Inventory Bars:** Segmented progress bars where segments turn from green to amber to red as stock depletes. Includes a "Target Line" marker.
- **Real-time Status Bullets:** Small, glowing dots indicating live data streams from regional centers.

### AI & Data Viz
- **AI Recommendation Panels:** Integrated with a "Critical Purple" left-accent border. Uses a subtle background tint (#F5F3FF) to distinguish machine-generated insights from raw data.
- **Map Overlays:** Simplified SVG map of Ethiopia. Regions are color-coded based on supply health, with interactive tooltips appearing on Level 3 elevation.
- **Timeline Visualizations:** High-density horizontal tracks showing blood expiration cycles and transit estimated arrival times (ETAs).