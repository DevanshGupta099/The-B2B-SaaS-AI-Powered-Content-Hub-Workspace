"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Sparkles, 
  Users, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  RefreshCw,
  Plus,
  Trash2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

const teamRoles = ["Admin", "Content Lead", "Creator", "Reviewer", "Guest Client"];

export default function OnboardingPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);

  // Step 1: Workspace details
  const [companyName, setCompanyName] = useState("Acme SaaS");
  const [workspaceSlug, setWorkspaceSlug] = useState("acme-saas");
  const [teamSize, setTeamSize] = useState("10 - 25");

  // Step 2: Persona / Role
  const [primaryRole, setPrimaryRole] = useState("Enterprise Marketing Lead");
  const [primaryGoal, setPrimaryGoal] = useState("Scale Omnichannel Repurposing & Speed");

  // Step 3: Brand Ingestion
  const [brandUrl, setBrandUrl] = useState("https://acme.com");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawledData, setCrawledData] = useState<{
    tone: string;
    extractedKeywords: string[];
    brandColors: string[];
  } | null>(null);

  // Step 4: Teammate Batch Inviter
  const [invites, setInvites] = useState([
    { email: "sarah.lead@acme.com", role: "Content Lead" },
    { email: "david.writer@acme.com", role: "Creator" }
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Creator");

  const handleCrawlUrl = () => {
    if (!brandUrl.trim()) return;
    setIsCrawling(true);
    setTimeout(() => {
      setCrawledData({
        tone: "Authoritative, technical yet highly accessible with data-driven claims",
        extractedKeywords: ["Zero-Latency", "Deterministic Governance", "Edge Infrastructure", "Enterprise AI"],
        brandColors: ["#4f46e5", "#06b6d4", "#10b981", "#020617"]
      });
      setIsCrawling(false);
      addToast({ title: "Brand ingested & vector knowledge synthesized!", type: "success" });
    }, 900);
  };

  const handleAddInvite = () => {
    if (!newEmail.trim()) return;
    setInvites([...invites, { email: newEmail, role: newRole }]);
    setNewEmail("");
  };

  const handleRemoveInvite = (idx: number) => {
    setInvites(invites.filter((_, i) => i !== idx));
  };

  const handleComplete = () => {
    addToast({
      title: "Workspace Configured!",
      message: "Welcome to Nexus AI OS. Your team brand kit is ready.",
      type: "success"
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans">
      
      {/* Top Header */}
      <div className="mx-auto max-w-2xl w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#020617] flex items-center justify-center text-white font-heading font-extrabold text-base">
            N
          </div>
          <span className="font-heading text-lg font-bold text-slate-950">Nexus Setup</span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Step {step} of 4
        </span>
      </div>

      {/* Progress Dots */}
      <div className="mx-auto max-w-md w-full flex items-center justify-between gap-2 py-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              step >= s ? "bg-indigo-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Wizard Card Container */}
      <div className="mx-auto max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* STEP 1: WORKSPACE SETUP */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Step 1: Workspace
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Name Your Workspace</h2>
              <p className="text-xs text-slate-500">Create a collaborative home for your organization&apos;s content assets.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Workspace URL Slug</label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 font-medium">
                  <span>app.nexus.ai/</span>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className="bg-transparent text-slate-900 outline-none flex-1 ml-0.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Team Size</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>1 - 5 Creators</option>
                  <option>6 - 10 Creators</option>
                  <option>10 - 25 Creators</option>
                  <option>25+ Enterprise Organization</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#020617] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md mt-4"
            >
              <span>Continue to Role Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* STEP 2: PERSONA & GOALS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Step 2: Goals
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Tailor Your AI Studio</h2>
              <p className="text-xs text-slate-500">We will configure default prompt templates based on your role.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Your Primary Role</label>
                <select
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Enterprise Marketing Lead</option>
                  <option>DevRel & Technical Content Creator</option>
                  <option>Demand Gen & Paid Media Manager</option>
                  <option>Agency / Client Services Director</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Primary 90-Day Goal</label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Scale Omnichannel Repurposing & Speed</option>
                  <option>Enforce Brand Voice & Legal Compliance</option>
                  <option>1-Click CMS Publishing into Webflow / HubSpot</option>
                  <option>Scale Technical RFCs into Developer Blogs</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="py-3 text-xs"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-[#020617] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Continue to Brand Ingestion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: BRAND INGESTION URL CRAWLER */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Step 3: Ingestion
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Instant Brand Voice Ingestion</h2>
              <p className="text-xs text-slate-500">Provide your domain and Nexus will automatically extract tone guidelines and key terminology.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Company Website URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={brandUrl}
                  onChange={(e) => setBrandUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button
                  onClick={handleCrawlUrl}
                  disabled={isCrawling}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? "animate-spin" : ""}`} />
                  <span>{isCrawling ? "Crawling..." : "Scrape & Extract"}</span>
                </Button>
              </div>
            </div>

            {crawledData && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-indigo-950">Detected Tone:</span>
                  <p className="text-indigo-800 mt-0.5">{crawledData.tone}</p>
                </div>
                <div>
                  <span className="font-bold text-indigo-950">Key Protected Terminology:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {crawledData.extractedKeywords.map((kw, i) => (
                      <span key={i} className="bg-white text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="py-3 text-xs"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 bg-[#020617] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Continue to Teammate Invites</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: TEAMMATE BATCH INVITER */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Step 4: Team
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Invite Your Teammates</h2>
              <p className="text-xs text-slate-500">Collaborate with writers, design leads, and legal reviewers with RBAC roles.</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium"
                >
                  {teamRoles.map(r => <option key={r}>{r}</option>)}
                </select>
                <Button
                  onClick={handleAddInvite}
                  className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invites.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800">{inv.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {inv.role}
                      </span>
                      <button
                        onClick={() => handleRemoveInvite(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="py-3 text-xs"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch Nexus Workspace</span>
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-400 py-4">
        © 2026 Nexus Systems Inc. Protected by Enterprise SOC2 Type II & Zero AI Retention.
      </div>

    </div>
  );
}
