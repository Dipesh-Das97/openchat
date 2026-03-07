import { useState, useEffect, useRef } from 'react';
import { ref, onChildAdded, push, set } from 'firebase/database';
import { db } from '../firebase';

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function ChatPanel({ conversationId, installId, token }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const listenedRef = useRef(null);

    // Load messages when conversation changes
    useEffect(() => {
        if (!conversationId) return;
        if (listenedRef.current === conversationId) return;

        listenedRef.current = conversationId;
        setMessages([]);

        const msgRef = ref(db, `messages/${conversationId}`);
        onChildAdded(msgRef, (snap) => {
            const msg = { id: snap.key, ...snap.val() };
            setMessages((prev) => {
                // Prevent duplicates
                if (prev.find((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });
    }, [conversationId]);

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput('');
        setLoading(true);

        try {
            // Save message to Firebase
            await push(ref(db, `messages/${conversationId}`), {
                sender: 'agent',
                text,
                timestamp: Date.now(),
                read: false,
            });

            // Update lastMessageAt
            await set(
                ref(db, `conversations/${installId}/${conversationId}/lastMessageAt`),
                Date.now()
            );
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerInfo}>
                    <div style={styles.headerAvatar}>💬</div>
                    <div>
                        <p style={styles.headerTitle}>Conversation</p>
                        <p style={styles.headerSub}>{conversationId}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
                {messages.length === 0 && (
                    <div style={styles.noMessages}>No messages yet.</div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            ...styles.messageRow,
                            justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {msg.sender !== 'agent' && (
                            <div style={styles.avatarSmall}>V</div>
                        )}
                        <div style={{
                            ...styles.bubble,
                            backgroundColor: msg.sender === 'agent' ? '#4F46E5' : '#fff',
                            color: msg.sender === 'agent' ? '#fff' : '#111827',
                            border: msg.sender === 'agent' ? 'none' : '1px solid #E5E7EB',
                            borderBottomRightRadius: msg.sender === 'agent' ? '4px' : '12px',
                            borderBottomLeftRadius: msg.sender !== 'agent' ? '4px' : '12px',
                        }}>
                            <p style={styles.bubbleText}>{msg.text}</p>
                            <p style={styles.bubbleTime}>{formatTime(msg.timestamp)}</p>
                        </div>
                        {msg.sender === 'agent' && (
                            <div style={{
                                ...styles.avatarSmall,
                                backgroundColor: '#4F46E5',
                                color: '#fff',
                            }}>A</div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Type a reply..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    style={{
                        ...styles.sendBtn,
                        opacity: loading || !input.trim() ? 0.5 : 1,
                    }}
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: '16px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    headerAvatar: {
        fontSize: '24px',
    },
    headerTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    headerSub: {
        fontSize: '11px',
        color: '#9CA3AF',
        margin: 0,
    },
    messages: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    noMessages: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '14px',
        marginTop: '40px',
    },
    messageRow: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
    },
    avatarSmall: {
        width: '28px',
        height: '28px',
        minWidth: '28px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '700',
    },
    bubble: {
        maxWidth: '65%',
        padding: '10px 14px',
        borderRadius: '12px',
        wordBreak: 'break-word',
    },
    bubbleText: {
        fontSize: '14px',
        margin: '0 0 4px 0',
        lineHeight: '1.4',
    },
    bubbleTime: {
        fontSize: '10px',
        opacity: 0.6,
        margin: 0,
        textAlign: 'right',
    },
    inputArea: {
        padding: '16px',
        backgroundColor: '#fff',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        gap: '8px',
    },
    input: {
        flex: 1,
        padding: '10px 16px',
        borderRadius: '24px',
        border: '1px solid #D1D5DB',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'Arial, sans-serif',
    },
    sendBtn: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: '#4F46E5',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
};