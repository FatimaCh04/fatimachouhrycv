import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminData } from '../auth';
import { adminCache } from '../adminCache';
import { supabase } from '../../lib/supabaseClient';

function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, projects: 0, services: 0 });
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [postsRes, projectsRes, servicesRes] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
        ]);
        if (!cancelled) {
          setStats({
            posts: postsRes.count || 0,
            projects: projectsRes.count || 0,
            services: servicesRes.count || 0,
          });
        }
      } catch (_) {
        if (!cancelled) setStats({ posts: 0, projects: 0, services: 0 });
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleImport = async () => {
    setImporting(true);
    const dataDir = '/data/';
    try {
      const results = await Promise.all([
        fetch(dataDir + 'profile.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(dataDir + 'projects.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(dataDir + 'services.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(dataDir + 'posts.json').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);
      if (results[0]) AdminData.saveProfile(results[0]);
      if (Array.isArray(results[1]) && results[1].length) {
        for (const p of results[1]) await AdminData.saveProject(p);
      }
      if (Array.isArray(results[2])) {
        for (const s of results[2]) await AdminData.saveService(s);
      }
      if (Array.isArray(results[3])) {
        for (const p of results[3]) await AdminData.saveBlogPost(p);
      }
      const [posts, projects, services] = await Promise.all([
        AdminData.getBlogPosts(),
        AdminData.getProjects(),
        AdminData.getServices(),
      ]);
      setStats({
        posts: Array.isArray(posts) ? posts.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        services: Array.isArray(services) ? services.length : 0,
      });
      alert('Site data imported! You can now edit profile, projects, services, and posts.');
    } catch (e) {
      alert('Failed to load data.');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    const profile = AdminData.getProfile() || {};
    const profileJson = JSON.stringify({ name: profile.name || '', title: profile.title || '', tagline: profile.tagline || '', photo: profile.photo || '/assets/images/profile.jpg', resumeUrl: profile.resumeUrl || '' }, null, 2);
    let projects = [];
    let services = [];
    let posts = [];
    try {
      [projects, services, posts] = await Promise.all([
        AdminData.getProjects(),
        AdminData.getServices(),
        AdminData.getBlogPosts(),
      ]);
    } catch (_) {}
    const download = (filename, text) => {
      const a = document.createElement('a');
      a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(text);
      a.download = filename;
      a.click();
    };
    download('profile.json', profileJson);
    download('projects.json', JSON.stringify(Array.isArray(projects) && projects.length ? projects : [], null, 2));
    download('services.json', JSON.stringify(Array.isArray(services) && services.length ? services : [], null, 2));
    download('posts.json', JSON.stringify(Array.isArray(posts) && posts.length ? posts : [], null, 2));
    alert('4 files downloaded. Place them in your public/data/ folder to update the live site.');
  };

  return (
    <div className="max-w-4xl text-left">
      <h1 className="text-2xl font-bold text-white mb-2">Overview</h1>
      <p className="text-slate-400 mb-8">Site stats and quick links.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Blog Posts</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.posts}</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary/60">article</span>
          </div>
          <Link to="/admin/manage-posts" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">Manage <span className="material-symbols-outlined text-lg">arrow_forward</span></Link>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.projects}</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary/60">folder_open</span>
          </div>
          <Link to="/admin/manage-projects" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">Manage <span className="material-symbols-outlined text-lg">arrow_forward</span></Link>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Services</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.services}</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary/60">work</span>
          </div>
          <Link to="/admin/manage-services" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">Manage <span className="material-symbols-outlined text-lg">arrow_forward</span></Link>
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 mb-6 text-left">
        <h2 className="text-lg font-semibold text-white mb-2">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/manage-profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition">Edit profile</Link>
          <Link to="/admin/manage-posts" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition">Add post</Link>
          <Link to="/admin/manage-projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition">Add project</Link>
          <Link to="/admin/manage-services" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition">Add service</Link>
          <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition">View site</Link>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 text-left">
        <h2 className="text-lg font-semibold text-white mb-2">Sync with live site</h2>
        <p className="text-slate-400 text-sm mb-4">Admin edits are saved in this browser temporarily (localStorage). To update the public site persistently: export JSON and put the files in <code className="bg-slate-700 px-1 rounded">public/data/</code>.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleImport} disabled={importing} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 font-medium hover:bg-slate-600 transition disabled:opacity-50">
            <span className="material-symbols-outlined">upload</span>
            {importing ? 'Loading...' : 'Import from site data'}
          </button>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-slate-900 font-medium hover:opacity-90 transition">
            <span className="material-symbols-outlined">download</span>
            Export data (profile, projects, services, posts)
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
