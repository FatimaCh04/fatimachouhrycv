import { getProfile } from '@/lib/data';

export const metadata = { title: 'About | Fatima Choudhry Portfolio' };

export default async function AboutPage() {
  const profile = await getProfile();
  const name = profile?.name ?? 'Fatima Choudhry';
  const photoUrl = profile?.photo?.startsWith('http') || profile?.photo?.startsWith('data:')
    ? profile.photo
    : (profile?.photo ? `/${profile.photo.replace(/^\//, '')}` : '/assets/images/profile.jpg');

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-10 shadow-sm">
        <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">person</span>
          About Me
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="size-32 rounded-full border-2 border-indigo-500 p-1 overflow-hidden bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt={name} className="size-full rounded-full object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              I&apos;m a Software Engineering student with a focus on building scalable solutions. I turn complex problems into simple, elegant systems through clean code and modern tools.
            </p>
            <p className="text-slate-400 leading-relaxed">
              My work spans custom software, process automation, and robust backend design. I build tools that save time and scale with your business.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6">Education & Experience</h3>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <div className="size-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h4 className="font-semibold text-white">B.S. Computer Science</h4>
              <p className="text-sm text-slate-400">University — Present</p>
              <p className="text-slate-300 mt-1">Focus on software engineering, algorithms, and systems.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="size-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <span className="material-symbols-outlined">work</span>
            </div>
            <div>
              <h4 className="font-semibold text-white">Software Engineering & Development</h4>
              <p className="text-sm text-slate-400">Full Stack • APIs • Automation</p>
              <p className="text-slate-300 mt-1">Building and shipping automation and custom software.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">psychology</span>
          Skills & Expertise
        </h3>
        <div className="space-y-8">
          {[
            { title: 'Programming Languages', items: [['Python', 90], ['JavaScript', 85], ['C++', 75], ['SQL', 80]] },
            { title: 'Web Development', items: [['HTML5', 92], ['CSS3', 88], ['Tailwind CSS', 85], ['Responsive Design', 87]] },
            { title: 'Backend & Tools', items: [['Node.js', 82], ['REST APIs', 80], ['Git & GitHub', 88], ['Vercel Deployment', 78]] },
            { title: 'Databases', items: [['MySQL', 85], ['MongoDB', 78]] },
            { title: 'Software & Technologies', items: [['Docker (Basic)', 65], ['Linux', 72], ['VS Code', 90], ['Postman', 85]] },
            { title: 'Other Skills', items: [['Problem Solving', 88], ['Debugging', 85], ['System Design Basics', 70], ['Algorithmic Thinking', 82]] },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">{group.title}</h4>
              <div className="space-y-3">
                {group.items.map(([label, pct]) => (
                  <div key={String(label)}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
