import { supabase } from '../lib/supabaseClient';

export async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Login error:', error.message);
    return false;
  }
  return true;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Logout error:', error.message);
}

export const AdminData = {
  getBlogPosts: async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    return data;
  },
  saveBlogPost: async (post) => {
    const { data, error } = await supabase.from('posts').upsert(post).select();
    if (error) console.error('Error saving post:', error);
    return data;
  },
  deleteBlogPost: async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error('Error deleting post:', error);
  },

  getProjects: async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data;
  },
  saveProject: async (project) => {
    const { data, error } = await supabase.from('projects').upsert(project).select();
    if (error) console.error('Error saving project:', error);
    return data;
  },
  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error('Error deleting project:', error);
  },

  getServices: async () => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data;
  },
  saveService: async (service) => {
    const { data, error } = await supabase.from('services').upsert(service).select();
    if (error) console.error('Error saving service:', error);
    return data;
  },
  deleteService: async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) console.error('Error deleting service:', error);
  },
};
