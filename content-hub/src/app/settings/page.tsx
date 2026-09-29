"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  User, 
  Shield, 
  CreditCard, 
  CheckCircle2, 
  Key, 
  Lock, 
  Sparkles, 
  Download, 
  Plus, 
  Copy, 
  Activity,
  Sliders,
  Bell,
  Globe,
  Save,
  Check,
  Building,
  Mail,
  Clock,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

type SettingsTab = "ai" | "profile" | "team" | "billing" | "integrations" | "security";

interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  ip: string;
  timestamp: string;
  status: "Success" | "Blocked (Guardrail)" | "Warning";
}

const initialAuditLogs: AuditLogEntry[] = [
  { id: "log-1", user: "Devansh Gupta (Admin)", action: "Generated 'CRDT State Sync RFC' via Groq Qwen 3.8-27b", ip: "192.168.1.42", timestamp: "2 mins ago", status: "Success" },
  { id: "log-2", user: "Sarah Connor (Reviewer)", action: "Digitally stamped approval on Atlas Cloud Case Study", ip: "10.4.0.12", timestamp: "18 mins ago", status: "Success" },
  { id: "log-3", user: "David Kim (Creator)", action: "Prompt contained forbidden term 'revolutionary' — Linters intervened", ip: "172.16.0.8", timestamp: "1 hour ago", status: "Blocked (Guardrail)" },
  { id: "log-4", user: "System Webhook", action: "Syndicated draft to Webflow CMS staging collection", ip: "35.192.0.1", timestamp: "3 hours ago", status: "Success" },
  { id: "log-5", user: "Devansh Gupta (Admin)", action: "Promoted 'Brand Refresh Sprint' to Approved state", ip: "192.168.1.42", timestamp: "5 hours ago", status: "Success" }
];

interface AiHealthData {
  status: string;
  latencyMs: number;
  providers: {
    groq: { status: string; model: string };
    huggingface: { status: string; dimensions: number };
    ollama: { status: string };
  };
}

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  bio: string;
  timezone: string;
  avatarUrl: string;
  department: string;
  notifications: {
    emailOnApproval: boolean;
    slackInstantPing: boolean;
    weeklyAiSummary: boolean;
    guardrailAlerts: boolean;
  };
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") as SettingsTab | null;
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>(requestedTab || "ai");

  useEffect(() => {
    if (requestedTab && ["ai", "profile", "team", "billing", "integrations", "security"].includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  // AI Orchestration State
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiHealth, setAiHealth] = useState<AiHealthData | null>(null);
  const [selectedModel, setSelectedModel] = useState("qwen/qwen3.8-27b");
  const [temperature, setTemperature] = useState(0.3);
  const [zeroRetention, setZeroRetention] = useState(true);
  const [voiceStrictness, setVoiceStrictness] = useState<"strict" | "moderate" | "relaxed">("strict");

  // User Profile State
  const [profile, setProfile] = useState<UserProfileData>({
    id: "user-1",
    name: "Devansh Gupta",
    email: "devanshgupta091@gmail.com",
    role: "Workspace Owner & Chief Architect",
    title: "Principal Engineer",
    bio: "Architecting governed multi-model content infrastructure with low-latency LPUs and dense semantic vector search.",
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    department: "Core Platform Architecture",
    notifications: {
      emailOnApproval: true,
      slackInstantPing: true,
      weeklyAiSummary: true,
      guardrailAlerts: true
    }
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fetch Profile from backend on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setProfile(data.profile);
        }
      } catch (err) {
        console.warn("Using local profile fallback:", err);
      }
    }
    loadProfile();
  }, []);

  // Save profile changes to backend
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile(data.profile);
      addToast({
        title: "Profile Preferences Saved",
        message: "Your identity and governance settings have been updated across Nexus.",
        type: "success"
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile";
      addToast({ title: "Save Error", message: msg, type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Team RBAC state
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Devansh Gupta (Owner)", email: "devanshgupta091@gmail.com", role: "Owner", status: "Active" },
    { id: "2", name: "Sarah Connor", email: "sarah@nexus.io", role: "Admin", status: "Active" },
    { id: "3", name: "David Kim", email: "david@nexus.io", role: "Content Lead", status: "Active" },
    { id: "4", name: "Emily Watson", email: "emily@externalagency.com", role: "Guest Client", status: "Active" },
  ]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: "key-1", name: "Webflow Production Sync", key: "nx_live_98a72f44c82b912a", created: "Aug 12, 2026", lastUsed: "Just now" },
    { id: "key-2", name: "HubSpot Marketing Automation", key: "nx_live_33b81ca8210741b", created: "Jul 28, 2026", lastUsed: "3 hrs ago" },
  ]);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 mins");
  const [dataRegion, setDataRegion] = useState("US-East (N. Virginia)");

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addToast({ title: "API Key copied to clipboard!", type: "success" });
  };

  const handleAddApiKey = () => {
    const name = window.prompt("API Key Name (e.g. Webflow Staging)");
    if (!name?.trim()) return;
    const newKey = {
      id: `key-${Date.now()}`,
      name: name.trim(),
      key: `nx_live_${Math.random().toString(36).substring(2, 12)}...${Math.random().toString(36).substring(2, 6)}`,
      created: "Just now",
      lastUsed: "Never"
    };
    setApiKeys([...apiKeys, newKey]);
    addToast({ title: "New API Key created!", type: "success" });
  };

  // Export audit logs as CSV
  const handleExportAuditCsv = () => {
    const headers = "ID,User,Action,IP,Timestamp,Status\n";
    const rows = initialAuditLogs
      .map(l => `"${l.id}","${l.user}","${l.action.replace(/"/g, '""')}","${l.ip}","${l.timestamp}","${l.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nexus_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: "Audit Ledger Exported", message: "CSV file successfully downloaded.", type: "success" });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#020617] text-white border border-[#1e293b] font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Control Panel
            </span>
            <span className="text-slate-400 text-xs">· Node 01 Governance</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Workspace Administration & Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Configure multi-model AI orchestration, user profile identity, enterprise RBAC, and immutable audit ledgers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Tabs (3 cols) */}
          <div className="lg:col-span-3 space-y-1.5">
            {[
              { id: "ai" as SettingsTab, label: "AI Engine & LPUs", icon: Sparkles },
              { id: "profile" as SettingsTab, label: "Profile & Identity", icon: User },
              { id: "team" as SettingsTab, label: "Team & RBAC Roles", icon: Shield },
              { id: "billing" as SettingsTab, label: "Usage, Limits & Billing", icon: CreditCard },
              { id: "integrations" as SettingsTab, label: "API Keys & Webhooks", icon: Key },
              { id: "security" as SettingsTab, label: "Security & Audit Logs", icon: Lock },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-2xl transition-all ${
                    isActive
                      ? "bg-[#020617] text-white shadow-md border border-[#1e293b]"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel (9 cols) */}
          <div className="lg:col-span-9 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            
            {/* 1. AI ENGINE & MODEL PROVIDERS TAB */}
            {activeTab === "ai" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" /> AI Engine & Model Orchestration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Active foundation models: Groq ultra-low-latency LPUs, Hugging Face dense embeddings, and Ollama local nodes.
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      setIsTestingAi(true);
                      try {
                        const res = await fetch("/api/ai/health");
                        const data = await res.json();
                        setAiHealth(data);
                        addToast({
                          title: data.status === "healthy" ? "AI Engine 100% Operational" : "AI Health Degraded",
                          message: `Ping completed in ${data.latencyMs}ms. Groq (${data.providers.groq.model}) & Hugging Face (${data.providers.huggingface.dimensions}d) verified.`,
                          type: data.status === "healthy" ? "success" : "info"
                        });
                      } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : "Health check failed";
                        addToast({ title: "Health check failed", message, type: "error" });
                      } finally {
                        setIsTestingAi(false);
                      }
                    }}
                    isLoading={isTestingAi}
                    className="bg-[#020617] hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-[#1e293b]"
                  >
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> Test AI Connectivity
                  </Button>
                </div>

                {/* Provider Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Groq Card */}
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        ⚡ Groq LPUs
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                        Primary LLM
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-800 font-mono text-[11px]">Model: <strong>qwen/qwen3.8-27b</strong></p>
                      <p className="text-slate-500">Speed: ~200-300ms latency</p>
                      <p className="text-slate-500">Key: Environment Configured</p>
                    </div>
                    <div className="pt-2 border-t border-emerald-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ultra-low latency active
                    </div>
                  </div>

                  {/* Hugging Face Card */}
                  <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        🤗 Hugging Face
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                        Embeddings
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-800 font-mono text-[11px]">Model: <strong>BAAI/bge-small-en-v1.5</strong></p>
                      <p className="text-slate-500">Dimensions: 384 dense vectors</p>
                      <p className="text-slate-500">Key: Environment Configured</p>
                    </div>
                    <div className="pt-2 border-t border-indigo-100 text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Router endpoint active
                    </div>
                  </div>

                  {/* Ollama Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        🦙 Ollama Local
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {aiHealth?.providers?.ollama?.status === "connected" ? "Online" : "Standby / Fallback"}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-800 font-mono text-[11px]">Host: <strong>localhost:11434</strong></p>
                      <p className="text-slate-500">LLM: llama3.2:3b</p>
                      <p className="text-slate-500">Embeddings: nomic-embed-text</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1">
                      <span>Automatic cloud fallback to Groq</span>
                    </div>
                  </div>
                </div>

                {/* AI Configuration Parameters */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                  <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" /> Runtime Orchestration Parameters
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Active LLM Model</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="qwen/qwen3.8-27b">Groq: Qwen 3.8-27b (Fastest, Recommended)</option>
                        <option value="llama-3.3-70b-versatile">Groq: Llama 3.3-70b Versatile</option>
                        <option value="mistral-large-latest">Mistral Large (High Reasoning)</option>
                        <option value="llama3.2:3b">Ollama: Local Llama 3.2 3B</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="font-bold text-slate-700">Temperature (Creativity)</label>
                        <span className="font-mono text-indigo-600 font-bold">{temperature}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Precise (0.0)</span>
                        <span>Balanced (0.5)</span>
                        <span>Creative (1.0)</span>
                      </div>
                    </div>
                  </div>

                  {/* Safeguards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          <Lock className="w-3.5 h-3.5 text-indigo-600" /> Zero AI Data Retention
                        </span>
                        <p className="text-slate-500 text-[11px] mt-1">
                          Document buffers and completions are never stored on AI provider disks or used for training.
                        </p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={zeroRetention}
                        onChange={(e) => setZeroRetention(e.target.checked)}
                        className="accent-indigo-600 mt-1 shrink-0"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Brand Voice Strictness
                      </span>
                      <div className="flex gap-2">
                        {(["strict", "moderate", "relaxed"] as const).map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setVoiceStrictness(level)}
                            className={`flex-1 py-1 text-[11px] font-bold rounded-lg capitalize border transition-all ${
                              voiceStrictness === level
                                ? "bg-[#020617] text-white border-[#1e293b]"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROFILE & IDENTITY TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" /> User Profile & Identity
                  </h2>
                  <p className="text-xs text-slate-500">Configure your personal workspace identity, avatar, and notification channels.</p>
                </div>

                {/* Avatar Preview & Selection */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-[#020617] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold font-heading">
                        {profile.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">{profile.name}</h3>
                      <p className="text-xs text-indigo-600 font-medium">{profile.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {[
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                      ].map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setProfile({ ...profile, avatarUrl: url })}
                          className={`w-9 h-9 rounded-full border-2 overflow-hidden hover:scale-105 transition-transform ${
                            profile.avatarUrl === url ? "border-indigo-600 ring-2 ring-indigo-300" : "border-slate-200"
                          }`}
                        >
                          <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Work Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Professional Title</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g. Principal Content Architect"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Department / Org Unit</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      placeholder="e.g. Core Platform Architecture"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1.5">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Asia/Kolkata (IST, UTC+5:30)">Asia/Kolkata (IST, UTC+5:30)</option>
                      <option value="America/New_York (EST, UTC-5)">America/New_York (EST, UTC-5)</option>
                      <option value="America/Los_Angeles (PST, UTC-8)">America/Los_Angeles (PST, UTC-8)</option>
                      <option value="Europe/London (GMT, UTC+0)">Europe/London (GMT, UTC+0)</option>
                      <option value="Asia/Tokyo (JST, UTC+9)">Asia/Tokyo (JST, UTC+9)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1.5">Professional Bio & System Role</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Granular Notification Channels */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-600" /> Notification Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={profile.notifications.emailOnApproval}
                        onChange={(e) => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, emailOnApproval: e.target.checked }
                        })}
                        className="accent-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Email alerts on document approvals</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={profile.notifications.slackInstantPing}
                        onChange={(e) => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, slackInstantPing: e.target.checked }
                        })}
                        className="accent-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Slack pings on brand voice breaches</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyAiSummary}
                        onChange={(e) => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyAiSummary: e.target.checked }
                        })}
                        className="accent-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Weekly Executive AI Velocity Digest</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={profile.notifications.guardrailAlerts}
                        onChange={(e) => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, guardrailAlerts: e.target.checked }
                        })}
                        className="accent-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Security & RBAC intervention alerts</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={isSavingProfile}
                    className="bg-[#020617] hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-[#1e293b] px-6 py-2.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-indigo-400" /> Save Profile Preferences
                  </Button>
                </div>
              </form>
            )}

            {/* 3. TEAM & RBAC TAB */}
            {activeTab === "team" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900">Team & Role-Based Access (RBAC)</h2>
                    <p className="text-xs text-slate-500">Control permissions across Owners, Admins, Creators, Reviewers, and Guest Clients.</p>
                  </div>
                  <Button
                    onClick={() => addToast({ title: "Invite Modal Triggered", type: "info" })}
                    className="bg-[#020617] hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-[#1e293b]"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" /> Invite Member
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{m.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                              {m.role}
                            </span>
                          </td>
                          <td className="p-4 text-emerald-700 font-semibold">{m.status}</td>
                          <td className="p-4 text-right">
                            <button className="text-slate-400 hover:text-slate-700 p-1 text-xs font-semibold">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. BILLING & TOKEN USAGE TAB */}
            {activeTab === "billing" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-slate-900">Usage & Billing Meter</h2>
                  <p className="text-xs text-slate-500">Monitor token consumption, plan tier quotas, and download invoices.</p>
                </div>

                {/* Token Meter Progress */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Monthly AI Generation Pool</span>
                      <p className="text-slate-500 text-[11px]">85,200 / 500,000 tokens consumed</p>
                    </div>
                    <span className="font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full text-xs">
                      17% Consumed
                    </span>
                  </div>
                  <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden border border-indigo-200">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: "17%" }} />
                  </div>
                </div>

                {/* Plan Details & Invoices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Current Plan: Enterprise Tier</span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Unlimited workspaces, dedicated Groq LPU allocation, custom brand voice linters, and priority 24/7 SLA.
                    </p>
                    <div className="pt-2">
                      <span className="text-xs font-mono font-bold text-indigo-600">$499 / month · Renews Sep 15, 2026</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Invoices & Receipts</span>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Invoice #NX-2026-08</span>
                        <span className="text-slate-500 font-mono">$499.00 (Paid)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Invoice #NX-2026-07</span>
                        <span className="text-slate-500 font-mono">$499.00 (Paid)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. API KEYS & WEBHOOKS TAB */}
            {activeTab === "integrations" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900">API Keys & Inbound/Outbound Webhooks</h2>
                    <p className="text-xs text-slate-500">Generate developer tokens for custom Zapier, Make, and CMS sync pipelines.</p>
                  </div>
                  <Button
                    onClick={handleAddApiKey}
                    className="bg-[#020617] hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-[#1e293b]"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" /> Create API Key
                  </Button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-900">{k.name}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-indigo-700 font-mono text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">{k.key}</code>
                          <button onClick={() => handleCopyKey(k.key)} className="text-slate-400 hover:text-slate-700 p-1">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Last used: {k.lastUsed}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SECURITY & AUDIT LOG TAB */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-slate-900">Security & Activity Audit Ledger</h2>
                  <p className="text-xs text-slate-500">Exportable immutable record of all generation prompts, approvals, and guardrail alerts.</p>
                </div>

                {/* Security Config Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900">Two-Factor Auth (2FA)</span>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-bold">Enforced for Org</span>
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        className="accent-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900">Session Timeout</span>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 outline-none font-medium"
                    >
                      <option>15 mins</option>
                      <option>30 mins</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900">Data Residency Region</span>
                    <select
                      value={dataRegion}
                      onChange={(e) => setDataRegion(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 outline-none font-medium"
                    >
                      <option>US-East (N. Virginia)</option>
                      <option>US-West (Oregon)</option>
                      <option>EU-Central (Frankfurt)</option>
                    </select>
                  </div>
                </div>

                {/* Audit Log Table */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Real-Time Audit Stream</span>
                    <Button
                      onClick={handleExportAuditCsv}
                      variant="outline"
                      className="py-1 px-2.5 text-xs text-slate-700 border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </Button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs font-medium">
                    {initialAuditLogs.map((log) => (
                      <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 transition-colors">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{log.action}</p>
                          <p className="text-[11px] text-slate-500">{log.user} · IP: {log.ip}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            log.status === "Success"
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-rose-700 bg-rose-50 border-rose-200"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
