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
              I'm a Software Engineer with a focus on Full Stack and Cross-Platform development. I turn complex problems into simple, elegant systems through clean code and modern tools.
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

      {/* Skills & Expertise Redesign */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined font-bold">psychology</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Skills & Expertise</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Frontend Engineering',
              icon: 'code',
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
              skills: ['React.js & Modern JavaScript (ES6+)', 'HTML5, CSS3 & Responsive Design', 'Component-Based UI Development']
            },
            {
              title: 'Backend & APIs',
              icon: 'dns',
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
              skills: ['Node.js & Express.js', 'REST API Development', 'Authentication (Basic JWT)']
            },
            {
              title: 'Database & Backend Services',
              icon: 'database',
              color: 'text-purple-400',
              bg: 'bg-purple-400/10',
              skills: ['MySQL & MongoDB', 'Supabase / Firebase (Backend Services)', 'Data Handling & CRUD Operations']
            },
            {
              title: 'Cross-Platform Development',
              icon: 'devices',
              color: 'text-amber-400',
              bg: 'bg-amber-400/10',
              skills: ['Web Applications', 'React Native (Basic)', 'Progressive Web Apps (PWA)']
            }
          ].map((group) => (
            <div key={group.title} className="group relative rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-300 overflow-hidden">
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`size-10 rounded-lg ${group.bg} flex items-center justify-center ${group.color}`}>
                    <span className="material-symbols-outlined text-xl">{group.icon}</span>
                  </div>
                  <h4 className="font-bold text-white text-lg">{group.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-700/40 text-slate-300 rounded-lg text-sm border border-slate-600/30 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
