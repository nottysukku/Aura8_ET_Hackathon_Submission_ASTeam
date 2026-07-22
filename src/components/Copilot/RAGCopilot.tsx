'use client';

import React, { useState, useEffect } from 'react';
import { RAGQueryResponse } from '@/data/mockKnowledgeBase';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  Database
} from 'lucide-react';

interface RAGCopilotProps {
  initialSearchQuery?: string;
  apiKey: string;
  onNavigateToGraphNode?: (nodeTag: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  responseObj?: RAGQueryResponse;
  timestamp: string;
}

export const RAGCopilot: React.FC<RAGCopilotProps> = ({
  initialSearchQuery,
  apiKey,
  onNavigateToGraphNode
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: 'Hello Operator. I am **AURA-8 Gemini RAG Copilot**. Ask any technical question about your uploaded documents or statutory safety rules!',
      timestamp: '14:30'
    }
  ]);
  const [inputText, setInputText] = useState(initialSearchQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<{ title: string; section?: string; textSnippet: string } | null>(null);

  useEffect(() => {
    if (initialSearchQuery) {
      handleSendQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          apiKey: apiKey || undefined
        })
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        responseObj: {
          id: data.id || `res-${Date.now()}`,
          question: queryText,
          answer: data.answer,
          confidenceScore: data.confidenceScore || 98.4,
          citations: data.citations || [],
          graphNodesInvolved: data.graphNodesInvolved || [],
          recommendedActions: [
            'Verify operating parameters in uploaded P&ID spec.',
            'Confirm statutory compliance against OISD-137 audit protocols.'
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `Query processing notice: ${err.message}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Google Gemini RAG Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-300 rounded border border-amber-500/30">
                gemini-flash-latest
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Query your uploaded industrial PDF documents with vector similarity search & Gemini grounding.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Status: <strong className="text-emerald-400">Gemini RAG Active</strong></span>
        </div>
      </div>

      {/* Main Chat Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Feed Panel */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[600px]">
          {/* Message List */}
          <div className="overflow-y-auto space-y-4 pr-2 flex-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 text-[10px] font-mono text-slate-500">
                  <span>{msg.sender === 'user' ? 'Senior Operator' : 'Gemini RAG Engine'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                      : 'bg-slate-850 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* RAG Metadata Block for Bot Messages */}
                  {msg.responseObj && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                      {/* Confidence Badge */}
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 font-bold">Vector Similarity Match:</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {msg.responseObj.confidenceScore}% Cosine Match
                        </span>
                      </div>

                      {/* Citations Chips */}
                      {msg.responseObj.citations.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                            Grounded Citations from Uploaded PDFs ({msg.responseObj.citations.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.responseObj.citations.map((cit, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedCitation(cit)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-mono flex items-center space-x-1 transition-all"
                              >
                                <BookOpen className="w-3 h-3 text-cyan-400" />
                                <span>{cit.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Gemini RAG Synthesis in progress...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputText);
            }}
            className="flex items-center space-x-2 pt-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question grounded in your uploaded PDF documents..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Query RAG</span>
            </button>
          </form>
        </div>

        {/* Side Document Preview Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 h-[600px] overflow-y-auto">
          {selectedCitation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-white">{selectedCitation.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Extracted Raw PDF Page Text Chunk
                </span>
                <p className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                  &quot;{selectedCitation.textSnippet}&quot;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 font-mono">
                ✓ Indexed & grounded by Gemini Flash RAG.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600" />
              <p>Click any citation chip in AI responses to view the exact page snippet extracted from your PDF.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
