import { injectStyles } from './style.js';
import { buildBubble, buildChatWindow, addMessage, updateStatus, renderFormInChat, showLeadSuccess, unlockChat } from './ui.js';
import { initFirebase, getDb, ref, onValue } from './firebase.js';
import {
  getOrCreateConversation,
  sendMessage,
  listenMessages,
  getAgentPresence,
  getAgentSettings,
  saveLead,
} from './chat.js';

const init = async () => {
  const config    = window.OpenChatConfig || {};
  const { installId } = config;
  if (!installId) { console.warn('[OpenChat] No installId provided.'); return; }

  injectStyles();
  initFirebase();

  const settings = await getAgentSettings(installId);
  if (!settings) { console.warn('[OpenChat] Agent settings not found.'); return; }

  const appearance = settings.appearance || {};

  // ── Resolve all color values (config override → Firebase → defaults) ──
  const primaryColor   = config.primaryColor   || appearance.primaryColor   || '#4F46E5';
  const chatBg         = config.chatBg         || appearance.chatBg         || '#FFFFFF';
  const visitorBubble  = config.visitorBubble  || appearance.visitorBubble  || primaryColor;
  const agentBubble    = config.agentBubble    || appearance.agentBubble    || '#FFFFFF';
  const inputBg        = config.inputBg        || appearance.inputBg        || '#F9FAFB';
  const inputBorder    = config.inputBorder    || appearance.inputBorder    || '#E5E7EB';

  const position       = config.position       || appearance.position       || 'bottom-right';
  const companyName    = config.companyName    || appearance.companyName    || settings?.profile?.company || 'Support';
  const welcomeMessage = config.welcomeMessage || appearance.welcomeMessage || "Hi there! 👋 How can I help you today?";

  // ── Derive readable text color from bubble background ──
  // Converts hex → relative luminance → picks black or white text
  const hexLuminance = (hex) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0,2),16) / 255;
    const g = parseInt(c.substr(2,2),16) / 255;
    const b = parseInt(c.substr(4,2),16) / 255;
    const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };
  const contrastText = (hex) => {
    try { return hexLuminance(hex) > 0.35 ? '#111827' : '#ffffff'; }
    catch { return '#111827'; }
  };

  const visitorText = contrastText(visitorBubble);
  const agentText   = contrastText(agentBubble);

  // ── Apply CSS variables ──
  const root = document.documentElement;
  root.style.setProperty('--oc-primary',        primaryColor);
  root.style.setProperty('--oc-chat-bg',        chatBg);
  root.style.setProperty('--oc-visitor-bubble', visitorBubble);
  root.style.setProperty('--oc-visitor-text',   visitorText);
  root.style.setProperty('--oc-agent-bubble',   agentBubble);
  root.style.setProperty('--oc-agent-text',     agentText);
  root.style.setProperty('--oc-input-bg',       inputBg);
  root.style.setProperty('--oc-input-border',   inputBorder);

  let isOnline       = false;
  let conversationId = null;
  let listening      = false;
  let formShown      = false;

  const bubble = buildBubble({ position });
  const win    = buildChatWindow({ position, companyName }, isOnline);

  // ── Watch agent presence ──
  getAgentPresence(installId, (presence) => {
    isOnline = presence?.online || false;
    updateStatus(isOnline);
  });

  // ── Watch conversation flags ──
  const watchConversationStatus = (convId) => {
    const db = getDb();

    // Closed conversation
    onValue(ref(db, `conversations/${installId}/${convId}/status`), (snap) => {
      if (snap.val() === 'closed') {
        localStorage.removeItem(`oc_conversation_${installId}`);
        conversationId = null;
        listening      = false;
        formShown      = false;
        addMessage('This conversation has been closed. Start a new message anytime! 👋', 'agent', Date.now());
        const input   = document.getElementById('oc-input');
        const sendBtn = document.getElementById('oc-send');
        if (input)   input.disabled   = true;
        if (sendBtn) sendBtn.disabled = true;
      }

      // Agent took over — remove form, unlock input
      if (snap.val() === 'open') {
        const form = document.getElementById('oc-lead-form');
        if (form) { form.remove(); formShown = false; }
        unlockChat();
      }
    });

    // Form requested by agent or AI
    onValue(ref(db, `conversations/${installId}/${convId}/formRequestedBy`), (snap) => {
      const by = snap.val();
      if (!by) return;
      if (by === 'agent') {
        formShown = false;
        const existing = document.getElementById('oc-lead-form');
        if (existing) existing.remove();
        formShown = true;
        showFormInChat(convId);
      } else if (by === 'ai' && !formShown) {
        formShown = true;
        showFormInChat(convId);
      }
    });
  };

  // ── Render lead form ──
  const showFormInChat = (convId) => {
    const leadFields = settings.leadFields || {};
    const input      = document.getElementById('oc-input');
    const sendBtn    = document.getElementById('oc-send');
    if (input) {
      input.disabled           = true;
      input.placeholder        = 'Fill in the form above to continue...';
      input.style.backgroundColor = '#F3F4F6';
      input.style.color           = '#9CA3AF';
      input.style.cursor          = 'not-allowed';
    }
    if (sendBtn) { sendBtn.disabled = true; sendBtn.style.opacity = '0.4'; }

    renderFormInChat(leadFields, async (leadData) => {
      await saveLead(installId, leadData);
      localStorage.setItem(`oc_lead_${installId}`, JSON.stringify(leadData));
      const form = document.getElementById('oc-lead-form');
      if (form) form.remove();
      if (!isOnline) showLeadSuccess(leadData.name);
      unlockChat();
      formShown = false;
    });
  };

  // ── Start chat session ──
  const startChat = async () => {
    const isReturning = !!localStorage.getItem(`oc_conversation_${installId}`);
    conversationId    = await getOrCreateConversation(installId);
    if (!isReturning) await sendMessage(conversationId, installId, welcomeMessage, 'agent');

    if (!listening) {
      listening = true;
      listenMessages(conversationId, (msg) => {
        if (msg.type === 'form_request') return;
        addMessage(msg.text, msg.sender, msg.timestamp);
      });
      watchConversationStatus(conversationId);
    }
  };

  // ── Send handler ──
  const setupSendHandler = () => {
    const input   = document.getElementById('oc-input');
    const sendBtn = document.getElementById('oc-send');
    const handleSend = async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      if (!conversationId) conversationId = await getOrCreateConversation(installId);
      await sendMessage(conversationId, installId, text, 'visitor');
    };
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
  };

  // ── Toggle widget ──
  bubble.addEventListener('click', async () => {
    const isHidden = win.classList.contains('oc-hidden');
    win.classList.toggle('oc-hidden');
    if (isHidden && !conversationId) {
      await startChat();
      setupSendHandler();
    }
  });

  // ── Close button ──
  document.getElementById('oc-close').addEventListener('click', () => {
    win.classList.add('oc-hidden');
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}