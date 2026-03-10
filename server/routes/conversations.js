const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Get All Conversations ────────────────────
router.get('/', verifyAgent, async (req, res) => {
    try {
        const snap = await db
            .ref(`conversations/${req.agent.installId}`)
            .orderByChild('lastMessageAt')
            .once('value');
        res.json(snap.val() || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Update Conversation Status ───────────────
router.put('/:conversationId/status', verifyAgent, async (req, res) => {
    const { conversationId } = req.params;
    const { status } = req.body;
    try {
        await db
            .ref(`conversations/${req.agent.installId}/${conversationId}`)
            .update({ status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Save Message ─────────────────────────────
router.post('/:conversationId/messages', async (req, res) => {
    const { conversationId } = req.params;
    const { installId, text, sender } = req.body;
    try {
        // Save message
        await db.ref(`messages/${conversationId}`).push({
            sender,
            text,
            timestamp: Date.now(),
            read: false,
        });

        // Update conversation metadata
        const updates = { lastMessageAt: Date.now() };
        if (sender === 'visitor') {
            updates.status = 'waiting';
            updates.lastVisitorMessageAt = Date.now();
        } else if (sender === 'agent') {
            updates.status = 'open';
        }
        await db.ref(`conversations/${installId}/${conversationId}`).update(updates);

        // ── Notification for visitor messages ─────────────────
        if (sender === 'visitor' && installId) {
            const convSnap = await db.ref(`conversations/${installId}/${conversationId}`).once('value');
            const conv = convSnap.val();
            const visitorName = conv?.visitorName || 'A visitor';
            const isReturning = conv?.messageCount > 1;

            // Avoid duplicate: skip if unread notification exists for this conv in last 5 mins
            const existingSnap = await db
                .ref(`notifications/${installId}`)
                .orderByChild('conversationId')
                .equalTo(conversationId)
                .once('value');

            let hasRecentUnread = false;
            if (existingSnap.exists()) {
                hasRecentUnread = Object.values(existingSnap.val()).some(n =>
                    !n.read &&
                    Date.now() - n.timestamp < 5 * 60 * 1000
                );
            }

            if (!hasRecentUnread) {
                await db.ref(`notifications/${installId}`).push({
                    type: isReturning ? 'return' : 'message',
                    message: isReturning
                        ? `${visitorName} returned to a conversation`
                        : `New message from ${visitorName}`,
                    subtext: text?.substring(0, 80) || '',
                    conversationId,
                    read: false,
                    timestamp: Date.now(),
                });
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;