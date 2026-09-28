"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  ShieldCheck, 
  Copy, 
  MessageSquare, 
  Send, 
  Eye, 
  FileText,
  Lock,
  Stamp,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, ClientPortalProject } from "@/lib/workspace-data";

export default function ClientPortalPage() {
  const { addToast } = useToast();
  const [portals, setPortals] = useState<ClientPortalProject[]>(() => getWorkspaceData().clientPortals);
  const [selectedPortalId, setSelectedPortalId] = useState(portals[0]?.id || "portal-1");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientComment, setClientComment] = useState("");
  const [commentsList, setCommentsList] = useState<Record<string, { author: string; role: string; text: string; time: string }[]>>({
    "portal-1": [
      { author: "Erica Vance", role: "Stripe Head of Growth", text: "Approved! The conversion attribution numbers in section 2 look rock solid.", time: "Aug 24, 2026" },
      { author: "Devansh", role: "Nexus Lead", text: "Thanks Erica! Pushing live across all syndication channels.", time: "Aug 24, 2026" }
    ],
    "portal-2": [
      { author: "Kieran Lee", role: "Vercel Ecosystem Lead", text: "Can we double-check the serverless cold-start comparison in paragraph 4?", time: "2 hours ago" }
    ],
    "portal-3": [
      { author: "Marcus Brody", role: "Acme Legal Counsel", text: "Please update the compliance section to reference ISO 27001 alongside SOC2.", time: "Yesterday" }
    ]
  });

  // Create Portal Form
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");

  const activePortal = portals.find(p => p.id === selectedPortalId) || portals[0];
  const activeComments = commentsList[activePortal?.id] || [];

  const handleCreatePortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectName.trim()) return;
    const newProject: ClientPortalProject = {
      id: `portal-${crypto.randomUUID().slice(0, 6)}`,
      clientName: clientName.trim(),
      clientLogo: clientName.trim().slice(0, 1).toUpperCase(),
      projectName: projectName.trim(),
      reviewUrlToken: `${clientName.toLowerCase().replace(/\s+/g, '-')}-review`,
      status: "In Review",
      lastFeedback: "Magic link generated. Awaiting client review.",
      reviewerEmail: reviewerEmail.trim() || "stakeholder@client.com"
    };
    const next = [...portals, newProject];
    setPortals(next);
    setSelectedPortalId(newProject.id);
    updateWorkspaceData(d => ({
      ...d,
      clientPortals: next,
      activity: [`New Client Review Portal provisioned for ${newProject.clientName}`, ...d.activity]
    }));
    setIsCreateModalOpen(false);
    setClientName("");
    setProjectName("");
    setReviewerEmail("");
    addToast({
      title: "Client Portal Ready",
      message: `Generated secure review magic link for ${newProject.clientName}.`,
      type: "success"
    });
  };

  const handleSignOff = (portalId: string) => {
    const next = portals.map(p => p.id === portalId ? {
      ...p,
      status: "Approved" as const,
      signedOffAt: "Just now",
      lastFeedback: "Officially signed off with verified digital approval stamp."
    } : p);
    setPortals(next);
    updateWorkspaceData(d => ({
      ...d,
      clientPortals: next,
      activity: [`Client signed off: ${activePortal.clientName} on ${activePortal.projectName}`, ...d.activity]
    }));
    addToast({
      title: "Review Approved & Signed Off",
      message: "Digital compliance certificate generated for audit records.",
      type: "success"
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientComment.trim()) return;
    const newEntry = {
      author: "Devansh",
      role: "Nexus Lead",
      text: clientComment.trim(),
      time: "Just now"
    };
    setCommentsList(prev => ({
      ...prev,
      [activePortal.id]: [...(prev[activePortal.id] || []), newEntry]
    }));
    setClientComment("");
    addToast({ title: "Feedback message posted", type: "info" });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Stakeholder Review
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Magic Link Security Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">External Client & Stakeholder Portal</h1>
            <p className="text-slate-500 mt-1 text-base">Share friction-free review links with external clients, executives, and legal teams with zero login friction.</p>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Provision Client Portal
          </Button>
        </div>

        {/* Client Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portals.map((portal) => {
            const isSelected = portal.id === selectedPortalId;
            return (
              <div
                key={portal.id}
                onClick={() => setSelectedPortalId(portal.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {portal.clientLogo}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      portal.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : portal.status === "Revisions Needed"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {portal.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg text-slate-900">{portal.clientName}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{portal.projectName}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{portal.lastFeedback}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>{portal.reviewerEmail}</span>
                  <Eye className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-300"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Client Review Hub Detail */}
        {activePortal && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6">
            
            {/* Header & Magic Link Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#020617] text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
                  {activePortal.clientLogo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-2xl text-slate-900">{activePortal.clientName} Review Hub</h2>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      White-Label Enabled
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Project: <strong className="text-slate-700">{activePortal.projectName}</strong> · Assigned to: {activePortal.reviewerEmail}
                  </p>
                </div>
              </div>

              {/* Magic link pill */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-600 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>nexus.io/portal/{activePortal.reviewUrlToken}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://nexus.io/portal/${activePortal.reviewUrlToken}`);
                    addToast({ title: "Review Magic Link copied!", message: "Client can review without logging in.", type: "success" });
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Copy review link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Preview & Sign-off Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Asset View */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Document Pending Sign-Off</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">v2.1 Final Draft</span>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans">
                    <h3 className="font-heading text-lg text-slate-900 font-bold mb-2">
                      {activePortal.projectName}
                    </h3>
                    <p>
                      <strong>Executive Summary:</strong> Modern B2B enterprises require strict verification guardrails when deploying generative content engines. This joint study between {activePortal.clientName} and Nexus highlights an average 65% reduction in production cycle times with 0 compliance infractions.
                    </p>
                    <p>
                      <strong>Verified Outcomes:</strong> Multi-channel atomization resulted in 14 live marketing collateral pieces delivered across Webflow, LinkedIn, and email sequences within 48 hours of brief approval.
                    </p>
                  </div>
                </div>

                {/* Sign-off Action Strip */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        {activePortal.status === "Approved" ? "Client Approved & Signed Off" : "Ready for Stakeholder Sign-Off"}
                      </h4>
                      <p className="text-[11px] text-emerald-800/80">
                        {activePortal.signedOffAt ? `Digitally stamped on ${activePortal.signedOffAt}` : "One-click approval stamps an immutable audit log"}
                      </p>
                    </div>
                  </div>

                  {activePortal.status !== "Approved" && (
                    <Button
                      onClick={() => handleSignOff(activePortal.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-4 py-2 shadow-xs gap-1.5"
                    >
                      <Stamp className="w-3.5 h-3.5" /> Stamp Approval
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column: Feedback Stream */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-heading text-sm text-slate-900 font-bold">Reviewer Feedback Stream</h3>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-72">
                    {activeComments.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{c.author}</span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-600">{c.role}</p>
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={clientComment}
                      onChange={(e) => setClientComment(e.target.value)}
                      placeholder="Reply to client..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                    <Button type="submit" size="sm" className="bg-slate-900 text-white rounded-xl px-3">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Provision Portal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision Stakeholder Review Hub"
        description="Create a dedicated review URL for external clients or leadership."
      >
        <form onSubmit={handleCreatePortal} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Client or Company Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Stripe, Snowflake, Figma"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Project / Deliverable Title</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Q4 Executive Customer Story"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Reviewer Email</label>
            <input
              type="email"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="stakeholder@client.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Generate Review Hub</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
