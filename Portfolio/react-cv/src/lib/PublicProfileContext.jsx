import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PROFILE_CACHE_KEY, primeProfileFetch, readCachedProfileRow } from './profileLoad';
import { STORAGE_CACHE_UPDATE_EVENT } from './storageCacheEvents.js';

const DEFAULT_PROFILE = {
  name: 'Fatima Choudhry',
  title: 'Software Engineer | Full Stack and Cross-Platform Developer',
  tagline: 'Building scalable automation and custom software solutions.',
  photo: '/assets/images/profile.jpg',
};

const PublicProfileContext = createContext(null);

/**
 * One profile fetch for the whole public app; pairs with `primeProfileFetch()` in main.jsx
 * so the network request starts before React mounts on cold loads.
 */
export function ProfileProvider({ children }) {
  const [data, setData] = useState(() => readCachedProfileRow());
  const [loading, setLoading] = useState(() => readCachedProfileRow() == null);

  useEffect(() => {
    let cancelled = false;
    primeProfileFetch().then(({ data: row, error }) => {
      if (cancelled) return;
      if (!error && row && typeof row === 'object') {
        setData(row);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      const row = readCachedProfileRow();
      if (row) {
        setData(row);
        setLoading(false);
      }
    };
    const onCache = (ev) => {
      if (ev.detail?.key !== PROFILE_CACHE_KEY) return;
      sync();
    };
    window.addEventListener(STORAGE_CACHE_UPDATE_EVENT, onCache);
    queueMicrotask(sync);
    const raf = requestAnimationFrame(sync);
    return () => {
      window.removeEventListener(STORAGE_CACHE_UPDATE_EVENT, onCache);
      cancelAnimationFrame(raf);
    };
  }, []);

  const profile = useMemo(() => {
    if (data && typeof data === 'object') {
      return {
        name: data.name || DEFAULT_PROFILE.name,
        title: data.title || DEFAULT_PROFILE.title,
        tagline: data.tagline || DEFAULT_PROFILE.tagline,
        photo: data.photo && data.photo.trim() ? data.photo.trim() : DEFAULT_PROFILE.photo,
      };
    }
    if (loading) {
      return {
        ...DEFAULT_PROFILE,
        photo: null,
      };
    }
    return DEFAULT_PROFILE;
  }, [data, loading]);

  const value = useMemo(() => ({ profile, loading }), [profile, loading]);

  return <PublicProfileContext.Provider value={value}>{children}</PublicProfileContext.Provider>;
}

export function usePublicProfile() {
  const ctx = useContext(PublicProfileContext);
  if (!ctx) {
    throw new Error('usePublicProfile must be used inside ProfileProvider');
  }
  return ctx;
}
