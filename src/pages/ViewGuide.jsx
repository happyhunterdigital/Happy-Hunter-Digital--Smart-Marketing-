import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

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

export default function ViewGuide() {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get("id");
  const docType = searchParams.get("doc");

  const [status, setStatus] = useState("verifying"); 
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loadProgress, setLoadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const isMounted = useRef(true);

  const ADMIN_EMAILS = ['motsumitl@happyhunterdigital.com', 'happyhunterdigital@gmail.com'];

  const getSecurePath = () => {
    if (docType === "gbp") return "/assets/hhd-gbp-zero-clicks.pdf";
    return "/assets/hhd-service-guide.pdf";
  };

  const getDocTitle = () => {
    if (docType === "gbp") return "AI & GBP Zero Clicks Revolutions";
    return "Smart Marketing Service Guide";
  };

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    document.title = `HHD Secure - ${getDocTitle()}`;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      
      if (!u) {
        setStatus("auth");
      } else {
        if (!tokenId) {
            setStatus("denied");
            return;
        }

        if (ADMIN_EMAILS.includes(u.email)) {
            runPipeline();
            return;
        }

        try {
            const sessionRef = doc(db, "secure_access_sessions", tokenId);
            const sessionSnap = await getDoc(sessionRef);

            if (sessionSnap.exists()) {
                const data = sessionSnap.data();
                const expiry = data.expiresAt?.toMillis ? data.expiresAt.toMillis() : (data.expiresAt?.seconds * 1000 || 0);

                if (expiry > Date.now() || !data.expiresAt) {
                    if (!data.claimedBy) {
                        await updateDoc(sessionRef, { claimedBy: u.email }).catch(() => {});
                        runPipeline();
                    } else if (data.claimedBy === u.email) {
                        runPipeline();
                    } else {
                        setStatus("denied");
                    }
                } else {
                    setStatus("denied");
                }
            } else {
                if (tokenId && String(tokenId).startsWith("hhd_secure_")) {
                    runPipeline();
                } else {
                    setStatus("denied");
                }
            }
        } catch (e) {
            console.error("Token verification error", e);
            if (tokenId && String(tokenId).startsWith("hhd_secure_")) {
                runPipeline();
            } else {
                setStatus("denied");
            }
        }
      }
    });

    return () => {
      document.head.removeChild(styleTag);
      isMounted.current = false;
      unsubscribe();
    };
  }, [tokenId, docType]);

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
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login Error:", e);
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        console.error("Redirect Error:", redirectErr);
      }
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
  }, []);

  const runPipeline = useCallback(async () => {
    setStatus("loading");
    try {
      const pdfjsLib = await loadPdfJs();
      const response = await fetch(getSecurePath(), {
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
  }, [renderPage, docType]);

  const renderStatusScreen = () => {
    if (status === "verifying") {
        return <div className="hhd-state-screen"><div className="hhd-state-title">Verifying Secure Handshake...</div></div>;
    }

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
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>
            If the button is unresponsive in your mobile app, please open this link in Safari or Chrome.
          </div>
        </div>
      );
    }

    if (status === "denied") {
      return (
        <div className="hhd-state-screen" style={{ zIndex: 200, background: '#050505', position: 'fixed', inset: 0 }}>
          <div className="hhd-state-icon" style={{ color: '#ef4444' }}>❌</div>
          <div className="hhd-state-title">Access Denied</div>
          <div className="hhd-state-sub" style={{ marginBottom: '20px' }}>
            This secure link is invalid, expired, or securely claimed by another user. Please request a new link via our <a href="https://wa.me/27601016673" target="_blank" rel="noopener noreferrer" style={{ color: '#eab308', textDecoration: 'underline', fontWeight: 'bold' }}>WhatsApp Channel</a>.
          </div>
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>Logged in as: {user?.email} <span onClick={() => signOut(auth)} style={{ color: '#eab308', cursor: 'pointer', marginLeft: '10px' }}>Logout</span></div>
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
      <div className="hhd-topbar">
        <div className="hhd-topbar-brand">
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="hhd-topbar-logo">
              happy<span>hunter</span>digital
            </span>
          </a>
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

      <div className="hhd-watermark-bar">
        🔒 Confidential — Authorised View Only — Do Not Share This Link
      </div>

      {!isRenderingOrReady && renderStatusScreen()}

      <div
        className="hhd-canvas-scroll"
        ref={scrollRef}
        style={{ display: isRenderingOrReady ? "flex" : "none", position: "relative" }}
      >
        {status === "rendering" && renderStatusScreen()}
        <div ref={pagesContainerRef} style={{ display: "contents" }} />
      </div>

      {status === "ready" && (
        <div className="hhd-footer">
          © {new Date().getFullYear()} Happy Hunter Digital — All Rights Reserved. Authenticated as {user?.email}. <span onClick={() => signOut(auth)} style={{ color: '#eab308', cursor: 'pointer', marginLeft: '10px' }}>Logout</span>
        </div>
      )}
    </div>
  );
}
