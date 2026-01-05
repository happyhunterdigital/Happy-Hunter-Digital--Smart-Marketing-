// happy-hunter-digital/firebaseShim.ts
// SELF-HEALING AI: Finds the correct model automatically.

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // 1. SECURITY: Use the environment variable first.
        // If VITE_API_KEY is not set in GitHub Secrets yet, it falls back to the key you provided.
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

        try {
          // --- STEP 1: AUTO-DETECT MODEL ---
          // Ask Google: "Which models does this key have access to?"
          let selectedModel = "models/gemini-1.5-flash"; // Default assumption
          
          try {
            const modelsReq = await fetch(`${BASE_URL}/models?key=${API_KEY}`);
            const modelsData = await modelsReq.json();
            
            if (modelsData.models) {
              // Find the first model that works
              const validModel = modelsData.models.find((m: any) => 
                m.name.includes("gemini") && 
                m.supportedGenerationMethods?.includes("generateContent")
              );
              if (validModel) {
                selectedModel = validModel.name;
                console.log("Auto-detected Best Model:", selectedModel);
              }
            }
          } catch (e) {
            console.warn("Model detection failed, using fallback.");
          }

          // --- STEP 2: SEND MESSAGE ---
          const response = await fetch(
            `${BASE_URL}/${selectedModel}:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ 
                  parts: [{ 
                    // SYSTEM PROMPT
                    text: `You are Hunter AI, the assistant for Happy Hunter Digital.
IDENTITY: Professional, confident, expert in "Digital Entity Management".
GOAL: Help businesses get noticed on Google.
IMPORTANT: If asked for prices or audits, ALWAYS direct them to: https://calendly.com/motsumitl/30min
USER SAYS: ${userMessage}` 
                  }] 
                }]
              })
            }
          );
          
          const data = await response.json();
          
          // --- STEP 3: HANDLE ERRORS ---
          if (data.error) {
            console.error("Google API Error:", data.error);
            return { 
              response: { 
                text: () => `System Error (${data.error.code}): ${data.error.message}. Please use WhatsApp!` 
              } 
            };
          }
          
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm thinking, but got no response. Try asking again!";
          
          return { 
            response: { text: () => aiText } 
          };
          
        } catch (error: any) {
          console.error("Network Error:", error);
          return { 
            response: { 
              text: () => "I am currently offline. Please click the green WhatsApp button to chat with our team!" 
            } 
          };
        }
      }
    })
  };
};

// --- BUILD SHIMS (DO NOT REMOVE) ---
export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;
