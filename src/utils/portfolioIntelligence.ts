/**
 * Verified Portfolio Intelligence Knowledge Engine for Rick Barat
 * Provides instantaneous, accurate answers about Rick's engineering background,
 * 3D WebGL projects, distributed systems experience, education, and contact options.
 * Used on both client-side and server-side to guarantee 100% uptime with zero 404 crashes.
 */

export interface PortfolioKnowledgeResponse {
  reply: string;
  category: 'projects' | 'education' | 'skills' | 'contact' | 'experience' | 'rates' | 'architect' | 'recruiter' | 'general';
}

export function generatePortfolioKnowledge(query: string, persona: string = 'general'): PortfolioKnowledgeResponse {
  const q = (query || '').toLowerCase().trim();

  // 1. Contact / Hiring / Availability
  if (
    q.includes('contact') || 
    q.includes('email') || 
    q.includes('hire') || 
    q.includes('hiring') || 
    q.includes('available') || 
    q.includes('availability') || 
    q.includes('rate') || 
    q.includes('pricing') || 
    q.includes('cost') || 
    q.includes('instagram') || 
    q.includes('reach') || 
    q.includes('resume') || 
    q.includes('cv')
  ) {
    return {
      category: 'contact',
      reply: `### Get in Touch with Rick Barat:

Rick is actively available for **Senior Full-Stack Engineering roles**, **Remote Worldwide Contracts**, and **Bespoke 3D WebGL Consultancy**.

- **Email:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)
- **Instagram:** [@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)
- **Timezone:** India Standard Time (IST, UTC+5:30) with flexible overlap for US & European teams
- **Response Time:** Typically within 24 hours
- **Resume:** Click the **Resume** button in the navigation header to view/download his complete verified CV.

Whether you have a contract project, need 3D WebGL performance optimization, or want to discuss full-time engineering opportunities, Rick would love to hear from you!`
    };
  }

  // 2. Education / University / Degree
  if (
    q.includes('education') || 
    q.includes('degree') || 
    q.includes('college') || 
    q.includes('university') || 
    q.includes('school') || 
    q.includes('bca') || 
    q.includes('techno') || 
    q.includes('kolkata') || 
    q.includes('study') || 
    q.includes('academic')
  ) {
    return {
      category: 'education',
      reply: `### Rick Barat's Educational Background:

- **Degree:** Bachelor of Computer Applications (**BCA**)
- **University:** **Techno India University**, Kolkata, India
- **Core Academic Focus:**
  - Data Structures & Algorithms (DSA)
  - Object-Oriented Software Engineering & Systems Design
  - Computer Graphics & Linear Algebra for 3D Transform Pipelines
  - Relational Database Management Systems (RDBMS)
  - Distributed Computing & Networking Protocols
- **Continuous Self-Directed Mastery:**
  - Deep shader programming in GLSL and Three.js
  - Go concurrent goroutine pipelines and real-time streaming architectures
  - WebGL performance profiling and memory leak elimination

Rick pairs structured computer science theory with over **6 years of battle-tested production engineering** and 35+ shipped products.`
    };
  }

  // 3. Projects / Client Work / Case Studies
  if (
    q.includes('project') || 
    q.includes('work') || 
    q.includes('build') || 
    q.includes('client') || 
    q.includes('portfolio') || 
    q.includes('configurator') || 
    q.includes('synapse') || 
    q.includes('telemetry') || 
    q.includes('flamegraph') || 
    q.includes('kroma')
  ) {
    return {
      category: 'projects',
      reply: `### Rick Barat's Featured Engineering Projects & Client Work:

Over **6+ years of engineering**, Rick has shipped **35+ production applications** across 3D WebGL, distributed cloud telemetry, and modern web architectures:

1. **3D Product Visualizers & WebGL Configurators (2024–Present)**
   - **Clients:** Indian D2C Brands & Global E-Commerce
   - **Stack:** Three.js, React Three Fiber, GLSL Shaders, Draco Compression, Razorpay/UPI integration.
   - **Impact:** Drove a verified **3.4x conversion lift** with instantaneous material customizations and rock-solid 60fps browser rendering.

2. **Distributed Telemetry & Flamegraph Engine (2023–2024)**
   - **Company:** Synapse Cloud Systems (US)
   - **Stack:** React, TypeScript, Next.js, Go, WebSockets, HTML5 Canvas.
   - **Impact:** Engineered custom canvas flamegraphs parsing **500,000 trace spans at 60fps** while maintaining **98+ Lighthouse performance scores**.

3. **Bespoke 3D Luxury & Interactive Experiences (2022–2023)**
   - **Agencies:** Studio Kroma & Apex Interactive
   - **Stack:** React Three Fiber, GSAP timeline choreography, custom post-processing shaders.
   - **Impact:** Delivered 14+ immersive digital experiences for luxury real estate and creative brands.

4. **Scalable Design Systems & Enterprise Platforms (2020–2022)**
   - **Company:** NextWave Digital Tech
   - **Stack:** React, Next.js, TypeScript, Tailwind CSS, Node.js.
   - **Impact:** Built and maintained modular UI component libraries serving 20+ responsive web platforms.

*You can test the interactive 3D WebGL laboratory and project cards right on this page!*`
    };
  }

  // 4. Skills / Technical Stack / Technologies
  if (
    q.includes('skill') || 
    q.includes('stack') || 
    q.includes('tech') || 
    q.includes('language') || 
    q.includes('framework') || 
    q.includes('three') || 
    q.includes('webgl') || 
    q.includes('shader') || 
    q.includes('glsl') || 
    q.includes('react') || 
    q.includes('golang') || 
    q.includes('node')
  ) {
    return {
      category: 'skills',
      reply: `### Rick Barat's Core Technical Stack & Specializations:

1. **3D & Creative Web Engineering:**
   - **Core:** Three.js, React Three Fiber (R3F), WebGL, GLSL custom fragment/vertex shaders.
   - **Optimization:** Draco 3D mesh compression, LOD (Level of Detail) meshes, frustum culling, PBR materials.
   - **Motion:** GSAP timeline animations, scroll-linked camera interpolation.

2. **Frontend Architecture:**
   - React 19, TypeScript, Next.js, Tailwind CSS, HTML5 Canvas, Web Audio API, state machines.

3. **Backend & Scalable APIs:**
   - Node.js, Express, Go (Golang), PostgreSQL, Redis caching and pub/sub, WebSockets.

4. **AI & Agent Integrations:**
   - Google Gemini API, LangChain, vector embeddings, client-server proxy security architectures.

All applications are engineered with strict performance budgets, zero layout shifts (CLS), and fluid 60fps rendering across desktop and mobile devices.`
    };
  }

  // 5. Recruiter Persona
  if (persona === 'recruiter' || q.includes('recruit') || q.includes('candidate') || q.includes('why hire') || q.includes('strengths')) {
    return {
      category: 'recruiter',
      reply: `### Candidate Summary for Recruiters & Hiring Managers:

- **Candidate:** Rick Barat
- **Role Targets:** Senior Full Stack Engineer, Frontend Lead, 3D Creative Engineer, WebGL Specialist.
- **Experience:** 6+ years of full-stack engineering shipping 35+ products for US tech companies, Indian D2C enterprises, and international creative agencies.
- **Education:** Bachelor of Computer Applications (BCA) from Techno India University, Kolkata.
- **Key Differentiators:**
  - Dual expertise in creative 3D WebGL engineering and high-throughput backend infrastructure.
  - Demonstrated conversion metrics (e.g. 3.4x lift for e-commerce configurators).
  - Proven track record in high-velocity remote teams across US and Indian timezones.
- **Direct Contact:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com) | Instagram: [@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)`
    };
  }

  // 6. Architect Persona / Deep Technical
  if (persona === 'architect' || q.includes('architecture') || q.includes('system design') || q.includes('performance') || q.includes('optimization')) {
    return {
      category: 'architect',
      reply: `### Technical Architecture & Optimization Principles:

1. **WebGL & Three.js 60fps Render Pipelines:**
   - Shared geometry & material pooling to eliminate GPU texture re-allocation spikes.
   - Dynamic render loops with dirty-flag checking: render only when models animate or cursor interacts.
   - Draco decompression workers running off the main thread to prevent thread blocking during 3D asset load.

2. **Large-Scale Data Visualization:**
   - Built canvas flamegraphs parsing 500,000 trace spans using virtualized coordinate projection.
   - OffscreenCanvas rendering coupled with Web Workers for binary trace decompression.

3. **Full-Stack Resilience:**
   - Server-proxied AI endpoints with runtime key resolution and multi-tier model fallbacks.
   - Complete local offline intelligence fallbacks ensuring zero user-facing 404 or 500 crashes.`
    };
  }

  // 7. General Default Introduction
  return {
    category: 'general',
    reply: `### Hello! I am Rick Barat's AI Portfolio Assistant.

I have complete knowledge of Rick's **6+ years of engineering experience**, **35+ shipped products**, **BCA degree from Techno India University, Kolkata**, and his full technical stack.

**What would you like to explore?**
- **Client Projects:** Ask about his 3D WebGL product configurators or Synapse cloud telemetry flamegraphs.
- **Technical Stack:** Inquire about his Three.js shader pipelines, React 19 architecture, or Go backends.
- **Education & Background:** Learn about his BCA degree from Techno India University and computer science foundations.
- **Hiring & Availability:** Ask about full-time opportunities, contracts, or email him directly at [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com).

Feel free to ask any question!`
  };
}
