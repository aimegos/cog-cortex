import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { UserPreferences, Pillar, Playbook } from '../types';
import { cn } from '../lib/utils';

interface GuideProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  pillars: Pillar[];
  playbooks: Playbook[];
}

export const Guide = ({ isOpen, onClose, preferences, pillars, playbooks }: GuideProps) => {
  const focusPillarName = pillars[1]?.name ?? pillars[0]?.name ?? 'garden';
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Welcome to the Hut. I notice your ${focusPillarName} orchard is showing strong growth patterns today. How can I observe your cortex with you?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        throw new Error('API Key not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Context: The user is an ND entrepreneur building a "Second Brain" called The Cognitive Cortex.
        User Preferences: ${JSON.stringify(preferences)}
        Current Pillars: ${JSON.stringify(pillars.map(p => p.name))}
        Active Playbooks: ${JSON.stringify(playbooks.map(p => ({ title: p.title, score: p.completion_score })))}

        Persona: You are "The Guide". 
        - Use Declarative Language (never commands like "You should").
        - Use Observational statements ("I notice that...", "It appears the system reflects...").
        - Be curious and non-judgmental.
        - Support PDA (Pathological Demand Avoidance) profile by being a silent partner who only offers insights when invited.

        User Inquiry: ${userMessage}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'The signals are quiet right now.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'I appear to be disconnected from the cortex right now. My smoke is thin.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/5 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium">The Guide</h2>
                  <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mt-0.5">Mentor Connection</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-4 max-w-[90%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center",
                    msg.role === 'user' ? "bg-cyan-500/10 text-cyan-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-6 rounded-[32px] text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-cyan-500/5 text-white/80 rounded-tr-none" 
                      : "bg-white/5 text-white/80 rounded-tl-none font-light italic"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-[90%]">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-6 rounded-[32px] rounded-tl-none bg-white/5 text-white/20 italic text-sm">
                    Listening to the signal...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5 bg-black/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Invite the guide with a thought..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white/90 placeholder:text-white/20 pr-16"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-2 bottom-2 aspect-square rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] font-mono text-white/20 text-center mt-6 uppercase tracking-[0.3em]">
                Declarative Insight Channel
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
