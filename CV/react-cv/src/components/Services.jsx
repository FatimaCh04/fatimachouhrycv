import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const DEFAULT_SERVICES = [
  { id: 'web-dev', title: 'Web Development', description: 'Custom websites and web apps with React, Node.js, and modern tooling. Responsive, accessible, and performant.', price: '$35/hour', icon: 'code' },
  { id: 'api-backend', title: 'API Design & Backend', description: 'RESTful APIs, database design, and server logic with FastAPI, Express, or Node. Clean, documented, and scalable.', price: '$45/hour', icon: 'api' },
  { id: 'dashboards', title: 'Dashboards & Tools', description: 'Internal tools, admin panels, and data dashboards. Tailwind-based UI with clear information hierarchy.', price: '$40/hour', icon: 'dashboard' },
  { id: 'devops', title: 'DevOps & Deployment', description: 'Docker, CI/CD, and cloud deployment (e.g. AWS). Reliable, reproducible environments.', price: '$50/hour', icon: 'rocket_launch' },
  { id: 'react-dev', title: 'React Development', description: 'Build dynamic and interactive web applications using React.js. Experienced in creating reusable components, managing state, and developing fast single-page applications.', price: '$42/hour', icon: 'hub' },
  { id: 'mobile', title: 'Mobile App Development', description: 'Develop cross-platform mobile applications using modern frameworks and tools. Focus on performance, user experience, and scalable mobile solutions.', price: '$48/hour', icon: 'smartphone' },
];

function Services() {
  const { data: fetchedServices = [], loading } = useSupabaseQuery('services', {
    select: 'id, title, description, price, icon',
    orderBy: 'id',
    orderAsc: true,
    limit: 30,
    cacheKey: 'supabase_services',
    cacheTTL: 5 * 60 * 1000,
  });
  const services = loading ? [] : (fetchedServices.length > 0 ? fetchedServices : DEFAULT_SERVICES);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          Service
        </h2>
        <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8">What I can help you build — from automation and APIs to custom software.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" id="services-grid">
        {loading ? (
          <div className="col-span-full text-slate-400 text-center py-8 text-sm">Loading services...</div>
        ) : (
        services.map((s, idx) => (
          <div key={s.id ?? idx} className="p-4 sm:p-6 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer text-left min-h-[120px] flex flex-col justify-center">
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-2xl">{s.icon || 'code'}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-slate-300 text-sm mb-3">{s.description}</p>
            {s.price && <p className="text-primary font-semibold">{s.price}</p>}
          </div>
        ))
        )}
      </div>
      <section className="bg-primary/20 border border-primary rounded-xl p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-glow gap-4">
        <div className="text-left">
          <h4 className="text-xl sm:text-2xl font-bold mb-2">Need a project built?</h4>
          <p className="text-slate-300 text-sm sm:text-base">I'm open to automation and custom software projects.</p>
        </div>
        <Link className="mt-2 md:mt-0 px-6 sm:px-8 py-3 bg-primary text-slate-900 rounded-lg font-bold hover:bg-teal-400 transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation w-full md:w-auto" to="/contact">
          <span className="material-symbols-outlined">send</span>
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

export default Services;
