// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // Security: Try to grab the Key from your GitHub Secrets first.
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        try {
          // CRITICAL FIX: Using v1 API (stable) with gemini-pro
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ 
                  parts: [{ text: userMessage }] 
                }]
              })
            }
          );
          
          const data = await response.json();
          
          // Enhanced error handling
          if (data.error) {
            console.error("Google API Error:", data.error);
            return { 
              response: { 
                text: () => `I'm having trouble connecting. Please use the WhatsApp button to chat with our team! 💬` 
              } 
            };
          }
          
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm here but didn't get a clear response. Try asking again or use WhatsApp!";
          
          return { 
            response: { text: () => aiText } 
          };
          
        } catch (error: any) {
          console.error("Chat fetch error:", error);
          return { 
            response: { 
              text: () => "I'm currently offline 😔. Click the green WhatsApp button to chat with our team!" 
            } 
          };
        }
      }
    })
  };
};

// --- MINIMAL SHIMS TO SATISFY THE BUILDER ---
export default {};

export const initializeVertexAI = () => {
  console.warn("Vertex AI shim used - this should only happen during build.");
  return null;
};

// This is the one that was missing causing the error!
export const getVertexAI = () => {
  return null;
};

export const getVertexAIClient = () => {
  return null;
};
