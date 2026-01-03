import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Simple Security Check
  const handleLogin = () => {
    if (password === "Hunter2026") { // <--- CHANGE THIS PASSWORD TO YOUR PREFERENCE
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      alert("Incorrect Password");
    }
  };

  const fetchLeads = async () => {
    try {
      // Get all leads from the 'mail' collection, ordered by date
      const q = query(collection(db, "mail"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Happy Hunter Admin</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="border p-2 w-full mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🎯 Audit Leads Dashboard</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Website
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {/* Convert Firebase Timestamp to readable date */}
                  {lead.date?.seconds ? new Date(lead.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-blue-600">
                  {lead.to}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <a href={lead.website} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-500">
                    {lead.website || "N/A"}
                  </a>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                    <span className="relative">Audited</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
