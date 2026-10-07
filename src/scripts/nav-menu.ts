/**
 * Positioning + interaction logic for 2nd/3rd level submenus.
 * Extracted from `NavMenu.astro` so it can be unit tested.
 */

export function adjustSubsubmenuPositionOnResize(
  doc: Document = document,
  win: Window = window,
): void {
  const subsubmenus = doc.querySelectorAll<HTMLElement>(".subsubmenu");

  subsubmenus.forEach((subsubmenu) => {
    const rect = subsubmenu.getBoundingClientRect();
    const viewportWidth = win.innerWidth;

    if (rect.right > viewportWidth) {
      subsubmenu.style.right = "100%";
      subsubmenu.style.left = "0";
    } else {
      subsubmenu.style.left = "100%";
      subsubmenu.style.right = "0";
    }
  });
}

export function handleSubsubmenuInteraction(doc: Document = document): void {
  const parentItems = doc.querySelectorAll(".submenu__item--secondary");

  parentItems.forEach((parentItem) => {
    const subsubmenu = parentItem.querySelector<HTMLElement>(".subsubmenu");
    if (!subsubmenu) return;

    const adjustPosition = () => {
      const viewportWidth = window.innerWidth;

      const originalDisplay = subsubmenu.style.display;
      const originalVisibility = subsubmenu.style.visibility;

      subsubmenu.style.display = "block";
      subsubmenu.style.visibility = "hidden";
      subsubmenu.style.left = "100%";
      subsubmenu.style.transform = "auto";

      const rect = subsubmenu.getBoundingClientRect();

      if (rect.right > viewportWidth) {
        subsubmenu.style.left = "-100%";
        subsubmenu.style.right = "auto";
        const leftRect = subsubmenu.getBoundingClientRect();

        if (leftRect.left < 0) {
          subsubmenu.style.left = "100%";
          const overflow = rect.right - viewportWidth + 30;
          subsubmenu.style.transform = `translateX(-${overflow}px)`;
        }
      }
      subsubmenu.style.display = originalDisplay;
      subsubmenu.style.visibility = originalVisibility;
    };

    const showSubsubmenu = () => {
      adjustPosition();

      subsubmenu.style.opacity = "1";
      subsubmenu.style.pointerEvents = "all";

      const isPositionedLeft = subsubmenu.style.left === "-100%";
      const transformDirection = isPositionedLeft ? "-32px" : "32px";

      const currentTransform = subsubmenu.style.transform;
      if (currentTransform && currentTransform.includes("translateX")) {
        const existingTranslate = currentTransform.match(
          /translateX\(([^)]+)\)/,
        );
        if (existingTranslate) {
          const existingValue = existingTranslate[1];
          subsubmenu.style.transform =
            `translateX(calc(${existingValue} + ${transformDirection}))`;
        }
      } else {
        subsubmenu.style.transform =
          `${currentTransform} translateX(${transformDirection})`.trim();
      }
    };

    const hideSubsubmenu = () => {
      subsubmenu.style.opacity = "";
      subsubmenu.style.pointerEvents = "";
      subsubmenu.style.transform = "";
    };

    parentItem.addEventListener("mouseenter", showSubsubmenu);
    parentItem.addEventListener("mouseleave", hideSubsubmenu);
  });
}

/**
 * Wires submenu behaviour as soon as the DOM is ready (module scripts may run
 * before or after `DOMContentLoaded`, so both paths are handled).
 */
export function initNavMenu(
  doc: Document = document,
  win: Window = window,
): void {
  win.addEventListener("resize", () =>
    adjustSubsubmenuPositionOnResize(doc, win),
  );

  const start = () => {
    adjustSubsubmenuPositionOnResize(doc, win);
    handleSubsubmenuInteraction(doc);
  };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
