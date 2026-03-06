# 💬 OpenChat

An open source embeddable chat widget for any website — Wix, WordPress, Shopify, or plain HTML. Built with React, Firebase, and Node.js.

> Supports 3 modes: **Live Chat**, **AI Chatbot**, and **Lead Generation**

---

## ✨ Features

- 🔌 One script tag embed — works on any website
- 💬 Real-time messaging powered by Firebase
- 🤖 AI fallback via Claude or OpenAI when agents are offline
- 📋 Lead capture (name, email, phone)
- 🔒 End-to-end encryption for Chat App mode
- ⏱️ 20-minute escalation timer — AI steps in if agent doesn't reply
- 🕐 Work hours aware — different behaviour inside/outside business hours
- 🧩 3 modes: Live Chat · AI Chatbot · Lead Gen

---

## 🗂️ Project Structure

```
openchat/
├── server/          # Node + Express backend
├── dashboard/       # React agent dashboard
└── widget/          # Embeddable vanilla JS bundle
```

---

## ⚙️ Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Yarn | 4+ | `npm install -g yarn` |
| Firebase CLI | latest | `npm install -g firebase-tools` |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## 🚀 Setup — Step by Step

### 1. Clone the Repository

```bash
git clone https://YOUR_PAT@github.com/Dipesh-Das97/openchat.git
cd openchat
```

> Replace `YOUR_PAT` with your GitHub Personal Access Token.
> Generate one at: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
> Required scope: `repo`

---

### 2. Verify You're in the Right Place

```bash
pwd
# Should output: .../openchat

ls
# Should show: README.md  dashboard  package.json  server  widget
```

---

### 3. Check Yarn Version

```bash
yarn --version
# Example: 4.5.3
```

Update `package.json` at the root with your exact version:

```json
"packageManager": "yarn@4.5.3"
```

---

### 4. Initialize Yarn Workspaces

The root `package.json` is already configured with workspaces. Just run:

```bash
yarn install
```

Verify all three workspaces are recognized:

```bash
yarn workspaces list
# Should show:
# ➤ YN0000: .
# ➤ YN0000: server
# ➤ YN0000: dashboard
# ➤ YN0000: widget
```

---

### 5. Install Server Dependencies

```bash
yarn workspace server add express firebase-admin jsonwebtoken cors dotenv date-fns-tz
yarn workspace server add -D nodemon eslint
```

| Package | Purpose |
|---------|---------|
| `express` | HTTP server + routing |
| `firebase-admin` | Firebase Admin SDK (server-side) |
| `jsonwebtoken` | Agent authentication (JWT) |
| `cors` | Allow widget to call the API from any domain |
| `dotenv` | Load environment variables from `.env` |
| `date-fns-tz` | Timezone-aware work hours checking |
| `nodemon` | Auto-restart server on file changes (dev) |
| `eslint` | Code linting (dev) |

---

### 6. Install Dashboard Dependencies

```bash
yarn workspace dashboard add firebase zustand react-router-dom date-fns
```

| Package | Purpose |
|---------|---------|
| `firebase` | Firebase client SDK (real-time listeners) |
| `zustand` | Lightweight global state management |
| `react-router-dom` | Page routing (login, setup, dashboard) |
| `date-fns` | Date formatting in the UI |

---

### 7. Install Widget Build Tools

```bash
yarn workspace widget add -D rollup @rollup/plugin-node-resolve @rollup/plugin-terser
```

| Package | Purpose |
|---------|---------|
| `rollup` | Bundles widget source into single `widget.js` file |
| `@rollup/plugin-node-resolve` | Resolves node_modules imports in the bundle |
| `@rollup/plugin-terser` | Minifies the final bundle for production |

> **Note:** These are dev dependencies — they run on your machine only.
> End users never install anything. They just paste a `<script>` tag.

---

### 8. Set Up Environment Variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your values:

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Auth
JWT_SECRET=your-super-secret-jwt-key

# AI Providers (add whichever you use)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=5000
```

> ⚠️ Never commit `.env` to GitHub. It is already listed in `.gitignore`.

---

### 9. Firebase Project Setup

1. Go to [firebase.google.com](https://firebase.google.com) → Create project → name it `openchat`
2. Enable **Realtime Database** → Start in test mode
3. Enable **Authentication** → Sign-in method → Email/Password
4. Enable **Hosting**
5. Go to **Project Settings → Service Accounts → Generate new private key**
6. Save the downloaded JSON — copy the values into your `.env` file

```bash
# Login to Firebase CLI
firebase login

# Initialize Firebase in the project
firebase init
```

---

## 🔑 GitHub Authentication (PAT)

To push code from your local terminal:

```bash
# Set your remote URL with PAT embedded
git remote set-url origin https://YOUR_PAT@github.com/Dipesh-Das97/openchat.git
```

> ⚠️ Never share your PAT publicly. If exposed, revoke it immediately at:
> GitHub → Settings → Developer Settings → Personal Access Tokens

---

## 📦 Daily Workflow

```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "feat: description of what you built"

# Push to GitHub
git push
```

### Commit Message Convention

```
feat:     new feature
fix:      bug fix
chore:    config, dependencies, tooling
docs:     documentation only
refactor: code restructure, no feature change
```

---

## 🌐 Embedding the Widget

Once built, anyone can add the chat widget to their site with two lines:

```html
<script>
  window.OpenChatConfig = {
    installId: "YOUR_UNIQUE_INSTALL_ID",
    primaryColor: "#4F46E5",        // optional
    position: "bottom-right",       // optional
    welcomeMessage: "Hi there! 👋", // optional
    companyName: "Your Company"     // optional
  }
</script>
<script src="https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.0/widget/dist/widget.js"></script>
```

### Platform-specific Instructions

**Wix:** Dashboard → Settings → Custom Code → paste before `</body>`

**WordPress:** Plugins → Insert Headers and Footers → Footer section → paste

**Shopify:** Online Store → Themes → Edit Code → `theme.liquid` → paste before `</body>`

**Plain HTML:** Paste directly before `</body>` in your HTML file

---

## 🛠️ Running Locally

```bash
# Run the server (from root)
yarn server

# Run the dashboard (from root)
yarn dashboard

# Build the widget (from root)
yarn widget
```

---

## 🛠️ Running Locally

### Start the Server
```bash
# From root
yarn server
```
Server runs on http://localhost:5000

### Test the Server
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"OpenChat server is running"}
```

### Start the Dashboard
```bash
# From root
yarn dashboard
```

### Build the Widget
```bash
# From root
yarn widget
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new agent | No |
| POST | `/api/auth/login` | Login agent | No |
| GET | `/api/auth/me` | Get current agent | Yes |

### Conversations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/conversations` | Get all conversations | Yes |
| PUT | `/api/conversations/:id/status` | Update conversation status | Yes |

### Health
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Server health check | No |

---

## 🗺️ Roadmap

- [x] Phase 0 — Project setup + monorepo
- [x] Phase 1 — Firebase + Auth + Data Model
- [ ] Phase 2 — Onboarding Wizard
- [ ] Phase 3 — Embeddable Widget
- [ ] Phase 4 — Agent Dashboard
- [ ] Phase 5 — AI Fallback & Smart Timers
- [ ] Phase 6 — E2E Encryption
- [ ] Phase 7 — Polish & GitHub Release


## 🗺️ Roadmap

- [x] Phase 0 — Project setup + monorepo
- [ ] Phase 1 — Firebase + Auth + Data Model
- [ ] Phase 2 — Onboarding Wizard
- [ ] Phase 3 — Embeddable Widget
- [ ] Phase 4 — Agent Dashboard
- [ ] Phase 5 — AI Fallback & Smart Timers
- [ ] Phase 6 — E2E Encryption
- [ ] Phase 7 — Polish & GitHub Release

---

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` before submitting a PR.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Dipesh-Das97">Dipesh Das</a></p>
