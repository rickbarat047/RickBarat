import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { generatePortfolioKnowledge } from "./src/utils/portfolioIntelligence";

dotenv.config();

const app = express();
const PORT = 3000;

// Universal CORS & Preflight Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "10mb" }));

// Dynamic runtime resolution of Gemini API key from environment or local config
function getRuntimeApiKey(): string | null {
  // 1. Direct process.env check across standard and alternative variable names
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_GENAI_API_KEY,
    process.env.GEMINI_KEY,
  ];

  for (const k of candidates) {
    if (k && typeof k === "string" && k.trim().length > 0) {
      return k.trim();
    }
  }

  // 2. Read dynamically from .env or .env.local if not present in process.env yet
  try {
    const rootDir = process.cwd();
    for (const f of [".env", ".env.local"]) {
      const p = path.join(rootDir, f);
      if (fs.existsSync(p)) {
        const fileContent = fs.readFileSync(p, "utf-8");
        const parsed = dotenv.parse(fileContent);
        const found = parsed.GEMINI_API_KEY || parsed.GOOGLE_API_KEY || parsed.GOOGLE_GENAI_API_KEY || parsed.GEMINI_KEY;
        if (found && found.trim().length > 0) {
          process.env.GEMINI_API_KEY = found.trim();
          return found.trim();
        }
      }
    }
  } catch (err) {
    console.warn("Could not check local env files at runtime:", err);
  }

  return null;
}

// Lazy-initialized Gemini AI client with runtime key lookup
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = getRuntimeApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Portfolio Knowledge Engine
function generatePortfolioFallback(query: string, persona: string): string {
  return generatePortfolioKnowledge(query, persona).reply;
}

// System instructions for different chatbot personas
const ROLE_INSTRUCTIONS: Record<string, string> = {
  general: `You are Rick Barat's AI Portfolio Assistant and technical twin.
Your purpose is to answer questions about Rick Barat's background, technical skills, projects, client work, education, and availability.

KEY INFORMATION ABOUT RICK BARAT:
- Name: Rick Barat
- Role: Full Stack Engineer & Creative Technologist (6+ years of production experience, 35+ shipped digital products)
- Location: India & Remote Worldwide (IST timezone, UTC+5:30)
- Education: Bachelor of Computer Applications (BCA) from Techno India University, Kolkata
- Contact Email: rickbarat21@gmail.com
- Instagram: @rickbarat047 (https://www.instagram.com/rickbarat047/?hl=en)
- GitHub: https://github.com
- Availability: Open for full-time high-impact roles, remote contracts, and 3D WebGL consultancy.

CORE SPECIALIZATIONS:
1. 3D & Creative Web Engineering: Three.js, React Three Fiber, WebGL / GLSL shaders, Draco compression, PBR materials, smooth GSAP camera choreography.
2. Frontend Architecture: React 19, TypeScript, Next.js, Tailwind CSS, micro-frontends, state machines.
3. Scalable Backends & APIs: Node.js, Express, Go, PostgreSQL, Redis caching, WebSockets.
4. AI Agent Integrations: Gemini API, LangChain, vector embeddings, intelligent agent workflows.

CLIENT WORK & TRACK RECORD:
- Indian D2C Brands & Enterprise Clients (2024-Present): 3D product visualizers, WebGL configurators, Razorpay/UPI checkout integration. 3.4x average conversion lift.
- Synapse Cloud Systems (US, 2023-2024): Distributed telemetry dashboards, flamegraphs parsing 500k spans at 60fps, 98+ Lighthouse scores.
- Studio Kroma & Apex Interactive (India/Global, 2022-2023): 14+ bespoke 3D interactive web experiences for luxury and architectural clients.
- NextWave Digital Tech (2020-2022): Component design systems, 20+ responsive web platforms.

TONE & BEHAVIOR:
- Professional, articulate, welcoming, and concise.
- Provide clean markdown formatting with bullet points and code blocks when appropriate.
- Always be truthful to Rick's background. If a question is outside Rick's profile, answer politely and offer to connect via email (rickbarat21@gmail.com) or Instagram (@rickbarat047).`,

  architect: `You are Rick Barat in "Lead Technical Architect & Systems Explainer" mode.
You delve deeply into engineering trade-offs, WebGL/Three.js render optimization, distributed real-time systems, memory management, microservices, and TypeScript design patterns.
You explain how Rick constructs zero-lag 3D web apps, handles 500k-trace flamegraphs, manages Redis pub/sub pipelines, and optimizes Core Web Vitals.
Provide detailed technical explanations, architectural diagrams in ASCII/markdown, and code snippets when requested.`,

  recruiter: `You are Rick Barat's "Career & Recruitment Matchmaker" assistant.
Your goal is to help hiring managers, technical recruiters, and potential clients evaluate Rick for their team.
Highlight Rick's 6+ years of full-stack experience, BCA degree from Techno India University, Kolkata, track record with both Indian and international clients (US SaaS, Indian D2C, creative studios), problem-solving velocity, and remote work proficiency.
Provide concise summaries of why Rick is a strong candidate for Senior Full Stack, Frontend Lead, 3D Web Engineer, or Creative Developer positions.`
};

// Health Check
app.all(["/api/health", "/api/health/"], (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const HANDSHAKE_ENDPOINTS = [
  "/api/chat/handshake",
  "/api/chat/handshake/",
  "/api/handshake",
  "/api/handshake/",
];

// Chatbot Initial Handshake & Diagnostics Endpoint
app.all(HANDSHAKE_ENDPOINTS, (_req, res) => {
  const apiKey = getRuntimeApiKey();
  const hasValidKey = Boolean(apiKey && apiKey.length > 5);

  res.json({
    status: "ok",
    hasApiKey: hasValidKey,
    runtimeMode: hasValidKey ? "live_gemini" : "portfolio_fallback",
    defaultModel: "gemini-3.1-flash-lite",
    availableModels: [
      { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", tag: "Recommended", isDefault: true },
      { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash", tag: "Advanced", isDefault: false },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", tag: "Deep Reasoning", isDefault: false },
    ],
    searchGroundingSupported: true,
    serverTimestamp: new Date().toISOString(),
    message: hasValidKey 
      ? "Gemini AI runtime connection established." 
      : "Connected to verified portfolio intelligence engine (API key not configured in environment).",
  });
});

const CHAT_ENDPOINTS = [
  "/api/chat",
  "/api/chat/",
  "/api/portfolio-chat",
  "/api/portfolio-chat/",
  "/api/gemini/chat",
  "/api/gemini/chat/",
];

// GET handler for chat endpoints (prevents 404 on browser inspect or GET probes)
app.get(CHAT_ENDPOINTS, (_req, res) => {
  const apiKey = getRuntimeApiKey();
  res.json({
    status: "ok",
    service: "Rick Barat AI Portfolio Chat Gateway",
    methods: ["POST", "GET"],
    defaultModel: "gemini-3.1-flash-lite",
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    handshake: "/api/chat/handshake",
  });
});

// Chatbot API Endpoint with Google Search Grounding, Automatic Model Fallback & Resilient Intelligence
app.post(CHAT_ENDPOINTS, async (req, res) => {
  try {
    const { 
      messages, 
      model = "gemini-3.1-flash-lite", 
      rolePersona = "general", 
      searchGrounding = false 
    } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const introText = generatePortfolioFallback("overview", rolePersona);
      return res.json({
        reply: introText,
        modelUsed: "gemini-3.1-flash-lite",
        rolePersona,
        isOfflineFallback: true,
        groundingMetadata: {
          sources: [],
          searchQueries: [],
          hasSearchGrounding: false,
        },
      });
    }

    // Map requested model to official, supported Gemini models
    const validModels = [
      "gemini-3.1-flash-lite", 
      "gemini-3.7-flash", 
      "gemini-3.1-pro-preview", 
      "gemini-flash-latest"
    ];
    
    let selectedModel = model;
    if (selectedModel === "gemini-3.5-flash" || !validModels.includes(selectedModel)) {
      selectedModel = "gemini-3.1-flash-lite";
    }

    const systemInstruction = ROLE_INSTRUCTIONS[rolePersona] || ROLE_INSTRUCTIONS.general;

    // Extract the latest query from user for context
    const lastUserMsg = [...messages]
      .reverse()
      .find((m: any) => m.role === "user" || m.role === undefined)?.content || 
      messages[messages.length - 1]?.content || 
      "";

    const ai = getGeminiClient();
    const apiKey = getRuntimeApiKey();

    // If GEMINI_API_KEY is not configured, supply high-quality offline portfolio knowledge
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured at runtime. Serving verified portfolio knowledge base.");
      const fallbackText = generatePortfolioFallback(lastUserMsg, rolePersona);
      return res.json({
        reply: fallbackText,
        modelUsed: selectedModel,
        rolePersona,
        isOfflineFallback: true,
        hasApiKey: false,
        errorType: "MISSING_KEY",
        groundingMetadata: {
          sources: [],
          searchQueries: [],
          hasSearchGrounding: false,
        },
      });
    }

    // Convert multi-turn history into the required Gemini contents format
    const contents = messages.map((msg: { role: string; content?: string; text?: string }) => {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      const text = msg.content || msg.text || "";
      return {
        role,
        parts: [{ text }],
      };
    });

    const baseConfig: any = {
      systemInstruction,
      temperature: 0.7,
    };

    let response: any = null;
    let usedSearchGrounding = false;
    let lastErrorDetails: string | null = null;
    let errorCategory: string | null = null;

    // 1. If search grounding was requested, try with Google Search tool
    if (searchGrounding) {
      try {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            ...baseConfig,
            tools: [{ googleSearch: {} }],
          },
        });
        usedSearchGrounding = true;
      } catch (groundingErr: any) {
        lastErrorDetails = groundingErr?.message || "Search grounding error";
        console.warn("Search grounding tool failed. Retrying without Google Search tool:", lastErrorDetails);
        // Fallback: Retry with the base model without search grounding
        try {
          response = await ai.models.generateContent({
            model: selectedModel,
            contents,
            config: baseConfig,
          });
          usedSearchGrounding = false;
        } catch (retryErr: any) {
          lastErrorDetails = retryErr?.message || "Model generation retry failed";
          response = null;
        }
      }
    } else {
      // 2. Standard fast direct generation
      try {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: baseConfig,
        });
      } catch (directErr: any) {
        lastErrorDetails = directErr?.message || "Direct model error";
        console.warn(`Direct model generation failed for ${selectedModel}:`, lastErrorDetails);
        response = null;
      }
    }

    // 3. Automatic Model Fallback: If primary model failed (e.g. 503 high demand or 429 quota), try gemini-3.1-flash-lite
    if (!response && selectedModel !== "gemini-3.1-flash-lite") {
      try {
        console.log(`Primary model (${selectedModel}) unavailable, falling back to gemini-3.1-flash-lite...`);
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents,
          config: baseConfig,
        });
        if (response) {
          selectedModel = "gemini-3.1-flash-lite";
          usedSearchGrounding = false;
        }
      } catch (fallbackModelErr: any) {
        lastErrorDetails = fallbackModelErr?.message || lastErrorDetails;
        console.warn("Fallback to gemini-3.1-flash-lite also failed:", lastErrorDetails);
      }
    }

    // 4. If Gemini generation succeeded, format and return response
    if (response && response.text) {
      const candidate = response.candidates?.[0];
      const rawGrounding = candidate?.groundingMetadata;
      let sources: { title: string; uri: string }[] = [];
      let searchQueries: string[] = [];

      if (rawGrounding) {
        if (Array.isArray(rawGrounding.webSearchQueries)) {
          searchQueries = rawGrounding.webSearchQueries;
        }
        if (Array.isArray(rawGrounding.groundingChunks)) {
          sources = rawGrounding.groundingChunks
            .map((chunk: any) => chunk.web ? { title: chunk.web.title || "Web Reference", uri: chunk.web.uri || "" } : null)
            .filter((item: any) => item !== null && item.uri.length > 0);
        }
      }

      return res.json({
        reply: response.text,
        modelUsed: selectedModel,
        rolePersona,
        isOfflineFallback: false,
        hasApiKey: true,
        groundingMetadata: {
          sources,
          searchQueries,
          hasSearchGrounding: usedSearchGrounding,
        },
      });
    }

    // 5. If Gemini API was unreachable or exceeded rate limits, determine error category
    if (lastErrorDetails) {
      const errStr = lastErrorDetails.toLowerCase();
      if (errStr.includes("429") || errStr.includes("resource_exhausted") || errStr.includes("quota")) {
        errorCategory = "QUOTA_EXHAUSTED";
      } else if (errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("high demand")) {
        errorCategory = "HIGH_DEMAND";
      } else if (errStr.includes("401") || errStr.includes("403") || errStr.includes("api key") || errStr.includes("permission")) {
        errorCategory = "AUTH_ERROR";
      } else if (errStr.includes("timeout") || errStr.includes("deadline")) {
        errorCategory = "TIMEOUT";
      } else {
        errorCategory = "API_ERROR";
      }
    }

    console.warn("Gemini API call failed; serving verified portfolio intelligence fallback. Reason:", errorCategory, lastErrorDetails);
    const fallbackReply = generatePortfolioFallback(lastUserMsg, rolePersona);
    const userFacingNote = `${fallbackReply}\n\n*(Note: Live Gemini API busy; served response from Rick's verified portfolio intelligence. Reach Rick directly at [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com))*`;

    return res.json({
      reply: userFacingNote,
      modelUsed: selectedModel,
      rolePersona,
      isOfflineFallback: true,
      hasApiKey: Boolean(apiKey),
      errorType: errorCategory,
      errorDetail: lastErrorDetails,
      groundingMetadata: {
        sources: [],
        searchQueries: [],
        hasSearchGrounding: false,
      },
    });
  } catch (fatalErr: any) {
    console.error("Fatal /api/chat error:", fatalErr);
    const fallbackReply = generatePortfolioFallback("overview", "general");
    return res.status(200).json({
      reply: `${fallbackReply}\n\n*(Note: Temporary server processing error. Rick is available at [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com))*`,
      modelUsed: "gemini-3.1-flash-lite",
      rolePersona: "general",
      isOfflineFallback: true,
      errorType: "INTERNAL_ERROR",
      errorDetail: fatalErr?.message || "Server exception",
      groundingMetadata: {
        sources: [],
        searchQueries: [],
        hasSearchGrounding: false,
      },
    });
  }
});

// API Gateway Catch-All: ensures NO /api/* call ever responds with HTML 404
app.all("/api/*", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Rick Barat Portfolio API Gateway",
    endpoint: req.path,
    supportedEndpoints: ["/api/chat", "/api/portfolio-chat", "/api/chat/handshake", "/api/health"],
  });
});

// Start Server with Vite Dev or Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
