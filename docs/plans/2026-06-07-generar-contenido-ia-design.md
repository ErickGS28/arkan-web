# Diseño — Generar contenido de blog con IA (Gemini)

**Fecha:** 7 Junio 2026

---

## Objetivo

Agregar un botón **"Generar contenido"** en el CRUD de blog del panel admin que use la
API de Google Gemini para redactar posts completos (título, resumen y contenido),
siempre alineados con la filosofía editorial de Arkán Group.

## Decisiones de diseño (acordadas)

| Decisión | Elección | Razón |
|---|---|---|
| Dónde vive la API key | Endpoint en el backend NestJS | La key nunca llega al navegador; no se expone en código público. |
| Entrada de la IA | Tema/instrucción libre + título opcional | Máxima flexibilidad para el editor. |
| Qué genera | Título, resumen y contenido (HTML) | Borrador completo listo para editar. |
| Páginas | `new.astro` y `edit.astro` | Crear y regenerar/extender. |
| Sobrescritura | Pedir confirmación si ya hay texto | Evita perder trabajo manual. |

## Arquitectura

### Backend (`arkan-service`)

- **`.env`:** `GEMINI_API_KEY`, `GEMINI_MODEL` (default `gemini-2.5-flash`).
- **`AiService`** (`src/modules/blog/ai.service.ts`):
  - Lee la config con `ConfigService`; si falta la key → `ServiceUnavailableException`
    (mismo patrón que `CloudflareService`).
  - Construye un **system prompt con la filosofía de Arkán** y llama a la REST API de
    Gemini con `fetch` global (Node 22, sin dependencias nuevas).
  - Usa `responseMimeType: application/json` + `responseSchema` para forzar salida
    estructurada `{ title, excerpt, content }`. `content` es HTML limpio restringido a
    las etiquetas que soporta el toolbar de Quill (`h2, h3, p, strong, em, ul, ol, li,
    blockquote, a`).
  - Errores de red/upstream → `BadGatewayException`.
- **`GenerateContentDto`** con `class-validator` (`topic` requerido, `title` opcional).
- **Endpoint:** `POST /blog/generate` (`@UseGuards(SessionGuard)`), antes de `POST /blog`.

### Frontend (`arkan-web`)

- Tarjeta lateral oscura con textarea de tema + botón "Generar contenido" en `new.astro`
  y `edit.astro`.
- Al generar: `POST {API}/blog/generate` con `credentials: 'include'`; rellena título,
  resumen y carga el contenido en Quill. Confirma antes de sobrescribir texto existente.
  Estado de carga (spinner) y toasts de éxito/error, reusando estilos existentes.

## Nota de marca importante

"Apostar por lo nacional 🇲🇽" en Arkán significa **fortalecer al distribuidor y al mercado
mexicano**, NO que la tela sea fabricada en México. Arkán distribuye orgullosamente denim
colombiano de calidad (Aruba Jeans) y tiene un post propio que lo celebra. El system prompt
lo aclara explícitamente para que la IA nunca escriba en contra del origen colombiano: el
enemigo es la baja calidad, no el origen.

## Verificación

- `tsc --noEmit` (backend) y `astro build` (frontend) pasan.
- Llamada real a la API de Gemini confirmada: key y modelo válidos, salida JSON
  estructurada con las etiquetas HTML correctas y contenido on-brand.
