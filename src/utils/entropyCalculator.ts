import { PasswordAuditResult } from '../types/security';

const COMMON_PATTERNS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'letmein',
  'iloveyou', 'monkey', 'dragon', 'master', 'football', 'shadow'
];

export function analyzePasswordEntropy(password: string): PasswordAuditResult {
  if (!password) {
    return {
      entropyBits: 0,
      strength: 'Very Weak',
      crackTimeOfflineGPU: '0.000 seconds',
      crackTimeOnlineThrottled: '0.000 seconds',
      characterPool: 0,
      length: 0,
      flags: ['No characters entered'],
      suggestions: ['Enter a password or generate a secure multi-word passphrase.']
    };
  }

  const length = password.length;
  let pool = 0;
  const flags: string[] = [];
  const suggestions: string[] = [];

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) pool += 26;
  if (hasUpper) pool += 26;
  if (hasDigits) pool += 10;
  if (hasSymbols) pool += 33;

  // Raw Shannon entropy formula: length * log2(pool)
  let rawEntropy = pool > 0 ? length * (Math.log(pool) / Math.log(2)) : 0;

  // Deductions for predictable human behavior
  const lowerPassword = password.toLowerCase();

  // 1. Common dictionary substrings
  for (const pattern of COMMON_PATTERNS) {
    if (lowerPassword.includes(pattern)) {
      rawEntropy *= 0.6;
      flags.push(`Contains dictionary word or common token: "${pattern}"`);
      suggestions.push(`Avoid predictable words like "${pattern}".`);
      break;
    }
  }

  // 2. Repetitive characters (e.g. "aaaaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    rawEntropy *= 0.75;
    flags.push('Consecutive repeating characters detected');
    suggestions.push('Avoid repeating identical characters consecutively.');
  }

  // 3. Simple sequential keyboard walks (e.g. "123", "abc")
  if (/012|123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd/.test(lowerPassword)) {
    rawEntropy *= 0.8;
    flags.push('Sequential numeric or keyboard walking pattern detected');
    suggestions.push('Avoid contiguous keyboard runs (e.g. "123", "qwe").');
  }

  // 4. Short length warnings
  if (length < 8) {
    flags.push('Critically short (< 8 characters): trivially crackable');
    suggestions.push('Aim for at least 14-16 characters or a 4-word passphrase.');
  } else if (length < 12) {
    flags.push('Moderate length: vulnerable to modern parallel GPU rigs');
    suggestions.push('Expand length past 14 characters for long-term cryptographic resilience.');
  }

  if (!hasSymbols) {
    suggestions.push('Incorporate special symbols (#, $, %, &) or spaces.');
  }
  if (!hasUpper || !hasLower) {
    suggestions.push('Mix uppercase and lowercase registers.');
  }

  const finalEntropy = Math.max(0, Math.round(rawEntropy * 10) / 10);

  // Strength categorization
  let strength: PasswordAuditResult['strength'] = 'Very Weak';
  if (finalEntropy >= 85) strength = 'Cryptographic Grade';
  else if (finalEntropy >= 65) strength = 'Strong';
  else if (finalEntropy >= 45) strength = 'Moderate';
  else if (finalEntropy >= 28) strength = 'Weak';

  // Calculate cracking time based on entropy: combinations = 2^entropy
  // Offline GPU Hashcat cluster (e.g. 8x RTX 4090 ~ 100 Billion hashes/sec = 10^11)
  const combinations = Math.pow(2, finalEntropy);
  const secondsOffline = combinations / 1e11;
  const secondsOnline = combinations / 10; // 10 attempts/sec throttled

  return {
    entropyBits: finalEntropy,
    strength,
    crackTimeOfflineGPU: formatDuration(secondsOffline),
    crackTimeOnlineThrottled: formatDuration(secondsOnline),
    characterPool: pool,
    length,
    flags: flags.length > 0 ? flags : ['No predictable dictionary patterns detected'],
    suggestions: suggestions.length > 0 ? suggestions : ['Excellent cryptographic complexity. Keep this credential stored in a zero-knowledge password manager.']
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 0.001) return 'Instant (< 1 millisecond)';
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} milliseconds`;
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(0)} minutes`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 86400 * 30) return `${(seconds / 86400).toFixed(0)} days`;
  if (seconds < 86400 * 365) return `${(seconds / (86400 * 30)).toFixed(1)} months`;
  if (seconds < 86400 * 365 * 100) return `${(seconds / (86400 * 365)).toFixed(0)} years`;
  if (seconds < 86400 * 365 * 1000000) return `${(seconds / (86400 * 365 * 1000)).toFixed(0)} thousand years`;
  return `${(seconds / (86400 * 365 * 1e6)).toFixed(1)} million years+`;
}

// Cryptographically secure passphrase generator
const WORD_LIST = [
  'cascade', 'falcon', 'nebula', 'glacier', 'quantum', 'cipher', 'aurora',
  'zenith', 'obsidian', 'citadel', 'vector', 'horizon', 'prism', 'vortex',
  'monolith', 'dynamo', 'beacon', 'solstice', 'strata', 'echo', 'valiant',
  'ember', 'kestrel', 'orbit', 'pulsar', 'titan', 'vanguard', 'summit'
];

export function generateSecurePassphrase(wordCount = 4, includeNumber = true, separator = '-'): string {
  const chosenWords: string[] = [];
  const randomBuffer = new Uint32Array(wordCount + 1);
  crypto.getRandomValues(randomBuffer);

  for (let i = 0; i < wordCount; i++) {
    const wordIndex = randomBuffer[i] % WORD_LIST.length;
    let word = WORD_LIST[wordIndex];
    // Capitalize first letter on every other word
    if (i % 2 === 1) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosenWords.push(word);
  }

  let phrase = chosenWords.join(separator);
  if (includeNumber) {
    const num = (randomBuffer[wordCount] % 900) + 100;
    phrase += `${separator}${num}`;
  }
  return phrase;
}
