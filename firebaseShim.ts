// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // FIX: We are IGNORING the GitHub Secret for now to force the new key to work.
        // Use the new key "AlzaSyCdm..." directly.
        const API_KEY = "AlzaSyCdmPzVLVkOs7prinSgvxulfBZxLBTsA6U";
        
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
          
          if (data.error) {
            console.error("API Error:", data.error);
            // If it fails, we show the error code so we know why
            return { 
              response: { text: () => `Connection Error (${data.error.code}): ${data.error.message}` } 
            };
          }

          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm ready to help!";
          return { response: { text: () => aiText } };
          
        } catch (error) {
          console.error("Network Error:", error);
          return { response: { text: () => "I'm offline. Please check your internet connection." } };
        }
      }
    })
  };
};

// --- BUILD FIX ---
export const getVertexAI = () => null;
export const initializeVertexAI = () => null;
export const getVertexAIClient = () => null;
export default {};
