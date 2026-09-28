"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Cpu, 
  Send, 
  CheckCircle2, 
  Filter,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { MarketingShell, MarketingHero } from "@/components/MarketingShell";
import { useToast } from "@/components/ui/ToastNotifications";

interface TemplateItem {
  id: string;
  title: string;
  category: "Thought Leadership" | "Product Marketing" | "Demand Gen" | "Technical DevRel" | "Sales Enablement" | "Social & Video";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  channels: string[];
  estimatedTime: string;
  previewPrompt: string;
  tags: string[];
}

const templatesData: TemplateItem[] = [
  {
    id: "rfc-to-blog",
    title: "Technical RFC to Deep-Dive Engineering Blog",
    category: "Technical DevRel",
    difficulty: "Advanced",
    description: "Transforms dense architectural RFCs, GitHub markdown specs, or Jira tickets into developer-friendly engineering deep dives.",
    channels: ["Engineering Blog", "Hacker News", "X Thread"],
    estimatedTime: "5 mins",
    previewPrompt: "Analyze the following system architecture RFC. Extract the core problem statement, trade-offs evaluated, why CRDTs were chosen over Operational Transformation, and generate a 1,200-word engineering blog with mermaid diagrams and code blocks.",
    tags: ["DevRel", "Engineering", "Architecture", "Deep Dive"]
  },
  {
    id: "omnichannel-social-kit",
    title: "1-to-10 Omnichannel Launch Campaign Kit",
    category: "Social & Video",
    difficulty: "Intermediate",
    description: "Takes 1 product announcement and instantly produces a LinkedIn executive post, 5-tweet viral thread, Substack brief, and 60-sec video script.",
    channels: ["LinkedIn", "Twitter/X", "Substack", "TikTok/Reels"],
    estimatedTime: "2 mins",
    previewPrompt: "Extract key value propositions from the attached press release. Output 1 high-authority LinkedIn post with bullet points, 1 narrative X thread with hooks, 1 short-form video teleprompter script, and 1 customer email newsletter.",
    tags: ["Social", "Product Launch", "Multi-Channel", "Repurposing"]
  },
  {
    id: "b2b-case-study",
    title: "Executive B2B Customer Case Study & ROI Story",
    category: "Product Marketing",
    difficulty: "Intermediate",
    description: "Structure raw customer interview transcripts into a polished Challenger-style case study highlighting quantifiable ARR impact.",
    channels: ["PDF One-Pager", "Website Case Study", "Sales Deck Slide"],
    estimatedTime: "4 mins",
    previewPrompt: "Given the customer interview transcript, write a 3-part case study: (1) The Breaking Point Challenge, (2) The Governed AI Deployment, (3) Measurable Results (65% turnaround drop, $140k saved). Include 2 executive pull-quotes.",
    tags: ["PMM", "Case Study", "Social Proof", "ROI"]
  },
  {
    id: "seo-pillar-cluster",
    title: "SEO Topical Authority Pillar & Cluster Matrix",
    category: "Thought Leadership",
    difficulty: "Advanced",
    description: "Build an exhaustive 2,500-word cornerstone guide optimized for high-intent search queries with Schema markup and PAA questions.",
    channels: ["SEO Long-Form", "FAQ Schema", "Internal Links"],
    estimatedTime: "6 mins",
    previewPrompt: "Create an authoritative cornerstone pillar guide for 'Enterprise AI Governance'. Include semantic H2/H3 hierarchy, People Also Ask answers, keyword density targets (1.8%), and a summary comparison matrix.",
    tags: ["SEO", "Content Strategy", "Pillar Content", "Organic Search"]
  },
  {
    id: "cold-outreach-sequence",
    title: "3-Step High-Intent Account Cold Email Sequence",
    category: "Sales Enablement",
    difficulty: "Beginner",
    description: "Craft hyper-personalized, value-first cold email sequences tailored to VP of Marketing & CMO pain points with 0 fluff.",
    channels: ["Email Sequences", "LinkedIn InMail", "Sales Battlecard"],
    estimatedTime: "3 mins",
    previewPrompt: "Generate a 3-touch outbound sequence for Tier 1 SaaS accounts. Touch 1: The 'Content Drift' observation. Touch 2: Atlas Cloud benchmark reference. Touch 3: Permission-based soft ask.",
    tags: ["Sales", "Outbound", "Cold Email", "B2B"]
  },
  {
    id: "executive-thought-leadership",
    title: "Founder / Executive LinkedIn Ghostwriting Pack",
    category: "Thought Leadership",
    difficulty: "Intermediate",
    description: "Turn rough voice memos or bullet notes into 3 distinct high-engagement founder LinkedIn posts with contrarian perspectives.",
    channels: ["LinkedIn Founder Post", "Newsletter Snippet"],
    estimatedTime: "3 mins",
    previewPrompt: "Transform these rough founder thoughts into a contrarian POV post on why traditional SEO agencies are obsolete in 2026. Use short punchy lines, strong hook, and actionable frameworks.",
    tags: ["Founder", "LinkedIn", "Personal Brand", "Contrarian"]
  }
];

const categories = ["All", "Thought Leadership", "Product Marketing", "Demand Gen", "Technical DevRel", "Sales Enablement", "Social & Video"];

export default function TemplateGalleryPage() {
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTemplate, setActiveModalTemplate] = useState<TemplateItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const filteredTemplates = templatesData.filter((tmpl) => {
    const matchesCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    addToast({ title: "Template prompt copied to clipboard!", type: "success" });
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <MarketingShell>
      <main className="space-y-16 pb-28">
        
        <MarketingHero
          eyebrow="Workflow Templates Library"
          title="50+ Enterprise B2B Content Recipes & Blueprints"
          description="Pre-built generation workflows fine-tuned for high-velocity marketing teams. Preview any template, copy prompts, or clone directly into your workspace."
        />

        <section className="mx-auto max-w-7xl px-5 space-y-8">
          
          {/* Search and Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates, tags, use cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#020617] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="glass-panel-interactive p-6 rounded-3xl space-y-5 flex flex-col justify-between bg-white"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      {template.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      ⏱ {template.estimatedTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-slate-950 leading-snug">
                    {template.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {template.channels.map((ch, i) => (
                      <span key={i} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalTemplate(template)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <Link
                    href={`/dashboard/ai-studio`}
                    className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Template Detail / Preview Modal */}
        {activeModalTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                    {activeModalTemplate.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-slate-950 mt-2">
                    {activeModalTemplate.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{activeModalTemplate.description}</p>
                </div>
                <button
                  onClick={() => setActiveModalTemplate(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Pre-Configured System Prompt Recipe</span>
                  <button
                    onClick={() => handleCopyPrompt(activeModalTemplate.previewPrompt)}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPrompt ? "Copied" : "Copy Prompt"}
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                  {activeModalTemplate.previewPrompt}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500">
                  Target Channels: {activeModalTemplate.channels.join(" · ")}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalTemplate(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <Link
                    href="/dashboard/ai-studio"
                    className="px-5 py-2.5 rounded-xl bg-[#020617] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
                  >
                    Launch in AI Studio →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </MarketingShell>
  );
}
