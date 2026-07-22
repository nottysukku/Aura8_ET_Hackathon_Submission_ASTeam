# AURA-8: Unified Asset & Operations Brain
> **ET AI Hackathon 2.0 (2026) Submission** | **Problem Statement 8: AI for Industrial Knowledge Intelligence**

AURA-8 is an AI-powered Industrial Knowledge Intelligence platform unifying P&ID engineering drawings, OEM manuals, maintenance logs, and statutory OISD/Factory Act regulations into a queryable visual Knowledge Graph and grounded Gemini RAG Copilot.

---

## 🌐 Deploy Live to Vercel in 1-Click

AURA-8 is natively optimized for **Vercel** with Next.js 15 App Router serverless functions (`/api/upload` PDF stream parser and `/api/query` Gemini RAG engine).

### Option A: Import via Vercel Dashboard (Recommended)
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Select repository: **`nottysukku/Aura8_ET_Hackathon_Submission_ASTeam`**.
3. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_gemini_api_key_here`
4. Click **Deploy**. Your live production app will be deployed to a public HTTPS URL.

### Option B: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy project
vercel

# 3. Add Environment Variable
vercel env add GEMINI_API_KEY

# 4. Deploy to Production
vercel --prod
```

---

## 🚀 How to Initialize the Project Locally

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.11+
- **Git**: Installed

### Step 1: Clone Repository
```bash
git clone https://github.com/nottysukku/Aura8_ET_Hackathon_Submission_ASTeam.git
cd Aura8_ET_Hackathon_Submission_ASTeam
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

### Step 3: Set Up Local Environment
Create `.env.local` in project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🌟 Key Application Features

- **Gateway Landing Page**: Choose between **"Start Clean Workspace"** (0 data until PDF uploaded) or **"Login as Guest (Demo Mode)"** (sample hydrocracker data for instant jury review).
- **Global Mode Switcher**: One-click toggle in the top header on **every page/tab** to switch between Demo, Clean Start, and Gateway views.
- **Universal Document Ingestion**: Parses PDF text streams page-by-page using `pdf-parse`, chunking text vectors and extracting equipment tags (`P-101A`, `V-301`).
- **Dynamic 2D Knowledge Graph**: Renders extracted equipment and statutory directives in an interactive visual HTML5 canvas network.
- **Persistent AI Chatbot**: Floating assistant on all pages powered by Google Gemini (`gemini-flash-latest`).
- **Statutory Audit Evidence Package**: 1-Click export of downloadable compliance packages for OISD-137 and Factory Act Section 37.

---

## 📁 Included Submissions & Deliverables
- 📐 **Full System Documentation PDF**: [AURA8_Full_System_Documentation.pdf](AURA8_Full_System_Documentation.pdf) (Mapping all 7 app module screenshots)
- 📐 **Architecture Diagram PDF**: [AURA8_Architecture_Diagram.pdf](AURA8_Architecture_Diagram.pdf)
- 📊 **Pitch Presentation Deck**: [AURA8_Presentation_Deck.pptx](AURA8_Presentation_Deck.pptx)
