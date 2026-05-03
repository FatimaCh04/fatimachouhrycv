import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePublicProfile } from '../lib/usePublicProfile';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';
import {
  PORTFOLIO_GRID_SELECT,
  PORTFOLIO_GRID_CACHE_KEY,
  PORTFOLIO_GRID_CACHE_TTL_MS,
} from '../lib/portfolioCache';

/** Home — zaroori contact fields only (baqi About / Navbar Resume se milenge) */
function getHomeDetailRows(profile) {
  return [
    { label: 'Full name', value: profile.name },
    { label: 'Email', value: 'fatimachoudhry94@gmail.com' },
    { label: 'Phone', value: '0304313364' },
    { label: 'Location', value: 'Vehari, Pakistan' },
  ];
}

/** Hero — professional scope (delivery / outcomes, not a tech laundry list) */
const HERO_PROFESSIONAL_SCOPE = [
  'Structured delivery — clear milestones, demos, and handover-ready documentation.',
  'Reliable backends and integrations — APIs, workflows, and data you can extend.',
  'Product-minded UI — responsive, accessible interfaces aligned to real users.',
];

function parseTechnologies(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

function Home() {
  const { profile } = usePublicProfile();
  const {
    data: projects = [],
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useSupabaseQuery('projects', {
    select: PORTFOLIO_GRID_SELECT,
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
    cacheKey: PORTFOLIO_GRID_CACHE_KEY,
    cacheTTL: PORTFOLIO_GRID_CACHE_TTL_MS,
  });
  const featuredProjects = projects.slice(0, 3);
  useEffect(() => {
    const el = document.getElementById('tagline-typed');
    if (!el) return;
    const fallback = 'The Only way to do great work is to love what you do.';
    const phrase = profile.tagline?.trim() ? profile.tagline.trim() : fallback;
    const text = `${phrase}|`;
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
  }, [profile.tagline]);

  const nameParts = profile.name.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || profile.name;
  const restName = nameParts.slice(1).join(' ') || '';
  const detailRows = getHomeDetailRows(profile);

  return (
    <div className="home-page mx-auto max-w-6xl space-y-8 px-4 sm:px-0">
      {/* Hero: 50 / 50 grid — full-width balance, photo anchored in right column */}
      <section className="home-page-hero mt-0 pt-1 pb-8 md:pt-3 md:pb-12 lg:pt-4 lg:pb-14">
        <div className="grid w-full grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-8">
          <div className="home-hero-stagger min-w-0 text-center md:pl-3 lg:max-w-xl lg:pl-8 lg:text-left xl:max-w-2xl xl:pl-10">
            <div className="font-hero leading-[0.95] tracking-tight">
              <span className="block text-4xl font-bold uppercase text-slate-100 sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-7xl">
                {firstName}
              </span>
              {restName && (
                <span className="mt-1 block text-4xl font-bold uppercase text-primary sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-7xl">
                  {restName}
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">{profile.title}</p>

            <div className="home-hero-quote mx-auto mt-5 max-w-xl rounded-xl border border-slate-700/50 bg-slate-800/35 px-4 py-3.5 text-left backdrop-blur-sm lg:mx-0">
              <p
                id="tagline-typed"
                className="profile-tagline font-hero min-h-[1.75rem] text-base italic leading-relaxed text-accent md:text-lg"
              >
                |
              </p>
            </div>

            <div className="mx-auto mt-6 max-w-xl text-left lg:mx-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Scope of work
              </p>
              <ul
                className="mt-3 list-none space-y-2.5 border-l-2 border-primary/55 pl-4"
                aria-label="Professional scope and delivery focus"
              >
                {HERO_PROFESSIONAL_SCOPE.map((line) => (
                  <li key={line} className="text-[13px] leading-snug text-slate-300 sm:text-sm">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark"
              >
                Hire me
                <span className="material-symbols-outlined text-lg">north_east</span>
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-500 px-6 py-3 text-sm font-bold text-slate-100 transition-colors hover:border-accent hover:text-accent"
              >
                View work
                <span className="material-symbols-outlined text-lg">open_in_new</span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:-translate-x-0.5 lg:-translate-x-2 lg:justify-end xl:-translate-x-4">
            <figure className="home-hero-photo relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-slate-800/80 to-slate-900 shadow-[0_0_40px_-8px_rgba(79,70,229,0.35)] sm:max-w-[min(340px,86vw)] md:max-w-[min(380px,42vw)] lg:max-w-[min(380px,100%)]">
              {profile.photo ? (
                <img
                  alt={profile.name}
                  key={profile.photo}
                  className="profile-photo size-full object-cover object-center"
                  fetchPriority="high"
                  decoding="async"
                  src={profile.photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/profile-placeholder.svg';
                  }}
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-slate-800/70" aria-hidden />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" aria-hidden />
            </figure>
          </div>
        </div>
      </section>

      {/* Profile / contact — short essentials only */}
      <section id="personal-info-section" className="home-info-section border-t border-slate-800/80 pt-10 md:pt-14">
        <div className="home-contact-head-stagger text-center md:max-w-lg md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
          <h2 className="font-hero mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2rem]">
            Contact details
          </h2>
          <div
            className="featured-heading-rule mx-auto mt-5 flex max-w-md items-center justify-center gap-4 md:mx-0 md:justify-start"
            aria-hidden
          >
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Short essentials only —{' '}
            <Link className="font-medium text-accent underline-offset-2 hover:underline" to="/about">
              About
            </Link>{' '}
            for more.
          </p>
        </div>

        <dl className="home-info-dl home-info-stagger mt-8 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {detailRows.map((row) => (
            <div key={row.label} className="home-info-item border-b border-slate-700/55 pb-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{row.label}</dt>
              <dd className={`mt-2 text-sm leading-snug text-slate-100 ${row.label === 'Full name' ? 'profile-name' : ''}`}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Quick Stats */}
      <section className="home-stats-stagger grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="home-stat-pill bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">rocket_launch</span></div>
          <div><p className="text-2xl font-bold text-white">15+</p><p className="text-sm text-slate-400">Projects Completed</p></div>
        </div>
        <div className="home-stat-pill bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">terminal</span></div>
          <div><p className="text-2xl font-bold text-white">10</p><p className="text-sm text-slate-400">Tech Stack Proficiencies</p></div>
        </div>
        <div className="home-stat-pill bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">code</span></div>
          <div><p className="text-2xl font-bold text-white">500+</p><p className="text-sm text-slate-400">GitHub Contributions</p></div>
        </div>
      </section>

      <section className="featured-showcase-section px-2 py-10 sm:px-0 md:py-14">
        <div className="featured-showcase-heading home-featured-head-stagger mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 flex-1 text-center md:text-left">
            <h2 className="font-hero text-[clamp(2.25rem,6vw,3.85rem)] font-bold uppercase leading-[0.95] tracking-tight">
              <span className="text-slate-200">Featured </span>
              <span className="text-accent">Projects</span>
            </h2>
            <div className="featured-heading-rule mx-auto mt-5 flex max-w-xl items-center gap-4 md:mx-0 md:gap-6" aria-hidden>
              <span className="featured-heading-rule-line" />
              <span className="featured-heading-rule-dot" />
            </div>
          </div>
          <div className="flex shrink-0 justify-center md:justify-end md:pt-3">
            <Link
              to="/portfolio"
              className="featured-view-all text-sm font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-accent"
            >
              View All
            </Link>
          </div>
        </div>

        {projectsLoading && featuredProjects.length === 0 ? (
          <div className="featured-showcase-cards">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex w-[min(86vw,360px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 md:w-auto animate-pulse"
              >
                <div className="aspect-[16/11] bg-slate-800/70" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-slate-800" />
                  <div className="h-6 w-[85%] rounded bg-slate-800" />
                  <div className="h-3 w-full rounded bg-slate-800" />
                  <div className="h-3 w-4/5 rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : projectsError ? (
          <div className="relative z-[1] max-w-xl rounded-xl border border-amber-500/30 bg-amber-950/25 px-4 py-5 text-sm text-slate-200 md:text-base">
            <p className="font-semibold text-amber-200">Projects couldn’t load</p>
            <p className="mt-2 text-slate-300">
              {(projectsError.message || '').includes('JWT')
                ? 'Check `.env`: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set, then restart dev server.'
                : projectsError.message || 'Supabase returned an error. Check tables, RLS policies, and your network.'}
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-accent hover:bg-slate-700"
              onClick={() => refetchProjects()}
            >
              Try again
            </button>
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="relative z-[1] max-w-xl text-left text-slate-400 md:mx-auto md:text-center">
            <p>No projects loaded yet.</p>
            <p className="mt-3 text-sm">
              Add projects in{' '}
              <Link to="/admin/manage-projects" className="font-semibold text-accent hover:underline">
                Admin → Manage Projects
              </Link>
              , run <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">seed-projects.sql</code> in
              Supabase if the table is empty, or refresh if you opened the site before data existed (cache resets every ~5 minutes).
            </p>
          </div>
        ) : (
          <div className="featured-showcase-cards">
            {featuredProjects.map((project, index) => {
              const techList = parseTechnologies(project.technologies).slice(0, 3);
              return (
                <article
                  key={project.id}
                  className="featured-premium-card featured-home-card group flex flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/50 shadow-lg"
                  style={{ animationDelay: `${index * 0.14}s` }}
                >
                  <div className="featured-premium-thumb relative aspect-[16/11] shrink-0 overflow-hidden bg-slate-800">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="size-full object-cover transition-[transform] duration-[450ms] ease-out group-hover:scale-[1.05]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/profile-placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-6xl opacity-60">image</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent/90">
                      {project.category || 'Project'}
                    </p>
                    <h3 className="mt-2 font-hero text-xl font-bold leading-tight text-white line-clamp-2 sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
                      {project.description || 'Project details available in portfolio.'}
                    </p>
                    {techList.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {techList.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/project/${project.id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-accent"
                    >
                      View project
                      <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        north_east
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-collab-banner relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-slate-900/55 to-slate-950/90 p-8 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,rgba(79,70,229,0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Collaborate</p>
            <h3 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Interested in collaborating?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              I&apos;m open to automation projects and custom software opportunities.
            </p>
          </div>
          <Link
            className="home-collab-cta relative z-[1] inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark lg:w-auto touch-manipulation"
            to="/contact"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
