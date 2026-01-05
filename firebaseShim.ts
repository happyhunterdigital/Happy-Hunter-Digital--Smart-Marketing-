// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // 1. API KEY SETUP
        // Checks your environment variables first, falls back to the hardcoded key if needed.
        // NOTE: Ensure this key is valid and has Gemini API access enabled.
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 
                        import.meta.env.VITE_API_KEY || 
                        "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; 
        
        try {
          // 2. THE SMART REQUEST (Using v1 stable endpoint)
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ 
                  parts: [{ 
                    // 3. THE SYSTEM PROMPT (Injecting Intelligence)
                    text: `You are 'Hunter AI', the intelligent digital assistant for Happy Hunter Digital, a South African digital marketing agency.
                    
YOUR IDENTITY:
- Professional, confident, and strategic.
- Expert in "Digital Entity Management" and helping businesses get noticed by AI search engines.

YOUR KNOWLEDGE BASE:
1. THE PROBLEM: The "Ghost Effect" - Businesses exist but are invisible to AI-powered search.
2. OUR SOLUTION: "Digital Entity Management" built on 3 pillars:
   - Pillar 1: The Trust Anchor (Google Business Profile Optimization)
   - Pillar 2: The AI Megaphone (Getting cited by smart search assistants)
   - Pillar 3: The Conversion Brain (24/7 AI-powered customer engagement)
3. PROOF:
   - Case Study: Profuse Beauty (310% call increase)
   - Case Study: Construction Firm (R2.5M contract via Trust Architecture)

YOUR INSTRUCTIONS:
- Keep answers concise (2-3 sentences max unless asked for detail).
- Be friendly but professional.
- If asked about pricing or audits, suggest booking a call: https://calendly.com/motsumitl/30min
- Focus on helping businesses understand why AI visibility matters.

USER QUESTION: ${userMessage}` 
                  }] 
                }]
              })
            }
          );
          
          const data = await response.json();
          
          // 4. ERROR HANDLING
          if (data.error) {
            console.error("Google API Error:", data.error);
            return { 
              response: { 
                text: () => `I'm having trouble connecting right now. Please book a call directly: https://calendly.com/motsumitl/30min or use WhatsApp! 💬` 
              } 
            };
          }
          
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm here to help! Try asking about our Digital Entity Management services or book a call: https://calendly.com/motsumitl/30min";
          
          return { 
            response: { text: () => aiText } 
          };
          
        } catch (error: any) {
          console.error("Chat fetch error:", error);
          return { 
            response: { 
              text: () => "I'm currently offline 😔. Book a call at https://calendly.com/motsumitl/30min or use the WhatsApp button!" 
            } 
          };
        }
      }
    })
  };
};

// --- MINIMAL SHIMS TO SATISFY THE BUNDLER ---
// These empty functions prevent the build from crashing
export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;
