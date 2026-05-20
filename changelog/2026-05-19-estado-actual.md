# Estado del Proyecto — Arkán Group
**Actualización:** 19 Mayo 2026

---

## Dónde estamos

El sitio pasó de ser 3 propuestas de presentación a un **proyecto formal y estructurado**. La propuesta 2 (Dark Premium) ganó y se convirtió en la base. Las propuestas 1 y 3 fueron eliminadas.

---

## Stack actual

- **Astro 5.18** + TypeScript
- **Tailwind v4** instalado pero los estilos van en `<style>` scoped por componente
- **Google Fonts**: Bebas Neue + Syne
- **Sin base de datos** — contenido en archivos `.ts` dentro de `src/data/`
- Build en ~2-3s, 9 páginas estáticas

---

## Identidad visual

| Decisión | Valor |
|---|---|
| Paleta | Full blanco y negro — `#0A0A0A` / `#FFFFFF` / `#F0F0F0` |
| Secciones | Alternado negro ↔ blanco (tomado de la propuesta 1) |
| Acentos de color | Eliminados (el dorado `#C9A96E` fue quitado de Arkán Group) |
| Tipografía | Bebas Neue (titulares) + Syne (cuerpo) |
| Logo favicon | `/logos/arkan.jpg` |

---

## Estructura de archivos

```
src/
├── data/
│   ├── brands.ts        ← datos de Aruba, Bakari, Black Bash
│   └── posts.ts         ← 4 artículos del blog
├── layouts/
│   ├── Layout.astro     ← base HTML global (is:global styles, fuentes, FABs)
│   └── BrandPage.astro  ← orquestador de páginas de marca
├── components/
│   ├── arkan/           ← 9 secciones de la home
│   ├── brand/           ← 6 secciones de páginas de marca
│   └── ui/              ← NacionalBadge (bandera MX)
└── pages/
    ├── index.astro
    ├── aruba.astro
    ├── bakari.astro
    ├── black-bash.astro
    └── blog/
        ├── index.astro
        └── [slug].astro
```

---

## Páginas activas

| Ruta | Contenido |
|---|---|
| `/` | Landing principal Arkán Group |
| `/aruba` | Página de marca Aruba Jeans |
| `/bakari` | Página de marca BKR Bakari |
| `/black-bash` | Página de marca Black Bash MX |
| `/blog` | Índice de artículos (diseño revista, imagen izquierda) |
| `/blog/[slug]` | 4 artículos sobre denim y distribución |

---

## Landing principal — secciones en orden

1. **Hero** — pantalla completa, logo, CTA a marcas y mayoreo
2. **Visión** — blanco, quiénes somos, texto editorial
3. **Mayoreo** — negro, badge MX, 3 estadísticas (aprox.), CTA WhatsApp
4. **Marcas** — blanco, 3 cards horizontales (Aruba / Bakari / Black Bash)
5. **Valores** — negro, 4 pilares en grid (Calidad, Origen, B2B, Rotación)
6. **Cómo funciona** — blanco, 3 pasos con números grandes
7. **CTA Final** — negro, "¿Listo para empezar?", watermark ARKÁN, botón WA
8. **Footer** — negro, marcas, info

---

## Elementos globales (en todas las páginas)

- **WhatsApp flotante** (esquina inferior derecha) → `wa.me/525564991943`
- **Scroll to top** (esquina inferior izquierda) — aparece al bajar 400px
- **Favicon** → logo Arkán

---

## Blog

4 artículos simulados con contenido real sobre el nicho:
1. *La mezclilla china vs. la calidad real*
2. *Guía de cortes de jeans por figura*
3. *El denim colombiano que está conquistando México*
4. *De $4,200 a un negocio real*

Agregar un post nuevo = un objeto más en `src/data/posts.ts`.

---

## Pendientes sugeridos

- [ ] **Número de WhatsApp real** en `brands.ts` → `cta.waLink` y en `CtaArkan.astro`
- [ ] **Imágenes de portada para el blog** — actualmente usa fotos de producto de las marcas
- [ ] **Deploy** — Vercel es el destino natural para Astro estático
- [ ] **Dominio** — definir si va en arkangroup.com.mx o similar
- [ ] **Páginas de marca** — revisar copy definitivo con el cliente
- [ ] **Mobile** — revisión en dispositivo real
- [ ] **Agregar más marcas** — el sistema está listo: objeto en `brands.ts` + página de 6 líneas
