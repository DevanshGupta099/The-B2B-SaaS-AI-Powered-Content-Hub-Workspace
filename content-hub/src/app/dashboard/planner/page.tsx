"use client";

import React, { useState } from "react";
import { 
  CalendarDays, 
  Plus, 
  Filter, 
  Trash2, 
  Kanban, 
  Calendar, 
  ListFilter, 
  BarChart2, 
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";

type CampaignStage = 
  | "Ideation" 
  | "Briefing" 
  | "First Draft" 
  | "Legal Review" 
  | "Approved" 
  | "Scheduled" 
  | "Published";

interface CampaignItem {
  id: string;
  title: string;
  channel: string;
  stage: CampaignStage;
  dueDate: string;
  author: string;
  reachEstimate: string;
}

const initialCards: CampaignItem[] = [
  { id: "c1", title: "Q3 Zero-Trust Security Benchmark", channel: "Whitepaper", stage: "Published", dueDate: "Aug 12", author: "Sarah Connor", reachEstimate: "14.2K" },
  { id: "c2", title: "Agentic AI in Enterprise Workspaces", channel: "LinkedIn", stage: "Scheduled", dueDate: "Aug 28", author: "Devansh", reachEstimate: "8.5K" },
  { id: "c3", title: "How Modern CFOs Optimize Content ROI", channel: "Webinar", stage: "Approved", dueDate: "Sep 04", author: "Michael Scott", reachEstimate: "2.1K" },
  { id: "c4", title: "SOC2 Compliance Migration Guide", channel: "Blog", stage: "Legal Review", dueDate: "Sep 10", author: "Sarah Connor", reachEstimate: "5.4K" },
  { id: "c5", title: "Why Traditional Headless CMSs Stagnate", channel: "Twitter Thread", stage: "First Draft", dueDate: "Sep 15", author: "Devansh", reachEstimate: "18.0K" },
  { id: "c6", title: "Product Launch: Multi-Model Copilot", channel: "Product Hunt", stage: "Briefing", dueDate: "Sep 22", author: "Devansh", reachEstimate: "25.0K" },
  { id: "c7", title: "Enterprise Pricing Tier Announcement", channel: "Email Newsletter", stage: "Ideation", dueDate: "Oct 01", author: "Michael Scott", reachEstimate: "11.8K" },
];

const stages: CampaignStage[] = [
  "Ideation", 
  "Briefing", 
  "First Draft", 
  "Legal Review", 
  "Approved", 
  "Scheduled", 
  "Published"
];

const channels = ["All Channels", "LinkedIn", "Twitter Thread", "Blog", "Whitepaper", "Webinar", "Email Newsletter", "Product Hunt"];

export default function PlannerPage() {
  const [cards, setCards] = useState<CampaignItem[]>(initialCards);
  const [viewMode, setViewMode] = useState<"kanban" | "month" | "list" | "gantt">("kanban");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newChannel, setNewChannel] = useState("LinkedIn");
  const [newStage, setNewStage] = useState<CampaignStage>("Ideation");
  const { addToast } = useToast();

  const move = (id: string, dir: -1 | 1) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = stages.indexOf(c.stage);
        const nextIdx = idx + dir;
        if (nextIdx < 0 || nextIdx >= stages.length) return c;
        return { ...c, stage: stages[nextIdx] };
      })
    );
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: CampaignItem = {
      id: "item-" + Date.now(),
      title: newTitle.trim(),
      channel: newChannel,
      stage: newStage,
      dueDate: "Sep 30",
      author: "Devansh",
      reachEstimate: "5.0K"
    };
    setCards([newItem, ...cards]);
    setNewTitle("");
    setIsNewModalOpen(false);
    addToast({ title: "Campaign item created", message: `Added to ${newStage}`, type: "success" });
  };

  const handleDeleteItem = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    addToast({ title: "Campaign item removed", type: "info" });
  };

  const filteredCards = cards.filter(c => selectedChannel === "All Channels" || c.channel === selectedChannel);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Campaign & Editorial Planner
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                7 Stages Configured
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Editorial Pipeline & Calendar
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Orchestrate multi-channel B2B campaigns across 7 workflow stages from ideation to live distribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-indigo-400" /> New Campaign Item
            </Button>
          </div>
        </div>

        {/* View Mode & Channel Filter Controls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "kanban" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-indigo-600" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "month" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Calendar View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-indigo-600" /> List View
            </button>
            <button
              onClick={() => setViewMode("gantt")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "gantt" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600" /> Gantt Timeline
            </button>
          </div>

          {/* Channel Filter Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {channels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>

        {/* 1. KANBAN BOARD VIEW */}
        {viewMode === "kanban" && (
          <div className="flex gap-4 overflow-x-auto pb-6">
            {stages.map((stage) => {
              const stageCards = filteredCards.filter(c => c.stage === stage);
              return (
                <div key={stage} className="w-72 shrink-0 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
                      {stage}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                      {stageCards.length}
                    </span>
                  </div>

                  <div className="min-h-[460px] p-3 rounded-2xl bg-slate-100/70 border border-slate-200/80 space-y-3">
                    {stageCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                            {card.channel}
                          </span>
                          <button
                            onClick={() => handleDeleteItem(card.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {card.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" /> {card.dueDate}
                          </span>
                          <span className="font-semibold text-slate-700">{card.author}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <button
                            disabled={stage === stages[0]}
                            onClick={() => move(card.id, -1)}
                            className="hover:text-slate-900 disabled:opacity-20 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                          >
                            ← Back
                          </button>
                          <button
                            disabled={stage === stages[stages.length - 1]}
                            onClick={() => move(card.id, 1)}
                            className="text-indigo-600 hover:text-indigo-700 disabled:opacity-20 px-2 py-1 rounded hover:bg-indigo-50 transition-colors font-semibold"
                          >
                            Advance →
                          </button>
                        </div>
                      </div>
                    ))}
                    {stageCards.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                        No items in {stage}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. CALENDAR VIEW */}
        {viewMode === "month" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-slate-900">September 2026 Editorial Grid</h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{filteredCards.length} assets scheduled in pipeline</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} className="py-2 text-[11px] font-bold uppercase text-slate-600 bg-slate-100 rounded-lg">
                  {d}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => {
                const day = i + 1;
                const match = filteredCards[i % filteredCards.length];
                return (
                  <div key={i} className="min-h-24 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{day}</span>
                    {day % 4 === 0 && match && (
                      <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 truncate shadow-2xs">
                        {match.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. LIST VIEW */}
        {viewMode === "list" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{c.title}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {c.channel}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{c.stage}</td>
                    <td className="p-4 text-slate-500">{c.author}</td>
                    <td className="p-4 font-mono text-slate-500">{c.dueDate}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteItem(c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. GANTT TIMELINE VIEW */}
        {viewMode === "gantt" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900">Campaign Velocity Gantt Timeline</h3>
            <div className="space-y-4">
              {filteredCards.map((c, idx) => (
                <div key={c.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-bold text-slate-900">{c.title}</span>
                    <span className="font-mono text-[11px] font-semibold text-indigo-600">{c.stage}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      style={{ width: `${Math.max(25, ((idx + 2) * 22) % 100)}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Campaign Modal */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-lg font-bold text-slate-900">Create Campaign Item</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Atlas Cloud Customer Story"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">Primary Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {channels.filter(c => c !== "All Channels").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as CampaignStage)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Create Item
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
