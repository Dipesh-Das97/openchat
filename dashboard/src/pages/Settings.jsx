import { useState, useEffect } from 'react';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { ref, onValue, push, remove } from 'firebase/database';
import { db } from '../firebase';

export default function Settings({ installId, token, agent }) {
    const setAgent = useAgentStore((state) => state.setAgent);
    const isMobile = useIsMobile();

    const [copied, setCopied] = useState(false);
    const [embedCopied, setEmbedCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [kbQuestion, setKbQuestion] = useState('');
    const [kbAnswer, setKbAnswer] = useState('');
    const [kbEntries, setKbEntries] = useState([]);
    const [savingKb, setSavingKb] = useState(false);
    const [kbSuccess, setKbSuccess] = useState('');
    const [kbLoaded, setKbLoaded] = useState(false);

    const [form, setForm] = useState({
        name: agent?.profile?.name || '',
        company: agent?.profile?.company || '',
        website: agent?.profile?.website || '',
    });
    const [serviceInput, setServiceInput] = useState('');
    const [services, setServices] = useState(
        agent?.leadFields?.services || []
    );
    const [serviceSelectionType, setServiceSelectionType] = useState(
        agent?.leadFields?.serviceSelectionType || 'checklist'
    );
    const [savingServices, setSavingServices] = useState(false);
    const [serviceSuccess, setServiceSuccess] = useState('');

    useEffect(() => {
        if (agent?.mode !== 'chat_bot' || !installId) return;
        const kbRef = ref(db, `knowledgeBase/${installId}`);
        const unsub = onValue(kbRef, (snap) => {
            if (!snap.exists()) { setKbEntries([]); setKbLoaded(true); return; }
            const entries = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
            setKbEntries(entries);
            setKbLoaded(true);
        });
        return () => unsub();
    }, [agent?.mode, installId]);

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

    const handleAddService = () => {
        const trimmed = serviceInput.trim();
        if (!trimmed) return;
        if (services.includes(trimmed)) return; // no duplicates
        setServices([...services, trimmed]);
        setServiceInput('');
    };

    const handleRemoveService = (index) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleSaveServices = async () => {
        setSavingServices(true);
        setServiceSuccess('');

        try {
            const res = await fetch('http://localhost:5000/api/agent/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    leadFields: {
                        ...agent?.leadFields,
                        services,
                        serviceSelectionType,
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save services');
                return;
            }

            // Update local agent state
            setAgent({
                ...agent,
                leadFields: {
                    ...agent?.leadFields,
                    services,
                    serviceSelectionType,
                },
            });

            setServiceSuccess('Services saved successfully!');
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setSavingServices(false);
        }
    };

    const handleAddKbEntry = async () => {
        const q = kbQuestion.trim();
        const a = kbAnswer.trim();
        if (!q || !a) return;

        setSavingKb(true);
        try {
            await push(ref(db, `knowledgeBase/${installId}`), {
                question: q,
                answer: a,
                createdAt: Date.now(),
            });
            setKbQuestion('');
            setKbAnswer('');
            setKbSuccess('Entry added!');
            setTimeout(() => setKbSuccess(''), 2000);
        } catch (err) {
            setError('Failed to add entry.');
        } finally {
            setSavingKb(false);
        }
    };

    const handleRemoveKbEntry = async (id) => {
        try {
            await remove(ref(db, `knowledgeBase/${installId}/${id}`));
        } catch (err) {
            setError('Failed to remove entry.');
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

                {/* ── Lead Gen Services ── */}
                {agent?.mode === 'lead_gen' && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Lead Gen Services</h2>
                        <p style={styles.sectionSub}>
                            Visitors will see these services in your lead capture form.
                        </p>

                        {/* Selection type toggle */}
                        <div style={styles.field}>
                            <label style={styles.label}>Selection Type</label>
                            <div style={styles.radioRow}>
                                {['checklist', 'dropdown'].map((type) => (
                                    <div
                                        key={type}
                                        style={{
                                            ...styles.radioCard,
                                            borderColor: serviceSelectionType === type ? '#4F46E5' : '#E5E7EB',
                                            backgroundColor: serviceSelectionType === type ? '#EEF2FF' : '#fff',
                                            color: serviceSelectionType === type ? '#4F46E5' : '#6B7280',
                                        }}
                                        onClick={() => setServiceSelectionType(type)}
                                    >
                                        {type === 'checklist' ? '☑️ Checklist' : '📋 Dropdown'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add service input */}
                        <div style={styles.field}>
                            <label style={styles.label}>Add Service</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="e.g. Web Design"
                                    value={serviceInput}
                                    onChange={(e) => setServiceInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddService();
                                    }}
                                />
                                <button
                                    style={styles.addServiceBtn}
                                    onClick={handleAddService}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Service tags */}
                        {services.length > 0 && (
                            <div style={styles.tagsContainer}>
                                {services.map((service, index) => (
                                    <div key={index} style={styles.tag}>
                                        <span style={styles.tagText}>{service}</span>
                                        <button
                                            style={styles.tagRemove}
                                            onClick={() => handleRemoveService(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {services.length === 0 && (
                            <p style={styles.fieldHint}>No services added yet. Add some above!</p>
                        )}

                        <button
                            style={{
                                ...styles.saveBtn,
                                width: isMobile ? '100%' : 'auto',
                                marginTop: '16px',
                                opacity: savingServices ? 0.7 : 1,
                            }}
                            onClick={handleSaveServices}
                            disabled={savingServices}
                        >
                            {savingServices ? 'Saving...' : 'Save Services'}
                        </button>

                        {serviceSuccess && (
                            <div style={{ ...styles.successMsg, marginTop: '12px' }}>
                                {serviceSuccess}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Knowledge Base (Chat Bot mode only) ── */}
                {agent?.mode === 'chat_bot' && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Knowledge Base</h2>
                        <p style={styles.sectionSub}>
                            Add FAQs so the AI can answer visitor questions accurately.
                        </p>

                        {kbSuccess && (
                            <div style={{ ...styles.successMsg, marginBottom: '16px' }}>
                                {kbSuccess}
                            </div>
                        )}

                        {/* Add entry form */}
                        <div style={styles.field}>
                            <label style={styles.label}>Question</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="e.g. What are your working hours?"
                                value={kbQuestion}
                                onChange={(e) => setKbQuestion(e.target.value)}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Answer</label>
                            <textarea
                                style={{
                                    ...styles.input,
                                    minHeight: '80px',
                                    resize: 'vertical',
                                    fontFamily: 'Arial, sans-serif',
                                }}
                                placeholder="e.g. We're open Monday to Friday, 9am to 6pm IST."
                                value={kbAnswer}
                                onChange={(e) => setKbAnswer(e.target.value)}
                            />
                        </div>

                        <button
                            style={{
                                ...styles.saveBtn,
                                width: isMobile ? '100%' : 'auto',
                                opacity: savingKb ? 0.7 : 1,
                                marginBottom: '24px',
                            }}
                            onClick={handleAddKbEntry}
                            disabled={savingKb}
                        >
                            {savingKb ? 'Adding...' : '+ Add Entry'}
                        </button>

                        {/* Existing entries */}
                        {kbEntries.length === 0 && kbLoaded && (
                            <p style={styles.fieldHint}>
                                No entries yet. Add your first FAQ above!
                            </p>
                        )}

                        {kbEntries.map((entry) => (
                            <div key={entry.id} style={styles.kbEntry}>
                                <div style={styles.kbEntryContent}>
                                    <p style={styles.kbQuestion}>Q: {entry.question}</p>
                                    <p style={styles.kbAnswer}>A: {entry.answer}</p>
                                </div>
                                <button
                                    style={styles.kbRemoveBtn}
                                    onClick={() => handleRemoveKbEntry(entry.id)}
                                    title="Remove entry"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

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

    radioRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '4px',
    },
    radioCard: {
        flex: 1,
        padding: '10px',
        border: '2px solid #E5E7EB',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.15s',
    },
    addServiceBtn: {
        padding: '10px 20px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        flexShrink: 0,
    },
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '8px',
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#EEF2FF',
        border: '1px solid #C7D2FE',
        borderRadius: '20px',
        padding: '4px 10px 4px 12px',
    },
    tagText: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4F46E5',
    },
    tagRemove: {
        background: 'none',
        border: 'none',
        color: '#4F46E5',
        cursor: 'pointer',
        fontSize: '11px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.7,
    },
    kbEntry: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '10px',
    },
    kbEntryContent: {
        flex: 1,
    },
    kbQuestion: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 4px 0',
    },
    kbAnswer: {
        fontSize: '13px',
        color: '#6B7280',
        margin: 0,
    },
    kbRemoveBtn: {
        background: 'none',
        border: 'none',
        color: '#9CA3AF',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '0',
        flexShrink: 0,
        lineHeight: 1,
    },
};