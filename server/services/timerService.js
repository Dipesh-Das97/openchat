const { db } = require('../firebase');
const { generateReply } = require('./aiService');

const activeTimers = new Map(); // conversationId → timer

const ESCALATION_DELAY = 20 * 60 * 1000; // 20 minutes

const startEscalationTimer = (conversationId, installId) => {
    // Clear any existing timer for this conversation
    cancelEscalationTimer(conversationId);

    console.log(`⏱ Starting 20-min escalation timer for ${conversationId}`);

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

            // Generate AI reply
            const aiReply = await generateReply(conversationId, installId, lastMsg.text);

            // Save AI message to Firebase
            await db.ref(`messages/${conversationId}`).push({
                sender: 'ai',
                text: aiReply,
                timestamp: Date.now(),
                read: false,
            });

            // Update conversation status
            await db.ref(`conversations/${installId}/${conversationId}`).update({
                status: 'ai_handling',
                lastMessageAt: Date.now(),
            });

            // Add system message
            await db.ref(`messages/${conversationId}`).push({
                sender: 'system',
                text: 'AI assistant stepped in after 20 minutes of inactivity.',
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