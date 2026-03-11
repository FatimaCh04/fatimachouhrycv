import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const BLOG_FILTERS = [
  { slug: 'all', label: 'All' },
  { slug: 'Islamic', label: 'Islamic' },
  { slug: 'Funny', label: 'Funny' },
  { slug: 'Informative', label: 'Informative' },
];

const CLIENT_FEEDS = [
  { url: 'https://www.islamicity.org/feed/', type: 'Islamic', name: 'Islamicity' },
  { url: 'https://www.reddit.com/r/funny/.rss', type: 'Funny', name: 'Reddit r/funny' },
  { url: 'https://www.theonion.com/feeds/daily/', type: 'Funny', name: 'The Onion' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', type: 'Informative', name: 'BBC News' },
];

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
}

function getImageFromItem(el) {
  const enc = el.querySelector('enclosure');
  if (enc && enc.getAttribute('url')) {
    const url = enc.getAttribute('url') || '';
    if (/\.(jpe?g|png|gif|webp)/i.test(url)) return url;
  }
  const media = el.querySelector('[url]');
  if (media && media.getAttribute('url')) return media.getAttribute('url');
  const descEl = el.querySelector('description') || el.querySelector('summary') || el.querySelector('content');
  if (descEl && descEl.innerHTML) {
    const m = descEl.innerHTML.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    if (m && m[1]) return m[1];
  }
  return '';
}

function parseRssInBrowser(xml, type, sourceName) {
  const items = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const isAtom = doc.querySelector('entry') !== null;
    const list = doc.querySelectorAll(isAtom ? 'entry' : 'item');
    for (let i = 0; i < Math.min(list.length, 8); i++) {
      const el = list[i];
      const titleEl = el.querySelector('title');
      let title = titleEl ? (titleEl.textContent || '').trim() : '';
      if (!title) continue;
      let link = '';
      const linkEl = el.querySelector('link');
      if (linkEl) link = linkEl.getAttribute('href') || linkEl.textContent || '';
      if (!link && !isAtom) link = (el.querySelector('link') && el.querySelector('link').textContent) || '';
      const descEl = el.querySelector('description') || el.querySelector('summary') || el.querySelector('content');
      const content = descEl ? stripHtml(descEl.textContent || '').slice(0, 300) : '';
      const dateEl = el.querySelector('pubDate') || el.querySelector('updated') || el.querySelector('dc\\:date');
      const created_at = dateEl ? dateEl.textContent : '';
      const image = getImageFromItem(el);
      const fallbackImage = `https://picsum.photos/800/400?random=${type}-${i}`;
      items.push({
        id: `client-${type}-${i}-${Date.now()}`,
        title: title.slice(0, 200),
        content,
        link: (link || '').trim(),
        source: sourceName,
        type,
        created_at,
        image: image || fallbackImage,
      });
    }
  } catch (_) {
    /* ignore parse errors */
  }
  return items;
}

async function fetchRssClient() {
  const results = await Promise.all(
    CLIENT_FEEDS.map(async (feed) => {
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRssInBrowser(xml, feed.type, feed.name);
      } catch (_) {
        return [];
      }
    })
  );
  const all = results.flat();
  all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return all.slice(0, 24);
}

const BLOG_CACHE_KEY = 'blog_articles';
const BLOG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedBlogArticles() {
  try {
    const raw = sessionStorage.getItem(BLOG_CACHE_KEY);
    if (!raw) return null;
    const { data, at, source } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - at > BLOG_CACHE_TTL_MS) return null;
    return { data, source: source || 'api' };
  } catch (_) {
    return null;
  }
}

function setCachedBlogArticles(data, source = 'api') {
  try {
    sessionStorage.setItem(BLOG_CACHE_KEY, JSON.stringify({ data, at: Date.now(), source }));
  } catch (_) {}
}

function Blog() {
  const cached = getCachedBlogArticles();
  const [articles, setArticles] = useState(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [source, setSource] = useState(cached?.source || 'api');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      if (cached) {
        setLoading(false);
        setError(false);
      } else {
        setLoading(true);
        setError(false);
      }
      try {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const res = await fetch(`${base}/api/fetch-news`, { signal: AbortSignal.timeout(12000) });
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
            setSource('api');
            setCachedBlogArticles(data.articles, 'api');
            setLoading(false);
            return;
          }
        }
      } catch (_) {
        /* API not available (e.g. local dev) */
      }
      try {
        const clientArticles = await fetchRssClient();
        if (clientArticles.length > 0) {
          setArticles(clientArticles);
          setSource('api');
          setCachedBlogArticles(clientArticles, 'api');
          setLoading(false);
          return;
        }
      } catch (_) {
        /* client fetch failed */
      }
      supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data, err }) => {
        if (err) setError(true);
        else {
          const list = data || [];
          setArticles(list);
          setSource('supabase');
          if (list.length > 0) setCachedBlogArticles(list, 'supabase');
        }
        setLoading(false);
      });
    }
    load();
  }, []);

  function BlogSkeleton() {
    return (
      <div className="space-y-6 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/20 animate-pulse">
            <div className="w-full h-48 bg-slate-700/50" />
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-slate-700/50 rounded" />
                <div className="h-4 w-20 bg-slate-700/50 rounded" />
              </div>
              <div className="h-6 bg-slate-700/50 rounded w-4/5" />
              <div className="h-3 bg-slate-700/50 rounded w-full" />
              <div className="h-3 bg-slate-700/50 rounded w-5/6" />
            </div>
          </article>
        ))}
      </div>
    );
  }

  const toggleExpand = (id, e) => {
    e.preventDefault();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) {
      return '—';
    }
  };

  const filteredArticles =
    filter === 'all' ? articles : articles.filter((a) => (a.type || '').toLowerCase() === filter.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary">article</span>
            Blog
          </h2>
          <p className="text-lg text-slate-400">Islamic, funny &amp; informative daily news from around the web.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {BLOG_FILTERS.map((f) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFilter(f.slug)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filter === f.slug
                  ? 'bg-primary text-slate-900 shadow-glow'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="space-y-6 pt-2" id="news-feed">
          {loading && (
            <>
              <p className="text-slate-400 text-center pb-4 flex items-center justify-center gap-2" id="news-loading">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Loading latest articles…
              </p>
              <BlogSkeleton />
            </>
          )}
          {error && (
            <p className="text-amber-400 text-center py-8" id="news-loading">
              Could not load articles. Refresh the page or try again later.
            </p>
          )}
          {!loading && !error && articles.length === 0 && (
            <p className="text-slate-400 text-center py-6">No articles right now. Try again later.</p>
          )}
          {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
            <p className="text-slate-400 text-center py-6">No articles in this category. Try another filter.</p>
          )}
          {!loading &&
            !error &&
            filteredArticles.map((a, idx) => {
              const desc = (a.content || '')
                .replace(/<[^>]+>/g, '')
                .trim()
                .slice(0, 180);
              const showDesc = desc.length === 180 ? desc + '…' : desc || 'Read the full article.';
              const isExternal = source === 'api' && a.link;

              const placeholderImg = `https://picsum.photos/800/400?random=blog-${(a.id || idx).toString().slice(-8)}`;
              const imgUrl = (a.image && a.image.trim()) ? a.image : placeholderImg;
              return (
                <article
                  key={a.id || idx}
                  className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/20 hover:bg-slate-800/50 hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="w-full h-48 bg-slate-800 shrink-0 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover block"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (e.target.src !== placeholderImg) {
                          e.target.src = placeholderImg;
                        }
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <time>{formatDate(a.created_at)}</time>
                      {a.type && (
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-semibold">
                          {a.type}
                        </span>
                      )}
                      {a.source && (
                        <span className="text-slate-500 text-xs">via {a.source}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{a.title || 'Untitled'}</h3>
                    <p className="text-slate-300">{showDesc}</p>
                    {a.content && a.content.length > 180 && (
                      <>
                        <div
                          className={`post-full-content mt-4 pt-4 border-t border-slate-600 text-slate-300 text-sm whitespace-pre-wrap ${
                            expanded[a.id] ? '' : 'hidden'
                          }`}
                        >
                          {a.content}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(a.id, e)}
                          className="read-more-btn inline-flex items-center gap-1 text-primary font-semibold mt-3 hover:underline"
                        >
                          {expanded[a.id] ? (
                            <>
                              Show less <span className="material-symbols-outlined text-lg">arrow_upward</span>
                            </>
                          ) : (
                            <>
                              Read more <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                    {isExternal && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-medium mt-3 hover:underline text-sm"
                      >
                        View original <span className="material-symbols-outlined text-base">open_in_new</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      </div>
      <section className="bg-primary/20 border border-primary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-glow">
        <div className="text-left">
          <h4 className="text-2xl font-bold mb-2">Stay in touch</h4>
          <p className="text-slate-300">Have a question or want to collaborate?</p>
        </div>
        <Link
          className="mt-6 md:mt-0 px-8 py-3 bg-primary text-slate-900 rounded-lg font-bold hover:bg-teal-400 transition-colors flex items-center gap-2"
          to="/contact"
        >
          <span className="material-symbols-outlined">send</span>
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

export default Blog;
