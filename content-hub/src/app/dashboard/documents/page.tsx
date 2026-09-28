"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search, Filter, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { createDocument, DocumentWorkspace, getDocuments, WorkspaceDocument } from "@/lib/documents";

const workspaces: DocumentWorkspace[] = ["Marketing", "Engineering", "Finance", "Product"];

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<WorkspaceDocument[]>(() => getDocuments());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [workspace, setWorkspace] = useState<DocumentWorkspace>("Marketing");
  const [query, setQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState<"All" | DocumentWorkspace>("All");

  // Hydrate documents from backend API
  useEffect(() => {
    async function loadBackendDocs() {
      try {
        const res = await fetch("/api/documents");
        if (res.ok) {
          const data = await res.json();
          if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
            setDocuments(data.documents);
          }
        }
      } catch (err) {
        console.warn("Using local document cache:", err);
      }
    }
    loadBackendDocs();
  }, []);

  const filteredDocuments = useMemo(() => documents.filter((document) => {
    const matchesQuery = document.title.toLowerCase().includes(query.toLowerCase()) || document.author.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (activeWorkspace === "All" || document.workspace === activeWorkspace);
  }), [activeWorkspace, documents, query]);

  const handleCreateDocument = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!docTitle.trim()) return;

    // 1. Create locally
    const document = createDocument(docTitle, workspace);

    // 2. Sync to backend store
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitle.trim(),
          workspace,
          workspaceId: workspace.toLowerCase(),
          content: "<p>Start writing, or ask Nexus AI Copilot to draft sections for you.</p>"
        })
      });
    } catch {
      // Local document created anyway
    }

    setDocuments(getDocuments());
    setDocTitle("");
    setIsModalOpen(false);
    router.push(`/workspace/${document.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-slate-900 tracking-tight">Documents</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Search, organize, and open your shared workspace files.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs px-6 py-2.5 font-semibold text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" /> New Document
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
              type="search" 
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
              placeholder="Search documents or authors..." 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-slate-400" />
            {(["All", ...workspaces] as const).map((item) => (
              <button 
                key={item} 
                onClick={() => setActiveWorkspace(item)} 
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                  activeWorkspace === item ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Name", "Workspace", "Author", "Last modified"].map((heading, index) => (
                  <th key={heading} scope="col" className={`px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 ${index > 1 ? "hidden md:table-cell" : ""}`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((document) => (
                <tr 
                  key={document.id} 
                  onClick={() => router.push(`/workspace/${document.id}`)} 
                  className="group cursor-pointer transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 text-sm">
                        {document.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {document.workspace}
                    </span>
                  </td>
                  <td className="hidden px-6 py-4 text-xs font-medium text-slate-500 md:table-cell">
                    {document.author}
                  </td>
                  <td className="hidden px-6 py-4 text-xs font-medium text-slate-400 md:table-cell">
                    {document.updatedAt}
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center text-xs text-slate-400">
                    No documents match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Document" description="Start with a blank collaborative document and make it your own.">
        <form onSubmit={handleCreateDocument} className="mt-4 space-y-5">
          <div>
            <label htmlFor="doc-title" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Document title</label>
            <input 
              id="doc-title" 
              value={docTitle} 
              onChange={(event) => setDocTitle(event.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
              placeholder="e.g. Q4 Strategy Review" 
              autoFocus 
              required 
            />
          </div>
          <div>
            <label htmlFor="workspace" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Workspace</label>
            <select 
              id="workspace" 
              value={workspace} 
              onChange={(event) => setWorkspace(event.target.value as DocumentWorkspace)} 
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {workspaces.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-xs">Cancel</Button>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 text-xs">Create Document <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
