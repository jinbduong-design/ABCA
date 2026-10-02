import {
  generateWithModelFallback,
  parseJsonText,
  sendAIUnavailable,
} from '../_lib/gemini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const {
    message,
    mode,
    history = [],
    userLevel = 'A0',
    topic,
  } = req.body || {};

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const systemInstruction = `Bạn là gia sư tiếng Đức cho người Việt mới bắt đầu từ A0 đến A2.
Giải thích bằng tiếng Việt ngắn, rõ, tránh thuật ngữ nếu không cần.
Ưu tiên giao tiếp thực tế và ví dụ ngắn phù hợp trình độ ${userLevel}.
Nếu học viên viết câu tiếng Đức, chỉ sửa lỗi quan trọng nhất trước rồi đưa phiên bản tự nhiên hơn.
Chế độ: ${mode || 'general'}${topic ? `. Chủ đề: ${topic}` : ''}.`;

    const conversationPrompt = `Lịch sử gần đây:
${history
  .slice(-8)
  .map((item: any) => `${item.sender === 'user' ? 'Học viên' : 'Gia sư'}: ${item.text}`)
  .join('\n')}

Học viên: ${message}

Trả lời ngắn gọn, hữu ích và phù hợp người mới.`;

    const reply = await generateWithModelFallback(req, {
      contents: conversationPrompt,
      systemInstruction,
      temperature: 0.65,
    });

    return res.status(200).json({
      reply: reply || 'Bạn có thể tiếp tục gửi câu tiếng Đức để mình luyện cùng.',
    });
  } catch (error) {
    return sendAIUnavailable(res, error);
  }
}
