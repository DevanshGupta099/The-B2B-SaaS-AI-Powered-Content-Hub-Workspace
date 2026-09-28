"use client";

import React from "react";
import { FileText, Sparkles, CheckSquare, MoreHorizontal, Clock, ArrowRight } from "lucide-react";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const metrics = [
    { label: "Active Documents", value: "24", icon: FileText, color: "text-white", bg: "bg-[#020617]", border: "border-[#1e293b]" },
    { label: "AI Tokens Used", value: "85.2k", icon: Sparkles, color: "text-white", bg: "bg-indigo-600", border: "border-indigo-500" },
    { label: "Pending Tasks", value: "12", icon: CheckSquare, color: "text-[#020617]", bg: "bg-white", border: "border-slate-200" }
  ];

  const recentActivity = [
    { id: 1, user: "Sarah Connor", action: "edited", document: "Q4 Marketing Strategy", time: "2 mins ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, user: "Devansh", action: "commented on", document: "Engineering RFC", time: "1 hour ago", avatar: "https://i.pravatar.cc/150?u=devansh" },
    { id: 3, user: "Michael Scott", action: "created", document: "Weekly Sync Notes", time: "3 hours ago", avatar: "https://i.pravatar.cc/150?u=michael" },
  ];

  const workspaces = [
    { id: "1", name: "Project Apollo", desc: "Core infrastructure rewrite", docs: 15, users: [{id: "u1", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?u=sarah"}, {id: "u2", name: "Devansh", avatarUrl: "https://i.pravatar.cc/150?u=devansh"}] },
    { id: "2", name: "Brand Refresh", desc: "Marketing assets and guidelines", docs: 8, users: [{id: "u3", name: "Michael", avatarUrl: "https://i.pravatar.cc/150?u=michael"}] },
    { id: "3", name: "Q4 Roadmap", desc: "Product planning", docs: 3, users: [{id: "u1", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?u=sarah"}] },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-heading text-4xl text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 mt-2 text-lg">Here&apos;s what&apos;s happening in your intelligent workspace.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-[#020617] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Sparkles className="w-4 h-4" /> Generate Report
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className={`p-6 rounded-2xl shadow-sm border ${m.border} ${m.bg} flex flex-col gap-4 relative overflow-hidden`}
            >
              {i === 1 && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none" />
              )}
              <div className="flex justify-between items-start z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-sm border border-white/20`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <button className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${m.color}`}>
                  <MoreHorizontal className="w-5 h-5 opacity-70" />
                </button>
              </div>
              <div className="z-10 mt-2">
                <p className={`text-sm font-medium mb-1 ${m.bg === 'bg-white' ? 'text-slate-500' : 'text-white/80'}`}>{m.label}</p>
                <h3 className={`font-heading text-4xl ${m.bg === 'bg-white' ? 'text-slate-900' : 'text-white'}`}>{m.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pinned Workspaces */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-900">Pinned Workspaces</h2>
              <Link href="/dashboard/workspaces" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {workspaces.map((ws, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={ws.id}
                >
                  <Link href={`/workspace/${ws.id}`} className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group h-full flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-heading text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{ws.name}</h3>
                        <p className="text-sm text-slate-500 mt-2">{ws.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <FileText className="w-4 h-4" /> {ws.docs}
                      </div>
                      <AvatarGroup users={ws.users} maxCount={3} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-900 flex items-center gap-2">
                Activity
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-8">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute top-10 left-5 bottom-[-32px] w-px bg-slate-100"></div>
                    )}
                    <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 z-10 bg-white" />
                    <div className="pt-1">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-semibold text-slate-900">{activity.user}</span> {activity.action} <span className="font-medium text-indigo-600 hover:underline cursor-pointer">{activity.document}</span>
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {activity.time}
                      </p>
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
