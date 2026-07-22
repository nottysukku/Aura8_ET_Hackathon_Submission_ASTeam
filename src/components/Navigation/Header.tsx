'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Factory, ShieldAlert, Sparkles, Key, Check, Database } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeUnit: string;
  setActiveUnit: (unit: string) => void;
  warningCount: number;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  activeUnit,
  setActiveUnit,
  warningCount,
  apiKey,
  setApiKey
}) => {
  const [query, setQuery] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSaveKey = () => {
    setApiKey(tempKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', tempKey);
    }
    setShowKeyModal(false);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Global AI Natural Language Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask NotebookLM RAG or search uploaded documents..."
            className="w-full pl-10 pr-24 py-2 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="submit"
              className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-mono font-semibold flex items-center space-x-1 transition-all"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Query RAG</span>
            </button>
          </div>
        </div>
      </form>

      {/* Controls & Telemetry */}
      <div className="flex items-center space-x-4">
        {/* Python FastAPI Backend Status */}
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-emerald-300">
            FastAPI RAG Live (:8000)
          </span>
        </div>

        {/* Gemini API Key Config Button */}
        <button
          onClick={() => setShowKeyModal(true)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
            apiKey
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>{apiKey ? 'Gemini Key Configured' : 'Add Gemini API Key'}</span>
        </button>

        {/* Plant Unit Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Factory className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={activeUnit}
            onChange={(e) => setActiveUnit(e.target.value)}
            className="bg-transparent text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All Units" className="bg-slate-900 text-slate-200">All Plant Units</option>
            <option value="Coke Oven Unit 4" className="bg-slate-900 text-slate-200">Coke Oven Unit 4</option>
            <option value="Hydrocracker Unit 2" className="bg-slate-900 text-slate-200">Hydrocracker Unit 2</option>
          </select>
        </div>
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-mono">Configure Google Gemini API Key</h3>
            </div>
            <p className="text-xs text-slate-400">
              Enter your Gemini API key to enable real multi-step LLM reasoning & grounding against your uploaded PDF files.
            </p>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500/50"
            />
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs font-mono flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
