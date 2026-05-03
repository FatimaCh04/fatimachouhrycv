import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePublicProfile } from '../lib/usePublicProfile';

function Home() {
  const { profile, loading: profileLoading } = usePublicProfile();
  useEffect(() => {
    const el = document.getElementById('tagline-typed');
    if (!el) return;
    const text = 'The Only way to do great work is to love what you do.|';
    let i = 0;
    let cursor = '|';
    let timeoutId;
    
    function tick() {
      if (!document.getElementById('tagline-typed')) return; // Check if component still mounted
      let show = text.slice(0, i + 1);
      if (show.endsWith('|')) show = show.slice(0, -1) + cursor;
      else show += cursor;
      el.textContent = show;
      i = (i + 1) % (text.length + 1);
      if (i === 0) timeoutId = setTimeout(tick, 2000);
      else timeoutId = setTimeout(tick, 120);
    }
    timeoutId = setTimeout(tick, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDownloadResume = () => {
    window.open('/resume', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero: profile, name, animated tagline */}
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="size-28 rounded-full border-2 border-primary p-1 shadow-glow mx-auto">
              {profileLoading ? (
                <div className="profile-photo size-full rounded-full bg-slate-700 animate-pulse" aria-hidden />
              ) : (
                <img
                  alt={profile.name}
                  className="profile-photo size-full rounded-full object-cover"
                  src={profile.photo}
                  key={profile.photo}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/profile-placeholder.svg'; }}
                />
              )}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 profile-name">{profile.name}</h2>
          <p id="tagline-typed" className="text-base text-primary font-medium min-h-[1.25rem] mb-0 profile-tagline">|</p>
        </div>
      </section>

      {/* Personal Information Grid (2 columns, 8 items) */}
      <section id="personal-info-section" className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0"><span className="material-symbols-outlined">person</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Full Name</p><p className="font-semibold text-white profile-name">{profile.name}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><span className="material-symbols-outlined">calendar_today</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Date of Birth</p><p className="font-semibold text-white">11-12-2004</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0"><span className="material-symbols-outlined">phone</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Phone</p><p className="font-semibold text-white">0304313364</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0"><span className="material-symbols-outlined">location_on</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Address</p><p className="font-semibold text-white">Vehari, Pakistan</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0"><span className="material-symbols-outlined">mail</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Email Address</p><p className="font-semibold text-white">fatimachoudhry94@gmail.com</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0"><span className="material-symbols-outlined">work</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Professional Title</p><p className="font-semibold text-white profile-title">{profile.title}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><span className="material-symbols-outlined">language</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Languages</p><p className="font-semibold text-white">English, Urdu, Punjabi</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><span className="material-symbols-outlined">flag</span></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Nationality</p><p className="font-semibold text-white">Pakistan</p></div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
          <button type="button" id="download-resume-btn" onClick={handleDownloadResume} className="inline-flex items-center gap-2 bg-primary text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-teal-400 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Download Resume
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">rocket_launch</span></div>
          <div><p className="text-2xl font-bold text-white">15+</p><p className="text-sm text-slate-400">Projects Completed</p></div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">terminal</span></div>
          <div><p className="text-2xl font-bold text-white">10</p><p className="text-sm text-slate-400">Tech Stack Proficiencies</p></div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">code</span></div>
          <div><p className="text-2xl font-bold text-white">500+</p><p className="text-sm text-slate-400">GitHub Contributions</p></div>
        </div>
      </section>

      <section className="bg-primary/20 border border-primary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-glow">
        <div>
          <h4 className="text-2xl font-bold mb-2">Interested in collaborating?</h4>
          <p className="text-slate-300">I'm open to automation projects and custom software opportunities.</p>
        </div>
        <Link className="mt-6 md:mt-0 px-8 py-3 bg-primary text-slate-900 rounded-lg font-bold hover:bg-teal-400 transition-colors flex items-center gap-2" to="/contact">
          <span className="material-symbols-outlined">send</span>
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

export default Home;
