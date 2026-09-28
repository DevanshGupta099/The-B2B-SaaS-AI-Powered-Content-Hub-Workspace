"use client";

import Link from "next/link";
import { FolderOpen, FileText, Users, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const workspaces = [
  { id: "marketing", name: "Marketing", description: "Campaigns, positioning, and brand content.", docs: 12, members: 6, color: "bg-violet-500" },
  { id: "engineering", name: "Engineering", description: "Technical specifications and product knowledge.", docs: 18, members: 9, color: "bg-sky-500" },
  { id: "finance", name: "Finance", description: "Revenue reporting and planning.", docs: 7, members: 4, color: "bg-emerald-500" },
  { id: "product", name: "Product", description: "Roadmaps, research, and requirements.", docs: 10, members: 7, color: "bg-amber-500" },
];

export default function WorkspacesPage() {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl text-slate-900 tracking-tight">Workspaces</h1>
            <p className="text-slate-500 mt-2 text-lg">Keep each team’s content, people, and context together.</p>
          </div>
          <Button className="gap-2 bg-[#020617] hover:bg-slate-800 text-white"><Plus className="w-4 h-4" /> New workspace</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href="/dashboard/documents" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-12 h-12 ${workspace.color} rounded-2xl flex items-center justify-center text-white shadow-sm`}><FolderOpen className="w-6 h-6" /></div>
                <ArrowRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
              </div>
              <h2 className="font-heading text-2xl text-slate-900">{workspace.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{workspace.description}</p>
              <div className="mt-7 flex gap-5 border-t border-slate-100 pt-5 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" />{workspace.docs} documents</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" />{workspace.members} members</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
