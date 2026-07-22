'use client';

import React, { useState } from 'react';
import { ComplianceRule } from '@/data/mockKnowledgeBase';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  BookOpen,
  Sparkles,
  FileText
} from 'lucide-react';

interface ComplianceStudioProps {
  rules: ComplianceRule[];
}

export const ComplianceStudio: React.FC<ComplianceStudioProps> = ({ rules }) => {
  const [downloading, setDownloading] = useState(false);
  const [filterStandard, setFilterStandard] = useState<string>('All');

  const filteredRules = rules.filter(
    (rule) => filterStandard === 'All' || rule.standard === filterStandard
  );

  const compliantCount = rules.filter((r) => r.currentStatus === 'Compliant').length;
  const nonCompliantCount = rules.filter((r) => r.currentStatus === 'Non-Compliant').length;

  const handleExportAuditPackage = () => {
    setDownloading(true);

    try {
      // Build Real Audit Package Content
      const auditDate = new Date().toISOString().split('T')[0];
      let content = `====================================================================\n`;
      content += `          AURA-8 STATUTORY AUDIT COMPLIANCE PACKAGE               \n`;
      content += `====================================================================\n`;
      content += `Generated Date: ${auditDate}\n`;
      content += `Authority: State Directorate of Industrial Safety & Health (DISH) / OISD\n`;
      content += `Plant Unit: Heavy Industrial Refining & Hydrocracker Facility\n`;
      content += `--------------------------------------------------------------------\n\n`;

      content += `SUMMARY AUDIT METRICS:\n`;
      content += `- Total Mandatory Clauses Audited: ${rules.length}\n`;
      content += `- Compliant Directives: ${compliantCount}\n`;
      content += `- Non-Compliant Gaps Flagged: ${nonCompliantCount}\n\n`;

      content += `--------------------------------------------------------------------\n`;
      content += `STATUTORY CLAUSE DETAILS & AUDIT EVIDENCE LOG:\n`;
      content += `--------------------------------------------------------------------\n\n`;

      rules.forEach((r, idx) => {
        content += `[${idx + 1}] REGULATORY CODE: ${r.code} (${r.standard})\n`;
        content += `    Title: ${r.title}\n`;
        content += `    Clause: ${r.clause} | Tag: ${r.affectedAssetTag}\n`;
        content += `    Status: ${r.currentStatus.toUpperCase()}\n`;
        content += `    Requirement: ${r.mandatoryRequirement}\n`;
        if (r.remediationPlan) {
          content += `    Remediation Required: ${r.remediationPlan}\n`;
        }
        content += `\n`;
      });

      content += `====================================================================\n`;
      content += `           END OF AUDIT COMPLIANCE EVIDENCE PACKAGE                 \n`;
      content += `====================================================================\n`;

      // Trigger REAL File Download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `OISD_FactoryAct_Compliance_Package_Q3_2026.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error generating download: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Quality & Statutory Compliance Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            OISD, Factory Act 1948 & PESO Regulatory Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous AI monitoring of plant operating procedures and equipment states against mandatory statutory codes.
          </p>
        </div>

        <button
          onClick={handleExportAuditPackage}
          disabled={downloading}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-rose-950/40"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Compiling Package...' : 'Download Real Audit Evidence Package'}</span>
        </button>
      </div>

      {/* Compliance Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block">TOTAL MANDATORY CLAUSES</span>
            <span className="text-2xl font-black font-mono text-white">{rules.length} Directives</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block">VERIFIED COMPLIANT</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{compliantCount} Passed</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block">NON-COMPLIANCE GAPS</span>
            <span className="text-2xl font-black font-mono text-rose-400">{nonCompliantCount} Non-Compliant</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs font-mono text-slate-400">Filter Standard:</span>
        {['All', 'OISD-137', 'Factory Act 1948', 'PESO Rules 2016', 'ISO 55001'].map((std) => (
          <button
            key={std}
            onClick={() => setFilterStandard(std)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              filterStandard === std
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {std}
          </button>
        ))}
      </div>

      {/* Regulatory Rule Cards List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all ${
              rule.currentStatus === 'Non-Compliant'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {rule.code}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{rule.clause}</span>
                  <span className="text-xs font-mono text-slate-500">| Tag: {rule.affectedAssetTag}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">{rule.title}</h3>
              </div>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                  rule.currentStatus === 'Compliant'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : rule.currentStatus === 'Non-Compliant'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                {rule.currentStatus === 'Compliant' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                )}
                {rule.currentStatus}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Mandatory Requirement</span>
              {rule.mandatoryRequirement}
            </div>

            {rule.remediationPlan && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-200">
                <span className="font-bold text-rose-300">⚠ Corrective Remediation Required:</span> {rule.remediationPlan}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
