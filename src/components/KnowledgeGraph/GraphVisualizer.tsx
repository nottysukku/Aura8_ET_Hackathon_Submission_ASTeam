'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EquipmentNode } from '@/data/mockKnowledgeBase';
import {
  Network,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ExternalLink,
  ShieldAlert,
  FileText,
  Wrench,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';

interface GraphVisualizerProps {
  nodes: EquipmentNode[];
  onSelectNodeForRAG?: (tag: string) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  onSelectNodeForRAG
}) => {
  const [selectedNode, setSelectedNode] = useState<EquipmentNode | null>(nodes[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Category Colors
  const CATEGORY_COLORS: Record<string, { fill: string; border: string; glow: string }> = {
    Equipment: { fill: '#06b6d4', border: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' },
    Drawing: { fill: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
    Manual: { fill: '#8b5cf6', border: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' },
    WorkOrder: { fill: '#f59e0b', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' },
    Regulation: { fill: '#ec4899', border: '#f472b6', glow: 'rgba(236, 72, 153, 0.4)' },
    Incident: { fill: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' }
  };

  const filteredNodes = nodes.filter((node) => {
    if (categoryFilter !== 'All' && node.category !== categoryFilter) return false;
    if (riskFilter !== 'All' && node.riskLevel !== riskFilter) return false;
    return true;
  });

  // Calculate Node Positions on 2D Plane
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  useEffect(() => {
    const width = 800;
    const height = 550;
    const center = { x: width / 2, y: height / 2 };

    // Initialize circular / physics position layout
    nodes.forEach((node, index) => {
      if (!nodePositions.current.has(node.id)) {
        const angle = (index / nodes.length) * Math.PI * 2;
        const radius = 180 + (index % 2) * 50;
        nodePositions.current.set(node.id, {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          vx: 0,
          vy: 0
        });
      }
    });
  }, [nodes]);

  // Render Canvas Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(zoomLevel, zoomLevel);

      // Draw Connection Lines
      filteredNodes.forEach((node) => {
        const posA = nodePositions.current.get(node.id);
        if (!posA) return;

        node.connections.forEach((targetId) => {
          const targetNode = filteredNodes.find((n) => n.id === targetId);
          if (!targetNode) return;
          const posB = nodePositions.current.get(targetId);
          if (!posB) return;

          const isSelectedLink = selectedNode && (selectedNode.id === node.id || selectedNode.id === targetId);

          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.strokeStyle = isSelectedLink ? 'rgba(34, 211, 238, 0.8)' : 'rgba(51, 65, 85, 0.4)';
          ctx.lineWidth = isSelectedLink ? 2.5 : 1;
          if (isSelectedLink) {
            ctx.setLineDash([5, 5]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
        });
      });

      // Draw Nodes
      filteredNodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        const isSelected = selectedNode?.id === node.id;
        const colors = CATEGORY_COLORS[node.category] || { fill: '#64748b', border: '#94a3b8', glow: 'rgba(100, 116, 139, 0.4)' };

        // Node Glow
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
          ctx.fillStyle = colors.glow;
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 20 : 16, 0, Math.PI * 2);
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeStyle = colors.border;
        ctx.stroke();

        // Node Tag Label
        ctx.font = isSelected ? 'bold 11px monospace' : '10px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(node.tag, pos.x, pos.y + (isSelected ? 34 : 30));

        // Risk Warning Indicator
        if (node.status === 'Warning' || node.status === 'Critical') {
          ctx.beginPath();
          ctx.arc(pos.x + 12, pos.y - 12, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [filteredNodes, selectedNode, zoomLevel]);

  // Click Handler on Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomLevel;
    const clickY = (e.clientY - rect.top) / zoomLevel;

    for (const node of filteredNodes) {
      const pos = nodePositions.current.get(node.id);
      if (pos) {
        const dx = clickX - pos.x;
        const dy = clickY - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 22) {
          setSelectedNode(node);
          return;
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Interactive Industrial Knowledge Graph</span>
          </h2>
          <p className="text-xs text-slate-400">
            Click nodes to inspect interconnections between Equipment Tags, P&ID CADs, Work Orders, and OISD Safety Directives.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Equipment" className="bg-slate-900">Equipment</option>
              <option value="Drawing" className="bg-slate-900">P&ID Drawing</option>
              <option value="Manual" className="bg-slate-900">OEM Manual</option>
              <option value="WorkOrder" className="bg-slate-900">Work Order</option>
              <option value="Regulation" className="bg-slate-900">OISD / Regulation</option>
              <option value="Incident" className="bg-slate-900">Near-Miss Incident</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Risks</option>
              <option value="High" className="bg-slate-900">High Risk</option>
              <option value="Critical" className="bg-slate-900">Critical</option>
              <option value="Low" className="bg-slate-900">Low Risk</option>
            </select>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center space-x-1 bg-slate-800/90 border border-slate-700/80 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Visualizer Panel */}
        <div className="lg:col-span-2 relative bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[580px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={550}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
          />

          {/* Category Legend */}
          <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md space-y-1.5 text-xs font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">LEGEND</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-300 text-[11px]">Equipment</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-300 text-[11px]">P&ID Drawing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-300 text-[11px]">OEM Manual</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300 text-[11px]">Work Order</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span className="text-slate-300 text-[11px]">OISD Clause</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-300 text-[11px]">Incident</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[580px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-5">
              {/* Node Title & Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {selectedNode.tag}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                      selectedNode.status === 'Warning'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">{selectedNode.plantUnit}</p>
              </div>

              {/* Description */}
              <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Technical Attributes</span>
                </h4>
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                  {Object.entries(selectedNode.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-cyan-300 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Knowledge Graph Entities */}
              <div>
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Linked Graph Neighbors ({selectedNode.connections.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((connId) => {
                    const connNode = nodes.find((n) => n.id === connId);
                    if (!connNode) return null;
                    return (
                      <div
                        key={connId}
                        onClick={() => setSelectedNode(connNode)}
                        className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-cyan-300">{connNode.tag}</span>
                          <span className="text-xs text-slate-300 line-clamp-1">{connNode.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Action Button for RAG */}
              {onSelectNodeForRAG && (
                <button
                  onClick={() => onSelectNodeForRAG(selectedNode.tag)}
                  className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Query AI Copilot on {selectedNode.tag}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <Network className="w-8 h-8 mb-2 text-slate-600" />
              <span>Select any node on the graph canvas to inspect attributes.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
