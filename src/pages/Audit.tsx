import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Loader2, 
  Download, 
  Building2, 
  MapPin, 
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  bizName: string;
  location: string;
  fullName: string;
  email: string;
  whatsapp: string;
}

export default function Audit() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState<string>("??");
  const [error, setError] = useState<string | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({ 
    bizName: "", 
    location: "", 
    fullName: "", 
    email: "", 
    whatsapp: "" 
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep(2);
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingText("Connecting to Google Maps...");
    
    try {
      console.log("[Audit] Starting audit process...");
      
      const aiResponse = await performAuditAnalysis(
        formData.bizName, 
        formData.location
      );
      
      console.log("[Audit] AI Response received, length:", aiResponse.length);
      
      // Extract score
      const scoreMatch = aiResponse.match(/FINAL_SCORE:\s*(\d+)/);
      const extractedScore = scoreMatch ? scoreMatch[1] : "??";
      
      setScore(extractedScore);
      setResult(aiResponse.replace(/FINAL_SCORE:\s*\d+/, '').trim());

      // Save to Firebase if we have a valid score
      if (db && extractedScore !== "??") {
        try {
          await addDoc(collection(db, "leads"), { 
            ...formData, 
            analysis: aiResponse, 
            timestamp: serverTimestamp(), 
            score: extractedScore 
          });
          console.log("[Audit] Saved to Firebase");
        } catch (fbErr) {
          console.error("[Audit] Firebase save failed:", fbErr);
          // Don't fail the audit if Firebase save fails
        }
      }
      
      setStep(3);
      
    } catch (err: any) {
      console.error("[Audit] Error:", err);
      setError(err.message || "Audit failed. Please try again.");
      setResult(`SYSTEM ERROR: ${err.message}`);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        backgroundColor: '#020617',
        logging: false
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Strategic-Audit-${formData.bizName.replace(/\s+/g, '-')}.pdf`);
      
    } catch (err) {
      console.error("[Audit] PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderAnalysisText = (text: string) => {
    if (!text) return <p className="text-slate-400">No analysis available.</p>;

    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return null;
      
      if (trimmedLine.includes('[SECTION]')) {
        return (
          <h4 
            key={index} 
            className="text-yellow-500 font-black text-xl md:text-2xl uppercase mt-10 mb-4 border-b-2 border-yellow-500/20 pb-2"
          >
            {trimmedLine.replace('[SECTION]', '').trim()}
          </h4>
        );
      }
      
      if (trimmedLine.includes('[FIX]')) {
        return (
          <div 
            key={index} 
            className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-6 text-white font-bold shadow-lg"
          >
            <span className="text-yellow-500 uppercase text-sm tracking-wider">Action Required:</span>
            <p className="mt-1">{trimmedLine.replace('[FIX]', '').
