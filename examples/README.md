# Ejemplos de Uso

Este directorio contiene ejemplos prácticos de cómo usar el componente `@sofidevo/astro-dynamic-header`.

## basic-usage.astro

Ejemplo básico que muestra cómo importar y usar el componente Header con configuración mínima.

### Importación correcta en tu proyecto:

```astro
---
// En tu proyecto Astro, usa estas importaciones:
import Header from '@sofidevo/astro-dynamic-header/Header';
import type { MenuItemType } from '@sofidevo/astro-dynamic-header';
---
```

### Configuración de TypeScript recomendada:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "noEmit": true
  },
  "extends": "astro/tsconfigs/strict"
}
```
