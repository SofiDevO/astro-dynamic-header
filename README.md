# @sofidevo/astro-dynamic-header

A dynamic, responsive header component for Astro projects that can switch between floating and fullscreen styles with multi-level dropdown navigation support.

## Features

- 🎨 **Dynamic Styles**: Switch between floating and fullscreen header layouts
- 📱 **Fully Responsive**: Mobile-first design with hamburger menu
- 🎯 **Multi-level Dropdowns**: Support for nested navigation menus
- � **Slot Support**: Customizable slots for desktop header and mobile panel content
- �🚀 **TypeScript Support**: Full type safety and IntelliSense
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

## Slots Support

The Header component provides two customizable slots that allow you to add additional content:

### Available Slots

| Slot Name | Location | Visibility | Description |
|-----------|----------|------------|-------------|
| `slot-desktop` | Header (desktop & mobile) | Always visible | Add content to the main header area |
| `slot-panel` | Mobile navigation panel | Mobile only | Add content to the mobile menu panel |

### Slot Examples

#### Using Individual Slots

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const menuItems = [
  { link: '/about', text: 'About' },
  { link: '/contact', text: 'Contact' },
];
---

<!-- Adding content only to desktop header -->
<Header
  headerType="floating"
  logoSrc="/logo.png"
  menuItems={menuItems}
>
  <button slot="slot-desktop" class="cta-button">Get Started</button>
</Header>

<!-- Adding content only to mobile panel -->
<Header
  headerType="fullscreen"
  logoSrc="/logo.png"
  menuItems={menuItems}
>
  <div slot="slot-panel" class="mobile-footer">
    <p>© 2024 My Company</p>
    <div class="social-links">
      <a href="/twitter">Twitter</a>
      <a href="/linkedin">LinkedIn</a>
    </div>
  </div>
</Header>
```

#### Using Both Slots Together

```astro
---
import Header from '@sofidevo/astro-dynamic-header/Header';

const menuItems = [
  { link: '/about', text: 'About' },
  { link: '/services', text: 'Services' },
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
>
  <!-- Content for desktop header -->
  <button slot="slot-desktop" class="cta-button">
    Sign Up
  </button>

  <!-- Content for mobile panel -->
  <div slot="slot-panel" class="mobile-extras">
    <button class="mobile-cta">Download App</button>
    <div class="mobile-contact">
      <p>Call us: +1 (555) 123-4567</p>
      <p>Email: info@company.com</p>
    </div>
  </div>
</Header>
```

#### Responsive Slot Behavior

The `slot-desktop` is visible on both desktop and mobile by default. If you want to hide it on mobile, use CSS:

```css
/* Hide desktop slot on mobile devices */
@media (width < 768px) {
  .cta-button {
    display: none;
  }
}

/* Or create responsive variants */
.desktop-only {
  display: block;
}

@media (width < 768px) {
  .desktop-only {
    display: none;
  }
}
```

```astro
<Header menuItems={menuItems}>
  <button slot="slot-desktop" class="cta-button desktop-only">
    Desktop CTA
  </button>
  <div slot="slot-panel">
    <button class="mobile-cta">Mobile CTA</button>
  </div>
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

## Testing

This project includes a comprehensive test suite with 34 tests covering all critical functionality.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:

#### Component Logic Tests
- **Header Component** (4 tests): Hamburger controller functionality, menu toggle behavior
- **HamburgerButton Component** (10 tests): Button states, responsive behavior, accessibility
- **MobileNav Component** (7 tests): Dropdown structure, nested submenus, conditional rendering
- **NavMenu Component** (6 tests): Dynamic positioning, submenu interactions, viewport adjustments

#### Integration Tests (7 tests)
- Component interaction flows
- Responsive behavior between mobile/desktop
- Keyboard navigation and accessibility
- Menu state management during navigation

### Test Technologies
- **Vitest**: Fast testing framework
- **jsdom**: DOM simulation for component testing
- **TypeScript**: Type-safe test writing

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

If you find this package helpful, please consider giving it a ⭐ on GitHub!
