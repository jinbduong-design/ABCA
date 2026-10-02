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

function promptFromContents(contents: any): string {
  if (typeof contents === 'string') return contents;
  try {
    return JSON.stringify(contents);
  } catch {
    return String(contents ?? '');
  }
}

function readHeader(req: any, name: string): string {
  const headers = req?.headers || {};
  const value =
    headers[name] ||
    headers[name.toLowerCase()] ||
    headers[name.toUpperCase()];

  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
}

function getGatewayCredential(req: any): string | null {
  return (
    process.env.AI_GATEWAY_API_KEY ||
    readHeader(req, 'x-vercel-oidc-token') ||
    process.env.VERCEL_OIDC_TOKEN ||
    null
  );
}

function getDirectGeminiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    null
  );
}

async function generateViaDirectGemini(
  model: string,
  options: GenerateOptions,
  apiKey: string
): Promise<string> {
  const parts: any[] = [];

  if (options.systemInstruction) {
    parts.push({
      text: `SYSTEM INSTRUCTION:\n${options.systemInstruction}\n\n`,
    });
  }

  parts.push({ text: promptFromContents(options.contents) });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: options.temperature ?? 0.55,
          responseMimeType:
            options.responseMimeType === 'application/json'
              ? 'application/json'
              : undefined,
        },
      }),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `Direct Gemini ${response.status}: ${raw.slice(0, 500)}`
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error('Direct Gemini returned invalid JSON.');
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part: any) => part?.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Direct Gemini returned no text.');
  }

  return text;
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

  const body: any = {
    model,
    messages,
    temperature: options.temperature ?? 0.55,
    max_tokens: 1600,
  };

  if (options.responseMimeType === 'application/json') {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(
    'https://ai-gateway.vercel.sh/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credential}`,
        'Content-Type': 'application/json',
        'x-vercel-ai-gateway-source': 'deutschstart',
      },
      body: JSON.stringify(body),
    }
  );

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
  req: any,
  options: GenerateOptions
): Promise<string> {
  let lastError: any = null;
  const directKey = getDirectGeminiKey();

  if (directKey) {
    for (const model of DIRECT_GEMINI_MODELS) {
      try {
        return await generateViaDirectGemini(model, options, directKey);
      } catch (error: any) {
        lastError = error;
        console.warn(
          '[Direct Gemini]',
          model,
          String(error?.message || '').slice(0, 220)
        );
      }
    }
  }

  const gatewayCredential = getGatewayCredential(req);

  if (!gatewayCredential) {
    throw new Error(
      'NO_AI_CREDENTIAL: Không có GEMINI_API_KEY, AI_GATEWAY_API_KEY hoặc x-vercel-oidc-token.'
    );
  }

  for (const model of GATEWAY_MODELS) {
    try {
      return await generateViaGateway(model, options, gatewayCredential);
    } catch (error: any) {
      lastError = error;
      console.warn(
        '[Vercel AI Gateway]',
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
        'AI đang bị giới hạn quota hoặc ngân sách. Kiểm tra quota rồi thử lại.',
      detail: raw.slice(0, 400),
    });
  }

  if (
    raw.includes('NO_AI_CREDENTIAL') ||
    lower.includes('unauthorized') ||
    raw.includes('401') ||
    raw.includes('403')
  ) {
    return res.status(503).json({
      error: 'AI_AUTH',
      message:
        'AI chưa có thông tin xác thực hợp lệ trên deployment này.',
      detail: raw.slice(0, 400),
    });
  }

  return res.status(503).json({
    error: 'AI_UNAVAILABLE',
    message: 'AI backend lỗi khi gọi model.',
    detail: raw.slice(0, 400),
  });
}
