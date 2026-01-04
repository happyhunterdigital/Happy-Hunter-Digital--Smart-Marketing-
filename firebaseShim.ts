// Minimal shim to satisfy the bundler
// This trick prevents the build from crashing on the "missing ./vertexai" error.

export default {};

export const initializeVertexAI = () => {
  return null;
};

export const getVertexAIClient = () => {
  return null;
};

export const getVertexAI = () => {
    return null;
}
