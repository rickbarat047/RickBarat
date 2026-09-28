export interface ProjectItem {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  url: string;
  image: string;
  year: string;
  tagline?: string;
  tags?: string[];
}

export interface LittleThing {
  id: string;
  tag: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CurrentlyItem {
  category: string;
  item: string;
  detail?: string;
}

export const PERSONAL_DATA = {
  name: "Rick Barat",
  preferredName: "Rick",
  location: "West Bengal, India",
  instagramUrl: "https://www.instagram.com/rickbarat047/?hl=en",
  githubUrl: "https://github.com/rickbarat",
  email: "rickbarat21@gmail.com",

  arrival: {
    greeting: "Hey, I'm Rick.",
    subgreeting: "Welcome to my little corner of the internet.",
    invitation: "Scroll around ↓"
  },

  whoAmI: {
    title: "So... who am I?",
    statement: "I'm Rick Barat, a BCA graduate from West Bengal. I enjoy building things, experimenting with technology, creating visual stuff, learning new things, and getting completely absorbed in ideas that interest me."
  },

  littleThings: [
    {
      id: "building",
      tag: "BUILDING",
      title: "Building Things",
      description: "I like taking an idea and turning it into something people can actually click, use and experience.",
      iconName: "Hammer"
    },
    {
      id: "ai",
      tag: "AI",
      title: "AI & Automation",
      description: "I've been experimenting with AI, automation and ways to make computers do more of the boring stuff.",
      iconName: "Sparkles"
    },
    {
      id: "gaming",
      tag: "GAMING",
      title: "Gaming & Hardware",
      description: "PCs, games, performance and probably more tweaking than necessary.",
      iconName: "Gamepad2"
    },
    {
      id: "creating",
      tag: "CREATING",
      title: "Visuals & Design",
      description: "Visuals, websites, Instagram content and anything that lets me make something.",
      iconName: "Palette"
    },
    {
      id: "learning",
      tag: "LEARNING",
      title: "Curiosity & Tinkering",
      description: "Always something new to break, understand and rebuild.",
      iconName: "Compass"
    }
  ] as LittleThing[],

  currently: [
    {
      category: "BUILDING",
      item: "AutoTube",
      detail: "AI-powered YouTube automation"
    },
    {
      category: "EXPLORING",
      item: "AI + automation",
      detail: "Local models, workflows & tools"
    },
    {
      category: "CREATING",
      item: "Web experiences + visual content",
      detail: "Small websites, interfaces & design"
    },
    {
      category: "LEARNING",
      item: "New technologies & ideas",
      detail: "Always following curiosity"
    },
    {
      category: "PLAYING",
      item: "Gaming / PC related interests",
      detail: "Hardware tuning & gaming"
    }
  ] as CurrentlyItem[],

  portraitPlaceholder: {
    image: "/src/assets/images/creative_corner_art_1790612718363.jpg",
    caption: "A glimpse of where ideas start taking shape.",
    subcaption: "Rick's Creative Space · West Bengal"
  },

  interestsWall: [
    { id: "building", text: "BUILDING THINGS", accent: "Taking ideas from zero to interactive", scale: "large", italic: false },
    { id: "gaming", text: "PLAYING GAMES", accent: "PCs, frame pacing & hardware tweaking", scale: "medium", italic: true },
    { id: "experimenting", text: "EXPERIMENTING", accent: "Testing local LLMs, prompts & automation", scale: "medium", italic: false },
    { id: "learning", text: "LEARNING RANDOM STUFF", accent: "Always down a new rabbit hole", scale: "large", italic: true },
    { id: "designing", text: "MAKING THINGS LOOK GOOD", accent: "Obsessed with spacing & typography", scale: "extra-large", italic: false }
  ],

  projectsIntro: "Oh, and I build things too.",

  projects: [
    {
      id: "munjoy-pickles",
      name: "Munjoy Pickles",
      shortDescription: "A little website I made for a homemade pickle brand.",
      category: "Web Experience",
      url: "https://munjoypickles-zeta.vercel.app/",
      image: "/src/assets/images/munjoy_preview_1790612699399.jpg",
      year: "2025",
      tags: ["Brand Identity", "Next.js", "E-Commerce", "Tailwind"]
    },
    {
      id: "autotube",
      name: "AutoTube",
      shortDescription: "An AI-powered YouTube automation project.",
      category: "AI & Automation",
      url: "https://autotube-tau.vercel.app/",
      image: "/src/assets/images/autotube_preview_1790611524328.jpg",
      year: "2025 - 2026",
      tags: ["AI Pipeline", "Automation", "Video Scripting", "Python + React"]
    }
  ] as ProjectItem[],

  education: {
    prefix: "Some formal stuff...",
    degree: "BCA",
    institution: "Techno India University",
    year: "2025"
  },

  personalMoment: {
    heading: "That's pretty much me.",
    text: "I like building things, learning random stuff, experimenting with ideas and seeing where they go."
  },

  goodbye: {
    message: "Thanks for stopping by.",
    subtext: "Come back sometime."
  }
};
