const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Save Settings ────────────────────────────
router.put('/settings', verifyAgent, async (req, res) => {
    const {
        profile,
        features,
        leadFields,
        aiConfig,
        workingHours,
        appearance,
        onboardingComplete,
    } = req.body;

    try {
        const updates = {};

        // Profile — merge with existing
        if (profile) {
            const snap = await db.ref(`users/${req.agent.installId}/profile`).once('value');
            const existingProfile = snap.val() || {};
            updates['profile'] = { ...existingProfile, ...profile };
        }

        // Feature toggles
        if (features !== undefined) updates['features'] = features;

        // Lead form config
        if (leadFields !== undefined) updates['leadFields'] = leadFields || null;

        // AI config
        if (aiConfig !== undefined) updates['aiConfig'] = aiConfig || null;

        // Working hours
        if (workingHours !== undefined) updates['workingHours'] = workingHours || null;

        // Widget appearance
        if (appearance !== undefined) updates['appearance'] = appearance || null;

        // Onboarding complete flag
        if (onboardingComplete !== undefined) updates['onboardingComplete'] = onboardingComplete;

        await db.ref(`users/${req.agent.installId}`).update(updates);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Get Settings ─────────────────────────────
router.get('/settings', verifyAgent, async (req, res) => {
    try {
        const snap = await db.ref(`users/${req.agent.installId}`).once('value');
        res.json(snap.val());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;