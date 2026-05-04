/**
 * Dynamic sitemap.xml — base URL from request host (Vercel) or SITE_URL / VERCEL_URL.
 */

function getBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
  if (host) {
    const h = host.toString().split(',')[0].trim();
    return `${proto}://${h}`.replace(/\/$/, '');
  }
  if (process.env.SITE_URL) return String(process.env.SITE_URL).replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
  return 'http://localhost:5173';
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end();
  }

  const base = getBaseUrl(req);
  const paths = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.85' },
    { path: '/services', changefreq: 'monthly', priority: '0.85' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.9' },
    { path: '/blog', changefreq: 'weekly', priority: '0.8' },
    { path: '/resume', changefreq: 'monthly', priority: '0.9' },
    { path: '/contact', changefreq: 'monthly', priority: '0.85' },
  ];

  const urls = paths
    .map(({ path, changefreq, priority }) => {
      const loc = path === '/' ? base : `${base}${path}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode = 200;
  return res.end(xml);
}
