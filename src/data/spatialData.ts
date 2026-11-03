export interface SpatialItem {
  id: string;
  number: string;
  title: string;
  category: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  image?: string;
  url?: string;
  urlLabel?: string;
  tags?: string[];
  meta?: { label: string; value: string }[];
  accentColor?: string;
}

export const SPATIAL_OBJECTS: SpatialItem[] = [
  {
    id: "munjoy",
    number: "01",
    title: "MUNJOY",
    category: "PROJECT",
    badge: "PROJECT 01",
    shortDesc: "A website I made for a homemade pickle brand.",
    fullDesc: "A bespoke e-commerce and brand presence crafted for Munjoy Pickles, an artisanal homemade pickle brand. Built with a rich tactile visual identity, responsive shopping flow, and product storytelling that honors authentic culinary tradition.",
    image: "/assets/images/munjoy_preview.png",
    url: "https://munjoypickles-zeta.vercel.app/",
    urlLabel: "OPEN WEBSITE â†—",
    tags: ["Brand Experience", "E-Commerce", "Next.js", "Tailwind CSS"],
    meta: [
      { label: "Status", value: "Live & Deployed" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "munjoypickles-zeta.vercel.app" }
    ],
    accentColor: "#f59e0b"
  },
  {
    id: "autotube",
    number: "02",
    title: "AUTOTUBE",
    category: "PROJECT",
    badge: "PROJECT 02",
    shortDesc: "An AI-powered YouTube automation project.",
    fullDesc: "An end-to-end automation experiment leveraging AI models to research trending topics, synthesize scripts, generate media, and streamline the content production pipeline for video creators.",
    image: "/assets/images/autotube_preview_new.png",
    url: "https://autotube-tau.vercel.app/",
    urlLabel: "OPEN WEBSITE â†—",
    tags: ["AI Pipeline", "Automation", "Video Scripting", "Python + React"],
    meta: [
      { label: "Focus", value: "Generative Workflows" },
      { label: "Status", value: "Active Experiment" },
      { label: "Destination", value: "autotube-tau.vercel.app" }
    ],
    accentColor: "#ef4444"
  },
  {
    id: "who-am-i",
    number: "03",
    title: "WHO AM I?",
    category: "ABOUT",
    badge: "ABOUT RICK",
    shortDesc: "A BCA graduate from West Bengal who loves building things.",
    fullDesc: "I'm Rick Barat, a BCA graduate from West Bengal who enjoys building things, experimenting with technology, creating visual stuff, learning new things and getting completely absorbed in ideas that interest me. I believe software and design should feel tactile, fast, and personal.",
    tags: ["West Bengal", "BCA 2025", "Creator", "Tinkerer"],
    meta: [
      { label: "Location", value: "West Bengal, India" },
      { label: "Education", value: "BCA (Techno India Univ, 2025)" },
      { label: "Mindset", value: "Curiosity-Driven" }
    ],
    accentColor: "#fbbf24"
  },
  {
    id: "ai",
    number: "04",
    title: "AI & AUTOMATION",
    category: "EXPLORING",
    badge: "INTEREST",
    shortDesc: "Exploring AI, automation and new ways of building things.",
    fullDesc: "I've been experimenting heavily with local LLMs, AI agents, automated workflow chaining, and ways to make computers handle the repetitive parts of modern work. It's about empowering curiosity rather than replacing the human spark.",
    image: "/assets/images/ailab_preview_1790611557192.jpg",
    tags: ["Local LLMs", "Workflow Automation", "API Chaining", "Agents"],
    meta: [
      { label: "Exploration", value: "LLM Agentic Systems" },
      { label: "Philosophy", value: "Automate the Repetitive" }
    ],
    accentColor: "#38bdf8"
  },
  {
    id: "building",
    number: "05",
    title: "BUILDING",
    category: "CRAFT",
    badge: "CRAFT",
    shortDesc: "Turning ideas into things people can actually interact with.",
    fullDesc: "There's an irreplaceable thrill in taking an intangible thought or late-night brainstorm and shaping it into software people can click, navigate, and enjoy. Whether it's a micro-tool, a full web app, or an experimental interface.",
    tags: ["Frontend Engineering", "Full-Stack Systems", "Creative Web", "UI"],
    meta: [
      { label: "Medium", value: "Web, TypeScript & React" },
      { label: "Focus", value: "Tactile Experiences" }
    ],
    accentColor: "#10b981"
  },
  {
    id: "gaming",
    number: "06",
    title: "GAMING & HARDWARE",
    category: "INTEREST",
    badge: "INTEREST",
    shortDesc: "PCs, games, performance and hardware tweaking.",
    fullDesc: "Hardware tuning, frame pacing, silicon thermals, and digging into PC setups. Gaming is where cutting-edge real-time graphics and system optimization meet pure interactive fun.",
    image: "/assets/images/pctoolkit_preview_1790611541450.jpg",
    tags: ["PC Hardware", "Frame Pacing", "Optimization", "Gaming"],
    meta: [
      { label: "Setup", value: "Custom Tuned PC" },
      { label: "Passions", value: "Hardware & Game Design" }
    ],
    accentColor: "#a855f7"
  },
  {
    id: "creating",
    number: "07",
    title: "CREATING",
    category: "VISUALS",
    badge: "DESIGN",
    shortDesc: "Websites, visuals, experiments and anything with soul.",
    fullDesc: "Visuals, editorial layouts, graphic design, Instagram creative experiments, and anything that lets me craft something with care. Rejecting generic AI templates in favor of authentic character, asymmetrical rhythm, and expressive typography.",
    image: "/assets/images/creative_corner_art_1790612718363.jpg",
    tags: ["Editorial Design", "Typography", "Motion", "Visual Identity"],
    meta: [
      { label: "Style", value: "Editorial & Asymmetric" },
      { label: "Mediums", value: "Digital Canvas & Typography" }
    ],
    accentColor: "#f43f5e"
  },
  {
    id: "learning",
    number: "08",
    title: "LEARNING",
    category: "CURIOSITY",
    badge: "CURIOSITY",
    shortDesc: "Always something new to break, understand and rebuild.",
    fullDesc: "Never satisfied with just watching things work on the surface. I like taking systems apart down to their fundamentals, understanding how each layer fits together, and rebuilding it better with newfound knowledge.",
    tags: ["Self-Directed", "Systems Thinking", "Deep Dives", "Tinkering"],
    meta: [
      { label: "Approach", value: "First-Principles Rebuild" },
      { label: "Current Topic", value: "Motion Physics & Spatial UI" }
    ],
    accentColor: "#eab308"
  },
  {
    id: "right-now",
    number: "09",
    title: "RIGHT NOW",
    category: "CURRENT",
    badge: "2026 FOCUS",
    shortDesc: "What I'm currently building, exploring and learning.",
    fullDesc: "A real-time snapshot of my active focus areas right now:\n\n• BUILDING: AutoTube (AI-powered YouTube automation)\n• EXPLORING: AI + automation (Local models, workflows & tools)\n• CREATING: Web experiences + visual content (Interfaces & design)\n• LEARNING: New things & technologies",
    tags: ["AutoTube", "AI Workflows", "Web Experiences", "2026"],
    meta: [
      { label: "Building", value: "AutoTube" },
      { label: "Exploring", value: "AI & Automation" },
      { label: "Creating", value: "Web & Visuals" },
      { label: "Learning", value: "New Technologies" }
    ],
    accentColor: "#06b6d4"
  },
  {
    id: "rick-corner",
    number: "10",
    title: "RICK'S CORNER",
    category: "SPACE",
    badge: "PERSONAL SPACE",
    shortDesc: "A quiet, handcrafted corner of the internet.",
    fullDesc: "Welcome to my digital home. Not a corporate resume or a cookie-cutter portfolio, but a spatial corner designed to share what I care about. Feel free to rotate the sphere, explore each node, and check out what I've shipped.",
    tags: ["Rick Barat", "Personal Space", "2026", "West Bengal"],
    meta: [
      { label: "Owner", value: "Rick Barat" },
      { label: "Year", value: "2026" },
      { label: "Instagram", value: "@rickbarat047" }
    ],
    accentColor: "#fbbf24"
  },
  {
    id: "fashion-hub",
    number: "11",
    title: "FASHION HUB",
    category: "PROJECT",
    badge: "PROJECT 03",
    shortDesc: "A curated edit of women's fashion and ethnic wear.",
    fullDesc: "A curated fashion storefront surfacing handpicked women's wear and ethnic wear with direct affiliate links to Meesho listings, built for clean mobile browsing.",
    image: "/assets/images/fashionhub_preview.png",
    url: "https://the-fashion-hub-store.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["Curated Fashion", "Affiliate", "Vite", "E-Commerce"],
    meta: [
      { label: "Status", value: "Live & Deployed" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "the-fashion-hub-store.vercel.app" }
    ],
    accentColor: "#ec4899"
  },
  {
    id: "vesper-studio",
    number: "12",
    title: "VESPER STUDIO",
    category: "PROJECT",
    badge: "PROJECT 04",
    shortDesc: "AI product advertising studio for brands.",
    fullDesc: "An AI-assisted product advertising studio that turns product photos into realistic AI model videos, product ads, and social-first content for brands.",
    image: "/assets/images/vesper_preview.png",
    url: "https://vesper-studio-gamma.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["AI Advertising", "Product Videos", "Next.js", "Creative"],
    meta: [
      { label: "Status", value: "Live & Deployed" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "vesper-studio-gamma.vercel.app" }
    ],
    accentColor: "#8b5cf6"
  },
  {
    id: "storeflow",
    number: "13",
    title: "STOREFLOW",
    category: "PROJECT",
    badge: "PROJECT 05",
    shortDesc: "Supplier invoice to verified inventory.",
    fullDesc: "A B2B SaaS tool that converts supplier invoices into verified inventory updates for electronics retailers, with AI extraction, IMEI tracking, and Excel export.",
    image: "/assets/images/storeflow_preview.png",
    url: "https://storeflow-lilac.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["B2B SaaS", "Invoice AI", "Inventory", "Supabase"],
    meta: [
      { label: "Status", value: "Live & Deployed" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "storeflow-lilac.vercel.app" }
    ],
    accentColor: "#06b6d4"
  },
  {
    id: "leadpilot",
    number: "14",
    title: "LEADPILOT",
    category: "PROJECT",
    badge: "PROJECT 06",
    shortDesc: "Turn missed leads into booked customers.",
    fullDesc: "Lead recovery and booking automation that instantly responds to new leads, follows up automatically, qualifies prospects, and books appointments for service businesses.",
    image: "/assets/images/leadpilot_preview.png",
    url: "https://leadpilot-sepia-six.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["Lead Automation", "Booking", "Next.js", "SaaS"],
    meta: [
      { label: "Status", value: "Live & Deployed" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "leadpilot-sepia-six.vercel.app" }
    ],
    accentColor: "#10b981"
  },
  {
    id: "jobpilot-ai",
    number: "15",
    title: "JOBPILOT AI",
    category: "PROJECT",
    badge: "PROJECT 07",
    shortDesc: "Autonomous job hunting for India.",
    fullDesc: "An AI-powered job hunting assistant for India that discovers opportunities, prepares applications, and tracks progress from CV to interview with approval-first submissions.",
    image: "/assets/images/jobpilot_preview.png",
    url: "https://jobpilot-ai-sand.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["Career Agent", "Next.js", "Supabase", "AI"],
    meta: [
      { label: "Status", value: "In Progress" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "jobpilot-ai-sand.vercel.app" }
    ],
    accentColor: "#3b82f6"
  },
  {
    id: "autotube-studio",
    number: "16",
    title: "AUTOTUBE STUDIO",
    category: "PROJECT",
    badge: "PROJECT 08",
    shortDesc: "Automated kids story animation system.",
    fullDesc: "A production-grade automated AI animation pipeline and YouTube publishing studio for high-quality children's storytelling.",
    image: "/assets/images/newtube_preview.png",
    url: "https://newtube-automation-zeta.vercel.app/",
    urlLabel: "OPEN WEBSITE â†’",
    tags: ["Animation", "AI Pipeline", "Vite", "YouTube"],
    meta: [
      { label: "Status", value: "In Progress" },
      { label: "Role", value: "Design & Full Implementation" },
      { label: "Destination", value: "newtube-automation-zeta.vercel.app" }
    ],
    accentColor: "#f59e0b"
  }
];

// Dev-time validation for duplicate project/image data
if ((import.meta as any).env?.DEV) {
  const seenIds = new Set<string>();
  const seenImages = new Map<string, string>();
  SPATIAL_OBJECTS.forEach((item) => {
    if (seenIds.has(item.id)) {
      console.warn(`[spatialData] Duplicate item id detected: ${item.id}`);
    }
    seenIds.add(item.id);

    if (item.image) {
      if (seenImages.has(item.image)) {
        console.warn(
          `[spatialData] Duplicate image "${item.image}" used by "${item.id}" and "${seenImages.get(item.image)}"`
        );
      }
      seenImages.set(item.image, item.id);
    }

    if (item.category === "PROJECT" && !item.url) {
      console.warn(`[spatialData] Project "${item.id}" is missing a URL`);
    }
  });
}


