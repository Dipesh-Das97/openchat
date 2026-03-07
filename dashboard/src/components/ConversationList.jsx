import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

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

    const open = conversations.filter((c) => c.status === 'open');
    const closed = conversations.filter((c) => c.status === 'closed');

    const renderConversation = (conv) => {
        const last = lastMessages[conv.id];
        const isSelected = conv.id === selectedId;

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
                {/* Avatar */}
                <div style={styles.avatar}>
                    {getInitials(conv.visitorName)}
                </div>

                {/* Info */}
                <div style={styles.info}>
                    <div style={styles.topRow}>
                        <span style={styles.name}>{conv.visitorName || 'Visitor'}</span>
                        <span style={styles.time}>{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <p style={styles.preview}>
                        {last
                            ? `${last.sender === 'visitor' ? '' : '↩ '}${last.text?.slice(0, 45)}${last.text?.length > 45 ? '...' : ''}`
                            : 'No messages yet'
                        }
                    </p>
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
            {/* Open */}
            {open.length > 0 && (
                <>
                    <div style={styles.sectionLabel}>
                        OPEN · {open.length}
                    </div>
                    {open.map(renderConversation)}
                </>
            )}

            {/* Closed */}
            {closed.length > 0 && (
                <>
                    <div style={styles.sectionLabel}>
                        CLOSED · {closed.length}
                    </div>
                    {closed.map(renderConversation)}
                </>
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
};