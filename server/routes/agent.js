const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Save Settings ────────────────────────────
router.put('/settings', verifyAgent, async (req, res) => {
  const { mode, botConfig, workingHours, leadFields, welcomeMessage, onboardingComplete } = req.body;

  try {
    await db.ref(`users/${req.agent.installId}`).update({
      mode,
      botConfig: botConfig || null,
      workingHours: workingHours || null,
      leadFields: leadFields || null,
      welcomeMessage,
      onboardingComplete,
    });

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