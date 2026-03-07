import { getDb, ref, push, onChildAdded, get, set, onValue } from './firebase.js';

// Generate or retrieve visitor ID
export const getVisitorId = () => {
  let id = localStorage.getItem('oc_visitor_id');
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('oc_visitor_id', id);
  }
  return id;
};

// Get or create conversation
export const getOrCreateConversation = async (installId, visitorName, visitorEmail) => {
  const db = getDb();
  let conversationId = localStorage.getItem(`oc_conversation_${installId}`);

  if (conversationId) {
    // Verify it still exists
    const snap = await get(ref(db, `conversations/${installId}/${conversationId}`));
    if (snap.exists()) return conversationId;
  }

  // Create new conversation
  const newRef = await push(ref(db, `conversations/${installId}`), {
    visitorId: getVisitorId(),
    visitorName: visitorName || 'Visitor',
    visitorEmail: visitorEmail || null,
    status: 'open',
    createdAt: Date.now(),
    lastMessageAt: Date.now(),
    collectedEmail: !!visitorEmail,
  });

  conversationId = newRef.key;
  localStorage.setItem(`oc_conversation_${installId}`, conversationId);
  return conversationId;
};

// Send a message
export const sendMessage = async (conversationId, installId, text, sender = 'visitor') => {
  const db = getDb();
  await push(ref(db, `messages/${conversationId}`), {
    sender,
    text,
    timestamp: Date.now(),
    read: false,
  });

  // Update lastMessageAt
  await set(ref(db, `conversations/${installId}/${conversationId}/lastMessageAt`), Date.now());
};

// Listen to new messages
export const listenMessages = (conversationId, onMessage) => {
  const db = getDb();
  onChildAdded(ref(db, `messages/${conversationId}`), (snap) => {
    onMessage({ id: snap.key, ...snap.val() });
  });
};

// Check agent presence
export const getAgentPresence = (installId, onChange) => {
  const db = getDb();
  onValue(ref(db, `agentPresence/${installId}`), (snap) => {
    onChange(snap.val());
  });
};

// Get agent settings
export const getAgentSettings = async (installId) => {
  const db = getDb();
  const snap = await get(ref(db, `users/${installId}`));
  return snap.val();
};