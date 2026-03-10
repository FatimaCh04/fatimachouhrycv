import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  const getNavClass = ({ isActive }) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ";
    if (isActive) {
      return baseClass + "font-semibold bg-slate-700/80 text-white";
    }
    return baseClass + "font-medium text-slate-400 hover:bg-slate-800 hover:text-white";
  };

  return (
    <aside id="site-sidebar" className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r-2 border-primary/60 flex flex-col z-50 overflow-hidden">
      <div className="flex flex-col h-full min-h-0">
        <div className="p-6 flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="profile-photo-wrapper relative mb-4">
              <div className="size-24 rounded-full border-2 border-primary p-1 shadow-glow">
                <img
                  alt="Profile"
                  className="profile-photo size-full rounded-full object-cover"
                  src="/assets/images/profile.jpg"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/profile-placeholder.svg'; }}
                />
              </div>
              <div className="absolute bottom-0 right-0 size-4 bg-emerald-500 border-2 border-sidebar rounded-full"></div>
            </div>
            <h1 className="profile-name text-xl font-bold text-white">Fatima Choudhry</h1>
            <p className="profile-title text-xs font-medium text-primary mt-1 px-3 py-1 bg-primary/20 rounded-full">Software Engineering Student</p>
            <p className="profile-tagline text-sm text-slate-400 mt-3 leading-relaxed px-2">Building scalable automation and custom software solutions.</p>
          </div>
          <nav className="space-y-1">
            <NavLink to="/" className={({ isActive }) => getNavClass({ isActive: isActive && window.location.pathname === '/' })}>
              <span className="material-symbols-outlined">home</span>Home
            </NavLink>
            <NavLink to="/about" className={getNavClass}>
              <span className="material-symbols-outlined">person</span>About
            </NavLink>
            <NavLink to="/services" className={getNavClass}>
              <span className="material-symbols-outlined">work</span>Service
            </NavLink>
            <NavLink to="/portfolio" className={getNavClass}>
              <span className="material-symbols-outlined">folder_open</span>Portfolio
            </NavLink>
            <NavLink to="/blog" className={getNavClass}>
              <span className="material-symbols-outlined">article</span>Blog
            </NavLink>
            <NavLink to="/resume" className={getNavClass}>
              <span className="material-symbols-outlined">description</span>Resume
            </NavLink>
            <NavLink to="/contact" className={getNavClass}>
              <span className="material-symbols-outlined">alternate_email</span>Contact
            </NavLink>
          </nav>
          <div className="pt-6 mt-6 border-t border-slate-700 grid grid-cols-3 gap-2">
            <a className="flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-primary transition-colors" href="https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-" target="_blank" rel="noopener noreferrer">
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>
            <a className="flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-primary transition-colors" href="https://www.linkedin.com/in/fatima-choudhry-714423358/" target="_blank" rel="noopener noreferrer">
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
            <Link className="flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-primary transition-colors" to="/contact">
              <span className="material-symbols-outlined text-xl">mail</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
