export type MemberRole = "Owner" | "Admin" | "Editor" | "Reviewer" | "Viewer";
export type ContentStatus = "Draft" | "In review" | "Approved" | "Scheduled";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "Active" | "Invited";
}

export interface PlannerItem {
  id: string;
  title: string;
  channel: string;
  stage: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  owner: string;
  stage: string;
  due: string;
  status: "Pending" | "Approved" | "Changes requested";
}

export interface PersonaProfile {
  id: string;
  name: string;
  title: string;
  painPoints: string;
  preferredTone: string;
}

export interface BrandKit {
  voice: string;
  restrictedTerms: string;
  sources: string[];
  personas?: PersonaProfile[];
}

export interface CustomAgent {
  id: string;
  name: string;
  tagline: string;
  role: string;
  systemPrompt: string;
  temperature: number;
  iconBg: string;
  knowledgeSources: string[];
  examplePrompts: string[];
}

export interface PublishItem {
  id: string;
  title: string;
  channels: ("linkedin" | "twitter" | "webflow" | "wordpress" | "substack" | "hubspot")[];
  status: "Scheduled" | "Published" | "Draft" | "Failed";
  scheduledFor: string;
  author: string;
  url?: string;
}

export interface ClientPortalProject {
  id: string;
  clientName: string;
  clientLogo: string;
  projectName: string;
  reviewUrlToken: string;
  status: "In Review" | "Approved" | "Revisions Needed";
  lastFeedback: string;
  reviewerEmail: string;
  signedOffAt?: string;
}

export interface SeoAuditItem {
  id: string;
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional";
  score: number;
  volume: string;
  difficulty: "Easy" | "Medium" | "Hard";
  recommendations: string[];
}

export interface CompetitorMove {
  id: string;
  competitor: string;
  logo: string;
  type: "Product Launch" | "Blog Post" | "Pricing Shift" | "Campaign";
  title: string;
  date: string;
  impact: "High" | "Medium" | "Low";
  counterAction: string;
}

export interface LocalizationEntry {
  id: string;
  title: string;
  sourceLang: string;
  targetLang: string;
  status: "Completed" | "Translating" | "Review Required";
  qualityScore: number;
  updatedAt: string;
}

export interface WorkspaceData {
  members: WorkspaceMember[];
  integrations: Record<string, boolean>;
  planner: PlannerItem[];
  approvals: ApprovalItem[];
  brandKit: BrandKit;
  activity: string[];
  agents: CustomAgent[];
  publishingQueue: PublishItem[];
  clientPortals: ClientPortalProject[];
  seoAudits: SeoAuditItem[];
  competitorMoves: CompetitorMove[];
  localizations: LocalizationEntry[];
}

const key = "nexus-workspace-data";

const defaultData: WorkspaceData = {
  members: [
    { id: "sarah", name: "Sarah Connor", email: "sarah@nexus.io", role: "Owner", status: "Active" },
    { id: "devansh", name: "Devansh", email: "devansh@nexus.io", role: "Admin", status: "Active" },
    { id: "michael", name: "Michael Scott", email: "mike@nexus.io", role: "Editor", status: "Active" },
    { id: "alex", name: "Alex Johnson", email: "alex@nexus.io", role: "Viewer", status: "Invited" },
  ],
  integrations: {
    slack: true,
    gdrive: true,
    notion: true,
    salesforce: false,
    webflow: true,
    wordpress: false,
    hubspot: true,
    linkedin: true,
    twitter: true,
  },
  planner: [
    { id: "1", title: "Q4 launch narrative", channel: "Blog", stage: "Ideation" },
    { id: "2", title: "AI workflow LinkedIn series", channel: "Social", stage: "Drafting" },
    { id: "3", title: "Customer email sequence", channel: "Email", stage: "Design" },
    { id: "4", title: "Atlas case study", channel: "Web", stage: "Legal review" },
    { id: "5", title: "Launch announcement", channel: "PR", stage: "Scheduled" },
  ],
  approvals: [
    { id: "1", title: "Q4 campaign brief", owner: "Sarah Connor", stage: "Marketing review", due: "Today", status: "Pending" },
    { id: "2", title: "Customer story: Atlas", owner: "Devansh", stage: "Legal review", due: "Tomorrow", status: "Pending" },
    { id: "3", title: "Product launch email", owner: "Michael Scott", stage: "Brand review", due: "Friday", status: "Pending" },
  ],
  brandKit: {
    voice: "Confident, practical, and direct. We explain complex ideas in clear language and back important claims with evidence.",
    restrictedTerms: "best-in-class, revolutionary, seamless, guaranteed, game-changer",
    sources: ["Product messaging framework", "Nexus style guide", "Security FAQ", "Customer proof points"],
    personas: [
      {
        id: "p1",
        name: "Enterprise VP of Marketing",
        title: "VP / CMO",
        painPoints: "Siloed content teams, unapproved AI hallucinations, slow brand review cycles",
        preferredTone: "Strategic, ROI-focused, authoritative",
      },
      {
        id: "p2",
        name: "Lead Content Strategist",
        title: "Content Director",
        painPoints: "Repurposing bottlenecks, fragmented spreadsheets, repetitive drafting",
        preferredTone: "Empathetic, workflow-centric, practical",
      },
    ],
  },
  activity: [
    "Sarah updated Marketing Strategy - Q4",
    "Devansh left feedback on Architecture RFC",
    "Nexus AI generated a campaign brief",
    "Published 'Why Content Ops Matters' to LinkedIn and Webflow",
    "Stripe approved client portal review for Q4 Case Study",
  ],
  agents: [
    {
      id: "agent-tech",
      name: "Technical Ghostwriter",
      tagline: "Turns engineering architecture into readable blogs & whitepapers",
      role: "Engineering & DevRel Content",
      systemPrompt: "You are a senior technical writer with 10+ years experience in distributed systems. Write precise, insightful, fluff-free explanations with code examples.",
      temperature: 0.4,
      iconBg: "from-sky-500 to-indigo-600",
      knowledgeSources: ["Architecture RFC", "API Documentation"],
      examplePrompts: [
        "Explain our real-time collaborative state sync for developer blogs",
        "Write a deep-dive post comparing REST vs GraphQL in Nexus",
      ],
    },
    {
      id: "agent-demand",
      name: "Demand Gen Copywriter",
      tagline: "High-converting ad copies, landing pages & email nurture tracks",
      role: "Growth & Acquisition",
      systemPrompt: "You are a conversion copywriter obsessed with value propositions, clarity, hooks, and friction reduction. Write compelling copy with clear CTAs.",
      temperature: 0.7,
      iconBg: "from-emerald-500 to-teal-600",
      knowledgeSources: ["Product messaging framework", "Customer proof points"],
      examplePrompts: [
        "Write 3 high-converting LinkedIn ad variations for B2B CMOs",
        "Draft a 4-part email nurture sequence for free trial users",
      ],
    },
    {
      id: "agent-pr",
      name: "PR & Comms Strategist",
      tagline: "Press releases, executive soundbites & strategic crisis messaging",
      role: "Corporate Comms",
      systemPrompt: "You are a seasoned VP of Corporate Communications. Craft authoritative, media-ready statements, press releases, and executive quotes.",
      temperature: 0.5,
      iconBg: "from-purple-500 to-pink-600",
      knowledgeSources: ["Nexus style guide", "Security FAQ"],
      examplePrompts: [
        "Draft a press release announcing Nexus Series B funding",
        "Write 3 executive quote options for an upcoming enterprise partnership",
      ],
    },
    {
      id: "agent-pmm",
      name: "Product Marketing Specialist",
      tagline: "One-pagers, feature releases, battlecards & sales collateral",
      role: "Product Marketing",
      systemPrompt: "You are a Principal Product Marketing Manager. Translate complex product capabilities into customer benefits, competitive advantages, and battlecard matrices.",
      temperature: 0.6,
      iconBg: "from-amber-500 to-orange-600",
      knowledgeSources: ["Product messaging framework"],
      examplePrompts: [
        "Write a feature announcement for our new Content Atomizer tool",
        "Build a competitor battlecard against legacy DAM systems",
      ],
    },
  ],
  publishingQueue: [
    {
      id: "pub-1",
      title: "How Enterprise Marketing Teams Scale with Governed AI",
      channels: ["linkedin", "webflow"],
      status: "Scheduled",
      scheduledFor: "Today at 2:00 PM EST",
      author: "Sarah Connor",
    },
    {
      id: "pub-2",
      title: "10 Proven Frameworks for B2B Content Repurposing",
      channels: ["twitter", "substack"],
      status: "Scheduled",
      scheduledFor: "Tomorrow at 9:30 AM EST",
      author: "Devansh",
    },
    {
      id: "pub-3",
      title: "Nexus Product Update: March 2026 Release Notes",
      channels: ["webflow", "hubspot", "linkedin"],
      status: "Published",
      scheduledFor: "Yesterday at 11:00 AM EST",
      author: "Sarah Connor",
      url: "https://nexus.io/blog/march-2026-release",
    },
  ],
  clientPortals: [
    {
      id: "portal-1",
      clientName: "Stripe",
      clientLogo: "S",
      projectName: "Q4 Customer Impact Case Study",
      reviewUrlToken: "stripe-q4-study",
      status: "Approved",
      lastFeedback: "Approved by Head of Growth without changes. Great numbers on ROI!",
      reviewerEmail: "growth@stripe.com",
      signedOffAt: "Aug 24, 2026",
    },
    {
      id: "portal-2",
      clientName: "Vercel",
      clientLogo: "V",
      projectName: "Developer Ecosystem Whitepaper",
      reviewUrlToken: "vercel-dev-whitepaper",
      status: "In Review",
      lastFeedback: "Reviewing section 3 benchmarks with infrastructure team.",
      reviewerEmail: "partner-comms@vercel.com",
    },
    {
      id: "portal-3",
      clientName: "Acme Corp",
      clientLogo: "A",
      projectName: "Enterprise Migration Guide",
      reviewUrlToken: "acme-migration-guide",
      status: "Revisions Needed",
      lastFeedback: "Please update the cloud compliance badge to SOC2 Type II.",
      reviewerEmail: "legal@acme.com",
    },
  ],
  seoAudits: [
    {
      id: "seo-1",
      keyword: "b2b content operations platform",
      intent: "Commercial",
      score: 92,
      volume: "3.4K / mo",
      difficulty: "Medium",
      recommendations: [
        "Include H2 covering 'Content Governance Workflows'",
        "Target primary keyword in first 100 words",
        "Add 3 internal links to Brand Kit and AI Studio",
      ],
    },
    {
      id: "seo-2",
      keyword: "ai marketing workflow tools",
      intent: "Informational",
      score: 84,
      volume: "8.1K / mo",
      difficulty: "Hard",
      recommendations: [
        "Answer 'What are AI guardrails in content marketing?'",
        "Increase word count to 1,800+ words to match top 3 competitors",
        "Add schema markup for FAQ section",
      ],
    },
    {
      id: "seo-3",
      keyword: "enterprise brand voice guidelines ai",
      intent: "Commercial",
      score: 96,
      volume: "1.9K / mo",
      difficulty: "Easy",
      recommendations: [
        "Keyword density is optimal at 1.4%",
        "Great coverage of NLP semantic entities",
      ],
    },
  ],
  competitorMoves: [
    {
      id: "move-1",
      competitor: "Jasper AI",
      logo: "J",
      type: "Product Launch",
      title: "Launched new marketing analytics dashboard",
      date: "2 days ago",
      impact: "High",
      counterAction: "Highlight Nexus deeper native CMS integrations and zero-token markup pricing in sales battlecards.",
    },
    {
      id: "move-2",
      competitor: "Writer.com",
      logo: "W",
      type: "Pricing Shift",
      title: "Raised enterprise tier seat minimum from 10 to 25 users",
      date: "5 days ago",
      impact: "High",
      counterAction: "Run targeted LinkedIn campaign for mid-market teams looking for flexible seats.",
    },
    {
      id: "move-3",
      competitor: "Contently",
      logo: "C",
      type: "Blog Post",
      title: "Published 'State of B2B Content Marketing 2026 Report'",
      date: "1 week ago",
      impact: "Medium",
      counterAction: "Repurpose our Content Velocity benchmark study into an infographic series.",
    },
  ],
  localizations: [
    {
      id: "loc-1",
      title: "Product Overview & Pitch Deck 2026",
      sourceLang: "English (US)",
      targetLang: "German (DE)",
      status: "Completed",
      qualityScore: 99,
      updatedAt: "3 hours ago",
    },
    {
      id: "loc-2",
      title: "Enterprise Security & SOC2 Whitepaper",
      sourceLang: "English (US)",
      targetLang: "Japanese (JA)",
      status: "Completed",
      qualityScore: 97,
      updatedAt: "Yesterday",
    },
    {
      id: "loc-3",
      title: "Q4 Customer Case Study: Atlas",
      sourceLang: "English (US)",
      targetLang: "French (FR)",
      status: "Translating",
      qualityScore: 94,
      updatedAt: "Just now",
    },
    {
      id: "loc-4",
      title: "Brand Voice & Tone Guidelines",
      sourceLang: "English (US)",
      targetLang: "Spanish (ES)",
      status: "Review Required",
      qualityScore: 91,
      updatedAt: "2 days ago",
    },
  ],
};

export function getWorkspaceData(): WorkspaceData {
  if (typeof window === "undefined") return defaultData;
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return defaultData;
    const parsed = JSON.parse(saved);
    // Merge with default data to guarantee newly added keys exist
    return {
      ...defaultData,
      ...parsed,
      brandKit: { ...defaultData.brandKit, ...(parsed.brandKit || {}) },
      agents: parsed.agents?.length ? parsed.agents : defaultData.agents,
      publishingQueue: parsed.publishingQueue?.length ? parsed.publishingQueue : defaultData.publishingQueue,
      clientPortals: parsed.clientPortals?.length ? parsed.clientPortals : defaultData.clientPortals,
      seoAudits: parsed.seoAudits?.length ? parsed.seoAudits : defaultData.seoAudits,
      competitorMoves: parsed.competitorMoves?.length ? parsed.competitorMoves : defaultData.competitorMoves,
      localizations: parsed.localizations?.length ? parsed.localizations : defaultData.localizations,
    } as WorkspaceData;
  } catch {
    return defaultData;
  }
}

export function saveWorkspaceData(data: WorkspaceData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event("nexus-workspace-change"));
}

export function updateWorkspaceData(update: (data: WorkspaceData) => WorkspaceData) {
  const next = update(getWorkspaceData());
  saveWorkspaceData(next);
  return next;
}
