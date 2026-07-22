'use client';

import React from 'react';
import {
  LayoutDashboard,
  Network,
  FileSearch,
  Bot,
  Wrench,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Database
} from 'lucide-react';

export type TabType = 'dashboard' | 'graph' | 'ingestion' | 'copilot' | 'rca' | 'compliance';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  knowledgeNodeCount: number;
  documentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  knowledgeNodeCount,
  documentCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Brain Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'graph' as TabType,
      label: 'Knowledge Graph',
      icon: Network,
      badge: `${knowledgeNodeCount} Nodes`,
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'ingestion' as TabType,
      label: 'Universal Ingestion',
      icon: FileSearch,
      badge: `${documentCount} Docs`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'copilot' as TabType,
      label: 'Expert RAG Copilot',
      icon: Bot,
      badge: 'AI v3.5',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'rca' as TabType,
      label: 'Maintenance & RCA',
      icon: Wrench,
      badge: 'Predictive',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'compliance' as TabType,
      label: 'Statutory Audit',
      icon: ShieldCheck,
      badge: 'OISD/Act',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    }
  ];

  return (
    <aside className="w-72 bg-[#0d131f]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b0f17] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  AURA-8
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Unified Operations Brain
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            CORE PLATFORM MODULES
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive ? 'text-cyan-400 transform translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vector Store Status Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono font-medium text-slate-300">
              Atlas Vector Engine
            </span>
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            HEALTHY
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Graph Vector Index</span>
            <span className="text-slate-200">99.8% Match</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[99.8%]" />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Refinery Unit 4</span>
          </span>
          <span className="font-mono text-slate-400">OISD Standard</span>
        </div>
      </div>
    </aside>
  );
};
