/**
 * Vercel serverless: fetches Islamic, funny & informative daily news from RSS.
 * Deploy on Vercel so /api/fetch-news works (no CORS).
 */

const FEEDS = [
  { url: 'https://www.islamicity.org/feed/', type: 'Islamic', name: 'Islamicity' },
  { url: 'https://www.reddit.com/r/funny/.rss', type: 'Funny', name: 'Reddit r/funny' },
  { url: 'https://www.theonion.com/feeds/daily/', type: 'Funny', name: 'The Onion' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', type: 'Informative', name: 'BBC News' },
  { url: 'https://www.sciencedaily.com/rss/all.xml', type: 'Informative', name: 'Science Daily' },
  { url: 'https://feeds.feedburner.com/techcrunch/', type: 'Informative', name: 'TechCrunch' },
];

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

function getTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = xml.match(re);
  if (!m) return '';
  let text = m[1].trim();
  const cdata = text.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  if (cdata) text = cdata[1].trim();
  return stripHtml(text).slice(0, 300);
}

function getImageFromBlock(block) {
  const mediaContent = block.match(/<media:content[^>]+url="([^"]+)"[^>]*>/i);
  if (mediaContent && mediaContent[1]) return mediaContent[1];
  const mediaThumb = block.match(/<media:thumbnail[^>]+url="([^"]+)"[^>]*>/i);
  if (mediaThumb && mediaThumb[1]) return mediaThumb[1];
  const enclosure = block.match(/<enclosure[^>]+url="([^"]+)"[^>]*>/i);
  if (enclosure && /\.(jpe?g|png|gif|webp)/i.test(enclosure[1])) return enclosure[1];
  const img = block.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  if (img && img[1]) return img[1];
  const dcCreator = block.match(/<dc:creator[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i);
  if (dcCreator && dcCreator[1]) return dcCreator[1];
  return '';
}

function parseRss(xml, type, sourceName) {
  const items = [];
  const isAtom = /<entry>/i.test(xml);
  const itemRegex = isAtom ? /<entry>([\s\S]*?)<\/entry>/gi : /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
    const block = match[1];
    const title = getTag(block, 'title') || getTag(block, 'dc:title');
    let link = (block.match(/<link[^>]*>([^<]+)</i) || [])[1] || (block.match(/<link>([^<]+)</i) || [])[1] || '';
    if (!link && isAtom) link = (block.match(/<link[^>]+href="([^"]+)"/i) || [])[1] || '';
    const description = getTag(block, 'description') || getTag(block, 'content:encoded') || getTag(block, 'summary') || getTag(block, 'content') || '';
    const pubDate = (block.match(/<pubDate[^>]*>([^<]+)</i) || [])[1] || (block.match(/<dc:date[^>]*>([^<]+)</i) || [])[1] || (block.match(/<updated[^>]*>([^<]+)</i) || [])[1] || '';
    const image = getImageFromBlock(block);
    if (title) {
      items.push({
        id: `rss-${type}-${items.length}-${Math.random().toString(36).slice(2, 9)}`,
        title: title.slice(0, 200),
        content: description,
        link: link.trim(),
        source: sourceName,
        type,
        created_at: pubDate,
        image: image || `https://picsum.photos/800/400?random=${type}-${items.length}`,
      });
    }
  }
  return items;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const all = [];
  for (const feed of FEEDS) {
    try {
      const resp = await fetch(feed.url, {
        headers: { 'User-Agent': 'PortfolioBlog/1.0 (RSS Reader)' },
      });
      if (!resp.ok) continue;
      const xml = await resp.text();
      const items = parseRss(xml, feed.type, feed.name);
      all.push(...items);
    } catch (_) {
      /* skip failed feed */
    }
  }
  // sort by date desc, then take 20
  all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const list = all.slice(0, 24);

  res.status(200).json({ articles: list });
}
