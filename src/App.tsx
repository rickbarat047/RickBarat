import React from "react";
import FolderTabPortfolioTemplate from "./components/FolderTabPortfolio";
import { SPATIAL_OBJECTS } from "./data/spatialData";

// Map verified projects to the template's project format
const projects = SPATIAL_OBJECTS
  .filter((item) => item.category === "PROJECT")
  .map((item) => ({
    title: item.title,
    category: item.id,
    year: item.meta?.find((m) => m.label === "Destination")?.value?.split(".")[0] || "2026",
    summary: item.shortDesc,
    body: [item.fullDesc],
    href: item.url,
    image: item.image,
    role: item.meta?.find((m) => m.label === "Role")?.value || "Design & Development",
    tools: item.tags || [],
  }));

const categories = [
  { id: "munjoy", label: "Munjoy", tone: "orange" as const, kind: "brand" as const },
  { id: "autotube", label: "AutoTube", tone: "blue" as const, kind: "render" as const },
  { id: "fashion-hub", label: "Fashion Hub", tone: "green" as const, kind: "page" as const },
  { id: "vesper-studio", label: "Vesper", tone: "yellow" as const, kind: "poster" as const },
  { id: "storeflow", label: "StoreFlow", tone: "green" as const, kind: "render" as const },
  { id: "leadpilot", label: "LeadPilot", tone: "orange" as const, kind: "brand" as const },
  { id: "jobpilot-ai", label: "JobPilot", tone: "blue" as const, kind: "page" as const },
  { id: "autotube-studio", label: "AutoTube Studio", tone: "green" as const, kind: "render" as const },
];

export default function App() {
  return (
    <FolderTabPortfolioTemplate
      name="Rick Barat"
      handle="@rickbarat047"
      role="Independent Developer & AI Builder"
      years="2025-2026"
      disciplines={["Web Development", "AI Applications", "AI Automation", "Creative Digital Experiences"]}
      word="Portfolio"
      tag="#2026"
      blurb="I'm Rick Barat — a BCA graduate and independent developer from West Bengal. I enjoy turning ideas into interactive websites, useful tools and AI-powered systems."
      greeting="Hi, I am"
      email="rickbarat21@gmail.com"
      timeZone="Asia/Kolkata"
      projects={projects}
      categories={categories}
      defaultTheme="dark"
    />
  );
}
