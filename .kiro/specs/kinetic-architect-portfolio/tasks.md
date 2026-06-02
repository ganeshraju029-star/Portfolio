# Implementation Plan: Kinetic Architect Portfolio

## Overview

Upgrade the existing `code.html` single-file portfolio into an Awwwards-level, futuristic portfolio using the "Kinetic Architect" design system. All output remains a single `code.html` file with CDN dependencies only — no build step. Tasks are ordered so each step builds on the previous, ending with full integration.

---

## Tasks

- [x] 1. Scaffold CDN dependencies, meta tags, and base HTML structure
  - Replace the existing `<head>` CDN block with the full required set: TailwindCSS, GSAP core + ScrollTrigger + ScrollToPlugin, Lenis, Three.js, Google Fonts (Space Grotesk, Inter), Material Symbols
  - Add `<meta name="description">` and Open Graph meta tags (`og:title`, `og:description`, `og:type`)
  - Update `<title>` to `Ganesh Raju | Kinetic Architect Portfolio`
  - Ensure `lang="en"` is present on `<html>`
  - Move all CDN `<script>` tags to just before `</body>` with `defer` attribute; keep font `<link>` tags in `<head>`
  - Add a tiny inline `<script>` in `<head>` (non-deferred) that reads `localStorage.getItem('ka-theme')` and applies `class="dark"` or `class="light"` to `<html>` before first paint to prevent FOUC
  - Wrap all feature-init calls in a single `document.addEventListener('DOMContentLoaded', () => { ... })` block at the bottom of the file
  - _Requirements: 1.1–1.7, 14.1, 14.7, 14.8, 15.6_

- [x] 2. Implement CSS custom properties, Kinetic Architect design tokens, and dark/light mode foundation
  - [x] 2.1 Define CSS custom properties for all surface, text, and accent tokens in `:root` (dark defaults) and `:root.light` overrides
    - Dark tokens: `--bg: #10131a`, `--text: #e1e2eb`, `--surface-container: #1d2026`, etc. matching the full Tailwind color map
    - Light tokens: `--bg: #f4f5f8`, `--text: #1a1c22`, `--surface-container: #e8eaef`, etc.
    - Add `html { transition: background-color 250ms ease, color 250ms ease; }` for smooth theme switching
    - _Requirements: 2.1–2.4, 13.2–13.3_
  - [x] 2.2 Update Tailwind config to reference CSS custom properties and add `darkMode: "class"`
    - Extend color tokens to use `var(--*)` references where needed for runtime switching
    - _Requirements: 2.1, 13.2_
  - [x] 2.3 Add global CSS rules: `cursor: none` on `body` for pointer devices, `will-change` utility classes, `@keyframes` for cursor blink, glow ring rotation, and shake animation
    - Blink keyframe for typing cursor: `opacity 0.7s step-end infinite`
    - Rotation keyframe for hero glow rings: `360deg` over 8s linear infinite
    - Shake keyframe for form validation: 3 rapid `translateX` oscillations
    - _Requirements: 4.1, 6.4, 12.2, 15.2_

- [x] 3. Implement dark/light mode toggle
  - [x] 3.1 Add a toggle button to the Navbar HTML with `aria-label="Toggle dark/light mode"`, a sun SVG icon (shown in dark mode) and a moon SVG icon (shown in light mode)
    - _Requirements: 13.4, 14.4_
  - [x] 3.2 Implement `initDarkModeToggle()` function
    - On click: toggle `class="dark"` / `class="light"` on `<html>`, persist to `localStorage` key `ka-theme`, swap icon visibility
    - On init: read `localStorage`; if absent, check `prefers-color-scheme: light`; apply correct class
    - _Requirements: 13.1, 13.5, 13.6_

- [x] 4. Rebuild the Navbar with glassmorphism, active-link tracking, and mobile hamburger menu
  - [x] 4.1 Rewrite Navbar HTML with semantic `<nav>` element, brand text, desktop nav links, dark mode toggle button, and a hamburger `<button aria-label="Open menu">` for mobile
    - Add `id` attributes to all nav links and their target sections for IntersectionObserver wiring
    - All animated elements start with `style="opacity:0"` for FOUC prevention
    - _Requirements: 7.1–7.2, 14.2, 14.4_
  - [x] 4.2 Implement `initNavbar()` function
    - Scroll listener: toggle `scrolled` class at `scrollY > 50` to change background opacity and add bottom `box-shadow` glow
    - IntersectionObserver on each `<section>` at threshold 0.5: update active nav link with Plasma_Gradient underline class
    - Hamburger open/close: GSAP `clipPath` animation from `circle(0% at top right)` → `circle(150% at top right)` on `#mobile-menu` overlay; reverse on close; toggle `aria-expanded`
    - Lenis smooth-scroll on nav link click: call `lenis.scrollTo(target)` instead of default anchor behavior
    - _Requirements: 7.3–7.6, 14.4_

- [x] 5. Implement Lenis smooth scroll and GSAP ScrollTrigger integration
  - Implement `initLenis()` function: instantiate `new Lenis()`, wire `lenis.on('scroll', ScrollTrigger.update)`, run the raf loop via `gsap.ticker.add((time) => lenis.raf(time * 1000))`
  - Register GSAP plugins: `gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)`
  - _Requirements: 7.5, 8.6, 1.4_

- [x] 6. Implement the Three.js particle system for the Hero Section background
  - [x] 6.1 Add a `<canvas id="hero-canvas">` element inside the Hero Section, positioned `absolute inset-0 z-0 pointer-events-none`
    - _Requirements: 5.1_
  - [x] 6.2 Implement `initThreeParticles()` function
    - Create `Scene`, `PerspectiveCamera` (fov 75), `WebGLRenderer` with `alpha: true`; append canvas to `#hero-canvas` container
    - Build `BufferGeometry` with 100 particles: `Float32Array` positions (random in ±5 range), velocities stored in `userData`, colors sampled from `#a4e6ff` / `#edb1ff` linear interpolation
    - `PointsMaterial` with `vertexColors: true`, `size: 0.05`, `transparent: true`, `opacity: 0.35`
    - Animation loop: update positions by velocities (≤ 0.005 units/frame), wrap particles at bounds, apply parallax `camera.position.y = scrollY * -0.0003`, call `renderer.render()`
    - `ResizeObserver` on canvas container: update `renderer.setSize()` and `camera.aspect`
    - _Requirements: 5.1–5.5, 6.6, 15.3–15.4_

- [x] 7. Rebuild the Hero Section HTML and implement the intro timeline
  - [x] 7.1 Rewrite Hero Section HTML with semantic structure
    - Large headline (≥ 64px desktop) with Plasma_Gradient `background-clip: text` accent span
    - `<span id="typing-text">` and `<span id="typing-cursor" class="blink">` for the typing animator
    - Profile image with `id="hero-image"`, glow ring `<div>`s with rotation keyframe class, `loading="eager"`, descriptive `alt`
    - CTA buttons with `id="hero-ctas"`, badge with `id="hero-badge"`, subheadline with `id="hero-sub"`, headline with `id="hero-headline"`, navbar with `id="navbar"`
    - Scroll indicator element at bottom of hero viewport with bounce animation; hidden via IntersectionObserver once user scrolls past hero
    - All animated elements: `style="opacity:0; transform: translateY(30px)"` to prevent FOUC
    - Asymmetric layout offset (headline in columns 1–7, image in columns 8–12 on desktop)
    - _Requirements: 2.6, 3.4, 6.1, 6.4, 6.5, 14.2–14.3_
  - [x] 7.2 Implement `initIntroTimeline()` function using GSAP timeline
    - Sequence: navbar → badge → headline (with blur-to-clear filter) → subheadline → CTAs → image, each with `opacity: 0→1`, `translateY(30px)→0`, `ease: "power3.out"`, total ≤ 2s
    - _Requirements: 3.1–3.4_

- [x] 8. Implement the Typing Animator
  - Implement `initTypingAnimator()` function with state machine: `TYPING → PAUSING → DELETING → PAUSING → TYPING`
  - Roles array: `["Engineer", "Leader", "Innovator", "Builder"]`; type speed 80ms/char, delete speed 40ms/char, pause after word 1800ms, pause before next 400ms
  - Render into `#typing-text`; blinking cursor in `#typing-cursor`
  - If `prefers-reduced-motion`: display first role statically, hide cursor blink
  - _Requirements: 6.2–6.3, 15.5_

- [x] 9. Implement the Custom Plasma Cursor
  - [x] 9.1 Add `<div id="cursor-dot">` (8px filled circle) and `<div id="cursor-ring">` (32px hollow ring) to the top of `<body>`, styled with Plasma_Gradient fill/border and `position: fixed; pointer-events: none; z-index: 9999`
    - _Requirements: 4.1, 4.3_
  - [x] 9.2 Implement `initCursor()` function
    - Detect pointer device via `window.matchMedia('(pointer: fine)')`; if touch, skip and leave cursor elements hidden
    - `mousemove`: move dot directly to `e.clientX / e.clientY`; move ring via GSAP `quickTo` with `duration: 0.15, ease: "power3"`
    - `mouseenter` on `a, button`: ring scales to 2×, opacity 0.5
    - `mouseleave` on `a, button`: ring returns to 1×, opacity 1
    - Dot `box-shadow: 0 0 12px 4px rgba(164,230,255,0.25)` for trailing glow
    - _Requirements: 4.1–4.6, 14.6_

- [x] 10. Implement scroll-based reveal animations for all sections
  - Implement `initScrollReveal()` function
  - Add `class="reveal-section"` to About, Achievements, Experience, Projects, Skills, Contact sections; add `class="reveal-item"` to their direct child content elements
  - `gsap.utils.toArray(".reveal-section")`: for each, create a ScrollTrigger that animates `.reveal-item` children from `opacity:0, y:40` to `opacity:1, y:0` with `stagger: 0.1, duration: 0.7, ease: "power3.out", start: "top 80%"`
  - Experience timeline vertical line: `scrub: true` ScrollTrigger animating `scaleY` from 0→1 on the line element
  - Experience items: alternate `translateX(-40px)` / `translateX(40px)` based on item index
  - Skills items: staggered cascade on section enter
  - _Requirements: 8.1–8.5_

- [x] 11. Implement Magnetic Buttons
  - Implement `initMagneticButtons()` function
  - Query all `[data-magnetic]` buttons (apply `data-magnetic` attribute to "View Projects", "Send Transmission", "Resume" buttons in HTML)
  - `mousemove`: compute `dx = e.clientX - (rect.left + rect.width/2)`, `dy` similarly; `gsap.to(el, { x: dx*0.3, y: dy*0.3, duration: 0.3, ease: "power2.out" })`; cap displacement at 12px
  - `mouseleave`: `gsap.to(el, { x:0, y:0, duration: 0.7, ease: "elastic.out(1, 0.3)" })`
  - If `prefers-reduced-motion`: skip magnetic behavior
  - _Requirements: 9.1–9.4, 15.5_

- [x] 12. Rebuild the Projects Section with filtering and 3D hover
  - [x] 12.1 Rewrite Projects Section HTML
    - Filter buttons: "All", "Frontend", "Backend", "AI/ML" with `data-filter` attributes and `aria-pressed` for accessibility
    - Project cards: `class="project-card"` with `data-category` attribute, overlay div with "Live Preview" and "GitHub" buttons (`opacity:0` by default), image with `loading="lazy"` and descriptive `alt`, tech tag chips, title, description
    - At least 3 project cards covering the existing projects plus one additional
    - _Requirements: 10.1, 10.5, 14.3, 15.1_
  - [x] 12.2 Implement `initProjectFilter()` function
    - On filter button click: update `aria-pressed`, apply Plasma_Gradient background to active button
    - Non-matching cards: `gsap.to(card, { opacity:0, scale:0.9, duration:0.3, onComplete: () => card.style.display="none" })`
    - Matching cards: `card.style.display="block"`, then `gsap.to(card, { opacity:1, scale:1, duration:0.4 })`
    - _Requirements: 10.2–10.3_
  - [x] 12.3 Implement 3D tilt and hover overlay on project cards
    - `mousemove` on each card: compute normalized offset from card center; `gsap.to(card, { rotateX: dy*10, rotateY: dx*10, duration: 0.3 })`; show overlay buttons via `gsap.to(overlay, { opacity:1 })`; image `box-shadow` glow expansion
    - `mouseleave`: reset tilt to 0° with `ease: "power3.out"`; hide overlay
    - _Requirements: 10.4–10.7_

- [x] 13. Rebuild the Skills Section with animated presentation
  - Rewrite Skills Section HTML: replace static chip lists with animated skill bars (or floating tech cloud) organized into "Programming", "Tools & Ops", "Soft Skills" categories with visually distinct headers
  - Each skill item has a `data-level` percentage attribute and a hover-expansion interaction target
  - `initScrollReveal()` handles the staggered cascade on section enter (covered in task 10)
  - On skill bar enter viewport (via ScrollTrigger): animate fill width from `0%` to `data-level` value using GSAP with staggered timing
  - On skill item hover: expand/highlight with Plasma_Gradient glow and show proficiency label
  - _Requirements: 11.1–11.4_

- [x] 14. Rebuild the Contact Section with form validation and animations
  - [x] 14.1 Rewrite Contact Section HTML
    - Form fields: Name, Email, Message — each with `<label>`, `<input>`/`<textarea>`, and `<p class="field-error" aria-live="polite">` for inline errors
    - All inputs have visible focus indicators (CSS `:focus-visible` ring)
    - Submit button with `data-magnetic` attribute
    - `#success-message` div (hidden by default) with checkmark SVG using `stroke-dashoffset` for draw animation
    - `#form-error-banner` div (hidden by default) for network error display
    - _Requirements: 12.1, 12.5–12.6, 14.5_
  - [x] 14.2 Implement `initContactForm()` function
    - On field focus: transition underline to Plasma_Gradient via CSS class swap
    - On submit: validate Name (trimmed ≥ 2 chars), Email (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), Message (trimmed ≥ 10 chars)
    - On validation failure: show `field-error` text, trigger shake `@keyframes` animation on the field
    - On all-valid submit: `gsap.to(form, { opacity:0, onComplete })` → show `#success-message` with checkmark SVG `stroke-dashoffset` animation
    - On network error: show `#form-error-banner` with descriptive message and retry affordance
    - _Requirements: 12.1–12.5_

- [x] 15. Implement the About, Achievements, and Experience sections with Kinetic Architect styling
  - Rewrite About Section HTML: asymmetric 12-column grid with `_IDENTITY` headline offset to columns 1–4, body text in columns 5–12; two stat cards with left border accent (primary / secondary)
  - Rewrite Achievements Section HTML: three achievement cards with `reveal-item` class, ghost-border styling (≤ 15% opacity `outline-variant`), large decorative number overlay
  - Rewrite Experience Section HTML: vertical timeline line element (`id="timeline-line"`), experience items with alternating layout, glass-panel cards, `reveal-item` class on each item
  - Ensure no explicit 1px solid borders are used for section separation; use tonal background shifts only
  - _Requirements: 2.4–2.6, 8.3–8.4, 14.2_

- [x] 16. Checkpoint — Verify visual integrity and CDN loading
  - Open `code.html` directly in a browser (no server) and confirm: all CDN scripts load, no console errors, dark mode applies on load, all sections render with correct typography and color tokens
  - Verify the Tailwind config, CSS custom properties, and font families are applied correctly across all sections
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement `prefers-reduced-motion` and graceful degradation
  - At the top of the `DOMContentLoaded` block, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and store as `reducedMotion` flag
  - Pass `reducedMotion` into each `init*` function; where true: skip GSAP timelines (set elements to final state immediately), disable particle animation loop, disable magnetic buttons, show first typing role statically
  - Wrap each `init*` call in `try { } catch(e) { console.warn(...) }` so CDN failures degrade gracefully without JS errors
  - _Requirements: 1.7, 15.5_

- [x] 18. Apply performance optimizations
  - Add `loading="lazy"` to all `<img>` elements below the fold (all except the hero profile image)
  - Apply `will-change: transform, opacity` immediately before GSAP animations start and remove via `onComplete` callbacks
  - Confirm particle count is capped at 150 and uses a single `renderer.render()` call per frame
  - Confirm all CDN `<script>` tags use `defer` and none are in `<head>` without `defer`
  - _Requirements: 15.1–15.4, 15.6_

- [x] 19. Accessibility audit and fixes
  - Verify `lang="en"` on `<html>`, all `<img>` have descriptive `alt` text, all icon-only buttons have `aria-label`
  - Verify semantic HTML5 structure: `<nav>`, `<main>`, `<section>`, `<article>` (for project cards), `<footer>`, `<h1>`–`<h3>` hierarchy
  - Verify keyboard Tab navigation shows visible focus rings on all interactive elements (links, buttons, inputs) — add `:focus-visible` CSS rules if missing
  - Verify `aria-live="polite"` on form error elements, `aria-pressed` on filter buttons, `aria-expanded` on hamburger button
  - Verify Custom_Cursor does not interfere with keyboard navigation (cursor elements have `pointer-events: none`)
  - Verify WCAG AA contrast ratios for body text in both dark and light modes
  - _Requirements: 14.1–14.8_

- [x] 20. Final integration — wire all init functions and end-to-end smoke test
  - [x] 20.1 Ensure the `DOMContentLoaded` block calls all init functions in the correct order: `applyStoredTheme → initLenis → initThreeParticles → initTypingAnimator → initCursor → initIntroTimeline → initScrollReveal → initMagneticButtons → initProjectFilter → initNavbar → initContactForm → initDarkModeToggle`
    - _Requirements: 1.1–1.7_
  - [x] 20.2 Smoke-test the complete single file in a browser
    - Confirm intro animation plays on load, typing animator cycles roles, particles render in hero, cursor follows mouse with lag ring, scroll reveals trigger per section, project filter animates cards, dark/light toggle persists across reload, contact form validates and shows success state, mobile hamburger opens/closes, navbar active link updates on scroll
    - _Requirements: 3.1, 4.2, 5.2, 6.2, 7.4, 8.2, 10.2, 12.4, 13.2, 7.6_

- [x] 21. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan — all tasks are core implementation)
- Each task references specific requirements for traceability
- The single-file constraint means all HTML, CSS, and JS must remain inline or CDN-linked within `code.html`
- No build step, no local server required — the file must open directly in a browser
- Checkpoints at tasks 16 and 21 provide incremental validation milestones
