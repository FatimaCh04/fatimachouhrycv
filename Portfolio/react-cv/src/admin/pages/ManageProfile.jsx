import React, { useState, useEffect, useRef } from 'react';
import { AdminData } from '../auth';
import { compressProfileImage } from '../../lib/compressProfileImage.js';
import { PROFILE_CACHE_KEY, primeProfileFetch } from '../../lib/profileLoad';
import { notifyStorageCacheUpdated } from '../../lib/storageCacheEvents.js';

function ManageProfile() {
  const [formData, setFormData] = useState({
    name: '', title: '', tagline: ''
  });
  const [imageDataUrl, setImageDataUrl] = useState('');
  const fileInputRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [photoOptimizing, setPhotoOptimizing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromSupabase = await AdminData.getProfileFromSupabase();
      const profile = fromSupabase || AdminData.getProfile() || {};
      if (!cancelled) {
        setFormData({
          name: profile.name || '',
          title: profile.title || '',
          tagline: profile.tagline || ''
        });
        setImageDataUrl(profile.photo || '');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    const input = e.target;
    if (!file || !file.type.match(/^image\//)) return;
    setPhotoOptimizing(true);
    try {
      const compressed = await compressProfileImage(file);
      if (compressed) {
        setImageDataUrl(compressed);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setImageDataUrl(ev.target.result || '');
        reader.readAsDataURL(file);
      }
    } finally {
      setPhotoOptimizing(false);
      input.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      photo: imageDataUrl
    };
    try {
      await AdminData.saveProfileToSupabase(payload);
      AdminData.saveProfile(payload);
      try {
        localStorage.removeItem(PROFILE_CACHE_KEY);
        notifyStorageCacheUpdated(PROFILE_CACHE_KEY);
        await primeProfileFetch();
        notifyStorageCacheUpdated(PROFILE_CACHE_KEY);
      } catch (_) {
        /** ignore cache refresh failures */
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setSaved(false);
    }
  };

  return (
    <div className="max-w-3xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your name, tagline, and photo.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-700 bg-slate-800/40 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
          <div className="flex items-center gap-6">
            <div className="size-24 rounded-full border-2 border-primary/50 overflow-hidden bg-slate-800 flex-shrink-0 shadow-lg">
              {imageDataUrl ? (
                <img src={imageDataUrl} className="size-full object-cover" alt="Profile Preview" />
              ) : (
                <span className="size-full flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-3xl">image</span></span>
              )}
            </div>
            <div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="sr-only"/>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoOptimizing}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-600 disabled:opacity-50"
                >
                  {photoOptimizing ? 'Optimizing…' : 'Change Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setImageDataUrl('')}
                  disabled={photoOptimizing || !imageDataUrl}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-red-400/60 hover:text-red-300 disabled:opacity-40"
                >
                  Remove Photo
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Each save stores a ~720px JPEG so the site loads faster. To wipe an old huge value from the database, run{' '}
                <code className="rounded bg-slate-900 px-1 py-0.5 text-[11px] text-slate-300">supabase/clear-profile-photo.sql</code>{' '}
                in the Supabase SQL editor once, then save a new photo here.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="e.g. Fatima Choudhry" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Professional Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="e.g. Software Engineer | Full Stack and Cross-Platform Developer" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Tagline</label>
          <textarea rows="3" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none resize-none" placeholder="Short description about what you do"></textarea>
        </div>

        <div className="pt-4 border-t border-slate-700 flex items-center gap-4">
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition">Save Changes</button>
          {saved && <span className="text-emerald-400 font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

export default ManageProfile;
