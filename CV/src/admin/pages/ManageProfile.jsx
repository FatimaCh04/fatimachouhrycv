import React, { useState, useEffect, useRef } from 'react';
import { AdminData } from '../auth';

function ManageProfile() {
  const [formData, setFormData] = useState({
    name: '', title: '', tagline: ''
  });
  const [imageDataUrl, setImageDataUrl] = useState('');
  const fileInputRef = useRef(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = AdminData.getProfile() || {};
    setFormData({
      name: profile.name || '',
      title: profile.title || '',
      tagline: profile.tagline || ''
    });
    setImageDataUrl(profile.photo || '');
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.match(/^image\//)) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(ev.target.result || '');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AdminData.saveProfile({
      name: formData.name.trim(),
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      photo: imageDataUrl
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition">Change Photo</button>
              <p className="text-xs text-slate-500 mt-2">Recommended: 1:1 aspect ratio, under 1MB.</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="e.g. Fatima Choudhry" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Professional Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="e.g. Software Engineering Student" />
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
