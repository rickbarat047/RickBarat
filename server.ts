import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Resilient Offline Portfolio Knowledge Engine
function generatePortfolioFallback(query: string, persona: string): string {
  const q = query.toLowerCase();

  if (q.includes("project") || q.includes("build") || q.includes("work") || q.includes("client") || q.includes("portfolio")) {
    return `### Rick Barat's Featured Engineering Projects & Client Work:

Over **6+ years of engineering experience**, Rick has shipped **35+ production applications** across 3D WebGL, distributed systems, and modern web architectures:

1. **3D Product Visualizers & WebGL Configurators (2024–Present)**
   - **Clients:** Indian D2C Brands & Global E-Commerce
   - **Stack:** Three.js, React Three Fiber, GLSL Shaders, Draco Compression, Razorpay/UPI Checkout.
   - **Impact:** Drove a verified **3.4x conversion lift** with real-time material switches and 60fps browser rendering.

2. **Distributed Telemetry & Flamegraph Systems (2023–2024)**
   - **Company:** Synapse Cloud Systems (US)
   - **Stack:** React, TypeScript, Next.js, Go, WebSockets, HTML5 Canvas.
   - **Impact:** Engineered custom canvas flamegraphs parsing **500,000 trace spans at 60fps** while maintaining **98+ Lighthouse scores**.

3. **Bespoke 3D Luxury & Interactive Experiences (2022–2023)**
   - **Agencies:** Studio Kroma & Apex Interactive
   - **Stack:** React Three Fiber, GSAP timeline choreography, custom post-processing shaders.
   - **Impact:** Delivered 14+ immersive experiences for luxury real estate and global creative brands.

4. **Scalable Design Systems & Platforms (2020–2022)**
   - **Company:** NextWave Digital Tech
   - **Stack:** React, Next.js, TypeScript, Tailwind CSS, Node.js.
   - **Impact:** Shipped 20+ responsive web platforms and reusable component libraries.

*Feel free to explore the interactive 3D Lab and projects on this page, or connect with Rick at **rickbarat21@gmail.com**.*`;
  }

  if (q.includes("education") || q.includes("degree") || q.includes("college") || q.includes("university") || q.includes("school") || q.includes("bca") || q.includes("techno")) {
    return `### Rick Barat's Educational Background:

- **Degree:** Bachelor of Computer Applications (**BCA**)
- **Institution:** **Techno India University**, Kolkata, India
- **Focus:** Data Structures & Algorithms, Object-Oriented Software Design, Distributed Computing, Computer Graphics, and Database Management Systems.
- **Self-Directed Mastery:** Extensive specialized study in WebGL, Three.js shaders, GLSL, Go concurrent pipelines, and modern TypeScript architecture.

Rick pairs formal computer science foundations with over **6 years of hands-on production engineering** and 35+ shipped products.`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("languages") || q.includes("three.js") || q.includes("webgl")) {
    return `### Rick Barat's Core Technical Stack & Specializations:

1. **3D & Creative Web Engineering:**
   - Three.js, React Three Fiber (R3F), GLSL custom shaders, Draco 3D mesh compression, PBR material workflows, GSAP scroll choreography.
2. **Frontend Architecture:**
   - React 19, TypeScript, Next.js, Tailwind CSS, HTML5 Canvas, Web Audio API, responsive UI design systems.
3. **Backend & Scalable APIs:**
   - Node.js, Express, Go (Golang), PostgreSQL, Redis pub/sub caching, WebSockets for low-latency live telemetry.
4. **AI & Agent Integrations:**
   - Google Gemini API, LangChain, vector embeddings, client-server proxy architectures.

All applications are built with strict focus on zero-lag 60fps rendering, accessibility, and high conversion impact.`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("available") || q.includes("rate") || q.includes("instagram") || q.includes("resume")) {
    return `### Get in Touch with Rick Barat:

Rick is actively open for **full-time senior engineering roles**, **remote worldwide contracts**, and **bespoke 3D WebGL consultancy**.

- **Email:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)
- **Instagram:** [@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)
- **Location:** India & Remote Worldwide (IST timezone, UTC+5:30)
- **Typical Turnaround:** Replies within 24 hours.

You can also download Rick's full verified resume using the **Resume** button in the navigation bar.`;
  }

  if (persona === "recruiter") {
    return `### Candidate Summary for Recruiters & Hiring Managers:

- **Candidate:** Rick Barat
- **Roles:** Senior Full Stack Engineer, Frontend Lead, 3D WebGL / Creative Developer.
- **Experience:** 6+ years of production experience shipping 35+ products for US tech companies, Indian D2C enterprises, and international creative agencies.
- **Education:** Bachelor of Computer Applications (BCA) from Techno India University, Kolkata.
- **Strengths:** Rapid end-to-end prototyping, 60fps WebGL optimization, clean TypeScript architecture, and autonomous delivery.
- **Direct Contact:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)`;
  }

  return `### Hello! I am Rick Barat's AI Portfolio Assistant.

I have complete knowledge of Rick's **6+ years of full-stack engineering**, **3D WebGL projects for Indian & global brands**, **BCA degree from Techno India University, Kolkata**, and his full technical stack (Three.js, React 19, TypeScript, Go, Node.js).

**What would you like to know?**
- **Projects & Client Work:** Inquire about his 3D product visualizers, WebGL configurators, or Synapse telemetry dashboards.
- **Technical Skills:** Ask about his Three.js shader pipelines, React 19 architecture, or backend systems.
- **Hiring & Availability:** Learn about his availability for full-time roles, contracts, and consultancy.

Feel free to ask any question or email Rick directly at **rickbarat21@gmail.com**!`;
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
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Chatbot Initial Handshake & Diagnostics Endpoint
app.get("/api/chat/handshake", (_req, res) => {
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

// Chatbot API Endpoint with Google Search Grounding & Resilient Fallback
app.post("/api/chat", async (req, res) => {
  try {
    const { 
      messages, 
      model = "gemini-3.1-flash-lite", 
      rolePersona = "general", 
      searchGrounding = false 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array" });
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
        console.warn("Search grounding tool failed (likely quota or tier limit). Retrying without Google Search tool:", lastErrorDetails);
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
          console.error("Direct model generation retry also failed:", lastErrorDetails);
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
        console.error("Direct model generation failed:", lastErrorDetails);
        response = null;
      }
    }

    // 3. If Gemini generation succeeded, format and return response
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

    // 4. If Gemini API was unreachable or exceeded rate limits, determine error category
    if (lastErrorDetails) {
      const errStr = lastErrorDetails.toLowerCase();
      if (errStr.includes("429") || errStr.includes("resource_exhausted") || errStr.includes("quota")) {
        errorCategory = "QUOTA_EXHAUSTED";
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
    const userFacingNote = `${fallbackReply}\n\n*(Note: Live Gemini API limit reached; served response from Rick's verified portfolio intelligence. Reach Rick directly at [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com))*`;

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
