import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

// ── Fonts & styles ─────────────────────────────────────────
function useSetupStyles() {
  useEffect(() => {
    if (document.getElementById('auth-fonts')) return;
    const link = document.createElement('link');
    link.id = 'auth-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (document.getElementById('setup-styles')) return;
    const style = document.createElement('style');
    style.id = 'setup-styles';
    style.textContent = `
      @keyframes authFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes authSpin   { to{transform:rotate(360deg)} }
      @keyframes setupPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .setup-card { animation: authFadeUp 0.5s ease both; }
      .setup-input::placeholder { color: #2E2E42; }
      .setup-input:focus { outline: none; }
      .setup-textarea::placeholder { color: #2E2E42; }
      .setup-textarea:focus { outline: none; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ── Defaults ───────────────────────────────────────────────
const DEFAULT_APPEARANCE = {
  companyName: '',
  welcomeMessage: "Hi there! 👋 How can I help you today?",
  primaryColor: '#4F46E5',
  position: 'bottom-right',
};
const DEFAULT_FEATURES   = { leadForm: false, aiReply: false, workingHours: false };
const DEFAULT_LEAD_FIELDS = {
  name: true, email: true, phone: false, company: false,
  customQuestion: '', customEnabled: false,
  services: [], serviceSelectionType: 'checklist',
};
const DEFAULT_AI_CONFIG     = { botName: '', fallbackMessage: "I don't have information on that. Our team will get back to you shortly." };
const DEFAULT_WORKING_HOURS = {
  timezone: 'Asia/Kolkata',
  mon: { enabled: true,  start: '09:00', end: '18:00' },
  tue: { enabled: true,  start: '09:00', end: '18:00' },
  wed: { enabled: true,  start: '09:00', end: '18:00' },
  thu: { enabled: true,  start: '09:00', end: '18:00' },
  fri: { enabled: true,  start: '09:00', end: '18:00' },
  sat: { enabled: false, start: '09:00', end: '18:00' },
  sun: { enabled: false, start: '09:00', end: '18:00' },
};

const loadSaved = () => {
  try { const s = localStorage.getItem('setup_progress'); return s ? JSON.parse(s) : null; }
  catch { return null; }
};

// ── Shared atoms ───────────────────────────────────────────
const Toggle = ({ active, onToggle }) => (
  <div onClick={onToggle} style={{
    width: '44px', height: '24px', borderRadius: '12px',
    backgroundColor: active ? '#C8F135' : 'rgba(255,255,255,0.1)',
    cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0,
  }}>
    <div style={{
      position: 'absolute', top: '2px', width: '20px', height: '20px',
      borderRadius: '50%', backgroundColor: active ? '#080810' : '#555570',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      transition: 'transform 0.2s',
      transform: active ? 'translateX(22px)' : 'translateX(2px)',
    }} />
  </div>
);

const Checkbox = ({ checked, onChange, disabled }) => (
  <div onClick={() => !disabled && onChange(!checked)} style={{
    width: '20px', height: '20px', minWidth: '20px', borderRadius: '5px',
    border: `2px solid ${checked ? '#C8F135' : 'rgba(255,255,255,0.15)'}`,
    backgroundColor: checked ? '#C8F135' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', flexShrink: 0,
  }}>
    {checked && <span style={{ color: '#080810', fontSize: '11px', fontWeight: '800' }}>✓</span>}
  </div>
);

// ── Main component ─────────────────────────────────────────
export default function Setup() {
  const navigate = useNavigate();
  const { token, installId, rehydrateFirebase, agent } = useAgentStore();
  useSetupStyles();

  const saved = (() => {
    const data = loadSaved();
    if (!data) return null;
    if (data.installId && data.installId !== installId) { localStorage.removeItem('setup_progress'); return null; }
    return data;
  })();

  const [step, setStep]       = useState(saved?.step || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [focused, setFocused] = useState('');

  const registeredCompany = agent?.profile?.company || '';
  const [appearance, setAppearance] = useState(saved?.appearance || { ...DEFAULT_APPEARANCE, companyName: registeredCompany });
  const [features,   setFeatures]   = useState(saved?.features   || DEFAULT_FEATURES);
  const [leadFields, setLeadFields] = useState(saved?.leadFields  || DEFAULT_LEAD_FIELDS);
  const [aiConfig]                  = useState(saved?.aiConfig    || DEFAULT_AI_CONFIG);
  const [workingHours]              = useState(saved?.workingHours|| DEFAULT_WORKING_HOURS);
  const [kbQuestion,  setKbQuestion]  = useState('');
  const [kbAnswer,    setKbAnswer]    = useState('');
  const [kbEntries,   setKbEntries]   = useState(saved?.kbEntries || []);
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    localStorage.setItem('setup_progress', JSON.stringify({
      installId, step, appearance, features, leadFields, aiConfig, workingHours, kbEntries,
    }));
  }, [installId, step, appearance, features, leadFields, aiConfig, workingHours, kbEntries]);

  useEffect(() => { if (token) rehydrateFirebase(); }, [token]);

  const handleAddService = () => {
    const t = serviceInput.trim();
    if (!t || leadFields.services.includes(t)) return;
    setLeadFields({ ...leadFields, services: [...leadFields.services, t] });
    setServiceInput('');
  };
  const handleRemoveService = (i) => setLeadFields({ ...leadFields, services: leadFields.services.filter((_, idx) => idx !== i) });

  const handleAddKb = () => {
    const q = kbQuestion.trim(), a = kbAnswer.trim();
    if (!q || !a) return;
    setKbEntries([...kbEntries, { question: q, answer: a }]);
    setKbQuestion(''); setKbAnswer('');
  };
  const handleRemoveKb = (i) => setKbEntries(kbEntries.filter((_, idx) => idx !== i));

  const handleSaveSettings = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/agent/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          appearance, features,
          leadFields: features.leadForm ? leadFields : null,
          aiConfig:   features.aiReply  ? { ...aiConfig, kbEntries } : null,
          workingHours: features.workingHours ? workingHours : null,
          onboardingComplete: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save settings'); return; }

      if (features.aiReply && kbEntries.length > 0) {
        const kbRef = ref(db, `knowledgeBase/${installId}`);
        await Promise.all(kbEntries.map((e) => push(kbRef, { question: e.question, answer: e.answer, createdAt: Date.now() })));
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

  // ── Input style helper ─────────────────────────────────
  const inp = (name) => ({
    ...s.input,
    borderColor: focused === name ? 'rgba(200,241,53,0.45)' : 'rgba(255,255,255,0.08)',
    boxShadow:   focused === name ? '0 0 0 3px rgba(200,241,53,0.07)' : 'none',
  });

  // ── Step header ────────────────────────────────────────
  const steps = [
    { label: 'Welcome',    icon: '👋' },
    { label: 'Appearance', icon: '🎨' },
    { label: 'Features',   icon: '⚡' },
    { label: 'Embed',      icon: '🚀' },
  ];

  return (
    <div style={s.root}>
      <div style={s.dotGrid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.card} className="setup-card">
        <div style={s.topLine} />

        {/* Step indicator */}
        <div style={s.stepRow}>
          {steps.map((st, i) => {
            const n = i + 1;
            const done    = n < step;
            const current = n === step;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    ...s.stepDot,
                    backgroundColor: done ? '#C8F135' : current ? 'rgba(200,241,53,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${done ? '#C8F135' : current ? 'rgba(200,241,53,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: current ? '0 0 14px rgba(200,241,53,0.3)' : 'none',
                  }}>
                    {done
                      ? <span style={{ color: '#080810', fontSize: '11px', fontWeight: '800' }}>✓</span>
                      : <span style={{ fontSize: '13px' }}>{st.icon}</span>
                    }
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: current ? '700' : '400',
                    color: done ? '#C8F135' : current ? '#EDEAF5' : '#3A3A52',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>{st.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    height: '1px', width: '40px', marginBottom: '22px',
                    background: done ? 'rgba(200,241,53,0.4)' : 'rgba(255,255,255,0.07)',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Welcome ───────────────────────────────── */}
        {step === 1 && (
          <div style={s.stepBody}>
            <div style={s.stepIcon}>💬</div>
            <h1 style={s.title}>Welcome to OpenChat!</h1>
            <p style={s.subtitle}>Let's get you set up in a few quick steps.</p>

            <div style={s.warnBox}>
              <span style={{ fontSize: '16px' }}>📧</span>
              <p style={{ fontSize: '13px', color: '#FCD34D', margin: 0, lineHeight: '1.5' }}>
                Please verify your email to fully activate your account. Check your inbox.
              </p>
            </div>

            <div style={s.infoBox}>
              <p style={s.infoLabel}>Your Install ID</p>
              <div style={s.installRow}>
                <code style={s.installCode}>{installId}</code>
                <button style={s.iconBtn} onClick={() => {
                  navigator.clipboard.writeText(installId);
                  setCopied(true); setTimeout(() => setCopied(false), 2000);
                }}>
                  {copied ? '✅' : '📋'}
                </button>
              </div>
              {copied && <div style={s.toast}>✅ Copied to clipboard!</div>}
              <p style={s.infoSub}>Save this — you'll need it to embed the widget on your website.</p>
              <p style={{ ...s.infoSub, color: '#C8F135', marginTop: '4px' }}>💡 Always available in Dashboard → Settings.</p>
            </div>

            <button style={s.btnPrimary} onClick={() => setStep(2)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(200,241,53,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get Started →
            </button>
          </div>
        )}

        {/* ── STEP 2: Appearance ────────────────────────────── */}
        {step === 2 && (
          <div style={s.stepBody}>
            <div style={s.stepIcon}>🎨</div>
            <h1 style={s.title}>Customize your widget</h1>
            <p style={s.subtitle}>How should your chat widget look and feel?</p>

            <div style={s.field}>
              <label style={s.label}>Company / Brand Name</label>
              <input className="setup-input" style={inp('company')}
                type="text" placeholder="Acme Inc."
                value={appearance.companyName}
                onChange={e => setAppearance({ ...appearance, companyName: e.target.value })}
                onFocus={() => setFocused('company')} onBlur={() => setFocused('')} />
            </div>

            <div style={s.field}>
              <label style={s.label}>Welcome Message</label>
              <input className="setup-input" style={inp('welcome')}
                type="text"
                value={appearance.welcomeMessage}
                onChange={e => setAppearance({ ...appearance, welcomeMessage: e.target.value })}
                onFocus={() => setFocused('welcome')} onBlur={() => setFocused('')} />
            </div>

            <div style={s.field}>
              <label style={s.label}>Primary Color</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="color" value={appearance.primaryColor}
                  onChange={e => setAppearance({ ...appearance, primaryColor: e.target.value })}
                  style={s.colorPicker} />
                <span style={{ fontSize: '12px', color: '#6B6B80', fontFamily: 'monospace' }}>{appearance.primaryColor}</span>
                {['#4F46E5', '#C8F135', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(c => (
                  <div key={c} onClick={() => setAppearance({ ...appearance, primaryColor: c })} style={{
                    width: '26px', height: '26px', borderRadius: '50%', backgroundColor: c,
                    cursor: 'pointer', flexShrink: 0,
                    border: appearance.primaryColor === c ? '3px solid #EDEAF5' : '2px solid transparent',
                    transition: 'border 0.15s',
                  }} />
                ))}
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Widget Position</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['bottom-right', 'bottom-left'].map(pos => (
                  <div key={pos} onClick={() => setAppearance({ ...appearance, position: pos })} style={{
                    flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
                    border: `1px solid ${appearance.position === pos ? 'rgba(200,241,53,0.45)' : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: appearance.position === pos ? 'rgba(200,241,53,0.07)' : 'rgba(255,255,255,0.03)',
                    color: appearance.position === pos ? '#C8F135' : '#6B6B80',
                    fontSize: '13px', fontWeight: '600', textAlign: 'center',
                    transition: 'all 0.15s', minHeight: '48px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {pos === 'bottom-right' ? '↘ Bottom Right' : '↙ Bottom Left'}
                  </div>
                ))}
              </div>
            </div>

            <div style={s.btnRow}>
              <button style={s.btnBack} onClick={() => setStep(1)}>← Back</button>
              <button style={s.btnPrimary} onClick={() => setStep(3)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(200,241,53,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Features ──────────────────────────────── */}
        {step === 3 && (
          <div style={s.stepBody}>
            <div style={s.stepIcon}>⚡</div>
            <h1 style={s.title}>Enable features</h1>
            <p style={s.subtitle}>Turn on what you need. Configure details in Settings anytime.</p>

            {error && <div style={s.errorBox}><span>⚠️</span> {error}</div>}

            {/* Lead Form */}
            <div style={s.featureCard}>
              <div style={s.featureHead}>
                <div style={s.featureLeft}>
                  <div style={{ ...s.featureIconWrap, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>📋</div>
                  <div>
                    <p style={s.featureTitle}>Lead Form</p>
                    <p style={s.featureSub}>Collect visitor info when agent is away</p>
                  </div>
                </div>
                <Toggle active={features.leadForm} onToggle={() => setFeatures({ ...features, leadForm: !features.leadForm })} />
              </div>

              {features.leadForm && (
                <div style={s.featureBody}>
                  <p style={s.sectionTag}>Fields to collect</p>
                  {[
                    { key: 'name',    label: 'Full Name',     required: true },
                    { key: 'email',   label: 'Email Address', required: true },
                    { key: 'phone',   label: 'Phone Number' },
                    { key: 'company', label: 'Company Name' },
                  ].map(({ key, label, required }) => (
                    <div key={key} style={s.checkRow}>
                      <Checkbox checked={leadFields[key]} onChange={v => !required && setLeadFields({ ...leadFields, [key]: v })} disabled={required} />
                      <span style={s.checkLabel}>{label}</span>
                      {required && <span style={s.badgeRequired}>Required</span>}
                    </div>
                  ))}

                  <div style={{ ...s.field, marginTop: '16px' }}>
                    <label style={s.label}>Custom Question <span style={s.badgeOptional}>optional</span></label>
                    <input className="setup-input" style={inp('customQ')}
                      type="text" placeholder="e.g. What service are you interested in?"
                      value={leadFields.customQuestion}
                      onChange={e => setLeadFields({ ...leadFields, customQuestion: e.target.value, customEnabled: e.target.value.length > 0 })}
                      onFocus={() => setFocused('customQ')} onBlur={() => setFocused('')} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Services Dropdown <span style={s.badgeOptional}>optional</span></label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="setup-input" style={{ ...inp('service'), flex: 1 }}
                        type="text" placeholder="e.g. Web Design"
                        value={serviceInput}
                        onChange={e => setServiceInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddService()}
                        onFocus={() => setFocused('service')} onBlur={() => setFocused('')} />
                      <button style={s.btnAdd} onClick={handleAddService}>Add</button>
                    </div>
                    {leadFields.services.length > 0 && (
                      <div style={s.tags}>
                        {leadFields.services.map((sv, i) => (
                          <div key={i} style={s.tag}>
                            <span style={s.tagText}>{sv}</span>
                            <button style={s.tagX} onClick={() => handleRemoveService(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Reply */}
            <div style={s.featureCard}>
              <div style={s.featureHead}>
                <div style={s.featureLeft}>
                  <div style={{ ...s.featureIconWrap, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>🤖</div>
                  <div>
                    <p style={s.featureTitle}>AI Auto-reply</p>
                    <p style={s.featureSub}>Bot answers visitors using your knowledge base</p>
                  </div>
                </div>
                <Toggle active={features.aiReply} onToggle={() => setFeatures({ ...features, aiReply: !features.aiReply })} />
              </div>

              {features.aiReply && (
                <div style={s.featureBody}>
                  <p style={s.sectionTag}>Knowledge Base</p>
                  <p style={{ ...s.featureSub, marginBottom: '14px', lineHeight: '1.6' }}>
                    Add Q&A pairs the AI will use to answer visitors. More can be added in Settings.
                  </p>

                  <div style={s.field}>
                    <label style={s.label}>Question</label>
                    <input className="setup-input" style={inp('kbQ')}
                      type="text" placeholder="e.g. What are your working hours?"
                      value={kbQuestion} onChange={e => setKbQuestion(e.target.value)}
                      onFocus={() => setFocused('kbQ')} onBlur={() => setFocused('')} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Answer</label>
                    <textarea className="setup-textarea"
                      style={{ ...inp('kbA'), minHeight: '80px', resize: 'vertical', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      placeholder="e.g. We're open Mon–Fri, 9am to 6pm IST."
                      value={kbAnswer} onChange={e => setKbAnswer(e.target.value)}
                      onFocus={() => setFocused('kbA')} onBlur={() => setFocused('')} />
                  </div>

                  <button style={{ ...s.btnAdd, width: '100%', marginBottom: '14px' }} onClick={handleAddKb}>
                    + Add Entry
                  </button>

                  {kbEntries.length > 0 && kbEntries.map((entry, i) => (
                    <div key={i} style={s.kbEntry}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={s.kbQ}>Q: {entry.question}</p>
                        <p style={s.kbA}>A: {entry.answer}</p>
                      </div>
                      <button style={s.kbX} onClick={() => handleRemoveKb(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Working Hours */}
            <div style={s.featureCard}>
              <div style={s.featureHead}>
                <div style={s.featureLeft}>
                  <div style={{ ...s.featureIconWrap, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>⏰</div>
                  <div>
                    <p style={s.featureTitle}>Working Hours</p>
                    <p style={s.featureSub}>Widget shows offline outside your hours</p>
                  </div>
                </div>
                <Toggle active={features.workingHours} onToggle={() => setFeatures({ ...features, workingHours: !features.workingHours })} />
              </div>
              {features.workingHours && (
                <div style={s.featureBody}>
                  <p style={{ fontSize: '13px', color: '#8888A0', margin: 0, lineHeight: '1.6' }}>
                    ✅ Enabled — configure your full schedule in <span style={{ color: '#C8F135', fontWeight: '600' }}>Settings → Working Hours</span> after setup.
                  </p>
                </div>
              )}
            </div>

            <div style={s.btnRow}>
              <button style={s.btnBack} onClick={() => setStep(2)}>← Back</button>
              <button style={{ ...s.btnPrimary, opacity: loading ? 0.75 : 1 }}
                onClick={handleSaveSettings} disabled={loading}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 28px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(200,241,53,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={s.spinner} /> Saving...</span>
                  : 'Save & Continue →'
                }
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Embed ─────────────────────────────────── */}
        {step === 4 && (
          <div style={s.stepBody}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h1 style={s.title}>You're all set!</h1>
            <p style={s.subtitle}>Add this snippet to your website to activate the chat widget.</p>

            <div style={s.embedBox}>
              <div style={s.embedBar}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
                </div>
                <span style={{ fontSize: '11px', color: '#3A3A52', fontFamily: 'monospace' }}>index.html</span>
              </div>
              <pre style={s.embedCode}>{embedCode}</pre>
              <button style={{ ...s.embedCopyBtn, backgroundColor: embedCopied ? 'rgba(16,185,129,0.15)' : 'rgba(200,241,53,0.1)', borderColor: embedCopied ? 'rgba(16,185,129,0.4)' : 'rgba(200,241,53,0.3)', color: embedCopied ? '#10B981' : '#C8F135' }}
                onClick={() => { navigator.clipboard.writeText(embedCode); setEmbedCopied(true); }}>
                {embedCopied ? '✅ Copied!' : '📋 Copy Code'}
              </button>
            </div>

            {embedCopied && <div style={s.toast}>✅ Paste before &lt;/body&gt; on your website.</div>}

            <div style={s.platformGrid}>
              {[
                { name: 'HTML',      hint: 'Paste before </body> in your HTML file' },
                { name: 'WordPress', hint: 'Plugins → Insert Headers and Footers → Footer' },
                { name: 'Shopify',   hint: 'Themes → Edit Code → theme.liquid → before </body>' },
                { name: 'Wix',       hint: 'Settings → Custom Code → paste before </body>' },
              ].map(({ name, hint }) => (
                <div key={name} style={s.platformCard}>
                  <p style={s.platformName}>{name}</p>
                  <p style={s.platformHint}>{hint}</p>
                </div>
              ))}
            </div>

            <div style={s.btnRow}>
              <button style={s.btnBack} onClick={() => setStep(3)}>← Back</button>
              <button style={s.btnPrimary} onClick={() => navigate('/dashboard')}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(200,241,53,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(200,241,53,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Open Dashboard →
              </button>
            </div>
          </div>
        )}

      </div>

      <p style={s.credit}>© 2026 OpenChat · MIT License</p>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
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
    backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0,
  },
  glow1: {
    position: 'fixed', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
    width: '700px', height: '450px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', top: '72%', left: '60%', transform: 'translate(-50%,-50%)',
    width: '400px', height: '300px',
    background: 'radial-gradient(ellipse, rgba(200,241,53,0.05) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: '560px',
    backgroundColor: '#0F0F1A',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '44px 36px 40px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
    boxSizing: 'border-box',
    maxHeight: '90vh', overflowY: 'auto',
  },
  topLine: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
    width: '55%', height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(200,241,53,0.7), transparent)',
  },
  stepRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    gap: 0, marginBottom: '36px',
  },
  stepDot: {
    width: '40px', height: '40px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s',
  },
  stepBody: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
  },
  stepIcon: { fontSize: '44px', marginBottom: '12px' },
  title: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '24px', fontWeight: '800', color: '#EDEAF5',
    margin: '0 0 8px 0', letterSpacing: '-0.02em', textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px', color: '#6B6B80', margin: '0 0 24px 0',
    textAlign: 'center', lineHeight: '1.6',
  },
  warnBox: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    backgroundColor: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.22)',
    borderRadius: '12px', padding: '12px 16px',
    marginBottom: '20px', width: '100%', boxSizing: 'border-box',
  },
  infoBox: {
    backgroundColor: 'rgba(99,102,241,0.07)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px', padding: '16px',
    marginBottom: '24px', width: '100%', boxSizing: 'border-box',
  },
  infoLabel: {
    fontSize: '11px', fontWeight: '700', color: '#818CF8',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0',
  },
  installRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', padding: '10px 14px', marginBottom: '10px',
    boxSizing: 'border-box',
  },
  installCode: {
    fontSize: '12px', color: '#A5B4FC', wordBreak: 'break-all',
    flex: 1, marginRight: '8px', fontFamily: 'monospace',
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '18px', padding: 0, minHeight: '40px', minWidth: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  toast: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.25)',
    color: '#6EE7B7', fontSize: '12px', fontWeight: '600',
    padding: '8px 14px', borderRadius: '8px',
    marginBottom: '12px', textAlign: 'center',
    width: '100%', boxSizing: 'border-box',
  },
  infoSub: { fontSize: '12px', color: '#55556A', margin: 0, lineHeight: '1.5' },
  field: { width: '100%', marginBottom: '16px' },
  label: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', fontWeight: '600', color: '#6B6B80',
    marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  input: {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '15px', color: '#EDEAF5',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  colorPicker: {
    width: '44px', height: '40px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', padding: '2px',
    backgroundColor: 'transparent',
  },
  btnPrimary: {
    padding: '13px 24px',
    backgroundColor: '#C8F135', color: '#080810',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    minHeight: '48px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 0 16px rgba(200,241,53,0.22)',
    transition: 'opacity 0.2s, box-shadow 0.2s, transform 0.2s',
  },
  btnBack: {
    padding: '13px 20px',
    backgroundColor: 'transparent', color: '#6B6B80',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    fontSize: '15px', fontWeight: '500', cursor: 'pointer',
    minHeight: '48px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  btnRow: {
    display: 'flex', gap: '12px', marginTop: '24px',
    width: '100%', justifyContent: 'flex-end',
  },
  btnAdd: {
    padding: '12px 16px',
    backgroundColor: 'rgba(200,241,53,0.1)',
    border: '1px solid rgba(200,241,53,0.25)',
    color: '#C8F135', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    flexShrink: 0, minHeight: '48px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  featureCard: {
    width: '100%', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', marginBottom: '12px', overflow: 'hidden',
  },
  featureHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', gap: '12px',
  },
  featureLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 },
  featureIconWrap: {
    width: '40px', height: '40px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', flexShrink: 0,
  },
  featureTitle: { fontSize: '15px', fontWeight: '700', color: '#EDEAF5', margin: '0 0 2px 0' },
  featureSub:   { fontSize: '12px', color: '#55556A', margin: 0 },
  featureBody: {
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  sectionTag: {
    fontSize: '10px', fontWeight: '700', color: '#C8F135',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: '12px', display: 'block',
  },
  checkRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', width: '100%' },
  checkLabel: { fontSize: '14px', fontWeight: '500', color: '#AAAABC', flex: 1 },
  badgeRequired: {
    fontSize: '10px', backgroundColor: 'rgba(99,102,241,0.15)',
    color: '#818CF8', padding: '2px 8px', borderRadius: '10px', fontWeight: '700',
  },
  badgeOptional: {
    fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#55556A', padding: '2px 8px', borderRadius: '10px', fontWeight: '500',
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  tag: {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(200,241,53,0.08)',
    border: '1px solid rgba(200,241,53,0.22)',
    borderRadius: '20px', padding: '5px 10px 5px 12px',
  },
  tagText: { fontSize: '12px', fontWeight: '600', color: '#C8F135' },
  tagX: {
    background: 'none', border: 'none', color: '#C8F135',
    cursor: 'pointer', fontSize: '11px', padding: 0, opacity: 0.7,
    minHeight: '22px', minWidth: '22px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  kbEntry: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px', padding: '12px 14px', marginBottom: '8px',
  },
  kbQ: { fontSize: '12px', fontWeight: '700', color: '#EDEAF5', margin: '0 0 4px 0', wordBreak: 'break-word' },
  kbA: { fontSize: '12px', color: '#6B6B80', margin: 0, wordBreak: 'break-word' },
  kbX: {
    background: 'none', border: 'none', color: '#55556A',
    cursor: 'pointer', fontSize: '13px', padding: 0,
    flexShrink: 0, minHeight: '28px', minWidth: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  embedBox: {
    backgroundColor: '#09090F',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', overflow: 'hidden',
    width: '100%', boxSizing: 'border-box', marginBottom: '12px',
  },
  embedBar: {
    padding: '10px 16px', background: '#06060C',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  embedCode: {
    color: '#818CF8', fontSize: '12px', margin: 0,
    padding: '16px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: '1.7',
  },
  embedCopyBtn: {
    width: '100%', padding: '12px', border: '1px solid',
    borderRadius: '0', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', minHeight: '44px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.2s',
  },
  platformGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '10px', width: '100%', marginBottom: '8px',
  },
  platformCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px', padding: '12px 14px',
  },
  platformName: { fontSize: '13px', fontWeight: '700', color: '#EDEAF5', margin: '0 0 4px 0' },
  platformHint: { fontSize: '11px', color: '#55556A', margin: 0, lineHeight: '1.5' },
  errorBox: {
    width: '100%', boxSizing: 'border-box',
    backgroundColor: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.22)',
    color: '#FCA5A5', padding: '10px 14px',
    borderRadius: '10px', fontSize: '13px',
    marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(8,8,16,0.25)', borderTopColor: '#080810',
    borderRadius: '50%', display: 'inline-block',
    animation: 'authSpin 0.7s linear infinite',
  },
  credit: {
    position: 'relative', zIndex: 1,
    marginTop: '20px', fontSize: '12px', color: '#2A2A3A',
  },
};