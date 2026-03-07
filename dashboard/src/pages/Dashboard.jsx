import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAgentStore from '../store/agentStore';
import { db } from '../firebase';
import { ref, onValue, get } from 'firebase/database';
import ConversationList from '../components/ConversationList';
import ChatPanel from '../components/ChatWindow';
import VisitorInfo from '../components/VisitorInfo';
import StatusToggle from '../components/StatusToggle';
import Settings from './Settings';
import { useIsMobile } from '../hooks/useIsMobile';
import Leads from './Leads';
import { useNotifications } from '../hooks/useNotifications';

export default function Dashboard() {
    const navigate = useNavigate();
    const { token, installId, agent, logout, setAgent, rehydrateFirebase } = useAgentStore();
    const isMobile = useIsMobile();

    const { requestPermission, notify } = useNotifications();

    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [view, setView] = useState('conversations');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const prevConversationsRef = useRef({});

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token]);

    // Add this useEffect in Dashboard.jsx
    useEffect(() => {
        if (!token) return;
        requestPermission();
        rehydrateFirebase();

        fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((profile) => {
                if (profile) setAgent(profile);
            })
            .catch(console.error);
    }, [token]);


    useEffect(() => {
        if (!installId) return;
        const convRef = ref(db, `conversations/${installId}`);
        const unsub = onValue(convRef, (snap) => {
            if (!snap.exists()) { setConversations([]); return; }

            const data = snap.val();
            const list = Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

            // Check for new messages vs previous state
            list.forEach(async (conv) => {
                const prev = prevConversationsRef.current[conv.id];
                if (prev && conv.lastMessageAt > prev.lastMessageAt) {
                    // Check who sent the last message
                    const msgSnap = await get(ref(db, `messages/${conv.id}`));
                    if (!msgSnap.exists()) return;

                    const msgs = Object.values(msgSnap.val());
                    const lastMsg = msgs[msgs.length - 1];

                    // Only notify if last message is from visitor
                    if (lastMsg?.sender === 'visitor') {
                        notify(
                            `New message from ${conv.visitorName || 'Visitor'}`,
                            lastMsg.text?.slice(0, 60) || 'New message',
                            () => {
                                setSelectedId(conv.id);
                                setView('conversations');
                            }
                        );
                    }
                }
            });
            // Update ref AFTER checking
            prevConversationsRef.current = Object.fromEntries(
                list.map((c) => [c.id, c])
            );

            setConversations(list);
        });
        return () => unsub();
    }, [installId, selectedId]);

    useEffect(() => {
        if (!installId) return;
        const presRef = ref(db, `agentPresence/${installId}`);
        const unsub = onValue(presRef, (snap) => {
            setIsOnline(snap.val()?.online || false);
        });
        return () => unsub();
    }, [installId]);

    const selectedConversation = conversations.find((c) => c.id === selectedId);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSelectConversation = (id) => {
        setSelectedId(id);
        // On mobile, switch to chat view automatically
        if (isMobile) setView('chat');
    };

    const handleBackToList = () => {
        setSelectedId(null);
        setView('conversations');
    };

    // ── Mobile Layout ──
    if (isMobile) {
        return (
            <div style={styles.mobileContainer}>

                {/* Mobile Content */}
                <div style={styles.mobileContent}>

                    {/* Conversations view */}
                    {view === 'conversations' && (
                        <div style={styles.mobilePage}>
                            <div style={styles.mobileHeader}>
                                <p style={styles.mobileHeaderTitle}>Conversations</p>
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


                    {/* Chat view */}
                    {view === 'chat' && selectedId && (
                        <div style={styles.mobilePage}>
                            <div style={styles.mobileChatHeader}>
                                <button style={styles.backBtn} onClick={handleBackToList}>
                                    ← Back
                                </button>
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

                    {/* Settings view */}
                    {view === 'settings' && (
                        <Settings
                            installId={installId}
                            token={token}
                            agent={agent}
                        />
                    )}

                    {view === 'leads' && (
                        <Leads installId={installId} token={token} />
                    )}

                </div>

                {/* Bottom Nav */}
                <div style={styles.bottomNav}>
                    <button
                        style={{
                            ...styles.bottomNavBtn,
                            color: view === 'conversations' || view === 'chat' ? '#4F46E5' : '#9CA3AF',
                        }}
                        onClick={() => { setView('conversations'); setSelectedId(null); }}
                    >
                        <span style={styles.bottomNavIcon}>🗨️</span>
                        <span style={styles.bottomNavLabel}>Chats</span>
                    </button>

                    <button
                        style={{
                            ...styles.bottomNavBtn,
                            color: view === 'leads' ? '#4F46E5' : '#9CA3AF',
                        }}
                        onClick={() => setView('leads')}
                    >
                        <span style={styles.bottomNavIcon}>📋</span>
                        <span style={styles.bottomNavLabel}>Leads</span>
                    </button>

                    <button
                        style={{
                            ...styles.bottomNavBtn,
                            color: view === 'settings' ? '#4F46E5' : '#9CA3AF',
                        }}
                        onClick={() => setView('settings')}
                    >
                        <span style={styles.bottomNavIcon}>⚙️</span>
                        <span style={styles.bottomNavLabel}>Settings</span>
                    </button>

                    <button
                        style={{ ...styles.bottomNavBtn, color: '#9CA3AF' }}
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <span style={styles.bottomNavIcon}>⏻️</span>
                        <span style={styles.bottomNavLabel}>Sign out</span>
                    </button>
                </div>
                {/* Logout Modal */}
                {showLogoutModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalIcon}>↩️</div>
                            <h3 style={styles.modalTitle}>Sign out?</h3>
                            <p style={styles.modalSub}>You'll need to sign in again to access your dashboard.</p>
                            <div style={styles.modalButtons}>
                                <button
                                    style={styles.modalCancel}
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={styles.modalConfirm}
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    }

    // ── Desktop Layout ──
    return (
        <div style={styles.container}>

            {/* Nav Rail */}
            <div style={styles.navRail}>
                <div style={styles.navLogo}>💬</div>

                <div style={styles.navItems}>
                    <button
                        style={{
                            ...styles.navBtn,
                            backgroundColor: view === 'conversations' ? '#EEF2FF' : 'transparent',
                            color: view === 'conversations' ? '#4F46E5' : '#6B7280',
                        }}
                        onClick={() => setView('conversations')}
                        title="Conversations"
                    >
                        <span style={styles.navIcon}>🗨️</span>
                        <span style={styles.navLabel}>Chats</span>
                    </button>

                    <button
                        style={{
                            ...styles.navBtn,
                            backgroundColor: view === 'leads' ? '#EEF2FF' : 'transparent',
                            color: view === 'leads' ? '#4F46E5' : '#6B7280',
                        }}
                        onClick={() => setView('leads')}
                        title="Leads"
                    >
                        <span style={styles.navIcon}>📋</span>
                        <span style={styles.navLabel}>Leads</span>
                    </button>

                    <button
                        style={{
                            ...styles.navBtn,
                            backgroundColor: view === 'settings' ? '#EEF2FF' : 'transparent',
                            color: view === 'settings' ? '#4F46E5' : '#6B7280',
                        }}
                        onClick={() => setView('settings')}
                        title="Settings"
                    >
                        <span style={styles.navIcon}>⚙️</span>
                        <span style={styles.navLabel}>Settings</span>
                    </button>
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
            {view === 'settings' ? (
                <Settings installId={installId} token={token} agent={agent} />
            ) : view === 'leads' ? (
                <Leads installId={installId} token={token} />
            ) : (
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
            {/* Logout Modal */}
            {showLogoutModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalIcon}>↩️</div>
                        <h3 style={styles.modalTitle}>Sign out?</h3>
                        <p style={styles.modalSub}>You'll need to sign in again to access your dashboard.</p>
                        <div style={styles.modalButtons}>
                            <button
                                style={styles.modalCancel}
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.modalConfirm}
                                onClick={handleLogout}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    // ── Desktop ──
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
    emptyTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        margin: '0 0 8px 0',
    },
    emptySub: { fontSize: '14px', color: '#9CA3AF', margin: 0 },

    // ── Mobile ──
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
        padding: '8px 0',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
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
    },
    bottomNavIcon: { fontSize: '20px' },
    bottomNavLabel: {
        fontSize: '10px',
        fontWeight: '600',
    },
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
    modalIcon: {
        fontSize: '40px',
        marginBottom: '12px',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 8px 0',
    },
    modalSub: {
        fontSize: '14px',
        color: '#6B7280',
        margin: '0 0 24px 0',
        textAlign: 'center',
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        width: '100%',
    },
    modalCancel: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#fff',
        color: '#374151',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    modalConfirm: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};