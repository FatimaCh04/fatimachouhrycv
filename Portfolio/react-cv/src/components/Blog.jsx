import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const BLOG_FILTERS = [
  { slug: 'all', label: 'All' },
  { slug: 'Islamic', label: 'Islamic' },
  { slug: 'Funny', label: 'Funny' },
  { slug: 'Informative', label: 'Informative' },
];

const CLIENT_FEEDS = [
  { url: 'https://www.islamicity.org/feed/', type: 'Islamic', name: 'Islamicity' },
  { url: 'https://www.islamicity.org/feed', type: 'Islamic', name: 'Islamicity' },
  { url: 'https://www.theonion.com/feeds/daily/', type: 'Funny', name: 'The Onion' },
  { url: 'https://www.theonion.com/rss', type: 'Funny', name: 'The Onion' },
  { url: 'https://www.reddit.com/r/funny/.rss', type: 'Funny', name: 'Reddit r/funny' },
  { url: 'https://www.cracked.com/feed/', type: 'Funny', name: 'Cracked' },
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

async function fetchWithProxy(url, timeout = 12000) {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];
  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(timeout),
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      });
      if (res.ok) return await res.text();
    } catch (_) {
      /* try next proxy */
    }
  }
  return null;
}

function dedupeArticles(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    const key = (a.link || a.title || '').trim() || a.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchRssClient() {
  const results = await Promise.all(
    CLIENT_FEEDS.map(async (feed) => {
      try {
        const xml = await fetchWithProxy(feed.url, 12000);
        if (!xml) return [];
        return parseRssInBrowser(xml, feed.type, feed.name);
      } catch (_) {
        return [];
      }
    })
  );
  const all = results.flat();
  const deduped = dedupeArticles(all);
  deduped.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return deduped.slice(0, 24);
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

const SUPABASE_POSTS_SELECT = 'id, title, content, image, created_at';

function BlogSkeleton() {
  return (
    <div className="space-y-8 pt-2 md:space-y-10">
      {[1, 2, 3, 4].map((i) => (
        <article
          key={i}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"
        >
          <div className="h-56 bg-slate-800/80 sm:h-64 md:h-72" />
          <div className="space-y-3 p-6 md:p-8">
            <div className="flex gap-2">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="h-4 w-20 rounded bg-slate-800" />
            </div>
            <div className="h-6 w-4/5 rounded bg-slate-800" />
            <div className="h-3 w-full rounded bg-slate-800" />
            <div className="h-3 w-5/6 rounded bg-slate-800" />
          </div>
        </article>
      ))}
    </div>
  );
}

function Blog() {
  const cached = getCachedBlogArticles();
  const [articles, setArticles] = useState(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [source, setSource] = useState(cached?.source || 'api');
  const [filter, setFilter] = useState('all');

  const { data: supabasePosts = [] } = useSupabaseQuery('posts', {
    select: SUPABASE_POSTS_SELECT,
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
    cacheKey: 'supabase_posts',
    cacheTTL: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (source === 'supabase' && articles.length === 0 && supabasePosts.length > 0) {
      setArticles(supabasePosts);
      setCachedBlogArticles(supabasePosts, 'supabase');
      setError(false);
    }
  }, [source, articles.length, supabasePosts]);

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
      setArticles(supabasePosts || []);
      setSource('supabase');
      if ((supabasePosts || []).length > 0) setCachedBlogArticles(supabasePosts, 'supabase');
      setError((supabasePosts || []).length === 0);
      setLoading(false);
    }
    load();
  }, []);

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
    <div className="blog-page mx-auto max-w-6xl space-y-12 px-4 pb-14 md:space-y-14 md:pb-20 sm:px-0">
      <header className="border-b border-slate-800/80 pb-10 md:pb-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Journal</p>
          <h1 className="font-hero mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-white">
            Blog and <span className="text-accent">reads</span>
          </h1>
          <div className="featured-heading-rule mx-auto mt-5 flex max-w-md items-center justify-center gap-4" aria-hidden>
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
            Islamic, funny, and informative picks from around the web — filter by mood, open sources in a new tab, or expand
            posts saved in the dashboard.
          </p>
        </div>

        <div
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filter articles"
        >
          {BLOG_FILTERS.map((f) => (
            <button
              key={f.slug}
              type="button"
              role="tab"
              aria-selected={filter === f.slug}
              onClick={() => setFilter(f.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === f.slug
                  ? 'bg-primary text-white shadow-md shadow-primary/25 ring-1 ring-primary/40'
                  : 'border border-slate-600/80 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <section aria-labelledby="blog-feed-heading">
        <h2 id="blog-feed-heading" className="sr-only">
          Article feed
        </h2>
        <div className="space-y-8 pt-2 md:space-y-10" id="news-feed">
          {loading && <BlogSkeleton />}
          {error && (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-8 text-center text-amber-200/90" id="news-loading">
              Could not load articles. Refresh the page or try again later.
            </p>
          )}
          {!loading && !error && articles.length === 0 && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-12 text-center text-slate-400">
              No articles right now. Try again later.
            </p>
          )}
          {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
            <p className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-12 text-center text-slate-400">
              Nothing in this category — try &quot;All&quot; or another filter.
            </p>
          )}
          {!loading &&
            !error &&
            filteredArticles.map((a, idx) => {
              const EXCERPT_LEN = 260;
              const rawStripped = (a.content || '').replace(/<[^>]+>/g, '').trim();
              const desc = rawStripped.slice(0, EXCERPT_LEN);
              const showDesc =
                desc.length === EXCERPT_LEN && rawStripped.length > EXCERPT_LEN
                  ? `${desc}…`
                  : desc || 'Read the full article.';
              const hasLongBody = rawStripped.length > EXCERPT_LEN;
              const isExternal = source === 'api' && a.link;

              const placeholderImg = `https://picsum.photos/800/400?random=blog-${(a.id || idx).toString().slice(-8)}`;
              const imgUrl = a.image && a.image.trim() ? a.image : placeholderImg;
              return (
                <article
                  key={a.id || idx}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/35 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.85)]"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[3px] bg-gradient-to-r from-primary via-primary/80 to-accent opacity-95" />
                  <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-950 sm:h-64 md:h-72">
                    <img
                      src={imgUrl}
                      alt=""
                      className="block size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                      fetchPriority={idx < 2 ? 'high' : 'low'}
                      onError={(e) => {
                        if (e.target.src !== placeholderImg) {
                          e.target.src = placeholderImg;
                        }
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                  </div>
                  <div className="relative p-6 md:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                      <span className="material-symbols-outlined text-base text-slate-500">calendar_today</span>
                      <time>{formatDate(a.created_at)}</time>
                      {a.type && (
                        <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {a.type}
                        </span>
                      )}
                      {a.source && <span className="text-xs text-slate-500">via {a.source}</span>}
                    </div>
                    <h3 className="font-hero text-xl font-bold text-white sm:text-[1.35rem]">{a.title || 'Untitled'}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">{showDesc}</p>
                    {hasLongBody && (
                      <>
                        <div
                          className={`post-full-content mt-4 border-t border-slate-700/70 pt-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap ${
                            expanded[a.id] ? '' : 'hidden'
                          }`}
                        >
                          {a.content}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(a.id, e)}
                          className="read-more-btn mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-white"
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
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-teal-300"
                      >
                        View original <span className="material-symbols-outlined text-base">open_in_new</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-slate-900/55 to-slate-950/90 p-8 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,rgba(79,70,229,0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Stay in touch</p>
            <h3 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Want to discuss an idea?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              Questions, collaboration, or feedback — send a message and I&apos;ll reply when I can.
            </p>
          </div>
          <Link
            className="home-collab-cta relative z-[1] inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark lg:w-auto touch-manipulation"
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

export default Blog;
