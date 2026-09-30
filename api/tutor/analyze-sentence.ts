import {
  generateWithModelFallback,
  requireGemini,
  sendAIUnavailable,
} from '../_lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { sentence } = req.body || {};
  if (!sentence || !String(sentence).trim()) {
    return res.status(400).json({ error: 'Sentence is required' });
  }

  const ai = requireGemini(res);
  if (!ai) return;

  try {
    const prompt = `Phân tích câu tiếng Đức sau cho người Việt học A0-A2:
"${sentence}"

Trả về JSON:
{
  "original": "${String(sentence).replace(/"/g, '\"')}",
  "isCorrect": boolean,
  "corrected": "câu tự nhiên hơn",
  "vietnameseTranslation": "nghĩa tiếng Việt",
  "grammarBreakdown": [
    {
      "component": "từ/cụm",
      "role": "vai trò",
      "explanation": "giải thích ngắn"
    }
  ],
  "pronunciationGuide": "gợi ý đọc đơn giản",
  "notes": "một lưu ý quan trọng nhất"
}`;

    const text = await generateWithModelFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.25,
    });

    return res.status(200).json(JSON.parse(text || '{}'));
  } catch (error) {
    return sendAIUnavailable(res, error);
  }
}
