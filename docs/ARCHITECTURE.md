# System Architecture: Nexus Governed B2B AI Content OS

Nexus is an enterprise-grade AI-powered Content Operating System and collaborative workspace built with Next.js 16 (App Router & Turbopack), Tailwind CSS, Groq LPUs (`qwen/qwen3.8-27b`), and Hugging Face dense embeddings (`BAAI/bge-small-en-v1.5`).

---

## 1. High-Level Architectural Diagram

```mermaid
graph TD
    Client["Next.js 16 Client (React Server/Client Components)"] -->|HTTPS / JSON| APIRoutes["Next.js App Router API Layer (/api/*)"]
    
    subgraph Data_Layer ["Backend Data Layer & Seed Store"]
        APIRoutes --> Store["In-Memory Singleton / State Store (server-store.ts)"]
        Store --> Workspaces["Workspaces (/api/workspaces)"]
        Store --> Documents["Collaborative Documents (/api/documents)"]
        Store --> DAM["Digital Asset Management (/api/dam)"]
        Store --> Activity["Audit Activity Stream (/api/report)"]
    end

    subgraph AI_Services ["Nexus AI Service Orchestrator (ai-service.ts)"]
        APIRoutes --> RateGovernor["Token Rate Governor & 429 Adaptive Backoff"]
        RateGovernor --> LLMEngine["Chat & Atomization Engine"]
        RateGovernor --> EmbeddingEngine["384d Dense Vector Embeddings"]
        RateGovernor --> LinterEngine["Deterministic Voice Linters"]
    end

    subgraph External_Providers ["Inference & Embedding Nodes"]
        LLMEngine -->|Sub-second LPU (~200ms)| Groq["Groq Cloud API (qwen/qwen3.8-27b)"]
        EmbeddingEngine -->|384d Vectors| HF["Hugging Face Router (BAAI/bge-small-en-v1.5)"]
        LLMEngine -.->|Local Standby| OllamaLLM["Local Ollama (llama3.2:3b)"]
        EmbeddingEngine -.->|Local Standby| OllamaEmbed["Local Ollama (nomic-embed-text)"]
    end
```

---

## 2. Directory Structure & Layer Responsibilities

```
The B2B SaaS AI-Powered Content Hub & Workspace/
├── .env.example                     # Root environment variable template
├── .gitignore                       # Root ignore rules (protecting credentials and build output)
├── README.md                        # Master documentation and quickstart
├── LICENSE                          # MIT open-source license
├── docs/                            # Comprehensive architectural & operational manuals
│   ├── ARCHITECTURE.md              # System design and component data flow
│   ├── API_REFERENCE.md             # REST & AI API documentation
│   ├── DEPLOYMENT.md                # Docker and cloud hosting runbook
│   └── MAINTENANCE.md               # Operations, rate limits, and troubleshooting
├── .agents/skills/                  # Antigravity & Agentic Custom Skills
│   ├── nexus-ai-orchestration/     # Skill for AI prompting, models, and rate limits
│   ├── dam-and-media/               # Skill for digital asset management
│   └── governance-and-compliance/   # Skill for brand voice linters and RBAC
└── content-hub/                     # Next.js 16 Application Root
    ├── Dockerfile                   # Multi-stage container definition
    ├── .dockerignore                # Container build exclusions
    ├── scripts/
    │   └── test-api.mjs             # Automated API integration test suite
    ├── src/
    │   ├── app/                     # Next.js 16 App Router routes
    │   │   ├── api/                 # Backend REST endpoints (workspaces, dam, ai, report)
    │   │   │   ├── ai/              # AI endpoints (health, generate, atomize, embed, etc.)
    │   │   │   ├── dam/             # Media assets CRUD and visual tagging
    │   │   │   ├── documents/       # Collaborative document persistence
    │   │   │   ├── report/          # Executive report synthesis
    │   │   │   └── workspaces/      # Governed workspace management
    │   │   ├── dashboard/           # Authenticated user dashboard & sub-views
    │   │   ├── workspace/[id]/      # Live collaborative document canvas
    │   │   └── settings/            # Workspace administration & RBAC
    │   ├── components/              # Modular UI components & layout shell
    │   │   ├── AppLayout.tsx        # Responsive application navigation shell
    │   │   ├── EditorCanvas.tsx     # Rich document authoring canvas
    │   │   └── ui/                  # Reusable design tokens (Button, Modal, Toast)
    │   └── lib/
    │       ├── ai-service.ts        # Unified AI client with adaptive backoff
    │       ├── server-store.ts      # Backend state store & seed data
    │       └── documents.ts         # Client document contracts & localStorage bridge
```

---

## 3. Key Design Tenets

1. **Zero Double-Shell Layout:** In Next.js 16 App Router, layout components cascade. `src/app/dashboard/layout.tsx` wraps all child dashboard pages in `<AppLayout>`. Child views render only their inner contents to prevent duplicate sidebars or nested scrollbars.
2. **Unified AI Orchestrator:** All generative inference, embeddings, and deterministic linters pass through `src/lib/ai-service.ts`. This encapsulates error handling, rate-limit backoff, and model fallbacks.
3. **Enterprise Brand Guardrails:** AI completions are parsed against deterministic buzzword rules (`evaluateBrandVoice`) to prevent unverified superlatives ("revolutionary", "best-in-class") from reaching production drafts.
4. **Zero-CLS Typography:** All fonts load build-time via `next/font/google` (`Plus_Jakarta_Sans` & `Outfit`), avoiding render-blocking stylesheets or cumulative layout shifts.
