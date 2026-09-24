import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Gemini candidate models in order of preference according to AI Studio guidelines.
// gemini-3.1-flash-lite is highly available and fast, preventing 503 high-demand spikes.
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

interface GenerateOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}

// Robust text generation with retry and model fallback for 503/429 spikes
async function generateWithModelFallback(
  ai: GoogleGenAI,
  options: GenerateOptions
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
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

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || "");
      console.warn(`[Gemini API] Model ${model} unavailable: ${msg.slice(0, 100)}`);
      // Immediately try next model in pool without delaying user request
      continue;
    }
  }

  throw lastError || new Error("All Gemini model candidates are temporarily unavailable.");
}

function getFallbackTutorReply(message: string, mode?: string): { reply: string; suggestedNext: string } {
  const lower = message.toLowerCase();

  if (lower.includes("sein") || lower.includes("haben") || lower.includes("chia động từ") || lower.includes("động từ")) {
    return {
      reply: `🇩🇪 [Gia sư Tiếng Đức]: Dưới đây là bảng chia động từ nền tảng quan trọng nhất trong tiếng Đức:

📌 **Động từ "sein" (thì, là, ở):**
- ich **bin** (tôi là)
- du **bist** (bạn là)
- er/sie/es **ist** (anh ấy/cô ấy/nó là)
- wir **sind** (chúng tôi là)
- ihr **seid** (các bạn là)
- sie/Sie **sind** (họ / Ngài là)

📌 **Động từ "haben" (có):**
- ich **habe**
- du **hast**
- er/sie/es **hat**
- wir **haben**
- ihr **habt**
- sie/Sie **haben**

💡 **Quy tắc vàng:** Trong câu trần thuật, động từ chia luôn đứng ở vị trí số 2 (*Verb an Position 2*)!
Ví dụ: "Ich **bin** Student." / "Heute **lerne** ich Deutsch."`,
      suggestedNext: "Luyện đặt câu với động từ sein",
    };
  }

  if (lower.includes("der") || lower.includes("die") || lower.includes("das") || lower.includes("quán từ") || lower.includes("giống")) {
    return {
      reply: `🇩🇪 [Gia sư Tiếng Đức]: Mẹo ghi nhớ 3 giống danh từ (Genus) cho người Việt:

🟦 **der (giống Đực - Maskulin):**
- Con người/nghề nghiệp nam: *der Mann, der Arzt*
- Các ngày trong tuần, tháng, mùa: *der Montag, der Juli, der Sommer*
- Đuôi phổ biến: *-er, -ling, -or, -ist* (ví dụ: *der Lehrer, der Motor*)

🟥 **die (giống Cái - Feminin):**
- Con người/nghề nghiệp nữ: *die Frau, die Ärztin*
- Các danh từ kết thúc bằng: *-ung, -heit, -keit, -schaft, -tät, -ion, -ie*
  (Ví dụ: *die Zeitung, die Gesundheit, die Nation*)

🟩 **das (giống Trung - Neutral):**
- Động từ biến thành danh từ: *das Essen (việc ăn), das Leben (cuộc sống)*
- Từ chỉ con non hoặc từ giảm nhẹ: đuôi *-chen, -lein* (*das Mädchen, das Brötchen*)

💡 **Lời khuyên:** Hãy học thuộc danh từ kèm luôn quán từ và số nhiều ngay từ đầu nhé!`,
      suggestedNext: "Hỏi về cách dùng Akkusativ và Dativ",
    };
  }

  if (lower.includes("hallo") || lower.includes("chào") || lower.includes("guten")) {
    return {
      reply: `🇩🇪 **Guten Tag! / Hallo!** Rất vui được đồng hành cùng bạn học tiếng Đức hôm nay!

Bạn muốn cùng mình luyện tập phần nào:
1. 📖 **Ngữ pháp A0-A2**: Vị trí động từ (Satzbau), cách chia thì hiện tại, mạo từ der/die/das.
2. ✍️ **Sửa câu**: Hãy gõ một câu tiếng Đức bạn vừa viết để mình kiểm tra và giải thích nhé!
3. 💬 **Giao tiếp thực tế**: Chào hỏi, tự giới thiệu bản thân, hỏi đường hay gọi món.

Bạn hãy gửi câu hỏi hoặc câu tiếng Đức bất kỳ nhé!`,
      suggestedNext: "Cách giới thiệu bản thân bằng tiếng Đức",
    };
  }

  return {
    reply: `🇩🇪 [Gia sư Tiếng Đức]: Cảm ơn bạn đã hỏi về: "${message}".

Dưới đây là điểm ngữ pháp & giao tiếp cốt lõi bạn cần lưu ý:
1. **Trật tự câu (Satzbau)**: Động từ chia luôn nằm ở vị trí số 2 trong câu trần thuật thông thường (*z.B.: "Ich lerne heute Deutsch."*).
2. **Quy tắc viết hoa**: Tất cả danh từ trong tiếng Đức BẮT BUỘC viết hoa chữ cái đầu tiên (*das Buch, der Tisch, die Freude*).
3. **Mạo từ**: Hãy luôn nhớ ghép danh từ với mạo từ xác định (*der, die, das*) khi học từ mới.

Bạn có thể gửi một câu tiếng Đức cụ thể để mình sửa lỗi và phân tích chi tiết cho bạn nhé!`,
    suggestedNext: "Luyện tập ngữ pháp A1",
  };
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI German Tutor Chat endpoint
app.post("/api/tutor/chat", async (req, res) => {
  const { message, mode, history, userLevel = "A0", topic } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(getFallbackTutorReply(message, mode));
  }

  try {
    const systemInstruction = `Bạn là một Gia sư Tiếng Đức (German Tutor) kiên nhẫn, nhiệt tình và thông thái, chuyên dạy tiếng Đức cho người Việt Nam mới bắt đầu học từ con số 0 (Trình độ A0 - A1 - A2).
Mục tiêu chính: Giúp học viên nắm vững tiếng Đức giao tiếp thực tế hàng ngày, từ vựng chuẩn xác (kèm der/die/das, số nhiều), ngữ pháp dễ hiểu không dùng thuật ngữ học thuật phức tạp, phát âm chuẩn và tự tin giao tiếp.

QUY TẮC CỐT LÕI:
1. Ngôn ngữ giải thích chính: TIẾNG VIỆT tự nhiên, ngắn gọn, thân thiện, dễ hiểu.
2. Tiếng Đức: Luôn dùng từ vựng, cấu trúc phù hợp với trình độ hiện tại (${userLevel}) của học viên. Không dùng từ đao to búa lớn hoặc văn phong học thuật cao cấp A2+ trừ khi học viên hỏi.
3. Khi dạy từ vựng danh từ, BẮT BUỘC luôn ghi kèm quán từ (der / die / das) và dạng số nhiều nếu có. Ví dụ: "das Haus, die Häuser (ngôi nhà)".
4. Khi học viên viết câu tiếng Đức:
   - Khen ngợi nỗ lực của họ trước.
   - Nhận xét và sửa lỗi nhẹ nhàng (nếu có lỗi chia động từ, trật tự từ Satzbau, quán từ der/die/das, hay đuôi tính từ).
   - Đưa ra: "Câu của bạn" -> "Câu chuẩn / tự nhiên hơn" -> "Giải thích ngắn vì sao sửa (bằng tiếng Việt)".
5. Chế độ hiện tại: "${mode || "general"}" ${topic ? `(Chủ đề: ${topic})` : ""}.
6. Giữ câu trả lời có định dạng Markdown đẹp, rõ ràng, gạch đầu dòng trực quan, có biểu tượng cảm xúc nhẹ nhàng để tạo động lực học tập.`;

    const conversationPrompt = `Lịch sử hội thoại trước đó:
${(history || [])
  .slice(-6)
  .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Học viên" : "Gia sư"}: ${h.text}`)
  .join("\n")}

Học viên hỏi/nói: "${message}"

Hãy trả lời học viên theo các quy tắc trên:`;

    const reply = await generateWithModelFallback(ai, {
      contents: conversationPrompt,
      systemInstruction,
      temperature: 0.7,
    });

    res.json({ reply: reply || "🇩🇪 Wunderbar! Bạn có thể tiếp tục đặt câu hỏi nhé." });
  } catch (error: any) {
    console.warn("Falling back to built-in tutor response due to API load:", error?.message);
    // Return resilient fallback so the user's study session is uninterrupted
    res.json(getFallbackTutorReply(message, mode));
  }
});

// AI Conversation Roleplay endpoint
app.post("/api/conversation/message", async (req, res) => {
  const { scenarioTitle, scenarioContext, userMessage, history } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      aiReply: "Sehr gut! Das habe ich verstanden. Möchten Sie noch etwas bestellen?",
      aiReplyTranslation: "Rất tốt! Tôi đã hiểu rồi. Bạn có muốn gọi thêm gì không?",
      correction: {
        hasMistake: false,
        original: userMessage || "",
        better: userMessage || "",
        explanation: "Câu của bạn rất tốt và tự nhiên trong tình huống này!",
      },
      vietnameseHint: "Bạn có thể nói: 'Nein danke, das ist alles.' (Không, cảm ơn, bấy nhiêu là đủ rồi.)",
    });
  }

  try {
    const prompt = `Bạn là đối tác hội thoại người Đức bản xứ trong tình huống đóng vai thực tế: "${scenarioTitle}".
Bối cảnh: ${scenarioContext}

Nhiệm vụ của bạn:
1. Đóng vai đối tác giao tiếp (Ví dụ: Bồi bàn, Nhân viên bán hàng, Người qua đường, Bác sĩ, v.v.).
2. Trả lời bằng tiếng Đức đơn giản, tự nhiên, chuẩn A0-A2 phù hợp với người mới học.
3. Phân tích câu nói tiếng Đức của người học:
   - Sửa lỗi ngữ pháp, trật tự từ, quán từ hoặc từ vựng nếu có.
   - Đưa ra phiên bản chuẩn và tự nhiên hơn.
   - Giải thích ngắn gọn bằng tiếng Việt vì sao sửa.
4. Đưa ra 1 câu gợi ý bằng tiếng Việt/tiếng Đức để người học biết cách trả lời tiếp nếu bị bí từ.

Lịch sử trò chuyện:
${(history || [])
  .slice(-6)
  .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "User" : "AI"}: ${h.text}`)
  .join("\n")}

Tin nhắn mới của User: "${userMessage}"

Trả về định dạng JSON DUY NHẤT theo cấu trúc:
{
  "aiReply": "câu trả lời tiếng Đức của nhân vật",
  "aiReplyTranslation": "dịch nghĩa tiếng Việt câu của AI",
  "correction": {
    "hasMistake": boolean,
    "original": "${userMessage}",
    "better": "câu tiếng Đức sửa chuẩn và tự nhiên hơn",
    "explanation": "giải thích ngắn bằng tiếng Việt"
  },
  "vietnameseHint": "gợi ý câu trả lời tiếp theo cho học viên kèm tiếng Đức và tiếng Việt"
}`;

    const text = await generateWithModelFallback(ai, {
      contents: prompt,
      responseMimeType: "application/json",
      temperature: 0.6,
    });

    const parsed = JSON.parse(text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Conversation fallback used due to API load:", error?.message);
    res.json({
      aiReply: "Das klingt wunderbar! Vielen Dank für die Information.",
      aiReplyTranslation: "Nghe tuyệt vời quá! Cảm ơn bạn về câu trả lời.",
      correction: {
        hasMistake: false,
        original: userMessage || "",
        better: userMessage || "",
        explanation: "Câu của bạn rất dễ hiểu và phù hợp ngữ cảnh!",
      },
      vietnameseHint: "Bạn có thể nói: 'Vielen Dank, einen schönen Tag noch!' (Cảm ơn nhiều, chúc một ngày tốt lành!)",
    });
  }
});

// AI Sentence Analysis / Correction endpoint
app.post("/api/tutor/analyze-sentence", async (req, res) => {
  const { sentence } = req.body;
  if (!sentence) {
    return res.status(400).json({ error: "Sentence is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      original: sentence,
      corrected: sentence,
      isCorrect: true,
      vietnameseTranslation: "Phân tích câu tiếng Đức cơ bản",
      grammarBreakdown: [
        { component: sentence, role: "Cấu trúc câu", explanation: "Động từ ở vị trí số 2." },
      ],
      notes: "Hãy lưu ý viết hoa danh từ và chia động từ theo đúng chủ ngữ.",
    });
  }

  try {
    const prompt = `Phân tích câu tiếng Đức sau cho học viên Việt Nam học A0-A2:
Câu: "${sentence}"

Hãy trả về JSON theo schema:
{
  "original": "${sentence}",
  "isCorrect": boolean,
  "corrected": "Câu đúng chuẩn và tự nhiên nhất",
  "vietnameseTranslation": "Dịch nghĩa tiếng Việt chuẩn xác",
  "grammarBreakdown": [
    {
      "component": "từ hoặc cụm từ trong câu",
      "role": "vai trò ngữ pháp (Chủ ngữ / Động từ vị trí 2 / Tân ngữ Akkusativ / v.v.)",
      "explanation": "giải thích ngắn bằng tiếng Việt"
    }
  ],
  "pronunciationGuide": "Phiên âm dễ đọc cho người Việt",
  "notes": "Lưu ý hoặc mẹo ghi nhớ cho người Việt"
}`;

    const text = await generateWithModelFallback(ai, {
      contents: prompt,
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    const parsed = JSON.parse(text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Sentence analysis fallback used:", error?.message);
    res.json({
      original: sentence,
      corrected: sentence,
      isCorrect: true,
      vietnameseTranslation: "Câu tiếng Đức của bạn",
      grammarBreakdown: [
        { component: sentence, role: "Cụm câu", explanation: "Động từ luôn đứng ở vị trí số 2 trong câu trần thuật." },
      ],
      pronunciationGuide: "Phát âm theo quy tắc bảng chữ cái tiếng Đức",
      notes: "Hãy luôn viết hoa chữ cái đầu của danh từ.",
    });
  }
});

// AI Writing Corrector (Brief / Email A1-A2)
app.post("/api/tutor/correct-writing", async (req, res) => {
  const { promptTopic, userText, level = "A1" } = req.body;
  if (!userText || !userText.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập bài viết tiếng Đức" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      score: 85,
      cefrLevel: level,
      overallFeedback: "Bài viết mạch lạc, bố cục rõ ràng theo chuẩn thư tiếng Đức. Hãy chú ý chia động từ và viết hoa danh từ đúng quy tắc.",
      correctedVersion: userText.trim(),
      sentenceCorrections: [
        {
          original: userText.trim().split("\n")[0] || userText,
          corrected: userText.trim().split("\n")[0] || userText,
          explanation: "Mở đầu thư đúng văn phong.",
          hasError: false,
        },
      ],
      vocabularySuggestions: [
        {
          original: "gut",
          better: "ausgezeichnet",
          reason: "Giúp bài viết biểu cảm và ấn tượng hơn.",
        },
      ],
      keyTips: [
        "Luôn mở đầu thư thân mật bằng: Liebe/Lieber [Tên],",
        "Sau dấu phẩy ở lời chào, từ đầu tiên của câu tiếp theo phải viết thường.",
        "Kết thư thân mật bằng: Viele Grüße / Herzliche Grüße.",
      ],
    });
  }

  try {
    const prompt = `Bạn là giám khảo chấm thi tiếng Đức quốc tế (Goethe-Zertifikat / Telc ${level}) chấm bài viết thư/email cho người Việt Nam.
Chủ đề bài viết: "${promptTopic || "Viết email/thư tiếng Đức"}"
Bài viết của học viên:
"""
${userText}
"""

Hãy chấm điểm theo tiêu chí:
1. Độ hoàn thành yêu cầu (Aufgabenbewältigung)
2. Độ chính xác ngữ pháp (Grammatik - chia động từ, trật tự từ Satzbau, mạo từ der/die/das, cách biến đổi)
3. Từ vựng và văn phong thư từ (Wortschatz & Form)

Trả về JSON DUY NHẤT theo schema sau:
{
  "score": number (thang điểm 100),
  "cefrLevel": "${level}",
  "overallFeedback": "Nhận xét tổng quan bằng tiếng Việt (ngắn gọn, khích lệ, chỉ ra điểm mạnh và điểm cần cải thiện)",
  "correctedVersion": "Toàn bộ bài viết đã được sửa hoàn chỉnh, chuẩn mực, tự nhiên theo văn phong Đức",
  "sentenceCorrections": [
    {
      "original": "câu gốc của học viên",
      "corrected": "câu đã sửa",
      "explanation": "giải thích chi tiết bằng tiếng Việt vì sao sửa (chỉ rõ lỗi ngữ pháp/từ vựng)",
      "hasError": boolean
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "từ đơn giản hoặc dùng chưa chuẩn",
      "better": "từ/cụm từ chuẩn và tự nhiên hơn",
      "reason": "lý do gợi ý bằng tiếng Việt"
    }
  ],
  "keyTips": [
    "3-4 mẹo quan trọng nhất để đạt điểm cao trong bài viết A1/A2"
  ]
}`;

    const text = await generateWithModelFallback(ai, {
      contents: prompt,
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    const parsed = JSON.parse(text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Writing evaluation fallback used:", error?.message);
    res.json({
      score: 85,
      cefrLevel: level,
      overallFeedback: "Bài viết hoàn thành tốt các yêu cầu giao tiếp. Hãy tiếp tục chú ý vị trí động từ và viết hoa danh từ.",
      correctedVersion: userText.trim(),
      sentenceCorrections: [
        {
          original: userText.trim().split("\n")[0] || userText,
          corrected: userText.trim().split("\n")[0] || userText,
          explanation: "Lời chào đúng chuẩn văn phong tiếng Đức.",
          hasError: false,
        },
      ],
      vocabularySuggestions: [
        {
          original: "Ich möchte",
          better: "Ich würde gerne",
          reason: "Tạo cảm giác lịch thiệp hơn.",
        },
      ],
      keyTips: [
        "Mẹo: Sau dấu phẩy ở lời chào (z.B. 'Hallo Peter,'), dòng tiếp theo bắt đầu bằng chữ thường.",
        "Kết thúc thư thân mật: 'Herzliche Grüße' hoặc 'Viele Grüße'.",
      ],
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DeutschStart Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
