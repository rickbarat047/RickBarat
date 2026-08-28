import { Project, SkillCategory, Experience, Testimonial } from '../types';

export const PERSONAL_INFO = {
  name: "Rick Barat",
  preferredName: "Rick",
  title: "Full Stack Engineer & Creative Technologist",
  tagline: "Architecting high-performance web systems, distributed backends, and tactile digital experiences.",
  email: "rickbarat21@gmail.com",
  location: "India & Remote Worldwide",
  timezone: "IST (UTC+5:30)",
  status: "Available for Full-time Roles & Strategic Contracts",
  yearsOfExp: "6+",
  completedProjects: "35+",
  usersServed: "1.5M+",
  uptimeRecord: "99.98%",
  socials: {
    github: "https://github.com",
    instagram: "https://www.instagram.com/rickbarat047/?hl=en",
    discord: "https://discord.com"
  },
  bio: "I'm a Full-Stack Engineer with a deep passion for the intersection of robust distributed systems, AI workflow automation, and fluid, intuitive user interfaces. I specialize in building zero-lag web applications, modular micro-frontends, and highly scalable API layers that elevate product value."
};

export const PROJECTS: Project[] = [
  {
    id: "nexus-stream",
    title: "NexusStream",
    tagline: "Ultra-low-latency Collaborative Canvas & CRDT Engine",
    category: "full-stack",
    featured: true,
    year: "2026",
    tags: ["TypeScript", "WebSockets", "CRDT (Yjs)", "React", "Rust / Wasm", "Redis"],
    metrics: [
      { label: "Sub-15ms", value: "Realtime Sync" },
      { label: "50k+", value: "Concurrent Users" },
      { label: "60 FPS", value: "Infinite Canvas" }
    ],
    description: "Distributed real-time collaboration canvas with state synchronization via Conflict-free Replicated Data Types (CRDTs) and high-performance WebGL rendering.",
    longDescription: "NexusStream bridges the gap between complex graphic pipelines and distributed multiplayer collaboration. Built with custom WebGL shaders and an optimized Rust-compiled WebAssembly differential engine, it delivers zero-conflict multi-cursor editing, infinite vector nodes, and instant spatial playback.",
    problem: "Traditional socket-based canvases suffer from severe race conditions and document collision when more than a dozen collaborators edit simultaneously across high latency global connections.",
    solution: "Designed a multi-tier CRDT state tree layered over WebSockets with optimistic client-side execution, spatial indexing, and delta compression for resilient offline-first recovery.",
    architectureHighlights: [
      "Optimized Yjs document partitioning over distributed Redis Pub/Sub channels",
      "Custom WebGL 2.0 batching renderer maintaining steady 60fps with 10,000+ vector paths",
      "Adaptive binary delta-wire serialization reducing payload size by 78%"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/nexus-stream",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    demoType: "interactive-flow"
  },
  {
    id: "omniflow-ai",
    title: "OmniFlow AI",
    tagline: "Autonomous Multi-Agent Workflow Engine & Execution Graph",
    category: "ai-systems",
    featured: true,
    year: "2025 - 2026",
    tags: ["Gemini 2.5", "TypeScript", "Next.js", "Python FastMCP", "PostgreSQL", "Tailwind"],
    metrics: [
      { label: "4.8x", value: "Execution Speedup" },
      { label: "99.4%", value: "Tool Call Accuracy" },
      { label: "120+", value: "Native Integrations" }
    ],
    description: "Visual node-based agent orchestration orchestrator capable of planning, self-debugging, executing multi-step API workflows, and streaming real-time artifacts.",
    longDescription: "OmniFlow AI transforms complex enterprise developer workflows into autonomous, self-healing execution graphs. It connects LLM reasoning engines with deterministic code sandboxes, allowing teams to automate data pipelines, continuous integration triage, and dynamic reporting.",
    problem: "Most AI workflow tools are rigid prompt wrappers that hallucinate during multi-step execution and fail abruptly on unhandled schema shifts.",
    solution: "Built a topological graph runner with deterministic retry loops, strict JSON schema validation gateways, and streaming human-in-the-loop verification checkpoints.",
    architectureHighlights: [
      "Interactive React Flow execution canvas with real-time token and step cost inspection",
      "Server-Sent Events (SSE) streaming protocol for sub-50ms token and tool feedback",
      "Sandboxed dynamic evaluator with cryptographic audit logs and role-based policies"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/omniflow",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    demoType: "dashboard"
  },
  {
    id: "aether-cloud",
    title: "Aether Cloud",
    tagline: "Serverless Edge Telemetry & Distributed Observability",
    category: "cloud-infra",
    featured: true,
    year: "2025",
    tags: ["Go", "ClickHouse", "eBPF", "React", "D3.js", "OpenTelemetry"],
    metrics: [
      { label: "1.2M", value: "Events / Second" },
      { label: "100%", value: "eBPF Zero Overhead" },
      { label: "< 50ms", value: "P99 Query Latency" }
    ],
    description: "Real-time edge telemetry platform parsing microservice traces, distributed flamegraphs, and dynamic bottleneck detection without code instrumentation.",
    longDescription: "Aether Cloud captures kernel-level network packets using eBPF probes and streams them directly into an ultra-fast ClickHouse column-store. The web client features interactive topological network maps and hardware flamegraphs rendered with D3 and Canvas.",
    problem: "Manual APM SDK instrumentations introduce code rot, runtime latency penalties, and expensive metric ingestion bills for cloud-native microservices.",
    solution: "Leveraged kernel eBPF hooks for automatic service discovery and zero-overhead request inspection coupled with columnar data aggregation.",
    architectureHighlights: [
      "High-throughput Go ingest daemon handling 1M+ raw spans per second",
      "Interactive SVG + Canvas flamegraph visualizer with sub-millisecond zoom and search",
      "Automated anomaly detection alerting with predictive resource scaling alerts"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/aether",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    demoType: "dashboard"
  },
  {
    id: "pulsepay-gateway",
    title: "PulsePay Core",
    tagline: "High-Throughput Global Merchant Settlement & Ledger Engine",
    category: "full-stack",
    featured: false,
    year: "2025",
    tags: ["Node.js / Express", "PostgreSQL", "Kafka", "Docker", "React", "Tailwind"],
    metrics: [
      { label: "$140M+", value: "Processed Vol" },
      { label: "99.999%", value: "Ledger Accuracy" },
      { label: "18ms", value: "Mean Auth Time" }
    ],
    description: "Double-entry accounting transaction engine designed for high-concurrency payment routing, automated reconciliation, and multi-currency FX settlement.",
    longDescription: "PulsePay guarantees strict ACID transaction consistency with double-entry immutability. Includes a merchant developer dashboard with simulated webhook playgrounds, API key rotation, and automated ledger balancing.",
    problem: "Financial applications often struggle with concurrency race conditions during mass refunds and parallel settlement payouts.",
    solution: "Implemented event-sourced ledger architecture using Kafka topic partitioning and advisory row-level locking in PostgreSQL.",
    architectureHighlights: [
      "Double-entry bookkeeping engine enforcing immutable debit/credit zero-sum balances",
      "Webhook delivery pipeline with exponential backoff and HMAC SHA-256 signatures",
      "Developer portal with live OpenAPI interactive testing playground"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/pulsepay",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
    demoType: "interactive-flow"
  },
  {
    id: "krypton-ui",
    title: "Krypton Design System",
    tagline: "Enterprise Headless UI Component Suite & Physics Motion",
    category: "creative-ui",
    featured: true,
    year: "2024 - 2026",
    tags: ["React 19", "Tailwind CSS", "Motion", "Radix UI", "Accessibility (a11y)"],
    metrics: [
      { label: "100/100", value: "Lighthouse Score" },
      { label: "54+", value: "Compound Components" },
      { label: "WCAG AAA", value: "Compliant" }
    ],
    description: "Comprehensive open-source design system featuring accessible compound primitives, token hierarchies, fluid physics transitions, and zero-runtime CSS.",
    longDescription: "Krypton was engineered to solve component fragmentation across multi-team monorepos. It blends strict WAI-ARIA keyboard navigation standards with refined spring-physics animations and custom token export scripts for Figma.",
    problem: "Off-the-shelf component libraries either lack advanced keyboard ergonomics or bundle heavy CSS runtimes that degrade core web vitals.",
    solution: "Built a tree-shakeable headless foundation with zero-dependency CSS variables, automatic contrast calculation, and spring-interpolated transitions.",
    architectureHighlights: [
      "Custom compound component patterns with ergonomic TypeScript generics",
      "Spring physics engine utilizing Motion for organic tactile interactions",
      "Automated automated visual regression test suite across 4 viewport breakpoints"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/krypton",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    demoType: "canvas"
  },
  {
    id: "hyper-audio",
    title: "HyperAudio Studio",
    tagline: "In-Browser Web Audio Synthesizer & Spatial Visualizer",
    category: "creative-ui",
    featured: false,
    year: "2024",
    tags: ["Web Audio API", "Canvas 2D / 3D", "TypeScript", "React", "AudioWorklet"],
    metrics: [
      { label: "< 4ms", value: "Audio Latency" },
      { label: "8-Voice", value: "Polyphonic Synth" },
      { label: "100%", value: "Zero Assets" }
    ],
    description: "Subtractive polyphonic software synthesizer and frequency visualizer running entirely inside the web browser with zero external sound files.",
    longDescription: "HyperAudio utilizes modern AudioWorklet threads for sample-accurate oscillator synthesis, dynamic bi-quad filters, ADSR envelope generation, and Fourier transform spectrum visualizers.",
    problem: "Standard web audio tutorials rely on main-thread interval hacks that stutter under UI load.",
    solution: "Offloaded audio rendering to dedicated Web Audio AudioWorklet threads with lock-free shared array buffers for 60fps canvas waveform streaming.",
    architectureHighlights: [
      "Low-latency custom AudioWorklet DSP processor with custom wavetable generators",
      "Real-time FFT audio frequency spectrum mapped to particle field geometries",
      "MIDI hardware controller plug-and-play support via Web MIDI API"
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com/hyperaudio",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    demoType: "canvas"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend & UI Architecture",
    iconName: "Layout",
    description: "Building responsive, accessible, and high-performance interfaces with modern design systems and smooth motion.",
    skills: [
      { name: "TypeScript / JavaScript (ESNext)", level: 96, years: "6 yrs", isPrimary: true, tag: "Expert" },
      { name: "React 19 / Next.js (App Router)", level: 95, years: "5 yrs", isPrimary: true, tag: "Expert" },
      { name: "Tailwind CSS & Design Tokens", level: 98, years: "5 yrs", isPrimary: true, tag: "Master" },
      { name: "Motion / Framer Animations", level: 92, years: "4 yrs", isPrimary: true, tag: "Advanced" },
      { name: "Canvas 2D / WebGL / SVG Graphics", level: 85, years: "3 yrs", isPrimary: false, tag: "Proficient" },
      { name: "State Management (Zustand, TanStack Query)", level: 94, years: "5 yrs", isPrimary: true, tag: "Expert" }
    ]
  },
  {
    id: "backend",
    name: "Backend & Systems",
    iconName: "Server",
    description: "Architecting resilient REST & GraphQL APIs, microservices, and distributed streaming pipelines.",
    skills: [
      { name: "Node.js & Express / Fastify", level: 94, years: "6 yrs", isPrimary: true, tag: "Expert" },
      { name: "Python (FastAPI, PyTorch basics)", level: 86, years: "4 yrs", isPrimary: true, tag: "Advanced" },
      { name: "Go / Golang Microservices", level: 82, years: "3 yrs", isPrimary: false, tag: "Intermediate" },
      { name: "WebSockets & Event-Driven Pub/Sub", level: 90, years: "4 yrs", isPrimary: true, tag: "Advanced" },
      { name: "RESTful APIs & gRPC Protocols", level: 92, years: "5 yrs", isPrimary: true, tag: "Expert" },
      { name: "Authentication (OAuth 2.0, JWT, RBAC)", level: 93, years: "5 yrs", isPrimary: true, tag: "Expert" }
    ]
  },
  {
    id: "data-cloud",
    name: "Databases, Cloud & DevOps",
    iconName: "Database",
    description: "Designing reliable persistence layers, caching strategies, containerized workflows, and CI/CD pipelines.",
    skills: [
      { name: "PostgreSQL & Drizzle / Prisma ORM", level: 92, years: "5 yrs", isPrimary: true, tag: "Expert" },
      { name: "Redis Caching & Queue Workers", level: 88, years: "4 yrs", isPrimary: true, tag: "Advanced" },
      { name: "Docker & Container Orchestration", level: 86, years: "4 yrs", isPrimary: false, tag: "Advanced" },
      { name: "Google Cloud Platform (GCP) & AWS", level: 87, years: "4 yrs", isPrimary: true, tag: "Advanced" },
      { name: "ClickHouse & Vector Databases", level: 80, years: "2 yrs", isPrimary: false, tag: "Proficient" },
      { name: "CI/CD (GitHub Actions, Vercel)", level: 91, years: "5 yrs", isPrimary: true, tag: "Advanced" }
    ]
  },
  {
    id: "ai-methodologies",
    name: "AI Systems & Engineering Philosophy",
    iconName: "Cpu",
    description: "Integrating Gemini LLMs, function calling, agentic loops, and engineering rigorous software.",
    skills: [
      { name: "Gemini API & Multi-Agent Architecture", level: 93, years: "2 yrs", isPrimary: true, tag: "Advanced" },
      { name: "Function Calling & Tool Orchestration", level: 95, years: "2 yrs", isPrimary: true, tag: "Expert" },
      { name: "Web Performance Optimization (Core Web Vitals)", level: 96, years: "5 yrs", isPrimary: true, tag: "Master" },
      { name: "Test-Driven Development (Vitest, Playwright)", level: 89, years: "4 yrs", isPrimary: false, tag: "Advanced" },
      { name: "System Architecture & Domain-Driven Design", level: 90, years: "5 yrs", isPrimary: true, tag: "Advanced" },
      { name: "WAI-ARIA Accessibility Standards", level: 92, years: "4 yrs", isPrimary: false, tag: "Advanced" }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    role: "Lead 3D & Creative Web Engineering Consultant",
    company: "Veda Heritage & AuraCraft Studio (India)",
    location: "Remote",
    period: "2024 — Present",
    type: "Contract",
    description: "Spearheaded the architecture and delivery of live 3D interactable web stores and WebGL product configurators for leading Indian luxury D2C brands, jewelers, and bespoke lifestyle enterprises.",
    deliverables: [
      "Architected interactive 3D product visualizers using Three.js and React Three Fiber with custom PBR materials, procedural gemstone dispersion shaders, and dynamic lighting, boosting user dwell time by 3.4x.",
      "Engineered real-time 3D model customization engines allowing customers to rotate, explode, and customize bespoke products in 60fps with zero lag across mobile and desktop devices.",
      "Optimized 3D asset delivery pipelines using Draco geometry compression and KTX2 texture streaming, slashing initial 3D bundle load times from 18MB to under 1.4MB.",
      "Integrated seamless Indian payment gateways (Razorpay, UPI direct checkout) and automated GST invoicing alongside real-time inventory synchronization."
    ],
    techStack: ["Three.js", "React Three Fiber", "TypeScript", "Next.js", "WebGL / GLSL", "Tailwind CSS", "Razorpay API", "Blender/GLTF"],
    metrics: "12+ live 3D client platforms launched & 3.4x average conversion lift"
  },
  {
    id: "exp-2",
    role: "Senior Full Stack & Systems Engineer",
    company: "Synapse Cloud Systems (USA)",
    location: "Remote",
    period: "2023 — 2024",
    type: "Full-time",
    description: "Architected distributed observability dashboards, real-time developer tooling, and high-concurrency API services for global SaaS platforms.",
    deliverables: [
      "Engineered an interactive flamegraph and telemetry visualizer in React and D3 capable of parsing 500k trace spans with 60fps frame rates.",
      "Implemented resilient WebSocket event pipelines and zero-downtime database migrations across PostgreSQL and Redis clusters.",
      "Designed secure multi-tenant OAuth 2.0 authorization gateways and granular role-based access control (RBAC) permission models.",
      "Spearheaded Core Web Vitals optimization, elevating platform Lighthouse performance score from 68 to a consistent 98+."
    ],
    techStack: ["TypeScript", "React 19", "Node.js", "Go", "PostgreSQL", "Redis", "Docker", "GCP"],
    metrics: "Scaled developer platform to 500k+ monthly active sessions"
  },
  {
    id: "exp-3",
    role: "Interactive 3D Web Developer & Full Stack Consultant",
    company: "ZestProp Tech & Studio Kroma (India & UK)",
    location: "Remote",
    period: "2022 — 2023",
    type: "Contract",
    description: "Designed and engineered bespoke 3D interactable web experiences, architectural walkthroughs, and performant web applications for Indian PropTech ventures and international creative studios.",
    deliverables: [
      "Built an interactive 3D floorplan and building walkthrough tool with Three.js and Cannon.js physics for premier Indian residential developments in Bengaluru and Mumbai.",
      "Engineered smooth camera choreography and scroll-linked 3D storytelling animations with GSAP and Motion, recognized with multiple digital design awards.",
      "Constructed performant Next.js e-commerce engines with headless Shopify APIs, multi-currency checkout, and custom 3D merchandise previewers.",
      "Developed high-throughput Node.js microservices with Redis caching, reducing server response times by 55% during high-traffic viral launch events."
    ],
    techStack: ["Three.js", "TypeScript", "React", "Node.js", "WebGL", "Tailwind CSS", "Shopify Storefront API", "PostgreSQL"],
    metrics: "14+ successful client launches with 100% on-time milestone delivery"
  },
  {
    id: "exp-4",
    role: "Frontend & Full Stack Developer",
    company: "NextWave Digital Tech (India & Global)",
    location: "Remote",
    period: "2020 — 2022",
    type: "Full-time",
    description: "Built modular web applications, client dashboards, and responsive interactive frontends for business clients across India and overseas.",
    deliverables: [
      "Developed reusable React component libraries and design tokens compliant with modern accessibility and responsive web design standards.",
      "Implemented RESTful backend APIs with Express and PostgreSQL, handling user authentication, session security, and reporting.",
      "Collaborated closely with domestic and international UI/UX designers to translate Figma design systems into pixel-perfect web interfaces."
    ],
    techStack: ["TypeScript", "JavaScript", "React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    metrics: "20+ responsive web platforms shipped with 99.9% uptime"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Aarav Sharma",
    role: "Co-Founder & Product Lead",
    company: "AuraCraft Lifestyle (India)",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    quote: "Rick transformed our brand's web presence with a breathtaking live 3D product configurator. Customers can interact with our products in 3D right in their mobile browser, which tripled our pre-orders within the first month. An absolute genius in WebGL and React.",
    relation: "Hired Rick for interactive 3D web platform"
  },
  {
    id: "test-2",
    name: "Marcus Vance",
    role: "Head of Product",
    company: "Synapse Cloud (USA)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    quote: "Working with Rick is a breath of fresh air. You give him an ambiguous problem statement and he returns with an elegant, scalable architecture and an interface that our enterprise users genuinely love using every day.",
    relation: "Collaborated closely on core developer platforms"
  },
  {
    id: "test-3",
    name: "Pooja Mukherjee",
    role: "Creative Director",
    company: "Studio Kroma (Kolkata / Mumbai)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    quote: "Rick is one of the most reliable and high-output engineers I have ever worked with. His 3D animations, zero-lag WebGL rendering, and meticulous eye for micro-interactions elevated our clients' campaigns to international award standards.",
    relation: "Collaborated on multiple 3D client web experiences"
  }
];

export const LAB_EXPERIMENTS = [
  {
    id: "particle-mesh",
    title: "Interactive Vector Field & Particles",
    category: "Canvas Physics",
    description: "High-performance particle engine reacting to cursor gravity, fluid velocity, and spatial repulsion algorithms."
  },
  {
    id: "audio-synth",
    title: "Polyphonic Procedural Synth",
    category: "Web Audio DSP",
    description: "Pure Web Audio synthesis with customizable wave generators, frequency modulation, and interactive key chords."
  },
  {
    id: "latency-simulator",
    title: "Distributed Network Latency Map",
    category: "Systems & Cloud",
    description: "Interactive simulation comparing Edge CDN caching, Multi-Region routing, and centralized databases."
  },
  {
    id: "token-generator",
    title: "Palette & Contrast Token Studio",
    category: "Design Engineering",
    description: "Instant WCAG AA/AAA compliant color contrast evaluator and design token generator for dark mode systems."
  }
];
