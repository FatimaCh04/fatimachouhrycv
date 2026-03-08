import { getServices } from '@/lib/data';

export const metadata = { title: 'Service | Fatima Choudhry Portfolio' };

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">work</span>
          Service
        </h2>
        <p className="text-lg text-slate-400 mb-8">What I can help you build — from automation and APIs to custom software.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full p-8 rounded-xl border border-slate-700 bg-slate-800/30 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">work</span>
            <p>No services added yet. Add services from the Admin dashboard.</p>
          </div>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-200"
            >
              <div className="size-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <span className="material-symbols-outlined text-2xl">code</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title || s.name || 'Service'}</h3>
              <p className="text-slate-300 text-sm">{s.description || '—'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
