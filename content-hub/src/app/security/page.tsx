"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Server, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const securityFeatures = [
  {
    icon: Lock,
    title: "Zero AI Data Retention Guarantee",
    description: "Your prompts, source documents, and generated drafts are never used to train public foundational AI models. Workspace data remains strictly private."
  },
  {
    icon: ShieldCheck,
    title: "SOC2 Type II & ISO 27001 Certified",
    description: "Independently audited controls across data security, confidentiality, availability, and privacy protocols."
  },
  {
    icon: Key,
    title: "SAML 2.0 SSO & SCIM Provisioning",
    description: "Integrate seamlessly with Okta, Google Workspace, Azure AD, and OneLogin for centralized access management."
  },
  {
    icon: Server,
    title: "End-to-End Encryption in Transit & Rest",
    description: "All document communications are encrypted with TLS 1.3 in transit and AES-256 encryption at rest."
  },
  {
    icon: FileCheck,
    title: "Immutable Compliance & Review Audit Trails",
    description: "Every generation, brand linter score, and client approval timestamp is recorded in an exportable audit ledger."
  },
  {
    icon: Sparkles,
    title: "Deterministic Brand Voice Enforcement",
    description: "Built-in guardrails prevent unauthorized claims and proprietary leaks before drafts are published to CMS or social endpoints."
  }
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      <main className="space-y-20 pb-28">
        
        <MarketingHero
          eyebrow="Security & Governance"
          title="Enterprise-Grade AI Security You Can Trust"
          description="Built from the ground up for regulated B2B enterprises requiring strict data privacy, compliance auditing, and access control."
        />

        {/* 3D Security Shield Visual Asset Embed */}
        <section className="mx-auto max-w-5xl px-5">
          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-2xl relative group bg-white">
            <img 
              src="/nexus-governance-3d.jpg" 
              alt="Nexus 3D Security and Brand Governance Engine" 
              className="w-full h-auto object-cover max-h-[440px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-white bg-emerald-600/90 border border-emerald-400 px-3 py-1.5 rounded-full backdrop-blur-md">
                Continuous Automated Compliance Monitoring
              </span>
              <span className="text-xs font-semibold text-white">
                Encrypted with TLS 1.3 & AES-256
              </span>
            </div>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((sec, i) => (
              <div key={i} className="glass-panel-interactive p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <sec.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-950">{sec.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{sec.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-5 text-center">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 space-y-5 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30">
            <h2 className="font-heading text-2xl font-bold text-slate-950">Need a Security Review or Custom DPA?</h2>
            <p className="text-slate-600 text-xs max-w-md mx-auto">
              Our compliance team provides SOC2 Type II reports, penetration testing summaries, and custom enterprise Data Processing Agreements.
            </p>
            <div className="pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#020617] text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md"
              >
                Request Security Package →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
