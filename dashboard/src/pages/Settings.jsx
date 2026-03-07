import { useState } from 'react';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Settings({ installId, token, agent }) {
    const setAgent = useAgentStore((state) => state.setAgent);
    const isMobile = useIsMobile();

    const [copied, setCopied] = useState(false);
    const [embedCopied, setEmbedCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: agent?.profile?.name || '',
        company: agent?.profile?.company || '',
        website: agent?.profile?.website || '',
    });

    const embedCode = `<script>
  window.OpenChatConfig = { installId: "${installId}" }
</script>
<script src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js"></script>`;

    const handleSave = async () => {
        setSaving(true);
        setSuccess('');
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/agent/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profile: form }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save');
                return;
            }

            setAgent({ ...agent, profile: { ...agent?.profile, ...form } });
            setSuccess('Settings saved successfully!');
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.content,
                padding: isMobile ? '24px 16px' : '40px 24px',
                paddingBottom: isMobile ? '100px' : '40px',
            }}>
                <h1 style={{
                    ...styles.pageTitle,
                    fontSize: isMobile ? '20px' : '24px',
                }}>
                    Settings
                </h1>

                {/* ── Install ID ── */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Your Install ID</h2>
                    <p style={styles.sectionSub}>
                        Use this to embed the widget on your website.
                    </p>
                    <div style={{
                        ...styles.installIdBox,
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'stretch' : 'center',
                    }}>
                        <code style={styles.installIdText}>{installId}</code>
                        <button
                            style={{
                                ...styles.copyBtn,
                                backgroundColor: copied ? '#059669' : '#4F46E5',
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(installId);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                        >
                            {copied ? '✅ Copied!' : '📋 Copy ID'}
                        </button>
                    </div>
                </div>

                {/* ── Embed Code ── */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Embed Code</h2>
                    <p style={styles.sectionSub}>
                        Paste this before the &lt;/body&gt; tag on your website.
                    </p>
                    <div style={styles.embedBox}>
                        <pre style={styles.embedCode}>{embedCode}</pre>
                        <button
                            style={{
                                ...styles.embedCopyBtn,
                                backgroundColor: embedCopied ? '#059669' : '#4F46E5',
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(embedCode);
                                setEmbedCopied(true);
                                setTimeout(() => setEmbedCopied(false), 2000);
                            }}
                        >
                            {embedCopied ? '✅ Copied!' : '📋 Copy Code'}
                        </button>
                    </div>
                </div>

                {/* ── Profile ── */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Profile</h2>
                    <p style={styles.sectionSub}>Update your name and company details.</p>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.successMsg}>{success}</div>}

                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your name"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={{
                                ...styles.input,
                                backgroundColor: '#F9FAFB',
                                color: '#9CA3AF',
                            }}
                            type="email"
                            value={agent?.profile?.email || ''}
                            disabled
                        />
                        <p style={styles.fieldHint}>Email cannot be changed.</p>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Company</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="Your company name"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Website</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={form.website}
                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                            placeholder="https://yoursite.com"
                        />
                    </div>

                    <button
                        style={{
                            ...styles.saveBtn,
                            width: isMobile ? '100%' : 'auto',
                            opacity: saving ? 0.7 : 1,
                        }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* ── Account Info ── */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Account</h2>
                    <div style={{
                        ...styles.accountRow,
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '16px' : '32px',
                    }}>
                        <div>
                            <p style={styles.accountLabel}>Email verification</p>
                            <p style={styles.accountValue}>
                                {agent?.emailVerified ? '✅ Verified' : '⚠️ Not verified'}
                            </p>
                        </div>
                        <div>
                            <p style={styles.accountLabel}>Current mode</p>
                            <p style={styles.accountValue}>
                                {agent?.mode === 'chat_app' && '💬 Chat App'}
                                {agent?.mode === 'chat_bot' && '🤖 Chat Bot'}
                                {agent?.mode === 'lead_gen' && '📋 Lead Gen'}
                                {!agent?.mode && '—'}
                            </p>
                        </div>
                        <div>
                            <p style={styles.accountLabel}>Onboarding</p>
                            <p style={styles.accountValue}>
                                {agent?.onboardingComplete ? '✅ Complete' : '⚠️ Incomplete'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F9FAFB',
    },
    content: {
        maxWidth: '640px',
        margin: '0 auto',
    },
    pageTitle: {
        fontWeight: '800',
        color: '#111827',
        margin: '0 0 32px 0',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #E5E7EB',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 4px 0',
    },
    sectionSub: {
        fontSize: '13px',
        color: '#6B7280',
        margin: '0 0 16px 0',
    },
    installIdBox: {
        display: 'flex',
        gap: '12px',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        padding: '12px 16px',
    },
    installIdText: {
        fontSize: '13px',
        color: '#1E1B4B',
        flex: 1,
        wordBreak: 'break-all',
    },
    copyBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background-color 0.2s',
    },
    embedBox: {
        backgroundColor: '#1E1B4B',
        borderRadius: '10px',
        padding: '16px',
    },
    embedCode: {
        color: '#A5B4FC',
        fontSize: '12px',
        margin: '0 0 12px 0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
    },
    embedCopyBtn: {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    field: {
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
    fieldHint: {
        fontSize: '12px',
        color: '#9CA3AF',
        margin: '4px 0 0 0',
    },
    saveBtn: {
        padding: '10px 24px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
    },
    successMsg: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
    },
    accountRow: {
        display: 'flex',
    },
    accountLabel: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '0 0 4px 0',
    },
    accountValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
    },
};