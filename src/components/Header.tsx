import React from 'react';
import { ShieldCheck, Sparkles, LogIn, LogOut, Cloud, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'tips' | 'scanner' | 'lab' | 'brain' | 'vault';
  setActiveTab: (tab: 'tips' | 'scanner' | 'lab' | 'brain' | 'vault') => void;
  onOpenAdvisor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAdvisor }) => {
  const { user, signIn, signOut, loading, cyberLearnings } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            AegisGuard
          </span>
        </div>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('tips')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'tips'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Tips
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'scanner'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vulnerability Scanner
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'lab'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Phishing Lab
          </button>
          <button
            onClick={() => setActiveTab('brain')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'brain'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>AI Memory</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              {cyberLearnings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'vault'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Knowledge Vault
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-sm shadow-cyan-500/20 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-900 px-4 py-2 bg-slate-950 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'tips' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Daily Tips
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'scanner' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Scanner
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'lab' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Phishing Lab
        </button>
        <button
          onClick={() => setActiveTab('brain')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'brain' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          AI Memory ({cyberLearnings.length})
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'vault' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Knowledge Vault
        </button>
      </div>
    </header>
  );
};
