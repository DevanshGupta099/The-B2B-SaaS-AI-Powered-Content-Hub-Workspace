"use client";

import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Download, 
  TrendingUp,
  Layers,
  ShieldCheck
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const resources = [
  {
    type: "Benchmark Report",
    title: "State of B2B Content Operations & Governed AI 2026",
    description: "An analysis of 450+ SaaS marketing teams: how high-growth organizations scale output by 65% while enforcing brand compliance.",
    readTime: "12 min read",
    tag: "Industry Benchmark"
  },
  {
    type: "Playbook",
    title: "The 1-to-10 Content Atomization Framework",
    description: "The complete step-by-step playbook for extracting LinkedIn carousels, X threads, newsletters, and video scripts from single whitepapers.",
    readTime: "8 min read",
    tag: "Tactical Guide"
  },
  {
    type: "Whitepaper",
    title: "Enterprise Brand Voice Guardrails & Deterministic AI",
    description: "Technical architecture explaining how vector grounding and regex linters eliminate AI hallucinations across distributed writer fleets.",
    readTime: "15 min read",
    tag: "Technical Spec"
  },
  {
    type: "Customer Study",
    title: "How Atlas Cloud Reduced Turnaround Time from 14 Days to 48 Hours",
    description: "Full case breakdown of Atlas Cloud's 22-person marketing organization deploying Nexus across Webflow and HubSpot.",
    readTime: "6 min read",
    tag: "Case Study"
  }
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main className="space-y-20 pb-28">
        
        <MarketingHero
          eyebrow="Knowledge & Frameworks"
          title="Content Operations Intelligence & Playbooks"
          description="Proven playbooks, research reports, and technical guides to help modern B2B marketing teams scale governed velocity."
        />

        {/* Resources Grid */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((res, i) => (
              <div 
                key={i}
                className="glass-panel-interactive p-8 sm:p-10 rounded-3xl space-y-6 flex flex-col justify-between bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      {res.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{res.readTime}</span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-slate-950">{res.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{res.tag}</span>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
