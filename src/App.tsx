import React, { useState } from "react";
import FolderTabPortfolioTemplate from "./components/FolderTabPortfolio";
import LoadingIntro from "./components/LoadingIntro";
import { SPATIAL_OBJECTS } from "./data/spatialData";
import { PERSONAL_DATA } from "./data/personalData";

// Map verified projects to the template's project format
// Munjoy de-emphasized (incomplete) — pushed to the end, described as in-progress
const projects = SPATIAL_OBJECTS
  .filter((item) => item.category === "PROJECT")
  .sort((a, b) => (a.id === "munjoy" ? 1 : b.id === "munjoy" ? -1 : 0))
  .map((item) => ({
    title: item.title,
    category: item.id,
    year: item.meta?.find((m) => m.label === "Destination")?.value?.split(".")[0] || "2026",
    summary: item.shortDesc,
    body: [item.fullDesc],
    href: item.url,
    image: item.image,
    role: item.meta?.find((m) => m.label === "Role")?.value || "Design & Full Implementation",
    tools: item.tags || [],
  }));

const categories = [
  { id: "autotube", label: "AutoTube", tone: "blue" as const, kind: "render" as const },
  { id: "fashion-hub", label: "Fashion Hub", tone: "green" as const, kind: "page" as const },
  { id: "vesper-studio", label: "Vesper", tone: "yellow" as const, kind: "poster" as const },
  { id: "storeflow", label: "StoreFlow", tone: "green" as const, kind: "render" as const },
  { id: "leadpilot", label: "LeadPilot", tone: "orange" as const, kind: "brand" as const },
  { id: "jobpilot-ai", label: "JobPilot", tone: "blue" as const, kind: "page" as const },
  { id: "autotube-studio", label: "AutoTube Studio", tone: "green" as const, kind: "render" as const },
  { id: "munjoy", label: "Munjoy", tone: "orange" as const, kind: "brand" as const },
];

// Process steps composed from real data: Building / AI & Automation / Creating / Learning
const steps = [
  {
    title: "Discover",
    body: "Every project starts as curiosity — a problem I can't shake, a tool I wish existed, a video idea I want to automate. I chase that itch first, let it sit, and see if it keeps pulling.",
    outputs: ["Idea sketch", "Problem framing", "Success criteria"],
    duration: "Day 1",
  },
  {
    title: "Build",
    body: "I prototype fast with React, TypeScript and Next.js, taming the wild parts with Python and APIs. The goal is a tactile, clickable thing — not a spec sheet — as early as possible.",
    outputs: ["Working prototype", "Core flows", "First impressions"],
    duration: "Days 2-4",
  },
  {
    title: "Automate",
    body: "Then I hand the repetitive parts to AI and automation — local LLMs, workflow chaining, agents. The computer handles the boring bits; I keep the human spark in the loop.",
    outputs: ["Automated pipelines", "AI agents", "Less manual work"],
    duration: "Days 5-7",
  },
  {
    title: "Deliver",
    body: "Ship it to Vercel, write about it, share it on Instagram, and learn from real use. Every shippable thing is a door to the next experiment — not a finish line.",
    outputs: ["Live deployment", "Public write-up", "Next iteration"],
    duration: "Days 8-9",
  },
];

// Highlights from littleThings — real interests, not filler
const highlights = PERSONAL_DATA.littleThings.slice(0, 3).map((t) => ({
  label: t.tag,
  lines: [t.description],
}));

// Timeline from education + currently — BCA 2025 → Independent 2025-2026
const timeline = [
  { from: "2021", to: "2025", title: "BCA — Techno India University", place: "West Bengal" },
  { from: "2025", to: "Now", title: "Independent Developer &\ AI Builder", place: "West Bengal" },
  { from: "2026", to: "Now", title: "AI Automation + Web Experiences", place: "Shipping weekly" },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingIntro onComplete={() => setLoaded(true)} duration={2000} />}
      <FolderTabPortfolioTemplate
        name="Rick Barat"
        handle="@rickbarat047"
        role="Independent Developer & AI Builder"
        years="2025-2026"
        disciplines={["Web Development", "AI Applications", "AI Automation", "Creative Digital Experiences"]}
        word="Portfolio"
        tag="#2026"
        blurb="I'm Rick Barat — a BCA graduate and independent developer from West Bengal. I enjoy turning ideas into interactive websites, useful tools and AI-powered systems. I build tactile, fast, personal software — and automate the boring parts."
        greeting="Hey, I'm Rick."
        email="rickbarat21@gmail.com"
        timeZone="Asia/Kolkata"
        projects={projects}
        categories={categories}
        steps={steps}
        highlights={highlights as any}
        timeline={timeline}
        chapters={[]}
        words={[]}
        localName=""
        subtitle={["Web", " Development", "AI", " Automation"]}
        notes={["West Bengal", "Independent", "#2026"]}
        photo="/assets/images/creative_corner_art_1790612718363.jpg"
        contacts={[
          { label: "Instagram", value: "@rickbarat047", href: "https://www.instagram.com/rickbarat047/" },
          { label: "GitHub", value: "github.com/rickbarat047", href: "https://github.com/rickbarat047" },
          { label: "Email", value: "rickbarat21@gmail.com", href: "mailto:rickbarat21@gmail.com" },
        ]}
        defaultTheme="dark"
      />
    </>
  );
}
