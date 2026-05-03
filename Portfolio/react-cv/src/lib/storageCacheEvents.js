/** When localStorage cache is written (e.g. prime* fetch), hooks can sync without waiting for network round-trip #2 */
export const STORAGE_CACHE_UPDATE_EVENT = 'app-localstorage-cache-update';

export function notifyStorageCacheUpdated(key) {
  if (typeof window === 'undefined' || !key) return;
  window.dispatchEvent(new CustomEvent(STORAGE_CACHE_UPDATE_EVENT, { detail: { key } }));
}
