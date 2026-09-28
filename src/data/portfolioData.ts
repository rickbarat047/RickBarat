import { Project, SkillCategory, Experience } from '../types';

export const PERSONAL_INFO = {
  name: "Rick Barat",
  preferredName: "Rick",
  title: "Independent Developer & AI Builder",
  headline: "Building digital experiences, AI systems & tools that feel different.",
  subtitle: "Independent developer focused on modern web experiences, AI-powered applications and automation.",
  tagline: "I don't just know technologies. I build things.",
  email: "rickbarat21@gmail.com",
  location: "West Bengal, India",
  timezone: "IST (UTC+5:30)",
  status: "Available for projects",
  education: {
    degree: "BCA (Bachelor of Computer Applications)",
    institution: "Techno India University",
    status: "Graduate"
  },
  primaryFocus: [
    "Web Development",
    "AI Applications",
    "AI Automation",
    "Creative Digital Experiences",
    "Developer Tools"
  ],
  socials: {
    github: "https://github.com/rickbarat",
    instagram: "https://www.instagram.com/rickbarat047/?hl=en",
    discord: "https://discord.com"
  },
  bio: "I'm Rick Barat — a BCA graduate and independent developer from West Bengal. I enjoy turning ideas into interactive websites, useful tools and AI-powered systems."
};

export const WHAT_I_BUILD = [
  {
    number: "01",
    title: "WEB EXPERIENCES",
    description: "Modern responsive websites, fluid typography, and tactile interactive interfaces designed to feel immediate and memorable.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Motion"]
  },
  {
    number: "02",
    title: "AI & AUTOMATION",
    description: "AI-powered workflows, structured LLM generation, content synthesis systems, and automated webhook pipelines.",
    technologies: ["Gemini API", "Google AI Studio", "n8n", "Ollama", "APIs & Webhooks"]
  },
  {
    number: "03",
    title: "DIGITAL TOOLS",
    description: "Useful client-side utilities, hardware calculators, developer tooling, and productivity applications built for daily utility.",
    technologies: ["React", "TypeScript", "State Engines", "Browser APIs"]
  },
  {
    number: "04",
    title: "CREATIVE TECHNOLOGY",
    description: "Experiments combining clean design, physics, shaders, audio synthesis, and interactive sandboxes that push browser boundaries.",
    technologies: ["Canvas 2D", "WebGL", "Web Audio API", "Mathematical Motion"]
  }
];

export const CURRENTLY_BUILDING = [
  {
    id: "building-autotube",
    name: "AutoTube",
    category: "AI & Automation",
    description: "AI-powered content automation platform streamlining YouTube ideation, script structuring, and metadata generation.",
    status: "In Development",
    stack: ["Next.js", "Gemini API", "n8n", "Tailwind CSS"],
    pulseColor: "bg-amber-400"
  },
  {
    id: "building-pctoolkit",
    name: "PC Toolkit",
    category: "Digital Tools",
    description: "Interactive PC building & hardware utility for socket compatibility, dynamic power calculation, and bottleneck checks.",
    status: "Active Development",
    stack: ["React", "TypeScript", "Hardware Rules Engine"],
    pulseColor: "bg-emerald-400"
  },
  {
    id: "building-localai",
    name: "Local AI & Agent Workflows",
    category: "AI Exploration",
    description: "Testing local LLM execution using Ollama, structured function calling, and deterministic tool loops.",
    status: "Prototyping",
    stack: ["Ollama", "Python FastMCP", "Gemini 2.5", "Webhooks"],
    pulseColor: "bg-blue-400"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "autotube",
    title: "AutoTube",
    tagline: "AI-Powered YouTube Content Automation Platform",
    category: "ai-systems",
    featured: true,
    year: "2025 - 2026",
    status: "In Development",
    tags: ["React / Next.js", "Gemini API", "n8n", "Python", "Tailwind CSS"],
    description: "An end-to-end automation platform that transforms raw ideas, research articles, and prompts into structured YouTube scripts, visual breakdowns, and optimized video metadata.",
    longDescription: "AutoTube is an automated content pipeline built for video creators and content teams. It automates repetitive pre-production tasks: analyzing trending angles, drafting calibrated conversational scripts, structuring timestamped b-roll cues, and generating SEO-optimized titles, descriptions, and tag sets.",
    whatIsIt: "AutoTube is an AI-powered content automation platform engineered to streamline video ideation, scriptwriting, and production staging.",
    problem: "Creators and small media teams spend 4-8 hours per video researching topics, formatting scripts, and planning visual pacing before touching a camera or editing timeline.",
    approach: "Built a structured multi-step generation pipeline utilizing the Gemini API with strict JSON schema outputs, orchestrated with n8n webhook triggers to automate asset staging.",
    howItWorks: "1) Topic Analysis & Scripting via Gemini -> 2) Scene & Visual Breakdown generation -> 3) Automated SEO tags, titles, and thumbnail prompts generation -> 4) One-click export to content schedule.",
    keyFeatures: [
      "Automated multi-section script generation with tone and pacing calibration",
      "Segment-by-segment visual cues & b-roll suggestions",
      "High-CTR title variations and search-optimized description generator",
      "n8n webhook triggers for connecting to external production boards"
    ],
    solution: "Designed a deterministic prompting framework that breaks scriptwriting into distinct phases (Hook, Retention Arc, Core Argument, Climax, Outro), preventing repetitive AI phrasing.",
    architectureHighlights: [
      "Strict JSON output schemas ensuring predictable formatting across all script segments",
      "Asynchronous webhook queues via n8n for media scraping and metadata dispatch",
      "Responsive editorial dark-mode editor for real-time script adjustments"
    ],
    challenges: "Maintaining natural conversational cadence in generated scripts and preventing hallucinated technical facts in niche educational topics.",
    whatILearned: "Deep mastery of structured prompting, schema-constrained LLM generation, and how to chain webhook workflows for reliable multi-stage content creation.",
    githubUrl: "https://github.com/rickbarat",
    liveUrl: "https://rickbarat.vercel.app",
    image: "/src/assets/images/autotube_preview_1790611524328.jpg",
    demoType: "dashboard"
  },
  {
    id: "pc-toolkit",
    title: "PC Toolkit",
    tagline: "Interactive Hardware Utility & Custom PC Building Engine",
    category: "full-stack",
    featured: true,
    year: "2025",
    status: "Active Development",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite", "Hardware Engine"],
    description: "A fast, client-side web utility for PC builders to verify socket and clearance compatibility, compute dynamic TDP power budgets, and analyze component pairings.",
    longDescription: "PC Toolkit is an intuitive, ad-free hardware companion created for builders who want clean, instant feedback. Instead of sluggish, cluttered legacy calculators, it provides lightning-fast search, socket constraint validation, and real-time wattage headroom analysis.",
    whatIsIt: "PC Toolkit is an interactive PC building and hardware analysis tool built to make component compatibility and power budgeting intuitive, accessible, and fast.",
    problem: "Most hardware configuration websites are weighed down with heavy ads, outdated socket databases, slow page reloads, and cryptic error messages.",
    approach: "Engineered an in-browser relational hardware rules engine with client-side indexing, dynamic search filtering, and real-time TDP power curve visualization.",
    howItWorks: "Select a CPU or socket type -> engine automatically constrains compatible motherboards, RAM generations, and cooler brackets -> calculates transient spike margins and PSU recommendations.",
    keyFeatures: [
      "Zero-lag client-side socket, chipset, and form factor compatibility checking",
      "Dynamic power consumption calculator with transient headroom recommendations",
      "Bottleneck estimator comparing CPU and GPU throughput profiles",
      "Clean, shareable build manifests with component specifications"
    ],
    solution: "Constructed a normalized hardware database structure that evaluates dimensional clearances and PCIe lane configurations instantly on the client with zero network roundtrips.",
    architectureHighlights: [
      "Lightweight client-side hardware graph with immediate dependency resolution",
      "Dynamic wattage curve calculation accounting for overclocking and transient loads",
      "Accessible, keyboard-navigable component selector with rapid fuzzy search"
    ],
    challenges: "Handling edge cases in physical dimensions, such as GPU length clearance when front-mounted AIO radiators are installed in compact cases.",
    whatILearned: "How to design high-performance relational filtering on client state and translate technical hardware constraints into clean, human-friendly UX.",
    githubUrl: "https://github.com/rickbarat",
    liveUrl: "https://rickbarat.vercel.app",
    image: "/src/assets/images/pctoolkit_preview_1790611541450.jpg",
    demoType: "interactive-flow"
  },
  {
    id: "ai-lab-workflows",
    title: "AI Lab & Automation Workflows",
    tagline: "Multimodal Prompts, Local Models & Webhook Pipelines",
    category: "ai-systems",
    featured: true,
    year: "2025",
    status: "Active Research",
    tags: ["Gemini API", "Google AI Studio", "Ollama", "n8n", "TypeScript"],
    description: "An evolving suite of AI workflows, structured extraction pipelines, and automated agent experiments exploring what happens when code and LLMs collaborate.",
    longDescription: "A hands-on testing laboratory exploring the boundaries of modern developer AI: connecting Google AI Studio multimodal reasoning with local Ollama inference, building automated research scrapers, and integrating n8n webhooks for zero-touch digital operations.",
    whatIsIt: "A curated repository of practical AI experiments and automation workflows designed to solve actual developer productivity bottlenecks.",
    problem: "Generic AI chatbots require manual copy-pasting, fail at structured data extraction, and cannot easily trigger downstream software operations.",
    approach: "Combined developer APIs (Gemini, Ollama) with webhook automation platforms (n8n) to create reliable, event-driven pipelines that run autonomously.",
    howItWorks: "Events trigger webhook listener -> LLM processes input with strict JSON schema -> downstream service receives validated payload.",
    keyFeatures: [
      "Multimodal document & image analysis with structured JSON output",
      "Local model execution testing with Ollama (Llama 3, Mistral, Qwen)",
      "Automated digest generation from RSS and API feeds",
      "Reusable system prompt templates calibrated for code refactoring"
    ],
    solution: "Developed reusable workflow templates and schema guards that ensure high-reliability outputs regardless of whether models run in cloud or locally.",
    challenges: "Managing latency and resource constraints when running 7B-parameter models locally versus cloud APIs.",
    whatILearned: "Practical tradeoffs between local privacy-first inference and high-speed cloud reasoning models.",
    githubUrl: "https://github.com/rickbarat",
    liveUrl: "https://rickbarat.vercel.app",
    image: "/src/assets/images/ailab_preview_1790611557192.jpg",
    demoType: "dashboard"
  },
  {
    id: "krypton-ui",
    title: "Krypton UI & Creative Lab",
    tagline: "Tactile Web Components & Motion Experiments",
    category: "creative-ui",
    featured: true,
    year: "2024 - 2026",
    status: "Open Source",
    tags: ["React 19", "Tailwind CSS", "Motion", "Canvas 2D", "a11y"],
    description: "A laboratory of tactile web interactions, accessible UI primitives, physics-driven spring animations, and procedural canvas graphics.",
    longDescription: "Krypton explores creative engineering on the web: custom magnetic buttons, clip-path page transitions, sound-reactive feedback, procedural canvas particle meshes, and zero-pill typographic layouts.",
    whatIsIt: "A showcase of creative frontend engineering, fluid motion design, and accessible component architectures.",
    problem: "Web interfaces often look either bland and template-like, or overly flashy with poor performance and inaccessible controls.",
    approach: "Pair modern spring physics and compositor-only CSS transformations with strict WAI-ARIA standards and lightweight math.",
    howItWorks: "High-performance React components built with Motion and HTML5 Canvas, using requestAnimationFrame for smooth 60fps rendering.",
    keyFeatures: [
      "Physics-based magnetic button controls with smooth cursor attraction",
      "Dynamic clip-path screen wipe overlays with zero layout shift",
      "Interactive 2D particle mesh responding to mouse gravitational fields",
      "Zero-pill metadata styling adhering to modern typographic discipline"
    ],
    solution: "Adhered strictly to compositor-only transforms (transform, opacity) to ensure buttery smooth performance even on low-powered mobile devices.",
    challenges: "Balancing playful interaction with accessibility and touch device ergonomics.",
    whatILearned: "How to use math, spring dynamics, and subtle audio cues to make digital software feel physical and responsive.",
    githubUrl: "https://github.com/rickbarat",
    liveUrl: "https://rickbarat.vercel.app",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    demoType: "canvas"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    name: "FRONTEND",
    iconName: "Layout",
    description: "Building responsive, tactile, and high-performance interfaces with modern component architectures.",
    skills: [
      { name: "React", usedIn: "AutoTube, PC Toolkit, Krypton UI" },
      { name: "JavaScript", usedIn: "Core Web Applications" },
      { name: "HTML", usedIn: "Semantic Web Structure" },
      { name: "CSS", usedIn: "Styling & Responsive Layouts" },
      { name: "Tailwind", usedIn: "AutoTube, PC Toolkit, Krypton UI" },
      { name: "Vite", usedIn: "Fast Development & Bundling" },
      { name: "TypeScript", usedIn: "Type-Safe Architecture" }
    ]
  },
  {
    id: "ai",
    name: "AI",
    iconName: "Cpu",
    description: "Integrating LLMs, prompt engineering, multimodal reasoning, and autonomous agent loops.",
    skills: [
      { name: "Gemini", usedIn: "AutoTube & AI Lab" },
      { name: "Google AI Studio", usedIn: "Prompt Optimization & Multimodal Experiments" },
      { name: "Ollama", usedIn: "Local LLM Inference Experiments" },
      { name: "LLM APIs", usedIn: "Structured Generation & Extraction" }
    ]
  },
  {
    id: "automation",
    name: "AUTOMATION",
    iconName: "Server",
    description: "Connecting disparate platforms, orchestrating pipelines, and removing manual workflows.",
    skills: [
      { name: "n8n", usedIn: "AutoTube Content Staging Pipeline" },
      { name: "APIs", usedIn: "REST Integrations & Data Ingestion" },
      { name: "Webhooks", usedIn: "Event-Driven Automation Pipelines" }
    ]
  },
  {
    id: "tools",
    name: "TOOLS",
    iconName: "Database",
    description: "Modern developer workflow tools, version control, and cloud deployment pipelines.",
    skills: [
      { name: "Git", usedIn: "Version Control & Branching" },
      { name: "GitHub", usedIn: "Repository Management & Collaboration" },
      { name: "Vercel", usedIn: "Production Hosting & Edge Deploys" },
      { name: "VS Code", usedIn: "Primary Engineering Environment" }
    ]
  }
];

export const AI_LAB_EXPERIMENTS = [
  {
    id: "exp-autotube",
    category: "Content Systems & AI",
    title: "AutoTube Scripting Engine",
    description: "Automated generation of multi-part video scripts with tone calibration, visual shot lists, and retention pacing.",
    status: "In Development",
    tool: "Gemini 2.5 + n8n",
    highlight: "Structured JSON schema output"
  },
  {
    id: "exp-ollama",
    category: "Local AI & Privacy",
    title: "Ollama Local LLM Playground",
    description: "Running quantized models locally for offline code review, summarization, and private data handling.",
    status: "Active Experiment",
    tool: "Ollama / Llama 3",
    highlight: "Zero cloud API dependencies"
  },
  {
    id: "exp-multimodal",
    category: "Generative AI",
    title: "AI Studio Multimodal Lab",
    description: "Testing complex visual and audio inputs with Gemini models to extract structured data and diagram descriptions.",
    status: "Active Experiment",
    tool: "Google AI Studio",
    highlight: "Image-to-code extraction"
  },
  {
    id: "exp-n8n-pipeline",
    category: "Automation Workflows",
    title: "n8n Event-Driven Orchestration",
    description: "Webhook-triggered pipelines that ingest external updates, synthesize summaries, and dispatch alerts.",
    status: "Production Pipeline",
    tool: "n8n + Webhooks",
    highlight: "Autonomous task execution"
  },
  {
    id: "exp-procedural-canvas",
    category: "Creative Technology",
    title: "Procedural Canvas & Shaders",
    description: "Mathematical simulations reacting to cursor gravitational fields, fluid velocity, and interactive frequencies.",
    status: "Interactive",
    tool: "Canvas 2D / WebGL",
    highlight: "Pure math at 60fps"
  }
];

export const LAB_EXPERIMENTS = AI_LAB_EXPERIMENTS;

export const TESTIMONIALS: any[] = [];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-bca",
    role: "BCA (Bachelor of Computer Applications)",
    company: "Techno India University",
    location: "West Bengal, India",
    period: "Graduated",
    type: "Full-time",
    description: "Formal computer science foundation covering data structures, object-oriented programming, database management, computer networks, and web engineering.",
    deliverables: [
      "Rigorous coursework in relational databases, algorithms, and software engineering principles.",
      "Developed web applications and practical software tools during degree projects.",
      "Cultivated deep independent focus on modern JavaScript/TypeScript, React ecosystems, and modern AI tools."
    ],
    techStack: ["Java", "C++", "JavaScript", "SQL", "HTML/CSS", "Data Structures"],
    metrics: "Techno India University — BCA Degree"
  },
  {
    id: "exp-independent",
    role: "Independent Developer & AI Builder",
    company: "Rick Barat (Independent)",
    location: "West Bengal, India & Remote",
    period: "Present",
    type: "Open Source",
    description: "Designing and building production web applications, automation pipelines, hardware utilities, and AI-powered systems.",
    deliverables: [
      "Building AutoTube: AI-driven content automation platform with Gemini and n8n webhooks.",
      "Engineering PC Toolkit: interactive PC building utility and hardware compatibility engine.",
      "Experimenting in AI Lab: prompt engineering, local LLM execution with Ollama, and creative web development."
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "n8n", "Vite", "Git"],
    metrics: "Multiple active applications in development"
  }
];
