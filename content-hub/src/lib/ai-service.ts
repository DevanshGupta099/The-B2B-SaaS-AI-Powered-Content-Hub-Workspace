/**
 * Nexus B2B SaaS AI Service Engine
 * Unified orchestrator for Groq LLMs, HuggingFace Dense Embeddings, and Ollama.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequestOptions {
  messages: LLMMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  provider?: string;
}

export interface LLMResponse {
  text: string;
  model: string;
  provider: string;
  latencyMs: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface EmbeddingResponse {
  embedding: number[];
  dimensions: number;
  provider: string;
  model: string;
}

export interface BrandInfraction {
  term: string;
  reason: string;
  suggestion: string;
}

export interface BrandComplianceReport {
  score: number; // 0 - 100
  isCompliant: boolean;
  infractions: BrandInfraction[];
  toneFeedback: string;
  analyzedLength: number;
}

export async function generateChatCompletion(options: LLMRequestOptions): Promise<LLMResponse> {
  const startTime = Date.now();
  const provider = (options.provider || process.env.LLM_PROVIDER || "groq").toLowerCase();
  const targetModel = options.model || process.env.LLM_MODEL || "qwen/qwen3.8-27b";

  const allMessages: LLMMessage[] = [];
  if (options.systemPrompt) {
    allMessages.push({ role: "system", content: options.systemPrompt });
  }
  allMessages.push(...options.messages);

  // 1. Try Ollama if explicitly requested
  if (provider === "ollama") {
    try {
      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
      const ollamaModel = options.model || process.env.OLLAMA_LLM_MODEL || "llama3.2:3b";
      
      const res = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: allMessages,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.7,
            num_predict: options.maxTokens ?? 1500,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const latencyMs = Date.now() - startTime;
        return {
          text: data.message?.content || "",
          model: ollamaModel,
          provider: "ollama",
          latencyMs,
          tokens: {
            prompt: data.prompt_eval_count || 0,
            completion: data.eval_count || 0,
            total: (data.prompt_eval_count || 0) + (data.eval_count || 0),
          },
        };
      }
      console.warn("Ollama request failed, falling back to Groq:", await res.text());
    } catch (err) {
      console.warn("Ollama unavailable, falling back to Groq:", err);
    }
  }

  // 2. Default or Fallback to Groq
  const groqApiKey = process.env.GROQ_API_KEY || "";
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not set. Please add it to your .env or .env.local file.");
  }
  const groqModel = targetModel;

  const maxTokens = options.maxTokens ?? 700;

  let res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel,
      messages: allMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: maxTokens,
    }),
  });

  // Intelligent backoff and token optimization on rate limits (e.g. OTPM 1000 limit)
  if (res.status === 429) {
    const errorBody = await res.text();
    const waitMatch = errorBody.match(/try again in ([\d\.]+)s/i);
    const usedMatch = errorBody.match(/Used\s+(\d+)/i);
    const waitSec = waitMatch ? Math.min(Math.ceil(parseFloat(waitMatch[1]) + 0.5), 10) : 4;
    console.warn(`Groq rate limit on ${groqModel}, waiting ${waitSec}s...`);
    await new Promise(r => setTimeout(r, waitSec * 1000));

    const used = usedMatch ? parseInt(usedMatch[1]) : 700;
    const safeTokens = Math.max(120, Math.min(maxTokens, 980 - used));

    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groqModel,
        messages: allMessages,
        temperature: options.temperature ?? 0.7,
        max_tokens: safeTokens,
      }),
    });
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const latencyMs = Date.now() - startTime;
  const choice = data.choices?.[0];

  return {
    text: choice?.message?.content || "",
    model: data.model || groqModel,
    provider: "groq",
    latencyMs,
    tokens: {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    },
  };
}

/**
 * Generate 384-dimensional dense semantic embeddings
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResponse> {
  const provider = (process.env.EMBEDDING_PROVIDER || "huggingface").toLowerCase();
  const hfModel = process.env.EMBEDDING_MODEL || "BAAI/bge-small-en-v1.5";
  const hfKey = process.env.HUGGINGFACE_API_KEY || "";

  // If Ollama is preferred:
  if (provider === "ollama") {
    try {
      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
      const ollamaModel = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";
      const res = await fetch(`${ollamaUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: ollamaModel, prompt: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.embedding && Array.isArray(data.embedding)) {
          return {
            embedding: data.embedding,
            dimensions: data.embedding.length,
            provider: "ollama",
            model: ollamaModel,
          };
        }
      }
    } catch {
      // Fallback to Hugging Face router
    }
  }

  if (!hfKey) {
    throw new Error("HUGGINGFACE_API_KEY is not set. Please add it to your .env or .env.local file.");
  }

  // Hugging Face Router endpoint
  const url = `https://router.huggingface.co/hf-inference/models/${hfModel}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${hfKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text.slice(0, 2000) }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HuggingFace Embedding Error (${res.status}): ${errorText}`);
  }

  const raw = await res.json();
  // BAAI/bge-small-en-v1.5 returns number[] or [number[]]
  let vector: number[] = [];
  if (Array.isArray(raw)) {
    if (typeof raw[0] === "number") {
      vector = raw as number[];
    } else if (Array.isArray(raw[0]) && typeof raw[0][0] === "number") {
      vector = raw[0] as number[];
    }
  }

  if (!vector || vector.length === 0) {
    throw new Error("Invalid embedding response format from HuggingFace");
  }

  return {
    embedding: vector,
    dimensions: vector.length,
    provider: "huggingface",
    model: hfModel,
  };
}

/**
 * Cosine similarity between two vectors
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Deterministic Brand Voice & Buzzword Linter
 */
export function evaluateBrandVoice(
  text: string,
  restrictedTermsStr: string = "best-in-class, revolutionary, seamless, guaranteed, game-changer, unlock, elevate, 10x"
): BrandComplianceReport {
  const restrictedList = restrictedTermsStr
    .split(",")
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);

  const lower = text.toLowerCase();
  const infractions: BrandInfraction[] = [];

  for (const term of restrictedList) {
    // Regex for whole word or exact phrase match
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      infractions.push({
        term,
        reason: `Restricted buzzword flagged under enterprise brand governance.`,
        suggestion: getSuggestedAlternative(term),
      });
    }
  }

  // Calculate score based on infractions per word count
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let penalty = infractions.length * 18;
  if (wordCount < 10) penalty = Math.min(penalty, 30);
  const score = Math.max(12, Math.min(100, 100 - penalty));

  let toneFeedback = "Flawless brand alignment. Voice adheres to clarity, directness, and factual authority.";
  if (score < 60) {
    toneFeedback = "High risk of brand drift: multiple unverified superlatives and corporate filler words detected.";
  } else if (score < 85) {
    toneFeedback = "Moderate compliance: remove highlighted buzzwords to improve enterprise readability and trust.";
  }

  return {
    score,
    isCompliant: infractions.length === 0,
    infractions,
    toneFeedback,
    analyzedLength: wordCount,
  };
}

function getSuggestedAlternative(term: string): string {
  const map: Record<string, string> = {
    "seamless": "continuous, integrated, or native",
    "revolutionary": "groundbreaking, validated, or step-function",
    "best-in-class": "leading, benchmarked, or audited",
    "guaranteed": "engineered, verified, or guaranteed by SLA",
    "game-changer": "decisive advantage or measurable shift",
    "unlock": "enable, access, or activate",
    "elevate": "improve, accelerate, or enhance",
    "10x": "multiply, streamline, or 4x verified",
  };
  return map[term.toLowerCase()] || "use direct, factual evidence";
}
