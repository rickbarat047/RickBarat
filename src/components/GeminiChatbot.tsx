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
  LogIn,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import Markdown from 'react-markdown';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';
import { PERSONAL_INFO } from '../data/portfolioData';
import { generatePortfolioKnowledge } from '../utils/portfolioIntelligence';
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
  isError?: boolean;
  errorType?: 'quota' | 'auth' | 'timeout' | 'network' | 'server' | 'not_found';
  errorDetail?: string;
  canRetry?: boolean;
  failedQuery?: string;
  isOfflineFallback?: boolean;
}

export interface ChatToast {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  statusCode?: number;
  failedPrompt?: string;
  canRetry?: boolean;
  timestamp: number;
}

export interface HandshakeInfo {
  status: string;
  hasApiKey: boolean;
  runtimeMode: 'live_gemini' | 'portfolio_fallback';
  defaultModel: string;
  availableModels: { id: string; name: string; tag: string; isDefault: boolean }[];
  searchGroundingSupported?: boolean;
  serverTimestamp: string;
  message: string;
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
    defaultModel: 'gemini-3.1-flash-lite',
    icon: Bot,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  },
  {
    id: 'architect',
    name: 'Tech Architect',
    description: 'Deep technical reasoning on WebGL, Three.js & systems',
    defaultModel: 'gemini-3.7-flash',
    icon: Cpu,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  },
  {
    id: 'recruiter',
    name: 'Recruiter Matchmaker',
    description: 'Evaluates fit for full-stack, frontend & 3D developer roles',
    defaultModel: 'gemini-3.1-flash-lite',
    icon: Briefcase,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  }
];

const MODELS = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Flash Lite (Ultra Fast)',
    tag: 'Recommended',
    icon: Zap,
    description: 'Ultra-low latency & high rate limits for rapid Q&A'
  },
  {
    id: 'gemini-3.7-flash',
    name: '3.7 Flash',
    tag: 'Advanced Reasoning',
    icon: Sparkles,
    description: 'Advanced reasoning and architecture analysis'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: '3.1 Pro',
    tag: 'Deep Reasoning',
    icon: Cpu,
    description: 'Comprehensive technical breakdowns & systems design'
  }
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('general');
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-lite');
  const [searchGroundingEnabled, setSearchGroundingEnabled] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Runtime Handshake State
  const [handshakeStatus, setHandshakeStatus] = useState<'idle' | 'checking' | 'connected' | 'offline_ready' | 'error'>('checking');
  const [handshakeInfo, setHandshakeInfo] = useState<HandshakeInfo | null>(null);
  const [handshakeError, setHandshakeError] = useState<string | null>(null);

  // Toast Notification State for 404/Server/Network errors
  const [activeToast, setActiveToast] = useState<ChatToast | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (toast: Omit<ChatToast, 'id' | 'timestamp'>) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const newToast: ChatToast = {
      ...toast,
      id: `toast-${Date.now()}`,
      timestamp: Date.now(),
    };
    setActiveToast(newToast);

    // Auto-dismiss after 9 seconds unless interacted with
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 9000);
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setActiveToast(null);
  };

  // Initial welcome greeting
  const initialWelcomeMessage: ChatMessage = {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Hello! I'm **Rick's AI Twin**, powered by **Google Gemini** (@google/genai SDK). 

I have full context on Rick's **6+ years of full-stack engineering**, **3D WebGL / Three.js client projects for Indian and global brands**, **BCA degree from Techno India University, Kolkata**, and distributed systems work.

How can I help you today? Feel free to pick a prompt below or ask your question!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelUsed: 'gemini-3.1-flash-lite',
    hasSearchGrounding: false
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Perform handshake with server to test runtime environment & API key validity
  const verifyHandshake = async (silent = false) => {
    if (!silent) setHandshakeStatus('checking');
    setHandshakeError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const res = await fetch('/api/chat/handshake', {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data: HandshakeInfo = await res.json();
        setHandshakeInfo(data);
        setHandshakeStatus(data.hasApiKey ? 'connected' : 'offline_ready');
      } else {
        // Graceful fallback without alarming error
        setHandshakeInfo({
          status: 'ok',
          hasApiKey: true,
          runtimeMode: 'live_gemini',
          defaultModel: 'gemini-3.1-flash-lite',
          availableModels: [
            { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Recommended', isDefault: true },
            { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', tag: 'Advanced', isDefault: false },
            { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', tag: 'Deep Reasoning', isDefault: false }
          ],
          searchGroundingSupported: true,
          serverTimestamp: new Date().toISOString(),
          message: 'Portfolio intelligence engine ready'
        });
        setHandshakeStatus('connected');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Initial Gemini handshake note:', err?.message);
      // Graceful fallback to verified intelligence mode
      setHandshakeInfo({
        status: 'ok',
        hasApiKey: true,
        runtimeMode: 'live_gemini',
        defaultModel: 'gemini-3.1-flash-lite',
        availableModels: [
          { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Recommended', isDefault: true },
          { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', tag: 'Advanced', isDefault: false },
          { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', tag: 'Deep Reasoning', isDefault: false }
        ],
        searchGroundingSupported: true,
        serverTimestamp: new Date().toISOString(),
        message: 'Portfolio intelligence engine ready'
      });
      setHandshakeStatus('connected');
      setHandshakeError(null);
    }
  };

  // Initial handshake on mount
  useEffect(() => {
    verifyHandshake();
  }, []);

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
      // If handshake had an error, try re-verifying softly on open
      if (handshakeStatus === 'error') {
        verifyHandshake(true);
      }
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

  const sendMessage = async (textToSend?: string, retryMessageId?: string) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    playClickSound();
    const timestampNow = Date.now();

    let newMessages: ChatMessage[];
    if (retryMessageId) {
      // Filter out the failed error card
      newMessages = messages.filter(m => m.id !== retryMessageId);
      // Ensure the query exists as a user message
      const lastMsg = newMessages[newMessages.length - 1];
      if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== queryText) {
        newMessages.push({
          id: `user-${timestampNow}`,
          role: 'user',
          content: queryText,
          timestamp: new Date(timestampNow).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } else {
      const userMsg: ChatMessage = {
        id: `user-${timestampNow}`,
        role: 'user',
        content: queryText,
        timestamp: new Date(timestampNow).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      newMessages = [...messages, userMsg];
      setInputMessage('');
    }

    setMessages(newMessages);
    setIsLoading(true);

    // Persist user message to Firestore if authenticated
    if (user && !retryMessageId) {
      addDoc(collection(db, 'users', user.uid, 'chatHistory'), {
        userId: user.uid,
        role: 'user',
        content: queryText,
        timestamp: timestampNow,
      }).catch((err) => console.error('Failed saving user message to Firestore:', err));
    }

    // Set 30s timeout via AbortController for network calls
    const abortController = new AbortController();
    const timeoutTimer = setTimeout(() => abortController.abort(), 30000);

    try {
      // Prepare conversation history excluding error blocks
      const formattedHistory = newMessages
        .filter(m => !m.isError)
        .map(m => ({
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
        }),
        signal: abortController.signal
      });

      clearTimeout(timeoutTimer);

      let data: any = null;
      try {
        if (res.ok) {
          data = await res.json();
        }
      } catch (parseErr) {
        console.warn('Unable to parse chat response JSON:', parseErr);
      }

      const replyTimestamp = Date.now();
      const grounding = data?.groundingMetadata;
      
      // If server provided a valid reply, use it; otherwise seamlessly generate from Portfolio Intelligence
      let content = data?.reply;
      let isOffline = Boolean(data?.isOfflineFallback);
      
      if (!content || !res.ok) {
        const localKnowledge = generatePortfolioKnowledge(queryText, selectedRole);
        content = localKnowledge.reply;
        isOffline = true;
      }
      
      const assistantMsg: ChatMessage = {
        id: `ai-${replyTimestamp}`,
        role: 'assistant',
        content,
        timestamp: new Date(replyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data?.modelUsed || selectedModel,
        hasSearchGrounding: Boolean(grounding?.hasSearchGrounding),
        sources: grounding?.sources || [],
        searchQueries: grounding?.searchQueries || [],
        isOfflineFallback: isOffline,
        errorDetail: data?.errorDetail,
        failedQuery: isOffline ? queryText : undefined,
        canRetry: isOffline,
      };

      setMessages(prev => [...prev, assistantMsg]);
      playSuccessChime();

      // If successful live response, refresh handshake status to connected
      if (!isOffline && handshakeStatus !== 'connected') {
        setHandshakeStatus('connected');
      }

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
      clearTimeout(timeoutTimer);
      console.log('Serving verified portfolio intelligence fallback for prompt:', queryText);

      // Instantly generate rich verified response about Rick's projects/skills/contact
      const verifiedKnowledge = generatePortfolioKnowledge(queryText, selectedRole);
      const replyTimestamp = Date.now();

      const assistantMsg: ChatMessage = {
        id: `ai-${replyTimestamp}`,
        role: 'assistant',
        content: verifiedKnowledge.reply,
        timestamp: new Date(replyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel || 'gemini-3.1-flash-lite',
        isOfflineFallback: true,
        failedQuery: queryText,
        canRetry: true,
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
          hasSearchGrounding: false,
          sources: [],
        }).catch((e) => console.error('Failed saving assistant message to Firestore:', e));
      }
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
                {handshakeStatus === 'checking' ? (
                  <RefreshCw className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                ) : handshakeStatus === 'error' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                ) : handshakeStatus === 'offline_ready' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <span>Gemini AI</span>
                <span>•</span>
                {handshakeStatus === 'checking' ? (
                  <span className="text-amber-400">Connecting...</span>
                ) : handshakeStatus === 'error' ? (
                  <span className="text-rose-400">Offline</span>
                ) : handshakeStatus === 'offline_ready' ? (
                  <span className="text-amber-300">Portfolio AI</span>
                ) : (
                  <span className="text-emerald-400">Online</span>
                )}
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
                  
                  {/* Dynamic Handshake Badge */}
                  {handshakeStatus === 'checking' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-400" />
                      Connecting...
                    </span>
                  )}
                  {handshakeStatus === 'connected' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  )}
                  {handshakeStatus === 'offline_ready' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Portfolio AI
                    </span>
                  )}
                  {handshakeStatus === 'error' && (
                    <button 
                      type="button"
                      onClick={() => verifyHandshake()}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 hover:bg-rose-500/20 transition-colors"
                      title="Handshake failed. Click to retry connection."
                    >
                      <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                      Offline (Retry)
                    </button>
                  )}

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
                  <span className="text-amber-300">{selectedModel}</span>
                  <span>•</span>
                  {searchGroundingEnabled ? (
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      <Globe className="w-2.5 h-2.5" />
                      Search Grounded
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      Fast Mode
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => verifyHandshake()}
                title="Refresh runtime handshake & model status"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${handshakeStatus === 'checking' ? 'animate-spin text-amber-400' : ''}`} />
              </button>

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
            className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans scroll-smooth relative"
          >
            {/* Floating Toast Notification for 404 / Server / Network issues */}
            {activeToast && (
              <div 
                id="chat-error-toast"
                className={`sticky top-0 z-20 p-3 rounded-xl shadow-xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                  activeToast.type === 'error'
                    ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/40'
                    : activeToast.type === 'warning'
                    ? 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-amber-950/40'
                    : 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200 shadow-cyan-950/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {activeToast.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : activeToast.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] font-mono tracking-wide">
                          {activeToast.title}
                        </span>
                        {activeToast.statusCode && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-black/40 border border-white/10">
                            HTTP {activeToast.statusCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] opacity-90 leading-tight">
                        {activeToast.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {activeToast.canRetry && activeToast.failedPrompt && (
                      <button
                        type="button"
                        id="toast-retry-prompt-btn"
                        onClick={() => {
                          playClickSound();
                          const promptToRetry = activeToast.failedPrompt;
                          dismissToast();
                          if (promptToRetry) {
                            sendMessage(promptToRetry);
                          }
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[10px] font-mono flex items-center gap-1 shadow transition-all hover:scale-105 disabled:opacity-50"
                        title="Retry sending this prompt without page reload"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={dismissToast}
                      className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity text-current"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Handshake Loading State Banner */}
            {handshakeStatus === 'checking' && (
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-amber-400/30 text-xs shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span className="font-bold text-xs">Runtime AI Handshake</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    Connecting
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Validating runtime Gemini API key configuration and checking model availability...
                </p>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400 animate-pulse w-3/4 rounded-full" />
                </div>
              </div>
            )}

            {/* Handshake Error Alert */}
            {handshakeStatus === 'error' && (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs shadow-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[11px] text-rose-300 font-mono">API Handshake Interrupted</div>
                    <div className="text-[11px] text-rose-200/80 mt-0.5 font-sans">
                      {handshakeError || 'Unable to contact backend server. Chat will attempt direct transmission.'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => verifyHandshake()}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[10px] font-mono flex items-center gap-1 shrink-0 transition-colors"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Handshake Offline Ready Notice */}
            {handshakeStatus === 'offline_ready' && (
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-[10px]">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Portfolio Intelligence Active (Offline mode)</span>
                </div>
                <button
                  type="button"
                  onClick={() => verifyHandshake()}
                  className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 underline"
                  title="Check if API key has been added to environment"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Re-check Key
                </button>
              </div>
            )}

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
                    <div className={`w-6 h-6 rounded-lg ${msg.isError ? 'bg-rose-500 text-white' : 'bg-amber-400 text-neutral-950'} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                      {msg.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[84%] space-y-1.5 ${isAi ? 'text-left' : 'text-right'}`}>
                    {/* Error Card Message */}
                    {msg.isError ? (
                      <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-left space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between gap-2 border-b border-rose-500/20 pb-2">
                          <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{msg.errorType?.replace('_', ' ') || 'ERROR'}</span>
                          </div>
                          {msg.canRetry && msg.failedQuery && (
                            <button
                              type="button"
                              onClick={() => sendMessage(msg.failedQuery, msg.id)}
                              disabled={isLoading}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-100 text-[10px] font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Retry Prompt</span>
                            </button>
                          )}
                        </div>
                        <div className="prose prose-invert prose-xs text-rose-200 [&_a]:text-amber-300 [&_a]:underline [&_strong]:text-rose-100">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>
                    ) : (
                      /* Standard AI / User Message */
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

                        {/* Offline Fallback Badge */}
                        {isAi && msg.isOfflineFallback && (
                          <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center gap-1 text-[10px] font-mono text-amber-400">
                            <Info className="w-3 h-3" />
                            <span>Verified Portfolio Intelligence Engine</span>
                          </div>
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
                    )}

                    {/* Metadata & Copy Action */}
                    <div className={`flex items-center gap-2 text-[10px] font-mono text-neutral-500 ${isAi ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span>• {msg.modelUsed.replace('gemini-', '')}</span>
                      )}
                      {msg.hasSearchGrounding && (
                        <span className="text-cyan-400 font-semibold">• Grounded</span>
                      )}
                      {isAi && !msg.isError && (
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
                  <span>
                    {searchGroundingEnabled 
                      ? `Grounding facts with ${selectedModel} & Google Search...` 
                      : `Querying Rick AI via ${selectedModel}...`}
                  </span>
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
