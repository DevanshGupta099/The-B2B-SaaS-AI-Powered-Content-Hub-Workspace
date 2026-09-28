"use client";

import React, { useState } from "react";
import { 
  Send, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  Share2, 
  Globe, 
  RefreshCw, 
  Sliders, 
  Layers,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, PublishItem } from "@/lib/workspace-data";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

const channelIcons = {
  linkedin: { icon: LinkedinIcon, name: "LinkedIn", color: "text-[#0A66C2] bg-[#0A66C2]/10" },
  twitter: { icon: TwitterIcon, name: "Twitter/X", color: "text-slate-900 bg-slate-100" },
  webflow: { icon: Globe, name: "Webflow", color: "text-[#4353FF] bg-[#4353FF]/10" },
  wordpress: { icon: Globe, name: "WordPress", color: "text-[#21759B] bg-[#21759B]/10" },
  substack: { icon: Globe, name: "Substack", color: "text-[#FF6719] bg-[#FF6719]/10" },
  hubspot: { icon: Globe, name: "HubSpot", color: "text-[#FF7A59] bg-[#FF7A59]/10" },
};

export default function PublishingPage() {
  const { addToast } = useToast();
  const [queue, setQueue] = useState<PublishItem[]>(() => getWorkspaceData().publishingQueue);
  const [filter, setFilter] = useState<"All" | "Scheduled" | "Published">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // New Post Form state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<("linkedin" | "twitter" | "webflow" | "hubspot" | "substack")[]>(["linkedin", "webflow"]);
  const [scheduleDate, setScheduleDate] = useState("Tomorrow at 10:00 AM EST");
  const [appendUtm, setAppendUtm] = useState(true);

  const filteredQueue = queue.filter(item => filter === "All" || item.status === filter);

  const toggleChannel = (ch: "linkedin" | "twitter" | "webflow" | "hubspot" | "substack") => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleCreatePost = (immediate: boolean = false) => {
    if (!postTitle.trim()) return;
    setIsPublishing(true);
    setTimeout(() => {
      const newItem: PublishItem = {
        id: `pub-${crypto.randomUUID().slice(0, 6)}`,
        title: postTitle.trim(),
        channels: selectedChannels,
        status: immediate ? "Published" : "Scheduled",
        scheduledFor: immediate ? "Just now" : scheduleDate,
        author: "Devansh",
        url: immediate ? "https://nexus.io/blog/live-post" : undefined
      };
      const next = [newItem, ...queue];
      setQueue(next);
      updateWorkspaceData(d => ({
        ...d,
        publishingQueue: next,
        activity: [`${immediate ? "Published" : "Scheduled"} post: '${newItem.title}' to ${selectedChannels.join(", ")}`, ...d.activity]
      }));
      setIsPublishing(false);
      setIsModalOpen(false);
      setPostTitle("");
      setPostContent("");
      addToast({
        title: immediate ? "Published Live!" : "Post Scheduled",
        message: `Pushed to ${selectedChannels.length} connected channels successfully.`,
        type: "success"
      });
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> CMS & Social Distribution
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                6 Channels Connected
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">Publishing & Distribution Hub</h1>
            <p className="text-slate-500 mt-1 text-base">Schedule and publish approved content directly to Webflow, WordPress, HubSpot, LinkedIn, and Twitter in 1 click.</p>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Publish / Schedule Post
          </Button>
        </div>

        {/* Connected Distribution Channels Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(channelIcons).map(([key, config]) => (
            <div key={key} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${config.color}`}>
                <config.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{config.name}</h4>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Synced
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter and Queue Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-xl text-slate-900">Distribution Queue</h2>
              <p className="text-xs text-slate-400 font-medium">Manage upcoming multi-channel syncs and verified published assets.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {(["All", "Scheduled", "Published"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === tab
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items */}
          <div className="space-y-4">
            {filteredQueue.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "Published" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-sky-100 text-sky-800"
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.scheduledFor}
                    </span>
                    <span className="text-xs font-medium text-slate-400">· By {item.author}</span>
                  </div>

                  <h3 className="font-heading text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Channel Badges */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {item.channels.map(ch => {
                      const c = channelIcons[ch];
                      if (!c) return null;
                      return (
                        <span key={ch} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          <c.icon className="w-3 h-3" /> {c.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Live
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        addToast({ title: "Sync triggered", message: "Updating queue status with remote CMS endpoints.", type: "info" });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Sync Now
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredQueue.length === 0 && (
              <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No publishing items match the current filter.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Publish / Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Distribute Content to Channels"
        description="Select destination CMS & social channels with automated UTM tracking."
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Post Title / Headline</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Scaling B2B Content Velocity with Governed AI"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Select Destination Channels</label>
            <div className="grid grid-cols-2 gap-2">
              {(["linkedin", "twitter", "webflow", "hubspot", "substack"] as const).map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                const config = channelIcons[ch];
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <config.icon className="w-3.5 h-3.5" />
                    {config.name}
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Post Body / Summary</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              placeholder="Content text or select from Content Hub..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Schedule Timing</label>
            <input
              type="text"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Auto-append UTM Campaign Parameters</span>
            <input
              type="checkbox"
              checked={appendUtm}
              onChange={(e) => setAppendUtm(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>

          <div className="flex justify-between items-center gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleCreatePost(false)}
                isLoading={isPublishing}
                className="text-xs font-semibold"
              >
                <Calendar className="w-3.5 h-3.5 mr-1" /> Schedule
              </Button>
              <Button
                type="button"
                onClick={() => handleCreatePost(true)}
                isLoading={isPublishing}
                className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5 mr-1" /> Publish Now
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
