// src/pages/ViewGuide.jsx
// Secure Viewer Pipeline — Happy Hunter Digital
// Route: /view/guide?id=USER_AUTH_TOKEN
// Deploy this file to your GitHub repo at src/pages/ViewGuide.jsx
// Add the route in your App.jsx: <Route path="/view/guide" element={<ViewGuide />} />

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
// Replace this with your actual PDF path in your /public or /assets folder.
// NEVER expose a direct CDN or Firebase Storage URL here — keep the file local.
const SECURE_PDF_PATH = "/assets/hhd-service-guide.pdf";

// Valid token prefix. Your WhatsApp bot appends a unique ID after this prefix.
// Full token format: hhd_secure_XXXXXXXXXXXXXXXX
// Generate tokens server-side with your WhatsApp bot logic and validate here.
const TOKEN_PREFIX = "hhd_secure_";

// PDF.js CDN — pinned to a specific version for stability
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ─── STYLES ────────────────────────────────────────────────────────────────────
// Inlined to keep this file self-contained for GitHub deployment.
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

  /* Block the browser print dialog */
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
    /* Prevent scrollbar from triggering native print on some browsers */
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
    pointer-events: none; /* Prevent drag-to-save on canvas */
  }

  /* Invisible overlay on top of canvas to block right-click on the canvas element */
  .hhd-canvas-shield {
    position: absolute;
    inset: 0;
    z-index: 10;
    cursor: default;
  }

  /* Watermark overlay per page */
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
    user-select: none;
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

  .hhd-denied-code {
    font-family: monospace;
    font-size: 11px;
    color: #333;
    background: #1a1a1a;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid #222;
    margin-top: 8px;
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

// ─── TOKEN VALIDATION ───────────────────────────────────────────────────────────
// This is a client-side pre-check only. For production, validate the token
// server-side using a Firebase Cloud Function or your backend before serving
// the PDF binary. This prevents anyone who knows the token format from guessing.
function validateToken(token) {
  if (!token) return false;
  if (!token.startsWith(TOKEN_PREFIX)) return false;
  const uniquePart = token.replace(TOKEN_PREFIX, "");
  // Token must be at least 12 characters after the prefix
  if (uniquePart.length < 12) return false;
  // Block known test/demo tokens from being shared widely
  if (uniquePart === "demo00000000") return false;
  return true;
}

// ─── LOAD PDF.JS DYNAMICALLY ────────────────────────────────────────────────────
// We load PDF.js from CDN at runtime rather than bundling it to keep the
// chunk size down and avoid any Vite/Rollup complications.
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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("id");

  const [status, setStatus] = useState("validating"); // validating | loading | rendering | ready | denied | error
  const [loadProgress, setLoadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const isMounted = useRef(true);

  // ── Inject styles once ──────────────────────────────────────────────────────
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Override document title to remove any PDF filename hints
    document.title = "HHD Service Guide — Secure View";

    return () => {
      document.head.removeChild(styleTag);
      isMounted.current = false;
    };
  }, []);

  // ── Global event lockdown ───────────────────────────────────────────────────
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockPrint = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
      // Block F12 DevTools shortcut (soft deterrent — does not fully block DevTools)
      if (e.key === "F12") {
        e.preventDefault();
      }
    };
    const blockDrag = (e) => e.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockPrint);
    document.addEventListener("dragstart", blockDrag);

    // Detect when the window loses focus to a print dialog
    window.addEventListener("beforeprint", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockPrint);
      document.removeEventListener("dragstart", blockDrag);
      window.removeEventListener("beforeprint", (e) => e.preventDefault());
    };
  }, []);

  // ── Render a single PDF page to a canvas element ───────────────────────────
  const renderPage = useCallback(async (pdfDoc, pageNum, container) => {
    const page = await pdfDoc.getPage(pageNum);

    // Scale for sharp rendering on retina displays without being too large on mobile
    const desiredWidth = Math.min(window.innerWidth * 0.9, 900);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = desiredWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render into canvas
    await page.render({ canvasContext: context, viewport }).promise;

    if (!isMounted.current) return;

    // Build the page wrapper DOM
    const wrapper = document.createElement("div");
    wrapper.className = "hhd-page-wrapper";

    const frame = document.createElement("div");
    frame.className = "hhd-canvas-frame";

    // Invisible shield over the canvas blocks right-click on the image itself
    const shield = document.createElement("div");
    shield.className = "hhd-canvas-shield";
    shield.addEventListener("contextmenu", (e) => e.preventDefault());

    // Per-page watermark
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

  // ── Main PDF loading and rendering pipeline ─────────────────────────────────
  const runPipeline = useCallback(async () => {
    // Step 1: Validate token
    if (!validateToken(token)) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    try {
      // Step 2: Load PDF.js library
      const pdfjsLib = await loadPdfJs();

      // Step 3: Fetch the PDF as an ArrayBuffer.
      // Using fetch + ArrayBuffer means the raw URL is never in the browser address bar.
      const response = await fetch(SECURE_PDF_PATH, {
        headers: {
          // Custom header signals this is a viewer request, not a direct download.
          // Your server/CDN can enforce that this header must be present to serve the file.
          "X-HHD-Viewer": "1",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Could not load document (${response.status})`);
      }

      const pdfBuffer = await response.arrayBuffer();
      if (!isMounted.current) return;

      setLoadProgress(100);
      setStatus("rendering");

      // Step 4: Parse the PDF from memory — no URL exposed
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

      // Step 5: Render pages sequentially to avoid memory spikes on large PDFs
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
  }, [token, renderPage]);

  useEffect(() => {
    runPipeline();
  }, [runPipeline]);

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  const renderStatusScreen = () => {
    if (status === "denied") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">🔒</div>
          <div className="hhd-state-title">Access Denied</div>
          <div className="hhd-state-sub">
            This link is invalid or has expired. Please request a new link via our
            WhatsApp channel to view this document.
          </div>
          <div className="hhd-denied-code">ERR_INVALID_SESSION_TOKEN</div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">⚠️</div>
          <div className="hhd-state-title">Could Not Load Document</div>
          <div className="hhd-state-sub">{errorMessage}</div>
          <div className="hhd-denied-code">ERR_LOAD_FAILURE</div>
        </div>
      );
    }

    if (status === "validating") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">🔐</div>
          <div className="hhd-state-title">Verifying Access</div>
          <div className="hhd-state-sub">Authenticating your session token…</div>
          <div className="hhd-progress-bar">
            <div className="hhd-progress-fill" style={{ width: "30%" }} />
          </div>
        </div>
      );
    }

    if (status === "loading") {
      return (
        <div className="hhd-state-screen">
          <div className="hhd-state-icon">📄</div>
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

      {/* Status screens (validating / loading / error / denied) */}
      {!isRenderingOrReady && renderStatusScreen()}

      {/* The scrollable canvas container — visible during rendering and when ready */}
      <div
        className="hhd-canvas-scroll"
        ref={scrollRef}
        style={{ display: isRenderingOrReady ? "flex" : "none", position: "relative" }}
      >
        {/* Rendering overlay — sits on top of pages as they populate */}
        {status === "rendering" && renderStatusScreen()}

        {/* This div receives page canvases injected by renderPage() */}
        <div ref={pagesContainerRef} style={{ display: "contents" }} />
      </div>

      {/* Footer */}
      {status === "ready" && (
        <div className="hhd-footer">
          © {new Date().getFullYear()} Happy Hunter Digital — All Rights Reserved
        </div>
      )}

    </div>
  );
}
