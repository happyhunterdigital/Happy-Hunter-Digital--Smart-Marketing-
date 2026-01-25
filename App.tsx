import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary'; // <--- IMPORTED
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AiAudit } from './components/AiAudit';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Chatbot } from './components/Chatbot';
import { EarnedMedia } from './components/EarnedMedia';
import { BlogReader } from './components/BlogReader';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard'; // Ensure this path is correct based on your folder structure

const App: React.FC = () => {
  return (
    <ErrorBoundary> {/* <--- WAR ROOM REQUIREMENT APPLIED */}
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-900">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy onBack={() => window.history.back()} />} />
            <Route path="/blog/:id" element={<BlogReader />} />
            <Route path="/earned-media" element={
              <>
                <Navbar />
                <EarnedMedia />
                <Footer />
              </>
            } />
            <Route path="/" element={
              <>
                <Navbar />
                <Hero />
                <div id="audit"><AiAudit /></div>
                <div id="services"><Services /></div>
                <div id="portfolio"><Portfolio /></div>
                <Footer />
                <WhatsAppWidget />
                <Chatbot />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
