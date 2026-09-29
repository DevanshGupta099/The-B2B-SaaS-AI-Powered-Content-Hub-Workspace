"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Copy, 
  FileText, 
  Wand2, 
  Layers, 
  History, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  Zap, 
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData } from "@/lib/workspace-data";
import { createDocument } from "@/lib/documents";

const models = [
  { id: "qwen/qwen3.8-27b", name: "Groq Qwen 3.8 27B", speed: "18ms", provider: "Groq", tag: "Fast & Active" },
  { id: "llama-3.3-70b-versatile", name: "Groq Llama 3.3 70B", speed: "220ms", provider: "Groq", tag: "Deep Reasoning" },
  { id: "llama-3.1-8b-instant", name: "Groq Llama 3.1 8B", speed: "12ms", provider: "Groq", tag: "Instant" },
  { id: "llama3.2:3b", name: "Ollama Llama 3.2 3B", speed: "45ms", provider: "Ollama", tag: "Local Private" },
];

const recipes = [
  {
    id: "blog-writer",
    name: "Long-Form Blog Writer",
    steps: "Outline ➔ Draft ➔ Key Takeaways ➔ Meta Tags",
    defaultPrompt: "Write a comprehensive 1,200-word engineering blog on 'Scaling Real-Time Multi-Tenant WebSockets with CRDT State Synchronization in Enterprise SaaS'."
  },
  {
    id: "social-kit",
    name: "Omnichannel Social Kit",
    steps: "1 Core Idea ➔ LinkedIn + X Thread + Newsletter",
    defaultPrompt: "Turn our latest Atlas Cloud 65% velocity case study into 1 high-authority LinkedIn post and 1 viral 5-tweet narrative thread."
  },
  {
    id: "ad-matrix",
    name: "Paid Acquisition Ad Copy Matrix",
    steps: "Value Prop ➔ 4 Google Search Ads + 3 LinkedIn Sponsored Posts",
    defaultPrompt: "Generate high-converting paid search ads and sponsored LinkedIn updates targeting enterprise CMOs and VPs of Content Operations."
  },
  {
    id: "sales-enablement",
    name: "B2B Sales Enablement Brief",
    steps: "Pain Point ➔ 3-Touch Cold Sequence + Battlecard",
    defaultPrompt: "Create a 3-touch outbound sequence for Tier 1 SaaS accounts emphasizing zero brand compliance infractions and 4x velocity."
  }
];

const mockVersions = [
  { version: "v1.3 (Current)", author: "Devansh (You)", timestamp: "Just now", diff: "+ AI Generated real-time section using Groq Qwen 3.8-27b" },
  { version: "v1.2", author: "Groq LPU Copilot", timestamp: "15 mins ago", diff: "+ Expanded technical architecture section" },
  { version: "v1.1", author: "Sarah Connor (Reviewer)", timestamp: "1 hour ago", diff: "~ Rephrased enterprise compliance disclaimer" },
  { version: "v1.0 (Initial)", author: "Devansh", timestamp: "3 hours ago", diff: "Initial draft generated from RFC spec" }
];

export default function AiStudioPage() {
  const { addToast } = useToast();
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [activeTab, setActiveTab] = useState<"editor" | "recipes" | "history">("editor");
  const [tone, setTone] = useState("Authoritative and data-driven");
  const [prompt, setPrompt] = useState("Write an authoritative technical brief on real-time multiplayer document synchronization using CRDTs and edge WebSockets.");
  const [docContent, setDocContent] = useState(
`# Real-Time Collaborative Architecture at Nexus

Our multi-tenant collaborative workspace utilizes **Conflict-free Replicated Data Types (CRDTs)** paired with an edge WebSocket mesh to guarantee zero-latency cursor synchronization and deterministic multi-user text merges.

## 1. The Core Architecture Challenge
Traditional operational transformation (OT) systems rely on a single centralized leader to resolve merge conflicts. In global B2B operations with teams spanning San Francisco, London, and Tokyo, network roundtrips introduce noticeable typing jitter.

## 2. Why CRDTs Win for Governed Content
- **Deterministic Merges**: Every writer's local state converges mathematically without centralized lock contention.
- **Offline-First Resilience**: Draft collateral in transit or on airplanes; local changes reconcile automatically upon reconnect.
- **Zero-Latency Multi-Cursor Presence**: Cursors broadcast via lightweight binary WebSockets at sub-10ms latency.

## 3. Brand Governance Integration
Every edit buffer is grounded in real-time against the workspace Brand Kit. Forbidden terminology is flagged inline before publication.`);

  const [isGenerating, setIsGenerating] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [lastGenMetrics, setLastGenMetrics] = useState<{ latencyMs: number; tokens: number; model: string } | null>(null);

  const handleApplySlashCommand = async (cmd: string) => {
    setSlashMenuOpen(false);
    setIsGenerating(true);
    
    let instruction = "";
    if (cmd === "summarize") {
      instruction = "Provide a high-impact, 2-paragraph Executive Summary of the following document. Highlight key metrics and architectural takeaways:";
    } else if (cmd === "punchy") {
      instruction = "Extract 4-5 punchy, high-leverage key takeaways from the following document, formatted with clean bullet points and bold headers:";
    } else if (cmd === "translate") {
      instruction = "Transcreate the core thesis of this document into both professional enterprise Spanish and German:";
    } else if (cmd === "expand") {
      instruction = "Add a deep-dive section on Enterprise Scalability, Benchmarking, and Disaster Recovery for this architecture:";
    }

    try {
      const brand = getWorkspaceData().brandKit;
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${instruction}\n\n[DOCUMENT CONTENT]\n${docContent.slice(0, 3000)}`,
          model: selectedModel.id,
          brandVoice: brand.voice,
          restrictedTerms: brand.restrictedTerms,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setDocContent(prev => prev + `\n\n${data.text}`);
        setLastGenMetrics({ latencyMs: data.latencyMs, tokens: data.tokens?.total || 0, model: data.model });
        addToast({ 
          title: `Applied /${cmd}`, 
          message: `Generated in ${data.latencyMs}ms (${data.tokens?.total || 0} tokens)`, 
          type: "success" 
        });
      } else {
        throw new Error(data.error || "Generation returned empty");
      }
    } catch (err: any) {
      addToast({ title: "AI Generation Error", message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const brand = getWorkspaceData().brandKit;
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Target Tone: ${tone}\nInstruction: ${prompt}\n\nCurrent Document Context:\n${docContent.slice(0, 1500)}`,
          model: selectedModel.id,
          brandVoice: brand.voice,
          restrictedTerms: brand.restrictedTerms,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setDocContent(prev => prev + `\n\n${data.text}`);
        setLastGenMetrics({ latencyMs: data.latencyMs, tokens: data.tokens?.total || 0, model: data.model });
        addToast({ 
          title: "Section Generated Successfully!", 
          message: `Generated in ${data.latencyMs}ms via ${data.model}`, 
          type: "success" 
        });
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err: any) {
      addToast({ title: "AI Generation Error", message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunRecipe = async (recipe: typeof recipes[0]) => {
    setPrompt(recipe.defaultPrompt);
    setIsGenerating(true);
    setActiveTab("editor");
    try {
      const brand = getWorkspaceData().brandKit;
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Execute the following content recipe: "${recipe.name}".\n\nPrompt details:\n${recipe.defaultPrompt}\n\nFormat the complete response in production-grade Markdown with H1, H2, bullet points, and actionable takeaways.`,
          model: selectedModel.id,
          brandVoice: brand.voice,
          restrictedTerms: brand.restrictedTerms,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setDocContent(data.text);
        setLastGenMetrics({ latencyMs: data.latencyMs, tokens: data.tokens?.total || 0, model: data.model });
        addToast({ 
          title: `Recipe Executed: ${recipe.name}`, 
          message: `Generated in ${data.latencyMs}ms (${data.tokens?.total || 0} tokens)`, 
          type: "success" 
        });
      }
    } catch (err: any) {
      addToast({ title: "Recipe Error", message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDocs = () => {
    const firstLine = docContent.split("\n")[0].replace(/^#+\s*/, "").trim() || "AI Studio Generated Document";
    const newDoc = createDocument(firstLine, "Marketing", docContent);
    addToast({
      title: "Document Saved!",
      message: `'${newDoc.title}' added to your Documents library.`,
      type: "success"
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Studio & Copilot Editor
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Brand Guardrails Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              AI Document Studio
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Long-form generative workspace powered by Groq Qwen 3.8-27B with live RAG and brand voice guardrails.
            </p>
          </div>

          {/* Right Toolbar: Multi-Model Switcher & Controls */}
          <div className="flex items-center flex-wrap gap-3">
            
            {/* Live Generation Telemetry Badge */}
            {lastGenMetrics && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{lastGenMetrics.latencyMs}ms</span>
                <span className="text-slate-300">|</span>
                <span>{lastGenMetrics.tokens} tokens</span>
              </div>
            )}

            {/* Model Selector Dropdown */}
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const m = models.find(mod => mod.id === e.target.value);
                if (m) setSelectedModel(m);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.speed})
                </option>
              ))}
            </select>

            <Button
              onClick={handleSaveToDocs}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Save to Docs
            </Button>

            <Link
              href="/dashboard/repurpose"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" /> Atomize
            </Link>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "editor" 
                ? "bg-white text-slate-900 shadow-xs border border-slate-200" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" /> Block Editor & Copilot
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "recipes" 
                ? "bg-white text-slate-900 shadow-xs border border-slate-200" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Generation Recipes ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "history" 
                ? "bg-white text-slate-900 shadow-xs border border-slate-200" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5 text-indigo-600" /> Version History & Diff
          </button>
        </div>

        {/* TAB 1: BLOCK EDITOR & COPILOT */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Editor Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Formatting & Copilot Bar */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">Format:</span>
                  <button onClick={() => setDocContent(prev => prev + "\n**Bold Claim** ")} className="p-1.5 rounded-lg hover:bg-slate-100 font-bold">B</button>
                  <button onClick={() => setDocContent(prev => prev + "\n*Italic Emphasis* ")} className="p-1.5 rounded-lg hover:bg-slate-100 italic">I</button>
                  <button onClick={() => setDocContent(prev => prev + "\n\n# New Heading 1\n")} className="p-1.5 rounded-lg hover:bg-slate-100 font-bold">H1</button>
                  <button onClick={() => setDocContent(prev => prev + "\n\n## Subheading 2\n")} className="p-1.5 rounded-lg hover:bg-slate-100 font-bold">H2</button>
                  <button onClick={() => setDocContent(prev => prev + "\n\n> Key Proof Point quote\n")} className="p-1.5 rounded-lg hover:bg-slate-100">Quote</button>
                  <button onClick={() => setDocContent(prev => prev + "\n\n```typescript\n// Code snippet\n```\n")} className="p-1.5 rounded-lg hover:bg-slate-100">Code</button>
                </div>

                {/* Inline Slash Copilot Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setSlashMenuOpen(!slashMenuOpen)}
                    disabled={isGenerating}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600" /> Slash Actions ( / )
                  </button>

                  {slashMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-30 space-y-1 animate-in fade-in zoom-in-95">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">AI Copilot Actions</div>
                      <button
                        onClick={() => handleApplySlashCommand("summarize")}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>/summarize — Executive Summary</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold">Groq LLM</span>
                      </button>
                      <button
                        onClick={() => handleApplySlashCommand("punchy")}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>/make-punchy — Key Takeaways</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold">Groq LLM</span>
                      </button>
                      <button
                        onClick={() => handleApplySlashCommand("expand")}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>/expand — Enterprise Section</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold">Groq LLM</span>
                      </button>
                      <button
                        onClick={() => handleApplySlashCommand("translate")}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>/translate — ES & DE Transcreation</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold">Groq LLM</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Textarea Canvas */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <textarea
                  rows={20}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-transparent text-slate-900 text-sm font-mono leading-relaxed outline-none resize-none"
                  placeholder="Type '/' for AI commands or begin writing..."
                />
              </div>

            </div>

            {/* Right: AI Prompt & Context Control Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Live Prompt Copilot
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">{selectedModel.name}</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Instruction</label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Brand Voice Grounding</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Authoritative and data-driven</option>
                    <option>Technical and engineering-first</option>
                    <option>Punchy and conversion-focused</option>
                    <option>Visionary executive narrative</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerateSection}
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Generating with Groq LLM..." : "Generate AI Section"}
                </Button>
              </div>

              {/* Linked Knowledge Grounding Card */}
              <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 shadow-xs space-y-2 text-xs">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active RAG & Brand Guardrails
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Grounding requests in <strong>Brand Voice</strong> and filtering out forbidden superlatives (<em>seamless, revolutionary, guaranteed</em>) in real-time.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GENERATION RECIPES */}
        {activeTab === "recipes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-slate-900">{recipe.name}</h3>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Recipe
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold">{recipe.steps}</p>
                  <p className="text-xs text-slate-600 font-mono p-3 rounded-xl bg-slate-50 border border-slate-200 mt-2">
                    {recipe.defaultPrompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Button
                    onClick={() => handleRunRecipe(recipe)}
                    disabled={isGenerating}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                    {isGenerating ? "Executing via Groq LLM..." : "Run Recipe in Editor"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VERSION HISTORY & VISUAL DIFF */}
        {activeTab === "history" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-slate-900">Document Version Timeline</h3>
              <span className="text-xs text-slate-500 font-mono">Autosaved every 30s to local edge</span>
            </div>

            <div className="space-y-3">
              {mockVersions.map((ver, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{ver.version}</span>
                      <span className="text-xs text-slate-500">by {ver.author}</span>
                      <span className="text-xs text-slate-400">· {ver.timestamp}</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono font-medium">{ver.diff}</p>
                  </div>

                  <Button
                    onClick={() => addToast({ title: `Rolled back to ${ver.version}!`, type: "success" })}
                    variant="outline"
                    className="py-1.5 px-3 text-xs text-slate-700 border-slate-300 hover:bg-white shrink-0 rounded-xl"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Revert
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
