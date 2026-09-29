"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  SearchCode, 
  Send, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  Clock, 
  DollarSign, 
  Building2, 
  Globe, 
  FileText,
  Play,
  Share2,
  ChevronDown,
  Wand2,
  Sliders,
  Flame,
  Radio,
  RefreshCw,
  Eye
} from "lucide-react";
import { MarketingShell } from "@/components/MarketingShell";
import { useToast } from "@/components/ui/ToastNotifications";

// Interactive Demo Briefs
const demoBriefs = [
  {
    id: "launch",
    title: "Product Launch: Nexus 3.0",
    badge: "Campaign Kit",
    prompt: "Announce Nexus 3.0 Governed Content Operating System with zero AI data retention and native CMS sync.",
    outputs: {
      linkedin: "🚀 Today we're launching Nexus 3.0: The Governed Multi-Channel Content Engine for B2B SaaS.\n\nMost content marketing teams face two extremes:\n1. Move fast with generic AI and risk brand drift.\n2. Move slow with manual review loops and lose market momentum.\n\nNexus 3.0 solves this:\n✅ Deterministic Brand Voice Linters\n✅ 1-to-Many Multi-Channel Atomizer\n✅ 1-Click Native Webflow & HubSpot Sync\n\nScale output by 4x without scaling compliance risk. #ContentOperations #B2BGrowth #ProductLaunch",
      twitter: "1/5 Announcing Nexus 3.0: Turn 1 core brief into 10+ live campaign assets in under 48 hours 🧵👇\n\n2/5 Stop copy-pasting between ChatGPT, Notion, and Buffer.\n3/5 Built-in Brand Kit guardrails prevent AI hallucinations before drafts reach review.\n4/5 Native 1-click sync to Webflow, HubSpot, and LinkedIn.\n5/5 Start governed trials free at nexus.ai",
      email: "Subject: Introducing Nexus 3.0: Scale B2B campaigns 4x faster\n\nHi {{first_name}},\n\nWe just released Nexus 3.0 to help high-growth SaaS marketing teams plan, brand-check, and distribute multi-channel content with zero compliance risk.\n\n[Explore What's New in Nexus 3.0 →]"
    }
  },
  {
    id: "casestudy",
    title: "Atlas Cloud ROI Story",
    badge: "Case Study",
    prompt: "Extract key metrics from Atlas Cloud study: 65% faster turnaround time and 140+ on-brand assets produced.",
    outputs: {
      linkedin: "💡 How Atlas Cloud cut B2B campaign turnaround from 14 days to 48 hours:\n\n1️⃣ Replaced ad-hoc prompts with locked Brand Knowledge Kits.\n2️⃣ Automated 1-to-10 multi-channel atomization.\n3️⃣ Magic link client review portals with digital approval stamps.\n\nRead the full customer breakdown. #B2BMarketing #ContentVelocity",
      twitter: "1/4 How does a 22-person marketing team produce 140+ on-brand assets in 48h?\n\nHere is the exact playbook @AtlasCloud used with Nexus 👇\n\n2/4 Step 1: Ground all generation in locked Brand Guidelines.\n3/4 Step 2: Push approved drafts directly to Webflow CMS.\n4/4 Velocity + Governance = Unstoppable Growth.",
      email: "Subject: Case Study: How Atlas Cloud 3x'd content velocity\n\nHi marketing team,\n\nDiscover how Atlas Cloud reduced campaign production cycles from 14 days down to 48 hours.\n\n[Read Atlas Cloud Case Study →]"
    }
  },
  {
    id: "technical",
    title: "Engineering RFC",
    badge: "Technical Blog",
    prompt: "Turn internal RFC on CRDT state synchronization into a developer-friendly engineering blog.",
    outputs: {
      linkedin: "⚡ Engineering Deep Dive: How Nexus achieves zero-latency multi-cursor document sync across global edge regions using CRDT state replication.\n\nExplore our distributed architecture RFC. #DevRel #DistributedSystems",
      twitter: "1/3 How do you sync 50+ concurrent editors with 0 merge conflicts?\n\nInside our edge WebSocket CRDT architecture 👇\n\n2/3 Deterministic state replication without central lock contention.\n3/3 Full technical spec live on Nexus Engineering Blog.",
      email: "Subject: Technical Deep-Dive: Sub-millisecond multiplayer sync\n\nHi engineers,\n\nOur latest engineering post breaks down how Nexus achieves zero-latency collaborative editing using CRDTs.\n\n[Read Architecture Spec →]"
    }
  }
];

const featureModules = [
  {
    id: "atomizer",
    title: "Omnichannel Content Atomizer",
    eyebrow: "1-to-Many Engine",
    description: "Transform 1 core document, whitepaper, or product brief into 6+ channel-ready collateral pieces simultaneously.",
    icon: Layers,
    stats: "6 Channels Auto-Generated",
    href: "/dashboard/repurpose",
    bullets: ["LinkedIn carousels & thought leadership", "Narrative X threads with viral hooks", "Email nurture sequences & video scripts"]
  },
  {
    id: "brandkit",
    title: "Brand Voice & Rule Linter",
    eyebrow: "Deterministic Guardrails",
    description: "Enforce tone rules, required disclaimers, and forbidden buzzwords across every AI output before review.",
    icon: ShieldCheck,
    stats: "0% Brand Drift Infractions",
    href: "/dashboard/brand-kit",
    bullets: ["Real-time buzzword detection meter", "Linked company knowledge & vector memory", "Target buyer persona customization"]
  },
  {
    id: "agents",
    title: "Autonomous Custom AI Agents",
    eyebrow: "Specialized Fleet",
    description: "Deploy purpose-built AI agents for Technical Ghostwriting, Demand Gen Copy, and PR Communications.",
    icon: Cpu,
    stats: "Multi-Model Switching",
    href: "/dashboard/agents",
    bullets: ["Groq Qwen 3.8-27B & Llama 3.3-70B LPUs", "Custom system instructions & temperature sliders", "Reusable recipe prompt blueprints"]
  },
  {
    id: "publish",
    title: "1-Click CMS & Social Syndication",
    eyebrow: "Native Distribution",
    description: "Publish approved collateral directly to your website CMS and social channels with automated UTM tracking.",
    icon: Send,
    stats: "Instant Webflow & HubSpot Push",
    href: "/dashboard/publish",
    bullets: ["Webflow, WordPress, Ghost, and HubSpot CMS", "LinkedIn Company Pages and Twitter/X", "Automated UTM campaign tagging"]
  },
  {
    id: "clientportal",
    title: "Frictionless Client Review Portal",
    eyebrow: "Magic Link Approvals",
    description: "Share dedicated review links with external stakeholders, partner brands, and legal counsel with zero seat costs.",
    icon: Building2,
    stats: "Digital Approval Stamps",
    href: "/dashboard/client-portal",
    bullets: ["Zero login friction for external reviewers", "Immutable sign-off audit timestamps", "Threaded inline feedback stream"]
  }
];

const comparisonPoints = [
  { feature: "Deterministic Brand Voice Guardrails", nexus: "Native real-time regex & semantic linter", legacy: "Manual spot-checks & guesswork" },
  { feature: "1-Click Multi-Channel Atomizer (1 to 10+)", nexus: "Simultaneous 6+ format generation", legacy: "Copy-pasting across 5 browser tabs" },
  { feature: "Direct CMS & Social Syndication", nexus: "Webflow, HubSpot, WordPress, LinkedIn native", legacy: "Manual uploads or fragile Zapier zaps" },
  { feature: "External Stakeholder & Legal Portal", nexus: "Free magic link review + digital sign-off stamps", legacy: "Expensive per-seat licenses or PDF emails" },
  { feature: "Real-Time SERP & Search Intelligence", nexus: "Built-in competitor scoreboard & PAA schema", legacy: "Separate $200/mo SEO subscriptions" },
  { feature: "Enterprise SOC2 & Zero AI Retention", nexus: "100% private workspace data retention", legacy: "Generic LLMs train on your private data" },
];

const faqs = [
  {
    q: "How does Nexus guarantee AI outputs won't hallucinate or violate brand guidelines?",
    a: "Nexus uses deterministic grounding against your approved Brand Kit and knowledge documents. Every generation is checked against forbidden buzzwords, tone rules, and cited claims before rendering."
  },
  {
    q: "Can external clients or legal teams review content without paid seats?",
    a: "Yes! The Client Portal generates secure, white-labeled magic links where stakeholders can comment and digitally sign off with zero login friction and zero seat costs."
  },
  {
    q: "Which CMS and social platforms are natively supported for publishing?",
    a: "Nexus natively connects to Webflow, WordPress, HubSpot, Substack, LinkedIn Company Pages, and Twitter/X with automated UTM campaign tagging."
  },
  {
    q: "Is our proprietary company data used to train public AI models?",
    a: "Never. Nexus is enterprise-grade with zero data retention agreements. Your company knowledge and generated drafts remain 100% private to your workspace."
  }
];

export default function Home() {
  const { addToast } = useToast();
  
  // Interactive Hero Studio State
  const [activeBriefIdx, setActiveBriefIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"linkedin" | "twitter" | "email">("linkedin");
  const [copied, setCopied] = useState(false);

  // Active Feature Tab
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState(12);
  const [monthlyAssets, setMonthlyAssets] = useState(40);

  // Quick Headline Generator State
  const [headlineTopic, setHeadlineTopic] = useState("Enterprise AI Content Governance");
  const [generatedHeadline, setGeneratedHeadline] = useState("The 48-Hour Content Engine: How B2B Leaders Scale Output Without Brand Drift");
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);

  // FAQ Toggle
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeBrief = demoBriefs[activeBriefIdx];
  const activeFeature = featureModules[activeFeatureIdx];

  // Dynamic ROI calculation
  const hoursSavedPerMonth = teamSize * monthlyAssets * 1.5;
  const annualDollarsSaved = Math.round(hoursSavedPerMonth * 75 * 12);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({ title: "Copied live content snippet!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateQuickHeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headlineTopic.trim()) return;
    setIsGeneratingHeadline(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate 1 punchy, high-converting, authoritative B2B SaaS headline for the topic: "${headlineTopic}". Return ONLY the single headline string, no quotation marks or preamble.`,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setGeneratedHeadline(data.text.trim().replace(/^["']|["']$/g, ""));
        addToast({ title: "Generated headline with Groq AI!", type: "success" });
      }
    } catch {
      setGeneratedHeadline(`How High-Growth SaaS Teams Scale ${headlineTopic} in 48 Hours with Zero Compliance Risk`);
      addToast({ title: "Generated headline!", type: "success" });
    } finally {
      setIsGeneratingHeadline(false);
    }
  };

  return (
    <MarketingShell>
      <main className="space-y-24 sm:space-y-32 pb-24">
        
        {/* ========================================================================= */}
        {/* 1. BRAND-NEW LIGHTWEIGHT INTERACTIVE HERO SECTION (ZERO LAG)             */}
        {/* ========================================================================= */}
        <section className="relative mx-auto max-w-7xl px-5 pt-8 sm:pt-16 lg:pt-20 space-y-12">
          
          {/* Hero Header Copy */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen Enterprise Content Operating System</span>
              <span className="text-indigo-300">|</span>
              <span className="text-indigo-900 font-extrabold">v3.0 Live</span>
            </div>

            {/* Main H1 */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
              Turn 1 Core Idea into a{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Governed Multi-Channel Engine.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Nexus empowers B2B SaaS teams to plan, generate, brand-check, approve, and distribute high-impact collateral at 10x velocity with zero compliance risk.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-7 py-4 rounded-2xl text-sm font-bold text-white bg-[#020617] hover:bg-slate-800 shadow-xl shadow-slate-950/15 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="px-6 py-4 rounded-2xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-800 text-slate-800" /> Book 20-Min Demo
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> SOC2 Type II Certified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Native Webflow & HubSpot Sync</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Zero AI Data Retention</span>
            </div>

          </div>

          {/* INTERACTIVE LIVE AI COPILOT WORKSPACE CANVAS (REPLACED LAGGY 3D IMAGE) */}
          <div className="relative mx-auto max-w-5xl">
            
            {/* Ambient Background Glow (Smooth CSS only) */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />

            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              
              {/* Studio Window Title Bar */}
              <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="text-xs font-bold text-slate-300 ml-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Nexus AI Studio v3.0 · Multi-Channel Engine
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Model: <strong>Groq Qwen 3.8 27B (LPU)</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 98.4% Brand Alignment
                  </span>
                </div>
              </div>

              {/* Studio Workspace Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-slate-50/50">
                
                {/* Left Controls: Select Sample Brief (5 cols) */}
                <div className="lg:col-span-5 p-6 space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      1. Select Input Source Brief
                    </span>
                    <p className="font-heading text-base font-bold text-slate-950">
                      Ground in Approved Knowledge
                    </p>
                  </div>

                  {/* 3 Brief Cards */}
                  <div className="space-y-2">
                    {demoBriefs.map((brief, idx) => {
                      const isActive = activeBriefIdx === idx;
                      return (
                        <button
                          key={brief.id}
                          onClick={() => setActiveBriefIdx(idx)}
                          className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                            isActive
                              ? "bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600"
                              : "bg-white/80 border-slate-200 hover:bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{brief.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isActive ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {brief.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {brief.prompt}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Grounding Info Box */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-indigo-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" /> Grounded Rules
                      </span>
                      <span className="text-emerald-700 font-semibold">Zero Infractions</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 leading-relaxed">
                      All outputs strictly verified against tone rules and protected terminology.
                    </p>
                  </div>
                </div>

                {/* Right Workspace: Live Atomized Preview (7 cols) */}
                <div className="lg:col-span-7 p-6 space-y-4 bg-white flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        2. Live Atomized Output
                      </span>

                      {/* Format Selector Tabs */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {(["linkedin", "twitter", "email"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              activeTab === tab
                                ? "bg-[#020617] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {tab === "linkedin" ? "LinkedIn Post" : tab === "twitter" ? "X Thread" : "Email Sequence"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Output Text Container */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed min-h-[220px] whitespace-pre-wrap">
                      {activeBrief.outputs[activeTab]}
                    </div>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleCopy(activeBrief.outputs[activeTab])}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied to Clipboard" : "Copy Formatted Output"}
                    </button>

                    <Link
                      href="/dashboard/repurpose"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Open in Full Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>

              {/* Floating Stat Badges on Bottom */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span><strong>4.8x</strong> Faster Content Velocity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span><strong>140+</strong> Multi-Channel Assets in 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span><strong>$43,200/yr</strong> Estimated Savings</span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 2. ENTERPRISE SOCIAL PROOF & METRICS BAR                                 */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Trusted by 450+ High-Growth B2B SaaS Content Organizations
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-2 space-y-1">
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950">65%</div>
                <p className="text-xs text-slate-500 font-medium">Faster Campaign Turnaround</p>
              </div>
              <div className="p-2 space-y-1">
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-indigo-600">1.2M+</div>
                <p className="text-xs text-slate-500 font-medium">On-Brand Assets Generated</p>
              </div>
              <div className="p-2 space-y-1">
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-600">99.4%</div>
                <p className="text-xs text-slate-500 font-medium">Brand Voice Adherence</p>
              </div>
              <div className="p-2 space-y-1">
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-purple-600">0</div>
                <p className="text-xs text-slate-500 font-medium">Compliance Infractions</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MODULAR FEATURE SHOWCASE WITH SMOOTH FRAMER MOTION TABS               */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-7xl px-5 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Platform Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-950">
              Everything Your Content Engine Needs Under One Roof.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Replace 7 disconnected subscriptions with a unified, enterprise-governed workflow.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="space-y-6">
            
            {/* Tab Pill Selectors */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {featureModules.map((mod, idx) => {
                const isActive = activeFeatureIdx === idx;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveFeatureIdx(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-[#020617] text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <mod.icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{mod.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Display Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Details (6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  {activeFeature.eyebrow}
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-950">
                  {activeFeature.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {activeFeature.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  {activeFeature.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={activeFeature.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#020617] text-white text-xs font-bold hover:bg-slate-800 shadow-md transition-all"
                  >
                    <span>Launch in Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Live Simulation Mock (6 cols) */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Module Telemetry</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeFeature.stats}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Active Workflow Status</span>
                    <span className="text-indigo-600">Deterministic Guardrails Active</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    All generation buffers synced with zero latency to global edge regions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs font-semibold text-indigo-950">
                  <span>Connected to Brand Knowledge Base</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. INTERACTIVE DYNAMIC ROI & SAVINGS CALCULATOR                           */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 via-white to-purple-50/30 p-8 sm:p-12 space-y-8 shadow-xl shadow-indigo-900/5">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Interactive ROI Calculator
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-950">
                Calculate Your Team&apos;s Estimated Annual Savings
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                See how much time and agency production budget your company reclaims by automating multi-channel atomization.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              
              {/* Sliders (Left) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Slider 1: Team size */}
                <div className="space-y-2">
                  <label htmlFor="team-size-slider" className="flex justify-between text-sm font-bold text-slate-900 cursor-pointer">
                    <span>Content Creators / Writers</span>
                    <span className="text-indigo-600 font-mono text-base">{teamSize} team members</span>
                  </label>
                  <input
                    id="team-size-slider"
                    aria-label="Content Creators and Writers count slider"
                    type="range"
                    min="2"
                    max="50"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>2 creators</span>
                    <span>50 creators</span>
                  </div>
                </div>

                {/* Slider 2: Monthly Assets */}
                <div className="space-y-2">
                  <label htmlFor="monthly-assets-slider" className="flex justify-between text-sm font-bold text-slate-900 cursor-pointer">
                    <span>Monthly Core Content Assets</span>
                    <span className="text-purple-600 font-mono text-base">{monthlyAssets} assets / mo</span>
                  </label>
                  <input
                    id="monthly-assets-slider"
                    aria-label="Monthly Core Content Assets volume slider"
                    type="range"
                    min="5"
                    max="150"
                    value={monthlyAssets}
                    onChange={(e) => setMonthlyAssets(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>5 assets</span>
                    <span>150 assets</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Results Card (Right) */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6 text-center lg:text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hours Saved / Month</p>
                    <p className="font-heading text-3xl sm:text-4xl font-extrabold text-indigo-600">
                      {hoursSavedPerMonth.toLocaleString('en-US')} hrs
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Cost Savings</p>
                    <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-600">
                      ${annualDollarsSaved.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 text-left">
                    Based on an average agency reformatting rate of $75/hr and 65% faster review loops.
                  </p>
                  <Link
                    href="/pricing"
                    className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#020617] hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    View Pricing Plans →
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE LIVE HEADLINE PLAYGROUND (FAST LEAD MAGNET TOOL)          */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-5xl px-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Interactive Hook Studio
                </span>
                <h2 className="font-heading text-2xl font-bold text-slate-950 mt-1">
                  Test the B2B Viral Hook Generator
                </h2>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ⚡ Instant Live AI Scoring
              </span>
            </div>

            <form onSubmit={handleGenerateQuickHeadline} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={headlineTopic}
                onChange={(e) => setHeadlineTopic(e.target.value)}
                placeholder="Enter your topic (e.g. Enterprise AI Governance, DevRel)"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isGeneratingHeadline}
                className="px-6 py-3 rounded-xl bg-[#020617] hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isGeneratingHeadline ? "animate-spin" : ""}`} />
                {isGeneratingHeadline ? "Scoring..." : "Generate Hook"}
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <p className="font-heading text-sm sm:text-base font-bold text-slate-900">
                &ldquo;{generatedHeadline}&rdquo;
              </p>
              <button
                onClick={() => handleCopy(generatedHeadline)}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs shrink-0 font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. COMPARISON MATRIX (NEXUS VS FRAGMENTED STACK)                         */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-7xl px-5 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Why Nexus
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-950">
              Nexus vs The Fragmented Tooling Stack
            </h2>
            <p className="text-slate-600 text-sm">
              Stop stitching together ChatGPT, Notion, Buffer, and spreadsheets.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 sm:p-6">Capability</th>
                  <th className="p-4 sm:p-6 text-indigo-700 bg-indigo-50/70">Nexus Content OS</th>
                  <th className="p-4 sm:p-6 text-slate-500">Legacy Tooling Stack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {comparisonPoints.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-6 font-bold text-slate-900">{row.feature}</td>
                    <td className="p-4 sm:p-6 bg-indigo-50/30 text-indigo-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {row.nexus}
                    </td>
                    <td className="p-4 sm:p-6 text-slate-500">{row.legacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 7. INTERACTIVE FAQ ACCORDION                                             */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-4xl px-5 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-950">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">Everything you need to know about enterprise deployment and security.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i} 
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 8. HIGH-CONVERTING FINAL CALL TO ACTION                                   */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="relative rounded-3xl bg-[#020617] p-8 sm:p-16 overflow-hidden shadow-2xl text-center space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Ready to Upgrade Your Content Velocity?
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Scale Multi-Channel Output with Zero Governance Risk.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Join 450+ high-performing B2B SaaS teams running on Nexus. Get started in 2 minutes.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Start Governed Trial Free →
                </Link>
                <Link
                  href="/demo"
                  className="px-7 py-4 rounded-2xl text-sm font-semibold border border-white/25 text-white hover:bg-white/10 transition-colors"
                >
                  Schedule Executive Walkthrough
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
