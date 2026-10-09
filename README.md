# @sofidevo/astro-dynamic-header

A dynamic, responsive header component for Astro projects. Supports floating and fullscreen layouts, multi-level dropdown navigation, native CSS variable customization, dark mode, and TypeScript — all with zero external icon dependencies.

As of v4.0.0 the component styles are shipped inside CSS cascade layers, so any utility class you pass to the component wins over the built-in styles **without `!important`**. As of v5.0.0 theming is CSS-variables-only (`--l-*`, `--d-*`, `--header-z-index`): the `theme` prop was removed and the component renders no inline styles.

## Features

- **Floating & Fullscreen layouts** — switch layouts with a single prop.
- **Fully Responsive** — mobile-first accordion dropdowns with optimized hit targets.
- **3-level Dropdowns** — top, secondary, and tertiary nested navigation items.
- **Dark Mode Ready** — auto-detects `.dark` on `<html>`, or forces a state with `preset`.
- **Inline SVG Icons** — no external CDNs, no extra network requests, no flash of missing icons.
- **Slot Support** — inject your custom logo and header actions directly into slots.
- **Pure CSS Customization** — background, blur, colors, and z-index via native CSS variables.
- **Cascade-layer friendly** — component styles live in `@layer components`, so your utility classes override them without `!important` and without `twMerge()`.
- **Dev diagnostics** — in dev, warns in the console (with the fix) when your overrides cannot win or an old v3.x install is detected.
- **Full TypeScript** — all props and config interfaces are fully typed and documented (TSDoc).

### Live Demo

[https://base-astro-psi.vercel.app/fullscreen-demo](https://base-astro-psi.vercel.app/fullscreen-demo)

---

## Installation

```bash
# npm
npm i @sofidevo/astro-dynamic-header

# pnpm
pnpm add @sofidevo/astro-dynamic-header

# yarn
yarn add @sofidevo/astro-dynamic-header
```

- Peer dependency: `astro ^7.0.0`.
- No external CDN scripts or stylesheet additions are required.
- No CSS framework is required. Tailwind, UnoCSS, or plain CSS all work.

---

## Quick Start

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const menuItems = [
  { link: '/about', text: 'About' },
  { link: '/contact', text: 'Contact' },
];

const navigation = { menuItems };
---

<Header navigation={navigation}>
  <a slot="logo" href="/">MyLogo</a>
</Header>
```

---

## Breaking Changes in v5.0.0

> [!WARNING]
> v5.0.0 removes the JavaScript theming API. The component now has a single theming mechanism: CSS variables.

### 1. The `theme` prop and `defaultThemes` were removed

Colors, blur, and z-index are plain CSS variables — one mechanism instead of two, and no inline styles at all, so layered CSS and utilities can always win.

Before (v4):

```astro
---
import { defaultThemes } from '@sofidevo/astro-dynamic-header';

const theme = { light: { ...defaultThemes.light, accentColor: "#7c3aed", zIndex: 60 } };
---
<Header theme={theme} />
```

After (v5):

```css
:root {
  --l-accent: #7c3aed;
  --header-z-index: 60;
}
```

The `DualThemeConfig` and `ThemeConfig` types and the `./defaults` export are gone; passing `theme` now fails type-checking.

### 2. The container no longer renders an inline z-index

| | v4.x | v5.0.0 |
| --- | --- | --- |
| Theming API | `theme` prop + CSS variables | CSS variables only |
| Container z-index | inline `style="z-index: 10"` (no CSS could beat it) | `z-index: var(--header-z-index, 200)` in `@layer components` (utilities win) |
| `defaultThemes` | exported from `./defaults` | removed |

z-index utilities passed as `classNames.container` (for example `"z-50"`) now work as expected.

### 3. Other changes in v5.0.0

- **Dev diagnostics for override problems.** In dev the component checks the final cascade layer order after page load and logs a `console.warn` with the exact fix when your overrides cannot win (wrong layer order) or when an old v3.x install is detected. The check is stripped from production builds.
- **The layer order statement also ships inline.** Next to the bundled statement, the component renders `<style is:inline>` with `@layer theme, base, components, utilities;`, so styles injected at runtime are ordered correctly too.
- **TSDoc everywhere.** Every prop and exported interface is documented in English with usage examples, including hover states via `classNames` and `navigation.menu__link__class`.

### Migration checklist (to v5)

```md
- [ ] Update the package: npm i -U @sofidevo/astro-dynamic-header
- [ ] Replace every `theme={{ light: {...}, dark: {...} }}` with the matching CSS variables (see "CSS variable reference").
- [ ] Replace `theme.zIndex` with `--header-z-index` (or pass a z-index utility via `classNames.container`).
- [ ] Remove `defaultThemes` imports; the defaults live in the CSS variable table below.
```

---

## Breaking Changes in v4.0.0

> [!WARNING]
> v4.0.0 changes how the component's CSS participates in the cascade. Read this section before upgrading from `3.x`.

### 1. `classNames.logo` and `classNames.logoText` were removed

`HeaderClassNames` no longer accepts `logo` or `logoText`. Those keys never matched any rendered markup (the logo has always been a slot), but passing them now fails type-checking.

Before (v3) — never actually styled anything:

```astro
<Header classNames={{ logo: "hover:opacity-80", logoText: "font-bold" }} />
```

After (v4) — style the markup you put in the slot:

```astro
<Header>
  <a slot="logo" href="/" class="logo-link hover:opacity-80">
    <span class="font-bold">MyLogo</span>
  </a>
</Header>
```

### 2. Component styles are now scoped and layered

| | v3.x | v4.0.0 |
| --- | --- | --- |
| Style block | `<style is:inline>` (global) | `<style>` (scoped to the component) |
| Layer | none (unlayered) | `@layer components` |
| Order statement | none | `@layer theme, base, components, utilities;` |
| Override your header with utilities | required `!important` | works out of the box |
| Your unlayered CSS vs. component | component usually won (specificity + document order) | **your unlayered CSS wins** |

Two practical consequences:

- **Utilities now win.** `classNames`, Tailwind classes, and any rule you put in `@layer utilities` beat the built-in styles even at equal or lower specificity. You can delete the `!important`s you may have added.
- **Unlayered CSS now wins over the component.** Global resets, hand-written element selectors (`header { ... }`, `a { ... }`), and Tailwind v3 Preflight are emitted outside any layer, and unlayered rules beat *every* layered rule. If your reset should sit *under* the header, wrap it in `@layer base` (see the [Styling Guide](#styling-guide) and the [FAQ](#my-overrides-do-not-apply)).

### 3. Other behavior changes

- **Forced theme rules no longer use `!important`.** `.header.header--force-light` / `.header.header--force-dark` rely on specificity instead, so they can be overridden by your own layered CSS if you ever need to.
- **The mobile panel's `.active` rule no longer uses `!important`**, so active-link styles are overridable like everything else.
- **`MobileNav` defaults to `type="floating"`** when rendered on its own (previously it produced an undefined modifier class).
- **Theme variable fallbacks now match the documented defaults** exactly (for example `rgba(255, 255, 255, 0.9)` for `--l-bg`, see [CSS variable reference](#css-variable-reference)).

### Migration checklist

```md
- [ ] Update the package: npm i -U @sofidevo/astro-dynamic-header
- [ ] Remove `logo` / `logoText` from `classNames` (style the `logo` slot instead).
- [ ] Remove the `!important` declarations you added to override the header (they are no longer needed).
- [ ] Move your global resets / element selectors into `@layer base`.
- [ ] Using Tailwind v3? Read "Preflight changed my nav link colors" in the FAQ.
```

---

## Component Props

### `<Header>`

| Prop         | Type                          | Default      | Description                                       |
| ------------ | ----------------------------- | ------------ | ------------------------------------------------- |
| `headerType` | `"floating" \| "fullscreen"`  | `"floating"` | Layout style                                      |
| `preset`     | `"light" \| "dark" \| "auto"` | `"auto"`     | Theme mode. `"auto"` follows `.dark` on `<html>`. |
| `navigation` | `NavConfig`                   | `{}`         | Menu items, home link, and custom CSS classes     |
| `classNames` | `HeaderClassNames`            | `{}`         | Inject CSS classes into structural elements       |

> [!NOTE]
> There is no `theme` prop — it was removed in v5. Colors, blur, and z-index are CSS variables (see [CSS variable reference](#css-variable-reference)).

---

## Configuration Objects

### `NavConfig`

| Property              | Type         | Default | Description                                             |
| --------------------- | ------------ | ------- | ------------------------------------------------------- |
| `menuItems`           | `MenuItem[]` | `[]`    | Top-level navigation items                              |
| `homeUrl`             | `string`     | `"/"`   | URL for the home link                                   |
| `header__menu__class` | `string`     | —       | Extra CSS class(es) for the desktop `<nav>` element     |
| `header__item__class` | `string`     | —       | Extra CSS class(es) for each top-level `<li>` menu item |
| `menu__link__class`   | `string`     | —       | Extra CSS class(es) for each top-level `<a>` link       |

### `MenuItem`

| Property  | Type                  | Required | Description                       |
| --------- | --------------------- | -------- | --------------------------------- |
| `link`    | `string`              | Yes      | URL the item points to            |
| `text`    | `string`              | Yes      | Display label                     |
| `submenu` | `SecondaryMenuItem[]` | No       | Optional nested items (2nd level) |

### `SecondaryMenuItem`

| Property  | Type                 | Required | Description                       |
| --------- | -------------------- | -------- | --------------------------------- |
| `link`    | `string`             | Yes      | URL the item points to            |
| `text`    | `string`             | Yes      | Display label                     |
| `submenu` | `TertiaryMenuItem[]` | No       | Optional nested items (3rd level) |

### `TertiaryMenuItem`

| Property | Type     | Required | Description            |
| -------- | -------- | -------- | ---------------------- |
| `link`   | `string` | Yes      | URL the item points to |
| `text`   | `string` | Yes      | Display label          |

---

## Slots

| Slot name | Visible on       | Description                                                |
| --------- | ---------------- | ---------------------------------------------------------- |
| `logo`    | Header           | Render your logo exactly as you need (native HTML/widgets) |
| `actions` | Desktop + mobile | Add buttons, links, or utility widgets                     |

```astro
<Header navigation={{ menuItems }}>
  <a slot="logo" href="/" class="logo-link">
    <img src="/logo.svg" alt="Branding" width="40" />
    <span>MyBrand</span>
  </a>
  <div slot="actions">
    <a href="/login" class="btn">Log in</a>
  </div>
</Header>
```

Slotted markup is rendered by *your* page, so your page's CSS applies to it normally. Style the logo with your own classes (this replaces the removed `classNames.logo` / `classNames.logoText`).

---

## Custom Class Names

The `classNames` prop injects CSS classes into specific structural elements.

### `HeaderClassNames`

| Property    | Target element                         | Common use cases                                  |
| ----------- | -------------------------------------- | ------------------------------------------------- |
| `container` | Outer `<div>` wrapping the header      | Positioning, padding, outer gutters               |
| `header`    | Inner `<header>` element               | Shadows, borders, transitions, radius, backdrop   |
| `nav`       | `<div>` wrapping the desktop nav items | Spacing, alignment, responsive visibility         |
| `mobileNav` | Root `<nav>` of the mobile panel       | Backdrop blur, slide-in overrides, panel width    |

```astro
<!-- Tailwind example -->
<Header
  classNames={{
    header: "shadow-xl border-b border-black/5 dark:border-white/10",
    container: "top-4 px-6",
    mobileNav: "backdrop-blur-md",
  }}
/>
```

---

## Styling Guide

Everything below assumes you want to change how the header looks or behaves. Pick the lightest tool that solves your case:

| Goal | Use |
| --- | --- |
| One-off tweaks (shadow, border, padding, radius) | `classNames` with utilities |
| A different overall design (square, full-width, compact) | Your own CSS in `@layer utilities` |
| Restyle nav links, dropdowns, or the mobile panel | Selectors targeting the internal class hooks |
| Brand colors, blur, background | CSS variables (`--l-*` / `--d-*`) |
| Per-instance tokens or z-index | Scoped CSS variables (`--header-z-index`, `--l-*` on a wrapper) |
| Logo / buttons markup | Slots |

### Style precedence

The component ships this statement ahead of its own rules:

```css
@layer theme, base, components, utilities;
```

Priority, lowest to highest:

```text
base  <  components (this header)  <  utilities (your classNames/overrides)  <  unlayered CSS
```

Rules of thumb:

- Put your resets and element defaults in `@layer base`.
- Put overrides for this header in `@layer utilities` (or pass them as `classNames`).
- Keep in mind that CSS **outside** any layer beats everything layered, including this component. That is the spec, not a bug.
- If you write plain CSS with no framework, declare the order statement at the top of your global stylesheet so the order is fixed before any layer is used. Tailwind v4 does this for you (`@layer theme, base, components, utilities;`).

### Example: redesign with plain CSS

Square, full-width, no glass effect — the classic "make it look like a different component" case:

```astro
<Header
  classNames={{
    container: "header-wide",
    header: "header-square",
  }}
/>
```

```css
@layer utilities {
  .header-wide {
    padding: 0;
  }

  .header-square {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 2rem;
  }
}
```

No `!important`, and the same classes work whether you are on Tailwind or not.

### Example: compact sticky bar

The container is `position: fixed` by default. To make the header participate in normal flow (or stick to the top while scrolling):

```astro
<Header classNames={{ container: "nav-sticky", header: "nav-compact" }} />
```

```css
@layer utilities {
  .nav-sticky {
    position: sticky;
    top: 0;
  }

  .nav-compact {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-radius: 0;
  }
}
```

### Example: override internal elements

The header renders regular DOM (no shadow root), so any selector reaches the internals. Wrap the header in a class to scope your rules to one page:

```astro
<div class="docs-header">
  <Header navigation={{ menuItems }} />
</div>
```

```css
@layer utilities {
  /* Typography of the desktop links */
  .docs-header .menu__link {
    text-transform: uppercase;
    letter-spacing: 0.02em;
    font-size: 0.875rem;
  }

  /* Dropdown surfaces */
  .docs-header .submenu,
  .docs-header .subsubmenu {
    border-radius: 12px;
    padding: 0.75rem;
    box-shadow: 0 12px 32px rgb(0 0 0 / 0.18);
  }

  /* Hover underline color */
  .docs-header .menu__link::after {
    background: #7c3aed;
    height: 3px;
    top: 30px;
  }

  /* Active link in the mobile panel */
  .docs-header .mobile-menu__link.active {
    color: #7c3aed;
  }
}
```

Because these live in `utilities`, they beat the component's `components` layer regardless of specificity.

### Example: custom responsive breakpoint

The desktop nav hides below `768px`. To keep it visible down to `640px`:

```css
@layer utilities {
  @media (width >= 640px) and (width < 768px) {
    .docs-header .header__menu {
      display: flex;
    }

    .docs-header .hamburger {
      display: none;
    }
  }
}
```

Media queries live inside the rule, so you re-declare the property at the breakpoints you care about; the layer decides which declaration wins.

### Example: dark-mode-only tweaks

```css
@layer utilities {
  :root.dark .docs-header .header {
    --d-bg: rgb(17 24 39 / 0.85);
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.35);
  }
}
```

### Example: colors with CSS variables

See [Customization & Theme Config](#customization--theme-config) for the full variable reference. Global (whole site):

```css
:root {
  --l-accent: #7c3aed;
  --l-bg: rgb(255 255 255 / 0.85);
  --d-accent: #a78bfa;
  --d-bg: rgb(10 10 10 / 0.85);
}
```

Scoped to one section (marketing page gets a purple tint, the docs stay neutral):

```css
.marketing-hero {
  --l-bg: rgb(124 58 237 / 0.14);
  --l-blur: blur(28px);
}
```

```astro
<section class="marketing-hero">
  <Header navigation={{ menuItems }} />
</section>
```

Variables are inherited, so defining them on any ancestor of the header works.

### Example: z-index and per-instance tokens

The container resolves its stacking level as `z-index: var(--header-z-index, 200)` inside `@layer components`, and there is no inline style — so z-index utilities passed as `classNames.container` win:

```astro
<Header classNames={{ container: "z-50" }} />
```

Or set it once, globally or on a wrapper (variables are inherited):

```css
:root {
  --header-z-index: 60;
}
```

Per-instance tokens work the same way:

```astro
<section class="marketing-hero">
  <Header navigation={{ menuItems }} />
</section>
```

```css
.marketing-hero {
  --l-bg: rgb(124 58 237 / 0.14);
  --header-z-index: 60;
}
```

### Example: mobile panel

```astro
<Header classNames={{ mobileNav: "mobile-wide" }} />
```

```css
@layer utilities {
  /* Full-bleed panel instead of the default over-wide slide-in */
  .mobile-wide {
    width: 100vw;
  }

  .mobile-wide.is-active {
    transform: translateX(0);
  }

  /* Softer surface + accent links */
  .mobile-wide .mobile-menu li a {
    border-color: rgb(124 58 237 / 0.35);
    font-size: 1.1rem;
  }
}
```

If you prefer the fullscreen slide behavior everywhere, render with `headerType="fullscreen"` — the panel then uses `translate(0)` when open.

### Example: hamburger and icons

The hamburger lines follow the header text color (`--l-text` / `--d-text`), so recoloring the text recolors the lines:

```css
:root {
  --l-text: #111827;
  --d-text: #f9fafb;
}
```

Shape and size of the button itself:

```astro
<Header classNames={{ header: "header-round-btn" }} />
```

```css
@layer utilities {
  #hamburger-btn {
    border-radius: 999px;
    padding: 0.6rem 0.9rem;
  }
}
```

The sun and chevron icons use `currentColor`, so they follow the surrounding text color automatically. The moon glyph uses `var(--svg-color--fff, #fff)` instead, so it stays white unless you override that variable.

### Internal class hooks

| Element | Classes / id |
| --- | --- |
| Outer wrapper | `.header__container`, `.header__container--floating`, `.header__container--fullscreen` |
| Header bar | `.header`, `.header--floating`, `.header--fullscreen`, `.header--force-light`, `.header--force-dark` |
| Desktop nav wrapper | `.nav-menu-wrapper` |
| Desktop nav | `#header-menu`, `.header__menu`, `.menu`, `.menu__item`, `.header__item`, `.menu__link` |
| Dropdowns | `.submenu`, `.subsubmenu`, `.submenu__item--secondary`, `.submenu__item--tertiary` |
| Hamburger | `#hamburger-btn`, `.hamburger`, `.hamburger-box`, `.hamburger-inner` |
| Mobile panel | `#mobile-header-menu`, `.mobile-header__menu`, `.mobile-header__menu--floating`, `.mobile-header__menu--fullscreen` |
| Mobile list | `.mobile-menu`, `.mobile-menu__link`, `.mobile-details`, `.menu__summary`, `.mobile-submenu`, `.mobile-subsubmenu` |
| Slot wrappers | `.actions-desktop`, `.actions-mobile` |

### Styling caveats

- **Layer order is fixed by first appearance.** If your plain-CSS overrides lose even from `@layer utilities`, put `@layer theme, base, components, utilities;` at the very top of your global stylesheet — the dev console warning points it out.
- **There are no inline styles.** The container z-index is `var(--header-z-index, 200)` in `@layer components`, so utilities beat it.
- **`!important` in a layer still works** (important declarations reverse layer order), but you should not need it.
- **Unlayered CSS beats everything layered.** If a global rule seems "too strong", that is why — move it into `@layer base`.
- **Astro scopes component styles with `data-astro-cid-*` attributes.** Your selectors do not need them; plain class selectors work.

---

## Customization & Theme Config

You can fully customize the color scheme using **CSS Custom Properties** — the only theming mechanism since v5.

### CSS variable reference

Input variables (set them wherever the header lives — `:root`, a wrapper, or a per-instance scope):

| Variable | Used for | Light default | Dark default |
| --- | --- | --- | --- |
| `--l-bg` / `--d-bg` | Header background (translucent) | `rgba(255, 255, 255, 0.9)` | `#0d0d0dcc` |
| `--l-bg-opaque` / `--d-bg-opaque` | Solid background of dropdowns and the mobile panel | `rgb(255, 255, 255)` | `#0d0d0d` |
| `--l-text` / `--d-text` | Text, hamburger lines, icons | `#1a1a1a` | `#ffffff` |
| `--l-accent` / `--d-accent` | Hover underline, active links, dashed borders | `#3e1c71` | `#00ffff` |
| `--l-blur` / `--d-blur` | `backdrop-filter` value | `blur(20px)` | `blur(20px)` |
| `--header-z-index` | Stacking level of the fixed container | `200` | `200` |

Derived variables (resolved by the component per theme state; override them only if you need to target internals directly):

| Variable | Resolves to |
| --- | --- |
| `--bg-color` | `--l-bg` or `--d-bg` |
| `--bg-color-opaque` | `--l-bg-opaque` or `--d-bg-opaque` |
| `--text-color` | `--l-text` or `--d-text` |
| `--accent-color` | `--l-accent` or `--d-accent` |
| `--backdrop-blur` | `--l-blur` or `--d-blur` |

### Setting the variables

```css
:root {
  /* Light theme overrides */
  --l-accent: #7c3aed;
  --l-bg: rgba(255, 255, 255, 0.85);
  --l-bg-opaque: #ffffff;
  --l-text: #1a1a1a;
  --l-blur: blur(20px);

  /* Dark theme overrides */
  --d-accent: #a78bfa;
  --d-bg: rgba(10, 10, 10, 0.85);
  --d-bg-opaque: #0a0a0a;
  --d-text: #f5f5f5;
  --d-blur: blur(20px);

  /* Stacking */
  --header-z-index: 60;
}
```

The hamburger lines and the sun/chevron icons follow `--l-text` / `--d-text`, so text color drives them too. The moon glyph keeps its own white fill (`--svg-color--fff`, default `#fff`).

Because there are no inline styles, your own layered CSS always beats these defaults — override any variable on a wrapper to scope it to one instance (see [z-index and per-instance tokens](#example-z-index-and-per-instance-tokens)).

> [!IMPORTANT]
> When using transparent backgrounds, always supply a solid fallback in `--l-bg-opaque` / `--d-bg-opaque`. Submenus and mobile panels utilize this solid color to prevent visual glitches with nested blur effects.

---

## TypeScript

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';
import type {
  MenuItem,
  NavConfig,
  HeaderClassNames,
  HeaderProps,
} from '@sofidevo/astro-dynamic-header';

const menuItems: MenuItem[] = [
  { link: '/about', text: 'About' }
];

const navigation: NavConfig = {
  menuItems,
  homeUrl: "/",
  header__menu__class: "flex gap-4"
};

const classNames: HeaderClassNames = {
  header: "shadow-lg"
};
---

<Header
  navigation={navigation}
  classNames={classNames}
/>
```

---

## Development

```bash
pnpm install
pnpm dev        # demo at localhost:4321
pnpm check      # astro check (0 errors expected)
pnpm test       # vitest: unit + rendering + built-CSS tests
pnpm build      # builds the demo site
```

The test suite runs in two Vitest projects: `dom` (jsdom, exercises the extracted behaviour scripts) and `astro` (Node, renders `Header.astro` through Astro's Container API and asserts the built CSS contract — layer order, rules inside `@layer components`, no `!important`). See `tests/README.md`.

---

## Troubleshooting & FAQ

### Import issues

Import using the direct subpath:

```astro
import Header from '@sofidevo/astro-dynamic-header/Header';
```

Other components are exported similarly:

```astro
import NavMenu from '@sofidevo/astro-dynamic-header/NavMenu';
import MobileNav from '@sofidevo/astro-dynamic-header/MobileNav';
import ChevronIcon from '@sofidevo/astro-dynamic-header/ChevronIcon';
```

### My overrides do not apply

Check these in order:

0. **Which version is installed?** Run `npm ls @sofidevo/astro-dynamic-header` (or the pnpm/yarn equivalent). v3.x ships unlayered styles that beat every layered override, so no amount of `@layer utilities` or Tailwind classes can win. Update to the latest version — in dev, the component logs a console warning when it detects this.
1. **Which layer is your rule in?** Overrides belong in `@layer utilities`, or in a class passed through `classNames`. Rules in `@layer base` (and your resets) lose to the component by design.
2. **Did your CSS create `utilities` before the layer order statement ran?** Layers are ordered by their *first appearance* in the document; a later statement cannot reorder them. If your global CSS uses `@layer` but no statement comes first, add `@layer theme, base, components, utilities;` as its very first line (Tailwind v4 already emits this). In dev, the component logs a console warning with the exact fix when it detects this ordering.
3. **Are you selecting the right hook?** See the [internal class hooks](#internal-class-hooks) table; plain class selectors are enough (you do not need `data-astro-cid-*`).
4. **Tailwind v4?** Its layer order matches this component exactly, so utilities work automatically. Make sure `@import "tailwindcss"` comes first in your entry CSS.

Since v5 the component renders no inline styles at all — CSS variables (`--l-*`, `--d-*`, `--header-z-index`) and `@layer utilities` always win.

### Preflight changed my nav link colors (Tailwind v3)

Tailwind v3 emits Preflight and utilities **outside** native cascade layers (v3 hijacks `@layer` as its own directive), and CSS outside a layer beats CSS inside a layer. Preflight's `a { color: inherit; ... }` therefore overrides the component's layered link colors.

Options:

1. **Upgrade to Tailwind v4** (recommended) — native layers with the exact order `theme, base, components, utilities`, so everything lines up.
2. **Disable Preflight** in v3: `module.exports = { corePlugins: { preflight: false } }`.
3. **Compensate** with your own unlayered rule (unlayered wins):

```css
.header__menu a,
.mobile-menu a {
  color: var(--accent-color, #3e1c71);
}
```

Note that v3 *utilities* still work as expected, because unlayered utilities also beat the component.

### Accordion icons not showing up

Icons are rendered as inline SVG components. If you are upgrading from `v1.x` or `v2.0` and have the old ChevronIcon CDN `<script>` tag in your layout `<head>`, you can safely remove it.

### The header sits behind my other content

Adjust it with `--header-z-index` (globally, on a wrapper, or via `classNames.container="z-50"` — utilities win since there is no inline z-index):

```css
:root {
  /* default is 200; raise it further if your content stacks higher */
  --header-z-index: 300;
}
```

---

## Compatibility

- **Astro 7.x** (peer dependency), SSG, SSR, and CSS builds (no client framework required).
- **CSS cascade layers** require a modern browser: Chrome/Edge 99+, Firefox 97+, Safari 15.4+.
- Works with Tailwind v4 out of the box; Tailwind v3 works with the Preflight caveat above.

---

## License

MIT License.
