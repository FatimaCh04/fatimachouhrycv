'use client';

import { useActionState, useEffect } from 'react';
import { submitContactMessage, type ContactFormState } from './actions';

const initialState: ContactFormState = {
  success: false,
  message: '',
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      if (form) form.reset();
    }
  }, [state.success, state.message]);

  const hasMessage = state.message.length > 0;
  const isSuccess = state.success;
  const isError = !state.success && state.message.length > 0;

  const messageStyles = isSuccess
    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50'
    : isError
      ? 'bg-red-500/20 text-red-200 border-red-500/50'
      : '';

  return (
    <>
      {hasMessage && (
        <div className={`mb-4 p-4 rounded-lg text-sm font-medium border ${messageStyles}`}>
          {state.message}
        </div>
      )}
      <form
        id="contact-form"
        action={formAction}
        className="space-y-4"
      >
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your name"
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-1">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            minLength={10}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            placeholder="Your message..."
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">
            {isPending ? 'hourglass_empty' : 'send'}
          </span>
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
