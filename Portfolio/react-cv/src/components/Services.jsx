import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description:
      'Custom websites and web apps with React, Node.js, and modern tooling. Responsive, accessible, and performant.',
    price: '$35/hour',
    icon: 'code',
  },
  {
    id: 'api-backend',
    title: 'API Design and Backend',
    description:
      'RESTful APIs, database design, and server logic with Express or Node. Clear contracts, sensible errors, and docs your team can follow.',
    price: '$45/hour',
    icon: 'api',
  },
  {
    id: 'dashboards',
    title: 'Dashboards and Tools',
    description:
      'Internal tools, admin panels, and data dashboards with strong hierarchy: fewer clicks to insight, safer defaults.',
    price: '$40/hour',
    icon: 'dashboard',
  },
  {
    id: 'devops',
    title: 'DevOps and Deployment',
    description:
      'Docker-friendly setups, CI/CD basics, and repeatable deploys so staging and production behave predictably.',
    price: '$50/hour',
    icon: 'rocket_launch',
  },
  {
    id: 'react-dev',
    title: 'React Development',
    description:
      'Component-driven UIs, deliberate state boundaries, and SPAs that stay maintainable as features accumulate.',
    price: '$42/hour',
    icon: 'hub',
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    description:
      'Cross-platform builds with performance and UX in mind—patterns that scale when screens and constraints change.',
    price: '$48/hour',
    icon: 'smartphone',
  },
];

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      {[1, 2, 3, 4, 5, 6].map((k) => (
        <div
          key={k}
          className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
        >
          <div className="h-11 w-11 rounded-xl bg-slate-700/60" />
          <div className="mt-4 h-5 w-2/3 rounded bg-slate-700/50" />
          <div className="mt-3 h-3 w-full rounded bg-slate-800" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-800" />
          <div className="mt-5 h-6 w-24 rounded-full bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

function Services() {
  const { data: fetchedServices = [], loading } = useSupabaseQuery('services', {
    select: 'id, title, description, price, icon',
    orderBy: 'id',
    orderAsc: true,
    limit: 30,
    cacheKey: 'supabase_services',
    cacheTTL: 5 * 60 * 1000,
  });
  const services = loading ? [] : fetchedServices.length > 0 ? fetchedServices : DEFAULT_SERVICES;

  return (
    <div className="services-page mx-auto max-w-6xl space-y-12 px-4 pb-14 md:space-y-16 md:pb-20 sm:px-0">
      <header className="services-page-hero border-b border-slate-800/80 pb-10 md:pb-12">
        <div className="mx-auto w-full max-w-5xl text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Offerings</p>
          <h1 className="font-hero mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight text-white">
            Services and <span className="text-accent">rates</span>
          </h1>
          <div
            className="featured-heading-rule mx-auto mt-5 flex max-w-md items-center justify-center gap-4 md:mx-0 md:justify-start"
            aria-hidden
          >
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:text-base md:mx-0">
            End-to-end delivery across web, APIs, and automation — scoped estimates after we align on goals. Rates below are a
            baseline; fixed-scope projects can be quoted separately.
          </p>
        </div>
      </header>

      <section aria-labelledby="services-grid-heading">
        <h2 id="services-grid-heading" className="sr-only">
          Service list
        </h2>
        {loading ? (
          <ServicesSkeleton />
        ) : (
          <div className="services-grid grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6" id="services-grid">
            {services.map((s, idx) => (
              <article
                key={s.id ?? idx}
                className="services-card group relative flex min-h-[164px] flex-col overflow-hidden rounded-2xl border border-slate-700/85 bg-slate-900/35 p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.85)] md:p-7"
              >
                <span className="services-card-glow pointer-events-none absolute inset-x-0 top-0 z-[1] h-[3px] bg-gradient-to-r from-primary via-primary/80 to-accent opacity-95" />
                <div className="relative z-[2] flex flex-1 flex-col text-left">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/18">
                      <span className="material-symbols-outlined text-[26px]">{s.icon || 'code'}</span>
                    </div>
                    <span className="rounded-full border border-slate-600/70 bg-slate-800/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-white md:text-xl">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{s.description}</p>
                  {s.price && (
                    <p className="mt-5 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-accent">
                      {s.price}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="services-cta-banner relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-slate-900/55 to-slate-950/90 p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgba(79,70,229,0.15),transparent_55%)]" aria-hidden />
        <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Next step</p>
            <h3 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Tell me what you’re building</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              Share scope, timeline, and constraints — I’ll reply with questions, a realistic plan, and how we can phase work.
            </p>
          </div>
          <Link
            className="services-cta-btn relative z-[1] inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary-dark lg:w-auto touch-manipulation"
            to="/contact"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;
