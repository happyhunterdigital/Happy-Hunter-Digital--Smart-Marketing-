import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import EventPopup from './components/EventPopup';

const Home = lazy(() => import('./pages/Home'));
const CoreServices = lazy(() => import('./pages/CoreServices'));
const EarnedMedia = lazy(() => import('./pages/EarnedMedia'));
const Audit = lazy(() => import('./pages/Audit'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ArticleReader = lazy(() => import('./pages/ArticleReader'));
const Admin = lazy(() => import('./pages/Admin'));
const SummitPage = lazy(() => import('./pages/SummitPage'));
const SummitPoster = lazy(() => import('./pages/SummitPoster')); // NEW IMPORT

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative">
        <EventPopup />
        <Navbar />
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-yellow-500 font-black">Establishing Signal...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/core-services" element={<CoreServices />} />
            <Route path="/earned-media" element={<EarnedMedia />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/article/:id" element={<ArticleReader />} />
            <Route path="/admin-ops-center" element={<Admin />} />
            <Route path="/integrated-wellth-summit" element={<SummitPage />} />
            <Route path="/poster" element={<SummitPoster />} /> {/* POSTER ROUTE */}
          </Routes>
        </Suspense>
        <Chatbot />
      </div>
    </Router>
  );
}
