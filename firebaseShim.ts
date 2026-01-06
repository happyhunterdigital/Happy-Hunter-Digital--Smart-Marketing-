// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // NUCLEAR OPTION: We removed "import.meta.env.VITE_API_KEY"
        // This forces the app to use YOUR NEW WORKING KEY.
        const API_KEY = "AlzaSyCdmPzVLVkOs7prinSgvxulfBZxLBTsA6U"; 
        
        try {
          // Using the specific model that works with new keys
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
            return { 
              response: { text: () => `Connection Error (${data.error.code}). Please use WhatsApp.` } 
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

// --- KEEP THESE TO PREVENT BUILD ERRORS ---
export const getVertexAI = () => null;
export const initializeVertexAI = () => null;
export const getVertexAIClient = () => null;
export default {};
