import { supabase } from './supabaseClient';

/** Must match Portfolio grid query — narrow columns, fast payload */
export const PORTFOLIO_GRID_SELECT =
  'id, title, description, category, technologies, image, live_link, github_link, created_at';

export const PORTFOLIO_GRID_CACHE_KEY = 'portfolio_grid_v1';
export const PORTFOLIO_GRID_CACHE_TTL_MS = 30 * 60 * 1000; // 30 min fresh window (stale still shown instantly)

/** Skip network if cache written recently — avoids duplicate work on fast navigations */
const PREFETCH_MIN_INTERVAL_MS = 90 * 1000;

let lastPrefetchAt = 0;

/**
 * Warm localStorage before user opens Portfolio (Home load / layout mount).
 * Same shape as useSupabaseQuery `setInStorage`.
 */
export async function prefetchPortfolioGrid() {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (now - lastPrefetchAt < PREFETCH_MIN_INTERVAL_MS) return;
  lastPrefetchAt = now;

  try {
    const raw = window.localStorage.getItem(PORTFOLIO_GRID_CACHE_KEY);
    if (raw) {
      const { at } = JSON.parse(raw);
      if (typeof at === 'number' && now - at < PREFETCH_MIN_INTERVAL_MS) return;
    }

    const { data, error } = await supabase
      .from('projects')
      .select(PORTFOLIO_GRID_SELECT)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !Array.isArray(data)) return;

    window.localStorage.setItem(
      PORTFOLIO_GRID_CACHE_KEY,
      JSON.stringify({ data, at: Date.now() })
    );
  } catch (_) {
    /* ignore — prefetch is best-effort */
  }
}
