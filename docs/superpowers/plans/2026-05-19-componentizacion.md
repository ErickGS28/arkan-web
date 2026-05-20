# Componentización Arkán Group — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar el sitio de proposal-2 a proyecto formal con rutas en raíz, componentes por sección y datos de marcas centralizados en un archivo TypeScript.

**Architecture:** Datos en `src/data/brands.ts` → consumidos por componentes en `src/components/arkan/` y `src/components/brand/` → orquestados por `src/layouts/BrandPage.astro` → páginas de ~6 líneas en `src/pages/`. El diseño visual no cambia.

**Tech Stack:** Astro 5.18, Tailwind v4 (via @tailwindcss/vite), TypeScript, Google Fonts (Bebas Neue + Syne)

---

## Mapa de archivos

### Eliminar
- `src/pages/proposal-1/` (4 archivos)
- `src/pages/proposal-2/` (4 archivos)
- `src/pages/proposal-3/` (4 archivos)
- `src/layouts/P1Layout.astro`
- `src/layouts/P2Layout.astro`
- `src/layouts/P3Layout.astro`
- `src/pages/index.astro` (selector viejo)

### Crear
```
src/
├── data/
│   └── brands.ts
├── layouts/
│   ├── Layout.astro
│   └── BrandPage.astro
├── components/
│   ├── ui/
│   │   └── NacionalBadge.astro
│   ├── arkan/
│   │   ├── NavArkan.astro
│   │   ├── HeroArkan.astro
│   │   ├── VisionArkan.astro
│   │   ├── MayoreoArkan.astro
│   │   ├── MarcasArkan.astro
│   │   └── FooterArkan.astro
│   └── brand/
│       ├── BrandNav.astro
│       ├── BrandHero.astro
│       ├── BrandStatement.astro
│       ├── BrandLookbook.astro
│       ├── BrandCta.astro
│       └── BrandFooter.astro
└── pages/
    ├── index.astro
    ├── aruba.astro
    ├── bakari.astro
    └── black-bash.astro
```

---

## Task 1: Limpieza del workspace

**Files:**
- Delete: `src/pages/proposal-1/`, `src/pages/proposal-2/`, `src/pages/proposal-3/`
- Delete: `src/layouts/P1Layout.astro`, `src/layouts/P2Layout.astro`, `src/layouts/P3Layout.astro`
- Delete: `src/pages/index.astro`

- [ ] **Step 1: Eliminar páginas de propuestas y layouts viejos**

```bash
rm -rf src/pages/proposal-1 src/pages/proposal-2 src/pages/proposal-3
rm src/layouts/P1Layout.astro src/layouts/P2Layout.astro src/layouts/P3Layout.astro
rm src/pages/index.astro
```

- [ ] **Step 2: Verificar que el build falla (esperado — no hay páginas)**

```bash
npx astro build 2>&1 | tail -5
```
Expected: error o 0 páginas built. Confirma que limpieza fue correcta.

- [ ] **Step 3: Commit limpieza**

```bash
git add -A
git commit -m "chore: eliminar propuestas 1 y 3, limpiar workspace"
```

---

## Task 2: Layout base

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Crear Layout.astro**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Arkán Group' } = Astro.props;
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #0A0A0A;
      color: #F0F0F0;
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img { max-width: 100%; display: block; }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 2: Verificar que el archivo existe**

```bash
ls src/layouts/
```
Expected: `Layout.astro`

---

## Task 3: Datos de marcas

**Files:**
- Create: `src/data/brands.ts`

- [ ] **Step 1: Crear brands.ts con la interfaz y los 3 objetos de marca**

```typescript
// src/data/brands.ts

export interface Brand {
  id: 'aruba' | 'bakari' | 'black-bash';
  name: string;
  logoSrc: string;
  tagline: string;
  slug: string;
  statement: {
    heading: string;
    tag: string;
    paragraphs: string[];
    features?: string[];
    ngu?: string;
    gridCols: string;
  };
  lookbook: {
    variant: 'aruba' | 'bakari' | 'blackbash';
    title: string;
    images: string[];
  };
  cta: {
    heading: string;
    detail: string;
    body: string;
    subheading?: string;
    waLink: string;
  };
  footerLinks: { href: string; label: string }[];
}

const aruba: Brand = {
  id: 'aruba',
  name: 'ARUBA JEANS',
  logoSrc: '/logos/aruba.jpg',
  tagline: 'The best jeans for your body',
  slug: '/aruba',
  statement: {
    heading: 'THE BEST<br/>JEANS FOR<br/>YOUR BODY',
    tag: 'Identidad de Marca',
    paragraphs: [
      'Aruba Jeans nació con una misión clara: crear el jean definitivo para la mujer latinoamericana. Cada corte está diseñado para adaptarse a la figura real, resaltando lo que la mujer quiere resaltar sin sacrificar la comodidad.',
      'Denim colombiano de alta calidad. Costuras reforzadas. Telas con elasticidad controlada que mantienen la forma después de múltiples lavados. Una marca que el mercado femenino reconoce y busca activamente.',
      'Ideal para boutiques, tiendas de moda femenina y revendedoras enfocadas en un segmento de consumidora consciente y exigente.',
    ],
    gridCols: '1.2fr 1fr',
  },
  lookbook: {
    variant: 'aruba',
    title: 'Lookbook · Colección',
    images: [
      '/img/aruba/01.png',
      '/img/aruba/02.png',
      '/img/aruba/03.png',
      '/img/aruba/04.png',
      '/img/aruba/05.png',
      '/img/aruba/06.png',
    ],
  },
  cta: {
    heading: 'DISTRIBUYE<br/>ARUBA JEANS',
    detail: 'Inversión desde $4,200 · 12 piezas con envío',
    body: 'Accede a uno de los denim femeninos de mayor rotación del mercado. Producto con identidad propia, clientas que regresan y márgenes atractivos por pieza.',
    waLink: 'https://wa.me/521XXXXXXXXXX',
  },
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/bakari', label: 'Bakari' },
    { href: '/black-bash', label: 'Black Bash' },
  ],
};

const bakari: Brand = {
  id: 'bakari',
  name: 'BKR BAKARI',
  logoSrc: '/logos/bakari.jpg',
  tagline: 'Basic & Fit Denim Stretch Comfort',
  slug: '/bakari',
  statement: {
    heading: 'BASIC.<br/>FIT.<br/>COMFORT.',
    tag: 'Identidad de Marca',
    paragraphs: [
      'Bakari es la línea que domina el volumen. Diseñada para el cliente cotidiano que busca calidad sin complicaciones: un jean que entra bien, que dura, que se lava sin perder forma.',
      'Stretch de alto desempeño. Cortes neutros y versátiles. Una paleta de colores calculada para maximizar la rotación en punto de venta. BKR Bakari es el producto que vende todos los días.',
    ],
    features: [
      'Tela stretch de alta recuperación',
      'Costuras reforzadas de 5 bolsillos',
      'Tallas amplias — cobertura total del mercado',
      'Precio mayoreo competitivo',
    ],
    gridCols: '1.1fr 1fr',
  },
  lookbook: {
    variant: 'bakari',
    title: 'Catálogo · Colección',
    images: [
      '/img/bakari/01.png',
      '/img/bakari/02.png',
      '/img/bakari/03.png',
      '/img/bakari/04.png',
      '/img/bakari/05.png',
      '/img/bakari/06.png',
    ],
  },
  cta: {
    heading: 'DISTRIBUYE<br/>BKR BAKARI',
    detail: 'Alta rotación · Reventa rápida · Márgenes consistentes',
    body: 'El básico que nunca falla. Invierte en el producto de mayor rotación y construye un ingreso predecible con una marca que se vende sola en cualquier canal.',
    waLink: 'https://wa.me/521XXXXXXXXXX',
  },
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/aruba', label: 'Aruba' },
    { href: '/black-bash', label: 'Black Bash' },
  ],
};

const blackBash: Brand = {
  id: 'black-bash',
  name: 'BLACK BASH MX',
  logoSrc: '/logos/black-bash.jpg',
  tagline: 'Never Give Up',
  slug: '/black-bash',
  statement: {
    heading: 'NEVER<br/>GIVE<br/>UP.',
    tag: 'Never Give Up · Identidad',
    paragraphs: [
      'Black Bash MX no es solo una marca de denim. Es una declaración. Para el cliente urbano que construye su identidad con lo que viste, que no sigue tendencias, que las crea.',
      'Cada pieza fue diseñada con actitud: cortes con carácter, acabados que resisten, un lenguaje visual que conecta con la cultura de calle. Una marca que genera lealtad real porque el cliente se identifica con lo que representa.',
      'Para el distribuidor, eso se traduce en recompra orgánica y clientela fidelizada. No vendes un jean. Vendes una mentalidad.',
    ],
    ngu: 'NEVER GIVE UP.',
    gridCols: '1.2fr 1fr',
  },
  lookbook: {
    variant: 'blackbash',
    title: 'Lookbook · Black Bash',
    images: [
      '/img/black-bash/01.png',
      '/img/black-bash/02.png',
      '/img/black-bash/03.png',
      '/img/black-bash/04.png',
      '/img/black-bash/05.png',
      '/img/black-bash/06.png',
    ],
  },
  cta: {
    heading: 'DISTRIBUYE<br/>BLACK BASH MX',
    detail: '',
    subheading: 'NEVER GIVE UP',
    body: 'Lleva la marca más auténtica del streetwear denim mexicano a tu punto de venta. Producto que habla solo, clientela que regresa, márgenes que justifican la apuesta.',
    waLink: 'https://wa.me/521XXXXXXXXXX',
  },
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/aruba', label: 'Aruba' },
    { href: '/bakari', label: 'Bakari' },
  ],
};

export const brands: Brand[] = [aruba, bakari, blackBash];
export const getBrand = (id: string): Brand | undefined =>
  brands.find((b) => b.id === id);
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: sin errores de tipo.

---

## Task 4: NacionalBadge

**Files:**
- Create: `src/components/ui/NacionalBadge.astro`

- [ ] **Step 1: Crear NacionalBadge.astro**

```astro
---
// src/components/ui/NacionalBadge.astro
interface Props {
  variant?: 'light' | 'dark';
}
const { variant = 'light' } = Astro.props;
---

<div class:list={['badge', variant]}>
  <span class="flag">🇲🇽</span>
  <span class="text">Distribución Nacional</span>
</div>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px;
    margin-bottom: 32px;
  }
  .badge.light {
    background: #F0F0F0;
    border: 1px solid #E0E0E0;
  }
  .badge.dark {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid #2A2A2A;
  }
  .flag { font-size: 20px; line-height: 1; }
  .text {
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .badge.light .text { color: #0A0A0A; }
  .badge.dark .text { color: #888; }
</style>
```

---

## Task 5: Componentes Arkán (home)

**Files:**
- Create: `src/components/arkan/NavArkan.astro`
- Create: `src/components/arkan/HeroArkan.astro`
- Create: `src/components/arkan/VisionArkan.astro`
- Create: `src/components/arkan/MayoreoArkan.astro`
- Create: `src/components/arkan/MarcasArkan.astro`
- Create: `src/components/arkan/FooterArkan.astro`

- [ ] **Step 1: Crear NavArkan.astro**

```astro
---
// src/components/arkan/NavArkan.astro
---

<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #0A0A0A;
    border-top: 2px solid #FFFFFF;
    border-bottom: 1px solid #1A1A1A;
    padding: 0 48px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeIn 0.6s ease both;
  }
  .nav-brand { display: flex; align-items: center; gap: 14px; }
  .nav-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 2px; }
  .nav-name-wrap { display: flex; flex-direction: column; line-height: 1; }
  .nav-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px; letter-spacing: 6px; color: #F0F0F0; line-height: 1;
  }
  .nav-sub {
    font-family: 'Syne', sans-serif;
    font-size: 9px; letter-spacing: 4px; color: #555;
    text-transform: uppercase; margin-top: 2px;
  }
  .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .nav-links a {
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: 2.5px;
    text-transform: uppercase; color: #888; transition: color 0.2s ease;
  }
  .nav-links a:hover { color: #FFFFFF; }

  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .nav-links { display: none; }
  }
</style>

<nav class="nav">
  <a href="/" class="nav-brand">
    <img src="/logos/arkan.jpg" alt="Arkán" class="nav-logo" />
    <div class="nav-name-wrap">
      <span class="nav-title">ARKÁN</span>
      <span class="nav-sub">Group</span>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="#vision">Visión</a></li>
    <li><a href="#mayoreo">Mayoreo</a></li>
    <li><a href="#marcas">Marcas</a></li>
  </ul>
</nav>
```

- [ ] **Step 2: Crear HeroArkan.astro**

```astro
---
// src/components/arkan/HeroArkan.astro
---

<style>
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero {
    min-height: 100vh; background: #0A0A0A;
    display: flex; align-items: center; justify-content: center;
    padding-top: 64px;
  }
  .hero-inner {
    display: flex; flex-direction: column;
    align-items: center; text-align: center; gap: 20px;
  }
  .hero-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px; letter-spacing: 5px; color: #FFFFFF;
    text-transform: uppercase;
    animation: slideUp 0.7s 0.1s ease both;
  }
  .hero-logo {
    width: 100px; height: 100px; object-fit: contain;
    animation: slideUp 0.7s 0.2s ease both;
  }
  .hero-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(72px, 10vw, 140px);
    letter-spacing: 8px; color: #F0F0F0; line-height: 0.95;
    animation: slideUp 0.7s 0.3s ease both;
  }
  .hero-divider {
    width: 60px; height: 1px; background: #FFFFFF;
    animation: slideUp 0.7s 0.4s ease both;
  }
  .hero-sub {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 400; letter-spacing: 4px;
    color: #555; text-transform: uppercase;
    animation: slideUp 0.7s 0.5s ease both;
  }
  .hero-ctas {
    display: flex; gap: 16px; margin-top: 8px;
    animation: slideUp 0.7s 0.6s ease both;
  }
  .btn-white {
    background: #FFFFFF; color: #0A0A0A;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; padding: 14px 32px; border: none;
    cursor: pointer; transition: background 0.2s ease;
    text-decoration: none; display: inline-block;
  }
  .btn-white:hover { background: #E0E0E0; }
  .btn-outline {
    background: transparent; color: #F0F0F0;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; padding: 14px 32px;
    border: 1px solid rgba(240,240,240,0.3); cursor: pointer;
    transition: border-color 0.2s ease;
    text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { border-color: #F0F0F0; }

  @media (max-width: 768px) {
    .hero-heading { font-size: clamp(52px, 14vw, 90px); letter-spacing: 4px; }
    .hero-ctas { flex-direction: column; width: 100%; padding: 0 20px; }
  }
</style>

<section class="hero">
  <div class="hero-inner">
    <span class="hero-label">Consorcio Premium · México</span>
    <img src="/logos/arkan.jpg" alt="Arkán Group" class="hero-logo" />
    <h1 class="hero-heading">ARKÁN GROUP</h1>
    <div class="hero-divider"></div>
    <p class="hero-sub">Denim Premium · Venta Mayoreo · México</p>
    <div class="hero-ctas">
      <a href="#marcas" class="btn-white">Explorar Marcas</a>
      <a href="#mayoreo" class="btn-outline">Mayoreo</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Crear VisionArkan.astro**

```astro
---
// src/components/arkan/VisionArkan.astro
---

<style>
  .vision {
    background: #FFFFFF; padding: 120px 80px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
  }
  .vision-left { display: flex; gap: 20px; align-items: flex-start; }
  .vision-accent {
    width: 4px; background: #0A0A0A;
    align-self: stretch; flex-shrink: 0; min-height: 120px;
  }
  .vision-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 6vw, 88px);
    color: #0A0A0A; line-height: 0.9; letter-spacing: 3px;
  }
  .vision-right p {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 400; line-height: 1.9; color: #555;
  }
  .vision-right p + p { margin-top: 20px; }

  @media (max-width: 768px) {
    .vision { grid-template-columns: 1fr; gap: 48px; padding: 80px 24px; }
  }
</style>

<section class="vision" id="vision">
  <div class="vision-left">
    <div class="vision-accent"></div>
    <h2 class="vision-heading">NUESTRA<br/>VISIÓN</h2>
  </div>
  <div class="vision-right">
    <p>Arkán Group es un consorcio mayorista especializado en denim premium de origen colombiano y líneas básicas de alto desempeño. Operamos en el segmento B2B, distribuyendo marcas de moda con identidad propia a revendedores, boutiques y emprendedores de moda en toda la República Mexicana.</p>
    <p>Nuestra propuesta de valor se fundamenta en calidad de tela, cortes actuales y precios competitivos a escala mayoreo. Somos el puente entre la manufactura de excelencia y el comerciante que exige producto diferenciado.</p>
    <p>Tres marcas. Una sola filosofía: denim que vende solo.</p>
  </div>
</section>
```

- [ ] **Step 4: Crear MayoreoArkan.astro**

```astro
---
// src/components/arkan/MayoreoArkan.astro
import NacionalBadge from '../ui/NacionalBadge.astro';
---

<style>
  .mayoreo {
    background: #0A0A0A; padding: 120px 80px;
    text-align: center; border-top: 1px solid #1A1A1A;
  }
  .mayoreo-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; letter-spacing: 8px; color: #FFFFFF;
    margin-bottom: 24px; text-transform: uppercase;
  }
  .mayoreo-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(42px, 5vw, 68px);
    letter-spacing: 4px; color: #F0F0F0; margin-bottom: 16px;
  }
  .mayoreo-body {
    font-family: 'Syne', sans-serif;
    font-size: 15px; color: #666;
    max-width: 500px; margin: 0 auto 32px; line-height: 1.8;
  }
  .mayoreo-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px; margin-bottom: 48px; border: 1px solid #1A1A1A;
  }
  .stat-cell {
    background: #111; padding: 48px 32px; border: 1px solid #1A1A1A;
  }
  .stat-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 7vw, 96px);
    color: #F0F0F0; line-height: 1; letter-spacing: 2px;
  }
  .stat-label {
    font-family: 'Syne', sans-serif;
    font-size: 10px; letter-spacing: 3px; color: #888;
    text-transform: uppercase; margin-top: 8px;
  }
  .btn-white {
    background: #FFFFFF; color: #0A0A0A;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; padding: 14px 32px; border: none;
    cursor: pointer; transition: background 0.2s ease;
    text-decoration: none; display: inline-block;
  }
  .btn-white:hover { background: #E0E0E0; }

  @media (max-width: 768px) {
    .mayoreo { padding: 80px 24px; }
    .mayoreo-stats { grid-template-columns: 1fr; }
  }
</style>

<section class="mayoreo" id="mayoreo">
  <p class="mayoreo-eyebrow">Venta 100% Mayoreo</p>
  <h2 class="mayoreo-heading">INVIERTE Y GENERA<br/>INGRESO CONSTANTE</h2>
  <p class="mayoreo-body">Producto con alta rotación. Moda que el cliente final ya busca. Invierte en inventario probado y construye un canal de venta rentable desde el primer lote.</p>
  <NacionalBadge variant="dark" />
  <div class="mayoreo-stats">
    <div class="stat-cell">
      <div class="stat-number">$4,200</div>
      <div class="stat-label">Inversión inicial · Aruba</div>
    </div>
    <div class="stat-cell">
      <div class="stat-number">12 pzs</div>
      <div class="stat-label">Mínimo de compra</div>
    </div>
    <div class="stat-cell">
      <div class="stat-number">$2,700+</div>
      <div class="stat-label">Ganancia estimada por lote</div>
    </div>
  </div>
  <a href="https://wa.me/521XXXXXXXXXX" class="btn-white">Contáctanos</a>
</section>
```

- [ ] **Step 5: Crear MarcasArkan.astro**

```astro
---
// src/components/arkan/MarcasArkan.astro
import { brands } from '../../data/brands';
---

<style>
  .marcas { background: #FFFFFF; padding: 120px 80px; }
  .marcas-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px; letter-spacing: 8px; color: #0A0A0A;
    text-transform: uppercase; margin-bottom: 64px;
  }
  .brand-card {
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; background: #F5F5F5;
    margin-bottom: 2px; transition: background 0.25s ease; cursor: pointer;
  }
  .brand-card:hover { background: #EBEBEB; }
  .brand-card-left {
    padding: 56px 48px; border-left: 3px solid #0A0A0A;
    display: flex; flex-direction: column; gap: 12px;
  }
  .brand-card-logo { width: 80px; height: 80px; object-fit: contain; }
  .brand-card-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px; letter-spacing: 3px; color: #0A0A0A; line-height: 1;
  }
  .brand-card-tag { font-family: 'Syne', sans-serif; font-size: 14px; font-style: italic; color: #888; }
  .brand-card-right {
    padding: 56px 48px; display: flex; flex-direction: column; gap: 20px;
    border-left: 1px solid #E0E0E0;
  }
  .brand-card-desc { font-family: 'Syne', sans-serif; font-size: 14px; line-height: 1.85; color: #666; }
  .brand-card-link {
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 2px; color: #0A0A0A; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 8px;
    transition: gap 0.2s ease; text-decoration: none;
  }
  .brand-card-link:hover { gap: 14px; }

  @media (max-width: 768px) {
    .marcas { padding: 80px 24px; }
    .brand-card { grid-template-columns: 1fr; }
    .brand-card-right { border-left: none; border-top: 1px solid #E0E0E0; }
  }
</style>

<!-- Descripciones (copy de marketing, no en brands.ts por ser exclusivo de la home) -->
{(() => {
  const descs: Record<string, string> = {
    aruba: 'Denim colombiano de corte femenino. Diseñado para resaltar la figura, construido para durar. Aruba Jeans es sinónimo de calidad sensorial y estética lifestyle. Su propuesta visual conecta con la mujer que invierte en cómo se ve y cómo se siente.',
    bakari: 'Línea básica de stretch premium. Bakari apuesta por la comodidad sin sacrificar el perfil. Cortes limpios, telas de alto desempeño y una paleta neutra que convierte cada pieza en un básico de guardarropa. Ideal para el cliente cotidiano y la reventa rápida.',
    'black-bash': 'Streetwear premium con actitud. Black Bash MX es la marca para el cliente urbano que busca identidad en la ropa. Denim con carácter, prendas que comunican. Una línea diseñada para destacar en el punto de venta y generar recompra orgánica por lealtad de marca.',
  };
  return null;
})()}

<section class="marcas" id="marcas">
  <p class="marcas-eyebrow">Nuestras Marcas</p>
  {brands.map((brand) => {
    const descs: Record<string, string> = {
      aruba: 'Denim colombiano de corte femenino. Diseñado para resaltar la figura, construido para durar. Su propuesta visual conecta con la mujer que invierte en cómo se ve y cómo se siente.',
      bakari: 'Línea básica de stretch premium. Cortes limpios, telas de alto desempeño y una paleta neutra que convierte cada pieza en un básico de guardarropa. Ideal para el cliente cotidiano y la reventa rápida.',
      'black-bash': 'Streetwear premium con actitud. Denim con carácter, prendas que comunican. Una línea diseñada para destacar en el punto de venta y generar recompra orgánica por lealtad de marca.',
    };
    return (
      <a href={brand.slug} style="text-decoration:none;display:block;">
        <div class="brand-card">
          <div class="brand-card-left">
            <img src={brand.logoSrc} alt={brand.name} class="brand-card-logo" />
            <div class="brand-card-name">{brand.name}</div>
            <div class="brand-card-tag">{brand.tagline}</div>
          </div>
          <div class="brand-card-right">
            <p class="brand-card-desc">{descs[brand.id]}</p>
            <span class="brand-card-link">Ver Colección →</span>
          </div>
        </div>
      </a>
    );
  })}
</section>
```

- [ ] **Step 6: Crear FooterArkan.astro**

```astro
---
// src/components/arkan/FooterArkan.astro
---

<style>
  .footer {
    background: #0A0A0A; border-top: 1px solid #1A1A1A;
    padding: 60px 80px;
    display: flex; flex-direction: column; align-items: center;
    gap: 24px; text-align: center;
  }
  .footer-brand { display: flex; align-items: center; gap: 12px; }
  .footer-logo { width: 48px; height: 48px; object-fit: contain; opacity: 0.5; }
  .footer-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px; letter-spacing: 5px; color: #555;
  }
  .footer-brands {
    font-family: 'Syne', sans-serif;
    font-size: 11px; letter-spacing: 3px; color: #333; text-transform: uppercase;
  }
  .footer-tag {
    font-family: 'Syne', sans-serif;
    font-size: 11px; letter-spacing: 2px; color: #333; text-transform: uppercase;
  }

  @media (max-width: 768px) { .footer { padding: 48px 24px; } }
</style>

<footer class="footer">
  <div class="footer-brand">
    <img src="/logos/arkan.jpg" alt="Arkán" class="footer-logo" />
    <span class="footer-name">ARKÁN GROUP</span>
  </div>
  <p class="footer-brands">Aruba Jeans · BKR Bakari · Black Bash MX</p>
  <p class="footer-tag">Mayoreo · México · Envíos a toda la República</p>
</footer>
```

- [ ] **Step 7: Commit componentes Arkán**

```bash
git add src/components/arkan/ src/components/ui/
git commit -m "feat: componentes secciones Arkán Group home"
```

---

## Task 6: Componentes Brand

**Files:**
- Create: `src/components/brand/BrandNav.astro`
- Create: `src/components/brand/BrandHero.astro`
- Create: `src/components/brand/BrandStatement.astro`
- Create: `src/components/brand/BrandLookbook.astro`
- Create: `src/components/brand/BrandCta.astro`
- Create: `src/components/brand/BrandFooter.astro`

- [ ] **Step 1: Crear BrandNav.astro**

```astro
---
// src/components/brand/BrandNav.astro
import type { Brand } from '../../data/brands';
interface Props { brand: Brand; }
const { brand } = Astro.props;
---

<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #0A0A0A; border-top: 2px solid #FFFFFF;
    border-bottom: 1px solid #1A1A1A;
    padding: 0 48px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeIn 0.5s ease both;
  }
  .nav-brand { display: flex; align-items: center; gap: 14px; }
  .nav-logo { width: 38px; height: 38px; object-fit: contain; border-radius: 2px; }
  .nav-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px; letter-spacing: 5px; color: #F0F0F0;
  }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-links a {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: #666; transition: color 0.2s ease;
  }
  .nav-links a:hover { color: #FFFFFF; }
  .nav-back {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 2px; color: #F0F0F0; text-transform: uppercase;
    text-decoration: none; transition: color 0.2s ease;
  }
  .nav-back:hover { color: #FFFFFF; }

  @media (max-width: 768px) { .nav { padding: 0 20px; } .nav-links { display: none; } }
</style>

<nav class="nav">
  <div class="nav-brand">
    <img src={brand.logoSrc} alt={brand.name} class="nav-logo" />
    <span class="nav-title">{brand.name}</span>
  </div>
  <ul class="nav-links">
    <li><a href="#statement">Identidad</a></li>
    <li><a href="#lookbook">Lookbook</a></li>
    <li><a href="#cta">Distribución</a></li>
  </ul>
  <a href="/" class="nav-back">← Arkán</a>
</nav>
```

- [ ] **Step 2: Crear BrandHero.astro**

```astro
---
// src/components/brand/BrandHero.astro
import type { Brand } from '../../data/brands';
interface Props { brand: Brand; }
const { brand } = Astro.props;
const heroImg = brand.lookbook.images[0];
---

<style>
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero {
    min-height: 100vh; position: relative;
    background: #0A0A0A; display: flex; align-items: flex-end; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 20%;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 40%,
      rgba(0,0,0,0.82) 80%, rgba(0,0,0,0.97) 100%
    );
  }
  /* strip izquierdo solo en black-bash */
  .hero-strip {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: #FFFFFF; z-index: 3;
  }
  .hero-content {
    position: relative; z-index: 2; width: 100%;
    padding: 80px 80px 100px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 18px;
  }
  .hero-logo {
    width: 120px; height: 120px; object-fit: contain;
    animation: slideUp 0.8s 0.15s ease both;
  }
  .hero-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 11vw, 150px);
    letter-spacing: 8px; color: #F0F0F0; line-height: 0.95;
    animation: slideUp 0.8s 0.25s ease both;
  }
  .hero-tagline {
    font-family: 'Syne', sans-serif; font-size: 16px;
    font-style: italic; font-weight: 400;
    color: rgba(240,240,240,0.7); letter-spacing: 3px;
    animation: slideUp 0.8s 0.35s ease both;
  }
  .hero-ngu {
    font-family: 'Syne', sans-serif;
    font-size: clamp(13px, 1.8vw, 18px); font-weight: 700;
    letter-spacing: 10px; color: #FFFFFF; text-transform: uppercase;
    animation: slideUp 0.8s 0.35s ease both;
  }
  .hero-divider {
    width: 40px; height: 1px; background: #FFFFFF;
    animation: slideUp 0.8s 0.45s ease both;
  }
  .hero-cta { animation: slideUp 0.8s 0.55s ease both; margin-top: 4px; }
  .btn-outline-white {
    background: transparent; color: #F0F0F0;
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    padding: 14px 36px; border: 1px solid rgba(255,255,255,0.5);
    cursor: pointer; transition: border-color 0.2s ease, background 0.2s ease;
    text-decoration: none; display: inline-block;
  }
  .btn-outline-white:hover { border-color: #FFFFFF; background: rgba(255,255,255,0.08); }

  @media (max-width: 768px) {
    .hero-content { padding: 20px 20px 80px; }
    .hero-heading { font-size: clamp(48px, 14vw, 80px); letter-spacing: 4px; }
  }
</style>

<section class="hero">
  <div class="hero-bg" style={`background-image: url('${heroImg}')`}></div>
  <div class="hero-overlay"></div>
  {brand.id === 'black-bash' && <div class="hero-strip"></div>}
  <div class="hero-content">
    <img src={brand.logoSrc} alt={brand.name} class="hero-logo" />
    <h1 class="hero-heading">{brand.name}</h1>
    {brand.id === 'black-bash'
      ? <p class="hero-ngu">{brand.tagline}</p>
      : <p class="hero-tagline">{brand.tagline}</p>
    }
    <div class="hero-divider"></div>
    <div class="hero-cta">
      <a href="#lookbook" class="btn-outline-white">
        {brand.id === 'aruba' ? 'Ver Lookbook' : brand.id === 'bakari' ? 'Ver Colección' : 'Ver Lookbook'}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Crear BrandStatement.astro**

```astro
---
// src/components/brand/BrandStatement.astro
import type { Brand } from '../../data/brands';
interface Props { brand: Brand; }
const { brand } = Astro.props;
const { statement } = brand;
---

<style>
  .statement {
    background: #FFFFFF; padding: 120px 80px;
    display: grid; align-items: center; gap: 80px;
  }
  .statement-left { display: flex; gap: 20px; align-items: flex-start; }
  .statement-bar {
    width: 4px; background: #0A0A0A;
    align-self: stretch; flex-shrink: 0; min-height: 100px;
  }
  .statement-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 8vw, 112px);
    color: #0A0A0A; line-height: 0.9; letter-spacing: 3px;
  }
  .statement-right { display: flex; flex-direction: column; gap: 20px; }
  .statement-tag {
    font-family: 'Syne', sans-serif; font-size: 10px;
    letter-spacing: 4px; color: #0A0A0A; text-transform: uppercase;
  }
  .statement-right p {
    font-family: 'Syne', sans-serif; font-size: 15px; line-height: 1.9; color: #555;
  }
  .feature-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
  .feature-list li {
    font-family: 'Syne', sans-serif; font-size: 13px; color: #666;
    display: flex; align-items: center; gap: 10px;
  }
  .feature-list li::before {
    content: ''; display: block; width: 20px; height: 1px;
    background: #0A0A0A; flex-shrink: 0;
  }
  .statement-ngu {
    font-family: 'Bebas Neue', sans-serif; font-size: 28px;
    letter-spacing: 6px; color: #CCCCCC; margin-top: 8px;
  }

  @media (max-width: 768px) {
    .statement { grid-template-columns: 1fr !important; gap: 48px; padding: 80px 24px; }
  }
</style>

<section
  class="statement"
  id="statement"
  style={`grid-template-columns: ${statement.gridCols}`}
>
  <div class="statement-left">
    <div class="statement-bar"></div>
    <h2 class="statement-heading" set:html={statement.heading} />
  </div>
  <div class="statement-right">
    <span class="statement-tag">{statement.tag}</span>
    {statement.paragraphs.map((p) => <p>{p}</p>)}
    {statement.features && (
      <ul class="feature-list">
        {statement.features.map((f) => <li>{f}</li>)}
      </ul>
    )}
    {statement.ngu && <div class="statement-ngu">{statement.ngu}</div>}
  </div>
</section>
```

- [ ] **Step 4: Crear BrandLookbook.astro**

```astro
---
// src/components/brand/BrandLookbook.astro
import type { Brand } from '../../data/brands';
interface Props { brand: Brand; }
const { brand } = Astro.props;
const { lookbook } = brand;

// Configuración de grid por variante
const gridConfig = {
  aruba:     { rows: '480px 380px', cellClass: (i: number) => i === 0 || i === 3 ? 'cell cell-wide' : 'cell' },
  bakari:    { rows: '420px 420px', cellClass: (_: number) => 'cell' },
  blackbash: { rows: '520px 420px', cellClass: (i: number) => i === 0 ? 'cell cell-tall' : 'cell' },
};
const config = gridConfig[lookbook.variant];
---

<style>
  .lookbook { background: #080808; padding: 0; }
  .lookbook-header {
    padding: 80px 80px 48px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .lookbook-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px; letter-spacing: 8px; color: #FFFFFF; text-transform: uppercase;
  }
  .lookbook-count { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 2px; color: #444; }
  .lookbook-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px; padding: 0 80px 80px;
    background: #1A1A1A;
  }
  .cell { overflow: hidden; position: relative; }
  .cell-wide { grid-column: span 2; }
  .cell-tall { grid-row: span 2; }
  .cell img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s ease, filter 0.4s ease;
    filter: brightness(0.88);
  }
  .cell:hover img { transform: scale(1.04); filter: brightness(1); }
  .cell::after {
    content: ''; position: absolute; inset: 0;
    border: 2px solid transparent;
    transition: border-color 0.3s ease; pointer-events: none;
  }
  .cell:hover::after { border-color: #FFFFFF; }

  @media (max-width: 768px) {
    .lookbook-header { padding: 48px 24px 32px; }
    .lookbook-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto !important; padding: 0 24px 48px; }
    .cell, .cell-wide, .cell-tall { grid-column: span 1 !important; grid-row: span 1 !important; height: 240px; }
  }
</style>

<section class="lookbook" id="lookbook">
  <div class="lookbook-header">
    <span class="lookbook-title">{lookbook.title}</span>
    <span class="lookbook-count">0{lookbook.images.length} imágenes</span>
  </div>
  <div class="lookbook-grid" style={`grid-template-rows: ${config.rows}`}>
    {lookbook.images.map((src, i) => (
      <div class={config.cellClass(i)}>
        <img src={src} alt={`${brand.name} ${String(i + 1).padStart(2, '0')}`} />
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 5: Crear BrandCta.astro**

```astro
---
// src/components/brand/BrandCta.astro
import type { Brand } from '../../data/brands';
import NacionalBadge from '../ui/NacionalBadge.astro';
interface Props { brand: Brand; }
const { brand } = Astro.props;
const { cta } = brand;
const isBlackBash = brand.id === 'black-bash';
---

<style>
  .cta-section {
    background: #FFFFFF; padding: 120px 80px;
    text-align: center; position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 1px; background: #E0E0E0;
  }
  /* Watermark NGU solo para black-bash */
  .cta-section.blackbash::after {
    content: 'NGU'; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(160px, 25vw, 320px); letter-spacing: -10px;
    color: rgba(0,0,0,0.04); pointer-events: none;
    line-height: 1; white-space: nowrap;
  }
  .cta-eyebrow {
    position: relative; z-index: 2;
    font-family: 'Syne', sans-serif; font-size: 10px;
    letter-spacing: 5px; color: #0A0A0A; text-transform: uppercase; margin-bottom: 24px;
  }
  .cta-heading {
    position: relative; z-index: 2;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 7vw, 96px); letter-spacing: 4px;
    color: #0A0A0A; line-height: 0.95; margin-bottom: 24px;
  }
  .cta-subheading {
    position: relative; z-index: 2;
    font-family: 'Bebas Neue', sans-serif; font-size: 22px;
    letter-spacing: 10px; color: #AAAAAA; margin-bottom: 24px;
  }
  .cta-detail {
    position: relative; z-index: 2;
    font-family: 'Syne', sans-serif; font-size: 11px;
    letter-spacing: 3px; color: #999; text-transform: uppercase; margin-bottom: 20px;
  }
  .cta-body {
    position: relative; z-index: 2;
    font-family: 'Syne', sans-serif; font-size: 15px; color: #666;
    max-width: 440px; margin: 0 auto 48px; line-height: 1.8;
  }
  .btn-black {
    position: relative; z-index: 2;
    background: #0A0A0A; color: #FFFFFF;
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    padding: 14px 36px; border: none; cursor: pointer;
    transition: background 0.2s ease; text-decoration: none; display: inline-block;
  }
  .btn-black:hover { background: #222; }

  :global(.cta-badge-wrap) { position: relative; z-index: 2; }

  @media (max-width: 768px) { .cta-section { padding: 80px 24px; } .cta-section.blackbash::after { display: none; } }
</style>

<section class:list={['cta-section', { blackbash: isBlackBash }]} id="cta">
  <p class="cta-eyebrow">Venta Mayoreo · Distribución</p>
  <h2 class="cta-heading" set:html={cta.heading} />
  {cta.subheading && <p class="cta-subheading">{cta.subheading}</p>}
  {cta.detail && <p class="cta-detail">{cta.detail}</p>}
  <div class="cta-badge-wrap"><NacionalBadge variant="light" /></div>
  <p class="cta-body">{cta.body}</p>
  <a href={cta.waLink} class="btn-black">Solicitar Información</a>
</section>
```

- [ ] **Step 6: Crear BrandFooter.astro**

```astro
---
// src/components/brand/BrandFooter.astro
import type { Brand } from '../../data/brands';
interface Props { brand: Brand; }
const { brand } = Astro.props;
---

<style>
  .footer {
    background: #050505; border-top: 1px solid #1A1A1A;
    padding: 60px 80px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-brand { display: flex; align-items: center; gap: 10px; }
  .footer-logo { width: 40px; height: 40px; object-fit: contain; opacity: 0.5; }
  .footer-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 4px; color: #555;
  }
  .footer-nav { display: flex; gap: 32px; }
  .footer-nav a {
    font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 2px;
    color: #333; text-transform: uppercase; transition: color 0.2s ease; text-decoration: none;
  }
  .footer-nav a:hover { color: #FFFFFF; }

  @media (max-width: 768px) {
    .footer { flex-direction: column; gap: 24px; text-align: center; padding: 48px 24px; }
  }
</style>

<footer class="footer">
  <div class="footer-brand">
    <img src={brand.logoSrc} alt={brand.name} class="footer-logo" />
    <span class="footer-name">{brand.name}</span>
  </div>
  <nav class="footer-nav">
    {brand.footerLinks.map((link) => (
      <a href={link.href}>{link.label}</a>
    ))}
  </nav>
</footer>
```

- [ ] **Step 7: Commit componentes Brand**

```bash
git add src/components/brand/
git commit -m "feat: componentes secciones páginas de marca"
```

---

## Task 7: BrandPage layout

**Files:**
- Create: `src/layouts/BrandPage.astro`

- [ ] **Step 1: Crear BrandPage.astro**

```astro
---
// src/layouts/BrandPage.astro
import type { Brand } from '../data/brands';
import Layout from './Layout.astro';
import BrandNav from '../components/brand/BrandNav.astro';
import BrandHero from '../components/brand/BrandHero.astro';
import BrandStatement from '../components/brand/BrandStatement.astro';
import BrandLookbook from '../components/brand/BrandLookbook.astro';
import BrandCta from '../components/brand/BrandCta.astro';
import BrandFooter from '../components/brand/BrandFooter.astro';

interface Props { brand: Brand; }
const { brand } = Astro.props;
---

<Layout
  title={`${brand.name} — Arkán Group`}
  description={`${brand.tagline}. Distribución mayorista en México.`}
>
  <BrandNav {brand} />
  <BrandHero {brand} />
  <BrandStatement {brand} />
  <BrandLookbook {brand} />
  <BrandCta {brand} />
  <BrandFooter {brand} />
</Layout>
```

---

## Task 8: Páginas

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/aruba.astro`
- Create: `src/pages/bakari.astro`
- Create: `src/pages/black-bash.astro`

- [ ] **Step 1: Crear src/pages/index.astro**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import NavArkan from '../components/arkan/NavArkan.astro';
import HeroArkan from '../components/arkan/HeroArkan.astro';
import VisionArkan from '../components/arkan/VisionArkan.astro';
import MayoreoArkan from '../components/arkan/MayoreoArkan.astro';
import MarcasArkan from '../components/arkan/MarcasArkan.astro';
import FooterArkan from '../components/arkan/FooterArkan.astro';
---

<Layout
  title="Arkán Group — Consorcio Premium de Moda"
  description="Distribución mayorista de denim premium en México. Aruba Jeans, Bakari BKR, Black Bash MX."
>
  <NavArkan />
  <HeroArkan />
  <VisionArkan />
  <MayoreoArkan />
  <MarcasArkan />
  <FooterArkan />
</Layout>
```

- [ ] **Step 2: Crear src/pages/aruba.astro**

```astro
---
// src/pages/aruba.astro
import { getBrand } from '../data/brands';
import BrandPage from '../layouts/BrandPage.astro';
const brand = getBrand('aruba')!;
---
<BrandPage {brand} />
```

- [ ] **Step 3: Crear src/pages/bakari.astro**

```astro
---
// src/pages/bakari.astro
import { getBrand } from '../data/brands';
import BrandPage from '../layouts/BrandPage.astro';
const brand = getBrand('bakari')!;
---
<BrandPage {brand} />
```

- [ ] **Step 4: Crear src/pages/black-bash.astro**

```astro
---
// src/pages/black-bash.astro
import { getBrand } from '../data/brands';
import BrandPage from '../layouts/BrandPage.astro';
const brand = getBrand('black-bash')!;
---
<BrandPage {brand} />
```

---

## Task 9: Verificación final y commit

- [ ] **Step 1: Build completo**

```bash
npx astro build 2>&1
```
Expected:
```
▶ src/pages/index.astro       → /index.html
▶ src/pages/aruba.astro       → /aruba/index.html
▶ src/pages/bakari.astro      → /bakari/index.html
▶ src/pages/black-bash.astro  → /black-bash/index.html
✓ 4 page(s) built
```

- [ ] **Step 2: Verificar rutas en dev**

```bash
npx astro dev --port 4321
```

Abrir en browser:
- `http://localhost:4321/` → Arkán Group home
- `http://localhost:4321/aruba` → Aruba Jeans
- `http://localhost:4321/bakari` → BKR Bakari
- `http://localhost:4321/black-bash` → Black Bash MX

- [ ] **Step 3: Commit final**

```bash
git add -A
git commit -m "feat: refactorizar a estructura formal con componentes y datos centralizados"
```

---

## Self-Review

**Cobertura del spec:**
- ✅ Eliminar proposals 1, 2, 3
- ✅ Rutas en raíz (`/`, `/aruba`, `/bakari`, `/black-bash`)
- ✅ `brands.ts` con los 3 objetos tipados
- ✅ 13 componentes creados (`ui/`, `arkan/`, `brand/`)
- ✅ `BrandPage.astro` como orquestador
- ✅ Páginas de marca de ~6 líneas
- ✅ Diseño visual sin cambios
- ✅ NacionalBadge reutilizable con variante dark/light

**Consistencia de tipos:**
- `Brand` definido en Task 3, importado con `import type { Brand }` en todos los componentes
- `getBrand()` retorna `Brand | undefined`, páginas usan `!` (safe, datos son fijos)
- `lookbook.variant` tipado como `'aruba' | 'bakari' | 'blackbash'` — coincide con `gridConfig` en BrandLookbook
