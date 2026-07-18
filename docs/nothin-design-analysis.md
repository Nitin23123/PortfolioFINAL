# Design Analysis — noth.in ("Nothin'" Creative Studio, Paris)

> Reference document extracted from the live site (HTML + Webflow CSS bundles) on 2026-07-09.
> Purpose: design reference / inspiration source for the portfolio redesign.

---

## 1. Overview

| | |
|---|---|
| **Site** | https://www.noth.in/ |
| **Who** | "Nothin'" — creative studio in Paris, founded by Sara Guedj |
| **Concept** | The studio name is a paradox: "Nothin' is Everythin'" — an empty space open enough to become anything. Every design decision restates this. |
| **Stack** | Webflow (CDN-hosted), jQuery 3.5.1, native Webflow interactions. **No GSAP, no Lenis, no Three.js.** |
| **Fonts loaded** | PP Neue Montreal (self-hosted), IBM Plex Mono 400 (Google Fonts via webfont.js) |
| **Analytics** | Google Analytics (gtag) |

The key insight: the site's polish comes from **discipline and micro-details**, not technical complexity. It runs on less tooling than this portfolio already has installed.

---

## 2. Typography System

### 2.1 The two-font hierarchy

| Role | Font | Usage |
|---|---|---|
| **Expressive layer** | PP Neue Montreal (weight 500) | Headings, body, buttons — everything with a voice |
| **Metadata layer** | IBM Plex Mono (weight 400) | Labels, eyebrows, indices, dates, cursor chips — everything that annotates |

The mono "metadata layer" is the site's strongest cheap trick. It is always:
- UPPERCASE
- Small (`0.75rem`)
- Gray (`#8e8e8e`)
- Letter-spaced (`+0.03em`)

Examples from the site: `UTOPIA`, `( The Studio )`, `( The step aside )`, `( 08 )`, `© 24 . 26`.

### 2.2 Viewport-proportional scale (the "poster" system)

```css
html { font-size: calc(0rem + 1vw); }                       /* desktop: 1rem = 1vw */
@media screen and (max-width: 991px) { html { font-size: 1rem; } }  /* tablet down: normal 16px */
```

On desktop **1rem = 1% of viewport width**, so the whole composition scales like a poster —
identical proportions at 1280px and 2560px. An `h1` at `5rem` is literally always 5vw wide.

### 2.3 Type scale

| Element | Size | Details |
|---|---|---|
| `body` | `14px` | weight 500, `line-height: 1.1` |
| `h1` / `.h1-home` | `5rem` (= 5vw) | weight 500, `letter-spacing: -0.01em`, `line-height: 1`, `text-wrap: balance` |
| `h2` | `3.75rem` | weight 500, `letter-spacing: -0.01em`, `line-height: 1` |
| `.p-l` (large paragraph) | `1.5625rem` | `line-height: 1` – `1.2` |
| `.works-word` (sticky "works") | `1.875rem` | weight 700, UPPERCASE, `letter-spacing: -0.03em` |
| `.title-work` (mono labels) | `0.75rem` | IBM Plex Mono, UPPERCASE, `#8e8e8e`, `+0.03em` |
| Cursor chip | `12px` | IBM Plex Mono, UPPERCASE |

Signature traits: **tight negative tracking on display type, near-solid line-heights (1.0–1.1), weight 500 as default** (never 400 for the grotesque).

---

## 3. Color System

Deliberately almost nothing. The entire palette:

| Token | Value | Role |
|---|---|---|
| `--black` | `black` | Primary dark, section backgrounds |
| `--white` | `white` | Primary light, section backgrounds |
| `--transparent` | `#0000` | Utility |
| Gray | `#8e8e8e` | Mono metadata text |
| Warm gray | `#e3e1de` | Secondary surface |
| Green | `#0ba954` | Single accent — availability/status dot only |
| Translucent white | `#fff6` | Hairline button borders |

**Section alternation** drives all visual rhythm:
`white hero → black works → black video → white studio → black glitch/footer`

Sticky elements crossing section boundaries use `mix-blend-mode: difference` so they invert
automatically — one CSS line instead of a scroll-triggered color-swap system.

---

## 4. Layout & Spacing

- **Edge-to-edge containers** with tiny padding: `.container { padding: 1rem 1.25rem 1.625rem; }`
- **Asymmetric grids**: two-column `grid-template-columns: 0.75fr 1fr` for text sections
- **Named spacer utilities**: `space-24`, `space-87`, `space-150` — whitespace is a designed, reusable token, not ad-hoc margins
- **Tiny radii on media**: images use `border-radius: 0.25rem` (barely rounded); buttons are full pills (`6.25rem`)
- **Hidden scrollbar** everywhere (`scrollbar-width: none`, `::-webkit-scrollbar { display: none }`)
- `overscroll-behavior: none` — no rubber-banding
- Global antialiasing: `-webkit-font-smoothing: antialiased`

---

## 5. Components

### Pill button (`.btn`)

```css
.btn {
  background-color: var(--black);
  color: var(--white);
  letter-spacing: .08em;
  text-transform: uppercase;
  border: 1px solid #fff6;          /* hairline translucent border */
  border-radius: 6.25rem;           /* full pill */
  padding: 1rem 2.25rem 1rem 1.25rem;
  font-weight: 500;
  transition: border-color .4s;
}
.btn:hover { border-color: #fff; }  /* border brightens — that's the whole hover */
```

Inverted variant: `.btn.black-blend { background: var(--white); color: var(--black); }`

### Custom cursor chip (`.cursor-work`)

A black rounded pill that follows the pointer over project cards, reading "explore":

```css
.cursor-work {
  background-color: var(--black);
  border-radius: 100px;
  padding: .125rem .75rem;
  font-family: IBM Plex Mono;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .03em;
  position: absolute;
}
```

The cursor is **themed per context** — dedicated classes exist for `apos-cursor` (an
apostrophe-shaped cursor referencing the ' in "Nothin'"), `h-cursor`, `i-cursor`, `n-cursor`.

### Mono label (`.title-work`)

```css
.title-work {
  color: #8e8e8e;
  letter-spacing: .03em;
  text-transform: uppercase;
  font-family: IBM Plex Mono;
  font-size: .75rem;
}
```

---

## 6. Page Structure & Signature Moves

Section order on the homepage:

1. **Preloader** — fixed black overlay (`z-index: 1001`), count-up number, floating candy/foil
   "bonbon" images. The playful counterweight to the austerity.
2. **Hero** (`section.hero-home`) — 100vh white, background video (`.video-hero-bg`), tagline:
   *"Not a style, a perspective. Because Nothin' is Everythin'."*
3. **Showreel** — pulled up with `margin-top: -100vh` to overlap/reveal over the hero on scroll.
   Copy: *"Most brands produce content. We prefer ideas."*
4. **Works** (`section.works`, black) — 5 case studies (Utopia, Aurbse, In_Cognita, Lgm, Haptify),
   each with a one-line poetic description + "explore".
   - The word "w o r k s" is `position: sticky; top: 3rem` with `mix-blend-mode: difference`,
     riding the scroll and inverting over imagery.
   - Hover reveals project image + the custom cursor chip.
   - Footer of section: `( 08 )` project count, `© 24 . 26` year range — mono metadata.
5. **Video section** (black) — showreel with a "Sound" toggle.
6. **Studio / team** (`section.info-img`, white) — `( The Studio )` label, services list
   (Brand identities / Campaigns / Digital experiences / Events / Visual systems), founders &
   creative partners as plain mono-labeled lists.
7. **Glitch section** (`section.glitch`, black) — sticky 100vh grid repeating *"we are nothin'"*
   interleaved with corrupted strings (`Pj(è !!" U§hs…`). The brand name literally decaying into
   noise — the concept made visual. Most memorable moment on the site.
8. **CTA + footer** — *"Let's start from nothin'"*, Calendly booking, email, LinkedIn / Instagram /
   Behance, credits.

### Copy voice

- lowercase/UPPERCASE contrast for rhythm
- Parenthetical asides as structural labels: `( The step aside )`, `( The Studio )`
- Short poetic one-liners per project: *"Branding the forgotten sense."*
- Index numbers and date ranges as decoration: `( 08 )`, `© 24 . 26`

---

## 7. Weaknesses (what NOT to copy)

| Issue | Detail |
|---|---|
| **Tiny text** | 14px body with `line-height: 1.1`; the 1vw rem system shrinks further on smaller desktops. Hard to read. |
| **Contrast failure** | `#8e8e8e` on white ≈ 3.4:1 — below WCAG AA for small text, used at 12px. |
| **No `<h1>` on the homepage** | Headings start at `<h2>`. Bad for SEO and document outline. |
| **Hidden scrollbar** | Removes scroll-position feedback entirely. |
| **Screen-reader hostile glitch text** | The corrupted strings are real DOM text and will be read aloud; no `aria-hidden`. |
| **User font-size ignored** | The vw-based rem anchor overrides browser "larger text" preferences (zoom still works). |
| **Legacy runtime** | jQuery 3.5.1 + Webflow bundle — heavy for what it does. |
| **Autoplay 100vh video** | Load/battery cost on the very first paint. |

---

## 8. Takeaways for This Portfolio

The repo already has `ScrambleText`, `CustomCursor`, `LoadingScreen`, GSAP, Lenis, and R3F —
more firepower than noth.in uses. The gap is **restraint**, not features:

1. **Add a mono metadata layer.** One mono font, uppercase, small, gray, letter-spaced — used
   *only* for labels, section indices, dates. Instantly organizes every page. (IBM Plex Mono,
   JetBrains Mono, or Space Mono.)
2. **Two fonts, two colors, one accent — hard limits.** The site feels expensive because nothing
   competes. Effects sit on top of a boring, rigid grid.
3. **`mix-blend-mode: difference` on sticky elements** when sections alternate dark/light —
   replaces an entire scroll-trigger color system with one line of CSS.
4. **Whitespace as tokens.** Named spacer sizes (e.g. 24 / 88 / 152 px) instead of ad-hoc margins.
5. **Poster-scale fluid type** (`clamp()` is the accessible way to get the same effect —
   avoid the raw `1vw` rem anchor and its a11y problems).
6. **Pill buttons with hairline borders** where only the border animates on hover — quieter and
   classier than background swaps.
7. **Concept before decoration.** Every flourish on noth.in (glitch, apostrophe cursor, candy
   loader) restates the brand. Cut any effect that doesn't argue for *your* story.
8. **Fix their mistakes**: keep a real `<h1>`, AA-contrast labels (`#767676`+ on white), visible
   scroll affordance, `aria-hidden` on decorative text, ≥16px body with breathable line-height.
