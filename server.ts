import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
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

// Chatbot API Endpoint with Google Search Grounding
app.post("/api/chat", async (req, res) => {
  try {
    const { 
      messages, 
      model = "gemini-3.5-flash", 
      rolePersona = "general", 
      searchGrounding = true 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array" });
    }

    // Model selection validation based on requirements
    // Use gemini-3.5-flash (with googleSearch tool)
    const validModels = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
    const selectedModel = validModels.includes(model) ? model : "gemini-3.5-flash";

    const systemInstruction = ROLE_INSTRUCTIONS[rolePersona] || ROLE_INSTRUCTIONS.general;

    // Convert multi-turn history into the required Gemini contents format
    const contents = messages.map((msg: { role: string; content?: string; text?: string }) => {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      const text = msg.content || msg.text || "";
      return {
        role,
        parts: [{ text }],
      };
    });

    const ai = getGeminiClient();

    // Prepare config with Google Search Grounding tool
    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    // Add Google Search grounding if requested (supported on gemini-3.5-flash)
    if (searchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const replyText = response.text || "I apologize, but I couldn't generate a response at this time.";

    // Extract search grounding metadata if present
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
      reply: replyText,
      modelUsed: selectedModel,
      rolePersona,
      groundingMetadata: {
        sources,
        searchQueries,
        hasSearchGrounding: Boolean(searchGrounding),
      },
    });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    const errorMessage = error?.message || "Internal server error while processing AI chat";
    return res.status(500).json({
      error: errorMessage,
      reply: "I encountered an issue connecting to the AI brain. Please verify your connection or reach out to Rick directly at rickbarat21@gmail.com.",
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
