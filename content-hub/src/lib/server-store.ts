/**
 * Nexus Backend Server Store & Seed Data
 * Central backend source of truth for workspaces, documents, DAM media, and activity logs.
 */

export interface BackendWorkspace {
  id: string;
  name: string;
  desc: string;
  docsCount: number;
  membersCount: number;
  color: string;
  users: Array<{ id: string; name: string; avatarUrl: string }>;
  tags: string[];
  createdAt: string;
}

export interface BackendDocument {
  id: string;
  workspaceId: string;
  title: string;
  workspace: "Marketing" | "Engineering" | "Finance" | "Product";
  updatedAt: string;
  author: string;
  authorAvatar?: string;
  content: string;
  tags?: string[];
  status?: "Draft" | "In Review" | "Approved" | "Published";
}

export interface BackendMediaAsset {
  id: string;
  name: string;
  folder: string;
  type: "image" | "video" | "audio" | "svg" | "logo";
  size: string;
  tags: string[];
  dimensions?: string;
  previewUrl: string;
  aiAutoTags: string[];
  updatedAt: string;
}

export interface BackendActivityLog {
  id: string;
  user: string;
  action: string;
  document: string;
  avatar: string;
  time: string;
}

export interface BackendNotification {
  id: string;
  title: string;
  message: string;
  category: "approvals" | "guardrails" | "system" | "documents";
  time: string;
  read: boolean;
  link?: string;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  workspaceName?: string;
  createdAt: string;
}

export interface BackendUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  bio: string;
  timezone: string;
  avatarUrl: string;
  department: string;
  notifications: {
    emailOnApproval: boolean;
    slackInstantPing: boolean;
    weeklyAiSummary: boolean;
    guardrailAlerts: boolean;
  };
}

// Initial Backend Seed Data
const seedWorkspaces: BackendWorkspace[] = [
  {
    id: "1",
    name: "Project Apollo",
    desc: "Core infrastructure rewrite & AI engine integration",
    docsCount: 15,
    membersCount: 8,
    color: "bg-indigo-600",
    users: [
      { id: "u1", name: "Sarah Connor", avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede" },
      { id: "u2", name: "Devansh", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf" },
      { id: "u3", name: "David Kim", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=david&backgroundColor=c0aede,d1d4f9" }
    ],
    tags: ["Infrastructure", "Groq LPUs", "RFC"],
    createdAt: "Aug 15, 2026"
  },
  {
    id: "2",
    name: "Brand Refresh",
    desc: "Marketing assets, design tokens, and voice governance",
    docsCount: 8,
    membersCount: 5,
    color: "bg-violet-600",
    users: [
      { id: "u4", name: "Michael Scott", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=ffd5dc,b6e3f4" },
      { id: "u1", name: "Sarah Connor", avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede" }
    ],
    tags: ["Branding", "Voice Linters", "Guidelines"],
    createdAt: "Aug 20, 2026"
  },
  {
    id: "3",
    name: "Q4 Roadmap",
    desc: "Enterprise compliance, autonomous agents, and RAG search",
    docsCount: 3,
    membersCount: 6,
    color: "bg-emerald-600",
    users: [
      { id: "u2", name: "Devansh", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf" },
      { id: "u3", name: "David Kim", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=david&backgroundColor=c0aede,d1d4f9" }
    ],
    tags: ["Strategy", "OKRs", "Product"],
    createdAt: "Sep 01, 2026"
  },
  {
    id: "marketing",
    name: "Marketing",
    desc: "Omnichannel campaigns, positioning briefs, and press kits",
    docsCount: 12,
    membersCount: 6,
    color: "bg-violet-500",
    users: [
      { id: "u1", name: "Sarah Connor", avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede" },
      { id: "u4", name: "Michael Scott", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=ffd5dc,b6e3f4" }
    ],
    tags: ["GTM", "Campaigns"],
    createdAt: "Jul 10, 2026"
  },
  {
    id: "engineering",
    name: "Engineering",
    desc: "Technical specifications, API docs, and architecture designs",
    docsCount: 18,
    membersCount: 9,
    color: "bg-sky-500",
    users: [
      { id: "u2", name: "Devansh", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf" },
      { id: "u3", name: "David Kim", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=david&backgroundColor=c0aede,d1d4f9" }
    ],
    tags: ["Architecture", "APIs"],
    createdAt: "Jul 12, 2026"
  },
  {
    id: "finance",
    name: "Finance",
    desc: "SaaS unit economics, gross margins, and runway models",
    docsCount: 7,
    membersCount: 4,
    color: "bg-emerald-500",
    users: [
      { id: "u2", name: "Devansh", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf" }
    ],
    tags: ["Revenue", "Budget"],
    createdAt: "Aug 01, 2026"
  },
  {
    id: "product",
    name: "Product",
    desc: "Feature specs, customer journey mapping, and sprint backlog",
    docsCount: 10,
    membersCount: 7,
    color: "bg-amber-500",
    users: [
      { id: "u1", name: "Sarah Connor", avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede" }
    ],
    tags: ["Backlog", "Specs"],
    createdAt: "Aug 05, 2026"
  }
];

const seedDocuments: BackendDocument[] = [
  {
    id: "marketing-q4",
    workspaceId: "marketing",
    title: "Marketing Strategy - Q4 (Enterprise Scale)",
    workspace: "Marketing",
    updatedAt: "2 mins ago",
    author: "Sarah Connor",
    authorAvatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede",
    content: "<h2>1. Executive Summary</h2><p>In Q4, Nexus will accelerate multi-channel B2B distribution by positioning our Governed AI Content OS directly against fragmented point solutions. Our target is generating 450 enterprise qualified pipeline opportunities.</p><h2>2. Value Proposition & Moat</h2><p>Unlike consumer AI wrappers, Nexus provides deterministic brand linters, zero data retention agreements, and atomic 1-to-many syndication directly to CMS backends.</p>",
    tags: ["Strategy", "Q4", "Enterprise"],
    status: "In Review"
  },
  {
    id: "apollo-arch",
    workspaceId: "1",
    title: "Project Apollo: Core Infrastructure Rewrite RFC",
    workspace: "Engineering",
    updatedAt: "15 mins ago",
    author: "Devansh",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
    content: "<h2>1. Motivation</h2><p>To eliminate sub-optimal latency and support concurrent collaborative document authoring, Project Apollo replaces legacy state sync with deterministic CRDT models and edge-accelerated Groq inference pipelines.</p><h2>2. Technical Architecture</h2><p>All AI requests route through our adaptive token rate governor to ensure 100% SLA compliance even under sudden traffic bursts.</p>",
    tags: ["Infrastructure", "Apollo", "Architecture"],
    status: "Approved"
  },
  {
    id: "brand-refresh-doc",
    workspaceId: "2",
    title: "Nexus Brand Identity & Tone Matrix (v2.4)",
    workspace: "Marketing",
    updatedAt: "1 hour ago",
    author: "Michael Scott",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=ffd5dc,b6e3f4",
    content: "<h2>Brand Voice Tenets</h2><p>1. <strong>Direct & Factual:</strong> Avoid inflated marketing superlatives like 'revolutionary' or 'best-in-class'. State verifiable benchmark metrics.</p><p>2. <strong>Enterprise Rigor:</strong> Speak to VP of Content and Head of Legal buyers with clarity, security posture, and precision.</p>",
    tags: ["Branding", "Voice Guidelines"],
    status: "Published"
  },
  {
    id: "q4-roadmap-doc",
    workspaceId: "3",
    title: "Q4 Engineering & Product Roadmap (OKRs)",
    workspace: "Product",
    updatedAt: "2 hours ago",
    author: "David Kim",
    authorAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=david&backgroundColor=c0aede,d1d4f9",
    content: "<h2>Objective 1: Multi-Model Inference Velocity</h2><p>KR1: Maintain p95 chat completion latency under 350ms across all global endpoints.</p><p>KR2: Deploy 384-dimensional dense semantic RAG across all workspace DAM repositories.</p>",
    tags: ["Roadmap", "OKRs", "Product"],
    status: "Draft"
  },
  {
    id: "api-docs",
    workspaceId: "engineering",
    title: "Nexus Platform API Reference & Webhook Contracts",
    workspace: "Engineering",
    updatedAt: "3 hours ago",
    author: "Devansh",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
    content: "<h2>REST API Authentication</h2><p>Every inbound API request must supply the <code>Authorization: Bearer nx_live_...</code> header generated from Workspace Administration.</p>",
    tags: ["API", "Webhooks"],
    status: "Published"
  },
  {
    id: "architecture-rfc",
    workspaceId: "engineering",
    title: "Distributed AI Event Bus & Webhook Architecture",
    workspace: "Engineering",
    updatedAt: "1 day ago",
    author: "Sarah Connor",
    authorAvatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede",
    content: "<h2>Event Bus Specification</h2><p>All content atomization and editorial approvals publish asynchronous events via idempotency-guaranteed event streaming queues.</p>",
    tags: ["Architecture", "Event Bus"],
    status: "Approved"
  },
  {
    id: "brand-guidelines",
    workspaceId: "marketing",
    title: "Global Enterprise Editorial Guidelines",
    workspace: "Marketing",
    updatedAt: "2 days ago",
    author: "Michael Scott",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=ffd5dc,b6e3f4",
    content: "<h2>Editorial Standards</h2><p>Guidelines for external publications, press releases, technical whitepapers, and customer case studies.</p>",
    tags: ["Editorial", "Guidelines"],
    status: "Published"
  },
  {
    id: "q3-revenue",
    workspaceId: "finance",
    title: "Q3 SaaS Financial Audit & Token Unit Economics",
    workspace: "Finance",
    updatedAt: "3 days ago",
    author: "Devansh",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
    content: "<h2>Financial Performance</h2><p>ARR expanded by 34% quarter-over-quarter. Blended gross margin reached 82% due to low-latency Groq hardware cost efficiency.</p>",
    tags: ["Financials", "Margins"],
    status: "Approved"
  }
];

const seedMediaAssets: BackendMediaAsset[] = [
  {
    id: "asset-1",
    name: "nexus-3d-architecture-hero.jpg",
    folder: "Hero Graphics",
    type: "image",
    size: "2.4 MB",
    tags: ["3D", "Hero", "Octane Render", "Futuristic"],
    dimensions: "3840 x 2160",
    previewUrl: "/nexus-hero-3d.jpg",
    aiAutoTags: ["datacenter", "glowing nodes", "cloud workspace", "holographic dashboard"],
    updatedAt: "2 hrs ago"
  },
  {
    id: "asset-2",
    name: "nexus-dashboard-saas-mockup.jpg",
    folder: "Product Screenshots",
    type: "image",
    size: "1.8 MB",
    tags: ["UI", "Dashboard", "MacBook Mockup", "Analytics"],
    dimensions: "2880 x 1800",
    previewUrl: "/nexus-dashboard-mockup.jpg",
    aiAutoTags: ["saas analytics", "kanban board", "modern UI", "brand score meter"],
    updatedAt: "Yesterday"
  },
  {
    id: "asset-3",
    name: "nexus-quantum-governance-shield.jpg",
    folder: "Brand & Security",
    type: "image",
    size: "3.1 MB",
    tags: ["Security", "SOC2", "Shield", "Encryption"],
    dimensions: "3840 x 2160",
    previewUrl: "/nexus-governance-3d.jpg",
    aiAutoTags: ["cryptographic lock", "security telemetry", "crystal shield", "violet glow"],
    updatedAt: "3 days ago"
  },
  {
    id: "asset-4",
    name: "nexus-brand-wordmark.svg",
    folder: "Brand & Security",
    type: "svg",
    size: "42 KB",
    tags: ["Vector", "Logo", "Dark Theme"],
    dimensions: "1200 x 300",
    previewUrl: "/next.svg",
    aiAutoTags: ["brand mark", "vector icon", "monochrome"],
    updatedAt: "4 days ago"
  }
];

const seedActivityLogs: BackendActivityLog[] = [
  {
    id: "act-1",
    user: "Sarah Connor",
    action: "edited",
    document: "Q4 Marketing Strategy",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede",
    time: "2 mins ago"
  },
  {
    id: "act-2",
    user: "Devansh",
    action: "commented on",
    document: "Project Apollo RFC",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
    time: "1 hour ago"
  },
  {
    id: "act-3",
    user: "Michael Scott",
    action: "approved",
    document: "Nexus Brand Identity v2.4",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=ffd5dc,b6e3f4",
    time: "3 hours ago"
  }
];

// In-Memory Global Backend State Container
class BackendStore {
  private workspaces: BackendWorkspace[] = [...seedWorkspaces];
  private documents: BackendDocument[] = [...seedDocuments];
  private mediaAssets: BackendMediaAsset[] = [...seedMediaAssets];
  private activities: BackendActivityLog[] = [...seedActivityLogs];

  // Workspaces
  getWorkspaces(): BackendWorkspace[] {
    return this.workspaces;
  }

  getWorkspaceById(id: string): BackendWorkspace | undefined {
    return this.workspaces.find(w => w.id === id || w.name.toLowerCase() === id.toLowerCase());
  }

  addWorkspace(workspace: Omit<BackendWorkspace, "id" | "createdAt">): BackendWorkspace {
    const newWs: BackendWorkspace = {
      ...workspace,
      id: crypto.randomUUID(),
      createdAt: "Just now"
    };
    this.workspaces.unshift(newWs);
    return newWs;
  }

  // Documents
  getDocuments(workspaceId?: string): BackendDocument[] {
    if (workspaceId) {
      return this.documents.filter(d => 
        d.workspaceId === workspaceId || 
        d.workspace.toLowerCase() === workspaceId.toLowerCase()
      );
    }
    return this.documents;
  }

  getDocumentById(id: string): BackendDocument | undefined {
    // 1. Direct document ID match
    const exact = this.documents.find(d => d.id === id);
    if (exact) return exact;

    // 2. If ID matches a workspace ID or workspace name, return the primary document for that workspace
    const wsDocs = this.documents.filter(d => 
      d.workspaceId === id || 
      d.workspace.toLowerCase() === id.toLowerCase()
    );
    if (wsDocs.length > 0) return wsDocs[0];

    // 3. Fallback: Check if workspace exists
    const ws = this.getWorkspaceById(id);
    if (ws) {
      // Auto-seed a new document for this workspace so UI never gets stuck
      const autoDoc: BackendDocument = {
        id: `doc-${ws.id}-${Date.now()}`,
        workspaceId: ws.id,
        title: `${ws.name} - Executive Brief`,
        workspace: (["Marketing", "Engineering", "Finance", "Product"].includes(ws.name) ? ws.name : "Marketing") as BackendDocument["workspace"],
        updatedAt: "Just now",
        author: "Devansh",
        authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
        content: `<h2>Welcome to ${ws.name}</h2><p>${ws.desc}</p><p>Start drafting your team's content here, or use the Nexus AI Copilot on the right to kick off your first draft.</p>`,
        status: "Draft",
        tags: ws.tags
      };
      this.documents.unshift(autoDoc);
      return autoDoc;
    }

    return undefined;
  }

  addDocument(doc: Omit<BackendDocument, "id" | "updatedAt">): BackendDocument {
    const newDoc: BackendDocument = {
      ...doc,
      id: crypto.randomUUID(),
      updatedAt: "Just now"
    };
    this.documents.unshift(newDoc);
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<BackendDocument>): BackendDocument | undefined {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.documents[index],
      ...updates,
      updatedAt: "Just now"
    };
    this.documents[index] = updated;
    return updated;
  }

  // Media Assets
  getMediaAssets(folder?: string): BackendMediaAsset[] {
    if (folder && folder !== "All Assets") {
      return this.mediaAssets.filter(a => a.folder.toLowerCase() === folder.toLowerCase());
    }
    return this.mediaAssets;
  }

  addMediaAsset(asset: Omit<BackendMediaAsset, "id" | "updatedAt">): BackendMediaAsset {
    const newAsset: BackendMediaAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      updatedAt: "Just now"
    };
    this.mediaAssets.unshift(newAsset);
    return newAsset;
  }

  deleteMediaAsset(id: string): boolean {
    const before = this.mediaAssets.length;
    this.mediaAssets = this.mediaAssets.filter(a => a.id !== id);
    return this.mediaAssets.length < before;
  }

  // Activity
  getActivities(): BackendActivityLog[] {
    return this.activities;
  }

  addActivity(act: Omit<BackendActivityLog, "id" | "time">): BackendActivityLog {
    const newAct: BackendActivityLog = {
      ...act,
      id: `act-${Date.now()}`,
      time: "Just now"
    };
    this.activities.unshift(newAct);
    return newAct;
  }

  // Profile
  private profile: BackendUserProfile = {
    id: "user-1",
    name: "Devansh Gupta",
    email: "devanshgupta091@gmail.com",
    role: "Workspace Owner & Chief Architect",
    title: "Principal Engineer",
    bio: "Architecting governed multi-model content infrastructure with low-latency LPUs and dense semantic vector search.",
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf",
    department: "Core Platform Architecture",
    notifications: {
      emailOnApproval: true,
      slackInstantPing: true,
      weeklyAiSummary: true,
      guardrailAlerts: true
    }
  };

  getProfile(): BackendUserProfile {
    return this.profile;
  }

  updateProfile(updates: Partial<BackendUserProfile>): BackendUserProfile {
    this.profile = {
      ...this.profile,
      ...updates,
      notifications: {
        ...this.profile.notifications,
        ...(updates.notifications || {})
      }
    };
    return this.profile;
  }

  // Notifications
  private notifications: BackendNotification[] = [
    {
      id: "notif-1",
      title: "Executive Report Synthesized",
      message: "Q4 Content Velocity & Governance report generated via Groq Qwen 3.8-27b.",
      category: "system",
      time: "2 mins ago",
      read: false,
      link: "/dashboard"
    },
    {
      id: "notif-2",
      title: "Brand Voice Guardrail Triggered",
      message: "Deterministic linter flagged prohibited term 'revolutionary' in draft.",
      category: "guardrails",
      time: "18 mins ago",
      read: false,
      link: "/dashboard/brand-kit"
    },
    {
      id: "notif-3",
      title: "Approval Requested: SOC2 Guide",
      message: "Sarah Connor submitted 'SOC2 Compliance Migration Guide' for review.",
      category: "approvals",
      time: "1 hour ago",
      read: false,
      link: "/dashboard/approvals"
    },
    {
      id: "notif-4",
      title: "Project Apollo RFC Updated",
      message: "New CRDT multiplayer architecture section added to document.",
      category: "documents",
      time: "3 hours ago",
      read: true,
      link: "/workspace/1"
    }
  ];

  getNotifications(category?: string): BackendNotification[] {
    if (category && category !== "all") {
      return this.notifications.filter(n => n.category === category);
    }
    return this.notifications;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach(n => { n.read = true; });
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  // Users & Authentication
  private users: BackendUser[] = [
    {
      id: "user-1",
      name: "Devansh Gupta",
      email: "devanshgupta091@gmail.com",
      password: "password123",
      role: "Owner",
      workspaceName: "Nexus Enterprise Workspace",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-2",
      name: "Sarah Connor",
      email: "sarah@company.com",
      password: "password123",
      role: "Editor",
      workspaceName: "Growth Operations",
      createdAt: new Date().toISOString()
    }
  ];

  findUserByEmail(email: string): BackendUser | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  createUser(data: { name: string; email: string; password: string; role?: string; workspaceName?: string }): Omit<BackendUser, "password"> {
    const { hashPassword } = require("./auth-crypto");
    const hashedPassword = hashPassword(data.password);
    const newUser: BackendUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
      role: data.role || "Owner",
      workspaceName: data.workspaceName?.trim() || `${data.name.trim()}'s Workspace`,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);

    // Also update current active profile
    this.profile = {
      ...this.profile,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    // Log in activity
    this.addActivity({
      user: newUser.name,
      action: "created workspace account",
      document: newUser.workspaceName || "New Workspace",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf"
    });

    const safeUser: Omit<BackendUser, "password"> = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      workspaceName: newUser.workspaceName,
      createdAt: newUser.createdAt
    };
    return safeUser;
  }

  validateCredentials(email: string, password: string): { valid: boolean; user?: Omit<BackendUser, "password">; reason?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.findUserByEmail(normalizedEmail);
    if (!user) {
      return { valid: false, reason: "No account found with this email address" };
    }
    const { verifyPassword } = require("./auth-crypto");
    if (!verifyPassword(password, user.password)) {
      return { valid: false, reason: "Incorrect password entered" };
    }
    const safeUser: Omit<BackendUser, "password"> = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceName: user.workspaceName,
      createdAt: user.createdAt
    };
    return { valid: true, user: safeUser };
  }

  async findUserByEmailAsync(email: string): Promise<BackendUser | undefined> {
    const normalized = email.trim().toLowerCase();
    try {
      const { dbRepo } = await import("./db-repo");
      const dbUser = await dbRepo.findUserByEmail(normalized);
      if (dbUser) {
        const idx = this.users.findIndex(u => u.email.toLowerCase() === normalized);
        if (idx >= 0) this.users[idx] = dbUser;
        else this.users.push(dbUser);
        return dbUser;
      }
    } catch (err) {
      console.warn("Neon user lookup fallback:", err);
    }
    return this.findUserByEmail(normalized);
  }

  async createUserAsync(data: { name: string; email: string; password: string; role?: string; workspaceName?: string }): Promise<Omit<BackendUser, "password">> {
    const user = this.createUser(data);
    const fullUser = this.findUserByEmail(data.email);
    if (fullUser) {
      try {
        const { dbRepo } = await import("./db-repo");
        await dbRepo.createUser(fullUser);
        await dbRepo.logActivity(fullUser.name, "created account", fullUser.workspaceName || "Workspace");
      } catch (err) {
        console.warn("Neon user sync fallback:", err);
      }
    }
    return user;
  }

  async validateCredentialsAsync(email: string, password: string): Promise<{ valid: boolean; user?: Omit<BackendUser, "password">; reason?: string }> {
    const normalized = email.trim().toLowerCase();
    try {
      const { dbRepo } = await import("./db-repo");
      const dbUser = await dbRepo.findUserByEmail(normalized);
      if (dbUser) {
        const { verifyPassword } = await import("./auth-crypto");
        if (!verifyPassword(password, dbUser.password)) {
          return { valid: false, reason: "Incorrect password entered" };
        }
        return {
          valid: true,
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            workspaceName: dbUser.workspaceName,
            createdAt: dbUser.createdAt
          }
        };
      }
    } catch (err) {
      console.warn("Neon credentials validation fallback:", err);
    }
    return this.validateCredentials(normalized, password);
  }
}

// Global singleton to survive Next.js module reloads in dev
const globalForStore = globalThis as unknown as { backendStore?: BackendStore };
export const serverStore = (globalForStore.backendStore && typeof globalForStore.backendStore.getProfile === "function")
  ? globalForStore.backendStore
  : new BackendStore();
if (process.env.NODE_ENV !== "production") globalForStore.backendStore = serverStore;

