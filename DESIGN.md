---
version: alpha
name: UCC Digital Dark
description: A high-contrast university web system that pairs formal editorial typography with bold gold accents on a deep blue-black canvas.
colors:
  primary: "#ffb500"
  secondary: "#003c69"
  tertiary: "#0b4d84"
  neutral: "#121212"
  surface: "#ffffff"
  on-surface: "#ffffff"
  on-primary: "#003c69"
  border: "#374151"
  muted: "#d1d5db"
  overlay: "#00000066"
  error: "#c62828"
typography:
  headline-display:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Merriweather
    fontSize: 30px
    fontWeight: 700
    lineHeight: 34.5px
    letterSpacing: 0px
  headline-md:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: 700
    lineHeight: 25px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Fira GO
    fontSize: 18px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: Fira GO
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: Fira GO
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: Fira GO
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: Fira GO
    fontSize: 16px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: Fira GO
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18px
    letterSpacing: 0px
  label-sm:
    fontFamily: Fira GO
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
    letterSpacing: 0px
  nav-md:
    fontFamily: Fira GO
    fontSize: 16px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0px
  nav-sm:
    fontFamily: Fira GO
    fontSize: 14px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 6px
  sm: 16px
  md: 24px
  lg: 60px
  xl: 124px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 10px 15px
    size: 150px
    height: 44px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 10px 15px
    size: 150px
    height: 44px
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.sm}"
    padding: 10px 15px
    height: 44px
  chip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: 6px 12px
  banner:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    padding: 24px
  navbar:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    padding: 16px
---

# UCC Digital Dark

## Overview
UCC presents as a formal, research-forward university brand with a strong institutional voice and a modern digital edge. The visual tone is high contrast, confident, and slightly ceremonial, balancing academic credibility with an energetic gold accent. Layouts feel spacious and image-led, with dark navigation and clear call-to-action treatment guiding users through content-heavy pages.

## Colors
- **Primary (#ffb500):** A bright university gold used for key actions, logo blocks, utility highlights, active markers, and link emphasis. It creates instant recognition and gives the interface its most distinctive accent.
- **Secondary (#003c69):** A deep navy used for the header, panels, and strong structural surfaces. It anchors the system and provides the dark field against which gold and white remain highly legible.
- **Tertiary (#0b4d84):** A richer blue support tone for layered navy-blue surfaces and subtle variation in large visual regions. It helps the interface feel less flat while staying inside the institutional palette.
- **Neutral (#121212):** A near-black base used for dark cards and foundational contrast. It supports the site’s moody, serious tone without becoming pure black.
- **Surface (#ffffff):** The primary light surface for content areas like cookies and overlays that need strong separation from the dark shell.
- **On-surface (#ffffff):** White text used on navy and dark backgrounds for maximum readability.
- **On-primary (#003c69):** The navy text used on gold buttons and badges, preserving contrast while matching the brand’s institutional blue.
- **Border (#374151):** A muted slate border for cards and dividers when the design needs structure without heavy emphasis.
- **Muted (#d1d5db):** A light neutral support color for secondary text, low-priority UI, and subtle separation.
- **Overlay (#00000066):** A translucent black used to dim imagery or support overlays without fully obscuring content.
- **Error (#c62828):** A restrained alert red for validation or critical feedback, kept out of the main brand voice.

## Typography
The system mixes a serif display family with a clean sans-serif workhorse. Merriweather handles headlines and gives the brand an academic, editorial presence, while Fira GO supports navigation, buttons, body copy, and labels with crisp clarity.

Headlines are bold and compact: `headline-display` and `headline-lg` are used for page-level emphasis, while `headline-md` supports section titles. `headline-sm` offers a smaller serif option for subheads, but the interface leans on Fira GO for interface-level hierarchy. Body text is sturdy and legible at 16px, with `body-lg` reflecting the slightly heavier weight seen in the source and `body-md` providing a more conventional paragraph tone.

Labels and navigation styles are intentionally assertive, with `label-lg`, `label-md`, `label-sm`, `nav-md`, and `nav-sm` using bold weights for wayfinding and controls. Letter spacing is visually neutral, with no noticeable uppercase tracking treatment; emphasis comes from weight, contrast, and scale rather than expanded spacing.

## Layout
The layout is broad and full-bleed, using large imagery and horizontal navigation bands rather than narrow centered content columns. Page sections feel separated by strong color blocks and generous vertical rhythm, with the header, hero, cookie panel, and content areas each occupying clearly defined bands.

Spacing follows a simple stepped scale: `xs` at 6px for tight internal gaps, `sm` at 16px for standard component padding, `md` at 24px for section breathing room, `lg` at 60px for larger separations, and `xl` at 124px for major visual breaks. Buttons and cards prefer compact internal padding, but larger containers preserve space so the interface never feels crowded.

## Elevation & Depth
The system is intentionally flat in its component styling, relying more on color contrast and panel separation than on shadows. The main exception is the hero imagery and the cookie dialog region, where depth is created through layered surfaces, overlaid panels, and a strong light/dark contrast.

Borders are subtle and functional rather than decorative. This makes the page feel stable and institutional while allowing the gold accent and imagery to carry most of the visual energy.

## Shapes
The shape language is restrained and architectural. Corners are mostly square to softly rounded, with `rounded.sm` at 4px for buttons and `rounded.md` at 8px for cards, giving the interface a disciplined, official feel.

Full pills are reserved for chips and small status treatments. The overall shape system avoids playful curves, keeping attention on content and navigation structure.

## Components
Buttons are the clearest branded element in the system. Use `button-primary` for the main call to action: gold background, navy text, 44px height, and compact 10px 15px padding. Use `button-secondary` for inverse actions on dark surfaces, with a transparent background, white border, and white text. Use `button-tertiary` for text-only or low-emphasis actions such as inline links; keep it unboxed and minimally padded.

Button states should preserve the strong gold/navy contrast rather than adding heavy shadows. Hover and active states should shift subtly through color tone or underline behavior, not through elevation. Keep button widths generous enough for touch use, matching the 150px minimum feel seen in the source.

Cards are dark, bordered surfaces with minimal ornamentation. Use `card` for content modules that need separation from the background; the 8px radius and 16px padding make them feel contained but not overly soft. Avoid large shadows on cards, as the design depends on crisp edges and tonal blocks.

Inputs should feel like orderly form fields rather than decorative controls. Use a white or light surface, 4px rounded corners, and 44px minimum height for accessibility. Borders should remain quiet and functional, with focus states using the gold accent or a strong blue ring rather than glow effects.

Chips and compact tags should be pill-shaped and high contrast. Use `chip` with a full radius and tight vertical padding for small filters, state pills, or utility indicators.

The navbar should stay dark and authoritative, using `navbar` with white text and gold accent cues for active or interactive items. Utility links may sit in a gold block or use gold text, but the main navigation should remain calm and aligned.

The banner and hero region should feel image-first, with text placed in dark overlay panels for readability. Keep promotional messaging concise and let the visual background do most of the storytelling.

## Do's and Don'ts
- Do use the gold primary color sparingly for the most important actions and cues.
- Do keep typography bold, legible, and academically formal.
- Do preserve the dark navigation and high-contrast content panels.
- Do prefer flat surfaces, borders, and tonal separation over heavy shadows.
- Don't introduce bright secondary accent colors that compete with the university gold.
- Don't soften the system with overly rounded corners or playful iconography.
- Don't crowd hero or content sections; maintain generous breathing room.
- Don't rely on subtle contrast alone for interactive elements; keep controls clearly defined.