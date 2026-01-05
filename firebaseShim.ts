export default {};
export const initializeVertexAI = () => null;
export const getVertexAI = () => null;
export const getVertexAIClient = () => null;

export const getGenerativeModel = () => {
  return {
    startChat: () => ({
      sendMessage: async () => ({ 
        response: { 
          // --- 4. BETTER FALLBACK MESSAGE ---
          text: () => "I can definitely help with that! To give you the most accurate audit, please click the green WhatsApp button below to share your business name with our team instantly." 
        } 
      })
    })
  };
};
