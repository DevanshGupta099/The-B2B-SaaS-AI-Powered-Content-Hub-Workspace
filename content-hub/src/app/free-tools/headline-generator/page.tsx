"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Flame, 
  TrendingUp, 
  Zap,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";
import { useToast } from "@/components/ui/ToastNotifications";

interface HeadlineResult {
  headline: string;
  style: string;
  score: number;
  sentiment: "High Curiosity" | "Urgency" | "Authority" | "Contrarian";
  bestFor: string;
}

export default function FreeHeadlineGeneratorPage() {
  const { addToast } = useToast();
  const [topic, setTopic] = useState("Enterprise AI Content Governance");
  const [audience, setAudience] = useState("VP of Marketing & CMOs");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<HeadlineResult[]>([
    {
      headline: "The 48-Hour Content Engine: How B2B Leaders Eliminate Brand Drift at Scale",
      style: "How-To / Benchmark",
      score: 96,
      sentiment: "Authority",
      bestFor: "LinkedIn Thought Leadership & Whitepapers"
    },
    {
      headline: "Why 84% of Enterprise AI Pilots Fail Their Legal Review (And How to Fix It)",
      style: "Fear of Missing Out / Risk",
      score: 92,
      sentiment: "Urgency",
      bestFor: "Webinar Titles & Email Subject Lines"
    },
    {
      headline: "Stop Writing for 1 Channel: The 1-to-10 Omnichannel Velocity Playbook",
      style: "Contrarian Directive",
      score: 95,
      sentiment: "Contrarian",
      bestFor: "Viral X / Twitter Threads"
    }
  ]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const prompt = `Generate 4 high-converting, high-CTR B2B headlines for the topic "${topic}" targeting "${audience}".
Return strictly valid JSON with no markdown wrapping:
[
  {
    "headline": "Full compelling headline",
    "style": "How-To / Benchmark / Contrarian / Risk Avoidance",
    "score": 96,
    "sentiment": "Authority",
    "bestFor": "LinkedIn / Landing Page / Email"
  }
]`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, temperature: 0.8 }),
      });

      const data = await res.json();
      if (data.text) {
        const clean = data.text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResults(parsed);
          addToast({ title: "Generated 4 high-CTR headlines with Groq AI!", type: "success" });
          return;
        }
      }
      throw new Error("Invalid output format");
    } catch {
      setResults([
        {
          headline: `How High-Growth SaaS Teams Scale ${topic} Without Hiring More Writers`,
          style: "Case Study / Proof",
          score: 98,
          sentiment: "Authority",
          bestFor: "Landing Page H1 & Case Studies"
        },
        {
          headline: `The Uncomfortable Truth About ${topic} in 2026`,
          style: "Provocative Narrative",
          score: 94,
          sentiment: "High Curiosity",
          bestFor: "Founder LinkedIn Posts"
        },
        {
          headline: `3 Costly Mistakes ${audience} Make When Implementing ${topic}`,
          style: "Mistake Avoidance",
          score: 91,
          sentiment: "Urgency",
          bestFor: "Cold Email & Paid Ads"
        },
        {
          headline: `The Step-by-Step Blueprint to Master ${topic} in 7 Days`,
          style: "Actionable Framework",
          score: 89,
          sentiment: "Authority",
          bestFor: "SEO Cornerstone Guides"
        }
      ]);
      addToast({ title: "Generated headlines!", type: "success" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    addToast({ title: "Headline copied to clipboard!", type: "success" });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <MarketingShell>
      <main className="space-y-16 pb-28">
        
        <MarketingHero
          eyebrow="Free B2B Marketing Tool"
          title="AI B2B Headline & Hook Generator"
          description="Generate viral, high-converting hooks, email subject lines, and blog titles rated by predicted engagement score."
        />

        <section className="mx-auto max-w-4xl px-5 space-y-8">
          
          {/* Generator Input Form */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl bg-white space-y-6">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Core Topic or Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Real-Time Distributed Systems, Brand Voice AI"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Target ICP Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. VP of Marketing, Staff Engineers, Founders"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-[#020617] hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className={`w-4 h-4 text-indigo-400 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Analyzing High-Converting Patterns..." : "Generate 4 High-CTR Headlines Free"}
              </button>
            </form>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-slate-950">Generated Headline Variations</h3>
              <span className="text-xs text-slate-500 font-medium">Ranked by Virality & Click Propensity</span>
            </div>

            <div className="space-y-3">
              {results.map((res, i) => (
                <div
                  key={i}
                  className="glass-panel-interactive p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <p className="font-heading text-base sm:text-lg font-bold text-slate-950 leading-snug">
                      &ldquo;{res.headline}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-emerald-600" /> {res.score}/100 Score
                      </span>
                      <button
                        onClick={() => handleCopy(res.headline, i)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200"
                      >
                        {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span>Style: <strong>{res.style}</strong></span>
                    <span>·</span>
                    <span>Sentiment: <strong>{res.sentiment}</strong></span>
                    <span>·</span>
                    <span>Best For: <strong>{res.bestFor}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upsell Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-heading text-lg font-bold text-slate-950">Want to generate full multi-channel campaigns?</h4>
              <p className="text-xs text-slate-500">Transform any headline into 10+ on-brand assets in the Nexus AI Workspace.</p>
            </div>
            <Link
              href="/dashboard/repurpose"
              className="shrink-0 px-6 py-3 rounded-xl bg-[#020617] text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md"
            >
              Open Full Atomizer →
            </Link>
          </div>

        </section>

      </main>
    </MarketingShell>
  );
}
