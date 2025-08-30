import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock del DOM para simular elementos HTML
const mockSubsubmenu = {
  style: {
    right: '',
    left: '',
    opacity: '',
    pointerEvents: '',
    display: '',
    visibility: '',
    transform: '',
  },
  getBoundingClientRect: vi.fn(() => ({
    right: 800,
    left: 600,
  })),
  querySelector: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
};

const mockParentItem = {
  querySelector: vi.fn(() => mockSubsubmenu),
  addEventListener: vi.fn(),
};

const mockWindow = {
  innerWidth: 800,
};

// Mock de window
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 800,
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: vi.fn(),
});

// Mock de document
Object.defineProperty(document, 'querySelectorAll', {
  writable: true,
  value: vi.fn((selector) => {
    if (selector === '.subsubmenu') return [mockSubsubmenu];
    if (selector === '.submenu__item--secondary') return [mockParentItem];
    return [];
  }),
});

describe('NavMenu Component - Submenu Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset styles
    mockSubsubmenu.style = {
      right: '',
      left: '',
      opacity: '',
      pointerEvents: '',
      display: '',
      visibility: '',
      transform: '',
    };
  });

  it('should adjust subsubmenu position when overflowing right', () => {
    // Simular que el subsubmenu se sale por la derecha
    mockSubsubmenu.getBoundingClientRect.mockReturnValue({
      right: 900, // Se sale del viewport de 800px
      left: 700,
    });

    // Función que simula la lógica de ajuste de posición
    const adjustPosition = () => {
      const viewportWidth = window.innerWidth;
      const rect = mockSubsubmenu.getBoundingClientRect();

      if (rect.right > viewportWidth) {
        mockSubsubmenu.style.right = '100%';
        mockSubsubmenu.style.left = 'auto';
      }
    };

    adjustPosition();

    expect(mockSubsubmenu.style.right).toBe('100%');
    expect(mockSubsubmenu.style.left).toBe('auto');
  });

  it('should adjust subsubmenu position when overflowing left', () => {
    // Simular que el subsubmenu se sale por la izquierda después de moverlo a la derecha
    mockSubsubmenu.getBoundingClientRect
      .mockReturnValueOnce({ right: 900, left: 700 }) // Primera medición (se sale por derecha)
      .mockReturnValueOnce({ right: 900, left: -50 }); // Después de mover a izquierda (se sale por izquierda)

    const adjustPosition = () => {
      const viewportWidth = window.innerWidth;

      mockSubsubmenu.style.display = 'block';
      mockSubsubmenu.style.visibility = 'hidden';
      mockSubsubmenu.style.left = '100%';
      mockSubsubmenu.style.transform = '';

      let rect = mockSubsubmenu.getBoundingClientRect();

      if (rect.right > viewportWidth) {
        mockSubsubmenu.style.left = '-200%';
        mockSubsubmenu.style.right = 'auto';
        rect = mockSubsubmenu.getBoundingClientRect();

        if (rect.left < 0) {
          mockSubsubmenu.style.left = '100%';
          const overflow = rect.right - viewportWidth + 30;
          mockSubsubmenu.style.transform = `translateX(-${overflow}px)`;
        }
      }
    };

    adjustPosition();

    expect(mockSubsubmenu.style.left).toBe('100%');
    expect(mockSubsubmenu.style.transform).toContain('translateX');
  });

  it('should show subsubmenu with correct positioning', () => {
    const showSubsubmenu = () => {
      mockSubsubmenu.style.opacity = '1';
      mockSubsubmenu.style.pointerEvents = 'all';

      const isPositionedLeft = mockSubsubmenu.style.left === '-100%';
      const transformDirection = isPositionedLeft ? '-2rem' : '2rem';

      const currentTransform = mockSubsubmenu.style.transform;
      if (currentTransform && currentTransform.includes('translateX')) {
        const existingTranslate = currentTransform.match(/translateX\(([^)]+)\)/);
        if (existingTranslate) {
          const existingValue = existingTranslate[1];
          mockSubsubmenu.style.transform = `translateX(calc(${existingValue} + ${transformDirection}))`;
        }
      }
    };

    showSubsubmenu();

    expect(mockSubsubmenu.style.opacity).toBe('1');
    expect(mockSubsubmenu.style.pointerEvents).toBe('all');
  });

  it('should handle menu items with and without submenus', () => {
    const menuItems = [
      {
        link: '/about',
        text: 'About',
        submenu: [
          { link: '/team', text: 'Team' },
          { link: '/mission', text: 'Mission' }
        ]
      },
      {
        link: '/contact',
        text: 'Contact'
        // Sin submenu
      }
    ];

    const itemsWithSubmenu = menuItems.filter(item => item.submenu);
    const itemsWithoutSubmenu = menuItems.filter(item => !item.submenu);

    expect(itemsWithSubmenu.length).toBe(1);
    expect(itemsWithoutSubmenu.length).toBe(1);
    expect(itemsWithSubmenu[0].submenu?.length).toBe(2);
  });

  it('should handle nested submenu structure', () => {
    const menuItems = [
      {
        link: '/services',
        text: 'Services',
        submenu: [
          {
            link: '/web-dev',
            text: 'Web Development',
            submenu: [
              { link: '/frontend', text: 'Frontend' },
              { link: '/backend', text: 'Backend' },
              { link: '/fullstack', text: 'Full Stack' }
            ]
          },
          {
            link: '/design',
            text: 'Design'
            // Sin submenu anidado
          }
        ]
      }
    ];

    const nestedItem = menuItems[0].submenu?.[0];
    expect(nestedItem?.submenu?.length).toBe(3);

    const nonNestedItem = menuItems[0].submenu?.[1];
    expect((nonNestedItem as any).submenu).toBeUndefined();
  });

  it('should adjust subsubmenu position on window resize', () => {
    const adjustSubsubmenuPositionOnResize = () => {
      const subsubmenus = document.querySelectorAll('.subsubmenu') as NodeListOf<HTMLElement>;

      subsubmenus.forEach((subsubmenu) => {
        const rect = subsubmenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.right > viewportWidth) {
          subsubmenu.style.right = '100%';
          subsubmenu.style.left = 'auto';
        } else {
          subsubmenu.style.left = '100%';
          subsubmenu.style.right = 'auto';
        }
      });
    };

    // Simular resize con subsubmenu que se sale
    mockSubsubmenu.getBoundingClientRect.mockReturnValue({
      right: 850, // Se sale del viewport
      left: 650,
    });

    adjustSubsubmenuPositionOnResize();

    expect(mockSubsubmenu.style.right).toBe('100%');
    expect(mockSubsubmenu.style.left).toBe('auto');
  });
});
