import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { SkillsMatrix } from './components/SkillsMatrix';
import { InteractiveLab } from './components/InteractiveLab';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { CommandMenu } from './components/CommandMenu';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgress } from './components/ScrollProgress';
import { RevealOnScroll } from './components/RevealOnScroll';
import { playClickSound } from './utils/soundEffects';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  // Ensure the page always starts cleanly at the top on initial load/refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  // Keyboard shortcut for Command Menu (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        playClickSound(800);
        setIsCommandMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track active section for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'skills', 'lab', 'terminal', 'experience', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <div 
        className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 antialiased font-sans relative overflow-x-hidden"
      >
        {/* Scroll Progress Bar at the Top */}
        <ScrollProgress />

        {/* Fixed Floating Frosted-Glass Navbar */}
        <Navbar 
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onOpenResume={() => setIsResumeModalOpen(true)}
          activeSection={activeSection}
        />

        {/* Main Content Sections */}
        <main className="relative z-10">
          {/* Full-Screen Hero Section with Cursor Spotlight Reveal */}
          <Hero 
            onOpenResume={() => setIsResumeModalOpen(true)}
            onNavigateTo={handleNavigateTo}
          />

          {/* Featured Projects Portfolio with prmpt archive scroll-scale animation */}
          <FeaturedProjects />

          {/* Technical Skills & Architecture Matrix */}
          <RevealOnScroll direction="up" delay={40}>
            <SkillsMatrix />
          </RevealOnScroll>

          {/* 3D WebGL & Interactive Graphics Lab */}
          <RevealOnScroll direction="up" delay={40} scale={0.97}>
            <InteractiveLab />
          </RevealOnScroll>

          {/* Interactive UNIX Shell / Terminal Sandbox */}
          <RevealOnScroll direction="up" delay={40}>
            <InteractiveTerminal />
          </RevealOnScroll>

          {/* Professional Experience & Enterprise Milestones */}
          <RevealOnScroll direction="up" delay={40}>
            <ExperienceTimeline />
          </RevealOnScroll>

          {/* Client Testimonials & Endorsements ("What Leaders & Teams Say" with requested video animation) */}
          <RevealOnScroll direction="up" delay={40}>
            <Testimonials />
          </RevealOnScroll>

          {/* Contact & Consultation Hub */}
          <RevealOnScroll direction="up" delay={40}>
            <ContactSection />
          </RevealOnScroll>
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive AI Portfolio Assistant with Search Grounding */}
        <GeminiChatbot />

        {/* Command Palette (⌘K) Modal */}
        <CommandMenu 
          isOpen={isCommandMenuOpen}
          onClose={() => setIsCommandMenuOpen(false)}
          onOpenResume={() => {
            setIsCommandMenuOpen(false);
            setIsResumeModalOpen(true);
          }}
          onNavigateTo={handleNavigateTo}
        />

        {/* Full Resume & Credentials Viewer Modal */}
        <ResumeModal 
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}
