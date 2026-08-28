import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  User, 
  Zap, 
  Cpu, 
  Briefcase, 
  Copy, 
  Check, 
  ArrowUpRight,
  MessageSquare,
  Globe,
  ExternalLink,
  Cloud,
  CloudCheck,
  LogIn
} from 'lucide-react';
import Markdown from 'react-markdown';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs, 
  limit, 
  writeBatch,
  doc
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  sources?: { title: string; uri: string }[];
  searchQueries?: string[];
  hasSearchGrounding?: boolean;
}

interface GeminiChatbotProps {
  isOpenExternal?: boolean;
  onToggleExternal?: (open: boolean) => void;
}

const SUGGESTED_PROMPTS = [
  "What 3D WebGL projects has Rick built for Indian clients?",
  "Tell me about Rick's BCA degree & tech background",
  "Is Rick available for full-time remote or contract roles?",
  "How does Rick optimize 3D Three.js website performance?",
  "What is new in Three.js and React 19 in 2025/2026?"
];

const ROLES = [
  {
    id: 'general',
    name: 'Rick AI Twin',
    description: 'Comprehensive assistant on projects, experience & background',
    defaultModel: 'gemini-3.5-flash',
    icon: Bot,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  },
  {
    id: 'architect',
    name: 'Tech Architect',
    description: 'Deep technical reasoning on WebGL, Three.js & systems',
    defaultModel: 'gemini-3.1-pro-preview',
    icon: Cpu,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  },
  {
    id: 'recruiter',
    name: 'Recruiter Matchmaker',
    description: 'Evaluates fit for full-stack, frontend & 3D developer roles',
    defaultModel: 'gemini-3.5-flash',
    icon: Briefcase,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  }
];

const MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: '3.5 Flash (Grounding)',
    tag: 'Search Grounded',
    icon: Sparkles,
    description: 'Real-time Google Search grounding enabled'
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Flash Lite',
    tag: 'Fast Tasks',
    icon: Zap,
    description: 'Ultra-low latency for quick queries'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: '3.1 Pro',
    tag: 'Complex Tasks',
    icon: Cpu,
    description: 'Advanced reasoning & technical breakdowns'
  }
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('general');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [searchGroundingEnabled, setSearchGroundingEnabled] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial welcome greeting
  const initialWelcomeMessage: ChatMessage = {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Hello! I'm **Rick's AI Twin**, powered by **Google Gemini 3.5 Flash** with **Google Search Grounding**. 

I have full context on Rick's **6+ years of full-stack engineering**, **3D WebGL / Three.js client projects for Indian and global brands**, **BCA degree from Techno India University**, and distributed systems work.

With **Search Grounding** active, I can also look up live web information, modern web specifications, framework updates, and real-time tech benchmarks.

How can I help you today? Feel free to pick a prompt below or ask your question!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelUsed: 'gemini-3.5-flash',
    hasSearchGrounding: true
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Load chat history from Firestore when user signs in
  useEffect(() => {
    async function loadFirestoreChatHistory() {
      if (!user) return;
      try {
        setIsHistoryLoading(true);
        const historyRef = collection(db, 'users', user.uid, 'chatHistory');
        const q = query(historyRef, orderBy('timestamp', 'asc'), limit(30));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const loadedMessages: ChatMessage[] = querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              role: data.role === 'model' ? 'assistant' : 'user',
              content: data.content,
              timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              modelUsed: data.modelUsed,
              hasSearchGrounding: data.hasSearchGrounding,
              sources: data.sources || [],
            };
          });

          setMessages([initialWelcomeMessage, ...loadedMessages]);
        }
      } catch (err) {
        console.error('Failed to load chat history from Firestore:', err);
      } finally {
        setIsHistoryLoading(false);
      }
    }

    loadFirestoreChatHistory();
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  const handleRoleChange = (roleId: string) => {
    playClickSound();
    setSelectedRole(roleId);
    const roleConfig = ROLES.find(r => r.id === roleId);
    if (roleConfig) {
      setSelectedModel(roleConfig.defaultModel);
    }
  };

  const handleClearHistory = async () => {
    playClickSound();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared! Ready for your next inquiry about Rick Barat's engineering background, client work, or tech stack.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        hasSearchGrounding: searchGroundingEnabled
      }
    ]);

    // If signed in, delete chat documents from Firestore
    if (user) {
      try {
        const historyRef = collection(db, 'users', user.uid, 'chatHistory');
        const querySnapshot = await getDocs(historyRef);
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error('Error clearing remote chat history:', err);
      }
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSuccessChime();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    playClickSound();
    const timestampNow = Date.now();
    const userMsg: ChatMessage = {
      id: `user-${timestampNow}`,
      role: 'user',
      content: queryText,
      timestamp: new Date(timestampNow).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Persist user message to Firestore if authenticated
    if (user) {
      addDoc(collection(db, 'users', user.uid, 'chatHistory'), {
        userId: user.uid,
        role: 'user',
        content: queryText,
        timestamp: timestampNow,
      }).catch((err) => console.error('Failed saving user message to Firestore:', err));
    }

    try {
      // Prepare conversation history for multi-turn chat
      const formattedHistory = newMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          model: selectedModel,
          rolePersona: selectedRole,
          searchGrounding: searchGroundingEnabled,
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyTimestamp = Date.now();
      const grounding = data.groundingMetadata;
      
      const assistantMsg: ChatMessage = {
        id: `ai-${replyTimestamp}`,
        role: 'assistant',
        content: data.reply || "I didn't receive a response. Please try again.",
        timestamp: new Date(replyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        hasSearchGrounding: Boolean(grounding?.hasSearchGrounding),
        sources: grounding?.sources || [],
        searchQueries: grounding?.searchQueries || [],
      };

      setMessages(prev => [...prev, assistantMsg]);
      playSuccessChime();

      // Persist assistant message to Firestore if authenticated
      if (user) {
        addDoc(collection(db, 'users', user.uid, 'chatHistory'), {
          userId: user.uid,
          role: 'model',
          content: assistantMsg.content,
          timestamp: replyTimestamp,
          modelUsed: assistantMsg.modelUsed,
          hasSearchGrounding: assistantMsg.hasSearchGrounding,
          sources: assistantMsg.sources || [],
        }).catch((err) => console.error('Failed saving assistant message to Firestore:', err));
      }

    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `I couldn't reach the Gemini API endpoint right now. You can also contact Rick directly at **${PERSONAL_INFO.email}** or on Instagram **[@rickbarat047](${PERSONAL_INFO.socials.instagram})**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div id="gemini-chatbot-root" className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="open-gemini-chat-btn"
          type="button"
          onClick={() => {
            playClickSound(1000);
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-3 p-3.5 sm:px-4 sm:py-3 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-amber-400/40 hover:border-amber-400 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105"
          aria-label="Open Rick Barat AI Assistant"
        >
          {/* Animated Glow Ring */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-cyan-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
          
          <div className="relative flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-neutral-950 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold font-display flex items-center gap-1.5">
                <span>Ask Rick AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <span>Gemini 3.5</span>
                <span>•</span>
                <span className="text-cyan-300">Search Grounded</span>
              </div>
            </div>

            <Sparkles className="w-4 h-4 text-amber-400 animate-spin group-hover:rotate-180 transition-transform duration-700" />
          </div>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div 
          id="gemini-chat-window"
          className={`bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl ${
            isExpanded 
              ? 'fixed inset-4 sm:inset-10 z-50' 
              : 'w-[92vw] sm:w-[460px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-500 flex items-center justify-center text-neutral-950 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-wide">Rick AI Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                  {user ? (
                    <span 
                      title="Authenticated with Google • Chat synced to Firestore" 
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1"
                    >
                      <Cloud className="w-2.5 h-2.5 text-amber-400" />
                      Firestore Synced
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/20 flex items-center gap-1 transition-colors"
                      title="Sign in with Google to persist chat history across visits"
                    >
                      <LogIn className="w-2.5 h-2.5 text-amber-400" />
                      Save Chat
                    </button>
                  )}
                </div>
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <span className="text-amber-300">gemini-3.5-flash</span>
                  <span>•</span>
                  <span className="text-cyan-400 flex items-center gap-0.5">
                    <Globe className="w-2.5 h-2.5" />
                    Google Search Grounded
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsExpanded(!isExpanded);
                }}
                title={isExpanded ? "Collapse window" : "Expand window"}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                id="close-gemini-chat-btn"
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsOpen(false);
                }}
                title="Close chat"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Config Bar: Role Selector, Model Speed & Search Grounding Toggle */}
          <div className="px-3.5 py-2 bg-neutral-950/70 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Persona Tabs */}
            <div className="flex items-center gap-1">
              {ROLES.map(role => {
                const isSelected = selectedRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                      isSelected 
                        ? 'bg-neutral-800 text-amber-400 border border-amber-400/40 shadow-sm' 
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                    title={role.description}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Grounding & Model Selectors */}
            <div className="flex items-center gap-1.5">
              {/* Search Grounding Switch */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSearchGroundingEnabled(!searchGroundingEnabled);
                }}
                title={searchGroundingEnabled ? "Google Search Grounding: Active" : "Google Search Grounding: Disabled"}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 border transition-all ${
                  searchGroundingEnabled
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
              >
                <Globe className={`w-3 h-3 ${searchGroundingEnabled ? 'text-cyan-400 animate-pulse' : 'text-neutral-500'}`} />
                <span>Search: {searchGroundingEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Model Selector */}
              <select
                id="chat-model-selector"
                value={selectedModel}
                onChange={(e) => {
                  playClickSound();
                  setSelectedModel(e.target.value);
                }}
                className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400"
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div 
            ref={messagesContainerRef}
            id="chat-messages-container"
            className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans scroll-smooth"
          >
            {isHistoryLoading && (
              <div className="text-center py-2 text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                <span>Restoring synced chat history from Firestore...</span>
              </div>
            )}

            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'} group`}
                >
                  {isAi && (
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[82%] space-y-1.5 ${isAi ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed text-left transition-all ${
                        isAi
                          ? 'bg-neutral-950 border border-neutral-800 text-neutral-200 shadow-md'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-medium rounded-tr-none'
                      }`}
                    >
                      {isAi ? (
                        <div className="prose prose-invert prose-xs max-w-none space-y-2 text-neutral-200 [&_a]:text-cyan-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-neutral-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-amber-300 [&_code]:font-mono [&_pre]:bg-neutral-900 [&_pre]:p-2.5 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}

                      {/* Google Search Queries if grounded */}
                      {isAi && msg.searchQueries && msg.searchQueries.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-neutral-800/80">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 mb-1">
                            <Globe className="w-3 h-3" />
                            <span>Google Search Queries Executed:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {msg.searchQueries.map((q, qIdx) => (
                              <span 
                                key={qIdx}
                                className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-[10px] font-mono text-cyan-200"
                              >
                                {q}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grounding Web Sources Links */}
                      {isAi && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                          <div className="text-[10px] font-mono text-neutral-400 mb-1.5">
                            Verified Grounding Sources:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-400 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                <span className="max-w-[150px] truncate">{src.title || 'Web Reference'}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Copy Action */}
                    <div className={`flex items-center gap-2 text-[10px] font-mono text-neutral-500 ${isAi ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span>• {msg.modelUsed.replace('gemini-', '')}</span>
                      )}
                      {msg.hasSearchGrounding && (
                        <span className="text-cyan-400 font-semibold">• Grounded</span>
                      )}
                      {isAi && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 hover:text-amber-400 transition-opacity flex items-center gap-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-xs text-neutral-400 font-mono">
                <div className="w-6 h-6 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-amber-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Grounding facts with {selectedModel} & Google Search...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-neutral-950/60 border-t border-neutral-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Prompts:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-end gap-2">
            <textarea
              ref={inputRef}
              id="gemini-chat-input"
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Rick AI anything (Press Enter to send)...`}
              disabled={isLoading}
              className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-neutral-100 placeholder:text-neutral-500 text-xs rounded-xl p-2.5 focus:outline-none resize-none disabled:opacity-50"
            />

            <button
              id="send-gemini-chat-btn"
              type="button"
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
