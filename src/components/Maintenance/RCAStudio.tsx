'use client';

import React, { useState } from 'react';
import { EquipmentNode } from '@/data/mockKnowledgeBase';
import {
  Wrench,
  AlertTriangle,
  Activity,
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  Layers,
  FileCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface RCAStudioProps {
  nodes: EquipmentNode[];
}

export const RCAStudio: React.FC<RCAStudioProps> = ({ nodes }) => {
  const [selectedAssetTag, setSelectedAssetTag] = useState<string>('P-101A');
  const [workOrderCreated, setWorkOrderCreated] = useState(false);

  const selectedNode = nodes.find((n) => n.tag === selectedAssetTag) || nodes[0];

  // Predictive RUL Vibration & Temp Trajectory Data
  const degradationData = [
    { day: 'Jul 10', vibration: 1.2, temp: 68, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 12', vibration: 1.4, temp: 70, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 14', vibration: 1.7, temp: 73, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 16', vibration: 2.1, temp: 77, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 18', vibration: 2.5, temp: 81, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 20', vibration: 2.7, temp: 84.5, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 22 (Fcst)', vibration: 3.1, temp: 89, limitVib: 2.8, limitTemp: 75 },
    { day: 'Jul 24 (Fcst)', vibration: 3.6, temp: 95, limitVib: 2.8, limitTemp: 75 },
  ];

  // Fishbone Categories for Root Cause Analysis
  const fishboneCategories = [
    {
      category: 'Thermal Stress & Process',
      causes: [
        'Operating temp sustained at 310°C exceeding elastomer rating',
        'Thermal expansion of shaft causing mechanical seal gap mismatch'
      ]
    },
    {
      category: 'Barrier Fluid System (API Plan 53B)',
      causes: [
        'Accumulator N2 pre-charge pressure drop from 6.2 to 4.9 bar',
        'Barrier fluid degradation & minor viscosity loss'
      ]
    },
    {
      category: 'Material & Component Specs',
      causes: [
        'Secondary O-ring uses standard Viton instead of Kalrez 6375',
        'Historical repeat issue recorded in Incident INC-2025-049'
      ]
    },
    {
      category: 'Maintenance & Operations',
      causes: [
        'Shift changeover manual inspection missed 72h pressure drift',
        'Vibration sensor telemetry sample rate delayed to 4-hour intervals'
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono mb-2">
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span>Predictive Maintenance & Root Cause Analysis</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            AI Root Cause Analysis & RUL Degradation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated Ishikawa Fishbone root cause synthesis and Remaining Useful Life (RUL) degradation modeling for critical plant equipment.
          </p>
        </div>

        {/* Asset Tag Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Target Asset:</span>
          <select
            value={selectedAssetTag}
            onChange={(e) => setSelectedAssetTag(e.target.value)}
            className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="P-101A" className="bg-slate-900">P-101A (Heavy Crude Pump A)</option>
            <option value="V-301" className="bg-slate-900">V-301 (Flash Column Column)</option>
            <option value="DWG-HC-204-REV3" className="bg-slate-900">DWG-HC-204 (Feed Line System)</option>
          </select>
        </div>
      </div>

      {/* RUL Telemetry & Degradation Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RUL Stat Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">PREDICTED REMAINING USEFUL LIFE</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-mono text-amber-400">38.5 Hours</span>
              <span className="text-xs font-mono text-amber-300">Until Trip Limit</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Vibration FFT trajectory forecasts bearing limit breach of 2.8 mm/s RMS on July 22 at 14:30.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Current Vibration:</span>
              <span className="text-amber-400 font-bold">2.7 mm/s RMS</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Bearing Housing Temp:</span>
              <span className="text-amber-400 font-bold">84.5°C (Threshold 75°C)</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">API Plan 53B Pressure:</span>
              <span className="text-red-400 font-bold">4.9 bar (-1.3 bar drop)</span>
            </div>
          </div>

          <button
            onClick={() => setWorkOrderCreated(true)}
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
              workOrderCreated
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-500/30'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{workOrderCreated ? 'Work Order WO-2026-9042 Generated!' : 'Generate Auto Preventive Work Order'}</span>
          </button>
        </div>

        {/* Degradation Line Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Vibration Spectrum & Thermal Degradation Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Telemetry history & 48-hour forward AI forecast</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5" /> Temp (°C)
              </span>
              <span className="flex items-center text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" /> Vib (mm/s)
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={degradationData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={75} label="Temp Threshold 75°C" stroke="#ef4444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="temp" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} name="Temp °C" />
                <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} name="Vibration mm/s" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Ishikawa Fishbone Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">AI-Generated Ishikawa (Fishbone) Root Cause Diagram</h3>
              <p className="text-xs text-slate-400">Synthesized from P-101A work orders, OEM manual tolerances, and incident INC-2025-049</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Primary Root Cause: Secondary O-Ring Thermal Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fishboneCategories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-mono font-bold text-cyan-300">{cat.category}</h4>
              </div>

              <div className="space-y-1.5 pl-7">
                {cat.causes.map((cause, cIdx) => (
                  <div key={cIdx} className="text-xs text-slate-300 flex items-start space-x-1.5">
                    <span className="text-blue-400 font-mono">•</span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
