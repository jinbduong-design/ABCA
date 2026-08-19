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
  try {
    const { message, mode, history, userLevel = "A0", topic } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return helpful fallback response if API key is not yet configured
      return res.json({
        reply: `🇩🇪 [Gia sư Tiếng Đức]: Chào bạn! Mình là gia sư tiếng Đức cho người Việt. 
Vì chưa có cấu hình GEMINI_API_KEY trong hệ thống, mình đang phản hồi ở chế độ hỗ trợ offline.
Bạn hãy đặt câu hỏi về từ vựng, ngữ pháp A0-A2, chia động từ (sein, haben, heißen), giống của danh từ (der/die/das) hoặc luyện câu nhé!

💡 Mẹo học nhanh:
- Động từ tiếng Đức luôn đứng ở vị trí thứ 2 trong câu trần thuật: "Ich lerne Deutsch." (Tôi học tiếng Đức).
- Danh từ luôn viết hoa chữ cái đầu: das Haus, der Tisch, die Schule.`,
        suggestedNext: "Luyện chia động từ sein",
      });
    }

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

    // Construct conversation history
    const conversationPrompt = `Lịch sử hội thoại trước đó:
${(history || [])
  .slice(-6)
  .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Học viên" : "Gia sư"}: ${h.text}`)
  .join("\n")}

Học viên hỏi/nói: "${message}"

Hãy trả lời học viên theo các quy tắc trên:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: conversationPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "🇩🇪 Wunderbar! Bạn có thể tiếp tục đặt câu hỏi nhé.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/tutor/chat:", error);
    res.status(500).json({
      error: "Không thể kết nối với gia sư AI lúc này. Vui lòng thử lại.",
      details: error.message,
    });
  }
});

// AI Conversation Roleplay endpoint
app.post("/api/conversation/message", async (req, res) => {
  try {
    const { scenarioTitle, scenarioContext, userMessage, history, targetLanguage = "de" } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        aiReply: "Sehr gut! Das freut mich. Möchten Sie noch etwas bestellen?",
        correction: {
          original: userMessage,
          better: userMessage,
          explanation: "Câu của bạn rất tốt và tự nhiên trong tình huống này!",
        },
        vietnameseHint: "Bạn có thể nói: 'Nein danke, das ist alles.' (Không, cảm ơn, bấy nhiêu là đủ rồi.)",
      });
    }

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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/conversation/message:", error);
    res.status(500).json({
      error: "Không thể xử lý hội thoại lúc này",
      details: error.message,
    });
  }
});

// AI Sentence Analysis / Correction endpoint
app.post("/api/tutor/analyze-sentence", async (req, res) => {
  try {
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
        vietnameseTranslation: "Bản dịch mẫu",
        grammarBreakdown: [
          { component: sentence, role: "Câu hoàn chỉnh", explanation: "Cấu trúc chuẩn." },
        ],
        notes: "Bạn đang sử dụng cấu trúc cơ bản.",
      });
    }

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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/tutor/analyze-sentence:", error);
    res.status(500).json({ error: "Lỗi phân tích câu" });
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
