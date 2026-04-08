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
  const { messages } = req.body;

  // Google Gemini 모델을 사용하여 스트리밍 응답 생성
  // streamText 함수는 모델에서 생성된 텍스트를 스트리밍 방식으로 반환
  const result = await streamText({
    model: google(MODEL_ID),
    messages: await convertToModelMessages(messages),
  });

  // Express 응답 객체(res)로 스트리밍 데이터를 전송
  result.pipeUIMessageStreamToResponse(res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gemini Server is running on http://localhost:${PORT}`);
});
