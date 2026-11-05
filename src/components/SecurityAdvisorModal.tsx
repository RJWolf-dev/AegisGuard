import React, { useState } from 'react';
import { X, Send, Sparkles, User, RefreshCw, Brain, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SecurityAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'I got an SMS saying my USPS package has an incorrect address',
  'Should I use Passkeys or an Authenticator app?',
  'Is hotel public WiFi safe with a VPN?',
  'How do I freeze my credit after a data breach?'
];

export const SecurityAdvisorModal: React.FC<SecurityAdvisorModalProps> = ({ isOpen, onClose }) => {
  const { cyberLearnings, synthesizeAndStoreLearning } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am your AegisGuard Cyber Security & Privacy Copilot. You can ask me about suspicious emails, weird text messages, passkeys, VPN setups, or how to harden your devices against attackers. What would you like to verify today?"
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [learningNotification, setLearningNotification] = useState<string | null>(null);
  const [isSavingLearning, setIsSavingLearning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/security-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          conversationHistory: messages,
          recentLearnings: cyberLearnings.slice(0, 5)
        })
      });

      const data = await res.json();
      const reply = data.reply || 'Security assessment completed.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I ran into a temporary network issue contacting the threat intelligence system. In the meantime, remember: never share two-factor codes, verify sender addresses on official websites directly, and avoid clicking unfamiliar links."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnFromConversation = async () => {
    if (messages.length < 2 || isSavingLearning) return;
    setIsSavingLearning(true);

    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')?.content || '';
    const context = `User Query: ${lastUser}\n\nSecurity Answer: ${lastAssistant}`;

    try {
      const learning = await synthesizeAndStoreLearning(context, 'chat_conversation');
      if (learning) {
        setLearningNotification(`Insight saved to Google Cloud: "${learning.title}"`);
        setTimeout(() => setLearningNotification(null), 5000);
      }
    } finally {
      setIsSavingLearning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/security_threat_analyst_1792471009602.jpg"
              alt="Security Analyst"
              className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>AegisGuard AI Security Copilot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Google Cloud Memory Active
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Grounded in {cyberLearnings.length} learned threat patterns & community defenses
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Saved Toast */}
        {learningNotification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{learningNotification}</span>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Evaluating against Google Cloud collective threat memory...</span>
              </div>
            </div>
          )}
        </div>

        {/* Save to Memory Action & Quick Prompts */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono shrink-0">Quick Ask:</span>
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {messages.length > 2 && (
            <button
              onClick={handleLearnFromConversation}
              disabled={isSavingLearning}
              className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
              title="Extract security lesson from this chat and save to Google Cloud"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{isSavingLearning ? 'Learning...' : 'Store in AI Memory'}</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask security question or describe a suspicious alert..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
