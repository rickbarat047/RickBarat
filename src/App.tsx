/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { CommandMenu } from './components/CommandMenu';
import { ResumeModal } from './components/ResumeModal';
import { playClickSound } from './utils/soundEffects';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  // Active section scroll spy
  useEffect(() => {
    const sections = ['projects', 'skills', 'lab', 'terminal', 'experience', 'testimonials', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateTo = (sectionId: string) => {
    playClickSound();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 relative">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero
          onOpenResume={() => setIsResumeOpen(true)}
          onNavigateTo={handleNavigateTo}
        />

        <FeaturedProjects />

        <SkillsMatrix />

        <InteractiveLab />

        <InteractiveTerminal />

        <ExperienceTimeline />

        <Testimonials />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* ⌘K Spotlight Command Palette */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigateTo={handleNavigateTo}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Curriculum Vitae / Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

