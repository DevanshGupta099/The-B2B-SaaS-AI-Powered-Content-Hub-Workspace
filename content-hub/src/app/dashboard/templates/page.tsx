"use client";

import React from "react";
import { Search, LayoutTemplate, PenTool, BarChart, Rocket, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

const templates = [
  { id: "1", title: "Blog Post", description: "SEO-optimized long-form content.", icon: PenTool, category: "Marketing", color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "2", title: "Strategy Document", description: "Quarterly planning and OKRs.", icon: BarChart, category: "Business", color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "3", title: "Press Release", description: "Standard PR format for announcements.", icon: Rocket, category: "Marketing", color: "text-amber-500", bg: "bg-amber-50" },
  { id: "4", title: "Meeting Notes", description: "Action items and summaries.", icon: FileText, category: "Team", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "5", title: "Product Requirements", description: "PRD template for engineering.", icon: LayoutTemplate, category: "Product", color: "text-rose-500", bg: "bg-rose-50" },
];

export default function TemplatesPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl text-slate-900 tracking-tight">Templates</h1>
          <p className="text-slate-500 mt-2 text-lg">Kickstart your documents with AI-powered templates.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617] shadow-sm transition-all font-medium" 
              placeholder="Search templates..." 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {["All", "Marketing", "Business", "Product", "Team"].map(cat => (
              <button key={cat} className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${cat === "All" ? "bg-[#020617] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:border-indigo-200 cursor-pointer flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${template.bg} ${template.color} group-hover:scale-110 transition-transform`}>
                  <template.icon className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  {template.category}
                </span>
              </div>
              
              <h3 className="font-heading text-2xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                {template.description}
              </p>
              
              <div className="mt-auto">
                <Button className="w-full bg-slate-50 hover:bg-[#020617] hover:text-white text-slate-900 font-bold py-3 rounded-xl transition-colors group-hover:shadow-md flex items-center justify-center gap-2">
                  Use Template <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
