export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DailyTip {
  id: string;
  dayIndex: number;
  category: 'Identity' | 'Network' | 'Social Engineering' | 'Device' | 'Privacy';
  title: string;
  summary: string;
  readTime: string;
  impact: 'High' | 'Critical' | 'Medium';
  attackMechanic: string;
  defenseAction: string[];
  challenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface BrowserAuditResult {
  scanTimestamp: number;
  overallScore: number; // 0 to 100
  rating: 'Hardened' | 'Moderate' | 'Vulnerable';
  canvasFingerprint: {
    hash: string;
    entropyEstimate: string;
    isUnique: boolean;
  };
  webrtcStatus: {
    status: 'Protected' | 'Potential Leak' | 'Disabled';
    detectedCandidates: string[];
  };
  screenPrivacy: {
    resolution: string;
    colorDepth: number;
    pixelRatio: number;
    fingerprintability: 'High' | 'Medium' | 'Low';
  };
  privacySignals: {
    doNotTrack: boolean;
    globalPrivacyControl: boolean;
    cookiesEnabled: boolean;
    secureContext: boolean;
  };
  permissions: {
    camera: string;
    microphone: string;
    geolocation: string;
    notifications: string;
  };
  vulnerabilities: {
    title: string;
    severity: ThreatSeverity;
    description: string;
    remediation: string;
  }[];
}

export interface ThreatAnalysisResult {
  severity: ThreatSeverity;
  threatScore: number; // 0 - 100
  summary: string;
  indicators: string[];
  recommendations: string[];
  domainBreakdown?: {
    hostname: string;
    protocol: string;
    isPunycode: boolean;
    isIpLiteral: boolean;
    tldRisk: 'High' | 'Normal';
    brandImpersonationDetected: string | null;
  };
}

export interface PasswordAuditResult {
  entropyBits: number;
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Cryptographic Grade';
  crackTimeOfflineGPU: string;
  crackTimeOnlineThrottled: string;
  characterPool: number;
  length: number;
  flags: string[];
  suggestions: string[];
}

export interface PhishingScenario {
  id: string;
  senderName: string;
  senderEmailOrNumber: string;
  subjectOrPreview: string;
  body: string;
  type: 'email' | 'sms';
  targetUrl: string;
  displayUrl: string;
  urgentFlags: string[];
  redFlagLocations: {
    id: string;
    label: string;
    explanation: string;
  }[];
  explanation: string;
  attackerGoal: string;
}

export interface HardeningGuideItem {
  id: string;
  platform: 'Universal' | 'macOS' | 'Windows' | 'iOS' | 'Android';
  title: string;
  description: string;
  steps: string[];
  importance: 'Essential' | 'Recommended' | 'Advanced';
}

export interface CyberLearning {
  id: string;
  category: 'threat_pattern' | 'privacy_insight' | 'scam_tactic' | 'defense_technique' | 'user_misconception';
  title: string;
  summary: string;
  extractedInsight: string;
  actionableRule: string;
  sourceType: 'chat_conversation' | 'threat_analysis' | 'user_observation';
  confidence: number;
  upvotes: number;
  createdAt: string;
}

export interface BreachExposureItem {
  id: string;
  sourceType: 'darkweb_dump' | 'stealer_log' | 'public_database' | 'paste_leak' | 'data_broker';
  title: string;
  breachDate: string;
  discoveredDate?: string;
  exposureVector: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  compromisedData: string[];
  summary: string;
  blastRadius: string;
  containmentAction: string;
}

export interface DataBrokerExposureItem {
  brokerName: string;
  category: 'People-Search' | 'Advertising ID Graph' | 'Background Check' | 'B2B Lead Intelligence';
  heldDataTypes: string[];
  estimatedExposureLevel: 'High' | 'Medium' | 'Low';
  optOutUrl: string;
  optOutDifficulty: 'Immediate Online' | '24-48h Email Verification' | 'Multi-step Form';
  optOutInstructions: string;
}

export interface IdentityScanResult {
  identifier: string;
  identifierType: 'email' | 'username' | 'phone' | 'domain';
  riskScore: number;
  exposureLevel: 'Critical Risk' | 'Elevated Risk' | 'Moderate Risk' | 'Clean / Minimal Exposure';
  summary: string;
  foundBreaches: BreachExposureItem[];
  dataBrokers: DataBrokerExposureItem[];
  darkWebMarketSignals: {
    stealerMalwareDumpsFound: number;
    pasteBinMentions: number;
    combRecordFound: boolean;
    credentialsCompromised: number;
    passwordsExposedSummary: string;
  };
  containmentChecklist: {
    title: string;
    description: string;
    priority: 'Immediate' | 'Recommended' | 'Long-term';
    category: 'Credentials' | 'Device & Malware' | 'Privacy & Data Brokers' | 'Financial & Credit';
  }[];
  scannedAt: string;
}

