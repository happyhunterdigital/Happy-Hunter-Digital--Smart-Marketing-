import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { 
  Shield, LogOut, Eye, CheckCircle, AlertTriangle, AlertOctagon, 
  Lock, Mail, BarChart3, Globe, MapPin, Zap 
} from "lucide-react";

// --- TYPES ---
interface Lead {
  id: string;
  businessName: string;
  location: string;
  website: string;
  email: string;
  status: string;
  date: any;
  to: string; 
}

// New Interface for the Analysis Report
interface AuditReport {
  score: number;
  problems: { title: string; desc: string; severity: 'high' | 'medium' }[];
  solutions: { title: string; desc: string }[];
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [audit, setAudit] = useState<AuditReport | null>(null); // Store the generated audit
  const [loading, setLoading] = useState(false);
  
  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ADMIN_EMAILS = ["happyhunterdigital@gmail.com"];

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userIsAdmin = ADMIN_EMAILS.includes(currentUser.email || "");
        setIsAdmin(userIsAdmin);
        if (!userIsAdmin) {
          signOut(auth);
          setErrorMsg("Access Denied: Admin only.");
          return;
        }
        setErrorMsg(null);
        fetchLeads();
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- THE SMART AUDIT ENGINE ---
  // This function runs whenever you select a lead to generate a "Real" analysis
  const generateAudit = (lead: Lead) => {
    let score = 85; // Start high, deduct points
    const problems = [];
    const solutions = [];

    // Check 1: Website Existence
    if (!lead.website || lead.website === "N/A" || lead.website === "") {
      score -= 40;
      problems.push({
        title: "Digital Ghost (No Website)",
        desc: "Business lacks a primary digital storefront, losing 100% of web traffic.",
        severity: "high"
      });
      solutions.push({
        title: "Conversion-First Web Design",
        desc: "Build a high-speed, SEO-optimized landing page to capture intent."
      });
    } else {
      // Mock check: Assume website exists but might have issues
      score -= 10; 
      problems.push({
        title: "Trust Architecture Gap",
        desc: "Website exists but lacks immediate social proof triggers above the fold.",
        severity: "medium"
      });
      solutions.push({
        title: "Trust Signal Integration",
        desc: "Embed reviews and trust badges into the hero section."
      });
    }

    // Check 2: Location / Local SEO
    if (!lead.location || lead.location.length < 3) {
      score -= 30;
      problems.push({
        title: "Invisible in Local Search",
        desc: "Google Maps visibility is non-existent due to missing location data.",
        severity: "high"
      });
      solutions.push({
        title: "GMB Domination Package",
        desc: "Claim, verify, and optimize Google My Business profile."
      });
    } else {
      problems.push({
        title: `Competitor Pressure in ${lead.location}`,
        desc: `Competitors in ${lead.location} have higher review velocity.`,
        severity: "medium"
      });
      solutions.push({
        title: "Review Automation System",
        desc: "Implement SMS review requests to boost ranking in the Local Pack."
      });
    }

    // Default Check: Email
    if (!lead.email) {
      score -= 10;
      problems.push({ title: "Communication Barrier", desc: "No direct email channel found.", severity: "medium" });
    }

    setAudit({ score: Math.max(0, score), problems: problems as any, solutions });
  };

  // Run audit when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      generateAudit(selectedLead);
    }
  }, [selectedLead]);

  // --- STANDARD FUNCTIONS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_EMAILS.includes(email)) { setErrorMsg("Not an admin email."); return; }
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Login failed. Check credentials.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => { signOut(auth); setEmail(""); setPassword(""); setIsAdmin(false); };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "mail"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Lead[];
      setLeads(leadsData);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const markAsContacted = async (id: string) => {
    try {
      const leadRef = doc(db, "mail", id);
      await updateDoc(leadRef, { status: "contacted" });
      fetchLeads();
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: "contacted" });
    } catch (error) { console.error(error); }
  };

  // --- RENDER HELPERS ---
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // --- VIEWS ---
  if (user && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <AlertOctagon size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <button onClick={handleLogout} className="mt-4 text-gray-400 hover:text-white underline">Logout</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full">
          <Shield size={64} className="text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500" required />
            </div>
            <button type="submit" disabled={isLoggingIn} className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all mt-2 disabled:opacity-50">
              {isLoggingIn ? "Verifying..." : "Login"}
            </button>
          </form>
          {errorMsg && <p className="text-red-400 text-center mt-4 text-sm">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0 z-10">
          <div><h1 className="text-xl font-bold text-gray-800">Audit Leads</h1><p className="text-xs text-gray-500">{user.email}</p></div>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500"><LogOut size={20} /></button>
        </div>
        {loading ? <div className="p-10 text-center text-gray-400">Loading...</div> : (
          <div className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <div key={lead.id} onClick={() => setSelectedLead(lead)} className={`p-6 cursor-pointer hover:bg-blue-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 truncate pr-2">{lead.businessName || "Unknown"}</h3>
                  {lead.status === 'new' ? <span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded-full font-bold">NEW</span> : <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full">Contacted</span>}
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={12}/> {lead.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail View */}
      <div className="w-full md:w-2/3 p-8 h-screen overflow-y-auto bg-gray-100">
        {selectedLead && audit ? (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedLead.businessName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                   {selectedLead.website ? (
                     <a href={selectedLead.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600"><Globe size={16}/> {selectedLead.website}</a>
                   ) : (
                     <span className="flex items-center gap-1 text-red-400"><Globe size={16}/> No Website</span>
                   )}
                   <span className="flex items-center gap-1"><MapPin size={16}/> {selectedLead.location}</span>
                </div>
              </div>
              
              {/* Health Score Circle */}
              <div className="text-center">
                <div className={`text-4xl font-black ${getScoreColor(audit.score)}`}>{audit.score}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Health Score</div>
              </div>
            </div>

            {/* Action Bar */}
            {selectedLead.status === 'new' && (
               <div className="flex justify-end">
                  <button onClick={() => markAsContacted(selectedLead.id)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition-all flex items-center gap-2">
                    <CheckCircle size={18} /> Mark as Contacted
                  </button>
               </div>
            )}

            {/* Two Column Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Problems Column */}
              <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-2 text-red-800 font-bold">
                  <AlertTriangle size={20} /> Detected Gaps
                </div>
                <div className="p-4 space-y-4">
                  {audit.problems.map((prob, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 text-sm">{prob.title}</h4>
                        {prob.severity === 'high' && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">CRITICAL</span>}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{prob.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solutions Column */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2 text-blue-800 font-bold">
                  <Zap size={20} /> Recommended Strategy
                </div>
                <div className="p-4 space-y-4">
                  {audit.solutions.map((sol, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{sol.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{sol.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BarChart3 size={64} className="mb-4 opacity-10" />
            <p>Select a lead to generate Audit Report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
