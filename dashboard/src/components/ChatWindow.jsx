import { useState, useEffect, useRef } from "react";
import {
  ref,
  onChildAdded,
  push,
  set,
  update,
  get,
  onDisconnect,
  onValue,
} from "firebase/database";
import { db } from "../firebase";

// ── Inject styles once ─────────────────────────────────────
function useChatStyles() {
  useEffect(() => {
    if (document.getElementById("chatwindow-styles")) return;
    const el = document.createElement("style");
    el.id = "chatwindow-styles";
    el.textContent = `
      @keyframes chatMsgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .chat-msg { animation: chatMsgIn 0.2s ease both; }
      .chat-input::placeholder { color: #2E2E42; }
      .chat-input:focus { outline: none; border-color: rgba(200,241,53,0.4) !important; box-shadow: 0 0 0 3px rgba(200,241,53,0.07) !important; }
      .chat-send-btn:hover { box-shadow: 0 0 20px rgba(200,241,53,0.45) !important; transform: scale(1.05) !important; }
      .chat-form-btn:hover { background-color: rgba(200,241,53,0.18) !important; border-color: rgba(200,241,53,0.5) !important; }
    `;
    document.head.appendChild(el);
  }, []);
}

const formatTime = (ts) =>
  ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const SENDER_STYLES = {
  visitor: { bg: "rgba(99,102,241,0.15)", color: "#818CF8", label: "V" },
  agent: { bg: "rgba(200,241,53,0.15)", color: "#C8F135", label: "A" },
  ai: { bg: "rgba(192,132,252,0.15)", color: "#C084FC", label: "🤖" },
};

export default function ChatPanel({ conversationId, installId, token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [leadExists, setLeadExists] = useState(false);

  const bottomRef = useRef(null);
  const listenedRef = useRef(null);
  const inputRef = useRef(null);
  useChatStyles();

  // ── Watch leadCollected reactively ─────────────────────
  useEffect(() => {
    if (!conversationId || !installId) return;
    const unsub = onValue(
      ref(db, `conversations/${installId}/${conversationId}/leadCollected`),
      (snap) => setLeadExists(snap.val() === true),
    );
    return () => unsub();
  }, [conversationId, installId]);

  // ── Load messages ──────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    setMessages([]);
    listenedRef.current = conversationId;

    const unsub = onChildAdded(
      ref(db, `messages/${conversationId}`),
      (snap) => {
        const msg = { id: snap.key, ...snap.val() };
        setMessages((prev) =>
          prev.find((m) => m.id === msg.id) ? prev : [...prev, msg],
        );
      },
    );
    return () => unsub();
  }, [conversationId]);

  // ── Auto scroll ────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Reset on conversation change ───────────────────────
  useEffect(() => {
    setFormSent(false);
    setLeadExists(false);
  }, [conversationId]);

  // ── Auto set agent online ──────────────────────────────
  const ensureAgentOnline = async () => {
    const presRef = ref(db, `agentPresence/${installId}`);
    const snap = await get(presRef);
    if (snap.val()?.online !== true) {
      await set(presRef, { online: true, lastSeen: Date.now() });
      onDisconnect(presRef).set({ online: false, lastSeen: Date.now() });
    }
  };

  // ── Send message ───────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    try {
      await ensureAgentOnline();
      await push(ref(db, `messages/${conversationId}`), {
        sender: "agent",
        text,
        timestamp: Date.now(),
        read: false,
      });
      await update(ref(db, `conversations/${installId}/${conversationId}`), {
        lastMessageAt: Date.now(),
        status: "open",
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Send lead form ─────────────────────────────────────
  const handleSendForm = async () => {
    if (formSent) return;
    try {
      await update(ref(db, `conversations/${installId}/${conversationId}`), {
        formRequested: true,
        formRequestedBy: "agent",
      });
      await push(ref(db, `messages/${conversationId}`), {
        sender: "system",
        text: "📋 Lead form sent to visitor.",
        timestamp: Date.now(),
      });
      setFormSent(true);
    } catch (err) {
      console.error("Failed to send form:", err);
    }
  };

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInfo}>
          <div style={s.headerAv}>💬</div>
          <div>
            <p style={s.headerTitle}>Conversation</p>
            <p style={s.headerSub}>{conversationId}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages.length === 0 && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>💬</div>
            <p style={s.emptyText}>No messages yet.</p>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="chat-msg" style={s.systemMsg}>
                {msg.text}
              </div>
            );
          }

          const isVisitor = msg.sender === "visitor";
          const isAI = msg.sender === "ai";
          const ss = SENDER_STYLES[msg.sender] || SENDER_STYLES.agent;

          return (
            <div
              key={msg.id}
              className="chat-msg"
              style={{
                ...s.msgRow,
                justifyContent: isVisitor ? "flex-start" : "flex-end",
              }}
            >
              {isVisitor && (
                <div
                  style={{ ...s.av, backgroundColor: ss.bg, color: ss.color }}
                >
                  {ss.label}
                </div>
              )}

              <div
                style={{
                  ...s.bubble,
                  backgroundColor: isVisitor
                    ? "rgba(255,255,255,0.06)"
                    : isAI
                      ? "rgba(192,132,252,0.13)"
                      : "rgba(200,241,53,0.09)",
                  border: isVisitor
                    ? "1px solid rgba(255,255,255,0.09)"
                    : isAI
                      ? "1px solid rgba(192,132,252,0.25)"
                      : "1px solid rgba(200,241,53,0.2)",
                  borderBottomRightRadius: !isVisitor ? "4px" : "14px",
                  borderBottomLeftRadius: isVisitor ? "4px" : "14px",
                }}
              >
                {isAI && <span style={s.aiBadge}>AI</span>}
                <p
                  style={{
                    ...s.bubbleText,
                    color: isVisitor ? "#EDEAF5" : isAI ? "#DDD6FE" : "#C8F135",
                  }}
                >
                  {msg.text}
                </p>
                <p
                  style={{
                    ...s.bubbleTime,
                    color: isVisitor
                      ? "#3A3A52"
                      : isAI
                        ? "rgba(221,214,254,0.4)"
                        : "rgba(200,241,53,0.4)",
                  }}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>

              {!isVisitor && (
                <div
                  style={{ ...s.av, backgroundColor: ss.bg, color: ss.color }}
                >
                  {ss.label}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={s.inputArea}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          {leadExists && <span style={s.leadWarn}>⚠️ Lead collected</span>}
          <button
            className="chat-form-btn"
            style={{
              ...s.formBtn,
              opacity: formSent ? 0.4 : 1,
              cursor: formSent ? "not-allowed" : "pointer",
              backgroundColor: formSent
                ? "rgba(255,255,255,0.03)"
                : "rgba(200,241,53,0.08)",
              color: formSent ? "#3A3A52" : "#C8F135",
              border: `1px solid ${formSent ? "rgba(255,255,255,0.06)" : "rgba(200,241,53,0.2)"}`,
            }}
            onClick={handleSendForm}
            disabled={formSent}
            title={
              leadExists
                ? "Lead already collected — send again?"
                : "Send lead form to visitor"
            }
          >
            {formSent ? "✅ Sent" : "📋 Send Form"}
          </button>
        </div>

        <input
          ref={inputRef}
          className="chat-input"
          style={s.input}
          type="text"
          placeholder="Type a reply..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoComplete="off"
        />

        <button
          className="chat-send-btn"
          style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.35 : 1 }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? <span style={s.spinner} /> : "➤"}
        </button>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#080810",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    padding: "14px 20px",
    flexShrink: 0,
    backgroundColor: "#0A0A14",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: { display: "flex", alignItems: "center", gap: "12px" },
  headerAv: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    fontSize: "20px",
    backgroundColor: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "14px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: 0,
  },
  headerSub: {
    fontSize: "10px",
    color: "#3A3A52",
    margin: "2px 0 0 0",
    fontFamily: "monospace",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "60px 0",
    flex: 1,
  },
  emptyIcon: {
    fontSize: "28px",
    width: "56px",
    height: "56px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontSize: "14px", color: "#3A3A52", margin: 0 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  av: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "65%",
    padding: "10px 14px",
    borderRadius: "14px",
    wordBreak: "break-word",
  },
  bubbleText: { fontSize: "14px", margin: "0 0 4px 0", lineHeight: "1.5" },
  bubbleTime: { fontSize: "10px", margin: 0, textAlign: "right" },
  aiBadge: {
    display: "inline-block",
    fontSize: "9px",
    fontWeight: "800",
    backgroundColor: "rgba(192,132,252,0.2)",
    color: "#C084FC",
    borderRadius: "4px",
    padding: "1px 6px",
    marginRight: "6px",
    verticalAlign: "middle",
    letterSpacing: "0.06em",
  },
  systemMsg: {
    textAlign: "center",
    fontSize: "11px",
    color: "#3A3A52",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "5px 14px",
    margin: "2px auto",
    maxWidth: "80%",
  },
  inputArea: {
    padding: "12px 16px",
    flexShrink: 0,
    backgroundColor: "#0A0A14",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  leadWarn: {
    fontSize: "9px",
    color: "#F59E0B",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "0.04em",
  },
  formBtn: {
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0,
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    minHeight: "36px",
  },
  input: {
    flex: 1,
    padding: "11px 16px",
    borderRadius: "24px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "14px",
    color: "#EDEAF5",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  sendBtn: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "50%",
    backgroundColor: "#C8F135",
    color: "#080810",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 0 12px rgba(200,241,53,0.2)",
    transition: "all 0.2s",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(8,8,16,0.25)",
    borderTopColor: "#080810",
    borderRadius: "50%",
    display: "inline-block",
    animation: "authSpin 0.7s linear infinite",
  },
};
