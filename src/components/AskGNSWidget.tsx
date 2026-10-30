import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Bot,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GNS_CONFIG, VERIFIED_PROPERTIES } from '../data/gnsData';
import { GoogleGenAI, Modality } from '@google/genai';
import {
  SARA_SYSTEM_INSTRUCTION,
  RECEPTIONIST_TOOLS,
  executeClientLocalTool,
} from '../data/websiteControl';
import { StoredBooking, StoredLead, ToolExecutionOutput } from '../data/bookingTypes';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedSlug?: string;
  isVoiceTranscript?: boolean;
  isToolStatus?: boolean;
  isError?: boolean;
  toolName?: string;
  bookingConfirmation?: StoredBooking;
  leadConfirmation?: StoredLead;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init',
    sender: 'assistant',
    text: 'Hello, welcome to GNS Real Estate. I am Sara, your AI Receptionist. I can navigate the website, showcase verified Dubai properties, schedule your viewing appointments, and connect you with our private advisory desk. How may I assist you today?',
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUERIES = [
  'Book a viewing for Bayz 102',
  'Show me apartments in Business Bay',
  'Take me to our advisory team',
  'I would like someone to contact me',
  'Show me everything',
];

export { SARA_SYSTEM_INSTRUCTION as SYSTEM_INSTRUCTION };

/**
 * Calls Gemini AI backend endpoint with full conversation history and optional native TTS generation.
 */
export async function fetchGeminiChatReply(
  query: string,
  history: ChatMessage[],
  generateAudio = false
): Promise<{
  text: string;
  toolActions?: Array<{
    tool: string;
    args: any;
    statusText: string;
    clientAction?: any;
    isError?: boolean;
  }>;
  audioBase64?: string;
}> {
  const payload = {
    message: query,
    history: history.map((m) => ({
      sender: m.sender,
      text: m.text,
      isToolStatus: m.isToolStatus,
    })),
    generateAudio,
  };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errText = errorData?.error || `Gemini API request failed with status ${response.status}`;
    throw new Error(errText);
  }

  const data = await response.json();
  if (!data || typeof data.text !== 'string') {
    throw new Error('Received empty or invalid reply from Gemini API');
  }

  return {
    text: data.text.trim(),
    toolActions: data.toolActions,
    audioBase64: data.audioBase64,
  };
}

/**
 * Synthesize speech using Gemini native TTS with female prebuilt voice (Aoede / Kore)
 */
export async function fetchGeminiTTS(text: string): Promise<string> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `TTS request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data || typeof data.audioBase64 !== 'string') {
    throw new Error('Received invalid audio data from Gemini TTS');
  }

  return data.audioBase64;
}

export const AskGNSWidget: React.FC<{ onOpenViewingModal?: (title?: string, id?: string) => void }> = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  // Gemini Live Voice Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<
    'idle' | 'connecting' | 'listening' | 'speaking' | 'muted' | 'error'
  >('idle');
  const [callErrorMessage, setCallErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // References for Live Audio Streaming and WebSockets
  const isCallActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const liveSessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const currentCallerMsgIdRef = useRef<string | null>(null);
  const currentSaraMsgIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto End Call: Pending Goodbye Audio Finish
  const pendingEndCallRef = useRef<boolean>(false);

  // Silence Timer (60s after asking "Are you still there?")
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceStageRef = useRef<'none' | 'asked'>('none');

  // Keep messagesRef in sync with current messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  /**
   * Stop all currently scheduled and playing audio buffer sources immediately
   */
  const stopAllPlayback = useCallback(() => {
    activeSourceNodesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {}
    });
    activeSourceNodesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
  }, []);

  /**
   * End voice call cleanly and reset all audio/WebSocket handles
   */
  const endVoiceCall = useCallback((reasonText = 'Call ended') => {
    setIsCallActive(false);
    isCallActiveRef.current = false;
    setCallStatus('idle');
    pendingEndCallRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    silenceStageRef.current = 'none';

    stopAllPlayback();
    currentCallerMsgIdRef.current = null;
    currentSaraMsgIdRef.current = null;

    if (liveSessionRef.current) {
      try {
        liveSessionRef.current.close();
      } catch {}
      liveSessionRef.current = null;
    }

    if (audioProcessorRef.current) {
      try {
        audioProcessorRef.current.disconnect();
      } catch {}
      audioProcessorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }

    // Append 'Call ended' status in chat stream if not already present
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].text === reasonText) return prev;
      const endStatusMsg: ChatMessage = {
        id: `call-ended-${Date.now()}`,
        sender: 'assistant',
        text: reasonText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isToolStatus: true,
        isError: false,
      };
      return [...prev, endStatusMsg];
    });
  }, [stopAllPlayback]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      endVoiceCall();
    };
  }, [endVoiceCall]);

  /**
   * Execute website control and interaction actions requested by Sara
   */
  const executeClientAction = useCallback(
    (action: any) => {
      if (!action || typeof action !== 'object') return;

      const performHighlight = (elId?: string) => {
        setTimeout(() => {
          let targetEl: HTMLElement | null = null;
          if (elId) {
            targetEl = document.getElementById(elId);
          }
          if (!targetEl) {
            targetEl =
              document.getElementById('properties-grid') ||
              document.getElementById('properties-page-container') ||
              document.getElementById('about-page-container') ||
              document.getElementById('team-page-container') ||
              document.getElementById('contact-page-container') ||
              document.getElementById('property-detail-container') ||
              document.querySelector('main');
          }
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.classList.remove('sara-active-highlight');
            void targetEl.offsetWidth; // trigger reflow
            targetEl.classList.add('sara-active-highlight');
            setTimeout(() => {
              targetEl?.classList.remove('sara-active-highlight');
            }, 2800);
          }
        }, 180);
      };

      if (action.type === 'navigate_to_section') {
        const targetPath = action.path || '/';
        if (window.location.pathname !== targetPath) {
          navigate(targetPath);
          setTimeout(() => performHighlight(action.elementId), 250);
        } else {
          performHighlight(action.elementId);
        }
      } else if (action.type === 'show_properties') {
        const params = new URLSearchParams();
        if (action.params) {
          if (action.params.location) params.set('q', action.params.location);
          if (action.params.bedrooms) params.set('bedrooms', String(action.params.bedrooms));
          if (action.params.max_budget) params.set('maxBudget', String(action.params.max_budget));
          if (action.params.type && action.params.type !== 'All') {
            params.set('category', action.params.type);
          }
        }
        const targetUrl = `/properties${params.toString() ? `?${params.toString()}` : ''}`;
        navigate(targetUrl);
        setTimeout(() => performHighlight('properties-grid'), 250);
      } else if (action.type === 'get_property_details') {
        const slug = action.propertySlug || action.propertyId;
        if (slug) {
          navigate(`/properties/${slug}`);
          setTimeout(() => performHighlight('property-detail-container'), 250);
        }
      } else if (action.type === 'end_call') {
        // Requirement 3: Wait until Sara's goodbye audio finishes playing before closing
        if (isCallActiveRef.current) {
          if (activeSourceNodesRef.current.length > 0) {
            pendingEndCallRef.current = true;
          } else {
            setTimeout(() => {
              endVoiceCall('Call ended');
            }, 1200);
          }
        }
      }
    },
    [navigate, endVoiceCall]
  );

  /**
   * Play incoming 24kHz PCM audio chunk smoothly as a gapless continuous stream
   */
  const playAudioChunk = useCallback((base64Data: string) => {
    if (!outputAudioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtxClass({ sampleRate: 24000 });
    }

    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
      }

      if (float32.length === 0) return;

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now + 0.04;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      activeSourceNodesRef.current.push(source);
      setCallStatus('speaking');

      source.onended = () => {
        const list = activeSourceNodesRef.current;
        const idx = list.indexOf(source);
        if (idx !== -1) list.splice(idx, 1);
        if (
          list.length === 0 &&
          outputAudioCtxRef.current &&
          outputAudioCtxRef.current.currentTime >= nextStartTimeRef.current - 0.06
        ) {
          // If Sara called end_call(), wait until her goodbye audio finishes playing completely
          if (pendingEndCallRef.current) {
            pendingEndCallRef.current = false;
            endVoiceCall('Call ended');
            return;
          }

          if (isCallActiveRef.current && !isMutedRef.current) {
            setCallStatus('listening');
          }
        }
      };
    } catch (err) {
      console.warn('Error queuing audio buffer chunk:', err);
    }
  }, [endVoiceCall]);

  /**
   * Resamples / converts Float32Array input to 16-bit 16kHz PCM little endian
   */
  const processInputAudioTo16k = (inputBuffer: Float32Array, inputSampleRate: number): string => {
    let int16Array: Int16Array;

    if (inputSampleRate === 16000) {
      int16Array = new Int16Array(inputBuffer.length);
      for (let i = 0; i < inputBuffer.length; i++) {
        const s = Math.max(-1, Math.min(1, inputBuffer[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
    } else {
      const ratio = inputSampleRate / 16000;
      const newLength = Math.round(inputBuffer.length / ratio);
      int16Array = new Int16Array(newLength);
      let offsetResult = 0;
      let offsetBuffer = 0;

      while (offsetResult < int16Array.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
        let accum = 0;
        let count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputBuffer.length; i++) {
          accum += inputBuffer[i];
          count++;
        }
        const sample = count > 0 ? accum / count : 0;
        const s = Math.max(-1, Math.min(1, sample));
        int16Array[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7fff;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
      }
    }

    let binary = '';
    const bytes = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  /**
   * Reset the silence detection timer
   */
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    silenceStageRef.current = 'none';
  }, []);

  // Silence Timer logic: If caller is silent for 30s, Sara asks "Are you still there?".
  // If silent for 60s after that, ends the call cleanly.
  useEffect(() => {
    if (isCallActive && callStatus === 'listening') {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      silenceTimerRef.current = setTimeout(() => {
        if (!isCallActiveRef.current) return;

        if (silenceStageRef.current === 'none') {
          silenceStageRef.current = 'asked';

          // Trigger Sara to ask "Are you still there?"
          if (liveSessionRef.current) {
            try {
              liveSessionRef.current.sendRealtimeInput({
                text: 'The caller has been silent. Politely ask "Are you still there?".',
              });
            } catch {}
          }

          // Start 60-second timer after asking
          silenceTimerRef.current = setTimeout(() => {
            if (!isCallActiveRef.current) return;
            endVoiceCall('Call ended (inactivity timeout)');
          }, 60000);
        }
      }, 30000);
    } else {
      resetSilenceTimer();
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [isCallActive, callStatus, resetSilenceTimer, endVoiceCall]);

  /**
   * Start a Live two-way phone call with Sara using Gemini Live API with tool control
   */
  const startVoiceCall = async () => {
    endVoiceCall();
    setCallErrorMessage('');
    setCallStatus('connecting');
    setIsCallActive(true);
    isCallActiveRef.current = true;
    currentCallerMsgIdRef.current = null;
    currentSaraMsgIdRef.current = null;
    pendingEndCallRef.current = false;
    resetSilenceTimer();

    if (!navigator?.mediaDevices?.getUserMedia) {
      const msg = 'Microphone access is not supported by your browser or environment.';
      console.warn(msg);
      setCallErrorMessage(msg);
      setCallStatus('error');
      setIsCallActive(false);
      isCallActiveRef.current = false;
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;
    } catch (mediaErr: any) {
      console.warn('Microphone permission request ended:', mediaErr?.name, mediaErr?.message);
      const isDenied =
        mediaErr?.name === 'NotAllowedError' ||
        mediaErr?.name === 'PermissionDeniedError' ||
        String(mediaErr?.message || '').toLowerCase().includes('permission') ||
        String(mediaErr?.message || '').toLowerCase().includes('denied');

      const friendlyMsg = isDenied
        ? 'Microphone permission was denied. Please allow microphone access in your browser address bar to speak with Sara, or use the text chat below.'
        : 'Could not access your microphone. Please verify device permissions or chat with Sara below.';

      setCallErrorMessage(friendlyMsg);
      setCallStatus('error');
      setIsCallActive(false);
      isCallActiveRef.current = false;

      const assistantNotice: ChatMessage = {
        id: `perm-${Date.now()}`,
        sender: 'assistant',
        text: friendlyMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantNotice]);
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass();
      inputAudioCtxRef.current = inputCtx;

      const outputCtx = new AudioCtxClass({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 1. Fetch ephemeral token from Vercel serverless function /api/token
      const tokenRes = await fetch('/api/token');
      if (!tokenRes.ok) {
        const errJson = await tokenRes.json().catch(() => null);
        throw new Error(errJson?.error || `Token generation failed with status ${tokenRes.status}`);
      }
      const tokenData = await tokenRes.json();
      if (!tokenData?.token) {
        throw new Error('No ephemeral token returned from /api/token');
      }

      // 2. Connect directly to Gemini Live using @google/genai from the browser
      const clientAi = new GoogleGenAI({
        apiKey: tokenData.token,
        httpOptions: { apiVersion: 'v1alpha' },
      });

      const session = await clientAi.live.connect({
        model: tokenData.model || 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: tokenData.voiceName || 'Aoede' } },
          },
          systemInstruction: SARA_SYSTEM_INSTRUCTION,
          tools: RECEPTIONIST_TOOLS,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setCallStatus('listening');
            session.sendRealtimeInput({
              text: 'Start the call with your warm phone greeting now.',
            });
          },
          onmessage: async (msg: any) => {
            try {
              // 1. Handle Function Calls (tools)
              if (msg.toolCall?.functionCalls && msg.toolCall.functionCalls.length > 0) {
                for (const call of msg.toolCall.functionCalls) {
                  const liveToolName = call.name || '';
                  const liveCallId = call.id || `call-${Date.now()}`;
                  try {
                    let toolExec: ToolExecutionOutput;
                    if (liveToolName === 'book_appointment' || liveToolName === 'save_lead_details') {
                      const res = await fetch('/api/execute-tool', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: liveToolName, args: call.args }),
                      });
                      if (!res.ok) {
                        const errData = await res.json().catch(() => null);
                        throw new Error(errData?.error || 'Tool execution failed');
                      }
                      toolExec = await res.json();
                    } else {
                      toolExec = executeClientLocalTool(liveToolName, call.args);
                    }

                    const statusMsg: ChatMessage = {
                      id: `tool-${Date.now()}-${Math.random()}`,
                      sender: 'assistant',
                      text: toolExec.statusText || 'Executing action',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isToolStatus: true,
                      isError: false,
                      toolName: liveToolName,
                    };

                    const extraMessages: ChatMessage[] = [statusMsg];
                    if (toolExec.clientAction?.booking) {
                      extraMessages.push({
                        id: `bk-card-${Date.now()}`,
                        sender: 'assistant',
                        text: `Viewing Appointment confirmed for ${toolExec.clientAction.booking.name} (${toolExec.clientAction.booking.bookingId}).`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        bookingConfirmation: toolExec.clientAction.booking,
                      });
                    }
                    if (toolExec.clientAction?.lead) {
                      extraMessages.push({
                        id: `ld-card-${Date.now()}`,
                        sender: 'assistant',
                        text: `Lead registration recorded for ${toolExec.clientAction.lead.name} (${toolExec.clientAction.lead.leadId}).`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        leadConfirmation: toolExec.clientAction.lead,
                      });
                    }

                    setMessages((prev) => [...prev, ...extraMessages]);

                    if (toolExec.clientAction) {
                      executeClientAction(toolExec.clientAction);
                    }

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
                    const errorMsg: ChatMessage = {
                      id: `tool-err-${Date.now()}-${Math.random()}`,
                      sender: 'assistant',
                      text: `Error: ${errMsg}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isToolStatus: true,
                      isError: true,
                      toolName: liveToolName,
                    };
                    setMessages((prev) => [...prev, errorMsg]);

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

              // 2. Handle audio playback (24kHz PCM)
              if (content.modelTurn?.parts) {
                for (const part of content.modelTurn.parts) {
                  if (part.inlineData?.data) {
                    playAudioChunk(part.inlineData.data);
                  }
                }
              }

              // 3. Sara live transcript
              if (content.outputTranscription?.text) {
                const chunk = content.outputTranscription.text;
                if (!currentSaraMsgIdRef.current) {
                  const newId = `sara-${Date.now()}`;
                  currentSaraMsgIdRef.current = newId;
                  const newMsg: ChatMessage = {
                    id: newId,
                    sender: 'assistant',
                    text: chunk,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  setMessages((prev) => [...prev, newMsg]);
                } else {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === currentSaraMsgIdRef.current ? { ...m, text: m.text + chunk } : m
                    )
                  );
                }
              }

              // 4. Caller live transcript
              if (content.inputTranscription?.text) {
                resetSilenceTimer();
                currentSaraMsgIdRef.current = null;
                const callerText = content.inputTranscription.text.trim();
                if (callerText) {
                  if (!currentCallerMsgIdRef.current) {
                    const newId = `caller-${Date.now()}`;
                    currentCallerMsgIdRef.current = newId;
                    const newMsg: ChatMessage = {
                      id: newId,
                      sender: 'user',
                      text: callerText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isVoiceTranscript: true,
                    };
                    setMessages((prev) => [...prev, newMsg]);
                  } else {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === currentCallerMsgIdRef.current
                          ? { ...m, text: m.text + ' ' + callerText }
                          : m
                      )
                    );
                  }
                }
              }

              // 5. Caller interruption (stop playing previous response immediately)
              if (content.interrupted) {
                stopAllPlayback();
                setCallStatus('listening');
                currentSaraMsgIdRef.current = null;
              }

              // 6. Turn complete
              if (content.turnComplete) {
                currentCallerMsgIdRef.current = null;
                currentSaraMsgIdRef.current = null;
              }
            } catch (err) {
              console.warn('Error handling Gemini Live message:', err);
            }
          },
          onclose: (e) => {
            if (isCallActiveRef.current) {
              endVoiceCall('Call ended');
            }
          },
          onerror: (err) => {
            console.warn('Gemini Live session error:', err);
            const errStr = err?.message || 'Gemini Live encountered an error.';
            setCallErrorMessage(errStr);
            setCallStatus('error');
            const errChatMessage: ChatMessage = {
              id: `err-${Date.now()}`,
              sender: 'assistant',
              text: `Call Error: ${errStr}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, errChatMessage]);
          },
        },
      });

      liveSessionRef.current = session;

      const micSource = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      audioProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!isCallActiveRef.current || isMutedRef.current) return;
        if (!liveSessionRef.current) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBase64 = processInputAudioTo16k(inputData, inputCtx.sampleRate);

        try {
          liveSessionRef.current.sendRealtimeInput({
            audio: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' },
          });
        } catch {}
      };

      micSource.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      console.warn('Audio system initialization issue:', err?.message || err);
      const msg = err?.message || 'Could not initiate audio call.';
      setCallErrorMessage(msg);
      setCallStatus('error');
      setIsCallActive(false);
      isCallActiveRef.current = false;
    }
  };

  /**
   * Toggle Mute on/off during an active call.
   */
  const toggleMute = () => {
    if (!isCallActiveRef.current) return;

    if (isMutedRef.current) {
      setIsMuted(false);
      isMutedRef.current = false;
      setCallStatus('listening');
    } else {
      setIsMuted(true);
      isMutedRef.current = true;
      setCallStatus('muted');
      stopAllPlayback();
    }
  };

  /**
   * Handler for text chat input with tool support
   */
  const handleUserMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputMessage).trim();
      if (!text) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [...messagesRef.current, userMsg];
      messagesRef.current = updatedHistory;
      setMessages(updatedHistory);
      setInputMessage('');
      setIsTyping(true);

      try {
        const { text: answerText, toolActions } = await fetchGeminiChatReply(
          text,
          updatedHistory,
          false
        );

        const currentItems = [...updatedHistory];
        let bookingDataForCard: StoredBooking | undefined;
        let leadDataForCard: StoredLead | undefined;

        // Process tool execution results from Gemini
        if (Array.isArray(toolActions) && toolActions.length > 0) {
          for (const act of toolActions) {
            const statusMsg: ChatMessage = {
              id: `tool-${Date.now()}-${Math.random()}`,
              sender: 'assistant',
              text: act.statusText,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              isToolStatus: true,
              isError: act.isError,
              toolName: act.tool,
            };
            currentItems.push(statusMsg);

            if (act.clientAction?.booking) {
              bookingDataForCard = act.clientAction.booking;
            }
            if (act.clientAction?.lead) {
              leadDataForCard = act.clientAction.lead;
            }

            if (act.clientAction) {
              executeClientAction(act.clientAction);
            }
          }
        }

        const matchedProp = VERIFIED_PROPERTIES.find((p) => {
          const title = p.title.toLowerCase();
          const combined = (text + ' ' + answerText).toLowerCase();
          return combined.includes(title) || (p.slug && combined.includes(p.slug.replace(/-/g, ' ')));
        });

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedSlug: matchedProp?.slug,
          bookingConfirmation: bookingDataForCard,
          leadConfirmation: leadDataForCard,
        };

        const finalHistory = [...currentItems, assistantMsg];
        messagesRef.current = finalHistory;
        setMessages(finalHistory);
      } catch (err: any) {
        const actualError = err?.message || 'Failed to communicate with Gemini API';
        const errorMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: `Error: ${actualError}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const finalHistory = [...updatedHistory, errorMsg];
        messagesRef.current = finalHistory;
        setMessages(finalHistory);
      } finally {
        setIsTyping(false);
      }
    },
    [inputMessage, executeClientAction]
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Compact gold-accented launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Open GNS AI Receptionist"
          className="group flex items-center gap-2.5 bg-[#202020] hover:bg-[#D6A536] text-white hover:text-[#202020] px-4 py-3 rounded-full shadow-xl border border-[#E8E5DE] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
        >
          <div className="w-6 h-6 rounded-full bg-[#D6A536] text-[#202020] group-hover:bg-[#202020] group-hover:text-[#D6A536] flex items-center justify-center transition-colors">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-[#D6A536] group-hover:text-[#202020]">
              AI Receptionist
            </span>
            <span className="block text-xs font-semibold leading-tight">Ask GNS (Sara)</span>
          </div>
        </button>
      )}

      {/* Assistant Modal Panel (101 Style: Inter, gold accents, clean borders) */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="assistant-panel-title"
          className="w-[340px] sm:w-[410px] h-[550px] bg-white border border-[#E8E5DE] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
        >
          {/* Header */}
          <div className="bg-[#202020] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#D6A536] rounded-md flex items-center justify-center text-[#202020]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 id="assistant-panel-title" className="font-serif text-sm font-semibold leading-none">
                  Sara   AI Receptionist
                </h3>
                <span className="text-[10px] tracking-wider text-[#D6A536] uppercase font-semibold">
                  Appointments & Advisory
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Call Start/End Toggle */}
              {!isCallActive ? (
                <button
                  type="button"
                  onClick={startVoiceCall}
                  className="flex items-center gap-1 bg-[#D6A536] hover:bg-[#B98722] text-[#202020] text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors shadow-2xs"
                  title="Start Voice Call"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => endVoiceCall('Call ended')}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors"
                  title="End Voice Call"
                >
                  <PhoneOff className="w-3 h-3" />
                  <span>End</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  endVoiceCall('Call ended');
                  setIsOpen(false);
                }}
                aria-label="Close Assistant"
                className="p-1.5 text-white/70 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Call Active Status Banner */}
          {isCallActive && (
            <div className="bg-[#F5F4F0] border-b border-[#E8E5DE] px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    callStatus === 'listening'
                      ? 'bg-emerald-500 animate-ping'
                      : callStatus === 'speaking'
                      ? 'bg-[#D6A536] animate-pulse'
                      : callStatus === 'muted'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-semibold text-[#202020]">
                  {callStatus === 'listening'
                    ? 'Listening...'
                    : callStatus === 'speaking'
                    ? 'Sara is speaking'
                    : callStatus === 'muted'
                    ? 'Microphone muted'
                    : callStatus === 'connecting'
                    ? 'Connecting live audio...'
                    : 'Call Standby'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-1 rounded-sm border ${
                    isMuted
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-[#E8E5DE] text-[#202020]'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {callErrorMessage && (
            <div className="bg-amber-50 text-amber-900 px-3.5 py-2.5 text-[11px] border-b border-amber-200 flex items-start justify-between gap-2">
              <div className="leading-relaxed">
                <span className="font-semibold block mb-0.5">Microphone Notice</span>
                {callErrorMessage}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setCallErrorMessage('');
                    startVoiceCall();
                  }}
                  className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm transition-colors"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => setCallErrorMessage('')}
                  aria-label="Dismiss error"
                  className="text-amber-800 hover:text-amber-950 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F5F4F0]">
            {messages.map((msg) => {
              // Tool status line render (Requirement 5 & 7)
              if (msg.isToolStatus) {
                return (
                  <div key={msg.id} className="w-full flex justify-center my-1.5 animate-in fade-in duration-150">
                    <div
                      className={`px-3 py-1 rounded-sm text-[11px] font-mono flex items-center gap-1.5 border max-w-[92%] ${
                        msg.isError
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-white text-[#202020] border-[#D6A536] shadow-2xs'
                      }`}
                    >
                      {msg.isError ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-[#D6A536] shrink-0" />
                      )}
                      <span className="font-semibold truncate">{msg.text}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#202020] text-white shadow-2xs'
                        : 'bg-white text-[#202020] border border-[#E8E5DE] shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* APPOINTMENT CONFIRMATION CARD (Requirement 1) */}
                    {msg.bookingConfirmation && (
                      <div className="mt-3 p-3.5 bg-[#F5F4F0] border border-[#D6A536] rounded-md text-xs text-[#202020] space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[#E8E5DE] pb-2">
                          <div className="flex items-center gap-1.5 font-semibold text-[#202020]">
                            <Calendar className="w-4 h-4 text-[#D6A536]" />
                            <span className="font-serif">Viewing Appointment Confirmed</span>
                          </div>
                          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-sm border border-[#E8E5DE] font-bold text-[#D6A536]">
                            {msg.bookingConfirmation.bookingId}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                            <span className="font-semibold">{msg.bookingConfirmation.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                            <span>
                              {msg.bookingConfirmation.date} at {msg.bookingConfirmation.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#D6A536] shrink-0" />
                            <span className="font-medium text-[#202020]">
                              {msg.bookingConfirmation.property}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#666666]">
                            <Phone className="w-3 h-3 text-[#666666] shrink-0" />
                            <span>{msg.bookingConfirmation.phone}</span>
                            <span>•</span>
                            <span>{msg.bookingConfirmation.email}</span>
                          </div>
                        </div>

                        {/* Status notification info */}
                        <div className="pt-2 border-t border-[#E8E5DE] text-[10px] text-[#666666] leading-tight flex items-start gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{msg.bookingConfirmation.emailStatus}</span>
                        </div>

                        {/* Direct WhatsApp Advisor Link */}
                        {msg.bookingConfirmation.whatsAppUrl && (
                          <div className="pt-1">
                            <a
                              href={msg.bookingConfirmation.whatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-sm text-[10px] uppercase tracking-wider transition-colors shadow-2xs"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Dispatch Details to Advisor on WhatsApp</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* LEAD REGISTRATION CARD (Requirement 2) */}
                    {msg.leadConfirmation && (
                      <div className="mt-3 p-3 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md text-xs text-[#202020] space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[#E8E5DE] pb-1.5">
                          <span className="font-semibold text-[#202020] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lead Registration Saved</span>
                          </span>
                          <span className="font-mono text-[10px] text-[#666666]">
                            {msg.leadConfirmation.leadId}
                          </span>
                        </div>
                        <div className="text-[11px] space-y-0.5">
                          <div>
                            <strong>Client:</strong> {msg.leadConfirmation.name}
                          </div>
                          <div>
                            <strong>Contact:</strong> {msg.leadConfirmation.whatsapp} ({msg.leadConfirmation.email})
                          </div>
                          <div>
                            <strong>Interest:</strong> {msg.leadConfirmation.interest}
                          </div>
                        </div>
                        <div className="pt-1 text-[10px] text-[#666666] italic">
                          Saved in GNS Advisory Registry for advisor review.
                        </div>
                      </div>
                    )}

                    {msg.suggestedSlug && (
                      <div className="mt-2.5 pt-2 border-t border-[#E8E5DE]">
                        <Link
                          to={`/properties/${msg.suggestedSlug}`}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D6A536] hover:text-[#B98722]"
                        >
                          <span>View Property Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#666666] mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#666666] p-2 bg-white border border-[#E8E5DE] rounded-md w-fit">
                <Sparkles className="w-3 h-3 text-[#D6A536] animate-spin" />
                <span>Checking website and inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-[#E8E5DE] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUserMessage(q)}
                className="px-2.5 py-1 text-[10.5px] bg-[#F5F4F0] hover:bg-[#E8E5DE] text-[#202020] border border-[#E8E5DE] rounded-sm shrink-0 transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserMessage();
            }}
            className="p-3 bg-white border-t border-[#E8E5DE] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Sara: book a viewing, share details, or in Urdu..."
              className="flex-1 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2 text-xs text-[#202020] placeholder:text-[#666666] focus:outline-none focus:border-[#D6A536]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              aria-label="Send message"
              className="bg-[#D6A536] hover:bg-[#B98722] disabled:opacity-40 text-[#202020] p-2 rounded-md transition-colors font-semibold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Action */}
          <div className="bg-[#202020] py-2 px-3 text-[10.5px] text-white flex items-center justify-between">
            <span className="text-[#E8E5DE]">Direct Human Desk:</span>
            <a
              href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D6A536] font-semibold hover:underline"
            >
              WhatsApp Advisor
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
