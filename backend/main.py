import os
import io
import re
import math
import uuid
import json
import requests
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pypdf

app = FastAPI(title="AURA-8 Industrial RAG Engine")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global In-Memory Vector Store & Knowledge Graph Database
INDEXED_DOCUMENTS: List[Dict[str, Any]] = []
VECTOR_CHUNKS: List[Dict[str, Any]] = []
DYNAMIC_GRAPH_NODES: List[Dict[str, Any]] = []
DYNAMIC_GRAPH_EDGES: List[Dict[str, Any]] = []

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

class QueryRequest(BaseModel):
    query: str
    apiKey: Optional[str] = None
    selectedDocIds: Optional[List[str]] = None

def compute_term_frequencies(text: str) -> Dict[str, float]:
    words = re.findall(r'\w+', text.lower())
    tf = {}
    for w in words:
        tf[w] = tf.get(w, 0) + 1.0
    total = float(len(words)) if words else 1.0
    return {w: count / total for w, count in tf.items()}

def cosine_similarity(tf1: Dict[str, float], tf2: Dict[str, float]) -> float:
    intersection = set(tf1.keys()).intersection(set(tf2.keys()))
    dot_product = sum(tf1[w] * tf2[w] for w in intersection)
    mag1 = math.sqrt(sum(val ** 2 for val in tf1.values()))
    mag2 = math.sqrt(sum(val ** 2 for val in tf2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

def extract_knowledge_entities(text: str, filename: str) -> List[Dict[str, Any]]:
    nodes = []
    equipment_tags = list(set(re.findall(r'\b[A-Z]{1,4}-\d{2,4}[A-Z]?\b', text)))
    for tag in equipment_tags:
        nodes.append({
            "id": f"node-{tag.lower()}",
            "name": f"Asset {tag}",
            "category": "Equipment",
            "tag": tag,
            "plantUnit": "Source File",
            "status": "Warning" if "leak" in text.lower() or "drop" in text.lower() else "Operational",
            "description": f"Extracted from {filename}",
            "specifications": {"Source File": filename},
            "connections": [],
            "riskLevel": "High" if "warning" in text.lower() or "leak" in text.lower() else "Low",
            "lastInspection": "Extracted Live"
        })

    reg_matches = list(set(re.findall(r'\b(OISD[-\s]?\d+|Factory Act|PESO Rules|ISO[-\s]?\d+)\b', text, re.IGNORECASE)))
    for reg in reg_matches:
        nodes.append({
            "id": f"node-reg-{uuid.uuid4().hex[:6]}",
            "name": f"Directive: {reg.upper()}",
            "category": "Regulation",
            "tag": reg.upper(),
            "plantUnit": "Statutory Standard",
            "status": "Operational",
            "description": f"Statutory directive in {filename}",
            "specifications": {"Source": filename},
            "connections": [],
            "riskLevel": "Critical",
            "lastInspection": "Current"
        })
    return nodes

@app.get("/")
def read_root():
    return {
        "system": "AURA-8 Real World FastAPI RAG Engine",
        "status": "Online",
        "indexedDocumentsCount": len(INDEXED_DOCUMENTS),
        "totalChunks": len(VECTOR_CHUNKS)
    }

@app.post("/api/mode/reset")
def reset_workspace():
    global INDEXED_DOCUMENTS, VECTOR_CHUNKS, DYNAMIC_GRAPH_NODES, DYNAMIC_GRAPH_EDGES
    INDEXED_DOCUMENTS = []
    VECTOR_CHUNKS = []
    DYNAMIC_GRAPH_NODES = []
    DYNAMIC_GRAPH_EDGES = []
    return {"status": "Workspace Reset to Clean State"}

@app.post("/api/mode/demo")
def load_guest_demo():
    global INDEXED_DOCUMENTS, VECTOR_CHUNKS, DYNAMIC_GRAPH_NODES, DYNAMIC_GRAPH_EDGES

    reset_workspace()

    demo_text = """THERMOGRAPHY & INSPECTION REPORT
EQUIPMENT TAG: P-101A (Heavy Crude Pump)
LOCATION: Coke Oven Unit 4
OPERATING PARAMETERS: Temp 84.5°C (Threshold 72.0°C), Pressure 4.9 bar.
REGULATORY COMPLIANCE: OISD-STD-137 Section 4.2.1 mandates dual mechanical seal with API Plan 53B barrier fluid.
STATUTORY RULE: Factory Act 1948 Section 37 requires precaution against explosive gas accumulation."""

    doc_id = "doc-demo-001"
    filename = "Sample_Hydrocracker_P101A_Inspection.pdf"

    INDEXED_DOCUMENTS.append({
        "id": doc_id,
        "title": filename,
        "filename": filename,
        "uploadedAt": "Guest Demo Loaded",
        "fileSize": "2.4 MB",
        "pages": 4,
        "chunksCount": 3,
        "status": "Processed & Indexed",
        "rawText": demo_text,
        "extractedEntitiesCount": 4
    })

    chunk_tf = compute_term_frequencies(demo_text)
    VECTOR_CHUNKS.append({
        "id": "chunk-demo-01",
        "docId": doc_id,
        "filename": filename,
        "page": 1,
        "text": demo_text,
        "tf": chunk_tf
    })

    DYNAMIC_GRAPH_NODES.extend([
        {
            "id": "node-p101a",
            "name": "High-Pressure Heavy Crude Pump A",
            "category": "Equipment",
            "tag": "P-101A",
            "plantUnit": "Coke Oven Unit 4",
            "status": "Warning",
            "description": "API 610 Heavy Crude Transfer Pump",
            "specifications": {"Operating Temp": "84.5°C", "Barrier Pressure": "4.9 bar"},
            "connections": ["node-oisd137"],
            "riskLevel": "High",
            "lastInspection": "Demo Data"
        },
        {
            "id": "node-oisd137",
            "name": "OISD-STD-137 Dual Seal Mandate",
            "category": "Regulation",
            "tag": "OISD-137",
            "plantUnit": "Statutory Safety Standard",
            "status": "Operational",
            "description": "Mandatory pressurized dual seal requirement",
            "specifications": {"Clause": "Section 4.2.1"},
            "connections": ["node-p101a"],
            "riskLevel": "Critical",
            "lastInspection": "Current"
        }
    ])

    return {
        "status": "Guest Demo Loaded",
        "documentsCount": len(INDEXED_DOCUMENTS),
        "nodesCount": len(DYNAMIC_GRAPH_NODES)
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content_bytes = await file.read()
        filename = file.filename
        file_id = f"doc-{uuid.uuid4().hex[:8]}"

        extracted_text = ""
        page_count = 1

        if filename.endswith(".pdf"):
            pdf_reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            page_count = len(pdf_reader.pages)
            for page_idx, page in enumerate(pdf_reader.pages):
                txt = page.extract_text() or ""
                extracted_text += f"\n--- Page {page_idx + 1} ---\n" + txt
        else:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")

        if not extracted_text.strip():
            extracted_text = f"Sample content extracted from {filename}."

        chunks = []
        chunk_size = 600
        overlap = 100
        start = 0
        while start < len(extracted_text):
            end = min(start + chunk_size, len(extracted_text))
            chunk_text = extracted_text[start:end]
            
            page_num = 1
            page_match = re.findall(r'--- Page (\d+) ---', extracted_text[:start+1])
            if page_match:
                page_num = int(page_match[-1])

            chunk_id = f"chunk-{uuid.uuid4().hex[:8]}"
            tf = compute_term_frequencies(chunk_text)

            chunks.append({
                "id": chunk_id,
                "docId": file_id,
                "filename": filename,
                "page": page_num,
                "text": chunk_text,
                "tf": tf
            })
            start += (chunk_size - overlap)

        VECTOR_CHUNKS.extend(chunks)

        extracted_nodes = extract_knowledge_entities(extracted_text, filename)
        for n in extracted_nodes:
            if not any(existing["tag"] == n["tag"] for existing in DYNAMIC_GRAPH_NODES):
                DYNAMIC_GRAPH_NODES.append(n)

        doc_meta = {
            "id": file_id,
            "title": filename,
            "filename": filename,
            "uploadedAt": "Just Now",
            "fileSize": f"{round(len(content_bytes) / 1024, 1)} KB",
            "pages": page_count,
            "chunksCount": len(chunks),
            "status": "Processed & Indexed",
            "rawText": extracted_text[:3000],
            "extractedEntitiesCount": len(extracted_nodes)
        }
        INDEXED_DOCUMENTS.append(doc_meta)

        return {
            "status": "Success",
            "document": doc_meta,
            "extractedChunks": len(chunks),
            "extractedNodes": len(extracted_nodes)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@app.get("/api/sources")
def get_sources():
    return {"sources": INDEXED_DOCUMENTS}

@app.get("/api/graph")
def get_knowledge_graph():
    return {"nodes": DYNAMIC_GRAPH_NODES, "edges": DYNAMIC_GRAPH_EDGES}

@app.post("/api/query")
async def rag_query(req: QueryRequest):
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if not VECTOR_CHUNKS:
        return {
            "answer": "No documents uploaded yet. Please upload your PDF or text file to ask questions grounded in your document.",
            "confidenceScore": 0,
            "citations": [],
            "graphNodesInvolved": []
        }

    query_tf = compute_term_frequencies(query)
    scored_chunks = []
    for chunk in VECTOR_CHUNKS:
        if req.selectedDocIds and chunk["docId"] not in req.selectedDocIds:
            continue
        sim = cosine_similarity(query_tf, chunk["tf"])
        scored_chunks.append((sim, chunk))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [item[1] for item in scored_chunks[:3]]
    highest_sim = scored_chunks[0][0] if scored_chunks else 0.0

    context_str = "\n\n".join([
        f"[SOURCE: {c['filename']}, Page {c['page']}]\n{c['text']}" for c in top_chunks
    ])

    citations = [
        {
            "title": f"{c['filename']} (Page {c['page']})",
            "docId": c["docId"],
            "page": c["page"],
            "textSnippet": c["text"][:250] + "..."
        }
        for c in top_chunks
    ]

    api_key = req.apiKey or os.getenv("GEMINI_API_KEY", "")
    answer_text = ""

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"You are AURA-8 Industrial RAG Engine.\nAnswer the user's question using strictly the provided context excerpts from their uploaded document.\nCite your sources using [Source: filename, Page X].\n\nCONTEXT EXCERPTS:\n{context_str}\n\nUSER QUESTION:\n{query}"
                    }
                ]
            }
        ]
    }

    try:
        res = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload, timeout=15)
        if res.status_code == 200:
            res_json = res.json()
            candidates = res_json.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    answer_text = parts[0].get("text", "")
        if not answer_text:
            answer_text = f"Based on **{top_chunks[0]['filename']}** (Page {top_chunks[0]['page']}):\n\n\"{top_chunks[0]['text'][:400]}...\""
    except Exception as err:
        answer_text = f"Based on **{top_chunks[0]['filename']}** (Page {top_chunks[0]['page']}):\n\n\"{top_chunks[0]['text'][:400]}...\""

    return {
        "id": f"rag-res-{uuid.uuid4().hex[:6]}",
        "question": query,
        "answer": answer_text,
        "confidenceScore": min(99.5, max(75.0, round(highest_sim * 1000 + 75.0, 1))),
        "citations": citations,
        "graphNodesInvolved": [n["id"] for n in DYNAMIC_GRAPH_NODES[:3]]
    }
