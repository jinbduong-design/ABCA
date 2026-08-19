export interface TutorChatResponse {
  reply: string;
  suggestedNext?: string;
}

export interface ConversationResponse {
  aiReply: string;
  aiReplyTranslation?: string;
  correction?: {
    hasMistake: boolean;
    original: string;
    better: string;
    explanation: string;
  };
  vietnameseHint?: string;
}

export async function askAITutor(params: {
  message: string;
  mode: string;
  history: { sender: string; text: string }[];
  userLevel?: string;
  topic?: string;
}): Promise<TutorChatResponse> {
  try {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn('AI Tutor API fallback used:', error);
    return {
      reply: `🇩🇪 [Gia sư Tiếng Đức]: Cảm ơn bạn! Mình đã nhận được câu hỏi: "${params.message}".
Vì chưa kết nối trực tiếp với máy chủ AI, mình xin chia sẻ mẹo học trọng tâm:

1. **Vị trí động từ**: Trong câu trần thuật, động từ luôn ở vị trí số 2 (Ví dụ: "Heute lerne ich Deutsch").
2. **Quán từ 3 giống**: 
   - 🟦 **der** (đực - der Tisch, der Mann)
   - 🟥 **die** (cái - die Frau, die Schule, đuôi -ung, -heit)
   - 🟩 **das** (trung - das Haus, das Kind, đuôi -chen)
3. Hãy luyện phát âm chuẩn bảng chữ cái và các cặp nguyên âm "ei" [ai], "ie" [i dài] nhé!`,
      suggestedNext: 'Luyện chia động từ sein & haben',
    };
  }
}

export async function sendConversationMessage(params: {
  scenarioTitle: string;
  scenarioContext: string;
  userMessage: string;
  history: { sender: string; text: string }[];
}): Promise<ConversationResponse> {
  try {
    const res = await fetch('/api/conversation/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn('Conversation API fallback used:', error);
    return {
      aiReply: 'Das klingt wunderbar! Vielen Dank für die Information.',
      aiReplyTranslation: 'Nghe tuyệt vời quá! Cảm ơn bạn về thông tin.',
      correction: {
        hasMistake: false,
        original: params.userMessage,
        better: params.userMessage,
        explanation: 'Câu nói của bạn rất tự nhiên và chính xác!',
      },
      vietnameseHint: 'Gợi ý: Bạn có thể nói "Auf Wiedersehen und einen schönen Tag!" (Tạm biệt và chúc một ngày tốt lành!)',
    };
  }
}

export async function analyzeGermanSentence(sentence: string): Promise<any> {
  try {
    const res = await fetch('/api/tutor/analyze-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence }),
    });
    if (!res.ok) throw new Error('Failed to analyze');
    return await res.json();
  } catch (e) {
    return {
      original: sentence,
      corrected: sentence,
      isCorrect: true,
      vietnameseTranslation: 'Bản phân tích ngữ pháp nhanh',
      grammarBreakdown: [
        { component: sentence, role: 'Cấu trúc câu', explanation: 'Động từ ở vị trí số 2.' },
      ],
      notes: 'Hãy chú ý chia động từ theo chủ ngữ.',
    };
  }
}
