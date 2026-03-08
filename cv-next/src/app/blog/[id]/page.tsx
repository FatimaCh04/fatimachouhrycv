import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post ? `${post.title} | Blog` : 'Blog | Fatima Choudhry' };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="space-y-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Blog
      </Link>
      <article className="rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-white mb-2">{post.title}</h1>
        <p className="text-slate-400 text-sm mb-6">
          {post.date && <span>{post.date}</span>}
          {post.category && <span className="ml-2">· {post.category}</span>}
        </p>
        <div className="prose prose-invert max-w-none text-slate-300">
          {post.content ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <p>{post.description || 'No content.'}</p>
          )}
        </div>
      </article>
    </div>
  );
}
