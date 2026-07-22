import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_powerpoint():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    DARK_BG = RGBColor(11, 15, 23)
    CYAN_ACCENT = RGBColor(6, 182, 212)
    PURPLE_ACCENT = RGBColor(139, 92, 246)
    WHITE_TEXT = RGBColor(248, 250, 252)
    SLATE_TEXT = RGBColor(148, 163, 184)
    CARD_BG = RGBColor(17, 24, 39)

    slides_data = [
        {
            "title": "AURA-8: Unified Asset & Operations Brain",
            "subtitle": "Pitch Presentation Deck | Economic Times AI Hackathon 2.0 (2026)",
            "bullets": [
                "Problem Statement #8: AI for Industrial Knowledge Intelligence",
                "Theme: Industrial Intelligence / Document Management / Quality",
                "Tech Stack: Next.js 15, Python FastAPI, PyPDF, Google Gemini API (gemini-flash-latest)"
            ]
        },
        {
            "title": "The Problem Context: Industrial Information Fragmentation",
            "subtitle": "Why Heavy Industry Loses Millions to Disconnected Documents",
            "bullets": [
                "35% Lost Productivity: Industrial engineers spend >1/3 of workday searching for drawings and manuals.",
                "7 to 12 Disconnected Systems: Plants operate across P&ID CADs, work orders, operating procedures, and email archives.",
                "18–22% Unplanned Downtime: Maintenance teams make decisions without full failure pattern context.",
                "The Knowledge Cliff: 25% of experienced operators retire in the next decade, taking decades of undocumented knowledge."
            ]
        },
        {
            "title": "The Solution: AURA-8 Platform",
            "subtitle": "A Single, Unified Neural Brain for Plant Knowledge",
            "bullets": [
                "Gateway Landing Page: Choice between 'Start Clean Workspace' (0 data until file uploaded) and 'Guest Demo Mode' (sample hydrocracker data).",
                "Universal Ingestion Engine: Extracts text, equipment tags (P-101A, V-301), parameters, and statutory rules from uploaded PDFs.",
                "Dynamic Knowledge Graph: Populates visual 2D interactive network strictly from submitted files.",
                "Persistent Gemini RAG Copilot: Floating AI assistant on every view with exact page-level text citations."
            ]
        },
        {
            "title": "Technical Architecture",
            "subtitle": "FastAPI + Vector Similarity + Google Gemini API",
            "bullets": [
                "FastAPI RAG Backend (Python 3.11): Running on http://127.0.0.1:8000 handling PDF text extraction and chunking.",
                "Vector Indexing: TF-IDF & Cosine Similarity ranking over 600-char text chunks.",
                "Google Gemini API: Endpoint https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent.",
                "Next.js 15 UI: React 19 App Router with Tailwind CSS and HTML5 Canvas Knowledge Graph."
            ]
        },
        {
            "title": "Value Proposition & Business Impact",
            "subtitle": "Transforming Plant Operations & Compliance Verification",
            "bullets": [
                "Search Time Reduction: Cut document search time from 35% of workday down to < 10 seconds via RAG.",
                "Unplanned Downtime Reduction: Projected 18-22% reduction in downtime events via root cause analysis.",
                "Statutory Audit Evidence: 1-Click export of OISD-137 & Factory Act Section 37 compliance packages."
            ]
        },
        {
            "title": "Judging Criteria & Live Prototype Demo",
            "subtitle": "ET AI Hackathon 2.0 Evaluation Alignment",
            "bullets": [
                "Innovation (25%): Real-time conversion of unstructured PDFs into visual Knowledge Graphs & Gemini RAG.",
                "Business Impact (25%): Prevents fatal industrial accidents and reduces operational downtime.",
                "Technical Excellence (20%): Modular Python FastAPI backend + Next.js 15 frontend architecture.",
                "User Experience (15%): Gateway landing page, zero-data initial state, and persistent floating chatbot."
            ]
        }
    ]

    for slide_info in slides_data:
        slide = prs.slides.add_slide(blank_layout)
        
        # Background
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = DARK_BG

        # Title Box
        title_box = slide.shapes.add_textbox(Inches(1), Inches(0.8), Inches(11.333), Inches(1.2))
        tf = title_box.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = slide_info["title"]
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = CYAN_ACCENT

        p2 = tf.add_paragraph()
        p2.text = slide_info["subtitle"]
        p2.font.size = Pt(14)
        p2.font.color.rgb = SLATE_TEXT

        # Content Card Box
        content_box = slide.shapes.add_textbox(Inches(1), Inches(2.3), Inches(11.333), Inches(4.5))
        ctf = content_box.text_frame
        ctf.word_wrap = True

        for bullet in slide_info["bullets"]:
            bp = ctf.add_paragraph()
            bp.text = f"• {bullet}"
            bp.font.size = Pt(18)
            bp.font.color.rgb = WHITE_TEXT
            bp.space_after = Pt(16)

    output_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Presentation_Deck.pptx"
    prs.save(output_path)
    print(f"Presentation saved to {output_path}")

def generate_pdf():
    pdf_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Architecture_Diagram.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        textColor=colors.HexColor('#06b6d4'),
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=14,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#334155'),
        leading=14,
        spaceAfter=8
    )

    elements = []
    elements.append(Paragraph("AURA-8 System Architecture & Specification", title_style))
    elements.append(Paragraph("Problem Statement 8: AI for Industrial Knowledge Intelligence", body_style))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("1. High-Level Architecture Overview", h2_style))
    elements.append(Paragraph("AURA-8 is built using a decoupled full-stack architecture combining a Next.js 15 App Router frontend and a Python 3.11 FastAPI backend connected directly to the Google Gemini API (gemini-flash-latest).", body_style))

    table_data = [
        ['Subsystem', 'Technology', 'Core Responsibility'],
        ['Client Layer', 'Next.js 15, React 19, Tailwind CSS', 'Gateway Landing Page, Persistent Chatbot, Canvas Knowledge Graph'],
        ['Backend API Layer', 'Python 3.11, FastAPI, Uvicorn', 'PDF parsing, text chunking, TF-IDF vector indexing (:8000)'],
        ['RAG & LLM Engine', 'Google Gemini API (gemini-flash-latest)', 'Grounded Q&A synthesis with page-level text citations'],
        ['Parser Engine', 'PyPDF (pypdf), RegEx Entity Parser', 'Extracting tags (P-101A, V-301) and OISD/Factory Act directives']
    ]

    t = Table(table_data, colWidths=[120, 180, 240])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 15))

    elements.append(Paragraph("2. Ingestion & RAG Execution Flow", h2_style))
    elements.append(Paragraph("1. User uploads an industrial PDF/TXT file via the Next.js dropzone.<br/>2. FastAPI receives file at POST /api/upload and invokes PyPDF text extraction.<br/>3. Extracted text is split into 600-character chunks with 100-character overlap and indexed.<br/>4. Entity Parser extracts equipment tags (e.g. P-101A) and regulatory codes to populate the 2D Knowledge Graph.<br/>5. When the user asks a question, FastAPI calculates cosine similarity to fetch top 3 text chunks.<br/>6. Context is sent to https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent for grounded answer synthesis.", body_style))

    elements.append(Spacer(1, 15))
    elements.append(Paragraph("3. Gateway & Zero-Data Mode Specifications", h2_style))
    elements.append(Paragraph("• <b>Start Clean Workspace</b>: Workspace starts with 0 data. Infographics, Knowledge Graph nodes, and RAG indexes populate ONLY after the first document upload.<br/>• <b>Guest Demo Mode</b>: Invokes POST /api/mode/demo to load pre-configured sample hydrocracker data for instant evaluator review.", body_style))

    doc.build(elements)
    print(f"PDF saved to {pdf_path}")

if __name__ == "__main__":
    generate_powerpoint()
    generate_pdf()
