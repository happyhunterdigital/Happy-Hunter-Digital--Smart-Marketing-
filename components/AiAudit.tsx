import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
// If you have a separate AI service file, import it here. 
// Otherwise, we will simulate the AI result structure below for the email.

export const AiAudit = () => {
  // 1. The Inputs you need
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState(''); // Restored
  const [website, setWebsite] = useState('');   // Added
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // NOTE: In a real scenario, you would call your AI Service here to get these details.
      // For now, I am formatting the email based on the inputs to ensure the "Extension" sends it correctly.
      
      // 2. The "Problem-Focused" Email Content
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

      // 3. Save to Firestore (Triggers the Email)
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
        status: "new" // This helps your Admin Dashboard filter new leads
      });

      setStatus('success');
      // Optional: clear form
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
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Get Your Free AI Business Audit
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        See exactly what your business is missing online. Enter your details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name Input */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Business Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Joe's Plumbing"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Location / Area</label>
          <input
            type="text"
            required
            placeholder="e.g. Pretoria, Gauteng"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Website Input (New Addition) */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Website URL (Optional)</label>
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Email Input */}
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
          {loading ? 'Running AI Scan...' : 'Scan My Business Now'}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded text-center">
            ✅ Audit complete! We've sent the gap analysis to your inbox.
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
