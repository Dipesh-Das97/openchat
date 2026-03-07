require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const agentRoutes = require('./routes/agent');
const leadRoutes = require('./routes/leads');

const app = express();

// ─── Middleware ───────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/leads', leadRoutes);

// ─── Health Check ────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'OpenChat server is running' });
});

// ─── Agent Setup  ────────────────────────────

app.use('/api/agent', agentRoutes);

// ─── Start ───────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ OpenChat server running on port ${PORT}`);
});