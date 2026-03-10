import { ref, update, onValue } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";

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

  const [leads, setLeads] = useState([]);
  const [expandedLead, setExpandedLead] = useState(null);

  useEffect(() => {
    if (!installId || !conversation?.id) return;
    const unsub = onValue(ref(db, `leads/${installId}`), (snap) => {
      if (!snap.exists()) {
        setLeads([]);
        return;
      }
      const all = Object.entries(snap.val())
        .map(([id, v]) => ({ id, ...v }))
        .filter(
          (l) =>
            l.conversationId === conversation.id ||
            l.visitorId === conversation.visitorId,
        )
        .sort((a, b) => b.timestamp - a.timestamp);
      setLeads(all);
    });
    return () => unsub();
  }, [installId, conversation?.id, conversation?.visitorId]);

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

      {/* Lead Forms */}
      <div style={s.section}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <p style={s.sectionTitle}>Lead Forms</p>
          {leads.length > 0 && <span style={s.leadBadge}>{leads.length}</span>}
        </div>

        {leads.length === 0 ? (
          <p style={s.emptyText}>No forms submitted yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {leads.map((lead) => (
              <div key={lead.id} style={s.leadCard}>
                <div
                  style={s.leadCardHeader}
                  onClick={() =>
                    setExpandedLead(expandedLead === lead.id ? null : lead.id)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={s.leadDot} />
                    <span style={s.leadName}>{lead.name || "Unnamed"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        ...s.leadStatus,
                        backgroundColor:
                          lead.status === "converted"
                            ? "rgba(200,241,53,0.12)"
                            : "rgba(255,255,255,0.06)",
                        color:
                          lead.status === "converted" ? "#C8F135" : "#55556A",
                        border: `1px solid ${lead.status === "converted" ? "rgba(200,241,53,0.25)" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {lead.status || "new"}
                    </span>
                    <span style={{ color: "#3A3A52", fontSize: "11px" }}>
                      {expandedLead === lead.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {expandedLead === lead.id && (
                  <div style={s.leadDetails}>
                    {lead.email && <LeadRow label="Email" value={lead.email} />}
                    {lead.phone && <LeadRow label="Phone" value={lead.phone} />}
                    {lead.services && (
                      <LeadRow label="Services" value={lead.services} />
                    )}
                    {lead.message && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span style={s.leadRowLabel}>Message</span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#8888A0",
                            lineHeight: 1.5,
                          }}
                        >
                          {lead.message}
                        </span>
                      </div>
                    )}
                    <LeadRow
                      label="Submitted"
                      value={formatDate(lead.timestamp)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

function LeadRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <span style={s.leadRowLabel}>{label}</span>
      <span style={s.leadRowValue}>{value}</span>
    </div>
  );
}

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
  rowValue: { fontWeight: "600", textAlign: "right", wordBreak: "break-all" },
  leadBadge: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#C084FC",
    backgroundColor: "rgba(192,132,252,0.12)",
    border: "1px solid rgba(192,132,252,0.25)",
    padding: "2px 7px",
    borderRadius: "10px",
  },
  emptyText: {
    fontSize: "12px",
    color: "#3A3A52",
    margin: 0,
    fontStyle: "italic",
  },
  leadCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  leadCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    cursor: "pointer",
  },
  leadDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#C084FC",
    flexShrink: 0,
    boxShadow: "0 0 6px rgba(192,132,252,0.6)",
  },
  leadName: { fontSize: "12px", fontWeight: "700", color: "#EDEAF5" },
  leadStatus: {
    fontSize: "9px",
    fontWeight: "800",
    padding: "2px 6px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  leadDetails: {
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  leadRowLabel: {
    fontSize: "11px",
    color: "#3A3A52",
    fontWeight: "500",
    flexShrink: 0,
  },
  leadRowValue: {
    fontSize: "11px",
    color: "#AAAABC",
    fontWeight: "600",
    textAlign: "right",
    wordBreak: "break-all",
  },
  actions: { padding: "16px", marginTop: "auto" },
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
