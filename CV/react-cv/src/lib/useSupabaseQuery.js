import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFromStorage(cacheKey, ttlMs) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const { data, at } = JSON.parse(raw);
    if (Date.now() - at > ttlMs) return null;
    return data;
  } catch (_) {
    return null;
  }
}

function setInStorage(cacheKey, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ data, at: Date.now() }));
  } catch (_) {}
}

/**
 * Reusable Supabase fetch hook with localStorage cache, loading state, and configurable select/order/limit.
 * @param {string} table - Supabase table name
 * @param {Object} options - { select, orderBy, orderAsc, limit, single, filter: { column, value }, enabled, cacheKey, cacheTTL }
 * @returns {{ data: Array|object|null, loading: boolean, error: Error|null, refetch: function }}
 */
const activePromises = new Map();

export function useSupabaseQuery(table, options = {}) {
  const {
    select = '*',
    orderBy,
    orderAsc = true,
    limit,
    single = false,
    filter,
    enabled = true,
    cacheKey,
    cacheTTL = 5 * 60 * 1000,
    /** If true, never read cached row from localStorage on mount (avoids stale profile photo flashes). */
    skipStorageHydration = false,
    /** If false, do not write query results to localStorage (still broadcasts CustomEvent when cacheKey is set). */
    persistToStorage: persistToStorageOpt,
  } = options;

  const persistToStorage = persistToStorageOpt ?? !skipStorageHydration;

  const emptyValue = single ? null : [];

  const hadStorageOnMountRef = useRef(null);
  if (hadStorageOnMountRef.current === null) {
    hadStorageOnMountRef.current =
      !!(cacheKey && enabled && !skipStorageHydration && getFromStorage(cacheKey, cacheTTL) !== null);
  }

  const [data, setData] = useState(() => {
    if (!cacheKey || !enabled || skipStorageHydration) return emptyValue;
    const s = getFromStorage(cacheKey, cacheTTL);
    return s !== null ? s : emptyValue;
  });
  const [loading, setLoading] = useState(() => {
    if (!enabled) return false;
    if (!cacheKey || skipStorageHydration) return true;
    const s = getFromStorage(cacheKey, cacheTTL);
    return s === null;
  });
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setData(emptyValue);
      setLoading(false);
      return;
    }
    setError(null);

    const promiseKey = cacheKey || `${table}_${select}_${limit}`;

    try {
      if (activePromises.has(promiseKey)) {
        const result = await activePromises.get(promiseKey);
        const value = single ? result : (Array.isArray(result) ? result : []);
        setData(value);
        return;
      }

      let query = supabase.from(table).select(select);
      if (filter && filter.column != null && filter.value !== undefined && filter.value !== null) {
        query = query.eq(filter.column, filter.value);
      }
      if (orderBy) query = query.order(orderBy, { ascending: orderAsc });
      if (limit && !single) query = query.limit(limit);
      if (single) query = filter ? query.maybeSingle() : query.limit(1).maybeSingle();

      const fetchPromise = query.then(({ data: result, error: err }) => {
        if (err) throw err;
        return result;
      });

      activePromises.set(promiseKey, fetchPromise);
      const result = await fetchPromise;

      const value = single ? result : (Array.isArray(result) ? result : []);
      setData(value);
      if (cacheKey) {
        if (persistToStorage) setInStorage(cacheKey, value);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('supabase_query_update', { detail: { cacheKey, value } }));
        }
      }
    } catch (err) {
      setError(err);
      if (!hadStorageOnMountRef.current || skipStorageHydration) setData(emptyValue);
    } finally {
      activePromises.delete(promiseKey);
      setLoading(false);
    }
  }, [table, select, orderBy, orderAsc, limit, single, enabled, cacheKey, persistToStorage, skipStorageHydration, filter?.column, filter?.value]);

  useEffect(() => {
    if (!cacheKey || typeof window === 'undefined') return;
    const handleUpdate = (e) => {
      if (e.detail && e.detail.cacheKey === cacheKey) {
        setData(e.detail.value);
      }
    };
    const handleStorageEvent = (e) => {
      if (e.key === cacheKey) {
        if (!e.newValue) {
          // Cache was cleared from another tab (like Admin panel). Refetch!
          fetchData();
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            setData(parsed.data);
          } catch (_) {}
        }
      }
    };
    window.addEventListener('supabase_query_update', handleUpdate);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('supabase_query_update', handleUpdate);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [cacheKey, fetchData]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setData(emptyValue);
      return;
    }
    if (!hadStorageOnMountRef.current) setLoading(true);
    fetchData();
  }, [fetchData, enabled]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
