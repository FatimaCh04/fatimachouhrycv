import React, { useState } from 'react';

function Contact() {
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

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
          return { ok: false, error: "Contact form works on the live site. You're likely testing locally — deploy to Vercel and set Gmail env vars (see CONTACT_EMAIL_SETUP.md), or email fatimachoudhry94@gmail.com" };
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
            ? "Contact form runs only on the deployed site. Deploy to Vercel, add Gmail env vars (CONTACT_EMAIL_SETUP.md), or email fatimachoudhry94@gmail.com"
            : 'Network error. Please try again or email fatimachoudhry94@gmail.com',
        });
      });
  };

  const handleInput = () => {
    if (formStatus.message) {
      setFormStatus({ type: '', message: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      <section className="rounded-xl bg-slate-800/50 border border-slate-700 p-10 shadow-sm">
        <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">alternate_email</span>
          Contact
        </h2>
        <p className="text-lg text-slate-400 mb-8">I'm open to automation and custom software opportunities. Get in touch for collaboration or just to say hi.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Send a message</h3>
            {formStatus.message && (
              <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${formStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                {formStatus.message}
              </div>
            )}
            <form id="contact-form" className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input type="text" id="name" name="name" onFocus={handleInput} onInput={handleInput} className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Your name" required/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" id="email" name="email" onFocus={handleInput} onInput={handleInput} className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="you@example.com" required/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea id="message" name="message" rows="4" onFocus={handleInput} onInput={handleInput} className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" id="submit-btn" className="w-full bg-primary text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-teal-400 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span>
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Other ways to reach me</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="material-symbols-outlined text-primary">mail</span>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:fatimachoudhry94@gmail.com" className="text-primary hover:underline">fatimachoudhry94@gmail.com</a>
                </div>
              </li>
              <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="flex items-center justify-center size-10 rounded-lg bg-slate-700 text-primary shrink-0">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </span>
                <div>
                  <p className="font-medium text-white">GitHub</p>
                  <a href="https://github.com/FatimaCh04/FA23-BSE-123-5B-Fatima-Ch-" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>
                </div>
              </li>
              <li className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="flex items-center justify-center size-10 rounded-lg bg-slate-700 text-primary shrink-0">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </span>
                <div>
                  <p className="font-medium text-white">LinkedIn</p>
                  <a href="https://www.linkedin.com/in/fatima-choudhry-714423358/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-primary/20 border border-primary rounded-xl p-8 text-white shadow-glow text-center">
        <h4 className="text-2xl font-bold mb-2">Let's build something together</h4>
        <p className="text-slate-300 max-w-xl mx-auto">Whether you have a project in mind or just want to connect, I'd love to hear from you.</p>
      </section>
    </div>
  );
}

export default Contact;
