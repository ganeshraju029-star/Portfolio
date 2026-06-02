# Design Document: Kinetic Architect Portfolio

## Overview

This document describes the technical design for upgrading the existing `code.html` personal portfolio into a high-end, Awwwards-level single-file website. The upgrade implements the "Kinetic Architect" design system with GSAP-driven animations, a Three.js particle background, Lenis smooth scrolling, a custom plasma cursor, interactive project filtering, dark/light mode, and full WCAG AA accessibility — all delivered as a single self-contained `code.html` with no build step.

The core constraint is **zero build toolchain**: every dependency is loaded from CDN, all CSS is either TailwindCSS utility classes or inline `<style>` blocks, and all JavaScript is inline `<script>` blocks. The result must be a single file a developer can open directly in a browser.

### Key Design Decisions

- **Single-file architecture**: All logic, styles, and markup live in `code.html`. CDN scripts are loaded with `defer` or placed before `</body>` to avoid render-blocking.
- **GSAP as the animation backbone**: GSAP handles intro sequences, scroll triggers, magnetic buttons, cursor lerp, and filter transitions. This avoids maintaining multiple animation libraries.
- **Three.js for the hero canvas**: Provides GPU-accelerated particle rendering with minimal overhead compared to a raw Canvas 2D approach at higher particle counts.
- **Lenis for scroll**: Wraps native scroll events to provide inertia easing; integrates with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- **CSS custom properties for theming**: Dark/light mode is implemented by toggling a class on `<html>` and swapping CSS custom property values, enabling sub-300ms transitions across all surfaces.

---

## Architecture

The portfolio is a single HTML document with three logical layers:

```
┌─────────────────────────────────────────────────────────┐
│  Presentation Layer (HTML + TailwindCSS + inline CSS)   │
│  - Semantic sections: nav, main, footer                 │
│  - Glass panels, surface hierarchy, typography          │
│  - CSS custom properties for dark/light theme tokens    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Animation Layer (GSAP + ScrollTrigger + Lenis)         │
│  - Intro timeline (DOMContentLoaded)                    │
│  - ScrollTrigger reveals per section                    │
│  - Magnetic button event listeners                      │
│  - Cursor lerp loop (requestAnimationFrame via GSAP)    │
│  - Project filter transitions                           │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Rendering Layer (Three.js hero canvas)                 │
│  - BufferGeometry particle system                       │
│  - requestAnimationFrame render loop                    │
│  - Resize observer for canvas dimensions                │
└─────────────────────────────────────────────────────────┘
```

### CDN Load Order

```html
<!-- In <head> — non-blocking -->
<link rel="stylesheet" href="Google Fonts" />
<script src="tailwindcss CDN"></script>

<!-- Before </body> — deferred execution -->
<script src="three.js CDN" defer></script>
<script src="gsap CDN" defer></script>
<script src="ScrollTrigger CDN" defer></script>
<script src="ScrollToPlugin CDN" defer></script>
<script src="lenis CDN" defer></script>
<script>
  // All inline JS in a single DOMContentLoaded listener
  document.addEventListener('DOMContentLoaded', () => { ... });
</script>
```

### Initialization Sequence

```
DOMContentLoaded
  ├── applyStoredTheme()          // localStorage → html class
  ├── initLenis()                 // smooth scroll + ScrollTrigger sync
  ├── initThreeParticles()        // hero canvas
  ├── initTypingAnimator()        // role cycling
  ├── initCursor()                // plasma cursor
  ├── initIntroTimeline()         // GSAP page-load animation
  ├── initScrollReveal()          // ScrollTrigger per section
  ├── initMagneticButtons()       // pointer event listeners
  ├── initProjectFilter()         // filter button logic
  ├── initNavbar()                // scroll opacity + active link
  ├── initContactForm()           // validation + submission
  └── initDarkModeToggle()        // toggle button handler
```

### Graceful Degradation

Each `init*` function is wrapped in a `try/catch`. If a CDN library fails to load (e.g., GSAP is undefined), the catch block logs a warning and the section remains visible with its CSS-only fallback state (elements at `opacity: 1`, no transforms). The `prefers-reduced-motion` media query is checked at initialization and disables non-essential animations before any GSAP timelines are created.

---

## Components and Interfaces

### 1. Custom Plasma Cursor

**DOM structure:**
```html
<div id="cursor-dot"></div>   <!-- 8px filled circle -->
<div id="cursor-ring"></div>  <!-- 32px hollow ring -->
```

**Behavior:**
- `cursor: none` on `<body>` for non-touch devices (detected via `window.matchMedia('(pointer: fine)')`).
- GSAP `quickTo` creates two lerp functions (x, y) for the ring with `duration: 0.15` and `ease: "power3"`, giving the ring a lag behind the dot.
- The dot follows the raw `mousemove` event position directly (no lerp).
- On `mouseenter` of `a, button`: ring scales to 2× and opacity drops to 0.5.
- On `mouseleave`: ring returns to 1× scale and full opacity.
- Trailing glow: `box-shadow: 0 0 12px 4px rgba(164,230,255,0.25)` on the dot, animated via CSS transition.

### 2. Three.js Particle System

**Setup:**
```
Scene → PerspectiveCamera (fov 75) → WebGLRenderer (alpha: true)
  └── Points (BufferGeometry + PointsMaterial)
        ├── positions: Float32Array (N × 3)
        ├── velocities: Float32Array (N × 3)  [stored in userData]
        └── colors: Float32Array (N × 3)      [plasma gradient samples]
```

**Particle count:** 100 (default), capped at 150 per Requirement 15.4.

**Color sampling:** Each particle is assigned either `#a4e6ff` or `#edb1ff` (or a linear interpolation between them) at initialization. The ratio is randomized per particle.

**Animation loop:**
```
requestAnimationFrame(animate)
  ├── update positions += velocities
  ├── wrap particles that exit bounds back to opposite edge
  ├── apply parallax offset: camera.position.y = scrollY * -0.0003
  └── renderer.render(scene, camera)
```

**Resize handling:** A `ResizeObserver` on the canvas container calls `renderer.setSize()` and updates `camera.aspect`.

### 3. Typing Animator

**State machine:**
```
TYPING → PAUSED → DELETING → PAUSED → TYPING (loop)
```

**Implementation:** Pure JavaScript `setTimeout` loop. No external library needed.

```js
const roles = ["Engineer", "Leader", "Innovator", "Builder"];
// State: { roleIndex, charIndex, phase: 'typing'|'pausing'|'deleting' }
// Renders into a <span id="typing-text"> inside the hero headline
// A <span id="typing-cursor"> with CSS blink animation sits adjacent
```

**Timing:**
- Type speed: 80ms per character
- Delete speed: 40ms per character
- Pause after full word: 1800ms
- Pause before typing next: 400ms

**Reduced motion:** When `prefers-reduced-motion` is active, the animator displays the first role string statically with no cursor blink.

### 4. GSAP Intro Timeline

```js
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.to("#navbar",        { opacity: 1, y: 0, duration: 0.6 })
  .to("#hero-badge",    { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
  .to("#hero-headline", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, "-=0.3")
  .to("#hero-sub",      { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
  .to("#hero-ctas",     { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
  .to("#hero-image",    { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");
```

All animated elements start with `style="opacity:0; transform: translateY(30px)"` in HTML to prevent FOUC.

### 5. ScrollTrigger Reveals

Each section registers a ScrollTrigger that fires once when the section enters the viewport at 80% threshold:

```js
gsap.utils.toArray(".reveal-section").forEach(section => {
  gsap.from(section.querySelectorAll(".reveal-item"), {
    opacity: 0, y: 40, stagger: 0.1, duration: 0.7,
    ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 80%" }
  });
});
```

**Experience timeline line:** Uses `scrub: true` so the line height tracks scroll position through the section.

**Experience items:** Alternate `translateX(-40px)` / `translateX(40px)` based on item index.

### 6. Magnetic Buttons

```js
function initMagneticButton(el) {
  const rect = el.getBoundingClientRect();
  el.addEventListener("mousemove", (e) => {
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: "power2.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  });
}
```

Maximum displacement is capped at 12px by the 0.3 scale factor applied to the offset (pointer must be within ~40px of center to reach 12px).

### 7. Project Filter

**Data model:** Each project card has `data-category="frontend|backend|ai-ml"` attributes.

**Filter logic:**
```js
function filterProjects(category) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const match = category === "all" || card.dataset.category === category;
    if (match) {
      gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, display: "block" });
    } else {
      gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3,
        onComplete: () => card.style.display = "none" });
    }
  });
}
```

**3D tilt:** On `mousemove` over a card, compute normalized offset from card center and apply `rotateX` / `rotateY` via GSAP (max ±10°). On `mouseleave`, reset to 0° with `ease: "power3.out"`.

### 8. Navbar

**Scroll opacity:** A `scroll` event listener (or Lenis scroll callback) checks `window.scrollY > 50` and toggles a CSS class that changes the background from `rgba(16,19,26,0.6)` to `rgba(16,19,26,0.85)` and adds a bottom glow `box-shadow`.

**Active link:** An `IntersectionObserver` watches each `<section>` with a threshold of 0.5. When a section becomes intersecting, the corresponding nav link gets the active class (plasma gradient underline).

**Hamburger menu:** A `<div id="mobile-menu">` overlay with `position: fixed; inset: 0`. GSAP animates `clipPath` from `circle(0% at top right)` to `circle(150% at top right)` on open, reversed on close.

### 9. Contact Form

**Validation rules:**
| Field   | Rule                                      |
|---------|-------------------------------------------|
| Name    | Non-empty, trimmed length ≥ 2             |
| Email   | Matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`   |
| Message | Non-empty, trimmed length ≥ 10            |

**Error display:** An `<p class="field-error">` element below each input, hidden by default. On validation failure: shown with red accent color + CSS `@keyframes shake` (3 rapid translateX oscillations).

**Success state:** On valid submit, the form container fades out via GSAP, then a `#success-message` div fades in with a checkmark SVG that draws itself via `stroke-dashoffset` animation.

**Focus animation:** On `focus`, the field's underline pseudo-element transitions from `outline-variant` color to the plasma gradient using a CSS custom property swap.

### 10. Dark / Light Mode Toggle

**Mechanism:** Toggle `class="dark"` on `<html>`. TailwindCSS `darkMode: "class"` handles utility variants. CSS custom properties on `:root` and `:root.dark` define the full token set.

**Light mode tokens (additions to existing dark tokens):**
```css
:root {
  --bg: #f4f5f8;
  --text: #1a1c22;
  --surface-container: #e8eaef;
  /* ... */
}
:root.dark {
  --bg: #10131a;
  --text: #e1e2eb;
  --surface-container: #1d2026;
  /* ... */
}
```

**Transition:** `html { transition: background-color 250ms ease, color 250ms ease; }` — all child elements inherit via CSS custom properties.

**Persistence:** `localStorage.setItem('theme', 'light'|'dark')`. On load, read before first paint via a tiny inline `<script>` in `<head>` (not deferred) to avoid flash.

**OS preference:** If no localStorage value, check `window.matchMedia('(prefers-color-scheme: light)').matches`.

---

## Data Models

### Theme State

```js
// Stored in localStorage key: 'ka-theme'
// Values: 'dark' | 'light'
// Runtime: html.classList contains 'dark' or not
```

### Project Card Data

```js
// Encoded as HTML data attributes on each .project-card element
{
  "data-category": "frontend" | "backend" | "ai-ml",
  "data-title": string,
  "data-tags": string  // comma-separated
}
```

### Typing Animator State

```js
{
  roles: string[],          // ["Engineer", "Leader", "Innovator", "Builder"]
  roleIndex: number,        // current role index
  charIndex: number,        // current character position
  phase: "typing" | "pausing" | "deleting",
  timerId: number | null    // setTimeout handle for cleanup
}
```

### Particle System State

```js
// Stored in Three.js Points object userData
{
  velocities: Float32Array,  // N*3 floats, one (vx,vy,vz) per particle
  count: number              // 100 (default)
}
```

### Cursor State

```js
{
  x: number,          // raw mouse X
  y: number,          // raw mouse Y
  quickToX: Function, // GSAP quickTo for ring X
  quickToY: Function  // GSAP quickTo for ring Y
}
```

### Form Validation State

```js
// Per-field validation result
{
  name:    { valid: boolean, error: string | null },
  email:   { valid: boolean, error: string | null },
  message: { valid: boolean, error: string | null }
}
```

### Navbar State

```js
{
  scrolled: boolean,       // scrollY > 50
  activeSection: string,   // id of currently intersecting section
  mobileOpen: boolean      // hamburger menu open state
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

