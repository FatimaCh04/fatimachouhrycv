import React from 'react';

/**
 * Surfaces React render errors on-screen (live debugging when console isn’t open).
 */
export class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Root error:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#0f172a',
            color: '#fecaca',
          }}
        >
          <h1 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            The app hit a JavaScript error. Copy the text below or open DevTools → Console, then redeploy or fix env (e.g.
            VITE_SUPABASE_* on Vercel).
          </p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '0.85rem',
              padding: '1rem',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #475569',
            }}
          >
            {msg}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
