import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePublicProfile } from '../lib/usePublicProfile';

function Navbar({ mobileMenuOpen, onNavClick, onMenuToggle }) {
  const { profile } = usePublicProfile();
  const getNavClass = ({ isActive }) => {
    const baseClass = "flex flex-col items-center gap-0.5 px-3 py-2 text-sm font-medium text-white transition-all border-b-2 border-transparent nav-link ";
    if (isActive) {
      return baseClass + "!border-accent !text-accent";
    }
    return baseClass + "hover:text-accent/90";
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/about', label: 'About', icon: 'person' },
    { to: '/services', label: 'Service', icon: 'work' },
    { to: '/portfolio', label: 'Portfolio', icon: 'folder_open' },
    { to: '/blog', label: 'Blog', icon: 'article' },
    { to: '/resume', label: 'Resume', icon: 'description' },
    { to: '/contact', label: 'Contact', icon: 'alternate_email' },
  ];

  return (
    <header id="site-navbar" className="fixed top-0 left-0 right-0 h-20 bg-sidebar border-b-2 border-primary/60 flex items-center z-50 shadow-lg">
      <div className="flex items-center justify-between w-full h-full px-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <div className="profile-photo-wrapper relative shrink-0">
            <div className="size-10 rounded-full border-2 border-primary p-0.5 shadow-glow overflow-hidden">
              <img
                alt="Profile"
                className="profile-photo size-full rounded-full object-cover"
                src={profile.photo}
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/profile-placeholder.svg'; }}
              />
            </div>
            <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-sidebar rounded-full"></div>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 max-w-[55vw] sm:max-w-none">
            <h1 className="profile-name text-sm font-bold text-white truncate">{profile.name}</h1>
            <span className="profile-title text-xs font-medium text-primary px-2 py-0.5 rounded-full bg-slate-800/90 w-fit max-w-[180px] sm:max-w-[240px] line-clamp-2">{profile.title}</span>
          </div>
        </div>

        <nav className="hidden md:flex items-end gap-3 flex-1 justify-center" onClick={onNavClick}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={getNavClass}
              end={to === '/'}
            >
              {({ isActive }) => (
                <span className="flex flex-col items-center gap-0.5">
                  {label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden />}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 active:bg-slate-600 touch-manipulation"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={onMenuToggle}
        >
          <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile dropdown: nav links only */}
      <div
        id="site-navbar-dropdown"
        className={`absolute top-full left-0 right-0 bg-sidebar border-b border-slate-700 shadow-xl md:hidden overflow-y-auto transition-all duration-200 max-h-[85vh] ${mobileMenuOpen ? 'navbar-dropdown-open' : 'navbar-dropdown-closed'}`}
      >
        <nav className="p-3 space-y-1" onClick={onNavClick}>
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={getNavClass}
              end={to === '/'}
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                    {label}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-0.5" aria-hidden />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
