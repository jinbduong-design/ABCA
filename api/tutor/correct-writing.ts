import {
  generateWithModelFallback,
  parseJsonText,
  sendAIUnavailable,
} from '../_lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { promptTopic, userText, level = 'A1' } = req.body || {};
  if (!userText || !String(userText).trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập bài viết tiếng Đức' });
  }

  try {
    const prompt = `Bạn là giáo viên tiếng Đức chấm bài viết trình độ ${level}.
Chủ đề: ${promptTopic || 'Viết email/thư tiếng Đức'}
Bài viết:
"""
${userText}
"""

Trả về JSON:
{
  "score": 0,
  "cefrLevel": "${level}",
  "overallFeedback": "nhận xét ngắn bằng tiếng Việt",
  "correctedVersion": "bản sửa hoàn chỉnh",
  "sentenceCorrections": [
    {
      "original": "câu gốc",
      "corrected": "câu sửa",
      "explanation": "lý do ngắn",
      "hasError": true
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "từ/cụm",
      "better": "cách tự nhiên hơn",
      "reason": "lý do"
    }
  ],
  "keyTips": ["mẹo quan trọng"]
}`;

    const text = await generateWithModelFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.25,
    });

    return res.status(200).json(parseJsonText(text));
  } catch (error) {
    return sendAIUnavailable(res, error);
  }
}
