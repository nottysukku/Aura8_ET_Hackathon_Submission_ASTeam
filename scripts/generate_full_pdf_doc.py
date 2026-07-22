import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_detailed_pdf():
    pdf_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Full_System_Documentation.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    CYAN = colors.HexColor('#06b6d4')
    DARK_BLUE = colors.HexColor('#0f172a')
    SLATE = colors.HexColor('#334155')
    PURPLE = colors.HexColor('#8b5cf6')
    ROSE = colors.HexColor('#f43f5e')

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=CYAN,
        spaceAfter=6,
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontSize=15,
        textColor=DARK_BLUE,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=PURPLE,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=9.5,
        textColor=SLATE,
        leading=14,
        spaceAfter=8
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f1f5f9'),
        borderColor=CYAN,
        borderWidth=1,
        borderPadding=8,
        spaceBefore=8,
        spaceAfter=8
    )

    elements = []

    # Title Banner
    elements.append(Paragraph("AURA-8: Unified Asset & Operations Brain", title_style))
    elements.append(Paragraph("Complete Technical Documentation & System Specification | Economic Times AI Hackathon 2.0 (2026)", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=CYAN, spaceAfter=15))

    # Section 1: Executive Overview
    elements.append(Paragraph("1. Executive Overview & Problem Context", h1_style))
    elements.append(Paragraph("Heavy industrial facilities in India—refineries, steel plants, and chemical manufacturing complexes—operate across 7 to 12 disconnected document systems. P&IDs and CAD drawings reside in engineering repositories, work orders in maintenance databases, operating procedures on paper, and regulatory filings in email archives. This fragmentation contributes to 18–22% of unplanned downtime events, as maintenance teams make decisions without complete equipment history or failure pattern context.", body_style))
    elements.append(Paragraph("AURA-8 addresses this knowledge cliff by ingesting heterogeneous industrial documents (P&IDs, OEM manuals, inspection reports, statutory regulations) into a unified visual Knowledge Graph and persistent Google Gemini RAG Copilot.", body_style))

    # Section 2: Platform Architecture Table
    elements.append(Paragraph("2. System Architecture & Component Mapping", h1_style))
    table_data = [
        ['Layer', 'Technology Stack', 'Function & Responsibility'],
        ['Frontend UI', 'Next.js 15, React 19, Tailwind CSS', 'Gateway Landing Page, 2D HTML5 Canvas Graph, Persistent Chatbot Drawer'],
        ['API Routes', 'Next.js App Router (/api/upload, /api/query)', 'Same-origin native PDF text parsing and RAG query orchestration'],
        ['FastAPI Backend', 'Python 3.11, FastAPI, PyPDF, Uvicorn', 'Secondary microservice engine for vector similarity and TF-IDF matching'],
        ['LLM RAG Engine', 'Google Gemini API (gemini-flash-latest)', 'Grounded synthesis using X-goog-api-key with page-level text citations'],
        ['PDF Parser', 'pdf-parse (Node.js) & PyPDF (Python)', 'Decompressing /FlateDecode streams to extract clean text page-by-page']
    ]
    t = Table(table_data, colWidths=[100, 180, 260])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 8.5),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 15))

    # Section 3: Detailed Module Breakdown with Screenshot Mapping
    elements.append(Paragraph("3. Detailed Platform Modules & Application Screenshots", h1_style))

    modules_info = [
        ("Module 1: Brain Overview Dashboard [Screenshot 1]",
         "The Brain Overview dashboard provides a high-level operational pulse of the facility. It displays 4 key scorecards: Graph Entities (2 Linked Equipment/Directives), Ingested Corpus (1 Document, 14.2K Entities), Statutory Audit Score (50% OISD-137 Verified), and High-Risk Assets (Tag P-101A Barrier Pressure Drop). Below the scorecards, a Doughnut Chart visualizes Knowledge Graph category distribution (Equipment, OEM Manuals, OISD Directives) alongside a monthly Ingestion Velocity Bar Chart."),

        ("Module 2: Interactive Industrial Knowledge Graph [Screenshot 2]",
         "The Knowledge Graph visualizer renders an interactive 2D HTML5 canvas network connecting equipment tags (e.g. Heavy Crude Pump P-101A) to statutory directives (OISD-STD-137 Dual Mechanical Seal Mandate). Clicking any node opens a right-side inspector card detailing operating temperature (84.5°C), barrier pressure (4.9 bar), risk level (High Warning), and a direct button to query the AI Copilot on that specific asset."),

        ("Module 3: Persistent Floating AI Assistant Drawer [Screenshot 3]",
         "Floating in the bottom-right corner of every page is the AURA Gemini Assistant drawer. Operators can open this chatbot anywhere across the platform to ask technical questions grounded in uploaded PDF documents or query statutory safety rules."),

        ("Module 4: Universal Document Ingestion Engine [Screenshot 4]",
         "The Ingestion Studio features a drag-and-drop file upload dropzone supporting P&ID CAD PDFs, OEM equipment manuals, maintenance logs, and statutory regulatory documents. When a file like 'Sample_Hydrocracker_P101A_Inspection.pdf' is dropped, pdf-parse decompresses PDF streams into clean text and indexes vector chunks."),

        ("Module 5: Expert Google Gemini RAG Studio [Screenshot 5]",
         "The dedicated RAG Copilot console allows operators to execute vector similarity queries grounded strictly in uploaded PDF documents. An inspector drawer on the right displays the exact text snippet extracted from the PDF page whenever a citation chip is clicked."),

        ("Module 6: Predictive Maintenance & Root Cause Analysis [Screenshot 6]",
         "The RCA Engine models Remaining Useful Life (RUL) degradation trajectories (e.g. 38.5 Hours Until Trip Limit for P-101A) using vibration FFT telemetry and bearing housing temperatures (84.5°C vs 75°C threshold). It auto-synthesizes an Ishikawa (Fishbone) Root Cause Diagram detailing 4 categories: Thermal Stress, Barrier Fluid System, Material Specs, and Operations."),

        ("Module 7: Quality & Statutory Compliance Intelligence [Screenshot 7]",
         "The Compliance Studio continuously monitors plant operations against mandatory codes including OISD-STD-137, Factory Act 1948 Section 37 (explosive fumes), and PESO Rules 2016. Clicking 'Download Real Audit Evidence Package' generates and triggers a real downloadable audit compliance report file.")
    ]

    for title, desc in modules_info:
        elements.append(Paragraph(title, h2_style))
        elements.append(Paragraph(desc, body_style))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph("4. Setup & Deployment Instructions", h1_style))
    elements.append(Paragraph("• <b>Local Execution</b>: Run <code>npm run dev</code> for the Next.js frontend (http://localhost:3000) and <code>uvicorn backend.main:app</code> for the Python RAG engine.<br/>• <b>Environment Key</b>: Set <code>GEMINI_API_KEY</code> inside <code>.env.local</code> for server-side RAG calls.<br/>• <b>GitHub Repository</b>: Code committed and pushed to <font color='#06b6d4'>https://github.com/nottysukku/Aura8_ET_Hackathon_Submission_ASTeam.git</font>.", body_style))

    doc.build(elements)
    print(f"Full documentation PDF saved to {pdf_path}")

if __name__ == "__main__":
    generate_detailed_pdf()
