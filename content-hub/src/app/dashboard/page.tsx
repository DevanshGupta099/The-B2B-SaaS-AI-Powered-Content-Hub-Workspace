"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckSquare, 
  MoreHorizontal, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Copy,
  Download,
  Printer,
  CheckCircle2
} from "lucide-react";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import Link from "next/link";
import { motion } from "framer-motion";

interface WorkspaceItem {
  id: string;
  name: string;
  desc: string;
  docsCount: number;
  users: Array<{ id: string; name: string; avatarUrl: string }>;
}

interface ExecutiveReportData {
  title: string;
  period: string;
  executiveSummary: string;
  metrics: {
    velocityScore: number;
    brandCompliance: string;
    activeDocuments: number;
    tokenEfficiency: string;
    projectedPipeline: string;
  };
  contentVelocityInsights: string[];
  brandRiskAssessment: string;
  strategicNextSteps: string[];
}

export default function DashboardPage() {
  const { addToast } = useToast();
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([
    { id: "1", name: "Project Apollo", desc: "Core infrastructure rewrite & AI engine integration", docsCount: 15, users: [{id: "u1", name: "Sarah Connor", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}, {id: "u2", name: "Devansh", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}] },
    { id: "2", name: "Brand Refresh", desc: "Marketing assets, design tokens, and voice governance", docsCount: 8, users: [{id: "u3", name: "Michael Scott", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}] },
    { id: "3", name: "Q4 Roadmap", desc: "Enterprise compliance, autonomous agents, and RAG search", docsCount: 3, users: [{id: "u1", name: "Sarah Connor", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}, {id: "u2", name: "Devansh", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}] },
  ]);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ExecutiveReportData | null>(null);
  const [reportMarkdown, setReportMarkdown] = useState<string>("");

  // Seed / load workspaces dynamically from backend
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch("/api/workspaces");
        if (res.ok) {
          const data = await res.json();
          if (data.workspaces && Array.isArray(data.workspaces) && data.workspaces.length > 0) {
            setWorkspaces(data.workspaces.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn("Using fallback local workspaces:", err);
      }
    }
    loadBackendData();
  }, []);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    addToast({
      title: "Synthesizing Executive Report",
      message: "Orchestrating workspace metrics via Groq Qwen 3.8-27b...",
      type: "info"
    });

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusArea: "Enterprise Q4 Content Throughput & Governance" })
      });

      if (!res.ok) throw new Error(`Report generation failed (${res.status})`);
      const data = await res.json();

      setReportData(data.report);
      setReportMarkdown(data.markdown);
      setReportModalOpen(true);
      addToast({
        title: "Executive Report Generated!",
        message: `Intelligence synthesized in ${data.latencyMs ?? 420}ms.`,
        type: "success"
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate report";
      addToast({ title: "Report Error", message, type: "error" });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const copyReportMarkdown = () => {
    if (!reportMarkdown) return;
    navigator.clipboard.writeText(reportMarkdown);
    addToast({
      title: "Copied to Clipboard",
      message: "Executive Markdown briefing copied successfully.",
      type: "success"
    });
  };

  const metrics = [
    { label: "Active Documents", value: "24", icon: FileText, color: "text-white", bg: "bg-slate-900", border: "border-slate-800" },
    { label: "AI Tokens Used", value: "85.2k", icon: Sparkles, color: "text-white", bg: "bg-indigo-600", border: "border-indigo-500" },
    { label: "Pending Tasks", value: "12", icon: CheckSquare, color: "text-slate-900", bg: "bg-white", border: "border-slate-200" }
  ];

  const recentActivity = [
    { id: 1, user: "Sarah Connor", action: "edited", document: "Q4 Marketing Strategy", time: "2 mins ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { id: 2, user: "Devansh", action: "commented on", document: "Project Apollo RFC", time: "1 hour ago", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    { id: 3, user: "Michael Scott", action: "approved", document: "Nexus Brand Identity v2.4", time: "3 hours ago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Governed Workspace
              </span>
              <span className="text-slate-400 text-xs">· Node 01 (US-East)</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5">
              Workspace Overview
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Live intelligence, active documents, and enterprise governance telemetry.
            </p>
          </div>
          
          <Button
            onClick={handleGenerateReport}
            isLoading={isGeneratingReport}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {isGeneratingReport ? "Synthesizing Report..." : "Generate Report"}
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className={`p-6 rounded-3xl shadow-xs border ${m.border} ${m.bg} flex flex-col gap-4 relative overflow-hidden`}
            >
              {i === 1 && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-400 rounded-full blur-3xl opacity-40 pointer-events-none" />
              )}
              <div className="flex justify-between items-start z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-sm border border-white/20`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <button className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${m.color}`}>
                  <MoreHorizontal className="w-5 h-5 opacity-70" />
                </button>
              </div>
              <div className="z-10 mt-2">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${m.bg === 'bg-white' ? 'text-slate-500' : 'text-white/80'}`}>{m.label}</p>
                <h3 className={`font-heading text-4xl font-bold tracking-tight ${m.bg === 'bg-white' ? 'text-slate-900' : 'text-white'}`}>{m.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Section: Workspaces + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pinned Workspaces (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">Pinned Workspaces</h2>
                <p className="text-xs text-slate-500">Fast access to active collaborative sprint workspaces</p>
              </div>
              <Link href="/dashboard/workspaces" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {workspaces.map((ws, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={ws.id}
                >
                  <Link 
                    href={`/workspace/${ws.id}`} 
                    className="block bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90 hover:shadow-md hover:border-indigo-300 transition-all group h-full flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {ws.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {ws.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" /> {ws.docsCount ?? 12} docs
                      </div>
                      <AvatarGroup users={ws.users} maxCount={3} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline (1 col) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">Audit Activity</h2>
                <p className="text-xs text-slate-500">Real-time team collaboration ledger</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-6">
              <div className="space-y-6">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-3.5 items-start">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute top-9 left-4 bottom-[-24px] w-px bg-slate-200"></div>
                    )}
                    <img 
                      src={activity.avatar} 
                      alt={activity.user} 
                      className="w-8 h-8 rounded-full border border-slate-200 shadow-2xs shrink-0 z-10 bg-white object-cover" 
                    />
                    <div className="text-xs">
                      <p className="text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900">{activity.user}</span> {activity.action}{" "}
                        <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
                          {activity.document}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Executive Report Modal */}
      {reportData && (
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title={reportData.title}
          description={`Period: ${reportData.period} · Orchestrated by Nexus Content OS`}
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 text-slate-700 text-xs">
            
            {/* KPI Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Velocity Score</span>
                <p className="font-heading text-2xl font-bold text-indigo-900 mt-0.5">{reportData.metrics.velocityScore}/100</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Brand Compliance</span>
                <p className="font-heading text-2xl font-bold text-emerald-900 mt-0.5">{reportData.metrics.brandCompliance}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Active Documents</span>
                <p className="font-heading text-2xl font-bold text-slate-900 mt-0.5">{reportData.metrics.activeDocuments}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Pipeline Impact</span>
                <p className="font-heading text-2xl font-bold text-purple-900 mt-0.5">{reportData.metrics.projectedPipeline}</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Executive Briefing
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                {reportData.executiveSummary}
              </p>
            </div>

            {/* Content Velocity Insights */}
            <div className="space-y-2">
              <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Content Velocity & Atomization
              </h4>
              <ul className="space-y-1.5 pl-1">
                {reportData.contentVelocityInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Risk Assessment */}
            <div className="space-y-1.5">
              <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Brand Governance & Voice Integrity
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                {reportData.brandRiskAssessment}
              </p>
            </div>

            {/* Recommended Strategic Next Steps */}
            <div className="space-y-2">
              <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Strategic Next Steps
              </h4>
              <div className="space-y-1.5">
                {reportData.strategicNextSteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                onClick={copyReportMarkdown}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 rounded-xl"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Markdown Report
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-2 rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Export
              </Button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
