const { db } = require('../firebase');
const { startEscalationTimer, cancelEscalationTimer } = require('./timerService');

const watchedConversations = new Set();

const startBotWatcher = async () => {
    console.log('🤖 Bot watcher started');

    // Get all users and find chat_bot installs
    const usersSnap = await db.ref('users').once('value');
    if (!usersSnap.exists()) return;

    const users = usersSnap.val();

    Object.entries(users).forEach(([installId, settings]) => {
        if (settings?.mode !== 'chat_bot') return;

        console.log(`👀 Watching conversations for bot install: ${installId}`);

        // Watch for new conversations
        db.ref(`conversations/${installId}`).on('child_added', (convSnap) => {
            const conversationId = convSnap.key;
            watchConversation(conversationId, installId);
        });
    });
};

const watchConversation = (conversationId, installId) => {
    if (watchedConversations.has(conversationId)) return;
    watchedConversations.add(conversationId);

    console.log(`👂 Watching conversation: ${conversationId}`);

    // Skip the first batch of existing messages — only react to new ones
    let initialized = false;

    db.ref(`messages/${conversationId}`).on('child_added', async (msgSnap) => {
        if (!initialized) {
            // Let existing messages load first
            setTimeout(() => { initialized = true; }, 1000);
            return;
        }

        const msg = msgSnap.val();
        if (!msg) return;

        if (msg.sender === 'visitor') {
            console.log(`💬 Visitor message in ${conversationId}: ${msg.text}`);
            startEscalationTimer(conversationId, installId);
        } else if (msg.sender === 'agent') {
            console.log(`✅ Agent replied in ${conversationId} — cancelling timer`);
            cancelEscalationTimer(conversationId);
        }
    });
};

module.exports = { startBotWatcher };