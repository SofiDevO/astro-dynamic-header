# @sofidevo/astro-dynamic-header

A dynamic, responsive header component for Astro projects that can switch between floating and fullscreen styles with multi-level dropdown navigation support.

## Features

- 🎨 **Dynamic Styles**: Switch between floating and fullscreen header layouts
- 📱 **Fully Responsive**: Mobile-first design with hamburger menu
- 🎯 **Multi-level Dropdowns**: Support for nested navigation menus
- 🚀 **TypeScript Support**: Full type safety and IntelliSense
- 🎨 **Customizable**: Extensive customization options for colors, sizes, and behavior
- ⚡ **Astro Optimized**: Built specifically for Astro framework


### Live demo
  [https://base-astro-psi.vercel.app/fullscreen-demo](https://base-astro-psi.vercel.app/fullscreen-demo)

## Installation

```bash
 npm i @sofidevo/astro-dynamic-header
```

## Quick Start

### Basic Usage

```astro
---
// Option 1: Import from direct subpath (recommended)
import Header from '@sofidevo/astro-dynamic-header/Header';

// Option 2: Import from main entry point with types
import { HeaderProps, type MenuItemType } from '@sofidevo/astro-dynamic-header';

const menuItems = [
  { link: '/about', text: 'About' },
  { link: '/contact', text: 'Contact' },
];
---

<Header
  headerType="floating"
  logoSrc="/logo.png"
  menuItems={menuItems}
/>
```

### TypeScript Configuration

To ensure imports work correctly in your Astro project, make sure your `tsconfig.json` has the appropriate configuration:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "noEmit": true,
    "jsx": "preserve"
  },
  "extends": "astro/tsconfigs/strict"
}
```

### Advanced Usage

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';
import type { MenuItemType } from '@sofidevo/astro-dynamic-header';

const menuItems = [
  {
    link: '#',
    text: 'Services',
    submenu: [
      {
        link: '#',
        text: 'Web Development',
        submenu: [
          { link: '/web/frontend', text: 'Frontend' },
          { link: '/web/backend', text: 'Backend' },
          { link: '/web/fullstack', text: 'Full Stack' },
        ],
      },
      { link: '/design', text: 'Design' },
      { link: '/consulting', text: 'Consulting' },
    ],
  },
  { link: '/about', text: 'About' },
  { link: '/contact', text: 'Contact' },
];
---

<Header
  headerType="fullscreen"
  logoSrc="/logo.png"
  logoAlt="My Company"
  logoWidth="150px"
  homeUrl="/"
  menuItems={menuItems}
  backgroundColor="#000000dd"
  backdropBlur="blur(15px)"
  zIndex={100}
/>
```

## Component Props

### Header Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headerType` | `"floating" \| "fullscreen"` | `"floating"` | Header layout style |
| `logoSrc` | `string` | `"/logo.png"` | Logo image source |
| `logoAlt` | `string` | `"Logo"` | Logo alt text |
| `logoWidth` | `string` | `"120px"` | Logo width |
| `homeUrl` | `string` | `"/"` | Home page URL |
| `menuItems` | `MenuItemType[]` | `[]` | Navigation menu items |
| `backgroundColor` | `string` | `"#0d0d0dcc"` | Header background color |
| `backdropBlur` | `string` | `"blur(20px)"` | Backdrop filter blur |
| `zIndex` | `number` | `10` | CSS z-index value |

### Menu Item Structure

```typescript
interface MenuItemType {
  link: string;
  text: string;
  submenu?: MenuItemType[];
}
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

## Individual Components

You can also import and use components individually:

```astro
---
// Import individual components
import NavMenu from '@sofidevo/astro-dynamic-header/NavMenu';
import MobileNav from '@sofidevo/astro-dynamic-header/MobileNav';
import HamburgerButton from '@sofidevo/astro-dynamic-header/HamburgerButton';

// Or use the .astro extension explicitly
import NavMenu from '@sofidevo/astro-dynamic-header/NavMenu.astro';
import MobileNav from '@sofidevo/astro-dynamic-header/MobileNav.astro';
import HamburgerButton from '@sofidevo/astro-dynamic-header/HamburgerButton.astro';
---

<NavMenu menuItems={menuItems} showHomeLink={true} homeText="Home" />
<MobileNav menuItems={menuItems} accentColor="#00ffff" />
<HamburgerButton color="#ffffff" />
```

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

Full TypeScript support with exported interfaces:

```typescript
import type {
  MenuItemType,
  HeaderProps,
  NavMenuProps,
  MobileNavProps,
  HamburgerButtonProps
} from '@sofidevo/astro-dynamic-header';
```

## Browser Support

- All modern browsers
- Mobile responsive design
- Supports CSS `backdrop-filter`
- Graceful degradation for older browsers

## Troubleshooting

### Import Issues

If you encounter import errors, try these solutions:

1. **Use direct subpath import:**
   ```astro
   import Header from '@sofidevo/astro-dynamic-header/Header';
   ```

2. **Verify TypeScript configuration:**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "bundler", // or "nodenext"
       "allowImportingTsExtensions": true
     }
   }
   ```

3. **Import types separately:**
   ```astro
   ---
   import Header from '@sofidevo/astro-dynamic-header/Header';
   import type { MenuItemType } from '@sofidevo/astro-dynamic-header';
   ---
   ```

### Compatibility

- ✅ Astro 4.x and 5.x
- ✅ SSG Projects (Static Site Generation)
- ✅ SSR Projects (Server-Side Rendering)
- ✅ Hybrid Projects (output: 'hybrid')

## Live Examples

Visit our demo website to see the component in action with interactive examples and complete documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

If you find this package helpful, please consider giving it a ⭐ on GitHub!
