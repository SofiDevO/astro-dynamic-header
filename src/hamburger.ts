export class HamburgerButton {
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
    }
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

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new HamburgerButton();
  });
}
