import { describe, it, expect, beforeAll, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import Header from '../src/Header.astro';

type Container = Awaited<ReturnType<typeof AstroContainer.create>>;

let container: Container;

beforeAll(async () => {
  container = await AstroContainer.create();
});

async function render(
  props: Record<string, unknown> = {},
  url = 'http://localhost/',
) {
  const html = await container.renderToString(
    Header as Parameters<Container['renderToString']>[0],
    { props, request: new Request(url) },
  );
  return { html, doc: new JSDOM(html).window.document };
}

describe('Header (Container API)', () => {
  it('applies classNames to every structural element', async () => {
    const { doc } = await render({
      classNames: {
        container: 'u-container',
        header: 'u-header',
        nav: 'u-nav',
        mobileNav: 'u-mobile',
      },
    });

    expect(
      doc.querySelector('.header__container')?.classList.contains('u-container'),
    ).toBe(true);
    expect(
      doc.querySelector('header.header')?.classList.contains('u-header'),
    ).toBe(true);
    expect(
      doc.querySelector('.nav-menu-wrapper')?.classList.contains('u-nav'),
    ).toBe(true);
    expect(
      doc
        .querySelector('#mobile-header-menu')
        ?.classList.contains('u-mobile'),
    ).toBe(true);
  });

  it('defaults to the floating layout and renders no inline styles', async () => {
    const { doc } = await render();

    const header = doc.querySelector('header.header')!;
    expect(header.classList.contains('header--floating')).toBe(true);
    expect(header.classList.contains('header--force-dark')).toBe(false);
    expect(header.classList.contains('header--force-light')).toBe(false);
    expect(header.getAttribute('style')).toBeNull();

    const containerEl = doc.querySelector('.header__container')!;
    expect(containerEl.classList.contains('header__container--floating')).toBe(
      true,
    );
    expect(containerEl.getAttribute('style')).toBeNull();
  });

  it('renders the fullscreen variant without the floating classes', async () => {
    const { doc } = await render({ headerType: 'fullscreen' });

    const header = doc.querySelector('header.header')!;
    expect(header.classList.contains('header--fullscreen')).toBe(true);
    expect(header.classList.contains('header--floating')).toBe(false);
    expect(
      doc
        .querySelector('.header__container')
        ?.classList.contains('header__container--fullscreen'),
    ).toBe(true);
  });

  it('forces the theme class for light and dark presets', async () => {
    const dark = (await render({ preset: 'dark' })).doc.querySelector(
      'header.header',
    )!;
    expect(dark.classList.contains('header--force-dark')).toBe(true);
    expect(dark.classList.contains('header--force-light')).toBe(false);

    const light = (await render({ preset: 'light' })).doc.querySelector(
      'header.header',
    )!;
    expect(light.classList.contains('header--force-light')).toBe(true);
    expect(light.classList.contains('header--force-dark')).toBe(false);
  });

  it('warns in dev and ignores the removed theme prop (v5 migration)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { doc } = await render({
      theme: {
        light: { backgroundColor: '#123456', zIndex: 42 },
        dark: { backgroundColor: '#000000' },
      },
    });

    const warnings = warn.mock.calls.flat().join('\n');
    expect(warnings).toContain("'theme' prop was removed in v5");
    expect(warnings).toContain('--header-z-index');
    warn.mockRestore();

    expect(doc.querySelector('header.header')!.getAttribute('style')).toBeNull();
    expect(
      doc.querySelector('.header__container')!.getAttribute('style'),
    ).toBeNull();
  });

  it('renders navigation items with their fine-grained classes', async () => {
    const { doc } = await render({
      navigation: {
        menuItems: [
          { link: '/about', text: 'About' },
          {
            link: '/services',
            text: 'Services',
            submenu: [{ link: '/design', text: 'Design' }],
          },
        ],
        header__menu__class: 'nav-menu-x',
        header__item__class: 'nav-item-x',
        menu__link__class: 'nav-link-x',
      },
    });

    expect(doc.querySelector('#header-menu')?.classList.contains('nav-menu-x')).toBe(
      true,
    );
    expect(
      doc
        .querySelector('#header-menu .menu__item')
        ?.classList.contains('nav-item-x'),
    ).toBe(true);
    expect(
      doc
        .querySelector('#header-menu a[href="/about"]')
        ?.classList.contains('nav-link-x'),
    ).toBe(true);
    expect(doc.body.textContent).toContain('About');
    expect(doc.body.textContent).toContain('Design');
  });

  it('hides the home link on the home path and shows it elsewhere', async () => {
    const navigation = { menuItems: [{ link: '/about', text: 'About' }] };

    const onHome = (await render({ navigation }, 'http://localhost/')).doc;
    expect(onHome.querySelector('#header-menu a[href="/"]')).toBeNull();

    const onAbout = (await render({ navigation }, 'http://localhost/about')).doc;
    expect(onAbout.querySelector('#header-menu a[href="/"]')).not.toBeNull();
  });
});
