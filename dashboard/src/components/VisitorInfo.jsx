import { ref, update } from "firebase/database";
import { db } from "../firebase";

const formatDate = (ts) =>
  ts
    ? new Date(ts).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const AV_COLORS = [
  { bg: "rgba(99,102,241,0.2)", color: "#818CF8" },
  { bg: "rgba(200,241,53,0.15)", color: "#C8F135" },
  { bg: "rgba(139,92,246,0.2)", color: "#A78BFA" },
  { bg: "rgba(16,185,129,0.15)", color: "#34D399" },
  { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" },
  { bg: "rgba(236,72,153,0.15)", color: "#F472B6" },
];
const avColor = (name) =>
  AV_COLORS[(name?.charCodeAt(0) || 0) % AV_COLORS.length];

export default function VisitorInfo({ conversation, installId, onClose }) {
  if (!conversation) return null;

  const isClosed = conversation.status === "closed";
  const isWaiting = conversation.status === "waiting";
  const av = avColor(conversation.visitorName);

  const handleClose = async () => {
    if (!window.confirm("Close this conversation?")) return;
    await update(ref(db, `conversations/${installId}/${conversation.id}`), {
      status: "closed",
    });
    onClose();
  };

  const handleReopen = async () => {
    await update(ref(db, `conversations/${installId}/${conversation.id}`), {
      status: "open",
    });
  };

  const statusStyle = isClosed
    ? {
        color: "#55556A",
        bg: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.1)",
      }
    : isWaiting
      ? {
          color: "#F59E0B",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.3)",
        }
      : {
          color: "#34D399",
          bg: "rgba(52,211,153,0.12)",
          border: "rgba(52,211,153,0.3)",
        };

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ ...s.av, backgroundColor: av.bg, color: av.color }}>
          {conversation.visitorName?.charAt(0)?.toUpperCase() || "V"}
        </div>
        <h3 style={s.name}>{conversation.visitorName || "Visitor"}</h3>
        <span
          style={{
            ...s.badge,
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
          }}
        >
          {isClosed ? "Closed" : isWaiting ? "Waiting" : "Open"}
        </span>
      </div>

      {/* Visitor Details */}
      <Section title="Visitor">
        <Row label="Name" value={conversation.visitorName} />
        <Row label="Email" value={conversation.visitorEmail} />
        <Row label="Visitor ID" value={conversation.visitorId} mono />
      </Section>

      {/* Conversation Details */}
      <Section title="Conversation">
        <Row label="Started" value={formatDate(conversation.createdAt)} />
        <Row
          label="Last message"
          value={formatDate(conversation.lastMessageAt)}
        />
        <Row
          label="Status"
          value={isClosed ? "Closed" : isWaiting ? "Waiting" : "Open"}
        />
      </Section>

      {/* Actions */}
      <div style={s.actions}>
        {isClosed ? (
          <button style={s.reopenBtn} onClick={handleReopen}>
            🔄 Reopen Conversation
          </button>
        ) : (
          <button style={s.closeBtn} onClick={handleClose}>
            ✕ Close Conversation
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={s.row}>
      <span style={s.rowLabel}>{label}</span>
      <span
        style={{
          ...s.rowValue,
          fontFamily: mono ? "monospace" : "inherit",
          fontSize: mono ? "10px" : "12px",
          color: mono ? "#3A3A52" : "#AAAABC",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  container: {
    width: "240px",
    minWidth: "240px",
    backgroundColor: "#0A0A14",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    padding: "24px 16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  av: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  name: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "15px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: 0,
    textAlign: "center",
  },
  badge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  section: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  sectionTitle: {
    fontSize: "9px",
    fontWeight: "800",
    color: "#3A3A52",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: "0 0 12px 0",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "10px",
  },
  rowLabel: {
    fontSize: "12px",
    color: "#3A3A52",
    flexShrink: 0,
    fontWeight: "500",
  },
  rowValue: {
    fontWeight: "600",
    textAlign: "right",
    wordBreak: "break-all",
  },
  actions: {
    padding: "16px",
    marginTop: "auto",
  },
  closeBtn: {
    width: "100%",
    padding: "11px",
    backgroundColor: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#F87171",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "opacity 0.2s",
  },
  reopenBtn: {
    width: "100%",
    padding: "11px",
    backgroundColor: "rgba(52,211,153,0.1)",
    border: "1px solid rgba(52,211,153,0.25)",
    color: "#34D399",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "opacity 0.2s",
  },
};
