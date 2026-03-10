import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', content: ''
  });
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        title: item.title || '',
        content: item.content || ''
      });
      setImageDataUrl(item.image || '');
    } else {
      setFormData({ title: '', content: '' });
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

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      image: imageDataUrl,
    };

    if (editingItem) {
      await supabase.from('posts').update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from('posts').insert(payload);
    }

    await loadPosts();
    setLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await supabase.from('posts').delete().eq('id', id);
      await loadPosts();
    }
  };

  return (
    <div className="max-w-4xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400 text-sm mt-1">Manage blog posts stored in Supabase</p>
        </div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition">
          <span className="material-symbols-outlined">add</span> Create Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-slate-400 py-8 text-center">No posts. Click "Create Post".</p>
        ) : (
          posts.map(p => {
            const date = new Date(p.created_at).toLocaleDateString('en-GB');
            return (
              <div key={p.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 min-w-0 flex-1">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0"/>
                  ) : (
                    <span className="w-24 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <span className="material-symbols-outlined">image</span>
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{p.title || 'Untitled'}</h3>
                    <p className="text-slate-400 text-xs mt-1">Created: {date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openModal(p)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-primary/30 hover:text-primary transition">Edit</button>
                  <button type="button" onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition">Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={closeModal}></div>
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Post' : 'Create Post'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Post Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cover Image (Base64)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 rounded-lg border border-slate-600 overflow-hidden bg-slate-800 flex-shrink-0">
                      {imageDataUrl ? (
                        <img src={imageDataUrl} className="size-full object-cover" alt="Preview"/>
                      ) : (
                        <span className="size-full flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-2xl">image</span></span>
                      )}
                    </div>
                    <div>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="sr-only"/>
                      <button type="button" onClick={()=>fileInputRef.current.click()} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition">Choose cover</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Content (Markdown/Text)</label>
                  <textarea rows="10" required value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none resize-y font-mono text-sm"></textarea>
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

export default ManagePosts;
