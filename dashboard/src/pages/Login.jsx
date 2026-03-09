import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAgentStore from '../store/agentStore';

// ── Inject fonts ───────────────────────────────────────────
function useFont() {
  useEffect(() => {
    if (document.getElementById('auth-fonts')) return;
    const link = document.createElement('link');
    link.id = 'auth-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap';
    document.head.appendChild(link);
  }, []);
}

// Spinner keyframe injected once
function useSpinnerStyle() {
  useEffect(() => {
    if (document.getElementById('auth-spin')) return;
    const style = document.createElement('style');
    style.id = 'auth-spin';
    style.textContent = `
      @keyframes authSpin { to { transform: rotate(360deg); } }
      @keyframes authFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .auth-card { animation: authFadeUp 0.5s ease both; }
    `;
    document.head.appendChild(style);
  }, []);
}

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAgentStore((state) => state.setAuth);
  const setAgent = useAgentStore((state) => state.setAgent);
  useFont();
  useSpinnerStyle();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }

      await setAuth(data.token, data.installId, data.firebaseToken);
      const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profile = await profileRes.json();
      setAgent(profile);
      navigate(profile.onboardingComplete ? '/dashboard' : '/setup');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...s.input,
    borderColor: focused === name ? 'rgba(200,241,53,0.45)' : 'rgba(255,255,255,0.08)',
    boxShadow: focused === name ? '0 0 0 3px rgba(200,241,53,0.07)' : 'none',
  });

  return (
    <div style={s.root}>
      {/* Dot grid */}
      <div style={s.dotGrid} />
      {/* Glow orbs */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* Card */}
      <div style={s.card} className="auth-card">

        {/* Top gradient line */}
        <div style={s.topLine} />

        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoMark}>💬</div>
          <span style={s.logoText}>OpenChat</span>
        </div>

        <h1 style={s.title}>Welcome back</h1>
        <p style={s.subtitle}>Sign in to your dashboard</p>

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Fields */}
        <div style={s.field}>
          <label style={s.label}>Email address</label>
          <input
            style={inputStyle('email')}
            type="email" name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange} onKeyDown={handleKeyDown}
            onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
            autoComplete="email"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={inputStyle('password')}
            type="password" name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange} onKeyDown={handleKeyDown}
            onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
            autoComplete="current-password"
          />
        </div>

        {/* Submit */}
        <button
          style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 32px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(200,241,53,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading
            ? <span style={s.btnRow}><span style={s.spinner} /> Signing in...</span>
            : <span style={s.btnRow}>Sign in →</span>
          }
        </button>

        <p style={s.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={s.footerLink}>Create one</Link>
        </p>

      </div>

      <p style={s.credit}>© 2026 OpenChat · MIT License</p>
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#080810',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative', overflow: 'hidden',
    padding: '24px',
  },
  dotGrid: {
    position: 'fixed', inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    pointerEvents: 'none', zIndex: 0,
  },
  glow1: {
    position: 'fixed', top: '25%', left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', top: '72%', left: '65%',
    transform: 'translate(-50%,-50%)',
    width: '400px', height: '300px',
    background: 'radial-gradient(ellipse, rgba(200,241,53,0.05) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: '420px',
    backgroundColor: '#0F0F1A',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '44px 36px 36px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    boxSizing: 'border-box',
  },
  topLine: {
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: '55%', height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(200,241,53,0.7), transparent)',
    borderRadius: '1px',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '24px',
  },
  logoMark: {
    width: '36px', height: '36px',
    background: '#C8F135', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 0 20px rgba(200,241,53,0.38)',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px', fontWeight: '800', color: '#EDEAF5',
  },
  title: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '26px', fontWeight: '800',
    color: '#EDEAF5', margin: '0 0 6px 0',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    fontSize: '14px', color: '#6B6B80',
    margin: '0 0 28px 0', fontWeight: '400',
  },
  errorBox: {
    width: '100%', boxSizing: 'border-box',
    backgroundColor: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.22)',
    color: '#FCA5A5', padding: '10px 14px',
    borderRadius: '10px', fontSize: '13px',
    marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  field: { width: '100%', marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '12px',
    fontWeight: '600', color: '#6B6B80',
    marginBottom: '8px', letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '13px 14px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '15px',
    color: '#EDEAF5', outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btn: {
    width: '100%', padding: '13px',
    backgroundColor: '#C8F135', color: '#080810',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px', marginBottom: '24px',
    minHeight: '48px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 0 18px rgba(200,241,53,0.25)',
    transition: 'opacity 0.2s, box-shadow 0.2s, transform 0.2s',
  },
  btnRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
  },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(8,8,16,0.25)',
    borderTopColor: '#080810',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'authSpin 0.7s linear infinite',
  },
  footerText: { fontSize: '14px', color: '#55556A', margin: 0 },
  footerLink: {
    color: '#C8F135', fontWeight: '700', textDecoration: 'none',
  },
  credit: {
    position: 'relative', zIndex: 1,
    marginTop: '20px', fontSize: '12px', color: '#2A2A3A',
  },
};