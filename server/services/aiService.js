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

// ── Gemini API call ────────────────────────────────────────
const askGemini = async (systemPrompt, userMessage) => {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `${systemPrompt}\n\nVisitor message: "${userMessage}"` }],
                    },
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 300,
                },
            }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error: ${err}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
};

// ── Build system prompt from KB ────────────────────────────
const buildSystemPrompt = (companyName, knowledgeBase) => {
    const kbText = knowledgeBase.length > 0
        ? knowledgeBase.map((k, i) => `Q${i + 1}: ${k.question}\nA${i + 1}: ${k.answer}`).join('\n\n')
        : 'No knowledge base entries available.';

    return `You are a helpful, friendly live chat assistant for ${companyName}.

Your job is to answer visitor questions using ONLY the knowledge base below.
Be concise, warm, and conversational. Keep replies under 3 sentences.
Do not make up information that isn't in the knowledge base.

If the visitor's question cannot be answered from the knowledge base, reply with exactly this text and nothing else:
CANNOT_ANSWER

Knowledge Base:
${kbText}`;
};

// ── Main reply generator ───────────────────────────────────
const generateReply = async (conversationId, installId, visitorMessage) => {
    try {
        const [settings, knowledgeBase] = await Promise.all([
            getAgentSettings(installId),
            getKnowledgeBase(installId),
        ]);

        const companyName = settings?.appearance?.companyName || settings?.profile?.company || 'us';

        // ── Step 1: Greeting → respond warmly ─────────────────────
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
                isGreeting: true,
            };
        }

        // ── Step 3: Ask Gemini using KB as context ─────────────────
        const systemPrompt = buildSystemPrompt(companyName, knowledgeBase);
        const geminiReply = await askGemini(systemPrompt, visitorMessage);

        // Gemini answered from KB
        if (geminiReply && geminiReply !== 'CANNOT_ANSWER') {
            console.log(`🤖 Gemini answered for ${installId}`);
            return { reply: geminiReply, understood: true };
        }

        // ── Step 4: Gemini couldn't answer → warm handoff + form ───
        console.log(`🤖 Gemini couldn't answer for ${installId}, triggering form...`);

        // System message for agent view
        await db.ref(`messages/${conversationId}`).push({
            sender: 'system',
            text: `🤖 AI couldn't answer: "${visitorMessage}" — lead form sent to visitor.`,
            timestamp: Date.now(),
        });

        // Notify agent by email
        await notifyAgent(installId, conversationId, visitorMessage);

        return {
            reply: `I don't have a great answer for that right now. 😔 Let me get one of our team members to follow up — could you leave your details below and we'll get back to you shortly!`,
            understood: false,
            triggerForm: true,
        };

    } catch (err) {
        console.error('AI service error:', err);
        // Graceful fallback — don't crash the chat
        return {
            reply: `I'm having a little trouble right now. Our team will get back to you shortly! 🙏`,
            understood: false,
        };
    }
};

module.exports = { generateReply };