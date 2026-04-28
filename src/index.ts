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
 * Configuration for the site logo.
 */
export interface LogoConfig {
  /**
   * The URL of the logo image.
   * @example "/assets/logo.png"
   * @default "/logo.png"
   */
  src?: string;
  /** Alternative text for the logo image */
  alt?: string;
  /**
   * CSS width for the logo.
   * @example "150px" or "4rem"
   * @default "55px"
   */
  width?: string;
  /**
   * Optional text to display next to the logo image.
   * @example "My Awesome Site"
   */
  text?: string;
  /**
   * CSS font-size for the logo text.
   * @default "1em"
   */
  textSize?: string;
  /**
   * CSS color for the logo text.
   * If not provided, it will inherit from the theme's text color.
   * @default "inherit"
   */
  textColor?: string;
  /**
   * Fine-grained class override for the logo anchor (`<a>`) element.
   * Use this instead of `classNames.logo` when you want the class to live
   * alongside the rest of the logo configuration.
   * @example "ring-2 ring-offset-2"
   */
  logo__container__class?: string;
  /**
   * Fine-grained class override for the logo text `<span>` element.
   * Use this instead of `classNames.logoText` when you want the class to live
   * alongside the rest of the logo configuration.
   * @example "font-black italic"
   */
  logo__text__class?: string;
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
  /** Logo configuration object. */
  logo?: LogoConfig;
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
  menuItems?: MenuItemType[];
  showHomeLink?: boolean;
  homeText?: string;
}

export interface MobileNavProps {
  menuItems?: MenuItemType[];
  showHomeLink?: boolean;
  homeText?: string;
  accentColor?: string;
}

export interface HamburgerButtonProps {
  color?: string;
}
