# Black Bash Shop — Propuesta visual de e-commerce

**Fecha:** 2026-08-17
**Estado:** Aprobado para plan de implementación

## Contexto

El cliente dueño de Arkán Group (marcas Aruba, Bakari, Black Bash) pidió una
propuesta de e-commerce enfocada únicamente en **Black Bash MX**, su marca de
streetwear/denim urbano. Hoy `arkan-web` solo tiene landing pages de
identidad de marca (`src/pages/black-bash.astro` vía `BrandPage.astro`), sin
catálogo, carrito ni checkout.

El objetivo de este proyecto **no es construir una tienda productiva**, sino
una **demo visual e interactiva de alta fidelidad** para convencer al cliente
de invertir en el e-commerce real. Debe sentirse como una tienda de verdad al
navegarla (clicks, hover, carrito, checkout simulado), pero sin backend,
pagos ni persistencia de datos real.

## Identidad de marca existente (punto de partida)

Extraída de `arkan-web/src/{data/brands.ts, layouts/Layout.astro,
components/brand/*}`:

- **Color base:** fondo `#0A0A0A`, texto `#F0F0F0`.
- **Acento de marca:** rojo del logo (monogram gótico "BB" en
  `public/logos/black-bash.jpg`), aprox. `#8B0000`–`#A30000`.
- **Tipografía:** *Bebas Neue* (títulos/display, tracking amplio) + *Syne*
  (UI/cuerpo, pesos 400–800), vía Google Fonts.
- **Tono:** "Never Give Up", streetwear urbano, actitud, no tendencia
  genérica.
- **Fotografía de producto:** editorial, muy de cerca, denim oscuro, parche
  de piel con logo herradura, tab rojo — 6 fotos reales disponibles en
  `public/img/black-bash/01.png`–`06.png` (2 playeras, 2 pantalones, 2
  gorras).
- **Patrones de componente reutilizables:** nav fija con borde superior
  blanco de 2px + hamburguesa en mobile, botón outline blanco, FAB de
  WhatsApp, scroll-to-top.

## Dirección visual elegida: "Editorial Streetwear Premium"

Evolución refinada de la identidad actual, no un rediseño desde cero:
fotografía a pantalla completa, grid asimétrico tipo revista (cards de
distinto tamaño para dar ritmo, no un grid uniforme aburrido), y el rojo de
marca usado con disciplina — solo en precios, CTAs primarios, badges y
estados activos, nunca como fondo grande. El resultado debe sentirse caro y
deseable, apto para vender ropa todos los días (no solo para un "drop" de
hype puntual).

## Alcance técnico

- Proyecto **Astro 5 + Tailwind 4** independiente en
  `C:\ERICK\Proyectos\Lalo\black-bash-shop`, hermano de `arkan-web`, mismo
  patrón de config (`@tailwindcss/vite`, sin adapter SSR).
- 100% estático — sin backend, sin pasarela de pago, sin persistencia real.
- Carrito con estado en cliente (JS + `localStorage`) para que agregar/quitar
  productos se sienta real durante la demo.
- Catálogo mock en `src/data/products.ts`: las 6 fotos reales existentes
  (reusadas desde `arkan-web/public/img/black-bash` o copiadas al nuevo
  proyecto) más placeholders adicionales prolijos (mismo tratamiento visual
  oscuro) para simular un catálogo más grande sin inventar fotografía real.

### Estructura de carpetas

```
black-bash-shop/
├── src/
│   ├── layouts/ShopLayout.astro
│   ├── components/
│   │   ├── shop/       (Nav, Hero, ProductCard, ProductGrid, Filters, CartDrawer, Footer)
│   │   └── pdp/         (Gallery, SizeSelector, Accordion, CrossSell)
│   ├── data/products.ts
│   ├── pages/
│   │   ├── index.astro          → Home
│   │   ├── shop.astro            → Catálogo con filtros
│   │   ├── product/[slug].astro  → PDP
│   │   └── checkout.astro        → Carrito/checkout visual
│   └── styles/global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Páginas

### Home (`/`)
Hero cinemático a pantalla completa con foto real de producto, monograma BB
y tagline "NEVER GIVE UP" como ancla emocional. Debajo: franja de categorías
(Playeras / Pantalones / Gorras) como tarjetas grandes clicables; sección
"Bestsellers" con 4–6 productos; banda editorial de storytelling de marca
(adaptada del `statement` ya escrito en `brands.ts`); cierre con CTA al
catálogo completo.

### Catálogo (`/shop`)
Grid asimétrico (celdas de distinto tamaño, no uniforme) con filtros por
categoría, talla y precio, breadcrumb y contador de resultados. Cada card:
imagen con hover que revela una segunda foto, nombre, precio, tallas
disponibles como chips.

### PDP (`/product/[slug]`)
Galería grande (izquierda en desktop, superior en mobile) + panel de compra
(nombre, precio, selector de talla/color, botón "Agregar al carrito" con
feedback visual, acordeón de detalles — material, cuidado, guía de tallas).
Franja "Completa el look" con 3 productos relacionados.

### Carrito + Checkout
Drawer lateral de carrito, accesible desde cualquier página al agregar un
producto: lista de items, cantidad, subtotal, CTA a checkout. Checkout como
flujo de 2–3 pasos visuales (Envío → Pago → Confirmación) con indicador de
progreso, simulado end-to-end, terminando en pantalla de "pedido
confirmado".

## Sistema de diseño

- **Color:** `#0A0A0A` fondo, `#F0F0F0` texto, rojo de marca solo en acentos
  (precios, CTAs primarios, badges/estados activos).
- **Tipografía:** Bebas Neue para títulos/precios grandes, Syne para UI y
  cuerpo, con una escala consistente de 4–5 tamaños (en vez de tamaños
  ad-hoc por sección como en el sitio actual).
- **Motion:** micro-interacciones sutiles — hover en cards (segunda foto +
  leve zoom), drawer con slide-in, transiciones de página suaves. Sin
  parallax ni animaciones pesadas que distraigan de vender producto.
- **Componentes heredados del sitio actual:** botón outline blanco, patrón
  de nav fija + hamburguesa mobile, FAB de WhatsApp (útil para dudas
  pre-compra), scroll-to-top.

## Fuera de alcance

- Backend, base de datos, autenticación de usuarios.
- Pasarela de pago real o procesamiento de pedidos.
- Integración con inventario o CMS.
- Contenido/fotografía nueva más allá de las 6 fotos reales existentes y
  placeholders visuales.

## Testing / verificación

Al ser una demo visual, la verificación es manual: correr `astro dev`,
navegar el flujo completo (Home → Catálogo → filtrar → PDP → agregar al
carrito → abrir drawer → checkout → confirmación) en desktop y mobile,
confirmar que no hay errores de consola y que el sitio compila con
`astro build`.
