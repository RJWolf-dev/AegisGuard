import { DailyTip } from '../types/security';

export const DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-1',
    dayIndex: 1,
    category: 'Identity',
    title: 'Passkeys vs Traditional Passwords: Why Math Beats Memory',
    summary: 'Discover how public-key cryptography in Passkeys makes credential stuffing and phishing attacks mathematically impossible.',
    readTime: '3 min read',
    impact: 'Critical',
    attackMechanic: 'In standard phishing, an attacker mirrors your bank or email login page. When you type your password, they harvest it immediately. Even with SMS 2FA, they can intercept the one-time code in real time via reverse-proxy kits like Evilginx.',
    defenseAction: [
      'Navigate to account settings on Google, Apple, GitHub, or Amazon and choose "Create Passkey".',
      'Authenticate with your biometric sensor (Touch ID, Face ID, or Windows Hello).',
      'The private key never leaves your physical device; only a public key verification signature is transmitted.'
    ],
    challenge: {
      question: 'Why is a Passkey immune to phishing websites that spoof your bank login page?',
      options: [
        'Because the browser cryptographically verifies the origin domain before signing with the private key.',
        'Because passkeys are 64 characters long and cannot be guessed.',
        'Because passkeys require an SMS confirmation code before saving.',
        'Because passkeys are stored on the bank server.'
      ],
      correctIndex: 0,
      explanation: 'Correct! The WebAuthn browser standard automatically binds authentication to the true DNS origin. A fake domain cannot trick the browser into supplying cryptographic signatures for the real domain.'
    }
  },
  {
    id: 'tip-2',
    dayIndex: 2,
    category: 'Network',
    title: 'The "Evil Twin" Wi-Fi Trap at Cafés and Airports',
    summary: 'How cyber criminals broadcast rogue Wi-Fi access points with familiar public names to hijack your unencrypted network traffic.',
    readTime: '3 min read',
    impact: 'High',
    attackMechanic: 'Attackers deploy a portable Wi-Fi transceiver (e.g. Wi-Fi Pineapple) broadcasting an SSID like "Free_Airport_WiFi" or "Starbucks_Guest". Your device may automatically connect or you manually join. The attacker acts as the default gateway, performing Man-in-the-Middle (MitM) DNS poisoning.',
    defenseAction: [
      'Turn off "Auto-Join Known Networks" on your phone and laptop settings.',
      'Always utilize an encrypted WireGuard/OpenVPN tunnel or encrypted DNS (DNS-over-HTTPS) before browsing on open Wi-Fi.',
      'Treat all public networks as untrusted; avoid logging into financial portals without verified TLS certificate pin.'
    ],
    challenge: {
      question: 'What is the most secure behavior when needing internet at an airport or coffee shop?',
      options: [
        'Use your personal cellular hotspot instead of public Wi-Fi whenever possible.',
        'Accept all TLS security warning prompts so the captive portal can authenticate.',
        'Connect only to public networks that do not require a browser login portal.',
        'Delete your cookies before connecting to the public Wi-Fi.'
      ],
      correctIndex: 0,
      explanation: 'Using your private cellular mobile hotspot circumvents untrusted local Wi-Fi environments completely, isolating your traffic from nearby radio packet sniffers and rogue gateways.'
    }
  },
  {
    id: 'tip-3',
    dayIndex: 3,
    category: 'Social Engineering',
    title: 'The Anatomy of Smishing: "USPS / FedEx Incomplete Address" Scams',
    summary: 'Recognize the psychological triggers used in mass automated SMS smishing campaigns targeting package deliveries.',
    readTime: '2 min read',
    impact: 'High',
    attackMechanic: 'Fraudsters blast millions of SMS messages claiming: "[USPS Notice]: Your package cannot be delivered due to incomplete street address. Update here: usps-delivery-redirection[.]top". The victim clicks, enters their home address, and is prompted for a $1.80 "redelivery fee" to steal credit card data.',
    defenseAction: [
      'Never click links in unexpected delivery text messages, especially from random international country codes (+63, +44, +84).',
      'Copy the tracking number directly and check it on the carrier’s official web app (usps.com or fedex.com).',
      'Forward suspicious SMS spam to 7726 (SPAM) to flag the sender with telecom carriers.'
    ],
    challenge: {
      question: 'An SMS arrives saying your package is held at a warehouse with a link "http://usps.track-update.icu". What is the definitive red flag?',
      options: [
        'The primary domain is "track-update.icu", not the official "usps.com" domain.',
        'The text message was sent after 5:00 PM.',
        'The message only has 3 sentences.',
        'The tracking number has both letters and numbers.'
      ],
      correctIndex: 0,
      explanation: 'In domain hierarchy, the domain immediately preceding the TLD (.icu) is the owner. "usps" here is merely a deceptive subdomain on a third-party scam server.'
    }
  },
  {
    id: 'tip-4',
    dayIndex: 4,
    category: 'Device',
    title: 'Zero-Click Exploits & The Power of Rapid Patch Cycles',
    summary: 'Why software updates aren\'t just about new emojis—they seal active vulnerabilities being weaponized in the wild.',
    readTime: '4 min read',
    impact: 'Critical',
    attackMechanic: 'Zero-click exploits (such as Pegasus or image-parsing buffer overflows) compromise devices through hidden SMS, iMessage, or PDF parsing without the user ever clicking anything. As soon as vendors release patches (CVEs), reverse engineers analyze the fix to build exploit scripts against unpatched devices.',
    defenseAction: [
      'Enable "Automatic Security Responses & System Updates" across iOS, Android, macOS, and Windows.',
      'Reboot your smartphone at least once a week: memory-only spyware implants are frequently flushed upon power cycle.',
      'On Apple devices under high threat profile, activate "Lockdown Mode" to heavily restrict dangerous browser engines and message formats.'
    ],
    challenge: {
      question: 'Why should you restart your smartphone regularly as a security practice?',
      options: [
        'Many non-persistent mobile malware implants reside in volatile memory (RAM) and are cleared on reboot.',
        'Rebooting changes your device MAC address automatically.',
        'Rebooting resets your carrier SIM pin.',
        'Rebooting disables your device GPS permanently.'
      ],
      correctIndex: 0,
      explanation: 'Advanced non-persistent spyware chains often avoid writing to encrypted flash storage to evade forensic integrity monitors. A device reboot disrupts active memory-resident payload processes.'
    }
  },
  {
    id: 'tip-5',
    dayIndex: 5,
    category: 'Privacy',
    title: 'Canvas & Hardware Fingerprinting: How Sites Track You Without Cookies',
    summary: 'Understand the hidden telemetry browsers leak about your graphics card, display, and fonts that form a unique persistent ID.',
    readTime: '4 min read',
    impact: 'High',
    attackMechanic: 'When you visit a web page, an invisible canvas element executes rendering routines. Because subtle variations exist across GPU microcode, anti-aliasing drivers, and system fonts, the resulting rasterized pixel array produces a distinct mathematical hash unique to your computer.',
    defenseAction: [
      'Use privacy-hardened browsers with built-in canvas randomization (Brave, Firefox with privacy.resistFingerprinting, or Mullvad Browser).',
      'Disable unnecessary browser extensions: each installed extension adds detectable DOM modification signatures that make your browser fingerprint even more unique.',
      'Enable Global Privacy Control (GPC) headers to broadcast legal do-not-sell preferences.'
    ],
    challenge: {
      question: 'Does clearing cookies and browsing in an Incognito window protect you against canvas fingerprinting?',
      options: [
        'No, because your hardware, GPU driver, and font rendering remain identical in incognito mode.',
        'Yes, because incognito mode changes your graphics card model.',
        'Yes, because canvas fingerprinting is stored as a cookie.',
        'Yes, because incognito mode blocks all JavaScript by default.'
      ],
      correctIndex: 0,
      explanation: 'Incognito mode only isolates local cookies and history. Your hardware rendering characteristics and installed fonts still yield the exact same canvas hash unless actively randomized by privacy features.'
    }
  },
  {
    id: 'tip-6',
    dayIndex: 6,
    category: 'Identity',
    title: 'SIM Swapping Defense: Lock Down Your Carrier Account',
    summary: 'How attackers trick cellular carriers into transferring your phone number to their SIM card, bypassing SMS two-factor codes.',
    readTime: '3 min read',
    impact: 'Critical',
    attackMechanic: 'An attacker impersonates you over the phone with your cellular carrier support agent, claiming they lost their phone. Using leaked birthdates and Social Security numbers, they pass identity verification and port your phone number to their SIM card. Within minutes, they request password resets for your email and bank via SMS codes.',
    defenseAction: [
      'Set a carrier account "Port-Out PIN" or "SIM Transfer Lock" with your wireless provider (AT&T, Verizon, T-Mobile).',
      'Remove SMS as your two-factor method on email, banking, and social accounts in favor of TOTP apps (Authenticator) or FIDO2 Passkeys.',
      'Keep your cellular carrier account login password unique and secured with a hardware key.'
    ],
    challenge: {
      question: 'Which of the following two-factor authentication methods is immune to SIM swap attacks?',
      options: [
        'Hardware Security Key (FIDO2 / YubiKey) or Authenticator App (TOTP)',
        'SMS text message verification code',
        'Voice phone call verification code',
        'Security question regarding your mother’s maiden name'
      ],
      correctIndex: 0,
      explanation: 'Authenticator apps generate local time-based keys (TOTP) without telecom routing, and FIDO2 hardware keys authenticate via cryptographic challenge-response, neither of which can be intercepted via SIM swapping.'
    }
  }
];
