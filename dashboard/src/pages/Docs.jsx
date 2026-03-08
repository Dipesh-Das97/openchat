import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const PLATFORMS = [
    {
        id: 'html',
        label: 'Plain HTML',
        icon: '🌐',
        description: 'Any static website',
        steps: [
            'Open your HTML file',
            'Paste the code just before the closing </body> tag',
            'Save and refresh your page',
        ],
    },
    {
        id: 'custom',
        label: 'Custom Website',
        icon: '⚛️',
        description: 'React, Next.js, Vue, etc.',
        steps: [
            'Create a new file e.g. OpenChat.jsx or openchat.js',
            'Paste the script in a useEffect (React) or mounted hook (Vue)',
            'Import and render the component in your layout or _app.jsx',
        ],
        customCode: true,
    },
    {
        id: 'wordpress',
        label: 'WordPress',
        icon: '🔵',
        description: 'Self-hosted or WordPress.com',
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
        steps: [
            'Open your Webflow project',
            'Go to Project Settings → Custom Code',
            'Paste the code in the Footer Code section',
            'Click Save Changes and Publish your site',
        ],
    },
];

const getEmbedCode = (installId, platform) => {
    const configCode = `<script>
  window.OpenChatConfig = {
    installId: "${installId}",
    // Optional customizations:
    // primaryColor: "#4F46E5",
    // position: "bottom-right",  // or "bottom-left"
    // companyName: "Your Company",
    // welcomeMessage: "Hi there! 👋"
  }
</script>
<script src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js"></script>`;

    if (platform === 'custom') {
        return `// In your React component or layout file:
import { useEffect } from 'react';

export default function OpenChatWidget() {
  useEffect(() => {
    // Set config before loading the script
    window.OpenChatConfig = {
      installId: "${installId}",
      // primaryColor: "#4F46E5",
      // position: "bottom-right",
      // companyName: "Your Company",
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

// Then in your _app.jsx or layout.jsx:
// <OpenChatWidget />`;
    }

    return configCode;
};

export default function Docs({ installId }) {
    const isMobile = useIsMobile();
    const [selectedPlatform, setSelectedPlatform] = useState('html');
    const [copied, setCopied] = useState(false);

    const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
    const embedCode = getEmbedCode(installId, selectedPlatform);

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <p style={styles.headerTitle}>📦 Embed Widget</p>
                    <p style={styles.headerSub}>Add OpenChat to your website in minutes</p>
                </div>
                <div style={styles.installBadge}>
                    <span style={styles.installLabel}>Your Install ID</span>
                    <span style={styles.installId}>{installId}</span>
                </div>
            </div>

            <div style={{ ...styles.body, flexDirection: isMobile ? 'column' : 'row' }}>

                {/* Platform selector */}
                <div style={{ ...styles.sidebar, width: isMobile ? '100%' : '220px', minWidth: isMobile ? 'unset' : '220px' }}>
                    <p style={styles.sidebarTitle}>Choose Platform</p>
                    {PLATFORMS.map((p) => (
                        <button
                            key={p.id}
                            style={{
                                ...styles.platformBtn,
                                backgroundColor: selectedPlatform === p.id ? '#EEF2FF' : 'transparent',
                                borderColor: selectedPlatform === p.id ? '#4F46E5' : 'transparent',
                                color: selectedPlatform === p.id ? '#4F46E5' : '#374151',
                            }}
                            onClick={() => { setSelectedPlatform(p.id); setCopied(false); }}
                        >
                            <span style={styles.platformIcon}>{p.icon}</span>
                            <div style={styles.platformInfo}>
                                <span style={styles.platformLabel}>{p.label}</span>
                                <span style={styles.platformDesc}>{p.description}</span>
                            </div>
                            {selectedPlatform === p.id && <span style={styles.activeArrow}>›</span>}
                        </button>
                    ))}
                </div>

                {/* Main content */}
                <div style={styles.main}>

                    {/* Steps */}
                    <div style={styles.card}>
                        <p style={styles.cardTitle}>
                            {platform.icon} How to install on {platform.label}
                        </p>
                        <ol style={styles.stepsList}>
                            {platform.steps.map((step, i) => (
                                <li key={i} style={styles.stepItem}>
                                    <div style={styles.stepNumber}>{i + 1}</div>
                                    <span style={styles.stepText}>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Code block */}
                    <div style={styles.card}>
                        <div style={styles.codeHeader}>
                            <p style={styles.cardTitle}>
                                {selectedPlatform === 'custom' ? '⚛️ React / Next.js Component' : '📋 Embed Code'}
                            </p>
                            <button
                                style={{
                                    ...styles.copyBtn,
                                    backgroundColor: copied ? '#059669' : '#4F46E5',
                                }}
                                onClick={handleCopy}
                            >
                                {copied ? '✅ Copied!' : '📋 Copy Code'}
                            </button>
                        </div>
                        <pre style={styles.codeBlock}>
                            <code style={styles.code}>{embedCode}</code>
                        </pre>
                    </div>

                    {/* Tips */}
                    <div style={styles.tipsCard}>
                        <p style={styles.tipsTitle}>💡 Tips</p>
                        <div style={styles.tipsList}>
                            {[
                                'The widget loads asynchronously — it won\'t slow down your page.',
                                'Customize primaryColor to match your brand.',
                                'Use position: "bottom-left" if your site has elements in the bottom-right.',
                                'The widget remembers returning visitors across sessions.',
                            ].map((tip, i) => (
                                <div key={i} style={styles.tipItem}>
                                    <span style={styles.tipDot}>•</span>
                                    <span style={styles.tipText}>{tip}</span>
                                </div>
                            ))}
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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: '20px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 2px 0',
    },
    headerSub: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
    },
    installBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px',
    },
    installLabel: {
        fontSize: '11px',
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    installId: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#4F46E5',
        fontFamily: 'monospace',
        backgroundColor: '#EEF2FF',
        padding: '4px 10px',
        borderRadius: '6px',
    },
    body: {
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        gap: '0',
    },
    sidebar: {
        backgroundColor: '#fff',
        borderRight: '1px solid #E5E7EB',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
        flexShrink: 0,
    },
    sidebarTitle: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: '0 0 8px 4px',
    },
    platformBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.15s',
    },
    platformIcon: {
        fontSize: '20px',
        flexShrink: 0,
    },
    platformInfo: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
    },
    platformLabel: {
        fontSize: '13px',
        fontWeight: '600',
        lineHeight: 1.3,
    },
    platformDesc: {
        fontSize: '11px',
        color: '#9CA3AF',
        lineHeight: 1.3,
    },
    activeArrow: {
        fontSize: '18px',
        color: '#4F46E5',
        fontWeight: '700',
        flexShrink: 0,
    },
    main: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '20px',
    },
    cardTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 16px 0',
    },
    stepsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    stepItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    stepNumber: {
        width: '24px',
        height: '24px',
        minWidth: '24px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        marginTop: '1px',
    },
    stepText: {
        fontSize: '14px',
        color: '#374151',
        lineHeight: '1.5',
    },
    codeHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
    },
    copyBtn: {
        padding: '8px 16px',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0,
    },
    codeBlock: {
        backgroundColor: '#0F172A',
        borderRadius: '8px',
        padding: '16px',
        overflowX: 'auto',
        margin: 0,
    },
    code: {
        color: '#E2E8F0',
        fontSize: '12px',
        fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
        lineHeight: '1.6',
        whiteSpace: 'pre',
    },
    tipsCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: '12px',
        border: '1px solid #FDE68A',
        padding: '16px 20px',
    },
    tipsTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#92400E',
        margin: '0 0 10px 0',
    },
    tipsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    tipItem: {
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
    },
    tipDot: {
        color: '#D97706',
        fontWeight: '700',
        flexShrink: 0,
        marginTop: '1px',
    },
    tipText: {
        fontSize: '13px',
        color: '#78350F',
        lineHeight: '1.5',
    },
};