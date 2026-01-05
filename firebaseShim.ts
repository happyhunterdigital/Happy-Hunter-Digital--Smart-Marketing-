// happy-hunter-digital/firebaseShim.ts

export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // 1. SECURITY: Try to grab the Key from your GitHub Secrets first.
        // If that fails (is undefined), fall back to the key you provided so the site works NOW.
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        try {
          // 2. FIX: Switched to 'gemini-pro' (The most stable model)
          // This fixes the "Model not found" error you saw.
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
              })
            }
          );

          const data = await response.json();

          // Error Handling
          if (data.error) {
            console.error("Google API Error:", data.error);
            return { 
              response: { 
                text: () => `My brain is offline (${data.error.message}). Please WhatsApp us!` 
              } 
            };
          }

          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I am online, but I didn't get a response. Try asking again.";

          return { 
            response: { text: () => aiText } 
          };

        } catch (error: any) {
          return { 
            response: { 
              text: () => "I am currently offline. Please click the WhatsApp button to chat with our team directly!" 
            } 
          };
        }
      }
    })
  };
};
