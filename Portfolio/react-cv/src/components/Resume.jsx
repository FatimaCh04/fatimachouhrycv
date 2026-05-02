import React, { useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { usePublicProfile } from '../lib/usePublicProfile';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const PDF_FILENAME = 'Fatima_Choudhry_Resume.pdf';

function downloadPdfBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Inlined 1×1 PNG — no fetch/SVG; avoids html2canvas issues with remote or SVG <img> fallbacks */
const PDF_IMG_FALLBACK_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** Split a tall canvas across A4 pages (mm) and return a PDF Blob */
function canvasToPagedPdfBlob(canvas, marginMm = 8) {
  const cw = canvas.width;
  const ch = canvas.height;
  if (!cw || !ch) throw new Error('Empty canvas');

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pdfWidth - marginMm * 2;
  const usableHeight = pdfHeight - marginMm * 2;

  const totalHeightMm = (ch * usableWidth) / cw;
  let yMm = 0;

  while (yMm < totalHeightMm - 0.01) {
    const pageSliceMm = Math.min(usableHeight, totalHeightMm - yMm);
    const srcY = (yMm / totalHeightMm) * ch;
    const srcH = (pageSliceMm / totalHeightMm) * ch;

    const slicePx = Math.max(1, Math.ceil(srcH));
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = cw;
    pageCanvas.height = slicePx;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unsupported');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, srcY, cw, srcH, 0, 0, cw, srcH);

    const dataUrl = pageCanvas.toDataURL('image/jpeg', 0.92);
    pdf.addImage(dataUrl, 'JPEG', marginMm, marginMm, usableWidth, pageSliceMm, undefined, 'MEDIUM');

    yMm += pageSliceMm;
    if (yMm < totalHeightMm - 0.01) pdf.addPage();
  }

  return pdf.output('blob');
}

/** Tailwind `max-w-4xl` — card width for PDF capture */
const RESUME_CARD_CSS_PX = 896;

const LAYOUT_LOCK_KEYS = [
  'width',
  'maxWidth',
  'minWidth',
  'marginLeft',
  'marginRight',
  'overflow',
  'overflowX',
  'boxSizing',
  'transform',
];

/** Lock live DOM so breakpoint styles + measured size match the on-screen résumé card (clone-based tools see same layout). */
function lockResumeLayoutForPdf(el) {
  const prev = {};
  LAYOUT_LOCK_KEYS.forEach((k) => {
    prev[k] = el.style[k];
  });
  el.style.boxSizing = 'border-box';
  el.style.width = `${RESUME_CARD_CSS_PX}px`;
  el.style.maxWidth = `${RESUME_CARD_CSS_PX}px`;
  el.style.minWidth = `${RESUME_CARD_CSS_PX}px`;
  el.style.marginLeft = 'auto';
  el.style.marginRight = 'auto';
  el.style.overflow = 'visible';
  el.style.overflowX = 'visible';
  el.style.transform = 'none';

  return () => {
    LAYOUT_LOCK_KEYS.forEach((k) => {
      el.style[k] = prev[k] ?? '';
    });
  };
}

/**
 * Size hint for scale limits — prefer real layout sizes so capture never sees width≈0 (narrow PDF strip).
 */
function getResumeCaptureBox(el) {
  const rect = el.getBoundingClientRect();
  const width = Math.max(
    1,
    Math.round(rect.width),
    el.offsetWidth,
    el.clientWidth,
    el.scrollWidth,
    RESUME_CARD_CSS_PX
  );
  const height = Math.max(1, Math.ceil(el.scrollHeight), el.offsetHeight);
  return { width, height };
}

/** Sharp like the screen but stay under browser canvas limits on very long résumés. */
function computePdfPixelRatio(el, maxCssPxOnLongSide = 8000) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const desired = Math.min(2, Math.max(1.25, dpr));
  const { width: w, height: h } = getResumeCaptureBox(el);
  const longSide = Math.max(w, h);
  return Math.max(0.5, Math.min(desired, maxCssPxOnLongSide / longSide));
}

/** Primary: html-to-image uses SVG foreignObject in this document — Tailwind CDN styles apply reliably (unlike html2canvas iframe). */
async function captureResumeWithHtmlToImage(el, pixelRatio) {
  const height = Math.max(1, Math.ceil(el.scrollHeight));
  return toCanvas(el, {
    width: RESUME_CARD_CSS_PX,
    height,
    backgroundColor: '#0f172a',
    pixelRatio,
    cacheBust: true,
    style: {
      width: `${RESUME_CARD_CSS_PX}px`,
      maxWidth: `${RESUME_CARD_CSS_PX}px`,
      marginLeft: 'auto',
      marginRight: 'auto',
      transform: 'none',
    },
  });
}

/** Fallback if html-to-image fails — layout must already be locked on `el`. */
async function captureResumeToCanvasHtml2(el, scale, foreignObjectRendering) {
  const rect = el.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.ceil(el.scrollHeight));

  return html2canvas(el, {
    scale,
    width: w,
    height: h,
    useCORS: true,
    allowTaint: false,
    logging: Boolean(import.meta.env?.DEV),
    backgroundColor: '#0f172a',
    foreignObjectRendering,
    removeContainer: true,
    imageTimeout: 20000,
    windowWidth: Math.max(typeof window !== 'undefined' ? window.innerWidth : 1280, 1280),
    windowHeight: Math.max(h + 200, typeof window !== 'undefined' ? window.innerHeight : 900, 900),
  });
}

function isCanvasUsable(canvas) {
  return !!(canvas && canvas.width >= 32 && canvas.height >= 32);
}

/**
 * html2canvas requires a non-tainted canvas. Remote images (Supabase, picsum, GitHub, etc.)
 * often omit CORS — fetch+blob → data URL fixes export; on failure use a local placeholder.
 */
async function prepareImagesForPdfCapture(rootEl) {
  const images = Array.from(rootEl.querySelectorAll('img'));
  const snapshot = images.map((img) => ({
    img,
    /** Preserve exact attribute for restore (React may use absolute URLs in .src) */
    originalAttr: img.getAttribute('src'),
    originalResolved: img.src,
  }));

  const waitDecode = (img) =>
    new Promise((resolve) => {
      const done = () => resolve();
      if (img.complete && img.naturalWidth > 0) {
        done();
        return;
      }
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      setTimeout(done, 10000);
    });

  for (const { img, originalAttr, originalResolved } of snapshot) {
    const src = (originalAttr || originalResolved || '').trim();
    if (!src || src.startsWith('data:')) continue;

    let absolute;
    try {
      absolute = new URL(src, window.location.href).href;
    } catch {
      continue;
    }

    try {
      const res = await fetch(absolute, { mode: 'cors', credentials: 'omit', cache: 'force-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error('Empty image');
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error('readAsDataURL failed'));
        r.readAsDataURL(blob);
      });
      img.src = dataUrl;
      await waitDecode(img);
    } catch {
      img.src = PDF_IMG_FALLBACK_DATA;
      await waitDecode(img);
    }
  }

  return () => {
    snapshot.forEach(({ img, originalAttr, originalResolved }) => {
      if (originalAttr != null && originalAttr !== '') {
        img.setAttribute('src', originalAttr);
      } else {
        img.src = originalResolved;
      }
    });
  };
}

const RESUME_PROJECTS_SELECT = '*';

/** Print border: matches Tailwind `primary` from index.html */
const PRIMARY_HEX = '#4F46E5';

const EDUCATION = {
  degree: 'B.S. Software Engineering',
  period: '2021 — Present',
  school: 'COMSATS University Islamabad',
  detail:
    'Coursework in algorithms, databases, web engineering, and software architecture — focus on reliable delivery and maintainable code.',
};

const EXPERIENCE = {
  title: 'Software engineering · projects and automation',
  context: 'ACADEMIC · PORTFOLIO · PERSONAL PROJECTS',
  period: '2021 — Present',
  bullets: [
    'Shipped full-stack apps with React, Node.js, and Supabase — APIs, auth-aware flows, and responsive UI.',
    'Built dashboards and workflow-style tools with clear hierarchy, fewer clicks to outcomes, and sensible defaults.',
    'Documented scope and handover notes so features stay understandable as projects grow.',
  ],
};

/** Shown on résumé (screen + PDF) — full professional summary, not only profile tagline */
const PROFESSIONAL_SUMMARY_PARAGRAPHS = [
  'Full-stack software engineer with practical experience shipping web applications, workflow automation, and API-backed features using React, Node.js, and cloud-ready stacks such as Supabase. I care about calm UX, sensible defaults, and code that teammates can read and extend.',
  'Comfortable owning work end to end—scoping, implementation, and light documentation—whether in academic labs, portfolio builds, or deadline-driven delivery. I aim for reliable integrations, clear boundaries between layers, and outcomes that stay maintainable after handover.',
];

/** Two rows: Frontend + Backend on one line; Database + Delivery on the next */
const SKILL_ROWS = [
  [
    {
      label: 'Frontend',
      items: ['React.js', 'JavaScript (ES6+)', 'HTML5 and CSS3', 'Responsive UI'],
    },
    {
      label: 'Backend',
      items: ['Node.js', 'REST APIs', 'Express.js', 'Integrations'],
    },
  ],
  [
    {
      label: 'Databases',
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Supabase'],
    },
    {
      label: 'Delivery',
      items: ['Git', 'Tailwind CSS', 'Web apps', 'Mobile-oriented UI', 'Documentation', 'CI basics'],
    },
  ],
];

function ResumeSection({ title, children, id }) {
  return (
    <section className="resume-section mb-10 md:mb-12" id={id}>
      <div className="mb-5 flex min-w-0 items-center gap-3">
        <h2 className="resume-section-title font-hero shrink-0 text-lg font-bold tracking-tight text-accent md:text-xl">
          {title}
        </h2>
        <div className="resume-section-rule h-px min-h-[1px] min-w-[2rem] flex-1 rounded-full bg-gradient-to-r from-accent/90 via-accent/45 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function Resume() {
  const { profile } = usePublicProfile();
  const { data: projects = [] } = useSupabaseQuery('projects', {
    select: RESUME_PROJECTS_SELECT,
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
    cacheKey: 'portfolio_projects_v2',
    cacheTTL: 5 * 60 * 1000,
  });

  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const nameParts = useMemo(() => {
    const p = (profile.name || '').trim().split(/\s+/).filter(Boolean);
    return { first: p[0] || 'Name', rest: p.slice(1).join(' ') };
  }, [profile.name]);

  const contactItems = useMemo(
    () => [
      { icon: 'mail', label: 'Email', value: 'fatimachoudhry94@gmail.com', href: 'mailto:fatimachoudhry94@gmail.com' },
      { icon: 'call', label: 'Phone', value: '0304313364', href: 'tel:+923043133664' },
      { icon: 'location_on', label: 'Location', value: 'Vehari, Pakistan' },
      {
        icon: 'code',
        label: 'GitHub',
        value: 'github.com/FatimaCh04',
        href: 'https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-',
      },
      {
        icon: 'work',
        label: 'LinkedIn',
        value: 'linkedin.com/in/fatima-choudhry-714423358',
        href: 'https://www.linkedin.com/in/fatima-choudhry-714423358/',
      },
      { icon: 'translate', label: 'Languages', value: 'English, Urdu, Punjabi' },
    ],
    []
  );

  const handleDownloadPdf = async () => {
    const el = document.getElementById('resume-content');
    if (!el) return;
    setDownloading(true);
    setPdfError(null);

    let restorePdfImages = () => {};
    let unlockPdfLayout = () => {};

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      el.scrollIntoView({ block: 'start', behavior: 'auto' });

      const imgs = el.querySelectorAll('img');
      imgs.forEach((img) => {
        img.setAttribute('loading', 'eager');
      });

      await Promise.all(
        Array.from(imgs).map(
          (img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.addEventListener('load', resolve, { once: true });
                  img.addEventListener('error', resolve, { once: true });
                  setTimeout(resolve, 8000);
                })
        )
      );

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      unlockPdfLayout = lockResumeLayoutForPdf(el);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      restorePdfImages = await prepareImagesForPdfCapture(el);
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => {});
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const pixelRatio = computePdfPixelRatio(el);
      let canvas;
      let lastCaptureErr;

      try {
        canvas = await captureResumeWithHtmlToImage(el, pixelRatio);
        if (!isCanvasUsable(canvas)) {
          throw new Error('html-to-image canvas dimensions suspicious');
        }
      } catch (e) {
        lastCaptureErr = e;
        console.warn('Resume PDF: html-to-image failed, trying html2canvas', e);
        canvas = null;
      }

      if (!canvas || !isCanvasUsable(canvas)) {
        for (const foreignObjectRendering of [true, false]) {
          try {
            const c = await captureResumeToCanvasHtml2(el, pixelRatio, foreignObjectRendering);
            if (isCanvasUsable(c)) {
              canvas = c;
              break;
            }
          } catch (e) {
            lastCaptureErr = e;
            console.warn('Resume PDF: html2canvas attempt failed', { foreignObjectRendering }, e);
          }
        }
      }

      if (!canvas || !isCanvasUsable(canvas)) {
        try {
          const low = Math.max(0.45, pixelRatio * 0.55);
          canvas = await captureResumeToCanvasHtml2(el, low, false);
        } catch (e) {
          lastCaptureErr = e;
          console.warn('Resume PDF: low-scale html2canvas failed', e);
        }
      }

      if (!canvas || !isCanvasUsable(canvas)) {
        throw lastCaptureErr || new Error('Could not rasterize résumé for PDF');
      }

      let blob;
      try {
        blob = canvasToPagedPdfBlob(canvas);
      } catch (e) {
        if (e?.name === 'SecurityError' || String(e?.message || '').includes('Tainted')) {
          throw new Error('Blocked exporting canvas (cross-origin content).');
        }
        throw e;
      }

      if (blob && blob.size > 0) {
        downloadPdfBlob(blob, PDF_FILENAME);
      } else {
        throw new Error('Empty PDF');
      }
    } catch (err) {
      console.error('Resume PDF:', err);
      const detail = err?.message ? String(err.message).slice(0, 140) : '';
      setPdfError(
        detail
          ? `PDF export failed: ${detail} — try Print → Save as PDF, or refresh and retry.`
          : 'PDF download failed. Use your browser’s Print → Save as PDF instead.'
      );
    } finally {
      restorePdfImages();
      unlockPdfLayout();
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        .resume-pro .resume-name-display {
          font-family: "Playfair Display", Georgia, serif;
        }
        .resume-project-img {
          width: 100%;
          height: 140px;
          min-height: 140px;
          object-fit: cover;
          object-position: center;
          border-radius: 0.375rem;
          background: #1e293b;
        }
        .resume-date-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.8125rem;
          letter-spacing: 0.02em;
        }
        @media print {
          @page { size: A4; margin: 12mm; }
          body, body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { zoom: 1 !important; background: #0f172a !important; }
          .no-print { display: none !important; }
          main {
            margin-left: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
            background: #0f172a !important;
          }
          #site-navbar { display: none !important; }
          #site-navbar-dropdown { display: none !important; }
          #resume-wrapper {
            max-width: 56rem !important;
            margin-left: auto !important;
            margin-right: auto !important;
            width: 100% !important;
            padding: 0 !important;
          }
          #resume-content {
            box-shadow: none !important;
            border: 1px solid rgba(79, 70, 229, 0.35) !important;
            border-radius: 0.75rem !important;
            background: rgba(15, 23, 42, 0.98) !important;
            overflow: visible !important;
          }
          #resume-content img {
            max-width: 100%;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-content img:not(.resume-photo-img) {
            height: auto;
          }
          #resume-content .resume-photo-img {
            width: 8rem !important;
            height: 10rem !important;
            min-width: 8rem !important;
            min-height: 10rem !important;
            object-fit: cover !important;
            border-radius: 0.75rem !important;
          }
          #resume-content .resume-photo-frame {
            width: fit-content !important;
            height: auto !important;
            min-width: 8rem !important;
            min-height: 10rem !important;
            border-radius: 0.75rem !important;
            overflow: hidden !important;
            border: 2px solid ${PRIMARY_HEX} !important;
            padding: 3px !important;
            flex-shrink: 0 !important;
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.28) !important;
          }
          #resume-content .resume-project-img {
            width: 100% !important;
            height: 140px !important;
            min-height: 140px !important;
            object-fit: cover !important;
          }
          #resume-content [class*="border"],
          #resume-content [class*="text-"],
          #resume-content [class*="bg-"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-4xl text-left" id="resume-wrapper">
        <div className="no-print mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Document</p>
              <h2 className="font-hero mt-1 flex items-center gap-2 text-2xl font-bold text-white">
                <span className="material-symbols-outlined text-primary">description</span>
                Résumé
              </h2>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              id="resume-print-btn"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/15 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-primary/25 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {downloading ? 'Saving PDF…' : 'Download PDF'}
            </button>
          </div>
          {pdfError ? (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {pdfError}
            </p>
          ) : null}
        </div>

        <div
          id="resume-content"
          className="resume-pro print-resume mx-auto w-full max-w-4xl overflow-x-hidden overflow-y-visible rounded-xl border border-primary/25 bg-gradient-to-b from-slate-900/95 to-background-dark shadow-[0_24px_60px_-30px_rgba(0,0,0,0.65)]"
        >
          <header className="border-b border-primary/20 px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="resume-photo-frame mx-auto shrink-0 rounded-xl border-2 border-primary/60 bg-slate-900/80 p-1 shadow-glow sm:mx-0">
                <img
                  alt=""
                  className="resume-photo-img h-40 w-32 rounded-[10px] object-cover object-center md:h-48 md:w-36"
                  loading="eager"
                  decoding="async"
                  src={profile.photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/profile-placeholder.svg';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h1 className="resume-name-display text-3xl font-bold leading-tight tracking-tight text-white md:text-[2.125rem]">
                  <span>{nameParts.first}</span>
                  {nameParts.rest ? <span className="text-accent"> {nameParts.rest}</span> : null}
                </h1>
                <p className="resume-title mt-2 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-accent/85 md:text-xs">
                  {(profile.title || 'Software Engineer').toUpperCase()}
                </p>

                <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-3 text-left sm:mx-0 sm:grid-cols-2 lg:grid-cols-3">
                  {contactItems.map((c) => (
                    <div key={c.label} className="flex min-w-0 items-start gap-2.5">
                      <span className="material-symbols-outlined mt-0.5 shrink-0 text-lg text-accent">
                        {c.icon}
                      </span>
                      <div className="min-w-0 text-sm leading-snug">
                        <span className="sr-only">{c.label}</span>
                        {c.href ? (
                          <a
                            href={c.href}
                            target={c.href.startsWith('mailto:') || c.href.startsWith('tel:') ? undefined : '_blank'}
                            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="break-all text-slate-400 transition-colors hover:text-accent"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <span className="text-slate-400">{c.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="mt-8 h-px w-full rounded-full bg-gradient-to-r from-accent via-accent/55 to-transparent"
              aria-hidden
            />
          </header>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <ResumeSection title="Professional summary" id="resume-summary">
              <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-slate-300 md:text-base">
                {PROFESSIONAL_SUMMARY_PARAGRAPHS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Education" id="resume-education">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="resume-name-display text-lg font-bold text-white md:text-xl">{EDUCATION.degree}</h3>
                <span className="resume-date-mono shrink-0 text-accent">{EDUCATION.period}</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{EDUCATION.school}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500 md:text-[15px]">{EDUCATION.detail}</p>
            </ResumeSection>

            <ResumeSection title="Experience" id="resume-experience">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="resume-name-display max-w-xl text-lg font-bold leading-snug text-white md:text-xl">
                  {EXPERIENCE.title}
                </h3>
                <span className="resume-date-mono shrink-0 text-accent">{EXPERIENCE.period}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">{EXPERIENCE.context}</p>
              <ul className="marker:text-primary mt-4 max-w-3xl list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-slate-400 md:text-[15px]">
                {EXPERIENCE.bullets.map((b) => (
                  <li key={b} className="pl-1">
                    {b}
                  </li>
                ))}
              </ul>
            </ResumeSection>

            <ResumeSection title="Technical skills" id="resume-skills">
              <div className="space-y-6">
                {SKILL_ROWS.map((pair, rowIdx) => (
                  <div
                    key={`skill-row-${rowIdx}`}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4"
                  >
                    {pair.map((g) => (
                      <div key={g.label} className="min-w-0">
                        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                          {g.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {g.items.map((s) => (
                            <span
                              key={`${g.label}-${s}`}
                              className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Projects portfolio" id="resume-portfolio">
              <div id="resume-portfolio-list" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {projects.length === 0 ? (
                  <p className="col-span-full text-slate-500">No projects yet.</p>
                ) : (
                  projects.map((p, i) => {
                    const imgSrc = (p.image && p.image.trim()) || (p.image_url && p.image_url.trim()) || '';
                    const placeholderImg = `https://picsum.photos/800/400?random=resume-${(p.id || i).toString().replace(/[^a-z0-9]/gi, '').slice(-8) || i}`;
                    const displaySrc = imgSrc || placeholderImg;
                    return (
                      <div
                        key={p.id || i}
                        className="resume-project-card flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-slate-900/60"
                      >
                        <div className="relative shrink-0 overflow-hidden" style={{ minHeight: '140px' }}>
                          <img
                            src={displaySrc}
                            alt=""
                            className="resume-project-img w-full"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              e.target.onerror = null;
                              if (e.target.src !== placeholderImg) {
                                e.target.src = placeholderImg;
                              }
                            }}
                          />
                          {p.category && (
                            <p className="absolute bottom-0 left-0 right-0 bg-slate-950/90 px-2 py-1 text-center text-[10px] font-bold tracking-wider text-primary">
                              {(p.category || '').replace(/-/g, ' ').toUpperCase()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="resume-name-display font-semibold leading-snug text-white">{p.title}</p>
                          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-500">{p.description}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ResumeSection>
          </div>

          <footer className="border-t border-primary/15 px-6 py-5 text-center text-xs text-slate-600 md:text-sm">
            © <span id="resume-year">{new Date().getFullYear()}</span>{' '}
            <span className="resume-name text-slate-400">Fatima Choudhry</span> — résumé snapshot · portfolio projects sync
            from database
          </footer>
        </div>
      </div>
    </>
  );
}

export default Resume;
