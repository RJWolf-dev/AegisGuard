import { CyberLearning } from '../types/security';

export const INITIAL_CYBER_LEARNINGS: CyberLearning[] = [
  {
    id: 'learn_toll_smishing_2026',
    category: 'scam_tactic',
    title: 'Toll-Road & Expressway Impersonation SMS Wave',
    summary: 'Attackers send mass texts claiming outstanding toll balances of $3.50-$6.00 with urgency deadlines to trick victims into entering credit cards.',
    extractedInsight: 'Criminals bypass email spam filters by sending SMS texts with dynamic lookalike domains (e.g., toll-services-ny.info). They intentionally use small dollar figures under $10 so victims do not hesitate or review bank statements.',
    actionableRule: 'Never pay toll citations through an SMS link. Open the official state toll agency app or portal directly.',
    sourceType: 'threat_analysis',
    confidence: 0.98,
    upvotes: 42,
    createdAt: '2026-10-18T14:20:00Z'
  },
  {
    id: 'learn_incognito_misconception',
    category: 'user_misconception',
    title: 'Incognito Mode Protects Network Traffic from ISPs',
    summary: 'Many users mistakenly assume Private / Incognito mode encrypts their internet browsing from Wi-Fi routers and internet providers.',
    extractedInsight: 'Incognito mode only deletes local cookies, form inputs, and browsing history on the physical device. Unencrypted DNS and IP destination traffic remain fully visible to local Wi-Fi admins, routers, and ISPs unless an encrypted tunnel (DoH / VPN) is active.',
    actionableRule: 'Use Incognito for local device privacy only; use encrypted DNS (DoH) or a trusted WireGuard VPN to shield traffic from local network snooping.',
    sourceType: 'chat_conversation',
    confidence: 0.95,
    upvotes: 38,
    createdAt: '2026-10-17T11:05:00Z'
  },
  {
    id: 'learn_call_forwarding_exploit',
    category: 'threat_pattern',
    title: 'Conditional Call Forwarding Dial Code Exploit (*21* and *72)',
    summary: 'Scammers posing as delivery couriers trick victims into dialing star codes that redirect all incoming verification calls to the attacker.',
    extractedInsight: 'Telecommunication star codes like *21* or *72 enable carrier-level call forwarding. Once activated, the attacker triggers an automated bank or WhatsApp phone-call verification, which rings directly on the attacker\'s phone.',
    actionableRule: 'Never dial numeric codes starting with * or # instructed by a caller. Check your carrier forwarding settings immediately if calls stop ringing.',
    sourceType: 'user_observation',
    confidence: 0.96,
    upvotes: 56,
    createdAt: '2026-10-15T09:42:00Z'
  },
  {
    id: 'learn_oauth_consent_phish',
    category: 'defense_technique',
    title: 'Illicit OAuth Consent App Permissions Grant',
    summary: 'Attackers create rogue cloud applications that request permission to read user inbox and files without stealing the password.',
    extractedInsight: 'Because multi-factor authentication (MFA) blocks password theft, attackers create deceptive 3P OAuth applications (e.g. "Meeting Sync Tool") requesting offline access tokens. Users approve the OAuth prompt, bypassing 2FA entirely.',
    actionableRule: 'Audit connected 3P applications in Google and Microsoft account security centers quarterly. Revoke access to apps you do not actively use.',
    sourceType: 'chat_conversation',
    confidence: 0.94,
    upvotes: 31,
    createdAt: '2026-10-12T16:15:00Z'
  },
  {
    id: 'learn_sim_pin_carrier',
    category: 'privacy_insight',
    title: 'Port-Out Fraud Immunity via Carrier SIM PIN Lock',
    summary: 'Setting a dedicated 6-digit transfer PIN with your mobile carrier neutralizes 99% of social-engineering SIM port attempts.',
    extractedInsight: 'Even if an attacker possesses your full SSN and birthdate from a medical or retail breach, federal telecom regulations prohibit carrier agents from porting numbers without the independent transfer PIN.',
    actionableRule: 'Call your cellular carrier or use their official app to set a "SIM Protection Transfer PIN" distinct from your account password.',
    sourceType: 'threat_analysis',
    confidence: 0.99,
    upvotes: 64,
    createdAt: '2026-10-10T08:30:00Z'
  }
];
