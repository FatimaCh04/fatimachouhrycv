import React from 'react';
import { usePublicProfile } from '../lib/usePublicProfile';

function About() {
  const { profile } = usePublicProfile();
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-10 shadow-sm">
        <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          About Me
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="size-32 rounded-full border-2 border-primary p-1 shadow-glow">
              <img
                alt={profile.name}
                className="profile-photo size-full rounded-full object-cover"
                src={profile.photo}
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/profile-placeholder.svg'; }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              I'm a Software Engineering student with a focus on building scalable solutions. I turn complex problems into simple, elegant systems through clean code and modern tools.
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
            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h4 className="font-semibold text-white">B.S. Computer Science</h4>
              <p className="text-sm text-slate-400">University — Present</p>
              <p className="text-slate-300 mt-1">Focus on software engineering, algorithms, and systems.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
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

      {/* Skills & Expertise */}
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">psychology</span>
          Skills & Expertise
        </h3>
        <div className="space-y-4">
          {[
            { name: 'AI-Assisted UI/UX Design (Web & Apps)', width: '92%' },
            { name: 'AI-Enhanced Web Development', width: '88%' },
            { name: 'Backend Development & REST APIs', width: '85%' },
            { name: 'Database Management (MySQL, MongoDB)', width: '82%' },
            { name: 'Git & GitHub Version Control', width: '90%' },
            { name: 'Web Deployment (Vercel)', width: '78%' },
            { name: 'Branding & Digital Presence', width: '80%' },
          ].map(({ name, width }) => (
            <div key={name}>
              <span className="text-sm text-slate-300 block mb-1">{name}</span>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
