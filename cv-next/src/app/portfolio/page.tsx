import Link from 'next/link';
import { getProjects } from '@/lib/data';

export const metadata = { title: 'Portfolio | Fatima Choudhry' };

function projectImageSrc(image: string | null) {
  if (!image) return '/assets/images/profile-placeholder.svg';
  if (image.startsWith('http') || image.startsWith('data:')) return image;
  return `/${image.replace(/^\//, '')}`;
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">folder_open</span>
          Portfolio
        </h2>
        <p className="text-lg text-slate-400 mb-8">Projects I&apos;ve built — web apps, automation, and custom software.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full p-8 rounded-xl border border-slate-700 bg-slate-800/30 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
            <p>No projects yet. Add projects from the Admin dashboard.</p>
          </div>
        ) : (
          projects.map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.id}`}
              className="block p-0 rounded-xl border border-slate-700 bg-slate-800/30 overflow-hidden hover:border-indigo-500/50 transition-all duration-200"
            >
              <div className="aspect-video bg-slate-700 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectImageSrc(p.image)} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{p.description || '—'}</p>
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
