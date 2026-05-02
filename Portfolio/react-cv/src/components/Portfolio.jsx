import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';
import {
  PORTFOLIO_GRID_SELECT,
  PORTFOLIO_GRID_CACHE_KEY,
  PORTFOLIO_GRID_CACHE_TTL_MS,
} from '../lib/portfolioCache';

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'react-development', label: 'React Development' },
  { slug: 'mobile-app-development', label: 'Mobile App Development' },
  { slug: 'web-development', label: 'Web Development' },
  { slug: 'desktop', label: 'Desktop' },
  { slug: 'wordpress-development', label: 'WordPress Development' },
];

function getCategoryLabel(slug) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return cat ? cat.label.toUpperCase() : (slug || 'Project').toUpperCase().replace(/-/g, ' ');
}

function GithubIcon({ className = 'size-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function parseTechnologies(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <article
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
        >
          <div className="aspect-[4/3] max-h-[180px] bg-slate-800/80 sm:max-h-[200px]" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-24 rounded bg-slate-800" />
            <div className="h-5 w-4/5 rounded bg-slate-800" />
            <div className="h-3 w-full rounded bg-slate-800" />
            <div className="h-3 w-11/12 rounded bg-slate-800" />
            <div className="flex gap-2 pt-2">
              <div className="h-7 w-16 rounded-md bg-slate-800" />
              <div className="h-7 w-20 rounded-md bg-slate-800" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Portfolio() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { data: projects = [], loading } = useSupabaseQuery('projects', {
    select: PORTFOLIO_GRID_SELECT,
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
    cacheKey: PORTFOLIO_GRID_CACHE_KEY,
    cacheTTL: PORTFOLIO_GRID_CACHE_TTL_MS,
  });

  const categoryToSlug = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => categoryToSlug(p.category) === filter);

  return (
    <div className="portfolio-page mx-auto max-w-7xl space-y-12 px-4 pb-14 md:space-y-14 md:pb-20 sm:px-0">
      <header className="portfolio-page-hero border-b border-slate-800/80 pb-10 md:pb-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Work</p>
          <h1 className="font-hero mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-white">
            Portfolio and <span className="text-accent">projects</span>
          </h1>
          <div
            className="featured-heading-rule mx-auto mt-5 flex max-w-md items-center justify-center gap-4"
            aria-hidden
          >
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
            Selected builds and experiments — filter by stack or domain. Open a card for full detail, links, and context.
          </p>
        </div>

        <div
          className="portfolio-filters mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2"
          id="portfolio-filters"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              role="tab"
              aria-selected={filter === cat.slug}
              onClick={() => setFilter(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === cat.slug
                  ? 'bg-primary text-white shadow-md shadow-primary/25 ring-1 ring-primary/40'
                  : 'border border-slate-600/80 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <section aria-labelledby="portfolio-grid-heading">
        <h2 id="portfolio-grid-heading" className="sr-only">
          Project grid
        </h2>
        {loading ? (
          <PortfolioSkeleton />
        ) : filteredProjects.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-12 text-center text-slate-400">
            {projects.length === 0
              ? 'No projects yet. Add them from the admin dashboard or run your Supabase seed.'
              : 'Nothing in this category — try “All” or pick another filter.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" id="portfolio-grid">
            {filteredProjects.map((p, idx) => {
              const techList = parseTechnologies(p.technologies).slice(0, 5);
              const isMobileCat = categoryToSlug(p.category) === 'mobile-app-development';
              const imgClass = isMobileCat
                ? 'size-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]'
                : 'size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]';

              return (
                <article
                  key={p.id || idx}
                  className="portfolio-project-card group relative flex flex-col overflow-hidden rounded-xl border border-slate-700/90 bg-slate-900/35 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.85)]"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[3px] bg-gradient-to-r from-primary via-primary/80 to-accent opacity-95" />

                  <div className="relative z-[2] aspect-[4/3] max-h-[180px] shrink-0 overflow-hidden bg-slate-950 sm:max-h-[200px]">
                    {p.image && String(p.image).length > 0 ? (
                      <img
                        src={p.image}
                        alt=""
                        className={imgClass}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={idx < 3 ? 'high' : 'low'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const wrap = e.target.parentElement;
                          if (wrap && !wrap.querySelector('[data-ph]')) {
                            const placeholder = document.createElement('span');
                            placeholder.setAttribute('data-ph', '1');
                            placeholder.className = 'material-symbols-outlined text-5xl text-slate-500';
                            placeholder.textContent = 'image';
                            wrap.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-slate-900">
                        <span className="material-symbols-outlined text-5xl text-slate-600 transition-colors group-hover:text-primary/80">
                          image
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="relative z-[2] flex flex-1 flex-col p-4">
                    {p.category && (
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent/90">
                        {getCategoryLabel(p.category)}
                      </p>
                    )}
                    <h3 className="mt-1.5 font-hero text-base font-bold leading-snug text-white sm:text-lg">{p.title}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-400 line-clamp-2 sm:line-clamp-3 sm:text-sm">{p.description}</p>

                    {techList.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {techList.map((tech, i) => (
                          <span
                            key={`${p.id}-${tech}-${i}`}
                            className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary sm:text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-700/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-primary-dark sm:w-auto sm:min-w-[120px] sm:text-sm"
                      >
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                        View project
                      </button>
                      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
                        {p.live_link && String(p.live_link).trim() && (
                          <a
                            href={p.live_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-white sm:text-sm"
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                            Live demo
                          </a>
                        )}
                        {p.github_link && String(p.github_link).trim() && (
                          <a
                            href={p.github_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white sm:text-sm"
                          >
                            <GithubIcon className="size-5" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="portfolio-cta-banner relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-slate-900/55 to-slate-950/90 p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,rgba(79,70,229,0.14),transparent_55%)]" aria-hidden />
        <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Collaborate</p>
            <h3 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Like what you see?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              Share goals and constraints — I’ll help shape scope, milestones, and a realistic delivery path.
            </p>
          </div>
          <Link
            className="relative z-[1] inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark lg:w-auto touch-manipulation"
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

export default Portfolio;
