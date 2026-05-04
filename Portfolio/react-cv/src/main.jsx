import React from 'react'
import ReactDOM from 'react-dom/client'
import { primeProfileFetch } from './lib/profileLoad.js'
import { primePortfolioGridFetch } from './lib/portfolioCache.js'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'

/** Warm TLS + DNS to Supabase before first REST call */
try {
  const raw = import.meta.env?.VITE_SUPABASE_URL
  if (raw && typeof document !== 'undefined') {
    const origin = new URL(raw).origin
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
  }
} catch (_) {}

/** Parallel cold-load: profile + projects before React paints (same requests hooks await). */
primeProfileFetch()
primePortfolioGridFetch()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
