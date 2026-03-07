const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Save Settings ────────────────────────────
router.put('/settings', verifyAgent, async (req, res) => {
  const { mode, botConfig, workingHours, leadFields, welcomeMessage, onboardingComplete, profile } = req.body;

  try {
    const updates = {};

    // Profile update
    if (profile) {
      // Get existing profile first to merge
      const snap = await db.ref(`users/${req.agent.installId}/profile`).once('value');
      const existingProfile = snap.val() || {};
      updates['profile'] = { ...existingProfile, ...profile };
    }

    // Onboarding settings
    if (mode !== undefined) updates['mode'] = mode;
    if (welcomeMessage !== undefined) updates['welcomeMessage'] = welcomeMessage;
    if (onboardingComplete !== undefined) updates['onboardingComplete'] = onboardingComplete;
    if (botConfig !== undefined) updates['botConfig'] = botConfig || null;
    if (workingHours !== undefined) updates['workingHours'] = workingHours || null;
    if (leadFields !== undefined) updates['leadFields'] = leadFields || null;

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