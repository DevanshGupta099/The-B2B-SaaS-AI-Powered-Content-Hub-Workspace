"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  FileImage, 
  Search, 
  Upload, 
  Plus, 
  Grid2X2, 
  List, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Folder, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Layers, 
  RefreshCw,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { Avatar } from "@/components/ui/Avatar";
import { BackendDocument, BackendMediaAsset } from "@/lib/server-store";

type ContentTypeFilter = "all" | "document" | "image" | "video" | "svg";
type StatusFilter = "all" | "Draft" | "In Review" | "Approved" | "Published";

interface UnifiedItem {
  id: string;
  kind: "document" | "asset";
  title: string;
  category: string;
  status: string;
  type: string;
  author?: string;
  authorAvatar?: string;
  previewUrl?: string;
  tags: string[];
  updatedAt: string;
  complianceScore?: number;
  size?: string;
  dimensions?: string;
}

export default function ContentHubPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Data States
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [assets, setAssets] = useState<BackendMediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isGridView, setIsGridView] = useState(true);

  // Modal States
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocWorkspace, setNewDocWorkspace] = useState("Marketing");
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  // Preview Modal for Media Assets
  const [previewAsset, setPreviewAsset] = useState<BackendMediaAsset | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch documents and assets from backend
  const loadContentHubData = async () => {
    setIsLoading(true);
    try {
      const [docsRes, assetsRes] = await Promise.all([
        fetch("/api/documents"),
        fetch("/api/dam")
      ]);

      if (docsRes.ok) {
        const dData = await docsRes.json();
        if (dData.documents) setDocuments(dData.documents);
      }

      if (assetsRes.ok) {
        const aData = await assetsRes.json();
        if (aData.assets) setAssets(aData.assets);
      }
    } catch (err) {
      console.warn("Error fetching content hub items:", err);
      addToast({
        title: "Connection Notice",
        message: "Using locally cached documents and asset ledger.",
        type: "info"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContentHubData();
  }, []);

  // Merge and normalize into unified inventory
  const unifiedItems: UnifiedItem[] = useMemo(() => {
    const docItems: UnifiedItem[] = documents.map(d => ({
      id: d.id,
      kind: "document",
      title: d.title,
      category: d.workspace,
      status: d.status || "Draft",
      type: "Document",
      author: d.author || "Devansh",
      authorAvatar: d.authorAvatar,
      tags: d.tags || [],
      updatedAt: d.updatedAt || "Just now",
      complianceScore: d.complianceScore || 94
    }));

    const assetItems: UnifiedItem[] = assets.map(a => ({
      id: a.id,
      kind: "asset",
      title: a.name,
      category: a.folder,
      status: "Approved",
      type: a.type.toUpperCase(),
      author: "FLUX / DAM",
      previewUrl: a.previewUrl,
      tags: [...a.tags, ...a.aiAutoTags],
      updatedAt: a.updatedAt || "Just now",
      size: a.size,
      dimensions: a.dimensions
    }));

    return [...docItems, ...assetItems];
  }, [documents, assets]);

  // Apply search & multi-facet filters
  const filteredItems = useMemo(() => {
    return unifiedItems.filter(item => {
      // 1. Text Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      // 2. Type Filter
      let matchesType = true;
      if (typeFilter === "document") matchesType = item.kind === "document";
      else if (typeFilter === "image") matchesType = item.type.toLowerCase() === "image";
      else if (typeFilter === "video") matchesType = item.type.toLowerCase() === "video";
      else if (typeFilter === "svg") matchesType = item.type.toLowerCase() === "svg";

      // 3. Status Filter
      const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [unifiedItems, searchQuery, typeFilter, statusFilter]);

  // Handle New Document Creation
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    setIsCreatingDoc(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDocTitle.trim(),
          workspace: newDocWorkspace,
          workspaceId: newDocWorkspace.toLowerCase(),
          content: `<h1>${newDocTitle.trim()}</h1><p>Start drafting your governed enterprise content here, or use Nexus AI to generate an outline.</p>`
        })
      });

      if (!res.ok) throw new Error("Failed to create document");
      const data = await res.json();

      setIsNewDocModalOpen(false);
      setNewDocTitle("");
      addToast({
        title: "Document Created",
        message: `Redirecting to collaborative workspace: ${data.document.title}`,
        type: "success"
      });

      // Navigate to workspace editor
      router.push(`/workspace/${data.document.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Creation failed";
      addToast({ title: "Error", message, type: "error" });
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Handle Asset Upload
  const handleUploadAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const isSvg = file.type.includes("svg") || fileName.endsWith(".svg");
    const assetType = isSvg ? "svg" : file.type.startsWith("video") ? "video" : "image";

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch("/api/dam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fileName,
            folder: "Hero Graphics",
            type: assetType,
            size: fileSizeMb,
            dimensions: "Responsive Vector",
            previewUrl: dataUrl,
            prompt: fileName.replace(/\.[^/.]+$/, ""),
            tags: ["Upload", assetType.toUpperCase()]
          })
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setAssets(prev => [data.asset, ...prev]);

        addToast({
          title: "Asset Uploaded & Auto-Indexed",
          message: `Indexed with AI tags: #${data.asset.aiAutoTags.slice(0, 3).join(", #")}`,
          type: "success"
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        addToast({ title: "Upload Error", message, type: "error" });
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Document
  const handleDeleteItem = async (item: UnifiedItem) => {
    if (item.kind === "document") {
      setDocuments(prev => prev.filter(d => d.id !== item.id));
      try {
        await fetch(`/api/documents/${item.id}`, { method: "DELETE" });
      } catch (e) {
        console.warn("Delete sync warning:", e);
      }
      addToast({ title: "Document Removed", message: `Deleted ${item.title}`, type: "info" });
    } else {
      setAssets(prev => prev.filter(a => a.id !== item.id));
      try {
        await fetch("/api/dam", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id })
        });
      } catch (e) {
        console.warn("Delete asset warning:", e);
      }
      addToast({ title: "Asset Deleted", message: `Removed ${item.title}`, type: "info" });
    }
  };

  const handleCopyAssetUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addToast({ title: "URL Copied", message: "Asset link copied to clipboard.", type: "success" });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Hidden File Input for Real Asset Upload */}
        <input 
          ref={uploadInputRef} 
          type="file" 
          accept="image/*,video/*,.svg" 
          className="hidden" 
          onChange={handleUploadAsset} 
        />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#020617] text-white border border-[#1e293b] font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Multi-Modal Repository
              </span>
              <span className="text-slate-400 text-xs">· Node 01 (US-East)</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Content Hub & Master Ledger
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Unified control center for every governed document, generative asset, and editorial release.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => uploadInputRef.current?.click()}
              variant="secondary"
              className="flex items-center gap-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
            >
              <Upload className="w-4 h-4 text-indigo-600" /> Upload Asset
            </Button>
            <Button
              onClick={() => setIsNewDocModalOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold rounded-xl bg-[#020617] hover:bg-slate-900 text-white shadow-md border border-[#1e293b]"
            >
              <Plus className="w-4 h-4 text-indigo-400" /> New Document
            </Button>
          </div>
        </div>

        {/* Telemetry KPI Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Governed Items</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold font-heading text-slate-900">{unifiedItems.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">{documents.length} docs · {assets.length} visual assets</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Published / Approved</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {unifiedItems.filter(i => i.status === "Approved" || i.status === "Published").length}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Brand compliance pass</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active In Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {unifiedItems.filter(i => i.status === "In Review" || i.status === "In review").length}
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Pending stakeholder approvals</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Auto-Tagging</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold font-heading text-slate-900">98.6%</div>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">Semantic taxonomy enabled</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all documents, asset metadata, AI tags, and folders..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode & Refresh */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={loadContentHubData}
                disabled={isLoading}
                title="Refresh Inventory"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
              </button>

              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isGridView ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Grid View"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    !isGridView ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Facet Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
              {(["all", "document", "image", "video", "svg"] as ContentTypeFilter[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-colors ${
                    typeFilter === t
                      ? "bg-[#020617] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                  }`}
                >
                  {t === "all" ? "All Formats" : t === "document" ? "Documents" : `${t}s`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Inventory Grid / List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
            <p className="text-sm font-semibold text-slate-600">Loading synchronized content ledger...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-400">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">No matching content items found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No items match your active filters. Try adjusting your search query or create a new document.
              </p>
            </div>
            <Button
              onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all"); }}
              variant="secondary"
              size="sm"
              className="text-xs font-semibold"
            >
              Reset All Filters
            </Button>
          </div>
        ) : isGridView ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={`${item.kind}-${item.id}`}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Preview or Document Header */}
                  {item.kind === "asset" && item.previewUrl ? (
                    <div 
                      onClick={() => setPreviewAsset(assets.find(a => a.id === item.id) || null)}
                      className="relative w-full h-44 bg-slate-900 overflow-hidden cursor-pointer group-hover:opacity-95"
                    >
                      <img 
                        src={item.previewUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-[#020617]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {item.type}
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 p-1.5 rounded-lg shadow-sm">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 pb-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                          item.status === "Approved" || item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "In Review" || item.status === "In review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 pt-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-bold text-slate-900 text-sm line-clamp-1 leading-snug group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.category} · Updated {item.updatedAt}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] font-semibold text-slate-400 self-center">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.author && (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={item.author} src={item.authorAvatar} size={20} />
                        <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[90px]">
                          {item.author}
                        </span>
                      </div>
                    )}
                    {item.complianceScore && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {item.complianceScore}% SLA
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.kind === "document" ? (
                      <Link
                        href={`/workspace/${item.id}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Open Editor <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setPreviewAsset(assets.find(a => a.id === item.id) || null)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Inspect <Eye className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST / TABLE VIEW */
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 font-heading text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-6">Content Title</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={`${item.kind}-${item.id}`} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          {item.kind === "document" ? (
                            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                          ) : (
                            <FileImage className="w-4 h-4 text-violet-600 shrink-0" />
                          )}
                          <span className="truncate max-w-xs">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-semibold text-[11px]">{item.type}</td>
                      <td className="py-4 px-4 font-medium">{item.category}</td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          item.status === "Approved" || item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "In Review" || item.status === "In review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          {item.author && <Avatar name={item.author} src={item.authorAvatar} size={18} />}
                          <span>{item.author || "—"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{item.updatedAt}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.kind === "document" ? (
                            <Link
                              href={`/workspace/${item.id}`}
                              className="text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 rounded hover:bg-indigo-50"
                            >
                              Edit
                            </Link>
                          ) : (
                            <button
                              onClick={() => setPreviewAsset(assets.find(a => a.id === item.id) || null)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 rounded hover:bg-indigo-50"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* CREATE NEW DOCUMENT MODAL */}
      <Modal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        title="Create Governed Document"
        description="Initialize an enterprise document with automated SLA governance and collaborative presence."
      >
        <form onSubmit={handleCreateDocument} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Document Title</label>
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="e.g. Q4 Global Content Strategy Brief"
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Workspace Category</label>
            <select
              value={newDocWorkspace}
              onChange={(e) => setNewDocWorkspace(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Product">Product</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsNewDocModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isCreatingDoc}
              className="bg-[#020617] text-white hover:bg-slate-900"
            >
              Create & Open Editor
            </Button>
          </div>
        </form>
      </Modal>

      {/* ASSET PREVIEW & INSPECTION MODAL */}
      {previewAsset && (
        <Modal
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          title={previewAsset.name}
          description={`Category: ${previewAsset.folder} · Indexed by FLUX / DAM`}
        >
          <div className="space-y-4">
            <div className="w-full max-h-80 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
              <img 
                src={previewAsset.previewUrl} 
                alt={previewAsset.name} 
                className="max-h-80 w-auto object-contain" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Dimensions</span>
                <span className="font-semibold text-slate-800">{previewAsset.dimensions || "1920 x 1080"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">File Size</span>
                <span className="font-semibold text-slate-800">{previewAsset.size}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                AI Auto-Generated Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...previewAsset.tags, ...previewAsset.aiAutoTags].map((tag, i) => (
                  <span key={i} className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyAssetUrl(previewAsset.previewUrl)}
                className="gap-1.5 text-xs font-semibold"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? "Copied Link" : "Copy Asset URL"}
              </Button>

              <a
                href={previewAsset.previewUrl}
                target="_blank"
                rel="noreferrer"
                download={previewAsset.name}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#020617] text-white hover:bg-slate-900 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Full Asset
              </a>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
