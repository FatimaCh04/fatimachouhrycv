import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { adminCache } from '../adminCache';

const DEFAULT_ICONS = ['mail', 'github', 'linkedin', 'link', 'code', 'terminal', 'smartphone', 'language', 'public'];

function ManageContactLinks() {
  const [links, setLinks] = useState(() => adminCache.getContactLinks() || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ label: '', url: '', icon: 'link' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const { data } = await supabase.from('contact_links').select('*').order('sort_order', { ascending: true });
    if (data) {
      setLinks(data);
      adminCache.setContactLinks(data);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        label: item.label || '',
        url: item.url || '',
        icon: item.icon || 'link',
      });
    } else {
      setFormData({ label: '', url: '', icon: 'link' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      label: formData.label.trim(),
      url: formData.url.trim(),
      icon: (formData.icon || 'link').trim(),
    };
    if (editingItem) {
      await supabase.from('contact_links').update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from('contact_links').insert({ ...payload, sort_order: links.length });
    }
    await loadLinks();
    setLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this link from the Contact page?')) {
      await supabase.from('contact_links').delete().eq('id', id);
      await loadLinks();
    }
  };

  return (
    <div className="max-w-4xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact page links</h1>
          <p className="text-slate-400 text-sm mt-1">Links shown in “Other ways to reach me” on the Contact page.</p>
        </div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition min-h-[44px]">
          <span className="material-symbols-outlined">add_link</span> Add link
        </button>
      </div>

      <div className="space-y-4">
        {links.length === 0 ? (
          <p className="text-slate-400 py-8 text-center">No links yet. Click “Add link” to add Email, GitHub, LinkedIn, etc.</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4 min-w-0 flex-1 items-center">
                <div className="size-10 sm:size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">{link.icon || 'link'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{link.label || 'Untitled'}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm truncate block max-w-full hover:underline">{link.url}</a>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button type="button" onClick={() => openModal(link)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-primary/30 hover:text-primary transition min-h-[44px]">Edit</button>
                <button type="button" onClick={() => handleDelete(link.id)} className="px-3 py-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition min-h-[44px]">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={closeModal} aria-hidden="true" />
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
              <div className="p-4 sm:p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit link' : 'Add link'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Label (e.g. Email, GitHub)</label>
                  <input required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="GitHub" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
                  <input required type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="https://github.com/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Icon (Material symbol name)</label>
                  <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none">
                    {DEFAULT_ICONS.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1"><a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Fonts Icons</a></p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition disabled:opacity-50 min-h-[44px]">Save</button>
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition min-h-[44px]">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageContactLinks;
