import express from "express";
import cors from "cors";
import "dotenv/config";
import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";

const app = express();
app.use(cors());
app.use(express.json());

const MODEL_ID = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, documentContext } = req.body;

    // Google Gemini 모델을 사용하여 스트리밍 응답 생성
    // streamText 함수는 모델에서 생성된 텍스트를 스트리밍 방식으로 반환
    const result = await streamText({
      model: google(MODEL_ID),
      system: documentContext
        ? `다음은 사용자가 업로드한 문서의 내용이다.\n\n${documentContext}\n\n반드시 이 문서를 우선적으로 참고해서 답변해라. 문서에 없는 내용은 추정하지 말고 모른다고 답해라.`
        : undefined,
      messages: await convertToModelMessages(messages),
      // 30초 이상 걸리면 강제 종료 (필요에 따라 조절)
      abortSignal: AbortSignal.timeout(30000),
    });

    // Express 응답 객체(res)로 스트리밍 데이터를 전송
    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "AI 서버 응답 시간 초과" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gemini Server is running on http://localhost:${PORT}`);
});
