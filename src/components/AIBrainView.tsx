import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CyberLearning } from '../types/security';
import { 
  Brain, Sparkles, ThumbsUp, Send, Filter, CheckCircle2, 
  AlertTriangle, Shield, Cpu, RefreshCw, Lightbulb, Search 
} from 'lucide-react';

export const AIBrainView: React.FC = () => {
  const { cyberLearnings, upvoteLearning, synthesizeAndStoreLearning } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Submit new observation / teach AI form
  const [observationInput, setObservationInput] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationInput.trim() || isSynthesizing) return;

    setIsSynthesizing(true);
    setSuccessBanner(null);

    try {
      const newLearning = await synthesizeAndStoreLearning(observationInput, 'user_observation');
      if (newLearning) {
        setObservationInput('');
        setSuccessBanner(`Synthesized and saved: "${newLearning.title}" directly to Google Cloud!`);
        setTimeout(() => setSuccessBanner(null), 5000);
      }
    } finally {
      setIsSynthesizing(false);
    }
  };

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Scam Tactics', value: 'scam_tactic' },
    { label: 'Privacy Insights', value: 'privacy_insight' },
    { label: 'Threat Patterns', value: 'threat_pattern' },
    { label: 'Defense Techniques', value: 'defense_technique' },
    { label: 'Misconceptions', value: 'user_misconception' }
  ];

  const filteredLearnings = cyberLearnings.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.extractedInsight.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.actionableRule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner: Explanation of Continuous Learning via Google Cloud */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 relative overflow-hidden">
        {/* Subtle luminous glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-400" />
                Google Cloud Adaptive Intelligence
              </span>
              <span aria-hidden="true">·</span>
              <span>Collective Security Memory</span>
              <span aria-hidden="true">·</span>
              <span>Continuous Knowledge Synthesis</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Evolving Cyber Intelligence Memory
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Every day, as users chat with the AI Security Advisor and analyze real-world scams, the system synthesizes newly discovered threat patterns, privacy nuances, and defense rules into Google Cloud. The AI Advisor actively queries this evolving memory base to answer future questions with continuously improving defense strategies.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-mono">Stored Learnings</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-0.5">
                {cyberLearnings.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-mono">Community Upvotes</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                {cyberLearnings.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teach the AI / Submit Threat Observation Form */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Teach the AI: Submit Real-World Scenario or Scam
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Synthesized by Gemini into Google Cloud Memory
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Encountered a suspicious SMS, phone call, or confusing privacy setting? Describe it below. The AI will extract the underlying threat pattern and store it in Google Cloud for all users.
        </p>

        <form onSubmit={handleSynthesize} className="space-y-3">
          <textarea
            rows={3}
            value={observationInput}
            onChange={(e) => setObservationInput(e.target.value)}
            placeholder="e.g. Received a text saying my toll pass had a negative $4.85 balance with a link to nj-turnpike-citation.cc asking for debit card..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {successBanner ? (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successBanner}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono">
                Extracted rules become part of the live AI advisory prompt.
              </div>
            )}

            <button
              type="submit"
              disabled={isSynthesizing || !observationInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm whitespace-nowrap disabled:opacity-50 flex items-center gap-2 self-end sm:self-auto"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Learning...</span>
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  <span>Synthesize & Save to Google Cloud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learned knowledge..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Cards Grid of Stored Learnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLearnings.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Category and Source */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase border ${
                  item.category === 'scam_tactic' ? 'bg-rose-950/50 text-rose-300 border-rose-500/30' :
                  item.category === 'threat_pattern' ? 'bg-amber-950/50 text-amber-300 border-amber-500/30' :
                  item.category === 'privacy_insight' ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30' :
                  item.category === 'defense_technique' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30' :
                  'bg-purple-950/50 text-purple-300 border-purple-500/30'
                }`}>
                  {item.category.replace('_', ' ')}
                </span>

                <span className="text-slate-500 text-[11px]">
                  {item.sourceType === 'chat_conversation' ? '💬 Learned in Chat' :
                   item.sourceType === 'threat_analysis' ? '🔍 Extracted from Scan' : '👤 User Observation'}
                </span>
              </div>

              {/* Title & Summary */}
              <div>
                <h4 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Deep Synthesized Insight */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  AI Synthesized Mechanics:
                </span>
                <p className="leading-relaxed">
                  {item.extractedInsight}
                </p>
              </div>

              {/* Actionable Defense Rule */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                <strong className="block text-white mb-0.5">Defensive Rule:</strong>
                {item.actionableRule}
              </div>
            </div>

            {/* Card Footer: Upvote & Metadata */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Confidence: {Math.round(item.confidence * 100)}%</span>

              <button
                onClick={() => upvoteLearning(item.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                title="Upvote verified security insight"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="tabular-nums font-semibold">{item.upvotes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLearnings.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
          No learned cyber insights match your filter.
        </div>
      )}
    </div>
  );
};
