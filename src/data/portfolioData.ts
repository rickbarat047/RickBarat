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
    id: "munjoy-pickles",
    title: "Munjoy Pickles",
    tagline: "Artisanal Indian Pickles | Handcrafted Homemade Flavours",
    category: "full-stack",
    featured: true,
    year: "2026",
    status: "Live",
    tags: ["Vite"],
    description: "A storefront for small-batch artisanal Indian pickles made with traditional recipes and cold-pressed oils.",
    longDescription: "MUNJOY is a brand storefront for artisanal Indian pickles, presenting handcrafted flavours, heritage recipes, and a curated product collection.",
    whatIsIt: "A live storefront showcasing handcrafted Indian pickles made in small batches with traditional recipes.",
    problem: "Traditional homemade pickle makers need a modern, trustworthy online presence to reach today's customers.",
    approach: "Built a responsive, editorial storefront highlighting product collections, brand story, and direct purchase links.",
    keyFeatures: [
      "Small-batch pickle collections",
      "Heritage recipe storytelling",
      "Direct online purchase flow"
    ],
    solution: "A clean, mobile-friendly storefront that brings traditional Indian pickle-making to a modern audience.",
    liveUrl: "https://munjoypickles-zeta.vercel.app",
    image: "/src/assets/images/munjoy_preview.png",
    demoType: "interactive-flow"
  },
  {
    id: "the-fashion-hub",
    title: "The Fashion Hub",
    tagline: "Curated Women's Fashion",
    category: "full-stack",
    featured: true,
    year: "2026",
    status: "Live",
    tags: ["Vite"],
    description: "A curated edit of effortlessly stylish women's fashion and ethnic wear, handpicked by creators with direct affiliate links to Meesho.",
    longDescription: "The Fashion Hub presents a curated collection of women's fashion and ethnic wear, with verified listing photos and direct affiliate links.",
    whatIsIt: "A curated fashion storefront surfacing handpicked women's wear with direct links to Meesho listings.",
    problem: "Shoppers need a clean, curated destination for affordable women's fashion instead of browsing cluttered marketplaces.",
    approach: "Built a fast, visual browsing experience with category filters, saved items, and direct affiliate checkout links.",
    keyFeatures: [
      "Curated women's fashion and ethnic wear",
      "Category-based browsing",
      "Direct Meesho affiliate links",
      "Saved items"
    ],
    solution: "A focused, mobile-friendly catalogue that connects shoppers directly to verified product listings.",
    liveUrl: "https://the-fashion-hub-store.vercel.app",
    image: "/src/assets/images/fashionhub_preview.png",
    demoType: "interactive-flow"
  },
  {
    id: "vesper-studio",
    title: "Vesper Studio",
    tagline: "Turn Your Product Into a Campaign",
    category: "ai-systems",
    featured: true,
    year: "2026",
    status: "Live",
    tags: ["Next.js"],
    description: "AI product advertising studio that turns product photos into realistic AI model videos, product ads, and social-first content for brands.",
    longDescription: "VESPER creates realistic AI model videos, product ads, and social-first content for brands, transforming a product photo into a full campaign.",
    whatIsIt: "An AI-assisted product advertising studio offering model videos, product ads, and social content for brands.",
    problem: "Brands need high-quality product campaigns but traditional shoots are expensive and slow.",
    approach: "Combine AI model generation with human creative direction to produce social-ready product videos from a single product.",
    keyFeatures: [
      "AI model videos for product brands",
      "Category-based ad previews",
      "Before/after product-to-campaign transformation",
      "Brand campaign enquiries"
    ],
    solution: "A studio site that showcases AI-generated product campaigns and invites brands to commission videos.",
    liveUrl: "https://vesper-studio-gamma.vercel.app",
    image: "/src/assets/images/vesper_preview.png",
    demoType: "dashboard"
  },
  {
    id: "storeflow",
    title: "StoreFlow",
    tagline: "Invoice to Inventory",
    category: "full-stack",
    featured: true,
    year: "2026",
    status: "Live",
    tags: ["Next.js", "Gemini", "Supabase"],
    description: "B2B SaaS for electronics retailers: upload supplier invoices, extract with AI, review, approve, and update inventory with IMEI/serial tracking.",
    longDescription: "StoreFlow reads supplier invoices with server-side AI, shows every field with confidence, blocks duplicate IMEIs, posts stock movements on approval, and exports to Excel.",
    whatIsIt: "A B2B SaaS tool that converts supplier invoices into verified inventory updates for electronics retailers.",
    problem: "Electronics retailers waste time manually transcribing supplier invoices and risk duplicate IMEI entries.",
    approach: "Use server-side Gemini extraction into strict JSON, human review with confidence badges, and approval-gated stock movements.",
    keyFeatures: [
      "AI invoice extraction from PDFs and photos",
      "Confidence badges and validation",
      "Duplicate IMEI/serial blocking",
      "Inventory and Excel export"
    ],
    solution: "A review-first workflow that turns invoices into accurate, auditable inventory updates.",
    liveUrl: "https://storeflow-lilac.vercel.app",
    image: "/src/assets/images/storeflow_preview.png",
    demoType: "dashboard"
  },
  {
    id: "leadpilot",
    title: "LeadPilot",
    tagline: "Turn missed leads into booked customers",
    category: "ai-systems",
    featured: true,
    year: "2026",
    status: "Live",
    tags: ["Next.js"],
    description: "Lead recovery and booking automation that instantly responds to new leads, follows up automatically, qualifies prospects, and books appointments.",
    longDescription: "LeadPilot responds to new leads instantly, automates follow-ups, qualifies prospects, and books appointments for service businesses.",
    whatIsIt: "An automation platform for service businesses to recover missed leads and book appointments.",
    problem: "Service businesses lose customers because they reply too late to incoming leads.",
    approach: "Automate instant responses, follow-ups, qualification, and appointment booking while keeping humans in control.",
    keyFeatures: [
      "Instant lead response",
      "Automated follow-ups",
      "Prospect qualification",
      "Appointment booking",
      "UPI Autopay billing"
    ],
    solution: "A follow-up engine that runs the shift businesses never had time for.",
    liveUrl: "https://leadpilot-sepia-six.vercel.app",
    image: "/src/assets/images/leadpilot_preview.png",
    demoType: "dashboard"
  },
  {
    id: "jobpilot-ai",
    title: "JobPilot AI",
    tagline: "Autonomous job hunting for India",
    category: "ai-systems",
    featured: true,
    year: "2026",
    status: "In Progress",
    tags: ["Next.js", "TypeScript", "Supabase"],
    description: "An AI-powered job hunting assistant for India that discovers opportunities, prepares applications, and tracks progress from CV to interview.",
    longDescription: "JobPilot AI finds opportunities, prepares applications, and helps job seekers get closer to their next offer, with encrypted credentials and approval-first submissions.",
    whatIsIt: "An autonomous career agent for Indian students and early-career engineers.",
    problem: "Job seekers spend hours searching, tailoring applications, and tracking opportunities manually.",
    approach: "Parse a CV, discover matching roles, prepare applications, and require approval before submission.",
    keyFeatures: [
      "CV-based job discovery",
      "Application preparation",
      "Approval-first submissions",
      "Encrypted credentials",
      "Privacy-first data handling"
    ],
    solution: "A calm, background-running career agent that keeps the user as decision maker.",
    githubUrl: "https://github.com/rickbarat047/job-pilot",
    liveUrl: "https://jobpilot-ai-sand.vercel.app",
    image: "/src/assets/images/jobpilot_preview.png",
    demoType: "dashboard"
  },
  {
    id: "autotube",
    title: "AutoTube",
    tagline: "Autonomous YouTube Automation Platform",
    category: "ai-systems",
    featured: true,
    year: "2025 - 2026",
    status: "In Progress",
    tags: ["Next.js", "React", "Gemini API"],
    description: "An autonomous YouTube automation platform for viral topic discovery, competitor analysis, scriptwriting, voiceover, scene editing, thumbnails, SEO, and channel publishing.",
    longDescription: "AutoTube automates the YouTube content pipeline from trend discovery through script generation, voiceover, editing, thumbnails, SEO, and publishing.",
    whatIsIt: "An end-to-end YouTube automation platform that turns trends into publish-ready videos.",
    problem: "Creators spend hours researching, scripting, and producing videos before publishing.",
    approach: "Chain AI agents for trend research, strategy, scripting, voiceover, editing, thumbnails, and SEO with a human-in-the-loop dashboard.",
    keyFeatures: [
      "Viral topic and trend discovery",
      "Competitor analysis",
      "AI script generation",
      "Voiceover and auto-editing",
      "Thumbnail and SEO generation",
      "Channel publishing controls"
    ],
    solution: "A dashboard-driven pipeline that automates YouTube pre-production and publishing.",
    githubUrl: "https://github.com/rickbarat047/Auto-Tube-.ai",
    liveUrl: "https://autotube-tau.vercel.app",
    image: "/src/assets/images/autotube_preview_new.png",
    demoType: "dashboard"
  },
  {
    id: "autotube-studio",
    title: "AutoTube Studio",
    tagline: "Automated Kids Story Animation System",
    category: "ai-systems",
    featured: true,
    year: "2026",
    status: "In Progress",
    tags: ["Vite", "React", "Express", "Gemini API"],
    description: "A production-grade automated AI animation pipeline and YouTube publishing studio for high-quality children's storytelling.",
    longDescription: "AutoTube Studio automates children's story animation production with idea scoring, persistent character bibles, multi-plane rendering, procedural audio, and quality control.",
    whatIsIt: "An automated AI animation and publishing studio for children's storytelling channels.",
    problem: "Producing high-retention children's animated stories requires repetitive manual work across ideation, animation, and publishing.",
    approach: "Automate idea scoring, character consistency, rendering, audio synthesis, and quality control in a single pipeline.",
    keyFeatures: [
      "9-factor idea scoring",
      "Persistent character bibles",
      "Multi-plane animated rendering",
      "Procedural sound and speech synthesis",
      "6-dimension automated quality control"
    ],
    solution: "A pipeline that produces and publishes children's animated stories with minimal manual effort.",
    githubUrl: "https://github.com/rickbarat047/newtube-automation",
    liveUrl: "https://newtube-automation-zeta.vercel.app",
    image: "/src/assets/images/newtube_preview.png",
    demoType: "dashboard"
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
