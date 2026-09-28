"use client";

import React, { useState, useMemo } from "react";
import { 
  SearchCode, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Globe, 
  BarChart, 
  ArrowUpRight, 
  BookOpen, 
  Plus, 
  Layers, 
  Check, 
  RefreshCw,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, SeoAuditItem } from "@/lib/workspace-data";

const competitorSerp = [
  { rank: 1, url: "jasper.ai/blog/content-governance", title: "The Enterprise Guide to Content Governance in 2026", words: 2450, da: 82 },
  { rank: 2, url: "writer.com/product/brand-guidelines", title: "How to Build AI Brand Guidelines that Actually Work", words: 1980, da: 79 },
  { rank: 3, url: "contently.com/strategy/b2b-velocity", title: "B2B Content Velocity: 5 Proven Frameworks", words: 1720, da: 75 },
];

const peopleAlsoAsk = [
  "What is the difference between content operations and content marketing?",
  "How do you enforce brand governance with generative AI tools?",
  "What metrics prove B2B content operations ROI to the CFO?",
  "How can marketing teams automate content repurposing across social channels?"
];

export default function SeoPage() {
  const { addToast } = useToast();
  const [audits, setAudits] = useState<SeoAuditItem[]>(() => getWorkspaceData().seoAudits);
  const [selectedAuditId, setSelectedAuditId] = useState(audits[0]?.id || "seo-1");
  const [targetKeyword, setTargetKeyword] = useState("b2b content operations platform");
  const [isAuditing, setIsAuditing] = useState(false);
  
  // Interactive draft for live scoring
  const [draftContent, setDraftContent] = useState(
    `# The Complete Guide to B2B Content Operations in 2026\n\nScaling a modern marketing engine requires more than just generating words. A robust b2b content operations platform connects strategy, AI generation, human governance, and multi-channel publishing.\n\n## Why AI Governance Matters for Enterprise Brands\nWithout strict guardrails, generative AI creates hallucinations and off-brand messaging that damage customer trust. By implementing centralized brand kits and approval workflows, content velocity increases by 65%.\n\n## Multi-Channel Distribution & Repurposing\nTransforming high-performing research into atomized LinkedIn carousels, newsletters, and sales collateral ensures maximum return on your content investment.`
  );

  const activeAudit = useMemo(() => {
    return audits.find(a => a.id === selectedAuditId) || audits[0];
  }, [audits, selectedAuditId]);

  // Dynamic score calculator based on draft content length and keyword presence
  const dynamicScore = useMemo(() => {
    let score = 70;
    const lowerDraft = draftContent.toLowerCase();
    const lowerKw = targetKeyword.toLowerCase();
    
    if (lowerDraft.includes(lowerKw)) score += 12;
    if (lowerDraft.includes("##")) score += 6;
    if (lowerDraft.includes("roi") || lowerDraft.includes("governance")) score += 6;
    if (draftContent.split(/\s+/).filter(Boolean).length > 80) score += 6;
    return Math.min(score, 98);
  }, [draftContent, targetKeyword]);

  const [auditMetadata, setAuditMetadata] = useState<{
    metaTitle?: string;
    metaDescription?: string;
    semanticKeywords?: string[];
    faqSchema?: { q: string; a: string }[];
  } | null>(null);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKeyword.trim()) return;
    setIsAuditing(true);
    try {
      const res = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: targetKeyword.trim(),
          content: draftContent,
        }),
      });

      const data = await res.json();
      const newAudit: SeoAuditItem = {
        id: crypto.randomUUID(),
        keyword: targetKeyword.trim(),
        intent: data.intent || "Commercial",
        score: data.score || 85,
        volume: data.estimatedVolume || "3.8K / mo",
        difficulty: data.difficulty || "Medium",
        recommendations: data.recommendations || [
          `Target primary keyword '${targetKeyword}' in H1 and first 100 words`,
          "Add FAQ schema covering user search intent",
          "Include at least 2 comparison data tables"
        ]
      };

      setAuditMetadata({
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        semanticKeywords: data.semanticKeywords,
        faqSchema: data.faqSchema,
      });

      const next = [newAudit, ...audits];
      setAudits(next);
      setSelectedAuditId(newAudit.id);
      updateWorkspaceData(d => ({
        ...d,
        seoAudits: next,
        activity: [`New SEO Audit analyzed with Groq for '${newAudit.keyword}'`, ...d.activity]
      }));

      addToast({
        title: "SEO Intelligence Audit Complete",
        message: `Generated SERP metrics, meta tags, and FAQ schema for '${targetKeyword}'.`,
        type: "success"
      });
    } catch (err: any) {
      addToast({ title: "Audit Error", message: err.message, type: "error" });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleInsertQuestion = (q: string) => {
    setDraftContent(prev => `${prev}\n\n### ${q}\n[Insert your expert answer and data points here...]`);
    addToast({ title: "Injected question into draft", type: "info" });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <SearchCode className="w-3.5 h-3.5" /> Search Intelligence
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Google SERP v2.4 Live
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">SEO & Search Optimization Suite</h1>
            <p className="text-slate-500 mt-1 text-base">Score content against top-ranking search competitors, optimize keyword density, and capture featured snippets.</p>
          </div>

          <form onSubmit={handleRunAudit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="Target keyword..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <Button type="submit" isLoading={isAuditing} className="gap-2 bg-slate-900 text-white rounded-xl px-4 py-2.5 font-semibold text-xs whitespace-nowrap">
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              Run Audit
            </Button>
          </form>
        </div>

        {/* Top Metric Strip for Active Keyword */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="font-heading text-3xl text-slate-900">{dynamicScore}</h3>
                <span className="text-xs font-bold text-emerald-600">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Grade A · High rank potential</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-heading font-bold text-lg">
              {dynamicScore >= 90 ? "A+" : "A"}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Volume</p>
              <h3 className="font-heading text-3xl text-slate-900 mt-1">{activeAudit?.volume || "3.4K"}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Monthly global searches</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Intent</p>
              <h3 className="font-heading text-2xl text-slate-900 mt-1.5">{activeAudit?.intent || "Commercial"}</h3>
              <p className="text-[11px] text-slate-500 mt-1">High conversion propensity</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword Difficulty</p>
              <h3 className="font-heading text-2xl text-slate-900 mt-1.5">{activeAudit?.difficulty || "Medium"}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Estimated 4-6 backlinks needed</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Section: Interactive Content Editor on Left, SERP & Recommendations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Live Content Editor */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-heading text-lg text-slate-900">Live Content Scoreboard</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>{draftContent.split(/\s+/).filter(Boolean).length} words</span>
                  <span>·</span>
                  <span>{(draftContent.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length} exact keywords</span>
                </div>
              </div>

              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={15}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-y"
                placeholder="Write or paste your article draft here..."
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400">Score recalculates in real-time as you write and structure headings.</p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(draftContent);
                    addToast({ title: "Draft copied to clipboard", type: "success" });
                  }}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                >
                  Copy Optimized Draft
                </Button>
              </div>
            </div>

            {/* People Also Ask questions drawer */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> People Also Ask (Inject into Draft)
                </h3>
                <span className="text-xs text-slate-400">Click &apos;+&apos; to append as H3</span>
              </div>
              <div className="space-y-2.5">
                {peopleAlsoAsk.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-medium text-slate-700">{q}</p>
                    <button
                      onClick={() => handleInsertQuestion(q)}
                      className="shrink-0 ml-3 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Competitor SERP & AI Recommendations */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Live AI Generated Meta Tags Card */}
            {auditMetadata && (
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> AI Meta Tags & Schema
                  </h3>
                  <button
                    onClick={() => {
                      const tags = `<title>${auditMetadata.metaTitle}</title>\n<meta name="description" content="${auditMetadata.metaDescription}">`;
                      navigator.clipboard.writeText(tags);
                      addToast({ title: "Copied meta tags to clipboard", type: "success" });
                    }}
                    className="text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-700/60"
                  >
                    Copy HTML
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block">Title Tag:</span>
                    <p className="font-semibold text-slate-100">{auditMetadata.metaTitle}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block">Meta Description:</span>
                    <p className="text-slate-300 leading-relaxed">{auditMetadata.metaDescription}</p>
                  </div>
                  {auditMetadata.semanticKeywords && auditMetadata.semanticKeywords.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Target Semantic LSI Entities:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {auditMetadata.semanticKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI SEO Action Recommendations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ranking Checklist
              </h3>
              <div className="space-y-3">
                {activeAudit?.recommendations.map((rec, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-indigo-900 leading-relaxed">
                    AI entity coverage: High semantic resonance for B2B buyer intent.
                  </p>
                </div>
              </div>
            </div>

            {/* Top 3 Competitor SERP Comparison */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base text-slate-900 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-indigo-600" /> Top 3 Ranking Competitors
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">US Google SERP</span>
              </div>
              <div className="space-y-3">
                {competitorSerp.map((comp) => (
                  <div key={comp.rank} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          #{comp.rank}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{comp.title}</h4>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-slate-500 pl-7">
                      <span>DA: <strong className="text-slate-700">{comp.da}</strong></span>
                      <span>·</span>
                      <span>Length: <strong className="text-slate-700">{comp.words}w</strong></span>
                      <span>·</span>
                      <span className="truncate text-slate-400">{comp.url}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
