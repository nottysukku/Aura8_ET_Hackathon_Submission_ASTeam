'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Upload,
  Home
} from 'lucide-react';

export interface HeaderProps {
  onSearch: (query: string) => void;
  activeUnit: string;
  setActiveUnit: (unit: string) => void;
  warningCount: number;
  selectedMode?: 'clean' | 'demo' | null;
  onSwitchMode?: (mode: 'clean' | 'demo' | 'gateway') => void;
  apiKey?: string;
  setApiKey?: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  activeUnit,
  setActiveUnit,
  warningCount,
  selectedMode,
  onSwitchMode
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleModeChange = async (mode: 'clean' | 'demo' | 'gateway') => {
    if (!onSwitchMode) return;
    setLoading(true);
    try {
      if (mode === 'demo') {
        await fetch('/api/mode/demo', { method: 'POST' }).catch(() => {});
      } else if (mode === 'clean') {
        await fetch('/api/mode/reset', { method: 'POST' }).catch(() => {});
      }
      onSwitchMode(mode);
    } catch (e) {
      console.log('Mode toggle notice:', e);
      onSwitchMode(mode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Global Search Console */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search equipment tags (P-101A, V-301), OISD rules, or operational procedures..."
            className="w-full bg-slate-900/90 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
          />
        </form>

        {/* Global Mode Switcher & Navigation Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {/* Mode Switcher Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleModeChange('demo')}
              disabled={loading}
              title="Load Guest Demo Mode with sample hydrocracker data"
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                selectedMode === 'demo'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Guest Demo</span>
            </button>

            <button
              onClick={() => handleModeChange('clean')}
              disabled={loading}
              title="Start Clean Workspace with 0 data clutter"
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                selectedMode === 'clean'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Clean Start</span>
            </button>

            <button
              onClick={() => handleModeChange('gateway')}
              disabled={loading}
              title="Return to Gateway Landing Page"
              className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plant Unit Selector */}
          <select
            value={activeUnit}
            onChange={(e) => setActiveUnit(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none text-xs hidden sm:block"
          >
            <option value="All Units">Plant-Wide Overview</option>
            <option value="Coke Oven Unit 4">Coke Oven Unit 4</option>
            <option value="Hydrocracker Unit">Hydrocracker Unit</option>
            <option value="Offsites & Utilities">Offsites & Utilities</option>
          </select>

          {/* Warning Badge */}
          {warningCount > 0 ? (
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-bold">{warningCount} Warning</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Normal</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
