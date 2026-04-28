# @sofidevo/astro-dynamic-header

A dynamic, responsive header component for Astro projects that can switch between floating and fullscreen styles with multi-level dropdown navigation support.

> [!WARNING]
> **Breaking Changes — v2.0+**: The `logo` and `navigation` props were restructured from strings/arrays to configuration objects. See the [Component Props](#component-props) and [Comprehensive Example](#comprehensive-example) to migrate.

> [!NOTE]
> **What's new — v2.1**: `CustomClassNames` has been renamed `HeaderClassNames` (the old name still works as an alias). New nested class props added to `LogoConfig` and `NavConfig`. New `mobileNav` slot in `HeaderClassNames`. `defaultThemes` is now exported for use outside the component. See the [Changelog](#changelog) section below.

## Features

- **Dynamic Styles**: Switch between floating and fullscreen header layouts
- **Fully Responsive**: Mobile-first design with hamburger menu
- **Multi-level Dropdowns**: Support for nested navigation menus
- **Slot Support**: Customizable slots for desktop header and mobile panel content
- **TypeScript Support**: Full type safety and IntelliSense
- **Two-layer customization**: High-level `classNames` prop + fine-grained nested class props inside `navigation` and `logo`
- **Exportable defaults**: Import and extend `defaultThemes` from your own code
- **Astro Optimized**: Built specifically for Astro framework

### Live demo

[https://base-astro-psi.vercel.app/fullscreen-demo](https://base-astro-psi.vercel.app/fullscreen-demo)

## Installation

```bash
 npm i @sofidevo/astro-dynamic-header
```

## Required Dependencies

You need to add the Iconify CDN to the head of your project for the hamburger menu icons to work properly:

```html
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
```

Add this to your main layout or in the `<head>` section of your Astro pages.

## Quick Start

### Basic Usage (Automatic Theme)

By default, the header uses `preset="auto"`, which automatically detects the theme based on a `.dark` class on your root element (`html` or `body`).

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const menuItems = [
  { link: '/about', text: 'About' },
];
---

<!-- Detects .dark class on root automatically -->
<Header navigation={{ menuItems }} />
```

### Advanced Usage (Dual-Theme Customization)

You can provide custom colors for both light and dark modes simultaneously.

```astro

---
import Header from '@sofidevo/astro-dynamic-header/Header';
const navigation = {
  menuItems: [
    { link: '/about', text: 'About' },
  ]
};
const theme = {
  light: {
    accentColor: "#3e1c71",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  dark: {
    accentColor: "#00ffff",
    backgroundColor: "rgba(20, 20, 20, 0.9)"
  }
};
---

<Header
  preset="auto"
  theme={theme}
  navigation={navigation}
/>
```

## Component Props

### Header Component

| Prop         | Type                          | Default      | Description                                    |
| ------------ | ----------------------------- | ------------ | ---------------------------------------------- |
| `headerType` | `"floating" \| "fullscreen"`  | `"floating"` | Header layout style                            |
| `preset`     | `"light" \| "dark" \| "auto"` | `"auto"`     | Theme behavior. `auto` follows root class.     |
| `logo`       | `LogoConfig`                  | `{}`         | Logo configuration object                      |
| `navigation` | `NavConfig`                   | `{}`         | Navigation configuration object                |
| `theme`      | `DualThemeConfig`             | `{}`         | Custom theme overrides for light/dark          |
| `classNames` | `HeaderClassNames`            | `{}`         | High-level class overrides for layout elements |

### Config Objects

#### DualThemeConfig

| Propery | Type          | Description                  |
| ------- | ------------- | ---------------------------- |
| `light` | `ThemeConfig` | Styles applied in light mode |
| `dark`  | `ThemeConfig` | Styles applied in dark mode  |

#### ThemeConfig

| Propery                 | Type     | Default          |
| ----------------------- | -------- | ---------------- |
| `backgroundColor`       | `string` | _Preset default_ |
| `backgroundColorOpaque` | `string` | _Preset default_ |
| `backdropBlur`          | `string` | `"blur(20px)"`   |
| `zIndex`                | `number` | `10`             |
| `textColor`             | `string` | _Preset default_ |
| `accentColor`           | `string` | _Preset default_ |

> [!IMPORTANT]
> **Transparency vs Solid Submenus**: To ensure the best UI and avoid rendering bugs with `backdrop-filter` on nested elements, submenus and the mobile navigation panel are **solid/opaque**.
>
> If you use a transparent `backgroundColor` (e.g., `rgba`), remember to also provide its solid counterpart in `backgroundColorOpaque`.

```astro
<Header theme={{
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Transparent header body
    backgroundColorOpaque: "#ffffff",            // Solid submenus
  }
}} />
```

#### CustomClassNames → HeaderClassNames

> [!NOTE]
> `CustomClassNames` was renamed to `HeaderClassNames` in v2.1. The old name still works as a type alias — no migration required.

The `classNames` prop targets the **structural wrapper elements** of the Header. For fine-grained control of individual nav links or the logo internals, use the nested `xxx__class` props inside the `navigation` or `logo` config objects instead.

| Property    | Target Element                                | Purpose & Common Use Cases                                                                                      |
| ----------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `container` | Outer `div` wrapping the header               | **Positioning & Layout**: `top-0`, `z-50`, `fixed`, adjusting `max-width` and `mx-auto` logic.                  |
| `header`    | Inner `<header>` element                      | **Appearance**: Shadows (`shadow-md`), borders (`border-b`), or custom transition durations.                    |
| `logo`      | `<a>` tag surrounding the logo                | **Interactions**: Hover states, custom focus rings, or adjusting the flex alignment of the logo group.          |
| `logoText`  | `<span>` tag containing the logo text         | **Typography**: Font weights, text shadows, or specific tracking/leading classes.                               |
| `nav`       | `<div>` wrapping the desktop navigation items | **Desktop Layout**: Spacing between the logo and the menu, or responsive visibility classes (`hidden md:flex`). |
| `mobileNav` | Root `<nav>` of the mobile slide-in panel     | **Mobile Panel**: Extra backdrop blur, custom z-index, slide-in overrides.                                      |

##### Usage Examples

**Premium Shadow & Border:**

```astro
<Header
  classNames={{
    header: "shadow-xl border-b border-black/5 dark:border-white/10 transition-all duration-500",
    container: "top-4 px-6",
    mobileNav: "backdrop-blur-md",
  }}
/>
```

**Custom Typography & Nav Spacing:**

```astro
<Header
  classNames={{
    logoText: "tracking-tighter font-black italic uppercase",
    nav: "ml-auto gap-8",
  }}
/>
```

> [!TIP]
> Since these classes are injected using Astro's `class:list`, you can also pass objects or arrays if you need conditional logic for your custom classes.

#### LogoConfig

| Property                 | Type     | Description                                                                           |
| ------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `src`                    | `string` | URL of the logo image                                                                 |
| `alt`                    | `string` | Alternative text for the logo image                                                   |
| `width`                  | `string` | Width of the logo (e.g., "50px", "5rem")                                              |
| `text`                   | `string` | Text to display next to or instead of logo image                                      |
| `textSize`               | `string` | Font size for the logo text                                                           |
| `textColor`              | `string` | Color for the logo text                                                               |
| `logo__container__class` | `string` | Extra CSS class(es) for the logo `<a>` wrapper — alternative to `classNames.logo`     |
| `logo__text__class`      | `string` | Extra CSS class(es) for the logo text `<span>` — alternative to `classNames.logoText` |

#### NavConfig

| Property              | Type         | Description                                             |
| --------------------- | ------------ | ------------------------------------------------------- |
| `homeUrl`             | `string`     | URL for the home link (defaults to `/`)                 |
| `menuItems`           | `MenuItem[]` | Array of navigation menu items                          |
| `header__menu__class` | `string`     | Extra CSS class(es) for the desktop `<nav>` element     |
| `header__item__class` | `string`     | Extra CSS class(es) for each top-level `<li>` menu item |
| `menu__link__class`   | `string`     | Extra CSS class(es) for each top-level `<a>` link       |

#### MenuItem

| Property  | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `link`    | `string`              | URL the menu item points to         |
| `text`    | `string`              | Label text for the menu item        |
| `submenu` | `SecondaryMenuItem[]` | Optional array of nested menu items |

## Slots Support

The Header component provides a flexible slot system that allows you to add additional content:

### Available Slots

| Slot Name | Location              | Visibility            | Description                              |
| --------- | --------------------- | --------------------- | ---------------------------------------- |
| `actions` | Header & Mobile panel | Responsive visibility | Add action buttons (login, signup, etc.) |

### Example with Slots

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const navigation = {
  menuItems: [{ link: '/about', text: 'About' }]
};
---

<Header navigation={navigation}>
  <div slot="actions">
    <button class="login-btn">Login</button>
  </div>
</Header>
```

## Comprehensive Example

Below is a complete implementation example showcasing custom logo configuration, navigation with a home URL, and theme overrides.

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const menuItems = [
  {
    link: "#",
    text: "Services",
    submenu: [
      { link: "/design", text: "Design" },
      { link: "/consulting", text: "Consulting" },
      {
        link: "#",
        text: "Web Development",
        submenu: [
          { link: "/web/frontend", text: "Frontend" },
          { link: "/web/backend", text: "Backend" },
          { link: "/web/fullstack", text: "Full Stack" },
        ],
      },
    ],
  },
  { link: "/about", text: "About" },
  { link: "/contact", text: "Contact" },
];

const theme = {
  light: {
    accentColor: "#ff0000",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  dark: {
    accentColor: "#00ffff",
    backgroundColor: "rgba(20, 20, 20, 0.9)",
  },
};
---

<Header
  headerType="floating"
  preset="dark"
  logo={{
    src: "https://itssofi.dev/img/icons/sofi-icon.webp",
    alt: "My Site Logo",
    width: "44px",
    logo__container__class: "ring-2 ring-offset-2",
  }}
  navigation={{
    homeUrl: "/",
    menuItems: menuItems,
    header__menu__class: "flex gap-6",
    menu__link__class: "font-medium",
  }}
  theme={theme}
  classNames={{
    header: "shadow-xl",
    mobileNav: "backdrop-blur-md",
  }}
>
  <button slot="actions">Login</button>
</Header>
```

## Header Types

### Floating Header

- Centered with max-width constraint
- Rounded corners
- Padding around container
- Perfect for modern, card-like designs

### Fullscreen Header

- Full viewport width
- No border radius
- Edge-to-edge design
- Ideal for traditional website layouts

## Styling and Customization

The component uses CSS custom properties that you can override:

```css
:root {
  --light-spot-color: #00ffff;
  --color-tertiary: #ffffff;
  --color-hamburger-lines: #ffffff;
}
```

## TypeScript Support

The package provides full TypeScript support. You can import types to ensure your configuration is correct:

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';
import { defaultThemes } from '@sofidevo/astro-dynamic-header';
import type {
  NavConfig,
  DualThemeConfig,
  HeaderClassNames,
  MenuItem,
  SecondaryMenuItem
} from '@sofidevo/astro-dynamic-header';

const navigation: NavConfig = {
  menuItems: [
    {
      link: '/products',
      text: 'Products',
      submenu: [
        { link: '/software', text: 'Software' },
        { link: '/hardware', text: 'Hardware' }
      ]
    }
  ],
  header__menu__class: "flex gap-6",
};

// Build on top of the built-in defaults
const theme: DualThemeConfig = {
  light: { ...defaultThemes.light, accentColor: "#3e1c71" },
  dark:  { ...defaultThemes.dark,  accentColor: "#00ffff", backgroundColor: "rgba(10, 10, 10, 0.9)" },
};

const classNames: HeaderClassNames = {
  header: "shadow-xl",
  mobileNav: "backdrop-blur-md",
};
---

<Header
  navigation={navigation}
  theme={theme}
  classNames={classNames}
  preset="auto"
/>
```

### Available Types

| Type                | Description                                     |
| ------------------- | ----------------------------------------------- |
| `MenuItem`          | Top-level menu item with optional properties    |
| `SecondaryMenuItem` | Second-level menu item                          |
| `TertiaryMenuItem`  | Third-level menu item                           |
| `NavConfig`         | Navigation config (items + nested class props)  |
| `LogoConfig`        | Logo config (image, text + nested class props)  |
| `ThemeConfig`       | Individual theme settings (colors, blur, etc.)  |
| `DualThemeConfig`   | Combined settings for light and dark modes      |
| `HeaderClassNames`  | Class overrides for structural wrapper elements |
| `CustomClassNames`  | **Deprecated alias** for `HeaderClassNames`     |
| `HeaderProps`       | Main props for the Header component             |

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design with optimized touch targets
- Supports CSS `backdrop-filter` for glassmorphism
- Automatic theme switching based on OS or site preference via `.dark` class

## Troubleshooting

### Import Issues

If you encounter import errors, try these solutions:

1. **Use direct subpath import:**

   ```astro
   import Header from '@sofidevo/astro-dynamic-header/Header';
   ```

2. **Check relative imports in TS:**
   In some environments (like `node16`), you might need to use the `.js` extension even for TypeScript files when importing from the package internals, though the main entry point handles this for you.

3. **Verify TypeScript configuration:**

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true
     }
   }
   ```

### Compatibility

- Astro 4.x and 5.x
- SSG Projects (Static Site Generation)
- SSR Projects (Server-Side Rendering)
- Hybrid Projects (output: 'hybrid')

## Live Examples

Visit our demo website to see the component in action with interactive examples and complete documentation.

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

If you find this package helpful, please consider giving it a star on GitHub!

---

## Changelog

### v2.1 — Style & Customization Refactor

#### New features

- **`HeaderClassNames`** replaces `CustomClassNames` (alias kept — no migration required).
  New `mobileNav` slot targets the mobile slide-in `<nav>` panel.

- **Nested class props** on `LogoConfig`:
  | Prop | Targets |
  |------|---------|
  | `logo__container__class` | Logo `<a>` wrapper |
  | `logo__text__class` | Logo text `<span>` |

- **Nested class props** on `NavConfig`:
  | Prop | Targets |
  |------|---------|
  | `header__menu__class` | Desktop `<nav>` element |
  | `header__item__class` | Each top-level `<li>` |
  | `menu__link__class` | Each top-level `<a>` |

- **`defaultThemes` exported** — import and spread the built-in tokens to extend them:
  ```ts
  import { defaultThemes } from "@sofidevo/astro-dynamic-header";
  const theme = { dark: { ...defaultThemes.dark, accentColor: "#f43f5e" } };
  ```

#### Internal improvements

- Default theme tokens extracted to `src/defaults.ts` — easier to read and maintain.
- `HamburgerButton` color is now explicitly wired from the resolved theme (no visual change).

#### Deprecations

- `CustomClassNames` — use `HeaderClassNames` instead. The alias will remain until the next major version.

### v2.0 — Object-based Configuration API

> [!WARNING]
> Breaking change: `logo` changed from `string` to `LogoConfig`, `navigation` changed from `MenuItem[]` to `NavConfig`.

- `logo` prop restructured to `LogoConfig` object (`src`, `alt`, `width`, `text`, `textSize`, `textColor`).
- `navigation` prop restructured to `NavConfig` object (`homeUrl`, `menuItems`).
- `classNames` prop introduced for CSS class injection (`CustomClassNames`).
- Dual-theme support via `DualThemeConfig` (`light` + `dark`).
