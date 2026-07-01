export { defaultThemes } from "./defaults.js";

/**
 * Represents a menu item in the navigation.
 */
export interface MenuItemType {
  /** The URL path for the link */
  link: string;
  /** The text label to display */
  text: string;
  /** Optional nested submenu items */
  submenu?: MenuItemType[];
}

/**
 * Represents a third-level menu item.
 */
export interface TertiaryMenuItem {
  /** The URL path for the link */
  link: string;
  /** The text label to display */
  text: string;
}

/**
 * Represents a second-level menu item with optional nested tertiary items.
 */
export interface SecondaryMenuItem {
  /** The URL path for the link */
  link: string;
  /** The text label to display */
  text: string;
  /** Optional nested tertiary menu items */
  submenu?: TertiaryMenuItem[];
}

/**
 * Represents a top-level menu item with optional nested secondary items.
 */
export interface MenuItem {
  /** The URL path for the link */
  link: string;
  /** The text label to display */
  text: string;
  /** Optional nested secondary menu items */
  submenu?: SecondaryMenuItem[];
}

/**
 * Configuration for the main navigation.
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
   * in the desktop navigation.
   * @example "hover:underline font-medium"
   */
  menu__link__class?: string;
}

/**
 * Individual theme settings for a specific state (light/dark).
 */
export interface ThemeConfig {
  /**
   * Main background color. Supports hex, rgb, rgba, etc.
   * @example "rgba(255, 255, 255, 0.9)"
   */
  backgroundColor?: string;
  /**
   * Solid background color for submenus and mobile panels to ensure readability.
   * @example "#ffffff"
   */
  backgroundColorOpaque?: string;
  /**
   * CSS backdrop-filter blur value.
   * @default "blur(20px)"
   */
  backdropBlur?: string;
  /**
   * CSS z-index for the header container.
   * @default 10
   */
  zIndex?: number;
  /**
   * Primary text color for navigation and logo.
   */
  textColor?: string;
  /**
   * Color for highlights, active states, underscores, and small borders.
   */
  accentColor?: string;
}

/**
 * Combined theme configuration for both light and dark modes.
 */
export interface DualThemeConfig {
  /** Settings applied when light mode is active. */
  light?: ThemeConfig;
  /** Settings applied when dark mode is active. */
  dark?: ThemeConfig;
}

/**
 * Custom CSS class names for high-level layout & appearance customization.
 *
 * These target the structural wrapper elements of the Header. For fine-grained
 * control over individual nav links or the logo internals, use the nested
 * `xxx__class` props inside the `navigation` or `logo` config objects instead.
 *
 * @example
 * ```astro
 * <Header classNames={{ header: "shadow-xl", container: "top-4 px-6" }} />
 * ```
 */
export interface HeaderClassNames {
  /** Outermost fixed `<div>` that positions the header on the page. */
  container?: string;
  /** Inner `<header>` element — best place for shadows, borders, transitions. */
  header?: string;
  /** Logo anchor `<a>` — add hover states or focus rings here. */
  logo?: string;
  /** Logo text `<span>` — override typography here. */
  logoText?: string;
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
 */
export interface HeaderProps {
  /**
   * Layout style.
   * - "floating": Centered with max-width and rounded corners.
   * - "fullscreen": Full width with no border radius.
   * @default "floating"
   */
  headerType?: "floating" | "fullscreen";
  /**
   * Theme behavior.
   * - "light": Force light mode.
   * - "dark": Force dark mode.
   * - "auto": Detects .dark class on the root element.
   * @default "auto"
   */
  preset?: "light" | "dark" | "auto";

  /** Navigation links and structure. */
  navigation?: NavConfig;
  /** Custom theme overrides. See {@link DualThemeConfig} */
  theme?: DualThemeConfig;
  /**
   * High-level CSS class overrides for structural wrapper elements.
   * For fine-grained nav/logo element classes, use the nested `xxx__class`
   * props inside `navigation` or `logo` instead.
   * @example { header: "shadow-lg", container: "top-4" }
   */
  classNames?: HeaderClassNames;
}

export interface NavMenuProps {
  type?: "floating" | "fullscreen";
  menuItems?: MenuItem[];
  showHomeLink?: boolean;
  homeText?: string;
  header__menu__class?: string;
  header__item__class?: string;
  menu__link__class?: string;
}

export interface MobileNavProps {
  type?: "floating" | "fullscreen";
  menuItems?: MenuItem[];
  showHomeLink?: boolean;
  homeText?: string;
  mobileNav__class?: string;
  accentColor?: string;
}

export interface HamburgerButtonProps {
  color?: string;
}

