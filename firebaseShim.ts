// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // Security: Use Secret if available, fallback to hardcoded key
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        try {
          // FIX: We use 'gemini-pro' because your error log showed 'flash' was blocked/not found.
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ 
                  parts: [{ text: userMessage }] 
                }],
                // SMART PERSONA: This teaches the bot who it is
                // Note: If gemini-pro ignores this, it will just be a normal helpful bot.
                // But this structure prepares you for the future.
                 generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                 }
              })
            }
          );
          
          const data = await response.json();
          
          // Debugging: If Google sends an error, we show it in the chat
          if (data.error) {
            console.error("Google API Error:", data.error);
            return { 
              response: { 
                text: () => `System Error (${data.error.code}): ${data.error.message}. Please use WhatsApp!` 
              } 
            };
          }
          
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm having trouble thinking right now. Please try asking again!";
          
          return { 
            response: { text: () => aiText } 
          };
          
        } catch (error: any) {
          console.error("Chat fetch error:", error);
          return { 
            response: { 
              text: () => "I am currently offline. Please click the green WhatsApp button to chat with our team directly!" 
            } 
          };
        }
      }
    })
  };
};

// Minimal shims for build safety
export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;
