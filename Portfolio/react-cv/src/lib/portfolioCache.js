import { supabase } from './supabaseClient';
import { notifyStorageCacheUpdated } from './storageCacheEvents.js';

/** Must match Portfolio / Home / Resume shared grid query — narrow columns, fast payload */
export const PORTFOLIO_GRID_SELECT =
  'id, title, description, category, technologies, image, live_link, github_link, created_at';

export const PORTFOLIO_GRID_CACHE_KEY = 'portfolio_grid_v1';
export const PORTFOLIO_GRID_CACHE_TTL_MS = 30 * 60 * 1000;

let portfolioInflight = null;

/**
 * Deduped projects fetch — several callers can await the same promise.
 * Writes localStorage (same shape as useSupabaseQuery) so Portfolio/Home open instantly after warm load.
 */
export function primePortfolioGridFetch() {
  if (typeof window === 'undefined') {
    return Promise.resolve({ data: null, error: null });
  }
  if (portfolioInflight) return portfolioInflight;

  portfolioInflight = supabase
    .from('projects')
    .select(PORTFOLIO_GRID_SELECT)
    .order('created_at', { ascending: false })
    .limit(50)
    .then(({ data, error }) => {
      if (!error && Array.isArray(data)) {
        try {
          window.localStorage.setItem(
            PORTFOLIO_GRID_CACHE_KEY,
            JSON.stringify({ data, at: Date.now() })
          );
          notifyStorageCacheUpdated(PORTFOLIO_GRID_CACHE_KEY);
        } catch (_) {}
      }
      return { data, error };
    })
    .catch((err) => ({ data: null, error: err }))
    .finally(() => {
      portfolioInflight = null;
    });

  return portfolioInflight;
}

/** @deprecated same as primePortfolioGridFetch — kept for older imports */
export async function prefetchPortfolioGrid() {
  return primePortfolioGridFetch();
}
