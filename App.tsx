import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- COMPONENT IMPORTS ---
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AiAudit } from './components/AiAudit';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { EarnedMedia } from './components/EarnedMedia'; 
import { BlogReader } from './components/BlogReader';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookieConsent } from './components/CookieConsent';

// --- PAGE IMPORTS ---
import { CoreServices } from './pages/CoreServices';
import { FAQ } from './pages/FAQ'; 
import AdminDashboard from './pages/AdminDashboard';

// --- LAYOUT WRAPPER ---
// This handles showing/hiding the Navbar & Footer automatically
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Check if we are on the admin dashboard to hide nav/footer
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-dark">
      {/* Show Navbar only if NOT on admin page */}
      {!isAdmin && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Show Footer only if NOT on admin page */}
      {!isAdmin && <Footer />}
      
      <WhatsAppWidget />
      <CookieConsent />
    </div>
  );
};

// --- HOME PAGE COMPONENT ---
// Combines the sections that appear on the main scrollable homepage
const HomePage = () => (
  <div className="animate-fade-in">
    <Hero />
    <div id="audit" className="scroll-mt-24"><AiAudit /></div>
    <div id="services" className="scroll-mt-24"><Services /></div>
    <div id="portfolio" className="scroll-mt-24"><Portfolio /></div>
  </div>
);

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/core-services" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          
          {/* This Route was missing before, causing the empty FAQ page */}
          <Route path="/faq" element={<FAQ />} /> 
          
          <Route path="/blog/:id" element={<BlogReader />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
