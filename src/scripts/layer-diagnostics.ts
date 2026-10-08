/**
 * Dev-only cascade-layer order diagnostic.
 *
 * The component ships its styles inside `@layer components` and declares the
 * order statement `@layer theme, base, components, utilities;` so that any
 * consumer override in `@layer utilities` (or a Tailwind utility class passed
 * through `classNames`) beats the built-in styles without `!important`.
 *
 * Two situations silently break that guarantee:
 *
 * 1. An old v3.x version is installed — v3 shipped unlayered styles, and
 *    unlayered CSS beats every layered rule.
 * 2. The consumer's CSS creates the `utilities` layer *before* any layer
 *    order statement runs. Per the CSS Cascade spec, a later statement cannot
 *    reorder already-created layers, so the component's `components` layer
 *    ends up above `utilities` and consumer overrides lose.
 *
 * This module runs only in dev (the call site is guarded with
 * `import.meta.env.DEV`) and warns with the exact fix instead of leaving the
 * developer guessing why an override "does nothing".
 */

/** The canonical order statement this component guarantees. */
export const LAYER_ORDER_STATEMENT = "@layer theme, base, components, utilities;";

export type LayerProblem =
  | { kind: "missing-components-layer" }
  | { kind: "wrong-order"; componentsIndex: number; utilitiesIndex: number };

/**
 * Walks every readable stylesheet in the document and returns the layer names
 * in the order they were first created (creation order = cascade order from
 * weakest to strongest, per CSS Cascade 5 §6.4.3).
 *
 * Uses `cssText` parsing instead of `CSSLayerStatementRule`/`CSSLayerBlockRule`
 * constructors so it also works in environments with partial CSSOM support.
 */
export function collectLayerOrder(doc: Document = document): string[] {
  const order: string[] = [];
  const seen = new Set<string>();

  const push = (rawName: string): void => {
    const name = rawName.trim();
    if (name.length > 0 && !seen.has(name)) {
      seen.add(name);
      order.push(name);
    }
  };

  const walk = (rules: CSSRuleList): void => {
    for (const rawRule of Array.from(rules)) {
      const rule = rawRule as CSSRule & { cssRules?: CSSRuleList };
      const cssText = rule.cssText ?? "";

      if (cssText.startsWith("@layer")) {
        const braceIndex = cssText.indexOf("{");
        if (braceIndex === -1) {
          // Order statement: "@layer theme, base, components, utilities;"
          const list = cssText
            .slice(cssText.indexOf("@layer") + "@layer".length, cssText.indexOf(";"))
            .split(",");
          list.forEach(push);
        } else {
          // Layer block: "@layer components { … }"
          push(cssText.slice("@layer".length, braceIndex));
        }
      } else if (rule.cssRules) {
        // @media / @supports / … — descend so nested layer usage still counts.
        walk(rule.cssRules);
      }
    }
  };

  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      if (rules) walk(rules);
    } catch {
      // Cross-origin stylesheets are unreadable — they cannot be ours anyway.
    }
  }

  return order;
}

/**
 * Compares the final layer order against the order the component guarantees
 * and returns the first problem found, or `null` when everything is healthy.
 */
export function findLayerProblem(
  doc: Document = document,
): LayerProblem | null {
  const order = collectLayerOrder(doc);
  const componentsIndex = order.indexOf("components");
  const utilitiesIndex = order.indexOf("utilities");

  if (componentsIndex === -1) {
    // Our styles always create `components`. If the header is rendered but the
    // layer never appears, the shipped CSS is the old unlayered v3 styles.
    const headerRendered = doc.querySelector(".header__container") !== null;
    return headerRendered ? { kind: "missing-components-layer" } : null;
  }

  if (utilitiesIndex !== -1 && componentsIndex > utilitiesIndex) {
    return { kind: "wrong-order", componentsIndex, utilitiesIndex };
  }

  return null;
}

/** Human-readable console message with the exact fix for each problem. */
export function formatProblemMessage(problem: LayerProblem): string {
  const banner = "[@sofidevo/astro-dynamic-header]";

  if (problem.kind === "missing-components-layer") {
    return (
      `${banner} The component's styles were not found in \`@layer components\`. ` +
      `This usually means an old v3.x version is installed, whose unlayered ` +
      `styles beat every layered override. Run \`npm ls ` +
      `@sofidevo/astro-dynamic-header\` (or the pnpm/yarn equivalent) and ` +
      `update to the latest version.`
    );
  }

  return (
    `${banner} Wrong cascade layer order: \`utilities\` was created first ` +
    `(position ${problem.utilitiesIndex}) and \`components\` after it ` +
    `(position ${problem.componentsIndex}), so your overrides lose to the ` +
    `component. Your CSS creates the \`utilities\` layer before any layer ` +
    `order statement runs, and per the CSS Cascade spec a later statement ` +
    `cannot reorder existing layers. Fix: add ` +
    `\`@layer theme, base, components, utilities;\` as the very first line of ` +
    `your global CSS, before any \`@layer\` usage (Tailwind v4 already ` +
    `emits this).`
  );
}

/**
 * Schedules the check after `load` (plus a short delay so styles injected by
 * dev tooling are included) and prints a `console.warn` when the order is
 * broken. Call site guards this with `import.meta.env.DEV`.
 */
export function initLayerDiagnostics(): void {
  const run = (): void => {
    window.setTimeout(() => {
      const problem = findLayerProblem(document);
      if (problem) console.warn(formatProblemMessage(problem));
    }, 250);
  };

  if (document.readyState === "complete") {
    run();
  } else {
    window.addEventListener("load", run, { once: true });
  }
}
