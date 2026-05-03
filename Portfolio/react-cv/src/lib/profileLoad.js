import { supabase } from './supabaseClient';
import { notifyStorageCacheUpdated } from './storageCacheEvents.js';

/** Must match what PublicProfileContext / legacy hooks expect in localStorage */
export const PROFILE_CACHE_KEY = 'supabase_profile';

let inflight = null;

/** Sync read — instant paint on repeat visits */
export function readCachedProfileRow() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Object.prototype.hasOwnProperty.call(parsed, 'data')) {
      return null;
    }
    const row = parsed.data;
    return row && typeof row === 'object' ? row : null;
  } catch {
    return null;
  }
}

/**
 * Starts as soon as `main.jsx` runs — before React paints — and dedupes with ProfileProvider.
 * Writes localStorage on success for the next cold load.
 */
export function primeProfileFetch() {
  if (typeof window === 'undefined') {
    return Promise.resolve({ data: null, error: null });
  }
  if (inflight) return inflight;

  inflight = supabase
    .from('profile')
    .select('name, title, tagline, photo')
    .limit(1)
    .maybeSingle()
    .then(({ data, error }) => {
      if (!error && data) {
        try {
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ data, at: Date.now() }));
          notifyStorageCacheUpdated(PROFILE_CACHE_KEY);
        } catch (_) {}
      }
      return { data, error };
    })
    .catch((err) => ({ data: null, error: err }))
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
