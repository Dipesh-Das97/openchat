const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../firebase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load knowledge base for this installId
const getKnowledgeBase = async (installId) => {
    const snap = await db.ref(`knowledgeBase/${installId}`).once('value');
    if (!snap.exists()) return [];
    return Object.values(snap.val());
};

// Load agent settings
const getAgentSettings = async (installId) => {
    const snap = await db.ref(`users/${installId}`).once('value');
    return snap.val();
};

// Load recent messages for context
const getRecentMessages = async (conversationId, limit = 10) => {
    const snap = await db.ref(`messages/${conversationId}`)
        .orderByChild('timestamp')
        .limitToLast(limit)
        .once('value');
    if (!snap.exists()) return [];
    return Object.values(snap.val()).sort((a, b) => a.timestamp - b.timestamp);
};

const generateReply = async (conversationId, installId, visitorMessage) => {
    try {
        const [settings, knowledgeBase] = await Promise.all([
            getAgentSettings(installId),
            getKnowledgeBase(installId),
        ]);

        const botName = settings?.botConfig?.botName || 'Assistant';
        const fallbackMessage = settings?.botConfig?.fallbackMessage || 'Our team will get back to you shortly.';

        // Check if any KB entry matches the question
        // Check if any KB entry matches the question
        const lowerMsg = visitorMessage.toLowerCase();
        const match = knowledgeBase.find((k) => {
            const lowerQ = k.question.toLowerCase();
            // Split question into keywords and check if any match
            const keywords = lowerQ.split(' ').filter((w) => w.length > 3);
            return keywords.some((kw) => lowerMsg.includes(kw)) ||
                lowerMsg.includes(lowerQ);
        });

        if (match) return match.answer;
        return fallbackMessage;

    } catch (err) {
        console.error('AI service error:', err);
        return 'Our team will get back to you shortly.';
    }
};
/*
const generateReply = async (conversationId, installId, visitorMessage) => {
    try {
        const [settings, knowledgeBase, recentMessages] = await Promise.all([
            getAgentSettings(installId),
            getKnowledgeBase(installId),
            getRecentMessages(conversationId),
        ]);

        const botName = settings?.botConfig?.botName || 'Assistant';
        const companyName = settings?.profile?.company || 'our company';
        const fallbackMessage = settings?.botConfig?.fallbackMessage || 'Our team will get back to you shortly.';

        // Build FAQ context
        const faqContext = knowledgeBase.length > 0
            ? `\n\nKnowledge Base / FAQ:\n${knowledgeBase.map((k) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n')}`
            : '';

        // Build system prompt
        const systemPrompt = `You are ${botName}, a helpful customer support assistant for ${companyName}.
Your job is to help visitors with their questions in a friendly, concise, and professional manner.
Always stay on topic and relevant to ${companyName}.
If you don't know the answer, say: "${fallbackMessage}"
Keep responses short — 1-3 sentences max unless detail is truly needed.
Never make up information.${faqContext}`;

        // Build conversation history
        const history = recentMessages
            .filter((msg) => msg.sender === 'visitor' || msg.sender === 'ai')
            .map((msg) => ({
                role: msg.sender === 'visitor' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

        // Remove last message if it matches current (avoid duplicate)
        if (history.length > 0 && history[history.length - 1].parts[0].text === visitorMessage) {
            history.pop();
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemPrompt,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(visitorMessage);
        return result.response.text();

    } catch (err) {
        console.error('AI service error:', err);
        const settings = await getAgentSettings(installId);
        return settings?.botConfig?.fallbackMessage || 'Our team will get back to you shortly.';
    }
};*/

module.exports = { generateReply };
