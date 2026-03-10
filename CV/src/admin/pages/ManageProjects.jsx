import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const PROJECT_CATEGORIES = [
    { value: '', label: '— Select category —' },
    { value: 'react-development', label: 'React Development' },
    { value: 'mobile-app-development', label: 'Mobile App Development' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'wordpress-development', label: 'WordPress Development' },
  ];

  const [formData, setFormData] = useState({
    title: '', description: '', category: '', technologies: '', github_link: '', live_link: '', image_url: ''
  });
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      const isImageUrl = item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'));
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || ''),
        github_link: item.github_link || '',
        live_link: item.live_link || '',
        image_url: isImageUrl ? item.image : ''
      });
      setImageDataUrl(isImageUrl ? '' : (item.image || ''));
    } else {
      setFormData({
        title: '', description: '', category: '', technologies: '', github_link: '', live_link: '', image_url: ''
      });
      setImageDataUrl('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.match(/^image\//)) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(ev.target.result || '');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageValue = (formData.image_url || '').trim() || imageDataUrl;
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: (formData.category || '').trim() || null,
      technologies: (formData.technologies || '').trim() || null,
      github_link: formData.github_link.trim(),
      live_link: formData.live_link.trim(),
      image: imageValue
    };

    if (editingItem) {
      await supabase.from('projects').update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from('projects').insert(payload);
    }

    await loadProjects();
    setLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      await loadProjects();
    }
  };

  return (
    <div className="max-w-4xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage portfolio projects stored in Supabase.</p>
        </div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition">
          <span className="material-symbols-outlined">add</span> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-slate-400 py-8 text-center">No projects yet. Click "Add Project" to create one.</p>
        ) : (
          projects.map(p => (
            <div key={p.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3 min-w-0 flex-1">
                {p.image ? (
                  <img src={p.image} alt="" className="size-14 rounded-lg object-cover flex-shrink-0"/>
                ) : (
                  <span className="size-14 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <span className="material-symbols-outlined">image</span>
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{p.title || 'Untitled'}</h3>
                  {p.category && <span className="text-xs text-primary font-medium">{PROJECT_CATEGORIES.find(c => c.value === p.category)?.label || p.category}</span>}
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{p.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openModal(p)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-primary/30 hover:text-primary transition">Edit</button>
                <button type="button" onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={closeModal}></div>
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Project' : 'Add Project'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Image URL (optional)</label>
                  <input type="url" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} placeholder="https://... screenshot link" className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none mb-2" />
                  <p className="text-xs text-slate-500 mb-2">Paste a direct image link for the project screenshot, or upload below.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Or upload image</label>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg border border-slate-600 overflow-hidden bg-slate-800 flex-shrink-0">
                      {(formData.image_url || imageDataUrl) ? (
                        <img src={formData.image_url || imageDataUrl} className="size-full object-cover" alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                      ) : (
                        <span className="size-full flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-2xl">image</span></span>
                      )}
                    </div>
                    <div>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="sr-only"/>
                      <button type="button" onClick={()=>fileInputRef.current.click()} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition">Choose image</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none">
                    {PROJECT_CATEGORIES.map((opt) => (
                      <option key={opt.value || 'none'} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Technologies (comma-separated)</label>
                  <input value={formData.technologies} onChange={e=>setFormData({...formData, technologies: e.target.value})} placeholder="e.g. React, Electron" className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">GitHub Link</label>
                  <input type="url" value={formData.github_link} onChange={e=>setFormData({...formData, github_link: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Demo/Live Link</label>
                  <input type="url" value={formData.live_link} onChange={e=>setFormData({...formData, live_link: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition disabled:opacity-50">Save</button>
                  <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProjects;
