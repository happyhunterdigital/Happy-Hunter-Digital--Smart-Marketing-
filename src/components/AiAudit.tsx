import React, { useState, useRef } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, Download, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { db, hunterModel, PLACES_KEY } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const formatText = (text: string) => {
    const clean = text.replace(/\*/g, '');
    const keywords = ["Entity", "Protocol", "Scan", "Handshake", "AI Visibility", "Visibility Score", "Vulnerability", "Revenue", "Authority"];
    let html = clean;
    keywords.forEach(word => {
      const reg = new RegExp(`(${word})`, "gi");
      html = html.replace(reg, '<span class="text-yellow-500 font-bold">$1</span>');
    });
    return html;
  };

  const getForensicData = async () => {
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "X-Goog-Api-Key": PLACES_KEY, 
          "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" 
        },
        body: JSON.stringify({ textQuery: `${form.biz} in ${form.loc}` })
      });
      const data = await res.json();
      const biz = data.places?.[0];
      return biz ? `Verified: ${biz.displayName.text}, ${biz.rating} stars, ${biz.userRatingCount} reviews.` : "Status: GHOST (No Maps data found).";
    } catch (e) { return "Status: Connection Latency."; }
  };

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mapsData = await getForensicData();
      const prompt = `You are Hunter AI. Perform a Forensic Audit for ${form.biz} in ${form.loc}. DATA: ${mapsData}. EXPOSE gaps. NO ASTERISKS. End with FINAL_SCORE: [number].`;
      
      const result = await hunterModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const scoreMatch = text.match(/FINAL_SCORE:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      const cleanText = text.replace(/FINAL_SCORE:\s*\d+/, '');

      setVerdict({ score, text: cleanText });
      setStep(3);

      await addDoc(collection(db, 'leads'), { ...form, score, timestamp: serverTimestamp() });
    } catch (err) { alert("Handshake Failed. AI Core Offline."); }
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: '#050505', scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(img, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`HH_Audit_${form.biz}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 bg-gray-900/50 p-10 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl animate-fade-in">
          <h2 className="text-3xl font-black text-white uppercase text-center tracking-tighter">Smart Marketing <span className="text-yellow-500">Scan</span></h2>
          <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={form.biz} onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="City" value={form.loc} onChange={e => setForm({...form, loc: e.target.value})} required />
          <button type="submit" className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all">Analyze Architecture <ArrowRight size={20}/></button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={runAnalysis} className="space-y-6 bg-gray-900/50 p-10 rounded-[2.5rem] border border-yellow-500/30 backdrop-blur-xl animate-fade-in">
          <div className="text-center space-y-2 mb-8">
            <ShieldCheck className="mx-auto text-yellow-500" size={40}/>
            <h2 className="text-2xl font-black text-white uppercase">Secure Your Results</h2>
            <p className="text-gray-400 text-sm font-medium">Where should we send your forensic report?</p>
          </div>
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="Email Address" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="WhatsApp Number" type="tel" onChange={e => setForm({...form, wa: e.target.value})} required />
          <button disabled={loading} className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20}/>} Reveal Intelligence
          </button>
        </form>
      )}

      {step === 3 && verdict && (
        <div className="space-y-6 animate-fade-in">
          <div ref={reportRef} className="p-10 bg-black border border-gray-800 rounded-[2.5rem] shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-8 mb-8">
              <div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Diagnostic Score</h3>
                <span className="text-7xl font-black text-yellow-500 leading-none">{verdict.score}</span>
              </div>
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-16 h-16 rounded-full border border-yellow-500/20" alt="Logo"/>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-6 text-sm" dangerouslySetInnerHTML={{ __html: formatText(verdict.text) }} />
          </div>
          <div className="grid grid-cols-2 gap-4 pb-20">
            <button onClick={downloadPDF} className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 text-white rounded-2xl font-bold uppercase text-xs hover:bg-white hover:text-black transition-all">
              <Download size={16}/> Vector PDF
            </button>
            <a href={`https://wa.me/27601016673?text=Hunter,%20I%20just%20scored%20a%20${verdict.score}%20on%20my%20scan.%20I%20need%20to%20fix%20my%20architecture.`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-yellow-500 text-black rounded-2xl font-black uppercase text-xs shadow-xl transition-all">
              <MessageSquare size={16}/> Retargeting
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
