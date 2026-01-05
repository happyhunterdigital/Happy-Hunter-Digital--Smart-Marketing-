import React, { useState } from 'react';

export const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('🔍 Scanning for valid models...');

    // 1. Get the Key
    const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8";
    
    // We switch to 'v1beta' because it lists MORE models than v1
    const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

    try {
      // --- STEP 1: FIND A WORKING MODEL ---
      console.log("Fetching model list...");
      const modelsReq = await fetch(`${BASE_URL}/models?key=${API_KEY}`);
      const modelsData = await modelsReq.json();

      if (modelsData.error) {
        throw new Error(`ListModels Failed: ${modelsData.error.message}`);
      }

      // Filter for models that can actually chat (generateContent)
      const validModel = modelsData.models?.find((m: any) => 
        m.name.includes("gemini") && 
        m.supportedGenerationMethods?.includes("generateContent")
      );

      if (!validModel) {
        throw new Error("No Gemini models found for this API key!");
      }

      const modelName = validModel.name; // e.g., "models/gemini-1.5-flash"
      setResult(`✅ FOUND MODEL: ${modelName}\n\nTesting chat...`);

      // --- STEP 2: TEST THAT MODEL ---
      const chatReq = await fetch(
        `https://generativelanguage.googleapis.com/${BASE_URL}/${modelName}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello! confirm you are working." }] }]
          })
        }
      );

      const chatData = await chatReq.json();

      if (chatData.error) {
        setResult(`❌ MODEL FOUND (${modelName}) BUT FAILED:\n${chatData.error.message}`);
      } else {
        const reply = chatData.candidates?.[0]?.content?.parts?.[0]?.text;
        setResult(`🎉 SUCCESS!\n\nModel Used: ${modelName}\nReply: "${reply}"`);
      }

    } catch (error: any) {
      console.error(error);
      setResult(`💥 CRITICAL FAILURE: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-white p-6 rounded-lg shadow-2xl border-2 border-blue-500 max-w-2xl font-sans text-gray-800">
      <h2 className="text-xl font-bold mb-4">🔧 Auto-Healing API Test</h2>
      <button 
        onClick={testAPI} 
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 w-full"
      >
        {loading ? 'Scanning Google Servers...' : 'FIND & TEST MODEL'}
      </button>
      <div className="bg-gray-900 text-green-400 p-4 rounded mt-4 font-mono text-xs whitespace-pre-wrap h-64 overflow-auto">
        {result || 'Click the button to scan for a working model...'}
      </div>
    </div>
  );
};
