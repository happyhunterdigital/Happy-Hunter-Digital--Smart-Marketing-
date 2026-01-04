// Minimal shim for firebase/vertexai to satisfy bundler resolution.
// This prevents the build from crashing when it tries to find the deep import.

export default {};

export const initializeVertexAI = () => {
  console.warn("Vertex AI shim used - this should only happen during build.");
  return null;
};

export const getVertexAIClient = () => {
  return null;
};
