const { db } = require('../firebase');
const { generateReply } = require('./aiService');

const activeTimers = new Map();

// const ESCALATION_DELAY = 20 * 60 * 1000; // 20 minutes
const ESCALATION_DELAY = 30 * 1000; // Test

const startEscalationTimer = (conversationId, installId, visitorMessage) => {
    cancelEscalationTimer(conversationId);

    console.log(`⏱ Starting escalation timer for ${conversationId}`);

    const timer = setTimeout(async () => {
        try {
            // Check if agent has already replied
            const snap = await db.ref(`messages/${conversationId}`)
                .orderByChild('timestamp')
                .limitToLast(1)
                .once('value');

            if (!snap.exists()) return;

            const lastMsg = Object.values(snap.val())[0];

            // If last message is from agent or AI, don't escalate
            if (lastMsg.sender !== 'visitor') {
                console.log(`✅ Agent already replied to ${conversationId}, skipping escalation`);
                return;
            }

            console.log(`🤖 Escalating conversation ${conversationId} to AI`);

            const messageToAnswer = visitorMessage || lastMsg.text;

            // Generate AI reply
            const { reply, understood, triggerForm } = await generateReply(conversationId, installId, messageToAnswer);

            // Push AI reply FIRST so it appears before the form
            await db.ref(`messages/${conversationId}`).push({
                sender: 'ai',
                text: reply,
                timestamp: Date.now(),
                read: false,
            });

            // Set formRequested AFTER reply is pushed — widget renders form below message
            if (triggerForm) {
                await db.ref(`conversations/${installId}/${conversationId}`).update({
                    formRequested: true,
                    formRequestedBy: 'ai',
                });
            }

            // Update conversation status
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

            activeTimers.delete(conversationId);

        } catch (err) {
            console.error('Escalation timer error:', err);
        }
    }, ESCALATION_DELAY);

    activeTimers.set(conversationId, timer);
};

const cancelEscalationTimer = (conversationId) => {
    if (activeTimers.has(conversationId)) {
        clearTimeout(activeTimers.get(conversationId));
        activeTimers.delete(conversationId);
        console.log(`❌ Cancelled escalation timer for ${conversationId}`);
    }
};

module.exports = { startEscalationTimer, cancelEscalationTimer };