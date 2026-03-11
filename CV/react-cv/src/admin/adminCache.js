/**
 * Short-lived in-memory cache for admin data so pages load instantly when navigating.
 */
const TTL_MS = 2 * 60 * 1000; // 2 minutes

const cache = {
  projects: { data: null, at: 0 },
  posts: { data: null, at: 0 },
  services: { data: null, at: 0 },
  contact_links: { data: null, at: 0 },
  profile: { data: null, at: 0 },
};

function isFresh(entry) {
  return entry && entry.data !== null && Date.now() - entry.at < TTL_MS;
}

export const adminCache = {
  getProjects: () => (isFresh(cache.projects) ? cache.projects.data : null),
  setProjects: (data) => { cache.projects = { data, at: Date.now() }; },

  getPosts: () => (isFresh(cache.posts) ? cache.posts.data : null),
  setPosts: (data) => { cache.posts = { data, at: Date.now() }; },

  getServices: () => (isFresh(cache.services) ? cache.services.data : null),
  setServices: (data) => { cache.services = { data, at: Date.now() }; },

  getContactLinks: () => (isFresh(cache.contact_links) ? cache.contact_links.data : null),
  setContactLinks: (data) => { cache.contact_links = { data, at: Date.now() }; },

  getProfile: () => (isFresh(cache.profile) ? cache.profile.data : null),
  setProfile: (data) => { cache.profile = { data, at: Date.now() }; },
};
