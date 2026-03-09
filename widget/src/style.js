export const injectStyles = () => {
  if (document.getElementById('oc-styles')) return;
  const style = document.createElement('style');
  style.id = 'oc-styles';
  style.innerHTML = `

    /*
     * ── OpenChat CSS Variables ──────────────────────────────
     * All set dynamically by index.js from Firebase appearance settings.
     * Defaults here are the fallback if nothing is saved yet.
     */
    :root {
      --oc-primary:        #4F46E5;
      --oc-chat-bg:        #F9FAFB;
      --oc-visitor-bubble: #4F46E5;
      --oc-visitor-text:   #ffffff;
      --oc-agent-bubble:   #ffffff;
      --oc-agent-text:     #111827;
      --oc-input-bg:       #ffffff;
      --oc-input-border:   #E5E7EB;
    }

    /* ── Launcher bubble ── */
    #openchat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--oc-primary);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: transform 0.2s;
    }
    #openchat-bubble:hover { transform: scale(1.1); }

    #openchat-bubble .oc-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #EF4444;
      color: white;
      font-size: 10px;
      font-weight: bold;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Chat window ── */
    #openchat-window {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 360px;
      height: 520px;
      background: var(--oc-chat-bg);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 99998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      overflow: hidden;
      transition: opacity 0.2s, transform 0.2s;
    }
    #openchat-window.oc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px);
    }

    /* ── Header ── */
    .oc-header {
      background: var(--oc-primary);
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .oc-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .oc-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .oc-header-name {
      font-size: 14px;
      font-weight: 700;
    }
    .oc-status {
      font-size: 11px;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    .oc-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ADE80;
    }
    .oc-status-dot.offline { background: rgba(255,255,255,0.4); }
    .oc-close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .oc-close-btn:hover { background: rgba(255,255,255,0.28); }

    /* ── Messages area ── */
    .oc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--oc-chat-bg);
    }

    /* ── Message bubbles ── */
    .oc-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      word-break: break-word;
    }

    /* Visitor = person chatting (sent messages, right side) */
    .oc-message.visitor {
      background: var(--oc-visitor-bubble);
      color: var(--oc-visitor-text);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    /* Agent = support team replies (left side) */
    .oc-message.agent {
      background: var(--oc-agent-bubble);
      color: var(--oc-agent-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid var(--oc-input-border);
    }

    /* AI bubble — always purple, not customisable */
    .oc-message.ai {
      background: #F3F4F6;
      color: #374151;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid #E5E7EB;
    }

    .oc-message-time {
      font-size: 10px;
      opacity: 0.55;
      margin-top: 4px;
      text-align: right;
    }

    /* ── Typing indicator ── */
    .oc-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: var(--oc-agent-bubble);
      border: 1px solid var(--oc-input-border);
      border-radius: 14px 14px 4px 14px;
      align-self: flex-start;
      width: fit-content;
    }
    .oc-typing span {
      width: 7px;
      height: 7px;
      background: #9CA3AF;
      border-radius: 50%;
      animation: ocBounce 1.2s infinite;
    }
    .oc-typing span:nth-child(2) { animation-delay: 0.2s; }
    .oc-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ocBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%           { transform: translateY(-6px); }
    }

    /* ── Input area ── */
    .oc-input-area {
      padding: 10px 12px;
      border-top: 1px solid var(--oc-input-border);
      display: flex;
      gap: 8px;
      align-items: center;
      background: var(--oc-input-bg);
      flex-shrink: 0;
    }
    .oc-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 24px;
      border: 1px solid var(--oc-input-border);
      background: var(--oc-input-bg);
      font-size: 14px;
      outline: none;
      font-family: inherit;
      color: #111827;
      transition: border-color 0.2s;
    }
    .oc-input:focus { border-color: var(--oc-primary); }
    .oc-input:disabled {
      background: #F3F4F6;
      color: #9CA3AF;
      cursor: not-allowed;
    }
    .oc-send-btn {
      width: 38px;
      height: 38px;
      min-width: 38px;
      border-radius: 50%;
      background: var(--oc-primary);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s, transform 0.15s;
    }
    .oc-send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.06); }
    .oc-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── Lead form ── */
    .oc-collect-form {
      background: var(--oc-chat-bg);
      border: 1px solid var(--oc-input-border);
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-self: stretch;
    }
    .oc-collect-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--oc-input-border);
      background: var(--oc-input-bg);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      color: #111827;
      transition: border-color 0.2s;
    }
    .oc-collect-input:focus { border-color: var(--oc-primary); }
    .oc-collect-btn {
      width: 100%;
      padding: 11px;
      background: var(--oc-primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
    }
    .oc-collect-btn:hover:not(:disabled) { opacity: 0.88; }
    .oc-collect-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* ── Powered by ── */
    .oc-powered {
      text-align: center;
      font-size: 10px;
      color: #9CA3AF;
      padding: 6px 0 8px;
      background: var(--oc-input-bg);
      flex-shrink: 0;
    }
    .oc-powered a { color: var(--oc-primary); text-decoration: none; font-weight: 600; }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #openchat-window {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
      #openchat-bubble {
        bottom: 16px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);
};