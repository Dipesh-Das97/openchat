const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Get All Leads ────────────────────────────
router.get('/', verifyAgent, async (req, res) => {
    try {
        const snap = await db.ref(`leads/${req.agent.installId}`).once('value');
        if (!snap.exists()) return res.json([]);
        const leads = Object.entries(snap.val()).map(([id, val]) => ({
            id,
            ...val,
            status: val.status || 'new',
        }));
        leads.sort((a, b) => b.timestamp - a.timestamp);
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Submit Lead (called from widget) ────────
// This route is called when a visitor submits the lead form
router.post('/', async (req, res) => {
    const { installId, name, email, phone, services, conversationId } = req.body;
    if (!installId) return res.status(400).json({ error: 'installId required' });
    try {
        const leadRef = await db.ref(`leads/${installId}`).push({
            name:           name || '',
            email:          email || '',
            phone:          phone || '',
            services:       services || '',
            conversationId: conversationId || null,
            status:         'new',
            timestamp:      Date.now(),
        });

        // ── Notification ──────────────────────────────────────
        await db.ref(`notifications/${installId}`).push({
            type:    'lead',
            message: `New lead from ${name || 'a visitor'}`,
            subtext: email || '',
            leadId:  leadRef.key,
            read:    false,
            timestamp: Date.now(),
        });

        res.json({ success: true, leadId: leadRef.key });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Update Lead ──────────────────────────────
router.put('/:leadId', verifyAgent, async (req, res) => {
    const { leadId } = req.params;
    const { status, notes } = req.body;
    try {
        const updates = {};
        if (status)            updates.status    = status;
        if (notes !== undefined) updates.notes   = notes;
        updates.updatedAt = Date.now();
        await db.ref(`leads/${req.agent.installId}/${leadId}`).update(updates);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;