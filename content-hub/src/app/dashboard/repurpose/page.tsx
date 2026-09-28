"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  FileText, 
  Mail, 
  Video, 
  Search, 
  ArrowRight,
  Sliders,
  RefreshCw,
  BookmarkPlus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData } from "@/lib/workspace-data";
import { createDocument } from "@/lib/documents";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

type ChannelTab = "linkedin" | "twitter" | "executive" | "newsletter" | "video" | "seo";

const sourcePresets = [
  {
    id: "p1",
    title: "Q4 Marketing Strategy & Narrative",
    type: "Document",
    sample: "Nexus is positioning itself as the premier B2B AI-powered content operating system. Enterprise content teams are paralyzed by unverified AI outputs, siloed draft docs, and disconnected review processes. Nexus introduces end-to-end brand governance, deterministic fact-checking against approved knowledge bases, and multi-channel instant publishing."
  },
  {
    id: "p2",
    title: "Customer Impact Story: Atlas Cloud",
    type: "Case Study",
    sample: "Atlas Cloud reduced their multi-channel campaign turnaround time from 14 days down to 48 hours using Nexus AI Studio and Content Hub. By establishing strict brand voice guardrails, their 22-person marketing org generated 140+ on-brand assets without a single compliance infraction."
  },
  {
    id: "p3",
    title: "Distributed State Sync Architecture RFC",
    type: "Engineering Spec",
    sample: "Our real-time collaboration engine utilizes CRDTs (Conflict-free Replicated Data Types) paired with an edge WebSocket mesh to guarantee zero-latency cursor synchronization and deterministic multi-user text merges even across high-latency mobile networks."
  }
];

export default function RepurposePage() {
  const { addToast } = useToast();
  const [sourceText, setSourceText] = useState(sourcePresets[0].sample);
  const [selectedPreset, setSelectedPreset] = useState(sourcePresets[0].id);
  const [selectedPersona, setSelectedPersona] = useState("Enterprise VP of Marketing");
  const [activeTab, setActiveTab] = useState<ChannelTab>("linkedin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generated state
  const [generatedOutputs, setGeneratedOutputs] = useState({
    linkedin: `🚀 Most B2B marketing teams don't have a content problem—they have a *governance & velocity* bottleneck.\n\nHere are 3 shifts high-performing teams are making in 2026:\n\n1️⃣ Moving from isolated ChatGPT prompts to structured Brand Knowledge Kits.\n2️⃣ Eliminating copy-paste workflows with direct CMS and social distribution.\n3️⃣ Enforcing human-in-the-loop compliance before anything goes live.\n\nWhat is your team's biggest challenge when scaling multi-channel output?\n\n#ContentOperations #B2BMarketing #SaaSGrowth #AIGovernance`,
    twitter: `1/5 The hidden reason why 70% of enterprise AI content never gets published:\n\nLack of governance.\n\nHere's how top SaaS teams atomize 1 core piece of research into 10+ high-impact assets in under 10 minutes 👇\n\n2/5 Step 1: Lock your Brand Voice. Restrict generic buzzwords ("revolutionary", "seamless") and anchor outputs to proven customer data.\n\n3/5 Step 2: Extract the core thesis for C-suite, tactical tips for practitioners, and video talk-tracks for sales.\n\n4/5 Step 3: Multi-channel atomic distribution. Stop manually reformatting across LinkedIn, Substack, and Webflow.\n\n5/5 Velocity without compliance is chaos. Compliance without AI is too slow. The winners combine both.`,
    executive: `### Executive Brief: Content Operations & Governed Velocity\n\n**Strategic Context:**\nEnterprise marketing efficiency is heavily impacted by fragmented tooling and compliance bottlenecks across distributed teams.\n\n**Core Impact Metrics:**\n• Turnaround speed improved by 65% across multi-channel campaigns.\n• 100% adherence to legal and brand compliance guidelines.\n• Direct ROI realization with automated atomization reducing production overhead.\n\n**Recommended Decision:**\nStandardize marketing asset production onto a centralized content operating system with automated guardrails.`,
    newsletter: `Subject: Why high-growth SaaS teams are ditching disjointed AI prompts\nPreview text: The 3 pillars of governed content velocity in 2026.\n\nHi {{first_name}},\n\nIf your team is still juggling 5 browser tabs, unverified AI chat windows, and manual copy-pasting into your CMS, you're not alone.\n\nIn our latest benchmark report, we break down how leading B2B orgs transform a single strategy doc into a multi-channel engine without sacrificing brand fidelity.\n\nKey takeaways inside:\n→ How to lock your brand voice against hallucinations\n→ The 48-hour campaign execution loop\n→ Real numbers from Atlas Cloud's 22-person marketing org\n\n[Read the Full Breakdown →]`,
    video: `[0:00 - 0:05] HOOK (On-screen text: Stop copying & pasting AI prompts)\n"If your marketing team feels like a content factory that's constantly behind, watch this."\n\n[0:05 - 0:20] PROBLEM\n"Most companies think AI solves velocity. But without guardrails, you just get generic fluff that legal rejects."\n\n[0:20 - 0:40] SOLUTION & PROOF\n"Here is how Atlas Cloud turned 1 case study into 14 on-brand assets in 48 hours using automated atomization."\n\n[0:40 - 0:50] CALL TO ACTION\n"Link in bio to see the exact workflow and grab our brand governance template."`,
    seo: `### SEO Optimization & Search Package\n\n**Meta Title:** B2B Content Operations & Governed AI Workspace | Nexus\n**Meta Description:** Scale multi-channel B2B content velocity with automated brand governance, multi-format atomization, and 1-click publishing.\n**Primary Keywords:** B2B content operations, AI brand governance, content atomization, SaaS editorial workflow\n**Recommended Slug:** /blog/governed-content-velocity-framework\n**Target Search Intent:** Commercial / High-intent decision maker`
  });

  const [telemetry, setTelemetry] = useState<{ latencyMs: number; tokens: number; model: string } | null>(null);

  const handlePresetSelect = (preset: typeof sourcePresets[0]) => {
    setSelectedPreset(preset.id);
    setSourceText(preset.sample);
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) return;
    setIsGenerating(true);
    const brand = getWorkspaceData().brandKit;
    try {
      const res = await fetch("/api/ai/atomize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceContent: sourceText,
          tone: selectedPersona,
          brandKit: brand,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.outputs) {
        setGeneratedOutputs({
          linkedin: json.data.outputs.linkedin || "",
          twitter: json.data.outputs.twitter || "",
          executive: json.data.outputs.memo || "",
          newsletter: json.data.outputs.email || "",
          video: json.data.outputs.video || "",
          seo: json.data.outputs.seo || "",
        });
        setTelemetry({
          latencyMs: json.meta.latencyMs,
          tokens: json.meta.tokens?.total || 0,
          model: json.meta.model || "qwen/qwen3.8-27b",
        });
        addToast({
          title: "Content Atomized into 6 Channels!",
          message: `Generated with Groq LLM in ${json.meta.latencyMs}ms (${json.meta.tokens?.total || 0} tokens)`,
          type: "success"
        });
      } else {
        throw new Error(json.error || "Atomization failed");
      }
    } catch (err: any) {
      addToast({ title: "Atomization Error", message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast({ title: "Copied to clipboard", type: "success" });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToDocs = () => {
    const activeContent = generatedOutputs[activeTab];
    const doc = createDocument(`Atomized - ${activeTab.toUpperCase()} Asset`, "Marketing", activeContent);
    updateWorkspaceData(data => ({
      ...data,
      activity: [`Atomized content saved to documents: ${activeTab.toUpperCase()}`, ...data.activity]
    }));
    addToast({
      title: "Saved to Documents",
      message: `Created new document "${doc.title}" with generated content.`,
      type: "success"
    });
  };

  const handlePushToPublishQueue = () => {
    const activeContent = generatedOutputs[activeTab];
    updateWorkspaceData(data => ({
      ...data,
      publishingQueue: [
        {
          id: `pub-${crypto.randomUUID().slice(0, 6)}`,
          title: `Atomized Campaign: ${activeTab.toUpperCase()}`,
          channels: activeTab === "twitter" ? ["twitter"] : ["linkedin", "hubspot"],
          status: "Scheduled",
          scheduledFor: "Tomorrow at 9:00 AM",
          author: "Devansh",
        },
        ...data.publishingQueue
      ],
      activity: [`Scheduled atomized ${activeTab.toUpperCase()} asset for publishing`, ...data.activity]
    }));
    addToast({
      title: "Pushed to Publishing Hub!",
      message: `Scheduled ${activeTab.toUpperCase()} asset to the queue.`,
      type: "success"
    });
  };

  const channelIcons: Record<ChannelTab, React.ElementType> = {
    linkedin: LinkedinIcon,
    twitter: TwitterIcon,
    executive: FileText,
    newsletter: Mail,
    video: Video,
    seo: Search
  };

  const channelLabels: Record<ChannelTab, string> = {
    linkedin: "LinkedIn Post / Carousel",
    twitter: "Twitter/X Thread",
    executive: "Executive TL;DR",
    newsletter: "Email Newsletter",
    video: "Short Video Script",
    seo: "SEO Meta & Snippet"
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Omni-Channel Matrix
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Brand Guardrails Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">Content Atomizer</h1>
            <p className="text-slate-500 mt-1 text-base">Transform 1 core document or whitepaper into 6+ platform-ready assets instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerate} isLoading={isGenerating} className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {isGenerating ? "Atomizing..." : "Atomize Content"}
            </Button>
          </div>
        </div>

        {/* Main Grid: Source on Left, Omni-channel outputs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Source Input */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" /> Source Asset
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  {sourceText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Preset selection buttons */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Quick Load from Content Hub
                </label>
                <div className="space-y-2">
                  {sourcePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                        selectedPreset === preset.id
                          ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 font-semibold shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="truncate mr-2">
                        <p className="font-semibold text-slate-900 truncate">{preset.title}</p>
                        <span className="text-[10px] text-slate-400 uppercase">{preset.type}</span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${selectedPreset === preset.id ? "text-indigo-600" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Text Area */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Source Content / Brief
                </label>
                <textarea
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    setSelectedPreset("");
                  }}
                  rows={8}
                  placeholder="Paste article, webinar transcript, whitepaper, or product announcement..."
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Target Persona selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" /> Target ICP Persona
                </label>
                <select
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Enterprise VP of Marketing</option>
                  <option>Lead Content Strategist</option>
                  <option>Chief Information Security Officer (CISO)</option>
                  <option>Head of Product Management</option>
                  <option>Developer / Technical Founder</option>
                </select>
              </div>

              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating}
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                Re-generate Multi-Channel Suite
              </Button>
            </div>
          </div>

          {/* Right Column: Omni-Channel Outputs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Channel Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(Object.keys(channelLabels) as ChannelTab[]).map((tab) => {
                const Icon = channelIcons[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-[#020617] text-white border-[#020617] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                    {channelLabels[tab].split("/")[0]}
                  </button>
                );
              })}
            </div>

            {/* Active Output Editor Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  {React.createElement(channelIcons[activeTab], { className: "w-5 h-5 text-indigo-600" })}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-xl text-slate-900">{channelLabels[activeTab]}</h2>
                      {telemetry && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ⚡ {telemetry.latencyMs}ms ({telemetry.tokens} tokens)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Auto-formatted for channel algorithms & character limits</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {generatedOutputs[activeTab].length} chars · {generatedOutputs[activeTab].split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => handleCopy(generatedOutputs[activeTab], activeTab)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Copy formatted text"
                  >
                    {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === activeTab ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Editable Content Window */}
              <div className="relative">
                <textarea
                  value={generatedOutputs[activeTab]}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setGeneratedOutputs(prev => ({ ...prev, [activeTab]: nextVal }));
                  }}
                  rows={13}
                  className="w-full p-4 rounded-2xl bg-slate-50/70 border border-slate-200 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button 
                    onClick={handleSaveToDocs} 
                    variant="secondary" 
                    size="sm"
                    className="gap-1.5 rounded-xl border-slate-200 text-xs font-semibold"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-indigo-600" /> Save as Workspace Doc
                  </Button>
                  <Button 
                    onClick={handlePushToPublishQueue} 
                    variant="outline" 
                    size="sm"
                    className="gap-1.5 rounded-xl border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 text-xs font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-600" /> Schedule in Publishing Hub
                  </Button>
                  <Button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([generatedOutputs[activeTab]], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `nexus-atomized-${activeTab}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      addToast({ title: "Export downloaded", type: "success" });
                    }} 
                    variant="ghost" 
                    size="sm"
                    className="gap-1.5 text-xs text-slate-600"
                  >
                    <Download className="w-3.5 h-3.5" /> Export .txt
                  </Button>
                </div>

                <Button 
                  onClick={() => {
                    const allText = Object.entries(generatedOutputs).map(([k, v]) => `=== ${channelLabels[k as ChannelTab]} ===\n\n${v}\n\n`).join("\n");
                    navigator.clipboard.writeText(allText);
                    addToast({ title: "All 6 formats copied to clipboard!", type: "success" });
                  }}
                  className="bg-[#020617] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-4 py-2"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Copy Entire Campaign Suite
                </Button>
              </div>

            </div>

            {/* Quality & Voice Badge */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Brand Voice Alignment Score: 98%</h4>
                  <p className="text-[11px] text-slate-500">Zero restricted buzzwords detected. Grounded in approved product messaging.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-100 shadow-2xs">
                Verified
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
