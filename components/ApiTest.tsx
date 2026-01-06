import React, { useState } from 'react';

export const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Test 1: Check if we can reach Google's servers at all
  const testConnection = async () => {
    setLoading(true);
    setResult('🔍 Testing basic connectivity...\n');

    try {
      // Simple ping to see if Google's API is reachable
      const response = await fetch('https://generativelanguage.googleapis.com/', {
        mode: 'no-cors' // This bypasses CORS for the connectivity test
      });
      
      setResult(prev => prev + '✅ Google API servers are reachable\n\n');
      return true;
    } catch (error: any) {
      setResult(prev => prev + `❌ Cannot reach Google servers: ${error.message}\n`);
      setResult(prev => prev + '\nPossible causes:\n');
      setResult(prev => prev + '- Firewall blocking Google APIs\n');
      setResult(prev => prev + '- Network connectivity issue\n');
      setResult(prev => prev + '- ISP blocking external API calls\n\n');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Try the actual API call
  const testAPICall = async () => {
    setLoading(true);
    setResult('🔌 Testing Gemini API with your key...\n\n');

    const API_KEY = "AIzaSyCqCYLwHtmlJHVVkDckpr_S1o4QKgFyN-M";
    
    setResult(prev => prev + `Using API Key: ${API_KEY.substring(0, 15)}...\n\n`);

    try {
      // Try v1 endpoint first (most compatible)
      setResult(prev => prev + '📡 Attempting v1/gemini-pro...\n');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Say "Hello, I am working!" in one sentence.' }]
            }]
          })
        }
      );

      setResult(prev => prev + `Response Status: ${response.status}\n`);
      setResult(prev => prev + `Response OK: ${response.ok}\n\n`);

      const data = await response.json();
      
      if (data.error) {
        setResult(prev => prev + `❌ API ERROR:\n`);
        setResult(prev => prev + `Code: ${data.error.code}\n`);
        setResult(prev => prev + `Message: ${data.error.message}\n\n`);
        
        // Provide specific guidance based on error
        if (data.error.code === 403) {
          setResult(prev => prev + '🔧 FIX: Your API key needs to enable the Gemini API\n');
          setResult(prev => prev + '1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n');
          setResult(prev => prev + '2. Click "Enable"\n');
          setResult(prev => prev + '3. Wait 2-3 minutes and try again\n');
        } else if (data.error.code === 404) {
          setResult(prev => prev + '🔧 FIX: Model name or endpoint is wrong\n');
          setResult(prev => prev + 'We will try a different model...\n');
        }
      } else {
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setResult(prev => prev + `✅ SUCCESS!\n\n`);
        setResult(prev => prev + `AI Response: "${aiText}"\n\n`);
        setResult(prev => prev + `🎉 Your chatbot should work now!\n`);
      }

    } catch (error: any) {
      setResult(prev => prev + `💥 FETCH ERROR: ${error.message}\n\n`);
      
      if (error.message.includes('Failed to fetch')) {
        setResult(prev => prev + '🔧 DIAGNOSIS: Network/CORS Issue\n\n');
        setResult(prev => prev + 'Possible causes:\n');
        setResult(prev => prev + '1. Browser blocking the request (try in Incognito mode)\n');
        setResult(prev => prev + '2. Ad blocker or security extension interfering\n');
        setResult(prev => prev + '3. Network firewall/proxy blocking Google APIs\n');
        setResult(prev => prev + '4. ISP restrictions (some ISPs block certain APIs)\n\n');
        setResult(prev => prev + 'WORKAROUND: Use a backend proxy or deploy to production\n');
      }
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Check if CORS is the issue
  const testCORS = async () => {
    setLoading(true);
    setResult('🌐 Testing CORS policy...\n\n');

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/');
      setResult(prev => prev + `✅ CORS: Server responded with status ${response.status}\n`);
      setResult(prev => prev + 'CORS is NOT the issue\n');
    } catch (error: any) {
      if (error.message.includes('CORS')) {
        setResult(prev => prev + '❌ CORS Error detected\n\n');
        setResult(prev => prev + '🔧 FIX: Google APIs should not have CORS issues\n');
        setResult(prev => prev + 'This might be a browser extension or network policy\n');
      } else {
        setResult(prev => prev + `⚠️ Error: ${error.message}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  const runFullDiagnostic = async () => {
    setResult('🚀 Running Full Diagnostic Suite...\n\n');
    
    const canConnect = await testConnection();
    if (!canConnect) {
      setResult(prev => prev + '\n⚠️ Cannot proceed - basic connectivity failed\n');
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testAPICall();
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-white p-6 rounded-lg shadow-2xl border-2 border-blue-500 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">🔧 Gemini API Diagnostic Center</h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <button 
          onClick={runFullDiagnostic}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : '🚀 Full Diagnostic'}
        </button>
        
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          Test Connection
        </button>

        <button 
          onClick={testAPICall}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
          Test API Call
        </button>

        <button 
          onClick={testCORS}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-400"
        >
          Test CORS
        </button>

        <button 
          onClick={() => setResult('')}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-500"
        >
          Clear
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs whitespace-pre-wrap max-h-96 overflow-auto">
        {result || 'Click "Full Diagnostic" to start testing...'}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <p className="font-bold mb-2">Quick Fixes to Try:</p>
        <ul className="list-disc ml-4 space-y-1 text-gray-700">
          <li>Disable browser extensions (especially ad blockers)</li>
          <li>Try in Incognito/Private mode</li>
          <li>Check if you're behind a corporate firewall</li>
          <li>Verify API key is enabled for Gemini at: console.cloud.google.com</li>
        </ul>
      </div>
    </div>
  );
};
