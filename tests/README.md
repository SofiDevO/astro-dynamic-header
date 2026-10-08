# Tests

Run with:

```sh
pnpm test              # both projects
pnpm exec vitest run --project dom      # script logic (jsdom)
pnpm exec vitest run --project astro    # rendering + built CSS (node)
pnpm test:coverage
```

## `dom` project (jsdom)

Exercises the vanilla behaviour scripts that the components import:

- `tests/Header.test.ts` → `src/scripts/hamburger.ts` (toggle/close, missing
  elements, `DOMContentLoaded` deferral).
- `tests/NavMenu.test.ts` → `src/scripts/nav-menu.ts` (subsubmenu positioning,
  hover show/hide, resize repositioning, `DOMContentLoaded` deferral).
- `tests/layer-diagnostics.test.ts` → `src/scripts/layer-diagnostics.ts`
  (layer creation order from statements/blocks/`@media`, wrong-order and
  missing-layer detection, fix messages).

These tests mount real DOM and dispatch real events — they import the shipped
modules instead of re-implementing their logic.

## `astro` project (node)

- `tests/render.test.ts` → renders `src/Header.astro` with Astro's Container
  API (`astro/container`) and asserts the markup: `classNames` plumbing,
  layout variants, force-theme classes, absence of inline styles, the v5
  `theme`-prop migration warning, navigation items and fine-grained
  `xxx__class` overrides.
- `tests/css-layers.test.ts` → runs a real `astro build` and asserts the
  published CSS contract: layer order statement, library rules inside
  `@layer components`, consumer `.demo-pill` override inside
  `@layer utilities`, zero `!important`, the `--header-z-index` CSS variable
  on the container, and the `classNames` value present in the built markup.

## Notes

- `vitest.config.ts` loads Astro's Vite plugin via `getViteConfig()` so
  `.astro` files compile inside Vitest. Astro's plugin only compiles them in
  Vite's `ssr` environment, which Vitest exposes for the `node` test
  environment — that is why the rendering tests run in their own project.
- The `astro` project writes to `dist/` (it builds the demo). Don't run other
  builds concurrently.
