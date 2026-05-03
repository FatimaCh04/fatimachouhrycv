import React, { useState } from 'react';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const DEFAULT_LINKS = [
  { id: '1', label: 'Email', url: 'mailto:fatimachoudhry94@gmail.com', icon: 'mail' },
  { id: '2', label: 'GitHub', url: 'https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-', icon: 'github' },
  { id: '3', label: 'LinkedIn', url: 'https://www.linkedin.com/in/fatima-choudhry-714423358/', icon: 'linkedin' },
];

const GitHubIcon = () => (
  <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

function ContactLinkIcon({ link }) {
  const icon = (link.icon || '').toLowerCase();
  const url = (link.url || '').toLowerCase();
  const isGitHub = icon === 'github' || url.includes('github.com');
  const isLinkedIn = icon === 'linkedin' || url.includes('linkedin.com');
  if (isGitHub) return <GitHubIcon />;
  if (isLinkedIn) return <LinkedInIcon />;
  return <span className="material-symbols-outlined text-xl">{link.icon || 'link'}</span>;
}

function Contact() {
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const { data: fetchedLinks = [] } = useSupabaseQuery('contact_links', {
    select: 'id, label, url, icon, sort_order',
    orderBy: 'sort_order',
    orderAsc: true,
    limit: 20,
    cacheKey: 'supabase_contact_links',
    cacheTTL: 5 * 60 * 1000,
  });
  const contactLinks = fetchedLinks.length > 0 ? fetchedLinks : DEFAULT_LINKS;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = (form.name && form.name.value) || '';
    const email = (form.email && form.email.value) || '';
    const message = (form.message && form.message.value) || '';

    setFormStatus({ type: '', message: '' });

    const base = typeof window !== 'undefined' ? window.location.origin : '';
    fetch(`${base}/api/send-contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
      .then((r) => {
        if (!r.ok && r.status === 404) {
          return {
            ok: false,
            error:
              "Contact form works on the live site. You're likely testing locally — deploy to Vercel and set Gmail env vars (see CONTACT_EMAIL_SETUP.md), or email fatimachoudhry94@gmail.com",
          };
        }
        return r.json();
      })
      .then((data) => {
        if (data.ok) {
          setFormStatus({
            type: 'success',
            message: 'Message sent! I will get back to you soon.',
          });
          form.reset();
        } else {
          setFormStatus({
            type: 'error',
            message: data.error || 'Something went wrong. Please try again or email fatimachoudhry94@gmail.com',
          });
        }
      })
      .catch(() => {
        const isLocal = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.origin);
        setFormStatus({
          type: 'error',
          message: isLocal
            ? 'Contact form runs only on the deployed site. Deploy to Vercel, add Gmail env vars (CONTACT_EMAIL_SETUP.md), or email fatimachoudhry94@gmail.com'
            : 'Network error. Please try again or email fatimachoudhry94@gmail.com',
        });
      });
  };

  const handleInput = () => {
    if (formStatus.message) {
      setFormStatus({ type: '', message: '' });
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="contact-page mx-auto max-w-6xl space-y-12 px-4 pb-14 text-left md:space-y-14 md:pb-20 sm:px-0">
      <header className="border-b border-slate-800/80 pb-10 md:pb-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Reach out</p>
          <h1 className="font-hero mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-white">
            Contact and <span className="text-accent">collaborate</span>
          </h1>
          <div className="featured-heading-rule mx-auto mt-5 flex max-w-md items-center justify-center gap-4" aria-hidden>
            <span className="featured-heading-rule-line" />
            <span className="featured-heading-rule-dot" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
            I&apos;m open to automation and custom software work. Use the form for project inquiries, or reach me directly via
            the links — I&apos;ll respond when I can.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-700/90 bg-slate-900/35 p-6 shadow-sm sm:p-8 md:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Message</p>
            <h2 className="font-hero mt-1 text-xl font-bold text-white sm:text-2xl">Send a note</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Include context, timeline, and the best way to reply — helps me respond with something useful.
            </p>
            {formStatus.message && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm font-medium ${
                  formStatus.type === 'success'
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100'
                    : 'border-red-500/50 bg-red-500/15 text-red-100'
                }`}
              >
                {formStatus.message}
              </div>
            )}
            <form id="contact-form" className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onFocus={handleInput}
                  onInput={handleInput}
                  className={inputClass}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onFocus={handleInput}
                  onInput={handleInput}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  onFocus={handleInput}
                  onInput={handleInput}
                  className={`${inputClass} resize-y min-h-[120px]`}
                  placeholder="Project goals, stack, budget range, or just hello…"
                  required
                />
              </div>
              <button
                type="submit"
                id="submit-btn"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark touch-manipulation"
              >
                <span className="material-symbols-outlined text-xl">send</span>
                Send message
              </button>
            </form>
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Direct</p>
            <h2 className="font-hero mt-1 text-xl font-bold text-white sm:text-2xl">Other ways to connect</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Prefer email or socials — same response window; form is best for longer briefs.
            </p>
            <ul className="mt-8 flex flex-1 flex-col gap-3 sm:gap-4">
              {contactLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="flex min-h-[56px] items-center gap-4 rounded-xl border border-slate-700/80 bg-slate-900/50 p-4 transition-[border-color,background-color,transform] duration-200 hover:border-primary/40 hover:bg-slate-800/50"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <ContactLinkIcon link={link} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{link.label}</p>
                      <p className="mt-1 break-all text-sm text-slate-400">
                        {link.url.startsWith('mailto:')
                          ? link.url.replace('mailto:', '')
                          : link.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </p>
                    </div>
                    <span className="material-symbols-outlined shrink-0 text-slate-500 text-xl">chevron_right</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-slate-900/55 to-slate-950/90 p-8 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,rgba(79,70,229,0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-[1] mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">Next step</p>
          <h3 className="font-hero mt-2 text-2xl font-bold text-white sm:text-3xl">Let&apos;s build something together</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Whether you have a full scope or a rough idea, we can narrow requirements and shape a realistic path forward.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Contact;
