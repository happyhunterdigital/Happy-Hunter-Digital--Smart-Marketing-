import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary'; // <--- NEW IMPORT
// All your existing imports remain below:
import { Navbar } from './components/Navbar';
// ... other component imports (Hero, AiAudit, etc.)
import AdminDashboard from './pages/AdminDashboard'; 

const App: React.FC = () => {
  return (
    <ErrorBoundary> {/* <--- WRAPS EVERYTHING */}
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Your layout structure from the PDF remains here */}
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ... other routes remain ... */}
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
