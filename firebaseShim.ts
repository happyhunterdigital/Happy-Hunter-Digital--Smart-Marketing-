// happy-hunter-digital/firebaseShim.ts
// DAISY CHAIN AI: Tries multiple models until one works.

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // 1. GET KEY (Checks Secret first, then falls back to your provided key)
        const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8";
        
        // 2. DEFINE CANDIDATE MODELS (The Daisy Chain)
        // We try these in order. We toggle between v1beta and v1 to ensure we hit the right endpoint.
        const MODELS_TO_TRY = [
          { name: "gemini-1.5-flash", version: "v1beta" },
          { name: "gemini-1.5-pro", version: "v1beta" },
          { name: "gemini-1.0-pro", version: "v1beta" },
          { name: "gemini-pro", version: "v1" } // The old reliable fallback
        ];

        // 3. THE LOOP
        for (const model of MODELS_TO_TRY) {
          try {
            console.log(`🔌 Attempting to connect via: ${model.name} (${model.version})...`);
            
            const response = await fetch(
              `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ 
                    parts: [{ 
                      // SYSTEM PROMPT INTEGRATED INTO MESSAGE
                      // This ensures it works on all model versions (v1 and v1beta)
                      text: `SYSTEM INSTRUCTIONS:
You are Hunter AI, the assistant for Happy Hunter Digital.
IDENTITY: Professional, confident, expert in "Digital Entity Management".
GOAL: Help businesses get noticed on Google.
IMPORTANT: If asked for prices or audits, ALWAYS direct them to: https://calendly.com/motsumitl/30min

USER MESSAGE: ${userMessage}` 
                    }] 
                  }]
                })
              }
            );

            const data = await response.json();

            // IF ERROR: Log it and try the next model
            if (data.error) {
              console.warn(`❌ Model ${model.name} failed (${data.error.code}). Switching to next...`);
              continue; 
            }

            // IF SUCCESS: Extract answer and return immediately
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText) {
              console.log(`✅ Connected successfully to: ${model.name}`);
              return { response: { text: () => aiText } };
            }

          } catch (e) {
            console.warn(`⚠️ Network hiccup on ${model.name}. Moving on.`);
          }
        }

        // 4. FALLBACK (If all 4 models fail)
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
