import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

// ── Defaults ──────────────────────────────────────────────
const DEFAULT_APPEARANCE = {
    companyName: '',
    welcomeMessage: "Hi there! 👋 How can I help you today?",
    primaryColor: '#4F46E5',
    position: 'bottom-right',
};

const DEFAULT_FEATURES = {
    leadForm: false,
    aiReply: false,
    workingHours: false,
};

const DEFAULT_LEAD_FIELDS = {
    name: true,
    email: true,
    phone: false,
    company: false,
    customQuestion: '',
    customEnabled: false,
    services: [],
    serviceSelectionType: 'checklist',
};

const DEFAULT_AI_CONFIG = {
    botName: '',
    fallbackMessage: "I don't have information on that. Our team will get back to you shortly.",
};

const DEFAULT_WORKING_HOURS = {
    timezone: 'Asia/Kolkata',
    mon: { enabled: true, start: '09:00', end: '18:00' },
    tue: { enabled: true, start: '09:00', end: '18:00' },
    wed: { enabled: true, start: '09:00', end: '18:00' },
    thu: { enabled: true, start: '09:00', end: '18:00' },
    fri: { enabled: true, start: '09:00', end: '18:00' },
    sat: { enabled: false, start: '09:00', end: '18:00' },
    sun: { enabled: false, start: '09:00', end: '18:00' },
};

// ── Load saved progress ────────────────────────────────────
const loadSaved = () => {
    try {
        const saved = localStorage.getItem('setup_progress');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

// ── Component ──────────────────────────────────────────────
export default function Setup() {
    const navigate = useNavigate();
    const { token, installId, rehydrateFirebase } = useAgentStore();
    const isMobile = useIsMobile();

    // Clear stale progress if installId changed (new registration on same device)
    const saved = (() => {
        const data = loadSaved();
        if (!data) return null;
        if (data.installId && data.installId !== installId) {
            localStorage.removeItem('setup_progress');
            return null;
        }
        return data;
    })();

    const [step, setStep] = useState(saved?.step || 1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [embedCopied, setEmbedCopied] = useState(false);

    // Pre-fill companyName from registration if not already saved
    const { agent } = useAgentStore();
    const registeredCompany = agent?.profile?.company || '';
    const [appearance, setAppearance] = useState(
        saved?.appearance || {
            ...DEFAULT_APPEARANCE,
            companyName: registeredCompany,
        }
    );
    const [features, setFeatures] = useState(saved?.features || DEFAULT_FEATURES);
    const [leadFields, setLeadFields] = useState(saved?.leadFields || DEFAULT_LEAD_FIELDS);
    const [aiConfig] = useState(saved?.aiConfig || DEFAULT_AI_CONFIG);
    const [workingHours] = useState(saved?.workingHours || DEFAULT_WORKING_HOURS);

    const [kbQuestion, setKbQuestion] = useState('');
    const [kbAnswer, setKbAnswer] = useState('');
    const [kbEntries, setKbEntries] = useState(saved?.kbEntries || []);

    const [serviceInput, setServiceInput] = useState('');

    // ── Persist progress (stamped with installId to detect new registrations) ──
    useEffect(() => {
        localStorage.setItem('setup_progress', JSON.stringify({
            installId, step, appearance, features, leadFields, aiConfig, workingHours, kbEntries,
        }));
    }, [installId, step, appearance, features, leadFields, aiConfig, workingHours, kbEntries]);

    // ── Rehydrate Firebase auth on mount ──────────────────
    useEffect(() => {
        if (token) rehydrateFirebase();
    }, [token]);

    // ── Services ───────────────────────────────────────────
    const handleAddService = () => {
        const trimmed = serviceInput.trim();
        if (!trimmed || leadFields.services.includes(trimmed)) return;
        setLeadFields({ ...leadFields, services: [...leadFields.services, trimmed] });
        setServiceInput('');
    };

    const handleRemoveService = (index) => {
        setLeadFields({
            ...leadFields,
            services: leadFields.services.filter((_, i) => i !== index),
        });
    };

    // ── KB entries ─────────────────────────────────────────
    const handleAddKb = () => {
        const q = kbQuestion.trim();
        const a = kbAnswer.trim();
        if (!q || !a) return;
        setKbEntries([...kbEntries, { question: q, answer: a }]);
        setKbQuestion('');
        setKbAnswer('');
    };

    const handleRemoveKb = (index) => {
        setKbEntries(kbEntries.filter((_, i) => i !== index));
    };

    // ── Save & proceed to step 4 ───────────────────────────
    const handleSaveSettings = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/agent/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    appearance,
                    features,
                    leadFields: features.leadForm ? leadFields : null,
                    aiConfig: features.aiReply ? { ...aiConfig, kbEntries } : null,
                    workingHours: features.workingHours ? workingHours : null,
                    onboardingComplete: true,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save settings');
                return;
            }

            // Push KB entries to Firebase so Settings reads them immediately
            if (features.aiReply && kbEntries.length > 0) {
                const kbRef = ref(db, `knowledgeBase/${installId}`);
                await Promise.all(
                    kbEntries.map((entry) =>
                        push(kbRef, {
                            question: entry.question,
                            answer: entry.answer,
                            createdAt: Date.now(),
                        })
                    )
                );
            }

            localStorage.removeItem('setup_progress');
            setStep(4);
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const embedCode = `<script>\n  window.OpenChatConfig = { installId: "${installId}" }\n</script>\n<script src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@main/widget/dist/widget.js"></script>`;

    // ── Shared sub-components ──────────────────────────────
    const Toggle = ({ active, onToggle }) => (
        <div
            onClick={onToggle}
            style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: active ? '#4F46E5' : '#D1D5DB',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
                flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute',
                top: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                transform: active ? 'translateX(22px)' : 'translateX(2px)',
            }} />
        </div>
    );

    const Checkbox = ({ checked, onChange, disabled }) => (
        <div
            onClick={() => !disabled && onChange(!checked)}
            style={{
                width: '20px',
                height: '20px',
                minWidth: '20px',
                borderRadius: '4px',
                border: `2px solid ${checked ? '#4F46E5' : '#D1D5DB'}`,
                backgroundColor: checked ? '#4F46E5' : disabled ? '#F3F4F6' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                flexShrink: 0,
            }}
        >
            {checked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
        </div>
    );

    // ── Layout helpers ─────────────────────────────────────
    const cardStyle = {
        ...styles.card,
        padding: isMobile ? '28px 20px 40px' : '48px 40px',
        borderRadius: isMobile ? '0' : '16px',
        minHeight: isMobile ? '100vh' : 'auto',
        maxWidth: isMobile ? '100%' : '560px',
        boxShadow: isMobile ? 'none' : '0 4px 24px rgba(79,70,229,0.10)',
        overflowY: 'auto',
    };

    const titleSize = isMobile ? '20px' : '24px';

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '0' : '24px 16px',
            alignItems: isMobile ? 'flex-start' : 'center',
        }}>
            <div style={cardStyle}>

                {/* Progress Bar */}
                <div style={styles.progressBar}>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} style={{
                            ...styles.progressStep,
                            backgroundColor: s <= step ? '#4F46E5' : '#E5E7EB',
                        }} />
                    ))}
                </div>
                <p style={styles.stepLabel}>Step {step} of 4</p>

                {/* ── STEP 1: Welcome ───────────────────────────── */}
                {step === 1 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logoEmoji}>💬</div>
                        <h1 style={{ ...styles.title, fontSize: titleSize }}>Welcome to OpenChat!</h1>
                        <p style={styles.subtitle}>Let's get you set up in a few quick steps.</p>

                        <div style={styles.verifyBanner}>
                            <span>📧</span>
                            <p style={styles.verifyText}>
                                Please verify your email to fully activate your account. Check your inbox.
                            </p>
                        </div>

                        <div style={styles.infoBox}>
                            <p style={styles.infoText}>Your Install ID</p>
                            <div style={styles.installIdRow}>
                                <code style={styles.installId}>{installId}</code>
                                <button
                                    style={styles.copyIconButton}
                                    onClick={() => {
                                        navigator.clipboard.writeText(installId);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                >
                                    {copied ? '✅' : '📋'}
                                </button>
                            </div>
                            {copied && <div style={styles.copiedToast}>✅ Copied!</div>}
                            <p style={styles.infoSub}>Save this — you'll need it to embed the widget on your website.</p>
                            <p style={styles.infoSub2}>💡 Always available in Dashboard → Settings.</p>
                        </div>

                        <button style={styles.primaryBtn} onClick={() => setStep(2)}>
                            Get Started →
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Appearance ────────────────────────── */}
                {step === 2 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logoEmoji}>🎨</div>
                        <h1 style={{ ...styles.title, fontSize: titleSize }}>Customize your widget</h1>
                        <p style={styles.subtitle}>How should your chat widget look and feel?</p>

                        <div style={styles.field}>
                            <label style={styles.label}>Company / Brand Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Acme Inc."
                                value={appearance.companyName}
                                onChange={(e) => setAppearance({ ...appearance, companyName: e.target.value })}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Welcome Message</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={appearance.welcomeMessage}
                                onChange={(e) => setAppearance({ ...appearance, welcomeMessage: e.target.value })}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Primary Color</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="color"
                                    value={appearance.primaryColor}
                                    onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                                    style={styles.colorPicker}
                                />
                                <span style={{ fontSize: '13px', color: '#6B7280' }}>{appearance.primaryColor}</span>
                                {['#4F46E5', '#059669', '#DC2626', '#D97706', '#0891B2'].map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => setAppearance({ ...appearance, primaryColor: color })}
                                        style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            cursor: 'pointer',
                                            border: appearance.primaryColor === color ? '3px solid #111827' : '2px solid transparent',
                                            transition: 'border 0.15s',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Widget Position</label>
                            <div style={styles.radioRow}>
                                {['bottom-right', 'bottom-left'].map((pos) => (
                                    <div
                                        key={pos}
                                        style={{
                                            ...styles.radioCard,
                                            borderColor: appearance.position === pos ? '#4F46E5' : '#E5E7EB',
                                            backgroundColor: appearance.position === pos ? '#EEF2FF' : '#fff',
                                            color: appearance.position === pos ? '#4F46E5' : '#6B7280',
                                        }}
                                        onClick={() => setAppearance({ ...appearance, position: pos })}
                                    >
                                        {pos === 'bottom-right' ? '↘ Bottom Right' : '↙ Bottom Left'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.buttonRow}>
                            <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                            <button style={styles.primaryBtn} onClick={() => setStep(3)}>Continue →</button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: Features ──────────────────────────── */}
                {step === 3 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logoEmoji}>⚡</div>
                        <h1 style={{ ...styles.title, fontSize: titleSize }}>Enable features</h1>
                        <p style={styles.subtitle}>Turn on what you need. You can configure details in Settings anytime.</p>

                        {error && <div style={styles.errorBox}>{error}</div>}

                        {/* ── Lead Form ── */}
                        <div style={styles.featureCard}>
                            <div style={styles.featureHeader}>
                                <div style={styles.featureLeft}>
                                    <span style={styles.featureIcon}>📋</span>
                                    <div>
                                        <p style={styles.featureTitle}>Lead Form</p>
                                        <p style={styles.featureSub}>Collect visitor info when agent is away</p>
                                    </div>
                                </div>
                                <Toggle
                                    active={features.leadForm}
                                    onToggle={() => setFeatures({ ...features, leadForm: !features.leadForm })}
                                />
                            </div>

                            {features.leadForm && (
                                <div style={styles.featureBody}>
                                    <p style={styles.sectionTitle}>Fields to collect</p>

                                    {[
                                        { key: 'name', label: 'Full Name', required: true },
                                        { key: 'email', label: 'Email Address', required: true },
                                        { key: 'phone', label: 'Phone Number' },
                                        { key: 'company', label: 'Company Name' },
                                    ].map(({ key, label, required }) => (
                                        <div key={key} style={styles.checkRow}>
                                            <Checkbox
                                                checked={leadFields[key]}
                                                onChange={(val) => !required && setLeadFields({ ...leadFields, [key]: val })}
                                                disabled={required}
                                            />
                                            <span style={styles.checkLabel}>{label}</span>
                                            {required && <span style={styles.requiredBadge}>Required</span>}
                                        </div>
                                    ))}

                                    <div style={{ ...styles.field, marginTop: '14px' }}>
                                        <label style={styles.label}>Custom Question <span style={styles.optionalBadge}>optional</span></label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            placeholder="e.g. What service are you interested in?"
                                            value={leadFields.customQuestion}
                                            onChange={(e) => setLeadFields({
                                                ...leadFields,
                                                customQuestion: e.target.value,
                                                customEnabled: e.target.value.length > 0,
                                            })}
                                        />
                                    </div>

                                    <div style={styles.field}>
                                        <label style={styles.label}>Services Dropdown <span style={styles.optionalBadge}>optional</span></label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                style={{ ...styles.input, flex: 1 }}
                                                type="text"
                                                placeholder="e.g. Web Design"
                                                value={serviceInput}
                                                onChange={(e) => setServiceInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddService()}
                                            />
                                            <button style={styles.addBtn} onClick={handleAddService}>Add</button>
                                        </div>
                                        {leadFields.services.length > 0 && (
                                            <div style={styles.tagsContainer}>
                                                {leadFields.services.map((s, i) => (
                                                    <div key={i} style={styles.tag}>
                                                        <span style={styles.tagText}>{s}</span>
                                                        <button
                                                            style={styles.tagRemove}
                                                            onClick={() => handleRemoveService(i)}
                                                            aria-label={`Remove ${s}`}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── AI Auto-reply ── */}
                        <div style={styles.featureCard}>
                            <div style={styles.featureHeader}>
                                <div style={styles.featureLeft}>
                                    <span style={styles.featureIcon}>🤖</span>
                                    <div>
                                        <p style={styles.featureTitle}>AI Auto-reply</p>
                                        <p style={styles.featureSub}>Bot answers visitors using your knowledge base</p>
                                    </div>
                                </div>
                                <Toggle
                                    active={features.aiReply}
                                    onToggle={() => setFeatures({ ...features, aiReply: !features.aiReply })}
                                />
                            </div>

                            {features.aiReply && (
                                <div style={styles.featureBody}>
                                    <p style={styles.sectionTitle}>Knowledge Base</p>
                                    <p style={{ ...styles.featureSub, marginBottom: '12px' }}>
                                        Add Q&A pairs the AI will use to answer visitors. More can be added in Settings.
                                    </p>

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
                                            style={{ ...styles.input, minHeight: '72px', resize: 'vertical', fontFamily: 'inherit' }}
                                            placeholder="e.g. We're open Mon–Fri, 9am to 6pm IST."
                                            value={kbAnswer}
                                            onChange={(e) => setKbAnswer(e.target.value)}
                                        />
                                    </div>

                                    <button style={{ ...styles.addBtn, marginBottom: '12px', width: '100%' }} onClick={handleAddKb}>
                                        + Add Entry
                                    </button>

                                    {kbEntries.length > 0 && (
                                        <div>
                                            {kbEntries.map((entry, i) => (
                                                <div key={i} style={styles.kbEntry}>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={styles.kbQ}>Q: {entry.question}</p>
                                                        <p style={styles.kbA}>A: {entry.answer}</p>
                                                    </div>
                                                    <button
                                                        style={styles.kbRemove}
                                                        onClick={() => handleRemoveKb(i)}
                                                        aria-label="Remove entry"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Working Hours ── */}
                        <div style={styles.featureCard}>
                            <div style={styles.featureHeader}>
                                <div style={styles.featureLeft}>
                                    <span style={styles.featureIcon}>⏰</span>
                                    <div>
                                        <p style={styles.featureTitle}>Working Hours</p>
                                        <p style={styles.featureSub}>Widget shows offline outside your hours</p>
                                    </div>
                                </div>
                                <Toggle
                                    active={features.workingHours}
                                    onToggle={() => setFeatures({ ...features, workingHours: !features.workingHours })}
                                />
                            </div>
                            {features.workingHours && (
                                <div style={{ ...styles.featureBody }}>
                                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                                        ✅ Enabled — configure your schedule in <strong>Settings → Working Hours</strong> after setup.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={styles.buttonRow}>
                            <button style={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
                            <button
                                style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
                                onClick={handleSaveSettings}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save & Continue →'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Embed Code ────────────────────────── */}
                {step === 4 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logoEmoji}>🎉</div>
                        <h1 style={{ ...styles.title, fontSize: titleSize }}>You're all set!</h1>
                        <p style={styles.subtitle}>
                            Add this snippet to your website to activate the chat widget.
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
                                }}
                            >
                                {embedCopied ? '✅ Copied!' : '📋 Copy Code'}
                            </button>
                        </div>

                        {embedCopied && (
                            <div style={styles.copiedToast}>
                                ✅ Paste before &lt;/body&gt; on your website.
                            </div>
                        )}

                        <div style={{
                            ...styles.platformGrid,
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        }}>
                            {[
                                { name: 'Wix', hint: 'Settings → Custom Code → paste before </body>' },
                                { name: 'WordPress', hint: 'Plugins → Insert Headers and Footers → Footer' },
                                { name: 'Shopify', hint: 'Themes → Edit Code → theme.liquid → before </body>' },
                                { name: 'HTML', hint: 'Paste before </body> in your HTML file' },
                            ].map(({ name, hint }) => (
                                <div key={name} style={styles.platformCard}>
                                    <p style={styles.platformName}>{name}</p>
                                    <p style={styles.platformHint}>{hint}</p>
                                </div>
                            ))}
                        </div>

                        <div style={styles.buttonRow}>
                            <button style={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
                            <button style={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                                Open Dashboard →
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#F5F3FF',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        boxSizing: 'border-box',
    },
    progressBar: {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    progressStep: {
        flex: 1,
        height: '4px',
        borderRadius: '2px',
        transition: 'background-color 0.3s',
    },
    stepLabel: {
        fontSize: '12px',
        color: '#9CA3AF',
        marginBottom: '28px',
        marginTop: '2px',
    },
    stepContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    logoEmoji: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    title: {
        fontWeight: '700',
        color: '#1E1B4B',
        margin: '0 0 8px 0',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6B7280',
        marginBottom: '24px',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    verifyBanner: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        backgroundColor: '#FEF3C7',
        border: '1px solid #FCD34D',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box',
    },
    verifyText: {
        fontSize: '13px',
        color: '#92400E',
        margin: 0,
        lineHeight: '1.4',
    },
    infoBox: {
        backgroundColor: '#EEF2FF',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box',
    },
    infoText: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#4F46E5',
        margin: '0 0 8px 0',
    },
    installIdRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        border: '1px solid #C7D2FE',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '8px',
        boxSizing: 'border-box',
    },
    installId: {
        fontSize: '13px',
        color: '#1E1B4B',
        wordBreak: 'break-all',
        flex: 1,
        marginRight: '8px',
    },
    copyIconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '0',
        minHeight: '44px',
        minWidth: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    copiedToast: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
        fontSize: '12px',
        fontWeight: '600',
        padding: '8px 14px',
        borderRadius: '6px',
        marginBottom: '12px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
    },
    infoSub: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '0 0 4px 0',
        lineHeight: '1.4',
    },
    infoSub2: {
        fontSize: '12px',
        color: '#4F46E5',
        margin: '4px 0 0 0',
        fontWeight: '500',
    },
    field: {
        width: '100%',
        marginBottom: '16px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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
        fontFamily: 'inherit',
    },
    colorPicker: {
        width: '44px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        cursor: 'pointer',
        padding: '2px',
    },
    radioRow: {
        display: 'flex',
        gap: '12px',
    },
    radioCard: {
        flex: 1,
        padding: '12px',
        border: '2px solid #E5E7EB',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.15s',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtn: {
        padding: '14px 28px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        minHeight: '48px',
        transition: 'opacity 0.15s',
    },
    backBtn: {
        padding: '14px 20px',
        backgroundColor: '#fff',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        minHeight: '48px',
    },
    buttonRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        width: '100%',
        justifyContent: 'flex-end',
    },
    featureCard: {
        width: '100%',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        marginBottom: '12px',
        overflow: 'hidden',
    },
    featureHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#fff',
        gap: '12px',
    },
    featureLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
        minWidth: 0,
    },
    featureIcon: {
        fontSize: '24px',
        flexShrink: 0,
    },
    featureTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 2px 0',
    },
    featureSub: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0,
    },
    featureBody: {
        padding: '16px',
        backgroundColor: '#F9FAFB',
        borderTop: '1px solid #E5E7EB',
    },
    sectionTitle: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '12px',
        display: 'block',
    },
    checkRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        width: '100%',
    },
    checkLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        flex: 1,
    },
    requiredBadge: {
        fontSize: '11px',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        padding: '2px 8px',
        borderRadius: '20px',
        fontWeight: '600',
        flexShrink: 0,
    },
    optionalBadge: {
        fontSize: '11px',
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
        padding: '2px 8px',
        borderRadius: '20px',
        fontWeight: '500',
    },
    addBtn: {
        padding: '12px 16px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        flexShrink: 0,
        minHeight: '48px',
    },
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '10px',
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#EEF2FF',
        border: '1px solid #C7D2FE',
        borderRadius: '20px',
        padding: '5px 10px 5px 12px',
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
        fontSize: '12px',
        padding: '0',
        opacity: 0.7,
        minHeight: '24px',
        minWidth: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    kbEntry: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '8px',
    },
    kbQ: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 4px 0',
        wordBreak: 'break-word',
    },
    kbA: {
        fontSize: '13px',
        color: '#6B7280',
        margin: 0,
        wordBreak: 'break-word',
    },
    kbRemove: {
        background: 'none',
        border: 'none',
        color: '#9CA3AF',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '0',
        flexShrink: 0,
        minHeight: '32px',
        minWidth: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    embedBox: {
        backgroundColor: '#1E1B4B',
        borderRadius: '10px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '12px',
    },
    embedCode: {
        color: '#A5B4FC',
        fontSize: '12px',
        margin: '0 0 12px 0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        lineHeight: '1.6',
    },
    embedCopyBtn: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        minHeight: '48px',
        transition: 'background-color 0.2s',
    },
    platformGrid: {
        display: 'grid',
        gap: '10px',
        width: '100%',
        marginBottom: '24px',
    },
    platformCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        padding: '12px 14px',
        border: '1px solid #E5E7EB',
    },
    platformName: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#1E1B4B',
        margin: '0 0 4px 0',
    },
    platformHint: {
        fontSize: '11px',
        color: '#6B7280',
        margin: 0,
        lineHeight: '1.4',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box',
    },
};