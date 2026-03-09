import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAgentStore from '../store/agentStore';

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

function useAuthStyles() {
  useEffect(() => {
    if (document.getElementById('auth-spin')) return;
    const style = document.createElement('style');
    style.id = 'auth-spin';
    style.textContent = `
      @keyframes authSpin { to { transform: rotate(360deg); } }
      @keyframes authFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .auth-card { animation: authFadeUp 0.5s ease both; }
      .auth-input::placeholder { color: #3A3A52; }
    `;
    document.head.appendChild(style);
  }, []);
}

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAgentStore((state) => state.setAuth);
  useFont();
  useAuthStyles();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    company: '', website: '', type: 'personal',
  });
  const [isBusiness, setIsBusiness] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBusinessToggle = () => {
    setIsBusiness(!isBusiness);
    setForm({ ...form, type: !isBusiness ? 'business' : 'personal', company: '', website: '' });
  };

  const handleRegister = async () => {
    setError(''); setSuccess(''); setLoading(true);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); setLoading(false); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters'); setLoading(false); return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      setAuth(data.token, data.installId);
      setSuccess('Account created! Taking you to setup...');
      setTimeout(() => navigate('/setup'), 1800);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const inputStyle = (name, extra = {}) => ({
    ...s.input,
    borderColor: focused === name
      ? 'rgba(200,241,53,0.45)'
      : extra.borderColor || 'rgba(255,255,255,0.08)',
    boxShadow: focused === name ? '0 0 0 3px rgba(200,241,53,0.07)' : 'none',
    ...extra,
  });

  return (
    <div style={s.root}>
      <div style={s.dotGrid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.card} className="auth-card">
        <div style={s.topLine} />

        <div style={s.logoRow}>
          <div style={s.logoMark}>💬</div>
          <span style={s.logoText}>OpenChat</span>
        </div>

        <h1 style={s.title}>Create your account</h1>
        <p style={s.subtitle}>Set up your agent dashboard in minutes</p>

        {error && <div style={s.errorBox}><span>⚠️</span> {error}</div>}
        {success && <div style={s.successBox}><span>✅</span> {success}</div>}

        <div style={s.field}>
          <label style={s.label}>Full Name</label>
          <input className="auth-input" style={inputStyle('name')}
            type="text" name="name" placeholder="Dipesh Das"
            value={form.name} onChange={handleChange}
            onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
            autoComplete="name" />
        </div>

        <div style={s.field}>
          <label style={s.label}>Email address</label>
          <input className="auth-input" style={inputStyle('email')}
            type="email" name="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange}
            onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
            autoComplete="email" />
        </div>

        <div style={s.field}>
          <label style={s.label}>Password</label>
          <div style={s.passwordWrap}>
            <input className="auth-input"
              style={{ ...inputStyle('password'), paddingRight: '48px' }}
              type={showPassword ? 'text' : 'password'}
              name="password" placeholder="Min. 8 characters"
              value={form.password} onChange={handleChange}
              onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
              autoComplete="new-password" />
            <button style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)} type="button">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Confirm Password</label>
          <input className="auth-input"
            style={inputStyle('confirmPassword', {
              borderColor: passwordsMatch
                ? 'rgba(16,185,129,0.5)'
                : passwordsMismatch ? 'rgba(239,68,68,0.5)' : undefined,
            })}
            type="password" name="confirmPassword" placeholder="••••••••"
            value={form.confirmPassword} onChange={handleChange}
            onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')}
            autoComplete="new-password" />
          {form.confirmPassword && (
            <p style={{ fontSize: '12px', marginTop: '6px', color: passwordsMatch ? '#10B981' : '#F87171' }}>
              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <div
          style={{
            ...s.toggleRow,
            backgroundColor: isBusiness ? 'rgba(200,241,53,0.06)' : 'rgba(255,255,255,0.03)',
            borderColor: isBusiness ? 'rgba(200,241,53,0.3)' : 'rgba(255,255,255,0.08)',
          }}
          onClick={handleBusinessToggle}
        >
          <div style={{
            ...s.checkbox,
            backgroundColor: isBusiness ? '#C8F135' : 'transparent',
            borderColor: isBusiness ? '#C8F135' : 'rgba(255,255,255,0.2)',
          }}>
            {isBusiness && <span style={s.checkmark}>✓</span>}
          </div>
          <div>
            <p style={s.toggleLabel}>Setting this up for a business</p>
            <p style={s.toggleSub}>Unlocks company profile, lead gen and team features</p>
          </div>
        </div>

        {isBusiness && (
          <div style={s.bizRow}>
            <div style={{ ...s.field, flex: 1, minWidth: '140px' }}>
              <label style={s.label}>Company Name</label>
              <input className="auth-input" style={inputStyle('company')}
                type="text" name="company" placeholder="Acme Inc."
                value={form.company} onChange={handleChange}
                onFocus={() => setFocused('company')} onBlur={() => setFocused('')} />
            </div>
            <div style={{ ...s.field, flex: 1, minWidth: '140px' }}>
              <label style={s.label}>Website</label>
              <input className="auth-input" style={inputStyle('website')}
                type="text" name="website" placeholder="https://acme.com"
                value={form.website} onChange={handleChange}
                onFocus={() => setFocused('website')} onBlur={() => setFocused('')} />
            </div>
          </div>
        )}

        <button
          style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
          onClick={handleRegister} disabled={loading}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 32px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(200,241,53,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading
            ? <span style={s.btnRow}><span style={s.spinner} /> Creating account...</span>
            : <span style={s.btnRow}>Create Account →</span>
          }
        </button>

        <p style={s.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={s.footerLink}>Sign in</Link>
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
    position: 'fixed', top: '20%', left: '55%',
    transform: 'translate(-50%,-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', top: '75%', left: '35%',
    transform: 'translate(-50%,-50%)',
    width: '400px', height: '300px',
    background: 'radial-gradient(ellipse, rgba(200,241,53,0.05) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: '460px',
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
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
  },
  logoMark: {
    width: '36px', height: '36px', background: '#C8F135', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', boxShadow: '0 0 20px rgba(200,241,53,0.38)', flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px', fontWeight: '800', color: '#EDEAF5',
  },
  title: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '26px', fontWeight: '800', color: '#EDEAF5',
    margin: '0 0 6px 0', letterSpacing: '-0.025em',
  },
  subtitle: {
    fontSize: '14px', color: '#6B6B80', margin: '0 0 28px 0', fontWeight: '400',
  },
  errorBox: {
    width: '100%', boxSizing: 'border-box',
    backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
    color: '#FCA5A5', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  successBox: {
    width: '100%', boxSizing: 'border-box',
    backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)',
    color: '#6EE7B7', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  field: { width: '100%', marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#6B6B80',
    marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  input: {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px',
    backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '15px', color: '#EDEAF5', outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  passwordWrap: {
    position: 'relative', width: '100%', display: 'flex', alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '16px', padding: 0, minHeight: '44px',
    display: 'flex', alignItems: 'center',
  },
  toggleRow: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    width: '100%', boxSizing: 'border-box',
    padding: '14px 16px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '16px', cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  checkbox: {
    width: '20px', height: '20px', minWidth: '20px',
    borderRadius: '5px', border: '2px solid rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: '2px', flexShrink: 0, transition: 'all 0.2s',
  },
  checkmark: { color: '#080810', fontSize: '11px', fontWeight: '800' },
  toggleLabel: { fontSize: '14px', fontWeight: '600', color: '#EDEAF5', margin: 0 },
  toggleSub: { fontSize: '12px', color: '#6B6B80', margin: '3px 0 0 0' },
  bizRow: { display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap' },
  btn: {
    width: '100%', padding: '13px',
    backgroundColor: '#C8F135', color: '#080810',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px', marginBottom: '24px',
    minHeight: '48px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 0 18px rgba(200,241,53,0.25)',
    transition: 'opacity 0.2s, box-shadow 0.2s, transform 0.2s',
  },
  btnRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(8,8,16,0.25)', borderTopColor: '#080810',
    borderRadius: '50%', display: 'inline-block',
    animation: 'authSpin 0.7s linear infinite',
  },
  footerText: { fontSize: '14px', color: '#55556A', margin: 0 },
  footerLink: { color: '#C8F135', fontWeight: '700', textDecoration: 'none' },
  credit: {
    position: 'relative', zIndex: 1,
    marginTop: '20px', fontSize: '12px', color: '#2A2A3A',
  },
};