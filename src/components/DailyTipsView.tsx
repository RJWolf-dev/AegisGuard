import React, { useState, useEffect } from 'react';
import { DAILY_TIPS } from '../data/dailyTips';
import { DailyTip } from '../types/security';
import { ShieldCheck, Flame, CheckCircle2, ChevronRight, HelpCircle, Check, Search, AlertTriangle, BookOpen, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DailyTipsViewProps {
  onSelectScannerTab?: () => void;
}

export const DailyTipsView: React.FC<DailyTipsViewProps> = () => {
  const { user, profile, updateCompletedTip } = useAuth();
  const [selectedTip, setSelectedTip] = useState<DailyTip>(DAILY_TIPS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [localCompletedTips, setLocalCompletedTips] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aegis_completed_tips');
      return saved ? JSON.parse(saved) : ['tip-1'];
    } catch {
      return ['tip-1'];
    }
  });

  const completedTips = user && profile ? profile.completedTips : localCompletedTips;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('aegis_completed_tips', JSON.stringify(localCompletedTips));
      } catch {
        // storage unavailable
      }
    }
  }, [localCompletedTips, user]);

  // Reset challenge state when tip changes
  const handleSelectTip = (tip: DailyTip) => {
    setSelectedTip(tip);
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(optionIndex);
    setHasAnswered(true);

    if (optionIndex === selectedTip.challenge.correctIndex) {
      if (!completedTips.includes(selectedTip.id)) {
        setLocalCompletedTips(prev => [...prev, selectedTip.id]);
        updateCompletedTip(selectedTip.id);
      }
    }
  };

  const toggleStep = (stepIndex: number) => {
    const key = `${selectedTip.id}_step_${stepIndex}`;
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = ['All', 'Identity', 'Network', 'Social Engineering', 'Device', 'Privacy'];

  const filteredTips = DAILY_TIPS.filter(tip => {
    const matchesCategory = categoryFilter === 'All' || tip.category === categoryFilter;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tip.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tip.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const streakDays = completedTips.length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Streak & Progress Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Current Defense Streak</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <span>{streakDays} Days Active</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            {Math.round((completedTips.length / DAILY_TIPS.length) * 100)}% Mastered
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Security Habit Level</div>
            <div className="text-xl font-bold text-white mt-1">
              {streakDays >= 5 ? 'Fortified Sentinel' : streakDays >= 3 ? 'Vigilant Defender' : 'Cyber Apprentice'}
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Today's Focus Area</div>
            <div className="text-xl font-bold text-slate-200 mt-1">
              {selectedTip.category}
            </div>
          </div>
          <BookOpen className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Main Focus: Featured Interactive Daily Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Deep Dive & Micro Challenge */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Subtle luminous ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            {/* Clean unboxed metadata with separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mb-3">
              <span className="text-cyan-400 font-medium">Day {selectedTip.dayIndex} of 30</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{selectedTip.category}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedTip.readTime}</span>
              <span aria-hidden="true">·</span>
              <span className={selectedTip.impact === 'Critical' ? 'text-rose-400 font-medium' : 'text-amber-400'}>
                {selectedTip.impact} Impact
              </span>
              {completedTips.includes(selectedTip.id) && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                </>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
              {selectedTip.title}
            </h2>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
              {selectedTip.summary}
            </p>

            {/* Section 1: The Threat Mechanics */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>The Attack Vector Explained</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                {selectedTip.attackMechanic}
              </p>
            </div>

            {/* Section 2: Actionable Defense Checklist */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Your Defense Action Plan
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedTip.defenseAction.filter((_, i) => checkedSteps[`${selectedTip.id}_step_${i}`]).length}/{selectedTip.defenseAction.length} Steps Applied
                </span>
              </div>
              <div className="space-y-2.5">
                {selectedTip.defenseAction.map((step, idx) => {
                  const isChecked = Boolean(checkedSteps[`${selectedTip.id}_step_${idx}`]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-900/60 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className={`text-sm leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Interactive Micro-Challenge */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Test Your Instincts: Micro-Challenge</span>
              </div>
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-sm font-medium text-slate-100 mb-4">
                  {selectedTip.challenge.question}
                </div>

                <div className="space-y-2">
                  {selectedTip.challenge.options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === selectedTip.challenge.correctIndex;
                    let optionStyle = 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300';

                    if (hasAnswered) {
                      if (isCorrect) {
                        optionStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 font-medium';
                      } else if (isSelected) {
                        optionStyle = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                      } else {
                        optionStyle = 'border-slate-900/50 bg-slate-950/30 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleAnswerSubmit(optIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="font-mono text-xs opacity-60 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {hasAnswered && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-xs md:text-sm leading-relaxed border ${
                      selectedAnswer === selectedTip.challenge.correctIndex
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {selectedAnswer === selectedTip.challenge.correctIndex ? 'Correct Analysis!' : 'Security Review:'}
                    </div>
                    {selectedTip.challenge.explanation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Tips Library & Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Defense Curriculum
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {filteredTips.length} Available
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search cyber tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 bg-slate-950/60 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List of Tips */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredTips.map(tip => {
                const isSelected = selectedTip.id === tip.id;
                const isDone = completedTips.includes(tip.id);

                return (
                  <div
                    key={tip.id}
                    onClick={() => handleSelectTip(tip)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'bg-cyan-950/20 border-cyan-500/40 text-white'
                        : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-mono">
                      <span>Day {tip.dayIndex} · {tip.category}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-semibold line-clamp-2 leading-snug">
                      {tip.title}
                    </div>
                  </div>
                );
              })}

              {filteredTips.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No tips match your filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
