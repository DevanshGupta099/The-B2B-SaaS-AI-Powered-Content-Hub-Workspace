"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppLayout, WorkspaceFolder } from "@/components/AppLayout";
import { AiCommandMenu } from "@/components/AiCommandMenu";
import { AvatarGroup, User } from "@/components/ui/AvatarGroup";
import { Button } from "@/components/ui/Button";
import { 
  Share2, 
  Settings, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Save, 
  Wand2, 
  Check, 
  Plus, 
  FileText
} from "lucide-react";
import { AiVisionBlock } from "@/components/AiVisionBlock";
import { useToast } from "@/components/ui/ToastNotifications";
import { getDocuments, saveDocuments, WorkspaceDocument, createDocument } from "@/lib/documents";

const folders: WorkspaceFolder[] = [
  { id: "1", name: "Project Apollo", files: [{ id: "apollo-arch", name: "Architecture RFC" }] },
  { id: "2", name: "Brand Refresh", files: [{ id: "brand-refresh-doc", name: "Brand Identity v2.4" }] },
  { id: "3", name: "Q4 Roadmap", files: [{ id: "q4-roadmap-doc", name: "Product Roadmap OKRs" }] },
  { id: "marketing", name: "Marketing", files: [{ id: "marketing-q4", name: "Marketing Strategy - Q4" }, { id: "brand-guidelines", name: "Brand Guidelines" }] },
  { id: "engineering", name: "Engineering", files: [{ id: "architecture-rfc", name: "Architecture RFC" }, { id: "api-docs", name: "API Documentation" }] },
];

const collaborators: User[] = [
  { id: "sarah", name: "Sarah Connor", role: "Admin", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "devansh", name: "Devansh", role: "Admin", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
];

interface Comment { id: string; author: string; message: string; time: string; }

function ContextPanel({ comments, onComment, isAiThinking }: { comments: Comment[]; onComment: (message: string) => void; isAiThinking: boolean }) {
  const [message, setMessage] = useState("");
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Active collaborators</h3>
        <div className="flex items-center justify-between">
          <AvatarGroup users={collaborators} maxCount={4} />
          <span className="text-xs font-semibold text-emerald-600">2 editing now</span>
        </div>
      </div>
      
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Document comments</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Tip: Type @ai to ask</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className={`rounded-xl border p-3 shadow-xs ${comment.author === "Nexus AI Copilot" ? "bg-indigo-50/70 border-indigo-200" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${comment.author === "Nexus AI Copilot" ? "text-indigo-700 flex items-center gap-1" : "text-slate-900"}`}>
                  {comment.author === "Nexus AI Copilot" && <Sparkles className="w-3 h-3 text-indigo-600" />}
                  {comment.author}
                </span>
                <span className="text-[10px] text-slate-400">{comment.time}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">{comment.message}</p>
            </div>
          ))}

          {isAiThinking && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 flex items-center gap-2 text-xs text-indigo-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Nexus AI Copilot is thinking...</span>
            </div>
          )}
        </div>

        <form onSubmit={(event) => { event.preventDefault(); if (message.trim()) { onComment(message.trim()); setMessage(""); } }} className="mt-4 flex gap-2">
          <input 
            value={message} 
            onChange={(event) => setMessage(event.target.value)} 
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
            placeholder="Comment or ask @ai..." 
          />
          <Button type="submit" size="sm" className="bg-slate-900 px-3 text-white">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const params = useParams<{ id: string }>();
  const { addToast } = useToast();
  
  const [workspaceDocument, setWorkspaceDocument] = useState<WorkspaceDocument | null>(() => {
    return getDocuments().find((item) => item.id === params.id) ?? null;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([
    { id: "starter", author: "Sarah Connor", message: "Positioning section is aligned with enterprise governance requirements.", time: "2m" }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiTransforming, setIsAiTransforming] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  // Dynamic backend hydration: resolves document IDs and workspace IDs gracefully
  useEffect(() => {
    let isMounted = true;
    async function loadWorkspaceDocument() {
      setIsLoading(true);
      try {
        // 1. Check local storage first
        const localDocs = getDocuments();
        const matchedLocal = localDocs.find(d => d.id === params.id);
        if (matchedLocal) {
          if (isMounted) {
            setWorkspaceDocument(matchedLocal);
            setIsLoading(false);
          }
          return;
        }

        // 2. Fetch from backend API /api/documents/${params.id}
        const res = await fetch(`/api/documents/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.document && isMounted) {
            setWorkspaceDocument(data.document);
            setIsLoading(false);
            return;
          }
        }

        // 3. Fallback: Check if any workspace matches or pick default document
        const allRes = await fetch("/api/documents");
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.documents && allData.documents.length > 0 && isMounted) {
            // Find one matching the category or first
            const fallback = allData.documents.find((d: WorkspaceDocument) => 
              d.workspace.toLowerCase() === params.id.toLowerCase() ||
              d.id.includes(params.id)
            ) || allData.documents[0];
            setWorkspaceDocument(fallback);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load workspace document:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWorkspaceDocument();
    return () => { isMounted = false; };
  }, [params.id]);

  const persist = async (updates: Partial<WorkspaceDocument>) => {
    if (!workspaceDocument) return;
    const next = { ...workspaceDocument, ...updates, updatedAt: "Just now" };
    setWorkspaceDocument(next);
    
    // Save to local storage
    saveDocuments(getDocuments().map((item) => item.id === next.id ? next : item));

    // Save to backend store
    try {
      await fetch(`/api/documents/${next.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
    } catch {
      // Backend sync error silently handled (local persistence guaranteed)
    }
  };

  const share = async () => {
    try { 
      await navigator.clipboard.writeText(window.location.href); 
      addToast({ title: "Sharing link copied", message: "Direct link to this workspace document copied.", type: "success" }); 
    } catch { 
      addToast({ title: "Unable to copy link", message: "Clipboard permission denied.", type: "error" }); 
    }
  };

  const handleAiAction = async (action: "summarize" | "punchy" | "takeaways" | "action-items") => {
    if (!workspaceDocument) return;
    setAiMenuOpen(false);
    setIsAiTransforming(true);

    let instruction = "";
    if (action === "summarize") instruction = "Provide a high-impact executive summary paragraph for this document:";
    if (action === "punchy") instruction = "Rewrite the text to be punchier, more authoritative, and high-impact:";
    if (action === "takeaways") instruction = "Extract 4 core strategic key takeaways formatted with bullet points:";
    if (action === "action-items") instruction = "Generate a prioritized checklist of next action items:";

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${instruction}\n\nDocument Text:\n${workspaceDocument.content.replace(/<[^>]*>?/gm, "").slice(0, 2000)}`,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      if (data.text) {
        const formattedNewContent = `${workspaceDocument.content}<br/><br/><blockquote><strong>🤖 AI Copilot (${action.toUpperCase()}):</strong><br/>${data.text.replace(/\n/g, "<br/>")}</blockquote>`;
        persist({ content: formattedNewContent });
        addToast({ title: `AI ${action} applied!`, message: `Generated in ${data.latencyMs}ms with Groq.`, type: "success" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI Error";
      addToast({ title: "AI Error", message, type: "error" });
    } finally {
      setIsAiTransforming(false);
    }
  };

  const handleComment = async (msg: string) => {
    const newComment: Comment = { id: crypto.randomUUID(), author: "Devansh", message: msg, time: "Now" };
    setComments(prev => [...prev, newComment]);

    if (msg.toLowerCase().includes("@ai") || msg.toLowerCase().includes("ai") || msg.startsWith("/")) {
      setIsAiThinking(true);
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `A team member asked this question in the collaborative document thread: "${msg}".\n\nDocument Title: "${workspaceDocument?.title}"\nDocument Content Snippet:\n"${workspaceDocument?.content.replace(/<[^>]*>?/gm, "").slice(0, 1000)}"`,
            systemPrompt: "You are Nexus AI Copilot, a collaborative document assistant. Answer helpfully, accurately, and concisely (1-2 sentences maximum).",
          }),
        });

        const data = await res.json();
        if (data.text) {
          setComments(prev => [...prev, {
            id: crypto.randomUUID(),
            author: "Nexus AI Copilot",
            message: data.text.trim(),
            time: "Now"
          }]);
        }
      } catch (err) {
        console.error("AI Comment Error:", err);
      } finally {
        setIsAiThinking(false);
      }
    }
  };

  const handleCreateNewDoc = () => {
    const newDoc = createDocument("New Workspace Document", "Marketing");
    setWorkspaceDocument(newDoc);
    addToast({ title: "New Document Initialized", message: "Ready for drafting.", type: "success" });
  };

  if (isLoading && !workspaceDocument) {
    return (
      <AppLayout folders={folders}>
        <div className="flex h-full flex-col items-center justify-center bg-slate-50 text-slate-500 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="font-heading text-base font-bold text-slate-900">Connecting to Workspace...</h3>
            <p className="text-xs text-slate-400 mt-0.5">Hydrating documents from backend repository</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!workspaceDocument) {
    return (
      <AppLayout folders={folders}>
        <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="w-14 h-14 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">Workspace Initialized</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            There are no documents in this specific workspace view yet. Start your first governed draft.
          </p>
          <Button onClick={handleCreateNewDoc} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Create First Document
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout 
        folders={folders} 
        rightSidebarContent={
          <ContextPanel 
            comments={comments} 
            onComment={handleComment} 
            isAiThinking={isAiThinking} 
          />
        }
      >
        <header className="absolute left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
          <div className="min-w-0 text-xs font-medium text-slate-500">
            <span className="font-bold text-indigo-600">{workspaceDocument.workspace}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-bold text-slate-900 truncate">{workspaceDocument.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-[11px] text-slate-400 font-mono">Sync: Connected</span>
              <AvatarGroup users={collaborators} maxCount={3} />
            </div>
            <Button variant="ghost" size="sm" className="hidden px-2 sm:flex">
              <Settings className="h-4 w-4 text-slate-500" />
            </Button>
            <Button onClick={share} className="gap-2 rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800 text-xs font-semibold">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
          </div>
        </header>

        <div className="h-full w-full overflow-y-auto bg-white pt-16">
          <div className="mx-auto max-w-4xl px-6 pb-32 pt-12 sm:px-12">
            <input 
              key={`${workspaceDocument.id}-${workspaceDocument.title}`} 
              type="text" 
              defaultValue={workspaceDocument.title} 
              onBlur={(event) => persist({ title: event.currentTarget.value.trim() || "Untitled" })} 
              className="mb-6 w-full border-none bg-transparent p-0 font-heading text-4xl text-slate-900 outline-none placeholder:text-slate-300 focus:ring-0 sm:text-5xl font-bold tracking-tight" 
              placeholder="Document Title" 
            />

            {/* AI Assistant Banner */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm border border-indigo-100">
                    <Sparkles className={`h-4 w-4 ${isAiTransforming ? "animate-spin" : ""}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-950">Nexus AI Document Copilot (Groq Active)</p>
                    <p className="text-[11px] text-indigo-700/80">Summarize, enhance tone, extract action items, or ask questions in comments with @ai.</p>
                  </div>
                </div>

                <div className="relative">
                  <Button 
                    onClick={() => setAiMenuOpen(!aiMenuOpen)} 
                    disabled={isAiTransforming}
                    variant="secondary" 
                    size="sm" 
                    className="gap-1.5 bg-white text-indigo-950 font-bold border border-indigo-200 shadow-xs text-xs rounded-xl"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                    {isAiTransforming ? "Applying AI..." : "Ask AI"}
                  </Button>

                  {aiMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-50 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Quick Copilot Actions</div>
                      <button
                        onClick={() => handleAiAction("summarize")}
                        className="w-full text-left p-2 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Executive Summary
                      </button>
                      <button
                        onClick={() => handleAiAction("punchy")}
                        className="w-full text-left p-2 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-indigo-600" /> Make Tone Punchier
                      </button>
                      <button
                        onClick={() => handleAiAction("takeaways")}
                        className="w-full text-left p-2 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-indigo-600" /> Strategic Key Takeaways
                      </button>
                      <button
                        onClick={() => handleAiAction("action-items")}
                        className="w-full text-left p-2 rounded-xl text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Prioritized Action Items
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-p:leading-loose text-slate-800 text-sm">
              <div 
                key={workspaceDocument.id} 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(event) => persist({ content: event.currentTarget.innerHTML })} 
                className="min-h-[260px] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 p-2" 
                dangerouslySetInnerHTML={{ __html: workspaceDocument.content }} 
              />
              <div className="my-10">
                <AiVisionBlock />
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <Button 
                onClick={() => { 
                  persist({}); 
                  addToast({ title: "Draft saved", message: "Synced with backend workspace repository.", type: "success" }); 
                }} 
                variant="secondary" 
                className="gap-2 text-xs font-semibold rounded-xl"
              >
                <Save className="h-4 w-4" /> Save draft
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
      <AiCommandMenu />
    </>
  );
}
