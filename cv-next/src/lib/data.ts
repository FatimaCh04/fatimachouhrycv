import { createClient } from '@/lib/supabase/server';
import type { Profile, Project, Service, Post } from '@/types/database';

export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = createClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    if (error) return [];
    return (data ?? []) as Project[];
  } catch {
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const supabase = createClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Project;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = createClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (error) return [];
    return (data ?? []) as Service[];
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const supabase = createClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const supabase = createClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Post;
  } catch {
    return null;
  }
}
