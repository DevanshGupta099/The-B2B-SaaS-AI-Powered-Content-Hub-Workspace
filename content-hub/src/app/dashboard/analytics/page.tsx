"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  const channelStats = [
    { channel: "LinkedIn", posts: 24, impressions: "148.2K", engagement: "4.8%", roiMultiplier: "4.2x" },
    { channel: "Webflow (Blog)", posts: 12, impressions: "82.4K", engagement: "6.1%", roiMultiplier: "5.8x" },
    { channel: "Twitter / X", posts: 38, impressions: "210.5K", engagement: "3.4%", roiMultiplier: "3.1x" },
    { channel: "HubSpot Email", posts: 8, impressions: "45.0K", engagement: "28.4%", roiMultiplier: "6.4x" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Content ROI & Velocity
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> GA4 & Search Console Synced
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Executive Analytics & AI Scoring
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Quantify hours saved, brand voice adherence index, token utilization, and multi-channel attribution.
            </p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>

        {/* Top High-Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hours Saved / Mo</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-3xl font-bold text-slate-900">480 hrs</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +65% faster vs manual drafting
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Dollar ROI</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-3xl font-bold text-slate-900">$43,200</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> $75/hr agency production rate
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand Consistency</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-3xl font-bold text-slate-900">98.4%</h3>
            <p className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero compliance infractions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Token Consumption</span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-3xl font-bold text-slate-900">412.5K</h3>
            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              82.5% of monthly quota
            </p>
          </div>

        </div>

        {/* Real-time AI Content Scorer Grid */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Real-Time AI Content Scorer & Intelligence
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated quality metrics evaluated across active workspace drafts.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Grade: A+ (Enterprise Ready)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Brand Voice Consistency */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-slate-600">Brand Consistency Index</span>
              <h4 className="font-heading text-2xl font-bold text-indigo-700">96.8 / 100</h4>
              <p className="text-[11px] text-slate-500">Zero forbidden buzzwords detected.</p>
            </div>

            {/* Metric 2: SEO Score */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-slate-600">SEO Keyword Adherence</span>
              <h4 className="font-heading text-2xl font-bold text-emerald-700">92.0 / 100</h4>
              <p className="text-[11px] text-slate-500">Topical density & PAA schema complete.</p>
            </div>

            {/* Metric 3: Readability Matrix */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-slate-600">Flesch-Kincaid Readability</span>
              <h4 className="font-heading text-2xl font-bold text-purple-700">Grade 9.4</h4>
              <p className="text-[11px] text-slate-500">Accessible to technical B2B buyers.</p>
            </div>

            {/* Metric 4: Originality & Hallucination Guard */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-slate-600">Originality & Fact Check</span>
              <h4 className="font-heading text-2xl font-bold text-cyan-700">99.4% Verified</h4>
              <p className="text-[11px] text-slate-500">Grounded in Knowledge Base facts.</p>
            </div>

          </div>
        </div>

        {/* Charts & Attribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AI Usage & Velocity Trends (Left 7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900">Content Velocity & Production Trends</h2>
                <p className="text-xs text-slate-500">Monthly assets produced vs turnaround cycle hours.</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                +42% MoM Output
              </span>
            </div>
            
            {/* Visual Bar Chart */}
            <div className="w-full h-56 flex items-end justify-between gap-2 border-b border-slate-200 pb-2 relative">
              <div className="w-full h-full flex items-end justify-between gap-2">
                {[35, 45, 30, 60, 75, 95, 80, 110, 125, 142, 130, 155].map((height, i) => (
                  <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                    <div 
                      className="bg-indigo-100 group-hover:bg-indigo-600 transition-colors w-full rounded-t-md cursor-pointer" 
                      style={{ height: `${(height / 160) * 100}%` }}
                      title={`Month ${i + 1}: ${height} assets`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full flex justify-between text-[11px] font-mono text-slate-500">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Multi-Channel Attribution Matrix (Right 5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900">Channel Performance & ROI</h2>
              <p className="text-xs text-slate-500">Syndication engagement and estimated pipeline ROI.</p>
            </div>

            <div className="space-y-3">
              {channelStats.map((stat) => (
                <div key={stat.channel} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{stat.channel}</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {stat.roiMultiplier} Pipeline ROI
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{stat.posts} Published</span>
                    <span>{stat.impressions} Reach</span>
                    <span>{stat.engagement} CTR</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Content ROI Multiplier</span>
              </div>
              <span className="text-xs font-bold text-indigo-700">4.8x Aggregate</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
