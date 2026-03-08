import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAgentStore((state) => state.setAuth);
  const setAgent = useAgentStore((state) => state.setAgent);
  const isMobile = useIsMobile();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      await setAuth(data.token, data.installId, data.firebaseToken);

      const profileRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profile = await profileRes.json();
      setAgent(profile);

      if (!profile.onboardingComplete) {
        navigate('/setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.card,
        padding: isMobile ? '36px 24px' : '48px 40px',
        borderRadius: isMobile ? '0' : '16px',
        minHeight: isMobile ? '100vh' : 'auto',
        justifyContent: isMobile ? 'center' : 'flex-start',
        boxShadow: isMobile ? 'none' : '0 4px 24px rgba(79,70,229,0.10)',
        maxWidth: isMobile ? '100%' : '400px',
      }}>
        {/* Logo */}
        <div style={styles.logo}>💬</div>
        <h1 style={styles.title}>OpenChat</h1>
        <p style={styles.subtitle}>Sign in to your dashboard</p>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />
        </div>

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4F46E5',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '32px',
  },
  error: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  field: {
    width: '100%',
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '16px', // 16px prevents iOS auto-zoom
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    marginBottom: '24px',
    minHeight: '48px', // good touch target
  },
  footer: {
    fontSize: '14px',
    color: '#6B7280',
  },
  link: {
    color: '#4F46E5',
    fontWeight: '600',
    textDecoration: 'none',
  },
};