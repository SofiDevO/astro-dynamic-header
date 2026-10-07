import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  adjustSubsubmenuPositionOnResize,
  handleSubsubmenuInteraction,
  initNavMenu,
} from '../src/scripts/nav-menu';

const originalReadyState = document.readyState;
const originalInnerWidth = window.innerWidth;

interface Rect {
  right: number;
  left: number;
}

function setReadyState(state: DocumentReadyState): void {
  Object.defineProperty(document, 'readyState', {
    value: state,
    configurable: true,
    writable: true,
  });
}

function setViewport(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
}

/** Replaces the (always-zero in jsdom) rect with a controllable one. */
function stubRect(el: HTMLElement, initial: Rect): { rect: Rect } {
  const state = { rect: initial };
  el.getBoundingClientRect = () => {
    const { right, left } = state.rect;
    return {
      right,
      left,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: left,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;
  };
  return state;
}

function createPanel(rect: Rect): { panel: HTMLElement; rectState: { rect: Rect } } {
  const panel = document.createElement('ul');
  panel.className = 'subsubmenu';
  const rectState = stubRect(panel, rect);
  return { panel, rectState };
}

function mountNavDom(rect: Rect = { right: 700, left: 500 }) {
  document.body.innerHTML = `
    <nav id="header-menu">
      <ul class="menu">
        <li class="menu__item">
          <a class="menu__link">Services</a>
          <ul class="submenu">
            <li class="submenu__item submenu__item--secondary">
              <a class="menu__link">Design</a>
            </li>
            <li class="submenu__item submenu__item--secondary">
              <a class="menu__link">No panel</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>`;

  const parents = Array.from(
    document.querySelectorAll<HTMLElement>('.submenu__item--secondary'),
  );
  const { panel, rectState } = createPanel(rect);
  parents[0].append(panel);

  return { parents, panel, rectState };
}

describe('nav menu: adjustSubsubmenuPositionOnResize', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setViewport(800);
  });

  afterEach(() => {
    setReadyState(originalReadyState);
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true,
      writable: true,
    });
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('flips the panel to the left when it overflows the right edge', () => {
    const { panel, rectState } = mountNavDom();
    rectState.rect = { right: 900, left: 700 };

    adjustSubsubmenuPositionOnResize(document, window);

    expect(panel.style.right).toBe('100%');
    expect(panel.style.left).toMatch(/^0px?$/);
  });

  it('keeps the panel on the right when it fits', () => {
    const { panel } = mountNavDom({ right: 700, left: 500 });

    adjustSubsubmenuPositionOnResize(document, window);

    expect(panel.style.left).toBe('100%');
    expect(panel.style.right).toMatch(/^0px?$/);
  });

  it('adjusts every panel on the page independently', () => {
    const { panel: overflowing } = mountNavDom();
    const rectState = stubRect(overflowing, { right: 900, left: 700 });

    const secondParent = document.createElement('li');
    secondParent.className = 'submenu__item submenu__item--secondary';
    const { panel: fitting } = createPanel({ right: 700, left: 500 });
    secondParent.append(fitting);
    document.querySelector('.submenu')!.append(secondParent);

    adjustSubsubmenuPositionOnResize(document, window);

    expect(rectState.rect.right).toBe(900);
    expect(overflowing.style.right).toBe('100%');
    expect(fitting.style.left).toBe('100%');
    expect(fitting.style.right).toMatch(/^0px?$/);
  });
});

describe('nav menu: handleSubsubmenuInteraction', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setViewport(800);
  });

  afterEach(() => {
    setReadyState(originalReadyState);
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true,
      writable: true,
    });
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('reveals the panel on hover when it fits', () => {
    const { parents, panel } = mountNavDom({ right: 700, left: 500 });
    handleSubsubmenuInteraction(document);

    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.opacity).toBe('1');
    expect(panel.style.pointerEvents).toBe('all');
    expect(panel.style.left).toBe('100%');
    expect(panel.style.transform).toContain('translateX(32px)');
  });

  it('flips the panel to the left when it overflows the viewport', () => {
    const { parents, panel, rectState } = mountNavDom();
    rectState.rect = { right: 900, left: 700 };
    handleSubsubmenuInteraction(document);

    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.left).toBe('-100%');
    expect(panel.style.right).toBe('auto');
    expect(panel.style.transform).toContain('translateX(-32px)');
  });

  it('clamps with a translateX offset when it overflows both edges', () => {
    const { parents, panel, rectState } = mountNavDom();
    const secondMeasure: Rect = { right: 900, left: -50 };
    let calls = 0;
    const first: Rect = { right: 900, left: 700 };
    rectState.rect = first;
    panel.getBoundingClientRect = () => {
      const rect = calls++ === 0 ? first : secondMeasure;
      return {
        ...rect,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: rect.left,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    };

    handleSubsubmenuInteraction(document);
    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.left).toBe('100%');
    expect(panel.style.transform).toBe('translateX(calc(-130px + 32px))');
  });

  it('restores display and visibility after measuring', () => {
    const { parents, panel } = mountNavDom();
    handleSubsubmenuInteraction(document);

    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.display).toBe('');
    expect(panel.style.visibility).toBe('');
  });

  it('hides the panel again on mouseleave', () => {
    const { parents, panel } = mountNavDom();
    handleSubsubmenuInteraction(document);

    parents[0].dispatchEvent(new MouseEvent('mouseenter'));
    parents[0].dispatchEvent(new MouseEvent('mouseleave'));

    expect(panel.style.opacity).toBe('');
    expect(panel.style.pointerEvents).toBe('');
    expect(panel.style.transform).toBe('');
  });

  it('leaves items without a panel untouched', () => {
    const { parents } = mountNavDom();
    const addListener = vi.spyOn(parents[1], 'addEventListener');

    handleSubsubmenuInteraction(document);

    expect(addListener).not.toHaveBeenCalled();
    expect(() =>
      parents[1].dispatchEvent(new MouseEvent('mouseenter')),
    ).not.toThrow();
  });
});

describe('nav menu: initNavMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setViewport(800);
  });

  afterEach(() => {
    setReadyState(originalReadyState);
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true,
      writable: true,
    });
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('repositions the panels on window resize', () => {
    const { panel, rectState } = mountNavDom();
    rectState.rect = { right: 900, left: 700 };
    const addListener = vi.spyOn(window, 'addEventListener');

    initNavMenu(document, window);

    expect(addListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(panel.style.right).toBe('100%');

    rectState.rect = { right: 700, left: 500 };
    window.dispatchEvent(new Event('resize'));

    expect(panel.style.left).toBe('100%');
    expect(panel.style.right).toMatch(/^0px?$/);
  });

  it('wires hover interactions as soon as the DOM is ready', () => {
    setReadyState('complete');
    const { parents, panel } = mountNavDom();

    initNavMenu(document, window);
    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.opacity).toBe('1');
  });

  it('defers interactions until DOMContentLoaded while still loading', () => {
    setReadyState('loading');
    const { parents, panel } = mountNavDom();

    initNavMenu(document, window);
    expect(panel.style.left).toBe('');

    document.dispatchEvent(new Event('DOMContentLoaded'));
    parents[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(panel.style.opacity).toBe('1');
    expect(panel.style.left).toBe('100%');
  });
});
