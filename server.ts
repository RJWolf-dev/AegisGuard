import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

let geminiDisabledUntil = 0;

function handleGeminiError(err: unknown, context: string) {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.warn(`Gemini ${context} fallback active:`, errMsg);
  // Backoff for 60 seconds on any error or timeout so subsequent calls return immediately
  geminiDisabledUntil = Date.now() + 60000;
}

// Helper to prevent hanging external API requests
function withTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// Security Link & Phishing Analyzer API
app.post('/api/analyze-threat', async (req, res) => {
  try {
    const { target, type = 'url' } = req.body;
    if (!target || typeof target !== 'string') {
      res.status(400).json({ error: 'Target URL or message string is required.' });
      return;
    }

    // Baseline heuristic analysis
    const heuristicFlags: string[] = [];
    let heuristicScore = 15; // lower is safer, 0-100 scale

    const targetLower = target.toLowerCase();

    if (type === 'url') {
      // Check for punycode / homograph
      if (target.includes('xn--')) {
        heuristicFlags.push('Punycode / IDN Homograph domain detected (possible character spoofing)');
        heuristicScore += 35;
      }
      // Check for IP address literal
      if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(target)) {
        heuristicFlags.push('Direct IP address literal used instead of verified domain name');
        heuristicScore += 30;
      }
      // Check for suspicious deceptive subdomains
      const brandPatterns = ['paypal', 'apple', 'google', 'microsoft', 'netflix', 'amazon', 'chase', 'wellsfargo', 'bankofamerica', 'dhl', 'fedex', 'usps'];
      for (const brand of brandPatterns) {
        if (targetLower.includes(brand) && !targetLower.includes(`${brand}.com`)) {
          heuristicFlags.push(`Deceptive brand imitation pattern detected matching "${brand}"`);
          heuristicScore += 40;
          break;
        }
      }
      // Check for suspicious TLDs
      const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.loan', '.gq', '.cf', '.tk', '.ml', '.buzz', '.country'];
      for (const tld of suspiciousTLDs) {
        if (targetLower.includes(tld)) {
          heuristicFlags.push(`High-abuse Top-Level Domain detected (${tld})`);
          heuristicScore += 20;
          break;
        }
      }
      // Check for URL shortening / redirect indicators
      if (['bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly'].some(shortener => targetLower.includes(shortener))) {
        heuristicFlags.push('Shortened obfuscated link hides destination URL endpoint');
        heuristicScore += 15;
      }
      // Check for insecure protocol
      if (target.startsWith('http://')) {
        heuristicFlags.push('Insecure plaintext HTTP transmission (no TLS certificate encryption)');
        heuristicScore += 25;
      }
    } else {
      // Message / email text analysis heuristics
      const urgencyKeywords = ['immediately', 'suspended', 'unauthorized', 'wire transfer', 'crypto', 'gift card', 'action required', 'urgent', 'verify your identity', 'account restricted'];
      const matched = urgencyKeywords.filter(k => targetLower.includes(k));
      if (matched.length > 0) {
        heuristicFlags.push(`High-pressure urgency signals identified: ${matched.join(', ')}`);
        heuristicScore += matched.length * 15;
      }
    }

    heuristicScore = Math.min(Math.max(heuristicScore, 5), 98);

    // If Gemini API is available and not in backoff, request detailed threat evaluation
    if (aiClient && Date.now() > geminiDisabledUntil) {
      try {
        const prompt = `Analyze this ${type} for cyber security risks, phishing indicators, privacy threats, and deceptive tactics:
Target: "${target}"

Evaluate:
1. Threat severity level (LOW, MEDIUM, HIGH, CRITICAL)
2. Risk rating percentage (0 to 100)
3. Specific threat indicators and attack mechanics
4. Clear, practical defensive action recommendations for the user

Respond in strict JSON with keys:
{
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "threatScore": number,
  "summary": string,
  "indicators": string[],
  "recommendations": string[]
}`;

        const geminiRes = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          4000
        );

        const rawJson = geminiRes.text?.trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          res.json({
            status: 'success',
            source: 'gemini-analyzed',
            data: {
              severity: parsed.severity || (heuristicScore > 70 ? 'HIGH' : heuristicScore > 40 ? 'MEDIUM' : 'LOW'),
              threatScore: typeof parsed.threatScore === 'number' ? parsed.threatScore : heuristicScore,
              summary: parsed.summary || 'Security inspection completed.',
              indicators: Array.isArray(parsed.indicators) && parsed.indicators.length > 0 ? parsed.indicators : heuristicFlags,
              recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 ? parsed.recommendations : [
                'Do not enter credentials or MFA tokens on this site.',
                'Cross-check directly via the company\'s official verified bookmark or app.',
                'Report malicious link to your organization or Anti-Phishing Working Group.'
              ]
            }
          });
          return;
        }
      } catch (geminiErr) {
        handleGeminiError(geminiErr, 'threat analysis');
      }
    }

    // Heuristic fallback
    const severity = heuristicScore > 75 ? 'CRITICAL' : heuristicScore > 50 ? 'HIGH' : heuristicScore > 25 ? 'MEDIUM' : 'LOW';
    res.json({
      status: 'success',
      source: 'heuristic-engine',
      data: {
        severity,
        threatScore: heuristicScore,
        summary: heuristicFlags.length > 0 
          ? `Identified ${heuristicFlags.length} structural security risk indicators.`
          : 'No immediate high-risk structural anomalies detected in baseline pattern check.',
        indicators: heuristicFlags.length > 0 ? heuristicFlags : ['Standard protocol format observed', 'No obvious brand squatting token strings'],
        recommendations: [
          'Verify TLS certificate padlock in browser before supplying sensitive details.',
          'Never submit one-time SMS verification codes or passwords on unfamiliar domains.',
          'Enable multi-factor authentication (passkeys or hardware tokens preferred).'
        ]
      }
    });
  } catch (err) {
    console.error('Error analyzing threat:', err);
    res.status(500).json({ error: 'Failed to complete threat analysis.' });
  }
});

// AI Cyber Security Advisor API with Learned Collective Memory
app.post('/api/security-advisor', async (req, res) => {
  try {
    const { query, conversationHistory = [], recentLearnings = [] } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required.' });
      return;
    }

    if (aiClient && Date.now() > geminiDisabledUntil) {
      try {
        let learnedContext = '';
        if (Array.isArray(recentLearnings) && recentLearnings.length > 0) {
          learnedContext = `\n\nRecent Cyber Knowledge Stored in Memory:\n${recentLearnings.map((l: { title: string; actionableRule: string }) => `- ${l.title}: ${l.actionableRule}`).join('\n')}`;
        }

        const systemInstruction = `You are AegisGuard AI Cyber Security Copilot. You are an expert security engineer and personal privacy advocate.
Your mission is to provide clear, actionable, jargon-free security advice to help everyday users and technical workers protect their data, spot scams, configure safe privacy settings, and respond to breaches.
Always provide concrete steps: e.g. what buttons to click, what password managers to use, how passkeys work, how to freeze credit, or how to spot spoofed phone numbers.
Keep answers structured, highly readable, and reassuring without alarmism.${learnedContext}`;

        const messages = conversationHistory.slice(-4).map((msg: { role: string; content: string }) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        messages.push({
          role: 'user',
          parts: [{ text: query }]
        });

        const geminiRes = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: messages,
            config: {
              systemInstruction,
            }
          }),
          4000
        );

        const reply = geminiRes.text || 'Security guidance generated successfully.';
        res.json({ reply, source: 'gemini' });
        return;
      } catch (err) {
        handleGeminiError(err, 'security advisor');
      }
    }

    // Built-in intelligent fallback responses for key security topics
    let fallbackReply = `Here is our expert security recommendation:
1. **Verify Out-of-Band**: If you received an unexpected message or alert, never click the enclosed link or call the number provided in the message. Navigate directly to the known official website or contact their verified customer support line.
2. **Isolate Credentials**: Never reuse passwords across platforms. Use a dedicated password manager and enable authenticator apps (TOTP) or passkeys rather than SMS 2FA.
3. **Session Hygiene**: When using public networks or untrusted devices, always keep your operating system updated and use an encrypted DNS/VPN tunnel.`;

    const qLower = query.toLowerCase();
    if (qLower.includes('password') || qLower.includes('passkey')) {
      fallbackReply = `### Password & Passkey Best Practices:
1. **Passkeys (FIDO2/WebAuthn)** are the gold standard because they are cryptographically bound to the website domain, making them completely immune to phishing.
2. **Length Over Complexity**: A 4-word random passphrase (e.g. \`correct-horse-battery-staple\`) provides >50 bits of entropy and is far harder to crack than \`P@$$w0rd!\`.
3. **Password Managers**: Use a reputable manager (Bitwarden, 1Password, or Keychain) so you never need to remember or manually type complex credentials.`;
    } else if (qLower.includes('wifi') || qLower.includes('public')) {
      fallbackReply = `### Public Wi-Fi Defense Tactics:
1. **Beware of Evil Twin Networks**: Attackers set up rogue hotspots with names like "Airport_Free_WiFi" to intercept unencrypted traffic.
2. **Force HTTPS & Encrypted DNS**: Ensure your browser displays the lock icon and uses DNS-over-HTTPS (DoH).
3. **Disable Auto-Connect & File Sharing**: Turn off "Connect automatically to open networks" and disable AirDrop/Network Sharing while in public venues.`;
    } else if (qLower.includes('phishing') || qLower.includes('sms') || qLower.includes('text') || qLower.includes('email')) {
      fallbackReply = `### How to Triage Suspicious Messages:
1. **Urgency is the #1 Red Flag**: Scammers create artificial pressure ("Account suspended in 24 hours", "Unauthorized $840 charge") to force emotional decision-making.
2. **Inspect the Full Sender Domain**: Don't trust the display name (e.g., "PayPal Support"). Expand the header to inspect the actual \`From:\` email address.
3. **Hover Before Clicking**: On desktop, hover over links to preview the actual destination URL in the status bar before clicking.`;
    }

    res.json({ reply: fallbackReply, source: 'heuristic-advisor' });
  } catch (err) {
    console.error('Advisor error:', err);
    res.status(500).json({ error: 'Failed to process security query.' });
  }
});

// Learning Synthesis API: Extracts new cyber security insights from chats & user experiences
app.post('/api/synthesize-learning', async (req, res) => {
  try {
    const { contextText, sourceType = 'chat_conversation' } = req.body;
    if (!contextText || typeof contextText !== 'string') {
      res.status(400).json({ error: 'Context text is required for learning synthesis.' });
      return;
    }

    if (aiClient && Date.now() > geminiDisabledUntil) {
      try {
        const prompt = `You are the AegisGuard Collective Cyber Intelligence Engine.
Analyze this user interaction, cyber security query, scam description, or threat analysis:
"""${contextText.slice(0, 3000)}"""

Your goal: Extract what the AI and security system should learn from this to improve future defenses and educate other users.
Categorize as one of: 'threat_pattern', 'privacy_insight', 'scam_tactic', 'defense_technique', 'user_misconception'.

Respond in strict JSON with:
{
  "category": "threat_pattern" | "privacy_insight" | "scam_tactic" | "defense_technique" | "user_misconception",
  "title": string (concise, max 120 chars),
  "summary": string (1-2 sentences, max 300 chars),
  "extractedInsight": string (deep tactical analysis, max 800 chars),
  "actionableRule": string (concrete 1-sentence defense rule, max 300 chars),
  "confidence": number (between 0.85 and 0.99)
}`;

        const geminiRes = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            }
          }),
          4000
        );

        const rawJson = geminiRes.text?.trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const learningId = `learn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const learning = {
            id: learningId,
            category: parsed.category || 'threat_pattern',
            title: parsed.title || 'Emerging Security Pattern',
            summary: parsed.summary || 'Insight extracted from recent security scenario.',
            extractedInsight: parsed.extractedInsight || 'Security insight analyzed.',
            actionableRule: parsed.actionableRule || 'Always verify sender out-of-band.',
            sourceType,
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
            upvotes: 1,
            createdAt: new Date().toISOString()
          };
          res.json({ status: 'success', data: learning });
          return;
        }
      } catch (err) {
        handleGeminiError(err, 'learning synthesis');
      }
    }

    // Heuristic fallback learning synthesis
    const learningId = `learn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fallbackLearning = {
      id: learningId,
      category: 'scam_tactic',
      title: 'Observed Social Engineering Pattern',
      summary: `Synthesized from user query: "${contextText.slice(0, 100)}..."`,
      extractedInsight: 'Criminals continuously adapt communication channels (SMS, chat apps, deceptive subdomains) to elicit urgent emotional reactions before critical verification can take place.',
      actionableRule: 'Pause before complying with urgent payment or verification requests, and confirm through an independent verified channel.',
      sourceType,
      confidence: 0.90,
      upvotes: 1,
      createdAt: new Date().toISOString()
    };
    res.json({ status: 'success', data: fallbackLearning });
  } catch (err) {
    console.error('Learning synthesis error:', err);
    res.status(500).json({ error: 'Failed to synthesize cyber learning.' });
  }
});

// Setup dev server with Vite middlewares or production static serving
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AegisGuard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
