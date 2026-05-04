/**
 * robots.txt — disallow admin; point crawlers to /sitemap.xml
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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end();
  }

  const base = getBaseUrl(req);
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${base}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.statusCode = 200;
  return res.end(body);
}
