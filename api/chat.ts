import { GoogleGenAI } from '@google/genai';
import {
  RECEPTIONIST_TOOLS,
  SARA_SYSTEM_INSTRUCTION,
} from './_shared/websiteControl.js';
import { executeWebsiteTool } from './_shared/toolExecutor.js';

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
      lastErr = err;
    }
  }

  throw lastErr || new Error('TTS synthesis failed');
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

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  try {
    const { message, history, generateAudio } = req.body || {};

    if (!message && (!Array.isArray(history) || history.length === 0)) {
      return res.status(400).json({ error: 'Message or conversation history is required.' });
    }

    const rawItems: Array<{ role: 'user' | 'model'; text: string }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item || !item.text || typeof item.text !== 'string') continue;
        if (item.isToolStatus) continue;
        const role = item.sender === 'user' ? 'user' : 'model';
        rawItems.push({ role, text: item.text.trim() });
      }
    }

    if (message && typeof message === 'string' && message.trim().length > 0) {
      const trimmedMsg = message.trim();
      if (rawItems.length === 0 || rawItems[rawItems.length - 1].text !== trimmedMsg) {
        rawItems.push({ role: 'user', text: trimmedMsg });
      }
    }

    if (rawItems.length === 0) {
      return res.status(400).json({ error: 'No valid message content provided.' });
    }

    const formattedContents: Array<any> = [];

    for (const item of rawItems) {
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
        formattedContents[formattedContents.length - 1].parts[0].text += `\n${item.text}`;
      } else {
        formattedContents.push({
          role: item.role,
          parts: [{ text: item.text }],
        });
      }
    }

    while (formattedContents.length > 0 && formattedContents[0].role !== 'user') {
      formattedContents.shift();
    }

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: message || 'Hello' }],
      });
    }

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let lastError: any = null;
    let replyText = '';
    const executedToolActions: Array<{
      tool: string;
      args: any;
      statusText: string;
      clientAction?: any;
      isError?: boolean;
    }> = [];

    for (const modelName of candidateModels) {
      try {
        const roundtripContents = [...formattedContents];
        const response = await ai.models.generateContent({
          model: modelName,
          contents: roundtripContents,
          config: {
            systemInstruction: SARA_SYSTEM_INSTRUCTION,
            tools: RECEPTIONIST_TOOLS,
          },
        });

        const initialText = response.text ? response.text.trim() : '';

        // Check if Gemini invoked any function
        if (response.functionCalls && response.functionCalls.length > 0) {
          const call = response.functionCalls[0];
          const toolName = call.name || '';
          let toolSuccess = false;
          let toolOutputData: any = null;
          let summary = '';

          try {
            const toolExec = await executeWebsiteTool(toolName, call.args);
            toolSuccess = true;
            toolOutputData = toolExec.data;
            summary = toolExec.summaryForSara;

            executedToolActions.push({
              tool: toolName,
              args: call.args,
              statusText: toolExec.statusText,
              clientAction: toolExec.clientAction,
              isError: false,
            });
          } catch (err: any) {
            const errorMsg = err?.message || 'Tool execution error';
            executedToolActions.push({
              tool: toolName,
              args: call.args,
              statusText: `Error: ${errorMsg}`,
              isError: true,
            });
            toolOutputData = { error: errorMsg };
            summary = `Tool error: ${errorMsg}. Honestly communicate this issue to the user.`;
          }

          const candidateContent = response.candidates?.[0]?.content;
          if (candidateContent) {
            roundtripContents.push(candidateContent);
          } else {
            roundtripContents.push({
              role: 'model',
              parts: [{ functionCall: { name: toolName, args: call.args } }],
            });
          }

          roundtripContents.push({
            role: 'tool',
            parts: [
              {
                functionResponse: {
                  name: toolName,
                  response: {
                    success: toolSuccess,
                    result: toolOutputData,
                    summary,
                  },
                },
              },
            ],
          });

          const followUp = await ai.models.generateContent({
            model: modelName,
            contents: roundtripContents,
            config: {
              systemInstruction: SARA_SYSTEM_INSTRUCTION,
              tools: RECEPTIONIST_TOOLS,
            },
          });

          const followUpText = followUp.text ? followUp.text.trim() : '';

          let introSentence = initialText;
          if (!introSentence) {
            if (toolName === 'show_properties') {
              introSentence = 'Sure, let me take you to our Properties section.';
            } else if (toolName === 'navigate_to_section') {
              const sec = String(call.args?.section || 'page');
              introSentence = `Sure, let me take you to our ${sec.charAt(0).toUpperCase() + sec.slice(1)} section.`;
            } else if (toolName === 'get_property_details') {
              introSentence = 'Sure, let me open those property details for you.';
            } else if (toolName === 'book_appointment') {
              introSentence = 'Let me confirm your booking details right away.';
            } else if (toolName === 'save_lead_details') {
              introSentence = 'I will record your contact details for our advisory team.';
            } else if (toolName === 'end_call') {
              introSentence = 'Thank you for reaching out to GNS Real Estate. Have a wonderful day, goodbye!';
            }
          }

          const hasIntroInFollowUp =
            followUpText.toLowerCase().startsWith('sure') ||
            followUpText.toLowerCase().startsWith('let me') ||
            followUpText.toLowerCase().startsWith('of course') ||
            followUpText.toLowerCase().startsWith('here');

          if (introSentence && !hasIntroInFollowUp) {
            replyText = `${introSentence} ${followUpText}`;
          } else {
            replyText = followUpText || introSentence;
          }
        } else {
          replyText = initialText;
        }

        if (replyText) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or busy:`, err?.message || err);
        lastError = err;
      }
    }

    if (!replyText) {
      const errMsg = lastError?.message || lastError?.toString() || 'Failed to generate response from Gemini API';
      return res.status(500).json({ error: errMsg });
    }

    let audioBase64: string | undefined;
    if (generateAudio) {
      try {
        audioBase64 = await generateGeminiSpeech(replyText, apiKey);
      } catch (audioErr: any) {
        console.warn('Speech synthesis for reply failed:', audioErr?.message || audioErr);
      }
    }

    return res.status(200).json({
      text: replyText,
      toolActions: executedToolActions,
      audioBase64,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error while calling Gemini API' });
  }
}
