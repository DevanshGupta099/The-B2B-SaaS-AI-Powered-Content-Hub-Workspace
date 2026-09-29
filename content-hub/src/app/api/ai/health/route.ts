import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();
  let groqStatus = "unknown";
  let geminiStatus = "unknown";
  let openrouterStatus = "unknown";
  let hfStatus = "unknown";
  let ollamaStatus = "offline";

  // 1. Check Groq
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const gRes = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": `Bearer ${groqKey}` },
      });
      groqStatus = gRes.ok ? "connected" : `error (${gRes.status})`;
    } else {
      groqStatus = "missing_api_key";
    }
  } catch (err: unknown) {
    groqStatus = `unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 2. Check Google Gemini
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
      );
      geminiStatus = gemRes.ok ? "connected" : `error (${gemRes.status})`;
    } else {
      geminiStatus = "missing_api_key";
    }
  } catch (err: unknown) {
    geminiStatus = `unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 3. Check OpenRouter
  try {
    const orKey = process.env.OPENROUTER_API_KEY;
    if (orKey) {
      const orRes = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: { "Authorization": `Bearer ${orKey}` },
      });
      openrouterStatus = orRes.ok ? "connected" : `error (${orRes.status})`;
    } else {
      openrouterStatus = "missing_api_key";
    }
  } catch (err: unknown) {
    openrouterStatus = `unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 4. Check HuggingFace
  try {
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const hfModel = process.env.EMBEDDING_MODEL || "BAAI/bge-small-en-v1.5";
    if (hfKey) {
      const hRes = await fetch(`https://router.huggingface.co/hf-inference/models/${hfModel}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: "ping" }),
      });
      hfStatus = hRes.ok ? "connected" : `error (${hRes.status})`;
    } else {
      hfStatus = "missing_api_key";
    }
  } catch (err: unknown) {
    hfStatus = `unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 5. Check Ollama
  try {
    const oUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const oRes = await fetch(`${oUrl}/api/tags`);
    ollamaStatus = oRes.ok ? "connected" : "offline";
  } catch {
    ollamaStatus = "offline";
  }

  const isHealthy =
    (groqStatus === "connected" || geminiStatus === "connected" || openrouterStatus === "connected") &&
    hfStatus === "connected";

  return NextResponse.json({
    status: isHealthy ? "healthy" : "degraded",
    latencyMs: Date.now() - startTime,
    providers: {
      groq: {
        status: groqStatus,
        model: process.env.LLM_MODEL || "qwen/qwen3.8-27b",
      },
      gemini: {
        status: geminiStatus,
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      },
      openrouter: {
        status: openrouterStatus,
        model: process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free",
      },
      huggingface: {
        status: hfStatus,
        model: process.env.EMBEDDING_MODEL || "BAAI/bge-small-en-v1.5",
        dimensions: 384,
      },
      ollama: {
        status: ollamaStatus,
        url: process.env.OLLAMA_URL || "http://localhost:11434",
        model: process.env.OLLAMA_LLM_MODEL || "llama3.2:3b",
      },
    },
    configuredLLMProvider: process.env.LLM_PROVIDER || "groq (with Gemini & OpenRouter failover)",
    configuredEmbeddingProvider: process.env.EMBEDDING_PROVIDER || "huggingface",
  });
}
