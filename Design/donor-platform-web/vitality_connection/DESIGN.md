---
name: Vitality & Connection
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5b403d'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8f6f6c'
  outline-variant: '#e4beba'
  surface-tint: '#ba1a20'
  primary: '#af101a'
  on-primary: '#ffffff'
  primary-container: '#d32f2f'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ffb3ac'
  secondary: '#556158'
  on-secondary: '#ffffff'
  secondary-container: '#d9e6da'
  on-secondary-container: '#5b675e'
  tertiary: '#455b65'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e737d'
  on-tertiary-container: '#e9f7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930010'
  secondary-fixed: '#d9e6da'
  secondary-fixed-dim: '#bdcabe'
  on-secondary-fixed: '#131e17'
  on-secondary-fixed-variant: '#3e4a41'
  tertiary-fixed: '#cfe6f2'
  tertiary-fixed-dim: '#b4cad6'
  on-tertiary-fixed: '#071e27'
  on-tertiary-fixed-variant: '#354a53'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter-mobile: 16px
  gutter-desktop: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1200px
---

## Brand & Style

The design system is anchored in a philosophy of **Human-Centered Vitality**. It aims to transform the clinical nature of blood donation into a hopeful, community-driven narrative. The visual language balances the urgency of healthcare with the warmth of civic duty, evoking an emotional response of trust, belonging, and inspiration.

The style is **Modern Civic Wellness**: a hybrid of clean, professional SaaS layouts and soft, approachable healthcare branding. It utilizes heavy whitespace to convey clarity and "breathing room," while subtle gradients and Ethiopian-inspired geometric patterns (*Tibeb*) provide a sense of cultural identity and craftsmanship. The interface should feel like a premium public utility—efficient but deeply empathetic.

Targeting both first-time donors and seasoned volunteers, the UI avoids "scary" medical tropes, instead using vibrant imagery and soft edges to foster a welcoming environment.

## Colors

The palette is designed to be emotionally positive and grounded. 

- **Primary Red (#D32F2F):** Used as the "Lifeblood" accent. It is vibrant enough to signal importance but deep enough to maintain professional trust. Reserved for calls-to-action and critical health status indicators.
- **Secondary Wellness Green (#E8F5E9):** A soft, calming background and container color. It offsets the intensity of the red, providing a "healing" aesthetic that signals safety and health.
- **Approachable Slate (#455A64):** Used for typography and iconography to maintain high legibility without the harshness of pure black.
- **Pure White (#FFFFFF):** The base for all surfaces to ensure a sterile (but not cold) healthcare feel.

The color mode is strictly **light** to maintain a clean, high-clarity environment essential for accessibility and public trust.

## Typography

This design system uses a dual-font strategy to balance character with functionality. 

**Montserrat** is used for headings and display text. Its geometric, open counters feel modern and optimistic, providing a strong typographic voice for community calls-to-action. **Inter** is used for all body text, labels, and data-heavy components. Its high x-height and neutral tone ensure exceptional readability across all device types, especially for medical instructions and forms.

Hierarchy is strictly enforced through weight: use Bold/Semi-Bold for headers to establish a "trustworthy" presence, and Regular for body content to ensure a friendly, conversational tone.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy centers on a "generous margin" approach, ensuring that content never feels cramped, which reduces user anxiety in a healthcare context.

- **Spacing Rhythm:** Based on an 8px linear scale. Consistent use of `base * 2` (16px) or `base * 3` (24px) for internal component padding.
- **Adaptive Reflow:** On mobile, complex card layouts stack vertically, and margins tighten to 16px to maximize screen real estate while maintaining a safe "touch zone" for navigation.
- **Sectioning:** Large vertical gaps (64px+) are used between major content sections to clearly delineate between information (e.g., "Why Donate") and action (e.g., "Find a Center").

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. Rather than using high-contrast shadows, the design system utilizes low-opacity (8-12%) shadows tinted with the Tertiary Slate color to create a natural, "held" look.

- **Level 0 (Base):** Pure White (#FFFFFF) background.
- **Level 1 (Cards/Inputs):** Soft Green (#E8F5E9) surfaces or White surfaces with a 1px Slate border at 10% opacity.
- **Level 2 (Floating/Interactive):** Subtle shadows with a 16px blur radius and 4px vertical offset. This is used for primary action cards or navigation bars.
- **Backdrop Blurs:** Used sparingly behind modal overlays to maintain context while focusing the user on a specific task, such as a donation appointment confirmation.

## Shapes

The shape language is defined by **Soft, Approachable Geometry**. By avoiding sharp corners, the UI feels more organic and human-centered.

- **Primary Components:** Buttons and Input fields use a 0.5rem (8px) radius.
- **Surface Components:** Cards and major containers use a 1rem (16px) radius to emphasize a "protective" and "welcoming" enclosure for content.
- **Pill Shapes:** Used exclusively for status chips (e.g., "Blood Type A+") and interactive tags to differentiate them from actionable buttons.

## Components

### Buttons
Primary buttons use the Vibrant Red with white text, featuring 16px horizontal padding and a Semi-Bold Montserrat font. Secondary buttons use a Slate-tinted ghost style or the Soft Green background with Slate text.

### Cards
Cards are the primary container for "Donation Centers" and "Impact Stories." They should feature a 1px soft border (#455A64 at 10%) and an 8px corner radius. On hover, cards should lift slightly using a tinted shadow.

### Input Fields
Inputs are clean and tall (48px) with a soft 8px radius. Use the Secondary Green as a background for inactive fields to make the "active" white field stand out.

### Progress Trackers
Essential for "Life Saved" milestones. Use a thick 8px stroke with rounded caps. The track should be the Soft Green, with the progress filled in Vibrant Red.

### Imagery & Patterns
Incorporate subtle *Tibeb* (Ethiopian traditional pattern) watermarks in the footer or as dividers. Use warm, inclusive photography of community members in natural light, avoiding overly staged clinical photos.