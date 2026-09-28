export type DocumentWorkspace = "Marketing" | "Engineering" | "Finance" | "Product";

export interface WorkspaceDocument {
  id: string;
  title: string;
  workspace: DocumentWorkspace;
  updatedAt: string;
  author: string;
  content: string;
}

const STORAGE_KEY = "nexus-workspace-documents";

export const starterDocuments: WorkspaceDocument[] = [
  { id: "marketing-q4", title: "Marketing Strategy - Q4", workspace: "Marketing", updatedAt: "2 mins ago", author: "Sarah Connor", content: "<p>This document details our strategic approach for Q4, focusing on leveraging AI to accelerate our go-to-market and product marketing initiatives.</p><h2>1. Market Positioning</h2><p>In Q4, we will position Nexus as the premier intelligent workspace for B2B teams.</p>" },
  { id: "api-docs", title: "API Documentation", workspace: "Engineering", updatedAt: "1 hour ago", author: "Devansh", content: "<p>Reference documentation for the Nexus platform APIs.</p>" },
  { id: "architecture-rfc", title: "Architecture RFC", workspace: "Engineering", updatedAt: "3 hours ago", author: "Sarah Connor", content: "<p>A proposal for the next iteration of the content platform architecture.</p>" },
  { id: "brand-guidelines", title: "Brand Guidelines", workspace: "Marketing", updatedAt: "1 day ago", author: "Michael Scott", content: "<p>Shared visual and editorial guidelines for Nexus content.</p>" },
  { id: "q3-revenue", title: "Q3 Revenue Analysis", workspace: "Finance", updatedAt: "2 days ago", author: "Devansh", content: "<p>Quarterly revenue, retention, and pipeline analysis.</p>" },
];

export function getDocuments(): WorkspaceDocument[] {
  if (typeof window === "undefined") return starterDocuments;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as WorkspaceDocument[] : starterDocuments;
  } catch {
    return starterDocuments;
  }
}

export function saveDocuments(documents: WorkspaceDocument[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function createDocument(title: string, workspace: DocumentWorkspace = "Marketing", initialContent?: string): WorkspaceDocument {
  const document: WorkspaceDocument = {
    id: crypto.randomUUID(),
    title: title.trim(),
    workspace,
    updatedAt: "Just now",
    author: "Devansh",
    content: initialContent || "<p>Start writing, or ask Nexus AI to help you create a first draft.</p>",
  };
  const documents = [document, ...getDocuments()];
  saveDocuments(documents);
  return document;
}
