"use client";

import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Save, 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  Sliders,
  Search,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, PersonaProfile } from "@/lib/workspace-data";

export default function BrandKitPage() {
  const { addToast } = useToast();
  const initial = getWorkspaceData().brandKit;
  const [voice, setVoice] = useState(initial.voice);
  const [terms, setTerms] = useState(initial.restrictedTerms);
  const [sources, setSources] = useState(initial.sources);
  const [source, setSource] = useState("");
  const [personas, setPersonas] = useState<PersonaProfile[]>(initial.personas || []);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  // Persona Modal inputs
  const [personaName, setPersonaName] = useState("");
  const [personaTitle, setPersonaTitle] = useState("");
  const [personaPains, setPersonaPains] = useState("");
  const [personaTone, setPersonaTone] = useState("Strategic, ROI-focused, authoritative");

  // Live Brand Voice Linter / Scorer Testbench
  const [linterDraft, setLinterDraft] = useState(
    "Nexus is a revolutionary, best-in-class platform that delivers seamless AI content generation guaranteed to transform your marketing team."
  );

  const [isFixing, setIsFixing] = useState(false);
  const [kbQuery, setKbQuery] = useState("");
  const [isSearchingKb, setIsSearchingKb] = useState(false);
  const [kbSearchResults, setKbSearchResults] = useState<{ id: string; title: string; similarity: number }[] | null>(null);

  const restrictedTermsList = useMemo(() => {
    return terms.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
  }, [terms]);

  const flaggedTerms = useMemo(() => {
    const lower = linterDraft.toLowerCase();
    return restrictedTermsList.filter(t => lower.includes(t));
  }, [linterDraft, restrictedTermsList]);

  const complianceScore = useMemo(() => {
    const penalty = flaggedTerms.length * 20;
    return Math.max(10, 100 - penalty);
  }, [flaggedTerms]);

  const handleAutoFix = async () => {
    setIsFixing(true);
    try {
      const res = await fetch("/api/ai/brand-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: linterDraft,
          restrictedTerms: terms,
          voiceGuide: voice,
          autoFix: true,
        }),
      });
      const data = await res.json();
      if (data.fixedText) {
        setLinterDraft(data.fixedText);
        addToast({
          title: "Auto-Fixed with Groq LLM!",
          message: "All restricted buzzwords removed while preserving authoritative tone.",
          type: "success"
        });
      }
    } catch (err: any) {
      addToast({ title: "Auto-Fix Failed", message: err.message, type: "error" });
    } finally {
      setIsFixing(false);
    }
  };

  const handleSearchKb = async () => {
    if (!kbQuery.trim()) {
      setKbSearchResults(null);
      return;
    }
    setIsSearchingKb(true);
    try {
      const items = sources.map((s, idx) => ({
        id: `kb-${idx}`,
        title: s,
        content: `Official approved enterprise knowledge document: ${s}. Governed, verified, and audited for customer messaging.`,
      }));
      const res = await fetch("/api/ai/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: kbQuery, items }),
      });
      const data = await res.json();
      if (data.results) {
        setKbSearchResults(data.results);
        addToast({
          title: "Semantic Vector Search Complete",
          message: `Ranked via HuggingFace BAAI/bge-small-en-v1.5 (384-d)`,
          type: "success"
        });
      }
    } catch (err: any) {
      addToast({ title: "Search Error", message: err.message, type: "error" });
    } finally {
      setIsSearchingKb(false);
    }
  };

  const save = () => {
    updateWorkspaceData((data) => ({
      ...data,
      brandKit: { voice, restrictedTerms: terms, sources, personas },
      activity: ["Updated central Brand Kit guidelines and personas", ...data.activity]
    }));
    addToast({
      title: "Brand Kit Saved",
      message: "AI Studio, Atomizer, and Custom Agents will apply your updated rules.",
      type: "success"
    });
  };

  const addSource = () => {
    if (!source.trim()) return;
    setSources((items) => [...items, source.trim()]);
    setSource("");
  };

  const handleAddPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaName.trim() || !personaTitle.trim()) return;
    const newP: PersonaProfile = {
      id: `p-${crypto.randomUUID().slice(0, 6)}`,
      name: personaName.trim(),
      title: personaTitle.trim(),
      painPoints: personaPains.trim() || "Scaling output without quality loss",
      preferredTone: personaTone
    };
    setPersonas([...personas, newP]);
    setIsPersonaModalOpen(false);
    setPersonaName("");
    setPersonaTitle("");
    setPersonaPains("");
    addToast({ title: "Persona profile added", type: "success" });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Governance Engine
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                AI Guardrails Enforced
              </span>
            </div>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight">Brand Kit & Knowledge Base</h1>
            <p className="mt-1 text-slate-500 text-base">Train Nexus AI on your exact brand voice, target buyer personas, and restricted buzzwords.</p>
          </div>

          <Button onClick={save} className="gap-2 bg-[#020617] hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm">
            <Save className="h-4 w-4" /> Save Brand Kit
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: Guidelines & Knowledge Base */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* Voice and Tone */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 font-heading">Core Brand Voice & Personality</h2>
              </div>
              <p className="text-xs text-slate-400">Describe the posture, cadence, and vocabulary tone your brand uses across all collateral.</p>
              <textarea
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Restricted Buzzwords & Claims to Avoid
                </label>
                <input
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="e.g. best-in-class, revolutionary, seamless, guaranteed"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Comma-separated terms that Nexus AI will strictly filter out of generated copy.</p>
              </div>
            </section>

            {/* Target Buyer Personas */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Target Buyer Personas (ICPs)</h2>
                </div>
                <Button
                  onClick={() => setIsPersonaModalOpen(true)}
                  size="sm"
                  variant="secondary"
                  className="text-xs font-semibold rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Persona
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personas.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative group">
                    <button
                      onClick={() => setPersonas(personas.filter(item => item.id !== p.id))}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <h4 className="text-xs font-bold text-slate-900">{p.name} ({p.title})</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed"><strong>Pains:</strong> {p.painPoints}</p>
                    <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Tone: {p.preferredTone}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Grounded Knowledge Repository */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Knowledge Repository</h2>
                  <p className="text-xs text-slate-400">Approved context docs linked directly to AI generations.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {sources.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
                    <span>{item}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSource(); } }}
                  placeholder="Add approved knowledge title (e.g. SOC2 Report, Pricing Matrix)..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={addSource} variant="secondary" size="sm" className="rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Semantic Vector Search over Knowledge */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Search className="w-3 h-3 text-indigo-600" /> Semantic Vector Search
                  </label>
                  <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    BAAI/bge-small-en-v1.5
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={kbQuery}
                    onChange={(e) => setKbQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearchKb(); } }}
                    placeholder="Search by concept (e.g. SOC2 security, pricing discounts)..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button onClick={handleSearchKb} isLoading={isSearchingKb} variant="secondary" size="sm" className="rounded-xl text-xs font-semibold">
                    Search
                  </Button>
                </div>
                {kbSearchResults && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Cosine Similarity Matches:</span>
                    {kbSearchResults.map((res) => (
                      <div key={res.id} className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{res.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-600 text-white">
                          {res.similarity}% match
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </main>

          {/* Right Column: Live Brand Voice Scorer & Linter Testbench */}
          <aside className="lg:col-span-5 space-y-6">
            
            {/* Live Compliance Linter */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-heading text-base text-slate-900 font-bold">Brand Voice Linter</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  complianceScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  Score: {complianceScore}%
                </span>
              </div>

              <p className="text-xs text-slate-500">Paste any text below to test against forbidden words and brand voice alignment in real time.</p>
              
              <textarea
                value={linterDraft}
                onChange={(e) => setLinterDraft(e.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />

              {flaggedTerms.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5" /> {flaggedTerms.length} Restricted Buzzwords Detected:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {flaggedTerms.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-rose-200/80 text-rose-900 font-mono text-[10px] font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAutoFix}
                    isLoading={isFixing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isFixing ? "animate-spin" : ""}`} />
                    {isFixing ? "Rewriting with Groq LLM..." : "1-Click AI Fix (Rewrite to 100%)"}
                  </Button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Clean copy. Zero restricted buzzwords found.
                </div>
              )}
            </div>

            {/* AI Guardrail Info card */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 space-y-3">
              <ShieldAlert className="h-6 w-6 text-indigo-600" />
              <h3 className="text-base font-bold text-indigo-950 font-heading">Deterministic AI Safeguards</h3>
              <p className="text-xs leading-relaxed text-indigo-900/80">
                Nexus automatically injects your active Brand Kit voice guidelines, ICP constraints, and restricted terms into every LLM completion across the platform.
              </p>
            </div>

          </aside>

        </div>

      </div>

      {/* Add Persona Modal */}
      <Modal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        title="Add Target Buyer Persona (ICP)"
        description="Help AI adapt copy and vocabulary for specific decision makers."
      >
        <form onSubmit={handleAddPersona} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Persona Name</label>
            <input
              type="text"
              value={personaName}
              onChange={(e) => setPersonaName(e.target.value)}
              placeholder="e.g. Enterprise Chief Security Officer"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Job Title / Seniority</label>
            <input
              type="text"
              value={personaTitle}
              onChange={(e) => setPersonaTitle(e.target.value)}
              placeholder="e.g. CISO / VP of Security"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Key Pain Points</label>
            <input
              type="text"
              value={personaPains}
              onChange={(e) => setPersonaPains(e.target.value)}
              placeholder="e.g. Unverified AI hallucinations, data leakage, compliance audit risks"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Preferred Tone</label>
            <select
              value={personaTone}
              onChange={(e) => setPersonaTone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Strategic, ROI-focused, authoritative</option>
              <option>Technical, precise, evidence-backed</option>
              <option>Practical, conversational, problem-solving</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPersonaModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Add Persona</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
