import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

// ── Inject styles once ─────────────────────────────────────
function useConvListStyles() {
  useEffect(() => {
    if (document.getElementById("convlist-styles")) return;
    const el = document.createElement("style");
    el.id = "convlist-styles";
    el.textContent = `
      .convlist-item { transition: background-color 0.15s; }
      .convlist-item:hover { background-color: rgba(255,255,255,0.04) !important; }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── Helpers ────────────────────────────────────────────────
const STATUS = {
  waiting: {
    label: "Waiting",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
  open: {
    label: "Open",
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  closed: {
    label: "Closed",
    color: "#55556A",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
  },
};
const getStatus = (v) => STATUS[v] || STATUS.open;

const formatTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

// ── Avatar color pool ──────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────
export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}) {
  const [lastMessages, setLastMessages] = useState({});
  useConvListStyles();

  // Load last message for each conversation
  useEffect(() => {
    conversations.forEach((conv) => {
      onValue(ref(db, `messages/${conv.id}`), (snap) => {
        if (!snap.exists()) return;
        const all = Object.values(snap.val());
        const last = all[all.length - 1];
        setLastMessages((prev) => ({ ...prev, [conv.id]: last }));
      });
    });
  }, [conversations]);

  if (conversations.length === 0) {
    return (
      <div style={s.empty}>
        <div style={s.emptyIcon}>🗨️</div>
        <p style={s.emptyTitle}>No conversations yet</p>
        <p style={s.emptySub}>
          Visitors who open your widget will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {conversations.map((conv) => {
        const last = lastMessages[conv.id];
        const isSelected = conv.id === selectedId;
        const st = getStatus(conv.status);
        const av = avColor(conv.visitorName);
        const initials = getInitials(conv.visitorName);

        const previewText = last
          ? `${last.sender !== "visitor" ? "↩ " : ""}${last.text?.slice(0, 36)}${(last.text?.length || 0) > 36 ? "…" : ""}`
          : "No messages yet";

        return (
          <div
            key={conv.id}
            className="convlist-item"
            style={{
              ...s.item,
              backgroundColor: isSelected
                ? "rgba(200,241,53,0.06)"
                : "transparent",
              borderLeft: `3px solid ${isSelected ? "rgba(200,241,53,0.6)" : "transparent"}`,
            }}
            onClick={() => onSelect(conv.id)}
          >
            {/* Avatar */}
            <div style={{ ...s.av, backgroundColor: av.bg, color: av.color }}>
              {initials}
            </div>

            {/* Info */}
            <div style={s.info}>
              <div style={s.topRow}>
                <span
                  style={{
                    ...s.name,
                    color: isSelected ? "#EDEAF5" : "#AAAABC",
                  }}
                >
                  {conv.visitorName || "Visitor"}
                </span>
                <span style={s.time}>{formatTime(conv.lastMessageAt)}</span>
              </div>
              <div style={s.bottomRow}>
                <p
                  style={{
                    ...s.preview,
                    color: isSelected ? "#6B6B80" : "#3A3A52",
                  }}
                >
                  {previewText}
                </p>
                <span
                  style={{
                    ...s.badge,
                    backgroundColor: st.bg,
                    color: st.color,
                    border: `1px solid ${st.border}`,
                  }}
                >
                  {st.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  container: {
    flex: 1,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 14px",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    borderLeft: "3px solid transparent",
  },
  av: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "50%",
    fontWeight: "800",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  info: { flex: 1, minWidth: 0 },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3px",
  },
  name: { fontSize: "13px", fontWeight: "700", transition: "color 0.15s" },
  time: {
    fontSize: "10px",
    color: "#3A3A52",
    flexShrink: 0,
    marginLeft: "6px",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  preview: {
    fontSize: "12px",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    minWidth: 0,
  },
  badge: {
    fontSize: "9px",
    fontWeight: "800",
    padding: "2px 7px",
    borderRadius: "20px",
    flexShrink: 0,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  empty: {
    padding: "48px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
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
  emptyTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#AAAABC",
    margin: 0,
  },
  emptySub: {
    fontSize: "12px",
    color: "#3A3A52",
    margin: 0,
    lineHeight: "1.6",
  },
};
