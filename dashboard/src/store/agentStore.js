import { create } from 'zustand';
import { auth, signInWithCustomToken } from '../firebase';

const useAgentStore = create((set) => ({
  agent: null,
  token: localStorage.getItem('token') || null,
  installId: localStorage.getItem('installId') || null,

  setAgent: (agent) => set({ agent }),

  setAuth: async (token, installId, firebaseToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('installId', installId);
    set({ token, installId });

    // Sign in to Firebase client SDK
    if (firebaseToken) {
      await signInWithCustomToken(auth, firebaseToken);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('installId');
    auth.signOut();
    set({ agent: null, token: null, installId: null });
  },

  rehydrateFirebase: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch('http://localhost:5000/api/auth/firebase-token', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.firebaseToken) {
            await signInWithCustomToken(auth, data.firebaseToken);
        }
    } catch (err) {
        console.error('Firebase rehydration failed:', err);
    }
},
}));

export default useAgentStore;