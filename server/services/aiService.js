const { db } = require('../firebase');
const nodemailer = require('nodemailer');

// ── Load knowledge base ────────────────────────────────────
const getKnowledgeBase = async (installId) => {
    const snap = await db.ref(`knowledgeBase/${installId}`).once('value');
    if (!snap.exists()) return [];
    return Object.values(snap.val());
};

// ── Load agent settings ────────────────────────────────────
const getAgentSettings = async (installId) => {
    const snap = await db.ref(`users/${installId}`).once('value');
    return snap.val();
};

// ── Greeting detection ─────────────────────────────────────
const GREETINGS = ['hi', 'hello', 'hey', 'hiya', 'howdy', 'sup', 'good morning', 'good afternoon', 'good evening'];

const isGreeting = (message) => {
    const clean = message.toLowerCase().trim();
    return GREETINGS.some((g) => clean === g || clean.startsWith(g + ' ') || clean.startsWith(g + '!') || clean.startsWith(g + ','));
};

// ── Short/vague message detection ─────────────────────────
const isTooVague = (message) => {
    return message.trim().split(' ').length <= 2 && !isGreeting(message);
};

// ── Email agent notification ───────────────────────────────
const notifyAgent = async (installId, conversationId, visitorMessage) => {
    try {
        const settings = await getAgentSettings(installId);
        const agentEmail = settings?.profile?.email;
        if (!agentEmail) return;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: agentEmail,
            subject: `[OpenChat] Visitor needs help — AI couldn't answer`,
            html: `
                <h3>A visitor asked something your AI couldn't answer.</h3>
                <p><strong>Visitor message:</strong> "${visitorMessage}"</p>
                <p><strong>Conversation ID:</strong> ${conversationId}</p>
                <p>The lead form has been sent to the visitor to collect their details.</p>
                <p>Log in to your dashboard to follow up.</p>
            `,
        });

        console.log(`📧 Agent notified at ${agentEmail}`);
    } catch (err) {
        console.error('Failed to notify agent:', err);
    }
};

// ── Main reply generator ───────────────────────────────────
const generateReply = async (conversationId, installId, visitorMessage) => {
    try {
        const [settings, knowledgeBase] = await Promise.all([
            getAgentSettings(installId),
            getKnowledgeBase(installId),
        ]);

        const companyName = settings?.appearance?.companyName || settings?.profile?.company || 'us';
        const fallbackMessage = settings?.aiConfig?.fallbackMessage ||
            "I don't have information on that. Our team will get back to you shortly.";

        // ── Step 1: Greeting → respond warmly, ask what they need ──
        if (isGreeting(visitorMessage)) {
            return {
                reply: `Hey there! 👋 No agents are available right now, but I'm here to help. What can I assist you with today?`,
                understood: true,
                isGreeting: true,
            };
        }

        // ── Step 2: Vague message → ask for more context ───────────
        if (isTooVague(visitorMessage)) {
            return {
                reply: `Could you tell me a bit more about what you need help with? I'll do my best to assist! 😊`,
                understood: true,
                isGreeting: true, // treat same as greeting — don't trigger form yet
            };
        }

        // ── Step 3: Check KB for a match ───────────────────────────
        const lowerMsg = visitorMessage.toLowerCase();
        const match = knowledgeBase.find((k) => {
            const lowerQ = k.question.toLowerCase();

            // Full question contained in message
            if (lowerMsg.includes(lowerQ)) return true;

            // Keyword match — only use words 5+ chars to avoid noise words
            // like "for", "what", "about", "with", etc.
            // Also require ALL meaningful keywords to match (not just some)
            const keywords = lowerQ.split(' ').filter((w) => w.length >= 5);
            if (keywords.length === 0) return false;

            // Every meaningful keyword must appear in the message
            return keywords.every((kw) => lowerMsg.includes(kw));
        });

        if (match) {
            // KB match found — answer and keep conversation going
            return { reply: match.answer, understood: true };
        }

        // ── Step 4: No KB match → warm handoff message + trigger form ──
        console.log(`🤖 AI couldn't answer for ${installId}, triggering form...`);

        // System message for agent's view
        await db.ref(`messages/${conversationId}`).push({
            sender: 'system',
            text: `🤖 AI couldn't answer: "${visitorMessage}" — lead form sent to visitor.`,
            timestamp: Date.now(),
        });

        // Notify agent by email
        await notifyAgent(installId, conversationId, visitorMessage);

        // Return triggerForm flag — caller (botwatcher/timerService) will set
        // formRequested AFTER pushing the reply message so form appears after message
        return {
            reply: `I don't have a great answer for that right now. 😔 Let me get one of our team members to follow up with you — could you leave your details below and we'll get back to you shortly!`,
            understood: false,
            triggerForm: true,
        };

    } catch (err) {
        console.error('AI service error:', err);
        return {
            reply: 'Our team will get back to you shortly.',
            understood: false,
        };
    }
};

module.exports = { generateReply };