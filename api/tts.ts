import { GoogleGenAI } from '@google/genai';

async function generateGeminiSpeech(text: string, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const voices = ['Aoede', 'Kore'];
  let lastErr: any = null;

  for (const voiceName of voices) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: 'Warm, friendly young woman working as a receptionist on a phone call. Natural, conversational, calm pace, polite and welcoming tone.',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return base64Audio;
      }
    } catch (err: any) {
      console.warn(`TTS with voice ${voiceName} failed:`, err?.message || err);
      lastErr = err;
    }
  }

  throw lastErr || new Error('Gemini TTS generation failed');
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
  }

  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text string is required for speech synthesis.' });
    }

    const audioBase64 = await generateGeminiSpeech(text.trim(), apiKey);
    return res.status(200).json({ audioBase64 });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    return res.status(500).json({ error: err?.message || 'Speech synthesis failed' });
  }
}
