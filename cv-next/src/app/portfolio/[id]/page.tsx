import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  return { title: project ? `${project.title} | Portfolio` : 'Project | Fatima Choudhry' };
}

function projectImageSrc(image: string | null) {
  if (!image) return '/assets/images/profile-placeholder.svg';
  if (image.startsWith('http') || image.startsWith('data:')) return image;
  return `/${image.replace(/^\//, '')}`;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <Link href="/portfolio" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Portfolio
      </Link>
      <article className="rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden shadow-sm">
        <div className="aspect-video bg-slate-700 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={projectImageSrc(project.image)} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-8">
          <h1 className="text-2xl font-extrabold text-white mb-2">{project.title}</h1>
          {project.category && (
            <p className="text-indigo-400 text-sm font-medium mb-4">{project.category}</p>
          )}
          {project.description && (
            <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>
          )}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg bg-slate-700 text-slate-300 text-sm">{t}</span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">code</span>
                GitHub
              </a>
            )}
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-400 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">open_in_new</span>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
