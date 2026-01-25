import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. CLEANUP FUNCTION (Deletes old junk files) ---
const pathsToDelete = ['src', 'shims', 'services', 'pages', 'components', 'package.json', 'vite.config.ts', 'firebase.json', 'tailwind.config.js', 'tsconfig.json', 'vite-env.d.ts'];
pathsToDelete.forEach(p => {
    const fullPath = path.join(__dirname, p);
    if (fs.existsSync(fullPath)) fs.rmSync(fullPath, { recursive: true, force: true });
});

// --- 2. FILE CONTENT DEFINITIONS ---
const files = {
  // CONFIGURATION
  'package.json': `{
  "name": "happy-hunter-digital",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "tsc && vite build", "lint": "eslint . --ext ts,tsx" },
  "dependencies": { "@google/generative-ai": "^0.2.1", "firebase": "^10.8.0", "lucide-react": "^0.344.0", "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.22.1", "framer-motion": "^11.0.8", "clsx": "^2.1.0", "tailwind-merge": "^2.2.1" },
  "devDependencies": { "@tailwindcss/typography": "^0.5.10", "@types/react": "^18.2.56", "@types/react-dom": "^18.2.19", "@vitejs/plugin-react": "^4.2.1", "autoprefixer": "^10.4.17", "postcss": "^8.4.35", "tailwindcss": "^3.4.1", "typescript": "^5.2.2", "vite": "^5.1.4" }
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; export default defineConfig({ plugins: [react()], build: { commonjsOptions: { transformMixedEsModules: true } } });`,
  'tailwind.config.js': `import typography from '@tailwindcss/typography'; export default { content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] }, colors: { brand: { yellow: '#FACC15', dark: '#0F172A', gray: '#334155' } } } }, plugins: [typography] }`,
  'postcss.config.js': `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }`,
  'firebase.json': `{ "hosting": { "public": "dist", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"], "rewrites": [{ "source": "**", "destination": "/index.html" }] } }`,
  '.env': `VITE_API_KEY=PLACEHOLDER\nVITE_FIREBASE_API_KEY=PLACEHOLDER`,
  'index.html': `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Happy Hunter Digital</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,

  // SERVICES
  'src/firebaseConfig.ts': `import { initializeApp } from "firebase/app"; import { getFirestore } from "firebase/firestore"; import { getAuth } from "firebase/auth";
const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: "happy-hunter-digital.firebaseapp.com", projectId: "happy-hunter-digital", storageBucket: "happy-hunter-digital.appspot.com", messagingSenderId: "000000000", appId: "1:00000000:web:00000000" };
const app = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PLACEHOLDER") ? initializeApp(firebaseConfig) : undefined;
export const db = app ? getFirestore(app) : null; export const auth = app ? getAuth(app) : null;`,

  'src/services/geminiService.ts': `import { GoogleGenerativeAI } from "@google/generative-ai";
let genAI = null;
const getGenAI = () => { if (!genAI) { const API_KEY = import.meta.env.VITE_API_KEY; if (!API_KEY || API_KEY.includes("PLACEHOLDER")) return null; genAI = new GoogleGenerativeAI(API_KEY); } return genAI; };
export const performAudit = async (businessName, location) => {
  const ai = getGenAI(); if (!ai) return { score: 0, summary: "System Offline: Add API Key to .env", problems: [], solutions: [] };
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = \`Audit "\${businessName}" in "\${location}". Return STRICT JSON: { "score": number, "summary": "string", "problems": [{"title": "string", "desc": "string", "severity": "high"|"medium"}], "solutions": [{"title": "string", "desc": "string"}] }\`;
  try { const result = await model.generateContent(prompt); const text = result.response.text().replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim(); return JSON.parse(text); } catch (error) { console.error("Audit Protocol Failed:", error); return { score: 0, summary: "Audit Failed (Network Error)", problems: [], solutions: [] }; }
};
export const getChatSession = () => { const ai = getGenAI(); if (!ai) return null; const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); return model.startChat({ history: [{ role: "user", parts: [{ text: "You are Hunter AI. Be professional." }] }] }); };`,

  // UI COMPONENTS
  'src/index.css': `@tailwind base; @tailwind components; @tailwind utilities; @layer base { body { @apply bg-[#0F172A] text-slate-50 font-sans; } p { @apply text-slate-300; } h1, h2, h3, h4, h5, h6 { @apply text-white font-bold tracking-tight; } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`,
  'src/main.tsx': `import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App.tsx'; import './index.css'; ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);`,
  
  'src/components/ErrorBoundary.tsx': `import React, { Component } from "react"; import { AlertTriangle } from "lucide-react";
export class ErrorBoundary extends Component { state = { hasError: false }; static getDerivedStateFromError() { return { hasError: true }; } render() { if (this.state.hasError) { return ( <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4"> <div className="bg-[#1E293B] border border-red-900/50 rounded-2xl p-8 text-center max-w-md"> <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} /> <h1 className="text-xl font-bold text-red-500 mb-2">PROTOCOL INTERRUPTED</h1> <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">Reboot System</button> </div> </div> ); } return this.props.children; } }`,

  'src/components/Navbar.tsx': `import React from 'react'; import { Link } from 'react-router-dom'; import { Target } from 'lucide-react';
export const Navbar = () => ( <nav className="border-b border-gray-800 bg-[#0F172A]/90 backdrop-blur sticky top-0 z-50"> <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"> <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white"> <Target className="text-brand-yellow" /> HAPPY<span className="text-brand-yellow">HUNTER</span> </Link> <div className="flex gap-6 text-sm"> <Link to="/" className="hover:text-brand-yellow">Home</Link> <Link to="/earned-media" className="hover:text-brand-yellow">Earned Media</Link> <Link to="/admin" className="hover:text-brand-yellow">Admin</Link> </div> </div> </nav> );`,

  'src/components/Footer.tsx': `import React from 'react'; export const Footer = () => ( <footer className="bg-brand-dark border-t border-gray-800 py-8 text-center text-slate-500 text-sm"> <p>© 2025 Happy Hunter Digital. Military Grade Marketing.</p> </footer> );`,

  'src/components/AiAudit.tsx': `import React, { useState } from 'react'; import { performAudit } from '../services/geminiService'; import { db } from '../firebaseConfig'; import { collection, addDoc } from 'firebase/firestore'; import { Search, Loader2 } from 'lucide-react';
export const AiAudit = () => { const [businessName, setBusinessName] = useState(''); const [location, setLocation] = useState(''); const [loading, setLoading] = useState(false); const [result, setResult] = useState(null);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { const auditData = await performAudit(businessName, location); setResult(auditData); if (db) await addDoc(collection(db, 'leads'), { businessName, location, auditScore: auditData.score, timestamp: new Date() }); } catch (err) { console.error(err); } finally { setLoading(false); } };
  return ( <div className="max-w-xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl mt-8"> {!result ? ( <> <h2 className="text-2xl font-bold text-center mb-6 text-white">Free AI Audit</h2> <form onSubmit={handleSubmit} className="space-y-4"> <input className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business Name" required /> <input className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required /> <button disabled={loading} className="w-full bg-brand-yellow text-brand-dark font-bold py-4 rounded flex justify-center items-center gap-2"> {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />} {loading ? 'Scanning...' : 'Scan Now'} </button> </form> </> ) : ( <div className="text-center text-white"> <div className="text-4xl font-black mb-2">{result.score}/100</div> <p className="mb-4">{result.summary}</p> <button onClick={() => window.location.reload()} className="underline text-sm">Scan Again</button> </div> )} </div> ); };`,

  'src/components/Chatbot.tsx': `import React, { useState, useRef, useEffect } from 'react'; import { getChatSession } from '../services/geminiService'; import { Bot, X, Send } from 'lucide-react';
export const Chatbot = () => { const [isOpen, setIsOpen] = useState(false); const [messages, setMessages] = useState([]); const [input, setInput] = useState(""); const chatSession = useRef(null);
  useEffect(() => { if (isOpen && !chatSession.current) { chatSession.current = getChatSession(); setMessages([{ role: 'model', text: 'Hello! I am Hunter AI.' }]); } }, [isOpen]);
  const handleSend = async (e) => { e.preventDefault(); if (!input.trim() || !chatSession.current) return; const msg = input; setInput(""); setMessages(prev => [...prev, { role: 'user', text: msg }]); try { const result = await chatSession.current.sendMessage(msg); setMessages(prev => [...prev, { role: 'model', text: result.response.text() }]); } catch { setMessages(prev => [...prev, { role: 'model', text: 'Error.' }]); } };
  if (!isOpen) return <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-brand-yellow text-brand-dark p-4 rounded-full font-bold shadow-lg">Ask Hunter</button>;
  return ( <div className="fixed bottom-6 right-6 w-80 bg-slate-800 rounded-xl border border-slate-700 z-50 overflow-hidden"> <div className="bg-slate-900 p-3 flex justify-between items-center text-white"> <div className="font-bold flex gap-2"><Bot className="text-brand-yellow"/> Hunter</div> <button onClick={() => setIsOpen(false)} className="text-white"><X size={16}/></button> </div> <div className="h-64 overflow-y-auto p-4 space-y-2"> {messages.map((m, i) => <div key={i} className={\`p-2 rounded text-sm \${m.role === 'user' ? 'bg-slate-700 ml-auto text-white' : 'bg-slate-900 mr-auto text-slate-300'}\`}>{m.text}</div>)} </div> <form onSubmit={handleSend} className="p-2 border-t border-slate-700 flex gap-2"> <input className="flex-grow bg-slate-900 rounded px-2 text-white" value={input} onChange={e=>setInput(e.target.value)} /> <button type="submit"><Send className="text-brand-yellow"/></button> </form> </div> ); };`,

  // PAGES
  'src/pages/Home.tsx': `import React from 'react'; import { AiAudit } from '../components/AiAudit';
export const HomePage = () => ( <div className="animate-fade-in"> <section className="pt-32 pb-20 px-4 text-center"> <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter"> Stop Guessing. <br /> <span className="text-brand-yellow">Start Winning.</span> </h1> <p className="text-xl max-w-2xl mx-auto mb-12 text-slate-300">We help South African businesses survive the Great AI Filter.</p> <AiAudit /> </section> </div> );`,

  'src/pages/EarnedMedia.tsx': `import React from 'react';
export const EarnedMedia = () => ( <div className="pt-20 px-4 max-w-4xl mx-auto text-white"> <h1 className="text-4xl font-bold mb-8">Earned Media</h1> <div className="space-y-8"> <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"> <h2 className="text-2xl text-brand-yellow mb-2">Why Traditional SEO is Dead</h2> <p>Google is no longer a search engine; it is an answer engine.</p> </div> </div> </div> );`,

  'src/pages/AdminDashboard.tsx': `import React, { useEffect, useState } from 'react'; import { auth, db } from '../firebaseConfig'; import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; import { collection, getDocs, orderBy, query } from 'firebase/firestore'; import { Shield } from 'lucide-react';
export const AdminDashboard = () => { const [user, setUser] = useState(null); const [leads, setLeads] = useState([]); const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  useEffect(() => { if (!auth) return; return onAuthStateChanged(auth, u => { setUser(u); if (u) fetchLeads(); }); }, []);
  const fetchLeads = async () => { if (!db) return; const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc')); const snap = await getDocs(q); setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))); };
  const handleLogin = async (e) => { e.preventDefault(); if (!auth) return; try { await signInWithEmailAndPassword(auth, email, pass); } catch { alert('Access Denied'); } };
  if (!user) return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center"> <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl w-96 border border-slate-700 text-white"> <div className="flex justify-center mb-6"><Shield size={48} className="text-brand-yellow"/></div> <h2 className="text-center text-xl font-bold mb-6">Restricted Access</h2> <input className="w-full mb-4 bg-slate-900 border border-slate-600 p-3 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <input className="w-full mb-6 bg-slate-900 border border-slate-600 p-3 rounded" type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} /> <button className="w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded">Login</button> </form> </div>;
  return <div className="max-w-4xl mx-auto p-8 text-white"> <h1 className="text-3xl mb-8">Mission Control</h1> <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"> {leads.map(lead => ( <div key={lead.id} className="p-4 border-b border-slate-700 flex justify-between"> <span className="font-bold">{lead.businessName}</span> <span className="text-brand-yellow">{lead.auditScore}</span> </div> ))} </div> </div>; };`,

  'src/App.tsx': `import React from 'react'; import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; import { ErrorBoundary } from './components/ErrorBoundary'; import { Navbar } from './components/Navbar'; import { Footer } from './components/Footer'; import { Chatbot } from './components/Chatbot'; import { HomePage } from './pages/Home'; import { AdminDashboard } from './pages/AdminDashboard'; import { EarnedMedia } from './pages/EarnedMedia';
const App = () => ( <ErrorBoundary> <Router> <div className="min-h-screen flex flex-col"> <Navbar /> <main className="flex-grow"> <Routes> <Route path="/" element={<HomePage />} /> <Route path="/earned-media" element={<EarnedMedia />} /> <Route path="/admin" element={<AdminDashboard />} /> </Routes> </main> <Footer /> <Chatbot /> </div> </Router> </ErrorBoundary> ); export default App;`
};

// --- EXECUTE BUILD ---
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${filePath}`);
});
console.log("\n🚀 SYSTEM REBUILT.");
