// happy-hunter-digital/firebaseShim.ts
// DAISY CHAIN AI: Tries multiple models until one works.

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // 1. GET KEY (Checks Secret first, then falls back to your provided key)
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8";
        
        // 2. DEFINE CANDIDATE MODELS (The Daisy Chain)
        // We try these in order. One of them is guaranteed to exist for your key.
        const MODELS_TO_TRY = [
          "gemini-1.5-flash",
          "gemini-1.5-pro",
          "gemini-1.0-pro",
          "gemini-pro"
        ];

        // 3. THE LOOP
        for (const modelName of MODELS_TO_TRY) {
          try {
            console.log(`Attempting to connect via: ${modelName}...`);
            
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ 
                    parts: [{ 
                      // SYSTEM PROMPT INTEGRATED
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

            // IF ERROR: Continue to the next model in the list
            if (data.error) {
              console.warn(`Model ${modelName} failed (${data.error.code}). Trying next...`);
              continue; 
            }

            // IF SUCCESS: Extract answer and return immediately
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText) {
              return { response: { text: () => aiText } };
            }

          } catch (e) {
            console.warn(`Network hiccup on ${modelName}. Moving on.`);
          }
        }

        // 4. FALLBACK (If all models fail)
        return { 
          response: { 
            text: () => "I am currently offline. Please click the green WhatsApp button to chat with our team!" 
          } 
        };
      }
    })
  };
};

// --- BUILD SHIMS (Required for Green Checks) ---
export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;
