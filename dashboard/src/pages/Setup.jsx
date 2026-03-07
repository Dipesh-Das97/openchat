import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAgentStore from '../store/agentStore';

const MODES = [
    {
        id: 'chat_app',
        icon: '💬',
        title: 'Chat App',
        description: 'Real-time chat between users. End-to-end encrypted.',
        like: 'Like WhatsApp',
    },
    {
        id: 'chat_bot',
        icon: '🤖',
        title: 'Chat Bot',
        description: 'Automated FAQ responses powered by AI + your knowledge base.',
        like: 'Like Intercom Bot',
    },
    {
        id: 'lead_gen',
        icon: '📋',
        title: 'Lead Gen',
        description: 'Capture visitor name, email and phone. Build your contact list.',
        like: 'Like a smart form',
    },
];

const DEFAULT_BOT_CONFIG = {
    provider: 'claude',
    apiKey: '',
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

const DEFAULT_LEAD_FIELDS = {
    name: true,
    email: true,
    phone: false,
    company: false,
    customQuestion: '',
    customEnabled: false,
};

export default function Setup() {
    const navigate = useNavigate();
    const { token, installId } = useAgentStore();

    const [step, setStep] = useState(1);
    const [selectedMode, setSelectedMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [embedCopied, setEmbedCopied] = useState(false);
    const [botConfig, setBotConfig] = useState(DEFAULT_BOT_CONFIG);
    const [workingHours, setWorkingHours] = useState(DEFAULT_WORKING_HOURS);
    const [leadFields, setLeadFields] = useState(DEFAULT_LEAD_FIELDS);
    const [welcomeMessage, setWelcomeMessage] = useState("Hi there! 👋 How can I help you today?");

    // ── Restore from localStorage on mount ──
    useEffect(() => {
        const saved = localStorage.getItem('setup_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.step) setStep(data.step);
                if (data.selectedMode) setSelectedMode(data.selectedMode);
                if (data.botConfig) setBotConfig(data.botConfig);
                if (data.workingHours) setWorkingHours(data.workingHours);
                if (data.leadFields) setLeadFields(data.leadFields);
                if (data.welcomeMessage) setWelcomeMessage(data.welcomeMessage);
            } catch (e) {
                localStorage.removeItem('setup_progress');
            }
        }
    }, []);

    // ── Save to localStorage on every change ──
    useEffect(() => {
        localStorage.setItem('setup_progress', JSON.stringify({
            step,
            selectedMode,
            botConfig,
            workingHours,
            leadFields,
            welcomeMessage,
        }));
    }, [step, selectedMode, botConfig, workingHours, leadFields, welcomeMessage]);

    // ── Mode change — clear irrelevant config ──
    const handleModeSelect = (modeId) => {
        if (modeId !== selectedMode) {
            setBotConfig(DEFAULT_BOT_CONFIG);
            setLeadFields(DEFAULT_LEAD_FIELDS);
            setWorkingHours(DEFAULT_WORKING_HOURS);
        }
        setSelectedMode(modeId);
    };

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
                    mode: selectedMode,
                    botConfig: selectedMode === 'chat_bot' ? botConfig : null,
                    workingHours: selectedMode === 'chat_bot' ? workingHours : null,
                    leadFields: selectedMode === 'lead_gen' ? leadFields : null,
                    welcomeMessage,
                    onboardingComplete: true,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save settings');
                return;
            }

            // Clear setup progress on completion
            localStorage.removeItem('setup_progress');
            setStep(4);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const embedCode = `<script>
  window.OpenChatConfig = { installId: "${installId}" }
</script>
<script src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js"></script>`;

    return (
        <div style={styles.container}>
            <div style={styles.card}>

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

                {/* ── STEP 1: Welcome ── */}
                {step === 1 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logo}>💬</div>
                        <h1 style={styles.title}>Welcome to OpenChat!</h1>
                        <p style={styles.subtitle}>
                            Let's get you set up in a few quick steps.
                        </p>

                        <div style={styles.verifyBanner}>
                            <span>📧</span>
                            <p style={styles.verifyText}>
                                Please verify your email to fully activate your account. Check your inbox.
                            </p>
                        </div>

                        <div style={styles.infoBox}>
                            <p style={styles.infoText}>Your Install ID:</p>
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
                            {copied && <div style={styles.copiedToast}>✅ ID Copied!</div>}
                            <p style={styles.infoSub}>
                                Save this — you'll need it to embed the widget on your website.
                            </p>
                            <p style={styles.infoSub2}>
                                💡 Don't worry if you lose it — your Install ID is always available in your Dashboard settings.
                            </p>
                        </div>

                        <button style={styles.button} onClick={() => setStep(2)}>
                            Get Started →
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Pick Mode ── */}
                {step === 2 && (
                    <div style={styles.stepContent}>
                        <h1 style={styles.title}>How will you use OpenChat?</h1>
                        <p style={styles.subtitle}>Pick the mode that fits your use case.</p>

                        <div style={styles.modeGrid}>
                            {MODES.map((mode) => (
                                <div
                                    key={mode.id}
                                    style={{
                                        ...styles.modeCard,
                                        borderColor: selectedMode === mode.id ? '#4F46E5' : '#E5E7EB',
                                        backgroundColor: selectedMode === mode.id ? '#EEF2FF' : '#fff',
                                    }}
                                    onClick={() => handleModeSelect(mode.id)}
                                >
                                    <div style={styles.modeIcon}>{mode.icon}</div>
                                    <h3 style={styles.modeTitle}>{mode.title}</h3>
                                    <p style={styles.modeDesc}>{mode.description}</p>
                                    <span style={styles.modeLike}>{mode.like}</span>
                                </div>
                            ))}
                        </div>

                        <div style={styles.buttonRow}>
                            <button style={styles.backButton} onClick={() => setStep(1)}>← Back</button>
                            <button
                                style={{ ...styles.button, opacity: !selectedMode ? 0.5 : 1 }}
                                disabled={!selectedMode}
                                onClick={() => setStep(3)}
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: Mode Config ── */}
                {step === 3 && (
                    <div style={styles.stepContent}>
                        <h1 style={styles.title}>
                            {selectedMode === 'chat_app' && '💬 Chat App Setup'}
                            {selectedMode === 'chat_bot' && '🤖 Chat Bot Setup'}
                            {selectedMode === 'lead_gen' && '📋 Lead Gen Setup'}
                        </h1>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.field}>
                            <label style={styles.label}>Welcome Message</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={welcomeMessage}
                                onChange={(e) => setWelcomeMessage(e.target.value)}
                                placeholder="Hi there! 👋 How can I help?"
                            />
                        </div>

                        {/* ── CHAT BOT CONFIG ── */}
                        {selectedMode === 'chat_bot' && (
                            <>
                                <div style={styles.sectionTitle}>Bot Configuration</div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Bot Name</label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        placeholder="Aria, Max, Support Bot..."
                                        value={botConfig.botName}
                                        onChange={(e) => setBotConfig({ ...botConfig, botName: e.target.value })}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Fallback Message</label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        value={botConfig.fallbackMessage}
                                        onChange={(e) => setBotConfig({ ...botConfig, fallbackMessage: e.target.value })}
                                    />
                                </div>

                                <div style={styles.sectionTitle}>Working Hours</div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Timezone</label>
                                    <select
                                        style={styles.input}
                                        value={workingHours.timezone}
                                        onChange={(e) => setWorkingHours({ ...workingHours, timezone: e.target.value })}
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                                        <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                                    </select>
                                </div>

                                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                    <div key={day} style={styles.dayRow}>
                                        <div
                                            style={{
                                                ...styles.dayCheckbox,
                                                backgroundColor: workingHours[day].enabled ? '#4F46E5' : '#fff',
                                                borderColor: workingHours[day].enabled ? '#4F46E5' : '#D1D5DB',
                                            }}
                                            onClick={() => setWorkingHours({
                                                ...workingHours,
                                                [day]: { ...workingHours[day], enabled: !workingHours[day].enabled }
                                            })}
                                        >
                                            {workingHours[day].enabled && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                                        </div>
                                        <span style={styles.dayLabel}>{day.toUpperCase()}</span>
                                        {workingHours[day].enabled && (
                                            <>
                                                <input
                                                    style={styles.timeInput}
                                                    type="time"
                                                    value={workingHours[day].start}
                                                    onChange={(e) => setWorkingHours({
                                                        ...workingHours,
                                                        [day]: { ...workingHours[day], start: e.target.value }
                                                    })}
                                                />
                                                <span style={{ color: '#6B7280', fontSize: '13px' }}>to</span>
                                                <input
                                                    style={styles.timeInput}
                                                    type="time"
                                                    value={workingHours[day].end}
                                                    onChange={(e) => setWorkingHours({
                                                        ...workingHours,
                                                        [day]: { ...workingHours[day], end: e.target.value }
                                                    })}
                                                />
                                            </>
                                        )}
                                        {!workingHours[day].enabled && (
                                            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Off</span>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ── LEAD GEN CONFIG ── */}
                        {selectedMode === 'lead_gen' && (
                            <>
                                <div style={styles.sectionTitle}>Fields to Collect</div>
                                {[
                                    { key: 'name', label: 'Full Name', required: true },
                                    { key: 'email', label: 'Email Address' },
                                    { key: 'phone', label: 'Phone Number' },
                                    { key: 'company', label: 'Company Name' },
                                ].map(({ key, label, required }) => (
                                    <div key={key} style={styles.toggleRow}>
                                        <div
                                            style={{
                                                ...styles.dayCheckbox,
                                                backgroundColor: leadFields[key] ? '#4F46E5' : required ? '#E5E7EB' : '#fff',
                                                borderColor: leadFields[key] ? '#4F46E5' : '#D1D5DB',
                                                cursor: required ? 'not-allowed' : 'pointer',
                                            }}
                                            onClick={() => !required && setLeadFields({ ...leadFields, [key]: !leadFields[key] })}
                                        >
                                            {leadFields[key] && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                                        </div>
                                        <span style={styles.dayLabel}>{label}</span>
                                        {required && <span style={styles.requiredBadge}>Required</span>}
                                    </div>
                                ))}

                                <div style={{ ...styles.field, marginTop: '16px' }}>
                                    <label style={styles.label}>Custom Question (optional)</label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        placeholder="e.g. What service are you interested in?"
                                        value={leadFields.customQuestion}
                                        onChange={(e) => setLeadFields({ ...leadFields, customQuestion: e.target.value, customEnabled: e.target.value.length > 0 })}
                                    />
                                </div>
                            </>
                        )}

                        {/* ── CHAT APP CONFIG ── */}
                        {selectedMode === 'chat_app' && (
                            <div style={styles.infoBox}>
                                <p style={styles.infoText}>🔒 End-to-end encryption is enabled by default.</p>
                                <p style={styles.infoSub}>Messages are encrypted on the client. Only participants can read them.</p>
                            </div>
                        )}

                        <div style={styles.buttonRow}>
                            <button style={styles.backButton} onClick={() => setStep(2)}>← Back</button>
                            <button
                                style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                                onClick={handleSaveSettings}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save & Continue →'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Embed Code ── */}
                {step === 4 && (
                    <div style={styles.stepContent}>
                        <div style={styles.logo}>🎉</div>
                        <h1 style={styles.title}>You're all set!</h1>
                        <p style={styles.subtitle}>
                            Add this snippet to your website to activate the chat widget.
                        </p>

                        <div style={styles.embedBox}>
                            <pre style={styles.embedCode}>{embedCode}</pre>
                            <button
                                style={{
                                    ...styles.embedCopyButton,
                                    backgroundColor: embedCopied ? '#059669' : '#4F46E5',
                                }}
                                onClick={() => {
                                    navigator.clipboard.writeText(embedCode);
                                    setEmbedCopied(true);
                                }}
                            >
                                {embedCopied ? '✅ Code Copied!' : '📋 Copy Code'}
                            </button>
                        </div>

                        {embedCopied && (
                            <div style={styles.copiedToast}>
                                ✅ Embed code copied! Paste it before &lt;/body&gt; on your website.
                            </div>
                        )}

                        <div style={styles.platformGrid}>
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

                        <button style={styles.button} onClick={() => navigate('/dashboard')}>
                            Open Dashboard →
                        </button>
                    </div>
                )}
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
        maxWidth: '560px',
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
        marginBottom: '32px',
    },
    stepContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1E1B4B',
        margin: '0 0 8px 0',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6B7280',
        marginBottom: '24px',
        textAlign: 'center',
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
        fontWeight: '600',
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
        width: '100%',
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
        fontSize: '16px',
        padding: '0',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
    },
    copiedToast: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 12px',
        borderRadius: '6px',
        marginBottom: '8px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
    },
    infoSub: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '0',
    },
    infoSub2: {
        fontSize: '12px',
        color: '#4F46E5',
        margin: '6px 0 0 0',
        fontWeight: '500',
    },
    embedBox: {
        backgroundColor: '#1E1B4B',
        borderRadius: '10px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '12px',
        overflowX: 'auto',
        position: 'relative',
    },
    embedCode: {
        color: '#A5B4FC',
        fontSize: '12px',
        margin: '0 0 12px 0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
    },
    embedCopyButton: {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    button: {
        padding: '12px 32px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    backButton: {
        padding: '12px 24px',
        backgroundColor: '#fff',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    buttonRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        width: '100%',
        justifyContent: 'flex-end',
    },
    modeGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        marginBottom: '8px',
    },
    modeCard: {
        border: '2px solid #E5E7EB',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    modeIcon: { fontSize: '28px' },
    modeTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1E1B4B',
        margin: 0,
    },
    modeDesc: {
        fontSize: '13px',
        color: '#6B7280',
        margin: 0,
    },
    modeLike: {
        fontSize: '12px',
        color: '#4F46E5',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        alignSelf: 'flex-start',
        marginBottom: '12px',
        marginTop: '8px',
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
    radioRow: {
        display: 'flex',
        gap: '12px',
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
    },
    dayRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        width: '100%',
    },
    dayCheckbox: {
        width: '18px',
        height: '18px',
        minWidth: '18px',
        borderRadius: '4px',
        border: '2px solid #D1D5DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    dayLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        width: '36px',
    },
    timeInput: {
        padding: '4px 8px',
        borderRadius: '6px',
        border: '1px solid #D1D5DB',
        fontSize: '13px',
        color: '#111827',
    },
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px',
        width: '100%',
    },
    requiredBadge: {
        fontSize: '11px',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        padding: '2px 8px',
        borderRadius: '20px',
        fontWeight: '600',
    },
    platformGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        width: '100%',
        marginBottom: '24px',
    },
    platformCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        padding: '12px',
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
};
