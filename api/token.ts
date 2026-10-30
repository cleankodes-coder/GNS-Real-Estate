import { GoogleGenAI, Modality } from '@google/genai';
import {
  RECEPTIONIST_TOOLS,
  SARA_SYSTEM_INSTRUCTION,
} from './_shared/websiteControl.js';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not set',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
            },
            systemInstruction: SARA_SYSTEM_INSTRUCTION,
            tools: RECEPTIONIST_TOOLS,
          },
        },
      },
    });

    return res.status(200).json({
      token: token.name,
      model: 'gemini-3.8-live',
      voiceName: 'Aoede',
    });
  } catch (err: any) {
    console.error('Error generating ephemeral Gemini Live token:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate ephemeral Gemini Live token',
    });
  }
}
