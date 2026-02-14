import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer'; // NEW
import CookieConsent from './components/CookieConsent'; // NEW
// ... rest of imports

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative">
        <CookieConsent />
        <Navbar />
        <main className="animate-fade-in">
          <Routes>
            {/* ... all routes */}
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}
