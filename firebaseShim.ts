// Minimal shim to satisfy the bundler
// This trick prevents the build from crashing on the "missing ./vertexai" error.

export default {};

export const initializeVertexAI = () => null;

export const getVertexAI = () => null;

export const getVertexAIClient = () => null;

// --- THIS WAS MISSING ---
export const getGenerativeModel = () => {
  // Return a safe dummy object so the build doesn't crash
  return {
    startChat: () => ({
      sendMessage: async () => ({ response: { text: () => "AI Offline" } })
    })
  };
};
