export interface EquipmentNode {
  id: string;
  name: string;
  category: 'Equipment' | 'Drawing' | 'Manual' | 'WorkOrder' | 'Regulation' | 'Incident';
  tag: string;
  plantUnit: string;
  status: 'Operational' | 'Warning' | 'Critical' | 'Maintenance';
  description: string;
  specifications: Record<string, string>;
  connections: string[]; // Connected Node IDs
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  lastInspection: string;
  complianceRef?: string;
}

export interface IngestedDocument {
  id: string;
  title: string;
  type: 'P&ID Drawing' | 'OEM Manual' | 'Work Order' | 'Inspection Log' | 'Regulatory Act' | 'Safety SOP';
  filename: string;
  uploadedAt: string;
  extractedEntitiesCount: number;
  status: 'Processed' | 'Indexing' | 'Pending';
  fileSize: string;
  summary: string;
  rawSnippet: string;
  keyEntities: { type: string; value: string; confidence: number }[];
}

export interface RAGQueryResponse {
  id: string;
  question: string;
  answer: string;
  confidenceScore: number;
  citations: { title: string; docId: string; page?: number; section?: string; textSnippet: string }[];
  graphNodesInvolved: string[];
  recommendedActions: string[];
}

export interface ComplianceRule {
  id: string;
  code: string;
  standard: 'OISD-137' | 'Factory Act 1948' | 'PESO Rules 2016' | 'ISO 55001';
  title: string;
  clause: string;
  mandatoryRequirement: string;
  currentStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  affectedAssetTag: string;
  lastAudited: string;
  remediationPlan?: string;
}

export const INITIAL_KNOWLEDGE_NODES: EquipmentNode[] = [
  {
    id: 'node-p101a',
    name: 'High-Pressure Heavy Crude Pump A',
    category: 'Equipment',
    tag: 'P-101A',
    plantUnit: 'Coke Oven Unit 4',
    status: 'Warning',
    description: 'API 610 Centrifugal Heavy Crude Transfer Pump operating under 42 bar pressure and 310°C.',
    specifications: {
      'Design Flow Rate': '450 m³/h',
      'Operating Temp': '310°C',
      'Max Pressure': '48 bar',
      'Seal Type': 'Dual Cartridge Mechanical (API Plan 53B)',
      'Vibration Limit': '2.8 mm/s RMS'
    },
    connections: ['node-dwg204', 'node-manual-p101', 'node-wo8891', 'node-oisd137', 'node-inc2024-08'],
    riskLevel: 'High',
    lastInspection: '2026-07-10',
    complianceRef: 'OISD-137 §4.2'
  },
  {
    id: 'node-dwg204',
    name: 'P&ID Hydrocracker Feed Line & Pump System',
    category: 'Drawing',
    tag: 'DWG-HC-204-REV3',
    plantUnit: 'Hydrocracker Unit 2',
    status: 'Operational',
    description: 'Master Piping & Instrumentation Diagram showing P-101A/B suction, discharge, and emergency shutdown bypasses.',
    specifications: {
      'Drawing No': 'P-ID-HC-2024-004-R3',
      'Revision': 'Rev 3.2 (Approved)',
      'Format': 'Vector CAD / PDF',
      'Safety Integrity Level': 'SIL-3 Rated'
    },
    connections: ['node-p101a', 'node-v301'],
    riskLevel: 'Low',
    lastInspection: '2026-05-15'
  },
  {
    id: 'node-manual-p101',
    name: 'Sulzer API 610 Pump OEM Maintenance Manual',
    category: 'Manual',
    tag: 'DOC-OEM-SULZER-P100',
    plantUnit: 'Central Archive',
    status: 'Operational',
    description: 'Manufacturer technical operating specifications, mechanical seal flushing instructions, and bearing tolerances.',
    specifications: {
      'OEM Vendor': 'Sulzer Pumps Ltd',
      'Publication Date': '2022-11-10',
      'Pages': '184 Pages',
      'Recommended Overhaul': '24,000 Operating Hours'
    },
    connections: ['node-p101a', 'node-wo8891'],
    riskLevel: 'Low',
    lastInspection: '2026-01-01'
  },
  {
    id: 'node-wo8891',
    name: 'Work Order: Seal Flush Pressure Drop Inspection',
    category: 'WorkOrder',
    tag: 'WO-2026-8891',
    plantUnit: 'Coke Oven Unit 4',
    status: 'Maintenance',
    description: 'Preventive maintenance log reporting barrier fluid pressure fluctuation in API Plan 53B accumulator for P-101A.',
    specifications: {
      'Work Order ID': 'WO-2026-8891',
      'Assigned Team': 'Mechanical Integrity Team B',
      'Logged Date': '2026-07-18',
      'Priority': 'Urgent'
    },
    connections: ['node-p101a', 'node-manual-p101', 'node-inc2024-08'],
    riskLevel: 'High',
    lastInspection: '2026-07-18'
  },
  {
    id: 'node-oisd137',
    name: 'OISD-STD-137: Inspection of Electrical Equipment & Pumps',
    category: 'Regulation',
    tag: 'OISD-137-SEC4',
    plantUnit: 'Statutory Safety Standard',
    status: 'Operational',
    description: 'Oil Industry Safety Directorate mandatory code regulating high-risk pump sealing systems and hazardous area classifications.',
    specifications: {
      'Regulatory Body': 'OISD Ministry of Petroleum',
      'Clause': 'Section 4.2.1 - Dual Mechanical Seals',
      'Mandatory Audit Freq': 'Semi-Annual',
      'Penalization Class': 'Category A Violation'
    },
    connections: ['node-p101a', 'node-factact48'],
    riskLevel: 'Critical',
    lastInspection: '2026-06-01'
  },
  {
    id: 'node-factact48',
    name: 'Factory Act 1948 - Section 37: Explosive Gas Prevention',
    category: 'Regulation',
    tag: 'FACT-ACT-SEC37',
    plantUnit: 'Statutory Safety Standard',
    status: 'Operational',
    description: 'Statutory provisions regarding precaution against dangerous fumes, explosive gas accumulation, and confined space entry.',
    specifications: {
      'Statute': 'The Factories Act, 1948',
      'Enforcing Authority': 'State Directorate of Industrial Safety & Health (DISH)',
      'Scope': 'Inflammable dust/gas hazardous zones'
    },
    connections: ['node-oisd137', 'node-p101a'],
    riskLevel: 'Critical',
    lastInspection: '2026-04-12'
  },
  {
    id: 'node-v301',
    name: 'Vacuum Distillation Flash Column V-301',
    category: 'Equipment',
    tag: 'V-301',
    plantUnit: 'Distillation Unit 1',
    status: 'Operational',
    description: 'High-temperature vacuum column processing heavy residue stream into gas oils.',
    specifications: {
      'Operating Pressure': '0.08 bar (Abs)',
      'Top Temperature': '385°C',
      'Material': 'SA-516 Grade 70 Clad with SS316L'
    },
    connections: ['node-dwg204'],
    riskLevel: 'Medium',
    lastInspection: '2026-06-25'
  },
  {
    id: 'node-inc2024-08',
    name: 'Near-Miss Incident Report: Barrier Fluid Leakage Event',
    category: 'Incident',
    tag: 'INC-2025-049',
    plantUnit: 'Coke Oven Unit 4',
    status: 'Warning',
    description: 'Historical near-miss report detailing seal degradation and minor barrier fluid loss on crude feed line pumps.',
    specifications: {
      'Incident Code': 'INC-2025-049',
      'Date of Event': '2025-09-14',
      'Root Cause': 'Thermal stress on Secondary O-ring elastomer',
      'Corrective Action': 'Upgraded to Kalrez 6375 Elastomer'
    },
    connections: ['node-p101a', 'node-wo8891'],
    riskLevel: 'High',
    lastInspection: '2025-09-15'
  }
];

export const MOCK_INGESTED_DOCUMENTS: IngestedDocument[] = [
  {
    id: 'doc-001',
    title: 'Hydrocracker_P101A_Vibration_Thermal_Report.pdf',
    type: 'Inspection Log',
    filename: 'Hydrocracker_P101A_Vibration_Thermal_Report.pdf',
    uploadedAt: '2026-07-21 14:32',
    extractedEntitiesCount: 18,
    status: 'Processed',
    fileSize: '4.8 MB',
    summary: 'Infrared thermography scan reveals 12°C temperature elevation on drive-end bearing housing of Pump P-101A. Fast Fourier Transform (FFT) vibration spectrum indicates 1X rotational speed dominance.',
    rawSnippet: 'THERMOGRAPHY REPORT ID: TR-2026-0721\nEQUIPMENT: P-101A (Heavy Crude Pump)\nMAX TEMP OBSERVED: 84.5°C at Drive End Bearing.\nACCEPTABLE THRESHOLD: 72.0°C.\nRECOMMENDATION: Check lubrication viscosity and verify API Plan 53B barrier fluid circulation pressure immediately.',
    keyEntities: [
      { type: 'Equipment Tag', value: 'P-101A', confidence: 0.99 },
      { type: 'Parameter', value: 'Operating Temp 84.5°C', confidence: 0.97 },
      { type: 'Standard', value: 'API Plan 53B', confidence: 0.95 },
      { type: 'Risk Level', value: 'High Alert', confidence: 0.92 }
    ]
  },
  {
    id: 'doc-002',
    title: 'OISD_STD_137_Mandatory_Pump_Safety_Clause_4.pdf',
    type: 'Regulatory Act',
    filename: 'OISD_STD_137_Mandatory_Pump_Safety_Clause_4.pdf',
    uploadedAt: '2026-07-20 09:15',
    extractedEntitiesCount: 34,
    status: 'Processed',
    fileSize: '12.1 MB',
    summary: 'Official OISD mandatory specification governing seal flushing systems, pressure relief valves, and automatic trips for flammable liquid pumps operating above flash point.',
    rawSnippet: 'OISD-STD-137 SECTION 4.2.1: All pumps handling Class-A hydrocarbons at temperatures exceeding 250°C shall be equipped with dual mechanical seals having an independent pressurized barrier fluid system (API Plan 53B/53C). Automatic low-pressure alarm and trip interlocks are mandatory.',
    keyEntities: [
      { type: 'Regulatory Code', value: 'OISD-STD-137 §4.2.1', confidence: 1.0 },
      { type: 'Class', value: 'Class-A Hydrocarbons', confidence: 0.98 },
      { type: 'Mandate', value: 'Dual Mechanical Seal Plan 53B', confidence: 0.96 }
    ]
  },
  {
    id: 'doc-003',
    title: 'WO_8891_Maintenance_Seal_Flushing_Log.csv',
    type: 'Work Order',
    filename: 'WO_8891_Maintenance_Seal_Flushing_Log.csv',
    uploadedAt: '2026-07-19 18:04',
    extractedEntitiesCount: 22,
    status: 'Processed',
    fileSize: '1.2 MB',
    summary: 'Shift log records showing weekly barrier fluid pressure decline from 6.2 bar down to 4.9 bar over 72 hours.',
    rawSnippet: 'TIMESTAMP,TAG,PARAM,VALUE,UNIT,OPERATOR\n2026-07-19T08:00:00,P-101A,BARRIER_PRESS,5.4,BAR,R_SHARMA\n2026-07-19T16:00:00,P-101A,BARRIER_PRESS,5.1,BAR,R_SHARMA\n2026-07-20T00:00:00,P-101A,BARRIER_PRESS,4.9,BAR,A_KUMAR',
    keyEntities: [
      { type: 'Work Order', value: 'WO-2026-8891', confidence: 0.99 },
      { type: 'Parameter', value: 'Barrier Pressure Drop', confidence: 0.94 },
      { type: 'Delta', value: '-1.3 bar / 72h', confidence: 0.91 }
    ]
  }
];

export const PREBUILT_RAG_QA: RAGQueryResponse[] = [
  {
    id: 'rag-01',
    question: 'Why is pump P-101A showing a warning status and what OISD regulation applies to it?',
    answer: 'Pump **P-101A** (Heavy Crude Pump, Coke Oven Unit 4) is flagged with a **Warning/High Risk** status due to a recorded **barrier fluid pressure drop** (from 6.2 bar down to 4.9 bar over 72h recorded in `WO-2026-8891`) combined with an elevated bearing temperature of **84.5°C**.\n\nAccording to **OISD-STD-137 Clause 4.2.1**, all pumps handling Class-A hydrocarbons at temperatures >250°C must maintain dual mechanical seals with API Plan 53B pressurized barrier fluid systems. Operating below 5.0 bar breaches the mandatory pressure differential, creating a potential vapor lock and hot hydrocarbon leakage risk under **Factory Act 1948 Section 37**.',
    confidenceScore: 98.4,
    citations: [
      {
        title: 'OISD-STD-137 Section 4.2.1',
        docId: 'doc-002',
        section: '§4.2.1 Dual Seal Mandate',
        textSnippet: 'All pumps handling Class-A hydrocarbons at temperatures exceeding 250°C shall be equipped with dual mechanical seals having an independent pressurized barrier fluid system (API Plan 53B).'
      },
      {
        title: 'Work Order WO-2026-8891',
        docId: 'doc-003',
        section: 'Barrier Fluid Log',
        textSnippet: 'Weekly barrier fluid pressure decline from 6.2 bar down to 4.9 bar recorded at 2026-07-20T00:00:00.'
      },
      {
        title: 'Thermography Log TR-2026-0721',
        docId: 'doc-001',
        section: 'Drive End Scan',
        textSnippet: 'Infrared thermography scan reveals 12°C elevation (84.5°C vs 72.0°C threshold).'
      }
    ],
    graphNodesInvolved: ['node-p101a', 'node-wo8891', 'node-oisd137', 'node-factact48'],
    recommendedActions: [
      'Top up API Plan 53B barrier reservoir with Synthetic Hydrocarbon Fluid to restore 6.2 bar operating pressure.',
      'Schedule acoustic leak detection scan on inner seal faces during upcoming shift changeover.',
      'Verify automatic trip interlock ESDV-101 isolation response per OISD-137 audit protocol.'
    ]
  },
  {
    id: 'rag-02',
    question: 'What historical failure patterns exist for heavy crude pumps in Coke Oven Unit 4?',
    answer: 'Knowledge graph cross-referencing of historical incident reports reveals near-miss incident **INC-2025-049** (September 2025). The root cause was identified as thermal degradation of secondary O-ring elastomers when exposed to sustained temperatures >300°C combined with barrier pressure fluctuations under API Plan 53B.\n\nThe historical resolution required retrofitting Kalrez 6375 perfluoroelastomer seals as documented in **Sulzer Maintenance Manual DOC-OEM-SULZER-P100**.',
    confidenceScore: 96.1,
    citations: [
      {
        title: 'Near-Miss Report INC-2025-049',
        docId: 'doc-001',
        section: 'Root Cause Summary',
        textSnippet: 'Thermal stress on Secondary O-ring elastomer leading to barrier fluid loss.'
      },
      {
        title: 'Sulzer OEM Manual DOC-OEM-SULZER-P100',
        docId: 'doc-001',
        section: 'Section 8: High Temp Seals',
        textSnippet: 'For operation >300°C, Kalrez 6375 elastomer sets are required for secondary containment.'
      }
    ],
    graphNodesInvolved: ['node-p101a', 'node-inc2024-08', 'node-manual-p101'],
    recommendedActions: [
      'Cross-check current seal elastomer batch number against OEM Kalrez 6375 specification.',
      'Perform Root Cause Analysis (RCA) using historical failure timeline.'
    ]
  }
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule-01',
    code: 'OISD-137-4.2.1',
    standard: 'OISD-137',
    title: 'Dual Mechanical Seal Pressurization Integrity',
    clause: 'Section 4.2.1',
    mandatoryRequirement: 'Dual seal barrier fluid pressure must exceed process seal chamber pressure by minimum 1.5 bar at all times.',
    currentStatus: 'Non-Compliant',
    affectedAssetTag: 'P-101A',
    lastAudited: '2026-07-20',
    remediationPlan: 'Repressurize Plan 53B barrier fluid bladder and check bladder seal for N2 gas pre-charge loss.'
  },
  {
    id: 'rule-02',
    code: 'FACT-ACT-1948-S37',
    standard: 'Factory Act 1948',
    title: 'Precaution Against Explosive Fumes',
    clause: 'Section 37',
    mandatoryRequirement: 'Continuous gas detection & positive pressure ventilation in areas processing Class A hydrocarbon liquids > flash point.',
    currentStatus: 'Compliant',
    affectedAssetTag: 'P-101A / V-301',
    lastAudited: '2026-06-15'
  },
  {
    id: 'rule-03',
    code: 'PESO-RULE-2016-R14',
    standard: 'PESO Rules 2016',
    title: 'Pressure Vessel Hydrotest & Safety Relief',
    clause: 'Rule 14(2)',
    mandatoryRequirement: 'Pressure vessel V-301 relief valve PSV-301 set pressure must be recertified every 24 calendar months by accredited PESO inspector.',
    currentStatus: 'Compliant',
    affectedAssetTag: 'V-301',
    lastAudited: '2026-05-10'
  },
  {
    id: 'rule-04',
    code: 'ISO-55001-A6.2',
    standard: 'ISO 55001',
    title: 'Asset Predictive Failure Management',
    clause: 'Clause A.6.2',
    mandatoryRequirement: 'Critical asset risk profiles must update dynamically when vibration telemetry exceeds 2.5 mm/s RMS.',
    currentStatus: 'Pending Review',
    affectedAssetTag: 'P-101A',
    lastAudited: '2026-07-21'
  }
];
