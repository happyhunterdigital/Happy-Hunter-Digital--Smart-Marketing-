import React, { useState } from 'react';

export const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('🔍 Scanning for valid models...');

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
    const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

    try {
      // STEP 1: TEST PERMISSIONS
      const modelsReq = await fetch(`${BASE_URL}/models?key=${API_KEY}`);
      const modelsData = await modelsReq.json();

      if (modelsData.error) {
        throw new Error(`Google Error: ${modelsData.error.message}`);
      }

      // STEP 2: FIND GEMINI
      const validModel = modelsData.models?.find((m: any) => 
        m.name.includes("gemini") && m.supportedGenerationMethods?.includes("generateContent")
      );

      if (!validModel) {
        throw new Error("No Gemini models found for this API key!");
      }

      setResult(`✅ SUCCESS! \nModel Found: ${validModel.name} \nReady for Entity Ops.`);

    } catch (error: any) {
      setResult(`💥 CRITICAL FAILURE: \n${error.message} \n\nCheck if your API Key is restricted in Google Cloud Console.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-24 left-4 z-[100] bg-white p-6 rounded-lg shadow-2xl border-2 border-blue-500 max-w-sm font-sans text-gray-800">
      <h2 className="text-lg font-bold mb-2">🔧 API Debugger</h2>
      <button 
        onClick={testAPI} 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full"
      >
        {loading ? 'Testing...' : 'RUN DIAGNOSTIC'}
      </button>
      <pre className="bg-gray-100 p-2 mt-4 text-[10px] whitespace-pre-wrap overflow-auto max-h-40 border border-gray-300">
        {result || 'Waiting for scan...'}
      </pre>
    </div>
  );
};
