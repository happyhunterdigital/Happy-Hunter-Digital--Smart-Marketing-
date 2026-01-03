import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const AiAudit = () => {
  // 1. The Inputs
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // 2. The "Problem-Focused" Email Content
      // (This remains the same logic as before, sending the analysis)
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Audit Report: ${businessName}</h2>
          <p>Hi there,</p>
          <p>We have completed the preliminary digital footprint analysis for <strong>${businessName}</strong> in <strong>${location}</strong>.</p>
          
          <p>Our AI systems scanned your local presence and website (${website || 'N/A'}), and we detected several critical gaps that are likely costing you customers:</p>
          
          <div style="background-color: #f8d7da; border-left: 5px solid #dc3545; padding: 15px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">⚠️ Critical Missed Opportunities:</h3>
            <ul>
              <li><strong>Local Visibility Gap:</strong> Competitors in ${location} are ranking for keywords you are currently missing.</li>
              <li><strong>Trust Signals:</strong> Your digital profile lacks the immediate "social proof" triggers that high-intent buyers look for.</li>
              <li><strong>Conversion Friction:</strong> There are specific bottlenecks in your customer journey preventing lookers from becoming bookers.</li>
            </ul>
          </div>

          <p>These issues are fixable, but they require a specific strategy tailored to your business model.</p>
          
          <p><strong>I have the complete solution ready, but I want to walk you through it personally to ensure it fits your goals.</strong></p>

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

      // 3. Save to Firestore
      await addDoc(collection(db, "mail"), {
        to: email,
        message: {
          subject: `⚠️ Audit Results for ${businessName}: Critical Gaps Found`,
          html: emailHtml,
        },
        date: new Date(),
        businessName: businessName,
        location: location,
        website: website,
        status: "new"
      });

      setStatus('success');
      setBusinessName('');
      setLocation('');
      setWebsite('');
      setEmail('');

    } catch (error) {
      console.error("Error submitting audit:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto my-10 relative overflow-hidden">
      {/* Decorative Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Get Your Free AI Business Audit
      </h2>
      <p className="text-gray-400 mb-8 text-center">
        See exactly what <strong>{businessName || 'your business'}</strong> is missing online.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Business Name Input */}
        <div>
          <label className="block text-yellow-500 font-bold mb-2 text-sm uppercase tracking-wide">Business Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Joe's Plumbing"
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 transition-all"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-yellow-500 font-bold mb-2 text-sm uppercase tracking-wide">Location / Area</label>
          <input
            type="text"
            required
            placeholder="e.g. Pretoria, Gauteng"
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Website Input (TRULY OPTIONAL NOW) */}
        <div>
          <label className="block text-gray-400 font-bold mb-2 text-sm uppercase tracking-wide">
            Website URL <span className="text-gray-600 normal-case">(Optional - leave blank if none)</span>
          </label>
          <input
            type="text" 
            /* Changed from type="url" to type="text" to prevent browser validation errors on empty fields */
            placeholder="happyhunterdigital.com"
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 transition-all"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-yellow-500 font-bold mb-2 text-sm uppercase tracking-wide">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-4 rounded-lg text-lg shadow-lg transform hover:-translate-y-1 transition duration-300 ${
            loading 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:shadow-yellow-500/50'
          }`}
        >
          {loading ? 'Running AI Scan...' : '🚀 Scan My Business Now'}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-center animate-fade-in">
            ✅ <strong>Audit Sent!</strong> Check your inbox for the gap analysis.
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-center animate-fade-in">
            ❌ Something went wrong. Please check your connection and try again.
          </div>
        )}
      </form>
    </div>
  );
};
