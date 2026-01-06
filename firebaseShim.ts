// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        // Priority: Use the Secret from GitHub. 
        // Fallback: If local, use the hardcoded key (Update this string if you want local testing)
        const API_KEY = import.meta.env.VITE_API_KEY || "PASTE_YOUR_NEW_KEY_HERE_IF_TESTING_LOCALLY";
        
        try {
          // Using the stable Gemini 1.5 Flash model
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
              })
            }
          );

          const data = await response.json();
          if (data.error) throw new Error(data.error.message);

          return { 
            response: { text: () => data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm ready to help!" } 
          };
        } catch (error) {
          console.error("Chat error:", error);
          return { response: { text: () => "I'm having a brief sync issue. Please use the WhatsApp button! 💬" } };
        }
      }
    })
  };
};

// --- CRITICAL FIX: These exports prevent the build from crashing ---
export const getVertexAI = () => null;
export const initializeVertexAI = () => null;
export const getVertexAIClient = () => null;
export default {};
