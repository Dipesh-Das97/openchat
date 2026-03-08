import { getDb, ref, push, onChildAdded, get, set, onValue, update } from './firebase.js';

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
    const snap = await get(ref(db, `conversations/${installId}/${conversationId}`));
    if (snap.exists()) return conversationId;
  }

  // New conversation — explicitly set formRequested: false so widget listener
  // never gets a stale true value from a previous conversation
  const newRef = await push(ref(db, `conversations/${installId}`), {
    visitorId: getVisitorId(),
    visitorName: visitorName || 'Visitor',
    visitorEmail: visitorEmail || null,
    status: 'open',
    createdAt: Date.now(),
    lastMessageAt: Date.now(),
    lastSenderWasVisitor: false,
    lastMessagePreview: '',
    collectedEmail: !!visitorEmail,
    formRequested: false, // ← always start clean
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

  const updates = {
    lastMessageAt: Date.now(),
    lastSenderWasVisitor: sender === 'visitor',
    lastMessagePreview: text.slice(0, 60),
  };

  if (sender === 'visitor') {
    updates.status = 'waiting';
    updates.lastVisitorMessageAt = Date.now();
  } else if (sender === 'agent') {
    updates.status = 'open';
  }

  await update(ref(db, `conversations/${installId}/${conversationId}`), updates);
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

export const saveLead = async (installId, leadData) => {
  const db = getDb();
  const conversationId = localStorage.getItem(`oc_conversation_${installId}`);

  const cleanData = Object.fromEntries(
    Object.entries(leadData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );

  await push(ref(db, `leads/${installId}`), {
    ...cleanData,
    timestamp: Date.now(),
    visitorId: getVisitorId(),
  });

  if (conversationId) {
    // System message — shows in agent chat so they know form was submitted
    await push(ref(db, `messages/${conversationId}`), {
      sender: 'system',
      text: `✅ Visitor submitted the lead form${cleanData.name ? ` (${cleanData.name})` : ''}.`,
      timestamp: Date.now(),
    });

    // Mark lead collected + trigger notification in dashboard
    await update(ref(db, `conversations/${installId}/${conversationId}`), {
      leadCollected: true,
      formRequested: false,
      formRequestedBy: null,
      lastVisitorMessageAt: Date.now(),
      lastMessagePreview: `📋 Lead form submitted${cleanData.name ? ` by ${cleanData.name}` : ''}`,
    });
  }
};