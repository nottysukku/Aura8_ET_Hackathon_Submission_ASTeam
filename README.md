# AURA-8: Unified Asset & Operations Brain
> **ET AI Hackathon 2.0 (2026) Submission** | **Problem Statement 8: AI for Industrial Knowledge Intelligence**

AURA-8 is a production-grade, AI-powered Industrial Knowledge Intelligence platform designed to solve information fragmentation and the operator knowledge cliff in heavy industry.

---

## 🌟 Key Features

1. **Universal Industrial Document Ingestion**:
   - Ingests P&ID engineering drawings, OEM manuals, maintenance work orders, and statutory OISD/Factory Act regulations.
   - Decompresses PDF binary streams using `pdf-parse` to extract clean human-readable text page-by-page.

2. **Gateway Landing Page & Zero-Data Mode**:
   - **Start Clean Workspace**: Zero pre-loaded clutter. Infographics and Knowledge Graphs populate **only after** a file is submitted.
   - **Guest Demo Mode**: Instant access pre-loaded with sample refinery hydrocracker data (`P-101A` pump, `V-301` column, OISD-137 compliance) for hackathon evaluators.

3. **Dynamic 2D Visual Knowledge Graph**:
   - Extracts equipment tags (e.g. `P-101A`, `V-301`) and regulatory rules into an interactive visual 2D HTML5 canvas network.

4. **Persistent Google Gemini RAG Copilot**:
   - Floating assistant drawer accessible across all pages/tabs.
   - Answers operational queries using `gemini-flash-latest` with exact page-level text citations.

5. **Statutory Compliance & Audit Evidence Package**:
   - Audits plant operations against OISD-137, Factory Act 1948 Section 37, and PESO rules.
   - 1-Click export of downloadable statutory audit evidence files.

---

## 🛠️ Architecture & Tech Stack

```
[ User PDF Upload ] ──► [ Next.js / pdf-parse ] ──► [ Vector Similarity Store ]
                                                             │
                                                             ▼
[ Persistent Chatbot ] ◄── [ Google Gemini API ] ◄── [ Top 3 Text Chunks ]
```

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, HTML5 Canvas.
- **Backend API**: Next.js Native App API Routes (`/api/upload`, `/api/query`) + Python 3.11 FastAPI server.
- **LLM Engine**: Google Gemini API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`).
- **PDF Extraction**: `pdf-parse` (Node.js) & `pypdf` (Python).

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/nottysukku/Aura8_ET_Hackathon_Submission_ASTeam.git
cd Aura8_ET_Hackathon_Submission_ASTeam
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📁 Submission Deliverables
- **Architecture Diagram PDF**: [AURA8_Architecture_Diagram.pdf](AURA8_Architecture_Diagram.pdf)
- **Pitch Presentation Deck**: [AURA8_Presentation_Deck.pptx](AURA8_Presentation_Deck.pptx)
