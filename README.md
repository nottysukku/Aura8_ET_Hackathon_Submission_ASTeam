# AURA-8: Unified Asset & Operations Brain
> **ET AI Hackathon 2.0 (2026) Submission** | **Problem Statement 8: AI for Industrial Knowledge Intelligence**

AURA-8 is an AI-powered Industrial Knowledge Intelligence platform unifying P&ID engineering drawings, OEM manuals, maintenance logs, and statutory OISD/Factory Act regulations into a queryable visual Knowledge Graph and grounded Gemini RAG Copilot.

---

## 🚀 How to Initialize the Project from Scratch

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

### Step 3: Set Up Python RAG Backend Environment
```bash
# Create Python virtual environment
python -m venv backend/venv

# Activate virtual environment (Windows PowerShell)
backend\venv\Scripts\Activate.ps1

# Install Python requirements
pip install fastapi uvicorn pypdf python-multipart requests python-pptx reportlab
```

### Step 4: Configure Environment Variables (Optional)
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Note: You can also enter your Gemini API Key directly inside the app's top header modal)*

---

## ⚡ How to Run the Application

### Option A: Next.js Full-Stack App (Recommended)
Start the Next.js development server (handles both UI and native `/api/upload` / `/api/query` RAG endpoints):
```bash
npm run dev
```
Open **`http://localhost:3000`** (or `http://localhost:3001`) in your browser.

### Option B: Run Python FastAPI RAG Server (Optional Secondary Engine)
In a separate terminal window:
```bash
backend\venv\Scripts\python -m uvicorn backend.main:app --reload --port 8000
```
API docs available at **`http://127.0.0.1:8000/docs`**.

---

## 🔄 How to Update the Project & Push to GitHub

### Pulling Latest Updates
```bash
git pull origin main
npm install
```

### Making Changes & Pushing Updates
```bash
# Check status of modified files
git status

# Stage all updated files
git add .

# Commit changes
git commit -m "Update: Describe your feature or fix here"

# Push updates to main branch
git push origin main
```

---

## 🌟 Key Application Features

- **Gateway Landing Page**: Choose between **"Start Clean Workspace"** (0 data until PDF uploaded) or **"Login as Guest (Demo Mode)"** (sample hydrocracker data for instant jury review).
- **Universal Document Ingestion**: Parses PDF text streams page-by-page using `pdf-parse`, chunking text vectors and extracting equipment tags (`P-101A`, `V-301`).
- **Dynamic 2D Knowledge Graph**: Renders extracted equipment and statutory directives in an interactive visual HTML5 canvas network.
- **Persistent AI Chatbot**: Floating assistant on all pages powered by Google Gemini (`gemini-flash-latest`).
- **Statutory Audit Evidence Package**: 1-Click export of downloadable compliance packages for OISD-137 and Factory Act Section 37.

---

## 📁 Included Submissions & Deliverables
- 📐 **Architecture Diagram PDF**: [AURA8_Architecture_Diagram.pdf](AURA8_Architecture_Diagram.pdf)
- 📊 **Pitch Presentation Deck**: [AURA8_Presentation_Deck.pptx](AURA8_Presentation_Deck.pptx)
