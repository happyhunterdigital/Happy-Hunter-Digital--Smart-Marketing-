import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
// CHANGED: We now use signInWithEmailAndPassword
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Shield, LogOut, Eye, CheckCircle, AlertTriangle, AlertOctagon, Lock, Mail } from "lucide-react";

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

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  
  // NEW: Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setErrorMsg(null);
        fetchLeads();
      }
    });
    return () => unsubscribe();
  }, []);

  // NEW: Handle Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    setIsLoggingIn(true);
    setErrorMsg(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMsg(error.message);
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    signOut(auth);
    setEmail("");
    setPassword("");
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "mail"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  const markAsContacted = async (id: string) => {
    try {
      const leadRef = doc(db, "mail", id);
      await updateDoc(leadRef, { status: "contacted" });
      fetchLeads();
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: "contacted" });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // --- LOGIN SCREEN (UPDATED) ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 text-center max-w-md w-full">
          <Shield size={64} className="text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Admin Access</h2>
          <p className="text-gray-400 mb-6">Enter your credentials</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all mt-2 disabled:opacity-50"
            >
              {isLoggingIn ? "Verifying..." : "Login"}
            </button>
          </form>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded text-left text-sm mt-4 break-words">
              <div className="flex items-center gap-2 mb-1 font-bold">
                <AlertOctagon size={16} /> Login Failed
              </div>
              <p>{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0 z-10">
          <div>
             <h1 className="text-xl font-bold text-gray-800">Audit Leads</h1>
             <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500"><LogOut size={20} /></button>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading leads...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className={`p-6 cursor-pointer hover:bg-blue-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{lead.businessName || "Unknown"}</h3>
                  {lead.status === 'new' ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">NEW</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Contacted</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{lead.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 p-8 h-screen overflow-y-auto bg-gray-50">
        {selectedLead ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedLead.businessName}</h2>
                  <p className="text-yellow-400">{selectedLead.to}</p>
                  {selectedLead.website && (
                    <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-gray-400 text-sm hover:text-white mt-1 block">
                      {selectedLead.website}
                    </a>
                  )}
                </div>
                {selectedLead.status === 'new' && (
                  <button 
                    onClick={() => markAsContacted(selectedLead.id)}
                    className="bg-yellow-500 text-gray-900 px-4 py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors"
                  >
                    Mark as Contacted
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Detected Gaps (Problems)
              </h3>
              <div className="grid gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-bold text-red-800 mb-1">Local Visibility</h4>
                  <p className="text-sm text-gray-700">Business is likely missing from the "Local Pack" (Top 3 Map results) in {selectedLead.location}. Competitors are capturing high-intent traffic.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-bold text-red-800 mb-1">Trust Architecture</h4>
                  <p className="text-sm text-gray-700">Website or profile lacks immediate "Social Proof" triggers (Review velocity, recent updates) required to convert cold traffic.</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Recommended Solutions
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded text-blue-600 font-bold">01</div>
                  <div>
                    <h4 className="font-bold text-gray-800">GMB Optimization "Surge"</h4>
                    <p className="text-sm text-gray-600">Update service categories to "Products", seed Q&A section with keywords, and enable messaging.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded text-blue-600 font-bold">02</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Review Automation</h4>
                    <p className="text-sm text-gray-600">Implement SMS-based review request system to increase review velocity by 300% in 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Eye size={48} className="mb-4 opacity-20" />
            <p>Select a lead from the left to view the Detailed Audit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
