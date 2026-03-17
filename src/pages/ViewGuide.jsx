src/pages/ViewGuide.jsx
// src/pages/ViewGuide.jsx
// Secure Viewer Pipeline — Happy Hunter Digital
// Route: /view/guide

import { useEffect, useRef, useState, useCallback } from "react";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
const SECURE_PDF_PATH = "/assets/hhd-service-guide.pdf";
const REQUIRED_ACCESS_CODE = "HHD-SECURE-2026"; // Provided by WA Bot

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ─── STYLES ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0a;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  @media print {
    body * { display: none !important; }
    body::after {
      display: block !important;
      content: "This document is protected and cannot be printed.";
      font-size: 24px;
      text-align: center;
      padding: 100px;
      color: #111;
    }
  }
  .hhd-viewer-shell {
    min-height: 100vh;
    background: #0d0d0d;
    display: flex;
    flex-direction: column;
  }
  .hhd-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #111;
    border-bottom: 1px solid #222;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .hhd-topbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hhd-topbar-logo {
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.3px;
    color: #fff;
  }
  .hhd-topbar-logo span {
    color: #f5c518;
  }
  .hhd-badge {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #888;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .hhd-page-counter {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }
  .hhd-page-counter strong {
    color: #f5c518;
  }
  .hhd-watermark-bar {
    background: linear-gradient(90deg, #f5c518 0%, #e6b800 100%);
    color: #000;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    padding: 6px 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .hhd-canvas-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  .hhd-page-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hhd-canvas-frame {
    position: relative;
    box-shadow: 0 4px 40px rgba(0,0,0,0.6);
    border-radius: 4px;
    overflow: hidden;
    max-width: 95vw;
  }
  .hhd-canvas-frame canvas {
    display: block;
    max-width: 100%;
    height: auto;
    pointer-events: none; 
  }
  .hhd-canvas-shield {
    position: absolute;
    inset: 0;
    z-index: 10;
    cursor: default;
  }
  .hhd-page-watermark {
    position: absolute;
    inset: 0;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0.06;
    transform: rotate(-30deg);
    font-size: clamp(18px, 4vw, 36px);
    font-weight: 900;
    color: #f5c518;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    text-align: center;
  }
  .hhd-page-number-tag {
    margin-top: 8px;
    font-size: 11px;
    color: #444;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .hhd-state-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 40px 20px;
    gap: 16px;
  }
  .hhd-state-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }
  .hhd-state-title {
    font-size: 20px;
    font-weight: 600;
    color: #f0f0f0;
  }
  .hhd-state-sub {
    font-size: 14px;
    color: #555;
    max-width: 320px;
    line-height: 1.6;
  }
  .hhd-progress-bar {
    width: 200px;
    height: 3px;
    background: #222;
    border-radius: 99px;
    overflow: hidden;
    margin-top: 12px;
  }
  .hhd-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f5c518, #e6b800);
    border-radius: 99px;
    transition: width 0.3s ease;
  }
  .hhd-footer {
    text-align: center;
    padding: 20px;
    font-size: 11px;
    color: #333;
    border-top: 1px solid #1a1a1a;
    letter-spacing: 0.5px;
  }
`;

// ─── LOAD PDF.JS DYNAMICALLY ──────────────────────────────────────────────────
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = PDFJS_CDN;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("PDF.js failed to load. Check your internet connection."));
    document.head.appendChild(script);
  });
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function ViewGuide() {
  const [status, setStatus] = useState("auth"); // auth | code | loading | rendering | ready | error
  const [user, setUser] = useState(null);
  const[authLoading, setAuthLoading] = useState(true);
  const [inputCode, setInputCode] = useState("");

  const[loadProgress, setLoadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    document.title = "HHD Service Guide — Secure View";

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        setStatus("code");
      } else {
        setStatus("auth");
      }
    });

    return () => {
      document.head.removeChild(styleTag);
      isMounted.current = false;
      unsubscribe();
    };
  },[]);

  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockPrint = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "F12") e.preventDefault();
    };
    const blockDrag = (e) => e.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockPrint);
    document.addEventListener("dragstart", blockDrag);
    window.addEventListener("beforeprint", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockPrint);
      document.removeEventListener("dragstart", blockDrag);
      window.removeEventListener("beforeprint", (e) => e.preventDefault());
    };
  },[]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login Error:", e);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === REQUIRED_ACCESS_CODE) {
      runPipeline();
    } else {
      alert("Invalid Access Code. Please ask the WhatsApp bot for the code.");
      setInputCode("");
    }
  };

  const renderPage = useCallback(async (pdfDoc, pageNum, container) => {
    const page = await pdfDoc.getPage(pageNum);
    const desiredWidth = Math.min(window.innerWidth * 0.9, 900);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = desiredWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    if (!isMounted.current) return;

    const wrapper = document.createElement("div");
    wrapper.className = "hhd-page-wrapper";

    const frame = document.createElement("div");
    frame.className = "hhd-canvas-frame";

    const shield = document.createElement("div");
    shield.className = "hhd-canvas-shield";
    shield.addEventListener("contextmenu", (e) => e.preventDefault());

    const wm = document.createElement("div");
    wm.className = "hhd-page-watermark";
    wm.textContent = "happyhunterdigital.com — confidential";

    const pageTag = document.createElement("div");
    pageTag.className = "hhd-page-number-tag";
    pageTag.textContent = `Page ${pageNum}`;

    frame.appendChild(canvas);
    frame.appendChild(shield);
    frame.appendChild(wm);
    wrapper.appendChild(frame);
    wrapper.appendChild(pageTag);
    container.appendChild(wrapper);
  },[]);

  const runPipeline = useCallback(async () => {
    setStatus("loading");
    try {
      const pdfjsLib = await loadPdfJs();
      const response = await fetch(SECURE_PDF_PATH, {
        headers: { "X-HHD-Viewer": "1" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Could not load document (${response.status})`);
      }

      const pdfBuffer = await response.arrayBuffer();
      if (!isMounted.current) return;

      setLoadProgress(100);
      setStatus("rendering");

      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
      loadingTask.onProgress = ({ loaded, total }) => {
        if (total > 0) setLoadProgress(Math.round((loaded / total) * 100));
      };

      const pdfDoc = await loadingTask.promise;
      if (!isMounted.current) return;

      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      const container = pagesContainerRef.current;
      if (!container) return;

      for (let i = 1; i <= numPages; i++) {
        if (!isMounted.current) return;
        await renderPage(pdfDoc, i, container);
        setRenderedPages(i);
      }

      if (!isMounted.current) return;
      setStatus("ready");

    } catch (err) {
      console.error("[HHD Viewer] Pipeline error:", err);
      if (!isMounted.current) return;
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  }, [renderPage]);


  const renderStatusScreen = () => {
    if (authLoading) return <div className="hhd-state-screen"><div className="hhd-state-title">Checking Handshake...</div></div>;

    if (status === "auth") {
      return (
        <div className="hhd-state-screen" style={{ zIndex: 200, background: '#050505', position: 'fixed', inset: 0 }}>
          <div className="hhd-state-icon">🔒</div>
          <div className="hhd-state-title">Identity Verification Required</div>
          <div className="hhd-state-sub" style={{ marginBottom: '20px' }}>
            You must establish a secure Google handshake to view Happy Hunter Protocol documents.
          </div>
          <button 
            onClick={handleGoogleLogin} 
            style={{ padding: '16px 32px', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            Authenticate via Google
          </button>
        </div>
      );
    }

    if (status === "code") {
      return (
        <div className="hhd-state-screen" style={{ zIndex: 200, background: '#050505', position: 'fixed', inset: 0 }}>
          <div className="hhd-state-icon">🔑</div>
          <div className="hhd-state-title">Enter Neural Code</div>
          <div className="hhd-state-sub" style={{ marginBottom: '20px' }}>
            Provide the generic access code generated by the Smart Marketing AI via WhatsApp.
          </div>
          <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="e.g. HHD-SECURE-..." 
              style={{ padding: '16px', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', outline: 'none', textAlign: 'center', fontWeight: 'bold' }}
              required 
            />
            <button 
              type="submit" 
              style={{ padding: '16px 32px', background: '#eab308', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Unlock Document
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>Logged in as: {user.email} <span onClick={() => signOut(auth)} style={{ color: '#eab308', cursor: 'pointer', marginLeft: '10px' }}>Logout</span></div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">⚠️</div>
          <div className="hhd-state-title">Could Not Load Document</div>
          <div className="hhd-state-sub">{errorMessage}</div>
        </div>
      );
    }

    if (status === "loading") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">🛡️</div>
          <div className="hhd-state-title">Loading Document</div>
          <div className="hhd-state-sub">Fetching secure content…</div>
          <div className="hhd-progress-bar">
            <div className="hhd-progress-fill" style={{ width: `${Math.max(loadProgress, 10)}%` }} />
          </div>
        </div>
      );
    }

    if (status === "rendering") {
      const percent = totalPages > 0 ? Math.round((renderedPages / totalPages) * 100) : 0;
      return (
        <div className="hhd-state-screen" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#0d0d0d", zIndex: 50 }}>
          <div className="hhd-state-icon">⚡</div>
          <div className="hhd-state-title">Preparing Viewer</div>
          <div className="hhd-state-sub">
            Rendering page {renderedPages} of {totalPages}…
          </div>
          <div className="hhd-progress-bar">
            <div className="hhd-progress-fill" style={{ width: `${Math.max(percent, 5)}%` }} />
          </div>
        </div>
      );
    }
    return null;
  };

  const isRenderingOrReady = status === "rendering" || status === "ready";

  return (
    <div className="hhd-viewer-shell">
      {/* Top navigation bar */}
      <div className="hhd-topbar">
        <div className="hhd-topbar-brand">
          <span className="hhd-topbar-logo">
            happy<span>hunter</span>digital
          </span>
          <span className="hhd-badge">Secure View</span>
        </div>
        {status === "ready" && (
          <div className="hhd-page-counter">
            <strong>{totalPages}</strong> pages
          </div>
        )}
        {status === "rendering" && (
          <div className="hhd-page-counter">
            {renderedPages} / <strong>{totalPages}</strong>
          </div>
        )}
      </div>

      {/* Yellow confidentiality bar */}
      <div className="hhd-watermark-bar">
        🔒 Confidential — Authorised View Only — Do Not Share This Link
      </div>

      {/* Status screens */}
      {!isRenderingOrReady && renderStatusScreen()}

      {/* The scrollable canvas container */}
      <div
        className="hhd-canvas-scroll"
        ref={scrollRef}
        style={{ display: isRenderingOrReady ? "flex" : "none", position: "relative" }}
      >
        {status === "rendering" && renderStatusScreen()}
        
        <div ref={pagesContainerRef} style={{ display: "contents" }} />
      </div>

      {/* Footer */}
      {status === "ready" && (
        <div className="hhd-footer">
          © {new Date().getFullYear()} Happy Hunter Digital — All Rights Reserved. Authenticated as {user?.email}.
        </div>
      )}
    </div>
  );
}
