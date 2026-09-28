"use client";

import React, { useState } from "react";
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
  Activity
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
  { id: "log-1", user: "Devansh (Admin)", action: "Generated 'CRDT State Sync RFC' via Groq Qwen 3.8-27b", ip: "192.168.1.42", timestamp: "2 mins ago", status: "Success" },
  { id: "log-2", user: "Sarah Connor (Reviewer)", action: "Digitally stamped approval on Atlas Cloud Case Study", ip: "10.4.0.12", timestamp: "18 mins ago", status: "Success" },
  { id: "log-3", user: "David Kim (Creator)", action: "Prompt contained forbidden term 'revolutionary' — Linters intervened", ip: "172.16.0.8", timestamp: "1 hour ago", status: "Blocked (Guardrail)" },
  { id: "log-4", user: "System Webhook", action: "Syndicated draft to Webflow CMS staging collection", ip: "35.192.0.1", timestamp: "3 hours ago", status: "Success" },
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

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("ai");
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiHealth, setAiHealth] = useState<AiHealthData | null>(null);

  // Team RBAC state
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Devansh (Admin)", email: "devansh@nexus.io", role: "Owner", status: "Active" },
    { id: "2", name: "Sarah Connor", email: "sarah@nexus.io", role: "Admin", status: "Active" },
    { id: "3", name: "David Kim", email: "david@nexus.io", role: "Content Lead", status: "Active" },
    { id: "4", name: "Emily Watson", email: "emily@externalagency.com", role: "Guest Client", status: "Active" },
  ]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: "key-1", name: "Webflow Production Sync", key: "nx_live_98a72f...912a", created: "Aug 12, 2026", lastUsed: "Just now" },
    { id: "key-2", name: "HubSpot Marketing Automation", key: "nx_live_33b81c...741b", created: "Jul 28, 2026", lastUsed: "3 hrs ago" },
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

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Workspace Administration & Governance
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage enterprise RBAC, usage limits, billing invoices, webhooks, and security audit ledgers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Tabs (3 cols) */}
          <div className="lg:col-span-3 space-y-1.5">
            {[
              { id: "ai" as SettingsTab, label: "AI Engine & Providers", icon: Sparkles },
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
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
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
                      Active foundation models: Groq low-latency inference, Hugging Face dense embeddings, and Ollama local nodes.
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
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    <Activity className="w-3.5 h-3.5" /> Test AI Connectivity
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

                {/* Architecture Highlights */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-slate-900">Active Production Safeguards</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-600" /> Zero AI Data Retention
                      </span>
                      <p className="text-slate-500 text-[11px]">
                        Customer document buffers are never stored or used to train foundation models.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Deterministic Voice Linters
                      </span>
                      <p className="text-slate-500 text-[11px]">
                        Restricted buzzword filters run automatically across every AI completion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-slate-900">Profile Settings</h2>
                  <p className="text-xs text-slate-500">Configure your personal workspace identity and notification preferences.</p>
                </div>

                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Devansh"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">Work Email</label>
                    <input
                      type="email"
                      defaultValue="devanshgupta091@gmail.com"
                      disabled
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
                    />
                  </div>
                  <Button
                    onClick={() => addToast({ title: "Profile updated successfully!", type: "success" })}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
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
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" /> Invite Member
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
                    <span className="font-bold text-slate-900">Monthly AI Token Quota</span>
                    <span className="font-mono font-bold text-indigo-700">412,500 / 500,000 Tokens (82.5%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                    <div className="w-[82.5%] h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xs" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Resets in 11 days (Oct 1, 2026)</span>
                    <button
                      onClick={() => addToast({ title: "Added 100k Token Credit Pack!", type: "success" })}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      + Add Token Top-Up
                    </button>
                  </div>
                </div>

                {/* Current Plan Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-base font-bold text-slate-900">Current Plan: Pro Tier</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                    </div>
                    <p className="text-xs text-slate-500">$99/month billed annually · 25 seats included</p>
                    <Button
                      onClick={() => addToast({ title: "Redirecting to Stripe Billing Portal...", type: "info" })}
                      variant="outline"
                      className="w-full text-xs text-slate-700 border-slate-300 hover:bg-white rounded-xl"
                    >
                      Manage Stripe Billing Portal
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-heading text-base font-bold text-slate-900">Latest Invoices</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Invoice #NX-2026-08</span>
                        <span className="text-slate-500 font-mono">$99.00 (Paid)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Invoice #NX-2026-07</span>
                        <span className="text-slate-500 font-mono">$99.00 (Paid)</span>
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
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create API Key
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
                      onClick={() => addToast({ title: "Exported audit ledger (.CSV)", type: "success" })}
                      variant="outline"
                      className="py-1 px-2.5 text-xs text-slate-700 border-slate-300 hover:bg-slate-50 rounded-lg"
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
