import React, { useState, useEffect } from 'react';
import { HARDENING_GUIDES, THREAT_CONCEPTS } from '../data/hardeningGuides';
import { HardeningGuideItem } from '../types/security';
import { 
  ShieldCheck, Check, Search, Lock, Smartphone, Laptop, 
  HelpCircle, ChevronRight, BookOpen, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const KnowledgeVaultView: React.FC = () => {
  const { user, profile, updateCompletedGuide } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [localCompletedGuideSteps, setLocalCompletedGuideSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aegis_guide_steps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [conceptSearch, setConceptSearch] = useState<string>('');

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('aegis_guide_steps', JSON.stringify(localCompletedGuideSteps));
      } catch {
        // ignore
      }
    }
  }, [localCompletedGuideSteps, user]);

  const isGuideDone = (guideId: string) => {
    if (user && profile) {
      return profile.completedGuides.includes(guideId);
    }
    return Boolean(localCompletedGuideSteps[guideId]);
  };

  const toggleGuide = (guideId: string) => {
    setLocalCompletedGuideSteps(prev => ({
      ...prev,
      [guideId]: !prev[guideId]
    }));
    updateCompletedGuide(guideId);
  };

  const platforms = ['All', 'Universal', 'macOS', 'Windows', 'iOS', 'Android'];

  const filteredGuides = HARDENING_GUIDES.filter(guide => {
    return selectedPlatform === 'All' || guide.platform === selectedPlatform;
  });

  const totalGuides = HARDENING_GUIDES.length;
  const completedCount = HARDENING_GUIDES.filter(g => isGuideDone(g.id)).length;
  const progressPercent = Math.round((completedCount / totalGuides) * 100);

  const filteredConcepts = THREAT_CONCEPTS.filter(c => {
    return c.term.toLowerCase().includes(conceptSearch.toLowerCase()) ||
           c.summary.toLowerCase().includes(conceptSearch.toLowerCase()) ||
           c.category.toLowerCase().includes(conceptSearch.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Overview & Progress Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>System Hardening & Threat Encyclopedia</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Cyber Defense Vault & Security Hardening
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Concrete, actionable configuration baselines for your operating systems, plus an attack mechanics encyclopedia to demystify complex cyber terminology.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
              <span>Hardening Baseline</span>
              <span className="text-cyan-400 font-bold tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 font-mono text-center">
              {completedCount} of {totalGuides} Hardening Protocols Applied
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Guides & Threat Dictionary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Platform Hardening Checklists */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Operating System Hardening Protocols</span>
              </h3>

              {/* Platform Filter Buttons */}
              <div className="flex flex-wrap gap-1">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      selectedPlatform === p
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides List */}
            <div className="space-y-4 pt-2">
              {filteredGuides.map(guide => {
                const isDone = isGuideDone(guide.id);

                return (
                  <div
                    key={guide.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/10 border-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-cyan-400">{guide.platform}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className={guide.importance === 'Essential' ? 'text-rose-400' : 'text-amber-400'}>
                            {guide.importance}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {guide.title}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {guide.description}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleGuide(guide.id)}
                        className={`p-2 rounded-lg border shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={isDone ? 'Mark as Incomplete' : 'Mark as Implemented'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Step by step instructions */}
                    <div className="mt-4 pt-3 border-t border-slate-900/80 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Configuration Steps:</div>
                      {guide.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="font-mono text-cyan-400 font-bold">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: MITRE & Cyber Threat Dictionary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Threat Mechanics Dictionary</span>
              </h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search threat concepts (e.g. SIM Swap, MitM)..."
                value={conceptSearch}
                onChange={(e) => setConceptSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Concept cards */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredConcepts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white text-sm">{item.term}</span>
                    <span className="text-cyan-400">{item.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex items-start gap-2 text-xs text-emerald-300">
                    <span className="font-semibold shrink-0">Defense:</span>
                    <span className="text-slate-300">{item.defense}</span>
                  </div>
                </div>
              ))}

              {filteredConcepts.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No security terms match your query.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
