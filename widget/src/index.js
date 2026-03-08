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
    const config = window.OpenChatConfig || {};
    const { installId } = config;
    if (!installId) {
        console.warn('[OpenChat] No installId provided.');
        return;
    }

    injectStyles();
    initFirebase();

    const settings = await getAgentSettings(installId);
    if (!settings) {
        console.warn('[OpenChat] Agent settings not found.');
        return;
    }

    const appearance = settings.appearance || {};
    const features = settings.features || {};
    const primaryColor = config.primaryColor || appearance.primaryColor || '#4F46E5';
    const position = config.position || appearance.position || 'bottom-right';
    const companyName = config.companyName || appearance.companyName || settings?.profile?.company || 'Support';
    const welcomeMessage = config.welcomeMessage || appearance.welcomeMessage || "Hi there! 👋 How can I help you today?";

    document.documentElement.style.setProperty('--oc-primary', primaryColor);

    let isOnline = false;
    let conversationId = null;
    let listening = false;
    let formShown = false; // track if form has been shown this session

    const bubble = buildBubble({ position });
    const win = buildChatWindow({ position, companyName }, isOnline);

    // Watch agent presence
    getAgentPresence(installId, (presence) => {
        isOnline = presence?.online || false;
        updateStatus(isOnline);
    });

    // Watch conversation status + flags
    const watchConversationStatus = (convId) => {
        const db = getDb();

        // Watch for closed status
        onValue(ref(db, `conversations/${installId}/${convId}/status`), (snap) => {
            if (snap.val() === 'closed') {
                localStorage.removeItem(`oc_conversation_${installId}`);
                conversationId = null;
                listening = false;
                formShown = false;
                addMessage(
                    'This conversation has been closed. Start a new message anytime! 👋',
                    'agent',
                    Date.now()
                );
                const input = document.getElementById('oc-input');
                const sendBtn = document.getElementById('oc-send');
                if (input) input.disabled = true;
                if (sendBtn) sendBtn.disabled = true;
            }
        });

        // Watch for formRequested — set by agent "Send Form" button or AI fallback
        // Agent-triggered: always show regardless of formShown
        // AI-triggered: only show once
        onValue(ref(db, `conversations/${installId}/${convId}/formRequestedBy`), (snap) => {
            const by = snap.val();
            if (!by) return;

            if (by === 'agent') {
                // Agent explicitly sent form — always show, reset state
                formShown = false;
                const existingForm = document.getElementById('oc-lead-form');
                if (existingForm) existingForm.remove();
                formShown = true;
                showFormInChat(convId);
            } else if (by === 'ai' && !formShown) {
                formShown = true;
                showFormInChat(convId);
            }
        });

        // Watch for agent messages — if agent takes over, unlock input and remove form
        onValue(ref(db, `conversations/${installId}/${convId}/status`), (snap) => {
            if (snap.val() === 'open') {
                // Agent has taken over — remove form if showing, unlock input
                const form = document.getElementById('oc-lead-form');
                if (form) {
                    form.remove();
                    formShown = false;
                }
                unlockChat();
            }
        });
    };

    // Render lead form inside chat
    const showFormInChat = (convId) => {
        const leadFields = settings.leadFields || {};
        const input = document.getElementById('oc-input');
        const sendBtn = document.getElementById('oc-send');

        if (input) {
            input.disabled = true;
            input.placeholder = 'Fill in the form above to continue...';
            input.style.backgroundColor = '#F3F4F6';
            input.style.color = '#9CA3AF';
            input.style.cursor = 'not-allowed';
        }
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.4';
        }

        renderFormInChat(
            leadFields,
            async (leadData) => {
                await saveLead(installId, leadData);
                localStorage.setItem(`oc_lead_${installId}`, JSON.stringify(leadData));
                // Always remove the form
                const form = document.getElementById('oc-lead-form');
                if (form) form.remove();
                // Only show AI thank you if agent is offline
                // If agent is online they'll respond personally
                if (!isOnline) showLeadSuccess(leadData.name);
                unlockChat();
                formShown = false;
            }
        );
    };

    // Start chat session
    const startChat = async () => {
        const isReturning = !!localStorage.getItem(`oc_conversation_${installId}`);
        conversationId = await getOrCreateConversation(installId);

        if (!isReturning) {
            await sendMessage(conversationId, installId, welcomeMessage, 'agent');
        }

        if (!listening) {
            listening = true;
            listenMessages(conversationId, (msg) => {
                if (msg.type === 'form_request') return;
                addMessage(msg.text, msg.sender, msg.timestamp);
            });
            watchConversationStatus(conversationId);
        }
    };

    // Send handler
    const setupSendHandler = () => {
        const input = document.getElementById('oc-input');
        const sendBtn = document.getElementById('oc-send');

        const handleSend = async () => {
            const text = input.value.trim();
            if (!text) return;
            input.value = '';

            if (!conversationId) {
                conversationId = await getOrCreateConversation(installId);
            }

            await sendMessage(conversationId, installId, text, 'visitor');
        };

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    };

    // Toggle chat window
    bubble.addEventListener('click', async () => {
        const isHidden = win.classList.contains('oc-hidden');
        win.classList.toggle('oc-hidden');

        if (isHidden && !conversationId) {
            await startChat();
            setupSendHandler();
        }
    });

    // Close button
    document.getElementById('oc-close').addEventListener('click', () => {
        win.classList.add('oc-hidden');
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}