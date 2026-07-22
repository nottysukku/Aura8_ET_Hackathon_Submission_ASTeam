import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
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
    EMERALD = colors.HexColor('#10b981')

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=22,
        textColor=CYAN,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontSize=14,
        textColor=DARK_BLUE,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontSize=11,
        textColor=PURPLE,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=9,
        textColor=SLATE,
        leading=13,
        spaceAfter=6
    )

    diagram_box_style = ParagraphStyle(
        'DiagramBox',
        parent=styles['Normal'],
        fontSize=8.5,
        textColor=colors.HexColor('#0f172a'),
        leading=12
    )

    elements = []

    # Title & Header
    elements.append(Paragraph("AURA-8 Architecture Diagram & Technical Specification", title_style))
    elements.append(Paragraph("Economic Times AI Hackathon 2.0 | Problem Statement 8: AI for Industrial Knowledge Intelligence", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=CYAN, spaceAfter=12))

    # Section 1: High-Level Architecture Diagram
    elements.append(Paragraph("1. High-Level System Architecture Diagram", h1_style))
    elements.append(Paragraph("The system is structured across 4 decoupled architectural layers:", body_style))

    arch_boxes = [
        [
            Paragraph("<b>CLIENT LAYER (Next.js 15 App Router)</b><br/>• Gateway Landing Page (Demo vs Clean Start)<br/>• Persistent Floating AI Chatbot Drawer<br/>• Interactive 2D HTML5 Canvas Knowledge Graph<br/>• Universal Document Ingester Dropzone", diagram_box_style),
            Paragraph("<b>API ORCHESTRATION LAYER</b><br/>• POST /api/upload (PDF stream parsing)<br/>• POST /api/query (Gemini RAG call)<br/>• GET /api/graph (Knowledge Graph nodes)<br/>• POST /api/mode/demo (Sample hydrocracker data)", diagram_box_style)
        ],
        [
            Paragraph("<b>INTELLIGENCE & VECTOR ENGINE</b><br/>• pdf-parse & PyPDF Text Extractor<br/>• Recursive Text Chunker (600ch, 100 overlap)<br/>• TF-IDF & Cosine Similarity Vector Index<br/>• RegEx & NLP Entity Extractor (Tags P-101A, V-301)", diagram_box_style),
            Paragraph("<b>EXTERNAL AI LLM SERVICE</b><br/>• Google Gemini API (gemini-flash-latest)<br/>• Endpoint: https://generativelanguage.googleapis.com/<br/>• Header: X-goog-api-key<br/>• Output: Grounded Q&A with page citations", diagram_box_style)
        ]
    ]

    arch_table = Table(arch_boxes, colWidths=[270, 270])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#ecfeff')),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#f5f3ff')),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#f0fdf4')),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#fff7ed')),
        ('BOX', (0, 0), (-1, -1), 1, CYAN),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(arch_table)
    elements.append(Spacer(1, 12))

    # Architecture Flow Arrow Diagram Box
    flow_text = (
        "<b>DATA EXECUTION FLOW DIRECTIONS:</b><br/>"
        "User Document Upload ──► Next.js /api/upload ──► pdf-parse Extractor ──► Text Chunker & Vector Store ──► Entity Parser ──► Knowledge Graph<br/>"
        "User Chatbot Query ──► Next.js /api/query ──► Vector Cosine Match (Top 3) ──► Google Gemini API (gemini-flash-latest) ──► Grounded Response + Page Citations"
    )
    flow_p = Paragraph(flow_text, ParagraphStyle('FlowBox', parent=body_style, fontSize=8.5, textColor=DARK_BLUE, backColor=colors.HexColor('#f1f5f9'), borderColor=CYAN, borderWidth=1, borderPadding=8))
    elements.append(flow_p)
    elements.append(Spacer(1, 14))

    # Section 2: Ingestion & RAG Sequence Diagram
    elements.append(Paragraph("2. Ingestion & RAG Execution Sequence Diagram", h1_style))

    seq_steps = [
        ['Step #', 'Sequence Event', 'Source ➔ Destination', 'Description & Payload'],
        ['1', 'PDF Document Upload', 'User ➔ Next.js UI', 'User drags PDF into dropzone or uploads via file selector.'],
        ['2', 'Multipart POST Request', 'Next.js UI ➔ /api/upload', 'Posts file FormData to same-origin relative API route.'],
        ['3', 'Stream Decompression', '/api/upload ➔ pdf-parse', 'Decompresses /FlateDecode PDF binary stream into clean text.'],
        ['4', 'Chunking & Vector Index', '/api/upload ➔ Vector Store', 'Splits text into 600-character overlapping chunks & indexes TF-IDF.'],
        ['5', 'Entity & Tag Extraction', '/api/upload ➔ Entity Parser', 'Extracts equipment tags (P-101A) and statutory standards (OISD-137).'],
        ['6', 'Graph Population', '/api/upload ➔ Knowledge Graph', 'Populates 2D Knowledge Graph nodes & unlocks dashboard infographics!'],
        ['7', 'RAG User Query', 'User ➔ Persistent Chatbot', 'User asks technical question in persistent AI chatbot drawer.'],
        ['8', 'Cosine Match Search', '/api/query ➔ Vector Store', 'Retrieves top 3 relevant text chunks matching query term frequencies.'],
        ['9', 'Gemini LLM Call', '/api/query ➔ Gemini API', 'Posts generateContent prompt with X-goog-api-key header.'],
        ['10', 'Grounded Answer Render', 'Gemini API ➔ Chatbot UI', 'Renders grounded response with clickable page-level text citations.']
    ]

    seq_table = Table(seq_steps, colWidths=[40, 130, 130, 240])
    seq_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ]))
    elements.append(seq_table)
    elements.append(Spacer(1, 14))

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
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    elements.append(tech_table)

    doc.build(elements)
    print(f"Architecture Diagram PDF saved to {pdf_path}")

if __name__ == "__main__":
    generate_architecture_pdf()
