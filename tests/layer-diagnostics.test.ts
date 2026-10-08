import { describe, it, expect, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  collectLayerOrder,
  findLayerProblem,
  formatProblemMessage,
  LAYER_ORDER_STATEMENT,
} from '../src/scripts/layer-diagnostics.js';

type FakeRule = { cssText: string; cssRules?: FakeRule[] };
type FakeDoc = { styleSheets: Array<{ cssRules: FakeRule[] }>; querySelector: (selector: string) => unknown };

function docWithStyles(styles: string[], body = ''): Document {
  const html = `<!doctype html><html><head>${styles
    .map((css) => `<style>${css}</style>`)
    .join('')}</head><body>${body}</body></html>`;
  return new JSDOM(html).window.document;
}

function fakeDoc(rules: FakeRule[], headerRendered = true): Document {
  const doc = {
    styleSheets: [{ cssRules: rules }],
    querySelector: (selector: string) =>
      selector === '.header__container' && headerRendered ? {} : null,
  } as unknown as FakeDoc;
  return doc as unknown as Document;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('collectLayerOrder', () => {
  it('returns layer names in first-appearance (creation) order', () => {
    const doc = docWithStyles([
      '@layer utilities { .a { color: red; } }',
      '@layer components { .b { color: blue; } }',
      '@layer components { .c { color: green; } }',
    ]);

    expect(collectLayerOrder(doc)).toEqual(['utilities', 'components']);
  });

  it('expands order statements before any layer usage', () => {
    const doc = fakeDoc([
      { cssText: LAYER_ORDER_STATEMENT },
      { cssText: '@layer components { .a { color: red; } }' },
    ]);

    expect(collectLayerOrder(doc)).toEqual([
      'theme',
      'base',
      'components',
      'utilities',
    ]);
  });

  it('descends into wrapped rules such as @media', () => {
    const doc = docWithStyles([
      '@media (min-width: 10px) { @layer utilities { .a { color: red; } } }',
      '@layer components { .b { color: blue; } }',
    ]);

    expect(collectLayerOrder(doc)).toEqual(['utilities', 'components']);
  });

  it('skips unreadable (cross-origin) stylesheets', () => {
    const doc = {
      styleSheets: [
        {
          get cssRules(): CSSRuleList {
            throw new Error('SecurityError');
          },
        },
      ],
      querySelector: () => null,
    } as unknown as Document;

    expect(collectLayerOrder(doc)).toEqual([]);
  });
});

describe('findLayerProblem', () => {
  it('returns null for the healthy order components < utilities', () => {
    const doc = docWithStyles(
      [
        '@layer components { .a { color: red; } }',
        '@layer utilities { .b { color: blue; } }',
      ],
      '<div class="header__container"></div>',
    );

    expect(findLayerProblem(doc)).toBeNull();
  });

  it('detects a consumer-created utilities layer above components', () => {
    const doc = docWithStyles(
      [
        '@layer utilities { .custom-header-bg { background: red; } }',
        '@layer components { .header { background: white; } }',
      ],
      '<div class="header__container"></div>',
    );

    expect(findLayerProblem(doc)).toEqual({
      kind: 'wrong-order',
      utilitiesIndex: 0,
      componentsIndex: 1,
    });
  });

  it('detects missing component layers (old v3 install)', () => {
    const doc = docWithStyles([], '<div class="header__container"></div>');

    expect(findLayerProblem(doc)).toEqual({
      kind: 'missing-components-layer',
    });
  });

  it('ignores a missing components layer when the header is not rendered', () => {
    const doc = docWithStyles([]);

    expect(findLayerProblem(doc)).toBeNull();
  });
});

describe('formatProblemMessage', () => {
  it('explains the version check for missing component layers', () => {
    const message = formatProblemMessage({ kind: 'missing-components-layer' });

    expect(message).toContain('v3.x');
    expect(message).toContain('npm ls @sofidevo/astro-dynamic-header');
  });

  it('explains the statement fix for wrong layer order', () => {
    const message = formatProblemMessage({
      kind: 'wrong-order',
      utilitiesIndex: 0,
      componentsIndex: 1,
    });

    expect(message).toContain(LAYER_ORDER_STATEMENT);
    expect(message).toContain('first line of your global CSS');
  });
});
