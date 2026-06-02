# Requirements Document

## Introduction

This document defines the requirements for upgrading the existing "Ganesh Raju" personal portfolio (`code.html`) into a high-end, futuristic, Awwwards-level single-file website. The upgrade introduces the "Kinetic Architect" design system with advanced GSAP-driven animations, WebGL/Three.js backgrounds, smooth inertia scrolling via Lenis, interactive project filtering, a custom plasma cursor, dark/light mode toggle, and full accessibility compliance — all delivered as a single self-contained `code.html` file with no build step.

---

## Glossary

- **Portfolio**: The single `code.html` file that constitutes the personal portfolio website.
- **Kinetic_Architect**: The design system defined in `DESIGN.md` — intentional asymmetry, no visible borders, layered glass UI, neon plasma accents.
- **Plasma_Gradient**: The linear gradient from `#a4e6ff` (cyan) to `#edb1ff` (purple) at 135°, used as the primary accent.
- **The_Void**: The base background color `#10131a`.
- **GSAP**: GreenSock Animation Platform, loaded via CDN, used for all JavaScript-driven animations.
- **Lenis**: Smooth-scroll inertia library, loaded via CDN.
- **Three_JS**: WebGL 3D library, loaded via CDN, used for the hero background canvas.
- **Navbar**: The fixed top navigation bar.
- **Hero_Section**: The full-viewport opening section containing the profile image, headline, tagline, and animated background.
- **Projects_Section**: The section displaying project cards with filtering and hover interactions.
- **Skills_Section**: The section displaying the technology stack with animated presentation.
- **Experience_Section**: The section displaying work/leadership timeline.
- **Contact_Section**: The section containing the contact form and social links.
- **Custom_Cursor**: A DOM element that replaces the default OS cursor with a plasma glow effect.
- **Magnetic_Button**: A button that attracts toward the pointer on hover using GSAP.
- **Particle_System**: A canvas-based or Three.js-based field of low-opacity floating particles rendered in the Hero_Section background.
- **Typing_Animator**: The component that cycles through role strings (e.g., "Engineer", "Leader", "Innovator") with a typewriter effect.
- **Dark_Mode / Light_Mode**: The two visual themes toggled by the user; Dark_Mode is the default.

---

## Requirements

---

### Requirement 1: Single-File Delivery & CDN Dependencies

**User Story:** As a developer deploying the portfolio, I want the entire site to be a single `code.html` file with all dependencies loaded from CDN, so that no build toolchain or local server is required.

#### Acceptance Criteria

1. THE Portfolio SHALL be delivered as a single `code.html` file containing all HTML, CSS, and JavaScript inline or via CDN `<script>` / `<link>` tags.
2. THE Portfolio SHALL load TailwindCSS via the official CDN `<script>` tag.
3. THE Portfolio SHALL load GSAP core and the ScrollTrigger, ScrollToPlugin plugins via CDN.
4. THE Portfolio SHALL load Lenis smooth-scroll library via CDN.
5. THE Portfolio SHALL load Three.js via CDN.
6. THE Portfolio SHALL load Google Fonts (Space Grotesk, Inter) via `<link>` tag.
7. IF a CDN resource fails to load, THEN THE Portfolio SHALL degrade gracefully, preserving readable content and layout without JavaScript errors blocking the page.

---

### Requirement 2: Design System Compliance (Kinetic Architect)

**User Story:** As a visitor, I want the portfolio to feel like a high-end, futuristic digital product, so that it communicates technical mastery and design sophistication.

#### Acceptance Criteria

1. THE Portfolio SHALL use `#10131a` (The_Void) as the base background color in Dark_Mode.
2. THE Portfolio SHALL apply the Plasma_Gradient (`#a4e6ff` → `#edb1ff` at 135°) to all primary CTAs, hero headline accents, and decorative highlights.
3. THE Portfolio SHALL use Space Grotesk for all headings and Navbar brand text, and Inter for all body copy.
4. THE Portfolio SHALL NOT use explicit 1px solid borders for section separation; structural definition SHALL be achieved through tonal background shifts, negative space, or a maximum 15%-opacity `outline-variant` ghost border.
5. THE Portfolio SHALL apply `backdrop-filter: blur(20px)` and semi-transparent backgrounds to all glass-panel elements (Navbar, contact card, experience cards).
6. THE Portfolio SHALL use intentional asymmetric layout offsets in at least the Hero_Section and About section to break the standard grid.
7. THE Portfolio SHALL maintain WCAG AA contrast ratios for all body text against its background in both Dark_Mode and Light_Mode.

---

### Requirement 3: Page Load Intro Animation

**User Story:** As a first-time visitor, I want a cinematic page-load animation, so that the portfolio makes an immediate high-impact first impression.

#### Acceptance Criteria

1. WHEN the page finishes loading, THE GSAP SHALL play a staggered intro sequence: Navbar fades in from `opacity: 0` and `translateY(-20px)`, followed by the Hero_Section headline, subheadline, CTA buttons, and profile image each animating in with `opacity: 0 → 1` and `translateY(30px) → 0` with a blur-to-clear filter transition.
2. THE intro animation SHALL complete within 2 seconds of the `DOMContentLoaded` event.
3. THE intro animation SHALL use GSAP timelines with `ease: "power3.out"` or equivalent smooth easing.
4. WHILE the intro animation is playing, THE Portfolio SHALL NOT display a flash of unstyled content (FOUC); all animated elements SHALL start at `opacity: 0` via inline style or CSS before GSAP initializes.

---

### Requirement 4: Custom Plasma Cursor

**User Story:** As a visitor using a pointer device, I want a custom glowing cursor that follows my mouse, so that the interaction feels immersive and on-brand.

#### Acceptance Criteria

1. THE Custom_Cursor SHALL replace the default OS cursor on non-touch devices using `cursor: none` on the `<body>`.
2. THE Custom_Cursor SHALL consist of a small filled circle (inner dot, ~8px) and a larger hollow ring (~32px) that follows the pointer with a slight lag using GSAP `quickTo` or equivalent lerp animation.
3. THE Custom_Cursor SHALL apply the Plasma_Gradient as its fill/border color.
4. WHEN the pointer hovers over a link or button, THE Custom_Cursor SHALL scale up and reduce opacity to indicate interactivity.
5. WHEN the pointer moves, THE Custom_Cursor SHALL emit a subtle trailing glow effect using CSS `box-shadow` with `#a4e6ff` at low opacity.
6. WHERE the device is a touch screen (no pointer), THE Custom_Cursor SHALL remain hidden and the default touch behavior SHALL be preserved.

---

### Requirement 5: Hero Section — Animated Background

**User Story:** As a visitor, I want the hero section to have a living, animated background, so that the page feels dynamic and technically impressive.

#### Acceptance Criteria

1. THE Hero_Section SHALL render an animated background using a Three.js canvas or HTML5 Canvas element positioned absolutely behind all hero content.
2. THE Particle_System SHALL display at least 80 particles with low opacity (≤ 0.4) moving slowly (≤ 0.5px/frame) in randomized directions, creating a floating star-field or plasma-dust effect.
3. THE Particle_System SHALL use colors sampled from the Plasma_Gradient (`#a4e6ff` and `#edb1ff`).
4. THE Particle_System SHALL be rendered using `requestAnimationFrame` and SHALL NOT cause the main thread frame rate to drop below 30fps on a mid-range device.
5. WHEN the browser window is resized, THE Hero_Section canvas SHALL resize to match the new viewport dimensions without visual artifacts.

---

### Requirement 6: Hero Section — Content & Typing Animation

**User Story:** As a visitor, I want the hero section to dynamically display my roles and have a compelling visual hierarchy, so that my identity is communicated instantly.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a large headline (≥ 64px on desktop) with the Plasma_Gradient applied to an accent word or phrase via `background-clip: text`.
2. THE Typing_Animator SHALL cycle through at least three role strings (e.g., "Engineer", "Leader", "Innovator") with a typewriter character-by-character reveal, a blinking cursor, and a delete-then-retype transition between strings.
3. THE Typing_Animator SHALL loop indefinitely with a pause of at least 1500ms between role transitions.
4. THE Hero_Section SHALL display rotating glow rings behind the profile image using CSS `@keyframes` rotation animation.
5. THE Hero_Section SHALL display a scroll-indicator element (e.g., animated chevron or bouncing dot) at the bottom of the viewport that disappears after the user scrolls past the Hero_Section.
6. WHEN the user scrolls, THE Hero_Section background (Particle_System) SHALL apply a subtle parallax offset (moving at 0.3× scroll speed) relative to the foreground content.

---

### Requirement 7: Glassmorphic Floating Navbar

**User Story:** As a visitor navigating the portfolio, I want a floating navbar that highlights my current section and responds to interaction, so that navigation feels intuitive and premium.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport with `position: fixed` and a `z-index` above all page content.
2. THE Navbar SHALL apply glassmorphism: `backdrop-filter: blur(20px)` and a semi-transparent background (`rgba(16,19,26,0.6)`).
3. WHEN the user scrolls down more than 50px, THE Navbar SHALL transition to a slightly more opaque background (`rgba(16,19,26,0.85)`) with a subtle bottom glow using `box-shadow`.
4. WHEN a nav link is active (its target section is in the viewport), THE Navbar SHALL highlight that link with the Plasma_Gradient underline animation sliding in from the left.
5. WHEN a nav link is clicked, THE Lenis smooth-scroll SHALL animate the page to the target section with inertia easing.
6. THE Navbar SHALL include a hamburger menu for viewports narrower than 768px, with a full-screen or slide-in overlay menu that animates open/close using GSAP.
7. THE Navbar SHALL include the dark/light mode toggle button (see Requirement 13).

---

### Requirement 8: Scroll-Based Reveal Animations

**User Story:** As a visitor scrolling through the portfolio, I want each section to animate into view, so that the experience feels dynamic and engaging throughout.

#### Acceptance Criteria

1. THE GSAP ScrollTrigger SHALL be used for all scroll-based animations.
2. WHEN a section enters the viewport, THE section's content elements SHALL animate from `opacity: 0` and `translateY(40px)` to `opacity: 1` and `translateY(0)` with staggered timing (0.1s between child elements).
3. THE Experience_Section timeline line SHALL animate its height from 0% to 100% as the user scrolls through the section, using a GSAP ScrollTrigger `scrub` animation.
4. WHEN each Experience_Section item enters the viewport, THE item SHALL animate in from the side (alternating left/right) with `opacity: 0 → 1` and `translateX(±40px) → 0`.
5. THE Skills_Section skill items SHALL animate in with a staggered cascade effect as the section scrolls into view.
6. WHILE the user is scrolling, THE Lenis smooth-scroll SHALL provide inertia-based easing on all scroll events.

---

### Requirement 9: Magnetic Buttons

**User Story:** As a visitor hovering over CTA buttons, I want the buttons to subtly attract toward my cursor, so that interactions feel tactile and premium.

#### Acceptance Criteria

1. THE Magnetic_Button behavior SHALL be applied to all primary CTA buttons (e.g., "View Projects", "Send Transmission", "Resume").
2. WHEN the pointer enters a Magnetic_Button's bounding area (within 60px of the button edge), THE button SHALL translate toward the pointer position using GSAP with a maximum displacement of 12px in any direction.
3. WHEN the pointer leaves the Magnetic_Button's bounding area, THE button SHALL animate back to its original position using GSAP with `ease: "elastic.out(1, 0.3)"`.
4. THE magnetic attraction SHALL be calculated using the pointer offset from the button center, scaled by a factor that produces smooth, non-jarring movement.

---

### Requirement 10: Projects Section — Filtering & 3D Hover

**User Story:** As a visitor browsing projects, I want to filter by tech stack and see immersive hover effects, so that I can quickly find relevant work and feel engaged.

#### Acceptance Criteria

1. THE Projects_Section SHALL display filter buttons for at least four tech categories (e.g., "All", "Frontend", "Backend", "AI/ML").
2. WHEN a filter button is clicked, THE Projects_Section SHALL animate out non-matching project cards (fade + scale down) and animate in matching cards (fade + scale up) using GSAP.
3. THE active filter button SHALL be highlighted with the Plasma_Gradient background.
4. WHEN the pointer hovers over a project card, THE card SHALL apply a CSS 3D perspective tilt effect (max ±10° on X and Y axes) calculated from the pointer position relative to the card center.
5. WHEN the pointer hovers over a project card, THE card SHALL display an overlay with "Live Preview" and "GitHub" buttons that animate in from `opacity: 0`.
6. WHEN the pointer hovers over a project card image, THE image SHALL scale to 1.1× with a glow expansion effect using `box-shadow`.
7. WHEN the pointer leaves a project card, THE 3D tilt SHALL reset to 0° with a smooth GSAP transition.

---

### Requirement 11: Skills Section — Animated Presentation

**User Story:** As a visitor viewing the skills section, I want the tech stack to be presented with visual energy, so that it communicates depth and breadth of expertise.

#### Acceptance Criteria

1. THE Skills_Section SHALL replace static chip lists with animated skill bars OR a floating tech cloud with hover-expansion interactions.
2. WHEN a skill item is hovered, THE item SHALL expand or highlight with a Plasma_Gradient glow and display a proficiency label or brief descriptor.
3. WHEN the Skills_Section enters the viewport, THE skill bars (if used) SHALL animate their fill width from 0% to the target percentage using GSAP with staggered timing.
4. THE Skills_Section SHALL organize skills into at least three categories (e.g., Programming, Tools & Ops, Soft Skills) with visually distinct category headers.

---

### Requirement 12: Contact Section — Form Validation & Animations

**User Story:** As a visitor wanting to reach out, I want a form with real-time validation and satisfying feedback animations, so that the contact experience feels polished and trustworthy.

#### Acceptance Criteria

1. THE Contact_Section form SHALL validate the Name field (non-empty, ≥ 2 characters), Email field (valid email format via regex), and Message field (non-empty, ≥ 10 characters) before submission.
2. WHEN a field fails validation, THE Contact_Section SHALL display an inline error message below the field with a red accent color and a shake animation.
3. WHEN a field receives focus, THE field's underline SHALL transition to the Plasma_Gradient with a left-to-right animation.
4. WHEN the form is successfully submitted (all fields valid), THE Contact_Section SHALL display a success state: the form fades out and a success message with a checkmark animation fades in.
5. IF the form submission fails (network error or invalid response), THEN THE Contact_Section SHALL display an error banner with a descriptive message and allow the user to retry.
6. THE Contact_Section form SHALL be keyboard-navigable with visible focus indicators on all interactive elements.

---

### Requirement 13: Dark / Light Mode Toggle

**User Story:** As a visitor with a preference for light interfaces, I want to toggle between dark and light modes, so that I can view the portfolio comfortably in any environment.

#### Acceptance Criteria

1. THE Portfolio SHALL default to Dark_Mode on initial load.
2. WHEN the user clicks the mode toggle button, THE Portfolio SHALL transition all background colors, text colors, and surface colors to the Light_Mode palette using a CSS `transition` of ≤ 300ms on the `<html>` element's class.
3. THE Light_Mode palette SHALL use a near-white background (`#f4f5f8`), dark text (`#1a1c22`), and retain the Plasma_Gradient for accents.
4. THE mode toggle button SHALL display a sun icon in Dark_Mode and a moon icon in Light_Mode.
5. WHEN the user toggles the mode, THE Portfolio SHALL persist the preference in `localStorage` and apply it on subsequent page loads.
6. WHERE the user's OS preference is `prefers-color-scheme: light` and no `localStorage` value exists, THE Portfolio SHALL default to Light_Mode on first load.

---

### Requirement 14: Accessibility

**User Story:** As a visitor using assistive technology or keyboard navigation, I want the portfolio to be fully navigable and readable, so that the experience is inclusive.

#### Acceptance Criteria

1. THE Portfolio SHALL include a `lang="en"` attribute on the `<html>` element.
2. THE Portfolio SHALL use semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h3>`) for all major structural regions.
3. THE Portfolio SHALL provide descriptive `alt` attributes on all `<img>` elements.
4. THE Portfolio SHALL include `aria-label` attributes on all icon-only buttons (e.g., hamburger menu, mode toggle, social links).
5. WHEN the user navigates via keyboard (Tab key), THE Portfolio SHALL display a visible focus ring on all interactive elements (links, buttons, inputs).
6. THE Custom_Cursor SHALL NOT interfere with keyboard navigation or screen reader announcements.
7. THE Portfolio SHALL include a `<meta name="description">` tag and appropriate Open Graph meta tags for SEO.
8. THE Portfolio SHALL use `<title>Ganesh Raju | Kinetic Architect Portfolio</title>` as the page title.

---

### Requirement 15: Performance Optimization

**User Story:** As a visitor on a mid-range device or slower connection, I want the portfolio to load and animate smoothly, so that the experience is not degraded by performance issues.

#### Acceptance Criteria

1. THE Portfolio SHALL apply `loading="lazy"` to all `<img>` elements below the fold.
2. THE Portfolio SHALL use `will-change: transform, opacity` on elements that are animated by GSAP to hint GPU compositing, applied only immediately before animation and removed after.
3. THE Portfolio SHALL use `requestAnimationFrame` (via GSAP or directly) for all continuous animations (cursor, particles, typing) to avoid layout thrashing.
4. THE Particle_System SHALL limit particle count to a maximum of 150 and use a single canvas draw call per frame.
5. WHERE the user has enabled `prefers-reduced-motion`, THE Portfolio SHALL disable or minimize all non-essential animations (particles, parallax, magnetic buttons, typing animation) while preserving layout and content visibility.
6. THE Portfolio SHALL NOT load any JavaScript library synchronously in the `<head>` that blocks rendering; all CDN scripts SHALL use `defer` or be placed before `</body>`.
