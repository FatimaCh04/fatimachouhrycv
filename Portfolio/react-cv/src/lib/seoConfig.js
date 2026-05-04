/** SEO defaults — aligned with portfolio résumé copy */

export const SITE_NAME = 'Fatima Choudhry';

export const DEFAULT_DESCRIPTION =
  'Fatima Choudhry — software engineer and full-stack developer in Vehari, Pakistan. React, Node.js, REST APIs, PostgreSQL, MongoDB, Supabase. Portfolio, résumé, and contact.';

const ROUTE_META = {
  '/': {
    title: 'Fatima Choudhry | Software Engineer & Full-Stack Developer — Pakistan',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: `About | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME} — background, focus areas, and professional journey as a software engineer and developer.`,
  },
  '/services': {
    title: `Services | ${SITE_NAME}`,
    description:
      'Web development, APIs, automation, and cross-platform software services by Fatima Choudhry — React, Node.js, databases, and documentation.',
  },
  '/portfolio': {
    title: `Portfolio | ${SITE_NAME}`,
    description:
      'Selected projects: React apps, web development, mobile-oriented UI, desktop tools, and integrations — full-stack developer portfolio.',
  },
  '/blog': {
    title: `Blog | ${SITE_NAME}`,
    description: 'Articles and notes on software development, tools, and building reliable web applications.',
  },
  '/resume': {
    title: `Résumé / CV | ${SITE_NAME}`,
    description:
      'Downloadable résumé — technical skills (React, Node.js, databases), experience, education, and certifications.',
  },
  '/contact': {
    title: `Contact | ${SITE_NAME}`,
    description:
      'Contact Fatima Choudhry for project inquiries, collaboration, or software engineering work — Vehari, Pakistan.',
  },
};

/** Normalize router paths (strip .html, trailing slash except root). */
export function normalizePathname(pathname) {
  if (!pathname) return '/';
  let p = pathname.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

export function getSiteUrl() {
  const fromEnv = import.meta.env?.VITE_SITE_URL;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return '';
}

/** Absolute og/twitter image; optional override via VITE_OG_IMAGE (full URL or site-relative path). */
export function getOgImageUrl() {
  const custom = import.meta.env?.VITE_OG_IMAGE;
  const base = getSiteUrl();
  if (custom && String(custom).trim()) {
    const c = String(custom).trim();
    if (c.startsWith('http://') || c.startsWith('https://')) return c;
    if (base) return `${base}${c.startsWith('/') ? c : `/${c}`}`;
    return c;
  }
  if (base) return `${base}/assets/images/profile-placeholder.svg`;
  return '';
}

export function getMetaForPath(pathname) {
  const n = normalizePathname(pathname);
  if (n.startsWith('/project/')) {
    return {
      title: `Project | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
  return ROUTE_META[n] || ROUTE_META['/'];
}

/** One-line meta / OG description (max length for search snippets). */
export function truncateMetaDescription(text, max = 160) {
  if (!text) return '';
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function buildPersonJsonLd(siteUrl) {
  if (!siteUrl) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: siteUrl,
    jobTitle: 'Software Engineer',
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vehari',
      addressCountry: 'PK',
    },
    sameAs: [
      'https://www.linkedin.com/in/fatima-choudhry/',
      'https://github.com/FatimaCh04',
    ],
    knowsAbout: [
      'Software Engineering',
      'Full-stack Development',
      'React',
      'Node.js',
      'JavaScript',
      'REST APIs',
      'PostgreSQL',
      'MongoDB',
    ],
  };
}
