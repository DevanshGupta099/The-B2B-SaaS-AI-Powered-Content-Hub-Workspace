"use client";

import React, { useState } from "react";
import { 
  Radio, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  ArrowUpRight, 
  Plus, 
  Copy, 
  FileText, 
  BookmarkPlus, 
  Layers, 
  Swords, 
  Check, 
  RefreshCw,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, CompetitorMove } from "@/lib/workspace-data";
import { createDocument } from "@/lib/documents";

const contentGaps = [
  { topic: "Enterprise AI Brand Voice Governance", ourCoverage: "High (Rank #1)", compCoverage: "Medium", gapStatus: "Leader" },
  { topic: "Multi-Channel Omni-Repurposing", ourCoverage: "High (Rank #2)", compCoverage: "Low", gapStatus: "Leader" },
  { topic: "Zero-Markup Token Pricing Model", ourCoverage: "High", compCoverage: "None", gapStatus: "Differentiator" },
  { topic: "Video Script & Short-form Auto-Generator", ourCoverage: "Medium", compCoverage: "High", gapStatus: "Opportunity" },
];

export default function CompetitorRadarPage() {
  const { addToast } = useToast();
  const [moves, setMoves] = useState<CompetitorMove[]>(() => getWorkspaceData().competitorMoves);
  const [selectedMove, setSelectedMove] = useState<CompetitorMove | null>(moves[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);
  const [generatedBattlecard, setGeneratedBattlecard] = useState("");

  // New Competitor Form state
  const [compName, setCompName] = useState("");
  const [moveType, setMoveType] = useState<CompetitorMove["type"]>("Product Launch");
  const [moveTitle, setMoveTitle] = useState("");
  const [counterAction, setCounterAction] = useState("");

  const [telemetry, setTelemetry] = useState<{ latencyMs: number; tokens: number; model: string } | null>(null);

  const handleGenerateBattlecard = async (move: CompetitorMove) => {
    setIsGeneratingBattlecard(true);
    try {
      const res = await fetch("/api/ai/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitor: move.competitor,
          eventTitle: move.title,
          details: move.counterAction,
        }),
      });

      const data = await res.json();
      let text = `## ⚔️ Competitive Sales Battlecard vs ${move.competitor}\n\n**Trigger Event:** ${move.title} (${move.type})\n**Strategic Impact:** ${move.impact}\n\n### Impact Analysis\n${data.impactAnalysis || "Competitor is actively targeting high-velocity content teams."}\n\n### Winning Counter-Positioning Angles\n`;

      if (data.counterAngles && Array.isArray(data.counterAngles)) {
        data.counterAngles.forEach((angle: any) => {
          text += `\n#### 🎯 ${angle.channel}: ${angle.headline}\n*Rationale:* ${angle.rationale}\n`;
        });
      }

      text += `\n### ⚡ Recommended Immediate Action\n${data.recommendedAction || move.counterAction}\n\n### Objection Handling Script for Sales Reps\n*"When prospects mention ${move.competitor}'s latest ${move.type.toLowerCase()}, acknowledge their feature but emphasize that Nexus is the only platform providing full human-in-the-loop brand governance, CRDT multiplayer sync, and deterministic multi-channel atomization."*`;

      setGeneratedBattlecard(text);
      addToast({
        title: "Battlecard Generated!",
        message: `Prepared live Groq AI sales positioning strategy vs ${move.competitor}.`,
        type: "success"
      });
    } catch (err: any) {
      addToast({ title: "Battlecard Generation Error", message: err.message, type: "error" });
    } finally {
      setIsGeneratingBattlecard(false);
    }
  };

  const handleCreateMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim() || !moveTitle.trim()) return;
    const newMove: CompetitorMove = {
      id: `move-${crypto.randomUUID().slice(0, 6)}`,
      competitor: compName.trim(),
      logo: compName.trim().slice(0, 1).toUpperCase(),
      type: moveType,
      title: moveTitle.trim(),
      date: "Just now",
      impact: "High",
      counterAction: counterAction.trim() || "Update sales battlecard and monitor organic search movements."
    };
    const next = [newMove, ...moves];
    setMoves(next);
    setSelectedMove(newMove);
    updateWorkspaceData(d => ({
      ...d,
      competitorMoves: next,
      activity: [`Competitor move logged: ${newMove.competitor} - ${newMove.title}`, ...d.activity]
    }));
    setIsModalOpen(false);
    setCompName("");
    setMoveTitle("");
    setCounterAction("");
    addToast({ title: "Competitor Move Logged", type: "success" });
  };

  const handleSaveBattlecard = () => {
    if (!generatedBattlecard) return;
    const doc = createDocument(`Battlecard vs ${selectedMove?.competitor || "Competitor"}`, "Marketing", generatedBattlecard);
    addToast({ title: "Battlecard saved to Documents", message: `Created new document "${doc.title}".`, type: "success" });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> Market Radar
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Live Intelligence Stream
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">Competitor & Market Intelligence Radar</h1>
            <p className="text-slate-500 mt-1 text-base">Monitor competitor product announcements, pricing shifts, and content velocity to seize market gaps.</p>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Competitor Move
          </Button>
        </div>

        {/* Intelligence Feed & Battlecard Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Competitor Moves Feed */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-lg text-slate-900 font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-600" /> Recent Competitor Shifts
                </h3>
                <span className="text-xs text-slate-400 font-medium">{moves.length} active alerts</span>
              </div>

              <div className="space-y-3">
                {moves.map((move) => {
                  const isSelected = selectedMove?.id === move.id;
                  return (
                    <div
                      key={move.id}
                      onClick={() => {
                        setSelectedMove(move);
                        handleGenerateBattlecard(move);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white border-rose-500 ring-2 ring-rose-500/20 shadow-sm"
                          : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {move.logo}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                              {move.competitor} · {move.type}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{move.title}</h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                          {move.impact} Impact
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 pl-12 leading-relaxed bg-white/60 p-2.5 rounded-xl border border-slate-100">
                        <strong>Counter-Strategy:</strong> {move.counterAction}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Gap Matrix */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading text-base text-slate-900 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Content & SEO Gap Matrix
              </h3>
              <div className="space-y-2.5">
                {contentGaps.map((gap, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-800">{gap.topic}</h5>
                      <span className="text-[10px] text-slate-400">Our Status: {gap.ourCoverage}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      gap.gapStatus === "Leader" ? "bg-emerald-100 text-emerald-800" :
                      gap.gapStatus === "Differentiator" ? "bg-indigo-100 text-indigo-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {gap.gapStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Instant Sales Battlecard Generator */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 min-h-[520px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-600" />
                  <h3 className="font-heading text-base text-slate-900 font-bold">
                    AI Sales Battlecard ({selectedMove?.competitor || "Competitor"})
                  </h3>
                </div>

                {generatedBattlecard && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBattlecard);
                        addToast({ title: "Battlecard copied", type: "success" });
                      }}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <Button
                      onClick={handleSaveBattlecard}
                      size="sm"
                      variant="secondary"
                      className="text-xs font-semibold rounded-xl"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Save Doc
                    </Button>
                  </div>
                )}
              </div>

              {generatedBattlecard ? (
                <div className="flex-1 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    {generatedBattlecard}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  <Swords className="w-10 h-10 text-slate-300 mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">Select a Competitor Move</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Click any competitor announcement on the left to auto-generate a sales counter-positioning battlecard.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Updated in sync with Brand Kit</span>
                <Button
                  onClick={() => selectedMove && handleGenerateBattlecard(selectedMove)}
                  isLoading={isGeneratingBattlecard}
                  size="sm"
                  className="bg-slate-900 text-white rounded-xl text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-generate Counter
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Log Competitor Move Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Competitor Market Shift"
        description="Add a competitor product release, pricing change, or campaign to the radar."
      >
        <form onSubmit={handleCreateMove} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Competitor Name</label>
            <input
              type="text"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="e.g. Jasper, Writer, Contently"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Shift Type</label>
            <select
              value={moveType}
              onChange={(e) => setMoveType(e.target.value as CompetitorMove["type"])}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Product Launch</option>
              <option>Pricing Shift</option>
              <option>Blog Post</option>
              <option>Campaign</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Announcement Headline</label>
            <input
              type="text"
              value={moveTitle}
              onChange={(e) => setMoveTitle(e.target.value)}
              placeholder="e.g. Launched automated enterprise workflow agent"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Recommended Counter-Action</label>
            <textarea
              value={counterAction}
              onChange={(e) => setCounterAction(e.target.value)}
              rows={3}
              placeholder="How should our product marketing and sales teams respond?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Add to Radar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
