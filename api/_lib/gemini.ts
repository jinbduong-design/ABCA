import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

export interface GenerateOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'deutschstart-vercel',
      },
    },
  });
}

export async function generateWithModelFallback(
  ai: GoogleGenAI,
  options: GenerateOptions
): Promise<string> {
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const config: any = {};

      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }
      if (options.temperature !== undefined) {
        config.temperature = options.temperature;
      }

      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config,
      });

      if (response.text) return response.text;
    } catch (error: any) {
      lastError = error;
      console.warn(
        '[Gemini API] model unavailable:',
        model,
        String(error?.message || '').slice(0, 160)
      );
    }
  }

  throw lastError || new Error('No Gemini model returned a response.');
}

export function requireGemini(res: any): GoogleGenAI | null {
  const ai = getGeminiClient();

  if (!ai) {
    res.status(503).json({
      error: 'AI_KEY_MISSING',
      message:
        'AI chưa được cấu hình trên Vercel. Cần thêm GEMINI_API_KEY vào Environment Variables rồi redeploy.',
    });
    return null;
  }

  return ai;
}

export function sendAIUnavailable(res: any, error: any) {
  const raw = String(error?.message || '');
  console.error('[Gemini API]', raw);

  const status =
    raw.includes('429') || raw.toLowerCase().includes('quota') ? 429 : 503;

  return res.status(status).json({
    error: status === 429 ? 'AI_QUOTA' : 'AI_UNAVAILABLE',
    message:
      status === 429
        ? 'Gemini API đang hết quota hoặc bị giới hạn tạm thời.'
        : 'Gemini API chưa phản hồi được. Hãy thử lại sau.',
  });
}
