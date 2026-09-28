"use client";

import React, { useState } from "react";
import { 
  Folder, 
  FolderPlus, 
  Image as ImageIcon, 
  Sparkles, 
  Search, 
  Upload, 
  Tag, 
  Trash2, 
  Download, 
  Maximize2, 
  Wand2, 
  Crop,
  CheckCircle2,
  Clock,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface MediaAsset {
  id: string;
  name: string;
  folder: string;
  type: "image" | "video" | "audio" | "svg" | "logo";
  size: string;
  tags: string[];
  dimensions?: string;
  previewUrl: string;
  aiAutoTags: string[];
  updatedAt: string;
}

const initialAssets: MediaAsset[] = [
  {
    id: "asset-1",
    name: "nexus-3d-architecture-hero.jpg",
    folder: "Hero Graphics",
    type: "image",
    size: "2.4 MB",
    tags: ["3D", "Hero", "Octane Render", "Futuristic"],
    dimensions: "3840 x 2160",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    aiAutoTags: ["datacenter", "glowing nodes", "cloud workspace", "holographic dashboard"],
    updatedAt: "2 hrs ago"
  },
  {
    id: "asset-2",
    name: "nexus-dashboard-saas-mockup.jpg",
    folder: "Product Screenshots",
    type: "image",
    size: "1.8 MB",
    tags: ["UI", "Dashboard", "MacBook Mockup", "Analytics"],
    dimensions: "2880 x 1800",
    previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    aiAutoTags: ["saas analytics", "kanban board", "modern UI", "brand score meter"],
    updatedAt: "Yesterday"
  },
  {
    id: "asset-3",
    name: "nexus-quantum-governance-shield.jpg",
    folder: "Brand & Security",
    type: "image",
    size: "3.1 MB",
    tags: ["Security", "SOC2", "Shield", "Encryption"],
    dimensions: "3840 x 2160",
    previewUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    aiAutoTags: ["cryptographic lock", "security telemetry", "crystal shield", "violet glow"],
    updatedAt: "3 days ago"
  }
];

const folders = ["All Assets", "Hero Graphics", "Product Screenshots", "Brand & Security", "Social Assets", "Audio / Video"];

export default function DigitalAssetManagementPage() {
  const { addToast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState("All Assets");
  const [naturalSearchQuery, setNaturalSearchQuery] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(initialAssets[0]);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("Modern 3D isometric cloud microservices pipeline with sleek glowing fiber optics");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16" | "4:5">("16:9");

  // Filtering by folder and semantic search (tags, name, aiAutoTags)
  const filteredAssets = assets.filter((asset) => {
    const matchesFolder = selectedFolder === "All Assets" || asset.folder === selectedFolder;
    const query = naturalSearchQuery.toLowerCase();
    const matchesQuery = !query || 
      asset.name.toLowerCase().includes(query) ||
      asset.tags.some(t => t.toLowerCase().includes(query)) ||
      asset.aiAutoTags.some(t => t.toLowerCase().includes(query));
    return matchesFolder && matchesQuery;
  });

  const handleGenerateAiImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGeneratingAiImage(true);

    setTimeout(() => {
      const newAsset: MediaAsset = {
        id: `gen-${Date.now()}`,
        name: `ai-gen-${aiPrompt.slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`,
        folder: "Hero Graphics",
        type: "image",
        size: "2.1 MB",
        tags: ["AI Generated", "FLUX Engine", aspectRatio],
        dimensions: aspectRatio === "16:9" ? "1920 x 1080" : aspectRatio === "1:1" ? "1080 x 1080" : "1080 x 1920",
        previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        aiAutoTags: ["synthetic asset", "high fidelity", "cloud architecture"],
        updatedAt: "Just now"
      };
      setAssets([newAsset, ...assets]);
      setSelectedAsset(newAsset);
      setIsGeneratingAiImage(false);
      addToast({ title: "AI Image Generated & Auto-Tagged into DAM!", type: "success" });
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Title & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> DAM & Multi-Modal Studio
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Auto-Tagging Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Digital Asset Management (DAM)
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Centralized brand asset storage with natural language visual search, AI auto-tagging, and generative image rendering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => addToast({ title: "File uploader opened", message: "Drag & drop supported (.PNG, .JPG, .SVG, .MP4)", type: "info" })}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <Upload className="w-4 h-4 text-indigo-400" /> Upload Assets
            </Button>
          </div>
        </div>

        {/* Natural Language Visual Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Deep AI visual search (e.g. 'Find modern dashboards with analytics charts' or '3D cybersecurity shield')..."
              value={naturalSearchQuery}
              onChange={(e) => setNaturalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
          {naturalSearchQuery && (
            <button
              onClick={() => setNaturalSearchQuery("")}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 shrink-0 font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Folder Hierarchy & Smart Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Folders & Collections</span>
                <button className="text-indigo-600 hover:text-indigo-700 p-1" title="New Folder">
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {folders.map((f) => {
                  const isActive = selectedFolder === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFolder(f)}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Folder className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} /> {f}
                      </span>
                      <span className={`text-[10px] font-mono ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                        {f === "All Assets" ? assets.length : assets.filter(a => a.folder === f).length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Smart AI Collections</span>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>✨ High-Res 4K Visuals</span>
                    <span className="text-[10px] font-mono font-bold text-indigo-600">3 items</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>🛡️ Verified Brand Marks</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">1 item</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Image Studio Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-purple-50/40 border border-indigo-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <Wand2 className="w-4 h-4 text-indigo-600" />
                <span>Generative Media Studio</span>
              </div>
              <form onSubmit={handleGenerateAiImage} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Prompt</label>
                  <textarea
                    rows={2}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["16:9", "1:1", "9:16", "4:5"] as const).map(ratio => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                          aspectRatio === ratio
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isGeneratingAiImage}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm rounded-xl"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiImage ? "animate-spin" : ""}`} />
                  {isGeneratingAiImage ? "Rendering 3D Visual..." : "Generate AI Asset"}
                </Button>
              </form>
            </div>

          </div>

          {/* Middle: Asset Gallery Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">{filteredAssets.length} Assets Found</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px]">Sort: <strong className="text-slate-800">Newest First</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md"
                    }`}
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                      <img 
                        src={asset.previewUrl} 
                        alt={asset.name} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
                        {asset.type}
                      </span>
                    </div>
                    <div className="pt-2.5 space-y-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{asset.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{asset.size}</span>
                        <span>{asset.dimensions}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Asset Detail & AI Metadata Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedAsset ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                    <img 
                      src={selectedAsset.previewUrl} 
                      alt={selectedAsset.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-slate-900 break-all">
                      {selectedAsset.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Folder: {selectedAsset.folder} · {selectedAsset.updatedAt}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Dimensions</span>
                    <span className="text-slate-900 font-mono font-medium">{selectedAsset.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">File Size</span>
                    <span className="text-slate-900 font-mono font-medium">{selectedAsset.size}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">AI Natural Language Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.aiAutoTags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    onClick={() => addToast({ title: "Copied asset URL to clipboard", type: "success" })}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                  <Button
                    onClick={() => addToast({ title: "Background Removed with AI", type: "success" })}
                    className="py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-xs rounded-xl"
                  >
                    <Crop className="w-3.5 h-3.5" /> AI Cutout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                Select an asset to view dimensions, AI auto-tags, and quick actions.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
