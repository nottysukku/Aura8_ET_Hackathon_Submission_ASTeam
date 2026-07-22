import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_architecture_pdf():
    pdf_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Architecture_Diagram_Final.pdf"
    
    # Page setup: Letter (612 x 792 pt), 36pt margins -> Printable area = 540 x 720 pt
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
        spaceAfter=4,
        leading=24
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=9.5,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=8,
        leading=12
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontSize=13,
        textColor=DARK_BLUE,
        spaceBefore=10,
        spaceAfter=6,
        leading=16
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=8.5,
        textColor=SLATE,
        leading=12,
        spaceAfter=6
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.white,
        fontName='Helvetica-Bold',
        leading=10
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontSize=8,
        textColor=SLATE,
        leading=11
    )

    elements = []

    # ================= PAGE 1: TITLE & HIGH-LEVEL SYSTEM ARCHITECTURE =================
    elements.append(Paragraph("AURA-8 Architecture Diagram & Technical Specification", title_style))
    elements.append(Paragraph("Economic Times AI Hackathon 2.0 | Problem Statement 8: AI for Industrial Knowledge Intelligence", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=CYAN, spaceAfter=10))

    elements.append(Paragraph("1. High-Level System Architecture Diagram", h1_style))
    elements.append(Paragraph("The system is structured across 4 decoupled architectural layers (Client UI ➔ API Gateway ➔ Intelligence Engine ➔ Google Gemini API):", body_style))

    arch_img_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\docs\architecture_diagram.png"
    if os.path.exists(arch_img_path):
        elements.append(Image(arch_img_path, width=520, height=250))
        elements.append(Spacer(1, 10))

    arch_boxes = [
        [
            Paragraph("<b>CLIENT LAYER (Next.js 15 App Router)</b><br/>• Gateway Landing Page (Demo vs Clean Start)<br/>• Persistent Floating AI Chatbot Drawer<br/>• Interactive 2D HTML5 Canvas Knowledge Graph<br/>• Universal Document Ingester Dropzone", tbl_cell_style),
            Paragraph("<b>API ORCHESTRATION LAYER</b><br/>• POST /api/upload (PDF stream parsing)<br/>• POST /api/query (Gemini RAG call)<br/>• GET /api/graph (Knowledge Graph nodes)<br/>• POST /api/mode/demo (Sample hydrocracker data)", tbl_cell_style)
        ],
        [
            Paragraph("<b>INTELLIGENCE & VECTOR ENGINE</b><br/>• pdf-parse & PyPDF Text Extractor<br/>• Recursive Text Chunker (600ch, 100 overlap)<br/>• TF-IDF & Cosine Similarity Vector Index<br/>• RegEx & NLP Entity Extractor (Tags P-101A, V-301)", tbl_cell_style),
            Paragraph("<b>EXTERNAL AI LLM SERVICE</b><br/>• Google Gemini API (gemini-flash-latest)<br/>• Endpoint: https://generativelanguage.googleapis.com/<br/>• Header: X-goog-api-key<br/>• Output: Grounded Q&A with page citations", tbl_cell_style)
        ]
    ]

    arch_table = Table(arch_boxes, colWidths=[260, 260])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#ecfeff')),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#f5f3ff')),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#f0fdf4')),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#fff7ed')),
        ('BOX', (0, 0), (-1, -1), 1, CYAN),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(arch_table)

    elements.append(PageBreak())

    # ================= PAGE 2: INGESTION & RAG SEQUENCE DIAGRAM =================
    elements.append(Paragraph("2. Ingestion & RAG Execution Sequence Diagram", h1_style))
    elements.append(Paragraph("Detailed step-by-step sequence diagram for document upload and grounded RAG query processing:", body_style))

    seq_img_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\docs\sequence_diagram.png"
    if os.path.exists(seq_img_path):
        elements.append(Image(seq_img_path, width=520, height=350))
        elements.append(Spacer(1, 12))

    seq_steps = [
        [
            Paragraph('Step #', tbl_header_style),
            Paragraph('Sequence Event', tbl_header_style),
            Paragraph('Source ➔ Destination', tbl_header_style),
            Paragraph('Description & Payload', tbl_header_style)
        ],
        [Paragraph('1', tbl_cell_style), Paragraph('PDF Document Upload', tbl_cell_style), Paragraph('User ➔ Next.js UI', tbl_cell_style), Paragraph('User drags PDF into dropzone or uploads via file selector.', tbl_cell_style)],
        [Paragraph('2', tbl_cell_style), Paragraph('Multipart POST Request', tbl_cell_style), Paragraph('Next.js UI ➔ /api/upload', tbl_cell_style), Paragraph('Posts file FormData to same-origin relative API route.', tbl_cell_style)],
        [Paragraph('3', tbl_cell_style), Paragraph('Stream Decompression', tbl_cell_style), Paragraph('/api/upload ➔ pdf-parse', tbl_cell_style), Paragraph('Decompresses /FlateDecode PDF binary stream into clean text.', tbl_cell_style)],
        [Paragraph('4', tbl_cell_style), Paragraph('Chunking & Vector Index', tbl_cell_style), Paragraph('/api/upload ➔ Vector Store', tbl_cell_style), Paragraph('Splits text into 600-character overlapping chunks & indexes TF-IDF.', tbl_cell_style)],
        [Paragraph('5', tbl_cell_style), Paragraph('Entity & Tag Extraction', tbl_cell_style), Paragraph('/api/upload ➔ Entity Parser', tbl_cell_style), Paragraph('Extracts equipment tags (P-101A) and statutory standards (OISD-137).', tbl_cell_style)],
        [Paragraph('6', tbl_cell_style), Paragraph('Graph Population', tbl_cell_style), Paragraph('/api/upload ➔ Knowledge Graph', tbl_cell_style), Paragraph('Populates 2D Knowledge Graph nodes & unlocks dashboard infographics!', tbl_cell_style)],
        [Paragraph('7', tbl_cell_style), Paragraph('RAG User Query', tbl_cell_style), Paragraph('User ➔ Persistent Chatbot', tbl_cell_style), Paragraph('User asks technical question in persistent AI chatbot drawer.', tbl_cell_style)],
        [Paragraph('8', tbl_cell_style), Paragraph('Cosine Match Search', tbl_cell_style), Paragraph('/api/query ➔ Vector Store', tbl_cell_style), Paragraph('Retrieves top 3 relevant text chunks matching query term frequencies.', tbl_cell_style)],
        [Paragraph('9', tbl_cell_style), Paragraph('Gemini LLM Call', tbl_cell_style), Paragraph('/api/query ➔ Gemini API', tbl_cell_style), Paragraph('Posts generateContent prompt with X-goog-api-key header.', tbl_cell_style)],
        [Paragraph('10', tbl_cell_style), Paragraph('Grounded Answer Render', tbl_cell_style), Paragraph('Gemini API ➔ Chatbot UI', tbl_cell_style), Paragraph('Renders grounded response with clickable page-level text citations.', tbl_cell_style)]
    ]

    seq_table = Table(seq_steps, colWidths=[35, 115, 120, 250])
    seq_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BLUE),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
        ('TOPPADDING', (0, 0), (-1, 0), 4),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ]))
    elements.append(seq_table)

    elements.append(PageBreak())

    # ================= PAGE 3: SUBSYSTEM TECHNOLOGY MATRIX =================
    elements.append(Paragraph("3. Technology Stack & Component Responsibilities", h1_style))
    elements.append(Paragraph("Decoupled architecture component mapping across frontend, backend, vector store, and LLM services:", body_style))

    tech_data = [
        [
            Paragraph('Subsystem', tbl_header_style),
            Paragraph('Technology Stack', tbl_header_style),
            Paragraph('Core Responsibility', tbl_header_style)
        ],
        [
            Paragraph('Frontend UI', tbl_cell_style),
            Paragraph('Next.js 15, React 19, Tailwind CSS', tbl_cell_style),
            Paragraph('Gateway landing page, persistent floating chatbot, interactive Canvas 2D graph, dark industrial design system.', tbl_cell_style)
        ],
        [
            Paragraph('RAG Backend', tbl_cell_style),
            Paragraph('Next.js API Routes & Python FastAPI', tbl_cell_style),
            Paragraph('Same-origin /api/upload and /api/query endpoints handling multipart requests with zero CORS issues.', tbl_cell_style)
        ],
        [
            Paragraph('LLM Engine', tbl_cell_style),
            Paragraph('Google Gemini (gemini-flash-latest)', tbl_cell_style),
            Paragraph('Synthesizing grounded responses, page citations, and executive summaries via X-goog-api-key header.', tbl_cell_style)
        ],
        [
            Paragraph('PDF Parser', tbl_cell_style),
            Paragraph('pdf-parse (Node) & PyPDF (Python)', tbl_cell_style),
            Paragraph('Decompressing PDF binary streams, extracting equipment tags (P-101A) and statutory OISD/Factory Act codes.', tbl_cell_style)
        ]
    ]

    tech_table = Table(tech_data, colWidths=[110, 160, 250])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('TOPPADDING', (0, 0), (-1, 0), 5),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(tech_table)

    doc.build(elements)
    print(f"Pixel-perfect Architecture Diagram PDF saved to {pdf_path}")

    # Copy to original target if not locked
    try:
        import shutil
        target_path = r"c:\Users\sukri\Desktop\ET_AI_Hackathon_problem\AURA8_Architecture_Diagram.pdf"
        shutil.copyfile(pdf_path, target_path)
    except Exception as e:
        print("Note: Primary file open in viewer, generated as AURA8_Architecture_Diagram_Final.pdf")

if __name__ == "__main__":
    generate_architecture_pdf()
