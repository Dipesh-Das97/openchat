import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { db } from '../firebase';
import { ref, onValue, set, get } from 'firebase/database';
import ConversationList from '../components/ConversationList';
import ChatPanel from '../components/ChatWindow';
import VisitorInfo from '../components/VisitorInfo';
import StatusToggle from '../components/StatusToggle';
import Settings from './Settings';
import Docs from './Docs';
import { useIsMobile } from '../hooks/useIsMobile';
import Leads from './Leads';
import { useNotifications } from '../hooks/useNotifications';

// ── Greeting helper ────────────────────────────────────────
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

// ── Mini bar chart ─────────────────────────────────────────
function MiniBarChart({ data, color }) {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div
                        style={{
                            width: '100%',
                            height: `${Math.max((d.value / max) * 52, d.value > 0 ? 4 : 0)}px`,
                            backgroundColor: d.value > 0 ? color : '#F3F4F6',
                            borderRadius: '3px 3px 0 0',
                            transition: 'height 0.3s ease',
                            position: 'relative',
                        }}
                        title={`${d.label}: ${d.value}`}
                    />
                    <span style={{ fontSize: '9px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// ── Home Page ──────────────────────────────────────────────
function HomePage({ agent, isOnline, setIsOnline, installId, conversations, setView }) {
    const agentName = agent?.profile?.name || agent?.name || 'Agent';
    const isMobile = useIsMobile();

    const [range, setRange] = useState('7');
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    // Load leads from Firebase
    useEffect(() => {
        if (!installId) return;
        const leadsRef = ref(db, `leads/${installId}`);
        const unsub = onValue(leadsRef, (snap) => {
            if (!snap.exists()) { setLeads([]); setLoadingLeads(false); return; }
            const data = Object.entries(snap.val()).map(([id, v]) => ({ id, ...v }));
            setLeads(data);
            setLoadingLeads(false);
        });
        return () => unsub();
    }, [installId]);

    const days = parseInt(range);

    // Build date labels for last N days
    const buildDayLabels = (n) => {
        const labels = [];
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push({
                label: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                dateStr: d.toISOString().split('T')[0],
            });
        }
        return labels;
    };

    const dayLabels = buildDayLabels(days);

    // Conversations per day
    const convChartData = dayLabels.map(({ label, dateStr }) => ({
        label: days === 7 ? label.split(' ')[1] : label.split(' ')[1], // just day number
        value: conversations.filter((c) => {
            const d = new Date(c.createdAt).toISOString().split('T')[0];
            return d === dateStr;
        }).length,
    }));

    // Leads per day
    const leadChartData = dayLabels.map(({ label, dateStr }) => ({
        label: label.split(' ')[1],
        value: leads.filter((l) => {
            const d = new Date(l.timestamp).toISOString().split('T')[0];
            return d === dateStr;
        }).length,
    }));

    // Stat cards
    const openChats = conversations.filter((c) => c.status === 'open' || c.status === 'waiting').length;
    const convertedLeads = leads.filter((l) => l.status === 'converted').length;

    const statCards = [
        { icon: '💬', label: 'Total Chats', value: conversations.length, onClick: () => setView('conversations'), color: '#4F46E5' },
        { icon: '🟢', label: 'Open Chats', value: openChats, onClick: () => setView('conversations'), color: '#059669' },
        { icon: '📋', label: 'Total Leads', value: leads.length, onClick: () => setView('leads'), color: '#7C3AED' },
        { icon: '✅', label: 'Converted', value: convertedLeads, onClick: () => setView('leads'), color: '#D97706' },
    ];

    // Leads by service
    const serviceCounts = {};
    leads.forEach((l) => {
        if (!l.services) return;
        l.services.split(',').forEach((s) => {
            const key = s.trim();
            if (key) serviceCounts[key] = (serviceCounts[key] || 0) + 1;
        });
    });
    const serviceEntries = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
    const maxServiceCount = Math.max(...serviceEntries.map(([, v]) => v), 1);

    return (
        <div style={homeStyles.container}>

            {/* Header */}
            <div style={homeStyles.header}>
                <div>
                    <h1 style={homeStyles.greeting}>{getGreeting()}, {agentName}! 👋</h1>
                    <p style={homeStyles.subGreeting}>Here's your overview</p>
                </div>
                <StatusToggle installId={installId} isOnline={isOnline} setIsOnline={setIsOnline} />
            </div>

            {/* Stat Cards */}
            <div style={{ ...homeStyles.statsRow, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
                {statCards.map((card) => (
                    <div key={card.label} style={homeStyles.statCard} onClick={card.onClick}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{card.icon}</span>
                            <span style={{ ...homeStyles.statValue, color: card.color }}>{card.value}</span>
                        </div>
                        <p style={homeStyles.statLabel}>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Range Toggle */}
            <div style={homeStyles.rangeRow}>
                <span style={homeStyles.rangeLabel}>Showing last</span>
                {['7', '30'].map((r) => (
                    <button
                        key={r}
                        style={{
                            ...homeStyles.rangeBtn,
                            backgroundColor: range === r ? '#4F46E5' : '#fff',
                            color: range === r ? '#fff' : '#6B7280',
                            border: `1px solid ${range === r ? '#4F46E5' : '#E5E7EB'}`,
                        }}
                        onClick={() => setRange(r)}
                    >
                        {r} days
                    </button>
                ))}
            </div>

            {/* Charts row */}
            <div style={{ ...homeStyles.chartsRow, flexDirection: isMobile ? 'column' : 'row' }}>

                {/* Conversation trend */}
                <div style={homeStyles.card}>
                    <p style={homeStyles.cardTitle}>💬 Conversations</p>
                    <MiniBarChart data={convChartData} color="#4F46E5" />
                </div>

                {/* Lead trend */}
                <div style={homeStyles.card}>
                    <p style={homeStyles.cardTitle}>📋 Leads</p>
                    <MiniBarChart data={leadChartData} color="#7C3AED" />
                </div>

            </div>

            {/* Leads by service */}
            <div style={homeStyles.card}>
                <p style={homeStyles.cardTitle}>🛠️ Leads by Service</p>
                {serviceEntries.length === 0 ? (
                    <p style={homeStyles.emptyText}>No service data yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {serviceEntries.map(([service, count]) => (
                            <div key={service}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{service}</span>
                                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>{count}</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(count / maxServiceCount) * 100}%`,
                                        backgroundColor: '#7C3AED',
                                        borderRadius: '3px',
                                        transition: 'width 0.4s ease',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={homeStyles.card}>
                <p style={homeStyles.cardTitle}>⚡ Quick Actions</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                        { label: '💬 Open Chats', view: 'conversations' },
                        { label: '📋 View Leads', view: 'leads' },
                        { label: '📦 Embed Widget', view: 'docs' },
                        { label: '⚙️ Settings', view: 'settings' },
                    ].map((action) => (
                        <button key={action.view} style={homeStyles.actionBtn} onClick={() => setView(action.view)}>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

const homeStyles = {
    container: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        backgroundColor: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
    },
    greeting: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 4px 0',
    },
    subGreeting: {
        fontSize: '14px',
        color: '#6B7280',
        margin: 0,
    },
    statsRow: {
        display: 'grid',
        gap: '12px',
    },
    statCard: {
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
    },
    statValue: {
        fontSize: '22px',
        fontWeight: '700',
        margin: 0,
    },
    statLabel: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0,
        fontWeight: '500',
    },
    rangeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    rangeLabel: {
        fontSize: '13px',
        color: '#6B7280',
        marginRight: '4px',
    },
    rangeBtn: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    chartsRow: {
        display: 'flex',
        gap: '16px',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '20px',
    },
    cardTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#374151',
        margin: '0 0 16px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    emptyText: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
        textAlign: 'center',
        padding: '20px 0',
    },
    actionBtn: {
        padding: '10px 18px',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        border: '1px solid #C7D2FE',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        minHeight: '40px',
    },
};

// ── Nav config ─────────────────────────────────────────────
const NAV_ITEMS = [
    { view: 'home', icon: '🏠', label: 'Home' },
    { view: 'conversations', icon: '🗨️', label: 'Chats' },
    { view: 'leads', icon: '📋', label: 'Leads' },
    { view: 'docs', icon: '📦', label: 'Docs' },
    { view: 'settings', icon: '⚙️', label: 'Settings' },
];

// ── Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const { token, installId, agent, logout, setAgent, rehydrateFirebase } = useAgentStore();
    const isMobile = useIsMobile();
    const { requestPermission, notify } = useNotifications();

    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [view, setView] = useState('home');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const prevConversationsRef = useRef({});
    const notifyRef = useRef(notify);
    useEffect(() => { notifyRef.current = notify; }, [notify]);

    // ── Auth guard ─────────────────────────────────────────
    useEffect(() => {
        if (!token) navigate('/login');
    }, [token]);

    // ── Bootstrap ──────────────────────────────────────────
    useEffect(() => {
        if (!token || !installId) return;
        requestPermission();
        rehydrateFirebase();

        fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((profile) => { if (profile) setAgent(profile); })
            .catch(console.error);

        // Initialize presence to offline if it has never been set
        const presRef = ref(db, `agentPresence/${installId}`);
        get(presRef).then((snap) => {
            if (!snap.exists()) {
                set(presRef, { online: false, lastSeen: Date.now() });
            }
        });
    }, [token, installId]);

    // ── Conversations listener ─────────────────────────────
    useEffect(() => {
        if (!installId) return;
        const convRef = ref(db, `conversations/${installId}`);
        const unsub = onValue(convRef, (snap) => {
            if (!snap.exists()) { setConversations([]); return; }

            const data = snap.val();
            const list = Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

            list.forEach((conv) => {
                const prev = prevConversationsRef.current[conv.id];
                if (!prev) return;
                if (conv.lastVisitorMessageAt && conv.lastVisitorMessageAt > (prev.lastVisitorMessageAt || 0)) {
                    notifyRef.current(
                        `New message from ${conv.visitorName || 'Visitor'}`,
                        conv.lastMessagePreview || 'New message',
                        () => { setSelectedId(conv.id); setView('conversations'); }
                    );
                }
            });

            prevConversationsRef.current = Object.fromEntries(list.map((c) => [c.id, c]));
            setConversations(list);
        });
        return () => unsub();
    }, [installId]);

    // ── Presence listener ──────────────────────────────────
    useEffect(() => {
        if (!installId) return;
        const presRef = ref(db, `agentPresence/${installId}`);
        const unsub = onValue(presRef, (snap) => {
            setIsOnline(snap.val()?.online || false);
        });
        return () => unsub();
    }, [installId]);

    const selectedConversation = conversations.find((c) => c.id === selectedId);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleSelectConversation = (id) => {
        setSelectedId(id);
        if (isMobile) setView('chat');
    };

    const handleBackToList = () => {
        setSelectedId(null);
        setView('conversations');
    };

    // ── Logout Modal ───────────────────────────────────────
    const LogoutModal = () => (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <div style={styles.modalIcon}>↩️</div>
                <h3 style={styles.modalTitle}>Sign out?</h3>
                <p style={styles.modalSub}>You'll need to sign in again to access your dashboard.</p>
                <div style={styles.modalButtons}>
                    <button style={styles.modalCancel} onClick={() => setShowLogoutModal(false)}>
                        Cancel
                    </button>
                    <button style={styles.modalConfirm} onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );

    // ── Mobile Layout ──────────────────────────────────────
    if (isMobile) {
        return (
            <div style={styles.mobileContainer}>
                <div style={styles.mobileContent}>

                    {view === 'home' && (
                        <div style={styles.mobilePage}>
                            <div style={styles.mobileHeader}>
                                <p style={styles.mobileHeaderTitle}>OpenChat</p>
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                <HomePage
                                    agent={agent}
                                    isOnline={isOnline}
                                    setIsOnline={setIsOnline}
                                    installId={installId}
                                    conversations={conversations}
                                    setView={setView}
                                />
                            </div>
                        </div>
                    )}

                    {view === 'conversations' && (
                        <div style={styles.mobilePage}>
                            <div style={styles.mobileHeader}>
                                <p style={styles.mobileHeaderTitle}>Chats</p>
                                <StatusToggle
                                    installId={installId}
                                    isOnline={isOnline}
                                    setIsOnline={setIsOnline}
                                />
                            </div>
                            <ConversationList
                                conversations={conversations}
                                selectedId={selectedId}
                                onSelect={handleSelectConversation}
                            />
                        </div>
                    )}

                    {view === 'chat' && selectedId && (
                        <div style={styles.mobilePage}>
                            <div style={styles.mobileChatHeader}>
                                <button style={styles.backBtn} onClick={handleBackToList}>← Back</button>
                                <p style={styles.mobileChatName}>
                                    {selectedConversation?.visitorName || 'Visitor'}
                                </p>
                                <span style={{
                                    ...styles.mobileStatusBadge,
                                    backgroundColor: selectedConversation?.status === 'closed' ? '#F3F4F6' : '#D1FAE5',
                                    color: selectedConversation?.status === 'closed' ? '#6B7280' : '#059669',
                                }}>
                                    {selectedConversation?.status === 'closed' ? 'Closed' : 'Open'}
                                </span>
                            </div>
                            <ChatPanel
                                conversationId={selectedId}
                                installId={installId}
                                token={token}
                            />
                        </div>
                    )}

                    {view === 'leads' && (
                        <Leads installId={installId} token={token} />
                    )}

                    {view === 'docs' && (
                        <Docs installId={installId} />
                    )}

                    {view === 'settings' && (
                        <Settings installId={installId} token={token} agent={agent} />
                    )}

                </div>

                {/* Bottom Nav */}
                <div style={styles.bottomNav}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.view}
                            style={{
                                ...styles.bottomNavBtn,
                                color: view === item.view || (item.view === 'conversations' && view === 'chat')
                                    ? '#4F46E5'
                                    : '#9CA3AF',
                            }}
                            onClick={() => {
                                if (item.view === 'conversations') setSelectedId(null);
                                setView(item.view);
                            }}
                        >
                            <span style={styles.bottomNavIcon}>{item.icon}</span>
                            <span style={styles.bottomNavLabel}>{item.label}</span>
                        </button>
                    ))}
                    <button
                        style={{ ...styles.bottomNavBtn, color: '#9CA3AF' }}
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <span style={styles.bottomNavIcon}>⏻️</span>
                        <span style={styles.bottomNavLabel}>Sign out</span>
                    </button>
                </div>

                {showLogoutModal && <LogoutModal />}
            </div>
        );
    }

    // ── Desktop Layout ─────────────────────────────────────
    return (
        <div style={styles.container}>

            {/* Nav Rail */}
            <div style={styles.navRail}>
                <div style={styles.navLogo}>💬</div>
                <div style={styles.navItems}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.view}
                            style={{
                                ...styles.navBtn,
                                backgroundColor: view === item.view ? '#EEF2FF' : 'transparent',
                                color: view === item.view ? '#4F46E5' : '#6B7280',
                            }}
                            onClick={() => {
                                if (item.view === 'conversations') setSelectedId(null);
                                setView(item.view);
                            }}
                            title={item.label}
                        >
                            <span style={styles.navIcon}>{item.icon}</span>
                            <span style={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </div>
                <div style={styles.navBottom}>
                    <div style={styles.navAvatar} title={agent?.profile?.name || 'Agent'}>
                        {agent?.profile?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <button
                        style={styles.navLogout}
                        onClick={() => setShowLogoutModal(true)}
                        title="Sign out"
                    >
                        ⏻️
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {view === 'home' && (
                <HomePage
                    agent={agent}
                    isOnline={isOnline}
                    setIsOnline={setIsOnline}
                    installId={installId}
                    conversations={conversations}
                    setView={setView}
                />
            )}

            {view === 'leads' && (
                <Leads installId={installId} token={token} />
            )}

            {view === 'docs' && (
                <Docs installId={installId} />
            )}

            {view === 'settings' && (
                <Settings installId={installId} token={token} agent={agent} />
            )}

            {view === 'conversations' && (
                <>
                    <div style={styles.sidebar}>
                        <div style={styles.sidebarHeader}>
                            <p style={styles.sidebarTitle}>Conversations</p>
                            <StatusToggle
                                installId={installId}
                                isOnline={isOnline}
                                setIsOnline={setIsOnline}
                            />
                        </div>
                        <ConversationList
                            conversations={conversations}
                            selectedId={selectedId}
                            onSelect={handleSelectConversation}
                        />
                    </div>

                    {selectedId ? (
                        <>
                            <ChatPanel
                                conversationId={selectedId}
                                installId={installId}
                                token={token}
                            />
                            <VisitorInfo
                                conversation={selectedConversation}
                                installId={installId}
                                onClose={() => setSelectedId(null)}
                            />
                        </>
                    ) : (
                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>💬</div>
                            <h2 style={styles.emptyTitle}>No conversation selected</h2>
                            <p style={styles.emptySub}>Pick a conversation from the left to start replying.</p>
                        </div>
                    )}
                </>
            )}

            {showLogoutModal && <LogoutModal />}
        </div>
    );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#F9FAFB',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
    },
    navRail: {
        width: '72px',
        minWidth: '72px',
        backgroundColor: '#fff',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '16px',
        height: '100vh',
    },
    navLogo: { fontSize: '28px', marginBottom: '24px' },
    navItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
        width: '100%',
        padding: '0 8px',
    },
    navBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 4px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.15s',
    },
    navIcon: { fontSize: '20px' },
    navLabel: { fontSize: '10px', fontWeight: '600' },
    navBottom: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    navAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#4F46E5',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
    },
    navLogout: {
        background: 'none',
        border: 'none',
        fontSize: '22px',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '6px',
        minHeight: '44px',
        minWidth: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidebar: {
        width: '280px',
        minWidth: '280px',
        backgroundColor: '#fff',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    sidebarHeader: {
        padding: '16px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    sidebarTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    empty: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: { fontSize: '48px', marginBottom: '16px' },
    emptyTitle: { fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' },
    emptySub: { fontSize: '14px', color: '#9CA3AF', margin: 0 },
    mobileContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#F9FAFB',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
    },
    mobileContent: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    mobilePage: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
    },
    mobileHeader: {
        padding: '16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
    },
    mobileHeaderTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    mobileChatHeader: {
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#4F46E5',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '4px 0',
        flexShrink: 0,
        minHeight: '44px',
    },
    mobileChatName: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
        flex: 1,
    },
    mobileStatusBadge: {
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 8px',
        borderRadius: '20px',
        flexShrink: 0,
    },
    bottomNav: {
        display: 'flex',
        backgroundColor: '#fff',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '8px',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        flexShrink: 0,
    },
    bottomNavBtn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 0',
        transition: 'color 0.15s',
        minHeight: '48px',
    },
    bottomNavIcon: { fontSize: '20px' },
    bottomNavLabel: { fontSize: '10px', fontWeight: '600' },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '32px 24px',
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    },
    modalIcon: { fontSize: '40px', marginBottom: '12px' },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' },
    modalSub: { fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0', textAlign: 'center' },
    modalButtons: { display: 'flex', gap: '12px', width: '100%' },
    modalCancel: {
        flex: 1, padding: '12px', backgroundColor: '#fff', color: '#374151',
        border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px',
        fontWeight: '600', cursor: 'pointer', minHeight: '48px',
    },
    modalConfirm: {
        flex: 1, padding: '12px', backgroundColor: '#EF4444', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '14px',
        fontWeight: '600', cursor: 'pointer', minHeight: '48px',
    },
};