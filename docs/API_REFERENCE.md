# Nexus Content OS: API Reference Manual

Nexus provides high-performance REST endpoints for content generation, omnichannel atomization, vector semantic search, brand compliance linting, workspace governance, and digital asset management.

All API routes are located under `content-hub/src/app/api/`.

---

## 1. AI Intelligence Endpoints

### `GET /api/ai/health`
Checks connectivity and latency to Groq, Hugging Face Router, and local Ollama.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "latencyMs": 850,
  "providers": {
    "groq": { "status": "connected", "model": "qwen/qwen3.8-27b" },
    "huggingface": { "status": "connected", "model": "BAAI/bge-small-en-v1.5", "dimensions": 384 },
    "ollama": { "status": "offline" }
  },
  "timestamp": "2026-09-28T16:00:00.000Z"
}
```

---

### `POST /api/ai/generate`
Generates chat completions, summarizes documents, or executes editorial slash commands.

**Request Body:**
```json
{
  "prompt": "Synthesize a 2-sentence executive summary of our Q4 pricing strategy.",
  "systemPrompt": "You are Nexus AI Copilot. Answer concisely.",
  "temperature": 0.5,
  "maxTokens": 300
}
```

**Response (200 OK):**
```json
{
  "text": "In Q4, Nexus is introducing an enterprise pricing tier focused on governed multi-model inference...",
  "model": "qwen/qwen3.8-27b",
  "provider": "groq",
  "latencyMs": 280,
  "tokens": {
    "prompt": 45,
    "completion": 52,
    "total": 97
  }
}
```

---

### `POST /api/ai/brand-check`
Runs deterministic buzzword and superlatives linters over text drafts, computes a 0-100 brand alignment score, and optionally provides a 1-click rewritten version.

**Request Body:**
```json
{
  "text": "Our revolutionary AI platform provides seamless, guaranteed 10x ROI for modern teams.",
  "autoFix": true
}
```

**Response (200 OK):**
```json
{
  "report": {
    "score": 46,
    "isCompliant": false,
    "infractions": [
      { "term": "revolutionary", "reason": "Restricted buzzword flagged under enterprise brand governance.", "suggestion": "groundbreaking, validated, or step-function" },
      { "term": "seamless", "reason": "Restricted buzzword flagged under enterprise brand governance.", "suggestion": "continuous, integrated, or native" }
    ],
    "toneFeedback": "High risk of brand drift: multiple unverified superlatives detected.",
    "analyzedLength": 13
  },
  "fixedText": "Our validated AI platform provides continuous, SLA-backed 4x efficiency gains for modern teams."
}
```

---

### `POST /api/ai/atomize`
Atomizes a single core document or brief into 5 channel-specific assets (LinkedIn post, X thread, email newsletter, video script, SEO meta tags).

**Request Body:**
```json
{
  "sourceContent": "Nexus releases native multi-model orchestration with sub-250ms Groq inference and deterministic linters.",
  "targetChannels": ["LinkedIn", "Twitter/X", "Email Newsletter", "YouTube Script", "SEO Meta"]
}
```

---

### `POST /api/ai/embed`
Computes 384-dimensional dense semantic vector embeddings using Hugging Face's `BAAI/bge-small-en-v1.5`.

**Request Body:**
```json
{
  "text": "SOC2 Type II compliance and cryptographic audit logging"
}
```

**Response (200 OK):**
```json
{
  "embedding": [0.0124, -0.0481, 0.0812, ...],
  "dimensions": 384,
  "provider": "huggingface",
  "model": "BAAI/bge-small-en-v1.5"
}
```

---

### `POST /api/ai/semantic-search`
Performs in-memory cosine similarity retrieval augmented generation (RAG) across document arrays.

---

## 2. Workspace & Data Management Endpoints

### `GET /api/workspaces`
Lists all active enterprise workspaces.

### `GET /api/workspaces/[id]`
Returns metadata, collaborator list, and documents associated with the workspace.

### `GET /api/documents`
Returns all collaborative documents. Supports `?workspaceId=...` and `?query=...`.

### `GET /api/documents/[id]`
Returns the document by ID. If provided a workspace ID (e.g. `1`, `marketing`), automatically resolves or seeds the primary document so the editor never hangs.

### `PUT /api/documents/[id]`
Updates document title, content, or metadata.

### `GET /api/dam`
Lists Digital Asset Management media files. Supports `?folder=...` and `?query=...`.

### `POST /api/dam`
Creates or uploads a digital asset with automatic AI visual tagging.

### `DELETE /api/dam?id=...`
Deletes a media asset by ID.

### `POST /api/report`
Synthesizes an executive workspace intelligence report using Groq LPUs.
