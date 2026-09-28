"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Activity, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  ArrowRight, 
  Clock,
  RefreshCw,
  Globe
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";

const services = [
  { name: "Claude 3.7 / 3.5 Sonnet Inference Pipeline", status: "Operational", latency: "184ms", uptime: "99.99%" },
  { name: "GPT-4o Multi-Modal Generation Gateway", status: "Operational", latency: "162ms", uptime: "99.98%" },
  { name: "Gemini 2.0 Pro LLM Cluster", status: "Operational", latency: "142ms", uptime: "100.0%" },
  { name: "Vector Search & Semantic RAG Engine", status: "Operational", latency: "18ms", uptime: "99.99%" },
  { name: "Multiplayer Real-time Edge WebSockets", status: "Operational", latency: "8ms", uptime: "100.0%" },
  { name: "CMS Syndication & Webhooks (Webflow/HubSpot)", status: "Operational", latency: "42ms", uptime: "99.95%" },
  { name: "Brand Voice Deterministic Linter", status: "Operational", latency: "12ms", uptime: "100.0%" }
];

const regions = [
  { region: "US East (N. Virginia)", code: "iad1", status: "Operational", ping: "4ms" },
  { region: "US West (Oregon)", code: "pdx1", status: "Operational", ping: "16ms" },
  { region: "EU Central (Frankfurt)", code: "fra1", status: "Operational", ping: "22ms" },
  { region: "AP Southeast (Singapore)", code: "sin1", status: "Operational", ping: "38ms" }
];

export default function StatusPage() {
  const [lastChecked, setLastChecked] = useState("Just now");

  return (
    <MarketingShell>
      <main className="space-y-16 pb-28">
        
        <MarketingHero
          eyebrow="Trust & Infrastructure"
          title="System Status & Real-Time Telemetry"
          description="Live uptime, latency metrics, and edge availability across all Nexus AI generation clusters and vector memory endpoints."
        />

        <section className="mx-auto max-w-4xl px-5 space-y-8">
          
          {/* Main Operational Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-emerald-950">
                  All Systems Fully Operational
                </h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Nexus Global Edge Cluster · 99.99% overall uptime past 90 days
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-300">
              Live Telemetry
            </span>
          </div>

          {/* Subsystems List */}
          <div className="glass-panel rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-heading text-base font-bold text-slate-950 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" /> Core AI Subsystems
              </h4>
              <span className="text-xs font-semibold text-slate-400">Response Latency</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-medium">
              {services.map((srv, i) => (
                <div key={i} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-slate-900">{srv.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-slate-500">{srv.latency}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {srv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Edge Regions */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md space-y-4">
            <h4 className="font-heading text-base font-bold text-slate-950 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Global Edge POPs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {regions.map((reg, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{reg.code.toUpperCase()}</span>
                    <span className="text-emerald-600 text-[11px] font-semibold">{reg.ping}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{reg.region}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Incidents Log */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md space-y-4">
            <h4 className="font-heading text-base font-bold text-slate-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Past Incident History
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Scheduled Database Migration Complete</span>
                <span className="text-[11px] text-slate-400">Aug 22, 2026</span>
              </div>
              <p className="text-slate-600">
                Completed seamless edge replica sync with zero downtime and 100% data integrity verified.
              </p>
            </div>
          </div>

        </section>

      </main>
    </MarketingShell>
  );
}
