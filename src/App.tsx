import React, { useState } from 'react';
import { Header } from './components/Header';
import { DailyTipsView } from './components/DailyTipsView';
import { VulnerabilityScannerView } from './components/VulnerabilityScannerView';
import { PhishingLabView } from './components/PhishingLabView';
import { AIBrainView } from './components/AIBrainView';
import { KnowledgeVaultView } from './components/KnowledgeVaultView';
import { SecurityAdvisorModal } from './components/SecurityAdvisorModal';
import { ShieldCheck, Sparkles, Activity, Brain } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tips' | 'scanner' | 'lab' | 'brain' | 'vault'>('tips');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        {/* 3-Zone Top Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Banner Header for Context & Shield Crest */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 p-6 md:p-8 overflow-hidden shadow-2xl">
            {/* Ambient luminous glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 max-w-2xl text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold">Google Cloud Adaptive Intelligence</span>
                  <span aria-hidden="true">·</span>
                  <span>Real-Time Scanning Engine</span>
                  <span aria-hidden="true">·</span>
                  <span>Collective Defense Memory</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Understand the Threats. <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Fortify Your Digital Life.
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  AegisGuard pairs interactive daily defense micro-lessons with client-side vulnerability diagnostics, link deception analysis, and an evolving Google Cloud AI knowledge base that learns from everyday chats and threat scenarios.
                </p>

                {/* Quick Action Navigation Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs md:text-sm transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-slate-950" />
                    <span>Launch Vulnerability Scanner</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('brain')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>Explore AI Memory</span>
                  </button>
                  <button
                    onClick={() => setIsAdvisorOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-850 text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Ask AI Advisor</span>
                  </button>
                </div>
              </div>

              {/* Shield Crest Graphic Asset */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950">
                  <img
                    src="/src/assets/images/cyber_defense_shield_1792471009849.jpg"
                    alt="AegisGuard Defense Crest"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                      Aegis Defense Shield
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Main Views */}
          {activeTab === 'tips' && <DailyTipsView onSelectScannerTab={() => setActiveTab('scanner')} />}
          {activeTab === 'scanner' && <VulnerabilityScannerView />}
          {activeTab === 'lab' && <PhishingLabView />}
          {activeTab === 'brain' && <AIBrainView />}
          {activeTab === 'vault' && <KnowledgeVaultView />}
        </main>

        {/* Security Advisory Modal */}
        <SecurityAdvisorModal
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
        />

        {/* Quiet Footer */}
        <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-400">AegisGuard Cyber Security & Privacy Hub</span>
              <span aria-hidden="true">·</span>
              <span>Collective intelligence actively stored in Google Cloud.</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveTab('tips')} className="hover:text-slate-300 transition-colors">Daily Tips</button>
              <button onClick={() => setActiveTab('scanner')} className="hover:text-slate-300 transition-colors">Scanner</button>
              <button onClick={() => setActiveTab('lab')} className="hover:text-slate-300 transition-colors">Phishing Lab</button>
              <button onClick={() => setActiveTab('brain')} className="hover:text-slate-300 transition-colors">AI Memory</button>
              <button onClick={() => setActiveTab('vault')} className="hover:text-slate-300 transition-colors">Knowledge Vault</button>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
