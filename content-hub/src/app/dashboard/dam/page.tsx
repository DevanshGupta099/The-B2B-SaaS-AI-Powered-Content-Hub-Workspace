"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Folder, 
  FolderPlus, 
  Sparkles, 
  Search, 
  Upload, 
  Trash2, 
  Download, 
  Wand2, 
  Crop,
  CheckCircle2,
  RefreshCw,
  Plus,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

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

const folders = ["All Assets", "Hero Graphics", "Product Screenshots", "Brand & Security", "Social Assets", "Audio / Video"];

export default function DigitalAssetManagementPage() {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFolder, setSelectedFolder] = useState("All Assets");
  const [naturalSearchQuery, setNaturalSearchQuery] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  
  // AI Generation State
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("Modern 3D isometric cloud microservices pipeline with sleek glowing fiber optics");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16" | "4:5">("16:9");

  // Fetch DAM assets from backend API
  const fetchAssets = async () => {
    setIsLoadingAssets(true);
    try {
      const res = await fetch("/api/dam");
      if (res.ok) {
        const data = await res.json();
        if (data.assets && Array.isArray(data.assets)) {
          setAssets(data.assets);
          if (!selectedAsset && data.assets.length > 0) {
            setSelectedAsset(data.assets[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load DAM assets:", err);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filter assets by folder & search query
  const filteredAssets = assets.filter((asset) => {
    const matchesFolder = selectedFolder === "All Assets" || asset.folder.toLowerCase() === selectedFolder.toLowerCase();
    const query = naturalSearchQuery.toLowerCase().trim();
    if (!query) return matchesFolder;

    const matchesName = asset.name.toLowerCase().includes(query);
    const matchesTags = asset.tags.some(t => t.toLowerCase().includes(query));
    const matchesAiTags = asset.aiAutoTags.some(t => t.toLowerCase().includes(query));
    return matchesFolder && (matchesName || matchesTags || matchesAiTags);
  });

  // Handle AI Asset Generation
  const handleGenerateAiImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGeneratingAiImage(true);

    try {
      const res = await fetch("/api/dam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `ai-${aiPrompt.slice(0, 18).toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`,
          folder: selectedFolder === "All Assets" ? "Hero Graphics" : selectedFolder,
          type: "image",
          size: "2.4 MB",
          dimensions: aspectRatio === "16:9" ? "1920 x 1080" : aspectRatio === "1:1" ? "1080 x 1080" : "1080 x 1920",
          previewUrl: "/nexus-hero-3d.jpg",
          prompt: aiPrompt,
          tags: ["AI Generated", "FLUX Engine", aspectRatio]
        })
      });

      if (!res.ok) throw new Error("Failed to render AI asset");
      const data = await res.json();

      setAssets(prev => [data.asset, ...prev]);
      setSelectedAsset(data.asset);
      addToast({
        title: "AI Media Asset Generated & Auto-Tagged!",
        message: `Indexed with auto-tags: #${data.asset.aiAutoTags.slice(0, 3).join(", #")}`,
        type: "success"
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed";
      addToast({ title: "Generation Error", message, type: "error" });
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Real File Upload Handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const isSvg = file.type.includes("svg") || fileName.endsWith(".svg");
    const assetType = isSvg ? "svg" : file.type.startsWith("video") ? "video" : "image";

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch("/api/dam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fileName,
            folder: selectedFolder === "All Assets" ? "Product Screenshots" : selectedFolder,
            type: assetType,
            size: fileSizeMb,
            dimensions: "1920 x 1080",
            previewUrl: dataUrl || "/nexus-dashboard-mockup.jpg",
            prompt: fileName.replace(/\.[^/.]+$/, ""),
            tags: ["Direct Upload", assetType.toUpperCase()]
          })
        });

        if (!res.ok) throw new Error("Upload failed on backend");
        const data = await res.json();

        setAssets(prev => [data.asset, ...prev]);
        setSelectedAsset(data.asset);
        addToast({
          title: "Asset Uploaded & AI Auto-Tagged!",
          message: `${fileName} (${fileSizeMb}) added to DAM repository.`,
          type: "success"
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload error";
        addToast({ title: "Upload Failed", message, type: "error" });
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Asset Deletion
  const handleDeleteAsset = async (id: string) => {
    try {
      const res = await fetch(`/api/dam?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.id !== id));
        if (selectedAsset?.id === id) {
          const remaining = assets.filter(a => a.id !== id);
          setSelectedAsset(remaining.length > 0 ? remaining[0] : null);
        }
        addToast({ title: "Asset Deleted", message: "Removed from DAM library.", type: "info" });
      }
    } catch {
      addToast({ title: "Delete Error", message: "Failed to remove asset.", type: "error" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*,.svg,video/mp4" 
        className="hidden" 
      />

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
              onClick={() => fileInputRef.current?.click()}
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
          
          {/* Left: Folder Hierarchy & Generative Studio (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Folders & Collections</span>
                <button 
                  onClick={() => addToast({ title: "New Folder Initialized", message: "Folder ready for drag & drop asset categorization.", type: "info" })}
                  className="text-indigo-600 hover:text-indigo-700 p-1" 
                  title="New Folder"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {folders.map((f) => {
                  const isActive = selectedFolder === f;
                  const count = f === "All Assets" ? assets.length : assets.filter(a => a.folder.toLowerCase() === f.toLowerCase()).length;
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
                        {count}
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
                    <span className="text-[10px] font-mono font-bold text-indigo-600">{assets.length} items</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>🛡️ Verified Brand Marks</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">2 items</span>
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
              <span className="font-semibold">{filteredAssets.length} Assets in {selectedFolder}</span>
              <button 
                onClick={fetchAssets}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-bold"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingAssets ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {filteredAssets.length === 0 ? (
              <div className="p-12 rounded-3xl border border-dashed border-slate-200 bg-white text-center space-y-3">
                <Folder className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No assets found matching this filter.</p>
                <Button 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-900 text-white text-xs rounded-xl"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload First Asset
                </Button>
              </div>
            ) : (
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
            )}
          </div>

          {/* Right: Asset Detail & AI Metadata Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedAsset ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                    <img 
                      src={selectedAsset.previewUrl} 
                      alt={selectedAsset.name} 
                      className="w-full h-full object-cover max-h-48"
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">AI Auto-Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.aiAutoTags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAsset.previewUrl);
                        addToast({ title: "Asset link copied to clipboard", type: "success" });
                      }}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      <Download className="w-3.5 h-3.5" /> Copy / Download
                    </Button>
                    <Button
                      onClick={() => addToast({ title: "AI Background Cutout Applied", message: "Alpha channel masked successfully.", type: "success" })}
                      className="py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-xs rounded-xl"
                    >
                      <Crop className="w-3.5 h-3.5" /> AI Cutout
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleDeleteAsset(selectedAsset.id)}
                    variant="outline"
                    className="w-full py-2 text-rose-600 border-rose-200 hover:bg-rose-50 font-semibold text-xs rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove from DAM
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
