import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const API = import.meta.env.API_URL ?? 'https://api.arkangroup.mx';

  // Prueba de conectividad a distintos hostnames posibles
  const hostProbes: Record<string, string> = {
    configured: API,
    'backend:4013': 'http://backend:4013',
    'arkan-backend:4013': 'http://arkan-backend:4013',
    'localhost:4013': 'http://localhost:4013',
    'public-api': 'https://api.arkangroup.mx',
  };
  const probeResults: Record<string, any> = {};
  for (const [label, url] of Object.entries(hostProbes)) {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 4000);
      const r = await fetch(`${url}/brands/categories?brand=ARUBA`, { signal: c.signal });
      clearTimeout(t);
      probeResults[label] = { ok: r.ok, status: r.status };
    } catch (e: any) {
      probeResults[label] = { error: e?.message, cause: e?.cause?.code ?? e?.cause?.message ?? null };
    }
  }

  const brands = ['ARUBA', 'BAKARI', 'BLACK_BASH'];
  const results: Record<string, any> = {};

  for (const brand of brands) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${API}/brands/categories?brand=${brand}`, {
        signal: controller.signal,
      });
      clearTimeout(t);

      if (res.ok) {
        const json = await res.json();
        const cats: any[] = Array.isArray(json) ? json : (json?.data ?? []);
        results[brand] = {
          status: res.status,
          categoryCount: cats.length,
          categories: cats.map((c: any) => ({
            name: c.name,
            imageCount: (c.images ?? []).length,
            images: (c.images ?? []).map((i: any) => i.url),
          })),
        };
      } else {
        results[brand] = { status: res.status, error: await res.text() };
      }
    } catch (e: any) {
      results[brand] = {
        error: e?.message ?? 'unknown',
        cause: e?.cause?.message ?? e?.cause?.code ?? null,
        code: e?.cause?.code ?? null,
      };
    }
  }

  return new Response(JSON.stringify({ api: API, probeResults, results }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
