import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAgentStore from '../store/agentStore';

export default function Register() {
    const navigate = useNavigate();
    const setAuth = useAgentStore((state) => state.setAuth);

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
    const [passwordError, setPasswordError] = useState('');

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
            setSuccess('Account created! Please check your email to verify your account.');
            setTimeout(() => navigate('/setup'), 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logo}>💬</div>
                <h1 style={styles.title}>OpenChat</h1>
                <p style={styles.subtitle}>Create your agent account</p>

                {/* Error */}
                {error && <div style={styles.error}>{error}</div>}

                {/* Success */}
                {success && <div style={styles.success}>{success}</div>}

                {/* Name + Email */}
                <div style={styles.field}>
                    <label style={styles.label}>Full Name</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Dipesh Das"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
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
                        style={styles.input}
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={form.confirmPassword || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Business Toggle */}
                <div style={styles.toggleRow} onClick={handleBusinessToggle}>
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

                {/* Business Fields — animated show/hide */}
                {isBusiness && (
                    <div style={styles.businessFields}>
                        <div style={styles.row}>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F3FF',
        fontFamily: 'Arial, sans-serif',
        padding: '24px',
    },
    card: {
        backgroundColor: '#fff',
        padding: '48px 40px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(79,70,229,0.10)',
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
    passwordWrapper: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    passwordInput: {
        width: '100%',
        padding: '10px 40px 10px 14px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
    },
    eyeButton: {
        position: 'absolute',
        right: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
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
    success: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box',
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
        backgroundColor: '#FAFAFA',
        transition: 'all 0.2s',
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
    businessFields: {
        width: '100%',
    },
    row: {
        display: 'flex',
        gap: '16px',
        width: '100%',
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
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        marginBottom: '24px',
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