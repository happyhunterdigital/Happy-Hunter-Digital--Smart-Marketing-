import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// CRITICAL: This "export const" is what App.tsx is looking for
export const AiAudit = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // 1. Define the Problem-Focused Email Content with Calendly Link
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Your Website Audit Results</h2>
          <p>Hi there,</p>
          <p>We've completed the preliminary scan of your digital presence. Based on our analysis, we identified several critical gaps that are likely costing you customers right now:</p>
          
          <div style="background-color: #f8d7da; border-left: 5px solid #dc3545; padding: 15px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">⚠️ Critical Missed Opportunities:</h3>
            <ul>
              <li><strong>SEO Visibility:</strong> Your site is missing key metadata, making it invisible to high-intent Google searchers.</li>
              <li><strong>Conversion Speed:</strong> Page load times are higher than industry standard, leading to a 20%+ bounce rate.</li>
              <li><strong>Trust Signals:</strong> Lack of immediate social proof or clear call-to-action sequences above the fold.</li>
            </ul>
          </div>

          <p>These issues are fixable, but they require a specific strategy tailored to your business model.</p>
          
          <p><strong>I have the solutions ready, but I want to walk you through them personally to ensure they fit your goals.</strong></p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/motsumitl/30min" 
               style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">
               👉 Click Here to Unlock Your Solution (Discovery Call)
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

          <p>Warm regards,</p>
          <p><strong>Motsumi</strong><br>
          Happy Hunter Digital<br>
          <a href="https://happyhunterdigital.com" style="color: #007bff;">www.happyhunterdigital.com</a>
          </p>
          
          <p style="font-size: 12px; color: #888; margin-top: 20px;">
            Contact: happyhunterdigital@gmail.com
          </p>
        </div>
      `;

      // 2. Save to Firestore (Triggering the Email Extension)
      await addDoc(collection(db, "mail"), {
        to: email,
        message: {
          subject: "⚠️ Urgent: We found gaps in your digital strategy",
          html: emailHtml,
        },
        date: new Date(),
        website: url,
        status: "new"
      });

      setStatus('success');
      setUrl('');
      setEmail('');
    } catch (error) {
      console.error("Error submitting audit:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Get Your Free AI Website Audit
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Enter your website URL and email to receive a detailed breakdown of your digital presence gaps.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Website URL</label>
          <input
            type="url"
            required
            placeholder="https://example.com"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-4 rounded transition duration-300 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Scan My Website Now'}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded text-center">
            ✅ Audit requested! Check your inbox for the report.
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded text-center">
            ❌ Something went wrong. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};
