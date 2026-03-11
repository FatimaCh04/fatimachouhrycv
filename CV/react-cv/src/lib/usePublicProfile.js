import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const DEFAULT_PROFILE = {
  name: 'Fatima Choudhry',
  title: 'Software Engineering Student',
  tagline: 'Building scalable automation and custom software solutions.',
  photo: '/assets/images/profile.jpg',
};

export function usePublicProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('profile')
      .select('name, title, tagline, photo')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setProfile({
            name: data.name || DEFAULT_PROFILE.name,
            title: data.title || DEFAULT_PROFILE.title,
            tagline: data.tagline || DEFAULT_PROFILE.tagline,
            photo: (data.photo && data.photo.trim()) ? data.photo.trim() : DEFAULT_PROFILE.photo,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { profile, loading };
}
