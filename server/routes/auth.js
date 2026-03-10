const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { admin, db } = require('../firebase');
const verifyAgent = require('../middleware/verifyAgent');
const { sendVerificationEmail } = require('../services/emailService');

// ─── Register ─────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, company, website, type } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    const installId = userRecord.uid;

    // Generate verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Actually send the email
    await sendVerificationEmail(email, verificationLink, name);

    await db.ref(`users/${installId}`).set({
      profile: { name, email, company, website, type },
      mode: null,
      onboardingComplete: false,
      emailVerified: false,
      createdAt: Date.now(),
    });

    const token = jwt.sign(
      { installId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      installId,
      message: 'Registration successful. Please check your email to verify your account.'
      // verificationLink removed from response now
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
});
// ─── Login ────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
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

    // Check if email is verified
    const userRecord = await admin.auth().getUser(data.localId);
    if (!userRecord.emailVerified) {
      return res.status(403).json({
        error: 'Email not verified. Please check your inbox and verify your email first.'
      });
    }

    const installId = data.localId;
    const token = jwt.sign(
      { installId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const firebaseToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      token,        // your JWT
      firebaseToken, // Firebase custom token
      installId,
      name: userRecord.displayName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ─── Get Verification resend ────────────────────────
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // In production you'd send this via SendGrid/Nodemailer
    // For now we return it for testing
    res.json({
      message: 'Verification email sent.',
      verificationLink // remove in production
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/firebase-token
router.get('/firebase-token', verifyAgent, async (req, res) => {
  try {
    const firebaseToken = await admin.auth().createCustomToken(req.agent.installId);
    res.json({ firebaseToken });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Firebase token' });
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

// ─── Social Login ─────────────────────────────────────────
// Called after Firebase social auth on frontend
// Frontend sends the Firebase ID token, we verify it and return a JWT
router.post('/social', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'ID token required' });
  try {
    // Verify the Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    const installId = uid;
    // Check if user already exists in DB
    const snap = await db.ref(`users/${installId}`).once('value');
    const isNewUser = !snap.exists();
    if (isNewUser) {
      // Create a minimal user record — Setup wizard will fill the rest
      await db.ref(`users/${installId}`).set({
        profile: {
          name: name || '',
          email: email || '',
          company: '',
          website: '',
          type: 'personal',
          avatar: picture || '',
        },
        mode: null,
        onboardingComplete: false,
        emailVerified: true, // social login = already verified
        createdAt: Date.now(),
      });
    }
    // Issue JWT
    const token = jwt.sign(
      { installId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Issue Firebase custom token for Realtime DB access
    const firebaseToken = await admin.auth().createCustomToken(installId);
    res.json({
      token,
      firebaseToken,
      installId,
      isNewUser, // frontend uses this to decide: Setup wizard vs Dashboard
    });
  } catch (err) {
    console.error('Social auth error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ─── Forgot Password ──────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    // Check user exists first to avoid leaking user enumeration
    // We still return success either way for security
    await admin.auth().getUserByEmail(email).catch(() => null);
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    // Send via your existing email service
    const { sendPasswordResetEmail } = require('../services/emailService');
    await sendPasswordResetEmail(email, resetLink);
    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    // Always return success to prevent email enumeration
    res.json({ message: 'Password reset email sent.' });
  }
});

module.exports = router;