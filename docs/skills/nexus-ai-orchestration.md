# Agent Skill: Nexus AI Orchestration

This skill guides engineering and agent operations on orchestrating Groq Cloud LPUs, Hugging Face dense embeddings, and Ollama within the Nexus Content OS.

---

## Technical Specifications

- **LLM Provider:** Groq Cloud LPU
- **Primary Model:** `qwen/qwen3.8-27b`
- **Embedding Model:** `BAAI/bge-small-en-v1.5` (384-dimensional dense vectors)
- **Fallback Node:** Local Ollama (`llama3.2:3b` and `nomic-embed-text`) on `http://localhost:11434`

---

## Token Quota & Rate Limit Rule (1,000 OTPM)

1. Groq free tier enforces a strict 1,000 Output Tokens Per Minute (OTPM) rate limit.
2. Every request must cap `maxTokens`:
   - Chat & summaries: `<= 300`
   - Content atomization: `<= 700`
   - Brand check & linting: `<= 250`
   - SEO audits & radar: `<= 450`
3. If Groq responds with `429 Too Many Requests`, the built-in adaptive backoff in `src/lib/ai-service.ts` parses `Used <n> tokens` and `try again in <x>s`, pauses for the exact window, and dynamically recalculates safe token headroom before retrying.

---

## Code Example: Calling the AI Orchestrator

```typescript
import { generateChatCompletion } from "@/lib/ai-service";

const response = await generateChatCompletion({
  messages: [
    { role: "system", content: "You are Nexus AI Copilot." },
    { role: "user", content: "Summarize this strategy document." }
  ],
  temperature: 0.5,
  maxTokens: 300
});

console.log("Completion:", response.text);
console.log("Latency:", response.latencyMs, "ms");
```
