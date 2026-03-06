const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { admin, db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');

// ─── Register ─────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, company, website } = req.body;

  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({ email, password });
    const installId = userRecord.uid;

    // Save profile to Realtime DB
    await db.ref(`users/${installId}`).set({
      profile: { name, email, company, website },
      mode: null,
      onboardingComplete: false,
      createdAt: Date.now(),
    });

    // Generate JWT
    const token = jwt.sign(
      { installId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, installId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Login ────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify with Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const installId = data.localId;

    const token = jwt.sign(
      { installId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, installId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Current Agent ────────────────────────
router.get('/me', verifyAgent, async (req, res) => {
  try {
    const snap = await db.ref(`users/${req.agent.installId}`).once('value');
    res.json(snap.val());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;