# Deployment Runbook: Nexus Content OS

This document covers deploying Nexus to containerized Docker environments, Vercel, and modern Kubernetes/cloud infrastructure.

---

## 1. Environment Variable Configuration

Create a `.env.local` or provide system environment variables:

| Variable | Required | Default / Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | **Yes** | `gsk_...` | Groq Cloud LPU authorization key |
| `HUGGINGFACE_API_KEY` | **Yes** | `hf_...` | Hugging Face Router inference token |
| `LLM_PROVIDER` | No | `groq` | Primary LLM provider (`groq` or `ollama`) |
| `LLM_MODEL` | No | `qwen/qwen3.8-27b` | Primary generation model |
| `EMBEDDING_PROVIDER` | No | `huggingface` | Dense embeddings provider (`huggingface` or `ollama`) |
| `EMBEDDING_MODEL` | No | `BAAI/bge-small-en-v1.5` | Embedding model (384 dimensions) |
| `OLLAMA_URL` | No | `http://localhost:11434` | Local Ollama host (fallback) |
| `NODE_ENV` | No | `production` | Node environment runtime |
| `PORT` | No | `3000` | Application HTTP listening port |

---

## 2. Docker Container Deployment

A multi-stage production [`content-hub/Dockerfile`](file:///content-hub/Dockerfile) is provided:

### Build Container Image
```bash
cd content-hub
docker build -t nexus-content-os:latest .
```

### Run Container Image
```bash
docker run -d \
  --name nexus-hub \
  -p 3000:3000 \
  -e GROQ_API_KEY="your-groq-key" \
  -e HUGGINGFACE_API_KEY="your-hf-token" \
  nexus-content-os:latest
```

The container runs with unprivileged user `nextjs` (UID 1001) for SOC2 compliance.

---

## 3. Vercel Deployment

1. Connect the GitHub repository: `https://github.com/DevanshGupta099/The-B2B-SaaS-AI-Powered-Content-Hub-Workspace`
2. Set **Root Directory** to `content-hub`
3. Add Environment Variables:
   - `GROQ_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `LLM_PROVIDER=groq`
   - `LLM_MODEL=qwen/qwen3.8-27b`
   - `EMBEDDING_PROVIDER=huggingface`
   - `EMBEDDING_MODEL=BAAI/bge-small-en-v1.5`
4. Deploy!

---

## 4. Health Check & Liveness Probes

Configure Kubernetes or load balancer probes:
- **Liveness Probe:** `GET /api/ai/health`
- **Expected Status:** `200 OK`
- **Initial Delay:** 5s
- **Period:** 30s
