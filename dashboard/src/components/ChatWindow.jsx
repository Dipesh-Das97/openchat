import { useState, useEffect, useRef } from 'react';
import { ref, onChildAdded, push, set, update, get, onDisconnect, onValue } from 'firebase/database';
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
    const [formSent, setFormSent] = useState(false);
    const bottomRef = useRef(null);
    const listenedRef = useRef(null);

    const [leadExists, setLeadExists] = useState(false);

    // Reactively watch if lead already collected for this conversation
    useEffect(() => {
        if (!conversationId || !installId) return;
        const unsub = onValue(ref(db, `conversations/${installId}/${conversationId}/leadCollected`), (snap) => {
            setLeadExists(snap.val() === true);
        });
        return () => unsub();
    }, [conversationId]);

    // Load messages when conversation changes
    useEffect(() => {
        if (!conversationId) return;

        setMessages([]);
        listenedRef.current = conversationId;

        const msgRef = ref(db, `messages/${conversationId}`);
        const unsub = onChildAdded(msgRef, (snap) => {
            const msg = { id: snap.key, ...snap.val() };
            setMessages((prev) => {
                if (prev.find((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        return () => unsub();
    }, [conversationId]);

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Auto set agent online when they send a message ─────
    const ensureAgentOnline = async () => {
        const presRef = ref(db, `agentPresence/${installId}`);
        const snap = await get(presRef);
        const isCurrentlyOnline = snap.val()?.online === true;

        if (!isCurrentlyOnline) {
            await set(presRef, { online: true, lastSeen: Date.now() });
            // Auto set offline when tab closes
            onDisconnect(presRef).set({ online: false, lastSeen: Date.now() });
            console.log(`🟢 Agent auto-set online for ${installId}`);
        }
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput('');
        setLoading(true);

        try {
            // Auto set agent online if they're currently offline
            await ensureAgentOnline();

            await push(ref(db, `messages/${conversationId}`), {
                sender: 'agent',
                text,
                timestamp: Date.now(),
                read: false,
            });

            await update(
                ref(db, `conversations/${installId}/${conversationId}`),
                {
                    lastMessageAt: Date.now(),
                    status: 'open',
                }
            );
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reset on conversation change
    useEffect(() => {
        setFormSent(false);
        setLeadExists(false);
    }, [conversationId]);

    const handleSendForm = async () => {
        if (formSent) return;

        try {
            // Agent-triggered — always send regardless of prior lead collection
            await update(
                ref(db, `conversations/${installId}/${conversationId}`),
                {
                    formRequested: true,
                    formRequestedBy: 'agent', // widget always shows form when agent sends
                }
            );

            await push(ref(db, `messages/${conversationId}`), {
                sender: 'system',
                text: '📋 Lead form sent to visitor.',
                timestamp: Date.now(),
            });

            setFormSent(true);
        } catch (err) {
            console.error('Failed to send form:', err);
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
                {messages.map((msg) => {
                    if (msg.sender === 'system') {
                        return (
                            <div key={msg.id} style={styles.systemMessage}>
                                {msg.text}
                            </div>
                        );
                    }

                    const isAgent = msg.sender === 'agent';
                    const isAI = msg.sender === 'ai';
                    const isVisitor = msg.sender === 'visitor';

                    return (
                        <div
                            key={msg.id}
                            style={{
                                ...styles.messageRow,
                                justifyContent: isVisitor ? 'flex-start' : 'flex-end',
                            }}
                        >
                            {isVisitor && <div style={styles.avatarSmall}>V</div>}
                            <div style={{
                                ...styles.bubble,
                                backgroundColor: isVisitor ? '#fff' : isAI ? '#7C3AED' : '#4F46E5',
                                color: isVisitor ? '#111827' : '#fff',
                                border: isVisitor ? '1px solid #E5E7EB' : 'none',
                                borderBottomRightRadius: !isVisitor ? '4px' : '12px',
                                borderBottomLeftRadius: isVisitor ? '4px' : '12px',
                            }}>
                                {isAI && <span style={styles.aiBadge}>AI</span>}
                                <p style={styles.bubbleText}>{msg.text}</p>
                                <p style={styles.bubbleTime}>{formatTime(msg.timestamp)}</p>
                            </div>
                            {!isVisitor && (
                                <div style={{
                                    ...styles.avatarSmall,
                                    backgroundColor: isAI ? '#7C3AED' : '#4F46E5',
                                    color: '#fff',
                                }}>
                                    {isAI ? '🤖' : 'A'}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                    {leadExists && (
                        <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '600', textAlign: 'center' }}>
                            ⚠️ Lead collected
                        </span>
                    )}
                    <button
                        style={{
                            ...styles.formBtn,
                            opacity: formSent ? 0.5 : 1,
                            cursor: formSent ? 'not-allowed' : 'pointer',
                            backgroundColor: formSent ? '#E5E7EB' : '#EEF2FF',
                            color: formSent ? '#9CA3AF' : '#4F46E5',
                        }}
                        onClick={handleSendForm}
                        disabled={formSent}
                        title={leadExists ? 'Lead already collected — send again?' : 'Send lead form to visitor'}
                    >
                        {formSent ? '✅ Form Sent' : '📋 Send Form'}
                    </button>
                </div>

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
    headerAvatar: { fontSize: '24px' },
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
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    formBtn: {
        padding: '8px 12px',
        borderRadius: '20px',
        border: '1px solid #C7D2FE',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        flexShrink: 0,
        whiteSpace: 'nowrap',
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
    systemMessage: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        borderRadius: '20px',
        padding: '4px 12px',
        margin: '4px auto',
        maxWidth: '80%',
    },
    aiBadge: {
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: '700',
        backgroundColor: 'rgba(255,255,255,0.25)',
        color: '#fff',
        borderRadius: '4px',
        padding: '1px 5px',
        marginRight: '6px',
        verticalAlign: 'middle',
    },
};