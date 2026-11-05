import React, { useState } from 'react';
import { PHISHING_SCENARIOS } from '../data/phishingScenarios';
import { PhishingScenario } from '../types/security';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle, 
  Eye, Smartphone, Mail, ArrowRight, RotateCcw, Target 
} from 'lucide-react';

export const PhishingLabView: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const currentScenario = PHISHING_SCENARIOS[selectedScenarioIndex];

  // User-discovered red flags in current scenario
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);

  const toggleFlag = (id: string, explanation: string) => {
    if (!flaggedIds.includes(id)) {
      setFlaggedIds(prev => [...prev, id]);
    }
    setActiveExplanation(explanation);
  };

  const handleSwitchScenario = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setFlaggedIds([]);
    setActiveExplanation(null);
  };

  const resetInvestigation = () => {
    setFlaggedIds([]);
    setActiveExplanation(null);
  };

  const totalFlags = currentScenario.redFlagLocations.length;
  const discoveredCount = flaggedIds.length;
  const isAllDiscovered = discoveredCount === totalFlags;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>Interactive Threat Simulation</span>
              <span aria-hidden="true">·</span>
              <span>Hands-on Red Flag Spotter</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Phishing & Social Engineering Lab
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Inspect simulated spear-phishing emails and smishing text messages. Click directly on suspicious elements—headers, urgency triggers, domains, and phone numbers—to uncover the attacker's psychological hooks.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {PHISHING_SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => handleSwitchScenario(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  selectedScenarioIndex === i
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc.type === 'sms' ? 'SMS: ' : 'Email: '}{sc.senderName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Progress Meter */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-slate-300 font-mono">
              Red Flags Identified: <strong className="text-cyan-400 tabular-nums">{discoveredCount} of {totalFlags}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAllDiscovered && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All Threats Isolated!
              </span>
            )}
            <button
              onClick={resetInvestigation}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Simulated Message (Email Client or SMS App) */}
        <div className="lg:col-span-7">
          {currentScenario.type === 'email' ? (
            /* Mock Email Client Window */
            <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
              {/* Window Title Bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">Inbox Preview · Mail Client</span>
                </div>
                <Mail className="w-4 h-4 text-slate-500" />
              </div>

              {/* Email Headers */}
              <div className="p-5 border-b border-slate-900 bg-slate-950 space-y-2 text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-mono w-16">Subject:</span>
                  <span className="font-semibold text-slate-100">{currentScenario.subjectOrPreview}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-mono w-16">From:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">{currentScenario.senderName}</span>
                    <button
                      onClick={() => toggleFlag('flag-sender', currentScenario.redFlagLocations.find(f => f.id === 'flag-sender')?.explanation || 'Lookalike sender domain!')}
                      className={`font-mono px-2 py-0.5 rounded cursor-pointer transition-all border ${
                        flaggedIds.includes('flag-sender')
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500 hover:text-cyan-300'
                      }`}
                      title="Click to inspect sender address"
                    >
                      &lt;{currentScenario.senderEmailOrNumber}&gt;
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-mono w-16">To:</span>
                  <span className="text-slate-400 font-mono">user@corporate-org.com</span>
                </div>
              </div>

              {/* Email Body with Clickable Red Flags */}
              <div className="p-6 space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                {/* Greeting */}
                <div>
                  <button
                    onClick={() => toggleFlag('flag-greeting', currentScenario.redFlagLocations.find(f => f.id === 'flag-greeting')?.explanation || 'Generic unpersonalized greeting')}
                    className={`text-left rounded px-1.5 py-0.5 transition-all cursor-pointer ${
                      flaggedIds.includes('flag-greeting')
                        ? 'bg-rose-950/60 border border-rose-500 text-rose-200'
                        : 'hover:bg-slate-900 hover:text-cyan-300'
                    }`}
                  >
                    Dear Valued Colleague,
                  </button>
                </div>

                <p>
                  Our identity protection system has detected unusual sign-in activity on your Microsoft 365 organization tenant. In accordance with enterprise compliance mandate SEC-8891, your network access credentials will be{' '}
                  <button
                    onClick={() => toggleFlag('flag-urgency', currentScenario.redFlagLocations.find(f => f.id === 'flag-urgency')?.explanation || 'Fabricated deadline urgency')}
                    className={`font-semibold rounded px-1.5 py-0.5 cursor-pointer transition-all ${
                      flaggedIds.includes('flag-urgency')
                        ? 'bg-rose-950/60 border border-rose-500 text-rose-300'
                        : 'text-amber-400 hover:bg-amber-950/30'
                    }`}
                  >
                    permanently deactivated within 2 hours.
                  </button>
                </p>

                <p>
                  To avoid business disruption and account termination, please retain your current credentials immediately:
                </p>

                {/* Phishing CTA Button / Link */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleFlag('flag-link', currentScenario.redFlagLocations.find(f => f.id === 'flag-link')?.explanation || 'Deceptive destination URL!')}
                    className={`px-5 py-3 rounded-lg font-medium text-xs md:text-sm cursor-pointer transition-all border ${
                      flaggedIds.includes('flag-link')
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                    }`}
                  >
                    Keep Same Password & Re-Authenticate
                  </button>
                  <div className="mt-1 text-xs font-mono text-slate-500">
                    Hover destination: {currentScenario.targetUrl}
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-4 border-t border-slate-900">
                  Office 365 Automated Protection Service<br />Microsoft Corporation
                </p>
              </div>
            </div>
          ) : (
            /* Mock Smartphone SMS View */
            <div className="max-w-md mx-auto rounded-3xl border-2 border-slate-800 bg-slate-950 shadow-2xl p-4 overflow-hidden">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4" />

              {/* SMS Header */}
              <div className="text-center pb-4 border-b border-slate-900">
                <button
                  onClick={() => toggleFlag('flag-sms-origin', currentScenario.redFlagLocations.find(f => f.id === 'flag-sms-origin')?.explanation || 'Toll-free / unknown origin number')}
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-all ${
                    flaggedIds.includes('flag-sms-origin')
                      ? 'bg-rose-950/60 border border-rose-500 text-rose-200'
                      : 'bg-slate-900 text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  {currentScenario.senderEmailOrNumber}
                </button>
                <div className="text-xs text-slate-500 mt-1">Text Message · Today 2:14 PM</div>
              </div>

              {/* SMS Speech Bubble */}
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed space-y-3">
                  <p>
                    [USPS Tracking]: Your shipment US94029141 cannot be delivered due to incomplete street address details. Our courier has returned the parcel to the transit hub.
                  </p>

                  <p>
                    Please update your delivery postal details{' '}
                    <button
                      onClick={() => toggleFlag('flag-sms-urgency', currentScenario.redFlagLocations.find(f => f.id === 'flag-sms-urgency')?.explanation || 'Ultimatum urgency trigger')}
                      className={`font-semibold rounded px-1 cursor-pointer ${
                        flaggedIds.includes('flag-sms-urgency')
                          ? 'bg-rose-950/60 border border-rose-500 text-rose-300'
                          : 'text-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      within 12 hours
                    </button>{' '}
                    to avoid package return:
                  </p>

                  <div>
                    <button
                      onClick={() => toggleFlag('flag-sms-tld', currentScenario.redFlagLocations.find(f => f.id === 'flag-sms-tld')?.explanation || 'Deceptive .xyz top-level domain')}
                      className={`font-mono text-xs underline cursor-pointer p-1 rounded ${
                        flaggedIds.includes('flag-sms-tld')
                          ? 'bg-rose-950/80 border border-rose-500 text-rose-200'
                          : 'text-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      {currentScenario.targetUrl}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tactical Analysis & Red Flag Insights */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Flag Explanation Drawer */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Eye className="w-4 h-4" />
              <span>Attacker Psychology & Vector Brief</span>
            </div>

            {activeExplanation ? (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs md:text-sm text-cyan-200 leading-relaxed">
                <strong className="block text-white mb-1">Vector Breakdown:</strong>
                {activeExplanation}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400">
                Click any highlighted or suspicious text, header, or link in the message to the left to inspect the red flag.
              </div>
            )}

            <div className="pt-2 space-y-2">
              <div className="text-xs font-semibold text-slate-400">The Attacker's True Objective:</div>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                {currentScenario.attackerGoal}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <div className="text-xs font-semibold text-slate-400">Key Indicators in this Scenario:</div>
              <div className="space-y-1.5">
                {currentScenario.redFlagLocations.map((flag) => {
                  const isFound = flaggedIds.includes(flag.id);
                  return (
                    <div
                      key={flag.id}
                      onClick={() => toggleFlag(flag.id, flag.explanation)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isFound
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{flag.label}</span>
                      {isFound ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-xs text-slate-600 font-mono">Unidentified</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
