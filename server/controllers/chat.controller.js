import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";

const MODEL_ID = () => process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

export async function streamChat(req, res) {
  try {
    const { messages, documentContext } = req.body;

    const result = await streamText({
      model: google(MODEL_ID()),
      system: documentContext
        ? `다음은 사용자가 업로드한 문서의 내용이다.\n\n${documentContext}\n\n반드시 이 문서를 우선적으로 참고해서 답변해라. 문서에 없는 내용은 추정하지 말고 모른다고 답해라.`
        : undefined,
      messages: await convertToModelMessages(messages),
      abortSignal: AbortSignal.timeout(30000),
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "AI 서버 응답 시간 초과" });
  }
}
