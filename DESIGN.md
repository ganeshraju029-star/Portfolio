```markdown
# Design System Strategy: The Kinetic Architect

## 1. Overview & Creative North Star
**The Creative North Star: "The Kinetic Architect"**
This design system moves away from the static, boxy layouts of traditional portfolios. Instead, it treats the interface as a living piece of software—a high-precision terminal for a Computer Science Engineer. We are not just displaying work; we are showcasing a mindset of logic, depth, and technical mastery.

To break the "template" look, we leverage **Intentional Asymmetry**. Large `display-lg` headlines should often be offset from the main content column, creating a sophisticated editorial flow. We utilize "The Void" (our `surface` color) not as empty space, but as a structural element that allows neon accents and glass layers to feel like they are floating in a deep, digital vacuum.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the deep spectrum of a midnight terminal, punctuated by high-energy plasma accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Structural definition must be achieved through:
1.  **Tonal Shifts:** Moving from `surface` to `surface-container-low`.
2.  **Luminance Edge:** Using a 1px inner-glow gradient rather than a stroke.
3.  **Negative Space:** Using the spacing scale to create invisible boundaries.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical glass sheets stacked in a 3D space.
*   **Base Layer:** `surface` (#10131a) – The infinite foundation.
*   **Section Layer:** `surface-container-low` (#191c22) – Used for large content blocks.
*   **Interaction Layer:** `surface-container-high` (#272a31) – For cards and interactive modules.
*   **Floating Layer:** `surface-container-highest` (#32353c) – For modals and tooltips, always accompanied by a backdrop blur.

### Signature Textures: Neon Plasma
To inject "soul" into the engineering aesthetic, use a linear gradient for primary CTAs and hero highlights:
*   **The Plasma Drive:** `primary` (#a4e6ff) to `secondary` (#edb1ff) at a 135-degree angle.
*   **Subtle Glass:** Use `surface_variant` at 40% opacity with a `20px` backdrop-blur for all floating navigation elements.

---

## 3. Typography: The Engineering Editorial
We use a dual-typeface system to balance technical precision with high-end readability.

*   **Display & Headlines (Space Grotesk):** This is our "Technical Brutalist" voice. Used for large headers (`display-lg` to `headline-sm`). Its geometric construction reflects the logic of code.
    *   *Direction:* Use `tight` letter-spacing (-0.02em) for displays to create a high-impact, cinematic feel.
*   **Body & Titles (Inter):** Our "Functional Interface" voice. Inter provides maximum legibility for project descriptions and technical documentation.
    *   *Direction:* Use `body-md` for standard descriptions, ensuring a line height of 1.6 for breathability against the dark background.

---

## 4. Elevation & Depth
In "The Kinetic Architect," depth is conveyed through light and transparency, not shadows.

*   **The Layering Principle:** Instead of shadows, stack `surface-container-lowest` cards on top of `surface-container-low` backgrounds. The subtle contrast creates a "soft lift."
*   **Ambient Shadows:** If a floating element (like a mobile menu) requires a shadow, use a 4% opacity shadow tinted with `primary` (#a4e6ff). This mimics the glow of a screen rather than a physical object.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` at 15% opacity. It should feel like a faint reflection on the edge of a glass pane, not a drawn line.

---

## 5. Components

### Buttons: The Execution Points
*   **Primary (The Pulse):** A gradient fill from `primary` to `secondary`. Text is `on_primary_fixed` (Deepest Navy). On hover, add a `0 0 20px` glow using the `primary` color.
*   **Secondary (The Trace):** A "Ghost Border" (15% opacity `outline`) with `primary` colored text. No fill.
*   **Tertiary:** Pure text with a `label-md` style and an animated 2px underline that expands from the center on hover.

### Cards: The Data Modules
*   **Styling:** No borders. Use `surface-container-low`.
*   **Header:** Use `title-sm` in `primary` color to denote the category (e.g., "SYSTEM ARCHITECTURE").
*   **Interaction:** On hover, the card should shift to `surface-container-high` and the `primary` accent should increase in saturation.

### Input Fields: The Terminal
*   **Style:** Minimalist underline using `outline-variant`.
*   **Focus State:** The underline transitions into the `primary` to `secondary` gradient. The label floats and shrinks to `label-sm`.

### Chips: The Tech Stack
*   Small, `sm` roundedness.
*   Background: `surface-container-highest` at 50% opacity.
*   Text: `on_surface_variant`. No borders. Use these to list languages (e.g., Rust, Python, TypeScript).

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use extreme typographic scale. A `display-lg` headline next to `body-sm` metadata creates a professional, curated feel.
*   **DO** use smooth, cubic-bezier transitions (e.g., `0.4, 0, 0.2, 1`) for all hover states to mimic high-end software.
*   **DO** leave ample white space. Let the `surface` color provide "breathing room" for the technical data.

### Don’t:
*   **DON'T** use 100% white (#FFFFFF) for text. Always use `on_surface` (#e1e2eb) to reduce eye strain in dark mode.
*   **DON'T** use standard "drop shadows" (black, high opacity). They look muddy on deep blue backgrounds.
*   **DON'T** use dividers. If you feel the need for a line, use an extra 32px of vertical space instead. If a visual break is mandatory, use a subtle background shift to `surface-container-lowest`.

---

## 7. Spacing & Grid
The grid is a standard 12-column system, but elements should frequently "break" the grid.
*   **The Asymmetric Offset:** Try aligning your main text to columns 3-10, while leaving columns 1-2 for vertical "rotated" labels or decorative line-art.
*   **Rounding:** Use `md` (0.375rem) for UI components like buttons and inputs, but use `xl` (0.75rem) for large content cards to soften the "high-tech" edge and make it feel approachable.```