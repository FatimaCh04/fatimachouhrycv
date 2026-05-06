import { supabase } from './supabaseClient';
import { notifyStorageCacheUpdated } from './storageCacheEvents.js';

/** Must match what PublicProfileContext / legacy hooks expect in localStorage */
export const PROFILE_CACHE_KEY = 'supabase_profile_v2';

let inflight = null;

async function fetchProfileRowFromSupabase() {
  // First choice: most recently updated profile row.
  let q = await supabase
    .from('profile')
    .select('name, title, tagline, photo')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!q.error && q.data) {
    return { data: q.data, error: null };
  }

  // Fallback for schemas without updated_at.
  q = await supabase
    .from('profile')
    .select('name, title, tagline, photo')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data: q.data || null, error: q.error || null };
}

/** Full cache envelope (row + `at` ms for image cache-busting after upload / CDN) */
export function readCachedProfileEnvelope() {
  if (typeof window === 'undefined') return { data: null, at: null };
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return { data: null, at: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Object.prototype.hasOwnProperty.call(parsed, 'data')) {
      return { data: null, at: null };
    }
    const row = parsed.data;
    const at = typeof parsed.at === 'number' && Number.isFinite(parsed.at) ? parsed.at : null;
    return {
      data: row && typeof row === 'object' ? row : null,
      at,
    };
  } catch {
    return { data: null, at: null };
  }
}

/** Sync read — instant paint on repeat visits */
export function readCachedProfileRow() {
  return readCachedProfileEnvelope().data;
}

/** Append cache-buster for remote/static images so updated Supabase/storage files show after same URL */
export function profilePhotoSrc(photo, cacheAtMs) {
  const p = typeof photo === 'string' ? photo.trim() : '';
  if (!p) return p;
  if (p.startsWith('data:') || p.startsWith('blob:')) return p;
  if (cacheAtMs == null) return p;
  const join = p.includes('?') ? '&' : '?';
  return `${p}${join}v=${encodeURIComponent(String(cacheAtMs))}`;
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

  inflight = fetchProfileRowFromSupabase()
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
