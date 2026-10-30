import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';
import {
  RECEPTIONIST_TOOLS,
  SARA_SYSTEM_INSTRUCTION,
} from './src/data/websiteControl';
import { executeWebsiteTool } from './server/toolExecutor';
import { getAllBookings, getAllLeads } from './server/backendStore';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize Gemini client with standard telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Synthesize speech using Gemini native TTS with female prebuilt voice (Aoede, fallback Kore)
async function generateGeminiSpeech(text: string): Promise<string> {
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

// Standalone endpoint for Text-to-Speech synthesis
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text string is required for speech synthesis.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing from environment.' });
    }

    const audioBase64 = await generateGeminiSpeech(text.trim());
    return res.json({ audioBase64 });
  } catch (error: any) {
    console.error('API /api/tts error:', error);
    return res.status(500).json({ error: error?.message || 'Internal error during Gemini speech synthesis.' });
  }
});

// Endpoint to view all stored bookings
app.get('/api/bookings', (_req, res) => {
  return res.json({ bookings: getAllBookings() });
});

// Endpoint to view all stored leads
app.get('/api/leads', (_req, res) => {
  return res.json({ leads: getAllLeads() });
});

// API route for text chat with tool calling support
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, generateAudio } = req.body;

    if (!message && (!Array.isArray(history) || history.length === 0)) {
      return res.status(400).json({ error: 'Message or conversation history is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing from environment.' });
    }

    const rawItems: Array<{ role: 'user' | 'model'; text: string }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item || !item.text || typeof item.text !== 'string') continue;
        // Skip tool status messages in textual conversation history
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

        // Check if Gemini invoked any website control function
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

          // Append model candidate turn with functionCall
          const candidateContent = response.candidates?.[0]?.content;
          if (candidateContent) {
            roundtripContents.push(candidateContent);
          } else {
            roundtripContents.push({
              role: 'model',
              parts: [{ functionCall: { name: toolName, args: call.args } }],
            });
          }

          // Append tool response turn
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

          // Call model again to generate spoken/written description of what is on screen
          const followUp = await ai.models.generateContent({
            model: modelName,
            contents: roundtripContents,
            config: {
              systemInstruction: SARA_SYSTEM_INSTRUCTION,
              tools: RECEPTIONIST_TOOLS,
            },
          });

          const followUpText = followUp.text ? followUp.text.trim() : '';

          // Determine appropriate introductory transition sentence if needed
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
        audioBase64 = await generateGeminiSpeech(replyText);
      } catch (audioErr: any) {
        console.warn('Speech synthesis for reply failed:', audioErr?.message || audioErr);
      }
    }

    return res.json({
      text: replyText,
      toolActions: executedToolActions,
      audioBase64,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error while calling Gemini API' });
  }
});

// Helper to connect to Gemini Live with native audio model and female voice Aoede / Kore
async function establishGeminiLiveSession(onMessage: (msg: any) => void, onClose: (e?: any) => void) {
  const models = ['gemini-3.8-live', 'gemini-2.5-flash-native-audio-preview'];
  const voices = ['Aoede', 'Kore'];

  let lastError: any = null;

  for (const model of models) {
    for (const voiceName of voices) {
      try {
        let isRejected = false;
        const session = await ai.live.connect({
          model,
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: SARA_SYSTEM_INSTRUCTION,
            tools: RECEPTIONIST_TOOLS,
          },
          callbacks: {
            onmessage: onMessage,
            onclose: (e) => {
              if (e?.code === 1008 || e?.reason?.includes('not found')) {
                isRejected = true;
              }
              onClose(e);
            },
            onerror: (err) => {
              console.warn(`Gemini Live session error (${model}, ${voiceName}):`, err?.message || err);
            },
          },
        });

        // Give a brief tick to detect immediate 1008 close frame
        await new Promise((r) => setTimeout(r, 150));
        if (isRejected) {
          continue;
        }

        return session;
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini Live connect attempt failed (${model}, ${voiceName}):`, err?.message || err);
      }
    }
  }

  throw lastError || new Error('Could not establish Gemini Live session');
}

// Mount Vite middleware in development or serve static build in production
async function startServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    if (pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (clientWs) => {
        wss.emit('connection', clientWs, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    let session: any = null;
    let isClosed = false;

    const safeSend = (payload: any) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
        safeSend({ type: 'error', error: 'GEMINI_API_KEY is not configured on server.' });
        clientWs.close();
        return;
      }

      session = await establishGeminiLiveSession(
        async (msg: any) => {
          if (isClosed) return;

          // 1. Check for Function Calling (Website control by Sara)
          if (msg.toolCall?.functionCalls && msg.toolCall.functionCalls.length > 0) {
            for (const call of msg.toolCall.functionCalls) {
              const liveToolName = call.name || '';
              const liveCallId = call.id || `call-${Date.now()}`;
              try {
                const toolExec = await executeWebsiteTool(liveToolName, call.args);
                // Notify the browser client to execute the action & display status line
                safeSend({
                  type: 'toolAction',
                  tool: liveToolName,
                  args: call.args,
                  statusText: toolExec.statusText,
                  clientAction: toolExec.clientAction,
                  isError: false,
                });

                // Return tool response back to Gemini Live
                session.sendToolResponse({
                  functionResponses: [
                    {
                      id: liveCallId,
                      name: liveToolName,
                      response: {
                        output: toolExec.data,
                        summary: toolExec.summaryForSara,
                      },
                    },
                  ],
                });
              } catch (toolErr: any) {
                const errMsg = toolErr?.message || 'Tool execution failed';
                safeSend({
                  type: 'toolError',
                  tool: liveToolName,
                  args: call.args,
                  statusText: `Error: ${errMsg}`,
                  error: errMsg,
                  isError: true,
                });

                session.sendToolResponse({
                  functionResponses: [
                    {
                      id: liveCallId,
                      name: liveToolName,
                      response: { error: errMsg },
                    },
                  ],
                });
              }
            }
          }

          const content = msg.serverContent;
          if (!content) return;

          // Model spoken audio chunks (24kHz PCM little-endian)
          if (content.modelTurn?.parts) {
            for (const part of content.modelTurn.parts) {
              if (part.inlineData?.data) {
                safeSend({ type: 'audio', audio: part.inlineData.data });
              }
            }
          }

          // Live transcript of Sara's speech
          if (content.outputTranscription?.text) {
            safeSend({ type: 'outputTranscript', text: content.outputTranscription.text });
          }

          // Live transcript of the caller's speech
          if (content.inputTranscription?.text) {
            safeSend({ type: 'inputTranscript', text: content.inputTranscription.text });
          }

          // Automatic VAD interruption: caller started speaking while Sara was talking
          if (content.interrupted) {
            safeSend({ type: 'interrupted' });
          }

          // Model finished current speech turn
          if (content.turnComplete) {
            safeSend({ type: 'turnComplete' });
          }
        },
        (closeEvent?: any) => {
          if (!isClosed) {
            safeSend({ type: 'closed', reason: closeEvent?.reason || 'Session closed' });
          }
        }
      );

      safeSend({ type: 'connected' });

      clientWs.on('message', async (data) => {
        if (isClosed || !session) return;
        try {
          const parsed = JSON.parse(data.toString());

          if (parsed.type === 'start') {
            // Trigger Sara's initial call greeting
            await session.sendRealtimeInput({
              text: 'Start the call with your warm phone greeting now.',
            });
          } else if (parsed.type === 'audio' && parsed.audio) {
            // Stream incoming 16kHz PCM audio chunk from caller microphone
            await session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (err: any) {
          console.warn('Error processing client message:', err?.message || err);
        }
      });

      clientWs.on('close', async () => {
        isClosed = true;
        if (session) {
          try {
            await session.close();
          } catch {}
          session = null;
        }
      });

      clientWs.on('error', (err) => {
        console.warn('Client WebSocket error:', err);
      });
    } catch (err: any) {
      console.error('Failed to initiate Gemini Live session:', err);
      safeSend({ type: 'error', error: err?.message || 'Failed to connect to Gemini Live session' });
      clientWs.close();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`GNS Real Estate full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
