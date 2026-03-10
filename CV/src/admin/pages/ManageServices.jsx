import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', icon: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        icon: item.icon || ''
      });
    } else {
      setFormData({
        title: '', description: '', price: '', icon: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.price.trim(),
      icon: formData.icon.trim() || 'code'
    };

    if (editingItem) {
      await supabase.from('services').update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from('services').insert(payload);
    }

    await loadServices();
    setLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      await supabase.from('services').delete().eq('id', id);
      await loadServices();
    }
  };

  return (
    <div className="max-w-4xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 text-sm mt-1">Manage what you offer in Supabase.</p>
        </div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition">
          <span className="material-symbols-outlined">add</span> Add Service
        </button>
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-slate-400 py-8 text-center">No services right now. Click "Add Service".</p>
        ) : (
          services.map(s => (
            <div key={s.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4 min-w-0 flex-1">
                <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">{s.icon || 'code'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{s.title || 'Untitled'}</h3>
                  <p className="text-slate-500 text-sm mt-1">{s.description}</p>
                  {s.price && <p className="text-emerald-400 text-xs mt-2 font-medium">{s.price}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openModal(s)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-primary/30 hover:text-primary transition">Edit</button>
                <button type="button" onClick={() => handleDelete(s.id)} className="px-3 py-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition">Delete</button>
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
                <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Service' : 'Add Service'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Service Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="Web Development"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Price / Rate</label>
                  <input value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="$35/hour"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Material Icon Name</label>
                  <input value={formData.icon} onChange={e=>setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-primary outline-none" placeholder="code"/>
                  <p className="text-xs text-slate-500 mt-1">Visit <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Fonts Icons</a></p>
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

export default ManageServices;
