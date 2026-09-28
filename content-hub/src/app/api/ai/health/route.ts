import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();
  let groqStatus = "unknown";
  let hfStatus = "unknown";
  let ollamaStatus = "offline";

  // Check Groq
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

  // Check HuggingFace
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

  // Check Ollama
  try {
    const oUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const oRes = await fetch(`${oUrl}/api/tags`);
    ollamaStatus = oRes.ok ? "connected" : "offline";
  } catch {
    ollamaStatus = "offline";
  }

  return NextResponse.json({
    status: groqStatus === "connected" && hfStatus === "connected" ? "healthy" : "degraded",
    latencyMs: Date.now() - startTime,
    providers: {
      groq: {
        status: groqStatus,
        model: process.env.LLM_MODEL || "qwen/qwen3.8-27b",
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
    configuredLLMProvider: process.env.LLM_PROVIDER || "groq",
    configuredEmbeddingProvider: process.env.EMBEDDING_PROVIDER || "huggingface",
  });
}
