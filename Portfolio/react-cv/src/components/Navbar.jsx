import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { usePublicProfile } from '../lib/usePublicProfile';

function Navbar({ mobileMenuOpen, onNavClick, onMenuToggle }) {
  const { profile } = usePublicProfile();

  /** Dot above label + bottom border (active), same layout when inactive so links stay aligned. */
  const desktopLinkClass = ({ isActive }) =>
    [
      'flex flex-col items-center gap-0.5 border-b-2 px-3 pb-2.5 pt-1.5 text-sm font-semibold tracking-[0.04em] transition-colors duration-200',
      isActive ? '!border-accent !text-accent' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-white',
    ].join(' ');

  const mobileLinkClass = ({ isActive }) =>
    [
      'flex min-h-[48px] w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors',
      isActive
        ? 'bg-primary/12 text-accent'
        : 'text-slate-200 active:bg-slate-800/80',
    ].join(' ');

  const navLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/about', label: 'About', icon: 'person' },
    { to: '/services', label: 'Services', icon: 'work' },
    { to: '/portfolio', label: 'Portfolio', icon: 'folder_open' },
    { to: '/blog', label: 'Blog', icon: 'article' },
    { to: '/resume', label: 'Resume', icon: 'description' },
    { to: '/contact', label: 'Contact', icon: 'alternate_email' },
  ];

  return (
    <header
      id="site-navbar"
      className="fixed inset-x-0 top-0 z-[1000] border-b border-white/[0.06] bg-transparent pt-[env(safe-area-inset-top,0px)] shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="relative mx-auto flex h-[90px] min-h-[90px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group relative z-20 flex min-w-0 max-w-[min(100%,14rem)] shrink-0 items-center gap-2.5 sm:max-w-xs md:max-w-sm"
          onClick={onNavClick}
        >
          <div className="relative shrink-0">
            <div className="size-10 overflow-hidden rounded-full border border-primary/40 bg-slate-900 shadow-[0_0_0_1px_rgba(99,102,241,0.15)] transition-shadow group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] sm:size-11">
              {profile.photo ? (
                <img
                  alt=""
                  key={profile.photo}
                  className="size-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                  src={profile.photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/profile-placeholder.svg';
                  }}
                />
              ) : (
                <div className="size-full animate-pulse bg-slate-700/80" aria-hidden />
              )}
            </div>
          </div>
          <div className="min-w-0 text-left">
            <p className="font-hero truncate text-sm font-semibold leading-tight text-white sm:text-[15px]">
              {profile.name}
            </p>
            <p className="mt-0.5 hidden text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
              Portfolio
            </p>
          </div>
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex lg:gap-1.5"
          aria-label="Main"
          onClick={onNavClick}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={desktopLinkClass} end={to === '/'}>
              {({ isActive }) => (
                <>
                  <span className="flex h-2 items-center justify-center" aria-hidden>
                    {isActive ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                    ) : (
                      <span className="size-1.5 shrink-0 opacity-0" />
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="relative z-20 flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-slate-600/80 bg-slate-900/80 text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 active:bg-slate-800 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={onMenuToggle}
        >
          <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
        {/* Balance desktop layout so centered nav clears the brand / menu areas */}
        <span className="relative z-10 hidden w-11 shrink-0 md:inline-block" aria-hidden />
      </div>

      <div
        id="site-navbar-dropdown"
        className={`origin-top absolute top-full left-0 right-0 overflow-hidden border-b border-slate-600/40 bg-slate-900/92 shadow-2xl backdrop-blur-lg transition-all duration-200 ease-out md:hidden ${
          mobileMenuOpen ? 'navbar-dropdown-open' : 'navbar-dropdown-closed'
        }`}
      >
        <nav className="mx-auto max-w-7xl space-y-0.5 p-3" aria-label="Main mobile" onClick={onNavClick}>
          {navLinks.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={mobileLinkClass} end={to === '/'}>
              {({ isActive }) => (
                <span className="flex w-full min-w-0 items-center gap-3">
                  <span className="flex w-5 shrink-0 justify-center" aria-hidden>
                    {isActive ? (
                      <span className="size-1.5 rounded-full bg-accent" />
                    ) : (
                      <span className="size-1.5 opacity-0" />
                    )}
                  </span>
                  <span className="material-symbols-outlined text-[22px] text-slate-400" aria-hidden>
                    {icon}
                  </span>
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
