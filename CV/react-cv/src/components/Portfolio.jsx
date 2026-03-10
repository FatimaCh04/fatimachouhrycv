import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      {[1, 2, 3, 4].map((i) => (
        <article key={i} className="flex flex-col rounded-xl border border-slate-700 overflow-hidden animate-pulse">
          <div className="h-48 bg-slate-700/50" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-700/50 rounded w-1/3" />
            <div className="h-5 bg-slate-700/50 rounded w-3/4" />
            <div className="h-3 bg-slate-700/50 rounded w-full" />
            <div className="h-3 bg-slate-700/50 rounded w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-slate-700/50 rounded" />
              <div className="h-6 w-20 bg-slate-700/50 rounded" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

const PORTFOLIO_CACHE_KEY = 'portfolio_projects';
const PORTFOLIO_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedProjects() {
  try {
    const raw = sessionStorage.getItem(PORTFOLIO_CACHE_KEY);
    if (!raw) return null;
    const { data, at } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - at > PORTFOLIO_CACHE_TTL_MS) return null;
    return data;
  } catch (_) {
    return null;
  }
}

function setCachedProjects(data) {
  try {
    sessionStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify({ data, at: Date.now() }));
  } catch (_) {}
}

function Portfolio() {
  const navigate = useNavigate();
  const cached = getCachedProjects();
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
        if (data) {
          setProjects(data);
          setCachedProjects(data);
        }
        setLoading(false);
      });
      return;
    }
    setLoading(true);
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setProjects(data);
        setCachedProjects(data);
      }
      setLoading(false);
    });
  }, []);

  const categoryToSlug = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => categoryToSlug(p.category) === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary">folder_open</span>
          My Portfolio
        </h2>
        <p className="text-slate-400">Recent work and projects</p>

        <div className="flex flex-wrap gap-2 justify-center" id="portfolio-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setFilter(cat.slug)}
              className={`portfolio-filter px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filter === cat.slug
                  ? 'bg-primary text-slate-900 shadow-glow'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2" id="portfolio-grid">
          {loading ? (
            <PortfolioSkeleton />
          ) : filteredProjects.length === 0 ? (
            <p className="text-slate-400 col-span-full">
              {projects.length === 0
                ? 'No projects found. Add some from the Admin Dashboard.'
                : `No projects in this category. Try "All" or another filter.`}
            </p>
          ) : (
            filteredProjects.map((p, idx) => {
              const techList = parseTechnologies(p.technologies);
              return (
                <article key={p.id || idx} className="portfolio-item flex flex-col rounded-xl border border-slate-700 overflow-hidden hover:border-primary/30 transition-colors group">
                  {/* 1. Picture */}
                  <div className="h-48 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {p.image && p.image.length > 0 ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const wrap = e.target.parentElement;
                          const placeholder = document.createElement('span');
                          placeholder.className = 'material-symbols-outlined text-6xl text-slate-400';
                          placeholder.textContent = 'image';
                          wrap.appendChild(placeholder);
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-slate-400 group-hover:text-primary transition-colors">image</span>
                    )}
                  </div>
                  {/* 2. Category (picture ke neeche) */}
                  {p.category && (
                    <p className="px-4 pt-3 text-xs font-bold tracking-wider text-primary">
                      {getCategoryLabel(p.category)}
                    </p>
                  )}
                  {/* 3. Project name */}
                  <div className="px-4 pt-1">
                    <h3 className="font-bold text-white text-lg">{p.title}</h3>
                  </div>
                  {/* 4. Description */}
                  <div className="px-4 pt-2 flex-1 min-h-0">
                    <p className="text-sm text-slate-300 line-clamp-3">{p.description}</p>
                  </div>
                  {/* 5. Technologies - halka shade, kam border */}
                  {techList.length > 0 && (
                    <div className="px-4 pt-3 flex flex-wrap gap-2">
                      {techList.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* 6. Live View & Github - zyada fasla, Live/View full-width, Github icon */}
                  <div className="p-4 pt-8 flex flex-col gap-4 border-t border-slate-700/50 mt-auto">
                    {(p.live_link || p.id) && (
                      <button
                        type="button"
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/25 text-primary font-semibold text-sm hover:bg-primary/35 transition-colors border border-primary/30"
                      >
                        <span className="material-symbols-outlined text-xl">open_in_new</span>
                        Live / View
                      </button>
                    )}
                    {p.github_link && (
                      <a href={p.github_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                        <GithubIcon className="size-5" />
                        Github
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <section className="bg-primary/20 border border-primary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-glow text-left">
        <div>
          <h4 className="text-2xl font-bold mb-2">Like what you see?</h4>
          <p className="text-slate-300">Let's discuss your next project.</p>
        </div>
        <Link className="mt-6 md:mt-0 px-8 py-3 bg-primary text-slate-900 rounded-lg font-bold hover:bg-teal-400 transition-colors flex items-center gap-2" to="/contact">
          <span className="material-symbols-outlined">send</span>
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

export default Portfolio;
