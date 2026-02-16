import { useState, useRef, useEffect } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; // Import new caller
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Download, Globe, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import emailjs from '@emailjs/browser';

// ... (Keep your existing imports and interfaces)

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [result, setResult] = useState<any[]>([]); // Array for sections
  const [score, setScore] = useState("0");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  // ... (Keep useEffect for EmailJS)

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Querying Smart Marketing Graph...");
    
    // 1. CONSTRUCT THE PROMPT
    const prompt = `
      Perform a strategic marketing audit for "${formData.bizName}" in "${formData.location}".
      Role: Hunter AI. 
      Output: STRICT JSON format only.
      Schema:
      {
        "score": (integer 0-100),
        "analysis": [
          { "heading": "Title", "content": "Analysis text...", "requirement": "Actionable fix" },
          { "heading": "Title", "content": "Analysis text...", "requirement": "Actionable fix" },
          { "heading": "Title", "content": "Analysis text...", "requirement": "Actionable fix" }
        ]
      }
    `;

    try {
      // 2. CALL AI (With JSON Mode = true)
      const rawResponse = await callHunterAI(prompt, true);
      
      // 3. PARSE RESPONSE
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.warn("JSON Parse Failed, attempting cleanup...", rawResponse);
        // Fallback cleanup if model adds markdown
        const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanJson);
      }

      // 4. UPDATE UI
      setScore(data.score || "0");
      setResult(data.analysis || []);
      
      // 5. SAVE TO FIREBASE (Optional)
      if (db && data.score) {
        addDoc(collection(db, "audits"), {
          ...formData,
          score: data.score,
          analysis: data.analysis,
          timestamp: serverTimestamp()
        }).catch(err => console.log("Offline mode: Audit not saved to DB"));
      }

      setStep(3);

    } catch (err) {
      console.error("AUDIT FATAL ERROR:", err);
      alert("Hunter AI Signal Lost. Please check your internet connection and try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your renderFormattedText, downloadPDF, and return JSX)
  // Ensure you update the Step 3 JSX to map through 'result' as an array:
  /* {result.map((item, i) => (
       <div key={i}>
         <h4>{item.heading}</h4>
         <p>{item.content}</p>
         <div>Requirement: {item.requirement}</div>
       </div>
    ))}
  */
}
