/**
 * Nexus B2B SaaS AI Service Engine
 * Resilient multi-provider orchestrator supporting Groq LPUs, Google Gemini 3.5,
 * OpenRouter, HuggingFace Dense Embeddings, and Local Ollama.
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

/**
 * Google Gemini Execution Engine (Gemini 3.5 Flash Lite / 3.1 Flash Lite)
 */
async function callGemini(
  messages: LLMMessage[],
  systemPrompt?: string,
  options?: LLMRequestOptions,
  startTime: number = Date.now()
): Promise<LLMResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = options?.model && options.model.startsWith("gemini")
    ? options.model
    : (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite");

  const nonSystemMessages = messages.filter(m => m.role !== "system");
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  for (const msg of nonSystemMessages) {
    const role = msg.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts.push({ text: msg.content });
    } else {
      contents.push({ role, parts: [{ text: msg.content }] });
    }
  }

  if (contents.length === 0) {
    contents.push({ role: "user", parts: [{ text: "Proceed with enterprise request." }] });
  }

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1500,
    }
  };

  const sys = systemPrompt || messages.find(m => m.role === "system")?.content;
  if (sys) {
    payload.systemInstruction = { parts: [{ text: sys }] };
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    // Spikes in demand: automatic retry with stable fallback model
    if (model !== "gemini-3.1-flash-lite" && (res.status === 429 || res.status === 503 || errText.includes("high demand"))) {
      console.warn(`Gemini ${model} high demand, falling back to gemini-3.1-flash-lite...`);
      return callGemini(messages, systemPrompt, { ...options, messages, model: "gemini-3.1-flash-lite" }, startTime);
    }
    throw new Error(`Gemini API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const latencyMs = Date.now() - startTime;

  return {
    text,
    model: data.modelVersion || model,
    provider: "gemini",
    latencyMs,
    tokens: {
      prompt: data.usageMetadata?.promptTokenCount || 0,
      completion: data.usageMetadata?.candidatesTokenCount || 0,
      total: data.usageMetadata?.totalTokenCount || 0,
    }
  };
}

/**
 * OpenRouter Execution Engine (Free tier & multi-model router)
 */
async function callOpenRouter(
  allMessages: LLMMessage[],
  options?: LLMRequestOptions,
  startTime: number = Date.now()
): Promise<LLMResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const model = options?.model && (options.model.includes("/") || options.model.includes(":free"))
    ? options.model
    : (process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://nexus-content-hub.vercel.app",
      "X-Title": "Nexus Content OS",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: allMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    if (model !== "inclusionai/ling-3.0-flash-sante:free") {
      console.warn(`OpenRouter (${model}) issue, attempting fallback free model...`);
      return callOpenRouter(allMessages, { ...options, messages: allMessages, model: "inclusionai/ling-3.0-flash-sante:free" }, startTime);
    }
    throw new Error(`OpenRouter API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  const latencyMs = Date.now() - startTime;

  return {
    text: choice?.message?.content || "",
    model: data.model || model,
    provider: "openrouter",
    latencyMs,
    tokens: {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    }
  };
}

/**
 * Groq LPU Execution Engine
 */
async function callGroq(
  allMessages: LLMMessage[],
  options?: LLMRequestOptions,
  startTime: number = Date.now()
): Promise<LLMResponse> {
  const groqApiKey = process.env.GROQ_API_KEY || "";
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const groqModel = options?.model || process.env.LLM_MODEL || "qwen/qwen3.8-27b";
  const maxTokens = options?.maxTokens ?? 700;

  let res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel,
      messages: allMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: maxTokens,
    }),
  });

  // Intelligent backoff on rate limit
  if (res.status === 429) {
    const errorBody = await res.text();
    const waitMatch = errorBody.match(/try again in ([\d\.]+)s/i);
    const usedMatch = errorBody.match(/Used\s+(\d+)/i);
    const waitSec = waitMatch ? Math.min(Math.ceil(parseFloat(waitMatch[1]) + 0.5), 6) : 3;

    if (waitSec <= 4) {
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
          temperature: options?.temperature ?? 0.7,
          max_tokens: safeTokens,
        }),
      });
    }
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
 * Main Unified Completion Router with Cascading Multi-Provider Failover:
 * Primary: Groq -> Secondary: Google Gemini -> Tertiary: OpenRouter -> Quaternary: Local Ollama
 */
export async function generateChatCompletion(options: LLMRequestOptions): Promise<LLMResponse> {
  const startTime = Date.now();
  const provider = (options.provider || process.env.LLM_PROVIDER || "groq").toLowerCase();

  const allMessages: LLMMessage[] = [];
  if (options.systemPrompt) {
    allMessages.push({ role: "system", content: options.systemPrompt });
  }
  allMessages.push(...options.messages);

  // 1. Explicitly Requested Gemini
  if (provider === "gemini") {
    try {
      return await callGemini(allMessages, options.systemPrompt, options, startTime);
    } catch (err) {
      console.warn("Direct Gemini call failed, attempting OpenRouter fallback:", err);
      if (process.env.OPENROUTER_API_KEY) {
        return await callOpenRouter(allMessages, options, startTime);
      }
      throw err;
    }
  }

  // 2. Explicitly Requested OpenRouter
  if (provider === "openrouter") {
    try {
      return await callOpenRouter(allMessages, options, startTime);
    } catch (err) {
      console.warn("Direct OpenRouter call failed, attempting Gemini fallback:", err);
      if (process.env.GEMINI_API_KEY) {
        return await callGemini(allMessages, options.systemPrompt, options, startTime);
      }
      throw err;
    }
  }

  // 3. Explicitly Requested Ollama
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
    } catch (err) {
      console.warn("Ollama unavailable, continuing to cloud providers:", err);
    }
  }

  // 4. Default / Resilient Cascade: Groq -> Gemini -> OpenRouter
  try {
    if (process.env.GROQ_API_KEY) {
      return await callGroq(allMessages, options, startTime);
    }
  } catch (groqError) {
    console.warn("Groq encounter failed/rate-limited. Cascading to Google Gemini...", groqError);
  }

  // Fallback 1: Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(allMessages, options.systemPrompt, options, startTime);
    } catch (geminiError) {
      console.warn("Gemini cascade failed. Cascading to OpenRouter...", geminiError);
    }
  }

  // Fallback 2: OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      return await callOpenRouter(allMessages, options, startTime);
    } catch (openRouterError) {
      console.warn("OpenRouter cascade failed:", openRouterError);
    }
  }

  throw new Error(
    "All configured LLM providers (Groq, Google Gemini, OpenRouter) were unavailable. Please verify API quotas and environment variables."
  );
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
