import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, update, query, orderByChild } from "firebase/database";
import {
  Bell,
  MessageCircle,
  ClipboardList,
  RotateCcw,
  CheckCheck,
} from "lucide-react";

const ICONS = {
  message: {
    icon: <MessageCircle size={16} />,
    color: "#818CF8",
    bg: "rgba(129,140,248,0.15)",
    border: "rgba(129,140,248,0.25)",
  },
  lead: {
    icon: <ClipboardList size={16} />,
    color: "#C084FC",
    bg: "rgba(192,132,252,0.15)",
    border: "rgba(192,132,252,0.25)",
  },
  return: {
    icon: <RotateCcw size={16} />,
    color: "#34D399",
    bg: "rgba(52,211,153,0.15)",
    border: "rgba(52,211,153,0.25)",
  },
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function groupByDay(notifications) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  notifications.forEach((n) => {
    const day = new Date(n.timestamp).toDateString();
    if (day === today) groups.Today.push(n);
    else if (day === yesterday) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
}

export default function Notifications({ installId, setView, setSelectedId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!installId) return;
    const q = query(
      ref(db, `notifications/${installId}`),
      orderByChild("timestamp"),
    );
    const unsub = onValue(q, (snap) => {
      if (!snap.exists()) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      const list = Object.entries(snap.val())
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(list);
      setLoading(false);
    });
    return () => unsub();
  }, [installId]);

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    const updates = {};
    unread.forEach((n) => {
      updates[`notifications/${installId}/${n.id}/read`] = true;
    });
    await update(ref(db), updates);
  };

  const markOneRead = async (n) => {
    if (n.read) return;
    await update(ref(db, `notifications/${installId}/${n.id}`), { read: true });
  };

  const handleClick = (n) => {
    markOneRead(n);
    if ((n.type === "message" || n.type === "return") && n.conversationId) {
      setSelectedId(n.conversationId);
      setView("conversations");
    } else if (n.type === "lead") {
      setView("leads");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const groups = groupByDay(notifications);

  if (loading) {
    return (
      <div
        style={{
          ...s.container,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={s.spinner} />
      </div>
    );
  }

  return (
    <div style={s.container} className="dash-page">
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Notifications</h1>
          <p style={s.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button style={s.markAllBtn} onClick={markAllRead}>
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>
            <Bell size={28} color="#3A3A52" />
          </div>
          <p style={s.emptyTitle}>No notifications yet</p>
          <p style={s.emptySub}>New messages and leads will appear here</p>
        </div>
      )}

      {/* Groups */}
      {["Today", "Yesterday", "Earlier"].map((group) => {
        const items = groups[group];
        if (!items.length) return null;
        return (
          <div key={group} style={s.group}>
            <p style={s.groupLabel}>{group}</p>
            <div style={s.groupList}>
              {items.map((n) => {
                const meta = ICONS[n.type] || ICONS.message;
                return (
                  <div
                    key={n.id}
                    style={{
                      ...s.item,
                      backgroundColor: n.read
                        ? "#0D0D1A"
                        : "rgba(129,140,248,0.05)",
                      borderColor: n.read
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(129,140,248,0.15)",
                      cursor:
                        n.conversationId || n.type === "lead"
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => handleClick(n)}
                    className="dash-notif-item"
                  >
                    {/* Unread dot */}
                    {!n.read && <div style={s.unreadDot} />}

                    {/* Icon */}
                    <div
                      style={{
                        ...s.iconBox,
                        background: meta.bg,
                        border: `1px solid ${meta.border}`,
                        color: meta.color,
                      }}
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div style={s.content}>
                      <p
                        style={{
                          ...s.notifText,
                          color: n.read ? "#8888A0" : "#EDEAF5",
                        }}
                      >
                        {n.message}
                      </p>
                      {n.subtext && <p style={s.subtext}>{n.subtext}</p>}
                      <p style={s.timestamp}>{timeAgo(n.timestamp)}</p>
                    </div>

                    {/* Arrow if clickable */}
                    {(n.conversationId || n.type === "lead") && (
                      <span
                        style={{
                          color: "#3A3A52",
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        ›
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "28px 28px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "24px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: "0 0 4px 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "13px",
    color: "#55556A",
    margin: 0,
    fontWeight: "500",
  },
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "10px",
    backgroundColor: "rgba(200,241,53,0.07)",
    border: "1px solid rgba(200,241,53,0.18)",
    color: "#C8F135",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "all 0.15s",
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "60px 0",
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "17px",
    fontWeight: "800",
    color: "#AAAABC",
    margin: 0,
  },
  emptySub: { fontSize: "13px", color: "#3A3A52", margin: 0 },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  groupLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#3A3A52",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: 0,
  },
  groupList: { display: "flex", flexDirection: "column", gap: "6px" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    transition: "all 0.15s",
  },
  unreadDot: {
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#818CF8",
    boxShadow: "0 0 8px rgba(129,140,248,0.6)",
  },
  iconBox: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, minWidth: 0 },
  notifText: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 3px 0",
    lineHeight: 1.4,
  },
  subtext: {
    fontSize: "12px",
    color: "#55556A",
    margin: "0 0 4px 0",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  timestamp: {
    fontSize: "11px",
    color: "#3A3A52",
    margin: 0,
    fontWeight: "600",
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "2px solid rgba(255,255,255,0.06)",
    borderTopColor: "#818CF8",
    borderRadius: "50%",
    animation: "authSpin 0.7s linear infinite",
  },
};
