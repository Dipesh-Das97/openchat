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

module.exports = router;