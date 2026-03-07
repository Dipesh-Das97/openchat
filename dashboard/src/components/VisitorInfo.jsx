import { ref, update } from 'firebase/database';
import { db } from '../firebase';

const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function VisitorInfo({ conversation, installId, onClose }) {
    if (!conversation) return null;

    const handleCloseConversation = async () => {
        if (!window.confirm('Close this conversation?')) return;

        await update(ref(db, `conversations/${installId}/${conversation.id}`), {
            status: 'closed',
        });

        onClose();
    };

    const handleReopenConversation = async () => {
        await update(ref(db, `conversations/${installId}/${conversation.id}`), {
            status: 'open',
        });
    };

    const isClosed = conversation.status === 'closed';
    const isWaiting = conversation.status === 'waiting';

    return (
        <div style={styles.container}>

            {/* Visitor Header */}
            <div style={styles.header}>
                <div style={styles.avatar}>
                    {conversation.visitorName?.charAt(0)?.toUpperCase() || 'V'}
                </div>
                <h3 style={styles.name}>{conversation.visitorName || 'Visitor'}</h3>
                <span style={{
                    ...styles.statusBadge,
                    backgroundColor: isClosed ? '#F3F4F6' : isWaiting ? '#FEF3C7' : '#D1FAE5',
                    color: isClosed ? '#6B7280' : isWaiting ? '#D97706' : '#059669',
                }}>
                    {isClosed ? 'Closed' : isWaiting ? 'Waiting' : 'Open'}
                </span>
            </div>

            {/* Visitor Details */}
            <div style={styles.section}>
                <p style={styles.sectionTitle}>VISITOR DETAILS</p>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Name</span>
                    <span style={styles.rowValue}>{conversation.visitorName || '—'}</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Email</span>
                    <span style={styles.rowValue}>
                        {conversation.visitorEmail || '—'}
                    </span>
                </div>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Visitor ID</span>
                    <span style={{
                        ...styles.rowValue,
                        fontSize: '11px',
                        color: '#9CA3AF',
                        wordBreak: 'break-all',
                    }}>
                        {conversation.visitorId || '—'}
                    </span>
                </div>
            </div>

            {/* Conversation Details */}
            <div style={styles.section}>
                <p style={styles.sectionTitle}>CONVERSATION</p>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Started</span>
                    <span style={styles.rowValue}>{formatDate(conversation.createdAt)}</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Last message</span>
                    <span style={styles.rowValue}>{formatDate(conversation.lastMessageAt)}</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.rowLabel}>Status</span>
                    <span style={styles.rowValue}>
                        {isClosed ? 'Closed' : isWaiting ? 'Waiting' : 'Open'}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
                {isClosed ? (
                    <button
                        style={styles.reopenBtn}
                        onClick={handleReopenConversation}
                    >
                        🔄 Reopen Conversation
                    </button>
                ) : (
                    <button
                        style={styles.closeBtn}
                        onClick={handleCloseConversation}
                    >
                        ✕ Close Conversation
                    </button>
                )}
            </div>

        </div>
    );
}

const styles = {
    container: {
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#fff',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
    },
    header: {
        padding: '24px 16px 16px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: '700',
    },
    name: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
        textAlign: 'center',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 10px',
        borderRadius: '20px',
    },
    section: {
        padding: '16px',
        borderBottom: '1px solid #F3F4F6',
    },
    sectionTitle: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: '0.05em',
        margin: '0 0 12px 0',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '10px',
    },
    rowLabel: {
        fontSize: '13px',
        color: '#6B7280',
        flexShrink: 0,
    },
    rowValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#111827',
        textAlign: 'right',
    },
    actions: {
        padding: '16px',
        marginTop: 'auto',
    },
    closeBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    reopenBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#D1FAE5',
        color: '#059669',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};