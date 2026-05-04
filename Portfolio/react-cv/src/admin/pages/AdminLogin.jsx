import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!hasSupabaseConfig) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (signInError) {
      const msg = signInError.message || 'Sign in failed';
      setError(msg === 'Invalid login credentials' ? 'Invalid email or password. Create a user in Supabase first (see below).' : msg);
    } else {
      navigate('/admin');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin sign in | Fatima Choudhry</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="bg-[#0f172a] font-['Inter'] text-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 shadow-xl">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary mb-2 block">admin_panel_settings</span>
            <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage your site</p>
          </div>

          {error && (
            <div id="signin-area" className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-300 text-sm flex items-start gap-2">
              <span className="material-symbols-outlined shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-primary outline-none text-sm"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-primary outline-none text-sm" 
              autoComplete="current-password"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-slate-500 text-xs mt-6 pt-4 border-t border-slate-700">
            <strong className="text-slate-400">First time?</strong> Create an admin user in Supabase: Dashboard → Authentication → Users → Add user (email + password). Then sign in here with that email and password.
          </p>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6"><Link to="/" className="text-primary hover:underline">← Back to site</Link></p>
      </div>
    </div>
    </>
  );
}

export default AdminLogin;
