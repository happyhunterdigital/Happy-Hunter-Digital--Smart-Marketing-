// functions/src/services/chatService.ts
export const callGeminiChat = async (prompt: string, history: any[], gKey: string) => {
  return {
    candidates: [{
      content: {
        parts: [{ text: "The Smart Marketing AI is currently offline for security maintenance. Please contact us directly on WhatsApp." }]
      }
    }]
  };
};
