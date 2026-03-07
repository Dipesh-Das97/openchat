export const buildBubble = (config) => {
  const bubble = document.createElement('button');
  bubble.id = 'openchat-bubble';
  bubble.innerHTML = '💬';

  // Apply custom position
  if (config.position === 'bottom-left') {
    bubble.style.right = 'auto';
    bubble.style.left = '24px';
  }

  document.body.appendChild(bubble);
  return bubble;
};

export const buildChatWindow = (config, isOnline) => {
  const win = document.createElement('div');
  win.id = 'openchat-window';
  win.classList.add('oc-hidden');

  if (config.position === 'bottom-left') {
    win.style.right = 'auto';
    win.style.left = '24px';
  }

  win.innerHTML = `
    <div class="oc-header">
      <div class="oc-header-info">
        <div class="oc-avatar">💬</div>
        <div>
          <div class="oc-header-name">${config.companyName || 'Support'}</div>
          <div class="oc-status">
            <div class="oc-status-dot ${isOnline ? '' : 'offline'}"></div>
            ${isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
      <button class="oc-close-btn" id="oc-close">✕</button>
    </div>
    <div class="oc-messages" id="oc-messages"></div>
    <div class="oc-input-area">
      <input
        class="oc-input"
        id="oc-input"
        type="text"
        placeholder="Type a message..."
        autocomplete="off"
      />
      <button class="oc-send-btn" id="oc-send">➤</button>
    </div>
    <div class="oc-powered">
      Powered by <a href="https://github.com/Dipesh-Das97/openchat" target="_blank">OpenChat</a>
    </div>
  `;

  document.body.appendChild(win);
  return win;
};

export const addMessage = (text, sender, timestamp) => {
  const messages = document.getElementById('oc-messages');
  if (!messages) return;

  const msg = document.createElement('div');
  msg.classList.add('oc-message', sender);

  const time = new Date(timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  msg.innerHTML = `
    ${text}
    <div class="oc-message-time">${time}</div>
  `;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
};

export const showTyping = () => {
  const messages = document.getElementById('oc-messages');
  if (!messages) return;
  const typing = document.createElement('div');
  typing.classList.add('oc-typing');
  typing.id = 'oc-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
};

export const hideTyping = () => {
  const typing = document.getElementById('oc-typing');
  if (typing) typing.remove();
};

export const updateStatus = (isOnline) => {
  const dot = document.querySelector('.oc-status-dot');
  const text = document.querySelector('.oc-status');
  if (!dot || !text) return;
  dot.className = `oc-status-dot ${isOnline ? '' : 'offline'}`;
  text.innerHTML = `
    <div class="oc-status-dot ${isOnline ? '' : 'offline'}"></div>
    ${isOnline ? 'Online' : 'Offline'}
  `;
};