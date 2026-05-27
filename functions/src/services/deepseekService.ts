// functions/src/services/deepseekService.ts
import { DEEPSEEK_API_KEY } from "../config";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  options: { jsonMode?: boolean; temperature?: number } = {}
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is missing");
  }

  const payload: any = {
    model: "deepseek-chat",
    messages,
    temperature: options.temperature ?? 0.1,
  };

  if (options.jsonMode) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}
