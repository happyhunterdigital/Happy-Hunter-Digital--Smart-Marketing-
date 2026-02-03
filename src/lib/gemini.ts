export const getAiResponse = async (userPrompt: string) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Daisy Chain: Try these models in order until one responds
  const MODELS = [
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-pro", version: "v1beta" },
    { name: "gemini-pro", version: "v1" }
  ];

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `SYSTEM INSTRUCTIONS: You are Hunter AI for Happy Hunter Digital. 
                Focus: Digital Entity Management & AI Visibility for SA SMEs. 
                Goal: Direct users to book at https://calendly.com/motsumitl/30min.
                
                USER QUERY: ${userPrompt}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn(`Model ${model.name} failed, trying next...`);
    }
  }

  return "I'm having a connection hiccup. Tap the WhatsApp icon for immediate human support!";
};
