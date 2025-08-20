const d = document;


/**
 * Adds a global click event listener to handle hamburger menu button and menu link interactions.
 *
 * When the hamburger button or any of its child elements are clicked, toggles the "is-active" class
 * on both the hamburger button and the associated panel. When a menu link is clicked, removes the
 * "is-active" class from both the hamburger button and the panel.
 *
 * @param hamburgerBtn - A CSS selector string for the hamburger button element.
 * @param panel - A CSS selector string for the panel element to show/hide.
 * @param menuLink - A CSS selector string for the menu link elements that close the menu when clicked.
 */


export function HamburgerButton(hamburgerBtn: string, panel: string, menuLink: string): void {
  d.addEventListener("click", (e: Event) => {
    const target = e.target as Element;

    if (
      target?.matches?.(hamburgerBtn) ||
      target?.matches?.(`${hamburgerBtn} *`)
    ) {
      d.querySelector(hamburgerBtn)?.classList.toggle("is-active");
      d.querySelector(panel)?.classList.toggle("is-active");
    }
    if (target?.matches?.(menuLink)) {
      d.querySelector(hamburgerBtn)?.classList.remove("is-active");
      d.querySelector(panel)?.classList.remove("is-active");
    }
  });
}

// Class-based approach for the default implementation
export class HamburgerButtonController {
  private hamburgerBtn: HTMLElement | null;
  private mobileMenu: HTMLElement | null;

  constructor() {
    this.hamburgerBtn = document.getElementById("hamburger-btn");
    this.mobileMenu = document.getElementById("mobile-header-menu");
    this.init();
  }

  private init(): void {
    if (this.hamburgerBtn && this.mobileMenu) {
      this.hamburgerBtn.addEventListener("click", () => this.toggleMenu());
      // Add event listener for closing menu when clicking on menu links
      this.addMenuLinkListeners();
    }
  }

  private addMenuLinkListeners(): void {
    // Listen for clicks on the document to handle menu link clicks
    document.addEventListener("click", (e: Event) => {
      const target = e.target as Element;

      // Check if the clicked element is a menu link (following original logic pattern)
      if (target?.matches?.(".mobile-menu__link") ||
          target?.matches?.(".menu__link.mobile-menu__link") ||
          target?.matches?.(".mobile-menu__link *") ||
          target?.matches?.(".menu__link.mobile-menu__link *")) {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    if (this.hamburgerBtn && this.mobileMenu) {
      this.hamburgerBtn.classList.toggle("is-active");
      this.mobileMenu.classList.toggle("is-active");
    }
  }

  public openMenu(): void {
    if (this.hamburgerBtn && this.mobileMenu) {
      this.hamburgerBtn.classList.add("is-active");
      this.mobileMenu.classList.add("is-active");
    }
  }

  public closeMenu(): void {
    if (this.hamburgerBtn && this.mobileMenu) {
      this.hamburgerBtn.classList.remove("is-active");
      this.mobileMenu.classList.remove("is-active");
    }
  }
}

// Auto-initialize when DOM is ready (using only the class-based approach)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize only the class-based controller to avoid conflicts
    new HamburgerButtonController();
  });
}
