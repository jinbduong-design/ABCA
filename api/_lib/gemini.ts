import { GoogleGenAI } from '@google/genai';
import { generateText } from 'ai';

export const DIRECT_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

export const GATEWAY_MODELS = [
  'google/gemini-3.8-flash',
  'google/gemini-3.5-flash-lite',
  'google/gemini-3.1-flash-lite',
];

export interface GenerateOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}

function getGeminiClient(): GoogleGenAI | null {
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

function promptFromContents(contents: any): string {
  if (typeof contents === 'string') return contents;
  try {
    return JSON.stringify(contents);
  } catch {
    return String(contents ?? '');
  }
}

export async function generateWithModelFallback(
  options: GenerateOptions
): Promise<string> {
  let lastError: any = null;
  const direct = getGeminiClient();

  if (direct) {
    for (const model of DIRECT_GEMINI_MODELS) {
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

        const response = await direct.models.generateContent({
          model,
          contents: options.contents,
          config,
        });

        if (response.text) return response.text;
      } catch (error: any) {
        lastError = error;
        console.warn(
          '[Direct Gemini] model unavailable:',
          model,
          String(error?.message || '').slice(0, 180)
        );
      }
    }
  }

  for (const model of GATEWAY_MODELS) {
    try {
      const result = await generateText({
        model,
        system: options.systemInstruction,
        prompt: promptFromContents(options.contents),
        temperature: options.temperature,
        maxOutputTokens: 1600,
      });

      if (result.text) return result.text;
    } catch (error: any) {
      lastError = error;
      console.warn(
        '[Vercel AI Gateway] model unavailable:',
        model,
        String(error?.message || '').slice(0, 180)
      );
    }
  }

  throw lastError || new Error('All AI providers are unavailable.');
}

export function parseJsonText<T = any>(text: string): T {
  const trimmed = String(text || '').trim();
  const withoutFence = trimmed
    .replace(/^\`\`\`(?:json)?\s*/i, '')
    .replace(/\s*\`\`\`$/i, '');

  return JSON.parse(withoutFence);
}

export function sendAIUnavailable(res: any, error: any) {
  const raw = String(error?.message || '');
  console.error('[AI backend]', raw);

  const lower = raw.toLowerCase();
  const isQuota = raw.includes('429') || lower.includes('quota');
  const isGatewayAuth =
    lower.includes('oidc') ||
    lower.includes('unauthorized') ||
    lower.includes('authentication');

  if (isQuota) {
    return res.status(429).json({
      error: 'AI_QUOTA',
      message: 'AI đang bị giới hạn quota tạm thời. Hãy thử lại sau ít phút.',
    });
  }

  if (isGatewayAuth) {
    return res.status(503).json({
      error: 'AI_GATEWAY_AUTH',
      message:
        'Vercel AI Gateway chưa xác thực được deployment này. Cần bật OIDC/Gateway cho project rồi redeploy.',
    });
  }

  return res.status(503).json({
    error: 'AI_UNAVAILABLE',
    message: 'AI backend chưa phản hồi được. Hãy thử lại sau.',
  });
}
