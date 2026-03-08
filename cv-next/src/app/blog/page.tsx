import Link from 'next/link';
import { getPosts } from '@/lib/data';

export const metadata = { title: 'Blog | Fatima Choudhry' };

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">article</span>
          Blog
        </h2>
        <p className="text-lg text-slate-400 mb-8">Thoughts on software, automation, and building products.</p>
      </div>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="p-8 rounded-xl border border-slate-700 bg-slate-800/30 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">article</span>
            <p>No posts yet. Add posts from the Admin dashboard.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block p-6 rounded-xl border border-slate-700 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all"
            >
              <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
              <p className="text-sm text-slate-400 mb-2">
                {post.date && <span>{post.date}</span>}
                {post.category && <span className="ml-2">· {post.category}</span>}
              </p>
              <p className="text-slate-300 text-sm line-clamp-2">{post.description || post.content || '—'}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
