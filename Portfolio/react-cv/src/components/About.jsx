import React from 'react';
import { Link } from 'react-router-dom';
import { usePublicProfile } from '../lib/usePublicProfile';

const CAPABILITIES = [
  {
    title: 'Frontend engineering',
    icon: 'code',
    summary: 'Interfaces that stay fast, readable, and easy to iterate on.',
    items: ['React.js and modern JavaScript (ES6+)', 'HTML5, CSS3, and responsive layouts', 'Component-driven UI development'],
  },
  {
    title: 'Backend and APIs',
    icon: 'dns',
    summary: 'Clear contracts between clients and data—secure and maintainable.',
    items: ['Node.js and Express.js', 'REST APIs and integrations', 'Authentication patterns (JWT awareness)'],
  },
  {
    title: 'Data and persistence',
    icon: 'database',
    summary: 'From schema thinking to dependable CRUD in production-ready apps.',
    items: ['SQL (MySQL) and document patterns (MongoDB)', 'Supabase / Firebase backends', 'Migrations-minded data modelling'],
  },
  {
    title: 'Delivery across surfaces',
    icon: 'devices',
    summary: 'One codebase mindset where it helps; native where it counts.',
    items: ['Responsive web apps', 'React Native (foundational)', 'Progressive Web App patterns'],
  },
];

const TIMELINE = [
  {
    label: 'Education',
    title: 'B.S. Software Engineering',
    period: 'Ongoing • academic focus',
    description:
      'Coursework centred on algorithms, databases, backend design, web engineering, and end-to-end product delivery labs.',
    icon: 'school',
  },
  {
    label: 'Experience',
    title: 'Software engineering · projects and automation',
    period: 'Full stack • REST • workflow automation',
    description:
      'Building custom tools, dashboards, APIs, and integration-heavy solutions—balancing clarity for users with code that teammates can extend.',
    icon: 'terminal',
  },
];

function About() {
  const { profile } = usePublicProfile();

  return (
    <div className="about-page mx-auto max-w-6xl space-y-12 px-4 md:space-y-16 sm:px-0">
      {/* Hero — editorial intro */}
      <header className="about-page-hero border-b border-slate-800/80 pb-12 md:pb-14">
        <div className="mx-auto w-full max-w-5xl text-center md:text-left">
          <div className="about-hero-stagger">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Overview</p>
            <h1 className="font-hero mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-white">
              About <span className="text-accent">me</span>
            </h1>
            <div
              className="featured-heading-rule mt-5 mx-auto flex max-w-md items-center justify-center gap-4 md:mx-0 md:justify-start"
              aria-hidden
            >
              <span className="featured-heading-rule-line" />
              <span className="featured-heading-rule-dot" />
            </div>
            <p className="mt-6 text-base font-medium text-slate-300 sm:text-lg profile-title">{profile.title}</p>
            <div
              className="about-hero-hairline mt-8 h-px w-full max-w-sm bg-gradient-to-r from-primary/25 via-slate-500/40 to-transparent md:max-w-md"
              aria-hidden
            />
          </div>

          {/* Wider, centered block so large screens don’t show an empty “half page” on the right */}
          <div className="about-intro-prose about-hero-body-stagger mt-8 space-y-5 text-pretty">
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              I’m{' '}
              <span className="font-semibold text-white profile-name">{profile.name}</span>
              {' — '}a software engineer focused on full-stack and cross-platform delivery. I like turning messy requirements into
              systems that teams can rely on: predictable APIs, clear UI states, and code that survives the next feature.
            </p>
            <div
              className="h-px w-12 bg-gradient-to-r from-accent/80 to-transparent md:my-1"
              aria-hidden
            />
            <p className="text-[15px] leading-relaxed text-slate-400 sm:text-base">
              {profile.tagline?.trim() ||
                'I care about pragmatic architecture, repeatable automation, and shipping work that stakeholders can trace from idea to deployed behaviour.'}{' '}
              When you collaborate with me you get clarity, documentation where it counts, and a bias toward sustainable delivery.
            </p>
            <p className="text-[15px] leading-relaxed text-slate-500 sm:text-base">
              Day to day I’m learning in public through projects, coursework, and real client-style constraints: deadlines, scope
              changes, and the need to ship something useful without cutting corners on security or data integrity.
            </p>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="about-page-section reveal-up reveal-delay-1">
        <div className="mb-10 text-center lg:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Background</p>
          <h2 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl md:text-[2rem]">
            Education and <span className="text-accent">experience</span>
          </h2>
          <div className="featured-heading-rule mx-auto mt-4 flex max-w-md items-center gap-4 lg:mx-0" aria-hidden>
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
        </div>
        <ol className="space-y-6">
          {TIMELINE.map((item) => (
            <li key={item.title} className="flex flex-col gap-5 rounded-2xl border border-slate-700/80 bg-slate-900/35 p-6 sm:flex-row sm:gap-8 sm:p-7">
              <div className="flex shrink-0 items-start gap-4 sm:flex-col sm:gap-3 sm:border-r sm:border-slate-700/60 sm:pr-8">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </span>
                <div className="min-w-0 sm:max-w-[8.5rem]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/90">{item.label}</p>
                  <p className="mt-1.5 text-xs leading-snug text-slate-500">{item.period}</p>
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Capabilities */}
      <section className="about-page-section reveal-up reveal-delay-2">
        <div className="mb-10 text-center lg:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Stack and craft</p>
          <h2 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl md:text-[2rem]">
            Professional <span className="text-accent">capabilities</span>
          </h2>
          <div className="featured-heading-rule mx-auto mt-4 flex max-w-md items-center gap-4 lg:mx-0" aria-hidden>
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
        </div>
        <div className="about-capabilities-grid grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {CAPABILITIES.map(({ title, icon, summary, items }) => (
            <article key={title} className="about-capability group rounded-2xl border border-slate-700/90 bg-slate-900/35 p-6 md:p-7">
              <div className="about-capability-glow" />
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{summary}</p>
              <ul className="about-capability-list mt-5 space-y-2.5 border-t border-slate-700/50 pt-5">
                {items.map((line) => (
                  <li key={line} className="about-capability-line text-sm leading-snug text-slate-300">
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Career objective + CTA */}
      <section className="about-cta-banner reveal-up reveal-delay-3 rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/10 via-slate-900/50 to-slate-950/80 p-8 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Direction</p>
            <h2 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Career objective</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              To grow with teams that value product quality, measurable outcomes, and respectful engineering culture—where I can
              own meaningful slices of the stack, mentor where appropriate, and keep improving how we ship.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
              <span className="material-symbols-outlined text-base">bolt</span>
              Open to professional opportunities
            </span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
