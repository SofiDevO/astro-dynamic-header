import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const astroPkgPath = require.resolve('astro/package.json');
const astroPkg = JSON.parse(readFileSync(astroPkgPath, 'utf8')) as {
  bin: Record<string, string>;
};
const astroBin = path.resolve(path.dirname(astroPkgPath), astroPkg.bin.astro);

/**
 * One distinctive scoped selector per library component. The demo page's own
 * components (Hero/Features/Install/Footer) are intentionally unlayered, so
 * assertions target the published component styles only.
 */
const libraryMarkers = [
  '.header[data-astro-cid-', // Header
  '.header__container[data-astro-cid-', // Header
  '.header__menu[data-astro-cid-', // NavMenu
  '.submenu[data-astro-cid-', // NavMenu
  '.mobile-header__menu[data-astro-cid-', // MobileNav
  '.hamburger[data-astro-cid-', // HamburgerButton
  '.hlhawq', // ChevronIcon (is:inline)
  '.gutruu', // SunIcon (is:inline)
];

let html = '';
let css = '';

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function collectCss(): string {
  const inlineStyles = Array.from(
    html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g),
    (match) => match[1],
  );

  const cssDir = path.join(root, 'dist', '_astro');
  const bundledStyles = existsSync(cssDir)
    ? readdirSync(cssDir)
        .filter((file) => file.endsWith('.css'))
        .map((file) => readFileSync(path.join(cssDir, file), 'utf8'))
    : [];

  return [...inlineStyles, ...bundledStyles].join('\n');
}

function layerRanges(
  source: string,
  layerName: string,
): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  const pattern = new RegExp(`@layer\\s+${layerName}\\s*\\{`, 'g');
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    let depth = 1;
    let index = pattern.lastIndex;
    while (index < source.length && depth > 0) {
      const char = source[index];
      if (char === '{') depth += 1;
      if (char === '}') depth -= 1;
      index += 1;
    }
    ranges.push({ start: match.index, end: index });
  }

  return ranges;
}

function indicesOf(source: string, needle: string): number[] {
  const positions: number[] = [];
  let from = source.indexOf(needle);
  while (from !== -1) {
    positions.push(from);
    from = source.indexOf(needle, from + needle.length);
  }
  return positions;
}

function isInsideLayer(
  ranges: Array<{ start: number; end: number }>,
  position: number,
): boolean {
  return ranges.some(
    (range) => position >= range.start && position <= range.end,
  );
}

describe('built CSS cascade layers', () => {
  beforeAll(() => {
    execFileSync(process.execPath, [astroBin, 'build'], {
      cwd: root,
      stdio: 'pipe',
    });
    html = readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
    css = stripComments(collectCss());
  }, 120_000);

  it('declares the layer order before any layer is used', () => {
    const statement = css.match(
      /@layer\s+theme\s*,\s*base\s*,\s*components\s*,\s*utilities\s*;/,
    );
    expect(statement).not.toBeNull();

    const statementIndex = css.indexOf(statement![0]);
    const firstComponents = css.indexOf('@layer components');
    expect(statementIndex).toBeGreaterThanOrEqual(0);
    expect(firstComponents).toBeGreaterThan(statementIndex);
  });

  it('keeps the library rules inside @layer components', () => {
    const components = layerRanges(css, 'components');
    expect(components.length).toBeGreaterThan(0);

    libraryMarkers.forEach((marker) => {
      const positions = indicesOf(css, marker);
      expect(
        positions.length,
        `expected built rules for ${marker}`,
      ).toBeGreaterThan(0);

      positions.forEach((position) => {
        expect(
          isInsideLayer(components, position),
          `${marker} at offset ${position} must live in @layer components`,
        ).toBe(true);
      });
    });
  });

  it('never falls back to !important', () => {
    expect(css).not.toMatch(/!\s*important/);
  });

  it('ships the consumer override utilities inside @layer utilities', () => {
    const utilities = layerRanges(css, 'utilities');
    const demoPositions = indicesOf(css, '.demo-pill');
    expect(demoPositions.length).toBeGreaterThan(0);

    demoPositions.forEach((position) => {
      expect(
        isInsideLayer(utilities, position),
        `.demo-pill at offset ${position} must live in @layer utilities`,
      ).toBe(true);
    });
  });

  it('applies the classNames prop in the built markup', () => {
    expect(html).toMatch(/<header class="header header--floating demo-pill"/);
  });
});
