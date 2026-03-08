import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Register() {
    const navigate = useNavigate();
    const setAuth = useAgentStore((state) => state.setAuth);
    const isMobile = useIsMobile();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        website: '',
        type: 'personal',
    });
    const [isBusiness, setIsBusiness] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBusinessToggle = () => {
        setIsBusiness(!isBusiness);
        setForm({
            ...form,
            type: !isBusiness ? 'business' : 'personal',
            company: '',
            website: '',
        });
    };

    const handleRegister = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            setAuth(data.token, data.installId);
            setSuccess('Account created! Redirecting you to setup...');
            setTimeout(() => navigate('/setup'), 2000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '0' : '24px',
            alignItems: isMobile ? 'flex-start' : 'center',
        }}>
            <div style={{
                ...styles.card,
                padding: isMobile ? '36px 24px 48px' : '48px 40px',
                borderRadius: isMobile ? '0' : '16px',
                minHeight: isMobile ? '100vh' : 'auto',
                maxWidth: isMobile ? '100%' : '480px',
                boxShadow: isMobile ? 'none' : '0 4px 24px rgba(79,70,229,0.10)',
            }}>
                {/* Logo */}
                <div style={styles.logo}>💬</div>
                <h1 style={styles.title}>OpenChat</h1>
                <p style={styles.subtitle}>Create your agent account</p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                {/* Full Name */}
                <div style={styles.field}>
                    <label style={styles.label}>Full Name</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Dipesh Das"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                </div>

                {/* Email */}
                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div style={styles.field}>
                    <label style={styles.label}>Password</label>
                    <div style={styles.passwordWrapper}>
                        <input
                            style={styles.passwordInput}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            style={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div style={styles.field}>
                    <label style={styles.label}>Confirm Password</label>
                    <input
                        style={{
                            ...styles.input,
                            borderColor: form.confirmPassword
                                ? form.password === form.confirmPassword
                                    ? '#059669'
                                    : '#DC2626'
                                : '#D1D5DB',
                        }}
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={form.confirmPassword || ''}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    {form.confirmPassword && (
                        <p style={{
                            fontSize: '12px',
                            marginTop: '4px',
                            color: form.password === form.confirmPassword ? '#059669' : '#DC2626',
                        }}>
                            {form.password === form.confirmPassword
                                ? '✅ Passwords match'
                                : '❌ Passwords do not match'}
                        </p>
                    )}
                </div>

                {/* Business Toggle */}
                <div
                    style={{
                        ...styles.toggleRow,
                        backgroundColor: isBusiness ? '#EEF2FF' : '#FAFAFA',
                        borderColor: isBusiness ? '#C7D2FE' : '#E5E7EB',
                    }}
                    onClick={handleBusinessToggle}
                >
                    <div style={{
                        ...styles.checkbox,
                        backgroundColor: isBusiness ? '#4F46E5' : '#fff',
                        borderColor: isBusiness ? '#4F46E5' : '#D1D5DB',
                    }}>
                        {isBusiness && <span style={styles.checkmark}>✓</span>}
                    </div>
                    <div>
                        <p style={styles.toggleLabel}>Setting this up for a business</p>
                        <p style={styles.toggleSub}>Unlocks company profile, lead gen and team features</p>
                    </div>
                </div>

                {/* Business Fields — stacks on mobile */}
                {isBusiness && (
                    <div style={{
                        ...styles.businessRow,
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '0' : '16px',
                    }}>
                        <div style={styles.field}>
                            <label style={styles.label}>Company Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="company"
                                placeholder="Acme Inc."
                                value={form.company}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Website</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="website"
                                placeholder="https://acme.com"
                                value={form.website}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                )}

                <button
                    style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create Account →'}
                </button>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
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
    successBox: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
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
        fontSize: '16px', // prevents iOS zoom
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    passwordInput: {
        width: '100%',
        padding: '12px 44px 12px 14px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        fontSize: '16px', // prevents iOS zoom
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        minHeight: '44px', // touch target
    },
    toggleRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid #E5E7EB',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        minWidth: '20px',
        borderRadius: '4px',
        border: '2px solid #D1D5DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2px',
        transition: 'all 0.2s',
    },
    checkmark: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    toggleLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
    },
    toggleSub: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '2px 0 0 0',
    },
    businessRow: {
        display: 'flex',
        width: '100%',
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
        minHeight: '48px',
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