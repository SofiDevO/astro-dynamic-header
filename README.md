# @sofidevo/astro-dynamic-header

A dynamic, responsive header component for Astro projects that can switch between floating and fullscreen styles with multi-level dropdown navigation support.

> [!WARNING]
> **Breaking Changes**: Version 2.0+ introduces a restructured configuration object. If you are upgrading from an older version, please review the [Component Props](#component-props) and the [Comprehensive Example](#comprehensive-example) to migrate your configuration.

## Features

- **Dynamic Styles**: Switch between floating and fullscreen header layouts
- **Fully Responsive**: Mobile-first design with hamburger menu
- **Multi-level Dropdowns**: Support for nested navigation menus
- **Slot Support**: Customizable slots for desktop header and mobile panel content
- **TypeScript Support**: Full type safety and IntelliSense
- **Customizable**: Extensive customization options for colors, sizes, and behavior
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


const =  menuItems: [
    { link: '/about', text: 'About' },
  ]

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

| Prop         | Type                          | Default      | Description                                |
| ------------ | ----------------------------- | ------------ | ------------------------------------------ |
| `headerType` | `"floating" \| "fullscreen"`  | `"floating"` | Header layout style                        |
| `preset`     | `"light" \| "dark" \| "auto"` | `"auto"`     | Theme behavior. `auto` follows root class. |
| `logo`       | `LogoConfig`                  | `{}`         | Logo configuration object                  |
| `navigation` | `NavConfig`                   | `{}`         | Navigation configuration object            |
| `theme`      | `DualThemeConfig`             | `{}`         | Custom theme overrides for light/dark      |
| `classNames` | `CustomClassNames`            | `{}`         | Custom class names for CSS Modules         |

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

#### CustomClassNames

| Propery     | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| `container` | `string` | Main container class             |
| `header`    | `string` | Header element class             |
| `logo`      | `string` | Logo link container class        |
| `logoText`  | `string` | Logo text class                  |
| `nav`       | `string` | Desktop navigation wrapper class |

#### LogoConfig

| Property    | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `src`       | `string` | URL of the logo image                            |
| `alt`       | `string` | Alternative text for the logo image              |
| `width`     | `string` | Width of the logo (e.g., "50px", "5rem")         |
| `text`      | `string` | Text to display next to or instead of logo image |
| `textSize`  | `string` | Font size for the logo text                      |
| `textColor` | `string` | Color for the logo text                          |

#### NavConfig

| Property    | Type         | Description                             |
| ----------- | ------------ | --------------------------------------- |
| `homeUrl`   | `string`     | URL for the home link (defaults to `/`) |
| `menuItems` | `MenuItem[]` | Array of navigation menu items          |

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
  }}
  navigation={{
    homeUrl: "/",
    menuItems: menuItems,
  }}
  theme={theme}
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
import type {
  NavConfig,
  DualThemeConfig,
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
  ]
};

const theme: DualThemeConfig = {
  light: {
    accentColor: "#3e1c71",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backgroundColorOpaque: "#ffffff"
  },
  dark: {
    accentColor: "#00ffff",
    backgroundColor: "rgba(10, 10, 10, 0.9)",
    backgroundColorOpaque: "#0a0a0a"
  }
};
---

<Header
  navigation={navigation}
  theme={theme}
  preset="auto"
/>
```

### Available Types

| Type                | Description                                    |
| ------------------- | ---------------------------------------------- |
| `MenuItem`          | Top-level menu item with optional properties   |
| `SecondaryMenuItem` | Second-level menu item                         |
| `TertiaryMenuItem`  | Third-level menu item                          |
| `NavConfig`         | Main navigation configuration object           |
| `ThemeConfig`       | Individual theme settings (colors, blur, etc.) |
| `DualThemeConfig`   | Combined settings for light and dark modes     |
| `LogoConfig`        | Logo image and text configuration              |
| `HeaderProps`       | Main props for the Header component            |

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
