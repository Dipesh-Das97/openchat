export const injectStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    #openchat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--oc-primary, #4F46E5);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(79,70,229,0.4);
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: transform 0.2s;
    }

    #openchat-bubble:hover {
      transform: scale(1.1);
    }

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

    #openchat-window {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 360px;
      height: 520px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 99998;
      font-family: Arial, sans-serif;
      overflow: hidden;
      transition: opacity 0.2s, transform 0.2s;
    }

    #openchat-window.oc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px);
    }

    .oc-header {
      background: var(--oc-primary, #4F46E5);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      font-size: 15px;
      font-weight: 700;
    }

    .oc-status {
      font-size: 12px;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .oc-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ADE80;
    }

    .oc-status-dot.offline {
      background: #9CA3AF;
    }

    .oc-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      opacity: 0.8;
    }

    .oc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #F9FAFB;
    }

    .oc-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-break: break-word;
    }

    .oc-message.agent {
      background: #fff;
      color: #111827;
      border: 1px solid #E5E7EB;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .oc-message.visitor {
      background: var(--oc-primary, #4F46E5);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .oc-message.ai {
      background: #F3F4F6;
      color: #374151;
      border: 1px solid #E5E7EB;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .oc-message-time {
      font-size: 10px;
      opacity: 0.6;
      margin-top: 4px;
      text-align: right;
    }

    .oc-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      align-self: flex-start;
      width: fit-content;
    }

    .oc-typing span {
      width: 7px;
      height: 7px;
      background: #9CA3AF;
      border-radius: 50%;
      animation: oc-bounce 1.2s infinite;
    }

    .oc-typing span:nth-child(2) { animation-delay: 0.2s; }
    .oc-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes oc-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    .oc-input-area {
      padding: 12px 16px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      gap: 8px;
      background: #fff;
    }

    .oc-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 24px;
      border: 1px solid #D1D5DB;
      font-size: 14px;
      outline: none;
      font-family: Arial, sans-serif;
    }

    .oc-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--oc-primary, #4F46E5);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .oc-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .oc-collect-form {
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .oc-collect-title {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .oc-collect-sub {
      font-size: 13px;
      color: #6B7280;
      margin: 0;
    }

    .oc-collect-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #D1D5DB;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    .oc-collect-btn {
      padding: 10px;
      background: var(--oc-primary, #4F46E5);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .oc-powered {
      text-align: center;
      font-size: 11px;
      color: #9CA3AF;
      padding: 8px;
      background: #fff;
    }

    .oc-powered a {
      color: #4F46E5;
      text-decoration: none;
      font-weight: 600;
    }

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