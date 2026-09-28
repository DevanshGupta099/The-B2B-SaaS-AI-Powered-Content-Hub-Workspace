"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, FileText, Users, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";

interface Workspace {
  id: string;
  name: string;
  desc?: string;
  description?: string;
  docsCount?: number;
  docs?: number;
  membersCount?: number;
  members?: number;
  color: string;
}

const defaultWorkspaces: Workspace[] = [
  { id: "1", name: "Project Apollo", description: "Core infrastructure rewrite & AI engine integration.", docs: 15, members: 8, color: "bg-indigo-600" },
  { id: "2", name: "Brand Refresh", description: "Marketing assets, design tokens, and voice governance.", docs: 8, members: 5, color: "bg-violet-600" },
  { id: "3", name: "Q4 Roadmap", description: "Enterprise compliance, autonomous agents, and RAG search.", docs: 3, members: 6, color: "bg-emerald-600" },
  { id: "marketing", name: "Marketing", description: "Campaigns, positioning, and brand content.", docs: 12, members: 6, color: "bg-violet-500" },
  { id: "engineering", name: "Engineering", description: "Technical specifications and product knowledge.", docs: 18, members: 9, color: "bg-sky-500" },
  { id: "finance", name: "Finance", description: "Revenue reporting and planning.", docs: 7, members: 4, color: "bg-emerald-500" },
  { id: "product", name: "Product", description: "Roadmaps, research, and requirements.", docs: 10, members: 7, color: "bg-amber-500" },
];

export default function WorkspacesPage() {
  const { addToast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsDesc, setNewWsDesc] = useState("");

  // Hydrate from backend API
  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await fetch("/api/workspaces");
        if (res.ok) {
          const data = await res.json();
          if (data.workspaces && Array.isArray(data.workspaces) && data.workspaces.length > 0) {
            setWorkspaces(data.workspaces);
          }
        }
      } catch (err) {
        console.warn("Using fallback local workspaces:", err);
      }
    }
    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWsName.trim(),
          desc: newWsDesc.trim() || "Collaborative sprint workspace",
          color: "bg-indigo-600"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWorkspaces(prev => [data.workspace, ...prev]);
        addToast({ title: "Workspace Created!", message: `${newWsName} is ready.`, type: "success" });
        setIsModalOpen(false);
        setNewWsName("");
        setNewWsDesc("");
      }
    } catch {
      addToast({ title: "Error", message: "Failed to create workspace.", type: "error" });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-slate-900 tracking-tight">Workspaces</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Keep each team’s governed content, documents, and context together.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl"
          >
            <Plus className="w-4 h-4" /> New workspace
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((workspace) => (
            <Link 
              key={workspace.id} 
              href={`/workspace/${workspace.id}`} 
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`w-12 h-12 ${workspace.color || "bg-indigo-600"} rounded-2xl flex items-center justify-center text-white shadow-xs`}>
                  <FolderOpen className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {workspace.name}
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                {workspace.desc || workspace.description}
              </p>
              <div className="mt-7 flex gap-5 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  {workspace.docsCount ?? workspace.docs ?? 12} documents
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  {workspace.membersCount ?? workspace.members ?? 6} members
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* New Workspace Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Governed Workspace"
        description="Isolate content, brand guidelines, and RBAC permissions for a team or project."
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4 pt-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Workspace Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Growth Marketing or API Platform"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Description & Purpose
            </label>
            <textarea 
              rows={3}
              placeholder="Primary goals and content responsibilities for this team..."
              value={newWsDesc}
              onChange={(e) => setNewWsDesc(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl"
            >
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
