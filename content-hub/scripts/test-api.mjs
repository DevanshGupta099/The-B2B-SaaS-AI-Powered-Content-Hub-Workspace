// Comprehensive automated test suite for Nexus AI endpoints
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("       NEXUS AI BACKEND INTEGRATION TEST SUITE     ");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  async function testEndpoint(name, url, method = "GET", body = null) {
    total++;
    const start = Date.now();
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) options.body = JSON.stringify(body);
      
      const res = await fetch(`${BASE_URL}${url}`, options);
      const elapsed = Date.now() - start;
      const data = await res.json();
      
      // Courteous pause between integration tests to stay within OTPM
      await new Promise(r => setTimeout(r, 1500));

      if (res.ok) {
        passed++;
        console.log(`[PASS] ${name} (${elapsed}ms) - Status: ${res.status}`);
        return { success: true, data, elapsed };
      } else {
        console.error(`[FAIL] ${name} (${elapsed}ms) - Status: ${res.status} Error:`, data);
        return { success: false, data, elapsed };
      }
    } catch (err) {
      const elapsed = Date.now() - start;
      console.error(`[ERR]  ${name} (${elapsed}ms) - Exception:`, err.message);
      return { success: false, error: err.message, elapsed };
    }
  }

  // 1. Health check
  await testEndpoint("Health & Connectivity", "/api/ai/health");

  // 2. Chat generation
  await testEndpoint("Universal Chat Generation", "/api/ai/generate", "POST", {
    prompt: "List 3 enterprise benefits of CRDT state sync in real-time document collaboration.",
    temperature: 0.5,
    max_tokens: 300,
  });

  // 3. Brand Voice Linter
  await testEndpoint("Brand Voice & AutoFix", "/api/ai/brand-check", "POST", {
    text: "Nexus delivers a revolutionary, best-in-class platform with seamless synergy.",
    autoFix: true,
  });

  // 4. Omnichannel Atomizer
  await testEndpoint("Omnichannel Content Atomizer", "/api/ai/atomize", "POST", {
    brief: "Nexus releases zero-latency CRDT multiplayer editor with live brand voice compliance.",
  });

  // 5. Hugging Face Embeddings
  await testEndpoint("Dense Vector Embeddings (384d)", "/api/ai/embed", "POST", {
    text: "Enterprise B2B Content Governance and AI orchestration",
  });

  // 6. Semantic Vector Search RAG
  await testEndpoint("Semantic Vector Search RAG", "/api/ai/semantic-search", "POST", {
    query: "brand guidelines and tone rules",
    documents: [
      { id: "1", title: "Brand Voice Guidelines", content: "Our tone is direct, factual, and devoid of hyperbolic claims like best-in-class." },
      { id: "2", title: "API Documentation", content: "Endpoints for POST /api/ai/generate with Bearer token authentication." },
      { id: "3", title: "Quarterly Revenue", content: "Q3 ARR closed at $4.2M representing 45% net expansion." }
    ]
  });

  // 7. SEO Intelligence Audit
  await testEndpoint("SEO Intelligence & SERP Audit", "/api/ai/seo-audit", "POST", {
    keyword: "b2b content governance software",
    content: "Learn how governed content platforms protect enterprise brands from AI hallucinations.",
  });

  // 8. Competitive Radar
  await testEndpoint("Competitive Radar Intelligence", "/api/ai/radar", "POST", {
    competitor: "Legacy CMS Corp",
    featureArea: "Real-time AI Guardrails",
    ourAdvantage: "Deterministic linter running on Groq LPUs at 200ms latency",
  });

  // 9. Global Localization
  await testEndpoint("Global Transcreation Engine", "/api/ai/translate", "POST", {
    text: "Empower your marketing team to scale collateral with zero compliance drift.",
    targetLanguage: "Spanish",
    preserveGlossary: ["Nexus", "Brand Kit", "CRDT"],
  });

  console.log("==================================================");
  console.log(`Results: ${passed} / ${total} Endpoints Passed (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
