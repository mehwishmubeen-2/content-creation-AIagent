# ✦ Content Creation Agent

An AI-powered agent that researches topics on the live web and generates publication-ready content end-to-end — blog posts, social media posts, video scripts, and captions.

Built with **Groq (Llama 3.3)** + **Tavily Search** + **React**.

---

##  Features

-  **Blog Post** — SEO-friendly, 600–900 words with headings and CTA
-  **Social Media** — Platform-ready posts with hooks and hashtags
-  **Video Script** — Hook, timestamps, body, and CTA format
-  **Caption** — Short, punchy captions with emojis and hashtags
-  **Live Web Research** — Agent searches the web before writing (no hallucinations)
-  **Fast inference** — Powered by Groq's ultra-fast LLM API

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| LLM | Groq API (Llama 3.3 70B) |
| Web Search | Tavily Search API |
| Env Management | dotenv |

---

##  Project Structure

```
content-agent/
├
│   ├── src/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
└── backend/
    ├── server.js
    ├── .env          ← (not committed)
    ├── .gitignore
    └── package.json
```

---

##  Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/content-agent.git
cd content-agent
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
PORT=5000
```

Get your free API keys:
- Groq: https://console.groq.com
- Tavily: https://tavily.com

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

---

##  Running the Project

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# http://localhost:5173
```

Open your browser at `http://localhost:5173`

---

##  How It Works

```
User inputs topic + content type
          ↓
Backend receives request
          ↓
Tavily searches the web (5 results)
          ↓
Research passed to Groq (Llama 3.3)
          ↓
LLM writes polished, formatted content
          ↓
Result displayed in frontend
```

---

##  Deployment

| Part | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Connect GitHub repo, set root to `/frontend` |
| Backend | Render | Add env variables in dashboard |

After deploying backend, update the fetch URL in `App.jsx`:
```js
const response = await fetch("https://your-backend.onrender.com/generate", {
```

---

##  Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | From console.groq.com |
| `TAVILY_API_KEY` | From tavily.com |
| `PORT` | Backend port (default: 5000) |

---

##  License

MIT License — free to use and modify.
