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
// Note: Timer/AI logic is handled entirely by botwatcher.js
// This route only saves the message and updates conversation metadata
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

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;