"use client";

import { useMemo, useState } from "react";
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

  const filteredDocuments = useMemo(() => documents.filter((document) => {
    const matchesQuery = document.title.toLowerCase().includes(query.toLowerCase()) || document.author.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (activeWorkspace === "All" || document.workspace === activeWorkspace);
  }), [activeWorkspace, documents, query]);

  const handleCreateDocument = (event: React.FormEvent) => {
    event.preventDefault();
    if (!docTitle.trim()) return;
    const document = createDocument(docTitle, workspace);
    setDocuments(getDocuments());
    setDocTitle("");
    setIsModalOpen(false);
    router.push(`/workspace/${document.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div><h1 className="font-heading text-4xl text-slate-900 tracking-tight">Documents</h1><p className="text-slate-500 mt-2 text-lg">Search, organize, and open your shared workspace files.</p></div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-[#020617] hover:bg-slate-800 text-white rounded-xl shadow-sm px-6 py-2.5 font-semibold"><Plus className="w-4 h-4" /> New Document</Button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#020617]" placeholder="Search documents or authors..." /></div>
          <div className="flex items-center gap-2 overflow-x-auto"><Filter className="h-4 w-4 shrink-0 text-slate-400" />{(["All", ...workspaces] as const).map((item) => <button key={item} onClick={() => setActiveWorkspace(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors ${activeWorkspace === item ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{item}</button>)}</div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{["Name", "Workspace", "Author", "Last modified"].map((heading, index) => <th key={heading} scope="col" className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 ${index > 1 ? "hidden md:table-cell" : ""}`}>{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{filteredDocuments.map((document) => <tr key={document.id} onClick={() => router.push(`/workspace/${document.id}`)} className="group cursor-pointer transition-colors hover:bg-slate-50/60"><td className="px-6 py-4"><div className="flex items-center gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600"><FileText className="h-5 w-5" /></div><span className="font-semibold text-slate-900 group-hover:text-indigo-600">{document.title}</span></div></td><td className="px-6 py-4"><span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{document.workspace}</span></td><td className="hidden px-6 py-4 text-sm font-medium text-slate-500 md:table-cell">{document.author}</td><td className="hidden px-6 py-4 text-sm font-medium text-slate-500 md:table-cell">{document.updatedAt}</td></tr>)}
              {filteredDocuments.length === 0 && <tr><td colSpan={4} className="px-6 py-14 text-center text-sm text-slate-400">No documents match your search.</td></tr>}</tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Document" description="Start with a blank collaborative document and make it your own.">
        <form onSubmit={handleCreateDocument} className="mt-4 space-y-6"><div><label htmlFor="doc-title" className="mb-2 block text-sm font-semibold text-slate-700">Document title</label><input id="doc-title" value={docTitle} onChange={(event) => setDocTitle(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#020617]" placeholder="e.g. Q4 Strategy Review" autoFocus required /></div>
          <div><label htmlFor="workspace" className="mb-2 block text-sm font-semibold text-slate-700">Workspace</label><select id="workspace" value={workspace} onChange={(event) => setWorkspace(event.target.value as DocumentWorkspace)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[#020617]">{workspaces.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit" className="bg-[#020617] text-white hover:bg-slate-800">Create Document <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
        </form>
      </Modal>
    </div>
  );
}
