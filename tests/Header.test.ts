import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HamburgerController, initHamburger } from '../src/scripts/hamburger';

const originalReadyState = document.readyState;

function mountHeaderDom() {
  document.body.innerHTML = `
    <button id="hamburger-btn" aria-label="Menu"></button>
    <nav id="mobile-header-menu">
      <a class="mobile-menu__link">One</a>
      <a class="mobile-menu__link">Two</a>
    </nav>`;

  return {
    btn: document.getElementById('hamburger-btn') as HTMLButtonElement,
    menu: document.getElementById('mobile-header-menu') as HTMLElement,
    links: Array.from(
      document.querySelectorAll<HTMLElement>('.mobile-menu__link'),
    ),
  };
}

function setReadyState(state: DocumentReadyState): void {
  Object.defineProperty(document, 'readyState', {
    value: state,
    configurable: true,
    writable: true,
  });
}

describe('hamburger: HamburgerController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    setReadyState(originalReadyState);
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('toggles the active state on button and panel when clicked', () => {
    const { btn, menu } = mountHeaderDom();
    new HamburgerController(document);

    btn.click();
    expect(btn.classList.contains('is-active')).toBe(true);
    expect(menu.classList.contains('is-active')).toBe(true);

    btn.click();
    expect(btn.classList.contains('is-active')).toBe(false);
    expect(menu.classList.contains('is-active')).toBe(false);
  });

  it('closes the panel when any mobile link is clicked', () => {
    const { btn, menu, links } = mountHeaderDom();
    new HamburgerController(document);

    btn.click();
    expect(menu.classList.contains('is-active')).toBe(true);

    links[1].click();
    expect(btn.classList.contains('is-active')).toBe(false);
    expect(menu.classList.contains('is-active')).toBe(false);
  });

  it('wires every mobile link, not just the first one', () => {
    const { btn, menu, links } = mountHeaderDom();
    const spies = links.map((link) => vi.spyOn(link, 'addEventListener'));

    new HamburgerController(document);

    expect(spies[0]).toHaveBeenCalledWith('click', expect.any(Function));
    expect(spies[1]).toHaveBeenCalledWith('click', expect.any(Function));
    expect(btn).toBeTruthy();
    expect(menu).toBeTruthy();
  });

  it('does not throw when the header elements are missing', () => {
    expect(() => new HamburgerController(document)).not.toThrow();
    expect(document.getElementById('hamburger-btn')).toBeNull();
    expect(document.getElementById('mobile-header-menu')).toBeNull();
  });
});

describe('hamburger: initHamburger', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    setReadyState(originalReadyState);
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('wires the hamburger immediately when the DOM is ready', () => {
    setReadyState('complete');
    const { btn } = mountHeaderDom();

    const controller = initHamburger(document);

    expect(controller).toBeInstanceOf(HamburgerController);
    btn.click();
    expect(btn.classList.contains('is-active')).toBe(true);
  });

  it('defers wiring until DOMContentLoaded while still loading', () => {
    setReadyState('loading');
    const { btn, menu } = mountHeaderDom();

    const controller = initHamburger(document);
    expect(controller).toBeNull();

    btn.click();
    expect(btn.classList.contains('is-active')).toBe(false);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    btn.click();
    expect(btn.classList.contains('is-active')).toBe(true);
    expect(menu.classList.contains('is-active')).toBe(true);
  });
});
