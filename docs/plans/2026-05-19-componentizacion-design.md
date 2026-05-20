# Diseño: Componentización y Migración a Raíz

**Fecha:** 2026-05-19  
**Proyecto:** Arkán Group Site  
**Stack:** Astro 5 + Tailwind v4 + TypeScript

---

## Objetivo

Refactorizar el sitio (actualmente en `/proposal-2/`) como proyecto formal:
- Mover páginas a la raíz (`/`, `/aruba`, `/bakari`, `/black-bash`)
- Separar en componentes reutilizables
- Centralizar el contenido de las 3 marcas en un archivo de datos tipado
- Eliminar proposals 1 y 3

El diseño visual no cambia.

---

## Estructura de datos

**`src/data/brands.ts`** — fuente única de verdad para el contenido de marcas.

```typescript
interface Brand {
  id: 'aruba' | 'bakari' | 'black-bash';
  name: string;
  logoSrc: string;
  tagline: string;
  slug: string;
  statement: {
    heading: string;       // puede incluir <br/>
    tag: string;
    paragraphs: string[];
    features?: string[];   // lista para Bakari
    ngu?: string;          // texto NGU para Black Bash
    gridCols: string;
  };
  lookbook: {
    variant: 'aruba' | 'bakari' | 'blackbash';
    title: string;
    images: string[];      // siempre 6
  };
  cta: {
    heading: string;
    detail: string;
    body: string;
    subheading?: string;   // "NEVER GIVE UP" para Black Bash
    waLink: string;
  };
  footerLinks: { href: string; label: string }[];
}
```

---

## Componentes

### `src/layouts/`
| Archivo | Descripción |
|---|---|
| `Layout.astro` | Base HTML + fuentes (renombrado de P2Layout) |
| `BrandPage.astro` | Orquestador: recibe `Brand`, ensambla todos los `Brand*` |

### `src/components/arkan/` — secciones de la home
| Archivo | Descripción |
|---|---|
| `NavArkan.astro` | Nav fija Arkán Group |
| `HeroArkan.astro` | Hero pantalla completa |
| `VisionArkan.astro` | Sección visión (blanca) |
| `MayoreoArkan.astro` | Sección mayoreo + stats + badge |
| `MarcasArkan.astro` | Grid de las 3 marcas |
| `FooterArkan.astro` | Footer Arkán Group |

### `src/components/brand/` — secciones de páginas de marca
| Archivo | Props clave |
|---|---|
| `BrandNav.astro` | `logoSrc`, `brandName` |
| `BrandHero.astro` | `brand: Brand` |
| `BrandStatement.astro` | `brand: Brand` |
| `BrandLookbook.astro` | `brand: Brand` |
| `BrandCta.astro` | `brand: Brand` |
| `BrandFooter.astro` | `brand: Brand` |

### `src/components/ui/`
| Archivo | Props |
|---|---|
| `NacionalBadge.astro` | `variant: 'dark' \| 'light'` |

---

## Páginas resultantes

```
src/pages/
  index.astro        → /          (Arkán Group)
  aruba.astro        → /aruba
  bakari.astro       → /bakari
  black-bash.astro   → /black-bash
```

Cada página de marca = ~6 líneas:
```astro
---
import { getBrand } from '../data/brands';
import BrandPage from '../layouts/BrandPage.astro';
const brand = getBrand('aruba')!;
---
<BrandPage {brand} />
```

---

## Limpieza

- Eliminar `src/pages/proposal-1/` (4 archivos)
- Eliminar `src/pages/proposal-2/` (4 archivos)
- Eliminar `src/pages/proposal-3/` (4 archivos)
- Eliminar `src/layouts/P1Layout.astro`, `P2Layout.astro`, `P3Layout.astro`
- `src/pages/index.astro` actual se reemplaza con la home de Arkán

---

## Criterio de éxito

- `npx astro build` sin errores
- Las 4 rutas responden con el mismo diseño visual que antes
- Añadir una nueva marca = solo agregar un objeto a `brands.ts` y una página de ~6 líneas
