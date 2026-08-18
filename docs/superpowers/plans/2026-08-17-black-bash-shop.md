# Black Bash Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, high-fidelity e-commerce demo for Black Bash MX (Home, Catálogo, PDP, Cart/Checkout) as a standalone Astro + Tailwind project, to pitch the client on a real e-commerce build.

**Architecture:** Astro 5 (static output, no adapter) + Tailwind 4 via `@tailwindcss/vite`, mirroring `arkan-web`'s setup. All commerce state (cart) lives in client-side JS + `localStorage` — there is no backend, API, or payment integration anywhere in this project. Content is a static TS data module (`src/data/products.ts`); products without real photography render a styled placeholder tile instead of an image, so no image assets need to be sourced beyond the 6 that already exist.

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript, Vitest (unit tests for cart/data logic only — Astro components are verified via build + manual QA, matching the spec's testing approach).

**Spec:** `docs/superpowers/specs/2026-08-17-black-bash-shop-design.md`

## Global Constraints

- Project root: `C:\ERICK\Proyectos\Lalo\black-bash-shop` (sibling of `arkan-web`, independent `package.json`).
- No backend, no payment gateway, no real order persistence — cart/checkout is a convincing simulation only.
- Design tokens (from spec): background `#0A0A0A`, text `#F0F0F0`, brand red `#A30000` (accents/CTAs/prices only, never large fill), display font **Bebas Neue**, UI/body font **Syne** (400–800), loaded from Google Fonts exactly as `arkan-web/src/layouts/Layout.astro` does.
- Visual direction: "Editorial Streetwear Premium" — asymmetric grid, full-bleed photography, disciplined use of red, generous spacing. Any task that produces visible UI must invoke the **frontend-design** skill while writing the component's markup/styles, using the design tokens above and the spec's per-page description as the brief — the plan defines structure and data wiring, not literal CSS.
- Reuse existing real photography: `arkan-web/public/img/black-bash/01.png`…`06.png` and `arkan-web/public/logos/black-bash.jpg`.
- Categories are fixed to exactly three: `playeras`, `pantalones`, `gorras` (matches existing brand copy in `arkan-web/src/data/brands.ts`).

---

## File Structure

```
black-bash-shop/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── public/
│   ├── logos/black-bash.jpg              (copied from arkan-web)
│   └── img/black-bash/01.png…06.png      (copied from arkan-web)
├── src/
│   ├── env.d.ts
│   ├── styles/global.css                 (Tailwind import + font-face/@theme tokens)
│   ├── lib/cart.ts                       (cart store: pure functions over localStorage)
│   ├── lib/cart.test.ts
│   ├── data/products.ts                  (Product type + PRODUCTS + helpers)
│   ├── data/products.test.ts
│   ├── layouts/ShopLayout.astro          (head, fonts, Nav, CartDrawer, Footer, slot)
│   ├── components/shop/Nav.astro
│   ├── components/shop/Hero.astro
│   ├── components/shop/CategoryStrip.astro
│   ├── components/shop/BrandStatement.astro
│   ├── components/shop/ProductCard.astro
│   ├── components/shop/ProductGrid.astro
│   ├── components/shop/PlaceholderTile.astro
│   ├── components/shop/Filters.astro
│   ├── components/shop/CartDrawer.astro
│   ├── components/shop/Footer.astro
│   ├── components/pdp/Gallery.astro
│   ├── components/pdp/SizeSelector.astro
│   ├── components/pdp/DetailsAccordion.astro
│   ├── components/pdp/CrossSell.astro
│   └── pages/
│       ├── index.astro
│       ├── shop.astro
│       ├── product/[slug].astro
│       └── checkout.astro
```

---

### Task 1: Project scaffold, design tokens, and real assets

**Files:**
- Create: `black-bash-shop/package.json`
- Create: `black-bash-shop/astro.config.mjs`
- Create: `black-bash-shop/tsconfig.json`
- Create: `black-bash-shop/src/env.d.ts`
- Create: `black-bash-shop/src/styles/global.css`
- Create: `black-bash-shop/public/logos/black-bash.jpg` (copy)
- Create: `black-bash-shop/public/img/black-bash/01.png`…`06.png` (copy)

**Interfaces:**
- Produces: `src/styles/global.css` importable from any layout via `import '../styles/global.css'`; exposes CSS custom properties `--color-bg: #0A0A0A`, `--color-fg: #F0F0F0`, `--color-brand-red: #A30000`, `--font-display: 'Bebas Neue', sans-serif`, `--font-body: 'Syne', sans-serif`.

- [ ] **Step 1: Create the project directory and package.json**

```bash
mkdir -p "C:/ERICK/Proyectos/Lalo/black-bash-shop"
```

`black-bash-shop/package.json`:

```json
{
  "name": "black-bash-shop",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@tailwindcss/vite": "^4.1.6",
    "astro": "^5.7.0",
    "tailwindcss": "^4.1.6"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs and tsconfig.json**

`black-bash-shop/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`black-bash-shop/tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`black-bash-shop/src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 3: Create global.css with design tokens**

`black-bash-shop/src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  --color-bg: #0A0A0A;
  --color-fg: #F0F0F0;
  --color-brand-red: #A30000;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Syne', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
```

- [ ] **Step 4: Copy the real product/logo assets from arkan-web**

```bash
mkdir -p "C:/ERICK/Proyectos/Lalo/black-bash-shop/public/logos"
mkdir -p "C:/ERICK/Proyectos/Lalo/black-bash-shop/public/img/black-bash"
cp "C:/ERICK/Proyectos/Lalo/arkan-web/public/logos/black-bash.jpg" "C:/ERICK/Proyectos/Lalo/black-bash-shop/public/logos/black-bash.jpg"
cp C:/ERICK/Proyectos/Lalo/arkan-web/public/img/black-bash/*.png "C:/ERICK/Proyectos/Lalo/black-bash-shop/public/img/black-bash/"
```

- [ ] **Step 5: Install dependencies and verify the dev server boots**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm install
```

Create a throwaway `src/pages/index.astro` with just `<h1>OK</h1>` if needed to boot, then:

```bash
npm run build
```

Expected: build succeeds with no errors (confirms Astro + Tailwind + config are wired correctly). This throwaway page is overwritten in Task 5.

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold black-bash-shop with Astro + Tailwind"
```

---

### Task 2: Product data and cart store (with unit tests)

**Files:**
- Create: `black-bash-shop/src/data/products.ts`
- Create: `black-bash-shop/src/data/products.test.ts`
- Create: `black-bash-shop/src/lib/cart.ts`
- Create: `black-bash-shop/src/lib/cart.test.ts`
- Create: `black-bash-shop/vitest.config.ts`

**Interfaces:**
- Produces (`src/data/products.ts`): `interface Product { id: string; slug: string; name: string; category: 'playeras' | 'pantalones' | 'gorras'; price: number; images: string[]; sizes: string[]; description: string; details: { material: string; care: string; fit: string } }`; `export const PRODUCTS: Product[]`; `export function getProduct(slug: string): Product | undefined`; `export function getProductsByCategory(category: Product['category']): Product[]`; `export function getRelated(product: Product, count?: number): Product[]`.
- Produces (`src/lib/cart.ts`): `interface CartItem { productId: string; slug: string; name: string; price: number; size: string; image: string | null; qty: number }`; `export function getCart(): CartItem[]`; `export function addToCart(item: Omit<CartItem, 'qty'>, qty?: number): CartItem[]`; `export function removeFromCart(productId: string, size: string): CartItem[]`; `export function updateQty(productId: string, size: string, qty: number): CartItem[]`; `export function clearCart(): CartItem[]`; `export function getCartCount(items?: CartItem[]): number`; `export function getCartTotal(items?: CartItem[]): number`. Every mutating function dispatches `window.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }))`.

- [ ] **Step 1: Add vitest config**

`black-bash-shop/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm install -D jsdom
```

- [ ] **Step 2: Write failing tests for products.ts**

`black-bash-shop/src/data/products.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { PRODUCTS, getProduct, getProductsByCategory, getRelated } from './products';

describe('products data', () => {
  it('has exactly 12 products, 4 per category', () => {
    expect(PRODUCTS).toHaveLength(12);
    for (const cat of ['playeras', 'pantalones', 'gorras'] as const) {
      expect(getProductsByCategory(cat)).toHaveLength(4);
    }
  });

  it('has exactly 6 products with real photography and 6 placeholders', () => {
    const withImages = PRODUCTS.filter((p) => p.images.length > 0);
    const withoutImages = PRODUCTS.filter((p) => p.images.length === 0);
    expect(withImages).toHaveLength(6);
    expect(withoutImages).toHaveLength(6);
  });

  it('getProduct finds a product by slug', () => {
    const first = PRODUCTS[0];
    expect(getProduct(first.slug)).toEqual(first);
  });

  it('getProduct returns undefined for unknown slug', () => {
    expect(getProduct('does-not-exist')).toBeUndefined();
  });

  it('getRelated excludes the product itself and stays in bounds', () => {
    const product = PRODUCTS[0];
    const related = getRelated(product, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.find((p) => p.id === product.id)).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run src/data/products.test.ts
```

Expected: FAIL — `products.ts` does not exist yet.

- [ ] **Step 4: Implement products.ts**

`black-bash-shop/src/data/products.ts`:

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'playeras' | 'pantalones' | 'gorras';
  price: number;
  images: string[];
  sizes: string[];
  description: string;
  details: { material: string; care: string; fit: string };
}

export const PRODUCTS: Product[] = [
  {
    id: 'playera-grunge-01',
    slug: 'playera-grunge-ngu',
    name: 'Playera Grunge NGU',
    category: 'playeras',
    price: 549,
    images: ['/img/black-bash/01.png'],
    sizes: ['CH', 'M', 'G', 'XG'],
    description: 'Gráfica con actitud sobre tela de peso medio. Corte recto que no pierde forma.',
    details: { material: '100% algodón peinado, 220 g/m²', care: 'Lavar en frío, no usar secadora', fit: 'Corte regular' },
  },
  {
    id: 'playera-grunge-02',
    slug: 'playera-street-monograma',
    name: 'Playera Street Monograma',
    category: 'playeras',
    price: 579,
    images: ['/img/black-bash/02.png'],
    sizes: ['CH', 'M', 'G', 'XG'],
    description: 'Monograma BB estampado al frente. Cuello reforzado, costuras dobles.',
    details: { material: '100% algodón peinado, 220 g/m²', care: 'Lavar en frío, no usar secadora', fit: 'Corte regular' },
  },
  {
    id: 'playera-oversize',
    slug: 'playera-oversize-ngu',
    name: 'Playera Oversize NGU',
    category: 'playeras',
    price: 599,
    images: [],
    sizes: ['M', 'G', 'XG', 'XXG'],
    description: 'Silueta oversize con hombro caído. Ideal para capas.',
    details: { material: '100% algodón peinado, 240 g/m²', care: 'Lavar en frío, no usar secadora', fit: 'Oversize' },
  },
  {
    id: 'playera-manga-larga',
    slug: 'playera-manga-larga-street',
    name: 'Playera Manga Larga Street',
    category: 'playeras',
    price: 649,
    images: [],
    sizes: ['CH', 'M', 'G', 'XG'],
    description: 'Manga larga con puño acanalado. Gráfica en espalda.',
    details: { material: '100% algodón peinado, 220 g/m²', care: 'Lavar en frío, no usar secadora', fit: 'Corte regular' },
  },
  {
    id: 'jean-dark-01',
    slug: 'jean-dark-wash-slim',
    name: 'Jean Dark Wash Slim',
    category: 'pantalones',
    price: 1249,
    images: ['/img/black-bash/03.png'],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Denim con carácter, lavado oscuro agresivo. Corte slim urbano.',
    details: { material: '98% algodón, 2% elastano', care: 'Lavar del revés, en frío', fit: 'Slim' },
  },
  {
    id: 'jean-dark-02',
    slug: 'jean-dark-wash-straight',
    name: 'Jean Dark Wash Straight',
    category: 'pantalones',
    price: 1249,
    images: ['/img/black-bash/04.png'],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Mismo lavado oscuro, pierna recta. El corte que no pasa de moda.',
    details: { material: '98% algodón, 2% elastano', care: 'Lavar del revés, en frío', fit: 'Straight' },
  },
  {
    id: 'jean-cargo',
    slug: 'jean-cargo-utility',
    name: 'Jean Cargo Utility',
    category: 'pantalones',
    price: 1399,
    images: [],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Bolsas laterales funcionales, denim reforzado. Corte relajado.',
    details: { material: '98% algodón, 2% elastano', care: 'Lavar del revés, en frío', fit: 'Relaxed' },
  },
  {
    id: 'jean-wide-leg',
    slug: 'jean-wide-leg-baggy',
    name: 'Jean Wide Leg Baggy',
    category: 'pantalones',
    price: 1349,
    images: [],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Pierna ancha, caída baggy. Actitud de calle sin esfuerzo.',
    details: { material: '98% algodón, 2% elastano', care: 'Lavar del revés, en frío', fit: 'Baggy' },
  },
  {
    id: 'gorra-bordada',
    slug: 'gorra-bordada-bb',
    name: 'Gorra Bordada BB',
    category: 'gorras',
    price: 449,
    images: ['/img/black-bash/05.png'],
    sizes: ['Única'],
    description: 'Monograma BB bordado al frente. Ajuste trasero con hebilla metálica.',
    details: { material: '100% algodón twill', care: 'Limpiar con paño húmedo', fit: 'Ajustable' },
  },
  {
    id: 'gorra-herradura',
    slug: 'gorra-herradura-mx',
    name: 'Gorra Herradura MX',
    category: 'gorras',
    price: 469,
    images: ['/img/black-bash/06.png'],
    sizes: ['Única'],
    description: 'Bordado del ícono herradura de la marca. Visera curva.',
    details: { material: '100% algodón twill', care: 'Limpiar con paño húmedo', fit: 'Ajustable' },
  },
  {
    id: 'gorra-snapback',
    slug: 'gorra-snapback-ngu',
    name: 'Gorra Snapback NGU',
    category: 'gorras',
    price: 489,
    images: [],
    sizes: ['Única'],
    description: 'Visera plana, cierre snapback. Bordado NEVER GIVE UP en relieve.',
    details: { material: '100% algodón twill', care: 'Limpiar con paño húmedo', fit: 'Ajustable' },
  },
  {
    id: 'gorra-trucker',
    slug: 'gorra-trucker-mesh',
    name: 'Gorra Trucker Mesh',
    category: 'gorras',
    price: 439,
    images: [],
    sizes: ['Única'],
    description: 'Panel frontal twill, malla trasera transpirable. Corte clásico trucker.',
    details: { material: 'Twill + malla poliéster', care: 'Limpiar con paño húmedo', fit: 'Ajustable' },
  },
];

export const getProduct = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductsByCategory = (category: Product['category']): Product[] =>
  PRODUCTS.filter((p) => p.category === category);

export const getRelated = (product: Product, count = 3): Product[] =>
  PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/data/products.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 6: Write failing tests for cart.ts**

`black-bash-shop/src/lib/cart.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getCart, addToCart, removeFromCart, updateQty, clearCart, getCartCount, getCartTotal } from './cart';

const item = { productId: 'playera-grunge-01', slug: 'playera-grunge-ngu', name: 'Playera Grunge NGU', price: 549, size: 'M', image: '/img/black-bash/01.png' };

beforeEach(() => {
  localStorage.clear();
});

describe('cart store', () => {
  it('starts empty', () => {
    expect(getCart()).toEqual([]);
  });

  it('adds a new item with qty 1 by default', () => {
    const cart = addToCart(item);
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({ ...item, qty: 1 });
  });

  it('increments qty when the same product+size is added again', () => {
    addToCart(item);
    const cart = addToCart(item, 2);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(3);
  });

  it('treats different sizes of the same product as separate line items', () => {
    addToCart(item);
    const cart = addToCart({ ...item, size: 'G' });
    expect(cart).toHaveLength(2);
  });

  it('removes an item by productId+size', () => {
    addToCart(item);
    const cart = removeFromCart(item.productId, item.size);
    expect(cart).toEqual([]);
  });

  it('updates quantity for an existing line item', () => {
    addToCart(item);
    const cart = updateQty(item.productId, item.size, 5);
    expect(cart[0].qty).toBe(5);
  });

  it('clears the cart', () => {
    addToCart(item);
    expect(clearCart()).toEqual([]);
  });

  it('computes total item count across line items', () => {
    addToCart(item, 2);
    addToCart({ ...item, size: 'G' }, 3);
    expect(getCartCount()).toBe(5);
  });

  it('computes total price across line items', () => {
    addToCart(item, 2);
    expect(getCartTotal()).toBe(1098);
  });
});
```

- [ ] **Step 7: Run tests to verify they fail**

```bash
npx vitest run src/lib/cart.test.ts
```

Expected: FAIL — `cart.ts` does not exist yet.

- [ ] **Step 8: Implement cart.ts**

`black-bash-shop/src/lib/cart.ts`:

```ts
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string | null;
  qty: number;
}

const STORAGE_KEY = 'bb_cart';

function readCart(): CartItem[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

function writeCart(items: CartItem[]): CartItem[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
  }
  return items;
}

export function getCart(): CartItem[] {
  return readCart();
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1): CartItem[] {
  const items = readCart();
  const existing = items.find((i) => i.productId === item.productId && i.size === item.size);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ ...item, qty });
  }
  return writeCart(items);
}

export function removeFromCart(productId: string, size: string): CartItem[] {
  const items = readCart().filter((i) => !(i.productId === productId && i.size === size));
  return writeCart(items);
}

export function updateQty(productId: string, size: string, qty: number): CartItem[] {
  const items = readCart();
  const existing = items.find((i) => i.productId === productId && i.size === size);
  if (existing) existing.qty = qty;
  return writeCart(items);
}

export function clearCart(): CartItem[] {
  return writeCart([]);
}

export function getCartCount(items: CartItem[] = readCart()): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function getCartTotal(items: CartItem[] = readCart()): number {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0);
}
```

- [ ] **Step 9: Run tests to verify they pass**

```bash
npx vitest run src/lib/cart.test.ts
```

Expected: PASS (9 tests).

- [ ] **Step 10: Commit**

```bash
git add src/data/products.ts src/data/products.test.ts src/lib/cart.ts src/lib/cart.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat: add product catalog data and client-side cart store"
```

---

### Task 3: PlaceholderTile, ProductCard, ProductGrid

**Files:**
- Create: `black-bash-shop/src/components/shop/PlaceholderTile.astro`
- Create: `black-bash-shop/src/components/shop/ProductCard.astro`
- Create: `black-bash-shop/src/components/shop/ProductGrid.astro`

**Interfaces:**
- Consumes: `Product` type from `src/data/products.ts` (Task 2); `addToCart` from `src/lib/cart.ts` (Task 2).
- Produces: `PlaceholderTile.astro` — props `{ label: string }`, renders a styled dark tile with the product name for products with `images.length === 0`. `ProductCard.astro` — props `{ product: Product }`, renders image-or-placeholder with hover state, name, price, size chips, and a quick "Agregar al carrito" action (dispatches `addToCart` with the first available size). `ProductGrid.astro` — props `{ products: Product[] }`, lays out `ProductCard` instances in the asymmetric editorial grid described in the spec.

- [ ] **Step 1: Build PlaceholderTile.astro**

Invoke the **frontend-design** skill for this component's visual treatment. Requirements: fills the same aspect ratio as a real product photo, dark gradient background (using `--color-bg`), a thin red (`--color-brand-red`) accent line or corner mark so it doesn't read as "broken image", and the product `label` set in `--font-display` uppercase. Must work as a drop-in replacement anywhere `<img>` would go inside `ProductCard` and `Gallery` (Task 6).

```astro
---
interface Props { label: string; }
const { label } = Astro.props;
---
<div class="placeholder-tile" role="img" aria-label={label}>
  <span class="placeholder-tile-label">{label}</span>
</div>
<style>
  /* frontend-design skill fills in the full visual treatment here,
     using tokens --color-bg / --color-fg / --color-brand-red / --font-display */
  .placeholder-tile {
    width: 100%; height: 100%; aspect-ratio: 3 / 4;
    display: flex; align-items: center; justify-content: center;
  }
</style>
```

- [ ] **Step 2: Build ProductCard.astro**

Invoke the **frontend-design** skill for layout/hover treatment. Requirements: image swaps to `images[1]` on hover if present (CSS-only, no JS needed for the swap); falls back to `PlaceholderTile` when `images.length === 0`; shows `name` in Syne, `price` formatted as `$X,XXX MXN` in the brand red; size chips render every entry in `sizes`; card is a link to `/product/{slug}`; includes a button that calls `addToCart` for the first size and dispatches feedback (e.g. a brief "Agregado" state) without navigating.

```astro
---
import type { Product } from '../../data/products';
import PlaceholderTile from './PlaceholderTile.astro';
interface Props { product: Product; }
const { product } = Astro.props;
const price = product.price.toLocaleString('es-MX');
---
<article class="product-card" data-product-id={product.id} data-slug={product.slug} data-first-size={product.sizes[0]}>
  <a href={`/product/${product.slug}`} class="product-card-media">
    {product.images.length > 0
      ? <>
          <img src={product.images[0]} alt={product.name} class="product-card-img product-card-img-primary" />
          {product.images[1] && <img src={product.images[1]} alt={product.name} class="product-card-img product-card-img-secondary" />}
        </>
      : <PlaceholderTile label={product.name} />}
  </a>
  <div class="product-card-info">
    <a href={`/product/${product.slug}`} class="product-card-name">{product.name}</a>
    <p class="product-card-price">${price} MXN</p>
    <ul class="product-card-sizes">
      {product.sizes.map((size) => <li>{size}</li>)}
    </ul>
    <button type="button" class="product-card-add" data-add-to-cart>Agregar al carrito</button>
  </div>
</article>
<style>
  /* frontend-design skill: asymmetric card treatment, hover image swap,
     size chip styling, add-to-cart button using brand red as accent */
</style>
<script>
  import { addToCart } from '../../lib/cart';
  document.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const btn = card.querySelector<HTMLButtonElement>('[data-add-to-cart]');
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      const name = card.querySelector('.product-card-name')?.textContent ?? '';
      const priceText = card.querySelector('.product-card-price')?.textContent ?? '0';
      const price = Number(priceText.replace(/[^0-9]/g, ''));
      const img = card.querySelector('img');
      addToCart({
        productId: card.dataset.productId!,
        slug: card.dataset.slug!,
        name,
        price,
        size: card.dataset.firstSize!,
        image: img ? img.getAttribute('src') : null,
      });
      btn.textContent = 'Agregado ✓';
      setTimeout(() => { btn.textContent = 'Agregar al carrito'; }, 1500);
    });
  });
</script>
```

- [ ] **Step 3: Build ProductGrid.astro**

```astro
---
import type { Product } from '../../data/products';
import ProductCard from './ProductCard.astro';
interface Props { products: Product[]; }
const { products } = Astro.props;
---
<div class="product-grid">
  {products.map((product, i) => (
    <div class:list={['product-grid-item', { 'product-grid-item-large': i % 5 === 0 }]}>
      <ProductCard product={product} />
    </div>
  ))}
</div>
<style>
  /* frontend-design skill: asymmetric grid — product-grid-item-large spans
     more columns/rows than regular items, per the spec's editorial grid */
  .product-grid { display: grid; gap: 1.5rem; }
</style>
```

- [ ] **Step 4: Verify with a build smoke test**

Add a temporary usage in `src/pages/index.astro` (already a throwaway `<h1>OK</h1>` from Task 1):

```astro
---
import ProductGrid from '../components/shop/ProductGrid.astro';
import { PRODUCTS } from '../data/products';
---
<ProductGrid products={PRODUCTS} />
```

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
```

Expected: build succeeds; inspect `dist/index.html` and confirm it contains 12 occurrences of `product-card` and the text `Agregar al carrito`.

```bash
grep -o "product-card\"" dist/index.html | wc -l
grep -o "Agregar al carrito" dist/index.html | wc -l
```

Expected: both commands print `12` (occurrence count, not line count — Astro may emit the whole file on few lines).

- [ ] **Step 5: Commit**

```bash
git add src/components/shop/PlaceholderTile.astro src/components/shop/ProductCard.astro src/components/shop/ProductGrid.astro src/pages/index.astro
git commit -m "feat: add product card, grid, and placeholder tile components"
```

---

### Task 4: ShopLayout, Nav, CartDrawer, Footer

**Files:**
- Create: `black-bash-shop/src/layouts/ShopLayout.astro`
- Create: `black-bash-shop/src/components/shop/Nav.astro`
- Create: `black-bash-shop/src/components/shop/CartDrawer.astro`
- Create: `black-bash-shop/src/components/shop/Footer.astro`
- Modify: `black-bash-shop/src/pages/index.astro` (wrap in `ShopLayout` instead of raw `<h1>`)

**Interfaces:**
- Consumes: `getCart`, `getCartCount`, `getCartTotal`, `removeFromCart`, `updateQty` from `src/lib/cart.ts` (Task 2); the `cart:updated` CustomEvent contract defined in Task 2.
- Produces: `ShopLayout.astro` — props `{ title: string; description?: string }`, renders `<html>`/`<head>` (Google Fonts for Bebas Neue + Syne, same pattern as `arkan-web/src/layouts/Layout.astro`), mounts `Nav`, `<slot />`, `CartDrawer`, `Footer`, plus the inherited WhatsApp FAB and scroll-to-top button (ported verbatim from `arkan-web/src/layouts/Layout.astro`, same markup/behavior/`fab-wa`/`fab-top` classes). `Nav.astro` — logo + wordmark linking to `/`, links to `/shop`, a cart icon button with a count badge (`#cart-count`) that opens `CartDrawer` via a `cart:open` CustomEvent, mobile hamburger drawer (reuse the pattern from `arkan-web/src/components/brand/BrandNav.astro`). `CartDrawer.astro` — slide-in panel listening for `cart:open` and `cart:updated`, lists line items with qty controls and a remove button, shows subtotal via `getCartTotal`, CTA button linking to `/checkout`.

- [ ] **Step 1: Build ShopLayout.astro**

Port the WhatsApp FAB, scroll-to-top button, and their `<style>`/`<script>` blocks verbatim from `arkan-web/src/layouts/Layout.astro` (the `.fab-wa` / `.fab-top` rules and the `fabTop` scroll-listener script) — same phone number link (`https://wa.me/525564991943`), same SVGs, same behavior. This is a direct port, not a redesign.

```astro
---
interface Props { title: string; description?: string; }
const { title, description = 'Black Bash MX — Tienda oficial' } = Astro.props;
import '../styles/global.css';
import Nav from '../components/shop/Nav.astro';
import CartDrawer from '../components/shop/CartDrawer.astro';
import Footer from '../components/shop/Footer.astro';
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="icon" type="image/jpeg" href="/logos/black-bash.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <Nav />
  <main>
    <slot />
  </main>
  <CartDrawer />
  <Footer />

  <!-- WhatsApp flotante — ported verbatim from arkan-web/src/layouts/Layout.astro -->
  <a class="fab-wa" href="https://wa.me/525564991943" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
    <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>

  <!-- Scroll to top -->
  <button class="fab-top" id="fabTop" aria-label="Volver al inicio">
    <svg viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
</body>
</html>
<style is:global>
  .fab-wa {
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    width: 56px; height: 56px; border-radius: 50%; background: #25D366;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .fab-wa:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(37, 211, 102, 0.55); }
  .fab-wa svg { width: 30px; height: 30px; }
  .fab-top {
    position: fixed; bottom: 28px; left: 28px; z-index: 999;
    width: 48px; height: 48px; border-radius: 50%; background: #FFFFFF;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease, transform 0.2s ease;
  }
  .fab-top.visible { opacity: 1; pointer-events: auto; }
  .fab-top:hover { transform: translateY(-3px); }
  .fab-top svg { width: 20px; height: 20px; }
  @media (max-width: 480px) {
    .fab-wa { width: 50px; height: 50px; bottom: 20px; right: 20px; }
    .fab-top { width: 42px; height: 42px; bottom: 20px; left: 20px; }
  }
</style>
<script>
  const btn = document.getElementById('fabTop');
  window.addEventListener('scroll', () => {
    btn?.classList.toggle('visible', window.scrollY > 400);
  });
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
</script>
```

- [ ] **Step 2: Build Nav.astro**

Invoke the **frontend-design** skill for the visual treatment, following the fixed-nav pattern already established in `arkan-web/src/components/brand/BrandNav.astro` (white top border, uppercase Syne links, mobile hamburger drawer) but adding a cart icon with a live count badge.

```astro
<nav class="shop-nav">
  <a href="/" class="shop-nav-brand">
    <img src="/logos/black-bash.jpg" alt="Black Bash MX" class="shop-nav-logo" />
    <span class="shop-nav-title">BLACK BASH</span>
  </a>
  <ul class="shop-nav-links">
    <li><a href="/">Inicio</a></li>
    <li><a href="/shop">Tienda</a></li>
  </ul>
  <button type="button" class="shop-nav-cart" id="cart-toggle" aria-label="Abrir carrito">
    Carrito <span id="cart-count">0</span>
  </button>
</nav>
<style>
  /* frontend-design skill fills in full nav styling here */
</style>
<script>
  import { getCartCount } from '../../lib/cart';
  const badge = document.getElementById('cart-count');
  const toggle = document.getElementById('cart-toggle');
  function refresh() { if (badge) badge.textContent = String(getCartCount()); }
  refresh();
  window.addEventListener('cart:updated', refresh);
  toggle?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('cart:open')));
</script>
```

- [ ] **Step 3: Build CartDrawer.astro**

```astro
<aside class="cart-drawer" id="cart-drawer" aria-hidden="true">
  <div class="cart-drawer-header">
    <span>TU CARRITO</span>
    <button type="button" id="cart-close" aria-label="Cerrar carrito">×</button>
  </div>
  <div class="cart-drawer-items" id="cart-items"></div>
  <div class="cart-drawer-footer">
    <div class="cart-drawer-subtotal">
      Subtotal: <span id="cart-subtotal">$0 MXN</span>
    </div>
    <a href="/checkout" class="cart-drawer-checkout">Ir a pagar</a>
  </div>
</aside>
<style>
  /* frontend-design skill: slide-in panel from the right, dark bg,
     matches ShopLayout tokens, overlay/backdrop, open/close transitions */
  .cart-drawer { position: fixed; top: 0; right: 0; height: 100vh; transform: translateX(100%); transition: transform 0.3s ease; }
  .cart-drawer.open { transform: translateX(0); }
</style>
<script>
  import { getCart, getCartTotal, removeFromCart, updateQty, type CartItem } from '../../lib/cart';

  const drawer = document.getElementById('cart-drawer');
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');

  function render(items: CartItem[] = getCart()) {
    if (!itemsEl) return;
    itemsEl.innerHTML = items.length
      ? items.map((i) => `
        <div class="cart-item" data-product-id="${i.productId}" data-size="${i.size}">
          <span>${i.name} (${i.size})</span>
          <input type="number" min="1" value="${i.qty}" class="cart-item-qty" />
          <span>$${(i.price * i.qty).toLocaleString('es-MX')} MXN</span>
          <button type="button" class="cart-item-remove">Quitar</button>
        </div>
      `).join('')
      : '<p class="cart-empty">Tu carrito está vacío.</p>';
    if (subtotalEl) subtotalEl.textContent = `$${getCartTotal(items).toLocaleString('es-MX')} MXN`;
  }

  render();
  window.addEventListener('cart:updated', (e) => render((e as CustomEvent<CartItem[]>).detail));
  window.addEventListener('cart:open', () => drawer?.classList.add('open'));
  document.getElementById('cart-close')?.addEventListener('click', () => drawer?.classList.remove('open'));

  itemsEl?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('cart-item-remove')) {
      const row = target.closest<HTMLElement>('.cart-item');
      if (row) render(removeFromCart(row.dataset.productId!, row.dataset.size!));
    }
  });

  itemsEl?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains('cart-item-qty')) {
      const row = target.closest<HTMLElement>('.cart-item');
      if (row) render(updateQty(row.dataset.productId!, row.dataset.size!, Number(target.value)));
    }
  });
</script>
```

- [ ] **Step 4: Build Footer.astro**

Invoke the **frontend-design** skill for styling, reusing the tone of `arkan-web/src/components/brand/BrandFooter.astro`. Content: wordmark, Instagram link (`https://www.instagram.com/blackbashmx/`), and a link back to `/` (home) and `/shop`.

```astro
<footer class="shop-footer">
  <span>BLACK BASH MX — NEVER GIVE UP</span>
  <a href="https://www.instagram.com/blackbashmx/" target="_blank" rel="noopener noreferrer">Instagram</a>
</footer>
<style>
  /* frontend-design skill fills in footer styling */
</style>
```

- [ ] **Step 5: Wrap index.astro in ShopLayout**

```astro
---
import ShopLayout from '../layouts/ShopLayout.astro';
import ProductGrid from '../components/shop/ProductGrid.astro';
import { PRODUCTS } from '../data/products';
---
<ShopLayout title="Black Bash MX — Tienda oficial">
  <ProductGrid products={PRODUCTS} />
</ShopLayout>
```

- [ ] **Step 6: Verify with build + structural checks**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
grep -c "cart-drawer" dist/index.html
grep -c "shop-nav" dist/index.html
```

Expected: build succeeds, both greps return non-zero counts.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ShopLayout.astro src/components/shop/Nav.astro src/components/shop/CartDrawer.astro src/components/shop/Footer.astro src/pages/index.astro
git commit -m "feat: add shop layout, nav, cart drawer, and footer"
```

---

### Task 5: Home page (Hero, CategoryStrip, BrandStatement, Bestsellers)

**Files:**
- Create: `black-bash-shop/src/components/shop/Hero.astro`
- Create: `black-bash-shop/src/components/shop/CategoryStrip.astro`
- Create: `black-bash-shop/src/components/shop/BrandStatement.astro`
- Modify: `black-bash-shop/src/pages/index.astro`

**Interfaces:**
- Consumes: `PRODUCTS`, `getProductsByCategory` from `src/data/products.ts`; `ProductGrid` from Task 3.
- Produces: `Hero.astro` — no props, full-bleed image (`/img/black-bash/03.png`) with monogram, "BLACK BASH MX" in Bebas Neue, "NEVER GIVE UP" tagline, CTA linking to `/shop`. `CategoryStrip.astro` — no props, three large clickable cards linking to `/shop?category=playeras|pantalones|gorras`. `BrandStatement.astro` — no props, adapts the existing `blackBash.statement` copy from `arkan-web/src/data/brands.ts` (heading "NEVER<br/>GIVE<br/>UP.", the three paragraphs) into an editorial band.

- [ ] **Step 1: Build Hero.astro**

Invoke the **frontend-design** skill. Requirements: full-viewport-height section, background image `/img/black-bash/03.png` with a dark gradient overlay (matches `arkan-web/src/components/brand/BrandHero.astro`'s overlay approach), centered content with `/logos/black-bash.jpg` monogram, `<h1>BLACK BASH MX</h1>` in Bebas Neue at a very large clamp() size, "NEVER GIVE UP" tagline in wide-tracked Syne, and a CTA link to `/shop` styled as an outline button.

```astro
<section class="hero">
  <div class="hero-bg" style="background-image: url('/img/black-bash/03.png')"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <img src="/logos/black-bash.jpg" alt="Black Bash MX" class="hero-logo" />
    <h1 class="hero-heading">BLACK BASH MX</h1>
    <p class="hero-tagline">NEVER GIVE UP</p>
    <a href="/shop" class="hero-cta">Ver colección</a>
  </div>
</section>
<style>
  /* frontend-design skill fills in full hero styling */
</style>
```

- [ ] **Step 2: Build CategoryStrip.astro**

```astro
---
const categories = [
  { key: 'playeras', label: 'Playeras', image: '/img/black-bash/01.png' },
  { key: 'pantalones', label: 'Pantalones', image: '/img/black-bash/03.png' },
  { key: 'gorras', label: 'Gorras', image: '/img/black-bash/05.png' },
];
---
<section class="category-strip">
  {categories.map((c) => (
    <a href={`/shop?category=${c.key}`} class="category-card" style={`background-image: url('${c.image}')`}>
      <span class="category-card-label">{c.label}</span>
    </a>
  ))}
</section>
<style>
  /* frontend-design skill: large clickable image cards, dark overlay, label in Bebas Neue */
</style>
```

- [ ] **Step 3: Build BrandStatement.astro**

```astro
<section class="brand-statement">
  <h2 class="brand-statement-heading">NEVER<br/>GIVE<br/>UP.</h2>
  <div class="brand-statement-body">
    <p>Black Bash MX no es solo una marca de denim. Es una declaración. Para el cliente urbano que construye su identidad con lo que viste, que no sigue tendencias, que las crea.</p>
    <p>Cada pieza fue diseñada con actitud: cortes con carácter, acabados que resisten, un lenguaje visual que conecta con la cultura de calle.</p>
  </div>
</section>
<style>
  /* frontend-design skill: editorial two-column band matching BrandStatement.astro tone in arkan-web */
</style>
```

- [ ] **Step 4: Assemble index.astro**

```astro
---
import ShopLayout from '../layouts/ShopLayout.astro';
import Hero from '../components/shop/Hero.astro';
import CategoryStrip from '../components/shop/CategoryStrip.astro';
import BrandStatement from '../components/shop/BrandStatement.astro';
import ProductGrid from '../components/shop/ProductGrid.astro';
import { PRODUCTS } from '../data/products';

const bestsellers = PRODUCTS.slice(0, 6);
---
<ShopLayout title="Black Bash MX — Tienda oficial" description="Never Give Up. Denim y streetwear urbano.">
  <Hero />
  <CategoryStrip />
  <section id="bestsellers">
    <h2>Bestsellers</h2>
    <ProductGrid products={bestsellers} />
  </section>
  <BrandStatement />
</ShopLayout>
```

- [ ] **Step 5: Verify with build + structural checks**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
grep -c "hero-heading" dist/index.html
grep -o "category-card\"" dist/index.html | wc -l
grep -o "NEVER<br/>GIVE<br/>UP" dist/index.html
```

Expected: build succeeds, `hero-heading` present, `category-card` occurrence count is `3`, the NGU heading string is present.

- [ ] **Step 6: Commit**

```bash
git add src/components/shop/Hero.astro src/components/shop/CategoryStrip.astro src/components/shop/BrandStatement.astro src/pages/index.astro
git commit -m "feat: build home page with hero, category strip, bestsellers, and brand statement"
```

---

### Task 6: Catálogo page with Filters

**Files:**
- Create: `black-bash-shop/src/components/shop/Filters.astro`
- Create: `black-bash-shop/src/pages/shop.astro`

**Interfaces:**
- Consumes: `PRODUCTS`, `Product` from `src/data/products.ts`; `ProductGrid` from Task 3; `ShopLayout` from Task 4.
- Produces: `Filters.astro` — props `{ selectedCategory?: string }`, renders category/size/price filter controls that update the URL's `?category=` query param and re-filter the grid client-side (no page reload) by toggling a `hidden` class on non-matching `.product-card` elements inside `#catalog-grid`.

- [ ] **Step 1: Build Filters.astro**

Invoke the **frontend-design** skill for styling. Requirements: category pills (`Todos`, `Playeras`, `Pantalones`, `Gorras`), a size checkbox group (union of all sizes across `PRODUCTS`), a price range as two number inputs (min/max). Filtering runs entirely client-side against `#catalog-grid .product-card`, matching on `data-category`, `data-sizes` (comma-separated), and `data-price` attributes that Task 6 Step 2 adds to each grid item wrapper.

```astro
---
import { PRODUCTS } from '../../data/products';
interface Props { selectedCategory?: string; }
const { selectedCategory = 'todos' } = Astro.props;
const allSizes = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
const categories = ['todos', 'playeras', 'pantalones', 'gorras'];
---
<aside class="filters" id="filters">
  <div class="filter-group" data-filter="category">
    {categories.map((c) => (
      <button type="button" class:list={['filter-pill', { active: c === selectedCategory }]} data-value={c}>{c}</button>
    ))}
  </div>
  <div class="filter-group" data-filter="size">
    {allSizes.map((s) => (
      <label><input type="checkbox" value={s} /> {s}</label>
    ))}
  </div>
  <div class="filter-group" data-filter="price">
    <input type="number" id="price-min" placeholder="Min" />
    <input type="number" id="price-max" placeholder="Max" />
  </div>
</aside>
<style>
  /* frontend-design skill fills in filter styling */
</style>
```

- [ ] **Step 2: Build shop.astro**

```astro
---
import ShopLayout from '../layouts/ShopLayout.astro';
import Filters from '../components/shop/Filters.astro';
import ProductGrid from '../components/shop/ProductGrid.astro';
import { PRODUCTS } from '../data/products';

const category = Astro.url.searchParams.get('category') ?? 'todos';
---
<ShopLayout title="Tienda — Black Bash MX">
  <nav class="breadcrumb"><a href="/">Inicio</a> / Tienda</nav>
  <p class="results-count" id="results-count">{PRODUCTS.length} productos</p>
  <div class="shop-layout">
    <Filters selectedCategory={category} />
    <div id="catalog-grid">
      <ProductGrid products={PRODUCTS} />
    </div>
  </div>
</ShopLayout>
<script>
  const grid = document.getElementById('catalog-grid');
  const filtersEl = document.getElementById('filters');
  const resultsCount = document.getElementById('results-count');
  const cards = () => Array.from(grid?.querySelectorAll<HTMLElement>('.product-grid-item') ?? []);

  function currentFilters() {
    const activePill = filtersEl?.querySelector<HTMLElement>('.filter-pill.active');
    const category = activePill?.dataset.value ?? 'todos';
    const sizes = Array.from(filtersEl?.querySelectorAll<HTMLInputElement>('[data-filter="size"] input:checked') ?? []).map((i) => i.value);
    const min = Number((document.getElementById('price-min') as HTMLInputElement)?.value || 0);
    const max = Number((document.getElementById('price-max') as HTMLInputElement)?.value || Infinity);
    return { category, sizes, min, max };
  }

  function applyFilters() {
    const { category, sizes, min, max } = currentFilters();
    let visible = 0;
    cards().forEach((item) => {
      const card = item.querySelector<HTMLElement>('.product-card');
      if (!card) return;
      const matchesCategory = category === 'todos' || card.dataset.category === category;
      const matchesSize = sizes.length === 0 || (card.dataset.sizes ?? '').split(',').some((s) => sizes.includes(s));
      const price = Number(card.dataset.price ?? 0);
      const matchesPrice = price >= min && price <= max;
      const show = matchesCategory && matchesSize && matchesPrice;
      item.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });
    if (resultsCount) resultsCount.textContent = `${visible} productos`;
  }

  filtersEl?.querySelectorAll<HTMLElement>('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      filtersEl.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilters();
    });
  });
  filtersEl?.addEventListener('change', applyFilters);
  applyFilters();
</script>
```

- [ ] **Step 3: Add data attributes ProductCard needs for filtering**

Modify `src/components/shop/ProductCard.astro` (Task 3): add `data-category={product.category}` `data-sizes={product.sizes.join(',')}` `data-price={product.price}` to the root `<article class="product-card">` element (alongside the existing `data-product-id`, `data-slug`, `data-first-size`).

- [ ] **Step 4: Verify with build + structural checks**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
grep -c "filter-pill" dist/shop/index.html
grep -o "data-category=\"playeras\"" dist/shop/index.html | wc -l
```

Expected: build succeeds, `filter-pill` present, `data-category="playeras"` occurrence count is `4`.

- [ ] **Step 5: Commit**

```bash
git add src/components/shop/Filters.astro src/pages/shop.astro src/components/shop/ProductCard.astro
git commit -m "feat: add catalog page with client-side category/size/price filters"
```

---

### Task 7: Product Detail Page (PDP)

**Files:**
- Create: `black-bash-shop/src/components/pdp/Gallery.astro`
- Create: `black-bash-shop/src/components/pdp/SizeSelector.astro`
- Create: `black-bash-shop/src/components/pdp/DetailsAccordion.astro`
- Create: `black-bash-shop/src/components/pdp/CrossSell.astro`
- Create: `black-bash-shop/src/pages/product/[slug].astro`

**Interfaces:**
- Consumes: `Product`, `getProduct`, `getRelated` from `src/data/products.ts` (Task 2); `addToCart` from `src/lib/cart.ts` (Task 2); `ProductGrid` from Task 3; `PlaceholderTile` from Task 3.
- Produces: `Gallery.astro` — props `{ images: string[]; label: string }`. `SizeSelector.astro` — props `{ sizes: string[] }`, renders radio-style size buttons, sets `data-selected-size` on itself when clicked. `DetailsAccordion.astro` — props `{ details: Product['details'] }`. `CrossSell.astro` — props `{ products: Product[] }`, wraps `ProductGrid`.

- [ ] **Step 1: Build Gallery.astro**

```astro
---
import PlaceholderTile from '../shop/PlaceholderTile.astro';
interface Props { images: string[]; label: string; }
const { images, label } = Astro.props;
---
<div class="pdp-gallery">
  {images.length > 0
    ? images.map((src) => <img src={src} alt={label} />)
    : <PlaceholderTile label={label} />}
</div>
<style>
  /* frontend-design skill: stacked/scrollable gallery on desktop, swipeable on mobile */
</style>
```

- [ ] **Step 2: Build SizeSelector.astro**

```astro
---
interface Props { sizes: string[]; }
const { sizes } = Astro.props;
---
<div class="size-selector" id="size-selector" data-selected-size={sizes[0]}>
  {sizes.map((size, i) => (
    <button type="button" class:list={['size-option', { active: i === 0 }]} data-size={size}>{size}</button>
  ))}
</div>
<style>
  /* frontend-design skill fills in size chip styling */
</style>
<script>
  const container = document.getElementById('size-selector');
  container?.querySelectorAll<HTMLButtonElement>('.size-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-option').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      container.dataset.selectedSize = btn.dataset.size;
    });
  });
</script>
```

- [ ] **Step 3: Build DetailsAccordion.astro**

```astro
---
import type { Product } from '../../data/products';
interface Props { details: Product['details']; }
const { details } = Astro.props;
---
<details class="details-accordion" open>
  <summary>Detalles del producto</summary>
  <ul>
    <li><strong>Material:</strong> {details.material}</li>
    <li><strong>Cuidado:</strong> {details.care}</li>
    <li><strong>Fit:</strong> {details.fit}</li>
  </ul>
</details>
<style>
  /* frontend-design skill fills in accordion styling */
</style>
```

- [ ] **Step 4: Build CrossSell.astro**

```astro
---
import type { Product } from '../../data/products';
import ProductGrid from '../shop/ProductGrid.astro';
interface Props { products: Product[]; }
const { products } = Astro.props;
---
{products.length > 0 && (
  <section class="cross-sell">
    <h2>Completa el look</h2>
    <ProductGrid products={products} />
  </section>
)}
```

- [ ] **Step 5: Build product/[slug].astro**

```astro
---
import ShopLayout from '../../layouts/ShopLayout.astro';
import Gallery from '../../components/pdp/Gallery.astro';
import SizeSelector from '../../components/pdp/SizeSelector.astro';
import DetailsAccordion from '../../components/pdp/DetailsAccordion.astro';
import CrossSell from '../../components/pdp/CrossSell.astro';
import { PRODUCTS, getProduct, getRelated } from '../../data/products';

export function getStaticPaths() {
  return PRODUCTS.map((p) => ({ params: { slug: p.slug } }));
}

const { slug } = Astro.params;
const product = getProduct(slug!)!;
const related = getRelated(product);
const price = product.price.toLocaleString('es-MX');
---
<ShopLayout title={`${product.name} — Black Bash MX`} description={product.description}>
  <div class="pdp" data-product-id={product.id} data-slug={product.slug}>
    <Gallery images={product.images} label={product.name} />
    <div class="pdp-info">
      <h1>{product.name}</h1>
      <p class="pdp-price">${price} MXN</p>
      <p class="pdp-description">{product.description}</p>
      <SizeSelector sizes={product.sizes} />
      <button type="button" id="pdp-add-to-cart">Agregar al carrito</button>
      <DetailsAccordion details={product.details} />
    </div>
  </div>
  <CrossSell products={related} />
</ShopLayout>
<script>
  import { addToCart } from '../../lib/cart';
  const root = document.querySelector<HTMLElement>('.pdp');
  const btn = document.getElementById('pdp-add-to-cart');
  btn?.addEventListener('click', () => {
    if (!root) return;
    const sizeSelector = document.getElementById('size-selector');
    const name = root.querySelector('h1')?.textContent ?? '';
    const priceText = root.querySelector('.pdp-price')?.textContent ?? '0';
    const price = Number(priceText.replace(/[^0-9]/g, ''));
    const img = root.querySelector('img');
    addToCart({
      productId: root.dataset.productId!,
      slug: root.dataset.slug!,
      name,
      price,
      size: sizeSelector?.dataset.selectedSize ?? '',
      image: img ? img.getAttribute('src') : null,
    });
    window.dispatchEvent(new CustomEvent('cart:open'));
  });
</script>
```

- [ ] **Step 6: Verify with build + structural checks**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
grep -l "Completa el look" dist/product/*/index.html | wc -l
```

Expected: build succeeds and generates 12 static PDP pages (one per product slug); the grep count matches the number of products that have at least one related product (should be `12`, since every category has 4 products).

- [ ] **Step 7: Commit**

```bash
git add src/components/pdp src/pages/product
git commit -m "feat: add product detail page with gallery, size selector, and cross-sell"
```

---

### Task 8: Checkout page (Cart → Shipping → Payment → Confirmation)

**Files:**
- Create: `black-bash-shop/src/pages/checkout.astro`

**Interfaces:**
- Consumes: `getCart`, `getCartTotal`, `clearCart` from `src/lib/cart.ts` (Task 2); `ShopLayout` from Task 4.
- Produces: a single page with three client-toggled steps (`#step-shipping`, `#step-payment`, `#step-confirmation`) and a progress indicator; no route changes between steps (all client-side state).

- [ ] **Step 1: Build checkout.astro**

Invoke the **frontend-design** skill for the step indicator and form styling. Requirements: step 1 collects name/address (plain inputs, no validation beyond `required`), step 2 collects card-like fields purely for show (clearly a simulation — no real payment processing), step 3 shows an order summary pulled from the cart plus a "Pedido confirmado" state, and on reaching step 3 the cart is cleared via `clearCart()`.

```astro
---
import ShopLayout from '../layouts/ShopLayout.astro';
---
<ShopLayout title="Checkout — Black Bash MX">
  <div class="checkout" id="checkout">
    <ol class="checkout-progress">
      <li data-step="shipping" class="active">Envío</li>
      <li data-step="payment">Pago</li>
      <li data-step="confirmation">Confirmación</li>
    </ol>

    <section id="step-shipping" class="checkout-step active">
      <h2>Envío</h2>
      <div id="checkout-summary"></div>
      <form id="shipping-form">
        <input name="name" placeholder="Nombre completo" required />
        <input name="address" placeholder="Dirección" required />
        <input name="city" placeholder="Ciudad" required />
        <input name="zip" placeholder="Código postal" required />
        <button type="submit">Continuar a pago</button>
      </form>
    </section>

    <section id="step-payment" class="checkout-step">
      <h2>Pago</h2>
      <form id="payment-form">
        <input name="cardNumber" placeholder="Número de tarjeta" required />
        <input name="cardExpiry" placeholder="MM/AA" required />
        <input name="cardCvc" placeholder="CVC" required />
        <button type="submit">Confirmar pedido</button>
      </form>
    </section>

    <section id="step-confirmation" class="checkout-step">
      <h2>Pedido confirmado</h2>
      <p>Gracias por tu compra. Never Give Up.</p>
    </section>
  </div>
</ShopLayout>
<style>
  /* frontend-design skill: progress indicator, step transitions, form styling */
  .checkout-step { display: none; }
  .checkout-step.active { display: block; }
</style>
<script>
  import { getCart, getCartTotal, clearCart } from '../lib/cart';

  const steps = ['shipping', 'payment', 'confirmation'];
  function goTo(step: string) {
    document.querySelectorAll('.checkout-step').forEach((el) => el.classList.toggle('active', el.id === `step-${step}`));
    document.querySelectorAll('.checkout-progress li').forEach((el) => el.classList.toggle('active', (el as HTMLElement).dataset.step === step));
  }

  function renderSummary() {
    const items = getCart();
    const summary = document.getElementById('checkout-summary');
    if (!summary) return;
    summary.innerHTML = items.map((i) => `<div>${i.name} (${i.size}) x${i.qty} — $${(i.price * i.qty).toLocaleString('es-MX')} MXN</div>`).join('')
      + `<div class="checkout-total">Total: $${getCartTotal(items).toLocaleString('es-MX')} MXN</div>`;
  }

  renderSummary();

  document.getElementById('shipping-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    goTo('payment');
  });

  document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearCart();
    goTo('confirmation');
  });
</script>
```

- [ ] **Step 2: Verify with build + structural checks**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build
grep -c "checkout-progress" dist/checkout/index.html
grep -c "step-confirmation" dist/checkout/index.html
```

Expected: build succeeds, both greps return non-zero counts.

- [ ] **Step 3: Commit**

```bash
git add src/pages/checkout.astro
git commit -m "feat: add checkout flow with shipping, payment, and confirmation steps"
```

---

### Task 9: Final visual QA pass

**Files:**
- Modify: any component/page from Tasks 3–8 as needed to fix visual issues found during QA (no new files expected).

**Interfaces:**
- Consumes: the full running site from Tasks 1–8.

- [ ] **Step 1: Start the dev server**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run dev
```

- [ ] **Step 2: Walk the full flow using the browser (claude-in-chrome or the `run` skill)**

Navigate: Home → click a category card → Catálogo (confirm filters narrow the grid) → click a product → PDP (select a size, click "Agregar al carrito", confirm the cart drawer opens and shows the item) → open cart drawer from Nav → "Ir a pagar" → Checkout (fill shipping, fill payment, confirm the confirmation screen appears and the cart badge resets to 0). Repeat at a mobile viewport width (375px) to confirm the hamburger nav, stacked PDP layout, and checkout steps remain usable.

- [ ] **Step 3: Fix any visual or interaction issues found**

Apply fixes directly in the relevant `.astro` file's `<style>` or `<script>` block. Re-run Step 2 after each fix until the full flow works cleanly at both viewport sizes.

- [ ] **Step 4: Final production build check**

```bash
cd "C:/ERICK/Proyectos/Lalo/black-bash-shop" && npm run build && npx vitest run
```

Expected: build succeeds with zero errors, all vitest suites from Task 2 still pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish: final visual QA pass across home, catalog, PDP, and checkout"
```
