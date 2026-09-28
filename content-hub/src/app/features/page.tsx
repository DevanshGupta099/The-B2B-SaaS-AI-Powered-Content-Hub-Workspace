"use client";

import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Layers, 
  SearchCode, 
  Send, 
  Building2, 
  Globe, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Sliders,
  FileText
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const modules = [
  {
    id: "atomizer",
    icon: Layers,
    title: "Content Atomizer & Repurposer",
    badge: "1-to-Many Engine",
    description: "Transform 1 core document or whitepaper into 6+ platform-tailored formats simultaneously (LinkedIn, X Thread, Newsletter, Video Script, Executive Brief).",
    href: "/dashboard/repurpose",
    highlights: ["Live character/word limit meters", "Grounded in Brand Kit guardrails", "One-click batch export"]
  },
  {
    id: "agents",
    icon: Cpu,
    title: "Autonomous Custom Agents",
    badge: "Specialized Fleet",
    description: "Deploy dedicated AI assistants for Technical Ghostwriting, Demand Gen Copy, and PR Comms with fine-tuned temperature and custom system instructions.",
    href: "/dashboard/agents",
    highlights: ["Temperature sliders (0.1–1.0)", "Linked knowledge bases", "One-click prompt presets"]
  },
  {
    id: "seo",
    icon: SearchCode,
    title: "SEO & Search Intelligence",
    badge: "Real-Time Scoring",
    description: "Score drafts in real-time against top ranking search competitors, optimize keyword density, and capture Google featured snippets with PAA questions.",
    href: "/dashboard/seo",
    highlights: ["Live 0-100 content scoreboard", "Top 3 competitor SERP comparison", "People Also Ask injection"]
  },
  {
    id: "publish",
    icon: Send,
    title: "Publishing & Distribution Hub",
    badge: "Native CMS Sync",
    description: "Direct 1-click publishing to Webflow, WordPress, HubSpot, Substack, LinkedIn, and Twitter with auto-appended UTM tracking.",
    href: "/dashboard/publish",
    highlights: ["Automated UTM parameters", "Scheduled calendar queue", "Live verification URLs"]
  },
  {
    id: "brandkit",
    icon: ShieldCheck,
    title: "Brand Kit & Real-Time Linter",
    badge: "Deterministic Safeguards",
    description: "Enforce consistent brand voice guidelines, target buyer personas, and forbidden buzzwords across every AI completion.",
    href: "/dashboard/brand-kit",
    highlights: ["Live buzzword linter testbench", "Target ICP persona builder", "Centralized knowledge grounding"]
  },
  {
    id: "clientportal",
    icon: Building2,
    title: "Stakeholder & Legal Portal",
    badge: "Magic Link Review",
    description: "Share friction-free review links with external clients, partner brands, and legal counsel with digital approval sign-off stamps.",
    href: "/dashboard/client-portal",
    highlights: ["Zero login seat friction", "Immutable sign-off audit log", "Threaded feedback stream"]
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <main className="space-y-20 pb-28">
        
        <MarketingHero
          eyebrow="Platform Capabilities"
          title="The Complete B2B Content Operating System"
          description="Nexus replaces disconnected writing tools, asset folders, approval threads, and spreadsheets with one AI-powered system."
        />

        {/* Feature Modules Grid */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div 
                key={mod.id}
                className="glass-panel-interactive p-8 rounded-3xl space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <mod.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-slate-950">{mod.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{mod.description}</p>

                  <div className="space-y-2 pt-2">
                    {mod.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={mod.href}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-between group"
                  >
                    <span>Launch in Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview Banner */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 relative overflow-hidden space-y-6 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-950">
                Ready to experience the full platform?
              </h2>
              <p className="text-slate-600 text-sm">
                Explore all modules with simulated data in the interactive Nexus workspace.
              </p>
            </div>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#020617] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Open Nexus Workspace →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
