// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar, Footer, CookieConsent, Chatbot, GlobalErrorBoundary } from './components';
import Home from './pages/Home';

// Lazy load heavy pages
const Audit = lazy(() => import('./pages/Audit'));
const Admin = lazy(() => import('./pages/Admin'));
const Founders = lazy(() => import('./pages/Founders'));
const CoreServices = lazy(() => import('./pages/CoreServices'));
const EarnedMedia = lazy(() => import('./pages/EarnedMedia'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SummitPage = lazy(() => import('./pages/SummitPage'));
const ArticleReader = lazy(() => import('./pages/ArticleReader'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col">
        <CookieConsent />
        <Navbar />
        
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/core-services" element={<CoreServices />} />
              <Route path="/earned-media" element={<EarnedMedia />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/article/:id" element={<ArticleReader />} />
              <Route path="/admin-ops-center" element={<Admin />} />
              <Route path="/integrated-wellth-summit" element={<SummitPage />} />
            </Routes>
          </Suspense>
        </main>

        <Chatbot />
        <Footer />
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
