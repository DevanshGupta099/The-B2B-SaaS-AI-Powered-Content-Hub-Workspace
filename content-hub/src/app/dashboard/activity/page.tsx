"use client";

import { CheckCircle2, FileEdit, MessageSquare, Sparkles, UserPlus } from "lucide-react";

const activity = [
  { icon: FileEdit, text: "Sarah updated Marketing Strategy - Q4", time: "2 minutes ago", color: "text-indigo-600 bg-indigo-50" },
  { icon: MessageSquare, text: "Devansh left a comment on Architecture RFC", time: "18 minutes ago", color: "text-sky-600 bg-sky-50" },
  { icon: Sparkles, text: "Nexus AI generated a campaign brief", time: "1 hour ago", color: "text-violet-600 bg-violet-50" },
  { icon: CheckCircle2, text: "Michael completed Brand Guidelines review", time: "3 hours ago", color: "text-emerald-600 bg-emerald-50" },
  { icon: UserPlus, text: "Alex Johnson joined the Product workspace", time: "Yesterday", color: "text-amber-600 bg-amber-50" },
];

export default function ActivityPage() {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl text-slate-900 tracking-tight">Activity</h1>
        <p className="mt-2 text-lg text-slate-500">A shared timeline of what your team and Nexus AI are doing.</p>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="space-y-8">
            {activity.map((item, index) => (
              <div key={item.text} className="relative flex gap-4">
                {index < activity.length - 1 && <div className="absolute left-5 top-11 h-10 w-px bg-slate-200" />}
                <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}><item.icon className="w-5 h-5" /></div>
                <div className="pt-1"><p className="font-medium text-slate-800">{item.text}</p><p className="mt-1 text-sm text-slate-400">{item.time}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
