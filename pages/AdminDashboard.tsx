import React, { useEffect, useState } from "react";
import { db, auth, googleProvider } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
// CHANGED: Added signInWithRedirect, removed signInWithPopup
import { signInWithRedirect, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Shield, LogOut, Eye, CheckCircle, AlertTriangle } from "lucide-react";

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

  // 1. Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchLeads();
    });
    return () => unsubscribe();
  }, []);

  // 2. Google Login Function (UPDATED to Redirect)
  const handleGoogleLogin = async () => {
    try {
      // This will redirect the whole page to Google, then back here.
      // It solves the "Popup Blocked" error.
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console for details.");
    }
  };

  const handleLogout = () => signOut(auth);

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
      fetchLeads(); // Refresh list
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: "contacted" });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 text-center max-w-md w-full">
          <Shield size={64} className="text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Admin Access</h2>
          <p className="text-gray-400 mb-8">Happy Hunter Staff Only</p>
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 font-bold py-4 rounded-lg hover:bg-gray-100 transition-all"
          >
            {/* Simple Google Icon */}
            <span className="font-bold text-xl">G</span>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar / List View */}
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
                <p className="text-xs text-gray-400">
                  {lead.date?.seconds ? new Date(lead.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content / Detailed View */}
      <div className="w-full md:w-2/3 p-8 h-screen overflow-y-auto bg-gray-50">
        {selectedLead ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
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
