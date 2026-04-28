import type { DualThemeConfig } from "./index.js";

/**
 * Built-in default theme tokens used by the Header component.
 * These are merged with any user-supplied `theme` overrides.
 *
 * You can import this object if you want to build on top of the defaults
 * rather than replacing them wholesale:
 *
 * @example
 * ```ts
 * import { defaultThemes } from '@sofidevo/astro-dynamic-header/defaults';
 * const theme = {
 *   light: { ...defaultThemes.light, accentColor: "#e11d48" },
 *   dark:  { ...defaultThemes.dark,  accentColor: "#f43f5e" },
 * };
 * ```
 */
export const defaultThemes: Required<DualThemeConfig> = {
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backgroundColorOpaque: "rgb(255, 255, 255)",
    backdropBlur: "blur(20px)",
    zIndex: 10,
    textColor: "#1a1a1a",
    accentColor: "#3e1c71",
  },
  dark: {
    backgroundColor: "#0d0d0dcc",
    backgroundColorOpaque: "#0d0d0d",
    backdropBlur: "blur(20px)",
    zIndex: 10,
    textColor: "#ffffff",
    accentColor: "#00ffff",
  },
};
