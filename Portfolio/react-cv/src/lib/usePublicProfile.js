import { useMemo } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';

const DEFAULT_PROFILE = {
  name: 'Fatima Choudhry',
  title: 'Software Engineer | Full Stack and Cross-Platform Developer',
  tagline: 'Building scalable automation and custom software solutions.',
  photo: '/assets/images/profile.jpg',
};

export function usePublicProfile() {
  const { data, loading } = useSupabaseQuery('profile', {
    select: 'name, title, tagline, photo',
    limit: 1,
    single: true,
    cacheKey: 'supabase_profile',
    cacheTTL: 5 * 60 * 1000,
  });

  const profile = useMemo(() => {
    if (!data || typeof data !== 'object') return DEFAULT_PROFILE;
    return {
      name: data.name || DEFAULT_PROFILE.name,
      title: data.title || DEFAULT_PROFILE.title,
      tagline: data.tagline || DEFAULT_PROFILE.tagline,
      photo: (data.photo && data.photo.trim()) ? data.photo.trim() : DEFAULT_PROFILE.photo,
    };
  }, [data]);

  return { profile, loading };
}
