/**
 * Represents a menu item in the navigation (top level).
 */
export interface MenuItemType {
  /** The URL path for the link. */
  link: string;
  /** The text label to display. */
  text: string;
  /** Optional nested submenu items. */
  submenu?: MenuItemType[];
}

/**
 * Represents a third-level menu item.
 */
export interface TertiaryMenuItem {
  /** The URL path for the link. */
  link: string;
  /** The text label to display. */
  text: string;
}

/**
 * Represents a second-level menu item with optional nested tertiary items.
 */
export interface SecondaryMenuItem {
  /** The URL path for the link. */
  link: string;
  /** The text label to display. */
  text: string;
  /** Optional nested tertiary menu items. */
  submenu?: TertiaryMenuItem[];
}

/**
 * Represents a top-level menu item with optional nested secondary items.
 *
 * @example
 * ```ts
 * const item: MenuItem = {
 *   link: "/services",
 *   text: "Services",
 *   submenu: [
 *     { link: "/design", text: "Design", submenu: [{ link: "/ux", text: "UX" }] },
 *   ],
 * };
 * ```
 */
export interface MenuItem {
  /** The URL path for the link. */
  link: string;
  /** The text label to display. */
  text: string;
  /** Optional nested secondary menu items. */
  submenu?: SecondaryMenuItem[];
}

/**
 * Configuration for the main navigation.
 *
 * @example
 * ```astro
 * <Header
 *   navigation={{
 *     homeUrl: "/",
 *     menuItems: [{ link: "/about", text: "About" }],
 *     menu__link__class: "hover:underline hover:text-purple-400",
 *   }}
 * />
 * ```
 */
export interface NavConfig {
  /**
   * The URL for the home link.
   * @default "/"
   */
  homeUrl?: string;
  /**
   * Array of top-level menu items.
   * @example [{ link: "/about", text: "About Us" }]
   */
  menuItems?: MenuItem[];
  /**
   * Fine-grained class override for the desktop `<nav>` element.
   * Use this when you want the class to live alongside the rest of the
   * navigation configuration rather than in the top-level `classNames` prop.
   * @example "flex gap-4"
   */
  header__menu__class?: string;
  /**
   * Fine-grained class override applied to every top-level `<li>` item
   * in the desktop navigation.
   * @example "px-2 py-1"
   */
  header__item__class?: string;
  /**
   * Fine-grained class override applied to every top-level `<a>` link
   * in the desktop navigation. This is the place for hover styles: the
   * classes live in `@layer utilities`, so they beat the component's
   * default link styles without `!important`.
   * @example "hover:underline font-medium"
   * @example Plain CSS equivalent:
   * ```css
   * @layer utilities {
   *   #header-menu a:hover { color: var(--d-accent, #00ffff); }
   * }
   * ```
   */
  menu__link__class?: string;
}

/**
 * Custom CSS class names for high-level layout & appearance customization.
 *
 * These target the structural wrapper elements of the Header. For fine-grained
 * control over the nav items use the `xxx__class` props inside `navigation`,
 * and style the logo directly on the markup you pass to the `logo` slot.
 *
 * The component styles live in `@layer components`, so any class passed here
 * (Tailwind utilities included) wins over the built-in styles — no
 * `!important` and no `twMerge()` required.
 *
 * @example
 * ```astro
 * <Header classNames={{ header: "shadow-xl", container: "top-4 px-6" }} />
 * ```
 *
 * @example Tailwind hover states work out of the box:
 * ```astro
 * <Header classNames={{ header: "hover:shadow-2xl transition-shadow" }} />
 * ```
 *
 * @example With plain CSS, define your class in `@layer utilities` (hover
 * included) so it beats the component:
 * ```astro
 * <Header classNames={{ header: "custom-header-bg" }} />
 * <style is:inline>
 *   @layer utilities {
 *     .custom-header-bg { background-color: red; }
 *     .custom-header-bg:hover { background-color: darkred; }
 *   }
 * </style>
 * ```
 */
export interface HeaderClassNames {
  /** Outermost fixed `<div>` that positions the header on the page. */
  container?: string;
  /** Inner `<header>` element — best place for shadows, borders, transitions. */
  header?: string;
  /** Desktop nav wrapper `<div>` — adjust spacing between logo and menu. */
  nav?: string;
  /** Mobile nav panel `<nav>` — add slide-in overrides or z-index tweaks. */
  mobileNav?: string;
}

/**
 * @deprecated Use {@link HeaderClassNames} instead.
 * Kept as an alias for backwards compatibility.
 */
export type CustomClassNames = HeaderClassNames;

/**
 * Main properties for the Header component.
 *
 * Colors, blur, and z-index are plain CSS variables — see the README
 * "CSS variable reference". There is no `theme` prop (removed in v5).
 */
export interface HeaderProps {
  /**
   * Layout style.
   * - "floating": Centered with max-width and rounded corners.
   * - "fullscreen": Full width with no border radius.
   * @default "floating"
   * @example
   * ```astro
   * <Header headerType="fullscreen" />
   * ```
   */
  headerType?: "floating" | "fullscreen";
  /**
   * Theme behavior.
   * - "light": Force light mode.
   * - "dark": Force dark mode.
   * - "auto": Detects .dark class on the root element.
   * @default "auto"
   * @example
   * ```astro
   * <Header preset="dark" />
   * ```
   */
  preset?: "light" | "dark" | "auto";

  /**
   * Navigation links and structure.
   * @example
   * ```astro
   * <Header navigation={{ menuItems: [{ link: "/about", text: "About" }] }} />
   * ```
   */
  navigation?: NavConfig;
  /**
   * High-level CSS class overrides for structural wrapper elements.
   * For fine-grained nav/logo element classes, use the nested `xxx__class`
   * props inside `navigation` or `logo` instead.
   * @example
   * ```astro
   * <Header classNames={{ header: "shadow-lg bg-red-500", container: "top-4" }} />
   * ```
   */
  classNames?: HeaderClassNames;
}

/**
 * Properties for the standalone {@link '/NavMenu'} desktop navigation
 * component (the Header renders it internally).
 */
export interface NavMenuProps {
  /** Layout variant, matches `HeaderProps.headerType`. */
  type?: "floating" | "fullscreen";
  /** Top-level menu items with nested submenus. */
  menuItems?: MenuItem[];
  /** Whether to render the home link (hidden automatically on `/`). */
  showHomeLink?: boolean;
  /** Label for the home link. */
  homeText?: string;
  /** Class override for the desktop `<nav>` element. */
  header__menu__class?: string;
  /** Class override for every top-level `<li>`. */
  header__item__class?: string;
  /** Class override for every top-level `<a>` — hover styles live here. */
  menu__link__class?: string;
}

/**
 * Properties for the standalone {@link '/MobileNav'} slide-in panel
 * (the Header renders it internally).
 */
export interface MobileNavProps {
  /** Layout variant, matches `HeaderProps.headerType`. */
  type?: "floating" | "fullscreen";
  /** Top-level menu items with nested submenus. */
  menuItems?: MenuItem[];
  /** Whether to render the home link (hidden automatically on `/`). */
  showHomeLink?: boolean;
  /** Label for the home link. */
  homeText?: string;
  /** Class override for the mobile panel `<nav>`. */
  mobileNav__class?: string;
  /** Accent color used by the panel's active states and icons. */
  accentColor?: string;
}

/**
 * Properties for the standalone {@link '/HamburgerButton'} (the Header
 * renders it internally on mobile viewports).
 */
export interface HamburgerButtonProps {
  /** Text/stroke color; defaults to the current text color. */
  color?: string;
}
