import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  getMetaForPath,
  getOgImageUrl,
  getSiteUrl,
  buildPersonJsonLd,
  normalizePathname,
} from '../lib/seoConfig';

/**
 * Per-route title, description, canonical, Open Graph, Twitter, and Person JSON-LD.
 * Set VITE_SITE_URL in production so canonical and social URLs are absolute.
 */
function Seo() {
  const { pathname } = useLocation();
  const pathOnly = normalizePathname(pathname);
  const isProjectPage = pathOnly.startsWith('/project/');

  const { title, description } = getMetaForPath(pathname);
  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}${pathOnly === '/' ? '' : pathOnly}` : '';
  const ogImage = getOgImageUrl();
  const verification = import.meta.env?.VITE_GOOGLE_SITE_VERIFICATION;

  const personLd = useMemo(() => {
    const data = buildPersonJsonLd(siteUrl);
    return data ? JSON.stringify(data) : null;
  }, [siteUrl]);

  // Project detail sets its own title, description, canonical, og — avoid duplicates.
  if (isProjectPage) {
    return (
      <Helmet prioritizeSeoTags htmlAttributes={{ lang: 'en', class: 'dark' }}>
        <meta name="robots" content="index, follow" />
        {personLd ? <script type="application/ld+json">{personLd}</script> : null}
      </Helmet>
    );
  }

  return (
    <Helmet prioritizeSeoTags htmlAttributes={{ lang: 'en', class: 'dark' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="Fatima Choudhry, software engineer, full stack developer, React developer, Node.js, Pakistan, Vehari, portfolio, web developer, JavaScript, REST API, PostgreSQL, Supabase"
      />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow" />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImage ? <meta property="og:image:alt" content={`${SITE_NAME} — portfolio`} /> : null}
      <meta property="og:locale" content="en_PK" />

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {verification ? <meta name="google-site-verification" content={String(verification)} /> : null}

      {personLd ? (
        <script type="application/ld+json">{personLd}</script>
      ) : null}
    </Helmet>
  );
}

export default Seo;
