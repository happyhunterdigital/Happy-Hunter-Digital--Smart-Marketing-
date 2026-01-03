import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
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
import AdminDashboard from './pages/AdminDashboard'; 

// Layout wrapper to hide Header/Footer on Admin page
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-dark">
      {!isAdmin && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
      <WhatsAppWidget />
      <CookieConsent />
    </div>
  );
};

// The Home Page (All sections in one scrollable page)
const HomePage = () => (
  <div className="animate-fade-in">
    <Hero />
    <div id="audit" className="scroll-mt-24"><AiAudit /></div>
    <div id="services" className="scroll-mt-24"><Services /></div>
    <div id="portfolio" className="scroll-mt-24"><Portfolio /></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/blog/:id" element={<BlogReader />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* The Hidden Admin Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
