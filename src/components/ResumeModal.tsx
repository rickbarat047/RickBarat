import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Mail, 
  MapPin, 
  ExternalLink
} from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, SKILL_CATEGORIES } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { playClick, playSuccess, playHover, playTransition } = useUISounds();
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    playClick();
    playTransition('out');
    onClose();
  };

  const handlePrint = () => {
    playClick();
    window.print();
  };

  const handleCopyMarkdown = () => {
    playSuccess();
    const markdown = `# ${PERSONAL_INFO.name}
**${PERSONAL_INFO.title}**
- Email: ${PERSONAL_INFO.email}
- Location: ${PERSONAL_INFO.location}
- Timezone: ${PERSONAL_INFO.timezone}

## Summary
${PERSONAL_INFO.bio}

## Work Experience
${EXPERIENCES.map(e => `### ${e.role} — ${e.company} (${e.period})
${e.description}
Key deliverables:
${e.deliverables.map(d => `- ${d}`).join('\n')}
Tech: ${e.techStack.join(', ')}
`).join('\n')}

## Technical Competencies
- Languages: TypeScript, JavaScript, Python, Go, SQL, HTML5/CSS3
- Frameworks: React 19, Next.js, Node.js, Express, Fastify, Tailwind CSS
- Databases & Cloud: PostgreSQL, Redis, ClickHouse, Docker, GCP, AWS, WebSockets, CRDTs
- AI Systems: Gemini 2.5 API, Tool Orchestration, Function Calling, Prompt Engineering
`;

    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div 
      id="resume-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-y-auto my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white font-display text-base sm:text-lg">
              Curriculum Vitae // {PERSONAL_INFO.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="resume-copy-md-btn"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy as Markdown"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedMd ? 'Copied MD!' : 'Copy MD'}</span>
            </button>

            <button
              id="resume-print-btn"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              id="resume-close-btn"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document */}
        <div className="p-6 sm:p-10 space-y-8 bg-neutral-950/60 font-sans text-neutral-200">
          
          {/* Header */}
          <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">{PERSONAL_INFO.name}</h1>
              <p className="text-amber-400 font-mono text-sm mt-0.5">{PERSONAL_INFO.title}</p>
            </div>
            
            <div className="text-xs font-mono text-neutral-400 space-y-1 sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">{PERSONAL_INFO.email}</a>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <div>Timezone: {PERSONAL_INFO.timezone}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Executive Profile</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {PERSONAL_INFO.bio} Extensive background in designing multi-region architectures, micro-frontends, high-throughput WebSockets, and integrating modern Gemini generative reasoning models.
            </p>
          </div>

          {/* Core Technical Competencies */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="font-bold text-white font-mono">Frontend & UI Engineering</div>
                <div className="text-neutral-400 leading-relaxed">
                  TypeScript, React 19, Next.js (App Router), Tailwind CSS, Motion, WebGL / Canvas 2D, Zustand, TanStack Query, Radix UI, WAI-ARIA
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="font-bold text-white font-mono">Backend & Distributed Systems</div>
                <div className="text-neutral-400 leading-relaxed">
                  Node.js, Express, Fastify, Python, Go, WebSockets, REST APIs, gRPC, Redis Pub/Sub, CRDTs (Yjs), Kafka
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="font-bold text-white font-mono">Databases, Cloud & DevOps</div>
                <div className="text-neutral-400 leading-relaxed">
                  PostgreSQL, Drizzle / Prisma ORM, ClickHouse, Docker, Google Cloud Platform (GCP), AWS, CI/CD Actions, Vercel
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="font-bold text-white font-mono">AI Systems & Architecture</div>
                <div className="text-neutral-400 leading-relaxed">
                  Gemini 2.5 SDK, Multi-Agent Orchestration, FastMCP, Function Calling, Core Web Vitals Optimization, TDD (Vitest, Playwright)
                </div>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Professional Experience</span>
            </h2>

            <div className="space-y-6">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="space-y-2 border-l-2 border-neutral-800 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{exp.role}</span>
                      <span className="text-amber-400 font-mono text-xs ml-2">@ {exp.company}</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">{exp.period} | {exp.location}</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside">
                    {exp.deliverables.map((d, i) => (
                      <li key={i} className="leading-relaxed">{d}</li>
                    ))}
                  </ul>

                  <div className="text-[11px] font-mono text-neutral-500 pt-1">
                    Stack: {exp.techStack.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Education & Certifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <div className="font-bold text-white">Bachelor of Computer Applications (BCA)</div>
                <div className="text-neutral-400">Techno India University, Kolkata</div>
                <div className="text-[11px] font-mono text-amber-400 mt-1">Computer Applications & Software Engineering</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <div className="font-bold text-white">Google Cloud Certified</div>
                <div className="text-neutral-400">Professional Cloud Architect</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">Verified Credential</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
