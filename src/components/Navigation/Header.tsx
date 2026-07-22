'use client';

import React, { useState } from 'react';
import {
  Search,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeUnit: string;
  setActiveUnit: (unit: string) => void;
  warningCount: number;
  apiKey?: string;
  setApiKey?: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  activeUnit,
  setActiveUnit,
  warningCount
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Global Search Console */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search equipment tags (P-101A, V-301), OISD rules, or operational procedures..."
            className="w-full bg-slate-900/90 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
          />
        </form>

        {/* Status Indicators & Navigation Controls */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          {/* Unit Selector */}
          <select
            value={activeUnit}
            onChange={(e) => setActiveUnit(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none text-xs"
          >
            <option value="All Units">Plant-Wide Overview</option>
            <option value="Coke Oven Unit 4">Coke Oven Unit 4</option>
            <option value="Hydrocracker Unit">Hydrocracker Unit</option>
            <option value="Offsites & Utilities">Offsites & Utilities</option>
          </select>

          {/* Plant Risk Warning Badge */}
          {warningCount > 0 ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-bold">{warningCount} Warnings Flagged</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plant Normal</span>
            </div>
          )}

          {/* RAG Engine Active Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gemini RAG Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
