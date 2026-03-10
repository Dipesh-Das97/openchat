import { useState, useEffect, useRef, useCallback } from "react";
import useAgentStore from "../store/agentStore";
import { useIsMobile } from "../hooks/useIsMobile";
import { ref, onValue, push, remove } from "firebase/database";
import { db } from "../firebase";
import {
  Palette,
  ClipboardList,
  Bot,
  Clock,
  User,
  Lock,
  Trash2,
  X,
  Check,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  SendHorizonal,
  CheckSquare,
  ChevronDown,
} from "lucide-react";

// ── Inject styles once ─────────────────────────────────────
function useSettingsStyles() {
  useEffect(() => {
    if (document.getElementById("settings-styles")) return;
    const el = document.createElement("style");
    el.id = "settings-styles";
    el.textContent = `
      @keyframes settingsFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      .settings-tab-content { animation: settingsFadeIn 0.25s ease both; }
      .settings-input::placeholder  { color: #2E2E42; }
      .settings-input:focus  { outline: none; }
      .settings-select:focus { outline: none; }
      .settings-tab-btn:hover { color: #EDEAF5 !important; }
      .settings-save-btn:hover { box-shadow: 0 0 24px rgba(200,241,53,0.45) !important; transform: translateY(-1px) !important; }
      .settings-add-btn:hover  { background-color: rgba(200,241,53,0.18) !important; }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── Tab config ─────────────────────────────────────────────
const TABS = [
  { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
  { id: "leadForm", label: "Lead Form", icon: <ClipboardList size={15} /> },
  { id: "aiConfig", label: "AI Config", icon: <Bot size={15} /> },
  { id: "hours", label: "Hours", icon: <Clock size={15} /> },
  { id: "profile", label: "Profile", icon: <User size={15} /> },
];

// ── Shared atoms ───────────────────────────────────────────
const Toggle = ({ active, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      backgroundColor: active ? "#C8F135" : "rgba(255,255,255,0.1)",
      cursor: "pointer",
      position: "relative",
      transition: "background-color 0.2s",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "2px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: active ? "#080810" : "#555570",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        transition: "transform 0.2s",
        transform: active ? "translateX(22px)" : "translateX(2px)",
      }}
    />
  </div>
);

const Checkbox = ({ checked, onChange, disabled }) => (
  <div
    onClick={() => !disabled && onChange(!checked)}
    style={{
      width: "20px",
      height: "20px",
      minWidth: "20px",
      borderRadius: "5px",
      border: `2px solid ${checked ? "#C8F135" : "rgba(255,255,255,0.15)"}`,
      backgroundColor: checked ? "#C8F135" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s",
      flexShrink: 0,
    }}
  >
    {checked && <Check size={12} color="#080810" strokeWidth={3} />}
  </div>
);

// ── Main component ─────────────────────────────────────────
export default function Settings({ installId, token, agent }) {
  const setAgent = useAgentStore((state) => state.setAgent);
  const isMobile = useIsMobile();
  useSettingsStyles();

  const [activeTab, setActiveTab] = useState("appearance");
  const [saving, setSaving] = useState(false);
  const [savedTab, setSavedTab] = useState(""); // which tab just saved successfully
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const showSuccess = (tab) => {
    setSavedTab(tab);
    setError("");
    // Don't auto-clear — it stays until next change (isDirty flipping will hide it naturally)
  };
  const showError = (msg) => {
    setError(msg);
    setSavedTab("");
  };

  // ── Appearance ─────────────────────────────────────────
  const [appearance, setAppearance] = useState({
    companyName: agent?.appearance?.companyName || "",
    welcomeMessage:
      agent?.appearance?.welcomeMessage ||
      "Hi there! 👋 How can I help you today?",
    primaryColor: agent?.appearance?.primaryColor || "#4F46E5",
    position: agent?.appearance?.position || "bottom-right",
    // Extended color customization
    chatBg: agent?.appearance?.chatBg || "#FFFFFF",
    visitorBubble: agent?.appearance?.visitorBubble || "#F3F4F6",
    agentBubble: agent?.appearance?.agentBubble || "", // empty = use primaryColor
    inputBg: agent?.appearance?.inputBg || "#F9FAFB",
    inputBorder: agent?.appearance?.inputBorder || "#E5E7EB",
  });

  // ── Lead Form ──────────────────────────────────────────
  const [leadFields, setLeadFields] = useState({
    name: agent?.leadFields?.name ?? true,
    email: agent?.leadFields?.email ?? true,
    phone: agent?.leadFields?.phone ?? false,
    company: agent?.leadFields?.company ?? false,
    customQuestion: agent?.leadFields?.customQuestion || "",
    customEnabled: agent?.leadFields?.customEnabled ?? false,
  });
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState(agent?.leadFields?.services || []);
  const [serviceSelectionType, setServiceSelectionType] = useState(
    agent?.leadFields?.serviceSelectionType || "checklist",
  );

  // ── AI Config ──────────────────────────────────────────
  const [aiConfig, setAiConfig] = useState({
    botName: agent?.aiConfig?.botName || "",
    fallbackMessage:
      agent?.aiConfig?.fallbackMessage ||
      "I don't have information on that. Our team will get back to you shortly.",
  });
  const [kbQuestion, setKbQuestion] = useState("");
  const [kbAnswer, setKbAnswer] = useState("");
  const [kbEntries, setKbEntries] = useState([]);
  const [kbLoaded, setKbLoaded] = useState(false);
  const [savingKb, setSavingKb] = useState(false);

  // ── Working Hours ──────────────────────────────────────
  const [workingHours, setWorkingHours] = useState(
    agent?.workingHours || {
      timezone: "Asia/Kolkata",
      mon: { enabled: true, start: "09:00", end: "18:00" },
      tue: { enabled: true, start: "09:00", end: "18:00" },
      wed: { enabled: true, start: "09:00", end: "18:00" },
      thu: { enabled: true, start: "09:00", end: "18:00" },
      fri: { enabled: true, start: "09:00", end: "18:00" },
      sat: { enabled: false, start: "09:00", end: "18:00" },
      sun: { enabled: false, start: "09:00", end: "18:00" },
    },
  );

  // ── Profile ────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: agent?.profile?.name || "",
    company: agent?.profile?.company || agent?.appearance?.companyName || "",
    website: agent?.profile?.website || "",
  });

  // ── KB Firebase listener ───────────────────────────────
  useEffect(() => {
    if (!agent?.features?.aiReply || !installId) return;
    const kbRef = ref(db, `knowledgeBase/${installId}`);
    const unsub = onValue(kbRef, (snap) => {
      if (!snap.exists()) {
        setKbEntries([]);
        setKbLoaded(true);
        return;
      }
      setKbEntries(
        Object.entries(snap.val()).map(([id, val]) => ({ id, ...val })),
      );
      setKbLoaded(true);
    });
    return () => unsub();
  }, [agent?.features?.aiReply, installId]);

  // ── Dirty tracking — compare current vs last saved ─────
  const savedAppearance = useRef(appearance);
  const savedLeadFields = useRef({
    ...leadFields,
    services,
    serviceSelectionType,
  });
  const savedAiConfig = useRef(aiConfig);
  const savedWorkingHours = useRef(workingHours);
  const savedProfile = useRef(profile);

  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const appearanceDirty = !isEqual(appearance, savedAppearance.current);
  const leadFormDirty = !isEqual(
    { ...leadFields, services, serviceSelectionType },
    savedLeadFields.current,
  );
  const aiConfigDirty = !isEqual(aiConfig, savedAiConfig.current);
  const workingHoursDirty = !isEqual(workingHours, savedWorkingHours.current);
  const profileDirty = !isEqual(profile, savedProfile.current);

  // ── Save helper ────────────────────────────────────────
  const saveSettings = async (payload) => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/agent/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Failed to save");
        return false;
      }
      return data;
    } catch {
      showError("Something went wrong.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    const d = await saveSettings({ appearance });
    if (d) {
      setAgent({ ...agent, appearance });
      savedAppearance.current = appearance;
      showSuccess("appearance");
    }
  };
  const handleSaveLeadForm = async () => {
    const payload = {
      leadFields: { ...leadFields, services, serviceSelectionType },
    };
    const d = await saveSettings(payload);
    if (d) {
      setAgent({ ...agent, leadFields: payload.leadFields });
      savedLeadFields.current = payload.leadFields;
      showSuccess("leadForm");
    }
  };
  const handleSaveAiConfig = async () => {
    const d = await saveSettings({ aiConfig });
    if (d) {
      setAgent({ ...agent, aiConfig });
      savedAiConfig.current = aiConfig;
      showSuccess("aiConfig");
    }
  };
  const handleSaveWorkingHours = async () => {
    const d = await saveSettings({ workingHours });
    if (d) {
      setAgent({ ...agent, workingHours });
      savedWorkingHours.current = workingHours;
      showSuccess("hours");
    }
  };
  const handleSaveProfile = async () => {
    const d = await saveSettings({ profile });
    if (d) {
      setAgent({ ...agent, profile: { ...agent?.profile, ...profile } });
      savedProfile.current = profile;
      showSuccess("profile");
    }
  };

  // ── KB actions ─────────────────────────────────────────
  const handleAddKbEntry = async () => {
    const q = kbQuestion.trim(),
      a = kbAnswer.trim();
    if (!q || !a) return;
    setSavingKb(true);
    try {
      await push(ref(db, `knowledgeBase/${installId}`), {
        question: q,
        answer: a,
        createdAt: Date.now(),
      });
      setKbQuestion("");
      setKbAnswer("");
      showSuccess("Entry added!");
    } catch {
      showError("Failed to add entry.");
    } finally {
      setSavingKb(false);
    }
  };
  const handleRemoveKbEntry = async (id) => {
    try {
      await remove(ref(db, `knowledgeBase/${installId}/${id}`));
    } catch {
      showError("Failed to remove entry.");
    }
  };

  const handleAddService = () => {
    const t = serviceInput.trim();
    if (!t || services.includes(t)) return;
    setServices([...services, t]);
    setServiceInput("");
  };
  const handleRemoveService = (i) =>
    setServices(services.filter((_, idx) => idx !== i));

  // ── Shared field style ─────────────────────────────────
  const inp = (name) => ({
    ...s.input,
    borderColor:
      focused === name ? "rgba(200,241,53,0.45)" : "rgba(255,255,255,0.08)",
    boxShadow: focused === name ? "0 0 0 3px rgba(200,241,53,0.07)" : "none",
  });
  const ff = (name) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(""),
  });

  // ── Sub-components ─────────────────────────────────────
  const Feedback = ({ tab, isDirty }) => {
    const justSaved = savedTab === tab && !isDirty;
    return (
      <div style={{ marginBottom: error || justSaved ? "16px" : 0 }}>
        {error && (
          <div style={s.errorBox}>
            <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}
        {justSaved && (
          <div style={s.successBox}>
            <CheckCircle size={14} style={{ flexShrink: 0 }} /> Changes saved
            successfully.
          </div>
        )}
      </div>
    );
  };

  const SaveBtn = ({ onClick, label = "Save Changes", isDirty }) => (
    <button
      className="settings-save-btn"
      style={{
        ...s.saveBtn,
        width: isMobile ? "100%" : "auto",
        opacity: !isDirty || saving ? 0.4 : 1,
        cursor: !isDirty || saving ? "not-allowed" : "pointer",
      }}
      onClick={onClick}
      disabled={!isDirty || saving}
    >
      {saving ? (
        <span style={s.btnRow}>
          <span style={s.spinner} /> Saving...
        </span>
      ) : isDirty ? (
        label
      ) : (
        "✓ Saved"
      )}
    </button>
  );

  const SectionTag = ({ children }) => <p style={s.sectionTag}>{children}</p>;

  const DisabledNotice = ({ feature }) => (
    <div style={s.disabledWrap}>
      <div style={s.disabledIcon}>
        <Lock size={28} color="#3A3A52" />
      </div>
      <p style={s.disabledTitle}>{feature} is not enabled</p>
      <p style={s.disabledSub}>
        Enable it during Setup or ask your admin to turn it on in feature flags.
      </p>
    </div>
  );

  // ── TAB: Appearance ────────────────────────────────────

  // Color preset palettes
  const PRIMARY_PRESETS = [
    "#4F46E5",
    "#7C3AED",
    "#2563EB",
    "#0891B2",
    "#059669",
    "#C8F135",
    "#F59E0B",
    "#EF4444",
  ];

  // Light/pastel widget theme presets
  const WIDGET_THEMES = [
    {
      name: "Snow",
      chatBg: "#FFFFFF",
      visitorBubble: "#F3F4F6",
      inputBg: "#F9FAFB",
      inputBorder: "#E5E7EB",
    },
    {
      name: "Slate",
      chatBg: "#F8FAFC",
      visitorBubble: "#E2E8F0",
      inputBg: "#F1F5F9",
      inputBorder: "#CBD5E1",
    },
    {
      name: "Rose",
      chatBg: "#FFF1F2",
      visitorBubble: "#FFE4E6",
      inputBg: "#FFF1F2",
      inputBorder: "#FECDD3",
    },
    {
      name: "Sky",
      chatBg: "#F0F9FF",
      visitorBubble: "#E0F2FE",
      inputBg: "#F0F9FF",
      inputBorder: "#BAE6FD",
    },
    {
      name: "Mint",
      chatBg: "#F0FDF4",
      visitorBubble: "#DCFCE7",
      inputBg: "#F0FDF4",
      inputBorder: "#BBF7D0",
    },
    {
      name: "Lavender",
      chatBg: "#FAF5FF",
      visitorBubble: "#EDE9FE",
      inputBg: "#FAF5FF",
      inputBorder: "#DDD6FE",
    },
    {
      name: "Peach",
      chatBg: "#FFF7ED",
      visitorBubble: "#FFEDD5",
      inputBg: "#FFF7ED",
      inputBorder: "#FED7AA",
    },
    {
      name: "Lemon",
      chatBg: "#FEFCE8",
      visitorBubble: "#FEF9C3",
      inputBg: "#FEFCE8",
      inputBorder: "#FEF08A",
    },
  ];

  // Helper: is a theme currently active?
  const isThemeActive = (theme) =>
    appearance.chatBg === theme.chatBg &&
    appearance.visitorBubble === theme.visitorBubble &&
    appearance.inputBg === theme.inputBg &&
    appearance.inputBorder === theme.inputBorder;

  // Apply a full theme preset
  const applyTheme = (theme) =>
    setAppearance((prev) => ({
      ...prev,
      chatBg: theme.chatBg,
      visitorBubble: theme.visitorBubble,
      inputBg: theme.inputBg,
      inputBorder: theme.inputBorder,
    }));

  // Reusable color swatch row
  const ColorField = ({ label, field, presets, hint, allowEmpty }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="color"
          value={appearance[field] || "#4F46E5"}
          onChange={(e) =>
            setAppearance({ ...appearance, [field]: e.target.value })
          }
          style={s.colorPicker}
        />
        <input
          className="settings-input"
          style={{
            ...s.input,
            width: "96px",
            fontSize: "12px",
            fontFamily: "monospace",
            padding: "8px 10px",
          }}
          value={appearance[field] || ""}
          placeholder={allowEmpty ? "(uses primary)" : "#ffffff"}
          onChange={(e) =>
            setAppearance({ ...appearance, [field]: e.target.value })
          }
        />
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {allowEmpty && (
            <div
              onClick={() => setAppearance({ ...appearance, [field]: "" })}
              title="Use Primary Color"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                flexShrink: 0,
                cursor: "pointer",
                background: "linear-gradient(135deg, #4F46E5 50%, #7C3AED 50%)",
                border: !appearance[field]
                  ? "2px solid #C8F135"
                  : "2px solid rgba(255,255,255,0.12)",
                transition: "border 0.15s",
              }}
            />
          )}
          {presets.map((c) => (
            <div
              key={c}
              onClick={() => setAppearance({ ...appearance, [field]: c })}
              title={c}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: c,
                cursor: "pointer",
                flexShrink: 0,
                border:
                  appearance[field] === c
                    ? "2px solid #C8F135"
                    : "2px solid rgba(255,255,255,0.12)",
                transition: "border 0.15s",
              }}
            />
          ))}
        </div>
      </div>
      {hint && <p style={s.hint}>{hint}</p>}
    </div>
  );

  // ── Live widget preview ────────────────────────────────
  const WidgetPreview = () => {
    const primary = appearance.primaryColor || "#4F46E5";
    const chatBg = appearance.chatBg || "#FFFFFF";
    const visBubble = appearance.visitorBubble || "#F3F4F6";
    const agentBub = appearance.agentBubble || primary;
    const inputBg = appearance.inputBg || "#F9FAFB";
    const inputBord = appearance.inputBorder || "#E5E7EB";
    const company = appearance.companyName || "Support";

    return (
      <div style={{ marginBottom: "24px" }}>
        <p style={{ ...s.sectionTag, marginBottom: "10px" }}>Live Preview</p>
        <div
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            width: "220px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: primary,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={14} color="#fff" />
            </div>
            <div>
              <div
                style={{ color: "#fff", fontWeight: "700", fontSize: "12px" }}
              >
                {company}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "1px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#4ADE80",
                  }}
                />
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "10px" }}
                >
                  Online
                </span>
              </div>
            </div>
          </div>
          {/* Messages */}
          <div
            style={{
              backgroundColor: chatBg,
              padding: "10px 10px 8px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                backgroundColor: visBubble,
                borderRadius: "10px 10px 10px 3px",
                padding: "6px 9px",
                maxWidth: "80%",
              }}
            >
              <span style={{ fontSize: "11px", color: "#374151" }}>
                Hi! How can I help?
              </span>
            </div>
            <div
              style={{
                backgroundColor: agentBub,
                borderRadius: "10px 10px 3px 10px",
                padding: "6px 9px",
                maxWidth: "80%",
                alignSelf: "flex-end",
              }}
            >
              <span style={{ fontSize: "11px", color: "#fff" }}>
                Sure, let me check that.
              </span>
            </div>
            <div
              style={{
                backgroundColor: visBubble,
                borderRadius: "10px 10px 10px 3px",
                padding: "6px 9px",
                maxWidth: "75%",
              }}
            >
              <span style={{ fontSize: "11px", color: "#374151" }}>
                Thank you!
              </span>
            </div>
          </div>
          {/* Input */}
          <div
            style={{
              backgroundColor: chatBg,
              borderTop: `1px solid ${inputBord}`,
              padding: "7px 8px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: inputBg,
                border: `1px solid ${inputBord}`,
                borderRadius: "12px",
                padding: "5px 10px",
              }}
            >
              <span style={{ fontSize: "10px", color: "#9CA3AF" }}>
                Type a message...
              </span>
            </div>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SendHorizonal size={12} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAppearance = () => (
    <div>
      <Feedback tab="appearance" isDirty={appearanceDirty} />

      {/* ── Live Preview ── */}
      <WidgetPreview />

      <div style={s.divider} />
      <p style={s.sectionTag}>Branding</p>

      {/* ── Basic ── */}
      <div style={s.field}>
        <label style={s.label}>Company / Brand Name</label>
        <input
          className="settings-input"
          style={inp("cname")}
          type="text"
          placeholder="Acme Inc."
          value={appearance.companyName}
          onChange={(e) =>
            setAppearance({ ...appearance, companyName: e.target.value })
          }
          {...ff("cname")}
        />
      </div>

      <div style={s.field}>
        <label style={s.label}>Welcome Message</label>
        <input
          className="settings-input"
          style={inp("welcome")}
          type="text"
          value={appearance.welcomeMessage}
          onChange={(e) =>
            setAppearance({ ...appearance, welcomeMessage: e.target.value })
          }
          {...ff("welcome")}
        />
      </div>

      {/* ── Primary Color ── */}
      <div style={s.field}>
        <label style={s.label}>
          Primary Color{" "}
          <span style={s.badgeOptional}>header · launcher · send button</span>
        </label>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="color"
            value={appearance.primaryColor}
            onChange={(e) =>
              setAppearance({ ...appearance, primaryColor: e.target.value })
            }
            style={s.colorPicker}
          />
          <input
            className="settings-input"
            style={{
              ...s.input,
              width: "96px",
              fontSize: "12px",
              fontFamily: "monospace",
              padding: "8px 10px",
            }}
            value={appearance.primaryColor}
            onChange={(e) =>
              setAppearance({ ...appearance, primaryColor: e.target.value })
            }
          />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PRIMARY_PRESETS.map((c) => (
              <div
                key={c}
                onClick={() =>
                  setAppearance({ ...appearance, primaryColor: c })
                }
                title={c}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: c,
                  cursor: "pointer",
                  flexShrink: 0,
                  border:
                    appearance.primaryColor === c
                      ? "2px solid #C8F135"
                      : "2px solid rgba(255,255,255,0.12)",
                  transition: "border 0.15s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={s.divider} />
      <p style={s.sectionTag}>Widget Theme</p>
      <p style={s.tabSub}>
        Pick a preset, then fine-tune individual surfaces below.
      </p>

      {/* ── Theme presets grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {WIDGET_THEMES.map((theme) => (
          <div
            key={theme.name}
            onClick={() => applyTheme(theme)}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              border: `2px solid ${isThemeActive(theme) ? "#C8F135" : "rgba(255,255,255,0.08)"}`,
              transition: "border-color 0.15s",
            }}
          >
            {/* Mini chat preview */}
            <div
              style={{
                backgroundColor: theme.chatBg,
                padding: "7px 8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  backgroundColor: theme.visitorBubble,
                  borderRadius: "5px 5px 5px 2px",
                  height: "9px",
                  width: "62%",
                }}
              />
              <div
                style={{
                  backgroundColor: appearance.primaryColor,
                  borderRadius: "5px 5px 2px 5px",
                  height: "9px",
                  width: "48%",
                  alignSelf: "flex-end",
                }}
              />
              <div
                style={{
                  backgroundColor: theme.visitorBubble,
                  borderRadius: "5px 5px 5px 2px",
                  height: "9px",
                  width: "55%",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: "5px",
                  height: "7px",
                  marginTop: "3px",
                }}
              />
            </div>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.05)",
                padding: "4px 6px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: isThemeActive(theme) ? "#C8F135" : "#55556A",
                }}
              >
                {theme.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ ...s.tabSub, marginBottom: "14px" }}>
        Fine-tune individual surfaces:
      </p>

      {/* ── Per-surface color controls ── */}
      <ColorField
        label="Chat Window Background"
        field="chatBg"
        presets={[
          "#FFFFFF",
          "#F8FAFC",
          "#F0F9FF",
          "#F0FDF4",
          "#FAF5FF",
          "#FFF7ED",
        ]}
        hint="The overall background of the chat window"
      />
      <ColorField
        label="Visitor Message Bubble"
        field="visitorBubble"
        presets={[
          "#F3F4F6",
          "#E2E8F0",
          "#E0F2FE",
          "#DCFCE7",
          "#EDE9FE",
          "#FFEDD5",
        ]}
        hint="Bubbles for incoming visitor messages"
      />
      <ColorField
        label="Agent Message Bubble"
        field="agentBubble"
        presets={[
          "#4F46E5",
          "#7C3AED",
          "#2563EB",
          "#059669",
          "#0891B2",
          "#DB2777",
        ]}
        hint="Leave blank to follow Primary Color"
        allowEmpty
      />
      <ColorField
        label="Input Area Background"
        field="inputBg"
        presets={[
          "#F9FAFB",
          "#F1F5F9",
          "#F0F9FF",
          "#F0FDF4",
          "#FAF5FF",
          "#FFF7ED",
        ]}
        hint="Background of the message input box"
      />
      <ColorField
        label="Input Border / Divider"
        field="inputBorder"
        presets={[
          "#E5E7EB",
          "#CBD5E1",
          "#BAE6FD",
          "#BBF7D0",
          "#DDD6FE",
          "#FED7AA",
        ]}
        hint="Border around the input and the line above it"
      />

      <div style={s.divider} />
      <p style={s.sectionTag}>Position</p>

      <div style={{ ...s.field, display: "flex", gap: "10px" }}>
        {[
          { pos: "bottom-right", label: "↘ Bottom Right" },
          { pos: "bottom-left", label: "↙ Bottom Left" },
        ].map(({ pos, label }) => (
          <div
            key={pos}
            onClick={() => setAppearance({ ...appearance, position: pos })}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "center",
              border: `1px solid ${appearance.position === pos ? "rgba(200,241,53,0.45)" : "rgba(255,255,255,0.08)"}`,
              backgroundColor:
                appearance.position === pos
                  ? "rgba(200,241,53,0.07)"
                  : "rgba(255,255,255,0.03)",
              color: appearance.position === pos ? "#C8F135" : "#55556A",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.15s",
              minHeight: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <SaveBtn onClick={handleSaveAppearance} isDirty={appearanceDirty} />
    </div>
  );

  // ── TAB: Lead Form ─────────────────────────────────────
  const renderLeadForm = () => {
    if (!agent?.features?.leadForm)
      return <DisabledNotice feature="Lead Form" />;
    return (
      <div>
        <Feedback tab="leadForm" isDirty={leadFormDirty} />
        <p style={s.tabSub}>
          Choose which fields to show on the lead capture form.
        </p>

        {[
          { key: "name", label: "Full Name", required: true },
          { key: "email", label: "Email Address", required: true },
          { key: "phone", label: "Phone Number" },
          { key: "company", label: "Company Name" },
        ].map(({ key, label, required }) => (
          <div key={key} style={s.checkRow}>
            <Checkbox
              checked={leadFields[key]}
              onChange={(v) =>
                !required && setLeadFields({ ...leadFields, [key]: v })
              }
              disabled={required}
            />
            <span style={s.checkLabel}>{label}</span>
            {required && <span style={s.badgeRequired}>Required</span>}
          </div>
        ))}

        <div style={{ ...s.field, marginTop: "20px" }}>
          <label style={s.label}>
            Custom Question <span style={s.badgeOptional}>optional</span>
          </label>
          <input
            className="settings-input"
            style={inp("customQ")}
            type="text"
            placeholder="e.g. What service are you interested in?"
            value={leadFields.customQuestion}
            onChange={(e) =>
              setLeadFields({
                ...leadFields,
                customQuestion: e.target.value,
                customEnabled: e.target.value.length > 0,
              })
            }
            {...ff("customQ")}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>
            Services Dropdown <span style={s.badgeOptional}>optional</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              className="settings-input"
              style={{ ...inp("svc"), flex: 1 }}
              type="text"
              placeholder="e.g. Web Design"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddService()}
              {...ff("svc")}
            />
            <button
              className="settings-add-btn"
              style={s.addBtn}
              onClick={handleAddService}
            >
              Add
            </button>
          </div>
          {services.length > 0 && (
            <div style={s.tags}>
              {services.map((sv, i) => (
                <div key={i} style={s.tag}>
                  <span style={s.tagText}>{sv}</span>
                  <button style={s.tagX} onClick={() => handleRemoveService(i)}>
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.field}>
          <label style={s.label}>Selection Type</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              {
                v: "checklist",
                l: "Checklist",
                icon: <CheckSquare size={14} />,
              },
              { v: "dropdown", l: "Dropdown", icon: <ChevronDown size={14} /> },
            ].map(({ v, l, icon }) => (
              <div
                key={v}
                onClick={() => setServiceSelectionType(v)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: `1px solid ${serviceSelectionType === v ? "rgba(200,241,53,0.45)" : "rgba(255,255,255,0.08)"}`,
                  backgroundColor:
                    serviceSelectionType === v
                      ? "rgba(200,241,53,0.07)"
                      : "rgba(255,255,255,0.03)",
                  color: serviceSelectionType === v ? "#C8F135" : "#55556A",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.15s",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {icon}
                {l}
              </div>
            ))}
          </div>
        </div>

        <SaveBtn onClick={handleSaveLeadForm} isDirty={leadFormDirty} />
      </div>
    );
  };

  // ── TAB: AI Config ─────────────────────────────────────
  const renderAiConfig = () => {
    if (!agent?.features?.aiReply)
      return <DisabledNotice feature="AI Auto-reply" />;
    return (
      <div>
        <Feedback tab="aiConfig" isDirty={aiConfigDirty} />
        <div style={s.field}>
          <label style={s.label}>Bot Name</label>
          <input
            className="settings-input"
            style={inp("botName")}
            type="text"
            placeholder="Aria, Max, Support Bot..."
            value={aiConfig.botName}
            onChange={(e) =>
              setAiConfig({ ...aiConfig, botName: e.target.value })
            }
            {...ff("botName")}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Fallback Message</label>
          <textarea
            className="settings-input"
            style={{
              ...inp("fallback"),
              minHeight: "80px",
              resize: "vertical",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            value={aiConfig.fallbackMessage}
            onChange={(e) =>
              setAiConfig({ ...aiConfig, fallbackMessage: e.target.value })
            }
            {...ff("fallback")}
          />
          <p style={s.hint}>
            Sent when AI can't find an answer in the knowledge base.
          </p>
        </div>

        <SaveBtn
          onClick={handleSaveAiConfig}
          label="Save AI Config"
          isDirty={aiConfigDirty}
        />

        <div style={s.divider} />
        <SectionTag>Knowledge Base</SectionTag>
        <p style={s.tabSub}>
          Add Q&A pairs the AI will use to answer visitors.
        </p>

        <div style={s.field}>
          <label style={s.label}>Question</label>
          <input
            className="settings-input"
            style={inp("kbQ")}
            type="text"
            placeholder="e.g. What are your working hours?"
            value={kbQuestion}
            onChange={(e) => setKbQuestion(e.target.value)}
            {...ff("kbQ")}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Answer</label>
          <textarea
            className="settings-input"
            style={{
              ...inp("kbA"),
              minHeight: "80px",
              resize: "vertical",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            placeholder="e.g. We're open Mon–Fri, 9am to 6pm IST."
            value={kbAnswer}
            onChange={(e) => setKbAnswer(e.target.value)}
            {...ff("kbA")}
          />
        </div>

        <button
          className="settings-add-btn"
          style={{
            ...s.addBtn,
            width: isMobile ? "100%" : "auto",
            marginBottom: "20px",
            opacity: savingKb ? 0.7 : 1,
          }}
          onClick={handleAddKbEntry}
          disabled={savingKb}
        >
          {savingKb ? "Adding..." : "+ Add Entry"}
        </button>

        {kbLoaded && kbEntries.length === 0 && (
          <p style={s.hint}>No entries yet. Add your first Q&A above!</p>
        )}

        {kbEntries.map((entry) => (
          <div key={entry.id} style={s.kbEntry}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={s.kbQ}>Q: {entry.question}</p>
              <p style={s.kbA}>A: {entry.answer}</p>
            </div>
            <button style={s.kbX} onClick={() => handleRemoveKbEntry(entry.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // ── TAB: Working Hours ─────────────────────────────────
  const renderWorkingHours = () => {
    if (!agent?.features?.workingHours)
      return <DisabledNotice feature="Working Hours" />;
    return (
      <div>
        <Feedback tab="hours" isDirty={workingHoursDirty} />
        <div style={s.field}>
          <label style={s.label}>Timezone</label>
          <select
            className="settings-select"
            style={{ ...inp("tz"), cursor: "pointer" }}
            value={workingHours.timezone}
            onChange={(e) =>
              setWorkingHours({ ...workingHours, timezone: e.target.value })
            }
            {...ff("tz")}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">
              America/Los_Angeles (PST)
            </option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
          </select>
        </div>

        <div style={s.daysGrid}>
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
            <div
              key={day}
              style={{
                ...s.dayRow,
                opacity: workingHours[day].enabled ? 1 : 0.5,
                backgroundColor: workingHours[day].enabled
                  ? "rgba(200,241,53,0.04)"
                  : "rgba(255,255,255,0.02)",
                borderColor: workingHours[day].enabled
                  ? "rgba(200,241,53,0.2)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Checkbox
                checked={workingHours[day].enabled}
                onChange={(v) =>
                  setWorkingHours({
                    ...workingHours,
                    [day]: { ...workingHours[day], enabled: v },
                  })
                }
              />
              <span style={s.dayLabel}>{day.toUpperCase()}</span>
              {workingHours[day].enabled ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "auto",
                  }}
                >
                  <input
                    type="time"
                    style={s.timeInput}
                    value={workingHours[day].start}
                    onChange={(e) =>
                      setWorkingHours({
                        ...workingHours,
                        [day]: { ...workingHours[day], start: e.target.value },
                      })
                    }
                  />
                  <span style={{ color: "#55556A", fontSize: "12px" }}>—</span>
                  <input
                    type="time"
                    style={s.timeInput}
                    value={workingHours[day].end}
                    onChange={(e) =>
                      setWorkingHours({
                        ...workingHours,
                        [day]: { ...workingHours[day], end: e.target.value },
                      })
                    }
                  />
                </div>
              ) : (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    color: "#3A3A52",
                    fontWeight: "600",
                  }}
                >
                  Off
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <SaveBtn
            onClick={handleSaveWorkingHours}
            label="Save Hours"
            isDirty={workingHoursDirty}
          />
        </div>
      </div>
    );
  };

  // ── TAB: Profile ───────────────────────────────────────
  const renderProfile = () => (
    <div>
      <Feedback tab="profile" isDirty={profileDirty} />
      <div style={s.field}>
        <label style={s.label}>Full Name</label>
        <input
          className="settings-input"
          style={inp("pname")}
          type="text"
          placeholder="Your name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          {...ff("pname")}
        />
      </div>

      <div style={s.field}>
        <label style={s.label}>Email</label>
        <input
          style={{
            ...s.input,
            backgroundColor: "rgba(255,255,255,0.02)",
            color: "#3A3A52",
            cursor: "not-allowed",
          }}
          type="email"
          value={agent?.profile?.email || ""}
          disabled
        />
        <p style={s.hint}>Email cannot be changed.</p>
      </div>

      <div style={s.field}>
        <label style={s.label}>Company</label>
        <input
          className="settings-input"
          style={inp("pco")}
          type="text"
          placeholder="Your company name"
          value={profile.company}
          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
          {...ff("pco")}
        />
      </div>

      <div style={s.field}>
        <label style={s.label}>Website</label>
        <input
          className="settings-input"
          style={inp("pweb")}
          type="text"
          placeholder="https://yoursite.com"
          value={profile.website}
          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
          {...ff("pweb")}
        />
      </div>

      <SaveBtn onClick={handleSaveProfile} isDirty={profileDirty} />
    </div>
  );

  const tabContent = {
    appearance: renderAppearance,
    leadForm: renderLeadForm,
    aiConfig: renderAiConfig,
    hours: renderWorkingHours,
    profile: renderProfile,
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div style={s.root}>
      <div
        style={{ ...s.inner, padding: isMobile ? "20px 16px 100px" : "32px" }}
      >
        <h1 style={{ ...s.pageTitle, fontSize: isMobile ? "20px" : "24px" }}>
          Settings
        </h1>

        {/* Tab bar */}
        <div
          style={{
            ...s.tabBar,
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className="settings-tab-btn"
              style={{
                ...s.tabBtn,
                color: activeTab === tab.id ? "#EDEAF5" : "#55556A",
                borderBottom: `2px solid ${activeTab === tab.id ? "#C8F135" : "transparent"}`,
                fontWeight: activeTab === tab.id ? "700" : "400",
              }}
              onClick={() => {
                setActiveTab(tab.id);
                setSavedTab("");
                setError("");
              }}
            >
              <span style={{ marginRight: "6px" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          key={activeTab}
          style={s.tabContent}
          className="settings-tab-content"
        >
          {tabContent[activeTab]?.()}
        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  root: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "transparent",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  inner: {
    maxWidth: "680px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: "800",
    color: "#EDEAF5",
    margin: "0 0 24px 0",
    letterSpacing: "-0.02em",
  },
  tabBar: {
    display: "flex",
    gap: "2px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "24px",
  },
  tabBtn: {
    padding: "10px 16px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: "13px",
    transition: "color 0.15s, border-color 0.15s",
    minHeight: "44px",
    whiteSpace: "nowrap",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: "flex",
    alignItems: "center",
  },
  tabContent: {
    backgroundColor: "#0F0F1A",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  tabSub: {
    fontSize: "13px",
    color: "#55556A",
    margin: "0 0 20px 0",
    lineHeight: "1.6",
  },
  sectionTag: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#C8F135",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: "0 0 8px 0",
  },
  divider: {
    borderTop: "1px solid rgba(255,255,255,0.07)",
    margin: "24px 0",
  },
  field: { marginBottom: "16px" },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6B6B80",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#EDEAF5",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  hint: { fontSize: "12px", color: "#3A3A52", margin: "6px 0 0 0" },
  colorPicker: {
    width: "44px",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    padding: "2px",
    backgroundColor: "transparent",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  checkLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#AAAABC",
    flex: 1,
  },
  badgeRequired: {
    fontSize: "10px",
    backgroundColor: "rgba(99,102,241,0.15)",
    color: "#818CF8",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  badgeOptional: {
    fontSize: "10px",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#55556A",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "500",
  },
  addBtn: {
    padding: "12px 16px",
    flexShrink: 0,
    backgroundColor: "rgba(200,241,53,0.1)",
    border: "1px solid rgba(200,241,53,0.25)",
    color: "#C8F135",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    minHeight: "48px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "background-color 0.2s",
  },
  tags: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "rgba(200,241,53,0.08)",
    border: "1px solid rgba(200,241,53,0.22)",
    borderRadius: "20px",
    padding: "5px 10px 5px 12px",
  },
  tagText: { fontSize: "12px", fontWeight: "600", color: "#C8F135" },
  tagX: {
    background: "none",
    border: "none",
    color: "#C8F135",
    cursor: "pointer",
    fontSize: "11px",
    padding: 0,
    opacity: 0.6,
    minHeight: "22px",
    minWidth: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  daysGrid: { display: "flex", flexDirection: "column", gap: "8px" },
  dayRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.15s",
  },
  dayLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#AAAABC",
    width: "32px",
    flexShrink: 0,
    letterSpacing: "0.06em",
  },
  timeInput: {
    padding: "7px 10px",
    borderRadius: "7px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "13px",
    color: "#EDEAF5",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  kbEntry: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "8px",
  },
  kbQ: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#EDEAF5",
    margin: "0 0 4px 0",
    wordBreak: "break-word",
  },
  kbA: {
    fontSize: "12px",
    color: "#55556A",
    margin: 0,
    wordBreak: "break-word",
  },
  kbX: {
    background: "none",
    border: "none",
    color: "#3A3A52",
    cursor: "pointer",
    fontSize: "13px",
    padding: 0,
    flexShrink: 0,
    minHeight: "28px",
    minWidth: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.15s",
  },
  saveBtn: {
    padding: "12px 24px",
    backgroundColor: "#C8F135",
    color: "#080810",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minHeight: "48px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: "0 0 14px rgba(200,241,53,0.2)",
    transition: "opacity 0.2s, box-shadow 0.2s, transform 0.2s",
  },
  btnRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "13px",
    height: "13px",
    border: "2px solid rgba(8,8,16,0.25)",
    borderTopColor: "#080810",
    borderRadius: "50%",
    display: "inline-block",
    animation: "authSpin 0.7s linear infinite",
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.22)",
    color: "#FCA5A5",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  successBox: {
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.22)",
    color: "#6EE7B7",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  disabledWrap: {
    textAlign: "center",
    padding: "48px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  disabledIcon: {
    fontSize: "36px",
    width: "64px",
    height: "64px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  disabledTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#AAAABC",
    margin: 0,
  },
  disabledSub: {
    fontSize: "13px",
    color: "#3A3A52",
    margin: 0,
    lineHeight: "1.6",
  },
};
