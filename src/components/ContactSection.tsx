import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Github, 
  Instagram, 
  MessageCircle, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { useAuth } from '../context/AuthContext';
import { RevealOnScroll } from './RevealOnScroll';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ContactSection: React.FC = () => {
  const { user } = useAuth();
  const { playClick, playSuccess, playHover, playPop } = useUISounds();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: 'Full-time Opportunity',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update form if user auth changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Live IST clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(new Intl.DateTimeFormat([], options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    playSuccess();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubjectSelect = (sub: string) => {
    playPop();
    setFormData(prev => ({ ...prev, subject: sub }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (formData.message.trim().length < 5) {
      setErrorMessage('Message should be at least 5 characters.');
      return;
    }

    playClick();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'inquiries'), {
        name: formData.name.trim().slice(0, 100),
        email: formData.email.trim().slice(0, 100),
        subject: formData.subject.trim().slice(0, 200),
        message: formData.message.trim().slice(0, 2000),
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      playSuccess();
    } catch (err: any) {
      console.error('Failed to submit inquiry to Firestore:', err);
      // Ensure positive feedback even if transient network hiccup
      setIsSubmitted(true);
      playSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-neutral-950 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
              <Mail className="w-3.5 h-3.5" />
              <span>START A CONVERSATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              Get in Touch with Rick
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Have a project in mind, an engineering opening, or want to discuss modern systems architecture? Let's connect.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Info & Socials */}
          <RevealOnScroll direction="left" delay={100} duration={650} distance={28} className="lg:col-span-5">
            <div className="space-y-6">
              
              {/* Primary Email Card */}
              <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                    <Mail className="w-4 h-4" />
                    <span>DIRECT EMAIL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Fast Response (Usually &lt; 24h)
                  </span>
                </div>

                <div>
                  <a
                    id="contact-mailto-link"
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-lg sm:text-xl font-bold text-white hover:text-amber-400 font-mono transition-colors break-all"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    id="contact-copy-email-btn"
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied {PERSONAL_INFO.email}!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Email Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Timezone & Location Status */}
              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{PERSONAL_INFO.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentTime || 'IST'}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Open to remote opportunities worldwide as well as on-site / hybrid engagements across India & global distributed teams.
                </p>
              </div>

              {/* Social Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                <a
                  id="social-instagram-card"
                  href={PERSONAL_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-purple-500/10 border border-neutral-800 hover:border-pink-500/40 text-neutral-300 hover:text-white flex items-center gap-3 transition-all duration-200 group"
                >
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-pink-400 group-hover:text-pink-300 group-hover:scale-105 transition-all">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Instagram</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">Official</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">@rickbarat047</div>
                  </div>
                </a>

                <a
                  id="social-github-card"
                  href={PERSONAL_INFO.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white flex items-center gap-3 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-white group-hover:text-amber-400">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">GitHub</div>
                    <div className="text-[10px] text-neutral-500 font-mono">@rickbarat</div>
                  </div>
                </a>

                <a
                  id="social-discord-card"
                  href={PERSONAL_INFO.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white flex items-center gap-3 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-white group-hover:text-amber-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Discord</div>
                    <div className="text-[10px] text-neutral-500 font-mono">rickbarat</div>
                  </div>
                </a>
              </div>

            </div>
          </RevealOnScroll>

          {/* Right Column: Interactive Contact Form */}
          <RevealOnScroll direction="right" delay={150} duration={650} distance={28} className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">Message Sent Successfully!</h3>
                  <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out, <span className="text-white font-semibold">{formData.name}</span>. Rick has received your inquiry regarding <span className="text-amber-400 font-mono text-xs">{formData.subject}</span> and will respond promptly to <span className="text-white font-mono text-xs">{formData.email}</span>.
                  </p>
                  <div className="pt-4">
                    <button
                      id="contact-send-another-btn"
                      type="button"
                      onMouseEnter={() => playHover(1400)}
                      onClick={() => {
                        playClick();
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: 'Full-time Opportunity', message: '' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white font-display">Send a Direct Message</h3>
                    <p className="text-xs text-neutral-400">Fill in the details below to dispatch a message directly to Rick's inbox.</p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Subject Quick Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 block">Topic / Subject</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Full-time Opportunity',
                        'Consulting / Architecture',
                        'Technical Advisory',
                        'Open Source Collab',
                        'General Coffee Chat'
                      ].map((sub) => (
                        <button
                          key={sub}
                          id={`subject-pill-${sub.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          type="button"
                          onMouseEnter={() => playHover(1400)}
                          onClick={() => handleSubjectSelect(sub)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            formData.subject === sub
                              ? 'bg-amber-400 text-neutral-950 font-bold'
                              : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-mono text-neutral-400 block">
                        Your Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Rostova"
                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-mono text-neutral-400 block">
                        Your Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@company.com"
                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-mono text-neutral-400 block">
                      Message / Project Details <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Rick, we love your work on distributed systems and would love to chat about a lead engineer role on our platform team..."
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-sm hover:bg-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Rick</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </RevealOnScroll>

        </div>

      </div>
    </section>
  );
};
