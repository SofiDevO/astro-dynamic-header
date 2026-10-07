import { defineConfig, mergeConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

/**
 * Astro's Vite plugin lets Vitest compile `.astro` components, so tests can
 * render the real Header through the Container API instead of mocking it.
 *
 * Two projects:
 *  - `dom`    → jsdom, unit tests for the extracted vanilla scripts.
 *  - `astro`  → node,  rendering + built CSS assertions (Astro's plugin only
 *               compiles `.astro` in Vite's `ssr` environment, which Vitest
 *               exposes for the `node` test environment).
 */
export default defineConfig(async (env) => {
  const astroViteConfig = await getViteConfig({}, {})(env);

  return mergeConfig(astroViteConfig, {
    test: {
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          'dist/',
          '**/*.config.*',
          '**/*.d.ts'
        ]
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'dom',
            environment: 'jsdom',
            include: ['tests/Header.test.ts', 'tests/NavMenu.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'astro',
            environment: 'node',
            include: ['tests/render.test.ts', 'tests/css-layers.test.ts'],
          },
        },
      ],
    },
  });
});
