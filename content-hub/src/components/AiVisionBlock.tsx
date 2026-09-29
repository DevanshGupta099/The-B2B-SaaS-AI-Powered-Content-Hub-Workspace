"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  ScanLine, 
  Tag, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  RefreshCw,
  Lightbulb,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

interface VisionResult {
  title: string;
  type: string;
  entities: string[];
  summary: string;
  extractedText?: string;
  keyInsights: string[];
}

export function AiVisionBlock() {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<VisionResult | null>(null);
  const [provider, setProvider] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Process file upload (either via file input or drag-and-drop)
  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Unsupported File",
        message: "Please select an image file (PNG, JPG, WebP, SVG).",
        type: "error"
      });
      return;
    }

    setFileName(file.name);
    setResults(null);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImage(dataUrl);

      try {
        const response = await fetch("/api/ai/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: dataUrl,
            fileName: file.name,
            mimeType: file.type
          })
        });

        if (!response.ok) {
          throw new Error(`Vision analysis failed with HTTP ${response.status}`);
        }

        const resData = await response.json();
        if (resData.data) {
          setResults(resData.data);
          setProvider(resData.provider || "Nexus Vision");
          addToast({
            title: "Vision Analysis Complete",
            message: `Extracted ${resData.data.entities.length} entities & strategic summary.`,
            type: "success"
          });
        } else {
          throw new Error("Invalid response from vision service");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Vision processing failed";
        console.error("AI Vision Block Error:", err);
        addToast({
          title: "Analysis Notice",
          message: `${msg}. Displaying local structural analysis.`,
          type: "info"
        });
      } finally {
        setIsScanning(false);
      }
    };

    reader.onerror = () => {
      setIsScanning(false);
      addToast({ title: "Read Error", message: "Failed to read the local image file.", type: "error" });
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCopyData = () => {
    if (!results) return;
    const textData = `### ${results.title}
**Type:** ${results.type}
**Summary:** ${results.summary}

**Detected Entities:**
${results.entities.map(e => `- ${e}`).join("\n")}

**Key Insights:**
${results.keyInsights.map(k => `- ${k}`).join("\n")}

${results.extractedText ? `**Extracted Content:**\n${results.extractedText}` : ""}`;

    navigator.clipboard.writeText(textData);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addToast({
      title: "Copied to Clipboard",
      message: "Vision structured metadata copied as formatted Markdown.",
      type: "success"
    });
  };

  const handleReset = () => {
    setImage(null);
    setFileName("");
    setResults(null);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full my-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs font-sans" contentEditable={false}>
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleInputChange} 
      />

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-10 flex flex-col items-center justify-center text-center border-2 border-dashed m-4 rounded-2xl cursor-pointer transition-all ${
            isDragging 
              ? "border-indigo-600 bg-indigo-50/50 scale-[0.99]" 
              : "border-slate-300/80 bg-slate-50/70 hover:bg-slate-100/70 hover:border-indigo-400"
          }`}
        >
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            Upload Image for Multi-Modal AI Vision Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
            Drag & drop any diagram, UI screenshot, or document scan. Nexus AI Vision automatically transcribes text, detects entities, and extracts strategic metadata.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" /> Multi-Modal LLaMA 3.2 Vision
            </span>
            <span className="text-[11px] font-medium text-slate-400">PNG, JPG, WebP, SVG</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Top Bar with File Name and Actions */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{fileName || "Uploaded Image"}</span>
              {provider && (
                <span className="hidden sm:inline-block text-[10px] font-mono text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md font-semibold">
                  {provider}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200/70 transition-colors"
                title="Change Image"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace
              </button>
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Container with Scanning Overlay */}
          <div className="relative w-full max-h-96 bg-slate-900 overflow-hidden flex items-center justify-center">
            <Image 
              src={image} 
              alt={fileName || "Uploaded Image"} 
              width={800}
              height={500}
              unoptimized
              className="max-h-96 w-auto object-contain transition-transform duration-700" 
            />
            
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center"
                >
                  <motion.div 
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-300 to-indigo-500 shadow-[0_0_20px_rgba(129,140,248,1)]"
                  />
                  <ScanLine className="w-10 h-10 mb-3 animate-pulse text-indigo-300" />
                  <span className="text-xs font-bold tracking-widest uppercase text-white drop-shadow-md">
                    Running Deep Multi-Modal Vision Inference...
                  </span>
                  <p className="text-[11px] text-indigo-200 mt-1">Transcribing OCR text & detecting semantic layout</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Structured Data Output */}
          <AnimatePresence>
            {results && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-slate-200 bg-white"
              >
                <div className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 
                        {results.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{results.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleCopyData}
                        size="sm" 
                        variant="secondary"
                        className="text-xs gap-1.5 h-8 font-semibold"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {isCopied ? "Copied" : "Copy Markdown"}
                      </Button>
                    </div>
                  </div>

                  {/* Summary & Entities */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" /> Executive Visual Summary
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{results.summary}</p>
                      
                      {results.extractedText && (
                        <div className="pt-2 mt-2 border-t border-slate-200/70">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <FileSearch className="w-3 h-3 text-slate-400" /> Extracted Text (OCR)
                          </span>
                          <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-slate-200/70 whitespace-pre-wrap">
                            {results.extractedText}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Detected Entities */}
                      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-indigo-600" /> Detected Entities
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {results.entities.map((entity, i) => (
                            <span 
                              key={i} 
                              className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2.5 py-1 rounded-lg"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Insights */}
                      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Observations
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
                          {results.keyInsights.map((insight, i) => (
                            <li key={i} className="leading-snug">{insight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
