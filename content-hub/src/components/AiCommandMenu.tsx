"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Languages, 
  BarChart3, 
  AlignLeft, 
  X, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Link as LinkIcon, 
  LayoutTemplate,
  Layers,
  SearchCode,
  Send,
  Radio,
  Building2,
  Cpu,
  BookOpen,
  ClipboardCheck,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandAction {
  id: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  category?: string;
  onSelect?: () => void;
}

export function AiCommandMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandAction[] = [
    { id: "nav-dam", icon: Layers, label: "Digital Asset Management (DAM)", shortcut: "D", category: "AI Tools", onSelect: () => router.push("/dashboard/dam") },
    { id: "nav-repurpose", icon: Layers, label: "Content Atomizer (Repurpose)", shortcut: "R", category: "AI Tools", onSelect: () => router.push("/dashboard/repurpose") },
    { id: "nav-agents", icon: Cpu, label: "Custom AI Agents", shortcut: "A", category: "AI Tools", onSelect: () => router.push("/dashboard/agents") },
    { id: "nav-seo", icon: SearchCode, label: "SEO Intelligence & Content Score", shortcut: "S", category: "Optimize", onSelect: () => router.push("/dashboard/seo") },
    { id: "nav-publish", icon: Send, label: "Publishing Hub & Social Queue", shortcut: "P", category: "Distribute", onSelect: () => router.push("/dashboard/publish") },
    { id: "nav-radar", icon: Radio, label: "Competitor Market Radar", category: "Intelligence", onSelect: () => router.push("/dashboard/radar") },
    { id: "nav-client-portal", icon: Building2, label: "Client & Stakeholder Portal", category: "Collaboration", onSelect: () => router.push("/dashboard/client-portal") },
    { id: "nav-localization", icon: Globe, label: "Localization & Multi-Lingual Hub", category: "Optimize", onSelect: () => router.push("/dashboard/localization") },
    { id: "nav-ai-studio", icon: Sparkles, label: "AI Studio (Create Draft)", category: "AI Tools", onSelect: () => router.push("/dashboard/ai-studio") },
    { id: "nav-brand-kit", icon: BookOpen, label: "Brand Kit & Guidelines", category: "Brand", onSelect: () => router.push("/dashboard/brand-kit") },
    { id: "nav-approvals", icon: ClipboardCheck, label: "Content Approvals", category: "Govern", onSelect: () => router.push("/dashboard/approvals") },
    
    // Navigation
    { id: "nav-dash", icon: Home, label: "Go to Dashboard Overview", category: "Navigation", onSelect: () => router.push("/dashboard") },
    { id: "nav-docs", icon: FileText, label: "Go to Documents", category: "Navigation", onSelect: () => router.push("/dashboard/documents") },
    { id: "nav-templates", icon: LayoutTemplate, label: "Go to Templates", category: "Navigation", onSelect: () => router.push("/dashboard/templates") },
    { id: "nav-analytics", icon: BarChart3, label: "Go to Analytics & Token ROI", category: "Navigation", onSelect: () => router.push("/dashboard/analytics") },
    { id: "nav-team", icon: Users, label: "Go to Team Members", category: "Navigation", onSelect: () => router.push("/dashboard/team") },
    { id: "nav-integrations", icon: LinkIcon, label: "Go to Integrations", category: "Navigation", onSelect: () => router.push("/dashboard/integrations") },
    { id: "nav-settings", icon: Settings, label: "Go to Workspace Settings", category: "Navigation", onSelect: () => router.push("/settings") },
  ];

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    (a.category && a.category.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => {
          if (!open) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !open;
        });
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredActions.length || 1)) % (filteredActions.length || 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const action = filteredActions[selectedIndex];
      if (action) {
        action.onSelect?.();
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Command Palette */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-5 py-4 border-b border-white/10">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
              <input 
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nexus AI or jump to any page..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400 text-base font-medium"
              />
              <div className="flex items-center gap-2 ml-3">
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded">ESC</span>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu" title="Close menu" className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  No matching tools or pages found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="space-y-1" role="listbox">
                  {filteredActions.map((action, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={action.id}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          action.onSelect?.();
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all duration-150",
                          isSelected ? "bg-indigo-600/30 text-white border border-indigo-500/30" : "text-slate-300 hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <action.icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-indigo-300" : "text-slate-400")} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{action.label}</span>
                        </div>
                        {action.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-white/5">
                            {action.category}
                          </span>
                        )}
                        {action.shortcut && (
                          <span className="text-[10px] font-bold text-slate-400 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded shadow-sm">
                            {action.shortcut}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs font-medium text-slate-400">
              <div className="flex items-center gap-4">
                <span>Navigate <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↑</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↓</kbd></span>
                <span>Select <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↵</kbd></span>
              </div>
              <span className="text-indigo-400 font-semibold">Nexus AI Suite v3.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
