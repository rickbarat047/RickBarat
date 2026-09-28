import type { ReactNode } from 'react';

export type ProjectCategory = 'all' | 'full-stack' | 'ai-systems' | 'creative-ui' | 'cloud-infra';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  featured: boolean;
  tags: string[];
  metrics?: { label: string; value: string }[];
  status?: string;
  whatIsIt?: string;
  problem: string;
  approach?: string;
  howItWorks?: string;
  keyFeatures?: string[];
  solution: string;
  architectureHighlights?: string[];
  challenges?: string;
  whatILearned?: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
  demoType?: 'interactive-flow' | 'terminal' | 'dashboard' | 'canvas';
  year: string;
}

export interface SkillItem {
  name: string;
  usedIn?: string;
  category?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  skills: SkillItem[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Open Source';
  description: string;
  deliverables: string[];
  techStack: string[];
  metrics: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  relation: string;
}

export interface TerminalCommand {
  command: string;
  description: string;
  action: (args?: string[]) => string | ReactNode;
}
