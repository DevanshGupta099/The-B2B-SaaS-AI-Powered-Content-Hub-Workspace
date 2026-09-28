---
name: nexus-ai-orchestration
description: Guidelines and recipes for orchestrating LLM completions, dense vector embeddings, and content atomization in Nexus Content OS.
---

# Nexus AI Orchestration Skill

Use this skill when developing, testing, or prompting AI models within the Nexus B2B SaaS Content OS platform.

## Architecture & Providers

- **Primary LLM:** Groq Cloud LPU running `qwen/qwen3.8-27b` (~200ms latency).
- **Dense Embeddings:** Hugging Face Router running `BAAI/bge-small-en-v1.5` (384-dimensional dense vectors).
- **Local Fallback:** Ollama running `llama3.2:3b` and `nomic-embed-text` on `http://localhost:11434`.

## Rate Limit Governance (1,000 OTPM)

Groq enforces a strict 1,000 Output Tokens Per Minute (OTPM) rate limit. All LLM calls must adhere to:

1. Always set `maxTokens` to the minimum necessary:
   - Chat & summaries: `<= 300`
   - Content atomization: `<= 700`
   - Brand check & linting: `<= 250`
   - SEO audits & radar: `<= 450`
2. Never call parallel unthrottled requests. Allow 1-2 seconds between batch test runs.
3. Utilize `generateChatCompletion()` from `@/lib/ai-service`, which includes built-in retry backoff and dynamic token headroom recalculation.

## Core API Endpoints

- `GET /api/ai/health`: Diagnostics and latency ping.
- `POST /api/ai/generate`: Chat completions and slash actions (`/summarize`, `/punchy`).
- `POST /api/ai/atomize`: 1-to-many multichannel content generation.
- `POST /api/ai/embed`: 384d dense vector generation.
- `POST /api/ai/semantic-search`: In-memory cosine similarity retrieval.
