import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (adminMenuOpen) document.body.classList.add('admin-menu-open');
    else document.body.classList.remove('admin-menu-open');
    return () => document.body.classList.remove('admin-menu-open');
  }, [adminMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getNavClass = ({ isActive }) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition ";
    if (isActive) {
      return baseClass + "text-white bg-primary/20 border-l-4 border-primary";
    }
    return baseClass + "text-slate-400 hover:bg-slate-800 hover:text-white";
  };

  if (loading) {
    return <div className="text-white min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex bg-[#0f172a] font-['Inter'] text-slate-100 antialiased min-h-screen w-full">
      <div className="admin-overlay md:hidden" aria-hidden="true" onClick={() => setAdminMenuOpen(false)} />
      <button type="button" className="admin-menu-btn hidden" aria-label="Open admin menu" onClick={() => setAdminMenuOpen((v) => !v)}>
        <span className="material-symbols-outlined text-2xl">{adminMenuOpen ? 'close' : 'menu'}</span>
      </button>
      <aside className="admin-sidebar fixed inset-y-0 left-0 w-64 bg-[#0e1628] border-r border-slate-700 flex flex-col z-50">
        <div className="p-4 sm:p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
            <span className="font-bold text-white">Portfolio Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" onClick={() => setAdminMenuOpen(false)}>
          <NavLink to="/admin" end className={getNavClass}>
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </NavLink>
          <NavLink to="/admin/manage-profile" className={getNavClass}>
            <span className="material-symbols-outlined">person</span> Profile
          </NavLink>
          <NavLink to="/admin/manage-posts" className={getNavClass}>
            <span className="material-symbols-outlined">article</span> Blog Posts
          </NavLink>
          <NavLink to="/admin/manage-projects" className={getNavClass}>
            <span className="material-symbols-outlined">folder_open</span> Projects
          </NavLink>
          <NavLink to="/admin/manage-services" className={getNavClass}>
            <span className="material-symbols-outlined">work</span> Services
          </NavLink>
          <NavLink to="/admin/manage-contact-links" className={getNavClass}>
            <span className="material-symbols-outlined">link</span> Contact links
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main flex-1 ml-0 md:ml-64 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
