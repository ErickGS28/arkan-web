# Admin Login UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar `/login` y `/admin` al sitio Astro para probar el auth del backend NestJS local.

**Architecture:** Dos páginas Astro estáticas con `<script>` inline para fetch al backend en `localhost:4013`. No SSR adapter necesario — toda la lógica de auth corre en el browser. Las páginas usan su propio layout minimalista sin nav ni FABs del sitio marketing.

**Tech Stack:** Astro (static), Bebas Neue + Syne (Google Fonts via Layout.astro), fetch API, cookie `session_id` (httpOnly set by backend)

---

## Files

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Create | `src/pages/login.astro` | Formulario de login, valida sesión al cargar, redirige a `/admin` |
| Create | `src/pages/admin.astro` | Dashboard post-login, muestra nombre + rol, logout |

---

## Task 1: Página `/login`

**Files:**
- Create: `src/pages/login.astro`

- [ ] **Step 1: Crear `src/pages/login.astro`**

```astro
---
// src/pages/login.astro
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login — Arkán Group</title>
  <link rel="icon" type="image/jpeg" href="/logos/arkan.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A0A0A;
      color: #F0F0F0;
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      width: 100%;
      max-width: 400px;
      padding: 48px 40px;
      border: 1px solid #1A1A1A;
      background: #0F0F0F;
    }
    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 32px;
    }
    .logo-img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      opacity: 0.85;
    }
    .logo-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 4px;
      color: #FFFFFF;
    }
    .card-label {
      font-size: 10px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 28px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #666;
    }
    input {
      background: #141414;
      border: 1px solid #222;
      color: #F0F0F0;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      padding: 12px 14px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    input:focus { border-color: #444; }
    .btn {
      width: 100%;
      margin-top: 8px;
      padding: 14px;
      background: #FFFFFF;
      color: #0A0A0A;
      font-family: 'Syne', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover { background: #E0E0E0; }
    .btn:disabled { background: #333; color: #666; cursor: not-allowed; }
    .error {
      margin-top: 16px;
      font-size: 11px;
      letter-spacing: 1px;
      color: #E1306C;
      text-align: center;
      min-height: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-wrap">
      <img src="/logos/arkan.jpg" alt="Arkán" class="logo-img" />
      <span class="logo-name">ARKÁN</span>
    </div>
    <p class="card-label">Panel Administrativo</p>
    <form id="loginForm">
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" type="password" autocomplete="current-password" required />
      </div>
      <button class="btn" id="submitBtn" type="submit">Entrar</button>
    </form>
    <p class="error" id="errorMsg"></p>
  </div>

  <script>
    const API = 'http://localhost:4013';

    // Si ya tiene sesión válida, ir directo al admin
    (async () => {
      try {
        const res = await fetch(`${API}/auth/validate`, { credentials: 'include' });
        if (res.ok) window.location.href = '/admin';
      } catch {}
    })();

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn') as HTMLButtonElement;
      const errorMsg = document.getElementById('errorMsg')!;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;

      btn.disabled = true;
      btn.textContent = 'Verificando...';
      errorMsg.textContent = '';

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          window.location.href = '/admin';
        } else {
          const data = await res.json().catch(() => ({}));
          errorMsg.textContent = data?.message || 'Credenciales inválidas';
          btn.disabled = false;
          btn.textContent = 'Entrar';
        }
      } catch {
        errorMsg.textContent = 'Error de conexión con el servidor';
        btn.disabled = false;
        btn.textContent = 'Entrar';
      }
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verificar que Astro compila sin errores**

```bash
cd C:\ERICK\Proyectos\Lalo\arkan-web
npm run build
```
Expected: `9 page(s) built` → ahora serán `10 page(s) built` incluyendo `/login`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/login.astro
git commit -m "feat: agregar página /login para panel admin"
```

---

## Task 2: Página `/admin`

**Files:**
- Create: `src/pages/admin.astro`

- [ ] **Step 1: Crear `src/pages/admin.astro`**

```astro
---
// src/pages/admin.astro
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin — Arkán Group</title>
  <link rel="icon" type="image/jpeg" href="/logos/arkan.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A0A0A;
      color: #F0F0F0;
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    /* Loading state */
    .loading {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      letter-spacing: 3px;
      color: #444;
      text-transform: uppercase;
    }
    /* Nav */
    .topbar {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
      border-bottom: 1px solid #1A1A1A;
    }
    .topbar.visible { display: flex; }
    .topbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .topbar-logo {
      width: 30px;
      height: 30px;
      object-fit: contain;
      opacity: 0.7;
    }
    .topbar-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 4px;
      color: #FFFFFF;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #2A2A2A;
      color: #888;
      font-family: 'Syne', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 8px 18px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-logout:hover { border-color: #555; color: #F0F0F0; }
    /* Main */
    .main {
      display: none;
      padding: 60px 40px;
      max-width: 900px;
    }
    .main.visible { display: block; }
    .greeting-label {
      font-size: 10px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #444;
      margin-bottom: 12px;
    }
    .greeting-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(40px, 6vw, 72px);
      letter-spacing: 2px;
      line-height: 1;
      color: #FFFFFF;
      margin-bottom: 20px;
    }
    .role-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border: 1px solid #2A2A2A;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #888;
    }
    .role-chip.gerente { border-color: #3A3A3A; color: #FFFFFF; }
    .role-chip.cliente { border-color: #2A2A2A; color: #888; }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #444;
    }
    .role-chip.gerente .dot { background: #FFFFFF; }
    .divider {
      width: 40px;
      height: 1px;
      background: #1A1A1A;
      margin: 40px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1px;
      background: #1A1A1A;
      border: 1px solid #1A1A1A;
      max-width: 560px;
    }
    .info-cell {
      background: #0F0F0F;
      padding: 20px 24px;
    }
    .info-label {
      font-size: 9px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #444;
      margin-bottom: 8px;
    }
    .info-value {
      font-size: 14px;
      color: #CCCCCC;
    }
  </style>
</head>
<body>
  <div class="loading" id="loading">Verificando sesión...</div>

  <nav class="topbar" id="topbar">
    <div class="topbar-brand">
      <img src="/logos/arkan.jpg" alt="Arkán" class="topbar-logo" />
      <span class="topbar-name">ARKÁN ADMIN</span>
    </div>
    <button class="btn-logout" id="logoutBtn">Cerrar sesión</button>
  </nav>

  <main class="main" id="mainContent">
    <p class="greeting-label">Bienvenido de vuelta</p>
    <h1 class="greeting-name" id="userName"></h1>
    <span class="role-chip" id="roleChip">
      <span class="dot"></span>
      <span id="roleLabel"></span>
    </span>
    <div class="divider"></div>
    <div class="info-grid">
      <div class="info-cell">
        <p class="info-label">Email</p>
        <p class="info-value" id="userEmail"></p>
      </div>
      <div class="info-cell">
        <p class="info-label">Rol</p>
        <p class="info-value" id="userRole"></p>
      </div>
    </div>
  </main>

  <script>
    const API = 'http://localhost:4013';

    async function init() {
      try {
        const res = await fetch(`${API}/auth/validate`, { credentials: 'include' });
        if (!res.ok) { window.location.href = '/login'; return; }

        const json = await res.json();
        const user = json?.data?.user ?? json?.user;

        // Poblar UI
        const firstName = user.name ?? '';
        document.getElementById('userName')!.textContent = firstName.toUpperCase();
        document.getElementById('userEmail')!.textContent = user.email ?? '';
        document.getElementById('userRole')!.textContent = user.role ?? '';
        document.getElementById('roleLabel')!.textContent = user.role ?? '';

        const chip = document.getElementById('roleChip')!;
        chip.classList.add(user.role === 'GERENTE' ? 'gerente' : 'cliente');

        // Mostrar UI
        document.getElementById('loading')!.style.display = 'none';
        document.getElementById('topbar')!.classList.add('visible');
        document.getElementById('mainContent')!.classList.add('visible');
      } catch {
        window.location.href = '/login';
      }
    }

    document.getElementById('logoutBtn')!.addEventListener('click', async () => {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      window.location.href = '/login';
    });

    init();
  </script>
</body>
</html>
```

- [ ] **Step 2: Build y verificar**

```bash
npm run build
```
Expected: `11 page(s) built` (incluye `/login` y `/admin`).

- [ ] **Step 3: Commit y push**

```bash
git add src/pages/admin.astro
git commit -m "feat: agregar dashboard /admin para panel administrativo"
git push
```

---

## Prueba manual

Con el servidor Astro (`npm run dev`) y NestJS (`npm run start:dev`) corriendo:

1. Ir a `http://localhost:4321/login`
2. Ingresar `gerente@arkan.com` / `Arkan2024!` → debe redirigir a `/admin` mostrando nombre y chip **GERENTE**
3. Cerrar sesión → vuelve a `/login`
4. Repetir con `cliente@arkan.com` → chip **CLIENTE**
5. Abrir `/admin` sin sesión → debe redirigir a `/login`
