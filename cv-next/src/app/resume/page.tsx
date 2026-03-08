import { getProfile, getProjects, getServices } from '@/lib/data';
import ResumePrintButton from './ResumePrintButton';

export const metadata = { title: 'Resume | Fatima Choudhry' };

function projectImageSrc(image: string | null) {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('data:')) return image;
  return `/${image.replace(/^\//, '')}`;
}

export default async function ResumePage() {
  const [profile, projects, services] = await Promise.all([
    getProfile(),
    getProjects(),
    getServices(),
  ]);
  const name = profile?.name ?? 'Fatima Choudhry';
  const title = profile?.title ?? 'Software Engineering Student';
  const photoUrl = profile?.photo?.startsWith('http') || profile?.photo?.startsWith('data:')
    ? profile.photo
    : (profile?.photo ? `/${profile.photo.replace(/^\//, '')}` : '/assets/images/profile.jpg');
  const resumeProjects = (projects ?? []).slice(0, 12);
  const skills = (services ?? []).length
    ? (services ?? []).map((s) => s.title || s.name || '').filter(Boolean)
    : ['Web Development', 'Software Engineering', 'Problem Solving', 'Team Collaboration'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">description</span>
          My Resume
        </h2>
        <ResumePrintButton />
      </div>

      <div id="resume-content" className="rounded-xl bg-slate-800/50 border border-slate-700 shadow-lg overflow-hidden print:shadow-none print:border-slate-600">
        <div className="p-8 md:p-10 border-b border-slate-700 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{name}</h1>
            <p className="text-lg text-indigo-400 font-semibold mb-4">{title}</p>
            <div className="space-y-1 text-slate-300 text-sm">
              <p><span className="text-slate-500">Email:</span> fatimachoudhry94@gmail.com</p>
              <p><span className="text-slate-500">Address:</span> Vehari, Pakistan</p>
              <p><span className="text-slate-500">Languages:</span> English, Urdu, Punjabi</p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="size-28 md:size-32 rounded-full border-2 border-indigo-500 p-1 overflow-hidden bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="" className="profile-photo size-full rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">folder_open</span>
            Portfolio
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {resumeProjects.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800/50">
                <div className="h-28 bg-slate-700 flex items-center justify-center overflow-hidden">
                  {projectImageSrc(p.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={projectImageSrc(p.image)!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-500">image</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white">{p.title}</p>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{p.description || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">psychology</span>
            Skills & Expertise
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                <span className="text-white font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">link</span>
            Connect
          </h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <a className="text-indigo-400 hover:text-indigo-300 transition-colors" href="https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-" target="_blank" rel="noopener">GitHub</a>
            <a className="text-indigo-400 hover:text-indigo-300 transition-colors" href="https://www.linkedin.com/in/fatima-choudhry-714423358/" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>

        <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-700">
          © {new Date().getFullYear()} {name} — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
