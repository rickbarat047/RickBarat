/**
 * Verified Portfolio Intelligence Knowledge Engine for Rick Barat
 * Provides instantaneous, accurate, contextual answers about Rick's engineering background,
 * 3D WebGL projects, distributed systems experience, education, and contact options.
 * Used on both client-side and server-side to guarantee 100% uptime with zero static repetition.
 */

export interface PortfolioKnowledgeResponse {
  reply: string;
  category: 'greeting' | 'about' | 'projects' | 'education' | 'skills' | 'contact' | 'experience' | 'rates' | 'architect' | 'recruiter' | 'testimonials' | 'general';
}

export function generatePortfolioKnowledge(query: string, persona: string = 'general'): PortfolioKnowledgeResponse {
  const rawQ = query || '';
  const q = rawQ.toLowerCase().trim();

  // 1. Greetings & Pleasantries
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'hey there' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('good morning') ||
    q.includes('good afternoon') ||
    q.includes('good evening') ||
    q.includes('how are you') ||
    q.includes('whats up') ||
    q.includes("what's up") ||
    q.includes('who are you') ||
    q.includes('introduce yourself') ||
    q.includes('what can you do') ||
    q.includes('help me')
  ) {
    return {
      category: 'greeting',
      reply: `### Hello and welcome! 👋

I am **Rick Barat's AI Portfolio Twin**. I'm here to provide you with instant, detailed insights into Rick's career, projects, and technical skills.

**Here are a few things you can ask me about:**
- **🚀 Featured Projects:** Inquire about his *3D WebGL Product Visualizers* (which drove a 3.4x conversion lift) or his *Synapse Cloud distributed telemetry engine* (parsing 500k trace spans at 60fps).
- **🛠️ Technical Stack:** Ask about his mastery of **Three.js / WebGL / GLSL shaders**, **React 19 & TypeScript**, **Go & Node.js scalable backends**, or **Gemini AI agent integrations**.
- **🎓 Education:** Learn about his **Bachelor of Computer Applications (BCA)** from **Techno India University, Kolkata**.
- **💼 Work Experience:** Explore his 6+ years of engineering experience across US tech companies, Indian D2C enterprises, and creative studios.
- **📬 Hiring & Contact:** Inquire about full-time roles, remote contracts, consulting rates, or reach him directly at **[rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)**.

What would you like to explore first?`
    };
  }

  // 2. Contact / Hiring / Availability / Rates / Resume
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
    q.includes('salary') || 
    q.includes('freelance') || 
    q.includes('contract') || 
    q.includes('instagram') || 
    q.includes('reach') || 
    q.includes('message') || 
    q.includes('talk') || 
    q.includes('call') || 
    q.includes('resume') || 
    q.includes('cv') ||
    q.includes('location') ||
    q.includes('where are you') ||
    q.includes('where is rick') ||
    q.includes('timezone') ||
    q.includes('based')
  ) {
    return {
      category: 'contact',
      reply: `### 📬 Getting in Touch & Working with Rick Barat:

Rick is actively open to **Senior Full-Stack Engineering roles**, **Remote Worldwide Contracts**, and **Bespoke 3D WebGL / Three.js Consultancy**.

#### 📞 Direct Contact Channels:
- **Email:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com) *(Preferred — rapid response within 24 hours)*
- **Instagram:** [@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)
- **GitHub:** [github.com](https://github.com)
- **Location:** Kolkata, India (IST, UTC+5:30) with flexible overlapping working hours for US, UK, and European teams.

#### 💼 Engagement Models:
1. **Full-Time Positions:** Senior Full Stack Engineer, Frontend Lead, 3D WebGL Developer.
2. **Project Contracts / Consultancy:** End-to-end 3D product visualizers, performance optimization audits, and high-throughput dashboard development.
3. **Verified Resume:** You can view and download Rick's full verified resume by clicking the **Resume** button in the top navigation bar.

Feel free to send an email to [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com) with your project scope or job requirements!`
    };
  }

  // 3. Education / University / Degree / Academic Qualifications
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
    q.includes('studies') || 
    q.includes('academic') || 
    q.includes('qualification') || 
    q.includes('graduat') || 
    q.includes('courses')
  ) {
    return {
      category: 'education',
      reply: `### 🎓 Rick Barat's Educational Background:

- **Degree:** Bachelor of Computer Applications (**BCA**)
- **Institution:** **Techno India University**, Kolkata, India
- **Core Academic Disciplines:**
  - **Data Structures & Algorithms (DSA):** Algorithmic complexity, tree/graph traversals, cache optimization.
  - **Computer Graphics & Linear Algebra:** 3D matrix transformations, projection mathematics, vector calculations, and vertex shader pipelines.
  - **Database Management Systems (RDBMS):** Relational schema design, SQL optimization, ACID compliance, and indexing.
  - **Software Engineering & Distributed Systems:** Object-oriented design patterns, networking protocols (TCP/UDP/WebSockets), and microservice architectures.

#### Continuous Engineering Mastery:
Beyond his university degree, Rick has dedicated thousands of hours to advanced production specializations:
- **Low-level WebGL & GLSL shader development**
- **Go concurrent worker pipelines and real-time streaming engines**
- **GPU memory lifecycle profiling and Draco mesh decompression**

Rick combines rigorous computer science fundamentals with over **6 years of production-grade commercial software engineering**.`
    };
  }

  // 4. 3D WebGL / Three.js / Creative Technology Specifics
  if (
    q.includes('three') || 
    q.includes('three.js') || 
    q.includes('threejs') || 
    q.includes('webgl') || 
    q.includes('shader') || 
    q.includes('shaders') || 
    q.includes('glsl') || 
    q.includes('draco') || 
    q.includes('3d') || 
    q.includes('r3f') || 
    q.includes('react three fiber') || 
    q.includes('canvas') || 
    q.includes('gsap') || 
    q.includes('animation') || 
    q.includes('blender') || 
    q.includes('interactive')
  ) {
    return {
      category: 'skills',
      reply: `### 🔮 3D WebGL & Creative Web Engineering:

Rick is a recognized specialist in bridging high-fidelity 3D graphics with standard web applications, maintaining a strict **60fps performance budget** across all devices.

#### Core 3D Capabilities:
- **Frameworks:** Three.js, React Three Fiber (R3F), Drei, WebGL 2.0 API.
- **Custom Shaders (GLSL):** Vertex and fragment shaders for procedural noise, holographic visual effects, dynamic lighting, and post-processing passes (Bloom, Chromatic Aberration).
- **Optimization & Compression:** Draco 3D geometry compression (reducing 40MB models down to <2MB), Level-of-Detail (LOD) switching, GPU instancing, texture mipmapping, and frustum culling.
- **Choreography:** GSAP timeline integration, scroll-linked camera paths, and custom physics simulation.
- **Commercial Track Record:** Built interactive 3D product visualizers for Indian D2C e-commerce brands, driving a **3.4x average conversion lift** over static product photography.

*You can interact with Rick's live 3D WebGL Laboratory directly on this page to test real-time shader controls!*`
    };
  }

  // 5. Frontend & Full-Stack Technologies (React, TypeScript, Next.js, Go, Node)
  if (
    q.includes('react') || 
    q.includes('next') || 
    q.includes('typescript') || 
    q.includes('tailwind') || 
    q.includes('node') || 
    q.includes('golang') || 
    q.includes('go') || 
    q.includes('postgres') || 
    q.includes('redis') || 
    q.includes('sql') || 
    q.includes('backend') || 
    q.includes('frontend') || 
    q.includes('stack') || 
    q.includes('tech') || 
    q.includes('skill') || 
    q.includes('tools') || 
    q.includes('languages') || 
    q.includes('framework')
  ) {
    return {
      category: 'skills',
      reply: `### 🛠️ Rick Barat's Complete Technical Stack:

#### 1. Frontend Architecture:
- **Languages & Frameworks:** React 19, Next.js (App Router), TypeScript, JavaScript (ESNext).
- **Styling & Motion:** Tailwind CSS v4, Motion (Framer Motion), GSAP, Radix UI.
- **Performance:** Zero-layout-shift (CLS) architectures, dynamic code splitting, sub-second initial load, 98+ Google Lighthouse scores.

#### 2. Backend & Distributed Systems:
- **Engines:** Node.js (Express, Fastify), Go (Golang concurrent worker pools).
- **Databases & Caching:** PostgreSQL, Redis (pub/sub & in-memory caching), MongoDB, Firebase Firestore.
- **Real-Time Communications:** WebSockets, Server-Sent Events (SSE), WebRTC.

#### 3. 3D & Creative Engineering:
- Three.js, React Three Fiber, GLSL Shaders, WebGL, HTML5 Canvas 2D/3D.

#### 4. AI & Agent Integration:
- Google Gemini API (@google/genai SDK), LangChain, vector embeddings, secure server API proxy architectures.

Every application Rick engineers is backed by clean TypeScript typing, automated CI/CD pipelines, and zero-compromise security.`
    };
  }

  // 6. Specific Projects & Case Studies
  if (
    q.includes('project') || 
    q.includes('work') || 
    q.includes('case stud') || 
    q.includes('portfolio') || 
    q.includes('built') || 
    q.includes('shipped') || 
    q.includes('synapse') || 
    q.includes('flamegraph') || 
    q.includes('telemetry') || 
    q.includes('d2c') || 
    q.includes('configurator') || 
    q.includes('kroma') || 
    q.includes('apex') || 
    q.includes('nextwave')
  ) {
    return {
      category: 'projects',
      reply: `### 🚀 Rick Barat's Key Projects & Commercial Impact:

Over **6+ years**, Rick has shipped **35+ production applications**. Here are four highlighted case studies:

#### 1. 3D Product Visualizers & WebGL Configurators (2024–Present)
- **Sector:** Indian D2C & Global E-Commerce
- **Technology:** Three.js, React Three Fiber, GLSL Shaders, Draco Compression, Razorpay/UPI Checkout.
- **Impact:** Achieved a verified **3.4x conversion lift** by allowing customers to inspect materials, finishings, and dimensions in photorealistic real-time 3D.

#### 2. Distributed Telemetry & Flamegraph Engine (2023–2024)
- **Company:** Synapse Cloud Systems (US)
- **Technology:** React, TypeScript, Next.js, Go, WebSockets, HTML5 Canvas.
- **Impact:** Engineered custom canvas flamegraphs capable of parsing **500,000 trace spans at 60fps** with **98+ Lighthouse scores**.

#### 3. Bespoke Luxury Interactive Web Experiences (2022–2023)
- **Agencies:** Studio Kroma & Apex Interactive
- **Technology:** React Three Fiber, GSAP camera choreographies, custom post-processing shaders.
- **Impact:** Delivered 14+ immersive digital experiences for luxury brands and architectural studios.

#### 4. Scalable Enterprise Design Systems (2020–2022)
- **Company:** NextWave Digital Tech
- **Technology:** React, Next.js, TypeScript, Tailwind CSS, Node.js.
- **Impact:** Built and maintained modular UI component libraries serving 20+ responsive web platforms.`
    };
  }

  // 7. Work Experience & Career Timeline
  if (
    q.includes('experience') || 
    q.includes('career') || 
    q.includes('milestone') || 
    q.includes('job') || 
    q.includes('history') || 
    q.includes('company') || 
    q.includes('companies') || 
    q.includes('years') || 
    q.includes('senior') || 
    q.includes('role')
  ) {
    return {
      category: 'experience',
      reply: `### 💼 Rick Barat's Work Experience & Career Path:

Rick brings **6+ years of verified production engineering** across tech scale-ups and creative agencies:

1. **Lead 3D & Full-Stack Consultant (2024 – Present)**
   - *Independent Consultancy & Indian D2C Brands*
   - Architected 3D WebGL product configurators with Razorpay/UPI checkout, driving a **3.4x average conversion lift**.

2. **Senior Full Stack Engineer (2023 – 2024)**
   - *Synapse Cloud Systems (US SaaS)*
   - Built distributed telemetry engines parsing 500k trace spans at 60fps on HTML5 Canvas.

3. **Creative Technologist & 3D Web Developer (2022 – 2023)**
   - *Studio Kroma & Apex Interactive*
   - Delivered 14+ bespoke 3D interactive web experiences for luxury real estate and global creative brands.

4. **Frontend Engineer & Design System Specialist (2020 – 2022)**
   - *NextWave Digital Tech*
   - Spearheaded reusable UI libraries across 20+ high-traffic web platforms.

For a full breakdown of milestones, deliverables, and tech stacks, check the **Work Experience & Milestones** section on this page!`
    };
  }

  // 8. Testimonials & Client Feedback
  if (
    q.includes('testimonial') || 
    q.includes('feedback') || 
    q.includes('review') || 
    q.includes('recommend') || 
    q.includes('leader') || 
    q.includes('team say') || 
    q.includes('endorse')
  ) {
    return {
      category: 'testimonials',
      reply: `### 🌟 What Engineering Leaders & Clients Say About Rick Barat:

- **VP of Engineering (Synapse Cloud Systems):**
  > *"Rick rebuilt our distributed tracing interface from scratch. Rendering 500,000 trace spans in browser canvas at 60fps without lag seemed impossible until Rick implemented his custom spatial partitioning algorithm. Incredible engineer."*

- **Co-Founder & CEO (Indian D2C Brand):**
  > *"Our conversion rate jumped 3.4x within 45 days of launching Rick's 3D WebGL product configurator. He handled everything from 3D shaders down to Razorpay checkout integration."*

- **Creative Director (Studio Kroma):**
  > *"Rick is that rare creative technologist who possesses deep low-level graphics mastery while writing pristine, clean TypeScript."*`
    };
  }

  // 9. About Rick / Overview / Bio
  if (
    q.includes('about') || 
    q.includes('who is') || 
    q.includes('tell me about') || 
    q.includes('bio') || 
    q.includes('profile') || 
    q.includes('story') || 
    q.includes('summary') || 
    q.includes('overview')
  ) {
    return {
      category: 'about',
      reply: `### 👨‍💻 About Rick Barat:

**Rick Barat** is a **Full Stack Engineer and Creative Technologist** with over **6 years of commercial production experience** and **35+ shipped digital products**.

#### Highlights:
- **Location:** Kolkata, India (IST, UTC+5:30) — working remotely with teams worldwide.
- **Education:** Bachelor of Computer Applications (**BCA**) from **Techno India University, Kolkata**.
- **Core Specialty:** Combining high-throughput backend systems (Go, Node.js, PostgreSQL, Redis) with immersive, high-performance 3D graphics (Three.js, WebGL, GLSL, React 19).
- **Track Record:** Trusted by US SaaS companies (Synapse Cloud), Indian D2C enterprises, and international digital studios.
- **Contact:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com) | Instagram: [@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)`
    };
  }

  // 10. Recruiter Persona Specific
  if (persona === 'recruiter') {
    return {
      category: 'recruiter',
      reply: `### 🎯 Candidate Brief for Recruiters & Hiring Managers:

- **Candidate:** Rick Barat
- **Target Roles:** Senior Full Stack Engineer, Frontend Lead, 3D WebGL Specialist, Creative Technologist.
- **Experience Level:** 6+ years commercial experience, 35+ shipped production products.
- **Education:** BCA from Techno India University, Kolkata.
- **Key Strengths:**
  - Full-stack capability from low-level GLSL shaders up to Go/Node.js backend architectures.
  - Demonstrated commercial ROI (3.4x conversion lift, 500k span 60fps telemetry dashboards).
  - Excellent remote team communication across US, European, and Asian timezones.
- **Direct Inquiries:** [rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)`
    };
  }

  // 11. Architect Persona Specific
  if (persona === 'architect') {
    return {
      category: 'architect',
      reply: `### 📐 Technical Architecture & Optimization Deep-Dive:

1. **WebGL 60fps Render Loop Optimization:**
   - Dirty-flag checking to prevent redundant frame rendering when the canvas is idle.
   - Draco mesh decompression executed inside background Web Workers.
   - GPU geometry & material pooling to prevent garbage collection spikes.

2. **High-Throughput Distributed Telemetry:**
   - Spatial binary search trees for fast spatial indexing over 500,000 trace spans.
   - OffscreenCanvas rendering for silky-smooth 60fps pan/zoom interactions.

3. **Backend Scalability:**
   - Go concurrent worker pools for streaming ingestion and Redis cache layering for sub-10ms query responses.`
    };
  }

  // 12. Context-Aware Fallback for Any Other Query
  // Rather than a single static greeting, intelligently reference what the user asked
  const sanitizedSnippet = q.slice(0, 50);
  return {
    category: 'general',
    reply: `### Regarding your question about "${sanitizedSnippet}":

Rick Barat is a **Full Stack Engineer & Creative Technologist** with **6+ years of experience**, a **BCA degree from Techno India University, Kolkata**, and a portfolio of **35+ shipped applications**.

Here is how Rick's expertise connects to your inquiry:
- **💻 Technical Mastery:** Specialized in **React 19, TypeScript, Three.js / WebGL shaders, Go, and Node.js**.
- **🚀 Real-World Impact:** Delivered 3D product visualizers with a **3.4x conversion lift** and high-throughput telemetry dashboards parsing 500k spans at 60fps.
- **📬 Direct Access:** For specific requirements, custom contracts, or full-time opportunities, reach Rick directly at **[rickbarat21@gmail.com](mailto:rickbarat21@gmail.com)** or via Instagram at **[@rickbarat047](https://www.instagram.com/rickbarat047/?hl=en)**.

Feel free to ask about his specific projects, tech stack, or career milestones!`
  };
}
