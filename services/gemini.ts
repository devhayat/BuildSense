
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { BOQItem, DesignError, SimulationResult, ChatMessage } from "../types";

/* Initialize GoogleGenAI with process.env.API_KEY directly as per guidelines */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Decodes base64 string to Uint8Array.
 * Manual implementation required by Gemini SDK guidelines.
 */
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const geminiService = {
  /**
   * Generates a BOQ and detects errors from a drawing image
   * Enhanced to focus on Machine Understanding of structural elements.
   */
  async analyzeDrawing(imageData: string, projectContext: string): Promise<{ boq: BOQItem[], errors: DesignError[] }> {
    const prompt = `Act as a Senior Structural Engineer and AI Vision Specialist. 
    Analyze this structural CAD drawing for a ${projectContext}.
    
    1. MACHINE UNDERSTANDING PHASE:
       - Detect drawing units (mm/m/ft) and scale (e.g., 1:100).
       - Identify vector layers (Structural, Architectural, BBS).
       - Detect specific elements: Walls, Slabs, Beams, Columns, Footings.
       - Separate floor-wise layouts if multiple are present.
    
    2. AUTOMATIC BOQ & QUANTITY TAKEOFF:
       - Calculate exact quantities for: 
         * Excavation volume (m3)
         * Concrete volume for Footings, Columns, Beams, and Slabs (m3)
         * Steel estimation based on structural density (MT)
         * Brickwork/Masonry (m2/m3)
         * Plaster area and Flooring area (m2)
    
    3. DESIGN ERROR DETECTION:
       - Check for structural inconsistencies (e.g., beam span issues, missing column supports).
    
    Return the data in the following JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            boq: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  rate: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ['id', 'category', 'description', 'quantity', 'unit', 'rate', 'total', 'confidence', 'reasoning']
              }
            },
            errors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'Critical, Warning, or Info' },
                  location: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ['id', 'severity', 'location', 'issue', 'recommendation']
              }
            }
          },
          required: ['boq', 'errors']
        }
      }
    });

    try {
      const text = response.text;
      return JSON.parse(text || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      return { boq: [], errors: [] };
    }
  },

  async simulateWhatIf(query: string, currentBOQ: BOQItem[]): Promise<SimulationResult> {
    const prompt = `Current BOQ: ${JSON.stringify(currentBOQ)}. User Question: "${query}". Recalculate cost/quantity impacts.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deltaCost: { type: Type.NUMBER },
            deltaQuantities: { type: Type.OBJECT },
            impactSummary: { type: Type.STRING }
          },
          required: ['deltaCost', 'impactSummary']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async getMentorResponse(history: ChatMessage[], persona: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n'),
      config: { systemInstruction: `You are a ${persona}. Provide technical civil engineering advice.` }
    });
    return response.text || "I'm sorry, I couldn't process that.";
  },

  async generateSpeech(text: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  }
};
