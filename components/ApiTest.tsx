import React, { useState } from 'react';

// Quick API Test Component - Uses VITE_API_KEY
export const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');

    // 1. SECURITY: Check for the Environment Variable first
    // If not found (e.g., local dev without .env), use the fallback key you provided.
    const API_KEY = import.meta.env.VITE_API_KEY || "AIzaSyAfVpx7lJKmmngbeu54Br5avFYvjrpiqc8";
    
    try {
      console.log('🔍 Testing Gemini API...');
      // Show only the first few chars for security in the logs
      console.log('API Key in use:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'UNDEFINED');
      
      // 2. TEST CALL: We use the v1 stable endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Say 'Hello, I am ready to work!' in one sentence." }]
            }]
          })
        }
      );

      console.log('📡 Response Status:', response.status);
      const data = await response.json();
      console.log('📦 Full Response:', data);

      if (data.error) {
        setResult(`❌ ERROR: ${data.error.message}\n\nFull error: ${JSON.stringify(data.error, null, 2)}`);
      } else if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        setResult(`✅ SUCCESS!\n\nAPI Response: "${text}"\n\nFull data: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`⚠️ UNEXPECTED RESPONSE:\n\n${JSON.stringify(data, null, 2)}`);
      }

    } catch (error: any) {
      console.error('💥 Fetch Error:', error);
      setResult(`💥 FETCH ERROR: ${error.message}\n\nThis might be a CORS issue or network problem.\n\nError details: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testCORS = async () => {
    setLoading(true);
    setResult('Testing CORS...');

    try {
      console.log('🌐 Testing if Google API is reachable...');
      const response = await fetch('https://generativelanguage.googleapis.com/');
      setResult(`CORS Test: ${response.status === 404 ? '✅ Server is reachable (404 is expected)' : `Status: ${response.status}`}`);
    } catch (error: any) {
      console.error('CORS Error:', error);
      setResult(`❌ CORS Error: ${error.message}\n\nThe Google API might be blocked by your browser or network.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-white p-6 rounded-lg shadow-2xl border-2 border-yellow-400 max-w-2xl font-sans text-gray-800">
      <h2 className="text-xl font-bold mb-4">🔧 Gemini API Test Console</h2>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold"
        >
          {loading ? 'Testing...' : 'Test API Call'}
        </button>
        
        <button 
          onClick={testCORS}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 font-bold"
        >
          Test CORS
        </button>

        <button 
          onClick={() => setResult('')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs whitespace-pre-wrap max-h-96 overflow-auto border border-gray-700">
        {result || 'Click "Test API Call" to check if Gemini API is working...'}
      </div>
    </div>
  );
};
