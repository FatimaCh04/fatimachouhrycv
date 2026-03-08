import Link from 'next/link';
import { getProfile } from '@/lib/data';

export default async function HomePage() {
  const profile = await getProfile();
  const name = profile?.name ?? 'Fatima Choudhry';
  const title = profile?.title ?? 'Software Engineering Student';
  const tagline = profile?.tagline ?? 'Building scalable automation and custom software solutions.';
  const photoUrl = profile?.photo?.startsWith('http') || profile?.photo?.startsWith('data:')
    ? profile.photo
    : (profile?.photo ? `/${profile.photo.replace(/^\//, '')}` : '/assets/images/profile.jpg');
  const resumeUrl = profile?.resume_url ?? '#';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="size-28 rounded-full border-2 border-indigo-500 p-1 mx-auto overflow-hidden bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt={name} className="size-full rounded-full object-cover" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{name}</h2>
          <p className="text-base text-indigo-400 font-medium">{tagline}</p>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">info</span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Full Name</p>
              <p className="font-semibold text-white">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="size-10 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
              <span className="material-symbols-outlined">work</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Professional Title</p>
              <p className="font-semibold text-white">{title}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Download Resume
            </a>
          ) : (
            <span className="text-slate-400 text-sm">Resume link not set in admin.</span>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">15+</p>
            <p className="text-sm text-slate-400">Projects Completed</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="material-symbols-outlined">terminal</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">10</p>
            <p className="text-sm text-slate-400">Tech Stack Proficiencies</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="material-symbols-outlined">code</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-sm text-slate-400">GitHub Contributions</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-500/20 border border-indigo-500 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white">
        <div>
          <h4 className="text-2xl font-bold mb-2">Interested in collaborating?</h4>
          <p className="text-slate-300">I&apos;m open to automation projects and custom software opportunities.</p>
        </div>
        <Link
          href="/contact"
          className="mt-6 md:mt-0 px-8 py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-400 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">send</span>
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
