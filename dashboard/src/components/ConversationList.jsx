import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const getStatusBadge = (status) => {
    switch (status) {
        case 'waiting':
            return { label: 'Waiting', color: '#D97706', bg: '#FEF3C7' };
        case 'open':
            return { label: 'Open', color: '#059669', bg: '#D1FAE5' };
        case 'closed':
            return { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' };
        default:
            return { label: 'Open', color: '#059669', bg: '#D1FAE5' };
    }
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function ConversationList({ conversations, selectedId, onSelect }) {

    const [lastMessages, setLastMessages] = useState({});

    // Load last message for each conversation
    useEffect(() => {
        conversations.forEach((conv) => {
            const msgRef = ref(db, `messages/${conv.id}`);
            onValue(msgRef, (snap) => {
                if (!snap.exists()) return;
                const msgs = snap.val();
                const all = Object.values(msgs);
                const last = all[all.length - 1];
                setLastMessages((prev) => ({ ...prev, [conv.id]: last }));
            });
        });
    }, [conversations]);

    const renderConversation = (conv) => {
        const last = lastMessages[conv.id];
        const isSelected = conv.id === selectedId;
        const badge = getStatusBadge(conv.status);

        return (
            <div
                key={conv.id}
                style={{
                    ...styles.item,
                    backgroundColor: isSelected ? '#EEF2FF' : '#fff',
                    borderLeft: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
                }}
                onClick={() => onSelect(conv.id)}
            >
                <div style={styles.avatar}>
                    {getInitials(conv.visitorName)}
                </div>

                <div style={styles.info}>
                    <div style={styles.topRow}>
                        <span style={styles.name}>{conv.visitorName || 'Visitor'}</span>
                        <span style={styles.time}>{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <div style={styles.bottomRow}>
                        <p style={styles.preview}>
                            {last
                                ? `${last.sender === 'visitor' ? '' : '↩ '}${last.text?.slice(0, 35)}${last.text?.length > 35 ? '...' : ''}`
                                : 'No messages yet'
                            }
                        </p>
                        <span style={{
                            ...styles.badge,
                            color: badge.color,
                            backgroundColor: badge.bg,
                        }}>
                            {badge.label}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    if (conversations.length === 0) {
        return (
            <div style={styles.empty}>
                <p style={styles.emptyText}>No conversations yet.</p>
                <p style={styles.emptySub}>Visitors who open your widget will appear here.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {conversations.length === 0 ? (
                <div style={styles.empty}>
                    <p style={styles.emptyText}>No conversations yet.</p>
                    <p style={styles.emptySub}>Visitors who open your widget will appear here.</p>
                </div>
            ) : (
                conversations.map(renderConversation)
            )}
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        overflowY: 'auto',
    },
    sectionLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: '0.05em',
        padding: '12px 16px 6px',
    },
    item: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #F3F4F6',
        transition: 'background-color 0.15s',
    },
    avatar: {
        width: '38px',
        height: '38px',
        minWidth: '38px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '13px',
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3px',
    },
    name: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
    },
    time: {
        fontSize: '11px',
        color: '#9CA3AF',
        flexShrink: 0,
    },
    preview: {
        fontSize: '13px',
        color: '#6B7280',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    empty: {
        padding: '32px 16px',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        margin: '0 0 4px 0',
    },
    emptySub: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
    },

    bottomRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
    },
    badge: {
        fontSize: '10px',
        fontWeight: '700',
        padding: '2px 6px',
        borderRadius: '20px',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
    },
};