// happy-hunter-digital/firebaseShim.ts

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async (userMessage: string) => {
        
        // CRITICAL FIX: Use the CORRECT API key from Google AI Studio
        // This is the key from project 765275067396 (the one that actually works)
        const API_KEY = import.meta.env.VITE_API_KEY || 
                       import.meta.env.VITE_GEMINI_API_KEY ||
                       "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8"; // ✅ CORRECT KEY
        
        try {
          // Use v1 endpoint with gemini-pro (most reliable)
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `You are Hunter AI, the assistant for Happy Hunter Digital, a South African digital marketing agency.

YOUR IDENTITY:
- Professional, confident, expert in "Digital Entity Management"
- Help businesses get noticed on Google and by AI search engines

YOUR KNOWLEDGE:
1. THE PROBLEM: The "Ghost Effect" - Businesses invisible to AI search
2. OUR SOLUTION: "Digital Entity Management" with 3 pillars:
   - Trust Anchor (Google Business Profile optimization)
   - AI Megaphone (Getting cited by smart assistants)
   - Conversion Brain (24/7 AI engagement)
3. PROOF:
   - Profuse Beauty: 310% call increase
   - Construction Firm: R2.5M contract

YOUR INSTRUCTIONS:
- Keep answers concise (2-3 sentences unless asked for detail)
- Be friendly but professional
- If asked about pricing or audits, suggest booking: https://calendly.com/motsumitl/30min
- Focus on helping businesses understand AI visibility

USER QUESTION: ${userMessage}`
                  }]
                }]
              })
            }
          );
          
          const data = await response.json();
          
          if (data.error) {
            console.error("Gemini API Error:", data.error);
            return { 
              response: { 
                text: () => `I'm having trouble connecting. Book a call: https://calendly.com/motsumitl/30min or use WhatsApp! 💬` 
              } 
            };
          }
          
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                        "I'm here to help! Ask about Digital Entity Management or book a call: https://calendly.com/motsumitl/30min";
          
          return { 
            response: { text: () => aiText } 
          };
          
        } catch (error: any) {
          console.error("Chat fetch error:", error);
          return { 
            response: { 
              text: () => "I'm currently offline 😔. Book a call: https://calendly.com/motsumitl/30min or use WhatsApp!" 
            } 
          };
        }
      }
    })
  };
};

// Shims for build compatibility
export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;
