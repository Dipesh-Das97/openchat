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
  if (sender === 'system') return;
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

export const buildLeadForm = (config, leadFields, onSubmit) => {
    const messages = document.getElementById('oc-messages');
    const input = document.getElementById('oc-input');
    const sendBtn = document.getElementById('oc-send');
    if (!messages) return;

    // Disable input until form submitted
    if (input) {
        input.disabled = true;
        input.placeholder = 'Fill in the form above to start chatting...';
        input.style.backgroundColor = '#F3F4F6';
        input.style.color = '#9CA3AF';
        input.style.cursor = 'not-allowed';
    }
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.4';
    }

    // Welcome message
    const welcome = document.createElement('div');
    welcome.classList.add('oc-message', 'agent');
    welcome.innerHTML = `
        ${config.welcomeMessage || 'Hi there! 👋 Please fill in your details below.'}
        <div class="oc-message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    messages.appendChild(welcome);

    // Country codes
    const countryCodes = [
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
        { code: '+44', flag: '🇬🇧', name: 'UK' },
        { code: '+61', flag: '🇦🇺', name: 'Australia' },
        { code: '+971', flag: '🇦🇪', name: 'UAE' },
        { code: '+65', flag: '🇸🇬', name: 'Singapore' },
        { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
        { code: '+49', flag: '🇩🇪', name: 'Germany' },
        { code: '+33', flag: '🇫🇷', name: 'France' },
        { code: '+81', flag: '🇯🇵', name: 'Japan' },
        { code: '+86', flag: '🇨🇳', name: 'China' },
        { code: '+55', flag: '🇧🇷', name: 'Brazil' },
        { code: '+27', flag: '🇿🇦', name: 'South Africa' },
        { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
        { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
        { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    ];

    const countryOptions = countryCodes
        .map((c) => `<option value="${c.code}">${c.flag} ${c.code} ${c.name}</option>`)
        .join('');

    const needsContact = leadFields?.email || leadFields?.phone;
    const hasServices = leadFields?.services?.length > 0;

    let fieldsHTML = '';

    // Name field
    if (leadFields?.name !== false) {
        fieldsHTML += `
            <input
                class="oc-collect-input"
                type="text"
                id="oc-field-name"
                placeholder="Your full name *"
            />
        `;
    }

    // Contact error (shown if neither email nor phone filled)
    if (needsContact) {
        fieldsHTML += `
            <div id="oc-contact-error" style="
                display:none;
                color:#DC2626;
                font-size:12px;
                padding:6px 10px;
                background:#FEE2E2;
                border-radius:6px;
            ">
                Please provide at least your email or phone number.
            </div>
        `;
    }

    // Email field
    if (leadFields?.email) {
        fieldsHTML += `
            <input
                class="oc-collect-input"
                type="email"
                id="oc-field-email"
                placeholder="Email address"
            />
        `;
    }

    // Phone field with country code
    if (leadFields?.phone) {
        fieldsHTML += `
            <div style="display:flex;gap:6px;align-items:center;">
                <select
                    id="oc-field-country"
                    style="
                        padding:10px 6px;
                        border-radius:8px;
                        border:1px solid #D1D5DB;
                        font-size:13px;
                        outline:none;
                        background:#fff;
                        color:#111827;
                        cursor:pointer;
                        flex-shrink:0;
                        max-width:110px;
                    "
                >
                    ${countryOptions}
                </select>
                <input
                    class="oc-collect-input"
                    type="tel"
                    id="oc-field-phone"
                    placeholder="Phone number"
                    style="flex:1;margin:0;"
                />
            </div>
        `;
    }

    // Company field
    if (leadFields?.company) {
        fieldsHTML += `
            <input
                class="oc-collect-input"
                type="text"
                id="oc-field-company"
                placeholder="Company name"
            />
        `;
    }

    // Custom question — only show as input if NO services list
    if (leadFields?.customEnabled && leadFields?.customQuestion && !hasServices) {
        fieldsHTML += `
            <input
                class="oc-collect-input"
                type="text"
                id="oc-field-custom"
                placeholder="${leadFields.customQuestion}"
            />
        `;
    }

    // Services — checklist or dropdown
    if (hasServices) {
        // Use custom question as title if available, else default
        const sectionLabel = leadFields?.customEnabled && leadFields?.customQuestion
            ? leadFields.customQuestion
            : 'Interested in:';

        const label = `
            <p style="font-size:13px;font-weight:600;color:#374151;margin:4px 0 8px 0;">
                ${sectionLabel}
            </p>
        `;

        if (leadFields.serviceSelectionType === 'dropdown') {
            const options = leadFields.services
                .map((s) => `<option value="${s}">${s}</option>`)
                .join('');
            fieldsHTML += `
                ${label}
                <select
                    id="oc-field-services"
                    class="oc-collect-input"
                    style="cursor:pointer;"
                >
                    <option value="">Select a service...</option>
                    ${options}
                </select>
            `;
        } else {
            // Checklist
            const checkboxes = leadFields.services.map((s, i) => `
                <label style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    font-size:13px;
                    color:#374151;
                    cursor:pointer;
                    padding:4px 0;
                ">
                    <input
                        type="checkbox"
                        id="oc-service-${i}"
                        value="${s}"
                        style="
                            width:16px;
                            height:16px;
                            accent-color:#4F46E5;
                            cursor:pointer;
                            flex-shrink:0;
                        "
                    />
                    ${s}
                </label>
            `).join('');

            fieldsHTML += `
                ${label}
                <div style="
                    background:#F9FAFB;
                    border:1px solid #E5E7EB;
                    border-radius:8px;
                    padding:10px 14px;
                    display:flex;
                    flex-direction:column;
                ">
                    ${checkboxes}
                </div>
            `;
        }
    }

    // Build form
    const form = document.createElement('div');
    form.classList.add('oc-collect-form');
    form.id = 'oc-lead-form';
    form.innerHTML = `
        ${fieldsHTML}
        <div id="oc-lead-error" style="
            display:none;
            color:#DC2626;
            font-size:12px;
            padding:6px 10px;
            background:#FEE2E2;
            border-radius:6px;
        ">
            Please fill in your name to continue.
        </div>
        <button class="oc-collect-btn" id="oc-lead-submit">
            Submit & Start Chat →
        </button>
    `;

    messages.appendChild(form);
    messages.scrollTop = messages.scrollHeight;

    // Handle submit
    document.getElementById('oc-lead-submit').addEventListener('click', () => {
        const name = document.getElementById('oc-field-name')?.value?.trim();
        const email = document.getElementById('oc-field-email')?.value?.trim();
        const countryCode = document.getElementById('oc-field-country')?.value || '';
        const phoneRaw = document.getElementById('oc-field-phone')?.value?.trim();
        const phone = phoneRaw ? `${countryCode} ${phoneRaw}` : '';
        const company = document.getElementById('oc-field-company')?.value?.trim();
        const custom = document.getElementById('oc-field-custom')?.value?.trim();

        // Collect services
        let services;
        if (hasServices) {
            if (leadFields.serviceSelectionType === 'dropdown') {
                services = document.getElementById('oc-field-services')?.value || '';
            } else {
                const selected = leadFields.services
                    .filter((_, i) => document.getElementById(`oc-service-${i}`)?.checked);
                services = selected.length > 0 ? selected.join(', ') : '';
            }
        }

        // Validate name
        if (leadFields?.name !== false && !name) {
            document.getElementById('oc-lead-error').style.display = 'block';
            return;
        }

        // Validate at least email OR phone
        if (needsContact && !email && !phone) {
            document.getElementById('oc-contact-error').style.display = 'block';
            return;
        }

        onSubmit({ name, email, phone, company, custom, services });
    });
};


export const showLeadSuccess = (name) => {
  const messages = document.getElementById('oc-messages');
  if (!messages) return;

  // Remove form
  const form = document.getElementById('oc-lead-form');
  if (form) form.remove();

  // Show success message
  const success = document.createElement('div');
  success.classList.add('oc-message', 'agent');
  success.innerHTML = `
        🎉 Thanks ${name || 'there'}! We've got your details.
        Feel free to ask us anything!
        <div class="oc-message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
  messages.appendChild(success);
  messages.scrollTop = messages.scrollHeight;
};

export const unlockChat = () => {
  const input = document.getElementById('oc-input');
  const sendBtn = document.getElementById('oc-send');

  if (input) {
    input.disabled = false;
    input.placeholder = 'Type a message...';
    input.style.backgroundColor = '';
    input.style.color = '';
    input.style.cursor = '';
    input.focus();
  }
  if (sendBtn) {
    sendBtn.disabled = false;
    sendBtn.style.opacity = '1';
  }
};