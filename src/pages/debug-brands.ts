import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const API = import.meta.env.API_URL ?? 'https://api.arkangroup.mx';
  const brands = ['ARUBA', 'BAKARI', 'BLACK_BASH'];
  const results: Record<string, any> = {};

  for (const brand of brands) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
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
      results[brand] = { error: e?.message ?? 'unknown' };
    }
  }

  return new Response(JSON.stringify({ api: API, results }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
