import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// ── Inject styles ──────────────────────────────────────────
function useDocsStyles() {
  useEffect(() => {
    if (document.getElementById('docs-styles')) return;
    const el = document.createElement('style');
    el.id = 'docs-styles';
    el.textContent = `
      @keyframes docsFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .docs-main { animation: docsFadeIn 0.25s ease both; }
      .docs-platform-btn:hover { background-color: rgba(255,255,255,0.05) !important; }
      .docs-copy-btn:hover { box-shadow: 0 0 20px rgba(200,241,53,0.4) !important; transform: translateY(-1px) !important; }
      .docs-step-num { transition: background-color 0.2s; }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── Platforms ──────────────────────────────────────────────
const PLATFORMS = [
  {
    id: 'html',
    label: 'Plain HTML',
    icon: '🌐',
    description: 'Any static website',
    color: '#818CF8',
    steps: [
      'Open your HTML file',
      'Paste the code just before the closing </body> tag',
      'Save and refresh your page',
    ],
  },
  {
    id: 'custom',
    label: 'React / Next.js',
    icon: '⚛️',
    description: 'React, Next.js, Vue etc.',
    color: '#22D3EE',
    steps: [
      'Create a new file e.g. OpenChatWidget.jsx',
      'Paste the component code below',
      'Import and render it in your layout or _app.jsx',
    ],
    customCode: true,
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    icon: '🔵',
    description: 'Self-hosted or .com',
    color: '#60A5FA',
    steps: [
      'Go to your WordPress Admin Dashboard',
      'Install the plugin "Insert Headers and Footers"',
      'Navigate to Settings → Insert Headers and Footers',
      'Paste the code in the Footer section',
      'Click Save',
    ],
  },
  {
    id: 'shopify',
    label: 'Shopify',
    icon: '🛍️',
    description: 'Shopify stores',
    color: '#34D399',
    steps: [
      'Go to your Shopify Admin',
      'Navigate to Online Store → Themes',
      'Click Actions → Edit Code on your active theme',
      'Open theme.liquid from the Layout folder',
      'Paste the code just before </body>',
      'Click Save',
    ],
  },
  {
    id: 'wix',
    label: 'Wix',
    icon: '🟡',
    description: 'Wix website builder',
    color: '#FCD34D',
    steps: [
      'Go to your Wix Dashboard',
      'Click Settings in the left sidebar',
      'Select Custom Code',
      'Click + Add Custom Code',
      'Paste the code and set placement to Body - end',
      'Click Apply',
    ],
  },
  {
    id: 'webflow',
    label: 'Webflow',
    icon: '🔷',
    description: 'Webflow projects',
    color: '#67E8F9',
    steps: [
      'Open your Webflow project',
      'Go to Project Settings → Custom Code',
      'Paste the code in the Footer Code section',
      'Click Save Changes and Publish your site',
    ],
  },
];

// ── Embed code generator ───────────────────────────────────
const getEmbedCode = (installId, platform) => {
  if (platform === 'custom') {
    return `// OpenChatWidget.jsx
import { useEffect } from 'react';

export default function OpenChatWidget() {
  useEffect(() => {
    window.OpenChatConfig = {
      installId: "${installId}",
      // primaryColor: "#4F46E5",
      // position: "bottom-right",
      // companyName: "Your Company",
    };

    const script = document.createElement('script');
    script.id = 'oc-widget-script';
script.src = 'https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.1/widget/dist/widget.js';
script.async = true;
document.body.appendChild(script);

return () => {
  document.getElementById('oc-widget-script')?.remove();
  document.getElementById('openchat-bubble')?.remove();
  document.getElementById('openchat-window')?.remove();
  document.getElementById('oc-styles')?.remove();
};
  }, []);

  return null;
}

// In your _app.jsx or layout.jsx:
// <OpenChatWidget />`;
  }

  return `<script>
  window.OpenChatConfig = {
    installId: "${installId}",
    // Optional:
    // primaryColor: "#4F46E5",
    // position: "bottom-right",  // or "bottom-left"
    // companyName: "Your Company",
    // welcomeMessage: "Hi there! 👋"
  }
</script>
<script
  src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js"
  defer>
</script>`;
};

// ── Simple syntax highlight ────────────────────────────────
const highlight = (code) => {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // strings
    .replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color:#86EFAC">$1$2$3</span>')
    // comments
    .replace(/(\/\/[^\n]*)/g, '<span style="color:#4B5563;font-style:italic">$1</span>')
    // keywords
    .replace(/\b(import|export|default|from|return|const|let|var|function|useEffect|null|true|false)\b/g, '<span style="color:#C084FC">$1</span>')
    // html tags
    .replace(/(&lt;\/?script[^&]*&gt;)/g, '<span style="color:#7DD3FC">$1</span>')
    // property names
    .replace(/(\w+)(?=\s*:)/g, '<span style="color:#FCA5A5">$1</span>');
};

// ── Main component ─────────────────────────────────────────
export default function Docs({ installId }) {
  const isMobile = useIsMobile();
  useDocsStyles();

  const [selectedPlatform, setSelectedPlatform] = useState('html');
  const [copied, setCopied] = useState(false);

  const platform = PLATFORMS.find(p => p.id === selectedPlatform);
  const embedCode = getEmbedCode(installId, selectedPlatform);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.headerTitle}>Embed Widget</p>
          <p style={s.headerSub}>Add OpenChat to your website in minutes</p>
        </div>
        <div style={s.idBadge}>
          <span style={s.idLabel}>Your Install ID</span>
          <code style={s.idCode}>{installId}</code>
        </div>
      </div>

      {/* Body */}
      <div style={{ ...s.body, flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Sidebar */}
        <div style={{
          ...s.sidebar,
          width: isMobile ? '100%' : '210px',
          minWidth: isMobile ? 'unset' : '210px',
          borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
          borderBottom: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
          flexDirection: isMobile ? 'row' : 'column',
          flexWrap: isMobile ? 'wrap' : 'unset',
          padding: isMobile ? '12px 16px' : '16px 10px',
        }}>
          {!isMobile && <p style={s.sidebarTitle}>Platform</p>}
          {PLATFORMS.map(p => (
            <button key={p.id} className="docs-platform-btn"
              style={{
                ...s.platformBtn,
                backgroundColor: selectedPlatform === p.id ? 'rgba(200,241,53,0.07)' : 'transparent',
                border: `1px solid ${selectedPlatform === p.id ? 'rgba(200,241,53,0.3)' : 'transparent'}`,
              }}
              onClick={() => { setSelectedPlatform(p.id); setCopied(false); }}>
              <span style={{ fontSize: isMobile ? '16px' : '18px', flexShrink: 0 }}>{p.icon}</span>
              {!isMobile && (
                <div style={s.platformInfo}>
                  <span style={{ ...s.platformLabel, color: selectedPlatform === p.id ? '#C8F135' : '#AAAABC' }}>
                    {p.label}
                  </span>
                  <span style={s.platformDesc}>{p.description}</span>
                </div>
              )}
              {isMobile && (
                <span style={{ fontSize: '10px', color: selectedPlatform === p.id ? '#C8F135' : '#55556A', fontWeight: '600' }}>
                  {p.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main */}
        <div key={selectedPlatform} className="docs-main" style={s.main}>

          {/* How to install */}
          <div style={s.card}>
            <div style={s.cardHead}>
              <div style={{ ...s.platformDot, backgroundColor: platform.color }} />
              <p style={s.cardTitle}>How to install on {platform.label}</p>
            </div>
            <div style={s.steps}>
              {platform.steps.map((step, i) => (
                <div key={i} style={s.stepRow}>
                  <div className="docs-step-num" style={{
                    ...s.stepNum,
                    backgroundColor: `${platform.color}18`,
                    color: platform.color,
                    border: `1px solid ${platform.color}40`,
                  }}>{i + 1}</div>
                  <span style={s.stepText}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code block */}
          <div style={s.card}>
            <div style={s.codeHead}>
              <p style={s.cardTitle}>
                {selectedPlatform === 'custom' ? '⚛️ React / Next.js Component' : '📋 Embed Code'}
              </p>
              <button className="docs-copy-btn"
                style={{
                  ...s.copyBtn,
                  backgroundColor: copied ? 'rgba(16,185,129,0.12)' : '#C8F135',
                  color: copied ? '#10B981' : '#080810',
                  border: copied ? '1px solid rgba(16,185,129,0.3)' : 'none',
                  boxShadow: copied ? 'none' : '0 0 14px rgba(200,241,53,0.2)',
                }}
                onClick={handleCopy}>
                {copied ? '✅ Copied!' : '📋 Copy Code'}
              </button>
            </div>

            {/* Code */}
            <div style={s.codeWrap}>
              <div style={s.codeBar}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#FF5F57', '#FFBD2E', '#28CA41'].map(c => (
                    <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </div>
                <span style={s.codeFileName}>
                  {selectedPlatform === 'custom' ? 'OpenChatWidget.jsx' : 'index.html'}
                </span>
              </div>
              <pre style={s.pre}>
                <code dangerouslySetInnerHTML={{ __html: highlight(embedCode) }} style={s.code} />
              </pre>
            </div>
          </div>

          {/* Tips */}
          <div style={s.tipsCard}>
            <p style={s.tipsTitle}>💡 Tips</p>
            <div style={s.tipsList}>
              {[
                'The widget loads asynchronously — it won\'t slow down your page or affect Core Web Vitals.',
                'Customize primaryColor to match your brand.',
                'Use position: "bottom-left" if your site has elements in the bottom-right corner.',
                'The widget remembers returning visitors and their conversation history.',
              ].map((tip, i) => (
                <div key={i} style={s.tipRow}>
                  <span style={s.tipDot}>→</span>
                  <span style={s.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  root: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    backgroundColor: 'transparent',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  // Header
  header: {
    padding: '20px 24px', flexShrink: 0,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
  },
  headerTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px', fontWeight: '800', color: '#EDEAF5',
    margin: '0 0 2px 0', letterSpacing: '-0.02em',
  },
  headerSub: { fontSize: '13px', color: '#3A3A52', margin: 0 },
  idBadge: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  idLabel: { fontSize: '10px', color: '#3A3A52', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' },
  idCode: {
    fontSize: '12px', fontWeight: '700', color: '#818CF8',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    padding: '4px 10px', borderRadius: '6px',
  },

  // Body
  body: { flex: 1, display: 'flex', overflow: 'auto' },

  // Sidebar
  sidebar: {
    display: 'flex', flexDirection: 'column', gap: '3px',
    overflowY: 'auto', flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: '10px', fontWeight: '700', color: '#3A3A52',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    margin: '0 0 8px 6px',
  },
  platformBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: '8px',
    cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'background-color 0.15s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  platformInfo: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  platformLabel: { fontSize: '13px', fontWeight: '600', lineHeight: 1.3, transition: 'color 0.15s' },
  platformDesc: { fontSize: '10px', color: '#3A3A52', lineHeight: 1.3, marginTop: '1px' },

  // Main
  main: {
    flex: 1, padding: '20px', overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },

  // Card
  card: {
    backgroundColor: '#0F0F1A',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', padding: '20px',
  },
  cardHead: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' },
  platformDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  cardTitle: {
    fontSize: '14px', fontWeight: '700', color: '#EDEAF5', margin: 0,
  },

  // Steps
  steps: { display: 'flex', flexDirection: 'column', gap: '12px' },
  stepRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  stepNum: {
    width: '26px', height: '26px', minWidth: '26px',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '12px', fontWeight: '800',
    marginTop: '1px',
  },
  stepText: { fontSize: '14px', color: '#8888A0', lineHeight: '1.6' },

  // Code block
  codeHead: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '14px',
    flexWrap: 'wrap', gap: '8px',
  },
  copyBtn: {
    padding: '8px 18px', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.2s',
  },
  codeWrap: {
    backgroundColor: '#06060C',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px', overflow: 'hidden',
  },
  codeBar: {
    padding: '9px 14px', background: '#09090F',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  codeFileName: { fontSize: '11px', color: '#3A3A52', fontFamily: 'monospace' },
  pre: { margin: 0, padding: '16px', overflowX: 'auto' },
  code: {
    fontSize: '12.5px', lineHeight: '1.75',
    fontFamily: '"Fira Code","Cascadia Code","Consolas",monospace',
    whiteSpace: 'pre', color: '#C0C0D8',
  },

  // Tips
  tipsCard: {
    backgroundColor: 'rgba(200,241,53,0.04)',
    border: '1px solid rgba(200,241,53,0.15)',
    borderRadius: '14px', padding: '18px 20px',
  },
  tipsTitle: { fontSize: '13px', fontWeight: '700', color: '#C8F135', margin: '0 0 12px 0' },
  tipsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tipRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  tipDot: { color: '#C8F135', fontWeight: '700', flexShrink: 0, fontSize: '12px', marginTop: '2px' },
  tipText: { fontSize: '13px', color: '#6B6B80', lineHeight: '1.6' },
};