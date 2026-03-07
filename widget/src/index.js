import { injectStyles } from './style.js';
import { buildBubble, buildChatWindow, addMessage, updateStatus } from './ui.js';
import { initFirebase, getDb, ref, onValue } from './firebase.js';
import {
    getOrCreateConversation,
    sendMessage,
    listenMessages,
    getAgentPresence,
    getAgentSettings,
} from './chat.js';

const init = async () => {
    const config = window.OpenChatConfig || {};
    const { installId, primaryColor, position, companyName, welcomeMessage } = config;

    if (!installId) {
        console.warn('[OpenChat] No installId provided.');
        return;
    }

    // Apply primary color
    if (primaryColor) {
        document.documentElement.style.setProperty('--oc-primary', primaryColor);
    }

    // Inject styles
    injectStyles();

    // Init Firebase
    initFirebase();

    // Get agent settings
    const settings = await getAgentSettings(installId);
    if (!settings) {
        console.warn('[OpenChat] Agent settings not found.');
        return;
    }

    let isOnline = false;
    let conversationId = null;
    let listening = false;

    // Build UI
    const bubble = buildBubble({ position });
    const win = buildChatWindow({
        position,
        companyName: companyName || settings?.profile?.company || 'Support',
    }, isOnline);

    // Watch agent presence
    getAgentPresence(installId, (presence) => {
        isOnline = presence?.online || false;
        updateStatus(isOnline);
    });

    // Watch conversation status — set up after conversationId is known
    const watchConversationStatus = (convId) => {
        const db = getDb();
        onValue(ref(db, `conversations/${installId}/${convId}/status`), (snap) => {
            if (snap.val() === 'closed') {
                // Clear session so next open starts fresh
                localStorage.removeItem(`oc_conversation_${installId}`);
                conversationId = null;
                listening = false;

                // Show closed message in chat
                addMessage(
                    'This conversation has been closed. Start a new message anytime! 👋',
                    'agent',
                    Date.now()
                );

                // Disable input
                const input = document.getElementById('oc-input');
                const sendBtn = document.getElementById('oc-send');
                if (input) input.disabled = true;
                if (sendBtn) sendBtn.disabled = true;
            }
        });
    };

    // Toggle chat window
    bubble.addEventListener('click', async () => {
        const isHidden = win.classList.contains('oc-hidden');
        win.classList.toggle('oc-hidden');

        if (isHidden && !conversationId) {
            const isReturning = !!localStorage.getItem(`oc_conversation_${installId}`);

            conversationId = await getOrCreateConversation(installId);

            if (!isReturning) {
                // New visitor — send welcome message to Firebase
                const welcome = welcomeMessage
                    || settings?.welcomeMessage
                    || 'Hi there! 👋 How can I help you today?';
                await sendMessage(conversationId, installId, welcome, 'agent');
            }

            if (!listening) {
                listening = true;
                listenMessages(conversationId, (msg) => {
                    addMessage(msg.text, msg.sender, msg.timestamp);
                });

                // Now safe to watch status
                watchConversationStatus(conversationId);
            }
        }
    });

    // Close button
    document.getElementById('oc-close').addEventListener('click', () => {
        win.classList.add('oc-hidden');
    });

    // Send message
    const sendBtn = document.getElementById('oc-send');
    const input = document.getElementById('oc-input');

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

// Wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}