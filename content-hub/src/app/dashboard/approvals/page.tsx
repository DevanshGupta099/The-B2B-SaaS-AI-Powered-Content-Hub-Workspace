"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Clock3, 
  MessageSquare, 
  XCircle, 
  ShieldCheck, 
  Filter, 
  FileText,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import { ApprovalItem, getWorkspaceData, updateWorkspaceData } from "@/lib/workspace-data";
import Link from "next/link";

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(() => getWorkspaceData().approvals);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Changes requested">("All");
  const { addToast } = useToast();

  const resolve = (id: string, outcome: "Approved" | "Changes requested") => {
    const next = items.map((item) => (item.id === id ? { ...item, status: outcome } : item));
    setItems(next);
    updateWorkspaceData((data) => ({
      ...data,
      approvals: next,
      activity: [`${outcome}: ${items.find((item) => item.id === id)?.title ?? "content"}`, ...data.activity]
    }));
    addToast({
      title: outcome === "Approved" ? "Document Approved & Stamped" : "Revisions Requested",
      message: outcome === "Approved" 
        ? "Deterministic brand compliance verified. Digital approval stamp added." 
        : "Editor notified to resolve flagged review items.",
      type: outcome === "Approved" ? "success" : "info"
    });
  };

  const filteredItems = items.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  const pendingCount = items.filter((i) => i.status === "Pending").length;
  const approvedCount = items.filter((i) => i.status === "Approved").length;

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#020617] text-white border border-[#1e293b] font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Enterprise Governance
              </span>
              <span className="text-slate-400 text-xs">· Audit Level 4</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Content Approvals & Compliance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review staged drafts against deterministic brand voice guidelines and legal sign-off gates.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl font-bold">
              {pendingCount} Pending
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
              {approvedCount} Approved
            </span>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs text-xs overflow-x-auto">
          {(["All", "Pending", "Approved", "Changes requested"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-[#020617] text-white shadow-sm border border-[#1e293b]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <article 
              key={item.id} 
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {item.status === "Pending" ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <Clock3 className="w-3 h-3 text-amber-500" /> {item.stage}
                      </span>
                    ) : item.status === "Approved" ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Stamped Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3 text-rose-500" /> Revisions Needed
                      </span>
                    )}
                    <span className="text-slate-400 text-xs">· Due {item.due}</span>
                  </div>

                  <h2 className="text-lg font-heading font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authored by <span className="font-semibold text-slate-700">{item.owner}</span> · Target Channel: Enterprise Release
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    onClick={() => addToast({ title: "Comment Panel Opened", message: "Review inline annotations in editor.", type: "info" })} 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  {item.status === "Pending" && (
                    <>
                      <Button 
                        onClick={() => resolve(item.id, "Changes requested")} 
                        variant="secondary" 
                        size="sm" 
                        className="gap-1.5 text-xs font-semibold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                      >
                        <XCircle className="h-4 w-4" /> Request Changes
                      </Button>
                      <Button 
                        onClick={() => resolve(item.id, "Approved")} 
                        size="sm" 
                        className="gap-1.5 text-xs font-semibold bg-[#020617] hover:bg-slate-900 text-white rounded-xl shadow-sm border border-[#1e293b]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Sign & Approve
                      </Button>
                    </>
                  )}
                  {item.status !== "Pending" && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      Resolved: {item.status}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}

          {filteredItems.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
              <h2 className="mt-4 text-lg font-heading font-bold text-slate-900">No Approvals Matching Filter</h2>
              <p className="mt-1 text-xs text-slate-500">All submissions in this category have been processed or signed off.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
