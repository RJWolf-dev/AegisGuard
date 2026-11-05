import { HardeningGuideItem } from '../types/security';

export const HARDENING_GUIDES: HardeningGuideItem[] = [
  {
    id: 'guide-ios-1',
    platform: 'iOS',
    title: 'Enable Stolen Device Protection',
    description: 'Prevents thieves who observe your passcode from immediately changing your Apple ID password or viewing stored passwords.',
    importance: 'Essential',
    steps: [
      'Open Settings > Face ID & Passcode.',
      'Authenticate with your passcode.',
      'Tap "Stolen Device Protection" and toggle it to "Turn On".',
      'Set "Require Security Delay" to "Always".'
    ]
  },
  {
    id: 'guide-android-1',
    platform: 'Android',
    title: 'Lock Down App Sideloading & Unknown Sources',
    description: 'Restricts malicious APK installations from rogue browser downloads and fake SMS delivery links.',
    importance: 'Essential',
    steps: [
      'Open Settings > Security & Privacy > More Security Settings.',
      'Select "Install Unknown Apps".',
      'Verify that all browsers, file managers, and messaging apps are set to "Not allowed".',
      'Ensure "Google Play Protect" scanning is enabled.'
    ]
  },
  {
    id: 'guide-macos-1',
    platform: 'macOS',
    title: 'Enable FileVault Full-Disk XTS-AES-128 Encryption',
    description: 'Guarantees that if your MacBook is physically stolen, your drive data cannot be read without your account password.',
    importance: 'Essential',
    steps: [
      'Open System Settings > Privacy & Security.',
      'Scroll down to the FileVault section.',
      'Click "Turn On" and choose whether to store recovery key in iCloud or write down a physical recovery code.',
      'Keep your device plugged into power while initial disk encryption finishes.'
    ]
  },
  {
    id: 'guide-win-1',
    platform: 'Windows',
    title: 'Activate Core Isolation & Memory Integrity (HVCI)',
    description: 'Uses hardware virtualization to protect core Windows kernel processes against privilege escalation and zero-day drivers.',
    importance: 'Essential',
    steps: [
      'Open Windows Security (search in Start menu).',
      'Click on "Device Security".',
      'Under Core isolation, click "Core isolation details".',
      'Toggle "Memory integrity" to ON and restart your computer.'
    ]
  },
  {
    id: 'guide-universal-1',
    platform: 'Universal',
    title: 'Configure Encrypted DNS (DNS-over-HTTPS / DoH)',
    description: 'Encrypts your DNS queries so your Internet Service Provider (ISP), coffee shop router, or government cannot log which domains you visit.',
    importance: 'Recommended',
    steps: [
      'In Chrome, Edge, Brave, or Firefox: go to Settings > Privacy and Security > Security.',
      'Scroll to "Use secure DNS".',
      'Select "With" and choose a privacy-respecting provider such as Cloudflare (1.1.1.1) or Quad9 (9.9.9.9).'
    ]
  },
  {
    id: 'guide-universal-2',
    platform: 'Universal',
    title: 'Freeze Your Credit with All Three Major Bureaus',
    description: 'Stops identity thieves from opening new credit cards, auto loans, or mortgages in your name even if your SSN was breached.',
    importance: 'Essential',
    steps: [
      'Visit Experian.com/freeze and create a free account to lock your credit report.',
      'Visit Equifax.com/personal/credit-report-services/credit-freeze/ and set freeze.',
      'Visit TransUnion.com/credit-freeze and freeze your file.',
      'Freezing credit is 100% free by federal law and does not affect your existing credit score.'
    ]
  }
];

export const THREAT_CONCEPTS = [
  {
    term: 'Zero-Day Exploit',
    category: 'Vulnerability',
    summary: 'A security flaw known to attackers or researchers before the software manufacturer has developed a patch (day zero of defense).',
    defense: 'Rapid automated operating system updates and isolating critical workloads.'
  },
  {
    term: 'Credential Stuffing',
    category: 'Authentication',
    summary: 'Automated bots testing millions of leaked username/password combos from old breaches across banking and retail sites.',
    defense: 'Never reuse passwords; use password managers and unique passkeys for every service.'
  },
  {
    term: 'Man-in-the-Middle (MitM)',
    category: 'Network',
    summary: 'An attacker secretly intercepts and relays communications between two parties who believe they are communicating directly.',
    defense: 'Enforce strict TLS encryption and verify certificate pins; avoid unencrypted public Wi-Fi.'
  },
  {
    term: 'SIM Swapping',
    category: 'Telecom & Identity',
    summary: 'Socially engineering telecom carrier representatives to port a victim\'s phone number to a criminal\'s SIM card.',
    defense: 'Set a carrier transfer PIN; switch two-factor authentication from SMS to hardware keys (FIDO2) or TOTP apps.'
  },
  {
    term: 'Punycode / Homograph Attack',
    category: 'Deception',
    summary: 'Using lookalike Cyrillic or Greek Unicode characters (e.g., Cyrillic "а" instead of Latin "a") to register visually indistinguishable malicious domains.',
    defense: 'Rely on modern browsers that render suspicious IDN domains as "xn--" punycode; verify certificates.'
  },
  {
    term: 'Cross-Site Scripting (XSS)',
    category: 'Web Security',
    summary: 'Injecting malicious scripts into benign and trusted websites to steal active session cookies and impersonate users.',
    defense: 'Robust Content Security Policy (CSP), HttpOnly cookie flags, and input sanitization.'
  }
];
