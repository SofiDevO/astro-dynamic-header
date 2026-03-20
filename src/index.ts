

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
 * Custom CSS class names for deep customization.
 */
export interface CustomClassNames {
  /** Class for the outermost fixed container */
  container?: string;
  /** Class for the main header element */
  header?: string;
  /** Class for the logo anchor tag */
  logo?: string;
  /** Class for the logo span text */
  logoText?: string;
  /** Class for the desktop navigation wrapper */
  nav?: string;
}

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
  /** Custom theme overrides. See @interface DualThemeConfig */
  theme?: DualThemeConfig;
  /** 
   * Custom CSS classes for injecting utility classes (e.g., Tailwind).
   * @example { header: "shadow-lg", logoText: "font-bold" }
   */
  classNames?: CustomClassNames;
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
