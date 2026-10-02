import { GoogleGenAI } from '@google/genai';
import { getVercelOidcToken } from '@vercel/oidc';

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

function getDirectGeminiClient(): GoogleGenAI | null {
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

async function getGatewayCredential(): Promise<string | null> {
  if (process.env.AI_GATEWAY_API_KEY) {
    return process.env.AI_GATEWAY_API_KEY;
  }

  try {
    const token = await getVercelOidcToken();
    return token || process.env.VERCEL_OIDC_TOKEN || null;
  } catch {
    return process.env.VERCEL_OIDC_TOKEN || null;
  }
}

async function generateViaGateway(
  model: string,
  options: GenerateOptions,
  credential: string
): Promise<string> {
  const messages: any[] = [];

  if (options.systemInstruction) {
    messages.push({
      role: 'system',
      content: options.systemInstruction,
    });
  }

  messages.push({
    role: 'user',
    content: promptFromContents(options.contents),
  });

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credential}`,
      'Content-Type': 'application/json',
      'x-vercel-ai-gateway-source': 'deutschstart',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.55,
      max_tokens: 1600,
      response_format:
        options.responseMimeType === 'application/json'
          ? { type: 'json_object' }
          : undefined,
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `AI Gateway ${response.status}: ${raw.slice(0, 500)}`
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error('AI Gateway returned invalid JSON.');
  }

  const text = payload?.choices?.[0]?.message?.content;

  if (!text || typeof text !== 'string') {
    throw new Error('AI Gateway returned no text.');
  }

  return text;
}

export async function generateWithModelFallback(
  options: GenerateOptions
): Promise<string> {
  let lastError: any = null;
  const direct = getDirectGeminiClient();

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
          String(error?.message || '').slice(0, 220)
        );
      }
    }
  }

  const gatewayCredential = await getGatewayCredential();

  if (!gatewayCredential) {
    throw new Error(
      'NO_AI_CREDENTIAL: AI Gateway chưa có API key và project chưa cấp OIDC token.'
    );
  }

  for (const model of GATEWAY_MODELS) {
    try {
      return await generateViaGateway(model, options, gatewayCredential);
    } catch (error: any) {
      lastError = error;
      console.warn(
        '[Vercel AI Gateway] model unavailable:',
        model,
        String(error?.message || '').slice(0, 220)
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
  const isQuota =
    raw.includes('429') ||
    lower.includes('quota') ||
    lower.includes('budget');

  if (isQuota) {
    return res.status(429).json({
      error: 'AI_QUOTA',
      message:
        'AI Gateway/Gemini đang bị giới hạn quota hoặc ngân sách. Kiểm tra AI Gateway budget rồi thử lại.',
      detail: raw.slice(0, 300),
    });
  }

  if (
    raw.includes('NO_AI_CREDENTIAL') ||
    lower.includes('oidc') ||
    lower.includes('unauthorized') ||
    raw.includes('401') ||
    raw.includes('403')
  ) {
    return res.status(503).json({
      error: 'AI_AUTH',
      message:
        'AI chưa xác thực được với Vercel. Project cần bật Secure Backend Access with OIDC hoặc thêm AI_GATEWAY_API_KEY.',
      detail: raw.slice(0, 300),
    });
  }

  return res.status(503).json({
    error: 'AI_UNAVAILABLE',
    message:
      'AI backend đang lỗi ở runtime. Mở phần chi tiết lỗi để kiểm tra nguyên nhân.',
    detail: raw.slice(0, 300),
  });
}
