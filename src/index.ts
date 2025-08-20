

// Types
export interface MenuItemType {
  link: string;
  text: string;
  submenu?: MenuItemType[];
}

export interface HeaderProps {
  headerType?: "floating" | "fullscreen";
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: string;
  homeUrl?: string;
  menuItems?: MenuItemType[];
  backgroundColor?: string;
  backdropBlur?: string;
  zIndex?: number;
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
