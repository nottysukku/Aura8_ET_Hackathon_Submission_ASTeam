'use client';

import React, { useState } from 'react';
import { Zap, Upload, Sparkles, UserCheck, ShieldCheck, Cpu, ArrowRight, Layers, FileText } from 'lucide-react';

interface GatewayLandingProps {
  onSelectMode: (mode: 'clean' | 'demo') => void;
}

export const GatewayLanding: React.FC<GatewayLandingProps> = ({ onSelectMode }) => {
  const [loadingMode, setLoadingMode] = useState<'clean' | 'demo' | null>(null);

  const handleSelect = async (mode: 'clean' | 'demo') => {
    setLoadingMode(mode);
    try {
      if (mode === 'demo') {
        await fetch('http://127.0.0.1:8000/api/mode/demo', { method: 'POST' });
      } else {
        await fetch('http://127.0.0.1:8000/api/mode/reset', { method: 'POST' });
      }
    } catch (err) {
      console.log('Mode setup notification:', err);
    } finally {
      onSelectMode(mode);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white font-mono">AURA-8</span>
            <p className="text-[11px] text-slate-400 font-medium">Unified Asset & Operations Brain</p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Gemini Flash RAG</span>
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full text-center py-12 relative z-10 space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono shadow-xl">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>ET AI Hackathon 2.0 • Problem Statement 8</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Industrial Asset & Operations <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Intelligence Platform
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ingest heterogeneous industrial documents—P&IDs, maintenance records, inspection reports, and statutory OISD/Factory Act regulations—into a queryable visual Knowledge Graph.
        </p>

        {/* Choice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-left">
          {/* Card 1: Clean Upload Mode */}
          <div
            onClick={() => handleSelect('clean')}
            className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-2xl hover:shadow-cyan-950/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Start Clean Workspace
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zero pre-loaded data. Upload your own industrial PDF/TXT document to extract text, chunk vectors, and build a file-driven Knowledge Graph.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
              <span>{loadingMode === 'clean' ? 'Initializing Clean State...' : 'Upload & Parse PDF'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Guest Demo Mode */}
          <div
            onClick={() => handleSelect('demo')}
            className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-2xl hover:shadow-purple-950/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Login as Guest (Demo Mode)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pre-loaded with sample refinery hydrocracker data (`P-101A` pump, `V-301` column, OISD-137 compliance) for instant jury evaluation.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-400 font-semibold">
              <span>{loadingMode === 'demo' ? 'Loading Sample Refinery Data...' : 'Explore Demo Workspace'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs font-mono text-slate-500 py-4 border-t border-slate-800/80">
        ET AI Hackathon 2.0 • Problem 8 Solution • Powered by Google Gemini Flash
      </div>
    </div>
  );
};
