

// Types
export interface MenuItemType {
  link: string;
  text: string;
  submenu?: MenuItemType[];
}

export interface TertiaryMenuItem {
  link: string;
  text: string;
}

export interface SecondaryMenuItem {
  link: string;
  text: string;
  submenu?: TertiaryMenuItem[];
}

export interface MenuItem {
  link: string;
  text: string;
  submenu?: SecondaryMenuItem[];
}

export interface LogoConfig {
  src?: string;
  alt?: string;
  width?: string;
  text?: string;
  textSize?: string;
  textColor?: string;
}

export interface NavConfig {
  homeUrl?: string;
  menuItems?: MenuItem[];
}

export interface ThemeConfig {
  backgroundColor?: string;
  backgroundColorOpaque?: string;
  backdropBlur?: string;
  zIndex?: number;
  textColor?: string;
  accentColor?: string;
}

export interface DualThemeConfig {
  light?: ThemeConfig;
  dark?: ThemeConfig;
}

export interface CustomClassNames {
  container?: string;
  header?: string;
  logo?: string;
  logoText?: string;
  nav?: string;
}

export interface HeaderProps {
  headerType?: "floating" | "fullscreen";
  preset?: "light" | "dark" | "auto";
  logo?: LogoConfig;
  navigation?: NavConfig;
  theme?: DualThemeConfig;
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
