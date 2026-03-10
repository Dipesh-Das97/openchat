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
      bottom: 20px;
      right: 20px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background-color: var(--oc-primary);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.22);
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #openchat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.28); }

    /* Icon states inside bubble */
    .oc-bubble-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: transform 0.2s;
    }
    .oc-bubble-close {
      font-size: 18px;
      font-weight: 700;
    }

    /* Badge */
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

    /* ── Chat window (desktop) ── */
    #openchat-window {
      position: fixed;
      bottom: 82px;
      right: 20px;
      width: 320px;
      height: 460px;
      background: var(--oc-chat-bg);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.16);
      display: flex;
      flex-direction: column;
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      overflow: hidden;
      transform-origin: bottom right;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    #openchat-window.oc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.92) translateY(12px);
    }

    /* ── Header ── */
    .oc-header {
      background: var(--oc-primary);
      color: white;
      padding: 12px 14px;
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
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .oc-header-name {
      font-size: 13px;
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
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ADE80;
    }
    .oc-status-dot.offline { background: rgba(255,255,255,0.4); }
    .oc-close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
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
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--oc-chat-bg);
      /* Smooth scroll on iOS */
      -webkit-overflow-scrolling: touch;
    }

    /* ── Message bubbles ── */
    .oc-message {
      max-width: 80%;
      padding: 9px 12px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.45;
      word-break: break-word;
    }
    .oc-message.visitor {
      background: var(--oc-visitor-bubble);
      color: var(--oc-visitor-text);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .oc-message.agent {
      background: var(--oc-agent-bubble);
      color: var(--oc-agent-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid var(--oc-input-border);
    }
    .oc-message.ai {
      background: #F3F4F6;
      color: #374151;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid #E5E7EB;
    }
    .oc-message-time {
      font-size: 10px;
      opacity: 0.5;
      margin-top: 3px;
      text-align: right;
    }

    /* ── Typing indicator ── */
    .oc-typing {
      display: flex;
      gap: 4px;
      padding: 9px 12px;
      background: var(--oc-agent-bubble);
      border: 1px solid var(--oc-input-border);
      border-radius: 14px 14px 4px 14px;
      align-self: flex-start;
      width: fit-content;
    }
    .oc-typing span {
      width: 6px;
      height: 6px;
      background: #9CA3AF;
      border-radius: 50%;
      animation: ocBounce 1.2s infinite;
    }
    .oc-typing span:nth-child(2) { animation-delay: 0.2s; }
    .oc-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ocBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%            { transform: translateY(-5px); }
    }

    /* ── Input area ── */
    .oc-input-area {
      padding: 8px 10px;
      border-top: 1px solid var(--oc-input-border);
      display: flex;
      gap: 7px;
      align-items: center;
      background: var(--oc-input-bg);
      flex-shrink: 0;
    }
    .oc-input {
      flex: 1;
      padding: 9px 13px;
      border-radius: 24px;
      border: 1px solid var(--oc-input-border);
      background: var(--oc-input-bg);
      font-size: 13px;
      outline: none;
      font-family: inherit;
      color: #111827;
      transition: border-color 0.2s;
      /* Prevent iOS zoom on focus (font-size must be >= 16px OR use this) */
      font-size: max(13px, 16px);
    }
    .oc-input:focus { border-color: var(--oc-primary); }
    .oc-input:disabled {
      background: #F3F4F6;
      color: #9CA3AF;
      cursor: not-allowed;
    }
    .oc-send-btn {
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 50%;
      background: var(--oc-primary);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 13px;
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
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-self: stretch;
    }
    .oc-collect-input {
      width: 100%;
      padding: 9px 11px;
      border-radius: 8px;
      border: 1px solid var(--oc-input-border);
      background: var(--oc-input-bg);
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      color: #111827;
      transition: border-color 0.2s;
    }
    .oc-collect-input:focus { border-color: var(--oc-primary); }
    .oc-collect-btn {
      width: 100%;
      padding: 10px;
      background: var(--oc-primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 13px;
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
      padding: 5px 0 7px;
      background: var(--oc-input-bg);
      flex-shrink: 0;
    }
    .oc-powered a { color: var(--oc-primary); text-decoration: none; font-weight: 600; }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      /* Bubble: normal position when chat is closed */
      #openchat-bubble {
        bottom: 16px;
        right: 16px;
        width: 52px;
        height: 52px;
        font-size: 22px;
      }

      /*
       * When chat is open on mobile, hide the bubble completely.
       * The header close button (✕) handles closing.
       * Add class "oc-chat-open" to <body> via index.js when opening.
       */
      body.oc-chat-open #openchat-bubble {
        display: none !important;
      }

      /*
       * Mobile chat window: true full-screen using dvh (dynamic viewport height).
       * dvh = actual visible viewport AFTER browser chrome (address bar) is accounted for.
       * Falls back to 100vh for older browsers.
       * This ensures the header is ALWAYS visible at the top.
       */
      #openchat-window {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100vh;       /* fallback */
        height: 100dvh;      /* real mobile viewport — excludes browser chrome */
        border-radius: 0;
        transform-origin: bottom center;
      }
      #openchat-window.oc-hidden {
        opacity: 0;
        pointer-events: none;
        transform: translateY(30px);
      }

      /* Larger tap targets */
      .oc-send-btn {
        width: 42px;
        height: 42px;
        min-width: 42px;
      }

      /* Prevent iOS auto-zoom on input focus */
      .oc-input,
      .oc-collect-input {
        font-size: 16px;
      }

      /* Safe area padding for iPhone home indicator */
      .oc-input-area {
        padding-bottom: max(10px, env(safe-area-inset-bottom));
      }
      .oc-powered {
        padding-bottom: max(8px, env(safe-area-inset-bottom));
      }
    }
  `;
  document.head.appendChild(style);
};