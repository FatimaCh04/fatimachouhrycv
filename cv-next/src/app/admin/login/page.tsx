import Link from 'next/link';

export const metadata = { title: 'Admin Login | Fatima Choudhry Portfolio' };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">admin_panel_settings</span>
          Admin Login
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Supabase Auth and dashboard CRUD will be added here. For now, manage data directly in Supabase or run the schema SQL.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to portfolio
        </Link>
      </div>
    </div>
  );
}
