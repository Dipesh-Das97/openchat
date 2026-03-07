import { create } from 'zustand';

const useAgentStore = create((set) => ({
  agent: null,
  token: localStorage.getItem('token') || null,
  installId: localStorage.getItem('installId') || null,

  setAgent: (agent) => set({ agent }),

  setAuth: (token, installId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('installId', installId);
    set({ token, installId });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('installId');
    set({ agent: null, token: null, installId: null });
  },
}));

export default useAgentStore;