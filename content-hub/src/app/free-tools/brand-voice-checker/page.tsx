"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Zap,
  RefreshCw
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";
import { useToast } from "@/components/ui/ToastNotifications";

export default function FreeBrandVoiceCheckerPage() {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState(
    "Our cutting-edge revolutionary platform leverages best-in-class deep AI algorithms to disrupt the enterprise landscape with synergistic paradigm shifts."
  );
  const [analyzed, setAnalyzed] = useState(true);

  // Simple heuristic linter for free tier
  const forbiddenBuzzwords = ["revolutionary", "cutting-edge", "best-in-class", "disrupt", "synergistic", "paradigm shift", "game-changer", "magic"];
  
  const foundBuzzwords = forbiddenBuzzwords.filter(bw => 
    inputText.toLowerCase().includes(bw.toLowerCase())
  );

  const [isFixing, setIsFixing] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const rawScore = Math.max(20, Math.min(100, 100 - (foundBuzzwords.length * 15)));

  const handleAnalyze = () => {
    setAnalyzed(true);
    addToast({ title: "Analysis updated!", type: "success" });
  };

  const handleAiFix = async () => {
    setIsFixing(true);
    try {
      const res = await fetch("/api/ai/brand-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          restrictedTerms: forbiddenBuzzwords.join(", "),
          autoFix: true,
        }),
      });
      const data = await res.json();
      if (data.fixedText) {
        setInputText(data.fixedText);
        addToast({ title: "Auto-Fixed with Groq LLM!", message: "Rewrote copy without forbidden buzzwords.", type: "success" });
      }
    } catch (err: any) {
      addToast({ title: "Fix Error", message: err.message, type: "error" });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <MarketingShell>
      <main className="space-y-16 pb-28">
        
        <MarketingHero
          eyebrow="Free Governance Tool"
          title="Free Brand Voice & Buzzword Linter"
          description="Paste your B2B copy to instantly detect overused corporate buzzwords, evaluate tone clarity, and score alignment."
        />

        <section className="mx-auto max-w-4xl px-5 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input Textarea */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Paste Your Copy to Lint</span>
                <span className="text-slate-400 font-medium">{wordCount} words</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setAnalyzed(true);
                }}
                rows={8}
                placeholder="Paste marketing copy, landing page intro, or LinkedIn draft here..."
                className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-sans shadow-sm leading-relaxed"
              />
              <button
                onClick={handleAnalyze}
                className="px-5 py-2.5 rounded-xl bg-[#020617] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Lint Copy
              </button>
            </div>

            {/* Right: Real-Time Scorecard */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-200 space-y-6 bg-white flex flex-col justify-between shadow-lg">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Voice Adherence Score
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    rawScore >= 80 
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}>
                    {rawScore >= 80 ? "Strong Voice" : "Buzzword Heavy"}
                  </span>
                </div>

                <div className="text-center py-2">
                  <div className="font-heading text-5xl font-black text-slate-950">
                    {rawScore}<span className="text-xl text-slate-400 font-normal">/100</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Detected Buzzwords:</span>
                  {foundBuzzwords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {foundBuzzwords.map((bw, i) => (
                        <span key={i} className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> &ldquo;{bw}&rdquo;
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Zero generic buzzwords detected!
                    </p>
                  )}
                </div>

                {foundBuzzwords.length > 0 && (
                  <button
                    onClick={handleAiFix}
                    disabled={isFixing}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isFixing ? "animate-spin" : ""}`} />
                    {isFixing ? "Rewriting with Groq LLM..." : "1-Click AI Fix (Eliminate Buzzwords)"}
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/dashboard/brand-kit"
                  className="w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Build Custom Brand Kit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </section>

      </main>
    </MarketingShell>
  );
}
