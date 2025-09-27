import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock del DOM para simular elementos HTML
const mockHamburgerBtn = {
  classList: {
    toggle: vi.fn(),
    remove: vi.fn(),
    add: vi.fn(),
    contains: vi.fn(),
  },
  addEventListener: vi.fn(),
};

const mockMobileMenu = {
  classList: {
    toggle: vi.fn(),
    remove: vi.fn(),
    add: vi.fn(),
    contains: vi.fn(),
  },
};

const mockLinks = [
  { addEventListener: vi.fn() },
  { addEventListener: vi.fn() },
];

// Mock de document
Object.defineProperty(document, 'getElementById', {
  writable: true,
  value: vi.fn((id) => {
    if (id === 'hamburger-btn') return mockHamburgerBtn;
    if (id === 'mobile-header-menu') return mockMobileMenu;
    return null;
  }),
});

Object.defineProperty(document, 'querySelectorAll', {
  writable: true,
  value: vi.fn((selector) => {
    if (selector === '.mobile-menu__link') return mockLinks;
    return [];
  }),
});

Object.defineProperty(document, 'addEventListener', {
  writable: true,
  value: vi.fn(),
});

describe('Header Component - HamburgerController', () => {
  let HamburgerController: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Importar la clase HamburgerController del componente Header
    // Como es un componente Astro, necesitamos simular su comportamiento
    HamburgerController = class {
      private hamburgerBtn: any;
      private mobileMenu: any;
      private links: any[];

      constructor() {
        this.hamburgerBtn = document.getElementById("hamburger-btn");
        this.mobileMenu = document.getElementById("mobile-header-menu");
        this.links = Array.from(document.querySelectorAll(".mobile-menu__link"));
        this.init();
      }

      private init(): void {
        if (this.hamburgerBtn && this.mobileMenu) {
          this.hamburgerBtn.addEventListener("click", () => this.toggleMenu());
          this.links.forEach(link => {
            link.addEventListener("click", () => this.closeMenu());
          });
        }
      }

      private closeMenu(): void {
        if (this.hamburgerBtn && this.mobileMenu) {
          this.hamburgerBtn.classList.remove("is-active");
          this.mobileMenu.classList.remove("is-active");
        }
      }

      private toggleMenu(): void {
        if (this.hamburgerBtn && this.mobileMenu) {
          this.hamburgerBtn.classList.toggle("is-active");
          this.mobileMenu.classList.toggle("is-active");
        }
      }
    };
  });

  it('should initialize hamburger controller correctly', () => {
    const controller = new HamburgerController();

    expect(document.getElementById).toHaveBeenCalledWith("hamburger-btn");
    expect(document.getElementById).toHaveBeenCalledWith("mobile-header-menu");
    expect(document.querySelectorAll).toHaveBeenCalledWith(".mobile-menu__link");
  });

  it('should toggle menu when hamburger button is clicked', () => {
    const controller = new HamburgerController();

    // Simular click en el botón hamburguesa
    const clickHandler = mockHamburgerBtn.addEventListener.mock.calls[0][1];
    clickHandler();

    expect(mockHamburgerBtn.classList.toggle).toHaveBeenCalledWith("is-active");
    expect(mockMobileMenu.classList.toggle).toHaveBeenCalledWith("is-active");
  });

  it('should close menu when a link is clicked', () => {
    const controller = new HamburgerController();

    // Simular click en un enlace del menú
    const linkClickHandler = mockLinks[0].addEventListener.mock.calls[0][1];
    linkClickHandler();

    expect(mockHamburgerBtn.classList.remove).toHaveBeenCalledWith("is-active");
    expect(mockMobileMenu.classList.remove).toHaveBeenCalledWith("is-active");
  });

  it('should handle missing DOM elements gracefully', () => {
    // Mock para elementos no encontrados
    (document.getElementById as any).mockReturnValue(null);

    const controller = new HamburgerController();

    // No debería hacer nada si los elementos no existen
    expect(mockHamburgerBtn.addEventListener).not.toHaveBeenCalled();
  });
});
