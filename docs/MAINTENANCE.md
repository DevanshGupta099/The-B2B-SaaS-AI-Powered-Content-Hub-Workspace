# Operations & Maintenance Guide: Nexus Content OS

This guide covers operational best practices, token quota governor management, rate-limit backoff, and troubleshooting procedures.

---

## 1. Rate Limiting & Groq OTPM Handling

### The 1,000 OTPM Ceiling
Groq's free-tier rate limits enforce **1,000 Output Tokens Per Minute (OTPM)** on models like `qwen/qwen3.8-27b`. Groq pre-evaluates `Used + Requested > 1000`.

### Adaptive Rate Governor (`src/lib/ai-service.ts`)
Nexus implements an adaptive rate governor:
1. **Dynamic Headroom:** Default `maxTokens` is capped at 700 (or 250-500 for structured JSON endpoints).
2. **Deterministic 429 Parsing:** When a `429 Too Many Requests` is returned:
   - Nexus regex-matches `Used <n> tokens` and `try again in <x>s`.
   - Pauses execution for the specified duration.
   - Adjusts the retry token headroom dynamically: `Math.max(120, Math.min(maxTokens, 980 - used))`.
   - Retries transparently so user requests do not fail.

---

## 2. Automated Integration Testing

Run the full automated test suite to verify all endpoints:

```bash
cd content-hub
node scripts/test-api.mjs
```

This verifies:
- Health ping latency
- Universal Chat Generation
- Deterministic Brand Voice Linters
- Omnichannel Atomization
- 384d Dense Vector Embeddings
- Semantic Vector Cosine Search (RAG)
- SEO Intelligence & SERP Audit
- Competitive Radar Analysis
- Global Transcreation Engine

---

## 3. Troubleshooting Common Issues

### Issue: "Loading document..." hangs permanently
- **Root Cause:** A workspace ID (e.g. `1`, `marketing`) was requested, but only specific document IDs were queried.
- **Solution:** Nexus now routes all document queries through `GET /api/documents/[id]`, which resolves workspace primary documents and auto-seeds initial drafts if empty.

### Issue: GitHub Push Declined (Push Protection)
- **Root Cause:** Raw API keys committed in source files.
- **Solution:** Never commit keys in `.ts` or `.json`. All secrets must strictly reside in `.env` / `.env.local` and be accessed via `process.env`.
