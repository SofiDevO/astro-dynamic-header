/**
 * Behaviour for the hamburger button + mobile panel.
 * Extracted from `Header.astro` so it can be unit tested.
 */

export class HamburgerController {
  private readonly hamburgerBtn: HTMLElement | null;
  private readonly mobileMenu: HTMLElement | null;
  private readonly links: NodeListOf<HTMLElement>;

  constructor(doc: Document = document) {
    this.hamburgerBtn = doc.getElementById("hamburger-btn");
    this.mobileMenu = doc.getElementById("mobile-header-menu");
    this.links = doc.querySelectorAll(".mobile-menu__link");
    this.init();
  }

  private init(): void {
    if (!this.hamburgerBtn || !this.mobileMenu) return;

    this.hamburgerBtn.addEventListener("click", () => this.toggleMenu());
    this.links.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });
  }

  closeMenu(): void {
    this.hamburgerBtn?.classList.remove("is-active");
    this.mobileMenu?.classList.remove("is-active");
  }

  toggleMenu(): void {
    this.hamburgerBtn?.classList.toggle("is-active");
    this.mobileMenu?.classList.toggle("is-active");
  }
}

/**
 * Wires the hamburger as soon as the DOM is ready (module scripts may run
 * before or after `DOMContentLoaded`, so both paths are handled).
 */
export function initHamburger(doc: Document = document): HamburgerController | null {
  if (doc.readyState === "loading") {
    let controller: HamburgerController | null = null;
    doc.addEventListener(
      "DOMContentLoaded",
      () => {
        controller = new HamburgerController(doc);
      },
      { once: true },
    );
    return controller;
  }
  return new HamburgerController(doc);
}
