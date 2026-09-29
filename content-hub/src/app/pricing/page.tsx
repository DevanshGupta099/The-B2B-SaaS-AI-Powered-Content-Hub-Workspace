"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const plans = [
  {
    name: "Free",
    monthly: 0,
    description: "Explore the governed AI workspace with basic atomization.",
    badge: "Free Forever",
    features: [
      "1 Team Workspace",
      "Up to 3 Members",
      "10,000 AI Tokens / mo",
      "Basic Content Atomizer",
      "Standard Brand Kit"
    ]
  },
  {
    name: "Starter",
    monthly: 39,
    description: "For high-velocity content marketers scaling multi-channel output.",
    badge: "Popular for Creators",
    features: [
      "3 Team Workspaces",
      "Up to 10 Members",
      "100,000 AI Tokens / mo",
      "Full Multi-Channel Atomizer",
      "Custom AI Agents Studio",
      "Social Media Publishing Queue"
    ]
  },
  {
    name: "Pro",
    monthly: 99,
    description: "For established marketing teams requiring deterministic governance & CMS sync.",
    badge: "Most Popular",
    featured: true,
    features: [
      "Unlimited Workspaces",
      "Up to 25 Members",
      "500,000 AI Tokens / mo",
      "Live Brand Voice Linter",
      "SEO Intelligence & SERP Scoreboard",
      "Native Webflow & HubSpot Sync",
      "External Client & Legal Portals"
    ]
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "For corporate marketing orgs needing custom models, SSO, and dedicated SLAs.",
    badge: "Custom SLA",
    features: [
      "Unlimited Members & Seats",
      "Unlimited / Zero-Markup Tokens",
      "SOC2 Type II Audit Reports",
      "SAML SSO & Okta SCIM Provisioning",
      "Zero AI Data Retention Guarantee",
      "Dedicated Customer Success Manager"
    ]
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string) => {
    if (planName === "Enterprise") {
      window.location.href = "/demo";
      return;
    }
    const planId = planName.toLowerCase() === "pro" ? "pro" : "starter";
    setLoadingPlan(planName);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle: annual ? "annual" : "monthly"
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = "/signup";
      }
    } catch {
      window.location.href = "/signup";
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <MarketingShell>
      <main className="space-y-20 pb-28">
        
        <MarketingHero
          eyebrow="Transparent SaaS Pricing"
          title="Predictable Pricing for Governed Content Velocity"
          description="Zero-markup token models, transparent seat scaling, and enterprise governance built in from day one."
        />

        {/* Pricing Toggle */}
        <section className="mx-auto max-w-7xl px-5">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !annual ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  annual ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const price = plan.monthly === null 
                ? "Custom" 
                : `$${annual ? Math.round(plan.monthly * 0.8) : plan.monthly}`;

              return (
                <div
                  key={plan.name}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                    plan.featured
                      ? "bg-white border-2 border-indigo-600 shadow-2xl shadow-indigo-600/10 relative scale-105"
                      : "glass-panel-interactive bg-white"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#020617] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      Recommended
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-xl font-bold text-slate-950">{plan.name}</h3>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {plan.badge}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading text-4xl font-extrabold text-slate-950">{price}</span>
                        {plan.monthly !== null && (
                          <span className="text-xs text-slate-500 font-medium">/ month</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Features</p>
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleCheckout(plan.name)}
                      disabled={loadingPlan === plan.name}
                      className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        plan.featured
                          ? "bg-[#020617] hover:bg-slate-800 text-white shadow-md"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                      }`}
                    >
                      {loadingPlan === plan.name 
                        ? "Redirecting..." 
                        : (plan.name === "Enterprise" ? "Contact Enterprise Sales" : "Get Started Now")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
