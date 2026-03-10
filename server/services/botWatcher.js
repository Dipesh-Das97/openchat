const { db } = require('../firebase');
const { startEscalationTimer, cancelEscalationTimer } = require('./timerService');
const { generateReply } = require('./aiService');

const watchedConversations = new Set();

const startBotWatcher = async () => {
    console.log('🤖 Bot watcher started');

    const usersSnap = await db.ref('users').once('value');
    if (!usersSnap.exists()) return;

    const users = usersSnap.val();
    Object.entries(users).forEach(([installId, settings]) => {
        if (!settings?.features?.aiReply) return;
        console.log(`👀 Watching conversations for AI install: ${installId}`);

        db.ref(`conversations/${installId}`).on('child_added', (convSnap) => {
            const conversationId = convSnap.key;
            watchConversation(conversationId, installId);
        });
    });
};

// ── Correct presence path: agentPresence/${installId}/online ──
const isAgentOnline = async (installId) => {
    const snap = await db.ref(`agentPresence/${installId}/online`).once('value');
    return snap.val() === true;
};

// ── Trigger AI immediately (no timer) ─────────────────────────
const triggerAiImmediately = async (conversationId, installId, visitorMessage) => {
    console.log(`🤖 Agent offline — triggering AI immediately for ${conversationId}`);
    try {
        const { reply, understood, triggerForm } = await generateReply(conversationId, installId, visitorMessage);

        // Push AI reply first so it appears before the form
        await db.ref(`messages/${conversationId}`).push({
            sender: 'ai',
            text: reply,
            timestamp: Date.now(),
            read: false,
        });

        // Set formRequested AFTER reply so form appears below the message
        if (triggerForm) {
            await db.ref(`conversations/${installId}/${conversationId}`).update({
                formRequested: true,
                formRequestedBy: 'ai',
            });
        }

        await db.ref(`conversations/${installId}/${conversationId}`).update({
            lastMessageAt: Date.now(),
            status: understood ? 'ai_handling' : 'waiting',
        });

        const systemText = understood
            ? '🤖 AI assistant answered this conversation.'
            : triggerForm
                ? '🤖 AI couldn\'t answer — lead form sent to visitor & agent notified.'
                : '🤖 AI responded (greeting/vague message — no form triggered yet).';

        await db.ref(`messages/${conversationId}`).push({
            sender: 'system',
            text: systemText,
            timestamp: Date.now() + 1,
            read: false,
        });

    } catch (err) {
        console.error('Immediate AI trigger error:', err);
    }
};

const watchConversation = (conversationId, installId) => {
    if (watchedConversations.has(conversationId)) return;
    watchedConversations.add(conversationId);
    console.log(`👂 Watching conversation: ${conversationId}`);

    db.ref(`messages/${conversationId}`).once('value', (existingSnap) => {
        const existingKeys = new Set(existingSnap.exists() ? Object.keys(existingSnap.val()) : []);

        db.ref(`messages/${conversationId}`).on('child_added', async (msgSnap) => {
            if (existingKeys.has(msgSnap.key)) return;

            const msg = msgSnap.val();
            if (!msg) return;

            if (msg.sender === 'visitor') {
                console.log(`💬 Visitor message in ${conversationId}: ${msg.text}`);

                const online = await isAgentOnline(installId);

                if (online) {
                    console.log(`⏱ Agent online — starting escalation timer for ${conversationId}`);
                    startEscalationTimer(conversationId, installId, msg.text);
                } else {
                    cancelEscalationTimer(conversationId);
                    triggerAiImmediately(conversationId, installId, msg.text);
                }

            } else if (msg.sender === 'agent') {
                console.log(`✅ Agent replied in ${conversationId} — cancelling timer`);
                cancelEscalationTimer(conversationId);
            }
        });
    });
};

module.exports = { startBotWatcher };