"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout, WorkspaceFolder } from "@/components/AppLayout";
import { AiCommandMenu } from "@/components/AiCommandMenu";
import { AvatarGroup, User } from "@/components/ui/AvatarGroup";
import { Button } from "@/components/ui/Button";
import { Share2, Settings, Sparkles, Send, MessageSquare, Save, Wand2, Check, RefreshCw } from "lucide-react";
import { AiVisionBlock } from "@/components/AiVisionBlock";
import { useToast } from "@/components/ui/ToastNotifications";
import { getDocuments, saveDocuments, WorkspaceDocument } from "@/lib/documents";

const folders: WorkspaceFolder[] = [
  { id: "marketing", name: "Marketing", files: [{ id: "marketing-q4", name: "Marketing Strategy - Q4" }, { id: "brand-guidelines", name: "Brand Guidelines" }] },
  { id: "engineering", name: "Engineering", files: [{ id: "architecture-rfc", name: "Architecture RFC" }, { id: "api-docs", name: "API Documentation" }] },
];

const collaborators: User[] = [
  { id: "sarah", name: "Sarah Connor", role: "Admin", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "devansh", name: "Devansh", role: "Admin", avatarUrl: "https://i.pravatar.cc/150?u=devansh" },
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
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" 
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
  const [workspaceDocument, setWorkspaceDocument] = useState<WorkspaceDocument | null>(() => getDocuments().find((item) => item.id === params.id) ?? null);
  const [comments, setComments] = useState<Comment[]>([
    { id: "starter", author: "Sarah Connor", message: "Let's make the positioning section more specific to enterprise teams.", time: "2m" }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiTransforming, setIsAiTransforming] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  const persist = (updates: Partial<WorkspaceDocument>) => {
    if (!workspaceDocument) return;
    const next = { ...workspaceDocument, ...updates, updatedAt: "Just now" };
    setWorkspaceDocument(next);
    saveDocuments(getDocuments().map((item) => item.id === next.id ? next : item));
  };

  const share = async () => {
    try { 
      await navigator.clipboard.writeText(window.location.href); 
      addToast({ title: "Sharing link copied", message: "Anyone with this link can view the document.", type: "success" }); 
    } catch { 
      addToast({ title: "Unable to copy link", message: "Your browser blocked clipboard access.", type: "error" }); 
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
    } catch (err: any) {
      addToast({ title: "AI Error", message: err.message, type: "error" });
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

  if (!workspaceDocument) {
    return (
      <AppLayout folders={folders}>
        <div className="flex h-full items-center justify-center bg-slate-50 text-slate-500">
          Loading document…
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
        <header className="absolute left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/85 px-6 backdrop-blur-md">
          <div className="min-w-0 text-sm font-medium text-slate-500">
            <span>{workspaceDocument.workspace}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">{workspaceDocument.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-slate-400">Saved locally</span>
              <AvatarGroup users={collaborators} maxCount={3} />
            </div>
            <Button variant="ghost" size="sm" className="hidden px-2 sm:flex">
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={share} className="gap-2 rounded-xl bg-[#020617] px-4 text-white hover:bg-slate-800">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </header>

        <div className="h-full w-full overflow-y-auto bg-white pt-16">
          <div className="mx-auto max-w-4xl px-6 pb-32 pt-16 sm:px-12">
            <input 
              key={`${workspaceDocument.id}-${workspaceDocument.title}`} 
              type="text" 
              defaultValue={workspaceDocument.title} 
              onBlur={(event) => persist({ title: event.currentTarget.value.trim() || "Untitled" })} 
              className="mb-8 w-full border-none bg-transparent p-0 font-heading text-5xl text-slate-900 outline-none placeholder:text-slate-200 focus:ring-0 sm:text-6xl" 
              placeholder="Document Title" 
            />

            {/* AI Assistant Banner */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm">
                    <Sparkles className={`h-4 w-4 ${isAiTransforming ? "animate-spin" : ""}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-950">Nexus AI Document Copilot (Groq Active)</p>
                    <p className="text-xs text-indigo-700/80">Summarize, enhance tone, extract action items, or ask questions in comments with @ai.</p>
                  </div>
                </div>

                <div className="relative">
                  <Button 
                    onClick={() => setAiMenuOpen(!aiMenuOpen)} 
                    disabled={isAiTransforming}
                    variant="secondary" 
                    size="sm" 
                    className="gap-1.5 bg-white text-indigo-950 font-bold border border-indigo-200 shadow-xs"
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

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-p:leading-loose">
              <div 
                key={workspaceDocument.id} 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(event) => persist({ content: event.currentTarget.innerHTML })} 
                className="min-h-[260px] rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" 
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
                  addToast({ title: "Draft saved", message: "Your local workspace draft is up to date.", type: "success" }); 
                }} 
                variant="secondary" 
                className="gap-2"
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
