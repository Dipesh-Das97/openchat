import { useState, useEffect } from 'react';
import useAgentStore from '../store/agentStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { ref, onValue, push, remove } from 'firebase/database';
import { db } from '../firebase';

// ── Tab config ─────────────────────────────────────────────
const TABS = [
    { id: 'appearance', label: '🎨 Appearance' },
    { id: 'leadForm',   label: '📋 Lead Form' },
    { id: 'aiConfig',   label: '🤖 AI Config' },
    { id: 'hours',      label: '⏰ Hours' },
    { id: 'profile',    label: '👤 Profile' },
];

export default function Settings({ installId, token, agent }) {
    const setAgent = useAgentStore((state) => state.setAgent);
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState('appearance');

    // ── Shared feedback state ──────────────────────────────
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const showSuccess = (msg) => {
        setSuccess(msg);
        setError('');
        setTimeout(() => setSuccess(''), 3000);
    };
    const showError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    // ── Appearance state ───────────────────────────────────
    const [appearance, setAppearance] = useState({
        companyName: agent?.appearance?.companyName || '',
        welcomeMessage: agent?.appearance?.welcomeMessage || "Hi there! 👋 How can I help you today?",
        primaryColor: agent?.appearance?.primaryColor || '#4F46E5',
        position: agent?.appearance?.position || 'bottom-right',
    });

    // ── Lead Form state ────────────────────────────────────
    const [leadFields, setLeadFields] = useState({
        name: agent?.leadFields?.name ?? true,
        email: agent?.leadFields?.email ?? true,
        phone: agent?.leadFields?.phone ?? false,
        company: agent?.leadFields?.company ?? false,
        customQuestion: agent?.leadFields?.customQuestion || '',
        customEnabled: agent?.leadFields?.customEnabled ?? false,
    });
    const [serviceInput, setServiceInput] = useState('');
    const [services, setServices] = useState(agent?.leadFields?.services || []);
    const [serviceSelectionType, setServiceSelectionType] = useState(
        agent?.leadFields?.serviceSelectionType || 'checklist'
    );

    // ── AI Config state ────────────────────────────────────
    const [aiConfig, setAiConfig] = useState({
        botName: agent?.aiConfig?.botName || '',
        fallbackMessage: agent?.aiConfig?.fallbackMessage || "I don't have information on that. Our team will get back to you shortly.",
    });
    const [kbQuestion, setKbQuestion] = useState('');
    const [kbAnswer, setKbAnswer] = useState('');
    const [kbEntries, setKbEntries] = useState([]);
    const [kbLoaded, setKbLoaded] = useState(false);
    const [savingKb, setSavingKb] = useState(false);

    // ── Working Hours state ────────────────────────────────
    const [workingHours, setWorkingHours] = useState(
        agent?.workingHours || {
            timezone: 'Asia/Kolkata',
            mon: { enabled: true,  start: '09:00', end: '18:00' },
            tue: { enabled: true,  start: '09:00', end: '18:00' },
            wed: { enabled: true,  start: '09:00', end: '18:00' },
            thu: { enabled: true,  start: '09:00', end: '18:00' },
            fri: { enabled: true,  start: '09:00', end: '18:00' },
            sat: { enabled: false, start: '09:00', end: '18:00' },
            sun: { enabled: false, start: '09:00', end: '18:00' },
        }
    );

    // ── Profile state ──────────────────────────────────────
    const [profile, setProfile] = useState({
        name:    agent?.profile?.name    || '',
        company: agent?.profile?.company || '',
        website: agent?.profile?.website || '',
    });

    // ── KB Firebase listener ───────────────────────────────
    useEffect(() => {
        if (!agent?.features?.aiReply || !installId) return;
        const kbRef = ref(db, `knowledgeBase/${installId}`);
        const unsub = onValue(kbRef, (snap) => {
            if (!snap.exists()) { setKbEntries([]); setKbLoaded(true); return; }
            const entries = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
            setKbEntries(entries);
            setKbLoaded(true);
        });
        return () => unsub();
    }, [agent?.features?.aiReply, installId]);

    // ── Save helpers ───────────────────────────────────────
    const saveSettings = async (payload) => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/agent/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) { showError(data.error || 'Failed to save'); return false; }
            return data;
        } catch {
            showError('Something went wrong.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAppearance = async () => {
        const data = await saveSettings({ appearance });
        if (data) {
            setAgent({ ...agent, appearance });
            showSuccess('Appearance saved!');
        }
    };

    const handleSaveLeadForm = async () => {
        const payload = {
            leadFields: {
                ...leadFields,
                services,
                serviceSelectionType,
            },
        };
        const data = await saveSettings(payload);
        if (data) {
            setAgent({ ...agent, leadFields: payload.leadFields });
            showSuccess('Lead form settings saved!');
        }
    };

    const handleSaveAiConfig = async () => {
        const data = await saveSettings({ aiConfig });
        if (data) {
            setAgent({ ...agent, aiConfig });
            showSuccess('AI config saved!');
        }
    };

    const handleSaveWorkingHours = async () => {
        const data = await saveSettings({ workingHours });
        if (data) {
            setAgent({ ...agent, workingHours });
            showSuccess('Working hours saved!');
        }
    };

    const handleSaveProfile = async () => {
        const data = await saveSettings({ profile });
        if (data) {
            setAgent({ ...agent, profile: { ...agent?.profile, ...profile } });
            showSuccess('Profile saved!');
        }
    };

    // ── KB actions ─────────────────────────────────────────
    const handleAddKbEntry = async () => {
        const q = kbQuestion.trim();
        const a = kbAnswer.trim();
        if (!q || !a) return;
        setSavingKb(true);
        try {
            await push(ref(db, `knowledgeBase/${installId}`), {
                question: q, answer: a, createdAt: Date.now(),
            });
            setKbQuestion('');
            setKbAnswer('');
            showSuccess('Entry added!');
        } catch {
            showError('Failed to add entry.');
        } finally {
            setSavingKb(false);
        }
    };

    const handleRemoveKbEntry = async (id) => {
        try {
            await remove(ref(db, `knowledgeBase/${installId}/${id}`));
        } catch {
            showError('Failed to remove entry.');
        }
    };

    // ── Services ───────────────────────────────────────────
    const handleAddService = () => {
        const trimmed = serviceInput.trim();
        if (!trimmed || services.includes(trimmed)) return;
        setServices([...services, trimmed]);
        setServiceInput('');
    };

    const handleRemoveService = (index) => {
        setServices(services.filter((_, i) => i !== index));
    };

    // ── Shared sub-components ──────────────────────────────
    const Feedback = () => (
        <>
            {error   && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
        </>
    );

    const SaveBtn = ({ onClick, label = 'Save Changes' }) => (
        <button
            style={{ ...styles.saveBtn, width: isMobile ? '100%' : 'auto', opacity: saving ? 0.7 : 1 }}
            onClick={onClick}
            disabled={saving}
        >
            {saving ? 'Saving...' : label}
        </button>
    );

    const Toggle = ({ active, onToggle }) => (
        <div
            onClick={onToggle}
            style={{
                width: '44px', height: '24px', borderRadius: '12px',
                backgroundColor: active ? '#4F46E5' : '#D1D5DB',
                cursor: 'pointer', position: 'relative',
                transition: 'background-color 0.2s', flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute', top: '2px', width: '20px', height: '20px',
                borderRadius: '50%', backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                transform: active ? 'translateX(22px)' : 'translateX(2px)',
            }} />
        </div>
    );

    const Checkbox = ({ checked, onChange, disabled }) => (
        <div
            onClick={() => !disabled && onChange(!checked)}
            style={{
                width: '20px', height: '20px', minWidth: '20px',
                borderRadius: '4px',
                border: `2px solid ${checked ? '#4F46E5' : '#D1D5DB'}`,
                backgroundColor: checked ? '#4F46E5' : disabled ? '#F3F4F6' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
            }}
        >
            {checked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
        </div>
    );

    // ── Tab renders ────────────────────────────────────────

    const renderAppearance = () => (
        <div>
            <Feedback />
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
                                width: '26px', height: '26px', borderRadius: '50%',
                                backgroundColor: color, cursor: 'pointer',
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
            <SaveBtn onClick={handleSaveAppearance} />
        </div>
    );

    const renderLeadForm = () => {
        if (!agent?.features?.leadForm) {
            return (
                <div style={styles.disabledNotice}>
                    <p style={styles.disabledText}>Lead Form is not enabled.</p>
                    <p style={styles.disabledSub}>Enable it in Setup or turn it on in your feature flags.</p>
                </div>
            );
        }
        return (
            <div>
                <Feedback />
                <p style={styles.tabSub}>Choose which fields to show on the lead capture form.</p>

                {[
                    { key: 'name',    label: 'Full Name',    required: true },
                    { key: 'email',   label: 'Email Address', required: true },
                    { key: 'phone',   label: 'Phone Number' },
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

                <div style={{ ...styles.field, marginTop: '20px' }}>
                    <label style={styles.label}>
                        Custom Question <span style={styles.optionalBadge}>optional</span>
                    </label>
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
                    <label style={styles.label}>
                        Services Dropdown <span style={styles.optionalBadge}>optional</span>
                    </label>
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
                    {services.length > 0 && (
                        <div style={styles.tagsContainer}>
                            {services.map((s, i) => (
                                <div key={i} style={styles.tag}>
                                    <span style={styles.tagText}>{s}</span>
                                    <button
                                        style={styles.tagRemove}
                                        onClick={() => handleRemoveService(i)}
                                        aria-label={`Remove ${s}`}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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

                <SaveBtn onClick={handleSaveLeadForm} />
            </div>
        );
    };

    const renderAiConfig = () => {
        if (!agent?.features?.aiReply) {
            return (
                <div style={styles.disabledNotice}>
                    <p style={styles.disabledText}>AI Auto-reply is not enabled.</p>
                    <p style={styles.disabledSub}>Enable it in Setup or turn it on in your feature flags.</p>
                </div>
            );
        }
        return (
            <div>
                <Feedback />
                <div style={styles.field}>
                    <label style={styles.label}>Bot Name</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Aria, Max, Support Bot..."
                        value={aiConfig.botName}
                        onChange={(e) => setAiConfig({ ...aiConfig, botName: e.target.value })}
                    />
                </div>
                <div style={{ ...styles.field }}>
                    <label style={styles.label}>Fallback Message</label>
                    <textarea
                        style={{ ...styles.input, minHeight: '72px', resize: 'vertical', fontFamily: 'inherit' }}
                        value={aiConfig.fallbackMessage}
                        onChange={(e) => setAiConfig({ ...aiConfig, fallbackMessage: e.target.value })}
                    />
                    <p style={styles.fieldHint}>Sent when the AI can't find an answer in the knowledge base.</p>
                </div>
                <SaveBtn onClick={handleSaveAiConfig} label="Save AI Config" />

                <div style={styles.divider} />

                <p style={styles.sectionLabel}>Knowledge Base</p>
                <p style={styles.tabSub}>Add Q&A pairs the AI will use to answer visitors.</p>

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
                        style={{ ...styles.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder="e.g. We're open Mon–Fri, 9am to 6pm IST."
                        value={kbAnswer}
                        onChange={(e) => setKbAnswer(e.target.value)}
                    />
                </div>
                <button
                    style={{ ...styles.saveBtn, opacity: savingKb ? 0.7 : 1, marginBottom: '20px', width: isMobile ? '100%' : 'auto' }}
                    onClick={handleAddKbEntry}
                    disabled={savingKb}
                >
                    {savingKb ? 'Adding...' : '+ Add Entry'}
                </button>

                {kbLoaded && kbEntries.length === 0 && (
                    <p style={styles.fieldHint}>No entries yet. Add your first FAQ above!</p>
                )}
                {kbEntries.map((entry) => (
                    <div key={entry.id} style={styles.kbEntry}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={styles.kbQ}>Q: {entry.question}</p>
                            <p style={styles.kbA}>A: {entry.answer}</p>
                        </div>
                        <button
                            style={styles.kbRemove}
                            onClick={() => handleRemoveKbEntry(entry.id)}
                            aria-label="Remove entry"
                        >✕</button>
                    </div>
                ))}
            </div>
        );
    };

    const renderWorkingHours = () => {
        if (!agent?.features?.workingHours) {
            return (
                <div style={styles.disabledNotice}>
                    <p style={styles.disabledText}>Working Hours is not enabled.</p>
                    <p style={styles.disabledSub}>Enable it in Setup or turn it on in your feature flags.</p>
                </div>
            );
        }
        return (
            <div>
                <Feedback />
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
                        <Checkbox
                            checked={workingHours[day].enabled}
                            onChange={(val) => setWorkingHours({
                                ...workingHours,
                                [day]: { ...workingHours[day], enabled: val },
                            })}
                        />
                        <span style={styles.dayLabel}>{day.toUpperCase()}</span>
                        {workingHours[day].enabled ? (
                            <>
                                <input
                                    style={styles.timeInput}
                                    type="time"
                                    value={workingHours[day].start}
                                    onChange={(e) => setWorkingHours({
                                        ...workingHours,
                                        [day]: { ...workingHours[day], start: e.target.value },
                                    })}
                                />
                                <span style={{ color: '#6B7280', fontSize: '13px' }}>to</span>
                                <input
                                    style={styles.timeInput}
                                    type="time"
                                    value={workingHours[day].end}
                                    onChange={(e) => setWorkingHours({
                                        ...workingHours,
                                        [day]: { ...workingHours[day], end: e.target.value },
                                    })}
                                />
                            </>
                        ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Off</span>
                        )}
                    </div>
                ))}

                <div style={{ marginTop: '20px' }}>
                    <SaveBtn onClick={handleSaveWorkingHours} label="Save Hours" />
                </div>
            </div>
        );
    };

    const renderProfile = () => (
        <div>
            <Feedback />
            <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                    style={styles.input}
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your name"
                />
            </div>
            <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                    style={{ ...styles.input, backgroundColor: '#F9FAFB', color: '#9CA3AF' }}
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
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    placeholder="Your company name"
                />
            </div>
            <div style={styles.field}>
                <label style={styles.label}>Website</label>
                <input
                    style={styles.input}
                    type="text"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://yoursite.com"
                />
            </div>
            <SaveBtn onClick={handleSaveProfile} />
        </div>
    );

    const tabContent = {
        appearance: renderAppearance,
        leadForm:   renderLeadForm,
        aiConfig:   renderAiConfig,
        hours:      renderWorkingHours,
        profile:    renderProfile,
    };

    // ── Render ─────────────────────────────────────────────
    return (
        <div style={styles.container}>
            <div style={{
                ...styles.content,
                padding: isMobile ? '20px 16px 100px' : '40px 32px',
            }}>
                <h1 style={{ ...styles.pageTitle, fontSize: isMobile ? '20px' : '24px' }}>
                    Settings
                </h1>

                {/* Tab Bar */}
                <div style={{
                    ...styles.tabBar,
                    overflowX: isMobile ? 'auto' : 'visible',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            style={{
                                ...styles.tabBtn,
                                borderBottom: activeTab === tab.id ? '2px solid #4F46E5' : '2px solid transparent',
                                color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSuccess('');
                                setError('');
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={styles.tabContent}>
                    {tabContent[activeTab]?.()}
                </div>
            </div>
        </div>
    );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
    container: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F9FAFB',
    },
    content: {
        maxWidth: '640px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    pageTitle: {
        fontWeight: '800',
        color: '#111827',
        margin: '0 0 24px 0',
    },
    tabBar: {
        display: 'flex',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '28px',
        gap: '4px',
    },
    tabBtn: {
        padding: '10px 14px',
        background: 'none',
        border: 'none',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.15s',
        minHeight: '44px',
    },
    tabContent: {
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '24px',
    },
    tabSub: {
        fontSize: '13px',
        color: '#6B7280',
        margin: '0 0 20px 0',
        lineHeight: '1.5',
    },
    sectionLabel: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: '0 0 8px 0',
    },
    divider: {
        borderTop: '1px solid #E5E7EB',
        margin: '24px 0',
    },
    field: {
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
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
        fontFamily: 'inherit',
    },
    fieldHint: {
        fontSize: '12px',
        color: '#9CA3AF',
        margin: '4px 0 0 0',
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
    checkRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
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
    dayRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
    },
    dayLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        width: '36px',
        flexShrink: 0,
    },
    timeInput: {
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid #D1D5DB',
        fontSize: '13px',
        color: '#111827',
        minHeight: '36px',
    },
    kbEntry: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        backgroundColor: '#F9FAFB',
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
    saveBtn: {
        padding: '12px 24px',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        minHeight: '48px',
        transition: 'opacity 0.15s',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
        boxSizing: 'border-box',
    },
    successBox: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '16px',
        boxSizing: 'border-box',
    },
    disabledNotice: {
        textAlign: 'center',
        padding: '40px 20px',
    },
    disabledText: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#374151',
        margin: '0 0 8px 0',
    },
    disabledSub: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
    },
};