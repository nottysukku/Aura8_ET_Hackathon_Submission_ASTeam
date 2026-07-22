'use client';

import React, { useState, useEffect } from 'react';
import { GatewayLanding } from '@/components/Gateway/GatewayLanding';
import { FloatingChatbot } from '@/components/Navigation/FloatingChatbot';
import { Sidebar, TabType } from '@/components/Navigation/Sidebar';
import { Header } from '@/components/Navigation/Header';
import { OverviewTab } from '@/components/Dashboard/OverviewTab';
import { GraphVisualizer } from '@/components/KnowledgeGraph/GraphVisualizer';
import { DocumentIngester } from '@/components/Ingestion/DocumentIngester';
import { RAGCopilot } from '@/components/Copilot/RAGCopilot';
import { RCAStudio } from '@/components/Maintenance/RCAStudio';
import { ComplianceStudio } from '@/components/Compliance/ComplianceStudio';

import {
  EquipmentNode,
  IngestedDocument,
  COMPLIANCE_RULES,
  INITIAL_KNOWLEDGE_NODES,
  MOCK_INGESTED_DOCUMENTS
} from '@/data/mockKnowledgeBase';

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<'clean' | 'demo' | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeUnit, setActiveUnit] = useState<string>('All Units');
  const [apiKey, setApiKey] = useState<string>('');

  const [nodes, setNodes] = useState<EquipmentNode[]>([]);
  const [documents, setDocuments] = useState<IngestedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('GEMINI_API_KEY');
      if (savedKey) setApiKey(savedKey);
    }
  }, []);

  const handleSelectMode = (mode: 'clean' | 'demo' | 'gateway') => {
    if (mode === 'gateway') {
      setSelectedMode(null);
      setNodes([]);
      setDocuments([]);
      return;
    }

    setSelectedMode(mode);

    if (mode === 'clean') {
      setNodes([]);
      setDocuments([]);
      setActiveTab('ingestion');
    } else {
      setNodes(INITIAL_KNOWLEDGE_NODES);
      setDocuments(MOCK_INGESTED_DOCUMENTS);
      setActiveTab('dashboard');
    }
  };

  const warningCount = nodes.filter((n) => n.status === 'Warning' || n.status === 'Critical').length;

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('copilot');
  };

  const handleDocumentAdded = (newDoc: IngestedDocument, newNodes?: EquipmentNode[]) => {
    setDocuments((prev) => [newDoc, ...prev]);
    if (newNodes && newNodes.length > 0) {
      setNodes((prev) => [...newNodes, ...prev]);
    }
    setActiveTab('graph');
  };

  const handleSelectNodeForRAG = (nodeTag: string) => {
    setSearchQuery(`What technical specifications and compliance rules apply to ${nodeTag}?`);
    setActiveTab('copilot');
  };

  // Render Gateway Landing Page if mode is not selected
  if (!selectedMode) {
    return <GatewayLanding onSelectMode={(m) => handleSelectMode(m)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        knowledgeNodeCount={nodes.length}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onSearch={handleGlobalSearch}
          activeUnit={activeUnit}
          setActiveUnit={setActiveUnit}
          warningCount={warningCount}
          selectedMode={selectedMode}
          onSwitchMode={handleSelectMode}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950/40">
          {activeTab === 'dashboard' && (
            <OverviewTab
              nodes={nodes}
              documents={documents}
              complianceRules={COMPLIANCE_RULES}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'graph' && (
            <GraphVisualizer
              nodes={nodes}
              onSelectNodeForRAG={handleSelectNodeForRAG}
            />
          )}

          {activeTab === 'ingestion' && (
            <DocumentIngester
              documents={documents}
              onDocumentAdded={handleDocumentAdded}
            />
          )}

          {activeTab === 'copilot' && (
            <RAGCopilot
              initialSearchQuery={searchQuery}
              apiKey={apiKey}
              onNavigateToGraphNode={(nodeTag) => setActiveTab('graph')}
            />
          )}

          {activeTab === 'rca' && (
            <RCAStudio nodes={nodes} />
          )}

          {activeTab === 'compliance' && (
            <ComplianceStudio rules={COMPLIANCE_RULES} />
          )}
        </main>
      </div>

      {/* Persistent Floating AI Chatbot Assistant across ALL pages */}
      <FloatingChatbot apiKey={apiKey} />
    </div>
  );
}
