import React, { useState, useEffect } from 'react';
import { 
  MessageSquareQuote, 
  Star, 
  Send, 
  Trash2, 
  LogIn, 
  MessageCircle, 
  Sparkles, 
  User as UserIcon,
  Clock
} from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';
import { RevealOnScroll } from './RevealOnScroll';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';

interface GuestbookEntry {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  message: string;
  createdAt?: any;
}

export const Testimonials: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time Firestore Guestbook listener
  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(16)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: GuestbookEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            authorId: data.authorId,
            authorName: data.authorName,
            authorPhoto: data.authorPhoto || null,
            message: data.message,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          };
        });
        setEntries(loaded);
      },
      (error) => {
        console.error('Error fetching guestbook:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      signInWithGoogle();
      return;
    }

    const text = newComment.trim();
    if (text.length < 2) {
      setErrorMsg('Please write at least 2 characters.');
      return;
    }
    if (text.length > 500) {
      setErrorMsg('Maximum character limit is 500.');
      return;
    }

    playClickSound();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'guestbook'), {
        authorId: user.uid,
        authorName: user.displayName || 'Visitor',
        authorPhoto: user.photoURL || null,
        message: text,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      playSuccessChime();
    } catch (err: any) {
      console.error('Failed to post guestbook entry:', err);
      setErrorMsg('Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    playClickSound();
    try {
      await deleteDoc(doc(db, 'guestbook', entryId));
      playSuccessChime();
    } catch (err) {
      console.error('Failed to delete guestbook entry:', err);
    }
  };

  return (
    <section id="testimonials" className="py-28 bg-neutral-950 relative border-t border-neutral-800/80 overflow-hidden">
      {/* Full-bleed cinematic video animation behind What Leaders & Teams Say */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none select-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Subtle darkening and gradient feather at top and bottom to seamlessly merge with adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/40 to-neutral-950 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>ENDORSEMENTS & COLLABORATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              What Leaders & Teams Say
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Feedback from engineering leaders, product managers, and founders who have collaborated with Rick.
            </p>
          </div>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TESTIMONIALS.map((t, idx) => (
            <RevealOnScroll
              key={t.id}
              direction="up"
              delay={idx * 120}
              duration={650}
              distance={28}
              className="h-full"
            >
              <div
                id={`testimonial-card-${t.id}`}
                className="p-6 sm:p-7 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/15 flex flex-col justify-between space-y-6 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 h-full"
              >
                {/* Quote text */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author info */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-amber-400 font-mono">{t.role}, {t.company}</p>
                    <p className="text-[11px] text-neutral-500">{t.relation}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Live Community Guestbook Subsection */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Realtime Community Guestbook</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Leave a Note or Greeting
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Signed entries are stored persistently in Google Cloud Firestore in real time.
                </p>
              </div>

              {!user ? (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign in with Google to Post</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Posting as {user.displayName?.split(' ')[0] || 'User'}</span>
                </div>
              )}
            </div>

            {/* Post Input Form */}
            {user ? (
              <form onSubmit={handleSubmitEntry} className="space-y-3">
                <div className="relative">
                  <textarea
                    id="guestbook-input-message"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave feedback, say hello, or share collaboration thoughts (2-500 chars)..."
                    maxLength={500}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-neutral-950/80 border border-neutral-800 focus:border-amber-400/80 p-4 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-500">
                    {newComment.length}/500
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>
                )}

                <div className="flex justify-end">
                  <button
                    id="guestbook-submit-btn"
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Posting...' : 'Sign Guestbook'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-neutral-950/60 border border-dashed border-neutral-800 text-center space-y-3">
                <p className="text-xs sm:text-sm text-neutral-400">
                  Want to leave a note on Rick's public guestbook? Sign in with your Google account in one click.
                </p>
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all shadow-md"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </div>
            )}

            {/* List of Entries */}
            <div className="space-y-3 pt-2">
              {entries.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-neutral-500">
                  No guestbook notes yet. Be the first visitor to leave a greeting!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex flex-col justify-between space-y-3"
                    >
                      <p className="text-xs text-neutral-200 leading-relaxed break-words">
                        "{entry.message}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[11px]">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {entry.authorPhoto ? (
                            <img
                              src={entry.authorPhoto}
                              alt={entry.authorName}
                              className="w-5 h-5 rounded-full object-cover border border-amber-400/40"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                              {entry.authorName[0]}
                            </div>
                          )}
                          <span className="font-bold text-neutral-300 truncate">
                            {entry.authorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {entry.createdAt && (
                            <span className="text-[10px] font-mono text-neutral-500">
                              {entry.createdAt instanceof Date 
                                ? entry.createdAt.toLocaleDateString()
                                : 'Recent'}
                            </span>
                          )}

                          {user && user.uid === entry.authorId && (
                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 rounded transition-colors"
                              title="Delete your entry"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
