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
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
    });
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
    console.warn("AI request unavailable:", error?.message);
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
    });
  }
});

// AI Conversation Roleplay endpoint
app.post("/api/conversation/message", async (req, res) => {
  const {
    scenarioTitle,
    scenarioContext,
    scenarioGoal,
    userLevel = "A0",
    practiceMode = "guided",
    suggestedPhrases = [],
    turnNumber = 1,
    userMessage,
    history,
  } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
    });
  }

  try {
    const modeRule =
      practiceMode === "guided"
        ? "CHẾ ĐỘ CÓ HƯỚNG DẪN: Mỗi lượt chỉ dùng 1 câu tiếng Đức ngắn, ưu tiên A0/A1. Luôn cho bản dịch Việt và một gợi ý trả lời rất ngắn."
        : practiceMode === "challenge"
        ? "CHẾ ĐỘ THỬ THÁCH: Hội thoại tự nhiên hơn, không chủ động cho gợi ý trừ khi học viên thật sự bí. Vẫn chỉ sửa 1 lỗi quan trọng nhất."
        : "CHẾ ĐỘ TỰ NHIÊN: Dùng 1-2 câu tiếng Đức tự nhiên, vừa sức. Chỉ cho gợi ý khi có ích.";

    const phraseBank = Array.isArray(suggestedPhrases)
      ? suggestedPhrases
          .slice(0, 6)
          .map((phrase: any) => `${phrase?.german || ""} = ${phrase?.vietnamese || ""}`)
          .join("\n")
      : "";

    const prompt = `Bạn là đối tác hội thoại người Đức bản xứ và đồng thời là người hướng dẫn giao tiếp cho người Việt mới học tiếng Đức.

TÌNH HUỐNG: "${scenarioTitle}"
BỐI CẢNH: ${scenarioContext}
MỤC TIÊU PHIÊN: ${scenarioGoal || "Duy trì một hội thoại ngắn phù hợp tình huống."}
TRÌNH ĐỘ NGƯỜI HỌC: ${userLevel}
LƯỢT NGƯỜI HỌC HIỆN TẠI: ${turnNumber}
${modeRule}

NGÂN HÀNG CÂU GỢI Ý THAM KHẢO:
${phraseBank || "(không có)"}

NGUYÊN TẮC BẮT BUỘC:
1. ĐÓNG VAI thật, không biến câu trả lời thành bài giảng.
2. Mỗi lượt AI chỉ nên có 1 câu hỏi hoặc 1 phản hồi chính để người học biết phải trả lời gì tiếp.
3. Ưu tiên câu ngắn, từ vựng thông dụng, đúng mức ${userLevel}. Không tự nâng độ khó quá nhanh.
4. Nếu câu người học hiểu được nhưng chưa tự nhiên, chỉ sửa MỘT lỗi quan trọng nhất. Không liệt kê hàng loạt lỗi.
5. Nếu người học viết đúng hoặc đủ hiểu, correction.hasMistake phải là false.
6. Phản hồi học tập phải cụ thể: nói rõ một điểm họ vừa làm được và tối đa một điểm cần sửa.
7. missionProgress phải dựa trên nội dung hội thoại thật, không tự cho hoàn thành. Chỉ complete=true khi mục tiêu tình huống đã thực sự được xử lý.
8. percent phải từ 0-100 và tăng hợp lý theo tiến triển; không tăng chỉ vì số lượt.
9. nextMission phải là hành động tiếp theo rất cụ thể, ví dụ "Nói tên của bạn", "Hỏi giá", "Xin hóa đơn".
10. usefulPhrase chỉ đưa 1 cụm thực dụng có thể tái sử dụng ngay.

LỊCH SỬ:
${(history || [])
  .slice(-10)
  .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Học viên" : "Đối tác"}: ${h.text}`)
  .join("\n")}

TIN NHẮN MỚI CỦA HỌC VIÊN:
"${userMessage}"

Trả về JSON DUY NHẤT:
{
  "aiReply": "1-2 câu tiếng Đức của nhân vật",
  "aiReplyTranslation": "bản dịch tiếng Việt ngắn",
  "correction": {
    "hasMistake": boolean,
    "original": "${userMessage}",
    "better": "phiên bản tốt hơn; nếu không sai có thể giữ nguyên",
    "explanation": "một giải thích ngắn bằng tiếng Việt"
  },
  "vietnameseHint": "một gợi ý trả lời tiếp theo; để rỗng nếu chế độ không cần",
  "microFeedback": {
    "whatWentWell": "một điểm cụ thể vừa làm tốt",
    "oneFix": "tối đa một điểm nên sửa; để rỗng nếu không cần",
    "usefulPhrase": "một cụm tiếng Đức thực dụng + nghĩa Việt"
  },
  "missionProgress": {
    "percent": number,
    "achieved": ["những mục tiêu nhỏ đã thực sự đạt"],
    "nextMission": "việc cụ thể nên làm ở lượt tiếp theo",
    "complete": boolean
  }
}`;

    const text = await generateWithModelFallback(ai, {
      contents: prompt,
      responseMimeType: "application/json",
      temperature: 0.6,
    });

    const parsed = JSON.parse(text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("AI request unavailable:", error?.message);
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
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
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
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
    console.warn("AI request unavailable:", error?.message);
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
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
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
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
    console.warn("AI request unavailable:", error?.message);
    return res.status(503).json({
      error: "AI_UNAVAILABLE",
      message: "AI đang tạm thời không khả dụng. Hãy thử lại sau.",
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
