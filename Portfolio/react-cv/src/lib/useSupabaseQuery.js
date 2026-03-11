import { useState, useEffect, useCallback } from 'react';
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
    cacheTTL = DEFAULT_TTL_MS,
  } = options;

  const emptyValue = single ? null : [];
  const cached = cacheKey && enabled ? getFromStorage(cacheKey, cacheTTL) : null;

  const [data, setData] = useState(cached !== null ? cached : emptyValue);
  const [loading, setLoading] = useState(enabled && cached === null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setData(emptyValue);
      setLoading(false);
      return;
    }
    setError(null);
    try {
      let query = supabase.from(table).select(select);
      if (filter && filter.column != null && filter.value !== undefined && filter.value !== null) {
        query = query.eq(filter.column, filter.value);
      }
      if (orderBy) query = query.order(orderBy, { ascending: orderAsc });
      if (limit && !single) query = query.limit(limit);
      if (single) query = filter ? query.maybeSingle() : query.limit(1).maybeSingle();

      const { data: result, error: err } = await query;
      if (err) throw err;

      const value = single ? result : (Array.isArray(result) ? result : []);
      setData(value);
      if (cacheKey) setInStorage(cacheKey, value);
    } catch (err) {
      setError(err);
      if (cached === null) setData(emptyValue);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy, orderAsc, limit, single, enabled, cacheKey, filter?.column, filter?.value]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setData(emptyValue);
      return;
    }
    if (cached === null) setLoading(true);
    fetchData();
  }, [fetchData, enabled]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
