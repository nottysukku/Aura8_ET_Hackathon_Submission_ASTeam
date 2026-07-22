import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_architecture_pdf():
    pdf_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Architecture_Diagram.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Color Palette
    CYAN = colors.HexColor('#06b6d4')
    DARK_BLUE = colors.HexColor('#0f172a')
    SLATE = colors.HexColor('#334155')
    PURPLE = colors.HexColor('#8b5cf6')

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=CYAN,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=9.5,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontSize=13,
        textColor=DARK_BLUE,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=8.5,
        textColor=SLATE,
        leading=12,
        spaceAfter=6
    )

    elements = []

    # Title Header
    elements.append(Paragraph("AURA-8 Architecture Diagram & Technical Specification", title_style))
    elements.append(Paragraph("Economic Times AI Hackathon 2.0 | Problem Statement 8: AI for Industrial Knowledge Intelligence", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=CYAN, spaceAfter=10))

    # Image 1: High-Level System Architecture Diagram Image
    elements.append(Paragraph("1. High-Level System Architecture Diagram", h1_style))
    elements.append(Paragraph("Complete architectural layer interaction (Client UI ➔ FastAPI/Next.js API ➔ Intelligence Vector Engine ➔ Google Gemini API):", body_style))

    arch_img_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\docs\architecture_diagram.png"
    if os.path.exists(arch_img_path):
        # 540 width fits letter page printable area (612 - 72 = 540)
        elements.append(Image(arch_img_path, width=540, height=270))
        elements.append(Spacer(1, 10))

    # Image 2: Ingestion & RAG Execution Sequence Diagram Image
    elements.append(Paragraph("2. Ingestion & RAG Execution Sequence Flowchart", h1_style))
    elements.append(Paragraph("Detailed step-by-step sequence diagram for document upload and grounded RAG query processing:", body_style))

    seq_img_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\docs\sequence_diagram.png"
    if os.path.exists(seq_img_path):
        elements.append(Image(seq_img_path, width=540, height=360))
        elements.append(Spacer(1, 10))

    # Section 3: Technology Stack & Component Responsibilities
    elements.append(Paragraph("3. Technology Stack & Component Responsibilities", h1_style))
    tech_data = [
        ['Subsystem', 'Technology Stack', 'Core Responsibility'],
        ['Frontend UI', 'Next.js 15, React 19, Tailwind CSS', 'Gateway landing page, persistent floating chatbot, interactive Canvas 2D graph.'],
        ['RAG Backend', 'Next.js API Routes & Python FastAPI', 'Same-origin /api/upload and /api/query endpoints with zero CORS issues.'],
        ['LLM Engine', 'Google Gemini (gemini-flash-latest)', 'Synthesizing grounded responses, page citations, and executive summaries.'],
        ['PDF Parser', 'pdf-parse (Node) & PyPDF (Python)', 'Decompressing PDF streams, extracting equipment tags (P-101A) and OISD codes.']
    ]

    tech_table = Table(tech_data, colWidths=[110, 180, 250])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    elements.append(tech_table)

    doc.build(elements)
    print(f"Architecture Diagram PDF with embedded images saved to {pdf_path}")

if __name__ == "__main__":
    generate_architecture_pdf()
