import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const CATEGORIES = [
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

function parseTechnologies(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

function GithubIcon({ className = 'size-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

const PROJECT_DETAIL_SELECT = '*';

function ProjectDetail() {
  const { id } = useParams();
  const { data: project, loading } = useSupabaseQuery('projects', {
    select: PROJECT_DETAIL_SELECT,
    single: true,
    filter: id ? { column: 'id', value: Number(id) || id } : undefined,
    enabled: !!id,
    cacheKey: id ? `project_${id}` : undefined,
    cacheTTL: 5 * 60 * 1000,
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-primary hover:text-teal-400 font-semibold">
          <span className="material-symbols-outlined">arrow_back</span> Back to Portfolio
        </Link>
        <p className="text-slate-400">Project not found.</p>
      </div>
    );
  }

  const techList = parseTechnologies(project.technologies);
  const hasLiveView = project.live_link && project.live_link.trim().length > 0;
  const isMobileApp = (project.category || '').toLowerCase().replace(/\s+/g, '-') === 'mobile-app-development';

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-slate-900 font-semibold hover:bg-teal-400 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Portfolio
      </Link>

      {/* Picture box - andar category, title, phir image */}
      <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/30">
        <div className="px-5 pt-5 pb-3 space-y-1">
          {project.category && (
            <p className="text-xs font-bold tracking-wider text-primary">
              {getCategoryLabel(project.category)}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h1>
        </div>
        {hasLiveView ? (
          <div className={`w-full px-5 pb-5 flex justify-center ${isMobileApp ? 'max-w-sm mx-auto' : ''}`}>
            <div
              className="rounded-lg overflow-hidden bg-white"
              style={{
                width: isMobileApp ? '280px' : '100%',
                aspectRatio: isMobileApp ? '9/16' : '16/10',
                minHeight: isMobileApp ? '400px' : '360px',
              }}
            >
              <iframe
                title={project.title}
                src={project.live_link}
                className="block w-full h-full min-h-[360px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        ) : project.image && project.image.length > 0 ? (
          <div className="px-5 pb-5 flex justify-center">
            <div className={`flex justify-center items-center bg-slate-800/50 rounded-lg overflow-hidden min-h-[280px] ${isMobileApp ? 'w-[280px] mx-auto' : 'w-full'}`}>
              <img
                src={project.image}
                alt={project.title}
                className={`w-auto object-contain object-center ${isMobileApp ? 'max-h-[75vh] max-w-[280px]' : 'max-w-full max-h-[70vh]'}`}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-slate-800/50 p-12 text-slate-500" style={{ minHeight: '280px' }}>
            <span className="material-symbols-outlined text-6xl mb-2">image</span>
            <p className="text-sm">No live link or image. Add Demo/Live Link or image in Admin.</p>
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="mt-3 text-primary hover:underline text-sm font-medium">
                View on Github →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Ek hi box: Project Description + Technologies Used */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6 space-y-5">
        <section>
          <h2 className="text-xl font-bold text-white mb-2">Project Description</h2>
          <p className="text-slate-300 whitespace-pre-wrap">{project.description || '—'}</p>
        </section>
        {techList.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-2">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-md bg-primary/15 text-primary text-sm font-bold border border-primary/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Links */}
      <div className="pt-8 flex flex-col gap-4 border-t border-slate-700">
        {hasLiveView && (
          <a
            href={project.live_link}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/25 text-primary font-semibold hover:bg-primary/35 transition-colors border border-primary/30"
          >
            <span className="material-symbols-outlined text-xl">open_in_new</span>
            Live / View
          </a>
        )}
        {project.github_link && (
          <a
            href={project.github_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors"
          >
            <GithubIcon className="size-5" />
            Github
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
