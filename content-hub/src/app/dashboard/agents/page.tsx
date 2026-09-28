"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  Plus, 
  Wand2, 
  Send, 
  Copy, 
  Check, 
  BookOpen, 
  Sliders, 
  Settings2, 
  FileText, 
  ChevronRight, 
  Flame, 
  BookmarkPlus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, CustomAgent } from "@/lib/workspace-data";
import { createDocument } from "@/lib/documents";

export default function CustomAgentsPage() {
  const { addToast } = useToast();
  const [agents, setAgents] = useState<CustomAgent[]>(() => getWorkspaceData().agents);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || "agent-tech");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeOutput, setActiveOutput] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Agent Form state
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newRole, setNewRole] = useState("Growth & Copywriting");
  const [newSystemPrompt, setNewSystemPrompt] = useState("");
  const [newTemperature, setNewTemperature] = useState(0.7);

  const [telemetry, setTelemetry] = useState<{ latencyMs: number; tokens: number; model: string } | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleRunAgent = async (inputPrompt?: string) => {
    const textToUse = inputPrompt || prompt;
    if (!textToUse.trim()) return;
    setIsGenerating(true);
    const brand = getWorkspaceData().brandKit;
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Goal / Task:\n${textToUse}\n\nDeliver your response adopting your full persona role (${selectedAgent.role}). Format with Markdown headings, actionable bullets, and concrete examples.`,
          systemPrompt: selectedAgent.systemPrompt,
          temperature: selectedAgent.temperature,
          brandVoice: brand.voice,
          restrictedTerms: brand.restrictedTerms,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setActiveOutput(
          `## [${selectedAgent.name}] Output\n\n**Goal:** ${textToUse}\n**Persona Role Applied:** ${selectedAgent.role}\n**Grounded Knowledge:** ${selectedAgent.knowledgeSources.join(", ")}\n\n### Strategic Response\n${data.text}\n\n### Guardrails Enforced\nVoice adheres to: "${brand.voice.slice(0, 50)}...". Restricted terms (${brand.restrictedTerms.slice(0, 30)}...) omitted.`
        );
        setTelemetry({ latencyMs: data.latencyMs, tokens: data.tokens?.total || 0, model: data.model });
        addToast({
          title: `${selectedAgent.name} finished generating`,
          message: `Generated in ${data.latencyMs}ms (${data.tokens?.total || 0} tokens)`,
          type: "success"
        });
      } else {
        throw new Error(data.error || "Agent response failed");
      }
    } catch (err: any) {
      addToast({ title: "Agent Run Failed", message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSystemPrompt.trim()) return;
    const newAgent: CustomAgent = {
      id: `agent-${crypto.randomUUID().slice(0, 6)}`,
      name: newName.trim(),
      tagline: newTagline.trim() || "Custom AI Content Specialist",
      role: newRole,
      systemPrompt: newSystemPrompt.trim(),
      temperature: newTemperature,
      iconBg: "from-fuchsia-500 to-indigo-600",
      knowledgeSources: ["Product messaging framework", "Nexus style guide"],
      examplePrompts: [
        `Write content aligned to ${newName}`,
        `Draft strategic takeaways with ${newRole} perspective`
      ]
    };
    const next = [...agents, newAgent];
    setAgents(next);
    setSelectedAgentId(newAgent.id);
    updateWorkspaceData(d => ({
      ...d,
      agents: next,
      activity: [`New Custom Agent deployed: '${newAgent.name}'`, ...d.activity]
    }));
    setIsCreateModalOpen(false);
    setNewName("");
    setNewTagline("");
    setNewSystemPrompt("");
    addToast({
      title: "Custom Agent Created!",
      message: `${newAgent.name} is now available in your agent fleet.`,
      type: "success"
    });
  };

  const handleSaveToDocs = () => {
    if (!activeOutput) return;
    const doc = createDocument(`${selectedAgent.name} - Output`, "Marketing", activeOutput);
    updateWorkspaceData(data => ({
      ...data,
      activity: [`Agent output saved to documents: ${selectedAgent.name}`, ...data.activity]
    }));
    addToast({
      title: "Saved to Documents",
      message: `Created new document "${doc.title}" with full content.`,
      type: "success"
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Autonomous Agents Fleet
              </span>
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {agents.length} Specialized Agents Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">Custom AI Agents Studio</h1>
            <p className="text-slate-500 mt-1 text-base">Deploy specialized AI personas with custom system prompts, temperature controls, and linked knowledge bases.</p>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Custom Agent
          </Button>
        </div>

        {/* Agent Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${agent.iconBg} flex items-center justify-center text-white shadow-sm font-bold text-sm`}>
                      {agent.name.slice(0, 1)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      Temp: {agent.temperature}
                    </span>
                  </div>
                  <h3 className="font-heading text-base text-slate-900 mb-1">{agent.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{agent.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-600">{agent.role}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-300"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Agent Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Agent Configuration & Prompt Runner */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${selectedAgent.iconBg} flex items-center justify-center text-white font-bold`}>
                    {selectedAgent.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-slate-900">{selectedAgent.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{selectedAgent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active Agent
                  </span>
                </div>
              </div>

              {/* System Instructions Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> System Prompt</span>
                  <span className="text-indigo-600 font-mono">Temp: {selectedAgent.temperature}</span>
                </div>
                <p className="italic leading-relaxed">{selectedAgent.systemPrompt}</p>
              </div>

              {/* Linked Knowledge Bases */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Grounded Knowledge Sources
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.knowledgeSources.map((source, i) => (
                    <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* One-Click Example Prompts */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> One-Click Workflow Presets
                </label>
                <div className="space-y-2">
                  {selectedAgent.examplePrompts.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(example);
                        handleRunAgent(example);
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-xs font-semibold text-slate-700 flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{example}</span>
                      <Wand2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Instruction or Topic
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder={`Ask ${selectedAgent.name} to generate copy, briefs, or breakdown a topic...`}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleRunAgent()}
                isLoading={isGenerating}
                className="w-full gap-2 bg-[#020617] hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow-md"
              >
                <Send className="w-4 h-4" /> Run {selectedAgent.name}
              </Button>
            </div>
          </div>

          {/* Right Column: Execution Output Canvas */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 min-h-[520px] flex flex-col">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Generated Agent Response
                  </h3>
                  {telemetry && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ⚡ {telemetry.latencyMs}ms ({telemetry.tokens} tokens)
                    </span>
                  )}
                </div>
                {activeOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeOutput);
                        addToast({ title: "Copied to clipboard", type: "success" });
                      }}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button
                      onClick={handleSaveToDocs}
                      className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-indigo-200"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                )}
              </div>

              {activeOutput ? (
                <div className="flex-1 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                    {activeOutput}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  <Cpu className="w-10 h-10 text-slate-300 mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">Agent Canvas Ready</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Select one of the preset prompts or type your custom instruction to test {selectedAgent.name}.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Model: Nexus Core v2.4 (Fine-Tuned)</span>
                <span>Latency: ~420ms</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Create Custom Agent Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Deploy New Custom Agent"
        description="Configure a dedicated AI assistant tailored to your team's specific tone, workflows, and guidelines."
      >
        <form onSubmit={handleCreateAgent} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Agent Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sales Enablement Ghostwriter"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Specialty Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Growth & Copywriting</option>
              <option>Developer & Technical Writing</option>
              <option>Executive Communications</option>
              <option>Sales Battlecards & Enablement</option>
              <option>SEO & Long-Form Articles</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Tagline</label>
            <input
              type="text"
              value={newTagline}
              onChange={(e) => setNewTagline(e.target.value)}
              placeholder="e.g. Creates high-converting sales battlecards"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">System Instructions</label>
            <textarea
              value={newSystemPrompt}
              onChange={(e) => setNewSystemPrompt(e.target.value)}
              rows={3}
              placeholder="Define persona, tone guardrails, and formatting constraints..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Creativity Temperature</span>
              <span className="text-indigo-600">{newTemperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={newTemperature}
              onChange={(e) => setNewTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Precise & Analytical (0.1)</span>
              <span>Creative & Expressive (1.0)</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Deploy Agent</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
