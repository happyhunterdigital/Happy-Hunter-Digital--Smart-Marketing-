// happy-hunter-digital/firebaseConfig.ts
// We're using the direct Gemini API via our shim, so we don't need the heavy Firebase SDK

// Import only from our shim
import { getGenerativeModel } from './firebaseShim';

// Export the model for your chatbot
export const model = getGenerativeModel();

// Export null versions for unused services to prevent import errors in other files
export const db = null;
export const auth = null;
