'use client';

import React from 'react';
import {
  EquipmentNode,
  IngestedDocument,
  ComplianceRule
} from '@/data/mockKnowledgeBase';
import {
  FileText,
  Network,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Bot,
  FileUp,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface OverviewTabProps {
  nodes: EquipmentNode[];
  documents: IngestedDocument[];
  complianceRules: ComplianceRule[];
  onNavigate: (tab: 'graph' | 'ingestion' | 'copilot' | 'rca' | 'compliance') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  nodes,
  documents,
  complianceRules,
  onNavigate
}) => {
  const warningCount = nodes.filter((n) => n.status === 'Warning' || n.status === 'Critical').length;
  const compliantCount = complianceRules.filter((r) => r.currentStatus === 'Compliant').length;
  const complianceRate = Math.round((compliantCount / complianceRules.length) * 100);

  // Distribution chart data
  const categoryData = [
    { name: 'Equipment', value: nodes.filter((n) => n.category === 'Equipment').length, color: '#06b6d4' },
    { name: 'P&IDs', value: nodes.filter((n) => n.category === 'Drawing').length, color: '#3b82f6' },
    { name: 'OEM Manuals', value: nodes.filter((n) => n.category === 'Manual').length, color: '#8b5cf6' },
    { name: 'Work Orders', value: nodes.filter((n) => n.category === 'WorkOrder').length, color: '#f59e0b' },
    { name: 'OISD Directives', value: nodes.filter((n) => n.category === 'Regulation').length, color: '#ec4899' },
  ];

  const monthlyIngestionData = [
    { month: 'Feb', docs: 120, entities: 840 },
    { month: 'Mar', docs: 210, entities: 1450 },
    { month: 'Apr', docs: 340, entities: 2200 },
    { month: 'May', docs: 510, entities: 3600 },
    { month: 'Jun', docs: 780, entities: 5100 },
    { month: 'Jul', docs: 1140, entities: 7890 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/80 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Plant Knowledge Brain Connected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Industrial Asset & Operations Intelligence
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Unifying P&ID engineering drawings, OEM manuals, work orders, thermography logs, and statutory OISD / Factory Act standards into a single queryable Neural Graph.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('copilot')}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>Launch RAG Copilot</span>
            </button>
            <button
              onClick={() => onNavigate('ingestion')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <FileUp className="w-4 h-4 text-cyan-400" />
              <span>Ingest P&ID / SOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Knowledge Nodes */}
        <div
          onClick={() => onNavigate('graph')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">GRAPH ENTITIES</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-white tracking-tight">{nodes.length}</h3>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              +12 this week <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Linked Equipment, Manuals, & Directives
          </p>
        </div>

        {/* Ingested Documents */}
        <div
          onClick={() => onNavigate('ingestion')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">INGESTED CORPUS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-white tracking-tight">{documents.length} Docs</h3>
            <span className="text-xs font-mono text-purple-400 flex items-center">
              14.2K Entities <TrendingUp className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            P&IDs, Shift Logs, OEM Manuals
          </p>
        </div>

        {/* OISD & Factory Act Compliance */}
        <div
          onClick={() => onNavigate('compliance')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">STATUTORY AUDIT SCORE</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-white tracking-tight">{complianceRate}%</h3>
            <span className="text-xs font-mono text-emerald-400">OISD-137 Verified</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${complianceRate}%` }} />
          </div>
        </div>

        {/* Active Asset Warnings */}
        <div
          onClick={() => onNavigate('rca')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">HIGH-RISK ASSETS</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-black font-mono text-amber-400 tracking-tight">{warningCount} Assets</h3>
            <span className="text-xs font-mono text-amber-300 font-semibold animate-pulse">Action Needed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tag P-101A Barrier Pressure Drop
          </p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Entity Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Knowledge Graph Distribution</span>
                </h3>
                <p className="text-xs text-slate-400">Categories of ingested node entities</p>
              </div>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-400 font-mono text-[11px]">{cat.name}:</span>
                <span className="font-bold text-white font-mono">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ingestion Velocity & Extraction Growth */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Knowledge Graph Expansion Velocity</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly ingested documents & extracted semantic entities</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Atlas Vector Indexing Active
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIngestionData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="entities" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Extracted Entities" />
                <Bar dataKey="docs" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Uploaded Docs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Plant Incident & Maintenance Ticker */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Live Knowledge Graph Telemetry Stream</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Real-Time Ingestion Logs</span>
        </div>

        <div className="space-y-2.5">
          {nodes.slice(0, 4).map((node) => (
            <div
              key={node.id}
              onClick={() => onNavigate('graph')}
              className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.status === 'Warning' ? 'bg-amber-400 animate-ping' : node.status === 'Maintenance' ? 'bg-blue-400' : 'bg-emerald-400'
                  }`}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{node.tag}</span>
                    <span className="text-xs text-slate-200 font-medium">{node.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{node.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <span className="text-[10px] font-mono text-slate-500">{node.plantUnit}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                    node.status === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
