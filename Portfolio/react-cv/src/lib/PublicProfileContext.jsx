import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  PROFILE_CACHE_KEY,
  primeProfileFetch,
  profilePhotoSrc,
  readCachedProfileEnvelope,
} from './profileLoad';
import { STORAGE_CACHE_UPDATE_EVENT } from './storageCacheEvents.js';

const DEFAULT_PROFILE = {
  name: 'Fatima Choudhry',
  title: 'Software Engineer | Full Stack and Cross-Platform Developer',
  tagline: 'Building scalable automation and custom software solutions.',
  photo: '/assets/images/profile-placeholder.svg',
};

const PublicProfileContext = createContext(null);

/**
 * One profile fetch for the whole public app; pairs with `primeProfileFetch()` in main.jsx
 * so the network request starts before React mounts on cold loads.
 */
export function ProfileProvider({ children }) {
  const init = typeof window !== 'undefined' ? readCachedProfileEnvelope() : { data: null, at: null };
  const [data, setData] = useState(() => init.data);
  const [cacheAt, setCacheAt] = useState(() => init.at);
  const [loading, setLoading] = useState(() => init.data == null);

  useEffect(() => {
    let cancelled = false;
    primeProfileFetch().then(({ data: row, error }) => {
      if (cancelled) return;
      if (!error && row && typeof row === 'object') {
        setData(row);
        const { at } = readCachedProfileEnvelope();
        setCacheAt(at);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      const { data: row, at } = readCachedProfileEnvelope();
      if (row) {
        setData(row);
        setCacheAt(at);
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
      const trimmed = typeof data.photo === 'string' ? data.photo.trim() : '';
      const rawPhoto = trimmed || null;
      return {
        name: data.name || DEFAULT_PROFILE.name,
        title: data.title || DEFAULT_PROFILE.title,
        tagline: data.tagline || DEFAULT_PROFILE.tagline,
        photo: rawPhoto ? profilePhotoSrc(rawPhoto, cacheAt) : null,
      };
    }
    if (loading) {
      return {
        ...DEFAULT_PROFILE,
        photo: null,
      };
    }
    return {
      ...DEFAULT_PROFILE,
      photo: profilePhotoSrc(DEFAULT_PROFILE.photo, cacheAt),
    };
  }, [data, loading, cacheAt]);

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
