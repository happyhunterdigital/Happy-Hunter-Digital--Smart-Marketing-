// happy-hunter-digital/firebaseShim.ts
// DIRECT CONNECTION TO GOOGLE GEMINI (Bypassing Firebase SDK)

export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        // YOUR API KEY
        const API_KEY = "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        try {
          // Send message directly to Google REST API
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
          
          // Extract the answer
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having a little trouble connecting. Please try again or use WhatsApp!";

          return { 
            response: { 
              text: () => aiText 
            } 
          };

        } catch (error) {
          console.error("AI Error:", error);
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
