"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Cpu, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const solutions = [
  {
    title: "For Enterprise Marketing Teams",
    icon: Building2,
    role: "CMOs & VP of Content",
    description: "Eliminate brand voice drift and compliance review bottlenecks across distributed writer teams.",
    metrics: "65% faster time-to-market · Zero unauthorized claims",
    features: [
      "Centralized Brand Voice Linter with real-time guardrails",
      "Multi-stage approval workflows for Legal and Brand leads",
      "Full audit trail logs and SOC2 compliance guarantees"
    ]
  },
  {
    title: "For Developer Relations & Technical Teams",
    icon: Cpu,
    role: "DevRel Leads & Staff Engineers",
    description: "Translate complex system architecture and API specs into developer-friendly blogs and documentation.",
    metrics: "4x increase in technical blog cadence",
    features: [
      "Specialized Technical Ghostwriter AI Agent",
      "Native markdown code block and syntax highlighting support",
      "Direct grounding in internal RFCs and GitHub documentation"
    ]
  },
  {
    title: "For Growth & Demand Gen Marketers",
    icon: TrendingUp,
    role: "Demand Gen & Paid Media Leads",
    description: "Atomize top-of-funnel research into 10+ high-converting ads, email nurture tracks, and social hooks.",
    metrics: "3.4x pipeline attribution ROI",
    features: [
      "1-Click Content Atomizer for LinkedIn, X, and Email",
      "Automated UTM parameter generation for multi-channel tracking",
      "Direct publishing into HubSpot sequences and Webflow CMS"
    ]
  },
  {
    title: "For B2B Content Agencies & Studios",
    icon: Layers,
    role: "Agency Founders & Account Directors",
    description: "Manage multiple client brands with dedicated Brand Kits, white-labeled review links, and zero seat costs.",
    metrics: "Reclaim $42,800+ in manual reformatting overhead",
    features: [
      "Frictionless Client Portals with magic link access",
      "Digital approval stamps for client stakeholder sign-offs",
      "Multi-workspace separation for distinct enterprise clients"
    ]
  }
];

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <main className="space-y-20 pb-28">
        
        <MarketingHero
          eyebrow="Tailored Solutions"
          title="Engineered for High-Stakes B2B Content Operations"
          description="Whether you run an enterprise marketing organization, a DevRel team, or a fast-paced agency, Nexus adapts to your workflows."
        />

        {/* Solutions Grid */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((sol, i) => (
              <div 
                key={i}
                className="glass-panel-interactive p-8 sm:p-10 rounded-3xl space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <sol.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      {sol.role}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-slate-950">{sol.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{sol.description}</p>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Impact: {sol.metrics}</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {sol.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all"
                  >
                    <span>Request Custom Workflow Demo</span>
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
