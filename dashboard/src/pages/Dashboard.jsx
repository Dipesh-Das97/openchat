import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAgentStore from "../store/agentStore";
import { db } from "../firebase";
import { ref, onValue, set, get } from "firebase/database";
import ConversationList from "../components/ConversationList";
import ChatPanel from "../components/ChatWindow";
import VisitorInfo from "../components/VisitorInfo";
import StatusToggle from "../components/StatusToggle";
import Settings from "./Settings";
import Docs from "./Docs";
import Leads from "./Leads";
import { useIsMobile } from "../hooks/useIsMobile";
import { useNotifications } from "../hooks/useNotifications";
import {
  MessageSquare,
  Circle,
  ClipboardList,
  CheckCircle2,
  Home,
  MessageCircle,
  Code2,
  Settings2,
  Wrench,
  Zap,
  LogOut,
  ChevronLeft,
} from "lucide-react";

// ── Global styles ──────────────────────────────────────────
function useDashboardStyles() {
  useEffect(() => {
    if (document.getElementById("dashboard-styles")) return;
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    const link2 = document.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "anonymous";
    const link3 = document.createElement("link");
    link3.rel = "stylesheet";
    link3.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.append(link1, link2, link3);

    const el = document.createElement("style");
    el.id = "dashboard-styles";
    el.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; background: #080810; }

      @keyframes authSpin   { to { transform: rotate(360deg); } }
      @keyframes slideUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
      @keyframes scaleIn    { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
      @keyframes shimmer    { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(200,241,53,0.4); } 100% { box-shadow: 0 0 0 8px rgba(200,241,53,0); } }
      @keyframes barGrow    { from { transform: scaleX(0); } to { transform: scaleX(1); } }

      .dash-page { animation: fadeIn 0.3s ease both; }

      /* Nav */
      .dash-nav-btn { position: relative; }
      .dash-nav-btn:hover { background-color: rgba(255,255,255,0.07) !important; }
      .dash-nav-tooltip {
        position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
        background: #1A1A2E; border: 1px solid rgba(255,255,255,0.1);
        color: #EDEAF5; font-size: 11px; font-weight: 700;
        padding: 5px 10px; border-radius: 7px; white-space: nowrap;
        opacity: 0; pointer-events: none; transition: opacity 0.15s;
        font-family: 'Plus Jakarta Sans', sans-serif;
        letter-spacing: 0.04em; z-index: 100;
      }
      .dash-nav-btn:hover .dash-nav-tooltip { opacity: 1; }

      /* Stat cards */
      .dash-stat-card {
        animation: slideUp 0.4s ease both;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      }
      .dash-stat-card:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
      }

      /* Content cards */
      .dash-card { animation: scaleIn 0.35s ease both; }

      /* Service bars */
      .dash-service-bar { transform-origin: left; animation: barGrow 0.6s ease both; }

      /* Action buttons */
      .dash-action-btn { transition: all 0.15s ease !important; }
      .dash-action-btn:hover {
        background-color: rgba(200,241,53,0.15) !important;
        border-color: rgba(200,241,53,0.5) !important;
        transform: translateY(-1px) !important;
      }

      /* Bottom nav */
      .dash-bnav-btn:hover { color: #EDEAF5 !important; }
      .dash-bnav-btn:hover .dash-bnav-icon { transform: translateY(-2px); }
      .dash-bnav-icon { transition: transform 0.15s ease; display: flex; align-items: center; justify-content: center; }

      /* Modal */
      .dash-modal-cancel:hover  { background-color: rgba(255,255,255,0.08) !important; }
      .dash-modal-confirm:hover { opacity: 0.85 !important; }
      .dash-logout-btn:hover    { color: #F87171 !important; }
      .dash-back-btn:hover      { color: #C8F135 !important; }

      /* Range btn */
      .dash-range-btn:hover { background-color: rgba(255,255,255,0.06) !important; }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── Helpers ────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Animated counter ───────────────────────────────────────
function AnimatedNumber({ value, color }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = 0;
    const end = value;
    const dur = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setDisplay(Math.round(start + (end - start) * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span
      style={{
        fontSize: "32px",
        fontWeight: "800",
        color,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        letterSpacing: "-0.02em",
        textShadow: `0 0 20px ${color}66`,
      }}
    >
      {display}
    </span>
  );
}

// ── Mini Bar Chart ─────────────────────────────────────────
function MiniBarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "3px",
        height: "80px",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${Math.max((d.value / max) * 60, d.value > 0 ? 4 : 0)}px`,
              backgroundColor: d.value > 0 ? color : "rgba(255,255,255,0.04)",
              borderRadius: "4px 4px 0 0",
              transition: "height 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow:
                d.value > 0 ? `0 0 10px ${color}66, 0 -2px 0 ${color}` : "none",
              position: "relative",
              cursor: "default",
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span
            style={{ fontSize: "9px", color: "#3A3A52", whiteSpace: "nowrap" }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Stat icon map ──────────────────────────────────────────
const STAT_ICONS = {
  "Total Chats": { icon: <MessageSquare size={20} />, color: "#818CF8" },
  "Open Chats": { icon: <Circle size={20} />, color: "#34D399" },
  "Total Leads": { icon: <ClipboardList size={20} />, color: "#C084FC" },
  Converted: { icon: <CheckCircle2 size={20} />, color: "#C8F135" },
};

// ── Home Page ──────────────────────────────────────────────
function HomePage({
  agent,
  isOnline,
  setIsOnline,
  installId,
  conversations,
  setView,
}) {
  const agentName = agent?.profile?.name || agent?.name || "Agent";
  const isMobile = useIsMobile();

  const [range, setRange] = useState("7");
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (!installId) return;
    const unsub = onValue(ref(db, `leads/${installId}`), (snap) => {
      if (!snap.exists()) {
        setLeads([]);
        setLoadingLeads(false);
        return;
      }
      setLeads(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
      setLoadingLeads(false);
    });
    return () => unsub();
  }, [installId]);

  const days = parseInt(range);
  const buildDays = (n) => {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({
        label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
        dateStr: d.toISOString().split("T")[0],
      });
    }
    return out;
  };
  const dayLabels = buildDays(days);

  const convChartData = dayLabels.map(({ label, dateStr }) => ({
    label: label.split(" ")[1],
    value: conversations.filter(
      (c) => new Date(c.createdAt).toISOString().split("T")[0] === dateStr,
    ).length,
  }));
  const leadChartData = dayLabels.map(({ label, dateStr }) => ({
    label: label.split(" ")[1],
    value: leads.filter(
      (l) => new Date(l.timestamp).toISOString().split("T")[0] === dateStr,
    ).length,
  }));

  const openChats = conversations.filter(
    (c) => c.status === "open" || c.status === "waiting",
  ).length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;

  const statCards = [
    {
      label: "Total Chats",
      value: conversations.length,
      view: "conversations",
    },
    { label: "Open Chats", value: openChats, view: "conversations" },
    { label: "Total Leads", value: leads.length, view: "leads" },
    { label: "Converted", value: convertedLeads, view: "leads" },
  ];

  const serviceCounts = {};
  leads.forEach((l) => {
    if (!l.services) return;
    l.services.split(",").forEach((s) => {
      const k = s.trim();
      if (k) serviceCounts[k] = (serviceCounts[k] || 0) + 1;
    });
  });
  const serviceEntries = Object.entries(serviceCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const maxServiceCount = Math.max(...serviceEntries.map(([, v]) => v), 1);

  const QUICK_ACTIONS = [
    {
      label: "Open Chats",
      view: "conversations",
      icon: <MessageCircle size={14} />,
    },
    { label: "View Leads", view: "leads", icon: <ClipboardList size={14} /> },
    { label: "Embed Widget", view: "docs", icon: <Code2 size={14} /> },
    { label: "Settings", view: "settings", icon: <Settings2 size={14} /> },
  ];

  return (
    <div style={hS.container} className="dash-page">
      {/* ── Header ── */}
      <div
        style={{
          ...hS.header,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div>
          <h1 style={hS.greeting}>
            {getGreeting()}, {agentName}!{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p style={hS.subGreeting}>Here's what's happening today</p>
        </div>
        <StatusToggle
          installId={installId}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />
      </div>

      {/* ── Stat cards ── */}
      <div
        style={{
          ...hS.statsRow,
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        }}
      >
        {statCards.map((card, i) => {
          const { icon, color } = STAT_ICONS[card.label];
          return (
            <div
              key={card.label}
              className="dash-stat-card"
              style={{
                ...hS.statCard,
                animationDelay: `${i * 80}ms`,
                background: `linear-gradient(135deg, #12121F 0%, ${color}12 100%)`,
                border: `1px solid ${color}28`,
                borderTop: `1px solid ${color}45`,
              }}
              onClick={() => setView(card.view)}
            >
              {/* Top row: icon + label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "9px",
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                    }}
                  >
                    {icon}
                  </div>
                </div>
                {/* Trend arrow placeholder */}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: `${color}CC`,
                    background: `${color}15`,
                    padding: "3px 8px",
                    borderRadius: "20px",
                    letterSpacing: "0.04em",
                  }}
                >
                  ↑ Live
                </div>
              </div>

              {/* Number */}
              <AnimatedNumber value={card.value} color={color} />

              {/* Label */}
              <p
                style={{
                  ...hS.statLabel,
                  marginTop: "6px",
                  color: `${color}99`,
                }}
              >
                {card.label}
              </p>

              {/* Bottom glow line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                  borderRadius: "1px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Range toggle ── */}
      <div style={{ ...hS.rangeRow, animationDelay: "320ms" }}>
        <span style={hS.rangeLabel}>Period</span>
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "3px",
          }}
        >
          {["7", "30"].map((r) => (
            <button
              key={r}
              className="dash-range-btn"
              style={{
                padding: "4px 16px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s ease",
                backgroundColor: range === r ? "#C8F135" : "transparent",
                color: range === r ? "#080810" : "#55556A",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onClick={() => setRange(r)}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div
        style={{ ...hS.chartsRow, flexDirection: isMobile ? "column" : "row" }}
      >
        {[
          {
            title: "Conversations",
            icon: <MessageSquare size={12} />,
            data: convChartData,
            color: "#818CF8",
          },
          {
            title: "New Leads",
            icon: <ClipboardList size={12} />,
            data: leadChartData,
            color: "#C084FC",
          },
        ].map((chart, i) => (
          <div
            key={chart.title}
            className="dash-card"
            style={{ ...hS.card, animationDelay: `${360 + i * 60}ms` }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "7px",
                  background: `${chart.color}20`,
                  border: `1px solid ${chart.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: chart.color,
                }}
              >
                {chart.icon}
              </div>
              <span style={hS.cardTitle}>{chart.title}</span>
            </div>
            <MiniBarChart data={chart.data} color={chart.color} />
          </div>
        ))}
      </div>

      {/* ── Leads by service ── */}
      <div
        className="dash-card"
        style={{ ...hS.card, flex: "none", animationDelay: "480ms" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "rgba(129,140,248,0.15)",
              border: "1px solid rgba(129,140,248,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818CF8",
            }}
          >
            <Wrench size={12} />
          </div>
          <span style={hS.cardTitle}>Leads by Service</span>
        </div>
        {serviceEntries.length === 0 ? (
          <p style={hS.emptyText}>No service data yet.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {serviceEntries.map(([service, count], i) => (
              <div
                key={service}
                style={{ animationDelay: `${500 + i * 50}ms` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "7px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#AAAABC",
                      fontWeight: "600",
                    }}
                  >
                    {service}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "800",
                      color: "#818CF8",
                      background: "rgba(129,140,248,0.12)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="dash-service-bar"
                    style={{
                      height: "100%",
                      borderRadius: "10px",
                      animationDelay: `${520 + i * 60}ms`,
                      width: `${(count / maxServiceCount) * 100}%`,
                      background: "linear-gradient(90deg, #818CF8, #C084FC)",
                      boxShadow: "0 0 10px rgba(192,132,252,0.5)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div
        className="dash-card"
        style={{ ...hS.card, flex: "none", animationDelay: "540ms" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "rgba(200,241,53,0.12)",
              border: "1px solid rgba(200,241,53,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C8F135",
            }}
          >
            <Zap size={12} />
          </div>
          <span style={hS.cardTitle}>Quick Actions</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.view}
              className="dash-action-btn"
              style={hS.actionBtn}
              onClick={() => setView(action.view)}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                {action.icon}
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home styles ────────────────────────────────────────────
const hS = {
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "28px 28px 40px",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "4px",
  },
  greeting: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "24px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: "0 0 5px 0",
    letterSpacing: "-0.03em",
  },
  subGreeting: {
    fontSize: "13px",
    color: "#55556A",
    margin: 0,
    fontWeight: "500",
  },
  statsRow: { display: "grid", gap: "12px" },
  statCard: {
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  statValue: {
    fontWeight: "800",
    margin: 0,
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  statLabel: {
    fontSize: "11px",
    margin: 0,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  rangeRow: { display: "flex", alignItems: "center", gap: "10px" },
  rangeLabel: {
    fontSize: "11px",
    color: "#3A3A52",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  chartsRow: { display: "flex", gap: "12px" },
  card: {
    backgroundColor: "#0D0D1A",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px",
    position: "relative",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#8888A0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  emptyText: {
    fontSize: "13px",
    color: "#3A3A52",
    margin: 0,
    textAlign: "center",
    padding: "20px 0",
  },
  actionBtn: {
    padding: "10px 16px",
    backgroundColor: "rgba(200,241,53,0.07)",
    color: "#C8F135",
    border: "1px solid rgba(200,241,53,0.18)",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    minHeight: "40px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: "flex",
    alignItems: "center",
  },
};

// ── Nav config ─────────────────────────────────────────────
const NAV_ITEMS = [
  { view: "home", icon: <Home size={20} />, label: "Home" },
  { view: "conversations", icon: <MessageCircle size={20} />, label: "Chats" },
  { view: "leads", icon: <ClipboardList size={20} />, label: "Leads" },
  { view: "docs", icon: <Code2 size={20} />, label: "Docs" },
  { view: "settings", icon: <Settings2 size={20} />, label: "Settings" },
];

// ── Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { token, installId, agent, logout, setAgent, rehydrateFirebase } =
    useAgentStore();
  const isMobile = useIsMobile();
  const { requestPermission, notify } = useNotifications();
  useDashboardStyles();

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [view, setView] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const prevConversationsRef = useRef({});
  const notifyRef = useRef(notify);
  useEffect(() => {
    notifyRef.current = notify;
  }, [notify]);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  useEffect(() => {
    if (!token || !installId) return;
    requestPermission();
    rehydrateFirebase();
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((profile) => {
        if (profile) setAgent(profile);
      })
      .catch(console.error);
    const presRef = ref(db, `agentPresence/${installId}`);
    get(presRef).then((snap) => {
      if (!snap.exists()) set(presRef, { online: false, lastSeen: Date.now() });
    });
  }, [token, installId]);

  useEffect(() => {
    if (!installId) return;
    const unsub = onValue(ref(db, `conversations/${installId}`), (snap) => {
      if (!snap.exists()) {
        setConversations([]);
        return;
      }
      const list = Object.entries(snap.val())
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      list.forEach((conv) => {
        const prev = prevConversationsRef.current[conv.id];
        if (!prev) return;
        if (
          conv.lastVisitorMessageAt &&
          conv.lastVisitorMessageAt > (prev.lastVisitorMessageAt || 0)
        ) {
          notifyRef.current(
            `New message from ${conv.visitorName || "Visitor"}`,
            conv.lastMessagePreview || "New message",
            () => {
              setSelectedId(conv.id);
              setView("conversations");
            },
          );
        }
      });
      prevConversationsRef.current = Object.fromEntries(
        list.map((c) => [c.id, c]),
      );
      setConversations(list);
    });
    return () => unsub();
  }, [installId]);

  useEffect(() => {
    if (!installId) return;
    const unsub = onValue(ref(db, `agentPresence/${installId}`), (snap) => {
      setIsOnline(snap.val()?.online || false);
    });
    return () => unsub();
  }, [installId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleSelectConversation = (id) => {
    setSelectedId(id);
    if (isMobile) setView("chat");
  };
  const handleBackToList = () => {
    setSelectedId(null);
    setView("conversations");
  };

  // ── Logout Modal ─────────────────────────────────────────
  const LogoutModal = () => (
    <div style={s.modalOverlay}>
      <div style={{ ...s.modal, animation: "scaleIn 0.2s ease both" }}>
        <div style={s.modalIcon}>
          <LogOut size={26} color="#F87171" />
        </div>
        <h3 style={s.modalTitle}>Sign out?</h3>
        <p style={s.modalSub}>
          You'll need to sign in again to access your dashboard.
        </p>
        <div style={s.modalButtons}>
          <button
            className="dash-modal-cancel"
            style={s.modalCancel}
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </button>
          <button
            className="dash-modal-confirm"
            style={s.modalConfirm}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  // ── Mobile Layout ─────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={s.mobileContainer}>
        <div style={s.mobileContent}>
          {view === "home" && (
            <div style={s.mobilePage}>
              <div style={s.mobileHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px", height: "20px" }}
                >
                 💬
                </div>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                <HomePage
                  agent={agent}
                  isOnline={isOnline}
                  setIsOnline={setIsOnline}
                  installId={installId}
                  conversations={conversations}
                  setView={setView}
                />
              </div>
            </div>
          )}
          {view === "conversations" && (
            <div style={s.mobilePage}>
              <div style={s.mobileHeader}>
                <p style={s.mobileHeaderTitle}>Chats</p>
                <StatusToggle
                  installId={installId}
                  isOnline={isOnline}
                  setIsOnline={setIsOnline}
                />
              </div>
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={handleSelectConversation}
              />
            </div>
          )}
          {view === "chat" && selectedId && (
            <div style={s.mobilePage}>
              <div style={s.mobileChatHeader}>
                <button
                  className="dash-back-btn"
                  style={s.backBtn}
                  onClick={handleBackToList}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <p style={s.mobileChatName}>
                  {selectedConversation?.visitorName || "Visitor"}
                </p>
                <span
                  style={{
                    ...s.mobileStatusBadge,
                    backgroundColor:
                      selectedConversation?.status === "closed"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(52,211,153,0.12)",
                    color:
                      selectedConversation?.status === "closed"
                        ? "#55556A"
                        : "#34D399",
                    border: `1px solid ${selectedConversation?.status === "closed" ? "rgba(255,255,255,0.08)" : "rgba(52,211,153,0.3)"}`,
                  }}
                >
                  {selectedConversation?.status === "closed"
                    ? "Closed"
                    : "Open"}
                </span>
              </div>
              <ChatPanel
                conversationId={selectedId}
                installId={installId}
                token={token}
              />
            </div>
          )}
          {view === "leads" && <Leads installId={installId} token={token} />}
          {view === "docs" && <Docs installId={installId} />}
          {view === "settings" && (
            <Settings installId={installId} token={token} agent={agent} />
          )}
        </div>

        {/* Bottom Nav */}
        <div style={s.bottomNav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              view === item.view ||
              (item.view === "conversations" && view === "chat");
            return (
              <button
                key={item.view}
                className="dash-bnav-btn"
                style={{
                  ...s.bottomNavBtn,
                  color: isActive ? "#C8F135" : "#3A3A52",
                }}
                onClick={() => {
                  if (item.view === "conversations") setSelectedId(null);
                  setView(item.view);
                }}
              >
                <span
                  className="dash-bnav-icon"
                  style={{ color: isActive ? "#C8F135" : "#3A3A52" }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    ...s.bottomNavLabel,
                    color: isActive ? "#C8F135" : "#3A3A52",
                  }}
                >
                  {item.label}
                </span>
                {isActive && <div style={s.bnav_activeDot} />}
              </button>
            );
          })}
          <button
            className="dash-bnav-btn"
            style={{ ...s.bottomNavBtn, color: "#3A3A52" }}
            onClick={() => setShowLogoutModal(true)}
          >
            <span className="dash-bnav-icon">
              <LogOut size={18} />
            </span>
            <span style={s.bottomNavLabel}>Out</span>
          </button>
        </div>

        {showLogoutModal && <LogoutModal />}
      </div>
    );
  }

  // ── Desktop Layout ────────────────────────────────────────
  return (
    <div style={s.container}>
      {/* Nav Rail */}
      <div style={s.navRail}>
        {/* Logo */}
        <div style={s.navLogo}>
          💬
        </div>

        {/* Nav items */}
        <div style={s.navItems}>
          {NAV_ITEMS.map((item) => {
            const isActive = view === item.view;
            return (
              <button
                key={item.view}
                className="dash-nav-btn"
                style={{
                  ...s.navBtn,
                  color: isActive ? "#C8F135" : "#55556A",
                  backgroundColor: isActive
                    ? "rgba(200,241,53,0.1)"
                    : "transparent",
                }}
                onClick={() => {
                  if (item.view === "conversations") setSelectedId(null);
                  setView(item.view);
                }}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "20px",
                      borderRadius: "0 3px 3px 0",
                      backgroundColor: "#C8F135",
                      boxShadow: "0 0 8px rgba(200,241,53,0.6)",
                    }}
                  />
                )}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: isActive
                      ? "rgba(200,241,53,0.12)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(200,241,53,0.25)"
                      : "1px solid transparent",
                    transition: "all 0.2s",
                    boxShadow: isActive
                      ? "0 0 12px rgba(200,241,53,0.2)"
                      : "none",
                  }}
                >
                  {item.icon}
                </span>
                <span className="dash-nav-tooltip">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom: avatar + logout */}
        <div style={s.navBottom}>
          <div style={s.navAvatar} title={agent?.profile?.name || "Agent"}>
            {agent?.profile?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <button
            className="dash-logout-btn"
            style={s.navLogout}
            onClick={() => setShowLogoutModal(true)}
            title="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "home" && (
        <HomePage
          agent={agent}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          installId={installId}
          conversations={conversations}
          setView={setView}
        />
      )}
      {view === "leads" && <Leads installId={installId} token={token} />}
      {view === "docs" && <Docs installId={installId} />}
      {view === "settings" && (
        <Settings installId={installId} token={token} agent={agent} />
      )}

      {view === "conversations" && (
        <>
          <div style={s.sidebar}>
            <div style={s.sidebarHeader}>
              <p style={s.sidebarTitle}>Conversations</p>
              <StatusToggle
                installId={installId}
                isOnline={isOnline}
                setIsOnline={setIsOnline}
              />
            </div>
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={handleSelectConversation}
            />
          </div>
          {selectedId ? (
            <>
              <ChatPanel
                conversationId={selectedId}
                installId={installId}
                token={token}
              />
              <VisitorInfo
                conversation={selectedConversation}
                installId={installId}
                onClose={() => setSelectedId(null)}
              />
            </>
          ) : (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>
                <MessageSquare size={28} color="#3A3A52" />
              </div>
              <h2 style={s.emptyTitle}>No conversation selected</h2>
              <p style={s.emptySub}>
                Pick a conversation from the left to start replying.
              </p>
            </div>
          )}
        </>
      )}

      {showLogoutModal && <LogoutModal />}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#080810",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflow: "hidden",
  },

  // Nav Rail
  navRail: {
    width: "68px",
    minWidth: "68px",
    backgroundColor: "#09090F",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "14px",
    paddingBottom: "14px",
    height: "100vh",
    gap: "0",
  },
  navLogo: {
    width: "38px",
    height: "38px",
    background:
      "#C8F135",
    border: "1px solid rgba(200,241,53,0.3)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
    boxShadow: "0 0 20px rgba(200,241,53,0.15)",
  },
  navItems: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    width: "100%",
    padding: "0 8px",
    alignItems: "center",
  },
  navBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "10px 4px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.15s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: "relative",
  },
  navLabel: {
    fontSize: "8px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1,
  },
  navBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  navAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.1))",
    border: "1px solid rgba(99,102,241,0.4)",
    color: "#818CF8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "13px",
    boxShadow: "0 0 12px rgba(99,102,241,0.2)",
  },
  navLogout: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    color: "#3A3A52",
    transition: "color 0.2s",
    minHeight: "32px",
    minWidth: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Sidebar
  sidebar: {
    width: "280px",
    minWidth: "280px",
    backgroundColor: "#0A0A14",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexShrink: 0,
  },
  sidebarTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "16px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: 0,
  },

  // Empty state
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
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
  emptySub: {
    fontSize: "13px",
    color: "#3A3A52",
    margin: 0,
    textAlign: "center",
  },

  // Mobile
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#080810",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflow: "hidden",
  },
  mobileContent: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  mobilePage: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  mobileHeader: {
    padding: "14px 16px",
    backgroundColor: "#09090F",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  mobileLogoBox: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(200,241,53,0.12)",
    border: "1px solid rgba(200,241,53,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileHeaderTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "18px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: 0,
  },
  mobileChatHeader: {
    padding: "12px 16px",
    backgroundColor: "#09090F",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#818CF8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 0",
    flexShrink: 0,
    minHeight: "44px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  mobileChatName: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "15px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: 0,
    flex: 1,
  },
  mobileStatusBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 9px",
    borderRadius: "20px",
    flexShrink: 0,
    letterSpacing: "0.04em",
  },
  bottomNav: {
    display: "flex",
    backgroundColor: "#09090F",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    paddingTop: "8px",
    paddingBottom: "env(safe-area-inset-bottom, 8px)",
    flexShrink: 0,
  },
  bottomNavBtn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    transition: "color 0.15s",
    minHeight: "48px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: "relative",
  },
  bottomNavLabel: {
    fontSize: "8px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  bnav_activeDot: {
    position: "absolute",
    bottom: "2px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#C8F135",
    boxShadow: "0 0 6px rgba(200,241,53,0.8)",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "24px",
  },
  modal: {
    backgroundColor: "#0F0F1A",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
  },
  modalIcon: {
    width: "60px",
    height: "60px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  modalTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: "18px",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: "0 0 8px 0",
  },
  modalSub: {
    fontSize: "14px",
    color: "#55556A",
    margin: "0 0 24px 0",
    textAlign: "center",
    lineHeight: "1.6",
  },
  modalButtons: { display: "flex", gap: "12px", width: "100%" },
  modalCancel: {
    flex: 1,
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#AAAABC",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    minHeight: "48px",
    transition: "background-color 0.2s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  modalConfirm: {
    flex: 1,
    padding: "12px",
    backgroundColor: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#F87171",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minHeight: "48px",
    transition: "opacity 0.2s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
};
